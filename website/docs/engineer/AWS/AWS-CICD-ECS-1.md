---
title: "AWS Workshop: CI/CD for Amazon ECS"
---

:::tip Workshop Links

- AWS Workshop: [CI/CD](https://catalog.us-east-1.prod.workshops.aws/workshops/869f7eee-d3a2-490b-bf9a-ac90a8fb2d36/en-US)

:::

:::note

I am running this from a Cloud9 instance in my staff AWS account.

:::

## Architecural Diagram

This is essentially what we're building.

In the top half, the CICD environment, in the bottom half, the production blue/green deployment.

![architectural diagram](/img/AWS-CICD-ECS-arch1.png)

## Workshop Setup

:::caution IMDSv1 & IMDSv2

If you're not getting any response when doing `curl http://169.254.169.254/latest/meta-data/` it means you're using IMDSv2 and need to do this instead 

```bash
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/
```

Or just export set variable:

```bash
export TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`
```

*Read [more](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html)*.

:::

### Configure Region

```bash
# IMDSv2
export TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`

save_var AWS_REGION $(curl -H "X-aws-ec2-metadata-token: $TOKEN" -s 169.254.169.254/latest/dynamic/instance-identity/document | jq -r .region)
aws configure set default.region ${AWS_REGION}
aws configure get default.region
```

### Download lab

```bash
cd ~/environment
git clone https://github.com/aws-samples/cicd-for-ecs-workshop-code.git
```

### Enable cloudwatch container insights

```bash
cloudbuilderio:~/environment/cicd-for-ecs-workshop-code (main) $ aws ecs put-account-setting-default --name containerInsights --value enabled

{
    "setting": {
        "name": "containerInsights",
        "value": "enabled",
        "principalArn": "arn:aws:iam::REDACTED:root",
        "type": "user"
    }
}
```

check

```bash
cloudbuilderio:~/environment/cicd-for-ecs-workshop-code (main) $ aws ecs list-account-settings --effective-settings --name containerInsights

{
    "settings": [
        {
            "name": "containerInsights",
            "value": "enabled",
            "principalArn": "arn:aws:iam::REDACTED:root",
            "type": "user"
        }
    ]
}
```

## Environment

create necessary Roles:

```bash
cloudbuilderio:~/environment/cicd-for-ecs-workshop-code (main) $ aws iam get-role --role-name "AWSServiceRoleForElasticLoadBalancing" || aws iam create-service-linked-role --aws-service-name "elasticloadbalancing.amazonaws.com"
{
    "Role": {
        "Path": "/aws-service-role/elasticloadbalancing.amazonaws.com/",
        "RoleName": "AWSServiceRoleForElasticLoadBalancing",
        "RoleId": "AROA4EFKKWBQDGYLEDGTV",
        "Arn": "arn:aws:iam::REDACTED:role/aws-service-role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing",
        "CreateDate": "2022-09-07T23:30:20+00:00",
        "AssumeRolePolicyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "elasticloadbalancing.amazonaws.com"
                    },
                    "Action": "sts:AssumeRole"
                }
            ]
        },
        "Description": "Allows ELB to call AWS services on your behalf.",
        "MaxSessionDuration": 3600,
        "RoleLastUsed": {
            "LastUsedDate": "2024-04-22T17:17:58+00:00",
            "Region": "ap-southeast-1"
        }
    }
}
cloudbuilderio:~/environment/cicd-for-ecs-workshop-code (main) $ aws iam get-role --role-name "AWSServiceRoleForECS" || aws iam create-service-linked-role --aws-service-name "ecs.amazonaws.com"
{
    "Role": {
        "Path": "/aws-service-role/ecs.amazonaws.com/",
        "RoleName": "AWSServiceRoleForECS",
        "RoleId": "AROA4EFKKWBQFXYSH3TB6",
        "Arn": "arn:aws:iam::REDACTED:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS",
        "CreateDate": "2022-10-23T08:20:07+00:00",
        "AssumeRolePolicyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "ecs.amazonaws.com"
                    },
                    "Action": "sts:AssumeRole"
                }
            ]
        },
        "Description": "Role to enable Amazon ECS to manage your cluster.",
        "MaxSessionDuration": 3600,
        "RoleLastUsed": {
            "LastUsedDate": "2024-04-23T10:22:22+00:00",
            "Region": "us-east-1"
        }
    }
}
```

### Cloudformation Stacks

```bash
cd ~/environment/cicd-for-ecs-workshop-code/setup
aws cloudformation deploy \
  --stack-name prod-cluster \
  --template-file Cluster-ECS-EC2-2AZ-ALB-1NAT.yaml \
  --parameter-overrides "EnvironmentName=prod" \
  --capabilities CAPABILITY_IAM &
aws cloudformation deploy \
  --stack-name staging-cluster \
  --template-file Cluster-ECS-EC2-2AZ-ALB-1NAT.yaml \
  --parameter-overrides "EnvironmentName=staging" \
  --capabilities CAPABILITY_IAM &  
```

Both stacks failed!

![CFN failed](/img/AWS-CICD-ECS-CF-error1.png)

Check root cause

![CFN failed](/img/AWS-CICD-ECS-CF-error2.png)

Same with prod cluster

![CFN failed](/img/AWS-CICD-ECS-CF-error3.png)

#### Errors

```bash
Received 0 SUCCESS signal(s) out of 1. Unable to satisfy 100% MinSuccessfulInstancesPercent requirement
```

#### Solution

Apparently, according to the Slack at work, we need to edit this section of `~/environment/cicd-for-ecs-workshop-code/setup/Cluster-ECS-EC2-2AZ-1NAT.yaml`:

And remove:

```yaml
    CreationPolicy:
      ResourceSignal:
        Timeout: PT15M
```

from

```yaml
ECSAutoScalingGroup:
    Type: AWS::AutoScaling::AutoScalingGroup
    Properties:
      VPCZoneIdentifier:
        - !Ref PrivateSubnetOne
        - !Ref PrivateSubnetTwo
      LaunchConfigurationName: !Ref 'ContainerInstances'
      MinSize: '1'
      MaxSize: !Ref 'MaxSize'
      DesiredCapacity: !Ref 'DesiredCapacity'
    CreationPolicy:
      ResourceSignal:
        Timeout: PT15M
    UpdatePolicy:
      AutoScalingReplacingUpdate:
        WillReplace: 'true'
  ContainerInstances:
    Type: AWS::AutoScaling::LaunchConfiguration
    Properties:
      ImageId: !Ref 'ECSAMI'
      SecurityGroups: [!Ref 'ContainerSecurityGroup']
      InstanceType: !Ref 'InstanceType'
      IamInstanceProfile: !Ref 'EC2InstanceProfile'
      UserData:
        Fn::Base64: !Sub |
          #!/bin/bash -xe
          echo ECS_CLUSTER=${ECSCluster} >> /etc/ecs/ecs.config
          yum install -y aws-cfn-bootstrap
          /opt/aws/bin/cfn-signal -e $? --stack ${AWS::StackName} --resource ECSAutoScalingGroup --region ${AWS::Region}
  EC2InstanceProfile:
    Type: AWS::IAM::InstanceProfile
    Properties:
      Path: /
      Roles: [!Ref 'EC2Role']
```

That didn't fix it, still failed.

Looking closer at the `UserData` section, I can see `/opt/aws/bin/cfn-signal` is clearly trying to send a signal somewhere right? The same signal the failure message is saying its waiting for?

I disabled `--disable-rollback` and reran the staging cloudformation (after deleting the stack).

This time, I found the instance and SSM into it, and found this:

```bash
sh-4.2$ /opt/aws/bin/cfn-signal -e $? --stack staging-cluster --resource ECSAutoScalingGroup --region us-east-1
sh: /opt/aws/bin/cfn-signal: No such file or directory
```

Woops. Looks like the userdata didn't install it!

Install (manually)

```bash
sh-4.2$ yum install -y aws-cfn-bootstrap
Loaded plugins: priorities, update-motd, upgrade-helper
You need to be root to perform this command.
sh-4.2$ sudo yum install -y aws-cfn-bootstrap
Loaded plugins: priorities, update-motd, upgrade-helper
Resolving Dependencies
--> Running transaction check
---> Package aws-cfn-bootstrap.noarch 0:2.0-29.amzn2 will be installed
--> Processing Dependency: python3-daemon for package: aws-cfn-bootstrap-2.0-29.amzn2.noarch
--> Processing Dependency: python3-pystache for package: aws-cfn-bootstrap-2.0-29.amzn2.noarch
```

once installed, test it again:

```bash
Installed:
  aws-cfn-bootstrap.noarch 0:2.0-29.amzn2

Dependency Installed:
  python3-daemon.noarch 0:2.2.3-8.amzn2.0.2            python3-docutils.noarch 0:0.14-1.amzn2.0.2        python3-lockfile.noarch 1:0.11.0-17.amzn2.0.2        python3-pystache.noarch 0:0.5.4-12.amzn2.0.1
  python3-simplejson.x86_64 0:3.2.0-1.amzn2.0.2

Complete!
sh-4.2$ /opt/aws/bin/cfn-signal -e $? --stack staging-cluster --resource ECSAutoScalingGroup --region us-east-1
Could not open /var/log/cfn-init.log for logging.  Using stderr instead.
2024-04-23 12:17:34,546 [DEBUG] CloudFormation client initialized with endpoint https://cloudformation.us-east-1.amazonaws.com
2024-04-23 12:17:34,547 [DEBUG] Signaling resource ECSAutoScalingGroup in stack staging-cluster with unique ID i-03f4af99dcb593711 and status SUCCESS
```

Check Cloudformation:

![CFN success](/img/AWS-CICD-ECS-CF-staging-complete.png)

## Troubleshooting

### Cloud9

running into issues using Cloud9, IMDSv2 issues, sts to get aws cli creds issues.

```bash
cloudbuilderio:~/environment $ save_var AWS_ACCOUNT_ID $(aws sts get-caller-identity --query Account --output text)

Invalid endpoint: https://sts..amazonaws.com
cloudbuilderio:~/environment $ aws s3 ls

Invalid endpoint: https://s3..amazonaws.com
cloudbuilderio:~/environment $ aws 

usage: aws [options] <command> <subcommand> [<subcommand> ...] [parameters]
To see help text, you can run:

  aws help
  aws <command> help
  aws <command> <subcommand> help

aws: error: the following arguments are required: command

cloudbuilderio:~/environment $ aws configure
AWS Access Key ID [****************RRMF]: 
AWS Secret Access Key [****************17Mu]: 
Default region name [us-east-1]: 
Default output format [None]: 
cloudbuilderio:~/environment $ aws s3 ls

Invalid endpoint: https://s3..amazonaws.com
cloudbuilderio:~/environment $ 
```
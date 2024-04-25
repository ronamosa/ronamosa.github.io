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

Woops. Looks like the `UserData` didn't install it!

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

:::tip Fix

In the cloudformation YAML file, e.g. `Cluster-ECS-EC2-2AZ-1NAT.yaml`, you need to add `sudo` to the `yum install -y aws-cfn-bootstrap` command for it to work.

:::

## Code Commit Lab

From Cloud9 check my git is already setup:

```bash
cloudbuilderio:~/environment $ git config --global --list
credential.helper=!aws codecommit credential-helper $@
credential.usehttppath=true
core.editor=nano
```

looks good.

setup name, email

```bash
cloudbuilderio:~/environment/git-test (master) $ git config --global user.name "Ron Amosa"
cloudbuilderio:~/environment/git-test (master) $ git config --global user.email ramxsa@amazon.com
```

### Create AWS Code Commit Repo

```bash
cloudbuilderio:~/environment/git-test (master) $ repo_url=$(aws codecommit create-repository --repository-name git-test --query repositoryMetadata.cloneUrlHttp --output text)
cloudbuilderio:~/environment/git-test (master) $ echo Pushing to $repo_url
Pushing to https://git-codecommit.us-east-1.amazonaws.com/v1/repos/git-test
cloudbuilderio:~/environment/git-test (master) $ git remote add origin $repo_url
cloudbuilderio:~/environment/git-test (master) $ git push -u origin master
Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Writing objects: 100% (3/3), 234 bytes | 234.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
remote: Validating objects: 0%
remote: Validating objects: 100%
To https://git-codecommit.us-east-1.amazonaws.com/v1/repos/git-test
 * [new branch]      master -> master
branch 'master' set up to track 'origin/master'.
cloudbuilderio:~/environment/git-test (master) $ 
```

Check it out on AWS Console.

### Branch Hotfix & Merge

Create a branch, made change to `hello.txt`, commit and send branch, voila.

```bash
cloudbuilderio:~/environment/git-test (master) $ git checkout -b hotfix
Switched to a new branch 'hotfix'
cloudbuilderio:~/environment/git-test (hotfix) $ echo "World" >> hello.txt 
cloudbuilderio:~/environment/git-test (hotfix) $ git commit -a -m "Fixed issue"
[hotfix 37d6c9f] Fixed issue
 1 file changed, 1 insertion(+)
cloudbuilderio:~/environment/git-test (hotfix) $ git push -u origin hotfix
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Writing objects: 100% (3/3), 254 bytes | 254.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
remote: Validating objects: 100%
To https://git-codecommit.us-east-1.amazonaws.com/v1/repos/git-test
 * [new branch]      hotfix -> hotfix
branch 'hotfix' set up to track 'origin/hotfix'.
cloudbuilderio:~/environment/git-test (hotfix) $ 
```

Now merge main

```bash
cloudbuilderio:~/environment/git-test (hotfix) $ git checkout master
Switched to branch 'master'
Your branch is up to date with 'origin/master'.
cloudbuilderio:~/environment/git-test (master) $ git merge hotfix
Updating 24c132b..37d6c9f
Fast-forward
 hello.txt | 1 +
 1 file changed, 1 insertion(+)
cloudbuilderio:~/environment/git-test (master) $ git push origin master
Total 0 (delta 0), reused 0 (delta 0), pack-reused 0
To https://git-codecommit.us-east-1.amazonaws.com/v1/repos/git-test
   24c132b..37d6c9f  master -> master
cloudbuilderio:~/environment/git-test (master) $ 
```

✅ Done.

### Clean Up

```bash
cloudbuilderio:~/environment/git-test (master) $ aws codecommit delete-repository --repository-name git-test
{
    "repositoryId": "da2bec73-702f-4fc4-ac15-9eca295514c0"
}
cloudbuilderio:~/environment/git-test (master) $ cd ~/environment
cloudbuilderio:~/environment $ rm -rf git-test
cloudbuilderio:~/environment $ ll
total 20
-rw-r--r--. 1 ec2-user ec2-user   569 Apr  2 09:56 README.md
drwxr-xr-x. 9 ec2-user ec2-user 16384 Apr 23 05:57 cicd-for-ecs-workshop-code
cloudbuilderio:~/environment $ 
```

clean up is clean. double check `aws codecommit list-repositories | grep git-test` returns nada.

## Troubleshooting

### Cloudformation UserData

the userdata script is not running correctly to setup the `cfn-signal` app to signal the cluster it's all good, which is causing a rollback.

```bash
h-4.2$ cd /var/lib/cloud/instance/scripts/
sh-4.2$ ls -al
total 4
drwxr-xr-x 2 root root  22 Apr 24 05:31 .
drwxr-xr-x 5 root root 218 Apr 24 05:32 ..
-rwx------ 1 root root 304 Apr 24 05:31 part-001
sh-4.2$ cat part-001
cat: part-001: Permission denied
sh-4.2$ sudo cat part-001
#!/bin/bash -xe
echo ECS_CLUSTER=prod >> /etc/ecs/ecs.config
sudo yum install -y aws-cfn-bootstrap
sudo yum install -y amazon-ssm-agent
systemctl enable amazon-ssm-agent
systemctl start amazon-ssm-agent
/opt/aws/bin/cfn-signal -e $? --stack prod-cluster --resource ECSAutoScalingGroup --region us-east-1
sh-4.2$
```

during a subsequent re-deploy, I ssm into the EC2 instance and check the logfile:

```bash
loud-init v. 19.3-46.amzn2.0.1 running 'modules:config' at Wed, 24 Apr 2024 08:48:57 +0000. Up 7.61 seconds.
Loaded plugins: priorities, update-motd, upgrade-helper


 One of the configured repositories failed (Unknown),
 and yum doesn't have enough cached data to continue. At this point the only
 safe thing yum can do is fail. There are a few ways to work "fix" this:

     1. Contact the upstream for the repository and get them to fix the problem.

     2. Reconfigure the baseurl/etc. for the repository, to point to a working
        upstream. This is most often useful if you are using a newer
        distribution release than is supported by the repository (and the
        packages for the previous distribution release still work).

     3. Run the command with the repository temporarily disabled
            yum --disablerepo=<repoid> ...

     4. Disable the repository permanently, so yum won't use it by default. Yum
        will then just ignore the repository until you permanently enable it
        again or use --enablerepo for temporary usage:

            yum-config-manager --disable <repoid>
        or
            subscription-manager repos --disable=<repoid>

     5. Configure the failing repository to be skipped, if it is unavailable.
        Note that yum will try to contact the repo. when it runs most commands,
        so will have to try and fail each time (and thus. yum will be be much
        slower). If it is a very temporary problem though, this is often a nice
        compromise:

            yum-config-manager --save --setopt=<repoid>.skip_if_unavailable=true

Cannot find a valid baseurl for repo: amzn2-core/2/x86_64
Could not retrieve mirrorlist https://amazonlinux-2-repos-us-east-1.s3.dualstack.us-east-1.amazonaws.com/2/core/latest/x86_64/mirror.list error was
12: Timeout on https://amazonlinux-2-repos-us-east-1.s3.dualstack.us-east-1.amazonaws.com/2/core/latest/x86_64/mirror.list: (28, 'Connection timeout after 5000 ms')
Apr 24 08:49:33 cloud-init[3185]: util.py[WARNING]: Package upgrade failed
Apr 24 08:49:33 cloud-init[3185]: cc_package_update_upgrade_install.py[WARNING]: 1 failed with exceptions, re-raising the last one
Apr 24 08:49:33 cloud-init[3185]: util.py[WARNING]: Running module package-update-upgrade-install (<module 'cloudinit.config.cc_package_update_upgrade_install' from '/usr/lib/python2.7/site-packages/cloudinit/config/cc_package_update_upgrade_install.pyc'>) failed
Cloud-init v. 19.3-46.amzn2.0.1 running 'modules:final' at Wed, 24 Apr 2024 08:49:34 +0000. Up 43.89 seconds.
+ echo ECS_CLUSTER=prod
+ sudo yum install -y aws-cfn-bootstrap
Loaded plugins: priorities, update-motd, upgrade-helper
```

I see this error, so it's having trouble with the `yum` command, but what exactly it is can be a little deceptive because it says `Cannot find a valid baseurl for repo: amzn2-core/2/x86_64` which could be interpreted as it's a non-existant URL repo...

OR, you read:

```bash
Timeout on https://amazonlinux-2-repos-us-east-1.s3.dualstack.us-east-1.amazonaws.com/2/core/latest/x86_64/mirror.list: (28, 'Connection timeout after 5000 ms')
```

And think "it's the network" i.e. the `yum` command is blocked from reaching the internet, or the internet is not available at the time of command running.

:::tip Solution

Add the following line to the `UserData` script to have the script wait until the network request is valid, and then proceed with the `yum` commands.

```bash
#!/bin/bash
# Wait for network availability
while ! curl -s --max-time 2 https://www.google.com > /dev/null; do
  echo 'Waiting for network connection...'
  sleep 2
done
# Proceed with yum update
yum update -y
```

_*Credit to ChatGPT for suggesting this as the approach to the error message._

:::

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
---
title: "AWS Workshop ECS Cats and Dogs"
---

:::tip Workshop Links

- ECS Workshop: [ECS Cats and Dogs](https://catalog.us-east-1.prod.workshops.aws/workshops/8c9036a7-7564-434c-b558-3588754e21f5/en-US)

:::

## Workshop Type

There are TWO options for the instructions:

1. AWS Event ~ you're participating in an immersion day etc
2. Own account ~ you're going lone wolf in your own account.

## Create an IAM User with AdministratorAccess

:::caution

Only do this step if you don't have an ADMIN level user available to use.

:::

Only doing this so you're not using the ROOT user account, basically create an `Administrator` user and log in with that.

username = `Administrator`
policy, attach inline = `AdministratorAccess`

You will use this Role in the next section, but if you already have a user that has Admin access, just use that one and don't mess around with this extra admin user. It makes things more confusing.

## Stack Deployment

This workshop is designed to work in these regions:

- us-east-1 (N.Virginia)
- us-east-2 (Ohio)
- us-west-2 (Oregon)
- eu-west-1 (Ireland)
- eu-west-3 (Paris)
- ap-northeast-1 (Tokyo)
- ap-northeast-2 (Seoul)
- ap-south-1 (Mumbai)

A copy of `ecs-demogo.yaml` is in the Appendix section for reference.

### IAM Role

The instructions here are pretty shit. Which Role are they referring to?

```text
Enter ecs-demogo as the Stack name, leave the default values for other fields but enter the IAM role in OwnerArn with the role which can be assumed to access the AWS Cloud9 IDE.
```

The Answer: They are referring to the Admin user you currently using, or have created.

But! you need this format: `arn:aws:iam::ACCOUNTID:user/ADMINUSER`

:::caution

The format in AWS docs needs to be updated, the `arn:aws:sts:ACCOUNTID:assumed-role/Admin/ADMINUSER` format is not working for me. I tried serveal IAM Admin roles with this format and either the Cloud9 IDE didn't recognise my access, or the cloudformation hung and failed to create.

This format finally worked for me: `arn:aws:iam::ACCOUNTID:user/ADMINUSER`

:::

## Create ECR x 3

We want an ECR for cats, dogs, web

```bash
export AWS_ACCOUNT_ID=830XXXXXX771
export AWS_REGION=us-east-1

aws ecr create-repository \
--repository-name cats \
--image-scanning-configuration scanOnPush=true \
--region ${AWS_REGION}

aws ecr create-repository \
--repository-name dogs \
--image-scanning-configuration scanOnPush=true \
--region ${AWS_REGION}

aws ecr create-repository \
--repository-name web \
--image-scanning-configuration scanOnPush=true \
--region ${AWS_REGION}
```

## Docker build

Go into each dir: `ecsworkshop/$name` and run `docker build -t $name .` where `name=cats|dogs|web`

```bash
user:~/environment/ecsworkshop/cats $ docker build -t cats .
Sending build context to Docker daemon   5.12kB
Step 1/6 : FROM public.ecr.aws/nginx/nginx:latest
latest: Pulling from nginx/nginx
8a1e25ce7c4f: Pull complete 
e78b137be355: Pull complete 
39fc875bd2b2: Pull complete 
035788421403: Pull complete 
87c3fb37cbf2: Pull complete 
c5cdd1ce752d: Pull complete 
33952c599532: Pull complete 
Digest: sha256:7e909dd89927167110bb7325be08affb2f838b809da86ed47b5d7d90c0319d7d
Status: Downloaded newer image for public.ecr.aws/nginx/nginx:latest
```

### Docker login ECR

```bash
# set env vars
export AWS_ACCOUNT_ID=830XXXXXX771
export AWS_REGION=us-east-1

# docker login
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
WARNING! Your password will be stored unencrypted in /home/ec2-user/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

### Docker Tag & Push

For each container image- cats, dogs, web- tag with `image:latest` --> `ECR.amazonaws.com/image:latest`, and then `docker push`

```bash
# example cats container image
user:~/environment/ecsworkshop/cats $ docker tag cats:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cats:latest
user:~/environment/ecsworkshop/cats $ docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cats:latest
The push refers to repository [830XXXXXX771.dkr.ecr.us-east-1.amazonaws.com/cats]
12c5e4098b11: Pushed 
a2dbe6b10df4: Pushed 
146ff8002d8b: Pushed 
fd31601f0be4: Pushed 
93b4c8c4ac05: Pushed 
b7df9f234b50: Pushed 
ab75a0b61bd1: Pushed 
c1b1bf2f95dc: Pushed 
4d99aab1eed4: Pushed 
a483da8ab3e9: Pushed 
latest: digest: sha256:b071d6ba52dacc1b43b4c3afa2a8cec67190124fe4b3d5983869671797b3a5bc size: 2404
```

## ECS Create a Cluster

Create an ECS Cluster where we're going to deploy our container images.

Specs

- Type: `EC2`
- OS: `Amazon Linux 2`
- Instance: `m5.large`
- ASG: `On-demand`

Setup your Compute:

![infra](/img/ecsworkshop-cluster1.png)

Setup your Network (get rid of public subnetsz)

![network](/img/ecsworkshop-cluster2.png)

## Task Definitions

Console:

You have two options

1. New Task
2. New Task with JSON

We choose option 1

### Specs

- Type: `Amazon EC2 instances` (unchbeck `AWS Fargate`)
- OS: `Linux\X86_64`
- Network: `bridge` mode
- CPU: `0.5 vCPU`
- Memory: `1 GB`
- Task execution role: `Create new role`

Infrastructure

![infra](/img/ecsworkshop-infra.png)

Container

![container](/img/ecsworkshop-container.png)

Logs

![logs](/img/ecsworkshop-logs.png)

Option 2: New task with JSON.

```json
{
    "taskDefinitionArn": "arn:aws:ecs:us-east-1:830XXXXXX771:task-definition/catsdef:1",
    "containerDefinitions": [
        {
            "name": "cats",
            "image": "830XXXXXX771.dkr.ecr.us-east-1.amazonaws.com/cats:latest",
            "cpu": 0,
            "portMappings": [
                {
                    "name": "cats-80-tcp",
                    "containerPort": 80,
                    "hostPort": 0,
                    "protocol": "tcp",
                    "appProtocol": "http"
                }
            ],
            "essential": true,
            "environment": [],
            "environmentFiles": [],
            "mountPoints": [],
            "volumesFrom": [],
            "ulimits": [],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-create-group": "true",
                    "awslogs-group": "/ecs/catsdef",
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "ecs"
                },
                "secretOptions": []
            },
            "systemControls": []
        }
    ],
    "family": "catsdef",
    "executionRoleArn": "arn:aws:iam::830XXXXXX771:role/ecsTaskExecutionRole",
    "networkMode": "bridge",
    "revision": 1,
    "volumes": [],
    "status": "ACTIVE",
    "requiresAttributes": [
        {
            "name": "com.amazonaws.ecs.capability.logging-driver.awslogs"
        },
        {
            "name": "ecs.capability.execution-role-awslogs"
        },
        {
            "name": "com.amazonaws.ecs.capability.ecr-auth"
        },
        {
            "name": "com.amazonaws.ecs.capability.docker-remote-api.1.19"
        },
        {
            "name": "ecs.capability.execution-role-ecr-pull"
        },
        {
            "name": "com.amazonaws.ecs.capability.docker-remote-api.1.18"
        },
        {
            "name": "com.amazonaws.ecs.capability.docker-remote-api.1.29"
        }
    ],
    "placementConstraints": [],
    "compatibilities": [
        "EC2"
    ],
    "requiresCompatibilities": [
        "EC2"
    ],
    "cpu": "512",
    "memory": "1024",
    "runtimePlatform": {
        "cpuArchitecture": "X86_64",
        "operatingSystemFamily": "LINUX"
    },
    "registeredAt": "2024-03-18T08:12:39.817Z",
    "registeredBy": "arn:aws:iam::830XXXXXX771:user/myuser",
    "tags": []
}
```














## Appendix

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'DemoGo-ECS200 Prerequisite - Network CloudFormation Template'

Parameters:
  Cloud9IDEInstanceType:
    Description: The type of instance to connect to the environment
    Type: String
    Default: t3.large
    AllowedValues:
      - t3.medium
      - t3.large
      - t3.xlarge

  Cloud9EnvironmentName:
    Description: How the name appears in the console
    Type: String
    Default: ecsworkshop

  AssetsBucketName:
    Description: Workshop Studio assets bucket name
    Type: String

  AssetsBucketPrefix:
    Description: Workshop Studio assets bucket prefix
    Type: String

  WorkstationRoleName:
    Description: Workshop Studio participant role arn
    Type: String
    Default: ecsworkshop-admin

  C9EnvType:
    Description: Environment type.
    Default: 3rdParty
    Type: String
    AllowedValues:
      - 3rdParty
      - aws-event
    ConstraintDescription: must specify aws-event or 3rdParty.

  OwnerArn:
    Type: String
    Description: The Arn of the Cloud9 Owner to be set if 3rdParty deployment.
    Default: ''

Mappings:
  CidrMappings:
    private-subnet-1: {CIDR: 10.0.3.0/24}
    private-subnet-2: {CIDR: 10.0.4.0/24}
    public-subnet-1: {CIDR: 10.0.1.0/24}
    public-subnet-2: {CIDR: 10.0.2.0/24}
    vpc: {CIDR: 10.0.0.0/16}
  DomainNameMappings:
    eu-west-1: {Domain: eu-west-1.compute.internal}
    eu-west-3: {Domain: eu-west-3.compute.internal}
    us-east-1: {Domain: ec2.internal}
    us-east-2: {Domain: us-east-2.compute.internal}
    us-west-2: {Domain: us-west-2.compute.internal}
    ap-northeast-1: {Domain: ap-northeast-1.compute.internal}
    ap-northeast-2: {Domain: ap-northeast-2.compute.internal}

Metadata:
  AWS::CloudFormation::Interface:
    ParameterGroups:
      - Label:
          default: 'Cloud9 Configuration'
        Parameters:
          - Cloud9EnvironmentName
          - Cloud9IDEInstanceType
          - AssetsBucketName
          - AssetsBucketPrefix
          - WorkstationRoleName
          - C9EnvType
          - OwnerArn

Conditions:
  Create3rdPartyResources: !Equals [!Ref C9EnvType, 3rdParty]
  CreateAWSEventResources: !Equals [!Ref C9EnvType, aws-event]

Resources:
  AttachGateway:
    DependsOn: [VPC, InternetGateway]
    Properties:
      InternetGatewayId: {Ref: InternetGateway}
      VpcId: {Ref: VPC}
    Type: AWS::EC2::VPCGatewayAttachment
  DHCPOptions:
    Properties:
      DomainName:
        Fn::FindInMap:
          - DomainNameMappings
          - {Ref: 'AWS::Region'}
          - Domain
      DomainNameServers: [AmazonProvidedDNS]
    Type: AWS::EC2::DHCPOptions
  EIP:
    Properties: {Domain: vpc}
    Type: AWS::EC2::EIP
  InternetGateway: {DependsOn: VPC, Type: 'AWS::EC2::InternetGateway'}
  NAT:
    DependsOn: AttachGateway
    Properties:
      AllocationId:
        Fn::GetAtt: [EIP, AllocationId]
      SubnetId: {Ref: PublicSubnet1}
    Type: AWS::EC2::NatGateway
  PrivateRoute:
    DependsOn: [PrivateRouteTable, NAT]
    Properties:
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId: {Ref: NAT}
      RouteTableId: {Ref: PrivateRouteTable}
    Type: AWS::EC2::Route
  PrivateRouteTable:
    DependsOn: [VPC, AttachGateway]
    Properties:
      Tags:
        - {Key: Name, Value: PrivateRouteTable}
      VpcId: {Ref: VPC}
    Type: AWS::EC2::RouteTable
  PrivateSubnet1:
    DependsOn: AttachGateway
    Properties:
      AvailabilityZone:
        Fn::Select:
          - '0'
          - {'Fn::GetAZs': ''}
      CidrBlock:
        Fn::FindInMap: [CidrMappings, private-subnet-1, CIDR]
      Tags:
        - {Key: Name, Value: PrivateSubnet1}
      VpcId: {Ref: VPC}
    Type: AWS::EC2::Subnet
  PrivateSubnet1RouteTableAssociation:
    DependsOn: [PrivateRouteTable, PrivateSubnet1]
    Properties:
      RouteTableId: {Ref: PrivateRouteTable}
      SubnetId: {Ref: PrivateSubnet1}
    Type: AWS::EC2::SubnetRouteTableAssociation
  PrivateSubnet2:
    DependsOn: AttachGateway
    Properties:
      AvailabilityZone:
        Fn::Select:
          - '1'
          - {'Fn::GetAZs': ''}
      CidrBlock:
        Fn::FindInMap: [CidrMappings, private-subnet-2, CIDR]
      Tags:
        - {Key: Name, Value: PrivateSubnet2}
      VpcId: {Ref: VPC}
    Type: AWS::EC2::Subnet
  PrivateSubnet2RouteTableAssociation:
    DependsOn: [PrivateRouteTable, PrivateSubnet2]
    Properties:
      RouteTableId: {Ref: PrivateRouteTable}
      SubnetId: {Ref: PrivateSubnet2}
    Type: AWS::EC2::SubnetRouteTableAssociation
  PublicRoute:
    DependsOn: [PublicRouteTable, AttachGateway]
    Properties:
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: {Ref: InternetGateway}
      RouteTableId: {Ref: PublicRouteTable}
    Type: AWS::EC2::Route
  PublicRouteTable:
    DependsOn: [VPC, AttachGateway]
    Properties:
      Tags:
        - {Key: Name, Value: PublicRouteTable}
      VpcId: {Ref: VPC}
    Type: AWS::EC2::RouteTable
  PublicSubnet1:
    DependsOn: AttachGateway
    Properties:
      AvailabilityZone:
        Fn::Select:
          - '0'
          - {'Fn::GetAZs': ''}
      CidrBlock:
        Fn::FindInMap: [CidrMappings, public-subnet-1, CIDR]
      Tags:
        - {Key: Name, Value: PublicSubnet1}
      VpcId: {Ref: VPC}
    Type: AWS::EC2::Subnet
  PublicSubnet1RouteTableAssociation:
    DependsOn: [PublicRouteTable, PublicSubnet1, AttachGateway]
    Properties:
      RouteTableId: {Ref: PublicRouteTable}
      SubnetId: {Ref: PublicSubnet1}
    Type: AWS::EC2::SubnetRouteTableAssociation
  PublicSubnet2:
    DependsOn: AttachGateway
    Properties:
      AvailabilityZone:
        Fn::Select:
          - '1'
          - {'Fn::GetAZs': ''}
      CidrBlock:
        Fn::FindInMap: [CidrMappings, public-subnet-2, CIDR]
      Tags:
        - {Key: Name, Value: PublicSubnet2}
      VpcId: {Ref: VPC}
    Type: AWS::EC2::Subnet
  PublicSubnet2RouteTableAssociation:
    DependsOn: [PublicRouteTable, PublicSubnet2, AttachGateway]
    Properties:
      RouteTableId: {Ref: PublicRouteTable}
      SubnetId: {Ref: PublicSubnet2}
    Type: AWS::EC2::SubnetRouteTableAssociation
  VPC:
    Properties:
      CidrBlock:
        Fn::FindInMap: [CidrMappings, vpc, CIDR]
      EnableDnsHostnames: 'true'
      EnableDnsSupport: 'true'
      Tags:
        - {Key: Name, Value: DemoGoECSVPC}
    Type: AWS::EC2::VPC
  VPCDHCPOptionsAssociation:
    Properties:
      DhcpOptionsId: {Ref: DHCPOptions}
      VpcId: {Ref: VPC}
    Type: AWS::EC2::VPCDHCPOptionsAssociation

  WorkstationSG:
    Type: 'AWS::EC2::SecurityGroup'
    Properties:
      GroupName: Workstation to Push images
      GroupDescription: EC2 SecurityGroup
      VpcId: {Ref: VPC}
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: '22'
          ToPort: '22'
          CidrIp: '0.0.0.0/0'
  ALBSG:
    Type: 'AWS::EC2::SecurityGroup'
    Properties:
      GroupDescription: Enable HTTP to the load balancer
      VpcId: {Ref: VPC}
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: '80'
          ToPort: '80'
          CidrIp: '0.0.0.0/0'

  ECSInstanceSG:
    Type: 'AWS::EC2::SecurityGroup'
    Properties:
      GroupDescription: Enable access to container instances, from the load balancer only
      VpcId: {Ref: VPC}
      SecurityGroupIngress:
        - SourceSecurityGroupId: {Ref: ALBSG}
          IpProtocol: tcp
          FromPort: '0'
          ToPort: '65535'

  WorkstationRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: !Ref WorkstationRoleName
      Path: '/'
      ManagedPolicyArns:
        - 'arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess'
        - 'arn:aws:iam::aws:policy/AmazonS3FullAccess'
        - 'arn:aws:iam::aws:policy/AdministratorAccess'
        - 'arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore'
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service:
                - ec2.amazonaws.com
                - codebuild.amazonaws.com
                - ssm.amazonaws.com
            Action:
              - sts:AssumeRole
      # Policies:
      #   - PolicyName:
      #       Fn::Join:
      #         - ''
      #         - - C9InstanceDenyPolicy-
      #           - Ref: AWS::Region
      #     PolicyDocument:
      #       Version: '2012-10-17'
      #       Statement:
      #         - Effect: Deny
      #           Action:
      #             - cloud9:UpdateEnvironment
      #           Resource: '*'

  WorkstationProfile:
    Type: AWS::IAM::InstanceProfile
    DependsOn: [WorkstationRole]
    Properties:
      InstanceProfileName: !Ref WorkstationRoleName
      Path: '/'
      Roles:
        - Ref: WorkstationRole

  cloud9Environment:
    Type: AWS::Cloud9::EnvironmentEC2
    Properties:
      Name: !Ref Cloud9EnvironmentName
      AutomaticStopTimeMinutes: 900
      SubnetId: {Ref: PublicSubnet1}
      OwnerArn:
        !If [
          Create3rdPartyResources,
          !Ref OwnerArn,
          !If [
            CreateAWSEventResources,
            !Join ['', ['arn:aws:iam::', !Ref 'AWS::AccountId', ':assumed-role/WSParticipantRole/Participant']],
            !Ref 'AWS::NoValue',
          ],
        ]
      #!Sub arn:aws:sts::${AWS::AccountId}:assumed-role/WSParticipantRole/Participant
      #OwnerArn: !Ref ParticipantRoleArn
      Description: Use this to work with ECS cats & dogs workshop
      InstanceType: !Ref Cloud9IDEInstanceType
      ImageId: resolve:ssm:/aws/service/cloud9/amis/amazonlinux-2-x86_64
      #The repo is sync from s3 bucket by the SSM document
      # Repositories:
      #   - RepositoryUrl: https://github.com/allamand/ecs-cats-and-dogs
      #     PathComponent: ecsworkshop
      Tags:
        - Key: SSMBootstrapECS
          Value: Active
        - Key: Environment
          Value: !Sub ${Cloud9EnvironmentName}

  C9LambdaExecutionRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service:
                - lambda.amazonaws.com
            Action:
              - sts:AssumeRole
      Path: '/'
      ManagedPolicyArns:
        - 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
      Policies:
        - PolicyName:
            Fn::Join:
              - ''
              - - C9LambdaPolicy-
                - Ref: AWS::Region
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - cloudformation:DescribeStacks
                  - cloudformation:DescribeStackEvents
                  - cloudformation:DescribeStackResource
                  - cloudformation:DescribeStackResources
                Resource: !Sub 'arn:aws:cloudformation:${AWS::Region}:${AWS::AccountId}:stack/*'
              - Effect: Allow
                Action:
                  - ec2:AssociateIamInstanceProfile
                  - ec2:ModifyInstanceAttribute
                  - ec2:ReplaceIamInstanceProfileAssociation
                Resource: !Sub 'arn:aws:ec2:${AWS::Region}:${AWS::AccountId}:instance/*'
              - Effect: Allow
                Action:
                  - ec2:DescribeInstances
                  - ec2:DescribeVolumes
                  - ec2:DescribeIamInstanceProfileAssociations
                Resource: '*'
              - Effect: Allow
                Action:
                  - ec2:ModifyVolume
                Resource: !Sub 'arn:aws:ec2:${AWS::Region}:${AWS::AccountId}:volume/*'
              - Effect: Allow
                Action:
                  - iam:ListInstanceProfiles
                Resource: !Sub arn:aws:iam::${AWS::AccountId}:instance-profile/*
              - Effect: Allow
                Action:
                  - iam:PassRole
                Resource:
                  Fn::GetAtt:
                    - WorkstationRole
                    - Arn
  C9BootstrapInstanceLambda:
    Type: Custom::C9BootstrapInstanceLambda
    DependsOn:
      - C9LambdaExecutionRole
      - cloud9Environment
    Properties:
      Tags:
        - Key: Environment
          Value: !Sub ${Cloud9EnvironmentName}
      ServiceToken:
        Fn::GetAtt:
          - C9BootstrapInstanceLambdaFunction
          - Arn
      REGION:
        Ref: AWS::Region
      StackName:
        Ref: AWS::StackName
      EnvironmentId:
        Ref: cloud9Environment
      LabIdeInstanceProfileName:
        Ref: WorkstationProfile
      LabIdeInstanceProfileArn:
        Fn::GetAtt:
          - WorkstationProfile
          - Arn

  C9BootstrapInstanceLambdaFunction:
    Type: AWS::Lambda::Function
    DependsOn: cloud9Environment
    Properties:
      Tags:
        - Key: Environment
          Value: AWS Example
      Handler: index.lambda_handler
      Role:
        Fn::GetAtt:
          - C9LambdaExecutionRole
          - Arn
      Runtime: python3.9
      MemorySize: 256
      Timeout: 600
      TracingConfig:
        Mode: Active
      Code:
        ZipFile: !Sub |
          from __future__ import print_function
          import boto3
          import json
          import os
          import time
          import traceback
          import cfnresponse
          import logging

          logger = logging.getLogger()
          logger.setLevel(logging.INFO)

          def lambda_handler(event, context):
              logger.info('event: {}'.format(event))
              logger.info('context: {}'.format(context))
              responseData = {}

              status = cfnresponse.SUCCESS
              
              if event['RequestType'] == 'Delete':
                  responseData = {'Success': 'Custom Resource removed'}
                  cfnresponse.send(event, context, status, responseData, 'CustomResourcePhysicalID')              

              if event['RequestType'] == 'Create':
                  try:
                      # Open AWS clients
                      ec2 = boto3.client('ec2')

                      # Get the InstanceId of the Cloud9 IDE
                      instance = ec2.describe_instances(Filters=[{'Name': 'tag:SSMBootstrapECS', 'Values': ['Active']},{'Name': 'tag:Environment', 'Values': ['${Cloud9EnvironmentName}']}])['Reservations'][0]['Instances'][0]
                      logger.info('instance: {}'.format(instance))

                      # Create the IamInstanceProfile request object
                      iam_instance_profile = {
                          'Arn': event['ResourceProperties']['LabIdeInstanceProfileArn'],
                          'Name': event['ResourceProperties']['LabIdeInstanceProfileName']
                      }
                      logger.info('iam_instance_profile: {}'.format(iam_instance_profile))

                      # Wait for Instance to become ready before adding Role
                      instance_state = instance['State']['Name']
                      logger.info('instance_state: {}'.format(instance_state))
                      while instance_state != 'running':
                          time.sleep(5)
                          instance_state = ec2.describe_instances(InstanceIds=[instance['InstanceId']])
                          logger.info('instance_state: {}'.format(instance_state))

                      # attach instance profile
                      response = ec2.associate_iam_instance_profile(IamInstanceProfile=iam_instance_profile, InstanceId=instance['InstanceId'])
                      logger.info('response - associate_iam_instance_profile: {}'.format(response))
                      r_ec2 = boto3.resource('ec2')

                      responseData = {'Success': 'Started bootstrapping for instance: '+instance['InstanceId']}
                      cfnresponse.send(event, context, status, responseData, 'CustomResourcePhysicalID')
                      
                  except Exception as e:
                      status = cfnresponse.FAILED
                      print(traceback.format_exc())
                      responseData = {'Error': traceback.format_exc(e)}
                  finally:
                      cfnresponse.send(event, context, status, responseData, 'CustomResourcePhysicalID')

  ################## SSM BOOTSRAP HANDLER ###############
  C9OutputBucket:
    Type: AWS::S3::Bucket
    DeletionPolicy: Retain
    Properties:
      AccessControl: Private
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true

  C9OutputBucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: !Ref C9OutputBucket
      PolicyDocument:
        Version: 2012-10-17
        Statement:
          - Action:
              - 's3:GetObject'
              - 's3:PutObject'
              - 's3:PutObjectAcl'
            Effect: Allow
            Resource: !Join
              - ''
              - - 'arn:aws:s3:::'
                - !Ref C9OutputBucket
                - /*
            Principal:
              AWS:
                Fn::GetAtt:
                  - C9LambdaExecutionRole
                  - Arn
  C9SSMDocument:
    Type: AWS::SSM::Document
    Properties:
      Tags:
        - Key: Environment
          Value: !Sub ${Cloud9EnvironmentName}
      DocumentType: Command
      Content:
        schemaVersion: '2.2'
        description: Bootstrap Cloud9 Instance
        mainSteps:
          - action: aws:runShellScript
            name: C9bootstrap
            inputs:
              runCommand:
                - '#!/bin/bash'
                - date
                - echo LANG=en_US.utf-8 >> /etc/environment
                - echo LC_ALL=en_US.UTF-8 >> /etc/environment
                - . /home/ec2-user/.bashrc
                - echo '=== UPDATE system packages and INSTALL dependencies ==='
                - yum update -y; yum install -y vim git jq bash-completion moreutils gettext yum-utils perl-Digest-SHA tree
                - echo '=== ENABLE Amazon Extras EPEL Repository and INSTALL Git LFS ==='
                - yum install -y amazon-linux-extras
                - amazon-linux-extras install epel -y
                - yum install -y git-lfs
                - echo '=== INSTALL AWS CLI v2 ==='
                - curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip'
                - unzip awscliv2.zip -d /tmp
                - /tmp/aws/install --update
                - rm -rf aws awscliv2.zip
                - echo '=== INSTALL Kubernetes CLI ==='
                - curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
                - chmod +x kubectl && mv kubectl /usr/local/bin/
                - /usr/local/bin/kubectl completion bash > /etc/bash_completion.d/kubectl
                - echo '=== INSTALL Helm CLI ==='
                - curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
                - /usr/local/bin/helm completion bash > /etc/bash_completion.d/helm
                - echo '=== INSTALL AWS Copilot ==='
                - curl --silent -Lo copilot https://github.com/aws/copilot-cli/releases/latest/download/copilot-linux && chmod +x copilot && sudo mv copilot /usr/local/bin/copilot && copilot --help
                - echo '=== INSTALL Terraform CLI ==='
                - yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
                - yum -y install terraform
                - echo '=== Configure cats and dogs source code ==='
                - !Sub |
                  mkdir -p /home/ec2-user/environment/ecsworkshop ; 
                  cd /home/ec2-user/environment/ecsworkshop ; 
                  aws s3 sync s3://${AssetsBucketName}/${AssetsBucketPrefix} .
                - chown -R 1000:1000 /home/ec2-user/environment/ecsworkshop ; ls -la
                - echo '=== Installing c9 ==='
                - /home/ec2-user/.nvm/versions/node/v16.20.0/bin/npm install -g c9
                - echo '=== Exporting ENV Vars ==='
                - export AWS_ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)" && echo "export AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID}" >> /home/ec2-user/.bashrc
                - export AWS_REGION="$(curl -s http://169.254.169.254/latest/dynamic/instance-identity/document | grep region | cut -d'"' -f4)" && echo "export AWS_REGION=${AWS_REGION}" >> /home/ec2-user/.bashrc
                - echo "export AWS_DEFAULT_REGION=\$AWS_REGION" >>  /home/ec2-user/.bashrc
                - echo 'aws cloud9 update-environment  --environment-id $C9_PID --managed-credentials-action DISABLE' >> /home/ec2-user/.bashrc
                - echo 'alias ll="ls -la"' >> /home/ec2-user/.bashrc
                - echo "Bootstrap completed with return code $?"
                - shutdown -r +1

  C9BootstrapAssociation:
    Type: AWS::SSM::Association
    Properties:
      Name: !Ref C9SSMDocument
      OutputLocation:
        S3Location:
          OutputS3BucketName: !Ref C9OutputBucket
          OutputS3KeyPrefix: bootstrapoutput
      Targets:
        - Key: tag:SSMBootstrapECS
          Values:
            - Active
        - Key: tag:Environment
          Values:
            - !Sub ${Cloud9EnvironmentName}

Outputs:
  PrivateSubnet1:
    Description: The first private subnet.
    Value: {Ref: PrivateSubnet1}
  PrivateSubnet2:
    Description: The second private subnet.
    Value: {Ref: PrivateSubnet2}
  PublicSubnet1:
    Description: The first public subnet.
    Value: {Ref: PublicSubnet1}
  PublicSubnet2:
    Description: The second public subnet.
    Value: {Ref: PublicSubnet2}
  VPC:
    Description: The VPC Id.
    Value: {Ref: VPC}
  VpcCidr:
    Description: The CIDR block of the VPC.
    Value:
      Fn::FindInMap: [CidrMappings, vpc, CIDR]
  ECSCloud9EnvId:
    Description: ID of the ECS Lab IDE
    Value: !Sub https://${AWS::Region}.console.aws.amazon.com/cloud9/ide/${cloud9Environment}?region=${AWS::Region}
```
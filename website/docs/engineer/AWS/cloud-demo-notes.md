---
title: "TechNesian Live Stream: Cloud Demo Notes"
---

You want to demonstrate creating cloud resources, i.e. 3 x EC2 Web Servers, in 3 x Regions, using 3 x methods.

## Pre-requsites

1. 3 x KeyPairs
   1. `ManualEC2Key`
   2. `CloudFormationEC2Key`
   3. `AWSCLIEC2Key`
2. Pre-launch 1 x WebServer in another Region as a backup

Download the private key & prepare `chmod 0600` on a fresh Ubuntu install for TechNesian "local" work.

## Console

:::info Config
Region: US East (N. Virginia), `us-east-1`

KeyPair: `ManualEC2Key`
:::

Basically doing the Linux EC2 part from [AWS General Immersion Day](https://catalog.workshops.aws/general-immersionday/en-US/basic-modules/10-ec2/ec2-linux/2-ec2):

- Run through lanching an EC2 instance
- include `user-data` script below
- Launch and show it's pending
- Move onto [CloudFormation Section](#cloudformation) while you're waiting

:::danger HTTP! Web Server

the URL for the EC2 is **HTTP** *not* HTTPS!

:::

### user-data script

```bash
#!/bin/sh
​
#Install a LAMP stack
dnf install -y httpd wget php-fpm php-mysqli php-json php php-devel
dnf install -y mariadb105-server
dnf install -y httpd php-mbstring
​
#Start the web server
chkconfig httpd on
systemctl start httpd
​
#Install the web pages for our lab
if [ ! -f /var/www/html/immersion-day-app-php7.zip ]; then
   cd /var/www/html
   wget -O 'immersion-day-app-php7.zip' 'https://static.us-east-1.prod.workshops.aws/public/b8d66c76-0455-4d13-8acd-9002b999b537/assets/immersion-day-app-php7.zip'
   unzip immersion-day-app-php7.zip
fi
​
#Install the AWS SDK for PHP
if [ ! -f /var/www/html/aws.zip ]; then
   cd /var/www/html
   mkdir vendor
   cd vendor
   wget https://docs.aws.amazon.com/aws-sdk-php/v3/download/aws.zip
   unzip aws.zip
fi
​
# Update existing packages
dnf update -y
```

Success looks like this:

![aws webserver](/img/ec2-lab-08.png)

## CloudFormation

:::info Config
Region: Asia Pacific (Singapore), `ap-southeast-1`

KeyPair: `CloudFormationEC2Key`
:::

:::warning Change Region

Remember to Change Region to `ap-southeast-1` before running cloudformation

:::

1. Create Stack
2. Upload file `cloud-demo-cf.yaml`
3. Launch
4. Review the YAML on the stream

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'AWS CloudFormation Template: EC2 instance with user-data script and security groups'

Resources:
  MyEC2Instance:
    Type: 'AWS::EC2::Instance'
    Properties:
      InstanceType: t2.micro # Free tier eligible instance type
      ImageId: !FindInMap [RegionMap, !Ref "AWS::Region", AMI] # Amazon Linux AMI ID
      KeyName: CloudFormationEC2Key # Key pair name
      SecurityGroups:
        - Ref: InstanceSecurityGroup
      UserData:
        Fn::Base64: |
          #!/bin/sh

          #Install a LAMP stack
          dnf install -y httpd wget php-fpm php-mysqli php-json php php-devel
          dnf install -y mariadb105-server
          dnf install -y httpd php-mbstring

          #Start the web server
          chkconfig httpd on
          systemctl start httpd

          #Install the web pages for our lab
          if [ ! -f /var/www/html/immersion-day-app-php7.zip ]; then
            cd /var/www/html
            wget -O 'immersion-day-app-php7.zip' 'https://static.us-east-1.prod.workshops.aws/public/b8d66c76-0455-4d13-8acd-9002b999b537/assets/immersion-day-app-php7.zip'
            unzip immersion-day-app-php7.zip
          fi

          #Install the AWS SDK for PHP
          if [ ! -f /var/www/html/aws.zip ]; then
            cd /var/www/html
            mkdir vendor
            cd vendor
            wget https://docs.aws.amazon.com/aws-sdk-php/v3/download/aws.zip
            unzip aws.zip
          fi

          # Update existing packages
          dnf update -y

  InstanceSecurityGroup:
    Type: 'AWS::EC2::SecurityGroup'
    Properties:
      GroupDescription: Enable SSH and HTTP access
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: '22'
          ToPort: '22'
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: '80'
          ToPort: '80'
          CidrIp: 0.0.0.0/0

Mappings:
  RegionMap:
    ap-southeast-1:
      AMI: ami-02453f5468b897e31 # Amazon Linux 2023 AMI
    us-east-1:
      AMI: ami-0230bd60aa48260c6 # Amazon Linux 2023 AMI
    # Add other regions as needed
```

## CLI

:::info Config
Region: Asia Pacific (Sydney), `ap-southeast-2`

KeyPair: `AWSCLIEC2Key`
:::

### Pre-requisites

1. keypairs downloaded ready
2. aws cli is installed
3. aws cli is configured with necessary access keys
4. user has necessary permissions
5. create security groups in correct region ahead of time

Easy as pie, your cli command is:

```bash
  aws ec2 run-instances \
      --image-id ami-0361bbf2b99f46c1d \
      --count 1 \
      --instance-type t2.micro \
      --key-name AWSCLIEC2Key \
      --security-group-ids sg-079750aa87d66752c \
      --user-data file://./scripts/user-data.sh \
      --region ap-southeast-2
```

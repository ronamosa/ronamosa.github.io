---
title: "AWS Hacking Environment for Class"
---

### Overview

:::tip AI Content

This design and content was generated with the help of `GPT-4o`. As is my workflow, I will do initial ideation, generation of design and code with AI, then manually tweak, test and update notes until working.

:::

This architecture is designed to run multiple instances of Damn Vulnerable Web App (DVWA) and Kali Linux in an AWS private environment. The architecture includes VPC setup, networking rules, and SSH access configurations. It will also enable port forwarding to access DVWA securely.

### Components

1. **VPC and Subnets**
   - Create a VPC with public and private subnets.
   - Public subnets for SSH access and management.
   - Private subnets for hosting DVWA instances.

2. **EC2 Instances**
   - EC2 instances for DVWA (one instance per DVWA).
   - EC2 instances for Kali Linux (multiple users can log in to their containers).

3. **Security Groups**
   - Security groups to manage inbound and outbound traffic.
   - Allow SSH access from the internet to Kali Linux instances.
   - Allow internal communication between Kali Linux and DVWA instances.

4. **NAT Gateway**
   - For internet access from private subnets.

5. **Bastion Host**
   - A bastion host in the public subnet to facilitate SSH access to instances in private subnets.

6. **Docker Containers**
   - Use Docker to run multiple instances of DVWA and Kali Linux.

### Architecture Diagram

```plaintext
   +-------------------------+                       +-------------------------+
   |        Internet         |                       |        Internet         |
   +-----------+-------------+                       +-----------+-------------+
               |                                         |
               |                                         |
   +-----------v-------------+                       +---v---------------------+
   |    Bastion Host (EC2)   |                       |    EC2 Instances (Kali  |
   |        Public Subnet    |                       |        Linux)           |
   +-----------+-------------+                       |  Docker containers for  |
               |                                     |  multi-user access      |
               |                                     |  Public Subnet          |
   +-----------v-------------+                       +-----------+-------------+
   |    EC2 Instances (DVWA) |                       |                       |
   |       Private Subnet    |                       |                       |
   +-------------------------+                       +-----------------------+
```

### Step-by-Step Deployment

#### 1. VPC and Subnets Configuration

1. Create a VPC.
2. Create two subnets: one public and one private.
3. Configure a route table:
   - Public subnet route table: Route internet traffic to the internet gateway.
   - Private subnet route table: Route traffic to the NAT Gateway.

#### 2. Security Groups

1. Create a security group for the Bastion Host:
   - Allow inbound SSH (port 22) from the internet.
2. Create a security group for the DVWA instances:
   - Allow inbound HTTP (port 80) from the private subnet.
   - Allow inbound SSH from the Bastion Host security group.
3. Create a security group for Kali Linux instances:
   - Allow inbound SSH (port 22) from the internet.
   - Allow internal traffic between Kali instances and DVWA instances.

#### 3. EC2 Instances and Bastion Host

1. Launch an EC2 instance as a Bastion Host in the public subnet.
2. Launch multiple EC2 instances for DVWA in the private subnet.
3. Launch an EC2 instance for Kali Linux in the public subnet and configure Docker to run multiple containers.

#### 4. Docker Configuration on Kali Linux EC2

1. Install Docker on the Kali Linux EC2 instance.
2. Create Docker containers for each user, running Kali Linux.
3. Create Docker containers for each instance of DVWA.

#### 5. Networking and Port Forwarding

1. Use SSH port forwarding to allow access to the DVWA web pages securely.
2. Configure SSH tunneling to map local ports to DVWA instance ports.

#### 6. Automation and Deployment

- Use AWS CloudFormation or Terraform to automate the creation and configuration of the above resources.
- Use Ansible or a similar configuration management tool to automate the setup of Docker containers on the Kali Linux instance.

### Example CloudFormation Template

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  MyVPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16

  PublicSubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref MyVPC
      CidrBlock: 10.0.1.0/24

  PrivateSubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref MyVPC
      CidrBlock: 10.0.2.0/24

  InternetGateway:
    Type: AWS::EC2::InternetGateway

  AttachGateway:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref MyVPC
      InternetGatewayId: !Ref InternetGateway

  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref MyVPC

  PublicRoute:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: !Ref PublicRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref InternetGateway

  PublicSubnetRouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnet
      RouteTableId: !Ref PublicRouteTable

  NatGateway:
    Type: AWS::EC2::NatGateway
    Properties:
      SubnetId: !Ref PublicSubnet
      AllocationId: !GetAtt EIP.AllocationId

  EIP:
    Type: AWS::EC2::EIP
    Properties:
      Domain: vpc

  PrivateRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref MyVPC

  PrivateRoute:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: !Ref PrivateRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId: !Ref NatGateway

  PrivateSubnetRouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PrivateSubnet
      RouteTableId: !Ref PrivateRouteTable

  BastionHost:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: t3.micro
      KeyName: my-key
      ImageId: ami-0a91cd140a1fc148a
      NetworkInterfaces:
        - AssociatePublicIpAddress: true
          DeviceIndex: 0
          SubnetId: !Ref PublicSubnet
          GroupSet:
            - !Ref BastionSecurityGroup

  DVWASecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      VpcId: !Ref MyVPC
      GroupDescription: Allow HTTP and SSH traffic
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 10.0.1.0/24
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          SourceSecurityGroupId: !Ref BastionSecurityGroup

  KaliLinuxSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      VpcId: !Ref MyVPC
      GroupDescription: Allow SSH traffic
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0

  BastionSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      VpcId: !Ref MyVPC
      GroupDescription: Allow SSH from internet
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0

  DVWAInstance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: t3.micro
      KeyName: my-key
      ImageId: ami-0a91cd140a1fc148a
      NetworkInterfaces:
        - AssociatePublicIpAddress: false
          DeviceIndex: 0
          SubnetId: !Ref PrivateSubnet
          GroupSet:
            - !Ref DVWASecurityGroup

  KaliLinuxInstance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: t3.large
      KeyName: my-key
      ImageId: ami-0a91cd140a1fc148a
      NetworkInterfaces:
        - AssociatePublicIpAddress: true
          DeviceIndex: 0
          SubnetId: !Ref PublicSubnet
          GroupSet:
            - !Ref KaliLinuxSecurityGroup

Outputs:
  BastionHostPublicIP:
    Value: !GetAtt BastionHost.PublicIp
  KaliLinuxPublicIP:
    Value: !GetAtt KaliLinuxInstance.PublicIp
```

### Example Docker Configuration for Kali Linux Instance

1. **Install Docker**

```bash
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
```

2. **Create Docker Containers**

```bash
# Create a Docker network
docker network create dvwa_network

# Run DVWA containers
for i in {1

..5}
do
  docker run -d --name dvwa_$i --network dvwa_network vulnerables/web-dvwa
done

# Run Kali Linux containers
for i in {1..5}
do
  docker run -d --name kali_$i --network dvwa_network kalilinux/kali-rolling
done
```

3. **Port Forwarding for DVWA**

Use SSH tunneling to forward ports. For example:

```bash
ssh -L 8080:private-dvwa-ip:80 user@bastion-host-public-ip
```

### Additional Considerations

- **Monitoring and Logging**: Use AWS CloudWatch for monitoring and logging of EC2 instances.
- **Backup and Recovery**: Implement regular backups of EC2 instances and Docker containers.
- **Security Best Practices**: Regularly update and patch all instances and containers. Implement IAM roles and policies to restrict access.

This architecture provides a robust and scalable solution for running multiple instances of DVWA and Kali Linux, ensuring secure access and easy management.
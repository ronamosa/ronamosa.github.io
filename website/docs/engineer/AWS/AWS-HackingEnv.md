---
title: "AWS Student Hacking Environment"
---

### Overview

:::tip AI Content

This design and content was generated with the help of `GPT-4o`. As is my workflow, I will do initial ideation, generation of design and code with AI, then manually tweak, test and update notes until working.

:::

This architecture is designed to run multiple instances of Damn Vulnerable Web App (DVWA) and Kali Linux in an AWS private environment. The architecture includes VPC setup, networking rules, and SSH access configurations. It will also enable port forwarding to access DVWA securely.

:::info Key Info

Most AI generated code has placeholder or outdated references like AMI IDs etc.

For this build the following info is used:

- Amazon Linux 2023, ap-southeast-2, AMI Id = `ami-03aa885dc6576ab5f`
- Kali Linux AMI id = `ami-0501355d9eba31ff5` (you have to subscribe to this from the AWS Marketplace)

:::

I initially tried the CloudFormation pathway when I thought Kali Linux containers were viable, but ended up going with CDK when deciding to fall back to EC2 instances using the official Kali Linux AMI

## ✅ CDK with Python

This setup will create:

- 1x VPC with a bastion host in the public subnet
- 10x Kali Linux instances in the private subnet
- 10x ECS Fargate tasks each running a DVWA container.

The environment is tagged appropriately for project and billing monitoring, and the DVWA containers are only accessible from the Kali instances, ensuring they are not exposed to the public internet.

### Local Setup

### Architecture

1. **VPC Configuration:**
   - **VPC**: A new VPC for isolation.
   - **Subnets**:
     - **Public Subnet**: For the bastion host.
     - **Private Subnets**: For Kali Linux instances and ECS tasks.
   - **Internet Gateway**: For internet access to the public subnet.
   - **NAT Gateway**: In the public subnet to allow outbound internet access for instances in the private subnets.

2. **Security Groups:**
   - **Bastion Host Security Group**:
     - Inbound: Allow SSH (port 22) from anywhere.
     - Outbound: Allow all traffic.
   - **Kali Linux Security Group**:
     - Inbound: Allow SSH (port 22) from the bastion host.
     - Outbound: Allow all traffic.
   - **ECS Security Group**:
     - Inbound: Allow HTTP traffic from the Kali instances' security group.
     - Outbound: Allow all traffic.

3. **EC2 Instances:**
   - **Bastion Host**:
     - One EC2 instance in the public subnet using the AMI ID `ami-03aa885dc6576ab5f`.
   - **Kali Linux Instances**:
     - Ten EC2 instances in the private subnet using the AMI ID `ami-0501355d9eba31ff5`.

4. **ECS Fargate Tasks**:
   - **DVWA Containers**: Ten Fargate tasks, each running a DVWA container instance, with network configuration to connect to the specific Kali instance.

### Pre-requisites

Each EC2 instance is configured with a unique EC2 `KeyPair` in the form "`student#-key`.pem" created beforehand and uploaded to the BastionHost to configure student access.

### Create KeyPairs

```bash
#!/bin/bash

# Define the AWS region
REGION="ap-southeast-2"

# Loop to create key pairs student1-key to student10-key
for i in {1..10}; do
  KEY_NAME="student${i}-key"
  
  # Create the key pair and save the private key to a file
  aws ec2 create-key-pair --key-name "$KEY_NAME" --region "$REGION" --query "KeyMaterial" --output text > "${KEY_NAME}.pem"
  
  # Set permissions for the private key file
  chmod 400 "${KEY_NAME}.pem"
  
  echo "Created key pair: $KEY_NAME and saved to ${KEY_NAME}.pem"
done

echo "All key pairs created successfully."
```

Ensure you create these before you create any EC2.

### Implementation Using AWS CDK with Python

#### Directory Structure

```bash
aws-dvwa-lab/
├── app.py
├── cdk_dvwa/
│   ├── __init__.py
│   └── cdk_dvwa_stack.py
├── requirements.txt
└── cdk.json
```

#### Step 1: Install AWS CDK

First, install the AWS CDK globally using npm:

```bash
npm install -g aws-cdk
```

#### Step 2: Initialize the CDK Project

Create a new directory for your project and navigate into it:

```bash
mkdir aws-dvwa-lab
cd aws-dvwa-lab
```

Initialize a new CDK project in Python:

```bash
cdk init app --language python
```

#### Step 3: Set Up a Virtual Environment

Create a virtual environment for Python dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows, use `.venv\Scripts\activate`
```

#### Step 4: Install Required CDK Modules

Install the necessary AWS CDK modules:

```bash
pip install aws-cdk.aws-ec2 aws-cdk.aws-ecs aws-cdk.aws-ecs-patterns
```

#### `cdk_dvwa/cdk_dvwa_stack.py`

```python
from aws_cdk import (
    Stack,
    aws_ec2 as ec2,
    aws_ecs as ecs,
    Tags,
)
from constructs import Construct

class CdkDvwaStack(Stack):

    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # Tags
        tags = {
            "Project": "AWS-DVWA-Lab",
            "Owner": "ramosa",
            "Environment": "Dev"
        }

        # Create VPC
        vpc = ec2.Vpc(
            self, "DvwaVPC",
            max_azs=2,
            nat_gateways=1,
            subnet_configuration=[
                ec2.SubnetConfiguration(
                    name="Public",
                    subnet_type=ec2.SubnetType.PUBLIC,
                    cidr_mask=24
                ),
                ec2.SubnetConfiguration(
                    name="Private",
                    subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS,
                    cidr_mask=24
                )
            ]
        )

        # Security Group for Bastion Host
        bastion_sg = ec2.SecurityGroup(
            self, "BastionSG",
            vpc=vpc,
            description="Allow SSH access to bastion host",
            allow_all_outbound=True
        )
        bastion_sg.add_ingress_rule(
            ec2.Peer.any_ipv4(),
            ec2.Port.tcp(22),
            "Allow SSH access from anywhere"
        )

        # Security Group for Kali
        kali_sg = ec2.SecurityGroup(
            self, "KaliSG",
            vpc=vpc,
            description="Allow SSH access from bastion host",
            allow_all_outbound=True
        )
        kali_sg.add_ingress_rule(
            bastion_sg,
            ec2.Port.tcp(22),
            "Allow SSH access from bastion host"
        )

        # Security Group for ECS (DVWA)
        dvwa_sg = ec2.SecurityGroup(
            self, "DVWASG",
            vpc=vpc,
            description="Allow HTTP access from Kali instances",
            allow_all_outbound=True
        )
        dvwa_sg.add_ingress_rule(
            kali_sg,
            ec2.Port.tcp(80),
            "Allow HTTP access from Kali instances"
        )

        # ECS Cluster
        cluster = ecs.Cluster(self, "DvwaCluster",
                              cluster_name="DvwaCluster",  # Custom name for the cluster
                              vpc=vpc)

        # ECS Task Definition
        task_definition = ecs.FargateTaskDefinition(
            self, "TaskDef",
            family="DvwaTask",  # Custom family name for the task definition
            memory_limit_mib=512,
            cpu=256,
        )
        container = task_definition.add_container(
            "DVWAContainer",
            image=ecs.ContainerImage.from_registry("vulnerables/web-dvwa"),
            memory_limit_mib=512,
        )
        container.add_port_mappings(
            ecs.PortMapping(container_port=80)
        )

        # Fargate Services
        for i in range(10):
            ecs.FargateService(
                self, f"FargateService{i+1}",
                service_name=f"DvwaService{i+1}",  # Custom name for the service
                cluster=cluster,
                task_definition=task_definition,
                desired_count=1,
                security_groups=[dvwa_sg],
                vpc_subnets=ec2.SubnetSelection(
                    subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS
                ),
                assign_public_ip=False
            )

        # Launch Bastion Host
        bastion_host = ec2.Instance(
            self, "BastionHost",
            instance_type=ec2.InstanceType("t2.micro"),
            machine_image=ec2.MachineImage.generic_linux({
                "ap-southeast-2": "ami-03aa885dc6576ab5f"
            }),
            vpc=vpc,
            key_name="admin-key",
            security_group=bastion_sg,
            vpc_subnets=ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PUBLIC
            )
        )
        Tags.of(bastion_host).add("Name", "BastionHost", apply_to_launched_instances=True)

        # User data script to bootstrap Kali instances
        user_data_script = """#!/bin/bash
        apt update -y
        DEBIAN_FRONTEND=noninteractive apt-get install -y kali-linux-headless
        """

        # Launch Kali EC2 Instances
        kali_amis = ec2.MachineImage.generic_linux({
            "ap-southeast-2": "ami-0501355d9eba31ff5"
        })
        for i in range(10):
            key_pair = ec2.KeyPair.from_key_pair_name(self, f"KeyPair{i+1}", f"student{i+1}-key")

            kali_instance = ec2.Instance(
                self, f"KaliInstance{i+1}",
                instance_type=ec2.InstanceType("t2.medium"),
                machine_image=kali_amis,
                vpc=vpc,
                key_name=key_pair.key_pair_name,
                security_group=kali_sg,
                vpc_subnets=ec2.SubnetSelection(
                    subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS
                ),
                user_data=ec2.UserData.custom(user_data_script)
            )
            Tags.of(kali_instance).add("Name", f"KaliInstance{i+1}", apply_to_launched_instances=True)
            for key, value in tags.items():
                Tags.of(kali_instance).add(key, value, apply_to_launched_instances=True)
```

#### `app.py`

Update the `app.py` file to use the stack we created.

```python
#!/usr/bin/env python3

import aws_cdk as cdk

from cdk_dvwa.cdk_dvwa_stack import CdkDvwaStack


app = cdk.App()
CdkDvwaStack(app, "CdkDvwaStack", env=cdk.Environment(region="ap-southeast-2"))

app.synth()
```

#### `requirements.txt`

Add the required dependencies to the `requirements.txt` file.

```txt
aws-cdk-lib==2.144.0
constructs>=10.0.0,<11.0.0
```

#### `cdk.json`

Ensure your `cdk.json` file specifies the correct app entry point.

```json
{
  "app": "python app.py"
}
```

### Deploy the CDK Stack

1. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

2. **Deploy**:

   ```bash
   cdk deploy
   ```

## Bastion Host

This is the jump host for the students to connect and then ssh into the Kali/DVWA box.

We need to find out the public address for the BastionHost using `aws-cli`, and then setup the student access:

```bash
aws ec2 describe-instances \
    --filters "Name=tag:Name,Values=BastionHost" \
    --query "Reservations[*].Instances[*].PublicIpAddress" \
    --output text
```

this will give you the public IP, you might get

ssh to BastionHost: `❯ ssh -i admin-key.pem ec2-user@54.XXX.165.XXX`

### Setup Student Access

I have the admin-key and 10x KeyPairs I created [before](#create-keypairs).

Upload to BastionHost with `scp -i admin-key.pem student* ec2-user@54.XXX.165.XXX:~/`

#### Create Student Accounts

```bash
#!/bin/bash
for i in {1..10}; do
  useradd -m student$i
  mkdir -p /home/student$i/.ssh
  chown -R student$i:student$i /home/student$i/.ssh
done
```

I want to use the `admin-key.pem` which is paired with the Bastion host, to allow the students to bounce through, so I need to add `authorize_host` to each student profile

```bash
#!/bin/bash
cp /home/ec2-user/.ssh/authorized_keys /home/student1/.ssh/
chown student1:student1 /home/student1/.ssh/authorized_keys
for i in {2..10}; do
  cp /home/student1/.ssh/authorized_keys /home/student$i/.ssh/
  chown student$i:student$i /home/student$i/.ssh/authorized_keys
done
```

so when I do this:

```bash
ssh -i admin-key.pem student3@X.1XX.1XX.0
   ,     #_
   ~\_  ####_        Amazon Linux 2
  ~~  \_#####\
  ~~     \###|       AL2 End of Life is 2025-06-30.
  ~~       \#/ ___
   ~~       V~' '->
    ~~~         /    A newer version of Amazon Linux is available!
      ~~._.   _/
         _/ _/       Amazon Linux 2023, GA and supported until 2028-03-15.
       _/m/'           https://aws.amazon.com/linux/amazon-linux-2023/

[student3@ip-10-0-1-41 ~]$ 
```

## Kali Instances

Fetch Kali instance names and private IP address:

```bash
aws ec2 describe-instances \  
    --filters "Name=tag:Name,Values=KaliInstance*" \
    --query "Reservations[*].Instances[*].{Name:Tags[?Key=='Name']|[0].Value,PrivateIpAddress:PrivateIpAddress}" \
    --output table
```

output looks like:

```bash
----------------------------------------
|           DescribeInstances          |
+-----------------+--------------------+
|      Name       | PrivateIpAddress   |
+-----------------+--------------------+
|  KaliInstance3  |  10.0.2.155        |
|  KaliInstance10 |  10.0.2.113        |
|  KaliInstance7  |  10.0.2.76         |
|  KaliInstance4  |  10.0.2.165        |
|  KaliInstance6  |  10.0.2.156        |
|  KaliInstance2  |  10.0.2.138        |
|  KaliInstance1  |  10.0.2.153        |
|  KaliInstance9  |  10.0.2.125        |
|  KaliInstance5  |  10.0.2.126        |
|  KaliInstance8  |  10.0.2.209        |
+-----------------+--------------------+
```

### Create Student Kali README

From my local machine, because BastionHost is not authorised to `aws-cli`, I run this to create the 10x specific readmes for each student:

```bash
#!/bin/bash

# Define the AWS region
REGION="ap-southeast-2"

# Loop to fetch information for each KaliInstance and create a README file for each student
for i in {1..10}; do
  INSTANCE_NAME="KaliInstance${i}"
  STUDENT_NAME="Student${i}"
  FILENAME="student${i}_kali_instance.md"

  INSTANCE_INFO=$(aws ec2 describe-instances \
    --filters "Name=tag:Name,Values=$INSTANCE_NAME" \
    --query "Reservations[*].Instances[*].{Name:Tags[?Key=='Name']|[0].Value,PrivateIpAddress:PrivateIpAddress,PrivateDnsName:PrivateDnsName}" \
    --output json)

  NAME=$(echo $INSTANCE_INFO | jq -r '.[0][0].Name')
  PRIVATE_IP=$(echo $INSTANCE_INFO | jq -r '.[0][0].PrivateIpAddress')
  PRIVATE_DNS=$(echo $INSTANCE_INFO | jq -r '.[0][0].PrivateDnsName')

  cat <<EOL > $FILENAME
# README for ${STUDENT_NAME}

Talofa ${STUDENT_NAME},

You are on the JUMPBOX!

You need to take one more step to access your Hacking Machine (Kali).

Here are the details to your Kali Machine:

\`\`\`
-----------------------------------------------------------------------
|                          DescribeInstances                          |
+-------------------+-------------------------------------------------+
|  Name             |  ${NAME}                                        |
|  PrivateDnsName   |  ${PRIVATE_DNS}                                 |
|  PrivateIpAddress |  ${PRIVATE_IP}                                  |
+-------------------+-------------------------------------------------+
\`\`\`

You have a secret key in the `secret/` folder, you need to use this to connect to Kali.

In the terminal, you are going to type the following command to connect:

\`\`\`
ssh -i secret/student${i}-key.pem kali@${PRIVATE_DNS}
\`\`\`

EOL

  echo "Created README for $STUDENT_NAME and saved to $FILENAME"
done

echo "All README files created successfully."
```

I upload the scripts to the BastionHost `~/scripts`, and along with the PEM student keys, use this bash script to distribute them to student accounts:

```bash
#!/bin/bash

# Define base paths
KEYS_DIR="keys"
SCRIPTS_DIR="scripts"

# Loop through each student
for i in {1..10}; do
  STUDENT_HOME="/home/student${i}"
  SECRET_DIR="${STUDENT_HOME}/secret"
  
  # Create the secret directory in the student's home directory
  mkdir -p "${SECRET_DIR}"
  
  # Copy the key file to the secret directory
  cp "${KEYS_DIR}/student${i}-key.pem" "${SECRET_DIR}/"
  
  # Copy the README file to the home directory
  cp "${SCRIPTS_DIR}/student${i}_kali_instance.md" "${STUDENT_HOME}/"
  
  # Ensure correct ownership and permissions
  chown -R student${i}:student${i} "${STUDENT_HOME}"
  chmod 700 "${SECRET_DIR}"
  chmod 600 "${SECRET_DIR}/student${i}-key.pem"
  chmod 644 "${STUDENT_HOME}/student${i}_kali_instance.md"
  
  echo "Created secret directory and copied files for student${i}"
done

echo "All secret directories and files have been created and copied successfully."
```

### Student Bastion to Kali

Testing this route works: `Local -> Jump -> Kali`

```bash
# local machine
ssh -i admin-key.pem student1@BastionEc2Ip ✅

# From Bastion
# check my readme file has correct ip details ✅
ssi -i student1-key.pem kali@KaliInstance1PrivateIp ✅
```

Success:

![succesful connect to kali](/img/AWSHackingEnv-kali.png)

### Install Kali Tools

On login you'll see this notice:

```bash
Linux kali 6.5.0-kali3-cloud-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.5.6-1kali1 (2023-10-09) x86_64

The programs included with the Kali GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Kali GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
┏━(Message from Kali developers)
┃
┃ This is a minimal installation of Kali Linux, you likely
┃ want to install supplementary tools. Learn how:
┃ ⇒ https://www.kali.org/docs/troubleshooting/common-minimum-setup/
┃
┃ This is a cloud installation of Kali Linux. Learn more about
┃ the specificities of the various cloud images:
┃ ⇒ https://www.kali.org/docs/troubleshooting/common-cloud-setup/
┃
┗━(Run: “touch ~/.hushlogin” to hide this message)
```

We need to install minimal set of tools minus the Graphical UI.

From the Kali machine, run the following:

```bash
# update system
sudo apt update -y

# install minimal headless kali
sudo apt install -y kali-linux-headless

# OR `sudo DEBIAN_FRONTEND=noninteractive apt-get install -y kali-linux-headless` to non-interactive.
```

## ❌ CloudFormation

:::danger No Deal

This design was an option looking at running Kali Linux as containers and having 10x running for the lab environment. The resulting manual build of a full-featured container size is 9.8GiB. The cost and complexity of this option made it a no-go for me.

:::

:::tip AI Assistant

This overview summary generated by GPT-4o

:::

### Overview of the Infrastructure Design and Components

In this setup, we design a secure AWS infrastructure to allow 10 students to access private EC2 instances within a VPC using a bastion host. Each student has their own user account and private key for SSH access. Here's a detailed overview of the components and design:

#### 1. **VPC (Virtual Private Cloud)**

- **CIDR Block:** `10.0.0.0/16`
- **Subnets:**
  - **Public Subnet:** `10.0.1.0/24` - Hosts the bastion host with public IP access.
  - **Private Subnet:** `10.0.2.0/24` - Hosts the private EC2 instances accessible only via the bastion host.

#### 2. **Internet Gateway**

- An Internet Gateway is attached to the VPC to allow internet access for resources in the public subnet.

#### 3. **Route Tables**

- **Public Route Table:** Routes internet-bound traffic from the public subnet through the Internet Gateway.
- **Private Route Table:** Routes internal VPC traffic within the private subnet.

#### 4. **Security Groups**

- **Bastion Security Group:**
  - Allows inbound SSH (port 22) traffic from any IP address for admin access.
  - Applied to the bastion host.
- **Private Instance Security Group:**
  - Allows inbound SSH (port 22) traffic only from the bastion host's security group.
  - Applied to all private EC2 instances.

#### 5. **Bastion Host**

- **Instance Type:** `t2.micro`
- **Key Pair:** `admin-key`
- **AMI:** Amazon Linux 2023
- **Root Disk:** 100 GiB
- **Purpose:** Acts as a gateway for SSH access to private instances.
- **User Setup:**
  - Creates 10 user accounts (`student1` to `student10`).
  - Configures SSH access for each user with the `admin-key.pem`.
  - Ensures students land in their home directories upon SSH login.

#### 6. **Private EC2 Instances**

- **Instance Type:** `t2.micro`
- **Key Pair:** Unique key pair for each student (e.g., `student1-key`, `student2-key`).
- **AMI:** Amazon Linux 2023
- **Root Disk:** 100 GiB
- **User Data:** Installs Docker on each instance.
  - Updates the system.
  - Installs Docker.
  - Starts the Docker service.
  - Adds the default user to the Docker group for easy usage.

### Summary of the Configuration Process

1. **VPC and Subnet Creation:**
   - Create a VPC with a 16-bit CIDR block.
   - Create a public subnet and a private subnet within the VPC.

2. **Internet Gateway and Route Tables:**
   - Attach an Internet Gateway to the VPC.
   - Create a public route table and associate it with the public subnet.
   - Create a private route table and associate it with the private subnet.

3. **Security Groups Setup:**
   - Create a security group for the bastion host allowing SSH access from the internet.
   - Create a security group for private instances allowing SSH access only from the bastion host.

4. **Bastion Host Configuration:**
   - Launch an EC2 instance in the public subnet with the `admin-key`.
   - Create user accounts for students.
   - Configure SSH access for students using the `admin-key`.

5. **Private Instances Configuration:**
   - Launch EC2 instances in the private subnet, each with a unique key pair.
   - Install Docker on each instance via user data script.
   - Ensure proper tagging for billing and identification.

### Example SSH Access Workflow

1. **Student SSH to Bastion Host:**

   ```bash
   ssh -i admin-key.pem student1@<bastion-host-public-ip>
   ```

2. **SSH from Bastion Host to Private Instance:**

   Students will find a key in their home directory in the format `studentN-key.pem`

   ```bash
   ssh -i student1-key.pem ec2-user@<private-instance-ip>
   ```

### Benefits and Security Considerations

- **Security:** By using a bastion host, private instances remain inaccessible from the internet, reducing exposure to potential threats.
- **Isolation:** Each student has a unique user account and private key, ensuring that activities are isolated and secure.
- **Flexibility:** Docker is pre-installed on all private instances, enabling students to work with containers efficiently.

This setup provides a robust and secure environment for students to access and interact with private instances while maintaining best practices for AWS infrastructure and security.

Technically, this could've been done in the `UserData` of cloudformation, but I haven't tested it:

```yaml
  BastionHost:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: t2.micro
      KeyName: !Ref BastionKeyName
      ImageId: !Ref AmiId
      NetworkInterfaces:
        - AssociatePublicIpAddress: true
          DeviceIndex: 0
          SubnetId: !Ref PublicSubnet
          GroupSet:
            - !Ref BastionSecurityGroup
      BlockDeviceMappings:
        - DeviceName: /dev/xvda
          Ebs:
            VolumeSize: 100
            VolumeType: gp2
      UserData:
        Fn::Base64: |
          #!/bin/bash
          # Create user accounts
          for i in {1..10}; do
            useradd -m student$i
            mkdir -p /home/student$i/.ssh
            chown student$i:student$i /home/student$i/.ssh
          done
          # Copy the admin public key to each student's authorized_keys
          cp /home/ec2-user/.ssh/authorized_keys /home/student1/.ssh/
          chown student1:student1 /home/student1/.ssh/authorized_keys
          for i in {2..10}; do
            cp /home/student1/.ssh/authorized_keys /home/student$i/.ssh/
            chown student$i:student$i /home/student$i/.ssh/authorized_keys
          done
      Tags:
        - Key: Name
          Value: BastionHost
```

I uploaded the 10 student pem keys to the bastion host, then distributed them to the student `/home/student$i` directories and `chown` for each.

Now each student should be able to ssh into the Kali instance where the DVWA is also running in a container.

## Kali Container Build

On the Bastion host, we build the kali-linux container and push it to ECR.

```bash
docker pull kalilinux/kali-rolling
docker run -ti kalilinux/kali-rolling /bin/bash

# inside container run...
apt update -y
apt install -y kali-linux-headless

# answer question prompts but leave the container running.
```

in another terminal, you need to find and commit the running container with the changes in it, sort of like a snapshot.

```bash
# from another terminal
docker ps
docker commit ID <name_for_build>
```

for example

```bash
[ec2-user@ip-10-0-1-111 ~]$ docker ps -a
CONTAINER ID   IMAGE                    COMMAND       CREATED       STATUS       PORTS     NAMES
81b76c2123dc   kalilinux/kali-rolling   "/bin/bash"   3 hours ago   Up 3 hours             intelligent_mestorf
[ec2-user@ip-10-0-1-111 ~]$ docker commit 81b7 kali-build-20240528

sha256:2fdd15145e804b8c0accc779dadf22571cf78b809047d75057856cc353f0d173

[ec2-user@ip-10-0-1-111 ~]$ docker images
REPOSITORY               TAG       IMAGE ID       CREATED              SIZE
kali-build-20240528      latest    2fdd15145e80   About a minute ago   9.08GB
kalilinux/kali-rolling   latest    02088abe3f5c   46 hours ago         127MB
```

## Appendix

:::tip AI Workflow

The process of getting an AI to generate the initial design and code does a couple of things- first it quickly generates a holistic scope of the project, covering everything from documentation, steps, and code. The issue is when that design decision and code is a) completely wrong or made up and b) a misunderstanding of the actual requirements leading to the suggestion of sub-optimal design and by extension config and code choices.

However, it generates some interesting options, which I will document here for posterity.

:::

### Private DNS for internal

Using DNS names instead of IP addresses can simplify the management of your instances, especially if the IP addresses change frequently. AWS provides a way to use DNS for EC2 instances by leveraging the private DNS names provided by the EC2 instances or by setting up Route 53 DNS records.

#### Option 1: Using Private DNS Names

Each EC2 instance has a private DNS name that can be used within the VPC. You can fetch these names using the AWS CLI:

```bash
aws ec2 describe-instances \
    --filters "Name=tag:Name,Values=KaliInstance*" \
    --query "Reservations[*].Instances[*].{Name:Tags[?Key=='Name']|[0].Value,PrivateDnsName:PrivateDnsName}" \
    --output table
```

#### Example Command Output

```plaintext
-------------------------------------
|            DescribeInstances      |
+------------------+----------------+
|      Name        | PrivateDnsName |
+------------------+----------------+
|  KaliInstance1   |  ip-10-0-1-10.ec2.internal |
|  KaliInstance2   |  ip-10-0-1-11.ec2.internal |
|  KaliInstance3   |  ip-10-0-1-12.ec2.internal |
|  KaliInstance4   |  ip-10-0-1-13.ec2.internal |
|  KaliInstance5   |  ip-10-0-1-14.ec2.internal |
|  KaliInstance6   |  ip-10-0-1-15.ec2.internal |
|  KaliInstance7   |  ip-10-0-1-16.ec2.internal |
|  KaliInstance8   |  ip-10-0-1-17.ec2.internal |
|  KaliInstance9   |  ip-10-0-1-18.ec2.internal |
|  KaliInstance10  |  ip-10-0-1-19.ec2.internal |
+------------------+----------------+
```

#### Option 2: Using Route 53

For a more robust solution, you can create Route 53 private hosted zone records for your instances. This way, you can use meaningful DNS names that you define.

##### Step 1: Create a Private Hosted Zone

1. **Create a Private Hosted Zone** in Route 53:

   ```bash
   aws route53 create-hosted-zone --name example.com --vpc VPCRegion=ap-southeast-2,VPCId=vpc-xxxxxxxx --caller-reference $(date +%s)
   ```

   Note the `HostedZoneId` from the output.

##### Step 2: Create DNS Records for Each Instance

2. **Create DNS Records** for each instance in the hosted zone:

   ```bash
   HOSTED_ZONE_ID=<your-hosted-zone-id>

   for i in {1..10}; do
     INSTANCE_ID=$(aws ec2 describe-instances \
       --filters "Name=tag:Name,Values=KaliInstance${i}" \
       --query "Reservations[*].Instances[*].InstanceId" \
       --output text)
     
     PRIVATE_IP=$(aws ec2 describe-instances \
       --instance-ids $INSTANCE_ID \
       --query "Reservations[*].Instances[*].PrivateIpAddress" \
       --output text)
     
     aws route53 change-resource-record-sets \
       --hosted-zone-id $HOSTED_ZONE_ID \
       --change-batch '{
         "Changes": [{
           "Action": "UPSERT",
           "ResourceRecordSet": {
             "Name": "kaliinstance'${i}'.example.com",
             "Type": "A",
             "TTL": 60,
             "ResourceRecords": [{"Value": "'${PRIVATE_IP}'"}]
           }
         }]
       }'
   done
   ```

##### Step 3: Verify DNS Records

3. **Verify DNS Records** to ensure they are set up correctly:

   ```bash
   aws route53 list-resource-record-sets --hosted-zone-id $HOSTED_ZONE_ID
   ```

#### Using DNS Names

Once you have the DNS names set up, you can use them to SSH into your instances:

```bash
ssh -i path/to/student1-key.pem ec2-user@kaliinstance1.example.com
```

### UserData Docker

This `UserData` script wasn't completely terrible, and I want to work through it to see where else I can use it:

```yaml
      UserData:
        Fn::Base64: |
          #!/bin/bash
          # Update and install necessary packages
          sudo yum update -y
          sudo yum install -y docker jq

          # Start Docker service
          sudo service docker start
          sudo usermod -a -G docker ec2-user

          # Enable Docker to start on boot
          sudo systemctl enable docker

          # Pull the Kali Linux Docker image
          sudo docker pull kalilinux/kali-rolling

          # Run the Kali Linux container with SSH port exposed
          sudo docker run -d -p 2222:22 --name kali-container kalilinux/kali-rolling

          # Install OpenSSH server in the Kali container
          sudo docker exec kali-container apt-get update
          sudo docker exec kali-container apt-get install -y openssh-server
          sudo docker exec kali-container service ssh start

          # Create a directory for SSH keys in the Kali container
          sudo docker exec kali-container mkdir -p /root/.ssh

          # Retrieve the public key from EC2 metadata and add it to the Kali container's authorized_keys
          EC2_PUBLIC_KEY=$(curl -s http://169.254.169.254/latest/meta-data/public-keys/0/openssh-key)
          sudo docker exec kali-container bash -c "echo '${EC2_PUBLIC_KEY}' >> /root/.ssh/authorized_keys"

          # Set the correct permissions
          sudo docker exec kali-container chmod 600 /root/.ssh/authorized_keys
          sudo docker exec kali-container chmod 700 /root/.ssh

          # Wait for SSH to be available
          while ! sudo docker exec kali-container ssh -o StrictHostKeyChecking=no -p 2222 root@localhost echo "SSH is up"; do
              echo "Waiting for SSH to be available..."
              sleep 5
          done

          # Create a script to forward SSH connections to the Kali container
          sudo tee /usr/local/bin/ssh-kali <<EOF
          #!/bin/bash
          ssh -p 2222 root@localhost
          EOF
          sudo chmod +x /usr/local/bin/ssh-kali

          # Update SSHD config to force SSH into the Kali container
          sudo tee -a /etc/ssh/sshd_config <<EOF
          PermitTunnel yes
          Match User ec2-user
            ForceCommand /usr/local/bin/ssh-kali
          EOF

          # Restart SSH service to apply changes
          sudo service sshd restart
```

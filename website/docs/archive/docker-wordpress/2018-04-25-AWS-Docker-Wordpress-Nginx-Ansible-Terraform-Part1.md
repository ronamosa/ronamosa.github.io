---
slug: "docker-wordpress-1"
title: "Part 1 - Architecture, Database and Infrastructure."
---

The following 3-part series of documents will go through setting up a containerized wordpress site, with an NGINX frontend, RDS/MariaDB database backend, build using Terraform and Ansible; and running AWS.

I wanted to make the simplest setup to run the docker wordpress site with an RDS/MariaDB backend. So, no ELB (load balancer), no Route53 or CloudFront.

Here's a simple diagram of what I want to build

![diagram of app](/img/archive/dockerwordpress-appdiagram.png)

## Infrastructure Overview

This super basic setup consists of:

- 1 x EC2 instance with docker, docker-compose installed
- 1 x RDS MariaDB Database.

That's it.

I want Terraform to take care of standing all the infrastructure up.

Your file list (see [Github](https://github.com/ronamosa))

- `instance.tf`
- `outputs.tf`
- `provider.tf`
- `rds.tf`
- `securitygroups.tf`
- `variables.tf`

Let's take a quick look at each component

## EC2 Instance

What we're working with:

- OS is Ubuntu (AMI)
- instance type/size is 't2.micro'
- root device is 8GB and will be deleted when instance is terminated
- we want the instance to be assigned a Public IP address
- an 20GB EBS volume will be added, and available in the "us-east-1c" AZ
- EBS volume will be attached under device name "/dev/xvdb"

```hcl
resource "aws_instance" "web01" {
  # ubuntu ami
  ami = "ami-2d39803a"
  instance_type = "t2.micro"
  vpc_security_group_ids = ["${aws_security_group.web_server_sg.id}"]

  root_block_device {
    volume_size = "8"
    delete_on_termination = true
  }

  associate_public_ip_address = true
  ebs_optimized = false
  key_name = "infra_builder"

  tags {
    Name = "web01"
  }
}

resource "aws_ebs_volume" "web01-ebs-volume1" {
    availability_zone = "us-east-1c"
    size = "20"
    type = "gp2"
    tags {
        Name = "Data Volume"
        CreatedBy = "Terraform"
    }
}

resource "aws_volume_attachment" "web01-ebs1" {
    device_name = "/dev/xvdb"
    volume_id = "${aws_ebs_volume.web01-ebs-volume1.id}"
    instance_id = "${aws_instance.web01.id}"
}
```

:::note

the `key_name` you see here must be setup manually via the AWS console.

:::

![keypair](/img/archive/dockerwordpress-keypair.png)

## RDS Database

What's happening here:

- a mariadb with 5 GB storage
- its a `db.t2.medium` instance class (anything smaller becomes a problem)
- set the username, password, license model (important as the wrong license throws errors)
- `skip_final_snapshot` must be set to 'true'.
- databases need subnet groups to straddle, one subnet same as the ec2 instance, and another one for other admin, replication, backup use.

```hcl
################ DB INSTANCE ###############
resource "aws_db_instance" "backend_db" {
    name = "rds_mysql"
    allocated_storage = 5
    engine = "mariadb"
    storage_type = "gp2"
    instance_class = "db.t2.medium"
    identifier = "wordpressdb"
    username = "wpress"
    password = "wpress_247x"
    parameter_group_name = "${aws_db_parameter_group.rds_param_group.id}"
    license_model = "general-public-license"

    # set to 'true' so we can destroy
    skip_final_snapshot = true

    # network config
    db_subnet_group_name = "${aws_db_subnet_group.rds_subnet_group.id}"
    vpc_security_group_ids = ["${aws_security_group.db_server_sg.id}"]

    tags {
        Name = "Backend Database"
        CreatedBy = "Terraform"
    }
}

################  DB SUBNET  ###############
resource "aws_db_subnet_group" "rds_subnet_group" {
    name = "rds subnet group"
    # us-east-1c, us-east-1d
    subnet_ids = ["subnet-39d6a014","subnet-7a5c7b33"]

    tags {
        Name = "RDS Subnet Group"
        CreatedBy = "Terraform"
    }
}

################  DB PARAMS  ###############
resource "aws_db_parameter_group" "rds_param_group" {
    name = "wp-db-mariadb10-1"
    family = "mariadb10.1"
}
```

## Security Groups

This is probably the glue that allows everything (once they're stood up) to access each other correctly. Security Grounds inbound and outbound rules are all defined and associated here.

The following will define TWO security groups. One for the web server instance(s), and the second one for the RDS backend database.

There's probably a better way to throw all these together as its just a simple/small configuration, but I like to still use practices that can scale if we decided to jump to a bigger setup. I'm sure this isn't quite what they mean by making all code "modular" with Infrastructure as Code (IaC), but it works on the same principle.

```hcl
################ GROUPS ###############

# this is your web server GROUP config

resource "aws_security_group" "web_server_sg" {
    name = "web_server_security"
    description = "ALLOW inbound traffic to web server"
    vpc_id = "vpc-534cfe35"

    tags {
        Name = "web_sg"
        CreatedBy = "Terraform"
    }
}

# this is your RDS database GROUP config

resource "aws_security_group" "db_server_sg" {
    name = "rds_server_security"
    description = "ALLOW inbound traffic to RDS/MySQL"
    vpc_id = "vpc-534cfe35"

    tags {
        Name = "db_sg"
        CreatedBy = "Terraform"
    }
}

################ WEB RULES ###############

# the following are security group RULES you add
# to the security GROUP

resource "aws_security_group_rule" "ssh" {
    type = "ingress"
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]

    # add to the WEB GROUP above
    security_group_id = "${aws_security_group.web_server_sg.id}"
}

resource "aws_security_group_rule" "web_http" {
    type = "ingress"
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]

    # add to the WEB GROUP above
    security_group_id = "${aws_security_group.web_server_sg.id}"
}

resource "aws_security_group_rule" "web_https" {
    type = "ingress"
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]

    # add to the WEB GROUP above
    security_group_id = "${aws_security_group.web_server_sg.id}"
}

resource "aws_security_group_rule" "anywhere_outbound" {
    type = "egress"
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]

    # add to the WEB GROUP above
    security_group_id = "${aws_security_group.web_server_sg.id}"
}

################ DB RULES ###############

resource "aws_security_group_rule" "db_rds_sg-1" {
    type = "ingress"
    from_port = "3306"
    to_port = "3306"
    protocol = "tcp"

    # allow inbound from the WEB GROUP
    source_security_group_id = "${aws_security_group.web_server_sg.id}"

    # references the DB GROUP above
    security_group_id = "${aws_security_group.db_server_sg.id}"
}

resource "aws_security_group_rule" "db_rds_sg-2" {
    type = "egress"
    from_port = "0"
    to_port = "0"
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]

    # references the DB GROUP above
    security_group_id = "${aws_security_group.db_server_sg.id}"
}

```

And the last 2 terraform files in the mix are:

## Provider

Standard setup:

```hcl
provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region     = "${var.aws_region}"
}
```

## Variables

then these variables get fed into provider (amongst others):

```hcl
variable "access_key" {
  default = "**************************"
}

variable "secret_key" {
  default = "**************************"
}

variable "aws_region" {
  description = "AWS region"
  default = "us-east-1"
}

variable "aws_vpc_cidr" {
  default = {
    "us-east-1" = "172.31.0.0/16"
  }
}
```

## Outputs

these can be whatever you need outputted to stdout (i.e. your screen) and also tracked by terraform (via `terraform output`) for future use.

- first output will look for ALL public_ip's it can find under aws_instance.web01 (needs to be a list i.e. '[]' wrapped)
- second output just the name of the mariadb that's created

```hcl
output "ec2_public_ips" {
  value = ["${aws_instance.web01.*.public_ip}"]
}

output "rds_mysql_db_name" {
  value = "${aws_db_instance.backend_db.address}"
}
```

## Plan it, Run it

A rather long video of running `terraform plan`, and when all looks good, no error messages I run `terraform apply`. At a certain point in the video, terraform errors out and I have to fix it on the fly (did it quicker than normal due to having seen this error before).

Don't let the thumbnail fool you, I switch screens while the RDS database is being created and show the AWS console where things are magically showing up:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/c9ufJAYuaZ8?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

After all's up & running, login to the new EC2 instance and check it can connect to the new RDS/Maridadb database! (grab the database name from the terraform output):

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/U4CsQX3ksoE?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## A few Quirky Points

A few things I ran into while working through this which were good to note:

- mariadb complained with I tried to use db.t2.small. Setting it to db.t2.medium fixed the issue.
- db password must be longer than 8 char (no kidding)
- `vpc_security_group_ids` in the terraform variables needs to be inside '[]' i.e. `[${aws_security_groups.x.id}]` or it won't recognize your reference as a 'list'

```bash
# set to 'true' so we can destroy
skip_final_snapshot = true
```

or you get this error on `terraform destroy`

```bash
Error: Error applying plan:

1 error(s) occurred:

* aws_db_instance.backend_db (destroy): 1 error(s) occurred:

* aws_db_instance.backend_db: DB Instance FinalSnapshotIdentifier is required when a final snapshot is required
```

- dont forget a `ALL 0.0.0.0/0` egress rule on your WEB security group or the outbound request (I tried to telnet to the RDS and it didnt return anything)

Right, that's the end of Part I!

In Part II we will provision some things onto the new EC2 instance to get it ready for running docker and using docker-compose!

## References

:::info

- [terraform vpc examples](https://github.com/arbabnazar/terraform-ansible-aws-vpc-ha-wordpress.git)
- [aws wordpress terraform ansible example](https://rbgeek.wordpress.com/2016/03/28/highly-available-wordpress-setup-inside-aws-vpc-using-terraform-ansible/)
- [bootstrap credit](https://hackernoon.com/setup-docker-swarm-on-aws-using-ansible-terraform-daa1eabbc27d)
- [using ansible with terraform](https://alex.dzyoba.com/blog/terraform-ansible/)

:::
---
slug: "terraform-aws-1"
title: "Part 1 - Accounts, Single Deployment"
---


I found myself wanting to convert a cloudformation config file to terraform and realised I haven't worked with terraform before.

So let's fix that by finding a beginner's guide to getting your hands dirty with Terrafom.

I found and started following @gruntwork's ["Introduction to Terraform"](https://blog.gruntwork.io/an-introduction-to-terraform-f17df9c6d180). 

Admittedly its from 2016 and was bit outdated, but I was already halfway through it before I checked how current it was :)

No matter, learning is learning so here are my notes getting started with [Terraform](https://www.terraform.io) from my laptop.

## Setup

Before you can do anything, you need the following

:::info Pre-requisites

1. AWS account
2. `iam` user with limited permissions (`AmazonEC2FullAccess`)
3. `AWS_SECRET_KEY` and `AWS_ACCESS_KEY` of your iam user
4. `terraform` installed

:::

### AWS Account

Setup your AWS user account

* you need programmatic access
  * download the credentials.csv with your `KEY` and `SECRET`.
* minimum '`AmazonEC2FullAccess`' permissions
* DONT use your root account, create another user account with min. privileges to play around with.

### Install Terraform

make sure you've got terraform installed

```bash
$ terraform
Usage: terraform [--version] [--help] <command> [args]

The available commands for execution are listed below.
The most common, useful commands are shown first, followed by
less common or more advanced commands. If you're just getting
started with Terraform, stick with the common commands. For the
other commands, please read the help and docs before usage.

Common commands:
    apply              Builds or changes infrastructure
    console            Interactive console for Terraform interpolations
    destroy            Destroy Terraform-managed infrastructure
```

### Initialize Terraform

If you've never run terraform before you will probably need to run `terraform init` in the folder you're working in so terraform can pull down any plugins it needs for your particular project

```bash
$ terraform init

Initializing provider plugins...
- Checking for available provider plugins on https://releases.hashicorp.com...
- Downloading plugin for provider "aws" (1.13.0)...

The following providers do not have any version constraints in configuration,
so the latest version was installed.

To prevent automatic upgrades to new major versions that may contain breaking
changes, it is recommended to add version = "..." constraints to the
corresponding provider blocks in configuration, with the constraint strings
suggested below.

* provider.aws: version = "~> 1.13"

Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.

If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.
```

otherwise you'll get this:

```bash
$ terraform plan
Plugin reinitialization required. Please run "terraform init".
Reason: Could not satisfy plugin requirements.

Plugins are external binaries that Terraform uses to access and manipulate
resources. The configuration provided requires plugins which can't be located,
don't satisfy the version constraints, or are otherwise incompatible.

1 error(s) occurred:

* provider.aws: no suitable version installed
  version requirements: "(any version)"
  versions installed: none

Terraform automatically discovers provider requirements from your
configuration, including providers used in child modules. To see the
requirements and constraints from each module, run "terraform providers".


Error: error satisfying plugin requirements
```

## A Single Instance Deployment

Create a file named `main.tf` with this in it:

```hcl
provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region     = "${var.region}"
}

resource "aws_instance" "single" {
  ami = "ami-2d39803a"
  instance_type = "t2.micro"
}
```

### Terraform Plan

Run `terraform plan` to check what you're intending to provision

```bash
$ terraform plan
Refreshing Terraform state in-memory prior to plan...
The refreshed state will be used to calculate this plan, but will not be
persisted to local or remote state storage.


------------------------------------------------------------------------

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  + aws_instance.example
      id:                           <computed>
      ami:                          "ami-2d39803a"
      associate_public_ip_address:  <computed>
      availability_zone:            <computed>
      ebs_block_device.#:           <computed>
      ephemeral_block_device.#:     <computed>
      get_password_data:            "false"
      instance_state:               <computed>
      instance_type:                "t2.micro"
      ipv6_address_count:           <computed>
      ipv6_addresses.#:             <computed>
      key_name:                     <computed>
      network_interface.#:          <computed>
      network_interface_id:         <computed>
      password_data:                <computed>
      placement_group:              <computed>
      primary_network_interface_id: <computed>
      private_dns:                  <computed>
      private_ip:                   <computed>
      public_dns:                   <computed>
      public_ip:                    <computed>
      root_block_device.#:          <computed>
      security_groups.#:            <computed>
      source_dest_check:            "true"
      subnet_id:                    <computed>
      tenancy:                      <computed>
      volume_tags.%:                <computed>
      vpc_security_group_ids.#:     <computed>


Plan: 1 to add, 0 to change, 0 to destroy.

------------------------------------------------------------------------

Note: You didn't specify an "-out" parameter to save this plan, so Terraform
can't guarantee that exactly these actions will be performed if
"terraform apply" is subsequently run.
```

### Terraform Apply

Now run `terraform apply` to deploy our config

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/eaZK8k095Gc?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

login to your AWS GUI console and see a new EC2 is now up & running

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/KNLv1uw72Zk?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

### Update plan and re-apply

You can update your terraform plan on the fly, and push changes out pretty easily. For example adding the 'tags' section below.

```hcl
provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region     = "${var.region}"
}

resource "aws_instance" "single" {
  ami = "ami-2d39803a"
  instance_type = "t2.micro"

  tags {
    Name = "single"
  }
}
```

re-run `terraform plan` and then `terraform apply`.

check your AWS GUI and your EC2 instance should now have a new tag "Name=single".

## Deploy a Single Web Server

Building on the single server config, we now deploy a single web server with a set-up-webserver one-liner.

Change your `main.tf` to add the `user_data` section like this:

```hcl
resource "aws_instance" "web-1" {
  ami = "ami-2d39803a"
  instance_type = "t2.micro"

  user_data = <<-EOF
              #!/bin/bash
              echo "Hello, World" > index.html
              nohup busybox httpd -f -p 8080 &
              EOF
  tags {
    Name = "single-web"
  }
}
```

the `user_data` section of an AMI bootup is where you bootstrap your EC2 instances with things you want it to provision on boot or startup.

By default AWS does not allow any inbound or outbound traffic to EC2, so we need to create a security group to allow this to enable us to connect to the web server:

**option 1:**

static config hard-coded in

```hcl
resource "aws_security_group" "ec2-web" {
  name = "EC2WebSG"
  ingress {
    from_port = 8080
    to_port = 8080
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

**option 2:**

abstract out the vars and refer to them instead

```hcl
resource "aws_security_group" "ec2-web" {
  name = "EC2WebSG"
  ingress {
    from_port = ${var.inbound_port}
    to_port = ${var.inbound_port}
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

and add the following to your `variables.tf` file:

```hcl
variable "inbound_port" {
  description = "The port the server will use for HTTP requests"
  default = 8080
}
```

Now you need to just change your EC2 `user_data` to use the new security group (i.e. `aws_security_group`)

```hcl
resource "aws_instance" "web-1" {
  ami = "ami-2d39803a"
  instance_type = "t2.micro"
  vpc_security_group_ids = ["${aws_security_group.instance.id}"]

  user_data = <<-EOF
              #!/bin/bash
              echo "Hello, World" > index.html
              nohup busybox httpd -f -p 8080 &
              EOF
  tags {
    Name = "single-web"
  }
}
```

run `terraform plan`, see what we're changing:

```hcl
Terraform will perform the following actions:

  ~ aws_instance.web-1
      vpc_security_group_ids.#:             "" => <computed>

  + aws_security_group.instance
      id:                                   <computed>
      arn:                                  <computed>
      description:                          "Managed by Terraform"
      egress.#:                             <computed>
      ingress.#:                            "1"
      ingress.516175195.cidr_blocks.#:      "1"
      ingress.516175195.cidr_blocks.0:      "0.0.0.0/0"
      ingress.516175195.description:        ""
      ingress.516175195.from_port:          "8080"
      ingress.516175195.ipv6_cidr_blocks.#: "0"
      ingress.516175195.protocol:           "tcp"
      ingress.516175195.security_groups.#:  "0"
      ingress.516175195.self:               "false"
      ingress.516175195.to_port:            "8080"
      name:                                 "EC2WebSG"
      owner_id:                             <computed>
      revoke_rules_on_delete:               "false"
      vpc_id:                               <computed>


Plan: 1 to add, 1 to change, 0 to destroy.

```

perfect. run it (`'terraform apply'`)

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/se7Rlgg8MAE?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

### outputs.tf

handy way to get the public_ip of our `web-1` instance, add a new file `outputs.tf` to your directory.

put this in it:

```hcl
output "public_ip" {
  value = "${aws_instance.web-1.public_ip}"
}

```

_note: make sure the part in between 'aws_instace.' and '.public_ip' matches whatever you've named your EC2 instance to (mine's web-1)._

`terraform apply` will run and grab the public_ip of your instance for you

```hcl
$ terraform apply
aws_instance.single: Refreshing state... (ID: i-05a82498eb5f3177f)
aws_security_group.instance: Refreshing state... (ID: sg-d53a28a3)
aws_instance.web-1: Refreshing state... (ID: i-095ebd5015036ac62)

Apply complete! Resources: 0 added, 0 changed, 0 destroyed.

Outputs:

public_ip = 54.89.22.195
```

have a browse to `https://54.89.22.195:8080` and see the output of the 'index.html' you setup.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/SbMS9ZIhWfg?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

wow, so this took me a while sorting out a few things as I tried to go through this so we'll leave it there today.

In [Part II](terraform-aws-2) we'll deploy a cluster of web servers using Auto Scaling Groups, and fang an Elastic Load Balancer in there as well!

## References

* [terraform - data sources](https://www.terraform.io/docs/configuration/data-sources.html)
* [terraform - input variables](https://www.terraform.io/intro/getting-started/variables.html)
* [terraform init post](http://pinter.org/archives/5831)

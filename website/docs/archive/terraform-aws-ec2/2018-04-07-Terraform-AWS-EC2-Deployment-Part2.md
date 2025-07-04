---
slug: "terraform-aws-2"
title: "Part 2 - Clusters, Launch Config, Auto-Scaling Groups."
---

Over in [Part I](terraform-aws-1) you'll learn why I found myself wanting to learn a few basics of [Terraform](https://www.terraform.io/docs/providers/aws/).

:::info

I'm using @gruntwork's ["Introduction to Terraform"](https://blog.gruntwork.io/an-introduction-to-terraform-f17df9c6d180) because it's clearly written and has nice pictures to go with it.

:::

Continuing...

## Deploy a cluster

A single server is a "single point of failure". Solution? Hit it with the 'cluster' stick. Basically deploy a cluster so if one server dies, your site or application will survive.

There's a few ways to look at 'clustering', these are the 2 that come to mind:

1. EC2's managed by AWS 'Auto Scaling Groups'
2. Docker Containers managed by Swarm (a post for another time)

We could get into a long discussion over a bunch of relevant things, but this really isn't the time for that - this is a post of my 'learning Terraform' notes.

So, we will configure the following:

* A launch configuration
* AWS Auto Scaling Group

:::note

I'm doing things a little differently to gruntwork's blog, for ease of understanding and clarity around what config is being worked I split these blocks of config out into separate files. Makes it easier to separate how each logical block sort of works. For me anyway.

:::

## Launch Configuration

filename: `launch.configuration.tf`

```hcl
# launch configuration

resource "aws_launch_configuration" "LaunchConfiguration" {
  image_id = "ami-2d39803a"
  instance_type = "t2.micro"
  security_groups = ["$\{aws_security_group.instance.id}"]
  user_data = <<-EOF
              #!/bin/bash
              echo "<h1 />CLUSTER: AUTOSCALING GROUPS INSTANCE</h1>" > index.html
              nohup busybox httpd -f -p "$\{var.inbound_port}" &
              EOF
  lifecycle {
    create_before_destroy = true
  }
}

```

key point for this config:

* its just like the EC2 instance config block we've already done
* only adds `lifecycle` block which is required for ASG.
* note `create_before_destroy` enabled here, means it needs to be enabled everywhere 'here' depends on i.e. security groups.

That's it.

## Auto Scaling Group Configuration

filename: `auto.scaling.group.tf`

```hcl
# declare the data source for AZ's

data "aws_availability_zones" "available" {}

# autoscaling group configuration

resource "aws_autoscaling_group" "AutoScalingGroup" {
  launch_configuration = "$\{aws_launch_configuration.LaunchConfiguration.id}"
  availability_zones = ["$\{data.aws_availability_zones.available.names}"]
  min_size = 2
  max_size = 10
  tag {
    key = "Name"
    value = "ASG_EC2-Insance"
    propagate_at_launch = true
  }
}
```

key points for this config:

* the `data` setup for availability zones needs to be declared first before you can refer to it.
* the [terraform availability zones docs](https://www.terraform.io/docs/providers/aws/d/availability_zones.html) is a good source of info.
* make sure your namespaces (probably using this term wrong - but it feels right) "available" lines up with "available.names" i.e. if you use "all" then it will be "all.names".

You've now got a configuration with multiple nodes/destinations. We can't have that.

We need a Load Balancer in front of this configuration to be a single point that distributes the load across the cluster. You need a Load Balancer.

## Add a Elastic Load Balancer

filename: `elastic.load.balancer.tf`

```hcl
resource "aws_elb" "ElasticLoadBalancer" {
  name = "ELBAutoScalingGroup"
  availability_zones = ["$\{data.aws_availability_zones.available.names}"]
  listener {
    lb_port = 80
    lb_protocol = "http"
    instance_port = "$\{var.inbound_port}"
    instance_protocol = "http"
  }
}
```

key points for this config:

* keep the 'name' shorter than 32 characters, or you get this

:::danger Error

Error: aws_elb.elastic_load_balancer: "name" cannot be longer than 32 characters: "ElasticLoadBalancerAutoScalingGroup"

:::

* also needs the `data` availability zones reference
* port 80, no SSL (yet)
* make sure the `"$\{var}"` values match variables.tf

The new ELB is a hop in our network path between CLIENT/USER and SERVER/SERVICE. What does this mean? It means security-wise we need to add another security group. [AWS Security Groups](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-network-security.html#security-group-rules) are how inbound and outbound rules are permitted for instances.

## Update Security Groups : Add ELB to the group

Just add another `aws_security_groups` for the ELB (below).

filename: `security.groups.tf` now looks like this

```hcl
# ec2 security group

resource "aws_security_group" "instance" {
  name = "EC2WebSG"
  ingress {
    from_port = "$\{var.inbound_port}"
    to_port = "$\{var.inbound_port}"
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

# elb security group

resource "aws_security_group" "ELBSecurityGroup" {
  name = "ELBSecurityGroup1"
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

key points on this config:

* nothing new here.. carry on.

## Update Load Balancer Security Group

Make sure your ELB is now using this Security Group so it can be allowed network access where it needs to go

```hcl
resource "aws_elb" "ElasticLoadBalancer" {
  name = "ELBAutoScalingGroup"

  security_groups = ["$\{aws_security_group.ELBSecurityGroup.id}"]

  availability_zones = ["$\{data.aws_availability_zones.available.names}"]
  listener {
    lb_port = 80
    lb_protocol = "http"
    instance_port = "$\{var.inbound_port}"
    instance_protocol = "http"
  }
}
```

## Run the Terraform Plan

Right, now that all the configuration is in place, let's run `terraform plan` to see if TF is all happy with what we're trying to achieve here:

```bash
$ terraform plan
Refreshing Terraform state in-memory prior to plan...
The refreshed state will be used to calculate this plan, but will not be
persisted to local or remote state storage.

data.aws_availability_zones.available: Refreshing state...

------------------------------------------------------------------------

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  + aws_autoscaling_group.AutoScalingGroup
      id:                                     <computed />
      arn:                                    <computed />
      availability_zones.#:                   "6"
      availability_zones.1252502072:          "us-east-1f"
      availability_zones.1305112097:          "us-east-1b"
      availability_zones.2762590996:          "us-east-1d"
      availability_zones.3551460226:          "us-east-1e"
      availability_zones.3569565595:          "us-east-1a"
      availability_zones.986537655:           "us-east-1c"
      default_cooldown:                       <computed />
      desired_capacity:                       <computed />
      force_delete:                           "false"
      health_check_grace_period:              "300"
      health_check_type:                      <computed />
      launch_configuration:                   "$\{aws_launch_configuration.LaunchConfiguration.id}"
      load_balancers.#:                       <computed />
      max_size:                               "10"
      metrics_granularity:                    "1Minute"
      min_size:                               "2"
      name:                                   <computed />
      protect_from_scale_in:                  "false"
      service_linked_role_arn:                <computed />
      tag.#:                                  "1"
      tag.2818487965.key:                     "Name"
      tag.2818487965.propagate_at_launch:     "true"
      tag.2818487965.value:                   "ASG_EC2-Insance"
      target_group_arns.#:                    <computed />
      vpc_zone_identifier.#:                  <computed />
      wait_for_capacity_timeout:              "10m"

  + aws_elb.ElasticLoadBalancer
      id:                                     <computed />
      arn:                                    <computed />
      availability_zones.#:                   "6"
      availability_zones.1252502072:          "us-east-1f"
      availability_zones.1305112097:          "us-east-1b"
      availability_zones.2762590996:          "us-east-1d"
      availability_zones.3551460226:          "us-east-1e"
      availability_zones.3569565595:          "us-east-1a"
      availability_zones.986537655:           "us-east-1c"
      connection_draining:                    "false"
      connection_draining_timeout:            "300"
      cross_zone_load_balancing:              "true"
      dns_name:                               <computed />
      health_check.#:                         <computed />
      idle_timeout:                           "60"
      instances.#:                            <computed />
      internal:                               <computed />
      listener.#:                             "1"
      listener.3931999347.instance_port:      "8080"
      listener.3931999347.instance_protocol:  "http"
      listener.3931999347.lb_port:            "80"
      listener.3931999347.lb_protocol:        "http"
      listener.3931999347.ssl_certificate_id: ""
      name:                                   "ELBAutoScalingGroup"
      security_groups.#:                      <computed />
      source_security_group:                  <computed />
      source_security_group_id:               <computed />
      subnets.#:                              <computed />
      zone_id:                                <computed />

  + aws_instance.SingleEC2
      id:                                     <computed />
      ami:                                    "ami-2d39803a"
      associate_public_ip_address:            <computed />
      availability_zone:                      <computed />
      ebs_block_device.#:                     <computed />
      ephemeral_block_device.#:               <computed />
      get_password_data:                      "false"
      instance_state:                         <computed />
      instance_type:                          "t2.micro"
      ipv6_address_count:                     <computed />
      ipv6_addresses.#:                       <computed />
      key_name:                               <computed />
      network_interface.#:                    <computed />
      network_interface_id:                   <computed />
      password_data:                          <computed />
      placement_group:                        <computed />
      primary_network_interface_id:           <computed />
      private_dns:                            <computed />
      private_ip:                             <computed />
      public_dns:                             <computed />
      public_ip:                              <computed />
      root_block_device.#:                    <computed />
      security_groups.#:                      <computed />
      source_dest_check:                      "true"
      subnet_id:                              <computed />
      tags.%:                                 "1"
      tags.Name:                              "single"
      tenancy:                                <computed />
      volume_tags.%:                          <computed />
      vpc_security_group_ids.#:               <computed />

  + aws_instance.SingleWebEC2
      id:                                     <computed />
      ami:                                    "ami-2d39803a"
      associate_public_ip_address:            <computed />
      availability_zone:                      <computed />
      ebs_block_device.#:                     <computed />
      ephemeral_block_device.#:               <computed />
      get_password_data:                      "false"
      instance_state:                         <computed />
      instance_type:                          "t2.micro"
      ipv6_address_count:                     <computed />
      ipv6_addresses.#:                       <computed />
      key_name:                               <computed />
      network_interface.#:                    <computed />
      network_interface_id:                   <computed />
      password_data:                          <computed />
      placement_group:                        <computed />
      primary_network_interface_id:           <computed />
      private_dns:                            <computed />
      private_ip:                             <computed />
      public_dns:                             <computed />
      public_ip:                              <computed />
      root_block_device.#:                    <computed />
      security_groups.#:                      <computed />
      source_dest_check:                      "true"
      subnet_id:                              <computed />
      tags.%:                                 "1"
      tags.Name:                              "single-web"
      tenancy:                                <computed />
      user_data:                              "bb39081f46f182d0c939da0ddc7f19ebe347546b"
      volume_tags.%:                          <computed />
      vpc_security_group_ids.#:               <computed />

  + aws_launch_configuration.LaunchConfiguration
      id:                                     <computed />
      associate_public_ip_address:            "false"
      ebs_block_device.#:                     <computed />
      ebs_optimized:                          <computed />
      enable_monitoring:                      "true"
      image_id:                               "ami-2d39803a"
      instance_type:                          "t2.micro"
      key_name:                               <computed />
      name:                                   <computed />
      root_block_device.#:                    <computed />
      security_groups.#:                      <computed />
      user_data:                              "7a3ce9d995656c1f1cc3c2b83effb561549ff9d3"

  + aws_security_group.ELBSecurityGroup
      id:                                     <computed />
      arn:                                    <computed />
      description:                            "Managed by Terraform"
      egress.#:                               <computed />
      ingress.#:                              "1"
      ingress.2214680975.cidr_blocks.#:       "1"
      ingress.2214680975.cidr_blocks.0:       "0.0.0.0/0"
      ingress.2214680975.description:         ""
      ingress.2214680975.from_port:           "80"
      ingress.2214680975.ipv6_cidr_blocks.#:  "0"
      ingress.2214680975.protocol:            "tcp"
      ingress.2214680975.security_groups.#:   "0"
      ingress.2214680975.self:                "false"
      ingress.2214680975.to_port:             "80"
      name:                                   "ELBSecurityGroup1"
      owner_id:                               <computed />
      revoke_rules_on_delete:                 "false"
      vpc_id:                                 <computed />

  + aws_security_group.instance
      id:                                     <computed />
      arn:                                    <computed />
      description:                            "Managed by Terraform"
      egress.#:                               <computed />
      ingress.#:                              "1"
      ingress.516175195.cidr_blocks.#:        "1"
      ingress.516175195.cidr_blocks.0:        "0.0.0.0/0"
      ingress.516175195.description:          ""
      ingress.516175195.from_port:            "8080"
      ingress.516175195.ipv6_cidr_blocks.#:   "0"
      ingress.516175195.protocol:             "tcp"
      ingress.516175195.security_groups.#:    "0"
      ingress.516175195.self:                 "false"
      ingress.516175195.to_port:              "8080"
      name:                                   "EC2WebSG"
      owner_id:                               <computed />
      revoke_rules_on_delete:                 "false"
      vpc_id:                                 <computed />


Plan: 7 to add, 0 to change, 0 to destroy.

------------------------------------------------------------------------

Note: You didn't specify an "-out" parameter to save this plan, so Terraform
can't guarantee that exactly these actions will be performed if
"terraform apply" is subsequently run.

```

inspect this and see everything Terraform promises to launch/provision for us!

## References

:::info

* [Terraform - Data Sources](https://www.terraform.io/docs/configuration/data-sources.html)
* [Terraform - Input Variables](https://www.terraform.io/intro/getting-started/variables.html)
* [AWS Security Groups](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-network-security.html#security-group-rules)
* [Terraform  - Availability Zones](https://www.terraform.io/docs/providers/aws/d/availability_zones.html)
* [Terraform - AWS Provider](https://www.terraform.io/docs/providers/aws/)

:::

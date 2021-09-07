---
slug: "terraform-aws-3"
title: "Part 3 - Demos, Testing and Healthchecks."
---

In [Part II](terraform-aws-2) we continued from single web EC2 instance, to an Auto-Scaling Load Balanced cluster of EC2 instances.

:::note

You need the pre-requisites and setup from [Part I](terraform-aws-1) before you can follow along.

:::

## Terraform files

The terraform files you should have to work with are as follows

* `auto.scaling.group.tf`
* `elastic.load.balancer.tf`
* `launch.configuration.tf`
* `output.tf`
* `provider.tf`
* `security.groups.tf`
* `variables.tf`

## Video Example of Launch

The Plan is good, it's time to launch our plan into the Cloud/AWS. 

The bottom screen shows a `watch aws ec2 describe-instance-status` command which shows the moment an EC2 instance is born:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/bEFVLyw-jtk?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

The `output.tf` config had the ELB's public DNS outputted so we can go and connect to it.

## EC2 Cluster of Web Servers

Check everything's launched as we needed and the web servers are serving our web page:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/tqxlnkwOFhE?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Test Auto Scaling Setting

Let's test the Autoscaling Group by killing one instance, and watch ASG launch another instance (remember the minimum acceptable instances is 2):

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/SX7Os5gWoyQ?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

What was new/different from the previous configs? I've noted some of the changes below.

## Added healthchecks

These are cool. It tells the Load Balancer what's a "healthy" number of EC2 instances we want running(2 is the magic number here), sets timeout values and intervals.

```hcl
# elastic.load.balancer.tf
resource "aws_elb" "ElasticLoadBalancer" {
  name = "ELBAutoScalingGroup"
  security_groups = ["${aws_security_group.ELBSecurityGroup.id}"]
  availability_zones = ["${data.aws_availability_zones.available.names}"]

  health_check {
    healthy_threshold = 2
    unhealthy_threshold = 2
    timeout = 3
    interval = 30
    target = "HTTP:${var.inbound_port}/"
  }

  listener {
    lb_port = 80
    lb_protocol = "http"
    instance_port = "${var.inbound_port}"
    instance_protocol = "http"
  }
}
```

## ELB: Healthchecks Targeting EC2's

AWS healthchecks are essentially "pings" to the EC2 endpoints defined by the 'target' parameter.

* '`HTTP`' is the ping protocol
* '`var.inbound_port`' is the ping port
* the ping `PATH` the '/' on the end.

## Interpolating count for EC2 instance names (failed)

Well this failed miserably. I wanted to have each EC2 fire up with a unique name. Need to look into this more, but from the little I've read up on this approach it might not be the way to go.

Anyway, the new changes:

`variables.tf`

```hcl
variable "count" {
  default = 1
}
```

`auto.scaling.group.tf` (note 'tags' not 'tag')

```hcl
tags {
    Name = "${format("ASG-%03d", count.index + 1)}"
    propagate_at_launch = true
}
```

## Conclusion

Overall this was a really good basic steps exercise in getting familiar with the building blocks of Terraform. It's a really great infrastructure management platform and I think one that I'm going to get properly familiar with and I definitely recommend it as part of your DevOps toolchain.

## References

:::info

* [Terraform - Data Sources](https://www.terraform.io/docs/configuration/data-sources.html)
* [Terraform - Input Variables](https://www.terraform.io/intro/getting-started/variables.html)
* [AWS Security Groups](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-network-security.html#security-group-rules)
* [Terraform  - Availability Zones](https://www.terraform.io/docs/providers/aws/d/availability_zones.html)
* [Terraform - AWS Provider](https://www.terraform.io/docs/providers/aws/)

:::
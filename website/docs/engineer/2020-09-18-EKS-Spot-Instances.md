---
layout: single
title: "Notes: Setting up an EKS with Spot Instances using Terraform"
description: >
  The various pain points of setting up Amazon Elastic Kubernetes Service (EKS) on spot instances, using Terraform.
header:
  teaser: /img/amazon-web-services.jpg
categories:
  - AWS
tags:
  - Kubernetes
  - EKS
  - Terraform
toc: true
toc_label: "Table of Contents"
toc_icon: "cog"
comments: true
---

The objective of this post is not to get a fully running AWS EKS cluster running with spot instances, but rather the key "pain points" I run into when trying to spin up this infrastructure using Terraform.

## Overview

I am building:

* 1 x AWS EKS cluster
* using the AWS official 'eks' module
* Spot Instances
* 2 x Worker Groups (nodes)
* Autoscaling Groups
* using Terraform 0.12

## Module: AWS EKS

Using the official EKS terraform module by AWS, looks like this:

```ruby
module "eks" {
  source       = "terraform-aws-modules/eks/aws"
  version      = "12.2.0"
  cluster_name = local.cluster_name
  subnets      = data.terraform_remote_state.vpc.outputs.private_subnets

  tags = {
    Environment = "prod"
  }

  vpc_id = data.terraform_remote_state.vpc.outputs.vpc_id

  worker_groups = [
    {
      name  = "worker-group-1"
      instance_type = local.instance_type
      spot_price = local.spot_price
      asg_desired_capacity = local.asg_desired_capacity
      asg_max_size = local.asg_max_size
      asg_min_size = local.asg_min_size
      additional_security_group_ids = [aws_security_group.worker_group_mgmt_one.id]
      additional_userdata = "worker group config"
      tags = [{
          key = "worker-group-tag"
          value = "worker-group-1"
          propagate_at_launch = true
      }]
    },
    {
      name  = "worker-group-2"
      instance_type = local.instance_type
      spot_price = local.spot_price
      asg_desired_capacity = local.asg_desired_capacity
      asg_max_size = local.asg_max_size
      asg_min_size = local.asg_min_size
      additional_security_group_ids = [aws_security_group.worker_group_mgmt_two.id]
      additional_userdata = "worker group config"
      tags = [{
          key = "worker-group-tag"
          value = "worker-group-2"
          propagate_at_launch = true
      }]
    },
  ]
}
```

Breaking down what's going on here:

### locals

I'm using a `locals` block for cluster specific variables

```ruby
locals{
  cluster_name = "prod-eks-cluster"
  cluster_enabled_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
  asg_desired_capacity = 1
  asg_max_size = 3
  asg_min_size = 1
  instance_type = "m4.large"
  spot_price = "0.20"
}
```

### terraform_remote_state

I'm using `terraform_remote_state` data source to import the state-file of the VPC I created in another folder

```ruby
data "terraform_remote_state" "vpc" {
  backend = "s3"

  config = {
    bucket = "tfstates3"
    key    = "prod/network/terraform.tfstate"
    region  = var.region
  }
}
```

These are the references to the vpc subnets and id

```ruby
subnets      = data.terraform_remote_state.vpc.outputs.private_subnets
vpc_id = data.terraform_remote_state.vpc.outputs.vpc_id
```

Since v0.12 the `.outputs.` part is what calls whatever is defined in the modules `outputs.tf` file for the resources.

_See more details on this below._

### kubernetes provider

make sure you have these 3 resources:

```go
data "aws_eks_cluster" "cluster" {
  name = module.eks.cluster_id
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_id
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
  token                  = data.aws_eks_cluster_auth.cluster.token
  load_config_file       = false
  version                = "~> 1.11"
}
```

otherwise you'll see this error near end of EKS setup

```sh
...
module.eks.aws_autoscaling_group.workers[1]: Creation complete after 1m50s [id=prod-eks-cluster-worker-group-220200917111118233900000009]

Error: Post "https://prod-bc5a71e2.hcp.australiaeast.azmk8s.io:443/api/v1/namespaces/kube-system/configmaps": dial tcp: lookup prod-bc5a71e2.hcp.australiaeast.azmk8s.io on 127.0.0.53:53: no such host

  on .terraform/modules/eks/aws_auth.tf line 64, in resource "kubernetes_config_map" "aws_auth":
  64: resource "kubernetes_config_map" "aws_auth" {
...
```

### worker_groups

Self-explanatory, you can define however many "worker groups" you want (I think). In here you will define the autoscaling min, max, desired instances, and instance type (`m4.large` is the smallest type you can use with errors), and spot instance bid price (0.20).

```js
  worker_groups = [
    {
      name  = "worker-group-1"
      instance_type = local.instance_type
      spot_price = local.spot_price
      asg_desired_capacity = local.asg_desired_capacity
      asg_max_size = local.asg_max_size
      asg_min_size = local.asg_min_size
      additional_security_group_ids = [aws_security_group.worker_group_mgmt_one.id]
      additional_userdata = "worker group config"
      tags = [{
          key = "worker-group-tag"
          value = "worker-group-1"
          propagate_at_launch = true
      }]
    },
```

The security groups referenced in `additional_security_group_ids = [aws_security_group.worker_group_mgmt_one.id]` (list), is in another `security.tf` and basically sets up all nodes to open port 22 from specific `cidr_blocks`.

## Terraform: Remote State Files

If you have the "best practice" setup of having each component/section of your infrastructure layout in separate folders e.g. eks in one folder, vpc in another -- and they have their own state files, which means they can't just reference each other.

The solution is using `terraform_remote_state` data source.

In your VPC module, your remote state file key looks like this:

```go
terraform {
  backend "s3" {
    key       = "prod/vpc/terraform.tfstate"
  }
}
```

to use this in another folder which builds your EKS infrastructure, you need this reference:

```go
data "terraform_remote_state" "vpc" {
  backend = "s3"

  config = {
    bucket = "tfstates3"
    key    = "prod/vpc/terraform.tfstate" # references the VPC statefile 'key'
    region = "us-east-2"
  }
}
```

and now you can call the VPC modules `outputs` like this:

```go
module "eks" {
  source       = "terraform-aws-modules/eks/aws"
  version      = "12.2.0"
  cluster_name = local.cluster_name
  subnets      = data.terraform_remote_state.vpc.outputs.private_subnets

  tags = {
    Environment = "prod"
  }

  vpc_id = data.terraform_remote_state.vpc.outputs.vpc_id
```

your VPC `outputs.tf` file needs to have the corresponding outputs e.g.

```go
output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc_id
}

output "private_subnets" {
  description = "List of IDs of private subnets"
  value       = module.vpc.private_subnets
}
```

## CLI: aws-cli and kubectl

`kubectl` needs your aws-cli to be able to find the same aws user you used to create the EKS cluster i.e. either your 'default' `~/.aws/credentials` profile is the `terraform` one you used as environment variable credentials to run `terraform apply` OR you just have a default `[default]` block that has the same credentials.

This is the error you see when aws can't find the terraform aws creds

from your terraform outout...

```sh
Error: Error running command 'aws eks --region us-west-2 update-kubeconfig --name prod-eks-cluster': exit status 255. Output: 
An error occurred (ResourceNotFoundException) when calling the DescribeCluster operation: No cluster found for name: prod-eks-cluster.
```

to trying to update your local kubeconfig file via `aws` command

```sh
$ aws eks --region us-west-2 update-kubeconfig --name prod-eks-cluster
Unable to locate credentials. You can configure credentials by running "aws configure".
```

to running kubectl with `--kubeconfig` on the kubeconfig file that was outputted by terraform to make a call to the EKS cluster

```sh
$ kubectl --kubeconfig ./kubeconfig_prod-eks-cluster get nodes
could not get token: NoCredentialProviders: no valid providers in chain. Deprecated.
  For verbose messaging see aws.Config.CredentialsChainVerboseErrors
```

The solution was to add the `[default]` block to `~/.aws/credentials` and voila:

```sh
kubectl --kubeconfig ./kubeconfig_prod-eks-cluster get nodes
NAME                                       STATUS   ROLES    AGE     VERSION
ip-10-0-1-130.us-east-2.compute.internal   Ready    <none>   4m56s   v1.16.13-eks-2ba888
ip-10-0-3-180.us-east-2.compute.internal   Ready    <none>   4m53s   v1.16.13-eks-2ba888
```

and configure `kubectl`

```sh
 aws eks --region us-east-2 update-kubeconfig --name prod-eks-cluster
Added new context arn:aws:eks:us-east-2:000000000000:cluster/prod-eks-cluster to /home/user/.kube/config
```

run it

```sh
kubectl get nodes
NAME                                       STATUS   ROLES    AGE   VERSION
ip-10-0-1-130.us-east-2.compute.internal   Ready    <none>   32m   v1.16.13-eks-2ba888
ip-10-0-3-180.us-east-2.compute.internal   Ready    <none>   32m   v1.16.13-eks-2ba888
```

## IAM: minimum permissions

When you create a user for `terraform` to be able to create your EKS infrastructure, the bare minimum permissions you need to assign, as a policy, to your user is the following:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "autoscaling:AttachInstances",
                "autoscaling:CreateAutoScalingGroup",
                "autoscaling:CreateLaunchConfiguration",
                "autoscaling:CreateOrUpdateTags",
                "autoscaling:DeleteAutoScalingGroup",
                "autoscaling:DeleteLaunchConfiguration",
                "autoscaling:DeleteTags",
                "autoscaling:Describe*",
                "autoscaling:DetachInstances",
                "autoscaling:SetDesiredCapacity",
                "autoscaling:UpdateAutoScalingGroup",
                "autoscaling:SuspendProcesses",
                "ec2:AllocateAddress",
                "ec2:AssignPrivateIpAddresses",
                "ec2:Associate*",
                "ec2:AttachInternetGateway",
                "ec2:AttachNetworkInterface",
                "ec2:AuthorizeSecurityGroupEgress",
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:CreateDefaultSubnet",
                "ec2:CreateDhcpOptions",
                "ec2:CreateEgressOnlyInternetGateway",
                "ec2:CreateInternetGateway",
                "ec2:CreateNatGateway",
                "ec2:CreateNetworkInterface",
                "ec2:CreateRoute",
                "ec2:CreateRouteTable",
                "ec2:CreateSecurityGroup",
                "ec2:CreateSubnet",
                "ec2:CreateTags",
                "ec2:CreateVolume",
                "ec2:CreateVpc",
                "ec2:DeleteDhcpOptions",
                "ec2:DeleteEgressOnlyInternetGateway",
                "ec2:DeleteInternetGateway",
                "ec2:DeleteNatGateway",
                "ec2:DeleteNetworkInterface",
                "ec2:DeleteRoute",
                "ec2:DeleteRouteTable",
                "ec2:DeleteSecurityGroup",
                "ec2:DeleteSubnet",
                "ec2:DeleteTags",
                "ec2:DeleteVolume",
                "ec2:DeleteVpc",
                "ec2:DeleteVpnGateway",
                "ec2:Describe*",
                "ec2:DetachInternetGateway",
                "ec2:DetachNetworkInterface",
                "ec2:DetachVolume",
                "ec2:Disassociate*",
                "ec2:ModifySubnetAttribute",
                "ec2:ModifyVpcAttribute",
                "ec2:ModifyVpcEndpoint",
                "ec2:ReleaseAddress",
                "ec2:RevokeSecurityGroupEgress",
                "ec2:RevokeSecurityGroupIngress",
                "ec2:UpdateSecurityGroupRuleDescriptionsEgress",
                "ec2:UpdateSecurityGroupRuleDescriptionsIngress",
                "ec2:CreateLaunchTemplate",
                "ec2:CreateLaunchTemplateVersion",
                "ec2:DeleteLaunchTemplate",
                "ec2:DeleteLaunchTemplateVersions",
                "ec2:DescribeLaunchTemplates",
                "ec2:DescribeLaunchTemplateVersions",
                "ec2:GetLaunchTemplateData",
                "ec2:ModifyLaunchTemplate",
                "ec2:RunInstances",
                "eks:CreateCluster",
                "eks:DeleteCluster",
                "eks:DescribeCluster",
                "eks:ListClusters",
                "eks:UpdateClusterConfig",
                "eks:UpdateClusterVersion",
                "eks:DescribeUpdate",
                "eks:TagResource",
                "eks:UntagResource",
                "eks:ListTagsForResource",
                "eks:CreateFargateProfile",
                "eks:DeleteFargateProfile",
                "eks:DescribeFargateProfile",
                "eks:ListFargateProfiles",
                "eks:CreateNodegroup",
                "eks:DeleteNodegroup",
                "eks:DescribeNodegroup",
                "eks:ListNodegroups",
                "eks:UpdateNodegroupConfig",
                "eks:UpdateNodegroupVersion",
                "iam:AddRoleToInstanceProfile",
                "iam:AttachRolePolicy",
                "iam:CreateInstanceProfile",
                "iam:CreateOpenIDConnectProvider",
                "iam:CreateServiceLinkedRole",
                "iam:CreatePolicy",
                "iam:CreatePolicyVersion",
                "iam:CreateRole",
                "iam:DeleteInstanceProfile",
                "iam:DeleteOpenIDConnectProvider",
                "iam:DeletePolicy",
                "iam:DeleteRole",
                "iam:DeleteRolePolicy",
                "iam:DeleteServiceLinkedRole",
                "iam:DetachRolePolicy",
                "iam:GetInstanceProfile",
                "iam:GetOpenIDConnectProvider",
                "iam:GetPolicy",
                "iam:GetPolicyVersion",
                "iam:GetRole",
                "iam:GetRolePolicy",
                "iam:List*",
                "iam:PassRole",
                "iam:PutRolePolicy",
                "iam:RemoveRoleFromInstanceProfile",
                "iam:TagRole",
                "iam:UntagRole",
                "iam:UpdateAssumeRolePolicy",
                // Following permissions are needed if cluster_enabled_log_types is enabled
                "logs:CreateLogGroup",
                "logs:DescribeLogGroups",
                "logs:DeleteLogGroup",
                "logs:ListTagsLogGroup",
                "logs:PutRetentionPolicy",
                // Following permissions for working with secrets_encryption example
                "kms:CreateGrant",
                "kms:CreateKey",
                "kms:DescribeKey",
                "kms:GetKeyPolicy",
                "kms:GetKeyRotationStatus",
                "kms:ListResourceTags",
                "kms:ScheduleKeyDeletion"
            ],
            "Resource": "*"
        }
    ]
}
```

As long as your AWS user has this policy attached, it will be able to create all the resources EKS requires.

That's it for now, I'll update this if I come across any more pain points.

## References

* [https://github.com/terraform-aws-modules/terraform-aws-eks/blob/master/docs/iam-permissions.md](https://github.com/terraform-aws-modules/terraform-aws-eks/blob/master/docs/iam-permissions.md)

---
title: "AWS EKS Creating Clusters"
---

:::tip

IAM user needs following permissions: `EKS`, `IAM`, `CloudFormation`, `VPC`.

:::

This document prescribes how to create an AWS EKS Cluster using the AWS console, and AWS cli too.

An EKS cluster is basically setup in TWO parts: the Cluster part (IAM and create control plane), the managed Node part (IAM and create managed nodes).

## AWS Console

:::note Documentation

Reference: [EKS User Guide: Create Cluster](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html)

:::

### Pre-requisites

- VPC
- `aws cli`
- `kubectl` i.e. `curl -O https://s3.us-west-2.amazonaws.com/amazon-eks/1.27.1/2023-04-19/bin/linux/amd64/kubectl` for Linux

You need to set a few things up first before you create your EKS Cluster, and Node Groups.

First, you need a EKS compatible [VPC](https://docs.aws.amazon.com/eks/latest/userguide/creating-a-vpc.html) via **CloudFormation**.

1. Go to [https://console.aws.amazon.com/cloudformation/](https://console.aws.amazon.com/cloudformation/).
2. Create stack:
   1. Template is ready
   2. Amazon S3 URL = `https://s3.us-west-2.amazonaws.com/amazon-eks/cloudformation/2020-10-29/amazon-eks-vpc-private-subnets.yaml` (creates public & private subnet VPC)
3. Click through until `Submit`

You have a VPC - private subs for Nodes, public subs for LBs to Nodes.

Now you need to create TWO IAM Roles.

### IAM Role - Cluster

This is the IAM Role for EKS to use to work with the cluster.

1. Go to [https://us-east-1.console.aws.amazon.com/iamv2/home](https://us-east-1.console.aws.amazon.com/iamv2/home)
2. Create Role,
3. Trusted entity type: `AWS Service`
4. Use case: EKS, EKS - Cluster
5. Add Permissions: `AmazonEKSClusterPolicy`
6. Role name: `AmazonEKSClusterRole`
7. Check Select trusted entities looks like this:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": [
                    "eks.amazonaws.com"
                ]
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```

Done.

### IAM Role - Node Group

:::note Documentation

Reference: [EKS User Guide: Create Node Role](https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html)

:::

1. Go to [https://us-east-1.console.aws.amazon.com/iamv2/home](https://us-east-1.console.aws.amazon.com/iamv2/home)
2. Create a new role name `AmazonEKSNodeGroupRole`.
3. Find & Attach the following policies:
   1. `AmazonEKSWorkerNodePolicy`
   2. `AmazonEC2ContainerRegistryReadOnly`
   3. `AmazonEKS_CNI_Policy`

### Create EKS Cluster

1. go to [https://ap-southeast-2.console.aws.amazon.com/eks/home?region=ap-southeast-2#/cluster-create](https://ap-southeast-2.console.aws.amazon.com/eks/home?region=ap-southeast-2#/cluster-create)
2. create a cluster
3. add Name, Kubernetes version, select cluster role `AmazonEKSClusterRole` ![create cluster](/img/aws-eks-1.png)
4. Next, select the VPC from the pre-reqs, created by cloudformation ![cluster networking](/img/aws-eks-2.png)
   1. select ALL subnets.
   2. select Security Group from the VPC created by cloudformation.
   3. cluster endpoint access = "Public and private" ![cluster endpoint](/img/aws-eks-3.png)
5. Next, Add-ons you should see ![cluster add-ons](/img/aws-eks-4.png)
   1. kube-proxy
   2. CoreDNS
   3. Amazon VPC CNI
6. Next, Next, Create.

Wait for your cluster to become active, then onto creating the node groups (data plane).

### Create Node Groups

1. go to your cluster
2. go to `Compute`
3. go down to `Node groups` and click `Add node group` ![node group](/img/aws-eks-5.png)
4. create a name, and select the `AmazonEKSNodeGroupRole` for Node IAM role. ![node group role](/img/aws-eks-6.png)
5. Next, choose your AMI and instance settings.
6. Next, because we have both public & private subnets, de-select public subnets we are deploying Nodes to private subnets only. ![node networking](/img/aws-eks-8.png)
7. Next, **Create**.

When your nodes are ready in EC2, you'll see them and the Node group ready here: ![node group](/img/aws-eks-9.png)

### Setup kubeconfig

1. configure your `aws cli` with access key, secret for your user.
2. run `aws eks update-kubeconfig --region region-code --name my-cluster` i.e. `aws eks update-kubeconfig --region ap-southeast-2 --name astro-test-cluster` ![kubeconfig](/img/aws-eks-10.png)

and voila, you have a running and cli-accessible EKS cluster:

![EKS cluster](/img/aws-eks-11.png)

## AWS CLI

The quick version of running everything from the `aws cli`, you can choose to install via [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) that's another option.

I assume you have the prerequisites installed, so we'll just run over the commands for each section covered in the console version.

### VPC from cloudformation

```bash
aws cloudformation create-stack \
  --region region-code \
  --stack-name my-eks-vpc-stack \
  --template-url https://s3.us-west-2.amazonaws.com/amazon-eks/cloudformation/2020-10-29/amazon-eks-vpc-private-subnets.yaml
```

### IAM Roles & Cluster

Create JSON with the EKS trust policy:

```json
cat >eks-cluster-role-trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
```

1. create `AmazonEKSClusterRole` by running command: `aws iam create-role --role-name AmazonEKSClusterRole --assume-role-policy-document file://"eks-cluster-role-trust-policy.json"`
2. attach policy : `aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/AmazonEKSClusterPolicy --role-name AmazonEKSClusterRole`

### IAM Roles & Nodes

This is the node role trust policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

1. create `AmazonEKSNodeGroupRoles` by running command: `aws iam create-role --role-name AmazonEKSNodeGroupRole --assume-role-policy-document file://"node-role-trust-policy.json"`
2. attach the 3 x policies:

```bash
aws iam attach-role-policy \
  --policy-arn arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy \
  --role-name AmazonEKSNodeGroupRole
aws iam attach-role-policy \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly \
  --role-name AmazonEKSNodeGroupRole
aws iam attach-role-policy \
  --policy-arn arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy \
  --role-name AmazonEKSNodeGroupRole
```

## Credits

- big s/o to Kavitha Suresh Kumar [video](https://www.youtube.com/watch?v=KxxgF-DAGWc&ab_channel=KavithaSureshKumar) for a great video that quickly cuts through the process.
- AWS Documentation as noted above.

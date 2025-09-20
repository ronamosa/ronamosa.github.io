---
title: "AWS EKS Workshop - Complete Kubernetes Container Orchestration Guide"
description: "Comprehensive walkthrough of the AWS EKS Workshop covering Kubernetes networking, VPC CNI, network policies, and cluster management on Amazon EKS."
keywords: ["aws eks", "kubernetes", "eks workshop", "container orchestration", "vpc cni", "network policies", "aws networking", "k8s cluster"]
tags: ["aws", "eks", "kubernetes", "workshop", "networking"]
sidebar_position: 1
---

:::tip

Going through ['EKS Workshop'](https://www.eksworkshop.com/)

:::

## Networking

### Amazon VPC Container Network Interface (CNI)

EKS has TWO VPCs

1. (AWS) Managed Kubernetes Control Plane
2. (Customer) Data Plane, Worker Nodes, Containers

Requirement:

1. minimum 2 subnets
2. at least 2 AZs

EKS (Control Plane) uses "EKS-managed" ENI to talk to the Data Plane.

#### LAB: Network Policies

install `eksctl`:

```bash
# for ARM systems, set ARCH to: `arm64`, `armv6` or `armv7`
ARCH=amd64
PLATFORM=$(uname -s)_$ARCH

curl -sLO "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$PLATFORM.tar.gz"

# (Optional) Verify checksum
curl -sL "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_checksums.txt" | grep $PLATFORM | sha256sum --check

tar -xzf eksctl_$PLATFORM.tar.gz -C /tmp && rm eksctl_$PLATFORM.tar.gz

sudo mv /tmp/eksctl /usr/local/bin
```

Cluster setup from labs:

```bash
export EKS_CLUSTER_NAME=eks-workshop
export AWS_REGION=ap-southeast-2
curl -fsSL https://raw.githubusercontent.com/aws-samples/eks-workshop-v2/stable/cluster/eksctl/cluster.yaml | \
envsubst | eksctl create cluster -f -
```

```bash
eksctl create cluster \
  --name eksworkshop-cluster \
  --version 1.30.1 \
  --region ap-southeast-2 \
  --nodegroup-name eksworkshop-nodes \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 4 \
  --managed
```

:::tip kubeconfig

get `~/.kube/config` file from EKS, run: `aws eks update-kubeconfig --name eksworkshop-cluster`

:::

---
title: "AWS EKS Workshop"
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

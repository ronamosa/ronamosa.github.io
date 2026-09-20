---
title: "AWS Guides: EKS, ECS, Incident Response & Amplify Debugging"
description: "Twelve AWS guides covering EKS cluster setup and networking, ECS workshops, security incident response, and the Amplify bugs that took longest to find."
keywords: ["aws", "eks", "ecs", "kubernetes on aws", "amplify", "incident response", "cloudfront", "container orchestration"]
tags: ["aws", "eks", "ecs", "cloud", "kubernetes"]
sidebar_position: 0
---

# AWS

Container orchestration, security response, and production debugging on AWS.

## ⎈ EKS — Kubernetes on AWS

- **[EKS Workshop](./eks-workshop)** — the full walkthrough, start here
- [EKS Cluster Creation](./eks-create-clusters) — building a cluster from scratch
- [EKS Networking Best Practices](./eks-networking) — VPC CNI and container networking

## 📦 ECS — Container Service

A four-part workshop series, in order:

1. [Microservices on ECS](./ecs-1-microservices) — service architecture
2. [Monitoring](./ecs-2-monitoring) — CloudWatch, Container Insights, Prometheus
3. [Capacity Providers](./ecs-3-capacity-providers) — auto scaling and Spot instances
4. [Cats and Dogs](./ecs-cats-n-dogs) — the worked microservices example

## 🔒 Security

- **[AWS Security Incident Response](./aws-incident-response)** — cloud forensics and IR procedure

## 🐛 Production Debugging

Two bugs worth the write-up:

- **[NextAuth Session Caching Bug](./amplify-nextauth-session-caching-bug)** — how CloudFront gave every visitor the same login
- [Debugging Amplify SSR IAM Roles](./amplify-ssr-iam-debugging) — chasing "unable to assume IAM role"

## 🎤 Workshops & Talks

- [UPNG AWS Workshops](/docs/upng/) — material for University of Papua New Guinea
- [Cloud Demo Notes](./cloud-demo-notes) — TechNesian live stream

---

Certification notes for [SAA-C03](/docs/study/SAA-03/aws-solutions-architect-associate-study-guide/) and [Security Specialty](/docs/study/SCS-C01/) are in **[Study](/docs/study/)**. Other clouds: [Azure](/docs/engineer/Azure/), [GCP](/docs/engineer/GCP/).

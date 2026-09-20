---
title: "Engineering Guides: Cloud, Kubernetes, AI Infrastructure & Homelab"
description: "76 field-tested engineering guides covering AWS, Azure, GCP, Kubernetes, LLM deployment, and homelab automation — written from real builds and real failures."
keywords: ["cloud engineering", "aws guides", "kubernetes", "terraform", "proxmox", "llm deployment", "devops", "homelab"]
tags: ["engineering", "cloud", "kubernetes", "infrastructure", "ai"]
sidebar_position: 0
slug: /engineer
---

# Engineer

Everything here was built, broken, or debugged first — then written down. Cloud platforms, container orchestration, AI infrastructure, and the homelab that most of it gets tested on.

Two areas have grown big enough to have their own hubs:

- **[AI & Machine Learning](/docs/engineer/AI/)** — 21 guides on LLM deployment, RAG, agents, and running models privately
- **[Home Lab Infrastructure](/docs/engineer/LAB/)** — 17 guides on Proxmox, Pi-hole, network segmentation, and Linux desktop

## ☁️ Cloud Platforms

### AWS

Container orchestration, incident response, and the Amplify bugs that cost the most time.

- [AWS EKS Workshop](/docs/engineer/AWS/eks-workshop/) — end-to-end Kubernetes on EKS
- [EKS Cluster Creation](/docs/engineer/AWS/eks-create-clusters/) — cluster setup from scratch
- [EKS Networking Best Practices](/docs/engineer/AWS/eks-networking/) — VPC CNI and container networking
- [ECS Microservices Workshop](/docs/engineer/AWS/ecs-1-microservices/) — service architecture on ECS
- [ECS Monitoring](/docs/engineer/AWS/ecs-2-monitoring/) — CloudWatch, Container Insights, Prometheus
- [ECS Capacity Providers](/docs/engineer/AWS/ecs-3-capacity-providers/) — auto scaling and Spot
- [ECS Cats and Dogs](/docs/engineer/AWS/ecs-cats-n-dogs/) — microservices walkthrough
- [AWS Security Incident Response](/docs/engineer/AWS/aws-incident-response/) — cloud forensics and IR
- [NextAuth Session Caching Bug](/docs/engineer/AWS/amplify-nextauth-session-caching-bug/) — how CloudFront gave everyone the same login
- [Debugging Amplify SSR IAM Roles](/docs/engineer/AWS/amplify-ssr-iam-debugging/) — "unable to assume IAM role"
- [Cloud Demo Notes](/docs/engineer/AWS/cloud-demo-notes/) — TechNesian live stream
- [UPNG AWS Workshops](/docs/upng/) — workshop material for University of Papua New Guinea

### Azure

- [AKS Setup Part 1: Cluster Creation](/docs/engineer/Azure/2019-01-28-Azure-Kubernetes-up-and-running-1/)
- [AKS Setup Part 2: Application Deployment](/docs/engineer/Azure/2019-02-04-Azure-Kubernetes-up-and-running-2/)
- [AKS Setup Part 3: Monitoring, Scaling, Security](/docs/engineer/Azure/2019-02-04-Azure-Kubernetes-up-and-running-3/)
- [AKS + Azure AD Integration](/docs/engineer/Azure/2020-09-27-AKS-AzureAD-Integration-2020/) — Kubernetes RBAC with Azure AD
- [SonarQube on AKS with Azure Disk](/docs/engineer/Azure/2019-07-20-Sonarqube-AzureDisk-PersistentVolume/) — Helm and persistent volumes
- [Breaking a Terraform State Lock](/docs/engineer/Azure/2019-02-12-Azure-Terraform-Lease-Break/) — Azure Blob lease management

### GCP

- [Ambassador API Gateway on GCP](/docs/engineer/GCP/2019-11-27-GCP-Install-Ambassador-Helm2/)
- [Compute Engine SSH with OS Login](/docs/engineer/GCP/2020-05-25-GCE-OS-Login-VM/)

## ⎈ Kubernetes

Service mesh, secrets, and package management — the parts that bite after the cluster is up.

- [Helm 3 Complete Guide](/docs/engineer/K8s/2019-11-11-Helm-3-Kubernetes-Package-Manager/)
- [Istio mTLS with SDS and Cert-Manager](/docs/engineer/K8s/2020-03-06-Istio-SDS-Cert-Manager/)
- [Istio mTLS with External Endpoints](/docs/engineer/K8s/2020-04-08-Istio-MTLS-with-External-Endpoint/) — egress gateway config
- [SecretHub Secrets Management](/docs/engineer/K8s/2020-08-17-Secrethub-Secret-Management/)
- [Ambassador TLS Hardening](/docs/engineer/K8s/2019-07-09-Ambassador-Disable-TLS1/) — disabling TLS 1.0 and 1.1

## 🛠 Projects

Things built end to end, with the decisions and the data behind them.

- [AWS YouTube Transcript Analyser](/docs/aws-youtube-transcripts/) — Lambda, DynamoDB, Transcribe
- [Discord Bot: Camera's On](/docs/engineer/Projects/DiscordBotCameraOn/) — enforcing video policy with a bot
- [Tuning a Discord Tier System From Data, Not Vibes](/docs/engineer/Projects/data-driven-tier-thresholds/)
- [Microservices Project](/docs/engineer/Projects/microservices/) — containerised service architecture
- [Personal AI](/docs/engineer/Projects/personal-ai/) — private offline assistant

## 📘 Guides & Debugging Notes

Standalone fixes, setups, and post-mortems.

- [KLV Metadata Loss in MPEG-TS](/docs/engineer/guides/klv-investigation-postmortem/) — a one-byte PES header bug, found with PyAV and ffmpeg
- [Chrome ERR_ADDRESS_UNREACHABLE on macOS 26](/docs/engineer/guides/chrome-macos26-local-network-eaddrunreach/) — local network enforcement vs code-sign clone identity
- [Algorithms for Systems Design](/docs/engineer/guides/algos-system-design/) — scalable architecture patterns
- [Computer Science Fundamentals](/docs/engineer/guides/bits-bytes-hex/) — bits, bytes, hex, memory
- [Docusaurus GitHub Pages Deployment](/docs/engineer/guides/docusaurus-setup/)
- [Algolia Search for Docusaurus](/docs/engineer/guides/docusaurus-algolia-search/) — with Cloudflare CDN
- [Beehiiv Custom Domain with Cloudflare](/docs/engineer/guides/beehiiv-dns/)
- [Linux Terminal on a Chromebook](/docs/engineer/guides/chromebook-terminal/)
- [iPhone Photo Backup to Linux](/docs/engineer/guides/iphone-to-linux-mount/) — no iTunes required
- [Brother MFC-J4330DW on Linux](/docs/engineer/guides/Linux-Printer-Driver/) — driver installation

## Where to start

New here and want the highest-signal entry points:

1. **[Proxmox Homelab Guide](/docs/engineer/LAB/proxmox-hub/)** — Cloud-Init, Packer, Terraform, LVM. The most complete build on the site.
2. **[AWS EKS Workshop](/docs/engineer/AWS/eks-workshop/)** — if you want Kubernetes on cloud infrastructure.
3. **[AI & ML Hub](/docs/engineer/AI/)** — if you're deploying models rather than clusters.

Adjacent sections: **[Hacker](/docs/hacker/)** for offensive security and CTFs, **[Study](/docs/study/)** for certification notes, **[Archive](/docs/archive/)** for pre-2021 material.

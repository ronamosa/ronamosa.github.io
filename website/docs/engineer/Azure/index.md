---
title: "Azure Guides: AKS Setup, Azure AD Integration & Terraform State"
description: "Six Azure guides — a three-part AKS build, Azure AD integration with Kubernetes RBAC, SonarQube on persistent volumes, and breaking a stuck Terraform state lock."
keywords: ["azure", "aks", "azure kubernetes service", "azure ad", "terraform", "sonarqube", "rbac"]
tags: ["azure", "aks", "kubernetes", "terraform", "cloud"]
sidebar_position: 0
---

# Azure

Azure Kubernetes Service, identity integration, and the state-lock problem everyone hits once.

## ⎈ AKS — Azure Kubernetes Service

A three-part build, in order:

1. [Part 1 — Cluster Creation and Configuration](./2019-01-28-Azure-Kubernetes-up-and-running-1)
2. [Part 2 — Application Deployment and Services](./2019-02-04-Azure-Kubernetes-up-and-running-2)
3. [Part 3 — Monitoring, Scaling, and Security](./2019-02-04-Azure-Kubernetes-up-and-running-3)

## 🔐 Identity & Access

- **[AKS + Azure AD Integration](./2020-09-27-AKS-AzureAD-Integration-2020)** — wiring Kubernetes RBAC to Azure AD

## 💾 Storage & Tooling

- [SonarQube on AKS with Azure Disk](./2019-07-20-Sonarqube-AzureDisk-PersistentVolume) — Helm chart and persistent volumes
- [Breaking a Terraform State Lock](./2019-02-12-Azure-Terraform-Lease-Break) — Azure Blob lease management when state is stuck

---

Other clouds: [AWS](/docs/engineer/AWS/), [GCP](/docs/engineer/GCP/). Platform-neutral Kubernetes work is in [K8s](/docs/engineer/K8s/).

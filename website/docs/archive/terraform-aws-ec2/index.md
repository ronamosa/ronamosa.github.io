---
title: "Terraform on AWS EC2: Accounts, Auto-Scaling and Healthchecks"
description: "A three-part Terraform series building from a single EC2 deployment to clusters with launch configs, auto-scaling groups, healthchecks and tested failover."
keywords: ["terraform", "aws ec2", "auto scaling groups", "launch configuration", "infrastructure as code", "healthchecks"]
tags: ["archive", "terraform", "aws", "ec2", "iac"]
sidebar_position: 0
---

# Terraform on AWS EC2

Building up from one instance to an auto-scaling cluster, in three parts.

:::caution Historical record
Written against an early Terraform version. Launch configurations have since been superseded by launch templates, and the HCL syntax has changed. The progression still holds; the syntax doesn't.
:::

1. **[Part 1 — Accounts, Single Deployment](./terraform-aws-1)** — account setup and one instance
2. **[Part 2 — Clusters, Launch Config, Auto-Scaling Groups](./terraform-aws-2)** — scaling out
3. **[Part 3 — Demos, Testing and Healthchecks](./terraform-aws-3)** — proving it actually recovers

---

Back to the **[Archive](/docs/archive/)**. Current Terraform work is in the [Home Lab hub](/docs/engineer/LAB/) — see [Terraform Proxmox Provider](/docs/engineer/LAB/proxmox-terraform/).

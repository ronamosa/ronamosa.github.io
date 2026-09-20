---
title: "Archive: Infrastructure Notes from 2016–2020"
description: "Pre-2021 infrastructure notes — Docker, Jenkins, Cisco ASA, FreeNAS, early Terraform and EKS. Kept as-is for the historical record, not as current advice."
keywords: ["docker", "jenkins", "cisco asa", "freenas", "terraform", "eks", "infrastructure history", "sysadmin"]
tags: ["archive", "docker", "infrastructure", "networking", "legacy"]
sidebar_position: 0
slug: /archive
---

# Archive

Work from 2016 to 2020, kept exactly as written.

:::caution Historical record
These notes reflect tooling and versions from the year they were written. Docker, Terraform, and EKS have all changed substantially since. Read them for the reasoning and the troubleshooting path, not for current syntax. Anything still maintained lives in **[Engineer](/docs/engineer/)**.
:::

## 🐳 Docker & CI/CD

- [Docker Private Registry 1.0](/docs/archive/2017-01-20-Docker-Private-Registry_v1.0/) — the trusted registry era
- [Docker Private Registry 2.0](/docs/archive/2017-10-13-Docker_Private_Registry_v2.0/) — the rewrite
- [Troubleshooting Docker Volume Errors](/docs/archive/2017-06-09-Docker-volumes-no-such-file-ISSUE/) — "no such file"
- [Docker Permission Issues on a Jenkins Pipeline](/docs/archive/2017-06-20-Docker-Jenkins-Pipeline-permission-ISSUES/)
- [Jenkins Server on CentOS 7](/docs/archive/2017-10-21-Jenkins_Setup_CentOS7/)
- [Fortinet VPN in a Container](/docs/archive/2018-04-13-Docker-Remote-Work-Fortinet/) — remote work, the hard way

### Dockerised WordPress (3 parts)

- [Part 1 — Architecture, Database, Infrastructure](/docs/archive/docker-wordpress/docker-wordpress-1/)
- [Part 2 — Provisioning with Ansible](/docs/archive/docker-wordpress/docker-wordpress-2/)
- [Part 3 — NGINX SSL Frontend, Compose, Demo](/docs/archive/docker-wordpress/docker-wordpress-3/)

## ☁️ Early Cloud & IaC

### Terraform on AWS EC2 (3 parts)

- [Part 1 — Accounts, Single Deployment](/docs/archive/terraform-aws-ec2/terraform-aws-1/)
- [Part 2 — Clusters, Launch Config, Auto-Scaling Groups](/docs/archive/terraform-aws-ec2/terraform-aws-2/)
- [Part 3 — Demos, Testing, Healthchecks](/docs/archive/terraform-aws-ec2/terraform-aws-3/)

### Kubernetes & AWS

- [Installing eksctl](/docs/archive/2020-04-27-Install-AWS-eksctl/)
- [EKS with Spot Instances using Terraform](/docs/archive/2020-09-18-EKS-Spot-Instances/)
- [AWS S3 Static Blog](/docs/archive/2018-07-29-Building-my-AWS-s3-jekyll-blog/) — the Jekyll predecessor to this site

## 🌐 Networking & Firewalls

- [Initializing a Cisco ASA 5505](/docs/archive/2016-03-18-First-Config_CISCO-ASA5505/)
- [Cisco ASA 5505 VLAN & VPN Setup](/docs/archive/2016-03-01-CISCO-ASA-VLAN-SETUP/)
- [Cisco WAP200 Firmware Upgrade](/docs/archive/2018-04-21-Cisco-WAP200-Firmware-Upgrade/)
- [Ubiquiti Home Network, Part 1](/docs/archive/2020-11-19-Ubiquiti-Home-Network-Part1/)
- [Ubiquiti Home Network, Part 2](/docs/archive/2020-11-28-Ubiquiti-Home-Network-Part2/)
- [Apache Reverse TLSv1.2 Proxy](/docs/archive/2018-06-23-Apache-Reverse-Proxy-TLSv1-2/)
- [HTTPS Inspection with Windows Squid](/docs/archive/2017-08-25-Windows-SQUID-SSLBUMP/) — SSL bump, MITM

## 🖥 Systems & Virtualisation

- [Creating VMs with Ansible and ESXi 5.5](/docs/archive/2016-02-13-Ansible-CreateVMs-Vsphere-free_version/) — free version constraints
- [NGINX on CentOS 7 with SELinux](/docs/archive/2017-10-20-NGINX-Centos7-SELinux/)
- [Purging Deleted VirtualBox Hard Disks](/docs/archive/2019-02-04-Delete-VirtualBox-VM-HDD/)
- [Resetting a Windows 10 VMware Guest Password](/docs/archive/2017-09-14-Reset_Win10_Passwd_Vmware_Guest/)
- [RDP to an Azure AD Joined Device](/docs/archive/2017-09-12-Windows10Pro-RDP-AzureADJoined/)
- [Installing Ubuntu 16.04 via Bootable USB](/docs/archive/2017-10-22-Ubuntu-Desktop-USB-Thinkpad13/)
- [i3wm + Blocks + Screencasting](/docs/archive/2017-07-10-i3wm-Block-Status-Screen/)
- [FreeNAS: Transmission over OpenVPN, Jailed](/docs/archive/2017-08-23-FreeNAS-Torrent-Over_OpenVPN/)
- [Kali Raspberry Pi Reverse Shell with STunnel](/docs/archive/2017-07-18-RaspberryPi-Kali-Reverse-STunnel/)

---

Current infrastructure work is in **[Engineer](/docs/engineer/)** — the [Home Lab Hub](/docs/engineer/LAB/) is where most of this eventually went.

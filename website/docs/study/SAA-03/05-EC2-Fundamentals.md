---
title: EC2 Fundamentals
---

:::info

These were the topics I created flashcards for (Remnote) and would revise them using spaced repetition. The formatting is an export from Remnote.

:::

- What does EC2 stand for?―Elastic Compute Cloud
- Capabilities (hint: EC2, EBS, ELB, ASG)― ↓
  - Renting VM (EC2)
  - Storage on Virtual Drives (EBS)
  - Distributing Load (ELB)
  - Scaling services (ASG)
- Configuration
  - OS: Linux, Windows, Mac OS
  - CPU
  - RAM
  - Storage
    - Network: EBS & EFS
    - hardware: Instance Store
  - Network: card speed, Public IP
  - Firewall Rules: Security Groups
  - Bootstrap
- EC2 User Data is used to {{automate}} boot tasks e.g.― ↓
  - software updates
  - software installation
  - download files from the internet
  - anything a script can do
- EC2 User Data script runs as {{root}} user
- EC2 Instance Types― ↓
  - General Purpose
    - Balance between {{compute}}, {{memory}} and {{networking}}.
    - can handle a diversity of workloads.
    - ideal for apps that divide resource use up {{evenly}} between components e.g. web servers and code repos.
  - Compute Optimised
    - compute-intensive applications that can use high performance processors.
    - good for batch processing, media transcoding, high performance web servers, high performance computing (HPC), scientific modeling, ML, dedicated gaming servers, ad server engines.
  - Memory Optimised
    - Memory optimized instances are designed to deliver {{fast performance}} for workloads that process large{{ data sets}} in memory.
  - Accelerated Computing
    - use {{hardware}} accelerators, or co-processors, to perform functions, such as {{floating point}} number calculations (FPGA), {{graphics}} processing (GPU), or data pattern matching, more efficiently than is possible in software running on {{CPUs}}.
  - Storage Optimised
    - Storage optimized instances are designed for workloads that require high, {{sequential}} read and {{write}} access to very large data sets on {{local}} storage. They are optimized to deliver tens of thousands of {{low}}-latency, {{random}} I/O operations per second (IOPS) to applications.
- Example: m5.2xlarge
  - 'm' instance class
  - '5' generation
  - '2xlarge' size within the instance class
- Security Groups
  - Security Groups control what is allowed inbound and outbound of EC2 instances acts as a stateless "firewall"
  - only contain {{ ____allow____ }} rules
  - rules can be referenced by {{IP}} or another {{Security Group}}
  - Configure Rules
    - Type: Service (HTTP,SSH,Custom TCP Rule)
    - Protocol: TCP/HTTP
    - Port Range
    - Source: CIDR
    - Description: text
  - General information
    - can attach to {{multiple}} instances
    - locked to Region+VPC
    - "timeouts" usually sign of SG issue
    - "connection refused" this is the application
    - Inbound {{__blocked__}} by default (implicit {{deny}})
    - outbound __authorised__ by default
  - Classic Port Numbers
    - 21 FTP
    - 22 SSH
    - 22 SCP
    - HTTP 80
    - HTTPS 443
    - RDP 3389
- [EC2 Purchasing Options](../EC2 Purchasing Options.md)

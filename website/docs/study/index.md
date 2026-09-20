---
title: "Certification Study Notes: CKS, CKA, AWS SAA-C03 & Security Specialty"
description: "Full study notes for CKS, CKA, AWS Solutions Architect Associate, AWS Security Specialty, and Cloud Practitioner — organised by exam domain, from actual prep."
keywords: ["cks study guide", "cka", "aws saa-c03", "aws security specialty", "kubernetes certification", "exam notes", "scs-c01"]
tags: ["study", "certification", "kubernetes", "aws", "security"]
sidebar_position: 0
slug: /study
---

# Study

Certification prep notes, kept in the structure the exams actually use. Written during real study runs, not reconstructed afterwards.

## ⎈ Kubernetes

### CKS — Certified Kubernetes Security Specialist

The deepest set of notes here, organised by the six official exam domains.

**[CKS Complete Study Guide](/docs/study/CKS/kubernetes-security-specialist-cks-study-guide/)** · **[Exam Notes](/docs/study/CKS/ExamNotes/)**

**1. Cluster Setup**
- [Network Policies](/docs/study/CKS/Cluster%20Setup/ClusterNetworkPolicies/)
- [Secure Ingress](/docs/study/CKS/Cluster%20Setup/ClusterSecureIngress/)
- [Node Metadata](/docs/study/CKS/Cluster%20Setup/ClusterNodeMetatdata/)
- [Dashboard](/docs/study/CKS/Cluster%20Setup/ClusterDashboard/)

**2. Cluster Hardening**
- [Role Based Access Control (RBAC)](/docs/study/CKS/Cluster%20Hardening/HardenRBAC/)
- [API Hardening and Restriction](/docs/study/CKS/Cluster%20Hardening/HardenRestrictAPI/)

**3. System Hardening**
- [AppArmor and Seccomp](/docs/study/CKS/System%20Hardening/SystemHardAppArmorSeccomp/)
- [Reduce Attack Surface](/docs/study/CKS/System%20Hardening/SystemHardReduceAttackSurface/)

**4. Microservice Vulnerability**
- [Container Runtime Sandboxes](/docs/study/CKS/Microservice%20Vulnerability/VulnerableContainerRuntime/)
- [Mutual TLS (mTLS)](/docs/study/CKS/Microservice%20Vulnerability/VulnerableMTLS/)
- [OS Level Security Domains](/docs/study/CKS/Microservice%20Vulnerability/VulnerableOSLevelSecurity/)
- [Managing Kubernetes Secrets](/docs/study/CKS/Microservice%20Vulnerability/VulnerableSecrets/)

**5. Supply Chain Security**
- [Secure Supply Chain](/docs/study/CKS/Supply%20Chain%20Security/SupplyChainSecurity/)
- [Container Images](/docs/study/CKS/Supply%20Chain%20Security/SupplyChainImages/)
- [Static Analysis](/docs/study/CKS/Supply%20Chain%20Security/SupplyChainStaticAnalysis/)

**6. Runtime Security**
- [Auditing](/docs/study/CKS/Runtime%20Security/RuntimeAuditing/)
- [Runtime Host Forensics](/docs/study/CKS/Runtime%20Security/RuntimeHostAnalysis/)
- [Immutability](/docs/study/CKS/Runtime%20Security/RuntimeImmutable/)

**Also:** [Open Policy Agent (OPA) Gatekeeper](/docs/study/CKS/OPAGatekeeper/)

### CKA — Certified Kubernetes Administrator

- [CKA Complete Study Guide](/docs/study/CKA/kubernetes-administrator-cka-study-guide/)
- [Exam Notes](/docs/study/CKA/ExamNotes/)

## ☁️ AWS

### SAA-C03 — Solutions Architect Associate

**[SAA-C03 Complete Study Guide](/docs/study/SAA-03/aws-solutions-architect-associate-study-guide/)**

- [IAM & AWS CLI](/docs/study/SAA-03/IAM-CLI/)
- [EC2 Fundamentals](/docs/study/SAA-03/EC2-Fundamentals/)
- [EC2 Associate Level](/docs/study/SAA-03/EC2-Associate-Level/)
- [EC2 Instance Storage](/docs/study/SAA-03/EC2-Instance-Storage/)
- [High Availability, Scalability, ELB, ASG](/docs/study/SAA-03/HA-Scale-ELB-ASG/)
- [AWS Fundamentals, RDS, Aurora, ElastiCache](/docs/study/SAA-03/AWS-Fundamentals-RDS-Aurora-Elasticache/)
- [Route 53 DNS](/docs/study/SAA-03/Route53-DNS/)
- [Classic Solution Architectures](/docs/study/SAA-03/Classic-Architectures/)
- [AWS SDK, IAM Roles & Policies](/docs/study/SAA-03/AWS-SDK-IamRoles-Policies/)
- [Advanced S3 & Athena](/docs/study/SAA-03/Advanced-S3-Athena/)
- [Decoupling: SQS, SNS, Kinesis, ActiveMQ](/docs/study/SAA-03/Decoupling-Applications-SQS-SNS-Kinesis/)
- [Serverless](/docs/study/SAA-03/Serverless/) · [Serverless Architecture Discussion](/docs/study/SAA-03/Serverless-Architecture-Discussion/)
- [Data & Analytics](/docs/study/SAA-03/Data-Analytics/)
- [Machine Learning](/docs/study/SAA-03/Machine-Learning/)
- [Monitoring & Auditing: CloudWatch, CloudTrail, Config](/docs/study/SAA-03/Monitoring-Auditing-CloudWatch-CloudTrail-Config/)
- [Disaster Recovery & Migrations](/docs/study/SAA-03/Disaster-Recovery-Migrations/)

### SCS-C01 — Security Specialty

**[SCS-C01 Study Guide](/docs/study/SCS-C01/)**, by exam domain:

- [Domain 1 — Incident Response](/docs/study/SCS-C01/D1-IncidentResponse/)
- [Domain 2 — Logging and Monitoring](/docs/study/SCS-C01/D2-LoggingMonitoring/)
- [Domain 3 — Infrastructure Security](/docs/study/SCS-C01/D3-InfrastructureSecurity/)
- [Domain 4 — Identity and Access Management](/docs/study/SCS-C01/D4-IdentityAccessManagement/)
- [Domain 5 — Data Protection](/docs/study/SCS-C01/D5-DataProtection/)

### CCP — Cloud Practitioner

- [AWS Certified Cloud Practitioner](/docs/study/CCP/)

## 💻 Languages

- [The Complete Developer's Guide (Golang)](/docs/study/Golang/go-the-complete-developers-guide/)

## Where to start

- **Going for CKS?** Start at the [CKS Study Guide](/docs/study/CKS/kubernetes-security-specialist-cks-study-guide/) and work the six domains in order. Do [CKA](/docs/study/CKA/kubernetes-administrator-cka-study-guide/) first if Kubernetes admin is still new.
- **Going for SAA-C03?** [IAM & AWS CLI](/docs/study/SAA-03/IAM-CLI/) then [EC2 Fundamentals](/docs/study/SAA-03/EC2-Fundamentals/) — the rest assumes both.

Applied versions of this material live in **[Engineer](/docs/engineer/)**; the offensive side is in **[Hacker](/docs/hacker/)**.

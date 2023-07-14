---
title: AWS Certified Cloud Practitioner
sidebar_position: 0
---

:::info

September 30, 2022 I earned my AWS Certified Cloud Practitioner [Certification](https://www.credly.com/badges/f576459e-0c5c-49f7-8b68-cd5e6213fd28). Expires on December 15, 2025

:::

## Overview

This is a basic entry-level cert for AWS cloud technology, services and features.

## Resources

No course, I'm fairly familiar with AWS services, but needed to dig into some new services and learn about the support plans and their differences. 

### Practice Exams

I ran through the 6 x practices tests on Udemy here: [AWS Certified Cloud Practitioner Practice Exams
](https://www.udemy.com/share/1013ma3@tSobX56t5tEIBRfpU1EA_rsSh1aqtamBhhBScDjicnGLvRJ4D1H_JmQ3PINPEBtu1Q==/). I put myself on the hook and crammed for 2.5 days just using the practice exams and aws documentation. I do ***not*** recommend doing it this way, but if you need to get it done and short on time, practice exams and flashcards helped me do it in a short amount of time.

### Remnote

After each practice exam question, I would study the ones I got wrong, and why. I would create a flashcard with a way of remembering the information that I needed to understand to not make the same mistake. I use [Remnote](https://www.remnote.com/) and highly recommend using it for all your flashcard needs.

This is an export of the the final flashcards I created to pass my exam:

```
- Snowball is a {{Peta}}-byte scale Data {{Transfer}} Device.
- Snowmobile is a {{Exa}}-byte scale Data Transfer Device.
- Snowcone is a {{Tera}}-byte scale Data Transfer and Edge Computing Device.
- what S3 storage type is best for data with unpredictable access patterns?―S3 Intelligent Tiering.
- S3 {{Intelligent}} Tiering has two tiers, {{in-frequently accessed}} and {{frequent access}} .
- What are the 3 examples of "Shared Control" (from the Shared Responsibility Model)? ↓ 
    - Patch Management ‒ AWS patches infrastructure, Customer patches guest OS
    - Config Management ‒ AWS configs infrastructure, Customer configures services on top.
    - Awareness & Training ‒ AWS trains its employees, customer trains their own employees.
- AWS Health Dashboard is a single place to learn about the {{availability}} and {{operations}} of AWS Services.
- AWS Health Dashboard includes the following ↓ 
    - personalised view of service health
    - proactive notifications
    - troubleshooting guidance
- AWS Organisation’s centrally {{govern}} and {{manage}} customers environments across {{billing}} management, {{access}} control, {{compliance}} and security; and to share resources across accounts.
- AWS Organisations five main benefits ↓ 
    - **manage** access policies across multiple accounts
    - **automate** creating and managing AWS accounts
    - **configure** AWS services across multiple accounts
    - **consolidate** billing across multiple accounts
    - **control** access to AWS services across multiple accounts.
- Amazon CloudWatch allows you to view the following three things ↓ 
    - application performance
    - resource utilisation
    - operational health
- AWS Config is a fully {{managed}} service that gives you config {{history}} and {{change}} notification enabling {{security}} and governance.
- AWS Support Plans
    - What are the 4 Support Plan types? ↓ 
        - Developer
        - Business
        - Enterprise On-Ramp
        - Enterprise
- What plans provide Infrastructure Event Management (IEM)? ↓ 
    - Business
    - Enterprise On-Ramp
    - Enterprise
- Business Support includes {{24x7}} support and {{IEM}} for a {{fee}}.
- What other programs do all four plans have access to (even if at different levels)?―Support Automation Workflows
    - What's the difference between Developer Support Automation Workflows and the other plans?―prefixes AWSSupport only (other plans include AWSPremiumSupport prefixes).
- Savings Plans are available for which AWS Compute Services? ↓ 
    - Amazon EC2
    - AWS Fargate
    - AWS Lambda
- What service can you use to keep an eye on service limits (quotas)?―AWS Trusted Advisor via 'Service Limits Dashboard'.
- AWS OpsWorks is a configuration management service that provides managed instances of Chef and Puppet.
- What service provides configuration management using Chef and Puppet managed instances?―AWS OpsWOrks.
- What professional services firms help customers design, architect, build, migrate and manage workloads on AWS?―APN Consulting Partner.
- What professional services firms provide software solutions integrated or hosted on AWS?―APN Technology Partner.
- What TWO controls do customers  __inherit__  from AWS? ↓ 
    - Physical controls
    - Environmental controls
- What are the main benefits of using DynamoDB? ↓ 
    - performance at scale
    - serverless
    - high availability
- What can I use to get a data on costs breakdown of my AWS use over the last month?―AWS Cost Explorer
- What can I use to easily manage routing traffic between multiple VPC?―AWS Transit Gateway
- What service can I use to connect on-prem to AWS using IPSec over the internet?―AWS Site-to-Site VPN
- What does AWS Site-to-Site VPN provide that can connect my users to on-prem or AWS?―AWS Client VPN
- What service connects a Corp DC to AWS over a private network?―AWS Direct Connect (DX)
- What service can provide Single-sign to connect services like Salesforce, Microsoft 365 and custom applications using SAML 2.0 to AWS?―AWS Identity Center (formerly AWS SSO)
- What can customers use to create catalogs of approved services to better manage and govern their AWS accounts?―AWZ Service Catalog
- What AWS Organisations policy can I use to manage permissions for all AWS accounts?―AWS Service Control Policies (SCP)
- How are SCP different from IAM policies?―IAM is at the resource level of a single account. SCP is at the Account level. Org combines both for "net" permission.
- What's the minimum cost support plan that provides 24x7 support?―Business Support (Enterprise On-Ramp and Enterprise offer it, but more expensive)
- What support plans offer Concierge?―Enterprise & Enterprise On-Ramp (it's an Enterprise-focused service)
- AZ are {{isolated}} locations within AWS {{Regions}} whereas Edge Locations are located in {{multiple}} cities {{worldwide}}.
- IAM best practice is to create a {{User}} account for employees and then assign or attach the relevant {{policies}}.
- What are the only Amazon Machine Images (AMI) that are billed per-second? ↓ 
    - Amazon Linux
    - Windows
    - Ubuntu
- What are the main two ways for running Microsoft SQL Server on AWS? ↓ 
    - RDS
    - EC2
- If you suspect a security breach in your AWS account, do these THREE things first― ↓ 
    - Open investigation
    - Delete potentially compromised IAM users
    - Change ROOT and IAM users password.
```
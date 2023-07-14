---
title:  Domain 1 - Incident Response
---

:::info

This is an export from my Remnote with flashcard syntax included.

:::

- Incident Response
  - What service should you use to  __"automatically detect suspicious activities such as SSH brute force attacks or compromised EC2 instances that serve malware."__ ?→Amazon GuardDuty
  - to investigate unauthorised access to EC2 instances where you have VPC flow logs, what security service aggregates data, summaries and analyses possible extent of security issues?→Amazon Detective.
  - If you get an AWS Abuse notice with list of specific offending EC2 what THREE things should you do with the instances?↓ ↓
    - deregister from ALB
    - detach from ASG
    - capture metadata
  - What service "uses machine learning to automatically discover, classify, and protect sensitive data stored in Amazon S3."?→Amazon Macie.
  - how would you setup an alert for too many unauthorised API requests using CloudTrail? ↓
    - enable CloudTrail on AWS account
    - setup CloudWatch Metric & Alarm on API error code
    - setup SNS to notify me.
  - What service  __"continuously monitors for malicious activity and unauthorized behavior to protect your AWS accounts and workloads."__ →Amazon GuardDuty.
  - how do you stop Amazon GuardDuty from alarming on approved EC2 instances from CloudWatch alerts?→attach elastic IPs to EC2, add addresses to Trusted IP list in Amazon GuardDuty.
  - If EC2 and SQS are involved and an IAM change impacts it, what should you check? ↓
    - SQS Policy for explicit DENY to the EC2 Instance IAM Role
    - EC2 Instance IAM Role has permissions for SQS
  - Amazon Inspector is for "a{{utomated}} security {{assessment}}" whereas Amazon GuardDuty is for "threat {{detection}}".
  - Any time you see threats such as "unauthorised access" and "suspicious access patterns" think "Amazon {{GuardDuty}}".

---
title: Domain 2 - Logging and Monitoring
---

:::info

This is an export from my Remnote with flashcard syntax included.

:::

- Logging & Monitoring
  - AWS Config does not need a {{Lambda}} Function for remediation, instead it can use `AWS`{{`Managed SSM`}}` Automation `{{`Document`}} with a {{`Remediation`}}`Action` to fix or remediate configurations.
  - "trace the integrity of each file and prevent the files from being tampered." in CloudTrail, enable what?→Log File Integrity Validation.
  - if you need to troubleshoot on Windows and need to collect memory dumps, use what?→EC2Rescue tool for Windows Server.
  - what Amazon EventBridge pattern can build you the most efficient ACM certificate expiring monitoring system?→`ACM Certificate Approaching Expiration`
  - Can you use Amazon Macie to check whether findings violate CIS benchmarks?→No. Macie is for identifying sensitive information (PII) on files in S3 buckets.
  - What AWS Security Service can you enable CIS Benchmarks security standards?→AWS Security Hub
    - What other service must be enabled before using AWS Security Hub?→AWS Config.
  - Route 53
    - if you have DNS resolution issues with  __**public**__  DNS queries, what logging should you activate?→DNS query logging
    - if you have DNS resolution issues with  __**private**__  DNS queries, what logging should you activate?→DNS Resolver logging
    - if you have DNS issues, that likely traverse VPC, and you're using Amazon Route 53 Resolver for DNS, what can you use for troubleshooting that you can query?→Route 53 Resolver Query logging.
  - IP packet inspection using EC2 and proxy software... how? ↓
    - setup proxy software on an EC2 instance and route all VPC __outbound traffic__ through it
    - use an agent on the EC2 instances to do the packet inspection.
  - How does AWS Config execute remediation actions?→uses AWS Managed SSM Automation documents i.e. runbooks.
  - Can Public DNS query logs be sent to an S3 bucket?→No. Public DNS query logs can only be published to Amazon CloudWatch Logs.
  - what service do you use to collect application logs from EC2 instances?→AWS CloudWatch.
    - why not use CloudTrail?→CloudTrail is for tracking API calls not collecting logs.
  - CloudTrail
    - what two CLI arguments to track changes to ALL Regions, including global services like CloudFront, Route53 etc? ↓
      - `--is-multi-region-trail`
      - `--include-global-services-events`

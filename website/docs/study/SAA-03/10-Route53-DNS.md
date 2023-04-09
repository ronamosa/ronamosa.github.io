---
title: Route53 DNS
---

:::info

These were the topics I created flashcards for (Remnote) and would revise them using spaced repetition. The formatting is an export from Remnote.

:::

- An 'Alias' in Route 53 can point to which four resources? ↓
  - S3 sites
  - ELB
  - CloudFront
  - API Gateway
- Can a CNAME point to an Apex record?―No.
- Can an ALIAS point to an Apex record?―Yes.
- What resource in Route 53 hosts DNS records?―Hosted Zone.
- What kind of Hosted Zone is available to requests OUTSIDE of a VPC?―Public Hosted Zone.
- What kind of Hosted Zone is only available to requests within a VPC?―Private Hosted Zone.
- Routing Policies
  - What are the 6 available Route 53 routing policies? ↓
    - Simple
    - Multi-value
    - Weighted
    - Latency Based
    - Geolocation
    - Geoproximity
  - Can Simple Routing Policy return multiple DNS record values for a single domain?―Yes.
  - What is the difference between Simple Routing Policy and Multi-Value Policy?―Multi-Value has health checks (Simple does not).
  - Multi-Value can return up to how many healthy records?―8.
  - If I want to distribute or "load balance" requests to my EC2 instances using Route 53, what Policy should I use?―Weighted Routing Policy.
  - What Routing Policy should I use to ensure my users connect to the destination with the fastest response time?―Latency Based Routing.
  - Geolocation Policy must have this configured for all records, in case there is "no match" for location to route the user to?―Default A Record.
  - What Routing Policy should I use influence how much traffic is routed to a specific Region, based on ONE value?―Geoproximity (bias value)
- Health Checks
  - What are the 3 kinds of health checks in Route53? ↓
    - Endpoint
    - Other health checks (called "Calculated Health Check")
    - CloudWatch (metric to alarm on)
  - What kind of failover happens when a health check for one endpoint fails?―A DNS Failover.
- DNS Failover
  - What are the two DNS failover configurations? ↓
    - Active-active
    - Active-passive
  - In an Active-passive configuration, which endpoint does Route 53 return first?―Primary (if healthy).

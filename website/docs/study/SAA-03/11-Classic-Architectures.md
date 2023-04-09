---
title: Classic Solution Architectures
---

:::info

These were the topics I created flashcards for (Remnote) and would revise them using spaced repetition. The formatting is an export from Remnote.

:::

- **WhatsTheTime.com - WELL ARCHITECTED FRAMEWORK** (stateless) #Stateless
- **MyClothes.com - 3-TIER WEB ARCHITECTURE** (stateless)
  - Problem case: managing customer and data as stateless as possible. #Stateless
  - Solutions Applied
        1. Session Affinity i.e. "sticky sessions" or Cookies
        2. "Cookies" (stateless)
        3. "Server Session" - store session data to DB (Cache)
        4. "Store User Data" - store user data to DB
        5. "Scale Reads" OR "Cache Write-through"
        6. "Survive Disaster" use Multi-AZ
        7. "Ensure Security" use Security Groups restrict what can talk to what.
  - Questions about this architecture
    - The three tiers
      - **Web** Tier
        - ELB - can do stick sessions, "duration-based" and "application-based"
        - Web clients - can store session "Cookies"
      - **Application** Tier
        - EC2 ‒ nothing special here.
      - **Database** Tier
        - Elasticache ‒ session data, DB cache, Multi-AZ capable.
        - RDS ‒ user data, Read Replicas to scale, Multi-AZ (DR)
    - Security Groups
- **MyWordPress.com STATEFUL WEB APP SCALABLE**
  - Aurora Database
    - Multi-AZ for DR
    - Read Replicas for scale
  - Data in EBS (single)
    - fast but tightly-coupled
  - Data in EFS (distributed)
    - distributed decoupled
- Init Apps Quickly
  - Golden AMI
  - Userdata Scripts
  - Hybrid
    - Golden AMI
    - Userdata Scripts
- Beanstalk - get developers up & running quickly + fully featured, autoscaling, health checks

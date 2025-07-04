---
title:  Disaster Recovery & Migrations.
---

:::info

These were the topics I created flashcards for (Remnote) and would revise them using spaced repetition. The formatting is an export from Remnote.

:::

- Disaster Recovery
  - RPO stands for?―Recovery Point Objective (Data loss)
  - RTO stands for?―Recovery Time Objective (Downtime)
  - Strategies
    - List the 4 strategies: ↓
      - Backup & Restore
        - restoring from backups
        - longest RTO
        - cheap
      - Pilot Light
        - critical only resources running in standby
        - quicker RTO
        - cheaper
      - Warm Standby
        - full architecture in standby
        - running at minimum levels
        - quick to boost to PROD level
        - costs more...
      - Hot Site (Multi-Site)
        - full prod level site running in stanby
        - most expensive
        - shortest RTO
  - Recovering
    - Backups - enable automatic everywhere, keen schedule regular
    - High Availability - use Route53, RDS Multi-AZ and other systems (Site-to-Site VPN for DX backup) setup so your RTO is minimal.
    - Replication - use services with multi-region setups e.g. Aurora Global, and on-prem to AWS replication with RDS, storage gateway etc... replicate between Regions, Premises etc.
    - Automation ‒ enable things to speed up recovery like CloudFormation & Elastic Beanstalk, recover & reboot on EC2
- Database Migration Service (DMS)
  - source DB ⇒ DMS (on EC2) ⇒ dest DB
  - Schema Conversion Tool (SCT)
    - when do you need SCT?―when migrating between different DB engines
    - when do you NOT need SCT?―if you're migrating same engine e.g. MySQL to RDS for MySQL
  - RDS MySQL to Aurora MySQL
    - list options to migrate RDS ⇒ Aurora? ↓
      - snapshot RDS ⇒ restore to Aurora
      - Aurora Read Replica using RDS then promote it as its own DB Cluster
  - External MySQL to Aurora MySQL
    - What can you use to create a file backup in S3, and then an Aurora MySQL DB from S3?―Percona XtraBackup
    - if both databases are up & running, use...?―Database Migration Service (DMS)
- On-Premise to AWS Strategies
  - List known on-prem to AWS Cloud strategies: ↓
    - Download & Run `Amazon Linux 2 AMI` as VM
    - VM Import & Export
    - AWS Application Directory Service
      - gathers info of on-prem servers and plans migration
    - AWS Database Migration Service
    - AWS Server Migration Service
- AWS Backup
  - manage and automate backups across AWS Services in a central place.
  - services supported by AWS Backup (hint: E S R D E)? ↓
    - EC2 & EBS
    - S3
    - RDS
    - DocumentDB
    - EFS
    - Storage Gateway
  - Support cross-region backups?―Yes.
  - Support cross-account backups?―Yes.
  - What are backup policies otherwise known as?―Backup Plans.
  - AWS Backup Vault Lock
    - What does WORM stand for?―Write Once Read Memory)
    - Can root user delete backups when vault lock is enabled?―Yes.
- AWS Application Discovery Service
  - plan migrations by running the ADS agent on on-prem servers and gathering information.
  - two types of Discovery you can run....?― ↓
    - Agent-less Discovery
    - Agent-based Discovery
- AWS Application Migration Service
  - "lift-and-shift" approach
  - minimum \{\{downtime\}\}, reduced \{\{costs\}\}.
- VMWare Cloud on AWS
  - use case?―Customer wants to extend their data centre but keep using their on-prem VMWare setup.
- Transfer Large Data
  - what are your data transfer options from on-prem to AWS Cloud? ↓
    - Over public internet or Site-to-Site VPN
      - setup = immediate
      - speed = 100Mbps
    - Over private network aka DX
      - setup = over 1 x month
      - speed = 1Gbps
    - Over snowball (hardware)
    -

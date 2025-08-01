---
title: AWS Fundamentals, RDS, Aurora, ElastiCache
---

:::info

These were the topics I created flashcards for (Remnote) and would revise them using spaced repetition. The formatting is an export from Remnote.

:::

- Amazon Relational Database Service, collection of `\{\{managed\}\}` services to `\{\{deploy\}\}`, `\{\{operate\}\}` and `\{\{scale\}\}` databases in the cloud. Choose from `\{\{seven\}\}` database engines available e.g. MySQL, PostgreSQL, SQL Server.
- RDS backups
  - automated backups are enabled by **default**
  - the two types of backups are?
    - automated backups
      - the **default** backup retention period?―7 days (if created by console).
      - what else is backed up?―transaction logs
      - what kind of restore capability does transaction logs give you?―Point in Time Recovery.
      - what's the maximum you can set the backup retention period to?―35 days.
      - how do you disable automated backups?―set backup retention period to '0'.
    - snapshots (manual)
      - who initiates snapshot backups?―user-initiated.
      - how long are snapshots retained?―indefinite.
- RDS Scaling
  - what are the 3 types of scaling available with RDS? ↓
    - Vertical ‒ Compute Instance
    - Horizontal ‒ Storage Auto Scaling
    - Read Replicas ‒ Read capability
- Read Replicas
  - max RR's per Region?―5.
  - data replication is  __"__ `\{\{ __eventually__ \}\}` __consistent"__  i.e. `\{\{ __asynchronous__ \}\}`.
  - data transfer costs: out to the internet; in the same Region; and Region to Region ‒ which one costs nothing?―in the same Region.
- Multi-AZ
  - what is the main use-case for MAZ?―Disaster Recovery (DR)
  - data replication between primary and secondary DB is done..?―synchronously
  - how handles the failover between Primary and Secondary?―RDS. It is automated.
  - can I convert a Read Replica into a Secondary, MAZ node?―Yes.
  - how much downtime can I expect transferring a Single-AZ into a Multi-AZ setup?―None.
  - can I ssh or otherwise access the Secondary DB?―No.
- RDS Custom
  - Applies to which 2 database types?― ↓
    - Oracle
    - Microsoft SQL Server
  - What two main differences between RDS and RDS Custom?
    - ssh ‒ you can ssh into the underlying EC2 instance.
    - config DB ‒ you can configure the underlying database.
  - Best Practice for doing backups on RDS Custom? ↓
    - disable automation's before taking a snapshot
- Aurora
  - Supports, and is faster than which 2 database engines?― ↓
    - MySQL (5x)
    - PostgreSQL (3x)
  - Is it open source?―No.
  - Storage auto scales up to what max (TiB)?―128TiB.
  - In a normal setup, how many masters can an Aurora cluster have?―one.
  - how many RRs max can a cluster have, in a single Region?―15.
  - Aurora makes `\{\{6\}\}` copies of your data across `\{\{3\}\}` Availability Zones to make your data really `\{\{durable\}\}`.
  - If I used mixed sized Instances in my Aurora Read Replicas to provide different levels of compute power for different types of work, what would I use to ensure only specific requests access these instances?―Custom Endpoints.
  - If my workloads were unpredictable but needed high compute power, and I wanted to optimise costs when using Aurora, what feature could I use to help me?―Aurora Serverless.
  - Disaster Recovery & High-Availability   #[[Disaster Recovery]]
    - What Disaster Recovery or High-Availability feature does Aurora have to ensure zero downtime on DB write operations for its clusters?―Multi Master Aurora Clusters.
  - Backups
    - Automated Backups can be disabled on RDS and Aurora? True or False?―False. Only on RDS.
    - What is the default backup retention period for Aurora backups?―1 day.
    - What is the max you can configure backup retention period for Aurora backups?―35 days (same as RDS).
    - When migrating an Aurora database using S3, what tool is used to create the Aurora database backup?―Percona.
    - Can you restore a DB cluster snapshot into an existing DB cluster?―No. A new DB cluster is created when you restore.
    - What are the three ways of creating a Aurora DB instance? ↓
      - Restore from snapshot or backup creates a new DB
      - Backup with percona, send to S3, restore into new Aurora DB
      - DB clone
  - Security
    - Four ways RDS is secure? ↓
      - Network isolation via VPC
      - Encryption using KMS on RDS instance storage (enabled by default)
      - IAM for resource-based permissions
      - CloudWatch for Audit logging.
- RDS Proxy (Connections)
  - What does using RDS Proxy mean in terms of code changes?―None.
  - Four benefits of RDS Proxy? ↓
    - __Reduce__ stress on the DB
    - __Failover__ improvements
    - __Connection__ Management between user and application.
    - __Authentication__ (IAM) available for users calling the DB.
- Elasticache (Content)
  - What are the two cache types available from Elasticache? ↓
    - Redis
    - Memcached
  - What does using Elasticache mean in terms of code changes?―There will be code changes.
  - Can you use IAM Auth for Redis or Memcached?―No.
  - What can you use for Auth instead for Redis and Memcache? ↓
    - Redis AUTH for Redis
    - SASL for Memcached.
  - What are the THREE Elasticache caching strategies (patterns)?― ↓
    - Lazy Loading (LL)
      - HIT, MISS + UPDATE
    - Write-through (WT)
      - 2 x PUT (cache & DB)
    - TTL
      - expire + retrieve

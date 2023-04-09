---
title: EC2 Instance Storage
---

:::info

These were the topics I created flashcards for (Remnote) and would revise them using spaced repetition. The formatting is an export from Remnote.

:::

- EBS Volume
  - block storage
    - raw blocks
    - lowest latency
    - high performance
    - highly redundant
    - SAN
    - use cases: {{boot}} volume, DBs
  - file storage
    - NAS
    - files
    - use cases: mixed, {{unstructured}} data, apps that do lots of {{reads}} and {{writes}}.
  - Network Attached Drive
  - only mount to one instance at a time (unless using io1 or io2 disk, then you can multi-attach).
  - Snapshot features ↓
    - Snapshot Archive - a tier 75% cheaper
    - Recycle Bin uses rules to retain data in case accidental delete.
  - AZ bound
    - to move
      - snapshot volume
      - move snapshot to other AZ
      - create volume from snapshot in new AZ
  - Delete on terminate
    - root EBS delete enabled by default
    - other EBS volumes disabled by default
- AMI
  - are a "{{customisation}} of an EC2 instance"
  - are {{Region}} bound
  - Ec2 to AMI
    - start Ec2
    - customise
    - stop (data integrity)
    - create AMI
    - launch Ec2 using new AMI
- EC2 Instance Store
  - use if you need {{high-performance}} disk
  - data {{loss}} (when stopped) risk because its {{ephemeral}}
  - use case: buffer, cache, scratch or temporary content.
- Volume Types
  - gp (SSD)―general purpose, balances price & performance (gypsy)
  - io (SSD)―highest-performance, mission-critical, low-latency, high throughput (burger)
  - st (HDD)―low cost HDD, frequently accessed, throughput-intense workloads (street)
  - sc (HDD)―lowest cost, less frequently accessed workloads (sea)
- GP
  - 1-16 TiB
  - gp3
    - baseline of 3,000 IOPS at 125 MiB/s
    - can increase to 16,000 IOPS at 1000 MiB/s
  - gp2
    - can burst to 3,000 IOPS for small gp2 volumes
    - max IOPS―16,000
- PIOPS
  - cannot be a {{boot}} volume
  - 125 GiB to 16 TiB
  - st1, is a HDD that is optimised for what?―Throughput Optimised HDD
    - use cases: DWH, Log Processing
  - sc1 i.e. C{{old}} HDD
    - infrequently accessed, low cost

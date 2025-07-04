---
title: Advanced Amazon S3 & Athena
---

:::info

These were the topics I created flashcards for (Remnote) and would revise them using spaced repetition. The formatting is an export from Remnote.

:::

- S3 Protection Mechanisms
  - S3 Default Encryption
    - encrypts objects that are not encrypted when sent to S3, are already-encrypted objects re-encrypted?―No.
    - What is the other way to force encryption when objects are pushed to S3?―Bucket Policies.
  - MFA Delete
    - Protects from accidentally deleting objects by requiring `{{MFA}}` to delete objects.
    - what has to be enabled first before you can enable MFA Delete?―Versioning.
    - you can only enable MFA Delete using what tool?―CLI
  - S3 Replication
    - There are TWO types of S3 Replication modes, what are they? ↓
      - Cross-Region Replication (CRR)
      - Same-Region Replication (SRR)
    - "Delete Markers" feature is enabled by default. True or False?―False.
    - If I delete an object in bucket in Region 1, and "delete markers" replication is enabled, will my object in Region 2 be deleted?―No. Delete "markers" are replicated, NOT actual deletes i.e. permanent deletes.
  - S3 Pre-signed URLs
    - what TWO tools you can use to create pre-signed URLs? ↓
      - SDK
      - CLI
  - S3 Access Logs
    - Enable "server `{{access}}` logging" on one S3 bucket, and specify a 2nd bucket as the "logging" bucket. When you do this it will automatically update the logging buckets '`{{bucket policy}}`'.
    - What service can you use to query the logging bucket for data?―Amazon Athena.
- S3 Storage Classes
  - What do the different tiers balance?
    - Availability  (all except ONE tier is 3 x AZ's)
    - Cost (Cheaper in longer-term storage)
    - Accessibility (how quickly can User retrieve data?)
  - What are the S3 Storage Tiers from shortest to longest term? (hint: S IT SIA OZIA GS GF GD)― ↓
    - Standard
    - Intelligent-Tier
    - Standard-IA
    - One-Zone IA
    - Glacier Standard
    - Glacier Flexible Retrieve
    - Glacier Deep Archive
  - Intelligent Tiering is good for `{{unpredictable}}` access patterns.
  - Intelligent Tiering has both `{{frequently}}` and `{{infrequently}}` accessed storage types.
  - What mechanism do you use to move objects between different storage tiers?―Lifecycle Rules.
  - What else can you do with Lifecycle Rules other than move objects?―Delete objects.
  - When you read "deletable but recoverable" think "enable `{{versioning}}`".
  - When you read "non current versions" think "S3 `{{IA}}`".
  - What's a good first step to understanding whether objects should go from S to S_IA and before writing your Lifecycle Rules?―Use S3 Analytics to understand data behaviour e.g. how long has an object been sitting there?
- S3 Performance
  - Baseline speeds
    - generally accessing S3 objects is in the `{{100}}`-`{{200}}`ms range.
    - COPY/PUT/POST/DELETE are about `{{3.5k}}` requests per second.
    - GET/HEAD are about `{{5.5k}}` requests per second.
  - Things that impact performance
    - Encryption
      - KMS
        - if you use SSE-KMS what TWO API calls can quickly bog down S3 performance? ↓
          - `GenerateDataKey`
          - `Decrypt`
        - What are the THREE KMS requests per second quotas (roughly) depending on Region? ↓
          - 5.5k
          - 10k
          - 30k
        - Can you increase quota with a request to AWS Support?―Yes you can.
    - Big Files
      - If you are uploading big files, what is the recommended size to use MULTI-PART uploading?―100MB
      - what size of file is a MUST (i.e. you have no choice) to use MULTI-PART uploading?―5GiB.
      - when the pieces of the big file are broken up they are transferred to S3 in "`{{parallel}}`".
    - Public Networks
      - What service can you use to speed up transfer of a file over the internet to your S3 bucket (STA)?―S3 Transfer Accelerator.
      - Where do you upload your files to in order to use this feature?―Edge Location.
      - How does it speed things up?―By using the AWS Private network after it's uploaded to an Edge location.
    - Unorganised Data
-

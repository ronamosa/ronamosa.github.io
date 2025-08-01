---
title: Data & Analytics
---

:::info

These were the topics I created flashcards for (Remnote) and would revise them using spaced repetition. The formatting is an export from Remnote.

:::

- Amazon Athena
  - use Amazon Athena when you're asked to analyse something using "`\{\{serverless\}\}` SQL"
  - features
    - `\{\{columnar\}\}` data for cost savings
    - `\{\{compresses\}\}` data for smaller retrieval
    - use `\{\{larger\}\}` files to minimise overhead
  - Federated Query
    - you can run `\{\{SQL\}\}` queries across data in `\{\{relational\}\}` & `\{\{non-relational\}\}` DBs, on-prem and cloud.
- Amazon Redshift
  - based on PostgreSQL
  - used for Data Warehousing (DWH)
    - is `\{\{10\}\}`x faster than other DWH.
  - why is Redshift faster than Athena in terms of queries, joins, aggregations?―Redshift uses Indexes.
  - What kind of queries is Athena better for than Redshift?―Ad-hoc query's
  - Redshift Cluster
    - What is a Redshift Cluster made up of (components)? ↓
      - Leader Node
      - Compute Nodes
    - What interface connector is used to talk to a Redshift Cluster?―JDBC or ODBC
    - Is Redshift serverless?―No. You need to provision the nodes.
  - Disaster Recovery (DR)
    - Does Redshift support Multi-AZ?―No.
    - how would you do Redshift DR?―configure automatic copy of cluster snapshots to another AWS Region.
  - Data Loading
    - what are the three options for loading data into Redshift (hint: near, copy, vm)?― ↓
      - Kinesis Data Firehose (KDF)
      - S3 Copy
        - via "enhanced routing" through `\{\{VPC\}\}`
        - without "enhanced routing" over the `\{\{internet\}\}`
      - EC2 Instance (JDBC driver)
    - which is better? Large inserts or small inserts?―Large.
  - Redshift Spectrum
    - this is useful for when you want to `\{\{query\}\}` data in S3 without `\{\{loading\}\}` it into your Redshift Cluster
- Amazon OpenSearch
  - aka `\{\{ElasticSearch\}\}`
  - ... you can search any `\{\{field\}\}`, even `\{\{partial\}\}` matches..
  - is OpenSearch serverless?―No. it requires a cluster of instances.
  - does OpenSearch support SQL?―No. has its own query language.
  - what are the three main INGESTION sources for OpenSearch (hint: near-realtime, I C)?― ↓
    - Kinesis Data Firehose (KDF)
    - AWS IoT (via CRUD)
    - CloudWatch logs
  - Security Stack for OpenSearch i.e. what security services? (hint: think mobile, rest, flight)― ↓
    - Cognito & IAM (AuthN, AuthZ)
    - KMS encryption
    - TLS
  - visualisation option for OpenSearch?―OpenSearch Dashboards.
  - OpenSearch Patterns
    - DynamoDB
    - CloudWatch
    - Kinesis
      - Kinesis Data Firehose
      - Kinesis Data Streams
- Amazon EMR
  - helps create `\{\{Hadoop\}\}` cluster (**Big Data**).
  - think of EMR scale in terms of `\{\{hundreds\}\}` of EC2 instances.
  - EMR comes bundled with (RDBMS)― ↓
    - Apache Spark
    - HBase
    - Presto
    - Apache Flink
  - Node Types
    - EMR structure consists of (M C T)― ↓
      - Master Node i.e. manage cluster
      - Core Node i.e. run task, store data (long running)
      - Task Node (optional) i.e. run tasks (short usually spot)
    - pricing think on-demand, RI's, spot.
- Amazon QuickSight
  - Serverless `\{\{machine\}\}` learning-powered `\{\{business\}\}` intelligence service to create `\{\{interactive\}\}` dashboards.
  - uses what engine for in-memory compute?―SPICE
  - in enterprise edition, what kind of security is available?―Column-Level Security (CLS)
  - Dashboards
    - can be shared with `\{\{Users\}\}` or `\{\{Groups\}\}` (note: these are not `\{\{ __**IAM**__ \}\}` users)
- AWS Glue
  - managed `\{\{extract\}\}`, `\{\{transform\}\}`, `\{\{load\}\}` service
  - is Glue fully serverless?―Yes.
  - can Glue convert data to Parquet format?―Yes.
  - Glue functions, what do these do?
    - Job Bookmarks ?―prevent pre-processing old data
    - Elastic Views?―like table views
    - DataBrew?―clean & normalise data
    - Streaming ETL?―continuous ETL streaming
- AWS Lake Formation
  - A Data lake is a `\{\{central\}\}` data store for the purposes of `\{\{analytics\}\}`.
  - TWO key features of AWS Lake formation (hint: quickly start with..., security)?― ↓
    - (Data) Source **Blueprints** e.g. S3, RDS, Relational & NoSQL DBs
    - Fine-grained **Access Controls** for your apps at row and column-level.
  - Centralised Permissions
- Kinesis Data Analytics for SQL Apps
  - KDA for SQL ingests what Kinesis sources? ↓
    - Kinesis Data Streams
    - Kinesis Data Firehose
  - KDA sends to what downstream sinks (hint: K K)?― ↓
    - Kinesis Data Streams ⇒ Lambda ⇒ anywhere
    - Kinesis Data Firehose ⇒ S3 or Redshift (COPY through S3)
  - KDA for Apache Flink
    - what streaming services can 'Kinesis Data Analytics For Apache Flink' ingest from? ↓
      - Kinesis Data Streams
      - Amazon MSK
- Amazon Managed Streaming Kafka(MSK)
  - TWO options for running Apache Kafka on AWS ↓
    - Fully Managed (MSK)
      - Data is stored for `\{\{as long as you want\}\}`.
    - Serverless (MSK)
  - List MSK downstream consumers? (hint: think analytics + K G L A)― ↓
    - KDA for Apache Flink
    - AWS Glue with 'Streaming ETL Jobs'
    - Lambda
    - Apps running on ‒ EC2, ECS, EKS
- KDS vs MSK
  - KDS 1MB message vs MSK 1MB+
  - KDS Streams with Shards vs MSG Topics with Partitions
- Big Data Ingestion Pipeline
  - scenario IoT incoming data...
  - Requirements
    - serverless
    - data in real time
    - transform data
    - use SQL
    - reports saved to S3
    - load data to DWH create dashboards

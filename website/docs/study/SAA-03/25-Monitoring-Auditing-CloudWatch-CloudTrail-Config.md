---
title: AWS Monitoring & Auditing, CloudWatch, CloudTrail & Config
---

:::info

These were the topics I created flashcards for (Remnote) and would revise them using spaced repetition. The formatting is an export from Remnote.

:::

- CloudWatch
  - Metric is a `\{\{variable\}\}` to monitor
  - A metric goes in a namespace.. what's a namespace?―like a bucket or category for each service.
  - What is an attribute of a metric?―A Dimension
  - Create one of these when you need a custom variable to monitor?―CloudWatch Custom Metric.
  - Where can you stream, near-real-time CloudWatch metrics to?―Kinesis Data Firehose.
    - you also have the option to `\{\{filter\}\}` metrics to a subset.
  - CloudWatch Logs
    - "an arbitrary name, usually representing an application"―Log groups
    - "instances  __within__  those applications"...―Log streams
    - CloudWatch Logs can send logs to... (hint: think exports, streams, search)?― ↓
      - S3 (exports)
      - KDS (streams)
      - KDF (streams)
      - Lambda (xform)
      - ElasticSearch (store & search)
    - S3 Export
      - log data can take up to `\{\{12\}\}` hours to be available for export.
        - API call used?―`CreateExportTask`
    - Subscriptions
      - what does a Logs Subscription do?―It forwards log events from CloudWatch Logs to some destination like Lambda, or ElasticSearch.
        - so what does a Logs Subscription Filter do?―selects the log group and pattern of log events to be fowarded
      - How do you aggregate Logs across Multiple AWS accounts and Regions? (draw it going into KDS, KDF and S3) ↓
    - EC2
      - by default, what logs go from an EC2 machine to CloudWatch?―None. By default no logs.
      - what do you need to run on EC2 to get the logs to CW?―the CloudWatch agent.
      - can a CW agent also run on an on-premise server?―Yes.
  - Logs Agent & Unified Agent
    - what are the two agents? ↓
      - Logs Agent
        - Can only send to `\{\{CloudWatch Logs\}\}`.
      - Unified Agent
        - collects additional `\{\{system\}\}`-level metrics e.g. `\{\{RAM\}\}`
        - What metrics can Unified Agent collect? (hint: C D R N P S)― ↓
          - CPU
          - Disk
          - RAM
          - Netstat
          - Processes
          - Swap
  - CloudWatch Alarms
    - what are the alarm states? ↓
      - OK
      - INSUFFICIENT_DATA
      - ALARM
    - Alarm Targets
      - what are the THREE targets for CW alarms? ↓
        - EC2
          - what can you alarm on for the EC2 instance (hint: S T R R)?― ↓
            - Stop
            - Terminate
            - Reboot
            - Recover
          - what does this mean i.e. an alarm target with Stop?―basically, you ALARM on "Stop", which sends a message to EC2 "hey, your EC2 has Stopped" and then you can automate an action based on that trigger.
        - Auto Scaling (trigger)
        - Send to SNS
      - Explain a composite alarm, using an example CPU metric and IOPS metric?―based on the states of these TWO alarms, you can either OR them or you can AND them for a final "composite" alarm evaluation e.g. if IOPS is high, we expect CPU to be high BUT if CPU is high and IOPS is not, then we should investigate.
      - how can you test your alarms without actually creating an incident?―use CLI to set state for alarm.
  - Amazon EventBridge
    - what are the modes for EventBridge i.e. different ways to set it up to do stuff...
      - Schedule or CRON mode
      - Event Pattern Rules or Trigger mode
      - Triggers lambda functions, sends SQS and SNS messages...
    - in words, how does the EventBridge Rules flow go i.e. from source to destination?―Source, events can get filtered into EB, rules will match that (JSON format) and send to destination.
    - What are the THREE event buses your Amazon EventBridge can route events from? ↓
      - Default Event Bus
      - Partner Event Bus
      - Custom Event Bus
    - what can you do to events so that you're able to replay them later?―Archive them.
    - What allows you to ensure the data you are sending and receiving through EventBridge is well-structured and consistent?―Schema Registry
    - How can you allow or deny events from another AWS Account or AWS Region?―use Resource-based Policies
  - CloudWatch Container Insights
    - collects, aggregates and summarises what from containers?―Metrics & Logs.
  - CloudWatch Lambda Insights
    - Monitoring and `\{\{troubleshooting\}\}` solution for serverless applications running on AWS Lambda
    - Collects, `\{\{aggregates\}\}`, and summarizes `\{\{system\}\}`-level metrics including CPU time, `\{\{memory\}\}`, disk, and `\{\{network\}\}`.
  - CloudWatch Contributor Insights
    - what metrics can you see with these insights and where does it get it from?―Top-N contributors via CloudWatch Logs
    - what kind of network users can you identify from these insights?―heaviest network users.
  - CloudWatch Application Insights
    - Provides automated `\{\{dashboards\}\}` that show potential `\{\{problems\}\}` with monitored applications, to help isolate ongoing issues.
- AWS CloudTrail
  - what does CloudTrail provide for your AWS account? (hint: C G A)― ↓
    - Governance
    - Compliance
    - Audit
  - CloudTrail gives you a history of your `\{\{events\}\}` and `\{\{API\}\}` calls made `\{\{within\}\}` your AWS account.
  - A trail can apply to `\{\{All\}\}` Regions or a `\{\{single\}\}` Region.
  - What are the THREE types of CloudTrail Events? ↓
    - Management Events
      - are management events logged by default?―Yes.
      - can you separate __Read Events__ from __Write Events__?―Yes.
    - Data Events
      - are data events logged by default?―No.
        - why not?―cos its a HIGH VOLUME operation
    - Insight Events
      - what kind of activity does CloudTrail Insights detect?―Unusual activity.
        - what does Insights need to establish first before it can detect "unusual activity"?―needs to establish a "baseline" of normal management events.
        - what kind of events does it continuously analyse to detect unusual patterns?―write events.
  - CloudTrail Events Retention
    - how long are events stored in cloudtrail?―90 days.
    - if you want to store them longer?―log them to S3.
- AWS Config
  - what does AWS Config help you to record? ↓
    - Compliance of your AWS Resources
    - Configurations and changes over time
  - what's an example using SSH that AWS Config can help with?―check if there is unrestricted SSH access and then trigger a remediation to this non-compliance.
  - Rule of thumb, AWS Config Rules `\{\{do not\}\}` prevent actions from happening (no `\{\{deny\}\}`).
  - what are Config Rule Remediation?―automate remediation of non-compliance resources.
    - what can you set to enhance the remediation?―Remediation Retries.
  - What two services can you use to send out __Config Rule Notifications__?― ↓
    - EventBridge
    - SNS
- Summary
  - CloudWatch ... Monitoring
  - CloudTrail ... Auditing
  - Config ... Compliance

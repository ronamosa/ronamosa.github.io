---
title: Serverless Architecture Discussion
---

:::info

These were the topics I created flashcards for (Remnote) and would revise them using spaced repetition. The formatting is an export from Remnote.

:::

- What is the classic serverless architecture stack? ↓
  - API Gateway
  - Lambda
  - DynamoDB (DDB)
- What can you use for authentication for mobile apps?―Amazon Cognito
- If you wanted to provide authenticated access to an S3 bucket, where does Cognito get the token from?―AWS Short Toten Service (STS) API
- if your DDB is getting slammed with reads, what can you do improve performance of your app?―put a DAX cluster in front of the DDB
- what can you do to API Gateway to improve request performance?―cache results with in-built function.
- what is the classic "email notification" flow starting at DDB?― ↓
  - DDB
  - DDB Streams
  - Lambda
  - Simple Email Service (SES)
- what is the classic "thumbnail generation" flow after request has left the client?― ↓
  - cloudfront of s3 directly
  - lambda (process)
  - S3 - upload result to here.
- what can you put between CloudFront and S3 to prevent direct access to your S3 bucket for a public website?― ↓
  - CloudFront Origin Access Control
- AWS recommends Origin Access Identity (OAI) over Origin Access Control. True of False?―False. AWS recommends to use OAC.
- In microservices you are free to design each microservice how you want. True of False?―True.
- what are the two patterns you can use in micro service architecture? ↓
  - Synchronous e.g. API Gateway, Load Balancers
  - Asyncrhonous e.g. SQS, Kinesis, Lambda triggers for S3
- How would you offload the "software update" problem for a lot of EC2's that needed a software update all at once?―Use CloudFront to cache the static update data, and update each EC2 from that.

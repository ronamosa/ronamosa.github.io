---
title: AWS SDK, IAM Roles & Policies
---

:::info

These were the topics I created flashcards for (Remnote) and would revise them using spaced repetition. The formatting is an export from Remnote.

:::

- When should you use SDK?―"when coding against AWS services"
- What are the TWO ways of creating or generating IAM Policies?― ↓
  - Visual Editor (AWS Console)
  - AWS Policy Generator
- IAM Policies apply only to \{\{Users\}\}.
- IAM Roles can be used by \{\{Users\}\} and \{\{Resources\}\} (e.g. EC2 Instances)
- S3 Bucket Policies can only apply to S3 Buckets.
- What is the "magic" IP for AWS instance metadata?―`169.254.169.254`
- What are the available top-level data categories in metadata? ↓
  - meta-data
  - user-data
  - dynamic
- What key info IAM Role info can you get from the metadata endpoint? ↓
  - Access ID
  - Secret
  - Token
- Do you need an IAM Role (auth) to retrieve data from the metadata endpoint?―No.

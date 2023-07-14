---
title: Domain 4 - Identity and Access Management
---

:::info

This is an export from my Remnote with flashcard syntax included.

:::

- Identity & Access Management
  - AWS Directory Service
    - Customer wants to use on‒prem Active Directory as identity provider for AWS resources in the cloud, what THREE steps are needed to federate the on-prem IdP to AWS?↓ ↓
      - Setup IAM Roles with matching permissions.
      - Use `AssumeRoleWithSAML` in STS for temp creds.
      - Configure on-prem ADFS to add trust between AD + AWS
    - Using AD, restrict access access between AWS Services in cloud and on-prem users on-prem, what THREE steps should you use to set this up?↓ ↓
      - create AWS Managed Microsoft AD, using AWS Directory Service to manage cloud resources
      - setup ONE WAY incoming trust in on-prem AD ⇐
      - setup ONE WAY outgoing trust in AWS AD ⇒
  - Amazon Cognito
    - What do I use to grant distinct permissions for each team member between departments?→Cognito User Pool Groups (UPG)
    - User Pool is for AuthN or AuthZ?→AuthN. Handles the whole user functionality.
      - is User Pool an IdP?→Yes.
    - Identity Pool is for AuthN or AuthZ?→AuthZ.
      - is Identity Pool an IdP→No. Federates the AuthN to a 3rd party.
      - can Identity Pool use User Pool as an IdP?→Yes.
      - can Identity Pool be configured to provide unauthenticated access?→Yes.
  - IAM
    - account best practice for access management never use the {{root}} account and even delete any {{access}} keys owned by root.
    - when you give an external party IAM Role to access your accounts, what THREE things to check for issues? ↓
      - use the correct External ID
      - attached permission policy has `sts:AssumeRole` action
      - using the correct IAM Role ARN
    - CloudWatch metrics not being sent to CloudWatch, what least privilege changes to make?→add `cloudwatch:putMetricData` in IAM Policy.
  - Security Groups
    - what are valid sources for SG inbound rules? ↓
      - IP
      - CIDR range
      - VPC Security Group
    - is Instance-ID a valid source for inbound rule?→No.
  - When you hear "ML" and "discovering, classifying, and protecting sensitive data stored in Amazon S3", what AWS Security Service should you think of?→Amazon Macie.
  - When you have a Lambda IAM Execution Role, and you're using "SecureString" in Parameter store, and you get an error, what permission should you be checking for?→`kms:Decrypt` to decrypt the password in Parameter store.
  - SSH Keys
    - if compromised what AWS service allows you to modify all `~/.ssh/authorized_keys` file across all affected EC2 instances?→AWS Systems Manager Run Command.
      - can `modify-instance-attribute` get you there?→No. command doesn't include SSH keys.

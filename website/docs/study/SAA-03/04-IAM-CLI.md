---
title: IAM & AWS CLI
---

:::info

These were the topics I created flashcards for (Remnote) and would revise them using spaced repetition. The formatting is an export from Remnote.

:::

- IAM is a service at the \{\{global\}\} level
- Root account
  - best practice: dont use root account, create user account and use that.
- Groups
  - can only hold users, not \{\{other groups\}\}
  - users can be member of >1 group
  - easier to apply policies
- Policies
  - helps with "least privilege" by granular control of permission
  - are in \{\{JSON\}\} format
  - structure ↓
    - version
    - id (optional)
    - statement
      - SID
      - effect: allow / deny
      - principal: who?
      - resource: objects
  - in-line policy―attached to single user
- Password Policy
  - minimum length
  - character types (symbols, alphanumeric)
  - time between changes
  - reuse
- MFA
  - something you know (password) + something you own (yubikey)
  - options ↓
    - vMFA e.g. Google Authenticator, Authy
    - U2F - Universal Second Factor e.g. Yubikey
    - Hardware Key Fob
    - GovCloud Hardware Key Fob
- Access to AWS Services
  - AWS Management Console (password + MFA)
  - AWS CLI (Access Keys)
    - Key ID ~ username
    - Secret ~ password
  - AWS SDK (Access Keys)
    - programmatic access to AWS Services
- IAM Roles for Services
  - machine service accounts
  - attach policies
- IAM Security Tools (Audit) ↓
  - IAM Credentials Report (account-level)
  - IAM Access Advisor (user-level)
- IAM Best Practice ↓
  - root ~ only use for AWS Setup
  - one person = one AWS user
  - strong password policy
  - MFA
  - Access Keys for Programmatic access (CLI & SDK)
  - never share keys.

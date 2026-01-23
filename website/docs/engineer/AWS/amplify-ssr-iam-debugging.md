---
title: "Debugging AWS Amplify SSR: Unable to Assume IAM Role"
description: "Troubleshooting guide for 'Unable to assume specified IAM Role' errors when deploying Next.js SSR apps to AWS Amplify. Covers trust policies, service roles, and the CLI vs Console workaround."
keywords: ["aws amplify", "ssr", "iam role", "next.js", "amplify hosting", "trust policy", "service role", "amplify debugging"]
tags: ["aws", "amplify", "iam", "next.js", "troubleshooting"]
sidebar_position: 10
---

**TL;DR:** If you're getting "Unable to assume specified IAM Role" errors when deploying a Next.js SSR app to AWS Amplify via CLI, stop. Use the Amplify Console UI to create the app and let it generate the service role automatically. CLI-created roles don't work reliably with Amplify SSR builds.

---

## The Problem

I was deploying a Next.js 14 app (App Router, SSR) to AWS Amplify Hosting. The app needed to read from DynamoDB, so I set up:

- A DynamoDB table (`FamilyTree`)
- An IAM role for Amplify with DynamoDB permissions
- Connected my GitHub repo via a Personal Access Token (PAT)

Every single build failed with:

```
[ERROR]: !!! Unable to assume specified IAM Role. Please ensure the selected
IAM Role has sufficient permissions and the Trust Relationship is configured correctly.
```

The build never even started—it failed immediately after "Build environment configured."

---

## What We Tried (None of This Worked)

### 1. Basic Trust Policy

Started with the documented trust policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "amplify.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**Result:** Failed.

### 2. Added Regional Service Principal

Some AWS docs suggest including the regional Amplify endpoint:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": [
          "amplify.amazonaws.com",
          "amplify.ap-southeast-2.amazonaws.com"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**Result:** Failed.

### 3. Added CodeBuild Principal

Amplify SSR uses CodeBuild under the hood, so maybe it needs that too:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": [
          "amplify.amazonaws.com",
          "amplify.ap-southeast-2.amazonaws.com",
          "codebuild.amazonaws.com"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**Result:** Failed.

### 4. Attached Every Relevant Policy

The role had:

- `AdministratorAccess-Amplify` (AWS managed)
- `AWSCodeBuildAdminAccess` (AWS managed)
- `AmplifyBackendDeployFullAccess` (AWS managed)
- Custom DynamoDB policy for our table

**Result:** Failed.

### 5. Checked for Blockers

- **Service Control Policies (SCPs):** Only `FullAWSAccess` (default allow-all)
- **Permission Boundaries:** None
- **IAM Policy Simulator:** Said `sts:AssumeRole` was allowed
- **CloudTrail:** No failed `AssumeRole` events (error happens inside Amplify's system)
- **STS Regional Endpoints:** Enabled
- **Role MaxSessionDuration:** 3600 (default)

**Result:** Everything looked correct. Still failed.

### 6. Recreated the App

- Deleted the Amplify app
- Created a fresh app with the service role specified from the start
- Re-connected GitHub repo
- Re-added environment variables

**Result:** Failed with the exact same error.

### 7. Disassociated and Re-associated the Role

Removed the service role from the app, saved, then re-added it.

**Result:** Failed.

---

## What Actually Worked

**Use the Amplify Console UI to create the app.**

Instead of:

```bash
aws amplify create-app --name "my-app" --platform WEB_COMPUTE ...
```

Do this:

1. Go to **AWS Amplify Console** → **New app** → **Host web app**
2. Choose **GitHub** and authorize the **AWS Amplify GitHub App** (not a PAT)
3. Select your repository and branch
4. When prompted for **Service role**, let Amplify create one (or select an existing Amplify-managed role)
5. Deploy

The build succeeded on the first try.

---

## The Working Configuration

After the console-based setup, Amplify created a service role with surprisingly **minimal** permissions:

### Service Role (created by Amplify Console)

- **Role name:** `AmplifySSRLoggingPolicy-<uuid>`
- **Trust policy:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "amplify.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

- **Permissions policy:** Just CloudWatch Logs!

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PushLogs",
      "Effect": "Allow",
      "Action": ["logs:CreateLogStream", "logs:PutLogEvents"],
      "Resource": "arn:aws:logs:ap-southeast-2:*:log-group:/aws/amplify/*:log-stream:*"
    },
    {
      "Sid": "CreateLogGroup",
      "Effect": "Allow",
      "Action": "logs:CreateLogGroup",
      "Resource": "arn:aws:logs:ap-southeast-2:*:log-group:/aws/amplify/*"
    },
    {
      "Sid": "DescribeLogGroups",
      "Effect": "Allow",
      "Action": "logs:DescribeLogGroups",
      "Resource": "arn:aws:logs:ap-southeast-2:*:log-group:*"
    }
  ]
}
```

**Wait, what?** The working service role has *fewer* permissions than our broken one. It only has CloudWatch Logs access—no `AdministratorAccess-Amplify`, no CodeBuild permissions, nothing else. Yet it works.

### GitHub Connection

- Uses the **AWS Amplify GitHub App** (not a Personal Access Token)
- This provides more reliable webhook and repository access

---

## Key Differences: CLI vs Console

| Aspect | CLI-Created (Broken) | Console-Created (Working) |
|--------|---------------------|---------------------------|
| Service role creation | Manual IAM role | Amplify auto-creates |
| Trust policy | Identical JSON | Identical JSON |
| Attached policies | `AdministratorAccess-Amplify` + more | **Just CloudWatch Logs!** |
| GitHub connection | PAT (Personal Access Token) | Amplify GitHub App |
| Build result | **FAILED** | **SUCCESS** |

The trust policies were **identical**. The CLI role had **more permissions** than the working one. Yet only the console-created setup worked. This strongly suggests the issue isn't about permissions at all—it's about how Amplify internally registers and validates the role association.

---

## Why Does This Happen?

The fact that the working role has **fewer permissions** than our broken one proves this isn't a permissions issue. The trust policies are identical. The broken role had *more* policies attached.

**Root cause:** Amplify's internal build system has validation or registration logic that only works correctly when the role is created through the console flow. When you create a role via CLI and attach it to an Amplify app, the ARN is stored, but Amplify's build orchestrator fails to assume it—even though IAM says it should work.

This appears to be a bug or undocumented requirement in Amplify's SSR (`WEB_COMPUTE`) platform. Others have reported it:

- [GitHub Issue: amplify-hosting#4035](https://github.com/aws-amplify/amplify-hosting/issues/4035)
- [AWS re:Post discussions](https://repost.aws/questions/QUgMUtAemYTfuxKKD314VmRA)

---

## Lessons Learned

1. **For Amplify SSR apps, use the Console UI to create apps.** The CLI is fine for static sites, but SSR with `WEB_COMPUTE` platform has quirks.

2. **Use the Amplify GitHub App, not a PAT.** It's more reliable and has proper webhook integration.

3. **CloudTrail won't show the failure.** The error happens inside Amplify's build orchestration before any AWS API calls are made from your role.

4. **The IAM Policy Simulator lies (sort of).** It shows the policy *would* allow the action, but Amplify's internal validation fails before that.

5. **"Correct" trust policies aren't enough.** Even with `amplify.amazonaws.com`, `amplify.<region>.amazonaws.com`, and `codebuild.amazonaws.com` all in the trust policy, CLI-created roles don't work. The working role has *fewer* permissions than what we tried.

6. **It's not about permissions.** The console-created role only has CloudWatch Logs permissions—no Amplify admin, no CodeBuild, nothing. Yet it works. Our role with `AdministratorAccess-Amplify` failed. This is clearly an internal Amplify registration issue, not IAM.

7. **Document everything before resetting.** Having a snapshot of the broken state made it easy to compare and confirm that the working role actually has fewer permissions than what we tried.

---

## Quick Fix Checklist

If you hit "Unable to assume specified IAM Role" with Amplify SSR:

- [ ] Delete the CLI-created Amplify app
- [ ] Go to Amplify Console → New app → Host web app
- [ ] Connect via GitHub (use Amplify GitHub App, not PAT)
- [ ] Let Amplify create the service role
- [ ] Add your environment variables in the Console
- [ ] Deploy

Don't waste hours debugging IAM like I did. Just use the console.

---

## Environment

- **AWS Region:** ap-southeast-2
- **Amplify Platform:** WEB_COMPUTE (SSR)
- **Framework:** Next.js 14 (App Router)
- **Date:** January 2026

---

*If this helped you, save someone else the pain and share it.*

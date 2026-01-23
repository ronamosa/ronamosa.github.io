---
sidebar_position: 1
title: January 2026
description: Changes and additions for January 2026
---

# January 2026

## 📅 2026-01-23

### 📚 Documentation Updates

- **RNZ "New Gaza" Article Complaint**: Added guide for submitting formal complaints about RNZ's coverage of the US "New Gaza" proposal
  - Step-by-step instructions for the RNZ complaint form
  - Ready-to-use complaint text addressing Principles 1, 4, 6, and 7
  - Challenges the article's lack of Palestinian perspectives and legal context
  - **Link**: [Complaint: RNZ 'New Gaza' Article](/docs/hacker/RNZ-online-complaint)

## 📅 2026-01-22

### 📚 Documentation Updates

- **AWS Amplify SSR Debugging Guide**: Added troubleshooting documentation for IAM role issues
  - Covers "Unable to assume specified IAM Role" errors with Next.js SSR apps
  - Documents CLI vs Console workarounds and trust policy configurations
  - **Link**: [Amplify SSR IAM Debugging](/docs/engineer/AWS/amplify-ssr-iam-debugging)

- **NextAuth Session Caching Bug Guide**: Added documentation for CloudFront session caching issue
  - Debugging critical bug where CloudFront cached authenticated responses
  - Covers cache-control headers, auth middleware, and Amplify fixes
  - **Link**: [NextAuth Session Caching Bug](/docs/engineer/AWS/amplify-nextauth-session-caching-bug)

### 🛠️ Site Improvements

- **AWS Documentation Cleanup**: Renamed all AWS documentation files to follow kebab-case naming convention
  - Standardized 11 files in `docs/engineer/AWS/` directory
  - Removed redundant `aws-` prefix (folder already provides context)
  - Updated internal links to match new filenames
  - Improves URL consistency and follows project style guidelines
  - **Files renamed**:
    - `AWS-ECS-1Microservices.md` → `ecs-1-microservices.md`
    - `AWS-ECS-2Monitoring.md` → `ecs-2-monitoring.md`
    - `AWS-ECS-3CapacityProviders.md` → `ecs-3-capacity-providers.md`
    - `AWS-ECS-Cats-n-Dogs.md` → `ecs-cats-n-dogs.md`
    - `AWS-EKS-Create-Clusters.md` → `eks-create-clusters.md`
    - `AWS-EKS-Networking.md` → `eks-networking.md`
    - `AWS-EKS-Workshop.md` → `eks-workshop.md`
    - `AWS-Incident-Response.md` → `incident-response.md`
    - `CloudDemoNotes.md` → `cloud-demo-notes.md`
    - `CloudDemoCF.yaml` → `cloud-demo-cf.yaml`
    - `UPNG.md` → `upng.md`


---

## Template for Future Entries

When adding new changelog entries, use this format:

```markdown
## 📅 YYYY-MM-DD

### {CATEGORY}
- **Title**: Brief description of the change
  - Additional details if needed
  - Links to related content: [Link Text](URL)
```

### Change Type Icons

- 🛠️ Site Improvements
- 📚 Documentation Updates
- 📝 Blog Posts
- 🔧 Bug Fixes
- 🎨 Design Changes
- ⚡ Performance Improvements
- 🔒 Security Updates
- 📦 Dependencies

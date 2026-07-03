---
sidebar_position: 1
title: July 2026
description: Changes and additions for July 2026
---

# July 2026

## 📅 2026-07-03

### 🛠️ Site Improvements
- **Newsletter conversion funnel overhaul**: Added site-wide announcement bar, embedded beehiiv forms on homepage and Start Here, new `/newsletter` landing page, and end-of-guide CTA on all docs pages — every link carries UTM attribution (`banner`, `guide`, `home`, `start`, `newsletter-page`)
  - Retired `/subscribe` via client-side redirect to `/newsletter`
  - Removed subscriber counts from homepage
  - Hero CTAs now route warm traffic to Start Here (`/docs/`) with secondary browse anchor
  - **Link**: [Newsletter](/newsletter/)

### 🎨 Design Changes
- **Homepage and docs footer refresh**: Subtle newsletter CTA styling on doc footers; homepage hero social icons removed (footer retains Connect links); curated flagship essay and Start Here entry trio replace auto-latest picks
  - Proof strip (Block 8) intentionally deferred until copy is final

### ⚡ Performance Improvements
- **404 redirect map**: Expanded client-side redirects for legacy `/subscribe`, `/documentation/`, and stale doc category paths
- **Count hygiene**: Docs and blog counts now computed once at build time with rounded display values shared across homepage and Start Here

---

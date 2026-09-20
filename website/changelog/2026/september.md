---
sidebar_position: 1
title: September 2026
description: Changes and additions for September 2026
---

# September 2026

## 📅 2026-09-20

### 📚 Documentation Updates
- **Hub pages for every docs section and sub-section**: Added 16 `index.md` hubs. Previously every one of these roots 404'd
  - **Sections**: `/docs/engineer/`, `/docs/hacker/`, `/docs/study/`, `/docs/archive/`, `/docs/books/`
  - **Sub-sections**: `engineer/{AWS,Azure,GCP,K8s,Projects,guides}`, `hacker/{tryhackme,hackthebox,bufferoverflow}`, and the two archive series (`docker-wordpress`, `terraform-aws-ec2`)
  - Each hub links only to docs that exist, grouped by topic, with a recommended reading order. No placeholder lists for unwritten guides
  - Broken internal links across the site: **194 → 183**
  - **Link**: [Engineer](/docs/engineer/)

### 🛠️ Site Improvements
- **Retired the `generated-index` category pages**: `engineer/`, `hacker/`, `engineer/AI/`, `engineer/Projects/`, and `engineer/guides/` used `link: {type: 'generated-index'}`, which emitted emoji-mangled URLs like `/docs/category/-engineer/` and `/docs/category/<U+FE0F>-hacker/`
  - Replaced with real hub pages; old URLs now 301 via `redirects.js`
  - `engineer/AI/` and `engineer/LAB/` already had hub docs under slug overrides — their categories now point at those docs (`link: {type: 'doc'}`) instead of generating a duplicate index
- **Fixed three 404ing study folder roots**: `/docs/study/{CKS,CKA,SAA-03}/` 404'd because each folder's `README.md` carries a `slug` override. Redirected to the existing study guide rather than duplicating it as a second hub

## 📅 2026-09-17

### 🛠️ Site Improvements
- **Mailing-list redirect (`/list`)**: Added static `static/list/index.html` landing that fires a GA4 `page_view` then bounces to the beehiiv hosted subscribe page after ~500ms — the same pattern as `/tn`
  - Built for Bluesky, which counts the full URL against its 300-character limit. The posted link is bare (`uncommonengineer.com/list`, ~29 characters) and the `utm_*` parameters are re-attached here instead of being carried in the post
  - Defaults to `utm_source=bluesky&utm_medium=post&utm_content=block9-cta`; any `utm_*` supplied on the way in overrides the matching default, so the redirect is reusable from another surface without an edit
  - Points at the beehiiv **hosted** page — the v2 iframe embed strips UTM and referrer
  - `noindex,nofollow`; uses the site GA4 Measurement ID (`G-DMRNTVGLRC`)
  - **Link**: [/list](/list)

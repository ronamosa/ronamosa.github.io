---
sidebar_position: 1
title: September 2026
description: Changes and additions for September 2026
---

# September 2026

## 📅 2026-09-21

### 📦 Dependencies
- **Cleared the dependabot backlog**: 13 open dependabot PRs had accumulated since 2026-08-08. Every one was a *transitive* dependency — none appear in `package.json` — so each was a lockfile-only change that conflicted with the other twelve. Resolved as one lockfile refresh instead
  - `npm audit fix` + `@docusaurus/*` to 3.10.2: **36 vulnerabilities → 19**
  - Added a `lodash-es: ^4.18.1` override. Chevrotain (via mermaid) pinned 4.17.23, which is the last vulnerable version; this cleared the remaining 5 high alerts. **19 → 0 high, 0 low**
  - Added a `mermaid: ^11.16.1` override. `@docusaurus/theme-mermaid` declares an open `>=11.6.0` range, so npm floated to mermaid 12.0.0 — an unverified major on a site with diagrams in 6 files. Pinned to the 11.x line, which resolves the mermaid advisories at 11.16.1 without taking the major

### 🔒 Security Updates
- **Remaining 19 moderate alerts are dev-only and not shipped**: all 19 trace to a single root cause — `uuid@8.3.2` via `sockjs` via `webpack-dev-server`. That package is part of `npm run start` and never reaches the production bundle. `sockjs` pins the version, so npm reports no fix available

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

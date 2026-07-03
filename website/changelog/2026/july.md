---
sidebar_position: 1
title: July 2026
description: Changes and additions for July 2026
---

# July 2026

## 📅 2026-07-03

### 🛠️ Site Improvements
- **LinkedIn newsletter attribution fix**: v2 iframe embed strips referrer/UTM — LinkedIn CTAs route to beehiiv-hosted subscribe page (`bee.uncommonengineer.com/subscribe`) where attribution is captured; `/newsletter` auto-redirects LinkedIn traffic with `linkedin_hosted_redirect` GA4 event; vanity path `/newsletter/linkedin/` → `medium=post`
  - `/newsletter` embed forwards URL `utm_medium` from link hops (guide, banner, blog) before defaulting to `newsletter-page`
  - Granular mediums only: `profile`, `featured`, `pinned`, `post`, `referral` (referrer-only legacy links)
  - Canonical URLs in `siteConstants.js` → `LINKEDIN_NEWSLETTER_URLS`; frozen post CTAs in `LINKEDIN_POST_CTA_STRINGS`

### 🛠️ Site Improvements
- **GEO / answer-engine findability (Task 8)**: AI crawlers explicitly allowed in `robots.txt`; build-time `llms.txt` curated index; `BlogPosting`/`TechArticle` JSON-LD on all blog posts and docs; Pacific AI & Data Sovereignty pillar hub with reciprocal cluster links
  - Curated picks live in `src/data/geoContent.js`
  - **Link**: [Pacific AI & Data Sovereignty hub](/blog/pacific-ai-data-sovereignty/)

### 🛠️ Site Improvements
- **Newsletter conversion funnel overhaul**: Added site-wide announcement bar, embedded beehiiv forms on homepage and Start Here, new `/newsletter` landing page, and end-of-guide CTA on all docs pages — every link carries UTM attribution (`banner`, `guide`, `home`, `start`, `newsletter-page`)
  - Retired `/subscribe` via client-side redirect to `/newsletter`
  - Removed subscriber counts from homepage
  - Hero CTAs now route warm traffic to Start Here (`/docs/`) with secondary browse anchor
  - **Link**: [Newsletter](/newsletter/)

### 🎨 Design Changes
- **Homepage and docs footer refresh**: Subtle newsletter CTA styling on doc footers; homepage hero social icons removed (footer retains Connect links); curated flagship essay and Start Here entry trio replace auto-latest picks
  - Proof strip (Block 8) intentionally deferred until copy is final
- **Homepage newsletter card**: Compact beehiiv embed variant crops excess iframe padding so the signup row fits the card grid
- **Announcement bar copy**: Replaced “Own your stack” line with newsletter positioning aligned to site copy (AI, power, tech — from inside the machine)

### ⚡ Performance Improvements
- **404 redirect map**: Expanded client-side redirects for legacy `/subscribe`, `/documentation/`, and stale doc category paths
- **GA-derived 404 redirects**: Mapped 111 broken paths from Apr–Jul 2026 analytics export (Substack `/p/` slugs, nested hub URLs, old AWS naming, removed blog posts)
- **Count hygiene**: Docs and blog counts now computed once at build time with rounded display values shared across homepage and Start Here

---

---
sidebar_position: 1
title: July 2026
description: Changes and additions for July 2026
---

# July 2026

## 📅 2026-07-23

### 🛠️ Site Improvements
- **Newsletter CTA attribution — stop polluting GA4 acquisition**: Internal newsletter CTAs (announcement bar, docs footer, blog footer, in-post links) previously used `?utm_source=site&utm_medium=<surface>`, which made GA4 start a fresh `site / <surface>` session on every click and fragmented the true acquisition source. Switched these to a non-utm `?ref=<surface>` param that GA4 ignores; the `/newsletter` page maps `ref` back into the Beehiiv subscribe UTMs (with a legacy `utm_medium` fallback), so signup attribution is unchanged while GA4 source/medium reporting is no longer diluted

### 🔧 Bug Fixes
- **Chromebook guide slug typo**: Fixed the misspelled `chomebook-terminal` slug (missing `r`) — renamed to `chromebook-terminal` and added client-side redirects from both indexed typo paths (current `guides/` slug and the retired `Misc/` slug) to the corrected canonical URL, consolidating search authority onto one address
  - **Link**: [How to Enable Linux Terminal on Chromebook](/docs/engineer/guides/chromebook-terminal)

## 📅 2026-07-20

### 🎨 Design Changes
- **Social card refresh**: Updated Open Graph / Twitter preview image (`social-card.jpg`) used for site-wide link sharing

## 📅 2026-07-15

### 📚 Documentation Updates
- **GLXTCH knowledge-lookup search-quality write-up**: New engineer/AI doc covering why the Discord bot's Tavily-backed lookups returned wrong-country results for NZ queries, the classifier + heuristic root causes, the three-layer fix, and the two-form eval (live + deterministic replay) that guards against regressions
  - **Link**: [GLXTCH Knowledge Lookup — Fixing NZ Search Quality](/docs/engineer/AI/glxtch-knowledge-lookup-search-quality)

### 🛠️ Site Improvements
- **TechNesians Discord redirect (`/tn`)**: Added static `static/tn/index.html` landing that fires a GA4 `page_view` (reading `utm_*` off the URL) then bounces to the TechNesians Discord invite after ~500ms
  - Single rotation point — the invite lives only in the `DEST` variable; `/tn` and any printed QR codes never change when the invite is rotated
  - `noindex,nofollow`; uses the site GA4 Measurement ID (`G-DMRNTVGLRC`)
  - **Link**: [/tn](/tn)

## 📅 2026-07-11

### 🛠️ Site Improvements
- **Discord domain verification**: Added `/.well-known/discord` static file for HTTPS domain verification in Discord Connections
  - Served from `website/static/.well-known/discord` via Docusaurus build output

## 📅 2026-07-04

### 🎨 Design Changes
- **Newsletter copy refresh**: Unified positioning across site — "the how vs the what" framing with Pasifika lens, Big Tech, and no-filter fortnightly cadence; context-specific openers on doc footers ("The docs are the how"), blog footers ("This essay"), and Start Here ("The guides"); pitch segments support bold/emphasis formatting via shared `NewsletterPitch` component
- **Doc footer newsletter CTA**: Warm gold accent card with checkmark badge and button-style subscribe link; lead line reads "Enjoying the docs? Good."
- **Homepage cards**: Larger section emojis; featured essay on the Analysis card is now a direct link to the flagship post
- **Announcement bar**: Red brand background with white copy and high-contrast black subscribe link — replaces the default white bar on the dark theme

### 🛠️ Site Improvements
- **Technical landing page (`/docs/`)**: Removed misleading “Recently Updated” block (file mtime, mostly stale study notes); fixed “Where to Start” pathway cards that 404’d (`/docs/engineer`, `/docs/study`); replaced Study pathway with AI Projects hub; moved Study and Books & Papers to the bottom of the docs sidebar
  - **Link**: [Start Here](/docs/)

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

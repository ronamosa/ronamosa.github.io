---
sidebar_position: 1
title: February 2026
description: Changes and additions for February 2026
---

# February 2026

## 📅 2026-02-16

### 🛠️ Site Improvements
- **Google Analytics Event Tracking for Homepage Cards**: Added GA4 custom event tracking to all three homepage content cards
  - Tracks `homepage_card_click` events with card name and destination for each card (Analysis & Essays, Technical Docs, Newsletter)
  - Enables click-through rate analysis from homepage to each section
- **Blog Section Engagement Tracker**: Added client-side module to measure multi-page sessions within Analysis & Essays
  - Fires `blog_section_enter`, `blog_page_view` (with depth counter), and `blog_deep_engagement` (3+ pages) events
  - Uses sessionStorage for per-session page depth tracking
- **Newsletter Conversion Funnel Tracking**: Added `newsletter_page_view` event on subscribe page with referral source detection, and `newsletter_cta_click` event on doc footer CTA
- **Content Section Tagging**: Added client module that tags every page view with its content section (analysis, docs, newsletter, etc.) for traffic source segmentation in GA4
  - Tracks cross-section exploration with `sections_visited_count` and `sections_visited` parameters

### 🔧 Bug Fixes
- **Removed accidentally committed `articles.json`**: Removed 7,600-line Beehiiv feed export from repo and added to `.gitignore`

---

## 📅 2026-02-01

### 🛠️ Site Improvements

- **Newsletter Subscribe Page Update**: Refreshed the subscribe page copy with clearer value proposition
  - New messaging targeting tech builders seeking critical perspectives
  - **Link**: [Subscribe](/subscribe)

- **Doc Footer Newsletter CTA**: Added newsletter promotion to all documentation pages
  - Appears at the bottom of every doc page after the content
  - Styled callout with email emoji and gradient background
  - Non-intrusive placement that catches readers when they finish

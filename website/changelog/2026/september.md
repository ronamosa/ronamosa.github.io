---
sidebar_position: 1
title: September 2026
description: Changes and additions for September 2026
---

# September 2026

## 📅 2026-09-17

### 🛠️ Site Improvements
- **Mailing-list redirect (`/list`)**: Added static `static/list/index.html` landing that fires a GA4 `page_view` then bounces to the beehiiv hosted subscribe page after ~500ms — the same pattern as `/tn`
  - Built for Bluesky, which counts the full URL against its 300-character limit. The posted link is bare (`uncommonengineer.com/list`, ~29 characters) and the `utm_*` parameters are re-attached here instead of being carried in the post
  - Defaults to `utm_source=bluesky&utm_medium=post&utm_content=block9-cta`; any `utm_*` supplied on the way in overrides the matching default, so the redirect is reusable from another surface without an edit
  - Points at the beehiiv **hosted** page — the v2 iframe embed strips UTM and referrer
  - `noindex,nofollow`; uses the site GA4 Measurement ID (`G-DMRNTVGLRC`)
  - **Link**: [/list](/list)

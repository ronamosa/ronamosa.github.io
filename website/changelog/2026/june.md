---
sidebar_position: 1
title: June 2026
description: Changes and additions for June 2026
---

# June 2026

## 📅 2026-06-01

### 🛠️ Site Improvements
- **SEO: enforced trailing slashes and fixed canonical URLs**: Set `trailingSlash: true` in `docusaurus.config.js`. GitHub Pages was 301-redirecting non-slash URLs (`/blog/my-post`) to their trailing-slash form (`/blog/my-post/`) and serving that as the 200 response, but Docusaurus (with `trailingSlash` undefined) was emitting `rel="canonical"`, `og:url`, and `sitemap.xml` entries pointing at the *non-slash* URL — i.e. every canonical pointed at a URL that immediately redirected, and the sitemap mixed both forms. Enforcing the setting normalises every page to a single URL form site-wide so canonical/og:url/sitemap all match the served URL. Confirmed `url` is already correctly set to `https://www.uncommonengineer.com`.

### 🔧 Bug Fixes
- **Replaced stale `ronamosa.io` references with the canonical domain**: Internal links and references to the old `ronamosa.io` domain were sending link equity to a redirected domain. Updated the Algolia search guide (prose link + crawler config), the "Re-Host. Re-Factor. Re-Up." blog post, and the `console-clue.js` easter egg to point at `https://www.uncommonengineer.com`, and refreshed the changelog intro to the current brand. Fixed two doubly-broken "Part 1" links in the Ubiquiti Home Network archive post (old domain **and** a defunct `/documentation/` path that 404s) by converting them to relative doc links that resolve to `/docs/archive/...`.

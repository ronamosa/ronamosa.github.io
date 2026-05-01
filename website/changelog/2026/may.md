---
sidebar_position: 1
title: May 2026
description: Changes and additions for May 2026
---

# May 2026

## 📅 2026-05-01

### 📚 Documentation Updates
- **Hackathon Device Setup Guide rewrite**: Restructured `setup.mdx` to be IT-admin-friendly and logically ordered
  - Reframed the page around "1 device per team, not per student" with a tip callout
  - Added clearer **Minimum System Requirements** table (macOS / Windows x64 only; ChromeOS not supported; Linux noted as out-of-scope)
  - Folded the Kiro sign-in walkthrough into Step 5 of the **Pre-Event Checklist** (with `kiro-firstboot.png` and `kiro-signin-options.png` screenshots) so install precedes sign-in instructions
  - Recommended personal `@gmail.com` over school Workspace accounts to avoid third-party OAuth blocks
  - Added Step 6 smoke test with the annotated Kiro IDE screenshot (`kiro-interface.png`) so IT admins know exactly which panel to type into
  - Added **On the Day — Network Notes** section clarifying that Deloitte's network is pre-configured for Kiro and `npm`
  - **Link**: [Device Setup Guide](/hackathon/setup)

### 🔧 Bug Fixes
- **`window.gtag is not a function` runtime error**: Added a `window.gtag` safety stub via `headTags` in `docusaurus.config.js` so the Google gtag plugin's clientModule never throws when the real gtag script is missing (ad blocker, offline dev, or stale `.docusaurus` cache after switching between dev and prod builds). The real gtag overrides the stub once it loads in production.

### 🎨 Design Changes
- **Hackathon Section Pizazz Pass**: Added emojis to all section headers across the Tech for Good Hackathon docs (home, get-started, setup, mentor guide, prompts, troubleshooting, resources) for quicker scanning and a friendlier vibe
  - **Link**: [Tech for Good Hackathon 2026](/hackathon/)

- **Big Colourful Role Buttons**: Replaced the plain "I'm a Student / Mentor / School IT" text links on the hackathon home page with full-width gradient role cards (red→pink for students, cyan→teal for mentors, purple→indigo for IT)
  - Added `.hackathon-role-grid` and `.hackathon-role-card` styles to `src/css/custom.css`
  - Cards lift on hover and stack responsively on mobile

### 🛠️ Site Improvements
- **Sourced Partner Logos**: Replaced placeholder logo references on the hackathon home page with real assets — AWS and Deloitte SVGs from Wikimedia Commons, Hynds Foundation PNG from `hyndsfoundation.nz`
  - Logos saved under `static/img/hackathon/` and rendered inside a styled `.hackathon-partners` strip
- **Kiro Branding on Hackathon Home**: Added Kiro mascot, icon, and wordmark from `kiro.dev` to the hackathon home page hero — ghost mascot floats beside the intro copy with a "Built with Kiro" pill linking to `kiro.dev`. Layout flips to mascot-on-top on mobile.

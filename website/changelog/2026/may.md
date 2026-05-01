---
sidebar_position: 1
title: May 2026
description: Changes and additions for May 2026
---

# May 2026

## 📅 2026-05-01

### 📚 Documentation Updates
- **Resources page tightened**: Consolidated `resources.mdx` from 87 lines to 49 — merged the duplicate Starter Repos and ZIP Downloads tables into one (Git repo + ZIP columns), combined the three single-bullet "documents" sections (Pitch Template / Judging Criteria / Event Schedule) into one Event Documents list, replaced five repeated placeholder admonitions with a single upfront note, aligned theme emojis with the Prompt Library, and added a "Need help?" pointer to the setup guide's contact section.
  - **Link**: [Resources & Links](/hackathon/resources)

- **Prompt Library refresh**: Reframed `prompts.mdx` to acknowledge that facilitators provide the day's issue list (themes are inspiration, not fixed). Added an "Adapt to your problem" section using the Mere persona to show students how to rewrite generic starter prompts through their own user. Cut the duplicated "What Makes a Good Prompt?" tutorial down to a 12-line vague-vs-specific cheat sheet matching the mentor guide.
  - **Link**: [Prompt Library](/hackathon/prompts)

- **Mentor Playbook tightened**: Replaced the wall-of-text minute-by-minute build script with a scannable role briefing — Your Role, Do/Don't table, day-at-a-glance with one-line jobs per stage, prompt-coaching cheatsheet, judging criteria, and an escalation triage. Cut from ~370 lines to ~85.
  - **Link**: [Mentor Guide](/hackathon/mentor-guide)

- **Hackathon Day Guide rewrite**: Rebuilt `get-started.mdx` to mirror the actual runsheet (Empathise → Ideate → Prototype → Test → Pitch) instead of an 8-step Kiro-only walkthrough
  - Added a schedule table aligned to the 9.30am–2.30pm runsheet
  - Introduced a worked-example persona (Mere, 14) that threads through prompts, ideation, and pitch advice
  - Added a "What is Kiro?" mini-explainer with **Vibe vs Spec** mode guidance (recommends Vibe for the day)
  - Replaced the prescriptive `requirements.md` / TODO flow with flexible starter-or-blank-canvas guidance
  - Added "Working as a team on one laptop" (driver/navigator + keyboard rotation)
  - Added "When Kiro gets it wrong" 2-try escalation rule
  - Strengthened pitch guidance: story-first, live demo > screenshots, screenshots as backup
  - Light cultural framing (kia ora, rangatahi, kia kaha)
  - **Link**: [Hackathon Day Guide](/hackathon/get-started)

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

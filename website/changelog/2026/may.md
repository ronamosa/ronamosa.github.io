---
sidebar_position: 1
title: May 2026
description: Changes and additions for May 2026
---

# May 2026

## 📅 2026-05-06

### 📚 Documentation Updates
- **Regional Points of Contact finalised**: Replaced the TBC placeholders on the hackathon landing page and Device Setup Guide with the real stakeholder-supplied contacts — **Fathin Doray** ([fdoray@deloitte.co.nz](mailto:fdoray@deloitte.co.nz)) for Auckland & Hamilton, and **Shane Kelly** ([shankelly@deloitte.co.nz](mailto:shankelly@deloitte.co.nz)) for Wellington. Emails render as clickable `mailto:` links. Requirements doc updated so Requirement 13 now cites the real names and emails instead of placeholders.
  - **Links**: [Landing Page](/hackathon/) · [Device Setup](/hackathon/setup)
- **Round-2 stakeholder feedback applied to hackathon docs (Phase 2)**: Locked the Hackathon Day Guide schedule to the official 13-row Order of Events (registration 9:00 through schools depart 2:45), renamed the morning warm-up from a "welcome & warm-up with scavenger hunt" to **Icebreaker & problem exploration** across both the student and mentor guides, and extended the build stage to 60 minutes under its new name **Design & prototyping with Kiro**. Added a dedicated **[Judging Guide](/hackathon/judging-guide)** for judges, mentors, and curious students covering the six assessment criteria (Problem & Impact, Solution, Use of Kiro, Feasibility, Creativity & Innovation, Communication), how to give positive and constructive feedback (2-positives-to-1-suggestion ratio, example phrasings), body language, and supporting student confidence. Introduced a **Trustworthy AI** subsection inline on the Hackathon Day Guide with a stable `#trustworthy-ai` anchor, covering honesty about AI use, verifying AI output, keeping personal information out of prompts, and what to do if something feels wrong — with a warning admonition at the top of the build stage pointing students there before they prompt Kiro. Added an "I'm a Judge" audience entry card to the landing page, reframed the Mentor Playbook's "What Judges Look For" into a tight summary plus link to the Judging Guide, and added a "Reinforcing Trustworthy AI" coaching note for mentors. Replaced the generic organiser-contact placeholder on both the landing page and the Device Setup Guide with a two-entry **Regional Points of Contact** block (Auckland & Hamilton TBC; Wellington/Shane TBC). Updated the Hynds Foundation partner designation to **Funding and Programme Delivery Partner** (they're now also prize co-funders alongside Deloitte and AWS).
  - **Links**: [Hackathon Day Guide](/hackathon/get-started) · [Judging Guide](/hackathon/judging-guide) · [Mentor Playbook](/hackathon/mentor-guide) · [Landing Page](/hackathon/) · [Device Setup](/hackathon/setup)

---

## 📅 2026-05-05

### 📚 Documentation Updates
- **Round-1 user-testing feedback applied to hackathon docs**: Actioned feedback from pre-event Mac setup testing — added explicit Apple Silicon vs Intel guidance to the setup guide (Apple menu 🍎 → About This Mac → Chip line), introduced an in-Kiro **Simple Browser** "see your app live" walkthrough in the Hackathon Day Guide with a four-step click-to-zoom screenshot gallery (`kiro-simple-browser-1-palette.png` → `...-2-url-prompt.png` → `...-3-url-localhost.png` → `...-4-split.png`) so students can see the palette → URL prompt → running app flow without alt-tabbing, and upgraded the "Make It Your Own" section from a soft suggestion to an explicit requirement — every team now ships the starter TODOs **plus at least two persona-driven features they ideate themselves**. Mirrored the "2 own features" expectation in the Prompt Library, the Mentor Playbook day-at-a-glance, and the judging criteria so facilitators, mentors, and students see the same story.
  - **Links**: [Device Setup](/hackathon/setup) · [Hackathon Day Guide](/hackathon/get-started) · [Prompt Library](/hackathon/prompts) · [Mentor Guide](/hackathon/mentor-guide)

### 🎨 Design Changes
- **Click-to-zoom screenshot gallery**: New `.hackathon-screenshots` CSS pattern in `custom.css` — responsive grid of thumbnails (`auto-fit, minmax(240px, 1fr)`) with a hover lift, red border on hover, and `cursor: zoom-in`. Each thumbnail is an `<a>` pointing at its own image with `target="_blank"`, so clicking opens the full-res PNG in a new tab — zero JS, no lightbox library. Used in the new Simple Browser walkthrough on the Hackathon Day Guide.

### 🔧 Bug Fixes
- **Troubleshooting: "Invalid Model ID" error**: Added a new troubleshooting entry covering the transient Kiro backend error where the Chat Panel returns *"Invalid model ID"* when the model selector is on **Auto**. Fix is to switch to a specific model (e.g. Claude Sonnet), resend the prompt, restart Kiro if it persists, and flag to the AWS technical mentor if multiple teams hit it at once (likely upstream outage).
  - **Link**: [Troubleshooting → Invalid Model ID](/hackathon/troubleshooting)

---

## 📅 2026-05-03

### 📚 Documentation Updates
- **Tuning a Discord Tier System From Data, Not Vibes**: New doc walking through how I recalibrated GLXTCH's tier promotion thresholds from real DynamoDB activity data — swapped lifetime counters for rolling 8w/16w windows across the Lambda, `/status` command, and dashboard, centralised channel IDs in CDK, and uncovered a downstream bug where the evaluate Lambda was re-kicking already-departed members. Includes a one-shot reconcile script pattern (dry-run by default), a TL;DR, pull-out admonitions for the rolling-vs-lifetime rule, the Discord delete idempotency gotcha, and the vacation interaction known issue, and screenshots of the Discord tier-role ladder (with grace periods) and the dashboard tier-status panel showing rolling-window progress in action.
  - **Link**: [Tuning a Discord Tier System From Data, Not Vibes](/docs/engineer/Projects/data-driven-tier-thresholds)
- **Claude Code Cost Tracking — Bedrock vs Pro Max (Part 1)**: New doc covering the build of a Python CLI that compares Claude Code spend across Claude Pro Max (flat subscription) and AWS Bedrock (pay-per-token). Includes the AWS Marketplace billing surprise, Cost Explorer query patterns for third-party models, cache economics breakdown, and an Application Inference Profile tag propagation test.
  - **Link**: [Tracking Claude Code Spend — Bedrock vs Pro Max, Part 1](/docs/engineer/AI/claude-code-cost-tracking-bedrock-vs-pro-max)

---

## 📅 2026-05-02

### 📚 Documentation Updates
- **Hackathon setup guide — starter projects published**: All 5 starter repos are now public, so the placeholder under Step 4 has been replaced with direct ZIP download links for each project (Water Watch NZ, How Are You Today?, Kai Share, Kaitiaki Watch, Green School Tracker). Added a tip suggesting IT admins pre-run `npm install` during setup if they have internet, so day-of startup is instant.
  - **Link**: [Device Setup Guide → Step 4](/hackathon/setup)
- **Placeholder audit complete**: The only placeholders remaining across the hackathon section are organiser contact details (`setup.mdx`, `index.mdx`) and three Google Docs/Sheets links on the Resources page (pitch template, judging criteria, event schedule).

## 📅 2026-05-01

### 📚 Documentation Updates
- **Tied hackathon docs to starter projects** (Option A: every team uses a starter):
  - **Day Guide Section 5 rewrite**: replaced the open-or-scaffold ambiguity with the canonical starter flow — `File → Open Folder` → `npm install && npm start` → `localhost:3000` → read `requirements.md` → pick a TODO → find the matching prompt. Moved the Vibe vs Spec explainer here from Section 1 (it's needed at build time, not warm-up time).
  - **Day Guide Section 1 slimmed**: dropped the smoke-test/sign-in steps since IT does that pre-event; kept just the icebreaker context.
  - **Prompt Library restructured**: each theme now has 5 prompts numbered TODO 1–5 (matching the 5 TODOs in each starter's `requirements.md`). Prompts reference real API endpoints, field names, and CSS classes from each starter so Kiro produces code that fits the existing scaffold.
  - **Starter-repo READMEs updated** (all 5 repos): added a "First time?" pointer to the Day Guide at the top, and a "Need help?" footer linking to the Day Guide, Prompt Library, and Troubleshooting.
  - **Link**: [Hackathon Day Guide](/hackathon/get-started)

- **Hackathon starter projects published**: Replaced the placeholder repo and ZIP links on `resources.mdx` with the real GitHub repos and ZIP downloads — 🌊 Water Watch NZ (ocean pollution), 💛 How Are You Today? (youth wellbeing), 🍲 Kai Share (community food sharing), 🦎 Kaitiaki Watch (native species), and ♻️ Green School Tracker (school sustainability). Aligned the school-sustainability emoji to ♻️ across the homepage and prompt library to match.
  - **Link**: [Resources & Links](/hackathon/resources)

- **Troubleshooting page corrections**: Fixed the Sign-In section that previously contradicted the rest of the docs — it now correctly leads with "use a personal `@gmail.com`, not your school email" as the most common fix, naming the *"This app is blocked by your administrator"* error explicitly. App-data clearing demoted to a reversible "last resort" with rename-not-delete. Merged "Kiro Not Responding" and "Kiro Running Slowly" into one **🐢 Kiro Slow or Frozen** section, aligned the ARM section's Linux mention with the Setup Guide, and softened the "starter project" reset advice.
  - **Link**: [Troubleshooting](/hackathon/troubleshooting)

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

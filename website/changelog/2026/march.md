---
sidebar_position: 1
title: March 2026
description: Changes and additions for March 2026
---

# March 2026

## 📅 2026-03-29

### 📝 Blog Posts
- **The Blue Pill Doesn't Work Here**: Essay on why there is no neutral political position for Pasifika people in tech — the apolitical stance won't protect you when biased algorithms and facial recognition systems show up at your door
  - **Link**: [The Blue Pill Doesn't Work Here](/blog/the-blue-pill-doesnt-work-here)

### 🎨 Design Changes
- **Newsletter description refresh**: Updated newsletter copy on homepage card and subscribe page to new tagline — "Unfiltered takes on AI, power, and tech from a Pasifika engineer twenty-plus years inside the machine. No polish. Fortnightly."

### ⚡ SEO Optimisations
- **Meta title/description rewrite**: Rewrote frontmatter for the 10 highest-impression pages based on Google Search Console query intent data — Mr Robot CTF, Pi-hole + Unbound, iPhone to Linux, Oh My Zsh, Chromebook terminal, LangChain Bedrock, PrivateGPT, and 3 Proxmox guides
- **Pi-hole pillar page**: Created `/docs/engineer/LAB/pihole-guide` hub page linking all Pi-hole guides with FAQ section and internal backlinks from each sub-page
- **Proxmox hub SEO**: Updated title/description on existing Proxmox hub page to target homelab search queries
- **Structured data component**: Built reusable `StructuredData.jsx` component (`FAQSchema` + `HowToSchema`) and added JSON-LD to 6 pages — Mr Robot (FAQ), Pi-hole guide (FAQ), iPhone backup (HowTo), Oh My Zsh (HowTo), Chromebook terminal (HowTo), Proxmox cloud-init (HowTo)
- **AI docs audit**: Noindexed Bedrock LangChain workshop (0.07% CTR), added version warning to PrivateGPT, fixed Mistral-7B SageMaker title, added missing frontmatter to trello-mcp-setup-guide
- **Missing descriptions**: Added meta descriptions to 13 active docs pages (engineer/LAB, engineer/AWS, engineer/Projects, hacker/tryhackme) that had none
- **Open Graph tags**: Added `og:type`, `og:site_name`, and `og:locale` to `docusaurus.config.js` themeConfig metadata

### 🛠️ Site Improvements
- **Blog SEO overhaul**: Rewrote truncated/AI-generated meta descriptions on 7 older posts, expanded generic keywords across 12 posts, added missing frontmatter fields to 5 posts, fixed a broken OG image path
- **New social card**: Replaced 4.9MB social card with a compressed 122KB version featuring updated brand copy — "Mastery before rebellion. Cloud Engineering | AI Sovereignty | Pasifika"
- **robots.txt**: Added `robots.txt` pointing crawlers to the sitemap
- **Author metadata**: Added social links (LinkedIn, GitHub, YouTube, X) to `authors.yml` for richer structured data
- **Build safety**: Identified 20+ pre-existing broken links across docs and changelog; `onBrokenLinks` remains `warn` pending a dedicated link cleanup

---

## 📅 2026-03-28

### 📚 Documentation Updates
- **Lab Notes: AI Bias Mitigation in Gemini**: Documented an experiment stress-testing Gemini's ability to mitigate Western bias in geopolitical analysis using prompting techniques and Gems. Records the full interaction and findings.
  - **Link**: [AI Bias Mitigation in Gemini](/docs/engineer/AI/AI-Bias-Mitigation-Gemini)

---

## 📅 2026-03-15

### 📝 Blog Posts
- **AI Native Is the New Digital Native**: Essay on how the failed "digital native" myth is being repeated with "AI natives" — a marketing label that projects competence onto kids who actually need critical thinking skills before the tools are handed over
  - **Link**: [AI Native Is the New Digital Native](/blog/ai-native-is-the-new-digital-native)

---

## 📅 2026-03-14

### 🛠️ Site Improvements
- **Mermaid Diagram Support**: Added `@docusaurus/theme-mermaid` for rendering Mermaid diagrams in markdown/MDX code blocks site-wide
- **Dynamic Start Here Page**: Rebuilt `/docs/` landing page as a living "Now" page that auto-populates latest blog posts and recently updated docs at build time. Extended `content-counts` plugin to collect recent content metadata, created new React components (`RecentPosts`, `RecentDocs`, `SiteStats`), and converted `start-here.md` to MDX.
  - Sharpened intro voice to match the evolved site identity
  - Added curated "Where to Start" section with thematic entry points
  - Moved static credentials/reading list content to About page where it belongs
  - **Link**: [Start Here](/docs/)

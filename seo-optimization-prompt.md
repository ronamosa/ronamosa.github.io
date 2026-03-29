# SEO Optimisation Prompt for uncommonengineer.com

> **Context:** This prompt is for a Cursor AI agent working on the uncommonengineer.com Docusaurus site repo. The site is a technical blog by Ron Amosa — a Senior Solutions Architect at AWS specialising in AI/ML, containers/Kubernetes, cloud security, and cybersecurity. The site covers homelab infrastructure, CTF/hacker walkthroughs, AI/ML guides, and miscellaneous how-to content. It runs on Docusaurus and is deployed to GitHub Pages.
>
> **Data source:** Google Search Console export, last 28 days ending 27 March 2026. 1,216 clicks, ~138,000 impressions, 0.88% CTR, avg position 7.0 across 482 indexed pages.

---

## TASK 1: Rewrite Meta Titles and Descriptions (HIGHEST PRIORITY)

The site's biggest problem is CTR — pages are ranking but not getting clicked. Rewrite the frontmatter `title` and `description` fields (Docusaurus uses these for `<title>` and `<meta name="description">`) for the pages listed below.

### Rules for titles:
- Keep under 60 characters (Google truncates beyond this)
- Lead with the primary keyword (what the searcher typed)
- Include a differentiator or year where relevant (e.g. "2026 Guide", "Step-by-Step", "Complete Walkthrough")
- Do NOT use clickbait. This audience is technical — be precise and useful
- Match the actual search intent revealed by the query data below

### Rules for descriptions:
- Keep under 155 characters
- Summarise what the reader will get (tools used, outcome, scope)
- Include secondary keywords naturally
- End with a value signal (e.g. "with full config files" or "tested on Ubuntu 24.04")

### Pages to optimise (in priority order):

---

#### 1. Mr Robot CTF Walkthrough — TryHackMe
**Path:** `docs/hacker/tryhackme/mr_robot/`
**Current performance:** 24,544 impressions, 52 clicks, 0.21% CTR, position 4.6
**Problem:** Massive impressions, almost no clicks. This page is ranking in top 5 for hundreds of Mr Robot THM queries but the SERP listing isn't compelling enough. Searchers are looking for: step-by-step flag walkthroughs, specific answers (key-1-of-3, key-2-of-3, key-3-of-3), WordPress exploitation steps, nmap SUID privilege escalation, reverse shell techniques.

**Top queries hitting this page:**
- "mr robot walkthrough" (98 imps, pos 6.5)
- "mr robot tryhackme walkthrough" (127 imps, pos 4.8)
- "tryhackme mr robot walkthrough" (107 imps, pos 4.8)
- "mr robot ctf tryhackme walkthrough" (88 imps, pos 6.5)
- "tryhackme mr robot ctf walkthrough" (74 imps, pos 6.7)
- Hundreds of long-tail queries about specific flags, WordPress creds, nmap SUID, reverse shell users — all at 0% CTR

**Recommended title:** `Mr Robot CTF Walkthrough — TryHackMe (All 3 Keys)`
**Recommended description:** `Complete Mr Robot TryHackMe walkthrough covering all 3 keys — WordPress enumeration, reverse shell, SUID nmap privilege escalation. Step-by-step with screenshots.`

**Additional action:** This page has ~4,000 impressions for queries containing literal flag answers and hash values (e.g. "073403c8a58a1f80d943455fb30724b9"). Google is surfacing the page for these but users aren't clicking because they can see the answer in search snippets from competitors. Consider adding an FAQ section at the bottom with structured data (see Task 3) covering the most common specific questions: "What is key-1-of-3?", "What is the Mr Robot WordPress password?", "How do you escalate privileges in Mr Robot THM?". This lets you own the rich snippet for these queries.

---

#### 2. Pi-hole + Unbound + Docker Compose Guide
**Path:** `docs/engineer/LAB/pihole-docker-unbound/`
**Current performance:** 17,692 impressions, 197 clicks, 1.11% CTR, position 7.2
**Problem:** This is the site's #1 traffic page but CTR is still low for the volume. The main keyword cluster ("pihole unbound docker", "unbound docker", "pihole unbound docker compose") has the page ranking 3.9–8.0 but broad terms like "pihole unbound" (655 imps, pos 9.0) and "unbound pihole" (315 imps, pos 8.7) are barely converting.

**Top queries:**
- "unbound docker" (724 imps, pos 8.0, 1.93% CTR)
- "pihole unbound" (655 imps, pos 9.0, 0.46% CTR)
- "unbound pihole" (315 imps, pos 8.7, 0.32% CTR)
- "pihole unbound docker" (149 imps, pos 3.9, 7.38% CTR)
- "unbound docker compose" (221 imps, pos 5.8, 2.26% CTR)
- "pihole unbound docker compose" (68 imps, pos 3.9, 11.76% CTR)
- "unbound dns docker" (125 imps, pos 6.9, 0% CTR)

**Recommended title:** `Pi-hole + Unbound Docker Compose Setup Guide (2026)`
**Recommended description:** `Run Pi-hole with Unbound as a recursive DNS resolver in Docker Compose. Full docker-compose.yml, Unbound config, and network setup included. Tested and updated for 2026.`

**Additional action:** The H1 and opening paragraph should explicitly contain "Pi-hole", "Unbound", "Docker", "Docker Compose", and "recursive DNS" within the first 100 words. Check that these keywords appear naturally — this page has a long tail of queries about specific Docker images (klutchell/unbound, mvance/unbound) that suggest users want to know which image to use and why. If the guide covers this, make sure it's visible early.

---

#### 3. iPhone Photo Backup to Linux
**Path:** `docs/engineer/Misc/iphone-to-linux-mount/`
**Current performance:** 8,745 impressions, 74 clicks, 0.85% CTR, position 6.1
**Problem:** Solid position but low CTR. Queries are varied: "iphone backup linux", "transfer photos from iphone to linux", "mount iphone on linux", "transfer files from iphone to ubuntu". The current title needs to match the dominant intent (backup/transfer photos, not just "mount").

**Recommended title:** `iPhone Photo Backup to Linux — Complete Guide (No iTunes)`
**Recommended description:** `Back up iPhone photos to Ubuntu or Debian Linux using libimobiledevice and ifuse. Mount DCIM, automate transfers with rsync. No iTunes or Finder needed.`

---

#### 4. Terminal Setup — Oh My Zsh + Powerlevel10k
**Path:** `docs/engineer/LAB/Terminal/`
**Current performance:** 7,098 impressions, 50 clicks, 0.70% CTR, position 7.2
**Problem:** The page title is too vague — "Terminal" tells Google nothing. The page is actually ranking for "oh my zsh powerlevel10k" (350 imps), "ohmyzsh powerlevel10k" (139 imps), plus dozens of installation and setup queries. The title needs to name the actual tools.

**Recommended title:** `Oh My Zsh + Powerlevel10k Setup Guide for Linux`
**Recommended description:** `Install and configure Oh My Zsh with Powerlevel10k theme, autosuggestions, and syntax highlighting on Ubuntu/Debian. Includes tmux integration and full dotfile config.`

---

#### 5. Chromebook Linux Terminal Setup
**Path:** `docs/engineer/Misc/chomebook-terminal/` (note: typo in URL — "chomebook" not "chromebook")
**Current performance:** 4,829 impressions, 17 clicks, 0.35% CTR, position 8.4
**Problem:** Very low CTR despite decent impressions. Queries are all about enabling and using the Linux terminal on Chromebook: "chromebook terminal", "chromebook linux terminal", "how to use terminal on chromebook", "enable linux development environment chromebook". The page is positioned 8-10 for most of these, and the title/description need to precisely match this intent.

**Recommended title:** `How to Enable Linux Terminal on Chromebook (2026)`
**Recommended description:** `Step-by-step guide to enabling the Linux development environment on Chromebook, customising the Penguin terminal prompt, and installing dev tools on Chrome OS.`

**Note:** The URL has a typo ("chomebook"). You cannot change the URL without breaking existing links and losing ranking equity. Instead, ensure the correct spelling "Chromebook" appears in the title, description, H1, and body text. Consider adding a redirect from a correctly-spelled URL to the existing one as a long-term fix.

---

#### 6. Bedrock LangChain Workshop
**Path:** `docs/engineer/AI/BedrockLangChainWorkshop1/`
**Current performance:** 2,738 impressions, 2 clicks, 0.07% CTR, position 8.2
**Problem:** Essentially zero conversion. Queries are highly specific import statements ("from langchain_community.llms import bedrock") and deployment guides ("deploy langchain application to aws"). The page seems to be workshop notes rather than a standalone guide. Users see it in search results and skip it because it looks like internal notes, not a useful resource.

**Two options:**
1. **Rewrite as a proper guide** — If the content is substantial enough, reframe it as "Deploy a LangChain App on AWS Bedrock — Step-by-Step Guide" with a clear title, introduction, and structured walkthrough.
2. **Noindex it** — If the content is genuinely just workshop notes and not worth rewriting, add `noindex: true` to the frontmatter. There's no point having a page that gets 2,738 impressions and 2 clicks — it actually hurts site-level CTR signals.

**If rewriting:**
**Recommended title:** `LangChain + AWS Bedrock Workshop — Deploy LLMs on AWS`
**Recommended description:** `Build and deploy a LangChain application with Amazon Bedrock. Covers LLM integration, BedrockChat setup, prompt templates, and AWS deployment. Full working code.`

---

#### 7. PrivateGPT Local Setup
**Path:** `docs/engineer/AI/PrivateGPT/`
**Current performance:** 2,623 impressions, 12 clicks, 0.46% CTR, position 7.3
**Problem:** PrivateGPT queries have strong intent ("privategpt local rag" — 101 imps, "privategpt local documents" — 63 imps) but the page isn't converting. Likely because PrivateGPT has evolved significantly and the page may be dated.

**Recommended title:** `PrivateGPT Local Setup — Chat with Documents Privately`
**Recommended description:** `Set up PrivateGPT for local RAG — chat with your documents using a local LLM. Covers installation, document ingestion, and FAISS vector store configuration.`

**Critical action:** Check if the content reflects the current version of PrivateGPT. If it's based on an older version, either update it or add a clear "Last tested with PrivateGPT vX.X" note and link to the current project. Stale AI/ML content actively repels clicks because searchers can tell from the snippet.

---

#### 8. Proxmox Cloud-Init Template Guide
**Path:** `docs/engineer/LAB/proxmox-cloudinit/`
**Current performance:** 3,832 impressions, 63 clicks, 1.64% CTR, position 7.7

**Recommended title:** `Proxmox Cloud-Init VM Template — Ansible Automation Guide`
**Recommended description:** `Create reusable Proxmox VM templates with cloud-init. Automate provisioning with Ansible, clean machine-id, and deploy Ubuntu cloud images. Full playbook included.`

---

#### 9. Proxmox Packer VM Guide
**Path:** `docs/engineer/LAB/proxmox-packer-vm/`
**Current performance:** 3,638 impressions, 60 clicks, 1.65% CTR, position 7.2

**Recommended title:** `Build Proxmox VM Templates with Packer — Complete Guide`
**Recommended description:** `Automate Proxmox VM template creation using HashiCorp Packer. HCL config, cloud-init integration, and CI/CD pipeline setup. Step-by-step with full source.`

---

#### 10. Proxmox Terraform Guide
**Path:** `docs/engineer/LAB/proxmox-terraform/`
**Current performance:** 3,372 impressions, 35 clicks, 1.04% CTR, position 8.0

**Recommended title:** `Terraform Proxmox Provider — Deploy VMs with Telmate`
**Recommended description:** `Use the Telmate Terraform provider to deploy and manage Proxmox VMs as code. Full .tf examples, cloud-init integration, and provider configuration walkthrough.`

---

## TASK 2: Create Pillar Pages with Internal Linking

### 2a. Pi-hole Pillar Page

Create a new page at `docs/engineer/LAB/pihole-guide/` (or similar) titled **"The Complete Pi-hole Guide: Docker, Unbound DNS, and Troubleshooting"** that serves as a hub linking to:

- `pihole-docker-unbound/` — Main setup guide
- `pihole-dns/` — DNS configuration
- `fixing-pihole-unbound-servfail-aws/` — Troubleshooting SERVFAIL

Structure:
1. Brief intro (what Pi-hole + Unbound gives you, why recursive DNS matters)
2. Section per sub-guide with a 2-3 sentence summary and a link
3. FAQ section targeting queries like "what is unbound pihole", "why use unbound with pihole", "pihole unbound servfail" — all of which have impressions but 0 clicks currently
4. Add HowTo or FAQ structured data (see Task 3)

Then go back and add a prominent link from each sub-page back to this pillar page (e.g. a callout box at the top: "Part of the Complete Pi-hole Guide →").

### 2b. Proxmox Pillar Page

Create a hub at `docs/engineer/LAB/proxmox-guide/` titled **"Proxmox Homelab Guide: Cloud-Init, Packer, Terraform, and LVM"** linking:

- `proxmox-cloudinit/`
- `proxmox-packer-vm/`
- `proxmox-terraform/`
- `proxmox-lvm-mount/`

Same structure as above. Target queries: "proxmox orchestration", "proxmox infrastructure provider", "proxmox homelab setup".

---

## TASK 3: Add Structured Data (JSON-LD)

For Docusaurus, structured data needs to be added via a custom component or by editing the page's MDX to include a `<script type="application/ld+json">` block, or by using a Docusaurus plugin/theme that supports it.

### Pages to add FAQ schema:
- Mr Robot walkthrough — FAQ covering the top 5 questions (keys, WordPress creds, nmap SUID)
- Pi-hole + Unbound guide — FAQ covering "what is unbound", "why use unbound with pihole", "how to fix servfail"

### Pages to add HowTo schema:
- iPhone to Linux mount guide
- Oh My Zsh + Powerlevel10k setup
- Chromebook terminal setup
- Proxmox cloud-init template guide

### Implementation approach:
Create a reusable `<StructuredData>` component in `src/components/` that accepts FAQ or HowTo props and renders the JSON-LD. Example:

```jsx
// src/components/StructuredData.jsx
import React from 'react';
import Head from '@docusaurus/Head';

export function FAQSchema({ items }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(({ question, answer }) => ({
      "@type": "Question",
      "name": question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": answer
      }
    }))
  };

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Head>
  );
}

export function HowToSchema({ name, description, steps }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map(({ name, text }, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": name,
      "text": text
    }))
  };

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Head>
  );
}
```

Then use in MDX files:
```mdx
import { FAQSchema } from '@site/src/components/StructuredData';

<FAQSchema items={[
  { question: "What is key-1-of-3 in Mr Robot TryHackMe?", answer: "Key 1 is found in robots.txt..." },
  { question: "What is the WordPress password in Mr Robot CTF?", answer: "The credentials are..." }
]} />
```

---

## TASK 4: AI/ML Content Audit

Review all pages under `docs/engineer/AI/` and for each one:

1. Check the `title` and `description` frontmatter — update to match the patterns in Task 1
2. Check if the content references outdated versions, deprecated APIs, or tools that have significantly changed (PrivateGPT, LangChain, Bedrock SDK)
3. For pages that are genuinely workshop notes or scratch content (not standalone guides), either:
   - Rewrite them into proper guides with introduction, prerequisites, steps, and conclusion
   - Or add `noindex: true` to frontmatter if the content isn't worth the rewrite
4. For the Mistral-7B SageMaker page (1,029 imps, 24 clicks, 2.33% CTR, pos 7.7) — this is actually performing OK. Update title to: **"Deploy Mistral-7B on AWS SageMaker with Ollama"** and ensure content reflects current Ollama/SageMaker compatibility

---

## TASK 5: Quick Technical SEO Checks

While you're in the repo, verify the following:

1. **Check `docusaurus.config.js` for:**
   - `metadata` array includes a site-wide description
   - `themeConfig.metadata` includes Open Graph and Twitter card defaults
   - Sitemap plugin is enabled and generating `/sitemap.xml`
   - `url` and `baseUrl` are correctly set

2. **Check for pages with no `description` in frontmatter** — run a quick grep across all `.md`/`.mdx` files:
   ```bash
   find docs/ -name "*.md" -o -name "*.mdx" | xargs grep -L "description:" | head -20
   ```
   Any page without a description is getting an auto-generated snippet from Google, which is usually worse than a crafted one.

3. **Check image alt text** — Docusaurus images should have descriptive alt text. Key pages to check: Pi-hole guide, Mr Robot walkthrough, Proxmox guides.

4. **Canonical URLs** — Ensure no duplicate content issues between `www.uncommonengineer.com` and `uncommonengineer.com` (check `docusaurus.config.js` url field and any redirect rules).

---

## Summary — Priority Order

| Priority | Task | Expected Impact |
|----------|------|-----------------|
| 🔴 P0 | Rewrite titles/descriptions for pages 1-7 (Task 1) | +500-1000 clicks/month |
| 🟠 P1 | Fix or noindex Bedrock LangChain page | Stop bleeding site CTR signals |
| 🟠 P1 | Update PrivateGPT content for current version | Recapture ~100+ clicks/month |
| 🟡 P2 | Create Pi-hole pillar page with internal links | Lift all Pi-hole pages by 1-2 positions |
| 🟡 P2 | Add structured data to top 6 pages | Rich snippets → CTR uplift |
| 🟢 P3 | Create Proxmox pillar page | Long-term authority building |
| 🟢 P3 | Audit remaining AI/ML content | Clean up or strengthen weakest section |
| 🟢 P3 | Technical SEO checks (Task 5) | Baseline hygiene |

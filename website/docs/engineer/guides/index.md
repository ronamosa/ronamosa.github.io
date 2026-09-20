---
title: "Engineering Guides: Debugging Post-Mortems, Site Setup & Linux Fixes"
description: "Cross-platform guides and debugging post-mortems that don't fit a single cloud — MPEG-TS metadata loss, macOS local network enforcement, Docusaurus, and Linux fixes."
keywords: ["debugging", "post-mortem", "docusaurus", "algolia", "linux", "macos", "mpeg-ts", "ffmpeg", "chromebook"]
tags: ["guides", "debugging", "linux", "docusaurus", "troubleshooting"]
sidebar_position: 0
---

# Guides

Cross-platform tooling, site setup, and practical how-tos that don't fit a single cloud or lab bucket.

## 🔬 Debugging Post-Mortems

The two deepest investigations here — both start from a symptom that looked impossible.

- **[KLV Metadata Loss in MPEG-TS](./klv-investigation-postmortem)** — a one-byte PES header bug, found with PyAV and ffmpeg
- **[Chrome ERR_ADDRESS_UNREACHABLE on macOS 26](./chrome-macos26-local-network-eaddrunreach)** — local network enforcement vs code-sign clone identity

## 🌐 Running This Site

How uncommonengineer.com is actually built:

- [Docusaurus GitHub Pages Deployment](./docusaurus-setup) — the base setup
- [Algolia Search for Docusaurus](./docusaurus-algolia-search) — with Cloudflare CDN
- [Beehiiv Custom Domain with Cloudflare](./beehiiv-dns) — newsletter DNS configuration

## 🐧 Linux & Desktop

- [Linux Terminal on a Chromebook](./chromebook-terminal)
- [iPhone Photo Backup to Linux](./iphone-to-linux-mount) — without iTunes
- [Brother MFC-J4330DW Printer Setup](./Linux-Printer-Driver) — driver installation

## 🪟 Windows & macOS

- [Bulk-Deleting Outlook Rules from a Mac with PowerShell](/docs/bulk-delete-outlook-rules-powershell-macos/)

## 📐 Fundamentals

- [Algorithms for Systems Design](./algos-system-design) — scalable architecture patterns and data structures
- [Computer Science Fundamentals](./bits-bytes-hex) — bits, bytes, hex, and memory

---

Linux desktop and homelab material continues in the [Home Lab hub](/docs/engineer/LAB/).

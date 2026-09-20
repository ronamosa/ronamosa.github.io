---
title: "Offensive Security: CTF Walkthroughs, Buffer Overflows & Vuln Research"
description: "CTF walkthroughs, buffer overflow exploitation, and original vulnerability research — TryHackMe, HackTheBox, and a published CVE, documented end to end."
keywords: ["ctf walkthrough", "buffer overflow", "tryhackme", "hackthebox", "penetration testing", "exploitation", "cve", "red team"]
tags: ["security", "ctf", "exploitation", "penetration-testing", "red-team"]
sidebar_position: 0
slug: /hacker
---

# Hacker

Offensive security work: box walkthroughs written while solving them, exploitation technique from first principles, and original vulnerability research. Failed attempts stay in — they're usually the part worth reading.

## 🔬 Vulnerability Research

- **[CVE-2026-18953 — AWS Transform MCP Arbitrary File Write](/docs/hacker/cve-2026-18953-aws-transform-mcp-arbitrary-file-write/)** — discovery through disclosure on an MCP server

## 💥 Buffer Overflow Exploitation

Stack smashing from the ground up, on both platforms.

- [Linux x86-64 Buffer Overflow](/docs/hacker/bufferoverflow/x86/) — complete GDB and pwntools walkthrough
- [Windows x86-64 Buffer Overflow](/docs/hacker/bufferoverflow/windows/) — Windows exploitation technique
- [Resources, Tips & Techniques](/docs/hacker/bufferoverflow/resources/) — learning material and reference

## 🚩 CTF Walkthroughs

### TryHackMe

- [Active Directory Basics](/docs/hacker/tryhackme/adbasics/) — AD fundamentals and study notes
- [Attacktive Directory](/docs/hacker/tryhackme/attacktive/) — Active Directory exploitation
- [Brainpan 1](/docs/hacker/tryhackme/brainpan1/) — buffer overflow challenge
- [Brainstorm](/docs/hacker/tryhackme/brainstorm/) — Windows buffer overflow
- [Gatekeeper](/docs/hacker/tryhackme/gatekeeper/) — Windows overflow and exploitation
- [Corp](/docs/hacker/tryhackme/corp/) — corporate network penetration testing
- [Cyborg](/docs/hacker/tryhackme/cyborg/) — full CTF solution
- [Holo Live Network](/docs/hacker/tryhackme/hololive/) — live network engagement
- [Mr Robot](/docs/hacker/tryhackme/mr_robot/) — all three keys
- [Random Notes](/docs/hacker/tryhackme/random/) — miscellaneous tips and technique

### HackTheBox

- [Lame](/docs/hacker/hackthebox/lame/) — classic Linux exploitation and SMB
- [Legacy](/docs/hacker/hackthebox/legacy/) — Windows SMB and MS08-067
- [Shocker](/docs/hacker/hackthebox/shocker/) — Shellshock exploitation
- [Traverxec](/docs/hacker/hackthebox/traverxec/) — Linux privilege escalation

## 🧰 Tradecraft & Reference

- [Red Team Field Manual (RTFM)](/docs/hacker/rtfm/) — essential commands and technique
- [16 Search Engines for Pentesting & Recon](/docs/hacker/search/) — OSINT and reconnaissance tooling
- [Cryptography and Decoding for CTF](/docs/hacker/HowToDecodeStuff/) — cipher identification and decoding
- [ACME Evil Corp Investigation](/docs/hacker/acme/) — digital forensics and threat analysis
- [Tech for Good Cryptography Challenge](/docs/hacker/techforgood/) — secret message decryption CTF

## Where to start

- **New to exploitation?** [Linux x86-64 Buffer Overflow](/docs/hacker/bufferoverflow/x86/) builds the mental model the CTF boxes assume.
- **Want the research?** [CVE-2026-18953](/docs/hacker/cve-2026-18953-aws-transform-mcp-arbitrary-file-write/) is original work, disclosed and fixed.
- **Practising boxes?** Start with [Lame](/docs/hacker/hackthebox/lame/), then [Mr Robot](/docs/hacker/tryhackme/mr_robot/).

Also in this section: [Complaint: RNZ 'New Gaza' Article](/docs/hacker/RNZ-online-complaint/) — a formal media complaint, filed and documented.

Adjacent sections: **[Study](/docs/study/)** for CKS and AWS Security Specialty notes, **[Engineer](/docs/engineer/)** for the infrastructure side.

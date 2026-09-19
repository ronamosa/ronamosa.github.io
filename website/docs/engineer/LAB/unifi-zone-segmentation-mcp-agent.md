---
title: "Segmenting a Home Network with UniFi Zone Firewall — Driven by an AI Agent"
description: "Taking a flat home network from a 70/100 firewall audit to 93/100 with a default-deny UniFi zone matrix — built by an AI agent over an MCP, including the live outage it caused and the lessons that fixed it."
tags: ["lab", "networking", "unifi", "mcp", "security"]
---

# Segmenting a Home Network with UniFi Zone Firewall — Driven by an AI Agent

:::info 🤖 AI Collaboration
This post was co-written with AI assistance. All technical testing, troubleshooting,
and real-world insights are from the author's direct experience. AI helped with
structure, clarity, and documentation formatting.
:::

## Overview

My home network had eight VLANs and **zero firewall policies between them**. Every VLAN could reach every other VLAN — IoT to workstations, guest to cameras, anything to the management plane. A read-only firewall audit scored it **70/100**, with the segmentation category sitting at a flat **0/25**.

This is the write-up of taking it to **93/100** — a full default-deny zone model — and doing it a specific way: not by clicking through the UniFi UI, but by driving the controller's API through an **AI agent over an MCP server**. The agent proposed the rules, previewed them, and wrote them on confirmation.

The interesting part isn't the final ruleset. It's the failure modes that surfaced when an agent operates live network infrastructure — including a change that **briefly broke DNS on a live VLAN** before it got rolled back. Those are the lessons worth carrying forward, and they're most of this post.

- **Gateway:** UniFi UDM Pro (zone-based firewall, V2 policies)
- **MCP:** [`unifi-network-mcp`](https://pypi.org/project/unifi-network-mcp/) — a community MCP server wrapping the UniFi Network API
- **Agent harness:** Claude Code, running Opus 4.8 (1M context)
- **Outcome:** 70 → 83 → 93 across three audit runs; segmentation 0/25 → 25/25

> ⚠️ Zone names and subnets below are illustrative (role-based, generic `10.0.x.0/24` ranges). The structure is real; the specifics are sanitized.

---

## The setup — what "agent-driven" means here

The `unifi-network-mcp` server exposes the UniFi Network API as MCP tools — list/create/update firewall policies, zones, networks, devices, clients, and so on. It's **secure-by-default**: reads are always available, mutations are permission-gated, and every write is **preview-then-confirm** (the first call returns a preview; you re-call with `confirm=true` to execute).

The agent (Claude Code) drove those tools: gathering live state, reasoning about the zone model, generating policy objects, previewing them, and writing on my go-ahead. I stayed in the loop for every mutation — but the *design and execution* were the agent's, against the real controller.

Two capability limits shaped everything (more on how they bit later):

- The MCP **can't create or assign firewall zones** — that's UI-only.
- Rule **ordering** requires a UniFi API key (for the reorder endpoint); without it, every created policy lands at the same index.

---

## The starting point — a flat network

The audit (a read-only skill that walks 16 benchmarks and scores them deterministically) was blunt:

| Category | Score | Finding |
|---|---|---|
| Segmentation | **0 / 25** | Zero firewall policies exist |
| Egress Control | 20 / 25 | No forced DNS, no threat-intel blocks |
| Rule Hygiene | 25 / 25 | Perfect — because there were no rules to be messy |
| Topology | 25 / 25 | All devices online, firmware current |

The headline: **inter-VLAN default was *allow***. Eight VLANs, no policies, everything open. The management plane (gateway, switch, APs) was reachable from every VLAN. Cameras could reach workstations. Guest could reach everything.

A clean slate, in the worst way.

---

## The design — trust tiers and a default-deny matrix

The target was one zone per trust tier, with a **default-deny posture** between zones and an explicit allow-list for the few lanes that should be open.

| Zone | Role | Example subnet |
|---|---|---|
| `MGMT` | UDM / switch / APs | `10.0.0.0/24` |
| `ADMIN` | Trusted workstation + lab hosts | `10.0.10.0/24` |
| `FAMILY` | Household personal devices | `10.0.20.0/24` |
| `IOT` | Printer, projector, smart-home junk drawer | `10.0.30.0/24` |
| `CAMERAS` | PoE cameras + NVR | `10.0.40.0/24` |
| `GUEST` | Visitors | `10.0.50.0/24` |
| `WORK` | Employer-managed devices (kept isolated) | `10.0.60.0/24` |
| `DMZ` | Reserved for inbound-exposed services | `10.0.70.0/24` |

**Allowed lanes — everything else REJECT:**

- `ADMIN → MGMT, FAMILY, IOT, DMZ` (admin anchor reaches down)
- `FAMILY → IOT` (printing, casting)
- All zones → their own gateway + internet (DNS / DHCP / WAN)
- `CAMERAS ↔ gateway` only (NVR recording path); no camera internet

Everything not on that list is denied. `WORK` and `GUEST` become hard islands (internet only). `CAMERAS` talks to nothing but the NVR. `IOT` reaches the internet but nothing internal — and the printer "just works" because *trusted → IOT* is allowed while *IOT → trusted* is rejected.

A clean idea. The mess was in the execution.

---

## What I found

This is the part worth your time.

### 1. A preview is not a dry run — and dependent rules will burn you

UniFi's zone firewall has no single "reach nothing internal" primitive, so the obvious pattern for "lock this VLAN to its own gateway only" is a pair:

1. `ALLOW` source → its own gateway IP
2. `REJECT` source → all gateways

…with the ALLOW ordered **above** the REJECT.

The agent built both, previewed both (each validated green), and wrote them as a batch. Two things went wrong at once:

- The created policies **ignored the index field** — both landed at the same index, so the intended ordering never existed.
- The **ALLOW policy failed** outright (`FirewallPolicyCreateRespondTrafficPolicyNotAllowed` — this controller rejects ALLOW policies that need auto-created respond traffic via the API).

The REJECT committed. The ALLOW didn't. For the few seconds before rollback, the work VLAN was denied its **own gateway** — no DNS, no DHCP renewal.

> ⚠️ **The lesson:** a per-rule preview validates each rule *in isolation*. It says nothing about ordering, or about what happens if one rule in a dependent set fails. A green preview is not a green *combined apply*.

The fix was to **eliminate the dependency entirely**. Instead of "allow the one, deny the rest," enumerate the exceptions in a *single self-contained REJECT*:

```jsonc
// Reject the work VLAN to every OTHER gateway, leaving its own untouched.
// One rule. No ordering. No companion ALLOW to fail.
{
  "name": "WORK → foreign gateways (REJECT)",
  "action": "REJECT",
  "source": { "zone_id": "<work>", "matching_target": "ANY" },
  "destination": {
    "zone_id": "<gateway>",
    "matching_target": "IP",
    "matching_target_type": "SPECIFIC",
    "ips": ["10.0.0.1", "10.0.10.1", "10.0.20.1", "10.0.30.1",
            "10.0.40.1", "10.0.50.1", "10.0.70.1"]  // every gateway EXCEPT own
  }
}
```

The own-gateway is simply never in the list, so it stays default-allowed. No second rule, nothing to order, nothing to half-fail. Every subsequent lockdown used this shape.

### 2. Pulling a network into its own zone reopens paths you'd already closed

The first islands (`WORK`, `GUEST`, `CAMERAS`) were built with rules like `source → Internal (REJECT)`, back when most VLANs shared one big "Internal" zone. Then, to do the management-plane lock and IoT isolation properly, several networks were moved *out* of Internal into their own zones.

The moment they moved, the `→ Internal` rejects **stopped covering them** — "Internal" no longer contained those networks. Paths I thought were closed (work → admin hosts, for instance) were silently open again.

> ⚠️ With granular per-tier zones and an inter-zone default of *allow*, isolation is no longer a handful of rules — it's an **N×N matrix**. Eight zones is 56 ordered pairs.

This is the trap of incremental segmentation: every time you carve a network out of a shared zone, you invalidate the rules that referenced the shared zone. The clean answer is to stop thinking in one-off rules and build the **whole matrix** at once: enumerate every disallowed pair as a single REJECT, leave the allow-lanes as default-allow (or explicit ALLOWs added in the UI). That's ~40 rules for eight zones — verbose, but every one is independent and safe.

### 3. Know what your tooling *can't* do before you design around it

Three hard limits, discovered mid-build:

| Limit | Consequence |
|---|---|
| MCP can't create/assign zones | Zone setup is a manual UI step (it's quick — create zone, drop network in) |
| MCP can't set zone-matrix defaults | Default-deny posture must be enumerated as explicit REJECT policies |
| Created policies ignore `index` | No rule ordering without the API-key reorder endpoint |

The takeaway isn't "the tool is bad" — it's that an agent will confidently design a solution that assumes capabilities the API doesn't have. Surface the constraints *first*. The dependent-rule break above was, at root, designing around an ordering feature that didn't exist.

### 4. The gateway-vs-host testing trap

After the first island, I tested it by pinging the gateway of another VLAN from the isolated VLAN — and it answered. Looked like the rule had failed.

It hadn't. A VLAN's gateway IP (`.1`) is the router's own interface, which lives in the **Gateway zone**, not the destination VLAN's zone. The isolation rule blocks the *zone*; pinging the *gateway leg* hits a different zone that's intentionally left open for DNS/DHCP.

> Test inter-VLAN isolation against an actual **host** in the target VLAN, not its `.1`. The gateway answering is by design.

(REJECT rules also return an ICMP "destination port unreachable" — a fast, visible failure — versus a silent drop. Handy for confirming a rule is actually firing.)

### 5. Verify live state; don't trust the success message

A "mystery" Ubiquiti device kept appearing on a trusted VLAN. The agent's first instinct (and mine) was "a camera on the wrong VLAN." Pulling the switch port table showed it was an **unmanaged aggregation switch** — benign, and exactly where it should be. Cameras were all correctly placed.

More generally: after every batch of writes, the agent re-listed the live policies and counted them against the expected total, and verified zone assignments by reading each network's `firewall_zone_id` back (the zone-list endpoint doesn't echo membership). A "created successfully" response is a claim. The live state is the truth.

---

## Replicating it

If you want to do this on your own UniFi setup — with or without an agent — here's the sequence that worked.

### Prerequisites

- A UniFi gateway on the **zone-based (V2) firewall**.
- (For the agent path) the [`unifi-network-mcp`](https://pypi.org/project/unifi-network-mcp/) server, a local admin account, and — importantly — a **UniFi API key** if you want rule ordering / the reorder endpoint.
- A read-only audit baseline so you can measure before/after.

### Steps

1. **Audit first.** Get a baseline score and a findings list. You can't tell if you improved without it.
2. **Design trust tiers, not VLANs.** Group by trust level. Decide the allow-lanes; everything else denies.
3. **Create the zones in the UI** (one per tier) and assign each network. This is the part the API can't do.
4. **Build isolated zones as single-REJECT rules.** For each "X reaches nothing except its own gateway + internet," write one zone→zone REJECT per disallowed destination, plus one foreign-gateways REJECT. No ALLOW/REJECT pairs, no ordering dependencies.
5. **Sequence by blast radius.** Do the *independent, low-risk* islands first (a work/guest VLAN that should talk to nothing). Do the **management-plane lock last**, and make sure your own admin path is in the allowed set before you commit it — a mistake there locks you out of the controller.
6. **Leave allow-lanes default-allow, or make them explicit in the UI.** The API's ALLOW-policy quirk means explicit allow rules are easier to add by hand. Making them explicit also satisfies the "no implicit inter-VLAN allow" benchmark.
7. **Test against hosts, re-audit, repeat.** Ping real hosts (not gateways). Confirm the things that *should* work still do — printing, camera recording, internet on every VLAN, and your own management access.

> ⚠️ **Management-plane lock is the dangerous one.** Build it so only your admin source reaches the MGMT zone, leave that allow as default (don't write a rule that could fail half-applied), commit it last, and test controller reachability immediately after.

---

## Results

Three audit runs tracked the work:

| Run | Score | Status | What changed |
|---|---|---|---|
| Baseline | 70 | Needs Attention | Flat network, zero policies |
| After matrix | 83 | Healthy | Full default-deny zone matrix built |
| After explicit allows | **93** | **Healthy** | Allow-lanes made explicit in the UI |

Final category breakdown:

| Category | Score |
|---|---|
| Segmentation | **25 / 25** |
| Rule Hygiene | **25 / 25** |
| Topology | **25 / 25** |
| Egress Control | 18 / 25 |

The remaining 7 points are all egress, and all deliberate: open internet for IoT and guest (full outbound allow-listing is overkill for a home network), DNS not yet forced to an internal resolver (pending a Pi-hole build), and no threat-intel block list (optional). Three of four categories maxed is a strong place to stop — the last points trade real usability for marginal hardening.

---

## Open questions / next steps

- **Forced DNS** once an internal resolver (Pi-hole) is live — repoint VLANs at it and add a DNS-redirect rule. That clears the largest remaining egress finding.
- **A dedicated lab VLAN + zone** for isolated, no-egress workloads when the homelab build reaches that stage — same single-REJECT pattern.
- **The bigger reflection:** an agent operating live infrastructure is genuinely useful — it gathered state, reasoned about a 56-pair matrix, and wrote 60+ policies faster than I'd have clicked them. But it's only safe with the guardrails the failure modes above teach: preview-then-confirm on every mutation, single self-contained rules over dependent pairs, verify live state after writes, and a human holding the go-ahead on anything that can strand the control plane. The win wasn't autonomy. It was a fast, inspectable collaborator on a task that's tedious and error-prone by hand — with me deciding what was safe to ship.

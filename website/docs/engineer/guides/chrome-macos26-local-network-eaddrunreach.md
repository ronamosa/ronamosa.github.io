---
title: "Chrome ERR_ADDRESS_UNREACHABLE to Same-Subnet Hosts on macOS 26 - Local Network Enforcement vs Code-Sign Clone Identity"
description: "Root cause analysis of Chrome stable failing to reach same-subnet hosts on macOS 26 Tahoe. Local Network privacy grants permission to a per-launch code-sign clone, not to Chrome itself."
keywords: ["chrome err_address_unreachable", "macos 26 local network", "local network privacy macos", "code sign clone", "macappcodesignclone", "chrome local network permission", "net_error -109", "errno 65", "networkextension plist"]
tags: ["chrome", "macos", "networking", "privacy", "troubleshooting"]
sidebar_position: 8
---

**Root cause analysis: macOS Local Network privacy enforcement vs Chrome's code-sign clone launch mechanism**

| | |
|---|---|
| **Status** | Root cause confirmed. Workaround in production (Chrome Beta). Upstream fix pending. |
| **Impact** | Google Chrome (stable) cannot open TCP connections to any host on the Mac's own subnet. All other traffic unaffected. |
| **Affected** | Mac mini (Apple Silicon), macOS 26.6.1 (Tahoe, arm64), Google Chrome stable 151.0.7922.138 |
| **Not affected** | Safari, curl/ping/dig/nc from Terminal, Chromium, Chrome Beta, Chrome on other machines on the same network |
| **Date** | August 2026 |

---

## TL;DR

Chrome stable on macOS 26 launches itself from a **per-launch randomised code-sign clone path** under `/private/var/folders/…/com.google.Chrome.code_sign_clone/code_sign_clone.XXXXXX/`. macOS 26's Local Network privacy enforcement keys the permission grant to the **executable path**. The result: every Chrome launch presents as a brand-new, never-granted application identity, and the kernel silently denies all same-subnet unicast connections with `errno 65 (EHOSTUNREACH)`, which Chrome surfaces as `ERR_ADDRESS_UNREACHABLE`.

The grant recorded against `/Applications/Google Chrome.app` — the one the System Settings toggle controls, and the one that shows as "enabled" — belongs to a path Chrome never actually runs from. The Settings UI is telling the truth about a grant that is never consulted.

Two properties of the Local Network mechanism made this brutal to diagnose:

1. **Only same-subnet (link-local L2) traffic is gated.** Routed traffic — other VLANs, the internet — passes ungated. So Chrome worked for *everything* except the Mac's own broadcast domain, which happened to contain exactly two hosts: the Proxmox nodes. This presented as "Chrome won't load one URL", which points nowhere near a privacy subsystem.
2. **The permission prompt is only triggered by multicast/broadcast (mDNS/Bonjour), not unicast TCP.** An app that only ever makes unicast connections to LAN IPs never gets asked — it just gets denied at `connect()`, silently, forever.

---

## Environment

| Component | Detail |
|---|---|
| Machine | Mac mini (personal, no MDM), Apple Silicon |
| OS | macOS 26.6.1 (Tahoe), arm64 |
| Browser | Google Chrome stable 151.0.7922.138, official build |
| Network | UniFi (UDM Pro), VLAN-segmented homelab. Mac and target hosts on the same VLAN, subnet `172.16.2.0/24` |
| Targets | `wintermute.darksyde.lan` → `172.16.2.131:8006` and `neuromancer` → `172.16.2.132:8006` (Proxmox VE web UI, self-signed TLS) |
| DNS | Pi-hole serving the internal `.lan` zone; resolution verified healthy end-to-end throughout |
| Also present | Proton VPN 6.5.1 with two network system extensions (relevant as a red herring, below) |

---

## Symptom

Navigating to `https://wintermute.darksyde.lan:8006` (or the raw IP `https://172.16.2.131:8006`) in Chrome fails instantly:

```
This site can't be reached
https://172.16.2.131:8006/ is unreachable.
ERR_ADDRESS_UNREACHABLE
```

Meanwhile, from the same machine at the same time:

```bash
curl -k https://172.16.2.131:8006     # works
ping -c 3 wintermute.darksyde.lan     # works
dig +short wintermute.darksyde.lan    # resolves correctly (172.16.2.131)
nc -zv wintermute.darksyde.lan 8006   # port open
```

Safari loaded the Proxmox UI without complaint. Chrome on a different laptop on the same VLAN loaded it without complaint. The failure was scoped to **one application on one machine**, while every conventional network-layer check reported a healthy path.

---

## Investigation timeline

The investigation proceeded in the order any reasonable person would attack it — network out, application in — which is precisely the order the bug was designed by circumstance to defeat. Each phase eliminated a layer and each elimination was individually correct; the misdirection came from tooling that either measured a different security identity than Chrome's, or reported state that enforcement never consulted.

### Phase 1 — DNS and Chrome's resolver

Initial suspicion was Chrome's DNS-over-HTTPS bypassing the Pi-hole for the internal `.lan` zone. Secure DNS was confirmed **off** from the outset; `nslookup`/`dig` resolved correctly at the system level. Later netlog capture proved Chrome's internal async resolver was also getting clean A records from the Pi-hole the entire time. DNS was never involved. *Eliminated.*

### Phase 2 — Network path

Confirmed same-VLAN placement of the Mac and both Proxmox nodes via the UniFi controller; confirmed no firewall rules in the path (intra-VLAN traffic never touches the UDM's rule engine); confirmed reachability with `ping`, `nc`, and `curl`; confirmed a second laptop's Chrome could load the UI. The network was demonstrably fine. *Eliminated — but see False Negatives: these checks were quietly measuring Terminal's security identity, not Chrome's.*

### Phase 3 — Chrome application state

Failure reproduced in incognito (rules out extensions and most profile state), across **every Chrome profile** (rules out per-profile corruption), with no proxy configured at the Chrome or system level (`networksetup -getwebproxy` et al. clean), no enterprise policies (`chrome://policy` clean, personal machine, no MDM), and `chrome://settings` reset made no difference. The scope narrowed to "Chrome as an application on this machine, globally". *Correct narrowing, cause still invisible.*

### Phase 4 — Red herring: Proton VPN's transparent proxy

`systemextensionsctl list` revealed two Proton VPN network system extensions, one in a genuinely broken state:

```
enabled  active  teamID      bundleID (version)                              name                                    [state]
*        *       J6S6Q257EK  ch.protonvpn.mac.WireGuard-Extension (6.5.1)    Proton VPN WireGuard                    [activated enabled]
         *       J6S6Q257EK  ch.protonvpn.mac.Transparent-Proxy (6.5.1)      Proton VPN Split Tunneling (experimental) [activated waiting for user]
```

A transparent proxy extension intercepts traffic **per-application**, which matched the failure signature exactly, and `activated waiting for user` meant it was wedged mid-registration on an approval that was never shown. Better still (worse still): the split-tunnelling and Allow-LAN features it belongs to were **not even available on the installed Proton plan** — the extension ships regardless of entitlement and had half-registered itself for a feature that could never be configured.

This was entirely worth clearing and entirely not the cause. Cleanup required several attempts:

- `systemextensionsctl deactivate` — **does not exist** (the subcommand is `uninstall`)
- `sudo systemextensionsctl uninstall …` — **refused while SIP is enabled** (correctly left enabled)
- `sudo systemextensionsctl gc` — initially reported no orphans (the owning app still existed); after fully quitting Proton it eventually reaped the Transparent-Proxy, and the WireGuard extension moved to `terminated waiting to uninstall on reboot` (with a cosmetic `sysextd.InternalError Code=5` on the way out)
- A reboot completed the removal

Chrome remained broken with a provably clean network extension stack. The wedged proxy was wreckage adjacent to the crime scene, not the perpetrator.

### Phase 5 — Local Network permission, first pass

macOS 26's per-app Local Network privacy permission fit every symptom: per-app, per-machine, kernel-level, and known to manifest as `EHOSTUNREACH`. Except:

- System Settings → Privacy & Security → Local Network showed Chrome **enabled**
- Toggling it off/on with full Chrome restarts changed nothing
- `sudo tccutil reset LocalNetwork` failed with `tccutil: Failed to reset LocalNetwork` — because **Local Network is not a TCC service**; the state lives in `/Library/Preferences/com.apple.networkextension.plist`, managed by the network extension daemon, which `tccutil` cannot touch
- Backing up and deleting that plist, followed by a reboot (required — the daemon holds the state in memory and rewrites it), forced all apps to re-earn grants. Chrome remained broken.

At this point the hypothesis looked dead. It was actually correct — the *mechanism* of the identity mismatch just hadn't been found yet.

### Phase 6 — Stop theorising, capture a netlog

`chrome://net-export` while reproducing the failure, analysed offline. The decisive event sequence, per socket:

```
SOCKET_ALIVE                PHASE_BEGIN
TCP_CONNECT                 PHASE_BEGIN   {address_list: ['172.16.2.131:8006']}
TCP_CONNECT_ATTEMPT         PHASE_BEGIN   {address: '172.16.2.131:8006'}
TCP_CONNECT_ATTEMPT         PHASE_END     {os_error: 65}          ← EHOSTUNREACH from the kernel
TCP_CONNECT                 PHASE_END     {net_error: -109}       ← ERR_ADDRESS_UNREACHABLE
SOCKET_ALIVE                PHASE_END
```

The log established four hard facts. The kernel itself was refusing the `connect()` syscall with `errno 65` — this was not Chrome-internal logic, not a blocklist, not a cert or CORS or Private Network Access feature. Chrome's DNS was healthy (clean A records from the Pi-hole in the same capture). Chrome's public-internet connectivity was healthy (working QUIC sessions to Google throughout). And the failure covered **both** same-subnet hosts — `172.16.2.131` and `172.16.2.132` — while nothing else failed: a blanket "this app may not touch this broadcast domain" denial.

Per-process `EHOSTUNREACH` scoped to the local subnet is the exact enforcement signature of a Local Network denial on modern macOS. The permission hypothesis was resurrected with kernel-level evidence — the question became why enforcement disagreed with the Settings UI.

### Phase 7 — The plist tells the truth

Reading the rebuilt permission store answered it:

```bash
sudo defaults read /Library/Preferences/com.apple.networkextension.plist | grep -B3 -A8 -i "com.google.Chrome"
```

The output contained not one Chrome identity but **dozens**:

```
"com.google.Chrome"
"/private/var/folders/rc/…/X/com.google.Chrome.code_sign_clone/code_sign_clone.Jucup9/Google Chrome.app.bundle/Contents/MacOS/Google Chrome"
"/private/var/folders/rc/…/X/com.google.Chrome.code_sign_clone/code_sign_clone.UO7l6u/Google Chrome.app.bundle/Contents/MacOS/Google Chrome"
"/private/var/folders/rc/…/X/com.google.Chrome.code_sign_clone/code_sign_clone.hxbgVk/Google Chrome.app.bundle/Contents/MacOS/Google Chrome"
… (one per historical launch, plus helper/renderer identities)
```

Chrome on macOS launches itself from a **code-sign clone**: a temporary copy of the app bundle at a randomised path, created per launch, so that signature validation stays stable if the auto-updater swaps the real bundle mid-session. The clone is meant to be invisible plumbing. macOS 26's Local Network enforcement, however, records and evaluates the permission against the **executable path** — so every launch presents a fresh, never-before-seen identity with no grant, is silently denied (no prompt: see the unicast gotcha below), and leaves another dead entry in the store when the clone path is torn down.

Every earlier intervention now explains itself. The Settings toggle edits the grant for `/Applications/Google Chrome.app` — an identity that never makes a network connection. Toggle-cycling, rebooting, and resetting the plist all manipulated state that enforcement never consulted, or wiped grants that were re-denied per-launch anyway. The Settings UI showing "enabled" was reporting honestly on the wrong identity.

### Phase 8 — Confirmation by controlled experiment

Three tests, each isolating one variable:

**Terminal launch with the clone disabled.** `killall "Google Chrome"`, then launching the binary directly with `--disable-features=MacAppCodeSignClone` — the Proxmox UI loaded immediately. (One confound acknowledged: a Terminal-spawned process inherits Terminal's own Local Network grant as the responsible process, so this proved the *category* of fault — per-app Local Network attribution — rather than the clone mechanism alone. Note that the earlier `open -a … --args` attempt was invalid: `open` won't apply arguments when it merely foregrounds a running instance, and routes through LaunchServices besides. Direct binary invocation with a confirmed clean `pgrep` is the only reliable way to run this test, verified after launch via the Command Line field in `chrome://version`.)

**Chromium from a stable path.** Homebrew Chromium (`org.chromium.Chromium`, ad-hoc signed, runs from `/Applications/Chromium.app` with no clone mechanism), launched as its own app identity: loaded the Proxmox UI, and the grant **persisted across relaunches**. Stable executable path → durable grant → working browser. (Getting it running had its own comedy: a previously half-failed cask install had registered the cask and its command wrapper while Gatekeeper binned the actual `.app` — `brew list --cask chromium` reporting `Missing App` — followed on reinstall by the standard unsigned-build dance: the "Chromium is damaged and can't be opened" dialog, a recursive `xattr -dr com.apple.quarantine`, and a first-launch `-1712` LaunchServices timeout during validation.)

**Chrome Beta.** Google-signed, installed via `brew install --cask google-chrome@beta`, launched normally from the Dock: loaded the Proxmox UI with a durable grant across relaunches, full mainstream Chrome experience (sync, extensions, Widevine, Keystone auto-update). Adopted as the daily driver.

Root cause confirmed: **macOS 26 Local Network enforcement keys permission identity to executable path; Chrome stable's per-launch code-sign clone paths mean the granted identity never runs and the running identity is never granted.**

---

## Why only *these* URLs — the scoping mechanism

The single most disorienting property of the failure was its apparent specificity: Chrome loaded cross-VLAN homelab services and the entire internet, and refused exactly one URL (then two). The explanation is in what the Local Network permission actually gates.

It does not gate "private IP ranges". It gates **link-local delivery** — traffic to hosts on the Mac's own subnet, where the Mac ARPs for the destination and delivers over L2 directly. Traffic to a private IP on a *different* subnet leaves via the default gateway; from the enforcement layer's perspective that is routed traffic, indistinguishable from internet-bound, and passes ungated.

On this network, the Mac's own broadcast domain contained precisely two hosts anyone browses to: the Proxmox pair. Every other internal service lives on other VLANs and is reached through the UDM — routed, therefore ungated, therefore fine in Chrome. The blast radius of a whole-subnet denial was, from the user's chair, "this one Proxmox URL doesn't work", which is about as misleading a presentation as a privacy subsystem could manage.

---

## False negatives and misleading signals

The reason this took an evening rather than ten minutes is that nearly every diagnostic gave an answer that was locally true and globally misleading.

| Signal | What it appeared to mean | What it actually meant |
|---|---|---|
| `curl`/`ping`/`dig`/`nc` all succeed | "The network path is fine, so it can't be a connectivity problem" | Terminal had its own valid Local Network grant (earned the first time a tool touched the LAN). Every CLI check was measuring **Terminal's** security identity, not Chrome's. The checks validated the path while silently masking a per-app denial. |
| Safari works | "The OS network stack is fine" | Safari holds its own grant as a system app. True, but irrelevant to Chrome's identity. |
| System Settings shows Chrome's Local Network toggle **enabled** | "The permission can't be the problem" | The toggle governs the `/Applications/Google Chrome.app` identity. Chrome runs as a different identity every launch. The UI was honest about a grant that enforcement never consulted. |
| Toggle off/on cycling + restarts change nothing | "Definitely not the permission" | Cycling rewrites the grant for the never-running identity. |
| `tccutil reset LocalNetwork` fails | "The reset tooling is broken" / dead end | Local Network is not a TCC service; state lives in `networkextension.plist` under the NE daemon. The error was correct and the mental model was wrong. |
| Deleting `networkextension.plist` + reboot doesn't fix it | "The Local Network hypothesis is falsified" | The reset worked exactly as designed — and the next Chrome launch minted yet another ungranted clone identity. The hypothesis was right; the intervention couldn't touch the mechanism. |
| No permission prompt ever appears for Chrome | "macOS doesn't consider this a Local Network situation" | The prompt fires on multicast/broadcast (mDNS/Bonjour) only. Unicast TCP to a LAN IP from an ungranted app is **silently denied** with `EHOSTUNREACH` — no prompt, no log line in the UI, no user-visible signal at all. |
| `systemextensionsctl gc`: "no orphaned system extensions" | "Extension state is clean" | `gc` only reaps extensions whose owning app is gone; Proton was still installed. The wedged extension persisted through a clean-sounding report. |
| Proton Transparent-Proxy in `activated waiting for user` | "Found it — per-app transparent proxy, matches perfectly" | Genuinely broken, genuinely worth removing, genuinely per-app in mechanism — and completely unrelated. The strongest red herring of the investigation. |
| `open -a "Google Chrome" --args --disable-features=…` "doesn't work" | "The clone-disable flag doesn't fix it" | `open -a` had foregrounded the already-running instance; the flag was never applied. Invalid test, near-fatal to the correct hypothesis. |
| Gatekeeper: "Chromium is damaged and can't be opened" | "The download is corrupt" | Apple's standard phrasing for *unsigned + quarantined*. Nothing was damaged. |
| `brew list --cask chromium` → `Missing App` | "Brew is confused" | Forensic evidence of the original install being killed by that same Gatekeeper dialog months earlier, leaving cask metadata without an app. |
| Dozens of "Google Chrome" rows in the Local Network list | "Some kind of corruption / duplicate app problem" | The bug's fingerprint made visible: one dead clone-path identity per historical launch, none grantable, none reusable. |

The general lesson sits underneath all of these: on modern macOS, **network reachability is a property of (process identity, destination), not of (machine, destination)**. Any diagnostic that changes the process identity — running the check from Terminal, from a different browser, from a different launch path — is measuring a different question than the one being asked. The netlog was the first tool in the sequence that measured the failing identity itself, and it produced the answer in one capture.

---

## Resolution

**Adopted: Chrome Beta as the daily driver.** Google-signed, Keystone-updated, full profile sync — mainstream Chrome in every respect, running one release channel ahead. It launches with a stable identity, holds a durable Local Network grant across relaunches, and reaches the DARKSYDE subnet normally. When the clone-attribution fix lands in a stable release, the walk back to stable is trivial.

**Fallbacks that also work,** in decreasing order of convenience: launching stable Chrome via a shell alias or a small wrapper app with `--disable-features=MacAppCodeSignClone`, which pins Chrome to its real `/Applications` path so enforcement finally matches the granted identity (a wrapper at a fixed path needs one grant of its own, earned once and reused — unlike the clone paths, which are one grant per corpse); or Homebrew Chromium, fine for homelab access but missing sync, Widevine, and auto-update.

**Not viable:** reinstalling Chrome stable (same version, same clone mechanism, same bug on first launch); deleting individual Local Network entries (no supported per-entry removal exists — UI, `tccutil`, or otherwise); disabling SIP to force extension/permission surgery (never worth it, and unrelated to the actual fix).

**Optional hygiene:** one further `networkextension.plist` backup-delete-reboot *after* retiring stable Chrome clears the accumulated clone-path corpses from the Local Network list permanently — with stable gone, nothing mints new ones. Expect one-time re-prompts from every legitimately LAN-touching app afterwards. Cosmetic only; entirely skippable.

**Upstream:** this is a genuine macOS 26 × Chrome interaction bug — either macOS should attribute clone-path executables to their originating bundle, or Chrome should register the clone in a way the privacy layer can follow. Worth filing at crbug.com; this document plus the netlog (`os_error: 65` on `TCP_CONNECT_ATTEMPT`) plus the plist clone-path listing constitutes a complete reproduction and diagnosis. Check `chrome://settings/help` on stable periodically — the day the fix ships, the wrapper/Beta workarounds become unnecessary.

---

## Reproduction and verification (condensed runbook)

```bash
# 1. Reproduce and capture kernel-level evidence
#    chrome://net-export → start logging → load https://<same-subnet-host> → stop
#    Look for: TCP_CONNECT_ATTEMPT PHASE_END {os_error: 65} → net_error -109

# 2. Confirm the identity pile-up in the permission store
sudo defaults read /Library/Preferences/com.apple.networkextension.plist \
  | grep -c "code_sign_clone"          # > 0 confirms per-launch clone identities

# 3. Isolate the mechanism (run Chrome from its real path, clone disabled)
killall "Google Chrome"; sleep 2; pgrep -fl "Google Chrome"   # must be empty
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --disable-features=MacAppCodeSignClone &
# verify flag took: chrome://version → Command Line
# NB: Terminal-spawned = inherits Terminal's grant; treat as category proof only

# 4. Clean-identity control test (durable-grant proof)
brew install --cask google-chrome@beta
open -a "Google Chrome Beta"           # normal launch, own identity
# load target → quit fully → relaunch → load target again
# success on the SECOND launch is the verdict: stable path ⇒ durable grant
```

---

## Timeline of eliminations (summary)

| Layer | Verdict | Decisive evidence |
|---|---|---|
| DNS (system + Chrome resolver) | Clean | `dig` + netlog A-record extraction from Pi-hole |
| L2/L3 path, VLANs, firewall | Clean | Same-VLAN via UniFi; `ping`/`nc`/`curl`; second machine fine |
| Chrome profile/extensions/proxy/policy | Clean | Incognito + all-profiles repro; no proxy; no policies |
| Proton VPN transparent proxy | Broken but unrelated | Removed completely; failure persisted on a clean NE stack |
| Local Network permission (as presented by Settings) | Misleadingly "granted" | Toggle governs an identity that never runs |
| **Local Network enforcement vs clone-path identity** | **Root cause** | Netlog `errno 65`; clone-path entries in `networkextension.plist`; stable-path builds (Chromium, Beta) hold durable grants; stable Chrome does not |

---

*DARKSYDE homelab operational doc — The Uncommon Engineer.*

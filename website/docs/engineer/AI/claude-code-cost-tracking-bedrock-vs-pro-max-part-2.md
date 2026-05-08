---
title: "Claude Code Cost Tracking: AWS Bedrock vs Pro Max (Part 2) — Tag Propagation, Sydney Migration, Bug Fixes"
description: "Part 2 of the Claude Code cost tracking series. AIP tag propagation answered (it works — but I'd been measuring the wrong thing), a script bug exposed, and a us-east-1 → ap-southeast-2 migration for Auckland latency."
keywords: ["claude code cost", "aws bedrock cost allocation tags", "application inference profile", "bedrock marketplace billing", "claude bedrock sydney", "ap-southeast-2 claude", "au sovereign inference profile", "cost explorer bedrock", "claude code latency", "aws bedrock tagging"]
tags: ["ai", "aws", "claude", "bedrock", "cost-tracking", "inference-profiles", "postmortem"]
---

:::info 🤖 AI Collaboration
This post was co-written with AI assistance. All technical testing, troubleshooting,
and real-world insights are from the author's direct experience. AI helped with
structure, clarity, and documentation formatting.
:::

## Overview

[Part 1](./claude-code-cost-tracking-bedrock-vs-pro-max.md) ended with an unresolved question. I'd built the cost-tracking system, set up an Application Inference Profile (AIP) tagged `Project=claude-code`, fired one bait invocation through it, and parked the post with a 3-outcome table for what I'd find 48 hours later.

Today is two weeks later. I sat down to ask the script for an honest 30-day Bedrock number and got this:

```
Bedrock (AWS Cost Explorer, Claude only):
  claude-haiku-4-5:  $0.00
    Input               $0.00
    Output              $0.00
  BEDROCK CLAUDE TOTAL                $0.00
```

Zero. Or rather, $0.000044 — a number so small it rounded to nothing in the report. Meanwhile `--no-tag` showed **$62.36 of real Bedrock Claude spend** sitting completely untagged.

This post is the postmortem on that. Three findings, all fixed:

1. **AIP tag propagation works** — but I'd been measuring traffic that never went through the AIP. The system-defined cross-region profiles I was actually calling don't carry user tags by design.
2. **`claude-cost` had a silent-failure bug.** Its "fallback warning if tagged spend is 0" check used `total == 0`, which doesn't trigger on `$0.000044`.
3. **Bonus migration:** while fixing the routing, switched from us-east-1 to ap-southeast-2 (Sydney) using AU sovereign cross-region profiles. Auckland to Sydney is ~25ms; Auckland to N. Virginia is ~200ms.

The Pro-vs-Bedrock head-to-head is still deferred — the new AIPs need to accumulate volume comparable to Pro before that comparison is honest. That's a future Part 3. This one is about getting the measurement infrastructure right so Part 3 has clean data to work from.

---

## The symptom

`claude-cost --days 30` (the default tagged-by-`Project=claude-code` query):

```
Cost comparison — 2026-04-07 → 2026-05-07 (30 days)

Bedrock (AWS Cost Explorer, Claude only):
  claude-haiku-4-5:  $0.00
    Input               $0.00
    Output              $0.00
  BEDROCK CLAUDE TOTAL                $0.00
```

`claude-cost --days 30 --no-tag` (same window, tag filter removed):

```
Bedrock (AWS Cost Explorer, Claude only):
  claude-opus-4-7:  $57.69
    Input               $0.42
    Cache write        $24.17
    Cache read         $25.88
    Output              $7.23
  claude-sonnet-4-6:  $3.25
  claude-haiku-4-5:  $1.42
  BEDROCK CLAUDE TOTAL               $62.36
```

Two weeks of real Claude usage on Bedrock — $62.36 of it — and the tag I'd specifically set up to attribute that spend was catching essentially none of it. Worse: the script was supposed to print a warning when tagged=0 and untagged>0, exactly the situation I was in. No warning fired.

So: two bugs. The measurement bug, and the silent-failure bug hiding it.

---

## Investigation

### Layer 1: was the tag activated?

First check. `Project=claude-code` had been set up two weeks earlier; cost-allocation tags take 24–48h to propagate after activation. By now it should be live.

Querying Cost Explorer directly with the tag filter, no script in the way:

```bash
aws ce get-cost-and-usage \
  --profile iamuncommon \
  --time-period Start=2026-04-07,End=2026-05-07 \
  --granularity MONTHLY \
  --metrics UnblendedCost UsageQuantity \
  --group-by Type=DIMENSION,Key=SERVICE \
  --filter '{"Tags":{"Key":"Project","Values":["claude-code"]}}'
```

Response:

```json
{
  "ResultsByTime": [
    {
      "TimePeriod": {"Start": "2026-04-07", "End": "2026-05-01"},
      "Total": {"UnblendedCost": {"Amount": "0", "Unit": "USD"}},
      "Groups": [],
      "Estimated": false
    },
    {
      "TimePeriod": {"Start": "2026-05-01", "End": "2026-05-07"},
      "Groups": [{
        "Keys": ["Claude Haiku 4.5 (Amazon Bedrock Edition)"],
        "Metrics": {
          "UnblendedCost": {"Amount": "0.000044", "Unit": "USD"}
        }
      }],
      "Estimated": true
    }
  ]
}
```

Two things from this:

- **The tag is alive.** May 1 onwards has a tagged record. The propagation pipeline works.
- **It's catching essentially nothing.** $0.000044 of Haiku in May, zero in April. If the AIP were actually carrying my Claude Code traffic, this should be tens of dollars by now.

So the tag works. The problem is upstream — almost no traffic is going through the tagged AIP.

### Layer 2: are the AIPs tagged correctly?

```bash
aws bedrock list-inference-profiles \
  --profile iamuncommon --region us-east-1 \
  --type-equals APPLICATION
```

Two AIPs found: `claude-code-opus-4-7-test` and `claude-code-haiku-4-5-test`, both created 2026-05-01. Tags on each:

```json
{
  "tags": [
    {"key": "Project",  "value": "claude-code"},
    {"key": "Test",     "value": "tag-propagation"},
    {"key": "Tool",     "value": "claude-bedrock"}
  ]
}
```

Both correctly tagged. Not the problem.

But notice the date — **2026-05-01**. The AIPs only existed for the May portion of the window. The Apr 7 → Apr 30 chunk had no AIPs to flow through, period. That accounts for ~80% of the window being structurally untaggable. Fine — but the May portion should still be showing tagged spend if AIPs were being called.

### Layer 3: is `claude-bedrock` actually using the AIPs?

This is where it cracked open. Reading my own script:

```bash
$ cat ~/bin/claude-bedrock
#!/bin/bash
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1
export AWS_PROFILE=iamuncommon
export ANTHROPIC_MODEL=us.anthropic.claude-sonnet-4-6
export ANTHROPIC_DEFAULT_SONNET_MODEL=us.anthropic.claude-sonnet-4-6
export ANTHROPIC_DEFAULT_OPUS_MODEL=us.anthropic.claude-opus-4-7
export ANTHROPIC_DEFAULT_HAIKU_MODEL=us.anthropic.claude-haiku-4-5-20251001-v1:0
exec claude "$@"
```

The model identifiers are `us.anthropic.claude-opus-4-7` etc. Those are **system-defined cross-region inference profiles** — AWS-managed routing layers, not user-created AIPs.

System-defined profiles don't carry user tags. They never have. Cost-allocation tags only attach to resources you create — Application Inference Profiles, by definition. By calling the `us.*` system profiles directly, every single one of my Claude Code requests was bypassing the AIPs I'd carefully set up. The AIPs were sitting there tagged and idle. The actual traffic was going through an unrelated AWS-managed routing layer that has no concept of my `Project` tag.

That single trickle of tagged Haiku ($0.000044) was the **bait invocation from Part 1** — the one shot I'd fired through the AIP for the propagation test. It propagated correctly. Then I'd never used the AIP again. Two weeks of real work bypassed it entirely.

### Layer 4: why didn't the script's fallback warning fire?

`claude-cost` is supposed to handle this exact scenario. If tagged spend is zero but untagged isn't, it should warn the user that propagation looks broken or the tag isn't active. The check:

```python
if use_tag and bedrock_summary["total"] == 0:
    # Try untagged fallback to see if there's *any* Claude Bedrock spend
    ce_fallback, _ = query_bedrock_cost(start, end, use_tag=False)
    ...
```

`total == 0`. Cost Explorer returned `total = 0.000044`. `0.000044 == 0` is `False`. The fallback check never ran, no warning ever printed. The user (me) saw a clean $0.00 report with no signal that anything was wrong.

Fix is one line:

```python
if use_tag and bedrock_summary["total"] < 0.01:
```

Treat anything under a penny as effectively zero.

---

## Root cause

Two layered issues, neither what Part 1's outcome table predicted:

**Routing miss.** `claude-bedrock` was calling system-defined cross-region inference profiles (`us.anthropic.claude-opus-4-7`), which AWS manages. These never carry user tags. The AIPs I'd built were correctly tagged but never actually invoked beyond the one-shot bait test in Part 1.

**Untestable assertion in the script.** The fallback warning that would have surfaced this immediately was guarded by `total == 0`, which silently fails against trickle amounts like $0.000044. The script reported $0.00 to the user with full confidence and no indication that 99% of real spend was untagged.

The Part 1 outcome table missed the obvious 4th outcome: **"the AIP isn't being invoked at all."** I'd assumed that creating the AIP automatically meant requests would route through it. They don't. You have to point your client at the AIP's ARN explicitly.

This is also why so many AWS cost-attribution writeups skip past the integration step — most documentation just says "use the AIP ARN as your model identifier" in a single sentence, which is technically accurate but easy to gloss over if you're already routing through cross-region profiles for a different reason (latency, regional capacity).

---

## Fix

### 1. Patch the script

Two-character change. `==` → `<` and add a threshold:

```python
# Before
if use_tag and bedrock_summary["total"] == 0:

# After
if use_tag and bedrock_summary["total"] < 0.01:
```

Now the fallback warning fires when tagged spend is effectively zero, even if a propagation trickle has snuck in.

### 2. Fix the routing — but also relocate to Sydney

Two options for the routing fix:

- Point `claude-bedrock` at the existing us-east-1 AIPs (`claude-code-opus-4-7-test` and `claude-code-haiku-4-5-test`).
- Create new AIPs in a closer region first, then point at those.

I went with option 2. Auckland to us-east-1 is ~200ms RTT. Auckland to ap-southeast-2 (Sydney) is ~25ms. For interactive Claude Code use — where every keystroke-to-response cycle hits the model — that's a meaningful latency win. The cost difference per token between regions is single-digit percent; for $60/mo of Bedrock spend the absolute dollar impact is tiny.

Sydney has full coverage of current Claude models with two cross-region profile flavours:

- **`au.*`** — keeps traffic in Australia (ap-southeast-2 + ap-southeast-4 only). Predictable Sydney latency.
- **`global.*`** — routes anywhere with capacity, including Sydney. Latency variable; can bounce back to US under capacity pressure.

For a latency-driven migration, `au.*` is the safer pick.

Three new AIPs in ap-southeast-2, each wrapping the matching `au.*` profile:

```bash
aws bedrock create-inference-profile \
  --profile iamuncommon --region ap-southeast-2 \
  --inference-profile-name claude-code-opus-4-7 \
  --description "Claude Code Opus 4.7 Sydney AU sovereign routing" \
  --model-source copyFrom=arn:aws:bedrock:ap-southeast-2:<your-account-id>:inference-profile/au.anthropic.claude-opus-4-7 \
  --tags 'key=Project,value=claude-code' 'key=Tool,value=claude-bedrock'
```

(Same pattern for Sonnet and Haiku.)

:::warning[Description regex is ASCII-only]
The first attempt failed with `ValidationException` because I used an em-dash in the description. The accepted regex is `([0-9a-zA-Z:.][ _-]?)+` — letters, digits, `:`, `.`, with single spaces, underscores, or hyphens between them. No em-dashes, no smart quotes, no unicode. Easy fix, easy to miss.
:::

Final AIP layout:

| Name | Region | Wraps |
|---|---|---|
| claude-code-opus-4-7 | ap-southeast-2 | au.anthropic.claude-opus-4-7 |
| claude-code-sonnet-4-6 | ap-southeast-2 | au.anthropic.claude-sonnet-4-6 |
| claude-code-haiku-4-5 | ap-southeast-2 | au.anthropic.claude-haiku-4-5-20251001-v1:0 |

All tagged `Project=claude-code` and `Tool=claude-bedrock`.

### 3. Patch `claude-bedrock`

Replace the system-profile model IDs with the new AIP ARNs, and switch the region:

```bash
#!/bin/bash
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=ap-southeast-2
export AWS_PROFILE=iamuncommon

# AIPs in ap-southeast-2 (Sydney), wrapping au.* sovereign cross-region profiles.
# Tagged Project=claude-code so spend shows up in tagged Cost Explorer queries.
ANTHROPIC_OPUS_AIP=arn:aws:bedrock:ap-southeast-2:<your-account-id>:application-inference-profile/<id>
ANTHROPIC_SONNET_AIP=arn:aws:bedrock:ap-southeast-2:<your-account-id>:application-inference-profile/<id>
ANTHROPIC_HAIKU_AIP=arn:aws:bedrock:ap-southeast-2:<your-account-id>:application-inference-profile/<id>

export ANTHROPIC_MODEL=$ANTHROPIC_SONNET_AIP
export ANTHROPIC_DEFAULT_SONNET_MODEL=$ANTHROPIC_SONNET_AIP
export ANTHROPIC_DEFAULT_OPUS_MODEL=$ANTHROPIC_OPUS_AIP
export ANTHROPIC_DEFAULT_HAIKU_MODEL=$ANTHROPIC_HAIKU_AIP

exec claude "$@"
```

The previous us-east-1 + `us.*` config goes to `~/bin/claude-bedrock.bak` in case I need to roll back.

---

## Verification

### Tag attribution

The propagation pipeline already worked — that was settled by the $0.000044 of correctly-tagged Haiku from Part 1's bait test. What hadn't been verified was **end-to-end attribution under real workload**: AIP-routed Claude Code traffic flowing into tagged Cost Explorer numbers at a volume that matters.

That's the test now in flight:

- New AIPs are tagged. ✓
- `claude-bedrock` points at the AIPs. ✓
- Tag is active in AWS Billing. ✓
- Real workload running through the new setup. ⏳ (started today)
- Tagged Cost Explorer numbers reflect that workload. ⏳ (24–48h)

In ~48 hours `claude-cost --days 7` (default tagged query) should show real numbers. If it does, the loop is closed and Part 3's Pro-vs-Bedrock comparison can run on tag-filtered data without touching `--no-tag`. If it doesn't, the diagnosis goes one layer further into how Marketplace billing surfaces user tags.

### Latency

Two layers measured from Auckland, both immediately after the migration. Pure network RTT first (TCP connect to the Bedrock Runtime endpoints in each region — ICMP is blocked at AWS edges, so TCP-443 connect time stands in for ping):

```python
import socket, time
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
t0 = time.time()
s.connect(("bedrock-runtime.<region>.amazonaws.com", 443))
print(f"{(time.time() - t0) * 1000:.1f}ms")
```

| Region | Trial 1 (cold) | Trials 2–5 (steady) | Steady avg |
|---|---|---|---|
| us-east-1 | 207ms | 204 / 206 / 193 / 195 | 200ms |
| ap-southeast-2 | 71ms | 36 / 33 / 31 / 34 | 33ms |

Network RTT savings: ~167ms per round trip.

End-to-end Bedrock invocation second — same Haiku model, 5-token capped response, five trials each:

```bash
aws bedrock-runtime invoke-model \
  --profile iamuncommon --region <region> \
  --model-id <model-or-aip> \
  --body fileb:///tmp/payload.json \
  --content-type application/json \
  /tmp/out.json
```

(Payload: `{"anthropic_version":"bedrock-2023-05-31","max_tokens":5,"messages":[{"role":"user","content":"say hi"}]}`.)

| Region / route | Trial 1 | Trial 2 | Trial 3 | Trial 4 | Trial 5 | Avg |
|---|---|---|---|---|---|---|
| us-east-1 (`us.anthropic.claude-haiku-4-5`) | 2776ms | 2020ms | 2136ms | 2444ms | 2023ms | **2279ms** |
| ap-southeast-2 (Haiku AIP) | 1375ms | 1474ms | 1714ms | 1246ms | 1502ms | **1462ms** |

End-to-end savings: ~817ms per request, or 36%.

The end-to-end gap is bigger than the single-RTT gap because each Bedrock invocation costs roughly three round trips (TLS handshake, SigV4 auth, request/response). 167ms × 3 ≈ 500ms of network savings per call; the rest comes from the same effect on internal AWS-side hops.

For Claude Code's interactive use pattern — where each tool call, each response stream chunk, and each follow-up message is its own request — that ~800ms compounds across a session.

---

## What this means for Part 1's outcome table

Part 1 listed three possible outcomes for the propagation test:

| Tagged shows Haiku spend? | Untagged shows Haiku spend? | Conclusion |
|---|---|---|
| Yes | Yes | Tags propagate to Marketplace ✓ |
| No | Yes | Tags don't reach Marketplace billing |
| No | No | Either propagation lag or tag not yet activated |

Two weeks later the actual answer is **outcome 1, masked by outcome 2**. The bait invocation propagated correctly (`$0.000044` tagged Haiku in May). The masking was the routing gap — real workload bypassing the AIPs entirely.

The implicit fourth outcome the table missed:

| Tagged shows Haiku spend? | Untagged shows Haiku spend? | Conclusion |
|---|---|---|
| Trickle only | Yes | The AIP is tagged correctly but isn't being invoked at scale — check that your client is actually routing through the AIP's ARN, not bypassing it via system-defined cross-region profiles |

Worth keeping in mind for any AIP attribution test: a clean "no tagged spend" can mean propagation is broken, *or* it can mean you never actually called the AIP. Part 1's bait invocation was small enough that I'd mentally lumped it in with "no tagged spend" and missed the signal.

---

## Lessons

**System-defined ≠ Application Inference Profile.** AWS has both. They look similar in the CLI output. Only AIPs carry user tags. If your `claude-bedrock` (or whatever your wrapper is) routes through `us.*`, `eu.*`, or `apac.*` model identifiers, you're hitting system profiles and your tags don't matter — they're attached to resources you're not invoking.

**Cost-allocation tags are forward-looking only.** Activating a tag in AWS Billing doesn't retroactively label past usage. Anything that landed before the AIPs existed (Apr 7 → Apr 30 in my window) stays untagged forever. `--no-tag` is the only path to that history. New windows, fully covered by AIPs, should report cleanly under the default tagged query.

**`== 0` is a code smell when the source is floating-point.** AWS Cost Explorer returns small-but-nonzero values for trickle activity. Any threshold-based logic in cost-attribution scripts should use `< epsilon` instead. Same goes for "is this metric idle" checks anywhere fractional dollars or fractional percentages are in play.

**Latency-aware region choice matters more than tagging cleanliness.** I'd built the original AIPs in us-east-1 because that's where the workshop examples live. For Auckland, that's a 200ms tax on every interactive request. Sydney was always the right region; I just hadn't connected "I'm based in NZ" with "the AIP region is a latency decision, not a default." Both regions support Claude on Bedrock. Default to the closest one with the model coverage you need.

**Latency wins compound across multi-round-trip protocols.** A single Bedrock invocation costs roughly three RTTs (TLS, SigV4 auth, request/response). Pure network RTT improvement of ~167ms (Auckland→Virginia 200ms vs Auckland→Sydney 33ms) translated to ~817ms saved per end-to-end Claude Code request — see numbers in the verification section. For interactive workloads, region choice is a bigger UX lever than it looks on paper.

---

## What's next — Part 3

The original Pro-vs-Bedrock head-to-head from Part 1 still needs comparable Bedrock volume before it's honest. Now that the routing actually flows through tagged AIPs in the right region, the data starts accumulating from today. Plan:

- **30 days of real Claude Code work through `claude-bedrock`** at the same shapes I use Pro for.
- **Compare against the same 30 days of Pro spend** using `claude-cost --days 30` with the default tagged query (assuming the propagation closes the loop in 48h as expected).
- **Pricing-per-region note.** I haven't yet sanity-checked ap-southeast-2 vs us-east-1 pricing for Claude. Single-digit-percent differences are within the noise floor of this comparison; double-digit would matter. Will fold in.
- **Audit cleanup.** The two original `-test` AIPs in us-east-1 are orphaned. Leaving them up for a settle-in week, then deleting.

Part 3 lands when the volume comparison is fair.

The Part 1 framing still holds: the discipline isn't the build, it's running both backends long enough to answer the question with data, not vibes. Two weeks in, that discipline broke down — I built the system, didn't actually route real traffic through the tagged path, and never noticed because the safety net (the fallback warning) had a silent bug. Both fixed now. The clock restarts today.

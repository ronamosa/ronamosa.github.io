---
title: "Claude Code Cost Tracking: AWS Bedrock vs Pro Max (Part 1)"
description: "Compare Claude Code costs on AWS Bedrock vs Pro Max. Covers the Marketplace billing trap, Cost Explorer queries for third-party models, and cache economics."
keywords: ["claude code cost", "claude code pricing", "aws bedrock pricing", "claude pro max", "bedrock vs pro max", "aws marketplace billing", "cost explorer claude", "prompt caching cost", "claude code aws", "token cost comparison"]
tags: ["ai", "aws", "claude", "bedrock", "cost-tracking", "prompt-caching"]
---

:::info 🤖 AI Collaboration
This post was co-written with AI assistance. All technical testing, troubleshooting,
and real-world insights are from the author's direct experience. AI helped with
structure, clarity, and documentation formatting.
:::

## Overview

A few days ago I posted about [standing up my own Claude through AWS Bedrock](https://www.linkedin.com/posts/ron-amosa_yesterday-i-said-i-know-what-i-need-to-do-share-7455390945119907842-IXns) so I could keep my personal data inside my own AWS perimeter. The trust problem from the day before — about whether to give Anthropic my personal email and calendar — was solved by engineering, not by changing my mind.

A reader asked the obvious follow-up:
> *what are the token economics like now? Bedrock pay-per-token versus your Claude Pro Max sub — which is actually cheaper for what you're doing?*

I didn't have a clean answer, I'd been more interested in getting it up & running, but I definitely needed to know.

So this morning I built the system that will let me answer it properly.

This post is **Part 1**: the system itself, what it measures, and a few surprises I hit putting it together. Subscription versus per-token is hard to eyeball, especially when prompt caching is in play — cache reads cost 10% of base input, but you can do millions of them in a long session, and any comparison that ignores caching is fiction.

:::caution[Data isn't apples-to-apples yet]
The comparison numbers it produces today are **skewed**: I've only been running through `claude-bedrock` for about a week, while my Pro Max sessions go back 90 days. The system is real. The verdict isn't, yet.
:::

**Part 2** lands when I have enough Bedrock usage at the same workload shape to make the comparison honest. Until then, this post shows how the measurement works, the things I learned about AWS billing's exposure of Claude on Bedrock, and what the early data already does and doesn't say.

---

## What I built

A small Python utility under `~/.claude/cost-tracking/`:

| File | Purpose |
|---|---|
| `rates.py` | Anthropic public per-token prices, with a date and source link for the comments |
| `parse_transcripts.py` | Walks `~/.claude/projects/*/*.jsonl` (Claude Code's session transcripts), sums tokens per assistant message, classifies backend from the model string |
| `claude-cost` | Entry-point CLI; combines transcript-parsed Pro data with AWS Cost Explorer queries for Bedrock data, prints a comparison table |

Symlinked into `~/bin/` so it's just `claude-cost --days 30` from anywhere.

A real run from my account, last 90 days. The Pro side covers 90 days of accumulated Claude Code work; the Bedrock side reflects only ~1 week of usage since I switched it on. **Read accordingly** — the dollar totals don't compare equivalent volumes. The Pro paid figure is set explicitly (`--pro-paid 112.51`) from my actual Anthropic invoices over the window — see the plan-history note below the output.

```
$ claude-cost --days 90 --no-tag --pro-paid 112.51

Cost comparison — last 90 days

Bedrock (AWS Cost Explorer, Claude only):
  claude-opus-4-7:   $57.69
    Input             $0.42
    Cache write      $24.17
    Cache read       $25.88
    Output            $7.23
  claude-sonnet-4-6:  $3.25
  claude-haiku-4-5:   $1.43
  BEDROCK CLAUDE TOTAL              $62.38

Pro (override):
  Sessions in window:                    43
  Input tokens:                       112.7k
  Output tokens:                       6.52M
  Cache read tokens:                 596.45M
  Cache write 5m tokens:               9.34M
  Cache write 1h tokens:              23.08M

  Hypothetical API total:           $746.37
  Subscription cost (paid):         $112.51
  Pro savings vs API list:          $633.86

Verdict:
  Pro: $112.51 paid → $746.37 of work at API list (6.6× sticker value).
  Bedrock: $62.38 paid (Marketplace billing).
```

**Plan history during the window** (pulled directly from Anthropic invoices):

| Period | Plan | Days | Cost |
|---|---|---|---|
| Feb 1 – Feb 8 | Pro (Jan 8 cycle carryover) | 7 | $4.67 |
| Feb 8 – Mar 8 | Pro | 28 | $20.00 |
| Mar 8 – Apr 8 | Pro | 31 | $20.00 |
| Apr 8 – Apr 20 | Pro (partial; refunded $12.45 on upgrade) | 12 | $7.55 |
| Apr 20 – May 2 | Max 5x | 12 | $40.00 |
| Auto-recharge top-ups (Feb 25 + Mar 6) | overage | — | $20.29 |
| **Total paid in window** | | | **$112.51** |

I was on regular Pro at $20/month for ~70 of the 90 days; I only upgraded to Max 5x on April 20 — about a week before I built this. The $112.51 figure is what actually hit my card across the window. The script's default still amortises a flat $100/mo Max 5x rate (`PRO_MONTHLY_USD = 100.00`), which would overstate Pro spend at $300 for any 90-day window where you weren't on Max 5x throughout.

:::tip[Use real invoice numbers]
If your plan changed during the measurement window, use `--pro-paid` with your actual Anthropic invoice total. It's the only way to get an honest "what did this actually cost me" comparison instead of relying on the script's default flat-rate amortisation.
:::

---

## How it works

### Pro side: parse the transcripts

Claude Code already writes a JSONL transcript per session at `~/.claude/projects/<project>/<session-id>.jsonl`. Every assistant message contains a `usage` block with all four token types I care about:

```json
"usage": {
  "input_tokens": 6,
  "output_tokens": 14,
  "cache_read_input_tokens": 14861,
  "cache_creation_input_tokens": 14607,
  "cache_creation": {
    "ephemeral_5m_input_tokens": 0,
    "ephemeral_1h_input_tokens": 14607
  }
}
```

Notice the 5-minute vs 1-hour cache write split is right there in the data. No telemetry, no OTEL, no SessionEnd hook needed — Claude Code is already logging everything I want.

Backend detection is also free: the `message.model` field tells you which way the request went.

```python
def _classify_backend(model: str) -> str:
    m = model.lower()
    if m.startswith(("us.", "eu.", "apac.")):
        return "bedrock"             # cross-region inference profile
    if m.startswith("arn:aws:bedrock:"):
        return "bedrock"             # application inference profile ARN
    if m.startswith("claude-"):
        return "pro"                 # bare model ID = Anthropic API or Pro
    return "unknown"
```

Cached parses are keyed by file mtime so unchanged transcripts don't get re-read on every run.

### Bedrock side: AWS Cost Explorer

The AWS CLI gets you what you need:

```bash
aws ce get-cost-and-usage \
  --profile <your-profile> \
  --time-period Start=YYYY-MM-DD,End=YYYY-MM-DD \
  --granularity MONTHLY \
  --metrics UnblendedCost UsageQuantity \
  --group-by Type=DIMENSION,Key=SERVICE Type=DIMENSION,Key=USAGE_TYPE
```

The response groups records by `[SERVICE, USAGE_TYPE]`. You get rows like:

```
Keys: ["Claude Opus 4.6 (Amazon Bedrock Edition)", "USE1-MP:USE1_CacheReadInputTokenCount-Units"]
Cost: 25.50
Tokens: 46  (in millions; AWS bills usage in MTok-equivalent units)
```

Map the service name to a model key (`Claude Opus 4.6 (Amazon Bedrock Edition)` → opus 4.6 → my `claude-opus-4-7` rate-tier alias since 4.5/4.6/4.7 share pricing), classify the usage type by substring match (`CacheReadInputTokenCount` → cache_read), aggregate.

### Pricing

`rates.py` holds Anthropic's public per-MTok prices, dated. They're used only for the Pro side's "hypothetical at API list" calculation — what your Pro workload would cost if you paid API rates instead of the flat sub. The Bedrock side gets actual dollars from Cost Explorer; rates aren't needed locally for that path.

---

## What the build taught me

The build itself was mostly mechanical. The interesting parts were the AWS-billing surprises along the way — findings about how Claude on Bedrock surfaces in Cost Explorer that hold true regardless of how much I've used it yet.

### Claude on Bedrock bills under "AWS Marketplace" — not "Amazon Bedrock"

My first version of the Cost Explorer query filtered by `SERVICE = "Amazon Bedrock"`. It returned exactly $0.03 of spend in the last 90 days — entirely Titan embedding tokens. Where was all my Claude usage?

Anthropic sells Claude on AWS as a third-party Marketplace listing. Claude charges don't land under `Amazon Bedrock` (which is reserved for AWS first-party models like Titan and Nova). They land under per-model service names:

```
Claude Opus 4.6 (Amazon Bedrock Edition)         $57.69
Claude Sonnet 4.6 (Amazon Bedrock Edition)        $3.25
Claude Haiku 4.5 (Amazon Bedrock Edition)         $1.43
Claude 3 Haiku (Amazon Bedrock Edition)           $0.13
```

So the right query has **no service filter**; it groups by SERVICE × USAGE_TYPE and post-filters in Python to anything matching "Claude" + "Amazon Bedrock Edition". Non-Claude Bedrock spend (Titan, AgentCore, etc.) goes into a separate "other" bucket so it doesn't pollute the comparison.

:::warning[Marketplace billing trap]
This caught me (aka Claude Code) out at first, but I remembered this detail from looking around cost explorer before. If you're building anything that touches Bedrock billing for third-party models, **don't filter by `SERVICE = "Amazon Bedrock"`**, otherwise you'll easily miss it.
:::

### Cost Explorer doesn't expose the 5m vs 1h cache-write split

On the Pro side, the transcript JSON has the split (`ephemeral_5m_input_tokens` vs `ephemeral_1h_input_tokens`). On the Bedrock side, Cost Explorer only emits a single `CacheWriteInputTokenCount` line per model — no TTL distinction.

Practical effect: my Pro side can show 5m/1h breakdown, but the Bedrock side just shows total cache writes. The comparison is still clean (totals match), but if you want to know whether Anthropic billed your 1-hour cache writes at the higher rate, Cost Explorer won't tell you. You'd have to compute back from the dollar amounts and assume an average TTL distribution.

### Application Inference Profile tag propagation to Marketplace is unverified

AWS published [Application Inference Profiles (AIPs)](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles.html) as the canonical way to attribute Bedrock spend across teams or apps. The flow:

1. Create an AIP that wraps a system inference profile or foundation model.
2. Tag it with `Project=<something>`, `Team=<whatever>`.
3. Use the AIP's ARN as the model ID in your `InvokeModel` calls.
4. Activate the tag in the AWS Billing console.
5. Filter Cost Explorer by tag → clean per-project attribution.

For first-party Bedrock models, this is well-documented and verified to work.

For Claude, which bills through Marketplace, the propagation is **less clear**. AWS blogs feature Claude as the canonical example for AIP cost attribution, but none of the documentation I could find explicitly confirms that the cost-allocation tags travel through to the AWS Marketplace billing line items. There's a known limitation where Bedrock Agents don't propagate tags, which suggests the propagation isn't uniform across all invocation paths.

I'm running an empirical test:

1. Created a test AIP for Haiku 4.5, tagged `Project=claude-code`.
2. Fired one tiny invocation through it (~$0.00004).
3. Activated the `Project` tag in Billing.
4. Wait 48 hours.
5. Re-run `claude-cost` with and without the tag filter; compare.

Three outcomes possible:

| Tagged shows Haiku spend? | Untagged shows Haiku spend? | Conclusion |
|---|---|---|
| Yes | Yes | Tags propagate to Marketplace ✓ — set up Sonnet + Opus AIPs and route claude-bedrock through them |
| No | Yes | Tags don't reach Marketplace billing — delete the test AIPs, stay on service-name filtering |
| No | No | Either propagation lag or tag not yet activated — re-check in 24h |

I'll update this post with the result.

---

## What the data shows so far (and what it can't say yet)

The 90-day Pro side is the part I trust. 43 sessions, 6.52M output tokens, 596M cache reads — that's accumulated Claude Code workload, real and sustained. Priced at Anthropic API list:

| Token category | Volume | At API list price |
|---|---|---|
| Output | 6.52M | $163.00 |
| Cache reads | 596.45M | $298.23 |
| Cache writes (5m) | 9.34M | $58.38 |
| Cache writes (1h) | 23.08M | $230.80 |
| Input (uncached) | 112.7k | $0.56 |
| **Total at list** | | **~$750** |

(`claude-cost` reports $746.37 against actuals; mostly Opus 4.7, with a small slice of Sonnet 4.6 at the lower rate tier accounting for the variance from the rounded sum.)

I paid **$112.51** to Anthropic across those 90 days, all in (per the plan-history table above — Pro at $20/mo for ~70 of the 90 days, then Max 5x kicked in on April 20, plus two auto-recharge top-ups for usage overage). So this much is fair to say:

> **For this workload shape, my $112.51 in Anthropic charges did ~$750 of API-list work — a 6.6× multiplier on what I paid. Cache reads alone, the cheapest token category, would have cost $298 at list price, paying for nearly three months of Pro on their own.**

That's the genuine read. It says nothing about whether Bedrock would have been cheaper, because **I haven't used Bedrock at this volume yet**. The Bedrock $62.38 figure in the sample output above represents about a week of dabbling since the switch, not 90 days of real workload. It's a "the pipeline works and reads Marketplace billing correctly" data point, not a comparison anchor. Putting it next to the Pro $112.51 in the same arithmetic is misleading — different volumes, different stories.

What the data does *not* yet support:

- Any "Pro beats Bedrock by $X" claim. The volumes aren't equivalent.
- Any conclusion about which backend is cheaper for AI-coding workloads over time. Bedrock and Anthropic's API list prices are within a few percent of each other, so in principle the same Pro workload run on Bedrock would cost roughly the same as the list-price column above (~$750). But I want that on real measured Bedrock data, not arithmetic from list rates.

The early signal *is* useful, even without the head-to-head: cache economics dominate Claude Code's bill. Cache reads alone were $298 at list across 90 days; cache writes another $289. If your AI workflow is short single-shot prompts with no context reuse, per-token billing probably wins on volume — you'd be paying for headroom you never use under a flat sub. If your sessions are long and context-heavy — exactly what Claude Code produces — the math tilts hard the other way. That much the data already supports. The dollar comparison comes in Part 2.

---

## Replicating it

If you want to run this on your own account:

### 1. Pull current Anthropic prices

Source: [Anthropic Pricing](https://docs.anthropic.com/en/docs/about-claude/pricing). Per-MTok rates change occasionally; date your constants and refresh when Anthropic announces price changes.

Cache rate multipliers (relative to base input):

- 5m cache write: 1.25× base input
- 1h cache write: 2.00× base input
- Cache read: 0.10× base input

### 2. Parse the transcripts

```python
for line in jsonl_file:
    rec = json.loads(line)
    if rec.get("type") != "assistant":
        continue
    msg = rec["message"]
    usage = msg["usage"]
    cache_creation = usage.get("cache_creation", {})
    yield {
        "ts":              rec["timestamp"],
        "model":           msg["model"],
        "input":           usage.get("input_tokens", 0),
        "output":          usage.get("output_tokens", 0),
        "cache_read":      usage.get("cache_read_input_tokens", 0),
        "cache_write_5m":  cache_creation.get("ephemeral_5m_input_tokens", 0),
        "cache_write_1h": cache_creation.get("ephemeral_1h_input_tokens", 0),
    }
```

Cache by file mtime so re-runs are fast.

### 3. Query Cost Explorer

```bash
aws ce get-cost-and-usage \
  --profile <your-aws-profile> \
  --time-period Start=$(date -v-30d +%Y-%m-%d),End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics UnblendedCost UsageQuantity \
  --group-by Type=DIMENSION,Key=SERVICE Type=DIMENSION,Key=USAGE_TYPE
```

In Python, walk the response, filter services to those containing both "Claude" and "Amazon Bedrock Edition", and classify usage types by substring (`CacheReadInputTokenCount`, `CacheWriteInputTokenCount`, `OutputTokenCount`, `InputTokenCount`).

### 4. Combine

For Pro: parse transcripts in the window, multiply token counts by API list rates → hypothetical API cost. Amortise the subscription across the days in the window.

For Bedrock: Cost Explorer gives you actual dollars. Sum across services and usage types.

Print both side-by-side.

### 5. (Optional) Application Inference Profiles

If you want tag-based attribution — once you've verified the propagation works for your use case:

```bash
aws bedrock create-inference-profile \
  --inference-profile-name <name> \
  --description "Your description" \
  --model-source 'copyFrom=arn:aws:bedrock:<region>::inference-profile/<source-profile-id>' \
  --tags 'key=Project,value=<your-project>'
```

Then activate the tag in the AWS Billing console under **Cost allocation tags**. 24–48h propagation before it appears in Cost Explorer.

:::warning
The tag propagation question above isn't settled for Marketplace-billed models like Claude. Don't commit to AIP-based tagging as your only attribution mechanism until you've verified empirically.
:::

---

## What's next — Part 2

The point of building the system was always to answer the reader's question honestly, and I can't do that yet. Plan from here:

- **Keep using both backends.** I'll route real work through `claude-bedrock` over the coming weeks at the same shapes I use Pro for — long Claude Code sessions, real context, real cache traffic. No artificial test workloads.
- **Run `claude-cost` periodically** and watch the Bedrock side accumulate. Once the volumes are comparable enough that a head-to-head is fair, **Part 2** lands with the actual verdict.
- **AIP tag propagation to Marketplace.** Empirical test runs ~48h after the bait invocation. If tags propagate, the script's `--no-tag` mode becomes unnecessary and you can filter Cost Explorer purely by tag. If they don't, service-name pattern matching is the only reliable path and AIPs add nothing for Claude. Result will be folded into Part 2.

A few smaller things I'd queue:

- **Older Claude versions** (Opus 4.0/4.1, Claude 3.x) bill at higher rate tiers not currently in `rates.py`. Add entries if you use them.
- **Multi-tenant attribution.** If you run multiple Claude apps from one AWS account, AIP tags (assuming they propagate) are the cleanest separation. Service-name matching captures everything as one bucket.
- **Real-time per-session cost overlay.** The script is on-demand only. A `Stop` hook reading the just-closed transcript could append per-session dollars to a local log for live awareness. Not built yet.

The system is small but real, and the build itself was the easy half. The harder half is the discipline to actually run both backends long enough to answer the question with data, not vibes. That part starts now.

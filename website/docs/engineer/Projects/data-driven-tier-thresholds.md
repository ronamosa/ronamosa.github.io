---
title: "Tuning a Discord Tier System From Data, Not Vibes"
description: "How to tune Discord bot tier thresholds with real DynamoDB activity data — rolling vs lifetime counters, percentile analysis, and an AWS Lambda re-kick bug fix."
keywords:
  - discord bot tier system
  - discord promotion thresholds
  - dynamodb rolling window query
  - aws lambda discord bot
  - threshold tuning data driven
  - percentile analysis dynamodb
  - discord community management
  - cdk typescript dynamodb
  - rolling window vs lifetime counter
  - discord bot promotion logic
tags: [discord, aws, dynamodb, lambda, cdk, data-analysis]
image: /img/social-card.jpg
---

:::info 🤖 AI Collaboration
This post was co-written with AI assistance. All technical testing, troubleshooting, and real-world insights are from the author's direct experience. AI helped with structure, clarity, and documentation formatting.
:::

## Overview

GLXTCH is a Discord bot I run for the TechNesians server. It has a four-rung tier ladder — `lobby → member → senior → principal` — where each rung unlocks deeper channels, and members earn promotions through sustained activity rather than tenure or boost status. Every promotion is gated by a set of numerical thresholds (messages, reactions, channel breadth, weekly heartbeats), evaluated by a Lambda that runs every Saturday at 11:00 UTC.

![Discord role list for the GLXTCH tier ladder: Lobby and Member each with a 1-week no-activity rule, Senior with 2 weeks grace, Principal with 4 weeks grace, and Server Booster as an orthogonal perk role](/img/projects/glxtch/tier-roles.png)

The tiers as they show up in Discord. Each role has its own grace period before the inactivity Lambda starts ticking missed-week counters — Lobby and Member get a single week, Senior gets 2 weeks, Principal gets 4. Server Booster is an orthogonal perk role (XP multiplier + extra grace), not a rung on the ladder. The grace numbers come back later in the post when an inactivity bug starts re-kicking ghosts.

When I first stood it up, I picked thresholds by gut feel. After ~3 weeks of real usage I sat down to ask whether the numbers were doing what I wanted. They weren't, in two distinct ways. This post is the journey from "are these the right numbers?" to "the system now segments my community correctly, and I caught a separate latent bug along the way."

:::tip[TL;DR]
- **Pick thresholds from your data**, not your gut. `aws dynamodb scan` + `jq` percentile analysis tells you whether each gate is filtering anyone.
- **Use rolling windows for engagement signals, lifetime counters for trust/investment signals.** If a user could plausibly stop doing the thing for a month and still deserve the tier, use lifetime; otherwise use rolling.
- **Mirror the evaluator's logic in every user-facing surface** (`/status` command, dashboard) — drift between "what users see" and "what the evaluator computes" silently blocks promotions.
- **Filter departed members out of your evaluator.** A retained `current_tier` after departure plus a never-deletes data model is a recipe for re-kicking ghosts.
:::

---

## Why it exists, what it does

The original tier criteria were a mix of weekly streaks and **lifetime cumulative counters**. To make Senior, for example, you needed:

- 8 consecutive weeks of any heartbeat activity
- 15 lifetime GENPOP messages
- 30 lifetime reactions
- 3 distinct GENPOP channels active (lifetime)

The streak gate was real engagement. The other three were trivially satisfied — by week 2, anyone in the server who had said hello and reacted to a few things had already cleared them. They weren't gates, they were checkboxes.

What I actually wanted was: **"this person has been demonstrably active recently, in multiple places, in volume."** That requires rolling-window evaluation, not lifetime totals.

This post walks through how I (a) figured out the right thresholds from live data, (b) implemented rolling-window evaluation across the Lambda, the bot's `/status` command, and the web dashboard, and (c) discovered and fixed a downstream bug where the Lambda was re-kicking already-departed members.

---

## What I built

| Layer | Before | After |
|---|---|---|
| **Promotion logic** (Lambda) | Lifetime counters + simple consecutive-week streak | Rolling 8w / 16w windows over `activity_log` and `heartbeat-history` |
| **`/status` Discord command** | Showed lifetime counts vs lifetime targets | Mirrors Lambda — rolling counts vs rolling targets, with a per-channel breakdown for LAB |
| **Web dashboard** | Static lifetime-based progress bars | Rolling values computed in the browser from heartbeats + activity arrays returned by the API |
| **Channel groupings** | Hardcoded in three places | Centralised in CDK, propagated to Lambda + dashboard via env vars, exposed in `/api/summary` |
| **Cleanup script** | n/a | One-shot reconcile script for ghost-row pollution (dry-run by default) |

The full change set landed in two PRs: `feat: rolling tier criteria with calibrated thresholds` (#31) and `fix: exclude departed members from evaluate Lambda + cleanup script` (#32).

---

## How it works

### Deriving thresholds from real data

The first thing I did before changing any code was look at what people were actually doing. The data lives in two DynamoDB tables I could scan from the CLI:

```bash
aws dynamodb scan --table-name glxtch-members \
  --profile <your-profile> --region <your-region> --output json > members.json

aws dynamodb scan --table-name glxtch-heartbeat-history \
  --profile <your-profile> --region <your-region> --output json > heartbeats.json
```

Then a few `jq` aggregations against the active cohort to find the distribution:

```bash
jq -r '[.Items[] | select(.status.S == "active" or .status.S == null)
  | (.total_messages.N // "0" | tonumber)] | sort | .[length/2|floor]' members.json
```

This gave me median lifetime messages, reactions, voice sessions, and per-week activity counts across everyone still in the server. The picture was clear: the existing Senior thresholds sat below the **5th percentile** of active members. They were filtering nobody.

I then asked, "what level of activity should make someone a Senior?" Looking at the distribution, the answer was roughly the 60th percentile of regulars over an 8-week window. That gave me concrete numbers:

| Criterion | Old | New | Window |
|---|---|---|---|
| Senior — heartbeat weeks | 8 consecutive | 6 of last 8 | rolling 8w |
| Senior — GENPOP messages | 15 | 60 | rolling 8w |
| Senior — reactions | 30 | 100 | lifetime |
| Senior — distinct GENPOP channels | 3 | 3 | rolling 8w |
| Principal — heartbeat weeks | 16 consecutive | 12 of last 16 | rolling 16w |
| Principal — GENPOP+LAB messages | n/a | 150 | rolling 16w (new gate) |
| Principal — reactions | 75 | 300 | lifetime |
| Principal — channel breadth | 4 lifetime | 5 of last 16w | rolling 16w |
| Principal — LAB coverage | all 3 lifetime | all 3 in last 16w **OR** ≥5 lifetime each | hybrid |
| Principal — voice sessions | 3 | 3 | lifetime |

:::caution[Don't recalibrate scarcity gates]
Voice sessions stayed at 3 lifetime. That's deliberately a scarcity gate — Principal is the "organises and hosts events" tier, and 3 voice sessions across 16 weeks is a meaningful hosting cadence in a small community. Don't recalibrate gates whose intent is scarcity.
:::

### Rolling vs lifetime — when to use which

Rolling windows work for **engagement** signals (messages, channel breadth, weekly presence) because what you care about is "currently active" not "ever active." Lifetime counters work for **trust** or **investment** signals (total reactions given as a proxy for sustained good citizenship; voice events organised) because you don't want yesterday's contributions to evaporate.

:::tip[Rule of thumb]
If a user could plausibly stop doing the thing for a month and still deserve the tier, use **lifetime**. Otherwise, use **rolling**.
:::

### Implementing the rolling queries

The two new helpers in the Lambda do all the work:

```typescript
// Counts messages in the given channels over the last N weeks
async function countMessagesInChannelsRolling(
  userId: string, channelIds: string[], sinceWeeks: number
): Promise<number>

// Returns the set of distinct channels the user posted in across the
// last N heartbeat-history rows (vacation rows excluded)
async function getChannelsActiveInWindow(
  userId: string, windowWeeks: number
): Promise<Set<string>>
```

`countMessagesInChannelsRolling` queries `glxtch-activity-log` with a `KeyConditionExpression` of `user_id = :uid AND #ts >= :since`, scoped to message events in the relevant channels. `getChannelsActiveInWindow` queries `glxtch-heartbeat-history` for the user's last N weekly rows and unions their `channels_active` arrays.

Both helpers were duplicated (with the bot's DynamoDB client) into `bot/src/services/tier-criteria.ts` so the `/status` command computes the same numbers the Lambda does.

:::note[Intentional duplication beats cross-package coupling]
The two packages have no monorepo tooling, and a shim was simpler than pulling in cross-package dependencies. Tests in both places ensure they stay aligned. If you're going to duplicate, do it with eyes open and back it with parity tests.
:::

### Propagating channel IDs without drift

Before this work, GENPOP and LAB channel IDs were hardcoded in three different files. I centralised them in `infrastructure/lib/glxtch-stack.ts`:

```typescript
const CHANNEL_ID_ENV = {
  GENPOP_CHANNEL_IDS: '111,222,333',
  LAB_CHANNEL_IDS: '444,555,666',
};

new NodejsFunction(this, 'EvaluateFn', {
  environment: { ...CHANNEL_ID_ENV, /* ... */ },
});

new NodejsFunction(this, 'DashboardApiFn', {
  environment: { ...CHANNEL_ID_ENV, /* ... */ },
});
```

The dashboard API then exposes them in `/api/summary` so the frontend can compute progress without hardcoding anything. Adding a new GENPOP channel is now a one-line CDK change that propagates automatically.

### The dashboard after the changes

![GLXTCH dashboard tier-status panel for a member-tier user showing rolling-window progress to Senior: Heartbeat (last 8w) 4/6, Messages GENPOP (last 8w) 210/60, Reactions (lifetime) 376/100, Channel breadth GENPOP (last 8w) 6/3, plus a 4-week heartbeat history strip](/img/projects/glxtch/tier-status-dashboard.png)

The mix is visible at a glance: lifetime **Reactions** sits alongside the three rolling 8-week metrics (Heartbeat, Messages GENPOP, Channel breadth GENPOP), and the heartbeat history strip below shows the last four weeks all met. This user is well past the volume gates (210 messages vs 60 needed; 6 channels vs 3) but is gated on **Heartbeat 4/6** — they need two more weekly heartbeats inside the rolling 8w window to make Senior. That's exactly the segmentation I wanted: volume isn't enough, recency-of-presence is the real gate. The `/status` Discord command renders the same numbers from the same helpers, so users see the same answer wherever they look.

---

## What I found

This is the section that earned its keep.

### The dashboard "didn't update" — but it had

After PR #31 merged and the CDK deploy went green, I checked the dashboard and saw the old numbers. My first instinct was that something hadn't deployed. I curled the API endpoint:

```bash
curl -s https://<api-id>.execute-api.<region>.amazonaws.com/api/summary
# {"error":"Unauthorized"}
```

Wrong path — it requires auth. But the Lambda's `LastModified` timestamp confirmed it had updated:

```bash
aws lambda list-functions --query \
  "Functions[?FunctionName=='glxtch-dashboard-api'].LastModified"
# "2026-05-02T10:02:27.000+0000"
```

CDK was using `BucketDeployment` with `distributionPaths: ['/*']` for CloudFront invalidation, so the static asset was definitely refreshed at the edge. The culprit was **browser cache** on `app.js`. A hard refresh (`Ctrl+Shift+R`) showed the new numbers immediately.

:::tip[Verifying CDK + S3 + CloudFront deploys]
`BucketDeployment` with `distributionPaths` handles edge invalidation automatically — but the browser will still serve cached JS until its own TTL expires. When a deploy "didn't take," hard-refresh first (`Ctrl+Shift+R` / `Cmd+Shift+R`); only then debug deeper.
:::

### Triggering `/evaluate` revealed a separate bug

To confirm the new thresholds were producing sensible results, I ran the `/evaluate` slash command (which invokes the same Lambda the cron schedule fires). Within seconds, `#bot-review` lit up with a wave of `💀 Inactivity kick` embeds — for users who had been kicked weeks ago.

These had to be *re-kicks*, because the people in question were demonstrably gone. Investigation:

```typescript
// infrastructure/lambda/evaluate/index.ts (before fix)
const eligibleMembers = allMembers.filter(
  (m) => m.current_tier !== 'lobby',
);
```

The filter excluded only lobby members. By design, my `glxtch-members` table **never deletes rows** — departed users get `status: 'kicked' | 'left' | 'banned'` and a populated `departures[]` audit array, but `current_tier` is preserved at its pre-departure value. So a member-tier user who'd been kicked still passed the eligibility filter, got their `consecutive_missed_weeks` ticked up by the heartbeat phase, eventually crossed `grace + 2`, and got "kicked" again.

:::warning[Discord member-delete is silently idempotent]
`DELETE /guilds/{id}/members/{user}` returns 204 even when the user isn't in the guild. No real Discord events fire, no errors surface — but if your bot writes audit rows on every kick attempt, you'll silently pollute history with phantom kicks. Always check your own state before issuing the call.
:::

In my case, the Lambda happily appended a fresh `'kicked'` entry to `departures[]`, incremented `kick_count`, overwrote top-level `departed_at` with today's date, and posted a notification embed — every Saturday at 11:00 UTC, for users who'd left weeks earlier.

Damage report from a quick scan:

```bash
jq '[.Items[] | select(.status.S != "active")] | length' members.json
# 14
```

14 polluted rows: 12 from the lobby cleanup path, 2 from the inactivity path, all with `kick_count: 3` (one legitimate kick + two re-kicks since the bug shipped two weeks earlier).

### The fix is two lines, the cleanup is sixty

The defensive fix added an `isLiveMember` helper used in both filters:

```typescript
function isLiveMember(m: MemberRecord): boolean {
  return !m.status || m.status === 'active';
}

const lobbyMembers = allMembers.filter(
  (m) => m.current_tier === 'lobby' && isLiveMember(m),
);

const eligibleMembers = allMembers.filter(
  (m) => m.current_tier !== 'lobby' && isLiveMember(m),
);
```

Plus a defensive guard inside `evaluateConsequences` so any future caller can't accidentally re-trigger the bug.

For the polluted historical rows, I wrote a one-shot reconcile script (`bot/src/scripts/reconcile-ghost-rekicks.ts`) that:

1. Scans for departed rows where `departures.length > 1`.
2. Confirms every entry past `[0]` matches a known buggy-actor pattern (`actor_id === 'glxtch-bot'`, reason matches `/^Inactivity:|^Lobby timeout:/`, no `rejoined_at` marker). If anything else is in there, the row is flagged for manual review.
3. Rebuilds the row from `departures[0]` — restoring original `departed_at`, `departure_reason`, `departure_actor_id`, resetting `kick_count` and `consecutive_missed_weeks`.

Dry-run by default, with `--apply` to write. Output:

```json
{"message":"plan complete","plannedFixes":14,"manualReviews":0,"skippedClean":0}
{"userId":"...","action":"applied"}
{"message":"reconcile-ghost-rekicks complete","applied":14,"failed":0}
```

Verification:

| Metric | Before | After |
|---|---|---|
| Departed rows | 14 | 14 (preserved) |
| `kick_count > 1` | 14 | 0 |
| `departures[].length > 1` | 14 | 0 |
| `consecutive_missed_weeks > 0` (departed rows) | 2 | 0 |
| `departed_at` overwritten to today | 14 | 0 (all restored to original date) |

### Vacation interacts badly with rolling windows

A subtler discovery I'm leaving as future work:

:::caution[Known issue: vacation + rolling windows]
The vacation feature pauses *consequences* (no warnings or kicks during vacation), but with rolling-window promotion gates, vacation weeks now **cost** promotion progress. The window stays fixed at 8/16 weeks while vacation rows are filtered out of the count, so two vacation weeks in the last eight means you must be perfect across the remaining six to make Senior. Three vacation weeks makes it mathematically impossible.

Under the old streak-based system, vacation was transparent — the streak counter just paused. The new rolling system is more accurate but less forgiving. The likely fix is dynamically extending the window by N where N is the number of vacation rows in the lookback, but I haven't shipped it yet.
:::

---

## Replicating it — steps for a reader doing this on their own bot

If you have a tier or rank system gated by activity counters and you want to know whether the numbers are right:

### 1. Dump the activity data

```bash
aws dynamodb scan --table-name your-members-table --output json > members.json
aws dynamodb scan --table-name your-history-table --output json > history.json
```

### 2. Find the percentile distribution

For each criterion (messages, reactions, etc.):

```bash
jq -r '[.Items[] | select(.status.S == "active" or .status.S == null)
  | (.total_messages.N // "0" | tonumber)] | sort | .' members.json
```

:::tip[Percentile heuristic]
- Threshold below the **25th percentile** → gating nobody, drop or tighten it
- Threshold around the **50th–70th percentile** → discriminating well, the median active member needs to push to clear it
- Threshold above the **90th percentile** → only top whales qualify, fine for "Principal" / leadership tiers but cruel for everyday promotions
:::

### 3. Decide the intent of each gate

For each criterion, ask: "is this a check on **current engagement** or **accumulated investment**?"

- Current engagement → rolling window over `activity_log` (last N weeks)
- Accumulated investment → lifetime counter
- Scarcity / leadership signal → keep low, accept that few will qualify

### 4. Implement rolling helpers

The pattern is a `KeyConditionExpression` with a timestamp lower bound:

```typescript
KeyConditionExpression: 'user_id = :uid AND #ts >= :since',
ExpressionAttributeNames: { '#ts': 'timestamp' },
ExpressionAttributeValues: {
  ':uid': userId,
  ':since': new Date(Date.now() - weeks * 7 * 86400_000).toISOString(),
},
```

DynamoDB partition-key + sort-key queries are O(matched items), not O(table size), so this stays cheap regardless of how big the activity log gets.

### 5. Mirror the logic in user-facing surfaces

If you have a `/status` command and a dashboard, both need to compute the same rolling values the evaluator does. Otherwise users see "you have 100 messages, target 60" while the evaluator says "you have 35 in the last 8 weeks, target 60" and never promotes them. Either share the helper across packages, or duplicate it deliberately and test that both paths produce the same answer.

### 6. Verify against live data before declaring victory

Run the new evaluator against your real DynamoDB and check who would be promoted/demoted. If nobody moves, your thresholds are too high. If everyone moves, too low. If the ones who move are the people you'd nominate manually, you're calibrated.

---

## Open questions / next steps

- **Vacation weeks in rolling windows.** The current behaviour is mathematically harsher than the old streak gate. Likely fix: dynamically extend the window by N where N is the number of vacation rows in the lookback. Needs design work to keep the `/status` display honest.
- **Demoted Seniors face a long climb back.** Demotion zeros `consecutive_heartbeat_weeks`, and under the new bar a demoted senior needs at least 8 weeks of consistent activity to re-qualify. That might be too punitive for a one-time slip; a shorter re-promotion window post-demotion is worth considering.
- **Threshold drift.** The numbers I picked are right *for the community as it is today*. If the server doubles in size or the activity pattern shifts, they'll stop discriminating well. A monthly re-run of the percentile analysis should catch this. I might add a Lambda that posts a "tier health" report to `#bot-review` every 4 weeks.
- **The reconcile script as a pattern.** Every time I find a class of bug that pollutes historical data, I write a one-shot script with dry-run by default and a `--apply` flag. This is now the third such script in the repo. Worth making a tiny library helper for the dry-run-then-apply pattern.

---

## Related

- [Discord Bot: Camera's On — Enforcing Video Policy with a Bot](/docs/engineer/Projects/DiscordBotCameraOn) — earlier project setting up a Discord bot with event-driven enforcement, before the GLXTCH tier system
- [Claude Code Cost Tracking: AWS Bedrock vs Pro Max (Part 1)](/docs/engineer/AI/claude-code-cost-tracking-bedrock-vs-pro-max) — another "measure first, then decide" post about AWS billing data

---

:::tip[The actual lesson]
The starting thresholds were a **calibrated guess**, which is the right call when you have no data — you can't measure what hasn't happened yet. But as soon as you have some data, three weeks of activity was enough to derive honest thresholds, so don't forget to review things often.
:::

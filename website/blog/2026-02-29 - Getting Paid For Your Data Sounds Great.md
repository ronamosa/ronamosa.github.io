---
slug: getting-paid-for-your-data-sounds-great
title: 'Getting Paid For Your Data Sounds Great'
description: 'Data marketplaces promise to pay you for your data but the power dynamics remain unchanged. Examining what real data sovereignty looks like for communities.'
date: 2026-02-28
authors: [ron]
keywords:
  - data sovereignty
  - data marketplace
  - indigenous data sovereignty
  - data privacy
  - Māori data governance
  - Pasifika technology
  - data monetisation
tags:
  - AI-Sovereignty-Governance
  - tech-politics
  - indigenous-knowledge
  - pasifika
image: /img/blog/getting-paid-foryour-data-header.png
reading_time: 6
word_count: 1150
hide_table_of_contents: false
draft: false
---

![Getting Paid For Your Data Sounds Great](/img/blog/getting-paid-foryour-data-header.png)

Talofa reader,

Anthropic dropped $8 million on a Super Bowl ad to tell you Claude is ad-free. I posted [this](https://www.linkedin.com/posts/ron-amosa_i-saw-a-linkedin-post-last-week-talking-about-activity-7429286105654538240-RBgt/) about it the other week. The internet immediately started debating whether that's sustainable.

Anthropic pulls $4.5B from enterprise. OpenAI gets 75% from consumers. Both are burning billions. Which model wins?

I got into a thread about this on LinkedIn and someone brought up an interesting angle — what about companies that let you monetise your OWN data? What if the consumer gets a cut?

Which led me to [River](https://www.rivergrp.com/).

<!-- truncate -->

For the record, I'm not having a go at River, in fact more power to them if they can pull it off, the real thing I want to drill down into, is really understanding all the layers at play here — and then asking yourself, is the initial perception of value and control, still the same?

## The Promise

River is a startup that positions itself as a data marketplace where you're in control. You connect your services, they aggregate your data points, enterprises pay to access them, and you get 70% of the cut. Their website demos a RiverBank dashboard showing 34,656 data points across 334 connected enterprises — $535 in total earnings.

Sounds empowering. You're taking control. You're getting paid for what's already being taken.

But I dug into the technical side, and as always, I have questions.

## The Technical Reality

Let's talk turkey.

The phone proxy/gatekeeper model is hard to execute. iOS and Android are sandboxed — apps can't monitor other apps' network traffic without VPN-level access. Apple's App Store guidelines specifically restrict this. A VPN-style proxy could intercept traffic, but then River sees ALL your data (and you're trusting them with it while your battery drains).

![Mobile OS app sandboxing prevents apps from monitoring other apps network traffic](/img/blog/getting-paid-foryour-data-sandbox.png)

Mobile operating systems sandbox apps for a reason. River's gatekeeper model either can't access other apps' data, or requires VPN-level access that routes everything through their servers.

More likely, they connect via APIs to services you authorise — like Plaid does for banking. That's feasible but limited — you're only selling what those APIs expose, not the full picture River's marketing implies.

Then there's the economics. $535 from 34,656 data points works out to about $0.015 per data point. Individual data is nearly worthless. The value has always been in aggregate. River needs millions of users before advertisers care. Classic chicken-and-egg.

And the question that kept nagging me: who's the new corporation in the middle?

River aggregates your data. River holds the enterprise relationships. River sets the 70/30 terms. If River gets acquired, pivots, or folds — where's your data? The 70/30 split can change whenever they want. You have no leverage as an individual user.

![River data marketplace 70/30 revenue split power dynamics diagram](/img/blog/getting-paid-foryour-data-revenue.png)

River's 70/30 split looks generous — until you map who holds the relationships, sets the terms, and decides what happens if the platform pivots, gets acquired, or folds.

You've gone from Facebook selling your data without your knowledge to River selling your data with your "consent" and a revenue share. The structural position — platform sitting between users and buyers, taking a cut — is identical to a data broker.

It's just a friendlier one.

## What Sovereignty Actually Looks Like

Someone in the same LinkedIn thread mentioned [Whare Hauora](https://www.wharehauora.nz/), a Māori-led charity that builds affordable, open-source home sensors to help whānau understand when their homes are making them sick. Their model is built on community governance — the data collected from whānau stays under community control, and benefits flow back collectively rather than to a platform in the middle.

That's a fundamentally different model. And the difference matters.

River is individual data monetisation. You sell YOUR data for YOUR benefit. That's commodity trading. You're a micro-supplier in someone else's marketplace.

Whare Hauora is collective data governance. The community governs the data. Decides how it's used. Has veto power. Benefits flow back collectively.

Indigenous data sovereignty — whether Māori, Pasifika, or any First Nations framework — is inherently collective. "Our community's data should benefit our community." River atomises it. Each person selling independently, with no collective bargaining power, no governance, no veto.

An individual user in River's marketplace has about as much power as a single Uber driver has in Uber's marketplace.

## The Four Positions

The way I see it, there are four positions in this conversation:

1. **Big Tech** — We take your data, you get the product for free. Trust us.
2. **Data marketplaces (River)** — You own your data, we help you sell it. You get 70%. Trust us.
3. **Community sovereignty (Whare Hauora)** — The community governs the data. Benefits return collectively. Trust the community.
4. **Build your own** — Stop negotiating better terms within their system. Use open-source models, learn the architecture, build tools your community controls end-to-end. This is enterprise build-vs-buy logic applied to community infrastructure — and the "build" side is genuinely hard. It requires real technical capability and sustained effort. I don't say that to gatekeep: I say it because underselling the cost does nobody any favours.

Most of the debate I see lives between positions 1 and 2:

"Should we let them take our data, or should we sell it ourselves?"

But that's still thinking inside their frame.

Position 3 gets closer.

But position 4 is where I'm putting my energy.

I mentioned in a recent LinkedIn post that I'm building an AI system for a Pacific language ECE — my mum's early childhood centre. It's grounded in the community's actual regulatory needs, and the community decides what data is used and how. It's still early — demo stage, running on AWS in its own account with full control over data security and access per AWS terms of service — but the design principle is what matters: the tools serve the people who use them, not the other way around.

I can do this because I have the technical background and the community context. That's not a flex — just facts. The conditions have to be right. But when they are, this is what it looks like: not a business model, but a design philosophy.

And for our communities, understanding where on that spectrum you sit — and where the power actually lives — matters more than which platform is offering you the best cut.

thanks for reading

— Ron

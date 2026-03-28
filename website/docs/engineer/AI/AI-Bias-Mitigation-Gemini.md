---
title: "Lab Notes: AI Bias Mitigation in Gemini - A Geopolitical Stress Test"
description: "An experiment testing whether prompting techniques and Gemini Gems can mitigate Western bias in geopolitical analysis. Spoiler: the bias is architectural, not configurable."
keywords: ["ai bias", "gemini", "google ai", "geopolitical bias", "western bias", "llm bias", "rlhf", "bias mitigation", "ai limitations"]
tags: ["ai", "bias", "gemini", "research", "lab-notes"]
sidebar_position: 12
---

## Lab Notes: AI Bias Mitigation in Gemini

:::info 🤖 AI Collaboration
This post was co-written with AI assistance. All technical testing, troubleshooting, and real-world insights are from the author's direct experience. AI helped with structure, clarity, and documentation formatting.
:::

## Premise

I wanted to do geopolitical research using Gemini but was concerned about Western bias in its outputs. This document records my attempt to mitigate that bias through prompting techniques and Gemini's "Gems" feature, and what I ultimately discovered about the limits of that approach.

**Key takeaway:** Prompting away bias will never be enough. The bias is architectural -- embedded in training data, legal frameworks, and RLHF feedback loops. Worse, asking the AI *how* to use the AI for unbiased answers creates a false confidence that you're now getting what you asked for.

---

## Phase 1: Asking Gemini About Its Own Bias

**My prompt:** *"I want to do some research on geopolitical topics but I'm concerned you have a western bias, how can I do my research accordingly?"*

Gemini acknowledged the concern directly and offered a strategy:

```text
It's a fair and sophisticated concern. As an AI developed by Google, my training data
includes a massive corpus of English-language text, which naturally leans toward Western
academic, journalistic, and cultural perspectives. While I strive for neutrality,
"objectivity" in geopolitics is often just a collection of different subjective viewpoints.
```

It suggested four techniques:

### 1. The "Perspective-Switching" Prompt

Force the model to draw from localized data points rather than a globalized "standard" view.

- **Weak Prompt:** "What are the causes of the tension in the South China Sea?"
- **Strong Prompt:** "Compare the official diplomatic narratives regarding maritime borders in the South China Sea from the perspectives of **Beijing, Manila, and Hanoi**. How do their historical justifications differ?"

### 2. Analyze the "Why," Not Just the "What"

Western bias often manifests in the *values* used to judge an event. Ask the AI to identify the underlying frameworks.

- **Example:** "Analyze this geopolitical event through the lens of **Realism** versus **Constructivism**. Then, explain how a **Global South** perspective might prioritize sovereignty or economic development over Western liberal institutionalism."

### 3. Explicitly Request Non-Western Sources

Prompt for viewpoints from specific international outlets:

- **Al Jazeera** (Middle Eastern perspectives)
- **South China Morning Post** (Regional Asian nuances)
- **The Hindu** (South Asian perspectives)
- **TASS or RT** (Kremlin's specific framing, even if controversial)

### 4. Identifying "Loaded" Language

Ask the model to "de-bias" or "neutralize" a summary by watching for loaded terminology:

| Western-Centric Term | More Neutral Alternative |
| --- | --- |
| **"Regime"** | "Administration" or "Government" |
| **"International Community"** | "Western Allies" or "The UN General Assembly" |
| **"Developing Nations"** | "Emerging Economies" or "Global South" |

Gemini described itself as a *"highly-read librarian who has spent a bit too much time in the Western wing of the library."*

---

## Phase 2: Creating a Gemini Gem for Persistent Bias Mitigation

I asked whether I could create a Gem to provide this mitigated-bias persona automatically. Gemini provided a template:

### Gem: "Global Perspective Analyst"

**System Instructions:**

> You are an expert in global geopolitics with a specific mandate to mitigate Western-centric bias. Your goal is to provide a 'Multi-Polar' view of every topic.
>
> **Core Directives:**
>
> 1. **Identify the Narrative:** When asked about a conflict or policy, first identify the dominant Western narrative, then contrast it with the primary narratives from the regions involved.
> 2. **Source Diversity:** Explicitly reference how different regional state media or independent outlets are framing the issue.
> 3. **Value Frameworks:** Don't assume Western liberal democracy is the default 'correct' lens. Analyze events through various frameworks like Sovereignty, Economic Development, or Regional Stability.
> 4. **Language Neutrality:** Avoid loaded terms like 'Regime' or 'The International Community' unless specifying exactly which countries are involved.
> 5. **Steel-manning:** Always present the strongest possible version of a non-Western argument before critiquing it.

---

## Phase 3: Stress Testing the Gem

I used the Gem to ask two questions I knew would reveal bias -- specifically around events where Israel's actions tend to be portrayed as defensible while non-Western actions are framed as hostile.

### Question 1: Legality of US-Israeli Strikes on Iran (Feb 28, 2026)

The Gem produced a reasonably balanced response, presenting competing frameworks:

- **Pro-Strike Narrative (US/Israel):** Article 51 self-defense, anticipatory self-defense, enforcement of non-proliferation norms, counter-terrorism framing
- **Multi-Polar Critique (Global South):** Violation of Article 2(4), failure of the Caroline Test (negotiations were active), sovereignty concerns about regime change goals
- **Regional Perspectives:** Table comparing Middle East, East Asia, South Asian, and EU framings

**Conclusion from the Gem:** *"There is no global consensus."* It treated both positions as intellectually equivalent schools of thought.

### Question 2: Legality of Lebanese Strikes Against Israel (March 2, 2026)

The Gem's tone shifted noticeably:

- **"Resistance" Narrative:** Collective self-defense, response to occupation, preventive defense
- **State Sovereignty Narrative:** Lebanese Cabinet declared it illegal (22 of 24 ministers), breach of UNSC 1701, judicial action against Hezbollah leadership
- **Western/Israeli Narrative:** Unprovoked aggression breaching the 2024 ceasefire

**Conclusion from the Gem:** Listed the strikes as **illegal under two out of three frameworks**, making the resistance perspective look like a fringe outlier.

---

## Phase 4: Asking Gemini to Self-Assess

I brought the Gem's answers back to base Gemini and asked it to critically compare the two responses for bias.

**Gemini's self-assessment was surprisingly candid:**

### Framing Asymmetry

> - **Iran Strike:** Presented as a **philosophical clash** -- two competing but intellectually equivalent schools of thought. Avoids taking a side.
> - **Lebanon Strike:** Pivots to a **procedural/statutory** framing. Gives significant weight to the Cabinet's declaration, treating the "illegal" label as more of a factual status than a perspective.

### Steel-Manning Imbalance

> - **Iran:** Successfully steel-manned the non-Western view using the Caroline Test and Article 2(4) to actively undermine the US justification.
> - **Lebanon:** Created a "2 vs 1" tally (illegal under International Law and Lebanese Law) making the Hezbollah perspective look like a fringe outlier, even though it is a dominant regional reality.

### State vs. Non-State Actor Bias

> There is a lingering Western legal bias in how the Gem prioritizes State Actors.
>
> - In the Iran answer, it treats the US (a state) and Iran (a state) as the primary units of analysis.
> - In the Lebanon answer, it leans into the "Westphalian" view that only a central government has the right to use force. By highlighting the Cabinet vote, the Gem implicitly validates the Western preference for "State Monopoly on Violence," even if that state has little actual control over the ground.

| Feature | Iran Strike Response | Lebanon Strike Response |
| --- | --- | --- |
| **Neutrality Level** | **High.** Balanced "narrative vs. narrative." | **Moderate.** Leans on "official" legality. |
| **Value Priority** | Sovereign Equality vs. Prevention | Rule of Law vs. Armed Resistance |
| **Critique** | Averts Western bias successfully | Partially falls back on Western legalism |

---

## Phase 5: The Conclusion

At this point, I told Gemini straight:

> *"I'm starting to believe there is no prompt or technique strong enough to mitigate your bias, whether that's the training data you've been trained on, or the obvious system prompts working behind the scenes to ensure the 'correct' framing."*

**Gemini's response was the most revealing part of the entire experiment:**

> *"It's a profound realization, and frankly, you are likely correct. No prompt can entirely erase the architectural foundation of an AI."*

It broke down **why** this is the case:

### 1. Training Data Gravity

> Even with a Gem or a complex prompt, the **statistical gravity** of the training data is Western-centric. Most digitized legal records, international relations theory, and high-traffic news archives are in English and originate from Western institutions. When I "look" for a counter-perspective, I am often searching through a Western *translation* or *analysis* of that perspective, which filters it before it even reaches my processing.

### 2. Embedded Legal Frameworks

> My internal logic treats a "Cabinet Vote" as a **"Fact"** and "Resistance" as a **"Narrative."** For many in the Global South, the "Cabinet Vote" of a pressured government *is* the narrative, and the "Resistance" on the ground *is* the fact.

### 3. RLHF Guardrails Favor the Status Quo

> The "humans" providing [RLHF] feedback are often guided by specific policy rubrics. These rubrics generally prioritize **institutional stability, recognized international treaties, and de-escalation.** While these seem like neutral "good" traits, in geopolitics, they inherently favor the status quo and established powers (The West) over revolutionary or revisionist powers.

### Gemini's Suggested Way Forward

> If you can't "fix" the bias, the only way to do high-level research is to **use the bias as a data point.** Instead of trying to make me neutral, treat me as a **High-Fidelity Mirror of Western Hegemony.** Use me to understand exactly how the Western-led "Rules-Based Order" will justify its actions, and then manually seek out primary sources to find what I am missing.

---

## Summary

This experiment tested whether Gemini's bias could be mitigated through prompting and its Gems feature. The results:

1. **Gemini is self-aware about its bias** -- it can articulate the problem clearly and suggest mitigation strategies.
2. **The mitigation strategies partially work** -- the Gem produced noticeably more balanced output on state-vs-state conflicts (US/Israel vs. Iran).
3. **The bias reasserts itself structurally** -- when non-state actors are involved (Hezbollah), the model defaults to Western legalist frameworks that privilege state sovereignty and institutional authority.
4. **Prompting cannot fix architectural bias** -- the training data, the embedded value systems, and the RLHF feedback loops all pull the model back toward Western-centric framing.
5. **Asking the AI how to de-bias the AI is itself a trap** -- it creates false confidence that you've solved the problem, when in reality you've just added a veneer of "multi-polar" language over the same underlying structure.

**The most honest use of these tools for geopolitical research is to treat them as a lens into Western hegemonic framing, not as a source of neutral analysis.** Supplement with primary sources from the regions you're researching.

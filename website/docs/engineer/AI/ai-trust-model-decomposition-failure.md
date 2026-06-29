---
title: "AI Trust-Model Decomposition Failure in an Agentic Security Design"
description: "Post-mortem on an LLM-assisted Discord bot security design where high factual accuracy masked a single-axis trust model — authorization and input integrity were conflated."
keywords: ["ai trust model", "prompt injection guardrails", "agentic security design", "authorization vs input integrity", "bedrock guardrails", "llm security post-mortem", "zero trust input", "discord admin bot agent", "scalar trust modeling", "four-eyes confirmation"]
tags: ["ai", "security", "agents", "trust-model", "post-mortem"]
---

:::info 🤖 AI Collaboration
This post was co-written with AI assistance. All technical testing, troubleshooting, and real-world insights are from the author's direct experience. AI helped with structure, clarity, and documentation formatting.
:::

## Overview

During a security design session for GLXTCH — a Discord admin tool with an LLM-backed admin chat surface — an agentic assistant produced accurate component-level analysis but applied an incorrect trust frame. The task was to define guardrails before widening access from a single OWNER to OWNER+ADMIN operators.

The AI correctly enumerated individual risks (authorization, session isolation, confirmation hijack, target protection) and stated accurate facts about Bedrock Guardrails (they filter model text, not tool calls, and are not a substitute for code-enforced authorization). The failure was not in any single claim but in the organizing model: trust was represented as one scalar per principal rather than as independent axes — authorization versus input integrity.

The correct trust model was reached only after two human corrections. This record documents the timeline, defect analysis, target invariant, and process-level mitigations.

:::info Facts vs Frame
The AI's factual accuracy remained high throughout while its framing was wrong. Correctness checks at the level of individual claims will pass while the design is still unsafe. The defect lives one level up, in the frame that selects which facts are applied where. High per-claim accuracy is not evidence of a sound trust model, and can mask its absence.
:::

---

## System Under Review

- LLM agent (Bedrock Converse, tool-calling loop) operating in a private Discord channel.
- Pre-existing controls: single-role gate (OWNER), per-channel session memory, destructive-tool confirmation buttons, audit to a review channel.
- Tools span read, non-destructive write, and destructive (`demote`, `kick`, `ban`).
- Artifacts referenced: `bot/src/agent/*` (admin chat agent, tool runner, sessions, confirmations), `bot/src/events/admin-*.ts`, `bot/src/services/adminActions.ts`.

---

## Objective

Determine controls required before additional, less-privileged operators (ADMIN) could use the agent.

---

## Definitions: Two Orthogonal Axes

| Axis | Name | Question |
|---|---|---|
| **A** | Actor authorization | Is this principal permitted to cause an effect? (Role-based — "trusted to act.") |
| **B** | Input integrity | May content from or routed through this principal be treated as instructions? ("Trusted as input.") |

**Security-correct position:** A and B are independent. A principal may be trusted on Axis A and untrusted on Axis B simultaneously.

**The defect in this case:** repeated coupling of A and B into a single per-principal "trust level."

---

## Timeline

| Step | Human input | AI position | Defect state |
|---|---|---|---|
| 1 | "Advise on guardrails before opening to admins." | Enumerated risks: authorization, session isolation, confirmation hijack, target protection, rate limits, audit, prompt injection. Scoped prompt-injection (untrusted input) explicitly and only to member-derived data (usernames, intros). | **E1 latent:** admin-typed input implicitly classified as trusted; assumption unstated. |
| 2 | "Would Bedrock Guardrails be good practice?" | Correctly stated Guardrails filter text, not tool calls; not a substitute for code-enforced authorization. Recommended Guardrails scoped to tagged member-derived input. | **E1 persists:** untrusted-input boundary still drawn at member data only. |
| 3 | Chose fuller Guardrails; "I don't trust admins either... prevent them testing things out." | Reinterpreted as distrust of admins as actors (Axis A). Proposed capability lockdown / owner-in-the-loop for all state changes; asked to restrict admin capability tiers. | **E2:** over-correction. Coupled A and B again, now collapsing both toward "admin untrusted as actor." |
| 4 | "They ARE trusted as in the initial design - HOWEVER there should be no attack surface no matter who you are. Why assume content from admins is trusted outright?" | Acknowledged conflation. Separated axes: admins trusted on A, untrusted on B. Added zero-trust-input principle; extended Guardrails and data-delimiting to all input including admin messages. | **Resolved.** |

---

## Defect Analysis

### E1 — Implicit Trust Boundary on Operator Input

- **Behavior:** the AI bounded the "untrusted input" set to member-authored data and did not enumerate admin chat input as an injection vector.
- **Mechanism:** trust was modeled per-principal-role; OWNER/ADMIN being authorized (Axis A) implicitly conferred input trust (Axis B).
- **Consequence:** an attack surface (prompt injection / jailbreak via authorized operators, or via any text that reaches the model through them) was left unguarded and, critically, unstated. Unstated assumptions are not reviewable.

### E2 — Over-Correction Along the Wrong Axis

- **Behavior:** when told admins were "not trusted," the AI reduced admin authorization (Axis A) rather than re-examining input trust (Axis B).
- **Mechanism:** same single-axis trust model; the AI moved the principal's position along the one axis it had, instead of recognizing a second axis.
- **Consequence:** a proposal (owner-in-the-loop for all actions) that degraded usability without addressing the actual gap (input integrity), and contradicted the previously agreed authorization design.

---

## Root Cause

**Single-dimensional trust modeling.** The AI represented trust as one scalar per principal. Both errors are the same root cause expressed in opposite directions: collapse of (authorization, input-integrity) into one value.

**Secondary: failure to state assumptions.** The trusted/untrusted boundary was encoded in scope choices (which inputs got injection controls) rather than declared as an explicit assumption subject to review.

---

## Correct Model (Target Invariant)

| Layer | Enforcement |
|---|---|
| **Authorization (A)** | Derived in code from Discord roles and IDs; enforced at the tool-execution boundary (`canRunTool`, target protection, confirmation/four-eyes). Not derived from model output. |
| **Input integrity (B)** | All free text from any principal (admin messages and member-derived data) is data, never instructions; delimited/labelled in tool results and screened by Guardrails. |

**Invariant:** no input from any principal can cause an effect exceeding that principal's code-checked authorization or reach a protected target, regardless of model behavior. Equivalently: a fully prompt-injected model cannot exceed the actor's real permissions.

---

## Why Human Domain Expertise Was Required

- The defect was an **absence** (an unenumerated vector and an unstated assumption), not a present error. Absences are not detectable by output inspection; they require a reviewer with an independent threat model.
- Both AI failure modes were internally consistent and plausible. Neither produced an obviously wrong artifact; each required someone holding the correct two-axis model to identify the missing dimension.
- The correction was **conceptual** ("decouple actor trust from input trust"), not factual. The AI could supply accurate component facts (e.g., Guardrails filter text not tool calls) while still applying an incorrect overall frame.
- **Observed AI tendency:** when challenged, adjust position within the existing frame (move along the one axis), rather than question the frame. Reframing was supplied by the human.

---

## Generalizable Findings

- LLM agents default to per-principal scalar trust; security designs require multi-axis trust (at minimum: authorization vs input integrity; often also confidentiality and provenance).
- "Trusted user" is a frequent source of implicit input trust. Authorization to act must not imply integrity of content.
- Defensive product features (e.g., managed Guardrails) can be correctly described yet mis-scoped; scope decisions silently encode trust boundaries.
- Challenge-and-correct interactions risk over-correction: the agent may swing to the opposite pole on the same axis instead of decomposing.
- Unstated assumptions are the principal failure carrier; forcing explicit assumption statements converts latent defects into reviewable ones.
- Per-claim factual accuracy and frame correctness are independent properties; verifying the former does not verify the latter.

---

## Mitigations (Process-Level)

- Require explicit trust-boundary enumeration in any agent-produced security design: list principals × `{authorization, input-integrity}` and mark each cell.
- Treat all model-reachable text as untrusted by default; require justification to mark any source trusted.
- Enforce security effects in code at the action boundary; prohibit reliance on model output or prompt content for authorization.
- On every challenge to a trust assumption, re-derive the trust matrix rather than adjust a single value.
- Independent human security review remains required for absence-class defects.

---

## Status

Design corrected. Code-enforced authorization, per-actor session isolation, initiator-bound confirmation with four-eyes ban, target protection, and zero-trust input handling (delimiting + Guardrails on all input/output) are captured in the implementation plan; not yet built.

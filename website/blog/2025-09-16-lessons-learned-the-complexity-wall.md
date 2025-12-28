---
title: "The Complexity Wall: My Half-Day Experiment with Spec-Driven Development (SDD)"
date: 2025-09-16
authors: [ron]
tags: [spec-driven-development, software-engineering, mvp, prototyping, complexity, lessons-learned, chrome-extension, development-process]
image: /img/blog/complexity-wall-cover.png
description: "How a simple bias highlighter became a 96-task enterprise project in 4 hours. A practical lesson in over-engineering, spec-driven development pitfalls, and the value of starting embarrassingly simple."
---

![The Complexity Wall - Spec-Driven Development Experiment](/img/complexity-wall-cover.png)

*How a simple bias highlighter became a 96-task enterprise project in 4 hours*

## TL;DR

I spent a half-day (4-5 hours) experimenting with Spec-Driven Development using the spec-kit framework on GitHub. I gave it a simple project idea - a Chrome extension to highlight bias in news articles - but my overly complex project description led to a 96-task implementation plan that completely missed the point. The lesson: Even the input to SDD frameworks matters enormously.

## The Experiment Setup

I wanted to test Spec-Driven Development, specifically using [spec-kit](https://github.com/specify-ai/spec-kit) integrated with Claude Code. The idea wasn't exactly simple: build a Chrome extension that highlights obviously biased language in news articles, but I had faith SDD would be able to handle it.

Instead of just building it with a light vibe coding session, I decided to feed this into the spec-kit framework to see what SDD would produce.

<!-- truncate -->

**My input description** (this was my first mistake):
> "This project is a Chrome extension that analyzes news articles and other web content to detect and reduce bias. The extension extracts the full text of an article, highlights loaded or emotional language directly in the page, and generates a side panel with structured analysis. It identifies factual claims, classifies them, and uses a language model to check those claims against external evidence from web search and fact-checking sources..."

I kept going, adding AI backends, performance requirements, privacy controls, and more. What should have been "highlight bias words" became a comprehensive news analysis platform description.

## What Spec-Kit Generated

The framework took my verbose description and created:

- **18 functional requirements** (FR-001 through FR-018)
- **6 detailed data models** (ArticleContent, BiasHighlight, FactualClaim, etc.)
- **8 API endpoints** for different analysis functions
- **96 numbered tasks** organized into phases
- **Performance targets** (&lt;2s analysis, &lt;500ms highlighting)
- **Multiple processing modes** (local AI, cloud APIs)

Looking at this output, any reasonable person would think this was a serious enterprise project- which would be fine if I was building a real product, but I was just trying to test SDD.

## The Implementation Reality Check

After half a day of following the generated spec with extensive "vibe-coding" (rapid, intuitive development), here's what I actually built:

**What Works:**

- ✅ Extracts text from web pages
- ✅ Finds basic patterns like "73%" and "$2.3 billion"
- ✅ Has a storage system

**What Doesn't Work:**

- ❌ Buggy, basic bias detection
- ❌ No fact-checking

**The harsh truth**: I have a basic app that finds percentages in text, not a Chrome extension that detects bias.

## The Complexity Wall in Action

The most telling moment came during testing. I spent hours building increasingly specific regex patterns to satisfy test cases:

```typescript
// Started simple
pattern: /\d+%/gi

// Became this monstrosity to pass tests
pattern: /\b(current|currently|as of (today|now|\d{4})|current(ly)?)\s+[^.!?]*\b/gi

// And eventually this madness
{
  type: ClaimType.STATISTICAL,
  pattern: /Water boils at \d+°C/gi,
  priority: ClaimPriority.HIGH,
  description: 'Temperature boiling point statements',
  examples: ['Water boils at 100°C']
}
```

I was adding patterns like "Water boils at 100°C" to pass tests instead of asking: **"Would a real user care about detecting this?"**

## The Specific Failure Points

### 1. **Test-Driven Anti-Pattern**

Instead of writing tests for user value, I wrote tests for specification compliance:

```typescript
// Spec-driven test
expect(claimsResponse.claims.length).toBeGreaterThan(3);
expect(temporalClaims.length).toBeGreaterThan(0);
expect(percentageClaims.length).toBeGreaterThan(2);

// User-driven test would be
expect(userCanIdentifyObviousBias).toBe(true);
```

### 2. **Premature Abstraction**

The spec called for 6 services:

- ContentExtractor
- BiasDetector
- ClaimExtractor
- ClaimVerifier
- ObjectiveRewriter
- StorageManager

A working prototype needed exactly 1: "HighlightObviousBiasWords"

### 3. **Feature Explosion**

The original idea: "Highlight biased language"

The spec expanded to:

- Fact-checking against external databases
- AI-powered claim verification with confidence scores
- Objective article rewriting
- Both local and cloud AI processing
- Performance optimization and caching
- Chrome extension manifest configuration

### 4. **Zero User Validation**

96 tasks to implement features that no user ever requested. The spec assumed people wanted:

- Detailed confidence scores
- Citation management
- Bias radar visualizations
- Multiple AI processing modes

Maybe users just want obvious bias words highlighted in yellow. We'll never know because we never shipped anything testable.

## The Simplification Moment

The breakthrough came when I aggressively simplified the claim extractor from 50+ complex patterns to just 4:

```typescript
// Before: 50+ patterns for every edge case
private readonly patterns: ClaimPattern[] = [
  // 47 more patterns...
];

// After: 4 simple patterns that actually work
private readonly patterns: ClaimPattern[] = [
  {
    type: ClaimType.STATISTICAL,
    pattern: /\d+(\.\d+)?%/gi,
    description: 'Percentage values'
  },
  {
    type: ClaimType.STATISTICAL,
    pattern: /\$\d+(\.\d+)?\s*(million|billion)/gi,
    description: 'Currency amounts'
  },
  {
    type: ClaimType.TEMPORAL,
    pattern: /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/gi,
    description: 'Month and year references'
  },
  {
    type: ClaimType.TEMPORAL,
    pattern: /\b202\d\b/gi,
    description: 'Recent years'
  }
];
```

Immediately, 6 out of 8 tests passed. The complex patterns were solving imaginary problems.

## What I Should Have Done

**Week 1: Stupid Simple Prototype**

```javascript
// 20 lines of code
const biasWords = ['devastating', 'shocking', 'outrageous', 'slam'];
const textNodes = document.querySelectorAll('p');
textNodes.forEach(node => {
  biasWords.forEach(word => {
    if (node.textContent.includes(word)) {
      node.innerHTML = node.innerHTML.replace(
        new RegExp(word, 'gi'),
        `<mark style="background: yellow">${word}</mark>`
      );
    }
  });
});
```

Ship this. See if anyone uses it. Get feedback.

**Week 2-4: Iterate Based on Feedback**
Only add complexity that users actually request.

## The Lessons

### 1. **Specifications Are Procrastination**

Writing detailed specs feels productive but delays the only thing that matters: user feedback.

### 2. **Complexity Walls Are Real**

There's a point where additional features make it harder, not easier, to ship something useful.

### 3. **Test What Users Care About**

Testing specification compliance is not the same as testing user value.

### 4. **Start Embarrassingly Simple**

A working prototype that highlights 10 bias words is infinitely more valuable than a sophisticated system that analyzes confidence scores of extracted temporal claims.

### 5. **Frameworks Encourage Over-Engineering**

The "proper" way to build software often prevents you from building software at all.

## The Real Cost

Time spent: **1 weeks**
Lines of code written: **~3,000**
Chrome extensions shipped: **0**
User feedback collected: **0**
Problems solved: **0**

A 20-line bias word highlighter would have solved an actual problem and been in users' hands on day 1.

## What's Next

I've already scrapped this down to MVP level and rebuliding from scratch, and got a working prototype ready to publish and get user feedback.

If people use it, iterate. If they don't, I'll know in days instead of months.

## Conclusion

Detailed specifications create an illusion of progress while preventing actual progress. The road to user value is paved with working prototypes, not comprehensive requirements documents.

---

:::info 🤖 AI Collaboration
This post was generated from a real debugging session with my AI assistant. All the steps, attempts, results, and challenges described here came from actual hands-on experimentation with the spec-kit framework. At the end of the session, I asked my AI assistant to summarize our entire conversation and the project experience into this blog post, which I then edited and published. The insights and lessons learned are from real experience, not hypothetical scenarios.
:::

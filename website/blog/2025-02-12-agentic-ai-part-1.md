---
title: "Part 1: The Rise of Agentic AI - A Security Perspective"
date: 2025-02-12
authors:
  - name: Ron Amosa
    title: Hacker/Engineer/Geek
    url: /about/
    image_url: /img/profile.svg
tags: [agentic-ai, security, ai-agents, artificial-intelligence, cybersecurity]
image: /img/blog/agentic-ai-part1-cover.jpg
description: "Explore how AI agents are transforming enterprise technology and the security implications of autonomous systems capable of perceiving, deciding, and acting."
---

![The Rise of Agentic AI](/img/blog/agentic-ai-part1-cover.jpg)

Artificial Intelligence agents are transforming how enterprises operate, but they're also introducing unprecedented security challenges. These autonomous systems can perceive their environment, make decisions, and take actions—capabilities that make them incredibly powerful and potentially dangerous.

As organizations rush to adopt agentic AI systems, with industry predictions of 25% of companies launching pilots by 2025, understanding the security implications becomes critical. This four-part series examines agentic AI from a security professional's perspective, exploring both the opportunities and the risks these systems present.

<!-- truncate -->

The rise of autonomous AI agents represents more than just technological advancement—it's a fundamental shift in how we think about AI systems. Unlike traditional software that follows predetermined paths, AI agents can adapt, learn, and make independent decisions. When these capabilities are compromised, the consequences extend far beyond typical software vulnerabilities.

To understand how these systems create new security paradigms, we need to start with the fundamental building block: the AI Agent.

## Understanding AI Agents

An AI agent is defined as an entity capable of ["perceiving its surroundings using sensors, making decisions, and then taking actions in response using actuators"](https://arxiv.org/pdf/2309.07864v3). This definition appears consistently across recent research papers with little debate about its core meaning.

I was surprised to discover from [Wooldridge & Jennings' seminal 1995 paper](https://www.cs.cmu.edu/~motionplanning/papers/sbp_papers/integrated1/woodridge_intelligent_agents.pdf) that this conception of an agent - as an entity that can perceive, reason, and act - is considered a "weak notion" of agency. Stronger notions exist that explicitly model agents in terms of mentalistic concepts like beliefs, desires, and intentions.

What makes "agents" a special concept?

Isn't it just a computer programme at the end of the day?

Yes, it is a computer programme - but the key distinguishing feature is "autonomy". The AI agent is an entity that (to varying degrees) _thinks_ for itself, makes decisions on its own, and if it has the "tools" available to it, will continue acting on its own decisions until it achieves the goal we've given it.

Recent research agrees with this view. ["Exploring Large Language Model based Intelligent Agents"](https://arxiv.org/html/2401.03428v1) emphasises that the key aspect of agents is their autonomy to carry out tasks in diverse environments, using past experiences and knowledge . They can even modify their plans during execution.

This capability represents both tremendous potential and significant risk.

So, how does the agent do this? An AI agent has three primary components:

1. **Brain Module:** This encompasses natural language interaction, knowledge, memory, reasoning, planning, and transferability.
2. **Perception Module:** This handles textual, visual, auditory, and other input types.
3. **Action Module:** This includes textual output, tool use, and embodied action.

This diagram from ["The Rise and Potential of Large Language Model Based Agents: A Survey"](https://arxiv.org/abs/2309.07864) illustrates these core components and their sub-functions, showing how agents can think and act autonomously:

![Diagram of agent components showing perception, inputs; action, text, tools; and brain, memory knowledge, decision making.](/img/blog/ai-agent-components-diagram.png)

core components of an AI agent.

For this series, we'll focus on this "weaker" notion of agents. Rather than getting lost in discussions of human-like mental states, we'll examine agents from a software engineering perspective, particularly what this means for security vulnerabilities.

While there are complex aspects of agent architecture involving various types of memory, reasoning, and planning, we'll keep it high level for now. Part 3 of this series will provide a technical deep dive into the agent architecture.

## Why This Matters for Security Professionals

Before diving deeper into the series, it's worth understanding why agentic AI represents a paradigm shift for cybersecurity:

- **Expanded Attack Surface**: Agents interact with multiple systems, APIs, and data sources
- **Autonomous Decision Making**: Compromised agents can make harmful decisions without human oversight
- **Dynamic Behavior**: Agent actions aren't always predictable, making traditional security monitoring challenging
- **Cascading Effects**: A vulnerability in one agent component can impact entire connected systems

These characteristics require security professionals to think beyond traditional application security models.

## From Agents to Agentic Systems

In researching "Agentic AI," I discovered a confusing landscape of terms often used interchangeably, leading to misunderstandings about what exactly constitutes an Agentic system.

Among various perspectives, Anthropic's blog post ["Building effective agents"](https://www.anthropic.com/research/building-effective-agents) offers the clearest framework for understanding the relationship between agents and agentic systems.

Their customers often describe "AI agents" in two distinct ways:

1. Fully autonomous software operating independently
2. Workflows with "predefined code paths"

Anthropic classifies both as _Agentic Systems_ but makes a crucial architectural distinction:

- A "workflow" follows a predefined pathway with set tasks

![AI Workflow Diagram](/img/blog/ai-workflow-diagram.png)

workflow: prompt-chaining

- An "agent" operates with true autonomy

![AI Agent Autonomous Diagram](/img/blog/ai-agent-autonomous.png)

agent: autonomous

While both types of agentic systems have an LLM-based brain component at their core, true agents are distinguished by one key characteristic: autonomy.

This autonomy explains much of the hype around agents and why they often spark discussions about AGI/ASI. At its core, the agent architecture attempts to replicate human intelligence in AI form.

It is an entity designed to:

- Think and reason independently
- Plan and execute actions
- Monitor its environment for feedback
- Learn continuously
- Record experiences and lessons
- Operate without constant human oversight

## Why Agents Matter Now

The rise of AI agents represents a fundamental shift in how AI systems are being deployed and operated.

The industry recognises this transformation:

- [Deloitte](https://www2.deloitte.com/us/en/insights/industry/technology/technology-media-and-telecom-predictions/2025/autonomous-generative-ai-agents-still-under-development.html) predicts that by 2025, 25% of companies using generative AI will launch agentic AI pilots or proofs of concept, growing to 50% by 2027
- [Gartner](https://www.gartner.com/en/newsroom/press-releases/2024-10-21-gartner-identifies-the-top-10-strategic-technology-trends-for-2025) places agentic AI at the top of its strategic technology trends for 2025.

Major tech companies are already positioning themselves in this space. Microsoft's Copilot leads in enterprise adoption, while companies like OpenAI and HubSpot are heavily investing in agent architectures.

What makes this shift significant is the evolution from human-directed tools to autonomous agents. These agents can:

- Access and utilise tools independently
- Reason through complex situations
- Make and execute decisions
- Accomplish goals without human intervention

While Artificial General Intelligence (AGI) and Artificial Super Intelligence (ASI) remain distant goals, industry leaders like Sam Altman and Dario Amodei view agentic AI as an essential stepping-stone toward AGI. This makes understanding these systems crucial - not just for their immediate impact on technology and business, but for their role in what could be a historic breakthrough.

However, these new capabilities bring new risks. While agents can dramatically improve efficiency and automation, they also introduce novel attack vectors and security considerations that many organisations aren't prepared to address.

## What's Coming in This Series

This is the first in a four-part exploration of agentic AI security:

1. **Understanding AI Agents** (this post) - Foundational concepts and definitions
2. **Evolution and Security Shifts** - How AI system changes have altered the threat landscape
3. **Technical Deep Dive** - Vulnerabilities in agent architecture components
4. **Defense Strategies** - Practical security approaches and recommendations

Each post builds on the previous ones, providing both theoretical understanding and practical insights for security professionals working with these emerging technologies.

---

## Continue the Discussion

This post is part of an ongoing exploration of AI security challenges. If you're working with AI agents in your organization or have insights to share about agentic AI security, I'd love to hear about your experiences.

**Next up**: [Part 2: Evolution - Three Critical Shifts in the AI Security Landscape](/blog/2025/02/18/agentic-ai-part-2), where we'll examine how fundamental changes in AI systems have created new security paradigms.

*Have questions or thoughts on agentic AI security? Feel free to reach out via [LinkedIn](https://linkedin.com/in/ron-amosa) or [email](mailto:hello@theuncommon.ai).*

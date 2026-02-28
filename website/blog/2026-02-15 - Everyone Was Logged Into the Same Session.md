---
slug: everyone-was-logged-into-the-same-session
title: 'Everyone Was Logged Into the Same Session'
description: 'What building and debugging a production app with an AI co-pilot taught me about orchestrating intelligence and why knowing the fundamentals still matters.'
date: 2026-02-15
authors: [ron]
keywords:
  - AI pair programming
  - AI debugging
  - vibe coding
  - AI co-pilot
  - production deployment
  - orchestrating intelligence
tags:
  - AI-Systems-Infrastructure
  - ai-literacy
image: /img/blog/everyone-logged-into-header.png
reading_time: 3
word_count: 560
hide_table_of_contents: false
draft: false
---

![Everyone Was Logged Into the Same Session](/img/blog/everyone-logged-into-header.png)

Talofa reader,

The relationship with my tools is no longer "what was that hammer? Oh right, I just use you to smash nails. The end." It's a lot closer to what it would be like if I had an assistant who's brilliant—but has no memory of what we did at 2am.

We are a few years now since the explosion of ChatGPT, and despite the many hot takes about how good or bad AI is, I can only attest to my personal experience: it's been a 20x minimum boost in the projects I've been able to build, in less than half the time I would have estimated.

<!-- truncate -->

Just after the new year's break, I had a family reunion to attend. Samoan families are big, and for the most part I've only seen things organised on paper, in emails, with no consolidation for the family to use efficiently. I thought I'd help by contributing a digital family tree.

I know you've heard this before, but I was able to design, build, test and deploy a React application with a DynamoDB backend to a production environment using Amplify on AWS—complete with authentication via Google, security best practices, user and admin functionality for adding and updating family members, integrated to a GitHub repo with pull request approvals for tree updates before merging to main. Custom domain and all.

Now the end result, in my opinion, is nothing special. Truly. There are caveats to this experience. In a nutshell, AI gives everyone the opportunity to deliver what I built—but only if they also know what a well-architected, production-grade deployment looks like, and know how to get the AI to the end goal. If you know those things, what I did is going to be the floor for what's possible for you and your AI.

But what's more interesting to me isn't the build. It's the experience I'm having with my "co-pilot" as we build, deploy, test, try new things, and ultimately debug the curly situations we get ourselves into.

This is where people get stuck fast. They come out the gate vibe-coding their way to production, so the roadmap was already 98% guaranteed to fail. If they were lucky enough to get something working, the problem is: when anything breaks, or the AI gets caught in a debug loop getting more insane by the token—if you don't know how to troubleshoot, you're shit out of luck. The whole thing's such a convoluted mess that the "context" is now completely toxic.

Which brings me back to my family tree app.

After a late-night feature addition—an admin page to add family members to an allow list in DynamoDB—I came back in the morning to messages from family members saying they were all logged into the same session.

Yikes.

Long story short, me and Claude went through a series of troubleshooting missions. Hitting dead-ends. Adding configs. Deploying code updates. Reproducing the issue manually. Searching through CloudWatch log files for clues.

It was actually fun to run the gauntlet of debugging ideas with a co-engineer I could bounce ideas off—then get them to execute commands, syntax figured out and launched, catch the response and analyse it, all in seconds, so we could go again with another idea if that didn't work.

I really do think we're in the "orchestrating intelligence" era. As long as you know how this game is played, and you know your way around the field, these AI assistants are fast becoming your A-league team.

One thing I always do after a successful troubleshooting session: I get my AI to document the entire experience in a blog post. The AI has the conversation, the context, the timeline and results of our paired debugging session—so it can whip up a journal-style retelling in seconds.

This time I did something different. I asked the AI to reflect on the experience and document how it felt the process went—the good, the bad, and the "needs improvement." It was interesting to see how the AI assessed itself and our results.

To quote the AI:

> "The breakthrough came when the developer provided specific context: 'this only started happening AFTER the last big code change last night which was admin page adding new users.' That observation—correlating the bug with a specific action—was something I couldn't have known without being told."

It's not person-to-application anymore. Your AI holds context, remembers dead-ends, keeps the thread. It's closer to a teammate than a tool.

The question isn't whether AI can help you build. It's whether you know how to work with it when things go sideways.

thanks for reading

— Ron

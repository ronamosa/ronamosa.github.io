---
title: "The Pain and Reality of How Legacy Systems Prop Up and Hold Back Businesses."
tags: [working]
authors: [ronamosa]
---

To tell you the truth legacy systems have been the bane of my career. The technology is outdated, limited, often restricted by surrounding legacy systems and then vulnerable security-wise. Often in my role I'll be tasked with figuring out and delivering a re-configuring, upgrade, migration of old applications, using old software running on outdated operating systems.

What often makes it worse is that the system you're looking at won't have any internal documentation about how it was setup. No worries, I'll Google a manual or the vendors documentation. This usually turns out to be either non-existent, outdated, limited to the point of being completely useless, or the wrong i.e. the documentation doesn't line up with what you're running.

This is usually only the beginning of the challenges you face dealing with legacy systems.

So, why. Why is it like this?

<!--truncate-->

## Legacy Systems. Why?

I don't think any company deliberately set out to own and maintain old systems that are outdated and vulnerable to security compromises. But the reality is technology evolves and it evolves quickly. The software evolves faster than the underlying hardware and soon you're stretching the servers capabilities to run more demanding applications, and the cost of hardware is nothing to sneeze at so keeping in step with the software demands is just not practical.

Applications have been developed for the business and there are important clients that use these applications. All the while new applications are developed which bring in new clients.

Meanwhile the cost of upgrading the old applications, using old software running on old servers is sliding down the increasingly steep slope of diminishing returns and the project money, with the work hours costs pushes it further and further down a priority and feasibility list.

But we can't axe it. There are important clients that still need these applications. Important enough not to lose, but not big budget enough to facilitate a move to an upgraded platform or solution.

And so begins the path to legacy systems and their pain.

## Legacy Systems need Legacy Skills

Legacy systems are old, the tech's old, the methods are old, and they need some old heads who actually understand how these used to work back in the day.

Good luck with that.

With the tech world evolving as fast as it is, tech workers are trying to keep up with the new world and there's little time and demand for keeping knowledge of old systems in your head.

When a client needs something changed, or upgraded, or queried on this old system, it makes it really difficult when the last person who touched it or worked on it left the company 15 years ago. If it's an old codebase and language, now you're trying to get a java developer to rewire his brain for a language and coding style from the 1990's.

Where are you going to get these skills and this knowledge? And what's the opportunity cost to the business investing salary and headcount to cover this legacy system vs working on the current and future systems?

## Security, Maintenance and Stability

Legacy systems can be a vulnerability. Sure this can be mitigated at different layers e.g. Network Intrusion Detection Systems (NIDS), OS hardening and other security appliances. But if the system can't be updated, upgraded or migrated, means its a ticking timebomb.

Often times when it comes to maintenance, legacy systems may fall by the wayside and the operations is only aware of it when it breaks and sets of an alarm or when a project comes through and its glaringly obvious the system has been neglected on various levels. For example, its missing patches, the documentation doesn't exist, is out of date and is wrong.

And the other issue often seen with legacy systems is stability. Sure, there's a bunch of banking software that runs on some mainframes that haven't fallen over since they were turned on in 1978 so they're pretty stable. But the rest of us have overly complicated medium-sized ad-hoc legacy systems which now need a script to restart it every 28 hours and/or we just ignore the monitoring alarms because we know that even though the system is throwing an error, its still running OK and there's nothing we can do about the error anyway. Upgrade to newer version? lol. Sure.

## Legacy Change/Release Systems

When dotting the i's and crossing the t's comes at the expense of delivering critical or emergency fixes to a system, I think you have a big problem.

If you've worked in big corporations you'll know some teams can hold the whole department to ransom for not sending the correct notification email or separating out an issue into multiple tickets according to the letter of the (usually only verbally cited) law.

I guess this is the argument made for everything going Agile. Because the bureaucracy of the change/release process was bottlenecking if not completely holding up productivity. These outdated modes of change and release management go hand in hand with legacy systems because that's how they're managed. There is no CI/CD pipeline for these systems so the human interaction is dotted throughout the process.

So waiting for someone to read their emails and get the notification in order to deploy and/or test something so we can move onto the next phase - of waiting for someone to do something - is very real in the field and exists in today's CI/CD world.

This stuff costs time and frustration, and lends to the weight and stress of the already difficult task of figuring out the legacy system.

## The Legacy Systems Perfect Storm

Now, this section isn't really imparting any wisdom and knowledge of legacy systems, other than sharing the experience I've had with legacy systems in my career.

Imagine taking everything I've mentioned in this post so far - the system is old, its outdated, it's badly documented (if at all), and now I have to figure out how to either fix it because its broken, or make it do something it hasn't done before. The limitations that immediately arrive are that nothing can be upgraded, the only working instance is in a higher environment (i.e. not dev or test) which is governed by change & release management so every "attempt" at figuring this out through trial & error is getting micro-managed down to the wire. It takes 2-3 hours per request to get anything done and then you have a small window in which to figure it all out, write up all the required steps (in detail) to deploy it, and then hope the higher up environments are what the internal documentation says they are.

Because a lot of times they aren't. And then the perfectly working model of a change you figured out in a lower environment is pretty much useless and you're figuring it out on the fly again and battling the reasons for this with the release management process.

## Conclusions

When you read over the impact of dealing with legacy systems there's not a lot of upside to them. They're a necessary evil given the context in which they exist. But the toll they take on the business due to stability, supportability, and maintainability through the man hours consumed operating and changing the system, I think, is a huge silent cost. Like having a leak at your house. You think everything's okay and then get the watercare bill and its huge. There's a cost to everything. Legacy systems might be the exodus of burned out employees and difficulty attracting young talent who aren't interested spending their lives on such systems.  

---
title: "The Pros, Cons and WTF of Life as a DevOps Engineer"
author: Ron Amosa
author_title: Platform Security Engineer @ Salesforce U.S.
author_url: https://github.com/ronamosa
author_image_url: https://github.com/ronamosa.png
tags: [career, devops]
---

With all this crazy technology around working as a devops engineer it's easy to get caught up designing and building something really complex that does a lot of stuff.

Sometimes it's the demands of the job that means you created something that did one thing. Added something else to it. And before you knew it, the "thing" has become a complicated behemoth that's now critical to the operation of the company (true story, I've seen "hacks" become 'the infrastructure').

<!--truncate-->

No matter how we get there, complicated solutions in my experience are a) a lot of times a necessary evil and b) a lot of times not necessary at all. And rarely a good idea.

They're okay in a pinch. But I can probably count on one hand the number of times a "tactical" or temporary solution ended being _the_ solution.

In this post I'm going to talk about what drives some of these outcomes we see trying to be delivered. What some of the red flags that could have been seen along the way. And what can be done to make things better for next time.

## Project Team Dreams

The project space is a special kind of monster in the I.T. arena. Wedged somewhere between a 'business owner' and the operations team, the Project Teams are driven by a particular set of outcomes.

A project starts its life when an idea, system, product etc has been 'sold' to the company as either a cost cutting, income-generating or strategic imperative (in a nutshell). basically, someone thinks somethings going to be good for the company, and want a project built around this that involves time and resources spent to deliver it.

Now the main pressure on projects is to deliver whatever has been 'sold' upstairs. And not just any kind of delivery. These deliveries must be "on time" and "under budget".

When you have a lot of moving parts in a project - development and dev teams, testing and test teams, limited infrastructure, operational requirements, staff resourcing, skill resourcing, change/release/incident management, change of scope, 3rd party vendor agreements and conditions (the list goes on) - delivering top quality best practice work, "on time" and "under budget" can be a serious stretch bordering on impossible.

This is the environment that gives way to complicated solutions being implemented and 'long term thinking' type solutions on the planning room floor.

## Why you dont leave DevOps Engineers unattended

The following real-life example best illustrates the kind of scenario that's common in this space:

A DevOps engineer was building a continuous delivery pipeline for different teams of developers. This would enable them to manage their own Infrastructure as Code (IaC). Give them continuous integration and deployment abilities and basically make their lives easier.

The engineer had built a whole system of build and deployment scripts and jenkins jobs. Docker images, containers, all manner of systems integration and source control workflows. A lot of work had been done. And it was all great.

Until a meeting which was giving an overview on a similar project slowly revealed, one by one, the gaps, flaws and bad practices in the Engineers CD pipeline. This was all now baked into a system that had taken a couple of years to build.

How did this happen?

## The Lone Ranger

One of the first things I realised during a long discussion at this fateful meeting was this guy was doing this all on his own.

The company had been so busy with its usual business and attending to clients, and keeping the lights on, that it had left something as important as figuring out how to align all their development teams into a continuous and agile workflow, to one person.

### Bad Practice by Default

When asked by a lead developer (let's call him Joe) why some commands were being used in a deployment job, the DevOps engineer (we'll call him Bob)  said "this was a job they were already using, and I asked them if this was okay, and they didn't know". And in it went.

Joe identified that the command and the practice being implemented here was very very, not good.

With no-one to help Bob out, he's got no way of knowing, and no time to wait around, to figure out if the deployment should be implemented like this. It works for them, so in it goes.

### Communication in key in Projects

When Joe insisted that the other developers should have known better, Bob said they didn't and need a senior developer to communicate this "best practice" out.

Lack of communication is a killer in most relationships. Between work colleagues and teams at work is no different. The lack of communication here meant one development team was doing best practice, and keeping it to themselves. But when the bad practice gets into the pipeline, it harms everyone.

### Who's Role is it anyway?

A back and forth went down in the meeting as developer vs infrastructure vs management argued who should be initiating and reviewing changes to the pipeline.

I'm guessing that workloads and pressure to deliver their own work was a cause of some people to push responsibility away. And this lack of ownership mean initiatives from the ones holding the knowledge left big gaps in the team.

### Complexity Eats Time

Given the lack of help, the multiple teams and projects complete with their own version of bad practice being migrated to the pipeline, its quick to see how things can get complicated fast.

Poor Bob was trying to build things for people to use. To take in as much info and feedback as he could to deliver all the things, and still ends up with a super-complex monster. This complexity monster is hard to follow, which consumes time learning the intricicies of the system, and then to troubleshoot it when it doesn't work.... forget about it.

## Ways to Improve

Sometimes (a lot of times) this stuff is just common sense. And by common sense, I mean within the context you're trying to make sense of. In this post we're looking at the project space. Understanding the drivers - for good or bad - that create the outcomes you see at work is key.

So, what did we learn?

- **projects are under pressure to deliver "on time" and "under budget"** - this means its not always going to be best practice or even the best solution. Just the 'best solution' given the circumstances
- **no one-man bands** - they say two heads are better than one, and if those other heads are people with the knowledge and experience to help steer your efforts for the better, than there's reason no (good) reason to try going it alone.
- **communication is key** - this ones pretty generic, but is cliche for a reason - everyone still sucks at it. you don't need an increase in meetings, just an increase in dialogue. if in doubt, ask questions.
- **take ownership of yours only** - thought this was important on two fronts 1) take ownership of what's yours so there's no doubt where something is, for yourself and your team and 2) don't take ownership of something that someone else should - you burden yourself and commit resources to it better spent elsewhere.
- **keep it simple silly** - if its starting to get unnecessarily complicated, stop and have a think if there's something, or someone, missing from the equation which would help simplify things.

## Conclusion

All these scenarios working as a DevOps Engineer in Project Delivery are not the end of the world, or illustrate "bad" people, just people who are working in a particular context and the challenges they face; the outcomes they sometimes arrive at and the things that can be done to improve things for everyone.

---
title: "The Project Delivery Space and the People That Make and Break It - Pt. 2"
author: Ron Amosa
author_title: Platform Security Engineer @ Salesforce U.S.
author_url: https://github.com/ronamosa
author_image_url: https://github.com/ronamosa.png
tags: [working]
---

Projects have a lot of moving parts. This definitely includes the technology landscape (understatement of the year), but also a big human resource factor as well. I think if you've followed any of my writing and experiences you'll know that "people" are (always) often the big under-estimated factor in my whole I.T. career - but that's probably a post for another time.

<!--truncate-->

There's a lot that can go wrong in delivering a project, most of the time it's not one **big** thing, but a series of small things that snowball into a massive stressor near the delivery end of the project.

The "left to right" view of the software development life cycle [(SDLC)](https://raygun.com/blog/software-development-life-cycle/) means, from left to right you are 'coding/developing', 'building', quality testing, securing and finally into production.

Before this even kicks off you'll have a requirements gathering phrase and then some solution will be designed. This is an important part of the project, and often this is where the problems start. Requirements will be missed and this feeds into a design which will have big gaps in it.

## Start as You Mean to Proceed

Requirements missed, in my experience tends to have a human factor. Namely, when projects fail to identify who needs to be consulted or who all the stakeholders are, you're going to have gaps. And it's not like an election where if you weren't there to vote it's "too bad you miss out", because the stakeholder's legitimate requirements means the project is held up from going live until that unknown requirement is satisfied.

That's great if it's not a big one and it's resolved with little impact (e.g. a procedure documented, or a form signed off). But what if it's a software stack, or version of Operating System _after_ the application has been developed and the infrastructure stood up and almost completed UAT, and now you have to rewrite a bunch of code, get them running on completely different virtual machines and you have to get to the back of the test environment scheduling line that will only be available in 3 weeks time?

Things get more stressful and more expensive the further "right" you're finding and fixing these things. The stress comes as you run into the more "change managed" areas of the operation i.e. getting approval for making changes to the nonprod environments which needs more documentation and management sign-offs, as opposed to just changing it yourself in the development environment getting on with it.

:::note

_This isn't a commentary on the Change/Release Management side of the business - those things are important and there for a reason. This is just the reality of when a project finds something they missed in the 11th hour, all of a sudden these well-meaning processes and procedures look like overly bureaucratic red-tape holding up the show!._

:::

The ["shift left"](https://www.bmc.com/blogs/what-is-shift-left-shift-left-testing-explained/) principle wasn't something I knew about when I first started in the Project Delivery space. But it was something I definitely felt and understood through pure experience after a few project cycles.

## Project DIY

As the DevOps-before-devops-was-a-thing Engineer, I didn't really have the luxury of saying "well, the Architects didn't give me a detailed design, so I don't know what I'm supposed to be connecting up over here.". Well I did, but that didn't really solve anything.

To get myself "unstuck", I would do the detailed designs myself (detailed design = basically the big architectural design of big empty boxes and lines, but I would fill in the specific network details, server and environment details and directional flows.) and then implement what I needed to based on this design.

Where I needed to, I would go and confirm things with people - architects, developers, project managers, operations team - to make sure I was heading in the right direction. Most of the time these people hadn't considered a lot of these things (why would they?) so I had to approach it in a way that they could understand what I was after and confirm, or set me straight if I was off-base.

Big lesson learned here - doing things for yourself. When you're new in the game, its a great way to learn areas outside of your main job responsibilities (but don't do it for too long for free if you can help it; this is free value you're giving the company for no good reason after the 'learning' value diminishes.)

But they haven't all been done poorly (most, but not all). So I need to acknowledge that.

## The Good Ones

I've been in good project teams as well. The best ones are the ones with good strong leadership - not management - leadership. The difference in my opinion, is a leader has a vision for their team, and works together with the team to deliver everyone to the promised land i.e. "go live", together.

They're accountable to not only the business, but to the team they're leading by having good consistent communication with the team, checking everyone's workload and seeing if they can fix any blockers. They check in when you've been stuck on a hairy tech situation to see if they can get anyone else to help, or really try to understand the nuance of the blocker so they can relay this (sell it) to the business to buy more time, or get us to pivot to advance our goal.

These projects leave a good feeling in you that you've done some good work with really genuine and inspiring personality's. It shows you what's possible when the project stars are aligned.

## Please, Don't Do This

I was on a project once that called an emergency meeting. At the time I was across several high priority projects and my availability to each, because of the other, was threatening all the delivery times.

I had 3 different projects managers trying to bribe more of my time for their project, and impressing upon me the importance of their project.
And to each of them I would say

>"I only have so much time in the week I can work"

(it was upwards of 50+ hours consistently for months)

>"you guys need to make a priority call".

I had tried, unsuccessfully, to get someone at the portfolio level to make a priority call. But the 3 projects were from 3 portfolio's, so that was another stalemate, just at a higher level.

So I'm called into this meeting. And after trying to explain to the group gathered there about how time works, and how I'm one person, not three - one of "the business" types thought it would be an effective tactic to tell me, the nobody engineer just working on one of many, many projects, that I was _personally_ responsible for any money the company would not make because the 3 projects were delayed.

I recall he described it as "100s of thousands a month!" that _I_ was going to cost the company because of the delays.

Not the

* lousy project management, co-ordination or communication and planning
* lack of design that had to be made up for by people who's job it _wasn't_ to design things
* testing environment instability causing delays
* lack of upper management making any priority calls OR
* failure of the company to hire adequate human resources

No, this genius must have assumed everything in project-land had been going along like clockwork, and I must have been slacking around holding things up.

If you're ever in this numbnuts position, at a meeting like this trying to figure out how to make things go faster - **dont do this**.

## Conclusion

I wish I could say my experience in project delivery has been on more "good" projects than "done poorly", but I can't. And that's not to say that everyone's crap at projects and doesn't know what they're doing. I think it would be fair to say that project delivery is hard, and there are a loooot of moving pieces, from not only technology and the human resource equation factors heavily into it as well as the company culture and dynamic. I've been to a place where the project's have been done well (s/o Scott Gambling and Dan Simeon at IAG), so I know it's possible.

Just a matter of getting all the pieces and players to play together well.

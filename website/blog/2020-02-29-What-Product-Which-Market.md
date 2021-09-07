---
title: "Thinking About Market Validation During the Slow Code Weeks."
author: Ron Amosa
author_title: Platform Security Engineer @ Salesforce U.S.
author_url: https://github.com/ronamosa
author_image_url: https://github.com/ronamosa.png
tags: []
---

It's been a busy work at work, but definitely a grind to make progress on the infrastructure code this week. And the balancing act between work and the side hustle has cost me a bit of sleep. Nothing I'm not already used to being a career computer geek - staying up late trying to make something work, or playing with some new tech, or surfing tech twitter is standard operating procedure.

<!--truncate-->

The code has been slow this week because after getting my infrastructure up to a point where I'm standing everything up and the services are deployed and working, I've been unhappy with the way the infrastructure is designed (by me obviously, so I'm unhappy with my own work). Basically, my terraform code is not modular, so in its current form it kind of locks you into only building _one_ type of infrastructure pattern. What this means is, if I get a brilliant idea to re-organize a component of the infrastructure, it'll be harder to move things around without a lot of rewriting.

>What does this really mean?

It means I'm rewriting a lot of code to provide more flexibility to the infrastructure patterns I can build in future.

While this has been a bit of a slog this week, I've been thinking about and listening to podcasts around market validation and marketing in general.

I've learned a bit listening to the [IndieHackers Podcast](https://www.indiehackers.com/podcast) episodes in the car on the way to work.

## IndieHackers and Podcasts

IndieHackers if you're not familiar, by their own definition is a:

>1. person building an online project that can generate revenue
>2. person seeking financial independence, creative freedom, and the ability to work on their own schedule

I've been listening to their podcast for a month or so now and just joined their online community a couple weeks ago. It's a pretty cool community of like-minded people all finding their way from side-project to something they can move to full-time in due course.

But anyway, while I'm working my way through code for my MVP, I'm trying to school myself up on the many other aspects of building a side business. The part I'm trying to figure out while working on the code, is what market I'm in. Who will be my first customers? How do I even find those?

[One episode](https://www.indiehackers.com/podcast/112-tommy-griffith-of-clickminded) I listened to recently had an interesting take on starting out into the market they eventually went with. A company called [ClickMinded](https://www.clickminded.com/) teaches people how to do SEO properly. Not an outrageously original idea, but the founder [Tommy Griffith](https://twitter.com/TommyGriffith) had a pretty original take on starting out finding his first customers.

He recommended hosting a [Meetup.com](https://www.meetup.com/) where he would teach his SEO course. People would come and take his course, he would build his mailing list immediately (blog post for another time on importance of mailing lists), get quick and valuable feedback on his product (the SEO course), and build from there.

This (to me at least) is genius.

So simple, so very practical and very accessible i.e. ANYONE can host a meetup group. So I'm thinking up what Meetup group I can host to teach something people would pay to learn. I know kubernetes and cloud is big in the technology landscape right now, and I've been told I'm a good teacher, so this is definitely something I'm going to look into.

## Founders Among Us

That's what has been on my mind a bit this week in between working on this side project, moving house, bjj training and working a full-time contract at a major bank.

I asked a colleague of mine recently about his experience and success in the startup world, starting and growing a business he eventually went to full time before selling it.

I wanted to know how he got started even making the thing that he made and how he knew anybody would pay for it i.e. his first customers.

He told me the company he worked for had clients that he provided the company services for, but the clients would routinely voice their desire to have a particular bit of tech that would make their lives easier. My colleague being a developer, they asked if he could build such a thing, and he did. And sold them a subscription to use this new tech.

This was an awesome story to me for a couple of reasons. Firstly, my colleague is part Maori, so that's a cool win for brown geeks everywhere. Secondly, that a few key boxes were ticked in this perfect storm of getting a successful venture off the ground. My colleague was a trusted advisor to a paying client, who communicated a pain point directly and specifically to him, and was willing to pay for it on delivery. You solve a real-world problem for someone who has asked you because they trust you.

That's pretty dope.

## Dont be sh!t but don't be SLOW

While listening to all these successful founders on podcasts, I always hear about going to market as quick as possible - get the feedback, don't waste time polishing something that the market ends up not caring about.

But a few founders will be like, no, spend a bit of time to get a good standard of product before going out there. And I agree with both. I can be a bit pedantic and get lost in making the tech hum for the sake of things running nicely, at the cost of building a cool but completely useless-to-everyone-else product.

So between making a crappy product quickly and getting it out there for feedback, and spending way too long polishing a possible DUD of a product.

I'm going to do neither.

Instead, I'm going to spend a little time making a good solid MVP. It's still Minimum so I'm not spending more time than is _necessary_ to get out to potential customers, to get the valuable feedback on it.

But also, I'm keen to try out this Meetup.com idea of [Tommy Griffith](https://twitter.com/TommyGriffith) and see the market up close.

Until next week, if you've read this far, I'm keen to hear your thoughts on a meetup group, or how you would try to validate a market for a product idea!


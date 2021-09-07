---
title: "When Starting Out and in Doubt About What You Should Do? Do What You Know."
author: Ron Amosa
author_title: Platform Security Engineer @ Salesforce U.S.
author_url: https://github.com/ronamosa
author_image_url: https://github.com/ronamosa.png
tags: [personal]
---

I've been doing infrastructure in some way for a while now. I started with Linux System Administration, web servers, setting up routers, switches and how the network is setup to feed all devices that live there. Working on cloud infrastructure itself is relatively new for me but then again, its the same thing...

what's the saying?

> "Cloud is just someone else's servers."

<!--truncate-->

## Start with Infrastructure

_What do I know how to build?_

Infrastructure. Maybe I'll start with building that.

>But who would want this?

Completely valid question if you're going to go for something, especially if you want to make a living from it, you're going to need customers.

In my contracting world, I solve infrastructure problems for companies trying to move into the new distributed systems world of cloud infrastructure.

But I'm working with constraints and limitations like existing infrastructure and all the tech debt that comes with it. This makes it hard to put something new in place that would disrupt that. Not impossible, but you would have to convince a lot of people higher up to expend the effort and resources to make it happen.

So, what if I were free to build things best practice, and the people who needed these infrastructures, would fit INTO these models, rather than trying to break these best-practice models apart to work for their not-so-great designs and setups?

That sounds like a good place to start.

## 10,000 hours

If you've read the book ["Outliers"](https://en.wikipedia.org/wiki/Outliers_%28book%29) by Malcolm Gladwell, you would have come across this theory that it takes about 10,000 hours of practice to "master" something.

Even if the author of the study this claim was based on, [spoke out against this over-simplification](https://web.archive.org/web/20190320062202/https://radicalscholarship.wordpress.com/2014/11/03/guest-post-the-danger-of-delegating-education-to-journalists-k-anders-ericsson/), let's just sum it up as:

> "the thing you do a lot of, you're going to know more about, or be good at doing it."

Basically **"Do what you know".**

I know it makes perfect sense, but you'd be surprised at what people jump into instead of the thing that's right in front of them.

When you do what you know

1. You already know how to do it
2. You're more likely to know your audience, what those pain points are.

I've been building things in my own subscriptions in Google Cloud and Azure providers for a few years now. Mostly to learn and gain hands-on experience so I know how things are built personally. I also build the same kinds of things for companies as a full-time gig contracting, so I think I've amassed a good amount of time doing this building cloud infrastructure thing (_10,000 hours?_ maybe).

So it makes sense I would look at building cloud infrastructure.

## MVP: Get something working

My first port of call is to get _something_ working.

I'm not a developer (even if a few of my developer friends argue that I am) so I don't have an application to show off. The thing I would build, needs an application, to show the _**infrastructure**_ off.

Hmmm. I got myself a few demo micro-services which I am fitting into my infrastructure builds, to (eventually) show off what the infrastructure can do.

I've also got myself a [Trello](https://trello.com/) board going, and have created User Stories like a good Business Analyst for all the parts of the MVP I'm trying to build. This will help me stay on track (hopefully), and not get side-tracked with things that don't help me reach my MVP goal.

Staying on track, and possibly not losing interest or motivation for finishing the project will probably be my biggest issues to be honest.

## Market. Validation

While I'm coding and testing away, I'm actively thinking about and trying to research other aspects of working on a side project.

Things I have to really think about, even before I've finishd the MVP include:

* _Who is the market for my project exactly?_
* _What value does my project bring?_
* _Would anyone care enough to pay you to build this for them?_

But while all that marketing, sales etc is super important (and I agree it is important), I don't actually have ANYTHING other than a half built infrastructure model.

So I think for now, I'm going to finish that and getting it up and running first.

Key warnings or cautions I hear, on podcasts, or reading from more experienced entrepreneurs (or "indie hackers", as I've come to know them in the community):

* Building something nobody wants
* Not finding out first if people actually need it before building it
* Trying to make the MVP "perfect" rather than getting it into users hands fast to get valuable feedback if its something they actually want

All of these equal wasting a lot of time and ending up with no product the market even wants.

So, I continue to build my MVP: A working infrastructure with a small set of features demonstrating what it can do, and then start shopping it around using a landing page with maybe a working demo?

## work smarter, as well as harder

I have to be careful when working with cloud infrastructure, and having a bunch of it hanging around running. Because clouds cost money and companies often underestimate the cost of going cloud.

_Maybe when someone requests a demo, they can initiate it themselves and get a notification when its ready to login and try out? Maybe tack on a feedback form they can answer when they're finished with the demo?_

_hmm... they could even spin it up themselves if I build something for them to be able to press "build"... and it notifies them when its up & running... and then when they logout, it will terraform destroy it... wow, that would be pretty cool way of having on-demand demos!_

_Oh, even cooler, is have some kind of timer on the user login, so from login, they get 20mins of use time before the infrastructure automatically shuts itself down!_

And this is why I have a trello board, and have to do my best to keep it in front of me so I get the MVP done as quickly as possible without these "cool idea" distractions :)

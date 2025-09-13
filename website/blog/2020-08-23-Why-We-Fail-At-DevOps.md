---
title: "Why You and Your Company Are Failing at DevOps."
tags: [career, working, devops]
authors: [ronamosa]
---


I recently started mentoring a young junior developer who wanted to learn about DevOps and Cloud Infrastructure Engineering.I heard the saying "teach once, learn twice" where in teaching something, you learn the subject better yourself once from my martial arts teaching long ago, and I agree.

The mentoring experience gave me an opportunity to dive into and examine what DevOps is, how it's supposed to be used and more importantly in my opinion, how and why it fails out in the real world.

<!--truncate-->

## What is DevOps

You've probably read enough definitions of DevOps to last you a lifetime, here's the official [wiki definition](https://en.wikipedia.org/wiki/DevOps) so for the sake of this post, DevOps is:

* a set of principles & practices
* that brings Dev and Ops together
* in the pursuit of faster development time
* to combine continous delivery
* with high quality software

Now I'm going to paraphrase a bunch of DevOps knowledge I have in saying, DevOps is a way of thinking about how we should be working i.e. that we shouldn't be siloed; that all teams are part of a big collaborative effort of delivering software for the company's customers. That to speed things up we should be working in patterns and designs that make builds and tests and deployments faster, more automatable; that we should share knowledge between different teams to help and reap the benefits of that knowledge and those skills.

## How is DevOps done?

Agile. The end.

Obviously I'm sure there may be other answers, but if the early ideas of DevOps came from the 'Agile Systems Administration' movement and were seeded in the idea of "agile infrastructure" or "agile operations", then we can't really think about DevOps without thinking Agile methodology.

A great way I've heard it described which sums it up nicely for me is:

>"DevOps is the culture, Agile is the method"

Now that we've got Agile in the frame, what principles can we look at when looking to make our teams and workflows "DevOps"?

(to save me re-writing everything, here are the note I gave my mentee)

1. **Iterative** = things are done in iterations e.g. in sprints, you'll work on ONE story through development, to deploying, testing, bug fixing
2. **Incremental** =  small changes at a time, you can increment, test, verify, detect bugs and move quickly through your work.
3. **Continuous** = iterative + incremental helps achieve continuous integration (cos the changes are small you can integrate frequently). And continuous integration leads to continuous delivery because the code is either quickly integrated and working, or bugfixed and recycled through CI, until its deliverable.
4. **Automated** = everything that can be automated, should be. automated builds, deployments and tests. Nothing should be done manually.
5. **Self-service** = developers ability to provision their own infrastructure, deploy applications or configs themselves into their environments.
6. **Collaborative** = working together in as ONE big cross-functional team, sharing knowledge and responsibilities for the product.
7. **Holistic** = looking at things as a WHOLE i.e. we are a product team not a project team - a project team's work is done when the product has gone live - a product team's work is not done until the product is retired from production.

There's a lot there to digest and the point of this post isn't to give a deep analysis of the Agile methods that enable successful DevOps outcomes at your workplace.

It's to look at these principles and goals and understand what these are; why they are important and then ask yourself is your team really living these principles? Are you and your team really doing these things or heading to where this promise land is?

## Where we fail at DevOps

This isn't a definitive explanation of the failings in companies of adopting a good DevOps culture, but here are probably the key areas, in my opinion, of the big pieces failing our teams.

I think the primary failure in companies achieving DevOps is Education (in society as in companies haha).

A _**lot**_ of technical people don't fully understand Agile methodology and DevOps principles and that's not surprising because where would they learn it? And I don't mean just knowing the buzzwords, but being able to demonstrate what are the benefits and risks of doing a, b and c?

>_We're all self taught, duh!_

Great, so now we have 20 people following 20 different definitions and training material all implementing things in 80 different ways. Sounds efficient.

How do you expect quality staff from a pool of poorly trained and supported people? Sorting this out would be a massive step in the right direction.

>_But you're IT professionals!_

Sure, we are more than capable of up-skilling and being responsible for our quality of work- but what are you going to gamble, as a company, of letting the "standard" of your workforce training to be and ad-hoc and unknown quantity and quality?

Sounds like a massive business risk to me. And I see it play out in the workplace in a lack of cohesion in work practices and understanding of how systems work and should be used to solve problems.

I think everything stems from this macro lack of knowledge on the methodology and the point of doing things like incremental changes, automate as much as possible, code reviews.

For example if you don't understand why we parameterise variables in our infrastructure-as-code you're going to impact the easy of managing consistent, repeatable infrastructure without duplicating code and risking configuration sprawl. There is a knock-on effect from this initial lack of knowledge that results in tech debt and inefficiences, possible security risks and operational overheads.

:::info Disclaimer
**Disclaimer**: its perfectly fine to make choices that end up compromising or violating Agile/DevOps principles, but the key here is that you know what you're making the choices between. Informed decision making always.
:::

Education informs Design; Design impacts Architecture and Systems, which affects Operations which follows on through to the customer (BAU, performance, availability, speed of improved features delivered etc) . This includes the business who are aware of what the cost-benefit is of investing time & money into creating the systems that come out of this new DevOps knowledge. And will then go on to facilitate delivering the promise of DevOps and Agile in the company.

## Why we fail at DevOps

I remember back in the day, and across several technical roles there would always be this "us" vs "them" culture not just between technology teams (dba vs linux sysads vs windows sysads vs helpdesk), but between technology and sales, or technology and "the business".

Which when you think about this, its crazy.

"Anything" vs "Anything" at the **same damn company** is crazy talk. But this was my experience, across workplaces, even across geographies (NZ, UK, same same).

And before we even drill down into the use of source control, or test coverage or CICD pipeline. Before even talking about "we should collaborate and share knowledge", I think the biggest thing to get right, mentally, and from a place of understanding (not fear) is the following:

If we don't work together across all the teams, to do the best work possible, in the most efficient way possible, the company loses money and jobs will be lost. If they company loses money, they will have to let people go _(obviously there's another argument in here about profit & greed, executive incompetence etc but another post for another time)_.

That's how business works. We all work for this same business.

It doesn't care that the Platform team didn't provide your access fast enough, or the Database team took too long configuring a DB or that the Ops team wouldn't give you root on a box.

We are all in the same boat. We work together cos we're in this together- literally, economically, financially etc.

It's long been explained that "DevOps is culture". So the culture of working together for all the "nice things" (CICD, test coverage, Continuous Deployment) should be underpinned by the realities of working together- so we "win" i.e. the company does well and we all keep getting paid.

We're failing at DevOps because our culture is wrong, and it shows in the outcomes- not the reports, or the number of retros, or action items in flight, but in the actual way real people are working (or should I say not working) together.

## Conclusion

In this essay..haha joking.

But to summarize what I think I've written here (there are no professional editors involved here its just me, drafting a lot of thoughts):

DevOps, bourne of Agile thinking, is a set of principles and practices which codify a "culture" of a way of working, and Agile is the way this get done. We've looked at the principles that help achieve DevOpsness (I'm coining that phrase); The lack of education around DevOps and Agile that shows us where companies are failing their teams; and ultimately the macro reason why we fail at DevOps- that we fail to really internalize that we are all in the same team. For better, or worse.

## References

:::info

* [Operations: The New Secret Sauce](http://radar.oreilly.com/2006/07/operations-the-new-secret-sauc.html)
* ['What is Devops' by the agile admin](https://theagileadmin.com/what-is-devops/)

:::

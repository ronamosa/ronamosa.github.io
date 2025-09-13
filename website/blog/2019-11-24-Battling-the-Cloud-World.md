---
title: "The True Cloud Revolution and How Its Disrupting the Whole Organization."
tags: [cloud]
authors: [ronamosa]
---

I'm not 100% sure "Where I was when cloud became a thing", but I clearly remember life before cloud and life as it is now. It's a cloud world. And we're all just trying to figure out what that means for most of us and the companies we work for.

I never worked in a data centre, and had to contend with installing rack mounted servers. Build and configure them, patch them into the network and get them the all clear to be used by whichever company had ordered them. I mean, I did this on my home lab with ex-lease rack mounted serversto learn etc.

<!--truncate-->

But my point is, while I was never on the installation side, I would usually be on the operations side and having to order servers to be provisioned by a vendor would take week(s) - if we were lucky. Mess that purchase order up, and it's more time waiting, or you're stuck trying to get the most of out what you've got.

### Infrastructure on Demand 1.0

I know there was a virtualization phase in between these two points, VMWare [ESXi](https://en.wikipedia.org/wiki/VMware_ESXi) setup somewhere you operations could create VM's on demand -- and by demand I mean another process of ordering which needed to be read and approved by someone etc. which also took time and hassle, and sometimes even as long as ordering a new physical server.

### Infrastructure on Demand (For Real for Real)

With cloud providers this "asking" for more compute, storage or network resource is a question you'll only be asking the Finance department i.e. what's our budget for the cloud? Because in my experience, other than bad design, upskilling needs, bad management and/or security policies and an unrealistic budget - you don't have anything to stop you building, testing and delivering anything you wanted to, in the cloud.

In a super-oversimplified view - if you wanted more VM's, you would deploy some ["ClickOps"](https://m.subbu.org/clickops-3cf0e5bc5ecf) and have a new VM, any size, shape, speed, location you wanted. And it would be available in minutes. A network load balancer in front of your application? Done. Do it yourself. A new PostgreSQL database with all the bells & whistles? Help yourself.

If you wanted to optimize this budget-burner.. I mean automate this cloud provisioning, you would write some [Terraform](https://www.terraform.io/), or [CloudFormation](https://aws.amazon.com/cloudformation/), execute that code (along with your 'DevOps Engineer' credentials) and you can stand up infrastructure of all stripes and colours.

## Infrastructure Is Only the Beginning

When we realised we could spin up things easily in the cloud, we realised we could build the development, testing and operating environments of our dreams. We realised we could move with _speed_, that new development methodologies could be realised now that the resource "barriers to realising" had come down.

Now we were talking Agile, Continuous Delivery, Automated testing, Canary and Blue/Green Deployments, Feature Toggles... the language suddenly blows up and all worlds of new tech and stacks blown wide open.

> Yes, a little bit dramatic with the language, but this was what it was like once the door to "build everything yourself" was opened.

It truly is a magical time. So what's the problem? Everything has a string, or fine print, or a catch...

## Silos vs DevOps

Well, the catch is the same catch as has been every other technological breakthrough...

> _"Technology is a tool in aid of the solution. It is **not** the solution."
> [signed, all these other articles](https://www.google.com/search?client=firefox-b-d&q=technology+is+a+tool+not+a+solution)_

One analogy that comes to mind which lines up this "old vs new" paradigm is monolith's vs [microservices](https://en.wikipedia.org/wiki/Microservices). Where once the development and operation of running the application was one huge project that took months or years to roll out new features and fixes - the new way meant decoupling dependencies, optimizing and upgrading components and using and reusing these components as 'services' to future applications.

_(Okay, it's not a "great" analogy, but I think it paints a bit of a picture.)_

Moving to the cloud means a change in thinking. It's developers thinking about what kind of infrastructure they need, how it performs for them, and taking more of a role in what that looks like. It's operations thinking about infrastructure as code and how to build things in an automated way to take advantage of the fact resources can be spun up and scaled out in minutes, so it's less "don't touch it in case it breaks!" to "how do we bake-in these cool new self-healing features and write code that will rebuild it all exactly to this point?".

We've gone from what we can't do, to what we _can_ do.

But organizations are finding this shift difficult, as is my experience across multiple contracts. The executive level - even if they have a stomach for it - either don't have the knowledge, the plan, and ultimately the right people in place to effectively make this shift. And I don't think it's a small change to make.

We're talking about teams and processes that have been used to operating a certain way for decades. IT Engineers have built their careers in specific niches and Managers have been able to hire, motivate and measure their teams based on these metrics. So it's understandable people are hesitant, or even reluctant to move to this new way of working. Especially when the strategic level of the business has a disconnect with what resources, training and time is required to adopt this new world.

Doing things in silo's is how we've always done it. You're a developer, you develop. I'm the database admin, I say what's what with the database. This girl's the architect, she'll draw it up and you over there just build this. The developer could care less the database can't handle the requests it's being sent and the architect doesn't have any buy in to what a particular dev team is building so if the design doesn't work, well, see you another time when I get back around to whatever project that was in my queue.

Working where we _all_ care about the project's outcome by working closely together between development and operations (i.e. DevOps) is only the beginning. I think the overall "collaborative thinking" that comes as a direct result of successfully implementing DevOps practices is something that would benefit everyone company-wide.

## Work Force Landscape: Evolve or Die

Something I've seen up close and personal, and also had to face this myself is evolving into the new cloud landscape. Probably relative to where you're coming from. Myself, I started in this "Systems Integration Engineer" space, so moving to the new world of caring about the _whole_ project and every team and function connected to it is not new for me and my ilk.

But if you just want to build a server, stick some monitoring on it, and run some scripts every now and then from your home folder, I think you're going to have an increasingly bad time. I've said as much to any permanent engineer I've come across who has asked me about the changing landscape, and the value of the new cloud world. The thing is, whether you believe in those values or not, they are here and you either figure out how you can move into the new world - upskill, re-skill etc - or you find another career.

And I think this is fair on both the company and the person (but this is capitalism so we don't care so much about the person...j/k). When projects and teams are impacted by someone who's unhappy with change, and digging their heels in generally making everyone else's life harder than it needs to be - this costs the company. 

Sure, this probably sounds pretty uncompromising, and I don't take this perspective cos all the other ones were taken, I (at least for the time being) genuinely believe you evolve or you're out of a job.

## Conclusion

The cloud is here to stay (well, until the world melts) as far as I can tell, and there's a lot more to it than spinning up [vm's](https://en.wikipedia.org/wiki/Virtual_machine) willy nilly.

Companies would do well to fully understand the huge task it is to align the new cloud world, with their organizations culture, structure and temperament on the ground floor, in order to do what is necessary to ensure success. Or end up with a half-baked wtf-pie that both disillusions the people who are in for the promise of the new world, and entrench further those who were sceptical of this new world in the first place.

For the Engineers, its a time to learn and upskill which can be both exciting and terrifying. But make no mistakes, you have to make a move. I recommend taking on the new world with a sense of adventure (try not to think about the kids and mortgages too much during this exercise).

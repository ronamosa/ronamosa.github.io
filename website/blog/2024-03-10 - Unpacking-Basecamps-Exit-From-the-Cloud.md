---
slug: unpacking-basecamp-s-exit-from-cloud
title: Unpacking Basecamp's Exit From the Cloud
description: Analyzes Basecamp's cloud exit critically examining cost and performance claims versus overlooked operational complexity tradeoffs. Essential reading for unders
date: 2024-03-10
authors: [ron]
keywords:
- cloud computing
- on-premise
- infrastructure
tags:
- AI-Systems-Infrastructure
- cloud
reading_time: 11
word_count: 2220
hide_table_of_contents: false
draft: false
---
Talofa reader,

I don't know what made me think of this the other day. I mean, I work in cloud, so naturally, I'm going to think about cloud infrastructure.

I think about how it works and who it benefits.

But recently, I started wondering why some people don’t want to move to the cloud. I even wondered about those who tried cloud services, gave them a fair shot, and then concluded, "Nah, this is a scam. Everybody needs to get OUT!"

I guess, as an AWS Solution Architect, I'm expected to be gung-ho about the cloud. This enthusiasm is more or less a given.

Even before joining AWS, I had very few complaints about the technology. It’s always been the front-runner in my experience. However, I believe it's crucial to challenge our own arguments and beliefs and ask the counter questions:

Why even go to cloud?

As soon as I starting thinking about arguments "against" cloud computing DHH’s controversial "cloud exit" article came to mind!

*What am I talking about?*

In June 2023, Daniel Heinemeier Hansson (aka DHH) famously wrote a post titled"We have left the cloud". He detailed[1](#footnote-1)migration off public cloud infrastructure.

He also discussed the reasons, benefits, and advantages they gained from the move.

Cloud computing offers many benefits, including cost savings, operational excellence, and security. However, if it's not meeting your needs, it's necessary to make a change. Right?

In his piece, DHH talks aboutBasecamp'sdecision to leave cloud services behind. He highlights the cost savings, the improved performance of their workloads, and the operational simplicity they achieved by using their own hardware. Basecamp's workloads were mostly containerized already, which made the transition smoother. They used a special mix of tools and techniques to manage these containers. This approach allowed them to “avoid the complexity of Kubernetes[2](#footnote-2).”

While I think that’s great and the reasons DHH has laid out seem sound, we all know that each situation is unique.

Still, a few points from the post seemed to me like they should be taken with a generous grain of salt.

<!-- truncate -->

## Receipts: A Deep Dive into the Details

I think my issue with the article is not necessarily the details, such as

"4,000 vCPUs ... a ridiculous 7,680 GB of RAM! And 384TB of Gen 4 NVMe storage!"

Instead, my concern lies in how it glosses over or minimises things that are crucial to consider. These are important when it comes to running your workloads.

It also overlooks the well-known and inevitable trade-offs that need to be made.

I'm not saying he's being obtuse about it. If you know a few things about a few things, it reads... funny[3](#footnote-3).

Cloud versus on-prem, in my experience, has been about comparing the benefits and realities of one against the other.

### King of, or Slave to The Hardware?

On-prem, you have direct access to the hardware.

You dictate where it goes. For example, Basecamp now uses data centre’s that provide "white-glove" services. This service handles the hardware, how it's run, and what's installed on it fromLayer 1 through 7.

Now that you're directly responsible for the hardware, you also need to manage its quantity.

- Do you have enough to handle performance spikes?

- What about hardware failures?

- Have you accurately calculated capacity growth for your business?

- Can you ensure your purchase orders for more hardware arrive in time when they're needed?

In Basecamp's situation, I'm 100% sure they know what they're doing. It's the reader who doesn't understand that capacity planning for a fixed amount of hardware is tricky. Essentially, you're trying to predict the future when you manage your own infrastructure.

When it comes to ordering more servers, DHH says,

*"and then when we need more, it still only takes a couple of weeks to show up."*

So, he's obviously factored that in.

### The Invisible Hand of Tech

It's the bit he says before that, that makes me go hmmmm...

*“Given how much money we're saving owning our own hardware, we can afford to dramatically over-provision our server needs.”*

To my point about guessing what the future holds, of course, you're going to have to hedge a bet on over-provisioning your hardware.

So, is the $1.5m annual savings from the "cloud exit" going to mitigate the trade-off of being on-prem? Doesn't seem very efficient, right? Again, trade-offs.

The next eyebrow raiser, at least for me, was the idea that after all this infrastructure is now in your own hands, that:

*"...****crucially****, we've been able to do this without changing the size of the****operations********team****at all." (bold mine)*

The reason for the emphasis is clear.

Anyone who's worked in IT knows, someone or some***team***must run that infrastructure.

- If you have a lot of infrastructure demand and little supply,**your ops team's going to have a bad day**.

- If your infrastructure setup is brittle and always going down,**your ops team's going to have a bad day**.

- If your infrastructure is sprawling and manually maintained,**your ops teams probably have a couple of bad weeks every month**.

You get the picture.

You may now appreciate why DHH uses the word "crucially." Now that the infrastructure burden is back on premises, the responsibility for the human labour to manage that infrastructure is also back on the books.

Your infrastructure now has a 2-week lead time if anything happens to it.

So, guess how critical the team that manages it suddenly is?

If you are fortunate enough not to need to change the size of your ops team making a move like this, you are in a*very privileged position*.

That's talent you don't just find anywhere.

So, good for Basecamp and DHH. They've mitigated the potential operational burden of taking infrastructure back in hand.

### Roll Your Own Dependency

The last quirk I have with the piece is a small one but speaks to the technical complexity of ANY IT system.

When DHH mentions a setup that*"... helped us dodge the complexity of Kubernetes,"*I had to read back what this setup was.

*"We use KVM to slice our new monster 192-thread Dell R7625s into isolated VMs, then Docker to run the containerized applications, and finally**Kamal**to do zero-downtime app deploys and rollbacks."*

Kamal is a ruby application that does container orchestration.

It's obviously a lot leaner than Kubernetes. But reading through the docs, the installation is a ruby gem cli tool. You ‘kamal init’, edit a yaml file, then an `.env` file with registry passwords and what-not...

You see where this is going?

We're just trading one complexity (Kubernetes) for another (Kamal). This new complexity is a "roll your own" solution. It depends on your own time and effort to maintain and enhance it.

Again, it's probably no skin off DHH's nose, but the rest of us have to be aware of these trade-offs.

Do I want to create my own tool, which I will develop and maintain at the risk of a security breach or service failure if I don't?

Or use an open-source tool with a massive community of developers and maintainers?

## Beware Your Own Trade-Offs

This is what I'm talking about— not DHH and Basecamp exiting the cloud, or over-provisioning infrastructure, or the Kamal tool they built themselves (and must maintain).

Those are just details of their story.

Managing and maintaining your own infrastructure requires you to have a strategy. This strategy must account for the on-prem constraints. Additionally, you need a talent pool in-house and paid for. This talent will run your operation and respond to incidents across your whole stack.

The on-prem landscape gives with one hand but takes away with the other.

Yes, you may get the cost benefits calculated by not getting 11x9's worth of durability in your storage. However, the way you manage your platform depends on the tools and mechanisms available. These tools and mechanisms deliver the performance you need.

You may not need 11x9's, but how durable*is*your storage? How many copies of it do you maintain? Are the copies situated so you have redundancy? For example, having 3 copies in the same data centre won't cut it, right?

How easily and cost-effectively can you scale your infrastructure up, down, and out?

What I am saying is, don't just take DHH's word and worldview on it just because he's a really smart guy.

Instead, look at these issues yourself.

Consider your organisation's needs and answer these questions for yourself.

Really answer them honestly.

Ask yourself what kind of business you’ll be able to run with a mid-market salary ranged workforce. Think about working with sub-optimal infrastructure, tooling, and monitoring. Think on how to avoid creating a stressed and toxic work environment. An environment that contributes to turnover. This turnover is a steep business cost, resulting in more lost productivity from constantly having to re-train staff.

## What Should I Be Thinking About, Then?

So, what, in this specific scenario, would I want people to know when looking to make an exit that they may not know about?

Let's go over the main ones:

### Scalability

Cloud services offer rapid scalability, which is crucial for handling unexpected spikes in demand. The ability to scale up or down on demand is less straightforward with physical hardware. It requires significant planning and investment, i.e., the fortune-telling analogy I mentioned before. In DHH's case, they over-provisioned because they could afford to—and probably had to. It's better to be caught over-provisioned than overloaded (if you can afford it).

### Maintenance and Expertise

Maintaining physical servers requires a certain level of expertise and resources. Cloud providers handle much of this maintenance, security, and compliance, reducing the burden on individual companies. You need the HR talent to cover this now that the ball is in your court. I would also underline "security" in this category. If your security posture is not up to snuff, you're going to have a bad day.

### Cost Considerations

While DHH highlights cost savings from moving away from the cloud, this calculation can vary greatly. It depends on the organisation’s size, growth trajectory, and specific needs. The upfront investment and ongoing costs of hardware, space, cooling, and maintenance can add up. In the cloud, we also talk about the Total Cost of Ownership or TCO. Do you really know all the bits & pieces your teams are running? Have you factored in all the racking, cooling, and power costs and how they will change over the years?

### Innovation and Services

This is a big one in the "cloud column," but it does depend on what your organisation’s requirements are. Cloud providers offer a range of services and innovations. These can be leveraged without the need for internal development or maintenance. This potentially speeds up the deployment of new features or services.

It's important to recognise that the decision to move away from cloud services involves a complex set of trade-offs. It is highly dependent on the specific circumstances of an organisation.

What works for Basecamp, given its particular needs and scale, most likely doesn't apply universally. It probably doesn't apply to you and your organisation.

## Are You Done Now?

I really dove into this particular topic because I've been seeing a lot of chatter around social media about migrations, running operations, and cloud. A lot of the chatter was nonsense or from some characters online who either didn't know what they were talking about, or they did know and were being really disingenuous about the reality of running these systems on-prem or in the cloud.

I'm not a die-hard cloud zealot.

Cloud does a lot of cool stuff. It's super convenient, handy, and powerful if you know what you're doing. The cloud has its challenges too, and costs can get away from you if you're not vigilant about what's running in your accounts.

But I grew up on-prem and on my home lab. I like owning my hardware and configuring it and running it how I like. That's why I know it's a lot of work. A misconfig here and there, and my system is b0rked or popped.

## Last Words…

I don't have any other wise words of advice other than to get some actual hands-on experience. Work in the cloud or with a company that runs their services on-prem. Get to know the pros and cons of each. Do a cloud architect certification, even if you're a dev or sysops person. In my opinion, the architect course gives you the layout of the whole organisation.

Or, build your things in a home lab and document them like I do in mydigital garden.

This one was a bit more on the tech-tech side. Let me know if you want to see more writing like this with a like or comment below!

Thanks for reading, see you in the next one.

ia manuia,

Ron.



---
title: "New Technology and Devops Is Useless If We Keep Applying the Same Thinking and Mindset That Devops Came to Fix."
tags: [career, devops]
authors: [ronamosa]
---

I only heard of DevOps maybe just over a year ago.

My career has always been about knowing how the whole system hung together as a whole. So I would know a little bit about everything. Hardware, software, networks, operating systems etc.

Getting to know each area was essentially also getting to know the people who operate those areas. You would get to know developers, and how they thought. Some thinking you agreed with. Some you'd already seen in other useless or lazy workers so it's no different for them.

<!--truncate-->

By understanding and dabbling in each areas of the system, you would start to understand what was important to each group, what was a painful, what was good for them and what was not-so-good.

Understanding where everyone "came from" just made me a better systems engineer. And also helped me understand and navigate any bottlenecks, or obstacles to getting what my team needed to get done.

It was only when I landed a gig as a "Systems Integration Engineer" that this "know a bit of everything" person I was had a technical job description. Because "Systems Engineer" didn't quite capture it all.

Why am I rehashing all this?

## What's the buzz?

Because the new buzzword (or at least one of the latest) is "DevOps Engineer". And I think largely, after figuring out what everyone was going on about, there's a lot of misconception and misconstruing between a "DevOps Engineer" and what "DevOps" really is.

People in this space will talk about Agile. They'll talk about SCRUM, continuous delivery, JIRA's, Kanbans, continuous integration and continuous deployment, and high performance teams.

Companies will have meetings on how to implement infrastructure as code, and git branching standards, automated testing and deployment methods. There will be discussions on which cloud provider, and orchestration tool, and HA (high availability) architecture pattern is best.

And that's all fine and dandy.

But they forget the main ingredient. People.

## You Forgot the 'Main Thing'

And therein lies the misunderstanding of how to do "DevOps". Because if you've read more than a few blogs on the topic, you'd see that DevOps isn't a set of fancy new tools and SDLC methods, its about culture.

It's shifting the mindset from functional 'silos' to a fully cross-functional teams that work together to deliver a big pipeline to the companies market/customers.

In my experience, Developers and Operations teams are like the crips and bloods of IT. They've been anti-each-other for as long as I've been in the game. Developers are selfish self-centered narcissists ("well, it works on my machine"), and Operations people are uncooperative red-tape Nazi's (ouch, maybe Nazi's is too harsh).

Developers would code something up, "throw it over the fence" at the Operations team who would sit there holding it up at different angles looking puzzled, and then throw it back over with a note about process or procedure, or compliance. You get the picture.

### Role-Based Caring or 'Silos'

These guys don't care about the other guys job, role or pain.

Do you think they're going to care about each others roles because you've got shiny new toys for them to play with? How about threatening their jobs if they don't place nice together?

And that's the point. DevOps (imo) was never about the tools - you can have the kumbaya meeting to discuss what your CI/CD arsenal is when you've come together - its about empathy!

>"Wow Ron, how you gonna just gonna shove some hippy lefty touchy-feely nonsense into a TECH discussion!?"

Because it's not a "tech discussion" dumbass, that's the point.

And seriously, what actual use is the smartest, the best, the most innovative toolchain since sliced toolchains if people aren't working together on it?

There's a saying in Pacific Island circles, because we're a physically bigger lot, but if you're big but you're unco-ordinated or can't fight or you're no good at sport (which by default, us brownies are expected to be). They say you're BFN.

Big For Nothing.

I feel like that's tech some times. Tech/Smart for Nothing. You can pay to have the latest gear, the coolest kit, but if people squirrel away to their little silos and work from there, what's the actual "DevOps" benefit here?

## You Can't Forget the People

We're not at the "all the robots do all the jobs" future yet. And I'm not sure it'll ever fully be like that because if you've worked in tech, you'll know how much manual or people assistance these "smart machines" need.

If you don't get buy-in from everyone to do things the "DevOps" way, you're not doing it right.

And no-one's saying its easy. It's not.

It involves change. And most people don't like change.

They like familiar. And they like the status quo. No surprises.

Now, I'm not an Agile Coach, and I don't presume to have experience in implementing a company-wide DevOps philosophy.

What I do know is what it looks like and runs like on the ground. So here are few things I do "get" about "doing DevOps" at work...

### Standards. as In, Have Some

It doesn't have to be perfect. And you can tweak it as you go. But dear God, please get together as a company, and figure out what standards you want to implement in your company. You need representatives from every sector (development, architecture, operations, business analysts, change and release teams etc) to input into this because ultimately, this will help with the all-important next point.

Once you've got a set of standards you all agree on then you have the beginnings of a plan.

### You need to all buy-in

Otherwise you're screwed. Again, just my opinion. But if the concept of Continuous Delivery means "end to end", and you have one team in that chain that's doing things "their way", then you've got a problem. Sure you can leave them out, but what does that mean? Leave them off the deployment pipeline? Leave them out of the git repos? From an operational support point of view, now we've got a snowflake (not political) team that needs special needs and attention.

When everyone "buys" in that means you all benefit from the collective experience of working together for the common goal. Events, news and knowledge about all aspects of the platform, application and business goals are shared and distributed amongst the team. And that knowledge and shared experience informs improvements and enhancements to all areas of the business. Tips & tricks about deployment, troubleshooting, break/fixes etc.

Once you have your buy-in, everyone has a seat at the table.

### Training and Documentation

Do NOT underestimate (or skimp) on the training and documentation requirements and needs. The genius who wrote the whole app by themselves is ONE person. If we dont have that application documented to where a 5 year old could pick up the slack developing a module that would seamlessly integrate into it, that ONE person is not a Rock Star Developer - they are a SINGLE POINT OF FAILURE.

And that goes for infrastructure, operations or anything else in the brave new devops world for that matter. If you build it, document it to the point where the next person should be able to build it without your help (results may vary based on staff).

Why should the next person have to go through all the same pain you did when you did it the first time? That makes no sense, and is essentially a loss on return of investment made into you doing it the first time.

### Return on Time Investment

If it took me 20 hours to figure it out and do it. And 10 hours was the actual doing it, then the next person should only be spending 10 hours doing it as well. There's nothing left to figure out right? But if they get to the task and the 10 "figure out hours" aren't documented, guess who's going to spend another 10 hours of the company's money learning something they've already paid someone else to learn?

Training doesn't have to be a $5000.00NZD per person investment by the company, there are talented people already working in and building things for the company. The investment is allowing these senior staff to take time off their scheduled work to invest training your in-house talent. Why?

Because why wouldn't you give the operators of your system the training they need to operate the system to its maximum potential? This just seems ludicrous to me. If you're going to go "all in", go all in. Otherwise, set your expectations accordingly.

## Conclusion

The headline might read nicely - "Company goes FULL DevOps" - but if you're not _actually_ doing it, you'll see the cracks on the ground.

So, to summarize:

- Forget the buzzwords and get down to the actual meat & potatoes of what you're trying to do. Don't do new tech for new techs sake if you don't have all the complimentary structures it needs to succeed.
- This especially means people. Do you have the people to make this successful? Have you _invested_ in people, in order for this to be successful?
- Have a plan. Set some standards. These can tweak as you go, but start with some.
- And make sure everyone's "in". Otherwise, get ready for the s***fight around every corner.
- invest in people by training them. By emphasizing documentation. Or at least get a return on investment by allowing (making) your engineers document their work.

Hopefully, with some of these points you'll get that shiny new DevOps-powered company you've always wanted.

Otherwise all you really have is new badly implemented system 2018 to replace your old badly implemented system 2011.


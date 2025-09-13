---
title: "My Career Start as an Accidental Systems Engineer"
tags: [career]
authors: [ronamosa]
---

Understandably [Morpheus](http://www.imdb.com/title/tt0133093/characters/nm0000401?ref_=tt_cl_t2) had a bleak outlook on Systems, but it doesn't have to be our enemy.

There have been many titles for this role. From IT Engineer, Systems Engineer, Systems Integration Engineer to more recently the lauded ‘DevOps Engineer’. And current reading (for myself anyway) has introduced me to the the title ‘Site Reliability Engineer’ or [SRE](https://en.wikipedia.org/wiki/Site_reliability_engineering).

Whatever the titles are or have been this post will discuss what being a Systems Engineer has been in my experience and from the point of view of my career in Information Technology.

<!--truncate-->

## Systems Engineer?

I get a bit iffy with the title ‘Engineer’ in my work because I don’t have an ‘Engineering’ degree. And I wonder if this makes me unqualified in some peoples eyes to give my feedback and recommendations on technology and systems. And then I remember that on the job what’s important is not whether you have a degree or not, it's

>_“do you know how to make this work and/or work better?”_.

And for the most part, I do.

I started my career on a helpdesk for an [ISP](https://en.wikipedia.org/wiki/Internet_service_provider). I would take calls on the 5pm to 1am shift and help people figure out why their internet wasn’t working or how to setup their email clients. From there I moved to Web Development, Application Support Specialist, Unix Systems Administrator and eventually to Systems Integration Engineer.

Through each of the previous roles a good understanding of the systems I was working on meant I could do my job effectively. The PHP/MySQL code that ran on the LAMP stack, or the client software applications that ran on Unix Servers. I would understand the underlying system, to make the thing that ran on top of it work well or know where (possibly why) it had broken down.

But fixing the system, recommending fixes and even a better design was not part of my role or responsibility. Until I became a [Systems Integration Engineer](https://en.wikipedia.org/wiki/System_integration).

In this way the role and responsibility of the ‘Engineer’ as opposed to ‘Administrator’ was to design, build, extend, enhance the System - Infrastructure, Network (I’m grouping these distinct roles together under ‘System Engineer’ to indicate the underlying platform which software and the user build and act on top of).

## The (work) life of a Systems Engineer

My day to day role as a Systems Integration Engineer working on projects would be to go over the company's existing systems and understand what they do, and how they did it. I would need to read internal documents and designs created by the Engineers who built it.

### The Projects

The next responsibility would be to have a look at the project requirements. I would need to see and understand what it was the project was trying to deliver e.g. it is a mobile app, is it a website, is it a new internal application or an upgrade to an existing platform.

Once I understood what I was working with and what the project wanted to deliver I would see what the infrastructure and network needs and challenges might be in order to succeed. If there was a Solution Design I would work through it and see if the design addresses any of my assumptions. If there wasn’t  I would create a Solution Design of my own to ensure I was working to some kind of design and get the rest of the team to work off of it with me. (The Solution Design is usually a Solution Architect deliverable that sometimes projects didn’t account for it as a need or requirement - odd I know, but it happens).

### Building things

Next you would start building things in the development and test environments to prove what had been designed would work. Once you had tested and tweaked your work you would document these as part of the change release management process ([ITIL](https://en.wikipedia.org/wiki/ITIL#Release_and_deployment_management) for you playing along at home) for the operations teams to deliver. These documents would instruct the operations teams how to deploy and make these changes into their managed environments. The project team would then be able to test their project once things were deployed. They would tweak or make changes as tests passed or failed, and re-deploy updates or fixes until the project was working as required. In these phases the Systems Engineer would see and tend to any underlying issues that were discovered in the testing process.

The project would rinse and repeat this cycle right through until the project was delivered into the 'Live' Production systems and would be available to the world, or whoever the end user was, to see and use.

### Seeing everything

As the projects Systems Engineer you would look after

- the infrastructure needs and requirements (e.g. how many servers are recommended for this design?).
- Help troubleshoot the integration points between one platform and another (e.g. application that talks JSON with an appliance that talks XML only).
- Between
  - application and server (e.g. does the Java version on the server support the application and will changing it break other applications or licenses?)
  - server and server (e.g. new Linux server trying to FTP to a remote windows share mount point)
  - server and network (e.g. is there a misconfigured network rule preventing access for my server?)
  - application and network (e.g. is the protocol the application needs to talk with allowed on the network?) and
  - network and network (e.g. do we need a site-to-site VPN i.e. is your local network allowed to talk to the remote network?).

### Delivering change

It may not have been my sole responsibility (should be more the Project Managers in my opinion) but my team would tend to raise all the required Change Requests for each phase of the Project. We would help fill out the requirements to get these changes understood, accepted and approved by the relevant technical teams and stakeholders. So there’s a lot of ‘Process’ elements involved. And work to understand and do these processes correctly and efficiently go a long way to getting your project in on schedule. Because at the end of the day, you need to work with everyone to deliver your project.

## People Systems

And finally, being a Systems Engineer, in my experience, means working with a wide range of people and personalities - like most office environments I’m sure.

Some of them you’ll like and enjoy seeing everyday. Some of them you won’t and it’s a challenge to deal with them.

But in the same way that understanding how all the components of a system work differently. So too will an understanding of how all the different people and personalities need to work together for the system to work.

Easier said than done I know but in my experience the effort to better understand the different teams e.g. what drives them, what impacts them, what hurts them - helps make me a better more valuable Engineer to the teams and ultimately to the company.

**Thanks for reading.**
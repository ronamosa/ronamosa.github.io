---
title: "The Project Delivery Space and the People That Make and Break It - Pt. 1"
author: Ron Amosa
author_title: Platform Security Engineer @ Salesforce U.S.
author_url: https://github.com/ronamosa
author_image_url: https://github.com/ronamosa.png
tags: [working]
---

I've worked in the _Project Delivery_ space for almost 10 years now. I'm not even sure that's an official "space".

All I know is, for almost a decade I turn up to the office (remotely more recently) to work on projects the company is trying to get to market.

Projects are a funny phenomenon in business, and I'm not sure everyone has the same take on them.

<!--truncate-->

I've come through [Waterfall](https://en.wikipedia.org/wiki/Waterfall_model), all the way to whatever people's definition of [Agile](https://en.wikipedia.org/wiki/Agile_software_development) is, and everything in between.

In a series of posts I thought I might detail the experiences I have had delivering projects for various companies along with any insights and advice I think might be useful to know and understand if you're ever wondering what it's like in this space.

### Big Company. Lots of Teams

In a big telco I worked as (in my opinion) the first kind of "DevOps Engineer" in the project delivery space. We were called "Systems Integration Engineers" and we were tasked with plugging all the gaps in technical, design, requirements term (e.g. does the architect have the full picture of the environments? why isn't the message bus working for the devs? can you build a new dev/test/poc environment please? can you learn about PKI and tell us what we should be doing to secure this please? etc).

We (my team) were in the middle of everything and there were lots of projects on the go. At one point I was across 10+ projects at one time ranging big customer facing product & infrastructure upgrades, to small internal facing applications (scripts etc).

With so many projects on the go, I quickly learned that "projects" worked differently from the rest of the business. We were like these self-contained businesses within the business. Our "customer" was the stakeholder (whoever up above who really wanted this thing "live"), the "CEO" was the Business Sponsor and "COO" if you like was the Project Manager.

The Project team was spun up like a virtual machine, complete with developers, architects, business analysts, systems integrators etc. We were a temporary self-sufficient software development "company".

This was cool and all, we worked together on the projects, and when it was delivered we would disband and join other project teams.

### Survival of the Fittest: Usually the Most Ruthless

The problem with this setup was that there were lots of projects happening, and not enough specific resources to cover them all. So things get a bit competitive between projects wanting to deliver their project over another team.

You have teams competing for operational resources, hogging testing cycles and or damaging non-production environments for the project coming in after them, essentially delaying their delivery times due to troubleshooting.

Operations were understandably wary and sceptical when it came to projects teams trying to get their application in as often in the race to snag limited resources, corners would be cut, so the quality of what ops were going to allow into production was admittedly suspect.

So not only is your project vying for resources _against_ another project (and often I would on both projects), you're also trying to score the "go live" goal past the operations who are (again, understandably) trying to stop you deploying anything into their environments which is most likely going to break it, or leave them with a really crappy bag to hold indefinitely.

### My Advice

Before I even knew what DevOps was, as a Systems Integration Engineer, my job was to guide & build things from design, through build, testing and finally production deployment, complete with operational handover and documentation. This held me in good to stead to look at the project as _"everyone's responsibility_".

> What does that mean?

* It means, don't build a crappy application (subjective sometimes sure, but a lot of times its been objectively crap) that ops will have to babysit.
* It means documenting and workshop new knowledge with the teams you intend to operate or maintain the system.
* It means help the project meet security requirements by helping them understand how they can do security better.

### Conclusion

Sure there's always going to be challenges delivering a good project, on time and under budget. But the working together across the company, and every department "buying in" to the goal, and being included and respected as an important part of the success of the mission by the project team is the best way, in my opinion, to ensure not only a successful project delivery, but a highly motivated and functioning workplace.

:::note

_Working together across the company amongst disparate teams & interests will depend on the quality of the "higher ups". But that's a blog post for another time._

:::
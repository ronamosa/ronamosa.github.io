---
title: "Productivity Tools & Tips for the Professional DevOps Engineer - Part 2."
author: Ron Amosa
author_title: Platform Security Engineer @ Salesforce U.S.
author_url: https://github.com/ronamosa
author_image_url: https://github.com/ronamosa.png
tags: [career, devops, tools]
---

In Part 1, we looked at the apps and other tools that I come across and use not only in my day to day work as a contractor, but also in my personal projects as well.

I wanted to list and give a brief overview and explanation of why I use the things I do, for the things I do ;)

In this post I'm going to look at Project Management tools and well as the applications and tools I use for CI/CD and 'DevOps' work.

<!--truncate-->

## Project Management

Keeping track of tasks, details, documents, correspondence when working on multiple projects can be a bit of a nightmare. When I work on projects, I tend to use the following applications to manage my workload and workflow.

### [Trello](https://trello.com/)

#### What Do I Use It For?

Organizing the over-all, or macro-level view of what's on my plate at any one time. I setup each project as a list and add tasks in there as cards, complete with checklists, comments and other notes. I then have a "Today" list which I drag tasks from across all my projects into this 'view' so I can see what's on my plate, what's due, what's critical etc.

#### What's So Great About It?

It's quite a flexible platform for getting tasks in there via email, sms, or just manually editing. Allows you to change the background to a nice image, and then has a LOT of these things called powerups which are just integrations with other online products which extend the capabilities of Trello 100x fold.

### JIRA

I use it for tracking bugs, issues, infrastructure requests, basically all manner of project work in and around the code.

The [Atlassian](https://www.atlassian.com/) people have integrated a bunch of products that all work together nicely for collaboratively working on software based projects e.g. JIRA ticket numbers in a git commit will automagically generate a link to the JIRA ticket from Bitbucket.

JIRA ticket interface:

Get a KANBAN view of the relevant tickets in your project:

:::note

_For enterprise there is your usual pricing options, but for personal use (i.e. free) Atlassian gives you the option of downloading and running JIRA on your own server for a very small 1-off fee._

:::

### Confluence

**What Do I Use It For?**

Documentation. Most of the recent companies I've contracted at use confluence as their "wiki" or documentation platform of choice. And with good reason.

**What's So Great About It?**

It's a great feature-rich documentation platform. Handles all your documentation needs from clean and clear formatting, page layout options, quick keyboard editing shortcuts (e.g. 'e' starts edit mode, ctrl+s on the page saves it).

:::note

_For enterprise there is your usual pricing options, but for personal use (i.e. free) Atlassian gives you the option of downloading and running JIRA on your own server for a very small 1-off fee._

_see here: [Atlassian Software Pricing.](https://www.atlassian.com/software/confluence/pricing?tab=self-hosted)_

:::

## Testing

When you have an issue, or you're trying to work out how a certain component of the system behaves, or you're trying to reverse engineer something you've never worked with before, you'll need some good tools to help you do that.

I use the following for various aspects of testing an application works, works as expected, or is working and we don't know why.

### [Soap-UI](https://www.soapui.org/)

**What Do I Use It For?**

In my experience I came across Soap-UI for a lot of java application testing. That and, as the name suggests, lots of SOAP based applications (Weblogic SOA platforms, XML Gateways).

I use Soap-UI for firing JSON/XML payloads against REST and ESB endpoints. Also for doing more complex unit tests that need to incorporate a few elements, and possibly has multiple pre-requisite steps e.g. fetching JWT before tests, embedd auth credentials in the request.

**What's So Great About It?**

Basically everything you could think of for testing SOAP/XML based messaging platforms Soap-UI got you. If you want to flex and set up more complex automated testing suites, it's got you too. It's a nice place to put all your unit tests and test logic in one area.

Also, because its a java application it runs on Windows and Linux.

interface:

example of request:

### [Postman](https://www.getpostman.com/apps)

**What Do I Use It For?**

Pretty much works the same way as Soap-UI, its a great tool for testing endpoints by firing payloads at them.

**What's So Great About It?**

The browser based version via Chrome Store makes it readily accessible when you're in your browser and needing to test things without alt-tabbing away. Postman does request intercept so you can analyze a request mid-flow, edit and forward if necessary. Does all the other feature-expected stuff well like headers, auth injection etc.
_note: there is a desktop application version as well. its just a java app that runs locally._

### [Docker](https://www.docker.com/)

Now, docker can be used for many things, but I do use it for testing things out that won't necessarily be using docker in its final form e.g. testing out a logging system for an app by spinning up a docker-compose of that scenario/environment setup and tweaking the configs of the app and logging system, and taking that config to production even if it doesn't use docker at all.

**What Do I Use It For?**

Every time I need to model a scenario, or setup a learning environment without impacting an external system, or messing with my current system. Examples, testing nginx configs by firing up a container and testing it locally. Firing up docker-composer for an ELK stack and testing grok patterns locally.

**What's So Great About It?**

Everything (haha). Running things in containers is my new favourite thing. Anything I can run in a container, I just try to because I find it fun to try and do. So yea, Docker's great. Get into it if you can.

### [Vagrant](https://www.vagrantup.com/)

If you don't know what Vagrant is you better ask somebody. I know we're moving away from virtualisation (well, yes and no, it's still there at the base level of a "box" of some kind for things to run on), but I like vagrant and it has its uses in the mix of my work doing infrastructure design and build.

**What Do I Use It For?**

I use it the same way as I do Docker (above), in building these miniature "models" of existing infrastructure I'm trying to troubleshoot, or designs I'm testing out.

**What's So Great About It?**

Lots of boxes

Much like the docker hub, you can pull down ready-made OS or application driven virtual machines. Virtual machining you can script, automate and build & run headless is always a good thing.

## Conclusion

This is far from an exhaustive list but just a quick overview of a range of tools that come in handy on the regular doing what I do for work and play. Just remembered things like Jenkins, Artifactory (docker repos), Nexus artifact repos... man, I've missed out a bunch so will have to revisit this again another time.

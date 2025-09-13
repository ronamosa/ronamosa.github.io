---
title: "The Human Side of Technology Solutions: A Tale of 2 Projects."
tags: [personal, community]
authors: [ronamosa]
---


This past week I've had a chance to reflect on 2 different projects I've been involved with at opposite ends of the lockdown.

At the beginning of Level 4, just before the lock-down, I was contacted to help out with what would end up being the [NZ Governments WhatsApp channel](https://covid19.govt.nz/whatsapp).

The technology involved for the solution required some in-depth knowledge of cloud technology, container orchestration platform kubernetes, a secrets management CLI (command line interface), monitoring and dashboard building and deployment methods and configuration.

<!--truncate-->

There wasn't a lot of time before they needed it launched so I had to jump in straight away, consume the code, documentation, start pinging your teammates for logins, access credentials. Setup your deployment system (Ansible, Terraform in this case) pick a task and start deploying to the staging environment. Test it works. Get your changes code reviewed by a team mate, merge to master, pick another task.

And so on until it was [launched April 6th](https://www.linkedin.com/feed/update/urn:li:activity:6653475313814728704/) and NZ had the government COVID-19 updates and info at their disposal right from their mobile phones.

Fast forward to the week before Level 3...

I saw a local cafe in Avondale owned and operated by a young Thai couple posting on Facebook. They were organizing contact-less pick-up orders by phone & mobile. I felt for them because they didn't have any kind of online ordering system to better manage the influx of orders. 

So I did what I usually do in this situation. I build something.

I decided to build a "proof of concept" for a simple online ordering setup. Did it involve containers, secrets management deployment or configuration management?

No.

It was a simple Google Form with their menu, embedded in a Google sites page with all their details. The form would take a customer order, notify the cafe owners of the new order, update the orders spreadsheet in Google Drive and then using a Forms add-on, it would send a copy of the order and the payment details to the customer.

It was as low-tech as I could make it because I wanted the cafe owners to be able to change it and manage it with minimum effort because they have a cafe to run and shouldn't be trying to learn a complicated technology system. It's point and click all the way.

The proof of concept took a couple hours to put together and test after which I contacted the cafe owner and asked if he needed something like that for his cafe. He said yes, and a few emails and updates to the concept-site later I handed over an operations manual I wrote up (something I usually do in my contracting world before finish a project) and him and his wife were away taking orders online from their locals before Level 3 lifted on May 28th.

check it out: [https://sites.google.com/view/tastecafeavondale/](https://sites.google.com/view/tastecafeavondale/)

From the high-tech cloud solution with lots of complex technology serving all of New Zealand to the lowest-tech online ordering form for a single local cafe I was really proud to be part of both of these things. And not for any accolades or recognition. But, as cliche as it might sound, because I was able to use my technology skills to help people.

In my industry, a younger me could be forgiven for hiding away the fact I made a Google site with an embedded form cos it wasn't _"l337"_ (elite) enough. But a wiser me has learned (better late than never) that technology is only as cool as how much it helps people.

Sure the clever things it can do are interesting and fascinating but if it doesn't help people, seriously what's the point?

So that was my personal insight from the last few weeks navigating everything that was happening around me as well as the things I got caught up in.

I hope you were able to reflect on anything these weeks have brought to light for you. I'd be keen to hear any insights you might have to share :)

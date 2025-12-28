---
slug: data-sovereignty-the-cloud
title: Data Sovereignty & The Cloud
description: 'Challenges data sovereignty fearmongering around cloud providers while highlighting indigenous data collection as the real sovereignty issue. Essential reading '
date: 2023-03-21
authors: [ron]
keywords:
- indigenous
- data sovereignty
tags:
- AI-Sovereignty-Governance
- AI-Systems-Infrastructure
- cloud
- indigenous-knowledge
reading_time: 14
word_count: 2715
hide_table_of_contents: false
draft: false
---
Talofa reader,

There's been a lot more AI activity this past week after the announcement ofGPT4by OpenAI. There's been a lot of discussion and activity in my Pasifika Tech Network discord as well as the developers have been playing with creating slack and discord bots that use the OpenAI API.

But there's one topic that I can't recall how it came to my attention this week; it crossed my mind early one morning after studying for my AWS certification - Data Sovereignty. It's a topic I frequently deal with, given that I work at AWS and my job involves discussing cloud technology with all sovereign nations in the Pacific. Since it's a pretty important topic in the Pacific, I wondered what my network's understanding of it was, so I asked in the channel.

"Morning team- this is always an interesting question when I come across it at work (in NZ and in the Islands) so keen to hear everyone's thoughts - What do you know/understand about Data Sovereignty? And what do you think about the issue of where our (Pasifika/Indigenous) data is stored?"

I got back some really thoughtful answers, and interesting to note was that the people that responded were all senior level technical folks. They mentioned things like physical location of the data and the governance and applicable laws of that location i.e. country. It was interesting to also see talk about trust between allied countries and data residency agreements and what they mean for NZ for people working specifically with NZ data.

Now, no surprises here - I’m not an expert on this topic by any stretch of the imagination. I’ve just done some reading, and combined that knowledge with my experience and understanding of the topic gained over the last 8 months of working in the field.

I will leave links to all readings and resources I read to understand any of this, below.

### Disclaimer

Obviously, I'm going to have some bias on this subject. I work at Amazon Web Services as a Solution Architect, and most of the data relevant to the work I do resides on AWS infrastructure. However, I believe the crux of this entire topic is that the geographical location of the data and the ownership of the infrastructure are only the beginning of what this subject is effectively about. For the record, I do not speak for or on behalf of my employer. All opinions expressed here are my own.

<!-- truncate -->

## Storing vs Collecting

Before really looking into the different issues regarding data sovereignty, I was pretty focused on just the area of this topic that was “where is my data stored?” and “who can access it?”. However sections like*"Data rights and interests"*outlined in The*Te Mana Raraunga Charter**,*and*'Indigenous data sovereignty : toward an agenda / editors: Tahu Kukutai, John Taylor.'*talk about the collection and disaggregation of indigenous data, which speaks to how indigenous peoples' data is being harvested and utilised without their consent, control, or benefit. This is not just about where it's stored, although that's one element in the arguments around this topic.

I’m not going to be looking at that aspect of Data Sovereignty here because it’s way outside my pay grade and warrants a lot more than some preliminary readings and understanding of technology.

## Rights vs Access

In my experience working with and talking to people across the Pacific (and this is anecdotal, obviously), but a lot of the time, the issue of "sovereignty" has boiled down to "who can access our data?" and "is it secure?". The cloud is new for a lot of folks in the region, so it's understandable to have some fear of the unknown. Just knowing that you are the only ones who have access to your data and that encryption of your data with keys you control is the recommended best practice anywhere usually allays the initial fears of*"unauthorised access"*. We could get into theories of backdoors and corporate employees cruising through customer data at will, but I think I'll choose to spend my energy on things I've actually come across.

I'm not saying governments haven't debated installing backdoors into software and encryption methods to "save us from the terrorists" in the past. Or that companies haven’t been crap at keeping data secure. I'm saying let's apply a little critical thinking (yes, we keep an open mind, but let's make sure that opening's not big enough for our brain fall out of) and think what can reasonably be expected, so we can spend the appropriate amount ofexistential dreadanxietyconcern on these things.

*"Never attribute to malice that which is adequately explained by stupidity." -- Hanlons Razor*

### Local is not Sovereign

This argument has been an interesting one to follow through the various pieces written online by people with vested commercial interests in the outcome as well as folks with ideological interests in not having local data reside on foreign owned company infrastructure, even if that infrastructure is in New Zealand.

"Even though your data may be held locally (in your own country) if it is hosted by a global cloud services provider this means employees of that provider, who reside in different jurisdictions, can access your data and configuration details from overseas – unless you have data sovereignty."

It’s statements like these that make me question whether the person saying this is being deliberately disingenuous. Or if they*really*believe that random employees of these overseas companies are accessing customer databases, and storage systems for customer “data and configuration details” with no authorisation?

The “from overseas” bit paints an interesting picture as well, like it’s a thief coming in through your window to steal your data and configuration?

And “unless you have data sovereignty” - is this a new sovereign nation with its own laws and agreements outside of international laws and agreements, that magically stops these random overseas employees accessing customer data cos your account has a “data sovereignty” stamp on it?

Yes I’m belabouring my point that this statement is, in my opinion, insane.

From my discussions about this issue with policy experts at work, I understand that the concept of international cooperation and exchange of information and intelligence between countries is nothing new. There is a process and a mechanism for making, reviewing, and challenging requests. The CLOUD Act (below) made some updates, but otherwise, the process remains the same — you obtain a warrant, request the data, and the provider goes ahead and challenges it anyway because - "business".

You’ll see what I mean by “business” later on.

But now that I’ve called it out, let’s have a quick look at this CLOUD Act.

## The Clarifying Lawful Overseas Use of Data (CLOUD) Act

The CLOUD Act was passed on March 23, 2018, by the United States Congress, updating the legal framework to provide U.S. law enforcement with a mechanism to request data from foreign countries using a warrant. The act also includes provisions about bilateral data-sharing agreements. In a nutshell, the previous methods, such as mutual legal assistance treaties and warrants under the Stored Communications Act (SCA) for U.S.-based requests, were slow and cumbersome. The CLOUD Act was designed to create a more efficient mechanism for these processes.

The CLOUD Act is the big one that gets specifically called out in the articles I've read. To be honest, it reeks of scare mongering from people with commercial and ideological interests. While I'm all for protecting people from oppressive authority and abuse, we have to be cautious of chasing every “wolf story” out there or we’re going to get fatigued quick.

As you can expect, all major cloud providers have had their say about the CLOUD Act and what it means for their customers such asMicrosoft and the CLOUD Act, andOracle and the CLOUD Act.

The responses largely indicate that the Act is frequently misunderstood, for example:

***Does the CLOUD Act take precedence over another country's local law?***

No. The CLOUD Act does not change another country's local laws. In fact, the CLOUD Act recognizes the right for service providers to challenge requests that conflict with another country's laws or national interests.

—*AWS and the CLOUD Act*

and that the providers will challenge these request from everyone to protect customers data, e.g.

"When AWS receives a request for data located outside the United States, we have tools to challenge it and a long track record of doing so. In fact, our challenges typically begin well before we go to a court. Each request from law enforcement agencies is reviewed by a team of legal professionals. As part of that review, we assess whether the request would violate the laws of the United States or of the foreign country in which the data is located, or would violate the customer’s rights under the relevant laws. We rigorously enforce applicable legal standards to limit – or reject outright – any law enforcement request for data coming from any country, including the United States. We actively push back on law enforcement agencies to address concerns, which frequently results in them withdrawing their request." —*AWS and the CLOUD Act*

I understand the argument, 'they're just a big corporation; they'll say anything, even if it's not true.' I get that. However, I also believe that being a corporation is precisely what ensures the protection of customer data from 'unfettered access.' They are a business, and they won’t stay in business for long if they can’t be trusted.

## Trust is Business

I may be naive in my thinking, but if we're saying the almighty dollar is king to corporations - and we see examples of this in both support and disapproval of problematic public figures by advertisers, depending on which way public opinion (i.e., customers) goes - then maintaining a "tight" relationship between customer and provider would be a relationship that's protected at all costs. Not because companies inherently love and cherish people, but because they are a business. It's just good business to maintain trust.

I know we can find plenty of examples of businesses being pretty shitty to people in the name of shareholder profits, etc., after all, capitalism is the system we're all operating under. That's why I think it doesn't make good business sense to violate this trust by not protecting customer data through all legal means available.

## Indigenous & Māori Data Sovereignty

Again, when diving into the topic of data sovereignty in terms of indigenous people, it's a massive topic, and one I'm not qualified or knowledgeable enough to discuss.

I've read through*'“He Matapihi Ki Te Mana Raraunga” - Conceptualising Big Data Through a Māori Lens'*where it outlines what I understand as data classification and policies with which I'm familiar in terms of standard data security frameworks - but using Māori terms. I then looked at'Indigenous Versus Māori Data Sovereignty'which acknowledges the differences between Pacific nations and Māori data sovereignty but states, "there are elements and ties that unify us as the People of the Moana."

My big takeaway from these few texts is that I need to read and understand a lot more about the subject, and probably learn from more knowledgeable people in the field to really grasp what it's all about.

I understand that colonisation plays a significant role in the concerns surrounding how this topic is handled and implemented, and I think it's crucial that it's done correctly moving forward. However, this is way outside my area of expertise - I'm the cloud guy. I just want to make sure you encrypt, control, and can access your own data and that you have the correct information to make the best decisions for yourself.

Lastly, on the topic of making technical decisions for yourself...

## Random Private Clouds: Run at your own Risk.

In an effort to protect themselves from big tech and keep their data safe and secure, I've seen people recommending running one's own server or private cloud. This is great for geeks (like myself) and other technical people who do this for a living. However, in my opinion, it's really irresponsible to mislead people into thinking that it's easy to do and to leave out the maintenance aspect of running infrastructure! That's a huge risk. As we constantly say in the industry when it comes to running any kind of infrastructure or software - "patch your shit" - because there's a bug or vulnerability that comes out so regularly that you have to be vigilant if you don't want your systems“getting popped”.

I'm not saying don't run your own server; I'm saying please understand what it means to run and maintain a server if you want your data to remain secure.

## Conclusion

Another long one - I honestly do no set out to write these long ass pieces, these last two have just turned out that way. Anyway…

I've talked mainly about cloud providers' storage, access, and disclosure of people's data, specifically indigenous people, and what "sovereignty" of that data effectively means - in a nutshell, it's about protection from unauthorised and unlawful access. The CLOUD Act fear may be overstated, at least considering the fact that there have beenzero disclosuresas a result of any requests by the U.S. government for data located outside the U.S. (by AWS). I probably didn't emphasise it enough, but encryption is real - and is recommended for all your data, which most providers make available to secure all your information. Please do this by default.

However, I think ultimately the real data sovereignty issue is the collection and use of indigenous data by governments and other entities without the express rights and permissions of indigenous people over their data. That's the real fight, in my opinion, and one that makes much more sense than the other issue, which can be nullified with a strong encryption key.

*Thanks for reading. I'll see you in the next episode.*

Ron.

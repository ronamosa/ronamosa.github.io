---
title: "AWS and the Real Cost of Running Your Infrastructure in the Cloud."
author: Ron Amosa
author_title: Platform Security Engineer @ Salesforce U.S.
author_url: https://github.com/ronamosa
author_image_url: https://github.com/ronamosa.png
tags: [cloud, aws]
---

Monitoring AWS costs is tricker than you may think. Cloud cost management as a general topic is the bane of a lot of business expenses.

If you look at [AWS Pricing](https://aws.amazon.com/pricing/) page, you're going to have to get your head around a few things.

For example, your storage needs:

cool, sounds pretty straight-foward.

> me: "I'll just have 2TB please."

not so fast.

which **region** do you want to keep your S3 buckets?

> me: "oh, um, what's the difference?"

The main thing that comes to mind is 'latency' to where your users are being served. You generally don't want to serve content from the other side of the world. Also different regions can vary in AWS services available for that region if you need to use something specifically. Data sovereignty is also a consideration - are you allowed to store your users data outside your country?

But the main difference this blog post is worried about, is cost.

<!--truncate-->

> me: "gee, I'll have to get back to you on that one. How about we just take the default N. Virginia. Cool, so we're done here?"

Not quite. You need to decide if and how your storage needs divide over the following:

And this is just S3 storage. So imagine your databases, VPC's, NAT instances. Basically all the other things that make up an AWS environment for your company's infrastructure and application needs.

This is just to illustrate that AWS cost management is an art and discipline unto itself and should _not_ be underestimated.

## AWS Wants to Help You With Cost Management

AWS aren't the bad guys and they do try and help their customers not have a bad experience with costs.

There are quite a few posts from the folks at Amazon AWS addressing the very issue of managing your costs and not getting an unexpected monthly bill:

One such page under thier "Monitoring Your Usage and Costs" talks about [Avoiding Unexpected Charges](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/checklistforunwantedcharges.html). It talks about using the Free Tier to save money. Which components cost you money even if they're not running or you're not using them e.g. elastic IP addresses, Elastic Load Balancers.

Then there's services like [AWS Budgets](https://aws.amazon.com/blogs/aws/aws-budgets-update-track-cloud-costs-and-usage/) and [Cost Explorer](https://aws.amazon.com/blogs/aws/the-new-cost-explorer-for-aws/) which try to help you monitor and report on all your AWS usages.

And lastly, the [AWS Calculator](http://calculator.s3.amazonaws.com/index.html). This is a good place to start to give you an idea of costs before you start launching stuff:

The main things I've highlighted here are a) all the various AWS components down the left-hand side, (b) region selector, (c) does an estimate of your likely monthly bill, and then as an example (d) at the bottom you can see the granularity how how detailed you want to be to get the best estimate of costs.

Mind you, doing this for every single piece of your infratructure and application needs, across all the different services (EC2, S3, RDS, DynamoDB) can start to get complicated very quickly.

## Strategy. Have one

There's an absolute [plethora of blogs posts and articles online](https://www.google.co.nz/search?biw=1309&bih=699&ei=7VrAWvbfJIHX0ASPjaeIBQ&q=aws+staying+on+top+of+costs&oq=aws+staying+on+top+of+costs&gs_l=psy-ab.12...0.0.0.6797.0.0.0.0.0.0.0.0..0.0....0...1c..64.psy-ab..0.0.0....0.0zFs8pfrsMU) about different ways to stay on top of your AWS cloud costs from people much smarter than me.

But for the sake of an example strategy when it comes to AWS costs, [Cloudability](https://blog.cloudability.com/three-ways-to-stay-aws-cost-efficient-during-the-busy-season/) hit on these 3 key points of advice from their engineers to put you in the best position to have no bill-shock "surprises" :

1. identify & monitor key metrics head of busy periods
2. simulate the busy period
3. scale down after busy periods

Of course this will all depend on your architecture, your infrastructure and appliction needs and ultimately, your budget.

But we're not the first visitors to "AWS bill-shock" island. People have already been here, some of them left, others - built tools to numb the pain.

## Tools. Use them

Now I've only come across this one recently, but I have to say, it ticks a lot of the boxes:

[Park My Cloud](https://www.parkmycloud.com/)

This service does a tonne of stuff that is definitely in your best interests to include in your cloud management operations. It not only schedules your environments to wake up or shutdown depending on when you need them up (think development and testing environments), but will monitor use of your cloud assets and advise if you could switch to a smaller instance, or less frequently required service.

'Park My Cloud' also keep a running total and display of what your projected and actual savings are by using them.

We use this tool on my current contract and its easy to use and it's ui is intutive and easy to find things. I would defintely recommend using a tool like this to manage your cloud costs.

Now, if you're not a large enterprise with 100's or 1000's of buget to set aside for "cloud cost management", never fear. There's always some enterprising person on the internet who is ready to plug this gap in the market.

Meet [MiserBot](https://www.concurrencylabs.com/blog/introducing-miserbot-aws-cost-
management/). From their marketing material, they are:

:::info MiserBot

>"MiserBot makes it easy for your team to know what’s going on with your AWS cost. It helps you save money and it keeps your team productive."

:::

Okay, not mind-blowingly convincing, but the bot does some good stuff:

* Integrates with Slack
* Calculates the total accumulated AWS cost for the month
* Tells you which AWS services you’re paying for (e.g. EC2, S3, etc.)
* Gives you a list of AWS usage types and their cost in the current month.

Here's a little demo:

<!-- markdownlint-disable MD033 -->
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/OCzRD1E3LZ4?rel=0&amp;controls=0&amp;showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
<!-- markdownlint-enable MD033 -->

The point is - find a tool that will look at and address your cloud costs _specifically_. The thing can be too big and complex to admin and manage "part-time".

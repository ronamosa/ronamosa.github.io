---
title: "Building an AI Twitter Bot Project Using GPT2 and Google Cloud."
author: Ron Amosa
author_title: Platform Security Engineer @ Salesforce U.S.
author_url: https://github.com/ronamosa
author_image_url: https://github.com/ronamosa.png
tags: [project, bot]
---

As I’m prone to do, I started a new project. Yes, without finishing my other projects.

<!--truncate-->

## Trolling for Twitter Bots

I started this one after seeing this really cool blog post by Max Woolf. The post was called “How to Build a Twitter Text-Generating AI Bot With GPT-2” and it showed how he made a twitter bot that used some AI program (he’d also written) to generate text that would read and sound like whoever’s tweets you fed it.

I’ve made twitter bots in the past, mainly for fun, messing with people, but also for learning about writing the bots and process that goes into post tweets to an account via a schedule; reading input from other users @’ing the bot account and responding.

## GPT-2…What is that?

    GPT-2 is a large transformer-based language model with 1.5 billion parameters, trained on a dataset[1] of 8 million web pages. GPT-2 is trained with a simple objective: predict the next word, given all of the previous words within some text.

Basically its a big program that’s been trained by feeding it tonnes of data, and it’s learned to predict “the next word” in a sentence, given all the previous words in the text it’s been fed.

This is pretty cool, but obviously too much of a good thing is going to do the following-

    GPT-2 generates synthetic text samples in response to the model being primed with an arbitrary input. The model is chameleon-like—it adapts to the style and content of the conditioning text. This allows the user to generate realistic and coherent continuations about a topic of their choosing, as seen by the following select samples.

What does this mean? It means the model is able to adapt to the style and content of the data it’s being fed. Which means it can imitate, and sound like people with enough of their writing/text being fed to this program, it can write something that probably sounds a lot like, if not exactly like you.

Scary. Scary, but also fun (if you’re a geek).

Read more about it here: OpenAI Language Models

## Trying it on for size

I went through Max’s blog and installed his gpt2-simple program, downloaded the models, trained them on some twitter data I had downloaded and generated some tweets. Looked good.

Next I built his cloudrun setup where a tweet generating API container would be deployed to cloudrun, and would give you a AI generated tweet from the model you had trained when you sent the API a request via HTTP. The setup had a lot of manual parts, so that got me thinking (of course it did).

    Why not setup a fully automated bot model training and tweeting pipeline?

One where multiple account data would be downloaded, saved to the cloud, used to train a model, the model then used to generate tweets and post them.

And this is how it starts.

## What I’m building

Ok, so what I intend to build will be the following.

* A group of container instances scheduled to download tweet data from a number of accounts (using Cloud Run)
* These containers will save this tweet data to a GCS bucket
* A GPU-enabled VM will be created via terraform and will
  * mount a GCS bucket with trained models in it
  * pull down the new tweet data
  * run gpt2-simple to re-train models.
  * tag & upload newly trained models
* A build pipeline (i.e. Cloud Build) that will:
  * download a tagged trained model
  * bundle together and app and Dockerfile
  * docker build a container with this bundle
  * push the container to GCR.
* Schedule these containers to deploy, run (generates tweet, posts tweets)

I think a lot of this to start with is going to be heavy on the infrastructure and automation side. The twitter bot won’t be much different, if at all, from Max’s work (above).

But once the infra and pipeline is all pumping out & tagging containers, and running the training & tweeting smoothly I think I can start tweaking the actual gpt2 bot.

## Why I’m building this

I’ve always been fascinated by bots, and with the new Machine Learning platforms readily available to everyone (with some disposable income) to just tinker & play with, I really couldn’t resist the urge to a) play with some new tech b) be a troll on twitter (jokes).

I don’t think we’ve ever had this level of access to these big-time, supercomputer tools that were just the playthings of the rich & priviledged (still is to an extent). A big part of me wants to at least be familiar with how much damage the average punter can do with a little know-how, and some AI platforms.

Also, I never have an app to deploy against my infrastructure most of the time so it’s a good exercise in designing, building and (hopefully) testing, monitoring something from woe to go.

Lots to learn, and to blog about while I”m doing it.

:::danger Attention:

Lesshgo!

:::

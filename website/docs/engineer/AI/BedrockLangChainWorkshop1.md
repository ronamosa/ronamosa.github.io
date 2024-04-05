---
title: "Building with Amazon Bedrock and LangChain Workshop"
---

:::info

These are my notes for the [Workshop](https://catalog.workshops.aws/building-with-amazon-bedrock/en-US) Section.

:::

In the workshop you have two methods of running the labs, at an AWS event, or in your own account.

## Running in my own AWS account

### Enable Bedrock

I've already done this.

### AWS Cloud9 setup

spin up a `t3.small` EC2 instance.

pull down the repo:

```bash
cd ~/environment/
curl 'https://static.us-east-1.prod.workshops.aws/public/f95f1813-6d7f-429e-b6ba-f9812fc16bbf/assets/workshop.zip' --output workshop.zip
unzip workshop.zip
```

install requirements

```bash
pip3 install -r ~/environment/workshop/setup/requirements.txt -U
```

test working

```bash
cloudbuilderio:~/environment/workshop $ python3 ./completed/api/bedrock_api.py 

Manchester is the largest and most populous city in New Hampshire.
```

## Foundational Concepts

Play around with examples, play with temp, top p, response length.

View API request doesn't show up on all examples (greyed out).

Here's one:

```bash
aws bedrock-runtime invoke-model \
--model-id meta.llama2-13b-chat-v1 \
--body "{\"prompt\":\"[INST]You are a a very intelligent bot with exceptional critical thinking[/INST]\\nI went to the market and bought 10 apples. I gave 2 apples to your friend and 2 to the helper. I then went and bought 5 more apples and ate 1. How many apples did I remain with?\\n\\nLet's think step by step.\\n\\n\\nFirst, I went to the market and bought 10 apples.\\n\\nThen, I gave 2 apples to your friend.\\n\\nSo, I have 10 - 2 = 8 apples left.\\n\\nNext, I gave 2 apples to the helper.\\n\\nSo, I have 8 - 2 = 6 apples left.\\n\\nNow, I went and bought 5 more apples.\\n\\nSo, I have 6 + 5 = 11 apples left.\\n\\nFinally, I ate 1 apple.\\n\\nSo, I have 11 - 1 = 10 apples left.\\n\\nTherefore, I remain with 10 apples.\",\"max_gen_len\":512,\"temperature\":0.5,\"top_p\":0.9}" \
--cli-binary-format raw-in-base64-out \
--region us-east-1 \
invoke-model-output.txt
```

:::note

The API call was most familiar to me because of my SageMaker LLM project, but for that I pointed at an inference endpoint, whereas here we call the `--model-id`.

:::

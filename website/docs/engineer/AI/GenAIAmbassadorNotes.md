---
title: "AWS GenAI Ambassador Notes"
---

## AWS GenAI Stack

## Infrastructure for FM Training and Inference

### EC2

EC2 capacity blocks for ML.

AWS Neuron SDK supports:

- AWS Trainum
- AWS Trainium2 (train FM)
- AWS Inferentia2
- AWS Inferentia

### SageMaker

- SageMaker HyperPod: resilient (self-healing), scalable (new features: put same endpoint on multiple deployed models, smart routing to get 20% lower latency on average), and cost-effective.
- evaluation of model performance:
  - SageMaker Clarify

## How an Foundation Model is Built

1. pre-training: using unlabeled data to train the model (lots of it)
2. fine-tuning: using labeled data to train the model in a domain-specific task (less of it)
3. evaluation: using a test set to evaluate the model's performance
4. deployment: using SageMaker to deploy the model

### Transformers

transformers are a "model architecture", and a popular one that lead to the current AI revolution.

there are three main sub-types of transformers:

- encoder-only: M5 used by amazon search. only interested in understanding the input, not generating output.
- encoder-decoder: also called seq2seq, for transforming one type of sequence to another e.g. translation, summarization, etc.
- decoder-only: focused on generating output by using previously generated output as context or input.

note: models that have 'decoder' capability are known as "generative" models.

## Selecting and Training a Foundation Model

You can have FM, a general purpose model, or a domain-specific model that is trained for a specific task (fine-tuned).

You can zero-shot or add context to the model, and it will "learn" during inference time without the need to retrain.

You have Foundation Models (FM) and task-specific models (TSM).

Performance-wise, FM is better for general purpose tasks, while TSM is better for specific tasks.

What advantage does an FM have over a TSM?

- TSM is expensive to train, and requires a lot of labeled data, expert staff, and time.
- TSM is limited to the specific task it was trained for.
- FM is cheaper to train, and can be used for a wider range of tasks cos it's a general purpose model.

Other options?

### Fine-tuning a Foundation Model

FM is a swiss army knife, multiple tasks out of the box. But you can also customize it for a specific task by fine-tuning it.

## Inference (Running a model)

expensive to run big models, so you need to optimize for cost.

how? a couple of techniques:

- quantization: reducing the number of bits used to represent the model's weights, which reduces the model's size and inference latency.
- pruning: removing weights from the model that are not needed for a specific task, which reduces the model's size and inference latency.
- knowledge distillation: using a smaller model to mimic the behavior of a larger model, which reduces the model's size and inference latency.

interesteing note, if you quant a 500B model and a 100B model, both down to 10B, the 500B model will have a higher accuracy than the 100B model at the same cost of running.

### Model Compression

the trade-off is between accuracy and cost or efficiency.

some disadvatanges of model compression:

- slower inference per token.
- higher memory requirements.
- loss of information.
- harder to train.
- robustness issues.
- maintenance issues.

## Issues with LLMs

most of these fit under the heading "responsible AI":

- hallucinations: the model makes up information that is not true.
- toxicity: the model generates harmful or offensive content.
- bias: the model perpetuates existing societal biases.
- safety: the model may generate harmful or dangerous content.
- cost: the model is expensive to run.

## GenAI Opportunities

- healthcare:
  - clinical decision support
  - drug discovery
  - personalized medicine
  - patient monitoring
  - clinical research
- finance:
  - fraud detection
  - credit scoring
  - risk management
  - customer service
- media and entertainment:
  - content creation
  - content moderation
  - content recommendation
  - content personalization
- education:
  - personalized learning
  - automated grading
  - content creation
  - chatbots for Q&A
- automotive and manufacturing:
  - predictive maintenance
  - quality control
  - supply chain optimization
  - customer service

## AWS Points of Distinction

1. Model democratization: lots of choice of FM
2. Secure Environment: Bedrock creates a copy of the base model that's only accessible to the user. The user can train on their own data, privately, and none of the customers data is used for training the original base model.
3. Easy to use: deploy, train, integrate models into your applications.
4. Cost-effective: offers most price-performant models e.g. inf2 (inferentia 2 chip) up to 4x higher throughput and 10x lower latency than previous generation.

## LLM Primer - In Context Learning

"in context is a type of prompt engineering".

I ask the model to summarize a text, and provide the text as context. this is called "zero shot learning".

providing more context to the model, in the form of examples, is called "few shot learning".

remember as more context is provided, the model's performance improves, but the "context window" is limited.

if you are getting to the limit of the context window, one thing you can look at is "fine-tuning" the model.

## Prompt Engineering

see [guide](https://promptingguide.ai/)

### LLM Settings

- temperature: controls the randomness of the output. lower is more deterministic, higher is more random.
- top_p: controls the diversity of the output. lower is more deterministic, higher is more random.
- max length: controls the maximum length of the output, prevents long or irrelevant outputs and controls cost.
- frequency_penalty: controls the likelihood of repeating tokens. applies a penalty to the next token proportional to how often it has appeared in the text so far.
- presence_penalty: controls the likelihood of repeating tokens. applies a penalty to the next token like a frequency penalty, however the penalty is the same for all tokens.

:::warning

alter temperature or Top P, but not both.

:::

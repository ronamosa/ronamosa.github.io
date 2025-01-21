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

### Shots, shots, shots

- zero shot: instruction with no examples provided.
- few shot: instruction with examples provided. few shot prompts allow the model to learn from examples (in context learning).

### Elements of Prompt Engineering

- **Instruction**: the task you want the model to perform.
- **Context**: the data you provide to the model to help it understand the task.
- **Input Data**: user's question, or input that we want a response to.
- **Output Indicator**: the type or format of the output you want the model to generate.

:::note

you don't need all of these elements, but they can help you get the model to do what you want.

:::

example:

- instruction: "classify the sentiment of the text as positive or negative"
- context: "the text is about a bad review of a product"
- input data: "text: the product is not good"
- output indicator: "sentiment:"

and then the LLM will generate a summary of the text i.e. "negative".

note: ^ zero shot prompt.

#### Conversational Prompting

- conversational prompting: the model is given a conversation history and the user's question, and the model is asked to respond to the user's question based on the conversation history.

you're essentially priming the model with a conversation history, showing it how a response should look based on a question, and also including what you want the "persona" of the model to be.

e.g. 

```text
the following is a conversation between a user and a model. the model is a helpful assistant.

user: what is the weather in boston?
model: the weather in boston is 70 degrees.
user: what are some fun things to do in boston?
model:
```

#### Reasoning

is hard. `o1` seems to be the advent of reasoning-emphasized models. improve reasoning by providing more context, and also by using tools.

if your model is still struggling, you can try breaking down the task into smaller tasks and demonstrate that to the model.

in which case you want to use "chain of thought" prompting.

#### Chain of Thought

"...CoT prompting enables complex reasoning capabilities through intermediate reasoning steps."

for example you few-shot this, with no intermediate reasoning step:

```text
the odd numbers in this group add up to 10: 1, 3, 4, 7, 8
A: this is true.
the odd numbers in this group add up to 10: 1, 3, 5, 7, 8, 2
A:
```

and get the wrong answer.

or you can also do this, which has intermediate reasoning steps:

```text
the odd numbers in this group add up to 10: 1, 3, 4, 7, 8
A: adding all the odd numbers together, we get 11. The answer is false.
the odd numbers in this group add up to 10: 1, 3, 5, 7, 8, 2
A:
```

and show the model how to work out the answer.

the other way of activating "chain of thought" is to say "let's think step by step" in the prompt.

#### Generate Knowledge

Generate Knowledge prompting is a technique where you ask the model to generate knowledge based on some information you provide i.e. you don't give the model the answers, you just provide some facts, and the model will generate "knowledge" based on the facts.

e.g.

```text
Topic: BMI and Polynesian People

Generate knowledge:

- BMI (Body Mass Index) was developed based primarily on European body types
- BMI uses a simple height-to-weight ratio calculation
- Polynesian peoples typically have higher bone density and muscle mass
- Traditional Polynesian diets were high in nutrients and supported muscular builds
- Pacific Islander body compositions often differ significantly from European averages
- Polynesian peoples have historically been very active, with swimming, canoeing, and physical labor
- Studies show BMI overestimates obesity rates in Polynesian populations
- Different ethnic groups have different healthy body composition ranges
- Some health organizations have developed specific BMI ranges for Pacific peoples
- Traditional measures of health in Polynesian cultures often focused on strength and functionality
- Modern research suggests BMI thresholds should be adjusted for different ethnicities
- New Zealand and other Pacific nations have modified BMI guidelines for Polynesian populations

Question: Why might standard BMI measurements be inappropriate for assessing health in Polynesian populations?

Follow-up questions:

1. What alternative health measurements might be more appropriate?
2. How have health organizations adapted their guidelines for Polynesian populations?
3. What historical and cultural factors should be considered when discussing body composition in Polynesian peoples?
```

this is like a really weak form of 'RAG' (retrieval-augmented generation), where the fundamental concept is "gather relevant information first, and then use it to generate a response".

note: this prompt is really biasing the answer, essentially it feeds the model the conclusions, which is then summarised. the following is a much better example.

```text
Topic: BMI and Polynesian People

Generate base facts:

- BMI calculation: weight(kg)/height(m)²
- Global BMI ranges: <18.5 underweight, 18.5-24.9 normal, >25 overweight
- Average bone density ranges across populations
- Muscle mass vs fat mass density differences
- Polynesian population anthropometric data
- Historical Pacific Islander activity patterns
- Traditional Polynesian dietary components

Question: What implications might these facts have for using BMI as a health metric for Polynesian people?
```

#### Prompt Chaining

Chain the output of one prompt to the input of another prompt.

User has a question: `Question: what are the most relevant quotes from the document?`

e.g.

Prompt 1:

```text

you are a helpful assistant. you summarise documents, delimited by ###, by first finding all relevant quotes, and then summarising them. please output quotes using <quote></quote> tags. respond with "no quotes found" if no quotes are found.

### Document

{{document}}
```

the output looks like this:

```text
<quote>
 - quote 1
 - quote 2
 - quote 3
</quote>
```

Prompt 2:

```text

given a set of quotes, (delimited by <quote></quote> tags), extracted from a document, original document is delimited by ###, comnpose an answer to the question. ensure the answer is accurate and relevant to the question, has a friendly tone, and is concise.
```

output of prompt 2:

```text
the most relevant quotes from the document are:

- quote 1
- quote 2
- quote 3
```

the output of prompt 2 is the answer to the user's question.

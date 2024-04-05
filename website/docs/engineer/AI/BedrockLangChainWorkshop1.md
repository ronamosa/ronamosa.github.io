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

### Local Setup

Please note, for a few of the labs I ran it in my local Linux environment which required specific setup to get things going.

I still downloaded the `workshop.zip` and followed instructions as per, but had to tweak my environment along the way.

A few things if you're going to run local, in the root `workshop/` directory:

1. create a virtual env: `python3 -m venv .env`
2. activate it: `source .env/bin/activate`
3. install dependencies `pip3 install -r requirements`

I will list my compiled requirements.txt here:

```text
# requirements
boto3
langchain_community
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

### API

```python
import json
import boto3

session = boto3.Session()

bedrock = session.client(service_name='bedrock-runtime') #creates a Bedrock client

bedrock_model_id = "ai21.j2-ultra-v1" #set the foundation model

prompt = "What's the name of the emerald mine that Elon Musk's father owns?" #the prompt to send to the model

body = json.dumps({
    "prompt": prompt, #AI21
    "maxTokens": 1024, 
    "temperature": 0, 
    "topP": 0.5, 
    "stopSequences": [], 
    "countPenalty": {"scale": 0 }, 
    "presencePenalty": {"scale": 0 }, 
    "frequencyPenalty": {"scale": 0 }
}) #build the request payload

# invoke

response = bedrock.invoke_model(body=body, modelId=bedrock_model_id, accept='application/json', contentType='application/json') #send the payload to Bedrock

response_body = json.loads(response.get('body').read()) # read the response

response_text = response_body.get("completions")[0].get("data").get("text") #extract the text from the JSON response

print(response_text)
```

output

```bash
~/R/AWSB/w/l/api ❯ python3 ./bedrock_api.py

Elon Musk's father, Errol Musk, owns the emerald mine in Chivor, Colombia.
```

I originally set my prompt to `"Write a poem about Serena Williams"` and this is what I got:

```text
~/R/AWSB/w/l/api ❯ python3 ./bedrock_api.py             took 4s

Manchester is the largest and most populous city in New Hampshire.

~/R/AWSB/w/l/api ❯ python3 ./bedrock_api.py            took 19s

Serena Williams,

A champion on the court,

A role model off,

A fierce competitor,

A fierce advocate for equality,

A fierce advocate for women's rights,

A fierce advocate for social justice,

A fierce advocate for change,

A fierce advocate for herself,

A fierce advocate for others,

A fierce advocate for the game,

A fierce advocate for the sport,

A fierce advocate for the world,

A fierce advocate for humanity,

A fierce advocate for love,

A fierce advocate for life,

A fierce advocate for everything,

A fierce advocate for nothing,

A fierce advocate for everything,

A fierce advocate for nothing,
...

# repeats the everything, nothing line again 263 times!!!
```

a bit 😬.

:::tip Speed

✅ For the single answer questions, the API is really quite fast: ~4s

⚠️ The poem took a while ~19s but from the output, looked caught in a loop.

:::

### Langchain

:::info

|         | ✅ Pros             | ❌ Cons             |
|---------|---------------------|---------------------|
| boto3   | more control, details | have to handle, manage more details |
| Langchain | abstracted, focus on text in and out | less verbose, granular than boto3 |

:::

Code:

```python title="bedrock_langchain.py" showLineNumbers
from langchain_community.llms import Bedrock

llm = Bedrock( #create a Bedrock llm client
    model_id="ai21.j2-ultra-v1" #set the foundation model
)

prompt = "What is the largest city in New Zealand?"

response_text = llm.invoke(prompt) #return a response to the prompt

print(response_text)
```

output

```bash
~/R/AWSB/w/l/langchain ❯ python3 ./bedrock_langchain.py 

The largest city in New Zealand is Auckland, with a population of approximately 1.5 million. It is located
```

Code must smaller than with `boto3`.

### Inference Parameters

:::caution missing updates.

I had to update some details in the workshop code as default params for the models had been updated e.g. for Anthropic, the parameter is replaced `max_tokens` with `max_tokens_to_sample`

:::

```python title="params.py" showLineNumbers
import sys
from langchain_community.llms import Bedrock

def get_inference_parameters(model): #return a default set of parameters based on the model's provider
    bedrock_model_provider = model.split('.')[0] #grab the model provider from the first part of the model id
    
    if (bedrock_model_provider == 'anthropic'): #Anthropic model
        return { #anthropic
            "max_tokens_to_sample": 512, # my update
            "temperature": 0, 
            "top_k": 250, 
            "top_p": 1, 
            "stop_sequences": ["\n\nHuman:"] 
           }
    
    elif (bedrock_model_provider == 'ai21'): #AI21
        return { #AI21
            "maxTokens": 512, 
            "temperature": 0, 
            "topP": 0.5, 
            "stopSequences": [], 
            "countPenalty": {"scale": 0 }, 
            "presencePenalty": {"scale": 0 }, 
            "frequencyPenalty": {"scale": 0 } 
           }
    
    elif (bedrock_model_provider == 'cohere'): #COHERE
        return {
            "max_tokens": 512,
            "temperature": 0,
            "p": 0.01,
            "k": 0,
            "stop_sequences": [],
            "return_likelihoods": "NONE"
        }
    
    elif (bedrock_model_provider == 'meta'): #META
        return {
            "temperature": 0,
            "top_p": 0.9,
            "max_gen_len": 512
        }
    
    elif (bedrock_model_provider == 'mistral'): #MISTRAL
        return {
            "max_tokens" : 512,
            "stop" : [],    
            "temperature": 0,
            "top_p": 0.9,
            "top_k": 50
        } 

    else: #Amazon
        #For the LangChain Bedrock implementation, these parameters will be added to the 
        #textGenerationConfig item that LangChain creates for us
        return { 
            "maxTokenCount": 512, 
            "stopSequences": [], 
            "temperature": 0, 
            "topP": 0.9 
        }

# setup a function that pulls our request params together
def get_text_response(model, input_content): #text-to-text client function
    
    model_kwargs = get_inference_parameters(model) #get the default parameters based on the selected model
    
    llm = Bedrock( #create a Bedrock llm client
        model_id=model, #use the requested model
        model_kwargs = model_kwargs
    )
    
    return llm.invoke(input_content) #return a response to the prompt

# make a call, capture in response
response = get_text_response(sys.argv[1], sys.argv[2])

print(response)
```

Run it with args (cos you asked for `sys.argv[1]` and `sys.argv[2]`):

`python3 ./params.py "ai21.j2-ultra-v1" "Write a haiku:"`

output:

```bash
~/R/AWSB/w/l/params ❯ python3 ./params.py "ai21.j2-ultra-v1" "Write a haiku:"

leaves rustle in breeze
autumn colors slowly fade
nature's symphony
```

### Control Response Variability

```python title="temperature.py" showLineNumbers
import sys
from langchain_community.llms import Bedrock

def get_text_response(input_content, temperature): #text-to-text client function
  
  model_kwargs = { #AI21
      "maxTokens": 1024, 
      "temperature": temperature, 
      "topP": 0.5, 
      "stopSequences": [], 
      "countPenalty": {"scale": 0 }, 
      "presencePenalty": {"scale": 0 }, 
      "frequencyPenalty": {"scale": 0 } 
  }
  
  llm = Bedrock( #create a Bedrock llm client
      model_id="ai21.j2-ultra-v1",
      model_kwargs = model_kwargs
  )
  
  return llm.invoke(input_content) #return a response to the prompt

for i in range(3):
  response = get_text_response(sys.argv[1], float(sys.argv[2]))
  print(response)
```

Basically, you're setting up the function to take `temperature` argument from user, pass it into the model kwargs.

A temperature of `0.0` should give you same reponse every time, anything over that should have some variety.

output:

```bash
/workshop/labs/temperature ❯ python3 ./temperature.py "Write a haiku about China" 1.0s

China - vast and ancient
A land of contrasts and wonders
A tapestry woven

China - vast and ancient
A land of contrasts and mystery
A tapestry woven through time

China - vast and ancient
A land of contrasts and wonders
A tapestry woven
/workshop/labs/temperature ❯ python3 ./temperature.py "Write a haiku about China" 1.0s

China - vast and ancient
A land of contrasts and mystery
A tapestry woven through time

China - vast and ancient
A land of contrasts and wonders
A journey to discovery

China - vast and ancient
A land of contrasts and wonders
A tapestry woven
/workshop/labs/temperature ❯ python3 ./temperature.py "Write a haiku about China" 1.0s

China - vast and ancient
A land of contrasts and wonders
A place to discover

China - vast and ancient
A land of contrasts and wonders
A journey to discovery

China - vast and ancient
A land of contrasts and mystery
A tapestry woven through time
/workshop/labs/temperature ❯ python3 ./temperature.py "Write a haiku about China" 1.0s

China - vast and ancient
A land of contrasts and mystery
A fascinating country

China - vast and ancient
A land of contrasts and wonders
A journey to discovery

China - vast and ancient
A land of contrasts and mystery
A tapestry woven through time
/workshop/labs/temperature ❯ python3 ./temperature.py "Write a haiku about China" 1.0s

China - vast and ancient
A land of contrasts and mystery
A tapestry woven through time

China - vast and ancient
A land of contrasts and wonders
A culture rich and beautiful

China - vast and ancient
A land of contrasts and mystery
A world of wonder
```

:::note

Pretty shit tbh 🤣

:::

### Streaming API

```python title="streaming.py" showLineNumbers
import json
import boto3

session = boto3.Session()

bedrock = session.client(service_name='bedrock-runtime') #creates a Bedrock client

def chunk_handler(chunk):
  print(chunk, end='')

def get_streaming_response(prompt, streaming_callback):

  bedrock_model_id = "anthropic.claude-3-sonnet-20240229-v1:0" #set the foundation model

  body = json.dumps({
    "prompt": prompt, #ANTHROPIC
    "max_tokens": 4000,
    "temperature": 0, 
    "top_k": 250, 
    "top_p": 1, 
    "stop_sequences": ["\n\nHuman:"] 
})
  
  
  
  body = json.dumps({
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 8000,
    "temperature": 0,
    "messages": [
      {
        "role": "user",
        "content": [{ "type": "text", "text": prompt } ]
      }
    ],
  })
  
  response = bedrock.invoke_model_with_response_stream(modelId=bedrock_model_id, body=body) #invoke the streaming method
  
  for event in response.get('body'):
    chunk = json.loads(event['chunk']['bytes'])

    if chunk['type'] == 'content_block_delta':
      if chunk['delta']['type'] == 'text_delta':
        streaming_callback(chunk['delta']['text'])

prompt = "Tell me a story about two puppies and two kittens who became best friends:"

get_streaming_response(prompt, chunk_handler)
```

Clunky, but works as expected:

```bash
workshop/labs/intro_streaming ❯ python3 ./intro_streaming.py                                                                                                            took  10s  .env at  12:42:30
Here is a story about two puppies and two kittens who became best friends:

Daisy and Buddy were two rambunctious golden retriever puppies who loved to play and get into mischief. One sunny day, they dug their way under the fence into the neighbor's yard. To their surprise, they came face to face with two tiny kittens named Smokey and Ginger who had been born just a few weeks earlier. 

At first, the puppies and kittens were wary of each other, having never seen animals like that before. Daisy barked and Buddy wagged his tail furiously. Smokey arched his back and hissed while little Ginger tried to hide behind a potted plant. But after circling each other cautiously, Daisy plopped down and let out a friendly puppy whine. Smokey was the first to relax, sniffing at the puppies' faces.

From that day on, the four became an inseparable crew. The puppies were infinitely gentle and patient, letting the kittens climb all over them. They taught the kittens to play chase and tug-of-war with old socks. The kittens showed the puppies how to stalk and pounce on toys. They napped together in warm puppy piles, taking turns grooming each other's fur.

As they grew older, their differences didn't matter at all. Daisy, Buddy, Smokey and Ginger were the best of friends who loved romping in the yard, going on walks together, and curling up side-by-side at naptime and bedtime. Their unique little family brought joy to all the neighbors who watched their silly antics and special bond. The four friends proved that differences don't matter when you have fun, caring companions to share your days with.%
```

### 







## Troubleshooting

### Error Messages

When I tried `python3 ./params.py "anthropic.claude-v2" "Write a haiku:"`

I got this error:

```bash
Traceback (most recent call last):
  File "/home/rxhackk/.local/lib/python3.10/site-packages/langchain_community/llms/bedrock.py", line 444, in _prepare_input_and_invoke
    response = self.client.invoke_model(**request_options)
  File "/home/rxhackk/.local/lib/python3.10/site-packages/botocore/client.py", line 553, in _api_call
    return self._make_api_call(operation_name, kwargs)
  File "/home/rxhackk/.local/lib/python3.10/site-packages/botocore/client.py", line 1009, in _make_api_call
    raise error_class(parsed_response, operation_name)
botocore.errorfactory.ValidationException: An error occurred (ValidationException) when calling the InvokeModel operation: Malformed input request: #: extraneous key [max_tokens] is not permitted, please reformat your input and try again.
```

As at `April 6th, 2024` the models parameters have been updated (per [docs](https://us-east-1.console.aws.amazon.com/bedrock/home?region=us-east-1#/providers?model=anthropic.claude-v2:1)) to the following:

```bash
{
  "modelId": "anthropic.claude-v2:1",
  "contentType": "application/json",
  "accept": "*/*",
  "body": "{\"prompt\":\"\\n\\nHuman: Hello world\\n\\nAssistant:\",\"max_tokens_to_sample\":300,\"temperature\":0.5,\"top_k\":250,\"top_p\":1,\"stop_sequences\":[\"\\n\\nHuman:\"],\"anthropic_version\":\"bedrock-2023-05-31\"}"
}
```

I tested the other models, and their default params haven't changed:

```bash title="cohere"
/workshop/labs/params ❯ python3 ./params.py "cohere.command-text-v14" "Write a haiku:"                     .env at  12:11:23
 Haiku is a form of Japanese poetry that consists of three lines. The first line has five syllables, the second line has seven syllables, and the third line has five syllables. Here is an example of a haiku:

Spring rain opening
the silent flowers after
a cold, dry winter

Would you like me to write another haiku for you? 
```

```bash title="meta"
/workshop/labs/params ❯ python3 ./params.py "meta.llama2-13b-chat-v1" "Write a haiku:"          took  4s  .env at  12:16:26
The sun sets slowly
Golden hues upon the sea
Peaceful evening sky
```

```bash title="mistral"
/workshop/labs/params ❯ python3 ./params.py "mistral.mistral-7b-instruct-v0:2" "Write a haiku:"            .env at  12:17:09

Autumn leaves fall slow
Whispers of the wind’s song
Nature’s symphony

Haiku is a form of traditional Japanese poetry. It consists of three lines with a 5-7-5 syllable count. The haiku should capture a moment in nature and convey a sense of seasonality and imagery. In this haiku, I have tried to capture the feeling of autumn leaves falling slowly and the sound of the wind as it rustles through them. The phrase "Nature's symphony" is used to emphasize the beauty and harmony of the natural world during this season.
```

```bash title="amazon"
python3 ./params.py "amazon.titan-text-express-v1" "Write a haiku:"                                                                                          .env at  12:17:31
I am a
I am a bookworm
I read a lot
```

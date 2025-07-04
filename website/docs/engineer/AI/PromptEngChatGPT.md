---
title: "ChatGPT Prompt Engineering for Developers"
---

:::info

Link to [Guidelines](https://learn.deeplearning.ai/chatgpt-prompt-eng/lesson/2/guidelines) Section.

:::

I can't remember how I found this, but I thought I'd go through this and learn a few things. Course uses an embedded Jupyter notebook to run python code and provides the OpenAI API key to be used.

## Guidelines

1. Principle 1: write clear and specific instructions
2. Principle 2: give the model time to "think"

### Helper Function

This is your helper function to call OpenAI API

```python
import openai
import os

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())

openai.api_key  = os.getenv('OPENAI_API_KEY')

def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0, # this is the degree of randomness of the model's output
    )
    return response.choices[0].message["content"]
```

### P1. Write Clear Instructions

#### Tactic 1 - Use delimiters to clearly mark input

Delimiters can be anything, backticks, tags, `<>` etc e.g. 3x backticks

e.g.

```python
text = f"""
This can be anything\
You want it to be\
"""
prompt = f"""
Summarize the text delimited by triple backticks \
into a single sentence.
```{text}```
"""
response = get_completion(prompt)
print(response)
```

#### Tactic 2 - instruct it to provide structure output

```python
prompt = f"""
Generate a list of three made-up book titles along \
with their authors and genres.
Provide them in JSON format with the following keys:
book_id, title, author, genre.
"""
response = get_completion(prompt)
print(response)
```

output instructions = `Provide them in JSON format with the following keys: book_id, title, author, genre.`

here's another example where you instruct it on how you want it to structure the output

```python

# Everything under 'Use the following format:'

prompt_2 = f"""
Your task is to perform the following actions:
1 - Summarize the following text delimited by
  <> with 1 sentence.
2 - Translate the summary into French.
3 - List each name in the French summary.
4 - Output a json object that contains the
  following keys: french_summary, num_names.

Use the following format:
Text: <text to summarize />
Summary: <summary />
Translation: <summary translation />
Names: <list of names in Italian summary />
Output JSON: <json with summary and num_names />

Text: <{text}>
"""
response = get_completion(prompt_2)
print("\nCompletion for prompt 2:")
print(response)
```

#### Tactic 3 - ask the model to check if conditions were satisfied

```python
text_1 = f"""
Making a cup of tea is easy! First, you need to get some \
water boiling. While that's happening, \
grab a cup and put a tea bag in it. Once the water is \
hot enough, just pour it over the tea bag. \
Let it sit for a bit so the tea can steep. After a \
few minutes, take out the tea bag. If you \
like, you can add some sugar or milk to taste. \
And that's it! You've got yourself a delicious \
cup of tea to enjoy.
"""

# You have this block of text above ^^^

# In your prompt you tell the model where to find the delimited input = triple quotes.
# You give it instructions for output = If...Step 1...
# You tell it the "else" = then simply write...

prompt = f"""
You will be provided with text delimited by triple quotes.
If it contains a sequence of instructions, \
re-write those instructions in the following format:

Step 1 - ...
Step 2 - …
…
Step N - …

If the text does not contain a sequence of instructions, \
then simply write \"No steps provided.\"

\"\"\"{text_1}\"\"\"
"""
response = get_completion(prompt)
print("Completion for Text 1:")
print(response)
```

#### Tactic 4 - "few shot" prompting

This is where you "model" the types (style?) of answers you want the LLM to give you. In the below, in conversation style, you provide ONE example, child, then grandparent, then child again... and the LLM will "complete the pattern" you have exemplified:

```python
prompt = f"""
Your task is to answer in a consistent style.

<child />: Teach me about patience.

<grandparent />: The river that carves the deepest \
valley flows from a modest spring; the \
grandest symphony originates from a single note; \
the most intricate tapestry begins with a solitary thread.

<child />: Teach me about resilience.
"""
response = get_completion(prompt)
print(response)
```

### P2. Give the Model time to "think"

#### Tactic 1 - specify steps required to complete the task

Give a block of text=`text`

Prompt provides the step by step instructions to be done

```python
text=f"""
Whatever....
"""

# example 1
prompt_1 = f"""
Perform the following actions:
1 - Summarize the following text delimited by triple \
backticks with 1 sentence.
2 - Translate the summary into French.
3 - List each name in the French summary.
4 - Output a json object that contains the following \
keys: french_summary, num_names.

Separate your answers with line breaks.

Text:
```{text}```
"""
response = get_completion(prompt_1)
print("Completion for prompt 1:")
print(response)
```

Then you can also ask for specific output format i.e. JSON or the [output tactic above](#tactic-2---instruct-it-to-provide-structure-output).

#### Tactic 2 - instruct model to work out its own solution, dont rush a conclusion

This is a much bigger prompt, where we have a) instructions b) output structure we want and c) the question

Dont just prompt to say:

```python
prompt = f"""
Determine if the student's solution is correct or not.

Question:...
...
"""
```

Instead, be very explicit:

```python
prompt = f"""
Your task is to determine if the student's solution \
is correct or not.
To solve the problem do the following:
- First, work out your own solution to the problem.
- Then compare your solution to the student's solution \
and evaluate if the student's solution is correct or not.
Don't decide if the student's solution is correct until
you have done the problem yourself.
```

follow that with the output you want e.g.

```python
"""
Question:
```question here```

Answer:
```corrent or incorrect```

"""
```

And because `question here` is between the delimters, the actual question from the `text=some text e.g. the question` gets substituted in. So too, you have the heading `Answer:` and then the model will determine if the students answer is `correct` or `incorrect`.

### Model Limitations: Hallucinations

Reduce hallucinations by using these tactics in this guidelines section, but also to ask the model to "first find relevant information, and then answer the qeustion based on the relevant information" - have a way to trace the answer back to a *source document* will help it move away from hallucinations.

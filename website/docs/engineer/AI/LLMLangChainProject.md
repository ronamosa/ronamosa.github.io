---
title: "Learning LLM LangChain: Building an AutoGPT"
---

:::info

Following [LangChain Crash Course: Build a AutoGPT app in 25 minutes!](https://www.youtube.com/watch?v=MlK6SIjcjE8&ab_channel=NicholasRenotte) by Nicholas Renotte.

:::

## What does this do?

Langchain "chains together" different calls to LLM API's, to co-ordinate a sort of task manager or "agent", if you will.

This particular app does the following

- generates a Youtube video script
- based on the topic or subject you enter
- uses `PromptTemplate` to separate and capture the title and the script of the video
- uses `ConversationBufferMemory` to remember the "conversation" of the title and script history
- uses the OpenAI API via `llm` and feeds this inside `LLMChain` which is chaining the title_template and the title_memory together, and the same for script.
- uses `WikipediaAPIWrapper` to "wrap" the prompt (i.e. what the user fed to `streamlit`) and send it to Wiki's API for info
- then formats and lays everything out nicely with streamlit object `st`

## Pre-requisites

Git Repo: `https://github.com/nicknochnack/Langchain-Crash-Course.git`, go ahead and `git clone...` that.

You only need two files:

1. `appkey.py` ⬅️ get your LLM API key into there.
2. `app.py`

install the following:

```sh
pip install streamlit langchain openai wikipedia chromadb tiktoken
```

To run the app, run `streamlit run app.py`

## Code

This is `app.py`

```python
# Bring in deps
import os 
from apikey import apikey 

import streamlit as st 
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain, SequentialChain 
from langchain.memory import ConversationBufferMemory
from langchain.utilities import WikipediaAPIWrapper 

os.environ['OPENAI_API_KEY'] = apikey

# App framework
st.title('🦜🔗 YouTube GPT Creator')
prompt = st.text_input('Plug in your prompt here') 

# Prompt templates
title_template = PromptTemplate(
    input_variables = ['topic'], 
    template='write me a youtube video title about {topic}'
)

script_template = PromptTemplate(
    input_variables = ['title', 'wikipedia_research'], 
    template='write me a youtube video script based on this title TITLE: {title} while leveraging this wikipedia reserch:{wikipedia_research} '
)

# Memory 
title_memory = ConversationBufferMemory(input_key='topic', memory_key='chat_history')
script_memory = ConversationBufferMemory(input_key='title', memory_key='chat_history')


# Llms
llm = OpenAI(temperature=0.9) 
title_chain = LLMChain(llm=llm, prompt=title_template, verbose=True, output_key='title', memory=title_memory)
script_chain = LLMChain(llm=llm, prompt=script_template, verbose=True, output_key='script', memory=script_memory)

wiki = WikipediaAPIWrapper()

# Show stuff to the screen if there's a prompt
if prompt: 
    title = title_chain.run(prompt)
    wiki_research = wiki.run(prompt) 
    script = script_chain.run(title=title, wikipedia_research=wiki_research)

    st.write(title) 
    st.write(script) 

    with st.expander('Title History'): 
        st.info(title_memory.buffer)

    with st.expander('Script History'): 
        st.info(script_memory.buffer)

    with st.expander('Wikipedia Research'): 
        st.info(wiki_research)
```

## LangChain Output

This is what the output looks like, which the app shows each chain being processed (pretty cool actually!)

```bash
parallax@dev:~/repos/Langchain-Crash-Course$ streamlit run app.py

Collecting usage statistics. To deactivate, set browser.gatherUsageStats to False.


  You can now view your Streamlit app in your browser.

  Network URL: http://172.16.2.101:8501
  External URL: http://115.188.132.124:8501



> Entering new LLMChain chain...
Prompt after formatting:
write me a youtube video title about Cloud Computing

> Finished chain.


> Entering new LLMChain chain...
Prompt after formatting:
write me a youtube video script based on this title TITLE: 

"Cloud Computing for Beginners: A Guide to Getting Started" while leveraging this wikipedia reserch:Page: Cloud computing
Summary: Cloud computing is the on-demand availability of computer system resources, especially data storage (cloud storage) and computing power, without direct active management by the user. Large clouds often have functions distributed over multiple locations, each of which is a data center. Cloud computing relies on sharing of resources to achieve coherence and typically uses a pay-as-you-go model, which can help in reducing capital expenses but may also lead to unexpected operating expenses for users.



Page: Cloud computing security
Summary: Cloud computing security or, more simply, cloud security, refers to a broad set of policies, technologies, applications, and controls utilized to protect virtualized IP, data, applications, services, and the associated infrastructure of cloud computing. It is a sub-domain of computer security, network security, and, more broadly, information security.

Page: Cloud-native computing
Summary: Cloud native computing is an approach in software development that utilizes cloud computing to "build and run scalable applications in modern, dynamic environments such as public, private, and hybrid clouds". These technologies such as containers, microservices, serverless functions, cloud native processors and immutable infrastructure, deployed via 
declarative code are common elements of this architectural style. Cloud native technologies focus on minimizing users' operational burden.Cloud native techniques "enable loosely coupled systems that are resilient, manageable, and observable. Combined with robust automation, they allow engineers to make high-impact changes frequently and predictably with minimal toil."Frequently, cloud-native applications are built as a set of microservices that run in Open Container Initiative compliant containers, such as Containerd, and may be orchestrated in Kubernetes and managed and deployed using DevOps and Git CI workflows (although there is a large amount of competing open source that supports cloud-native development). The advantage of using containers is the ability to package all software needed to execute into one executable package. The container runs in a virtualized environment, which isolates the contained application from its environment. 

> Finished chain.
```

## The Final Script

```plaintext
"Introduction to Cloud Computing: Exploring the Benefits and Challenges"

Script:

Hello and welcome to this YouTube video introduction to cloud computing. Cloud computing is the on-demand availability of computer system resources, such as data storage and computing power, to users without active management. It allows for cost savings, scalability, and efficiency - but it also brings new challenges.

Today, we’ll begin by exploring the benefits of cloud computing for users. We’ll discuss the cost savings of cloud computing, as well as its scalability and efficiency. We’ll then discuss the various cloud security measures (such as policies, technologies, and applications) that are used to protect data and applications.

After that, we’ll explore what cloud-native computing is. We’ll talk about how it uses containers, microservices, and serverless functions to create scalability and minimize operational burden. We’ll discuss how cloud-native can be deployed with declarative code and orchestrated in Kubernetes.

Finally, we’ll end by discussing some of the challenges that come with cloud computing, such as security concerns and data privacy.

That’s it for the introduction to cloud computing. Now you know the benefits
```

:::tip Next Project?

Talk with PDFs i.e. use LangChain to upload (locally) and "chat" with my PDF files

:::

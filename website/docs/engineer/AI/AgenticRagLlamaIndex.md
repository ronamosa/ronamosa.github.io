---
title: "Building Agentic RAG with LlamaIndex - Advanced AI Agent Development"
description: "Complete guide to building agentic RAG systems with LlamaIndex. Learn advanced AI agent development, retrieval-augmented generation, and intelligent document processing."
keywords: ["agentic rag", "llamaindex", "ai agents", "rag system", "retrieval augmented generation", "llm agents", "intelligent agents", "ai development"]
tags: ["ai", "rag", "llamaindex", "agents", "llm"]
sidebar_position: 3
---

:::info

Link to [DeepLearning.AI](https://learn.deeplearning.ai/courses/building-agentic-rag-with-llamaindex/lesson/1/introduction) Section.

:::


## Router Query Engine

- import libs
- setup API key
- load, split and get nodes from document
- setup LLM and embedding
- create indexes, summary, vector

```python
import os
import nest_asyncio
from llama_index.core import SimpleDirectoryReader
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core import Settings
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import SummaryIndex, VectorStoreIndex
from llama_index.core.tools import QueryEngineTool
from llama_index.core.query_engine.router_query_engine import RouterQueryEngine
from llama_index.core.selectors import LLMSingleSelector
from .utils import get_router_query_engine

def get_openai_api_key():
    openai_api_key = os.getenv("OPENAI_API_KEY")
    return openai_api_key

OPENAI_API_KEY = get_openai_api_key()

nest_asyncio.apply()

# load documents
documents = SimpleDirectoryReader(input_files=["metagpt.pdf"]).load_data()

# split documents into nodes
splitter = SentenceSplitter(chunk_size=1024)
nodes = splitter.get_nodes_from_documents(documents)

# set up LLM and embeddings
Settings.llm = OpenAI(model="gpt-3.5-turbo")
Settings.embed_model = OpenAIEmbedding(model="text-embedding-ada-002")

# create indexes
summary_index = SummaryIndex(nodes)
vector_index = VectorStoreIndex(nodes)
```

:::note

**Summary Index**

- Think of it like a book's chapter summaries
- It creates hierarchical summaries of your documents
- Good for questions that need broad understanding or synthesis of the content
- Better for "What's the main point of...?" or "Summarize..." type questions
- Uses LLM to generate summaries, which can be more expensive but gives better high-level understanding

**Vector Index**

- Think of it like a smart Ctrl+F search
- Converts text chunks into numerical vectors (like GPS coordinates for meaning)
- Good for finding specific information or answering detailed questions
- Better for "Where does it mention...?" or "What are the specific details about...?" type questions
- Uses similarity search to find relevant chunks, which is faster and cheaper than summarization

In your code, you're using both because they complement each other:

- Summary index (summary_tool) for summarization questions
- Vector index (vector_tool) for specific detail retrieval

:::

## Query Engines

- Create 2x Query Engines: `summary_query_engine` and `vector_query_engine`
- Create 2x Query Engine Tools: `summary_tool` and `vector_tool`
- Create 1x RouterQueryEngine: `query_engine`

```python

# create query engines
summary_query_engine = summary_index.as_query_engine(
    response_mode="tree_summarize",
    use_async=True,
)
vector_query_engine = vector_index.as_query_engine()

# create router query engine
summary_tool = QueryEngineTool.from_defaults(
    query_engine=summary_query_engine,
    description=(
        "Useful for summarization questions related to MetaGPT"
    ),
)

vector_tool = QueryEngineTool.from_defaults(
    query_engine=vector_query_engine,
    description=(
        "Useful for retrieving specific context from the MetaGPT paper."
    ),
)

# create router query engine
query_engine = RouterQueryEngine(
    selector=LLMSingleSelector.from_defaults(),
    query_engine_tools=[
        summary_tool,
        vector_tool,
    ],
    verbose=True
)
```

Testing direct calls to each Query Engine with: `query_engine.query()`

```python

# response
response = query_engine.query("What is the summary of the document?")
print(str(response))
```

This was the response:

> **Selecting query engine 0: Useful for summarization questions related to MetaGPT.**
> 
The document introduces MetaGPT, a meta-programming framework that enhances multi-agent systems using Large Language Models (LLMs) by incorporating human-like Standardized Operating Procedures (SOPs). It assigns specific roles to agents, streamlines workflows, and improves task decomposition, ensuring efficient collaboration through structured outputs and a communication protocol. MetaGPT achieves state-of-the-art performance in code generation benchmarks, emphasizing role specialization, workflow management, and efficient sharing mechanisms. The framework also includes an executable feedback mechanism to iteratively improve code quality. Additionally, the document discusses the software development process with MetaGPT, highlighting its success in achieving superior performance and its potential for future research in human-inspired techniques for artificial multi-agent systems.

```python

print(len(response.source_nodes))
34

```

```python

response = query_engine.query(
    "How do agents share information with other agents?"
)
print(str(response))
```

This was the response:

> **Selecting query engine 1: This choice is more relevant as it specifically mentions retrieving specific context, which is necessary for understanding how agents share information with other agents..**
> 
Agents share information with other agents by utilizing a shared message pool where they can publish structured messages. This shared message pool allows all agents to exchange messages directly, enabling them to both publish their own messages and access messages from other entities transparently. Additionally, agents can subscribe to relevant messages based on their role profiles, allowing them to extract the information they need for their specific tasks and responsibilities.

## Router Query Engine Request

Now, to call the Router Query Engine itself:

```python
# everything together

query_engine = get_router_query_engine("metagpt.pdf")
response = query_engine.query("Tell me about the ablation study results?")
print(str(response))
```

Final Router determined response:

> **Selecting query engine 1: Ablation study results are specific context from the MetaGPT paper, making choice 2 the most relevant..**
>
The ablation study results show that MetaGPT effectively addresses challenges related to context utilization, code hallucinations, and information overload in software development. By accurately unfolding natural language descriptions, maintaining information validity, and focusing on granular tasks like requirement analysis, MetaGPT mitigates issues such as incomplete implementation, missing dependencies, and undiscovered bugs. Additionally, the use of a global message pool and subscription mechanism helps manage information overload by streamlining communication and filtering out irrelevant contexts, thereby enhancing the relevance and utility of information in software development.

### get_router_query_engine("metagpt.pdf")

This function is in a `utils.py` file in this setup, and bottom of the imports list (see above):

```python
def get_router_query_engine(file_path: str, llm = None, embed_model = None):
    """Get router query engine."""
    llm = llm or OpenAI(model="gpt-3.5-turbo")
    embed_model = embed_model or OpenAIEmbedding(model="text-embedding-ada-002")
    
    # load documents
    documents = SimpleDirectoryReader(input_files=[file_path]).load_data()
    
    splitter = SentenceSplitter(chunk_size=1024)
    nodes = splitter.get_nodes_from_documents(documents)
    
    summary_index = SummaryIndex(nodes)
    vector_index = VectorStoreIndex(nodes, embed_model=embed_model)
    
    summary_query_engine = summary_index.as_query_engine(
        response_mode="tree_summarize",
        use_async=True,
        llm=llm
    )
    vector_query_engine = vector_index.as_query_engine(llm=llm)
    
    summary_tool = QueryEngineTool.from_defaults(
        query_engine=summary_query_engine,
        description=(
            "Useful for summarization questions related to MetaGPT"
        ),
    )
    
    vector_tool = QueryEngineTool.from_defaults(
        query_engine=vector_query_engine,
        description=(
            "Useful for retrieving specific context from the MetaGPT paper."
        ),
    )
    
    query_engine = RouterQueryEngine(
        selector=LLMSingleSelector.from_defaults(),
        query_engine_tools=[
            summary_tool,
            vector_tool,
        ],
        verbose=True
    )
    return query_engine
```

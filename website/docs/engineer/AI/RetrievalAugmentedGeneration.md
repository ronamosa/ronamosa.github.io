---
title: "Retrieval Augmented Generation (RAG) Notes"
---

:::tip Source

I'm watching ["Building Production-Ready RAG Applications: Jerry Liu"](https://www.youtube.com/watch?v=TRjq7t2Ms5I&ab_channel=AIEngineer) video.

:::

That "chat with docs" archticture, is mainly the following pattern:

![rag](/img/rag-arch.png)

1. Data
2. Embeddings
3. Retrieval
4. Synthesis

## Challenges

- hallucinations
- quality and context poor
- 
task specific, measure something so you know if your performance is improving.

is the embeddings the issue?

### Evaluation


## Reference

Talk was from a LlamaIndex engineer

- [LlamaIndex Docs](https://docs.llamaindex.ai/en/stable/getting_started/installation.html).
- [RAG](https://docs.llamaindex.ai/en/stable/getting_started/concepts.html)
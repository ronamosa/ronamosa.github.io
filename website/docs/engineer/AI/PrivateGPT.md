---
title: "PrivateGPT Local Deployment on Linux - Secure Document Chat Without Cloud"
description: "Complete guide to deploying PrivateGPT locally on Linux and Proxmox for secure, private document chat. No data leaves your network - chat with PDFs, TXT, HTML locally."
keywords: ["privategpt", "local llm", "private ai", "document chat", "local gpt", "offline ai", "linux deployment", "proxmox ai"]
tags: ["ai", "llm", "privacy", "local-deployment", "document-processing"]
sidebar_position: 1
---

![header](/img/privategpt-header.png)

:::info

Following [PrivateGPT 2.0 - FULLY LOCAL Chat With Docs (PDF, TXT, HTML, PPTX, DOCX, and more)](https://www.youtube.com/watch?v=XFiof0V3nhA&ab_channel=MatthewBerman) by Matthew Berman.

:::

## Requirements

- PrivateGPT [repo](https://github.com/imartinez/privateGPT.git)
- PrivateGPT Installation [docs](https://docs.privategpt.dev/installation)
- [Poetry](https://python-poetry.org/docs/#installation)

### Specs

Created an VM on proxmox, running:

```text
bot@ai:~/projects/privateGPT$ cat /etc/*release*
DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=22.04
DISTRIB_CODENAME=jammy
DISTRIB_DESCRIPTION="Ubuntu 22.04.3 LTS"
PRETTY_NAME="Ubuntu 22.04.3 LTS"
NAME="Ubuntu"
VERSION_ID="22.04"
VERSION="22.04.3 LTS (Jammy Jellyfish)"
VERSION_CODENAME=jammy
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
UBUNTU_CODENAME=jammy
```

I didn't upgrade to these specs until after I'd built & ran everything (slow):

![proxmox vm hw specs](/img/privategpt-hw-specs.png)

## Installation

### pyenv

- clone repo
- install pyenv

```bash
git clone https://github.com/imartinez/privateGPT
cd privateGPT

# install script pyenv
curl https://pyenv.run | bash

# add to ~/.bashrc
export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"

```

- Install python 3.11 in our pyenv

```bash

# install libs
pyenv install 3.11

Downloading Python-3.11.6.tar.xz...
-> https://www.python.org/ftp/python/3.11.6/Python-3.11.6.tar.xz
Installing Python-3.11.6...

Traceback (most recent call last):
  File "<string />", line 1, in <module />
  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/bz2.py", line 17, in <module />
    from _bz2 import BZ2Compressor, BZ2Decompressor
ModuleNotFoundError: No module named '_bz2'
WARNING: The Python bz2 extension was not compiled. Missing the bzip2 lib?
Traceback (most recent call last):
  File "<string />", line 1, in <module />
  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/curses/__init__.py", line 13, in <module />
    from _curses import *
ModuleNotFoundError: No module named '_curses'
WARNING: The Python curses extension was not compiled. Missing the ncurses lib?
Traceback (most recent call last):
  File "<string />", line 1, in <module />
  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/ctypes/__init__.py", line 8, in <module />
    from _ctypes import Union, Structure, Array
ModuleNotFoundError: No module named '_ctypes'
WARNING: The Python ctypes extension was not compiled. Missing the libffi lib?
Traceback (most recent call last):
  File "<string />", line 1, in <module />
ModuleNotFoundError: No module named 'readline'
WARNING: The Python readline extension was not compiled. Missing the GNU readline lib?
Traceback (most recent call last):
  File "<string />", line 1, in <module />
  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/sqlite3/__init__.py", line 57, in <module />
    from sqlite3.dbapi2 import *
  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/sqlite3/dbapi2.py", line 27, in <module />
    from _sqlite3 import *
ModuleNotFoundError: No module named '_sqlite3'
WARNING: The Python sqlite3 extension was not compiled. Missing the SQLite3 lib?
Traceback (most recent call last):
  File "<string />", line 1, in <module />
  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/lzma.py", line 27, in <module />
    from _lzma import *
ModuleNotFoundError: No module named '_lzma'
WARNING: The Python lzma extension was not compiled. Missing the lzma lib?
Installed Python-3.11.6 to /home/bot/.pyenv/versions/3.11.6
```

- Install missing libs
- Install `local 3.11`

```bash

# install missing libs
sudo apt update
sudo apt install libbz2-dev libncurses5-dev libncursesw5-dev libreadline-dev libsqlite3-dev libssl-dev libffi-dev zlib1g-dev liblzma-dev

# success
bot@ai:~/projects/privateGPT$ pyenv install 3.11
pyenv: /home/bot/.pyenv/versions/3.11.6 already exists
continue with installation? (y/N) y
Downloading Python-3.11.6.tar.xz...
-> https://www.python.org/ftp/python/3.11.6/Python-3.11.6.tar.xz
Installing Python-3.11.6...
Installed Python-3.11.6 to /home/bot/.pyenv/versions/3.11.6

# install
pyenv local 3.11
```

### Poetry

```bash
curl -sSL https://install.python-poetry.org | python3 -

Retrieving Poetry metadata

# Welcome to Poetry!

This will download and install the latest version of Poetry,
a dependency and package manager for Python.

It will add the `poetry` command to Poetry's bin directory, located at:

/home/bot/.local/bin

You can uninstall at any time by executing this script with the --uninstall option,
and these changes will be reverted.

Installing Poetry (1.7.1): Done

Poetry (1.7.1) is installed now. Great!

To get started you need Poetry's bin directory (/home/bot/.local/bin) in your `PATH`
environment variable.

Add `export PATH="/home/bot/.local/bin:$PATH"` to your shell configuration file.

Alternatively, you can call Poetry explicitly with `/home/bot/.local/bin/poetry`.

You can test that everything is set up by executing:

`poetry --version`
```

- add to ~/.bashrc for poetry: `export PATH="/home/bot/.local/bin:$PATH"`
- install poetry ui

```bash
bot@ai:~/projects/privateGPT$ poetry install --with ui
Installing dependencies from lock file

Package operations: 26 installs, 0 updates, 0 removals

  • Installing mdurl (0.1.2)
  • Installing referencing (0.31.0)
  • Installing jsonschema-specifications (2023.11.1)
  • Installing markdown-it-py (3.0.0)
  • Installing pygments (2.17.1)
  • Installing colorama (0.4.6)
  • Installing contourpy (1.2.0)
  • Installing cycler (0.12.1)
  • Installing fonttools (4.44.3)
  • Installing jsonschema (4.20.0)
  • Installing kiwisolver (1.4.5)
  • Installing pyparsing (3.1.1)
  • Installing rich (13.7.0)
  • Installing shellingham (1.5.4)
  • Installing toolz (0.12.0)
  • Installing aiofiles (23.2.1)
  • Installing altair (5.1.2)
  • Installing ffmpy (0.3.1)
  • Installing gradio-client (0.7.0)
  • Installing importlib-resources (6.1.1)
  • Installing matplotlib (3.8.2)
  • Installing pydub (0.25.1)
  • Installing semantic-version (2.10.0)
  • Installing tomlkit (0.12.0)
  • Installing typer (0.9.0)
  • Installing gradio (4.4.1)

Installing the current project: private-gpt (0.1.0)
```

- install poetry local

```bash
bot@ai:~/projects/privateGPT$ poetry install --with local
Installing dependencies from lock file

Package operations: 121 installs, 0 updates, 0 removals

  • Installing nvidia-cublas-cu12 (12.1.3.1): Installing...
Installing /home/bot/.cache/pypoetry/virtualenvs/private-gpt-QHOAK4Be-py3.11/lib/python3.11/site-packages/nvidia/__init__.py over exist
  • Installing nvidia-cublas-cu12 (12.1.3.1)
  • Installing deprecated (1.2.14)
  • Installing h11 (0.14.0)
  • Installing huggingface-hub (0.19.4)
  • Installing humanfriendly (10.0): Downloading... 0%
  • Installing jinja2 (3.1.2): Downloading... 0%
  • Installing humanfriendly (10.0)
  • Installing jinja2 (3.1.2)
  • Installing multiprocess (0.70.15)
  • Installing networkx (3.2.1)
  • Installing nvidia-cuda-cupti-cu12 (12.1.105): Installing...
  • Installing nvidia-cuda-nvrtc-cu12 (12.1.105): Downloading... 60%
  • Installing nvidia-cuda-runtime-cu12 (12.1.105)
  • Installing nvidia-cuda-nvrtc-cu12 (12.1.105): Installing...
  • Installing nvidia-cuda-cupti-cu12 (12.1.105)
  • Installing nvidia-cuda-nvrtc-cu12 (12.1.105)
  • Installing nvidia-cuda-runtime-cu12 (12.1.105)
  • Installing nvidia-cudnn-cu12 (8.9.2.26): Downloading... 4%
  • Installing nvidia-cufft-cu12 (11.0.2.54): Downloading... 30%
  • Installing nvidia-cudnn-cu12 (8.9.2.26): Downloading... 7%
  • Installing nvidia-cufft-cu12 (11.0.2.54): Downloading... 53%
  • Installing nvidia-cudnn-cu12 (8.9.2.26): Downloading... 18%
  • Installing nvidia-cufft-cu12 (11.0.2.54): Installing...
  • Installing nvidia-cudnn-cu12 (8.9.2.26): Downloading... 20%
  • Installing nvidia-cufft-cu12 (11.0.2.54): Installing...
  • Installing nvidia-cudnn-cu12 (8.9.2.26): Downloading... 86%
  • Installing nvidia-cufft-cu12 (11.0.2.54)
  • Installing nvidia-cudnn-cu12 (8.9.2.26): Installing...
  • Installing nvidia-cufft-cu12 (11.0.2.54)
  • Installing nvidia-cudnn-cu12 (8.9.2.26)
  • Installing nvidia-cufft-cu12 (11.0.2.54)
  • Installing nvidia-curand-cu12 (10.3.2.106)
  • Installing nvidia-cusolver-cu12 (11.4.5.107)
  • Installing nvidia-nccl-cu12 (2.18.1)
  • Installing nvidia-nvtx-cu12 (12.1.105)
  • Installing pandas (2.1.3)
  • Installing protobuf (4.25.1)
  • Installing pyarrow (14.0.1)
  • Installing pyarrow-hotfix (0.5)
  • Installing sniffio (1.3.0)
  • Installing sympy (1.12)
  • Installing triton (2.1.0)
  • Installing xxhash (3.4.1)
  • Installing annotated-types (0.6.0)
  • Installing anyio (3.7.1)
  • Installing coloredlogs (15.0.1)
  • Installing datasets (2.15.0)
  • Installing flatbuffers (23.5.26)
  • Installing hpack (4.0.0)
  • Installing httpcore (1.0.2)
  • Installing hyperframe (6.0.1)
  • Installing jmespath (1.0.1)
  • Installing mypy-extensions (1.0.0)
  • Installing psutil (5.9.6)
  • Installing pydantic-core (2.14.3)
  • Installing regex (2023.10.3)
  • Installing responses (0.18.0)
  • Installing safetensors (0.4.0)
  • Installing sentencepiece (0.1.99)
  • Installing tokenizers (0.15.0)
  • Installing torch (2.1.1)
  • Installing accelerate (0.24.1)
  • Installing botocore (1.32.3): Installing...
  • Installing botocore (1.32.3)
  • Installing click (8.1.7)
  • Installing distlib (0.3.7)
  • Installing distro (1.8.0)
  • Installing dnspython (2.4.2)
  • Installing evaluate (0.4.1)
  • Installing greenlet (3.0.1)
  • Installing grpcio (1.59.3)
  • Installing h2 (4.1.0)
  • Installing httptools (0.6.1)
  • Installing httpx (0.25.1)
  • Installing iniconfig (2.0.0)
  • Installing joblib (1.3.2)
  • Installing marshmallow (3.20.1)
  • Installing onnx (1.15.0)
  • Installing onnxruntime (1.16.2)
  • Installing pillow (10.1.0)
  • Installing platformdirs (3.11.0)
  • Installing pluggy (1.3.0)
  • Installing pydantic (2.5.1)
  • Installing python-dotenv (1.0.0)
  • Installing scipy (1.11.4)
  • Installing soupsieve (2.5)
  • Installing starlette (0.27.0)
  • Installing threadpoolctl (3.2.0)
  • Installing transformers (4.35.2)
  • Installing typing-inspect (0.9.0)
  • Installing uvloop (0.19.0)
  • Installing watchfiles (0.21.0)
  • Installing websockets (11.0.3)
  • Installing aiostream (0.5.2)
  • Installing beautifulsoup4 (4.12.2)
  • Installing cfgv (3.4.0)
  • Installing coverage (7.3.2)
  • Installing dataclasses-json (0.5.14)
  • Installing diskcache (5.6.3)
  • Installing email-validator (2.1.0.post1)
  • Installing fastapi (0.103.2)
  • Installing grpcio-tools (1.59.3)
  • Installing identify (2.5.32)
  • Installing itsdangerous (2.1.2)
  • Installing nest-asyncio (1.5.8)
  • Installing nltk (3.8.1)
  • Installing nodeenv (1.8.0)
  • Installing openai (1.3.3)
  • Installing optimum (1.14.1)
  • Installing orjson (3.9.10)
  • Installing pathspec (0.11.2)
  • Installing portalocker (2.8.2)
  • Installing pydantic-extra-types (2.1.0)
  • Installing pydantic-settings (2.1.0)
  • Installing pytest (7.4.3)
  • Installing python-multipart (0.0.6)
  • Installing s3transfer (0.7.0)
  • Installing scikit-learn (1.3.2)
  • Installing sqlalchemy (2.0.23)
  • Installing tenacity (8.2.3)
  • Installing tiktoken (0.5.1)
  • Installing torchvision (0.16.1)
  • Installing ujson (5.8.0)
  • Installing uvicorn (0.24.0.post1)
  • Installing virtualenv (20.24.6)
  • Installing black (22.12.0)
  • Installing boto3 (1.29.3)
  • Installing injector (0.21.0)
  • Installing llama-cpp-python (0.2.18)
  • Installing llama-index (0.9.3)
  • Installing mypy (1.7.0)
  • Installing pre-commit (2.21.0)
  • Installing pypdf (3.17.1)
  • Installing pytest-asyncio (0.21.1)
  • Installing pytest-cov (3.0.0)
  • Installing qdrant-client (1.6.9)
  • Installing ruff (0.1.6)
  • Installing sentence-transformers (2.2.2)
  • Installing types-pyyaml (6.0.12.12)
  • Installing watchdog (3.0.0)

Installing the current project: private-gpt (0.1.0)
```

## Runtime

Run setup: `poetry run python scripts/setup`

```bash
bot@ai:~/projects/privateGPT$ poetry run python scripts/setup
19:22:40.707 [INFO    ] private_gpt.settings.settings_loader - Starting application with profiles=['default']
Downloading embedding BAAI/bge-small-en-v1.5
config.json: 100%|████████████████████████████████████████████████████████████████████████████████████████| 743/743 [00:00<00:00, 2.45MB/s]
special_tokens_map.json: 100%|█████████████████████████████████████████████████████████████████████████████| 125/125 [00:00<00:00, 624kB/s]
README.md: 100%|███████████████████████████████████████████████████████████████████████████████████████| 90.3k/90.3k [00:00<00:00, 405kB/s]
.gitattributes: 100%|█████████████████████████████████████████████████████████████████████████████████| 1.52k/1.52k [00:00<00:00, 7.71MB/s]
modules.json: 100%|███████████████████████████████████████████████████████████████████████████████████████| 349/349 [00:00<00:00, 1.80MB/s]
config_sentence_transformers.json: 100%|███████████████████████████████████████████████████████████████████| 124/124 [00:00<00:00, 914kB/s]
sentence_bert_config.json: 100%|█████████████████████████████████████████████████████████████████████████| 52.0/52.0 [00:00<00:00, 258kB/s]
1_Pooling/config.json: 100%|██████████████████████████████████████████████████████████████████████████████| 190/190 [00:00<00:00, 1.36MB/s]
tokenizer_config.json: 100%|██████████████████████████████████████████████████████████████████████████████| 366/366 [00:00<00:00, 2.34MB/s]
tokenizer.json: 100%|███████████████████████████████████████████████████████████████████████████████████| 711k/711k [00:00<00:00, 1.07MB/s]
vocab.txt: 100%|█████████████████████████████████████████████████████████████████████████████████████████| 232k/232k [00:00<00:00, 520kB/s]
pytorch_model.bin: 100%|████████████████████████████████████████████████████████████████████████████████| 134M/134M [00:06<00:00, 21.3MB/s]
Fetching 12 files: 100%|███████████████████████████████████████████████████████████████████████████████████| 12/12 [00:08<00:00,  1.45it/s]
Embedding model downloaded!█████████████████████████████████████████████████████████████████████████████| 134M/134M [00:06<00:00, 24.1MB/s]
Downloading models for local execution...
mistral-7b-instruct-v0.1.Q4_K_M.gguf: 100%|███████████████████████████████████████████████████████████| 4.37G/4.37G [03:14<00:00, 22.4MB/s]
LLM model downloaded!
Setup done
```

Launch PrivateGPT API and start the UI.

Because we've gone with poetry for dependencies, we launch PrivateGPT with poetry

```bash
poetry run python -m private_gpt #OR

```

output

```bash
bot@ai:~/projects/privateGPT$ poetry run python -m private_gpt
19:39:12.334 [INFO    ] private_gpt.settings.settings_loader - Starting application with profiles=['default']
19:39:16.976 [INFO    ]   matplotlib.font_manager - generated new fontManager
19:39:21.028 [INFO    ] private_gpt.components.llm.llm_component - Initializing the LLM in mode=local
llama_model_loader: loaded meta data with 20 key-value pairs and 291 tensors from /home/bot/projects/privateGPT/models/mistral-7b-instruct-v0.1.Q4_K_M.gguf (version GGUF V2)
llama_model_loader: - tensor    0:                token_embd.weight q4_K     [  4096, 32000,     1,     1 ]
llama_model_loader: - tensor    1:              blk.0.attn_q.weight q4_K     [  4096,  4096,     1,     1 ]
llama_model_loader: - tensor    2:              blk.0.attn_k.weight q4_K     [  4096,  1024,     1,     1 ]
llama_model_loader: - tensor    3:              blk.0.attn_v.weight q6_K     [  4096,  1024,     1,     1 ]
llama_model_loader: - tensor    4:         blk.0.attn_output.weight q4_K     [  4096,  4096,     1,     1 ]
llama_model_loader: - tensor    5:            blk.0.ffn_gate.weight q4_K     [  4096, 14336,     1,     1 ]
...
...

llama_new_context_with_model: compute buffer total size = 276.93 MB
AVX = 0 | AVX2 = 0 | AVX512 = 0 | AVX512_VBMI = 0 | AVX512_VNNI = 0 | FMA = 0 | NEON = 0 | ARM_FMA = 0 | F16C = 0 | FP16_VA = 0 | WASM_SIMD = 0 | BLAS = 0 | SSE3 = 1 | SSSE3 = 0 | VSX = 0 |
20:05:13.917 [INFO    ] private_gpt.components.embedding.embedding_component - Initializing the embedding model in mode=local
20:05:37.693 [INFO    ] llama_index.indices.loading - Loading all indices.
20:05:38.059 [INFO    ]         private_gpt.ui.ui - Mounting the gradio UI, at path=/
20:05:38.350 [INFO    ]             uvicorn.error - Started server process [789035]
20:05:38.350 [INFO    ]             uvicorn.error - Waiting for application startup.
20:05:38.352 [INFO    ]             uvicorn.error - Application startup complete.
20:05:38.369 [INFO    ]             uvicorn.error - Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
```

Open webserver where API is running onport 8001, for me that's my local box `http://ai.darksyde.lan:8001`

![PrivateGPT UI](/img/privategpt-gui.png)

:::warning Performance

The performance for simple requests, understandably, is very, very **slow** because I'm just using CPU with specs in the [specs](#specs) section.

Seriously consider a GPU rig.

:::

### Output

What the LLM chat looks like

![gui output](/img/privategpt-success.png)

![console output](/img/privategpt-console.png)

:::tip Ingestion

This is interested, bulk doc ingestion: [https://docs.privategpt.dev/manual/document-management/ingestion](https://docs.privategpt.dev/manual/document-management/ingestion)

:::

## Troubleshooting

I uploaded a PDF

```bash
pypdf.errors.DependencyError: cryptography>=3.1 is required for AES algorithm
```

I asked it "who is the prime minister of new zealand?"

```bash
AttributeError: 'NoneType' object has no attribute 'split'
Traceback (most recent call last):
  File "/home/bot/.cache/pypoetry/virtualenvs/private-gpt-QHOAK4Be-py3.11/lib/python3.11/site-packages/gradio/queueing.py", line 456, in call_prediction
    output = await route_utils.call_process_api(
```

## Appendix

```bash
# if you build with poetry, but try to run it locally = errors, no deps.
bot@ai:~/projects/privateGPT$ python3.11 -m private_gpt
Traceback (most recent call last):
  File "<frozen runpy />", line 198, in _run_module_as_main
  File "<frozen runpy />", line 88, in _run_code
  File "/home/bot/projects/privateGPT/private_gpt/__main__.py", line 3, in <module />
    import uvicorn
ModuleNotFoundError: No module named 'uvicorn'
```

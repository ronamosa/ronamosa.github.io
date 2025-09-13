---
title: "Deploy Mistral-7B LLM with Ollama on AWS SageMaker"
description: "Complete tutorial for deploying and running Mistral-7B large language model using Ollama on AWS SageMaker. Includes setup, configuration, and usage examples."
keywords: ["mistral-7b", "ollama", "aws sagemaker", "llm deployment", "large language model", "ai", "machine learning", "aws ai"]
tags: ["ai", "llm", "aws", "sagemaker", "mistral", "ollama"]
sidebar_position: 1
---

:::info

Playing with OpenSource LLMs on some super-powered AWS instances.

:::

## Related AI & Machine Learning Projects

🤖 **AI Infrastructure & Deployment**: Expand your AI/ML capabilities:

- **Local AI Setup**: [PrivateGPT Local Deployment](/docs/engineer/AI/PrivateGPT) - Privacy-focused AI on your own hardware
- **AWS Private AI**: [PrivateGPT on AWS](/docs/engineer/AI/PrivateGPTAWS) - Secure cloud-based AI deployment
- **Production AI**: [Deploy LLMs to SageMaker](/docs/engineer/AI/DeployLLMToSageMaker) - Scale AI models in production
- **AI Services Integration**: [AWS Bedrock + LangChain](/docs/engineer/AI/BedrockLangChainWorkshop1) - Enterprise AI workflows

🏗️ **Infrastructure Context**: Power your AI workloads with robust infrastructure:

- **AI Hub**: [AI & Machine Learning Projects Hub](/docs/engineer/AI/ai-projects-hub) - Complete AI project collection and roadmap
- **Infrastructure Hosting**: [Home Lab Infrastructure Hub](/docs/engineer/LAB/home-lab-hub) - Self-hosted AI infrastructure
- **Cloud Integration**: [AWS Services](/docs/engineer/AWS/) - Cloud-native AI deployment strategies

## Login to AWS

Login to your AWS account.

Go to SageMaker, Studio, click `Open Studio`

![AWS SageMaker console dashboard showing Studio access button for launching machine learning environment](/img/Mistral7B-SageMaker.png)

This is SageMaker Studio

![SageMaker Studio main interface displaying JupyterLab spaces and development environment options](/img/Mistral7B-SageMaker-Studio.png)

View JupyterLab spaces

![SageMaker JupyterLab spaces overview showing available computing environments for machine learning projects](/img/Mistral7B-JupyterLab.png)

Create JupyterLab space - "OpenSourceLLM"

![Create new JupyterLab space dialog for setting up OpenSource LLM development environment](/img/Mistral7B-JupyterLab-CreateSpace.png)

In the workspace, I chose:

- Instance=`ml.g4dn.xlarge`
- Image=`SageMaker Distribution 1.2`
- Storage(GB)=`100`, `Run space`

![Sagemaker](/img/Mistral7B-JupyterLab-Space-Settings.png)

Run your configured space `Run space`

![Sagemaker](/img/Mistral7B-JupyterLab-Space-Run.png)

Ready to `Open JupyterLab`

![Sagemaker](/img/Mistral7B-JupyterLab-Space-Open.png)

You're now in your OpenSourceLLM JupyterLab Workspace (note I changed light to dark theme under `settings`):

![Sagemaker](/img/Mistral7B-JupyterLab-Space-Launcher.png)

## Install Dependencies

From `Other` section, choose `Terminal`

Run the following command to install build tools:

```bash
sudo apt-get update
sudo apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev \
    libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev \
    xz-utils tk-dev libffi-dev liblzma-dev git lshw
```

![Sagemaker](/img/Mistral7B-JupyterLab-Space-Deps.png)

:::caution

if you don't have `lshw` installed ollama will give you this warning:

```bash
>>> Installing ollama to /usr/local/bin...
WARNING: Unable to detect NVIDIA GPU. Install lspci or lshw to automatically detect and install NVIDIA CUDA drivers.
>>> The Ollama API is now available at 0.0.0.0:11434.
>>> Install complete. Run "ollama" from the command line.
```

:::

## JupyterLab Notebook

From `Notebook` options, choose `Python 3 (ipykernel)`

:::tip

I renamed the notebook, press F2, to `Mistral7B`)

:::

### Install transformers

Run: `!pip install transformers` in first cell

```bash
# output
Requirement already satisfied: transformers in /opt/conda/lib/python3.10/site-packages (4.31.0)
Requirement already satisfied: filelock in /opt/conda/lib/python3.10/site-packages (from transformers) (3.13.1)
Requirement already satisfied: huggingface-hub<1.0,>=0.14.1 in /opt/conda/lib/python3.10/site-packages (from transformers) (0.19.0)
Requirement already satisfied: numpy>=1.17 in /opt/conda/lib/python3.10/site-packages (from transformers) (1.26.0)
Requirement already satisfied: packaging>=20.0 in /opt/conda/lib/python3.10/site-packages (from transformers) (23.2)
Requirement already satisfied: pyyaml>=5.1 in /opt/conda/lib/python3.10/site-packages (from transformers) (6.0.1)
Requirement already satisfied: regex!=2019.12.17 in /opt/conda/lib/python3.10/site-packages (from transformers) (2023.10.3)
Requirement already satisfied: requests in /opt/conda/lib/python3.10/site-packages (from transformers) (2.31.0)
Requirement already satisfied: tokenizers!=0.11.3,<0.14,>=0.11.1 in /opt/conda/lib/python3.10/site-packages (from transformers) (0.13.3)
Requirement already satisfied: safetensors>=0.3.1 in /opt/conda/lib/python3.10/site-packages (from transformers) (0.3.3)
Requirement already satisfied: tqdm>=4.27 in /opt/conda/lib/python3.10/site-packages (from transformers) (4.66.1)
Requirement already satisfied: fsspec>=2023.5.0 in /opt/conda/lib/python3.10/site-packages (from huggingface-hub<1.0,>=0.14.1->transformers) (2023.6.0)
Requirement already satisfied: typing-extensions>=3.7.4.3 in /opt/conda/lib/python3.10/site-packages (from huggingface-hub<1.0,>=0.14.1->transformers) (4.5.0)
Requirement already satisfied: charset-normalizer<4,>=2 in /opt/conda/lib/python3.10/site-packages (from requests->transformers) (3.3.2)
Requirement already satisfied: idna<4,>=2.5 in /opt/conda/lib/python3.10/site-packages (from requests->transformers) (3.4)
Requirement already satisfied: urllib3<3,>=1.21.1 in /opt/conda/lib/python3.10/site-packages (from requests->transformers) (1.26.18)
Requirement already satisfied: certifi>=2017.4.17 in /opt/conda/lib/python3.10/site-packages (from requests->transformers) (2023.7.22)
```

### Install Ollama

Type `b`, shortcut to add another cell underneath.

Run: `!curl https://ollama.ai/install.sh | sh` to install ollama

```bash
# output
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0>>> Downloading ollama...
100  8354    0  8354    0     0  24587      0 --:--:-- --:--:-- --:--:-- 24570
######################################################################## 100.0%##O#-#                                                                        
>>> Installing ollama to /usr/local/bin...
>>> NVIDIA GPU installed.
>>> The Ollama API is now available at 0.0.0.0:11434.
>>> Install complete. Run "ollama" from the command line.
```

This will look like the following in your Notebook:

![Sagemaker](/img/Mistral7B-JupyterLab-Space-Notebook.png)

## Run Ollama

Go back to your Terminal window.

Run ollama server: `ollama serve`

```bash
# output

sagemaker-user@default:~$ ollama serve
Couldn't find '/home/sagemaker-user/.ollama/id_ed25519'. Generating new private key.
Your new public key is: 

ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIxhdvgcRFe7Ic1ZC9zPqW/5LPaBiDYH4SlXLhigZ9mW

2024/01/17 09:43:58 images.go:808: total blobs: 0
2024/01/17 09:43:58 images.go:815: total unused blobs removed: 0
2024/01/17 09:43:58 routes.go:930: Listening on 127.0.0.1:11434 (version 0.1.20)
2024/01/17 09:43:58 shim_ext_server.go:142: Dynamic LLM variants [rocm cuda]
2024/01/17 09:43:58 gpu.go:88: Detecting GPU type
2024/01/17 09:43:58 gpu.go:203: Searching for GPU management library libnvidia-ml.so
2024/01/17 09:43:58 gpu.go:248: Discovered GPU libraries: [/usr/lib/x86_64-linux-gnu/libnvidia-ml.so.535.129.03]
2024/01/17 09:44:00 gpu.go:94: Nvidia GPU detected
2024/01/17 09:44:00 gpu.go:135: CUDA Compute Capability detected: 7.5
```

Ollama server is running and ready for commands.

## Download Mistral7B

Go back to Notebook and run: `!ollama run mistral`

Ollama will pull down the Mistral7B LLM, until you see:

```bash
writing manifest 
removing any unused layers 
success
```

Open a new Terminal, and check ollama with `ollama list`

```bash
sagemaker-user@default:~$ ollama list
NAME            ID              SIZE    MODIFIED      
mistral:latest  61e88e884507    4.1 GB  3 minutes ago
sagemaker-user@default:~$ 
```

Now run mistral with: `ollama run mistral:latest`

```bash
# output

sagemaker-user@default:~$ ollama run mistral:latest
>>> hi, who is the greatest MMA fighter of all time?
 Determining the greatest MMA (Mixed Martial Arts) fighter of all time is a subjective question as it depends on various factors such as individual fighting styles, eras, weight classes, and personal preferences. 
Some popular names often mentioned in this discussion are:

1. Anderson Silva: A former UFC Middleweight champion known for his devastating strikes and impeccable striking defense. He held the middleweight title for an record-breaking 2,457 days.
2. Georges St-Pierre: A former UFC Welterweight and Middleweight champion with an impressive record of 26 wins and 2 losses. He is known for his versatility in various martial arts and excellent conditioning.
3. Khabib Nurmagomedov: A current UFC Lightweight champion with a perfect 29-0 record. Known for his grappling skills, wrestling background, and exceptional ground control.
4. Jon Jones: A former UFC Light Heavyweight and Heavyweight champion with a record of 26 wins and 1 loss. He is known for his striking abilities, agility, and grappling skills.
5. Fedor Emelianenko: A legendary fighter from the Pride FC era with a professional MMA record of 43 wins (37 KOs, 6 ND, 0 L) and 5 losses. He is known for his devastating strikes, particularly in Sambo and Judo.

There are several other fighters who have made significant contributions to the sport as well. Ultimately, the "greatest" MMA fighter is a matter of personal opinion.

>>> Send a message (/? for help)
```

Success.

![Sagemaker](/img/Mistral7B-JupyterLab-Space-Mistral7B.png)

I asked Mistral to explain RAG to me like I'm 5, this was the response (after initially confusing the acronym):

```bash
>>> now do the 5 year old version of the correct acronym now
 Sure thing! Imagine there are four special friends named Retrieval, Augmentation, Generation, and Architect.

Retrieval is the memory friend who keeps all the information in a computer program. He looks up answers to questions and finds important facts when needed.

Augmentation is the helper friend who makes things better for the other friends. In our case, it adds extra details and information to make answers more complete and accurate.

Generation is the storyteller friend who turns information into answers that we can understand. He takes all the facts and turns them into clear and easy-to-understand responses.

Architect is the designer friend who puts everything together. He makes sure that all the friends work well together to give us the best possible answers!

So, as a 5-year-old, you could think of Retrieval-Augmented Generation (RAG) as a group of special friends named Retrieval, Augmentation, and Generation who work together to find information, add extra details, and 
turn it all into clear answers for us!

>>> Send a message (/? for help)
```

## Resources

- ["Install and Run Mistral 7B on AWS"](https://www.youtube.com/watch?v=aSh66tG1B5o&ab_channel=FahdMirza)
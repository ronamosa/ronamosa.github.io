---
title: "Deploying LLM to SageMaker (manually)"
---

:::note

These are notes for working out the steps and process for deploying an LLM to SageMaker as part of my YouTube video series, hence they will be rough, but I will include the link to the completed video.

:::

## Agenda

In this first video, we'll focus on the end-to-end deployment process. We'll cover:

1. Preparing the LLM model for deployment
2. Writing the inference code to handle requests
3. Launching the model endpoint on SageMaker

## Deployment Overview

Key components

1. model artefacts
2. inference code
3. Endpoint (sagemaker)

Tasks at a high level

1. prepare the model files, upload to S3
2. write some inference code, package with deps
3. create SM model using the model package
4. launch Endpoint to servce model.

## Prepare LLM

### Model Theory

According to the SageMaker documentation, the model directory should have the following structure:

```bash
/model.tar.gz
├── model.pth
├── code/
│   ├── inference.py
│   ├── requirements.txt
```

Here's what each component represents:

- `model.pth`: This is the serialized model file containing the trained weights of your PyTorch model.
- `code/`: This directory contains the necessary code files for the inference script.
  - `inference.py`: This is the inference script that we'll discuss later, containing the `model_fn`, `input_fn`, `predict_fn`, and `output_fn` functions.
  - `requirements.txt`: This file lists the dependencies required by your inference script, such as the `torch` and `transformers` libraries.

### Example Stable Diffusion XL

On my SageMaker instance, I deployed SDXL, from the terminal here's what the artefacts look like:

```bash
sagemaker-user@default:~/model-58101$ ls -ll
total 92
-rw-r--r-- 1 sagemaker-user users 12506 Mar  7 04:03 README.md
drwxr-xr-x 3 sagemaker-user users    76 Mar  7 04:05 code
drwxr-xr-x 2 sagemaker-user users    38 Mar  7 04:04 feature_extractor
-rw-r--r-- 1 sagemaker-user users   543 Mar  7 04:03 model_index.json
drwxr-xr-x 2 sagemaker-user users    50 Mar  7 04:04 safety_checker
drwxr-xr-x 3 sagemaker-user users    61 Mar  7 04:04 scheduler
drwxr-xr-x 2 sagemaker-user users    50 Mar  7 04:04 text_encoder
drwxr-xr-x 2 sagemaker-user users   102 Mar  7 04:04 tokenizer
drwxr-xr-x 2 sagemaker-user users    60 Mar  7 04:04 unet
-rw-r--r-- 1 sagemaker-user users 71237 Mar  7 04:03 v1-variants-scores.jpg
drwxr-xr-x 2 sagemaker-user users    60 Mar  7 04:04 vae
sagemaker-user@default:~/model-58101$
```

looking in code:

```bash
sagemaker-user@default:~/model-58101/code$ ls -ll
total 8
-rw-r--r-- 1 sagemaker-user users 1170 Mar  7 03:57 inference.py
-rw-r--r-- 1 sagemaker-user users   38 Mar  7 03:57 requirements.txt
```

and the default `inference.py` file that comes default

```python
import base64
import torch
from io import BytesIO
from diffusers import StableDiffusionPipeline


def model_fn(model_dir):
    # Load stable diffusion and move it to the GPU
    pipe = StableDiffusionPipeline.from_pretrained(model_dir, torch_dtype=torch.float16)
    pipe = pipe.to("cuda")

    return pipe


def predict_fn(data, pipe):

    # get prompt & parameters
    prompt = data.pop("inputs", data)
    # set valid HP for stable diffusion
    num_inference_steps = data.pop("num_inference_steps", 50)
    guidance_scale = data.pop("guidance_scale", 7.5)
    num_images_per_prompt = data.pop("num_images_per_prompt", 4)

    # run generation with parameters
    generated_images = pipe(
        prompt,
        num_inference_steps=num_inference_steps,
        guidance_scale=guidance_scale,
        num_images_per_prompt=num_images_per_prompt,
    )["images"]

    # create response
    encoded_images = []
    for image in generated_images:
        buffered = BytesIO()
        image.save(buffered, format="JPEG")
        encoded_images.append(base64.b64encode(buffered.getvalue()).decode())

    # create response
    return {"generated_images": encoded_images}
```


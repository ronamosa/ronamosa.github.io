---
title: "AKS Cluster Part.2"
---

:::info

Published Date: 28-JAN-2019

:::

Over in [Part 1](2019-01-28-Azure-Kubernetes-up-and-running-1) we used Terraform to spin up a really basic Kubernetes cluster in azure. CLI for the win always!

For the record, I'm following some really good documentation from Microsoft's Azure documentation site (all references credited at the end). These are just my notes, screenshots and outputs for my own reference.

:::tip

A lot of the how this I write these is how I would want to it to read if I were trying to learn this again myself :)

:::

In this part, we just want to setup an Azure Container Registry (ACR) that's going to be our private, or internal, holder of all things docker/container images and what-not.

Once we get this up and ready for service, this is where we will throw our applications to deploy from!

## Series Overview

* Part 1 - get Kubernetes cluster up and running on Azure Kubernetes Managed Service (AKS)
* **Part 2 - create a private Docker Registry in the cloud using Azure's Container Registry Managed service (ACR)**
* Part 3 - deploy a simple application to it.

Now that we know where we are, let's go!

## Pre-requisites

As in Part 1, you'll need the following already installed to get going:

1. Azure [portal account](https://portal.azure.com)
2. Azure [az-cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-apt?view=azure-cli-latest) (command line interface)
3. Terraform [installed](https://learn.hashicorp.com/terraform/getting-started/install.html) (zipped binary, copy to ~/bin)
4. (optional) Kubectl [installed](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

Right, let's have a look at the two methods we can use to stand things up:

## Method 1: az-cli

with this method, we'll be going through a series of azure-cli 'az' calls to set things up

### login with azure-cli

from a terminal, login to your azure account

```bash
az login
```

a browser window opens, you select the email that gets you into your azure portal account.

### create a resource group

```bash
az group create --name cloudbuilder-rg --location australiaeast
```

output looks like this

```json
{
  "id": "/subscriptions/0d667072-XXXX-46ef-a5b4-86979fd2XXXX/resourceGroups/cloudbuilder-rg",
  "location": "australiaeast",
  "managedBy": null,
  "name": "cloudbuilder-rg",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": null
}
```

### create a container registry

run this command

```bash
az acr create --resource-group "cloudbuilder-rg" --name cloudBRegistry --sku Basic
```

take note the registry name you choose after "--name" has to be a unique name when combined with suffix ".azurecr.io" otherwise you'll get denied like so

```bash
az acr create --resource-group "cloudbuilder-rg" --name cloudRegistry --sku Basic
The registry DNS name cloudregistry.azurecr.io is already in use.
```

successful output looks like this

```json
{
  "adminUserEnabled": false,
  "creationDate": "2019-02-04T08:19:59.124377+00:00",
  "id": "/subscriptions/0d667072-XXXX-46ef-a5b4-86979fd2XXXX/resourceGroups/cloudbuilder-rg/providers/Microsoft.ContainerRegistry/registries/cloudBRegistry",
  "location": "australiaeast",
  "loginServer": "cloudbregistry.azurecr.io",
  "name": "cloudBRegistry",
  "networkRuleSet": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "cloudbuilder-rg",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "status": null,
  "storageAccount": null,
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}
```

right, so far so good.

key output here to take note of = `"loginServer": "cloudbregistry.azurecr.io"`

OR short-cut:

```bash
az acr list --resource-group $NAME_OF_ACR --query "[].{acrLoginServer:loginServer}" --output table
```

### login to new ACR

I had issues with this on a corporate setup with multiple Azure accounts so it kept giving me weird errors and not letting me login. On my personal, simple, single account setup, the login is really straight forward

```bash
az acr login --name cloudBRegistry
Login Succeeded
```

that's it.

Congratulations, you've got a brand spanking new ACR setup!

but its a bit useless sitting there doing nothing, let's try and push some images to it!

### Push an image?

hmmm, let's just test it with a local docker image we can re-tag and push to see how it goes.

```bash
docker images
REPOSITORY                                       TAG                 IMAGE ID            CREATED             SIZE
tiangolo/uwsgi-nginx-flask                       python3.6           0f8df7d438f3        3 weeks ago         949MB
localhost:5000/golang                            1.10                b65fe5418f5f        5 weeks ago         729MB
golang                                           1.10                b65fe5418f5f        5 weeks ago         729MB
nginx                                            1.14                3f55d5bb33f3        5 weeks ago         109MB
mysql                                            5.7                 ba7a93aae2a8        5 weeks ago         372MB
redis                                            latest              5d2989ac9711        5 weeks ago         95MB
wordpress                                        php7.1-fpm-alpine   87b83134b87c        6 weeks ago         113MB
registry                                         2                   9c1f09fe9a86        6 weeks ago         33.3MB
alpine                                           3.8                 3f53bb00af94        6 weeks ago         4.41MB
```

'registry' looks small enough

```bash
docker tag registry:2 cloudbregistry.azurecr.io/registry:2
```

re-tagged with our new ACR as the destination, now for a Push

```bash
docker push cloudbregistry.azurecr.io/registry:2
The push refers to a repository [cloudbregistry.azurecr.io/registry]
2c2e689683cd: Pushed
0d2f98178000: Pushed
2a02e265caaa: Pushed
aa889911e071: Pushed
4a9dd85dec45: Pushed
2: digest: sha256:4dc58b720da3630db2be1cc811837c1671c55e419bf14f775752cee4178832d6 size: 1364
```

easy as that!

### Useful ACR commands

quick look at all the images in our ACR

```bash
az acr repository list --name cloudbregistry --output table
Result
--------
registry
```

hmmm, not many!

any cool tags?

```bash
az acr repository show-tags --name cloudbregistry --repository registry --output table
Result
--------
2
```

ah, just the 'registry:2' tag!

ah well, we're done with the ACR, so quick way to DELETE IT ALL, is to delete the resource group - you remember the one "cloudbuilder-rg"

```bash
az group delete --name "cloudbuilder-rg"
Are you sure you want to perform this operation? (y/n): y
```

That's it. pretty anti-climatic huh.

## Method 2: Terraform

:::info Update Note
**This post has been updated from here on: 03/06/2019.**
:::

Ok, let's try doing it with terraform.

### main.tf

```hcl
# Azure Container Registry (managed)

resource "azurerm_resource_group" "rg" {
  name     = "$\{var.resource_group_name-acr}"
  location = "$\{var.location}"
}

resource "azurerm_container_registry" "acr" {
  name                     = "$\{var.acr_name}"
  resource_group_name      = "$\{azurerm_resource_group.rg.name}"
  location                 = "$\{azurerm_resource_group.rg.location}"
  sku                      = "Basic"
  admin_enabled            = true
}
```

### variables.tf

```hcl
# variables

variable "resource_group_name-acr" {
  description = "ACR Resource Group."
  default = "AKS-CLOUDRESOURCES"
}

variable "location" {
  description = "for ACR"
  default = "australiaeast"
}

variable "acr_name" {
  description = "ACR Name"
  default = "registercloudbuilderio"
}
```

### outputs.tf

_note: only outputs admin username & password if you have admin_enabled=true._

```hcl
# ACR Outputs

output "login_server" {
  value = "$\{azurerm_container_registry.acr.login_server}"
}

output "admin_password" {
  value = "$\{azurerm_container_registry.acr.admin_password}"
}

output "admin_username" {
  value = "$\{azurerm_container_registry.acr.admin_username}"
}
```

### run a plan

run terraform plan to check what we're doing

```bash
------------------------------------------------------------------------

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  ~ update in-place

Terraform will perform the following actions:

  # azurerm_container_registry.acr will be updated in-place
  ~ resource "azurerm_container_registry" "acr" {
      ~ admin_enabled       = false -> true
        id                  = "/subscriptions/.../resourceGroups/AKS-CLOUDRESOURCES/providers/Microsoft.ContainerRegistry/registries/registercloudbuilderio"
        location            = "australiaeast"
        login_server        = "registercloudbuilderio.azurecr.io"
        name                = "registercloudbuilderio"
        resource_group_name = "AKS-CLOUDRESOURCES"
        sku                 = "Basic"
        tags                = {}
    }

Plan: 0 to add, 1 to change, 0 to destroy.

------------------------------------------------------------------------

```

## Terraform Apply

```bash
22:07 $ terraform apply -auto-approve
azurerm_resource_group.rg: Refreshing state... [id=/subscriptions/.../resourceGroups/AKS-CLOUDRESOURCES]
azurerm_container_registry.acr: Creating...
azurerm_container_registry.acr: Creation complete after 8s [id=/subscriptions/.../resourceGroups/AKS-CLOUDRESOURCES/providers/Microsoft.ContainerRegistry/registries/registercloudbuilderio]

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:

admin_password = SomePassWOrdz
admin_username = registercloudbuilderio
login_server = registercloudbuilderio.azurecr.io
```

Right, we should be able to tear through all the ACR stuff we did with the az-cli method

### Quick: ACR run-through checks for Terraform method

#### docker login

```bash
22:16 $ docker login -u "registercloudbuilderio" -p "SomePassWOrdz" https://registercloudbuilderio.azurecr.io
WARNING! Using --password via the CLI is insecure. Use --password-stdin.
WARNING! Your password will be stored unencrypted in /home/amosar/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

#### docker pull, tag, push

pull

```bash
22:18 $ docker pull alpine
Using default tag: latest
latest: Pulling from library/alpine
e7c96db7181b: Pull complete
Digest: sha256:769fddc7cc2f0a1c35abb2f91432e8beecf83916c421420e6a6da9f8975464b6
Status: Downloaded newer image for alpine:latest
```

tag

```bash
22:18 $ docker tag alpine:latest registercloudbuilderio.azurecr.io/alpine:latest
```

push

```bash
22:19 $ docker push registercloudbuilderio.azurecr.io/alpine:latest
The push refers to repository [registercloudbuilderio.azurecr.io/alpine]
f1b5933fe4b5: Pushed
latest: digest: sha256:bf1684a6e3676389ec861c602e97f27b03f14178e5bc3f70dce198f9f160cce9 size: 528
```

yep, looks good!

(can probably destroy it now, but I'll clean up later)

So there you go. Azure Container Registry, at your beck and call, via 2 methods.

Thanks for reading!

In Part 3 - we tie it all together with an application deploy into our Kubernetes cluster, pulling from our private ACR!!

## References

* Azure Create SPN [Azure Create SPN](https://docs.microsoft.com/en-us/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac)
* [winsmarts - create an ACR](https://winsmarts.com/create-an-azure-container-registry-using-the-azure-cli-74993d363c2f)
* [Microsoft Azure - create a private container registry with azure-cli](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-azure-cli)
* [Terraform - create ACR](https://www.terraform.io/docs/providers/azurerm/r/container_registry.html)
* [Hashicorp - kubernetes cluster with terraform](https://www.hashicorp.com/blog/kubernetes-cluster-with-aks-and-terraform)
* [Terraform - azurerm](https://www.terraform.io/docs/providers/azurerm/)

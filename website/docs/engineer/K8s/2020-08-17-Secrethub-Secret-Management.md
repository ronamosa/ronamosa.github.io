---
title: "SecretHub: Secrets Management"
---

:::info

Published Date: 17-AUG-2020

:::

A simple example of setting up SecretHub secrets manager to secure all your application and infrastructure secrets at deployment

Secrets management, especially as part of a project/product team, is something that can easily get very messy with user, system and application credentials all over the place due to a lack of a secrets management system and practice setup. It's important to figure this out early in the piece, especially for all the engineers who are going to be working on the application and infrastructure for that app, you want people to come into the team and have access to everything they need and not have to compromise any security to do so.

## Objective

In this post I'm going to go through setting up [SecretHub Secret Manager](https://secrethub.io/docs/start/getting-started/) to take care of the following common secrets management patterns:

1. Shell Environment secrets
2. Infrastructure Code secrets

Essentially we're taking something that usually looks like this:

![pipeline problem](/img/pipeline-problem.svg)

Into this:

![pipeline solution](/img/pipeline-cover.svg)

By the end you will see how secrets can be managed for:

* A storage account key for terraform remote state file, in an ENV variable
* An azure service principal for AKS, in the infrastructure code (terraform)
* ssh private keys for AKS nodes, also in the infrastructure code (terraform)

## Pre-requisites

This post builds on Microsoft Azure so to follow along you will need the following things:

* Azure Account
* `az-cli` tool
* terraform `0.12.x`
* clone of repo ['aks-secrethub-cluster'](https://github.com/ronamosa/aks-secrethub-cluster)

### Storage Account & Key

Best practice for Terraform means using a remote state file saved on your cloud provider (securely) so we need to create an Azure storage account.

First, create a resource group:

```bash
export RESOURCE_GROUP_NAME="terraform-rg"
export LOCATION="australiasoutheast"
az group create --name ${RESOURCE_GROUP_NAME} --location ${LOCATION}
```

Now create the storage account:

```bash
export STORAGE_ACCOUNT_NAME="terraform"
az storage account create --resource-group ${RESOURCE_GROUP_NAME} --name ${STORAGE_ACCOUNT_NAME} --sku Standard_LRS --encryption-services blob
```

Get the ARM access key from the storage account and use it to create a storage account container:

```bash
CONTAINER_NAME="tfstate"
export ARM_ACCESS_KEY=$(az storage account keys list --resource-group ${RESOURCE_GROUP_NAME} --account-name ${STORAGE_ACCOUNT_NAME} --query [0].value -o tsv)
az storage container create --name ${CONTAINER_NAME} --account-name ${STORAGE_ACCOUNT_NAME} --account-key ${ARM_ACCESS_KEY}
```

Note the value of your `ARM_ACCESS_KEY` somewhere for later.

### Service Principal

AKS needs a service principal with the permission to provision & manage resources in Azure.

```bash
# you need your subcription ID handy
az account set --subscription="SUBSCRIPTION_ID"
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/SUBSCRIPTION_ID"
```

Output looks like this:

```json
{
  "appId": "00000000-0000-0000-0000-000000000000",
  "displayName": "azure-cli-2020-08-17-10-41-15",
  "name": "http://azure-cli-2020-08-17-10-41-15",
  "password": "0000-0000-0000-0000-000000000000",
  "tenant": "00000000-0000-0000-0000-000000000000"
}
```

Note the `appId` as `SPN_ID` and `password` as `SPN_SECRET` for later.

### SSH Public Keys

AKS `linux_profile` requires an `ssh_key` public key used to access the cluster.

```terraform
  linux_profile {
    admin_username = var.vm_user_name

    ssh_key {
      key_data = data.secrethub_secret.aks_ssh_key.value
    }
  }
```

Generate a new keypair:

```bash
$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/user/.ssh/id_rsa): ./secrethub-keypair
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in ./secrethub-keypair.
Your public key has been saved in ./secrethub-keypair.pub.
The key fingerprint is:
SHA256:80P9EDgEkiEVpgpiYEuzqWFAJW43TlBqKimTvezHIjg user@laptop
The keys randomart image is:
+---[RSA 2048]----+
|+Boo..*+...      |
|* O  +.. . .     |
|+@ +.     o .    |
|O*+..      o .   |
|O o.    S . o    |
|oo .     +   o   |
|. o.      o   .  |
|E.. o      .     |
| o.o             |
+----[SHA256]-----+
```

Once you have your account, check it with: `secrethub account inspect`

Substitute `SECRETHUB_ACCOUNT` for your secrethub account from now on.

## SecretHub Setup

### Directory Structure

Your secrethub setup is path based, so you need to think about directory structure of how you want your secret mapped out.

For this simple setup we will go with the following [recommended structure](https://secrethub.io/docs/basics/best-practices/), to group our secrets in terms of `environments` first and then more granularly in terms of `application` they belong to:

```txt
$SECRETHUB_ACCOUNT/
├── aks_secrets/
    └── prod/
        ├── terraform/
        |   |-- aks_service_principal_id
        |   |-- aks_service_principal_secret
        |   |-- aks_ssh_key
        |── azure/
            |-- arm_access_key
```

### Create Directories

We need to create the directory paths mentioned in the previous section for our secrets:

```bash
secrethub repo init $SECRETHUB_ACCOUNT/aks_secrets
secrethub mkdir $SECRETHUB_ACCOUNT/aks_secrets/prod
secrethub mkdir $SECRETHUB_ACCOUNT/aks_secrets/prod/terraform
secrethub mkdir $SECRETHUB_ACCOUNT/aks_secrets/prod/azure
```

### Create SecretHub Secrets

```bash
# azure secrets directory
echo ${ARM_ACCESS_KEY} | secrethub write $SECRETHUB_ACCOUNT/aks_secrets/prod/azure/arm_access_key

# terraform secrets directory
echo ${SPN_ID} | secrethub write $SECRETHUB_ACCOUNT/aks_secrets/prod/terraform/aks_service_principal_id
echo ${SPN_SECRET} | secrethub write $SECRETHUB_ACCOUNT/aks_secrets/prod/terraform/aks_service_principal_secret
cat ${SSH_KEYPAIR} | secrethub write $SECRETHUB_ACCOUNT/aks_secrets/prod/terraform/aks_ssh_key
```

## Terraform AKS Setup

Clone the following repo if you haven't already done so ['aks-secrethub-cluster'](https://github.com/ronamosa/aks-secrethub-cluster)

### Install Terraform Provider

SecretHub provides a terraform provider, follow the installation instructions found at ['Install SecretHub Terraform Provider'](https://secrethub.io/docs/reference/terraform/install/)

Or, run this for `amd64` version:

```bash
mkdir -p ~/.terraform.d/plugins && curl -SfL https://github.com/secrethub/terraform-provider-secrethub/releases/latest/download/terraform-provider-secrethub-linux-amd64.tar.gz | tar zxf - -C ~/.terraform.d/plugins
```

### SecretHub Terraform Resources

The main components where all the magic happen are as follows:

Declare the provider, and where to find your secrethub credentials in `prodiver.tf`

```hcl
provider "secrethub" {
  credential = file("~/.secrethub/credential")
}
```

Because your secrets already exist, you want to set them up as data sources in `aks.tf`

_(remember to replace `$SECRETHUB_ACCOUNT` with your account details)_

```hcl
# secrethub secret - service principal id
data "secrethub_secret" "aks_service_principal_id" {
  path = "$SECRETHUB_ACCOUNT/aks_secrets/prod/terraform/aks_service_principal_id"
}

# secrethub secret - service principal secret
data "secrethub_secret" "aks_service_principal_secret" {
  path = "$SECRETHUB_ACCOUNT/aks_secrets/prod/terraform/aks_service_principal_secret"
}

# secrethub secret - ssh key for aks nodes
data "secrethub_secret" "aks_ssh_key" {
  path = "$SECRETHUB_ACCOUNT/aks_secrets/prod/terraform/aks_ssh_key"
}
```

As a deployment-time secret, you use the file provided, `secrethub.env` which has the entry for the `ARM_ACCESS_KEY` to access your remote storage account to manage the terraform state file:

```bash
{% raw %}
ARM_ACCESS_KEY = {{ $SECRETHUB_ACCOUNT/aks_secrets/prod/azure/arm_access_key }}
{% endraw %}
```

## Run Deployment

Make sure to update `aks.tf` backend details, with your details (see above)

```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = RESOURCE_GROUP_NAME
    storage_account_name = STORAGE_ACCOUNT_NAME
    container_name       = CONTAINER_NAME
  }
}
```

After you have confirmed everything is in place, use the `make` command to build your infra:

```bash
ENV=prod make plan
ENV=prod make apply
```

The Makefile will run an apply like this:

```bash
secrethub run -- terraform apply
```

Where `secrethub.env` file will get picked up by default, the `ARM_ACCESS_KEY` will be imported in as an Environment variable, allowing terraform to access the remote storage account.

## Conclusion

In this post we have setup a simple AKS cluster using terraform to use SecretHub, to manage and secure our secrets.

We have setup a remote state file secret; an azure service principal secret and a terraform ssh key secret. All into the SecretHub Secrets Manager and have injected them securely at infrastructure deployment time.

## References

* [Terraform Azure Service Principal](https://www.terraform.io/docs/providers/azurerm/guides/service_principal_client_secret.html)
* [Terraform Azure SSH Keys](https://www.terraform.io/docs/providers/azurerm/r/kubernetes_cluster.html#ssh_key)
* [SecretHub Environment Variables](https://secrethub.io/docs/guides/environment-variables/)
* [Github: aks-secrethub-cluster](https://github.com/ronamosa/aks-secrethub-cluster)
* [SecretHub Pipeline Post](https://secrethub.io/blog/decouple-application-secrets-from-ci-cd-pipeline/)
---
title: "Azure Blob Storage: Break Lease"
---

:::info

Published Date: 12-FEB-2019

:::

I'm busy building stuff in Azure using terraform. I've got different workspaces for terraform for different environments, so I've switched to my new environment workspace.

`terraform workspace new development-env`

When I try to a `terraform init` it a backend config file which will line my terraform up with the statefiles stored in Azure blob storage accounts, I get an error message.


## The backend config

if you're trying to do this:

`terraform init --backend-config=config/backend.conf`

with a backend.conf like this:

```
storage_account_name = "terraformstateaccount"
container_name       = "terraformstateaccount"
key                  = "env-cluster.terraform.tfstate"
```
you run this
```
07:48 $ terraform init --backend-config="config/backend.conf"
Initializing modules...
- module.log_analytics
- module.aks

Initializing the backend...
Backend configuration changed!

Terraform has detected that the configuration specified for the backend
has changed. Terraform will now check for existing state in the backends.


Do you want to migrate all workspaces to "azurerm"?
  Both the existing "azurerm" backend and the newly configured "azurerm" backend
  support workspaces. When migrating between backends, Terraform will copy
  all workspaces (with the same names). THIS WILL OVERWRITE any conflicting
  states in the destination.

  Terraform initialization doesn't currently migrate only select workspaces.
  If you want to migrate a select number of workspaces, you must manually
  pull and push those states.

  If you answer "yes", Terraform will migrate all states. If you answer
  "no", Terraform will abort.

  Enter a value: yes
```

## 'Already has a lease' Error
But instead of a nice bunch of green (is good) text as output, you get this red mess...

![error](/img/azurebreaklease-error.png)

text version for good measure:

```sh
Error migrating the workspace "nptemp" from the previous "azurerm" backend
to the newly configured "azurerm" backend:
    Error loading state:
    failed to lock azure state: storage: service returned error: StatusCode=409, ErrorCode=LeaseAlreadyPresent, ErrorMessage=There is already a lease present.
RequestId:c1d419dc-801e-0072-5e39-c27159000000
Time:2019-02-11T18:42:23.1266536Z, RequestInitiated=Mon, 11 Feb 2019 18:42:22 GMT, RequestId=c1d419dc-801e-0072-5e39-c27159000000, API Version=2016-05-31, QueryParameterName=, QueryParameterValue=
Lock Info:
  ID:        5ee06688-5572-7212-e865-bf75f6f9cb4d
  Path:      scicdterraformstate/nonprod-cluster.terraform.tfstateenv:nptemp
  Operation: workspace_delete
  Who:       ********@Bs-MacBook-Pro.hub
  Version:   0.11.8
  Created:   2018-11-11 22:53:15.745522608 +0000 UTC
  Info:      


Terraform failed to load the default state from the "azurerm" backend.
State migration cannot occur unless the state can be loaded. Backend
modification and state migration has been aborted. The state in both the
source and the destination remain unmodified. Please resolve the
above error and try again.

Terraform copies workspaces in alphabetical order. Any workspaces
alphabetically earlier than this one have been copied. Any workspaces
later than this havent been modified in the destination. No workspaces
in the source state have been modified.

Please resolve the error above and run the initialization command again.
This will attempt to copy (with permission) all workspaces again.
```

you have a lease issue somewhere in your blog storage section of Azure.

## Break the lease

So now you have to figure out which blob storage terraform state file it's referring to and log into azure portal (https://portal.azure.com) to go after it

1. Go to 'All resources'
2. Search or select the 'Resource Group' from the error message (e.g. )
![resoure group](/img/azurebreaklease-resource_group.png)
3. Go to 'blobs'
![blobs](/img/azurebreaklease-blobs.png)
4. Find the locked blob and click 'Break lease'
![break lease](/img/azurebreaklease-break_lease.png)
5. Successful lease break
![break success](/img/azurebreaklease-break_success.png)

## Retry terraform init
You can now try your terraform init and (hopefully) it should be okay now

![init success](/img/azurebreaklease-init_success.png)

That's it. Super simple, I know. But for some reason I couldn't find any notes on what this means when you're terraforming things.

## References

[Blob Service Error Codes](https://docs.microsoft.com/en-us/rest/api/storageservices/blob-service-error-codes)

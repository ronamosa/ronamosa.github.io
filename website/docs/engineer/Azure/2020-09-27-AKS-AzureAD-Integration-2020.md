---
title: "Azure AKS Security: Azure Active Directory (AAD) Integration and K8s RBAC"
---

:::info

Published Date: 27-SEP-2020

:::

This post is going to look at how to create an Azure AKS Cluster with Azure AD Integration enabled to deploy K8s RBAC policies so your users will only be allowed to do things on the AKS Cluster that is tied to their Azure AD Group, and RBAC policies for those groups.

> Why is this important?

Security.

You always want to operate your infrastructure/systems/whatever on the principle of _"least privilege"_, because why have more permissions than is necessary to do your job effectively? There's no good reason and usually a lot of bad outcomes for not locking user access down to just what's required for that user.

The setup is pretty straight forward, but the magic is in how you implement the controls once your AKS Cluster is now linked into your Azure AD.

## Overview

### AKS-AAD Integration

What we're actually creating here are authentication and authorization layers to interact with the AKS Cluster.

At a very basic level, to run a command like `az aks get-credentials --name prod-cluster --resource-group prod-aks-cluster-rg`, you need to first be logged into Azure using `az login`, get a token that says you can run `az aks` commands and then pull a kubeconfig file down from Azure:

![aad-cluster-auth](/img/aad-cluster-level-authentication-flow.png)

The next layer of granularity comes once we have used `az login`, we have pulled down and merged kubeconfig into our `~/.kube/config` file (Linux) and now want to run `kubectl` commands to talk to the AKS Cluster. If you run `kubectl` and don't have a token, you will be prompted to login.

Once you are authenticated successfully, you can start talking to the Kubernetes API Server via `kubectl`... its at this point you will run into RBAC (Role Base Access Control).

Not to be confused with ['Azure RBAC for Kubernetes Authorization](https://docs.microsoft.com/en-us/azure/aks/manage-azure-rbac) which is where Azure AD Groups have roles assigned to it directly, RBAC for this post is the standard Kubernetes RBAC where we deploy roles & bindings to the cluster and the Kubernetes API will manage the permissions for AAD authenticated users.

![aad-integration](/img/aad-integration.png)

And a more detailed sequence diagram of what's happening showing the Auth Webhook Server performing the authorizations

![aad-auth-flow](/img/aad-auth-flow.png)

### Components

The build involves:

* 1 x Virtual Network (VNET)
* 1 x AKS Cluster (Kubernetes v1.19.0)
  * Uses custom AKS module (private repo- for now)
* 1 x Azure AD Group
* RBAC Policies to determine who can do what.

### Versions

It's important you have the following versions, or later of the CLI's, or the new feature `--enable-aad` won't work properly

* az-cli: 2.11.0+

```bash
az --version
azure-cli                         2.12.1

core                              2.12.1
telemetry                          1.0.6

Python location '/opt/az/bin/python3'
Extensions directory '/home/darthvaldr/.azure/cliextensions'

Python (Linux) 3.6.10 (default, Sep 28 2020, 08:40:52) 
[GCC 7.5.0]

Legal docs and information: aka.ms/AzureCliLegal


Your CLI is up-to-date.
```

* kubectl: 1.18.1

```bash
kubectl version
Client Version: version.Info{Major:"1", Minor:"18", GitVersion:"v1.18.2", GitCommit:"52c56ce7a8272c798dbc29846288d7cd9fbae032", GitTreeState:"clean", BuildDate:"2020-04-16T11:56:40Z", GoVersion:"go1.13.9", Compiler:"gc", Platform:"linux/amd64"}
```

## Terraform: Infrastructure build

### Module: Custom Azure VNET

First, get a VNET up and running. I use a custom one from my github repo (private) just to have things done in a specific way, but you can just as easily get one running using the official ['Terraform Registry: Azure VNET Module'](https://registry.terraform.io/modules/Azure/vnet/azurerm/2.2.0).

```go
module "vnet" {
  source  = "git::git@github.com:ronamosa/modules.git//azure/network/vnet"
  vnet_name           = local.vnet_name
  resource_group_name = azurerm_resource_group.vnet_resource_group.name
  location            = var.location
  address_space       = var.address_space
  dns_servers         = var.dns_servers
  subnet_prefixes     = var.subnet_prefixes
  subnet_names        = var.subnet_names
  tags                = var.tags
}
```

Everything is pretty standard, but let's look at my module for some key information about the network we're going to deploy an AKS cluster into

```go
resource "azurerm_virtual_network" "vnet" {
  name                = var.vnet_name
  resource_group_name = var.resource_group_name
  location            = var.location
  address_space       = var.address_space
  dns_servers         = var.dns_servers
  tags                = var.tags
}

resource "azurerm_subnet" "subnet" {
  count                = length(var.subnet_names)
  name                 = var.subnet_names[count.index]
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = [var.subnet_prefixes[count.index]]
}
```

Nothing out of the ordinary here, but I have defaults set in `variables.tf` which holds key information

```go
variable "address_space" {
  type        = list(string)
  description = "The address space that is used by the virtual network."
  default     = ["10.0.0.0/16"]
}

# If no values specified, this defaults to Azure DNS 
variable "dns_servers" {
  description = "The DNS servers to be used with vNet."
  default     = []
}

variable "subnet_prefixes" {
  description = "The address prefix to use for the subnet."
  default     = ["10.0.0.0/22"]
}

variable "subnet_names" {
  description = "A list of public subnets inside the vNet."
  default     = ["subnet1"]
}
```

So, our address space is a nice big `/16` and we cut a `/22` subnet out of that for which we will pass onto our AKS cluster setup to deploy the worker nodes.

### Module: Custom Azure AKS

Again, a custom module from my private repo - I'll explain later why its a custom module - but nothing too far from the official Azure AKS module.

```go
module "aks" {
  source         = "git::git@github.com:ronamosa/modules.git//azure/services/azure_kubernetes_service"
  prefix                  = var.prefix
  location                = var.location
  kubernetes_version      = var.kubernetes_version
  resource_group_name     = azurerm_resource_group.main.name
  vnet_subnet_id          = data.terraform_remote_state.vnet.outputs.vnet_subnet_id[0]
  default_node_pool       = var.default_node_pool
  public_ssh_key          = data.secrethub_secret.ssh_public_key.value
  client_id               = module.service_principal.application_id
  client_secret           = module.service_principal.secret
  api_auth_ips            = var.api_auth_ips
  aad_group_name          = var.aad_group_name
}
```

The key element in the module is `aad_group_name`- this is the Azure AD Group which will be the integration point of our AKS Cluster into Azure AD.

The code from the AKS module looks like this inside the `"azurerm_kubernetes_cluster" {}` block:

```go
data "azuread_group" "aks" {
  name = var.aad_group_name
}

...
...

  role_based_access_control {
    enabled = true

    azure_active_directory {
      managed = true
      admin_group_object_ids = [
        data.azuread_group.aks.id
      ]
    }
  }
```

### Modules: issues with outputs

I wanted to note something I ran into when using modules and my terraform code in the following layout. 

This line `vnet_subnet_id = data.terraform_remote_state.vnet.outputs.vnet_subnet_id[0]` caused a few headaches as I am using the `terraform_remote_state` data source imports an external terraform state file of another infrastructure component so I can reference existing infrastructure. It's important to make sure the module `output.tf` externalizes the information from inside the module's `main.tf` because `terraform_remote_state`'s "outputs" function can only reference what's been defined by the `output` resource function.

So, this from the vnet module sources `output.tf` file

```go
output "vnet_subnet_id" {
  description = "The ids of subnets created inside the new vNet"
  value       = azurerm_subnet.subnet.*.id
}
```

Which is referenced by my infrastructure-as-code setup in my `/network` folder, which defines the `vnet` module in its `outputs.tf` file like this

```go
output "vnet_subnet_id" {
  description = "The ids of subnets created inside the newl vNet"
  value       = module.vnet.vnet_subnet_id
}
```

And can then be referenced by `terraform_remote_state` like this

```go
data "terraform_remote_state" "vnet" {
  backend = "azurerm"

  config = {
    resource_group_name  = "prod-terraform-rg"
    storage_account_name = "somestorageacc92831"
    container_name       = "tfstate"
    key                  = "prod/network/terraform.tfstate"
  }
}
...

vnet_subnet_id = data.terraform_remote_state.vnet.outputs.vnet_subnet_id[0]
```

If you see any errors that look like this

```bash
Error: Incorrect attribute value type

  on .terraform/modules/aks/azure/services/azure_kubernetes_service/main.tf line 30, in resource "azurerm_kubernetes_cluster" "main":
  30:     vnet_subnet_id      = var.vnet_subnet_id
    |----------------
    | var.vnet_subnet_id is tuple with 1 element

Inappropriate value for attribute "vnet_subnet_id": string required.
```

Check the values of your `outputs.tf` are passing the appropriate value `types` through to module references to its final destination.

Now you have completed your build

```bash
module.aks.azurerm_kubernetes_cluster.main: Still creating... [3m40s elapsed]
module.aks.azurerm_kubernetes_cluster.main: Still creating... [3m50s elapsed]
module.aks.azurerm_kubernetes_cluster.main: Still creating... [4m0s elapsed]
module.aks.azurerm_kubernetes_cluster.main: Still creating... [4m10s elapsed]
module.aks.azurerm_kubernetes_cluster.main: Creation complete after 4m12s [id=/subscriptions/00bc7eba-0000-4d87-1111-rf29a73dfa/resourcegroups/prod-aks-cluster-rg/providers/Microsoft.ContainerService/managedClusters/prod-cluster]
```

I retrieved the kubeconfig with the `--admin` switch, so I can do a quick check that the nodes are there

```bash
NAME                           STATUS   ROLES   AGE   VERSION
aks-prod-38331632-vmss000000   Ready    agent   86s   v1.19.0
aks-prod-38331632-vmss000001   Ready    agent   84s   v1.19.0
aks-prod-38331632-vmss000002   Ready    agent   87s   v1.19.0
```

Good.

And from logging into [Azure Portal](https://portal.azure.com) I can see...

![portal aks](/img/aad-portal-aks.png)

* AAD Integrated AKS (AKS-managed AAD)
* RBAC enabled
* also, running latest `1.19.0` kubernetes version.

Now we need to see these authentication and authorization layers in action- we need to see them working to protect the Cluster.

## Authentication

Now that the AKS Cluster is AAD integrated users will need to be logged into Azure to talk to the cluster.

First, pull down a non-admin kubeconfig 

* `az aks get-credentials --name prod-aks-cluster --resource-group prod-aks-cluster-rg`

Now, when you try to run `kubectl` commands, AKS will ask you to authenticate:

![kubectl get nodes](/img/aad-kubectl-azlogin.png)

![kubectl az login](/img/aad-kubectl-azlogin2.png)

![kubectl az login](/img/aad-kubectl-azlogin3.png)

![kubectl az login](/img/aad-kubectl-azlogin4.png)

But if your account doesn't have any permissions to the cluster, it's a no-go for you.

![kubectl az login](/img/aad-kubectl-azlogin5.png)

Here's the thing though... my login _does_ have permission because its in the Azure AD Group I specified in the AKS build above... so this isn't right. 

And that error message is not the "you don't have the right permission" error, its saying I'm not authenticated- which I just did successfully before, so what's happened to my auth?

## Issue with Azure AD & Kubernetes v1.19.0

**Update**: Issue was fixed by [[AKS] Release 2020-10-12 #245](https://github.com/p7t/actus/issues/245) -
_"Fixed an issue with Managed-AAD and kubernetes v1.19 preview. Closes #1891"_.
{: .notice--success}

So, in the course of building this thing and updating my Terraform code to use the new AKS-AAD integration method, I run into this issue.

I build the same AKS cluster using the terraform code above.

After building with `v1.17.1` I use the following command to pull down the kubeconfig file as a normal AD user:

* `az aks get-credentials --name prod-aks-cluster --resource-group prod-aks-cluster-rg`

I run `kgno` which is just my alias for `kubectl get nodes`, and after authenticating (same as above) I can see my nodes:

![auth 1.17.1](/img/auth-v1.17.1.png)

I re-build my AKS cluster with `v1.18.6`, I can see the same thing

![auth 1.18.6](/img/auth-v1.18.6.png)

However, I re-build again with `v1.19.0` and get this error:

![auth 1.19.0](/img/auth-v1.19.0.png)

I've already spent more time on this than I planned so I won't go into detail here. I did open an issue [#1891](https://github.com/Azure/AKS/issues/1891) on the [Azure AKS GitHub Repo](https://github.com/Azure/AKS) for this, so hopefully something comes of it.

In the meantime, `v1.18.6` works so I'll continue with that.

### Azure AD Groups

So far, what we have built and configured here is an AKS Cluster where we have assigned an AAD Group, and anyone who belongs to that group, admin rights to the cluster.

Let's setup a few simple, real-world scenarios, where we have 2 Dev Teams working in the cluster in their own namespaces. Dev1 user from Dev Team 1, and Dev2 user from Dev Team 2. They should be able to deploy and query their own namespaces "dev1" and "dev2" respectively, and nothing else.

To summarize:

* 1 x SRE AD Group (cluster admins automatically)
* 2 x Dev Teams / AD Groups
* Dev1 user in Dev Team 1 AD Group
* Dev2 user in Dev Team 2 AD Group
* 2 x namespaces, "dev1" and "dev2"
* Dev1 can only CRUD in "dev1" namespace
* Dev2 can only CRUD in "dev2" namespace

## Authorization

> What are our users authorized to do after they've authenticated against the AAD by default?

### Kubernetes RBAC Policies

RBAC Policies come in 2 parts:

* 1 x Role Definition - what a role can, or cannot do.
* 1 x Role Binding - where a role applies (i.e. bound to).

In Azure portal I have the following AD Groups created (default create, no extra additives)

![aad groups](/img/aad-ad-groups2.png)

#### dev1-role-binding.yml

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: dev1-user-full-access
  namespace: dev1
rules:
- apiGroups: ["", "extensions", "apps"]
  resources: ["*"]
  verbs: ["*"]
- apiGroups: ["batch"]
  resources:
  - jobs
  - cronjobs
  verbs: ["*"]
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: dev1-user-access
  namespace: dev1
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: dev1-user-full-access
subjects:
- kind: Group
  namespace: dev1
  name: cefXXXXX-XXXX-XXXX-9768-0a6c83e39e91
```

#### dev2-role-binding.yml

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: dev2-user-full-access
  namespace: dev2
rules:
- apiGroups: ["", "extensions", "apps"]
  resources: ["*"]
  verbs: ["*"]
- apiGroups: ["batch"]
  resources:
  - jobs
  - cronjobs
  verbs: ["*"]
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: dev2-user-access
  namespace: dev2
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: dev2-user-full-access
subjects:
- kind: Group
  namespace: dev2
  name: 5c9624fd-xxxx-4808-xxxx-a8xx518xxx2d
```

Create the two `dev` namespaces 

```bash
$ kubectl create ns dev1
namespace/dev1 created

$ kubectl create ns dev2
namespace/dev2 created
```

Apply RBAC policy (role & binding)

```bash
$ kubectl apply -f dev1-role-binding.yml
role.rbac.authorization.k8s.io/dev1-user-full-access created
rolebinding.rbac.authorization.k8s.io/dev1-user-access created

$ kubectl apply -f dev2-role-binding.yml
role.rbac.authorization.k8s.io/dev2-user-full-access created
rolebinding.rbac.authorization.k8s.io/dev2-user-access created
```

Check...

```bash
$ kubectl get role -n dev1
NAME                    CREATED AT
dev1-user-full-access   2020-10-07T12:03:39Z

$ kubectl get role -n dev2
NAME                    CREATED AT
dev2-user-full-access   2020-10-07T12:07:27Z
```

### Test RBAC Policies

Login as `dev1` user and query pods in dev1 namespace

```bash
$ kubectl -n dev1 get pods
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code Q6GR3KMGL to authenticate.
No resources found in dev1 namespace.
```

There's a cool feature of `kubectl` where you can basically ask the AKS cluster what you're allowed to do e.g. at the moment I'm logged in as the `dev1` user so I ask the cluster (via kubectl)

```bash
kubectl auth can-i create pods
no
```

> Why no?

Because without a `-n` switch, the namespace will default to `'default'` and as `dev1` user, I don't actually have any permission to the default namespace.

Next question

> Can I create pods in dev1 namespace?

```bash
kubectl auth can-i create pods -n dev1
yes
kubectl auth can-i delete pods -n dev1
yes
```

Ok, so "yes" I'm allowed to create and delete pods in `dev1` namespace.

Let's try it.

```bash
$ kubectl run nginx-dev1 --image=nginx --namespace dev1
pod/nginx-dev1 created

$ kubectl -n dev1 get pods
NAME         READY   STATUS    RESTARTS   AGE
nginx-dev1   1/1     Running   0          22s
```

Looks good. What can we do in `dev2`?

```bash
$ kubectl auth can-i create pods -n dev2
no

$ kubectl auth can-i get pods -n dev2
no
```

As `dev1` user, I'm not allowed to create or even "get" pods from namespace dev2.

Let's try it.

```bash
kubectl run nginx-dev2 --image=nginx --namespace dev2
Error from server (Forbidden): pods is forbidden: User "dev1@xxxxxxxx.onmicrosoft.com" cannot create resource "pods" in API group "" in the namespace "dev2"
```

Perfect! We're allowed to work where we're supposed to and forbidden from doing things to areas we're not allowed to.

## Summary
## Summary

This was just a simple Azure AD and RBAC demonstration to leverage the new "managed aad" feature for AKS integration. It shows specific details around the AKS build, and then the RBAC policies and how they're deployed and tested to provide a secure, managed Kubernetes environment for multiple teams.

## References

* [Managed AAD Integration](https://docs.microsoft.com/en-us/azure/aks/managed-aad)

* [Kubernetes RBAC for AAD User Groups](https://docs.microsoft.com/en-us/azure/aks/azure-ad-rbac?toc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Faks%2Ftoc.json&bc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json)

* [Azure: Identity Concepts](https://docs.microsoft.com/en-us/azure/aks/concepts-identity)

* [Azure: Operator Best Practices](https://docs.microsoft.com/en-us/azure/aks/operator-best-practices-identity)

* [Restrict kubeconfig Access](https://docs.microsoft.com/en-us/azure/aks/control-kubeconfig-access)

* [Control access to cluster resources using role-based access control and Azure Active Directory identities in Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/azure-ad-rbac?toc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Faks%2Ftoc.json&bc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json)
---
title: "AKS Cluster Part.1"
---

:::info

Published Date: 28-JAN-2019

:::

:::info Update

The code and approach below has been updated 03-JUN-2019 to align with [Post 3](2019-02-04-Azure-Kubernetes-up-and-running-3).

:::

What do we need? An Azure Kubernetes Cluster built with Terraform and setup for az-cli and kubectl to have at it when its done! Easy enough right ;)

The scenario we're building here is getting a Kubernetes cluster up & running in Azure; and using a Private Docker registry to store and pull our application from. We'll be building and deploying into the 'Australia East' Azure Region.

## Series Overview

I call it a 'series', but I really only want to break it up into a couple (maybe 3) parts so its easier to write and more concise to read.

1. Get Kubernetes cluster up and running on Azure Kubernetes Managed Service (AKS)
2. Create a private Docker Registry in the cloud using Azure's Container Registry Managed service (ACR)
3. Deploy a simple application to it.

As usual, we want to automate all the building steps we can. But as you'll see, there are a few parts of this which (to the best of my current knowledge) couldn't be automated and was done manually.

Right, let's go!

## Pre-requisites

You will need setup a few things before you can deploy anything to the cloud.

1. Azure [portal account](https://portal.azure.com)
2. Azure [az-cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-apt?view=azure-cli-latest) (command line interface)
3. Terraform [installed](https://learn.hashicorp.com/terraform/getting-started/install.html) (zipped binary, copy to ~/bin)
4. (optional) Kubectl [installed](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

Once you have all these in place, proceed to the Azure setup

## Azure setup

Once your portal account is created, and you have a valid subscription (Free Tier works), you need to login to link your azure-cli to your account, so from your terminal run this:

```bash
az login
```

a browser window opens, you login with your azure portal account..

and then you'll see something like this:

```bash
user@laptop:~$ az login
Note, we have launched a browser for you to login. For old experience with device code, use "az login --use-device-code"
Opening in existing browser session.
You have logged in. Now let us find all the subscriptions to which you have access...
```

which then spits out some subscription information at you in json

```json
[
  {
    "cloudName": "AzureCloud",
    "id": "0d667072-XXXX-46ef-a5b4-86979fdXXXXX",
    "isDefault": true,
    "name": "Free Trial",
    "state": "Enabled",
    "tenantId": "889cad64-XXXX-410e-b4fd-1cbXXXX537d",
    "user": {
      "name": "myname@server.com",
      "type": "user"
    }
  }
]
```

note this is the output of the following command: `$ az account list`

next, you need a service principal created to have permissions over your infrastructure

### Setup Service Principals for Cluster

You need a Service Principal (sp) setup as Role Based Access Control (rbac) so it has permission and authority over your cluster.

Run this to setup an 'sp' for the subscription you see above under 'id'

```bash
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/XXXXXXX-XXXX-46ef-a5b4-86979fdXXXXX" -n "http://cluster-admin"
```

what's happening here:

* this creates a new service principal (sp) named "cluster-admin"
* the 'Contributor' role is assigned to it
* this sp has power over the subscription with id='0d667072-XXXX-46ef-a5b4-86979fdXXXXX' (Contributor has read/write access)

output example looks like this - first the command throws a notice at you

```bash
Changing "cluster-admin" to a valid URI of "http://cluster-admin", which is the required format used for service principal names
Retrying role assignment creation: 1/36
```

then you get a JSON result

```json
{
  "appId": "475cafbb-b339-40b4-8e69-XXXXXXXXXXX",
  "displayName": "cluster-admin",
  "name": "http://cluster-admin",
  "password": "6f8c2642-df14-XXX-9438-XXXXXXXXXXXXX",
  "tenant": "889cad64-XXX-410e-b4fd-1cbfd002537d"
}
```

so now you have your 'sp' setup, it has the right permissions and you have your appId (client_id) and password (client_secret) to use in terraform for building the cluster.

## Terraform setup

:::info

Note: using terraform v0.12.0 at time of writing.

:::

As per usual terraform build, we need to configure a few key pieces of infrastructure to be built in our cloud.

Key approaches include:

* use workspaces
* use service principals
* use cli inputs instead of hard-coded creds (always a good idea **not** to hard-code creds)
* use an env file to override the default variables.tf

### terraform workspace

_Best Practice Tip: use terraform workspaces to separate you infra code per environment/project._

run `terraform workspace new <environment name />`
e.g.

```bash
13:18 $ terraform workspace new cloudbuilderio
Created and switched to workspace "cloudbuilderio"!

You're now on a new, empty workspace. Workspaces isolate their state,
so if you run "terraform plan" Terraform will not see any existing state
for this configuration.

```

then, with all your terraform files in the dir, setup this workspace with:
`terraform init`

> Let's have a look at our (updated) files...

#### Provider (provider.tf)

this is the Azure provider

```go
provider "azurerm" {
  version = "=1.27.0"
  subscription_id = "$\{var.subscription_id}"
  tenant_id="$\{var.tenant_id}"
}
```

#### Main (main.tf)

main includes setup for resource groups and cluster resources

```go
# Kubernetes Resources

# resource group for cluster
resource "azurerm_resource_group" "aks" {
  name     = "$\{var.resource_group_name}"
  location = "$\{var.location}"
}

# k8s cluster
resource "azurerm_kubernetes_cluster" "k8s" {
  name                = "AKS-$\{ terraform.workspace }"
  kubernetes_version  = "$\{var.kubernetes_version}"
  location            = "$\{azurerm_resource_group.aks.location}"
  resource_group_name = "$\{azurerm_resource_group.aks.name}"
  dns_prefix          = "AKS-$\{var.dns_prefix}"


  linux_profile {
    admin_username = "$\{var.linux_login_user}"

    ssh_key {
      key_data = "$\{var.ssh_public_key}"
    }
  }

  agent_pool_profile {
    name            = "$\{var.node_pool_name}"
    count           = "$\{var.node_pool_size}"
    vm_size         = "$\{var.node_pool_vmsize}"
    os_type         = "$\{var.node_pool_os}"
    os_disk_size_gb = 30
  }

  service_principal {
    client_id     = "$\{var.sp_client_id}"
    client_secret = "$\{var.sp_client_secret}"
  }

  tags = {
    environment = "$\{var.env_tag}"
  }
}

# setup to output your kubeconfig from your terraform build
resource "local_file" "kubeconfig" {
  content = "$\{azurerm_kubernetes_cluster.k8s.kube_config_raw}"
  filename = "./$\{ terraform.workspace }-kubeconfig"
}
```

why is this kubeconfig so important? this is the config file we feed to 'kubectl' so that it knows which cluster things are being applied to!

_note: you can query for the client_id but you need to know the client_secret. If these don't already exist, you need to setup the service principals._

#### Output (output.tf)

some debugging output to make sure we're seeing the kubeconfig details come back to us, and check the host name.

```go
output "kube_config" {
  value = "$\{azurerm_kubernetes_cluster.k8s.kube_config_raw}"
}

output "host" {
  value = "$\{azurerm_kubernetes_cluster.k8s.kube_config.0.host}"
}
```

#### Variables (variables.tf)

Ok, we need to know what the `"$\{var.}"` values in our tf files resolve to, so here they all are in the variables.tf files

```go
# Variables

variable "dns_prefix" {
  description = "DNS prefix"
}

variable "cluster_name" {
  description = "name for your cluster"
}

variable "kubernetes_version" {
  description = "version number."
}

variable "linux_login_user" {
  description = "username to login with"
  default = "ubuntu"
}

variable "ssh_public_key" {
  description = "ssh key to be used for ssh connections"
}

variable "node_pool_name" {
  description = "The name of the node pool"
  default = "nodes"
}

variable "node_pool_size" {
  description = "The amount of nodes in the cluster"
}

variable "node_pool_vmsize" {
  description = "The vmsize for the nodes"
}

variable "node_pool_os" {
  description = "The os for the nodes"
  default = "Linux"
}

variable "tenant_id" {
  description = "azure tenant id"
}

variable "sp_client_id" {
  description = "service principal id"
}

variable "sp_client_secret" {
  description = "service principal secret"
}

variable "resource_group_name" {
  description = "name for your cluster resource group"
}

variable "location" {
  description = "e.g. australiaeast"
}

variable "env_tag" {
  description = "whatever you want here"
}
```

#### env.tfvars

Right. your environment file where you declare your variables that will put in place or over-ride the variables.tf values.

```go
## AKS variables

# subscription details
subscription_id = "fill these in!"
tenant_id = "fill these in!"
sp_client_id = "fill these in!"

# resource details
resource_group_name = "fill these in!"
linux_login_user = "ubuntu"
ssh_public_key = "ssh-rsa past public key here!"
node_pool_size = "3"
node_pool_vmsize = "Standard_DS2_v2"

# network details
dns_prefix = "blog"

# cluster details (change these to what you want!)
kubernetes_version = "1.12.7"
cluster_name = "cbio-cluster"
location = "australiaeast"
env_tag = "cloudbuilder.io"

```

Awesome. Now let's validate and build this puppy!

### terraform validate

only started using this recently since upgrading to terraform v0.12.0 but its a good step to quickly sort your code out. think dev's call this a linter? lol.

```bash
 $ terraform validate --var sp_client_secret="your-sp-secret-here" -var-file=env.tfvars
 Success! The configuration is valid.
```

### terraform apply

Go!

```bash
terraform apply --var sp_client_secret="your sp secret goes here" -var-file=env.tfvars -auto-approve
```

you'll see a bunch of these...

```bash
azurerm_kubernetes_cluster.k8s: Creating...
azurerm_kubernetes_cluster.k8s: Still creating... [10s elapsed]
azurerm_kubernetes_cluster.k8s: Still creating... [20s elapsed]
azurerm_kubernetes_cluster.k8s: Still creating... [30s elapsed]
azurerm_kubernetes_cluster.k8s: Still creating... [40s elapsed]
azurerm_kubernetes_cluster.k8s: Still creating... [50s elapsed]
azurerm_kubernetes_cluster.k8s: Still creating... [1m0s elapsed]
azurerm_kubernetes_cluster.k8s: Still creating... [1m10s elapsed]
azurerm_kubernetes_cluster.k8s: Still creating... [1m20s elapsed]
```

and then when you're finished you'll get your kubeconfig like this

```yaml
Apply complete! Resources: 2 added, 0 changed, 0 destroyed.

Outputs:

host = https://aks-blog-xxxxxxx.hcp.australiaeast.azmk8s.io:443
kube_config = apiVersion: v1
clusters:
- cluster:
    certificate-authority-data:
    ...
    ...
    ...
    server: https://aks-blog-xxxxxx.hcp.australiaeast.azmk8s.io:443
  name: AKS-cloudbuilderio
contexts:
- context:
    cluster: AKS-cloudbuilderio
    user: clusterUser_AKS-CLOUDRESOURCES_AKS-cloudbuilderio
  name: AKS-cloudbuilderio
current-context: AKS-cloudbuilderio
kind: Config
preferences: {}
users:
- name: clusterUser_AKS-CLOUDRESOURCES_AKS-cloudbuilderio
  user:
    client-certificate-data:
    ...
    ...
    ...
    client-key-data:
    ...
    ...
    token: redacted-token-data
```

Success! now you have a file `cloudbuilderio-kubeconfig` in your current directory which you can now use `kubectl` to control your new cluster!

:::tip

For the record, this cluster took 7m9s to create.

:::

```bash
azurerm_kubernetes_cluster.k8s: Creation complete after 7m9s [id=/subscriptions/.../resourcegroups/AKS-CLOUDRESOURCES/providers/Microsoft.ContainerService/managedClusters/AKS-cloudbuilderio]
```

## Verify with 'az' or 'kubectl'

Let's have a look at our new AKS cluster using `kubectl` and file=`cloudbuilderio-kubeconfig`

check it with 'kubectl'

```bash
14:53 $ kubectl --kubeconfig ./cloudbuilderio-kubeconfig get nodes
NAME                   STATUS   ROLES   AGE   VERSION
aks-nodes-28201024-0   Ready    agent   41m   v1.12.7
aks-nodes-28201024-1   Ready    agent   41m   v1.12.7
aks-nodes-28201024-2   Ready    agent   41m   v1.12.7
```

check it with 'az aks'

```bash
14:53 $ az aks list -o table
Name                Location       ResourceGroup       KubernetesVersion    ProvisioningState    Fqdn
------------------  -------------  ------------------  -------------------  -------------------  ---------------------------------------------
AKS-cloudbuilderio  australiaeast  AKS-CLOUDRESOURCES  1.12.7               Succeeded            aks-blog-xxxxx.hcp.australiaeast.azmk8s.io
```

or just login to your [azure portal](https://portal.azure.com/) and have a look at it in the GUI under "Kubernetes services".

In Part 2 we will create an Azure Container Registry using 2 different methods, in which to store our application images ready for deployment.

## References

* [Hashicorp - kubernetes cluster with terraform](https://www.hashicorp.com/blog/kubernetes-cluster-with-aks-and-terraform)
* [Terraform - azurerm](https://www.terraform.io/docs/providers/azurerm/)
* [Azure - create service principals](https://docs.microsoft.com/en-us/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac)

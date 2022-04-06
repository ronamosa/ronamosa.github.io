---
layout: single
author_profile: true 
title: "Sonarqube Scanner Helm Chart with AzureDisk PersistentVolume Setup."
description: >
  Setting up a static PersistentVolume using AzureDisk for your Sonarqube helm chart deployment.
header:
  teaser: /img/sonarqube-logo.png
categories:
  - Testing
tags:
  - helm
  - sonarqube
  - Azure
  - Disks
  - PersistentVolume
toc: true
toc_label: "Table of Contents"
toc_icon: "cog"
comments: true
---

As-is, this sonarqube helm chart will survive a deleted pod event, maybe even a helm delete. But if your cluster is rebuilt, or you run a `helm delete --purge sonarqube` you're going to lose any data and reports that were living with your deployment.

## Pre-requirements

* 2 x AzureDisk
* 1 x K8s cluster
* helm
* kubectl
* az-cli

_installation instructions for these tools can be found [here.](/documentation/2019-01-28-Azure-Kubernetes-up-and-running-1/)_
{: .notice--info}

## Quick K8s Storage Overview

K8s storage took a bit to wrap my head around but essentially when I understood the following topics, it all made sense:

* [Volumes](https://kubernetes.io/docs/concepts/storage/volumes/)
* [PersistentVolumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
  * [PersistentVolumeClaims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
* [Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/)
* [Dynamic Volume Provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/)

### Understanding PersistentVolumes and PersistentVolumeClaims

This [video](https://www.youtube.com/watch?v=OulmwTYTauI) by "IBM FSS FCI and Counter Fraud Management" (no idea why they're called this?!) is probably the clearest explanation I've seen online.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/OulmwTYTauI?controls=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### The abstractions: Volumes, PV, StorageClasses and PVC's

Here's a diagram:
![AKS PV PVC](https://social.technet.microsoft.com/wiki/cfs-filesystemfile.ashx/__key/communityserver-wikis-components-files/00-00-00-00-05/7485.persistent_2D00_volume_2D00_claims.png)

Essentially, in an oversimplified nutshell:

- **Volumes** are derived from Physical Disks that an Admin provisions
- **PersistentVolumes** (static) are an abstraction of the Physical Disks
- **StorageClasses** (dynamic) are also an abstraction of the Physical Disks
- **PersistentVolumeClaims** is what the Pod will actually mount as a "volume". The PVC will determine if you'll be mounting a static PV, or a storageClass Volume.

Right, so now that we've got that out of the way, let's build some things.

## Provision your AzureDisks

* 1 x sonarqube data disk
* 1 x postgresql database disk

```sh
$ az disk create -g AKS-CLOUDRESOURCES -n sonarqube-data --size-gb 10 --sku Standard_LRS --tags application=sonarqube
$ az disk create -g AKS-CLOUDRESOURCES -n postgresql-data --size-gb 16 --sku Standard_LRS --tags application=postgresql
```

example output for sonarqube disk

```json
{
  "creationData": {
    "createOption": "Empty",
    "imageReference": null,
    "sourceResourceId": null,
    "sourceUri": null,
    "storageAccountId": null
  },
  "diskIopsReadWrite": 500,
  "diskMbpsReadWrite": 60,
  "diskSizeGb": 10,
  "encryptionSettings": null,
  "id": "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXX/resourceGroups/AKS-CLOUDRESOURCES/providers/Microsoft.Compute/disks/sonarqube-data",
  "location": "australiaeast",
  "managedBy": null,
  "name": "sonarqube-data",
  "osType": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "AKS-CLOUDRESOURCES",
  "sku": {
    "name": "Standard_LRS",
    "tier": "Standard"
  },
  "tags": {
    "application": "sonarqube"
  },
  "timeCreated": "2019-07-23T11:01:16.893039+00:00",
  "type": "Microsoft.Compute/disks",
  "zones": null
}
```

## storageClass.yaml

Create your storage class. Notice the `Retain` reclaimPolicy so that the volumes aren't deleted when pods and container disappear.

```yaml
  apiVersion: storage.k8s.io/v1
  kind: StorageClass
  metadata:
    name: staticManagedVolumeRetain
  provisioner: kubernetes.io/azure-disk
  parameters:
    kind: Managed
    storageaccounttype: Standard_LRS
  reclaimPolicy: Retain
```

apply

`kubectl apply -f storageClass.yaml`

## Sonarqube Helm Chart

Grab a copy of the official sonarqube helm chart from Github

* [Official Sonarqube Helm Chart](https://github.com/helm/charts/tree/master/stable/sonarqube)

### Update sonarqube values.yaml

add these values to the `values.yaml` file

```yaml
persistence:
  enabled: true
  storageClass: "staticManagedVolumeRetain"
  accessMode: ReadWriteOnce
  size: 5Gi

azureDisk:
  kind: Managed
  diskName: sonarqube-data
  diskURI: /subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXX/resourceGroups/AKS-CLOUDRESOURCES/providers/Microsoft.Compute/disks/sonarqube-data
```

### Create pv.yaml for sonarqube chart

Place this under `/sonarqube/templates/`
<script src="https://gist.github.com/ronamosa/4929df7836519312c10483a427c6715e.js"></script>

## PostgreSQL Helm Sub Chart

We are going to use this [PostgreSQL](https://github.com/databus23/charts/tree/master/stable/postgresql) helm chart as a subchart to sonarqube.

1. Create a directory called `'/charts/'` in the sonarqube root directory.
2. Download the postgresql chart into ``/charts/``.
3. Make the following changes.

### Add postgresql values.yaml

Add the following values (that match the azureDisk's you provisioned earlier).

```yaml
persistence:
  enabled: true
  storageClass: "staticManagedVolumeRetain"
  accessMode: ReadWriteOnce
  size: 5Gi

azureDisk:
  kind: Managed
  diskName: postgresql-data
  diskURI: /subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXX/resourceGroups/AKS-CLOUDRESOURCES/providers/Microsoft.Compute/disks/postgresql-data
```

## Create pv.yaml for PostgreSQL sub-chart

Place this under `/post/templates/`
<script src="https://gist.github.com/ronamosa/0a2c22d31d4e958eabe857236eea0ca3.js"></script>

## Zip PostgreSQL (optional)

After adding the `pv.yaml` file to the postgresql/templates directory and adding the details into the postgresql `values.yaml` file you can tar zip that up so as **postgresql-0.8.3.tgz** and make sure it can be found under `sonarqube/charts` folder.

You can also just keep the files unzipped in their folders under `sonarqube/charts/postgresql/` etc.

Worse case scenario none of this makes sense and is hard to follow - have a look at my git repo with the files laid out how it worked for me: [https://github.com/ronamosa/sonarqube-static-disks.git](https://github.com/ronamosa/sonarqube-static-disks.git)
{: .notice--warning}

## Helm deploy chart

You can now run whatever helm deploy line you usually do to put that badboy into your k8s cluster.

Test the persistence by doing a

* `helm delete --purge sonarqube` or
* `terraform destroy myAksCluster`

and watch when you re-deploy sonarqube that the deployment will find and mount the existing PV's into the pod and you'll see all your previous sonarqube data.

## References

* [My Customised Sonarqube Helm Chart](https://github.com/ronamosa/charts/tree/master/stable/sonarqube)
* [Official Sonarqube Helm Chart](https://github.com/helm/charts/tree/master/stable/sonarqube)
* [Azure Managed Disks (az-cli)](https://docs.microsoft.com/en-us/cli/azure/disk?view=azure-cli-latest)
* [Kubernetes Storage](https://kubernetes.io/docs/concepts/storage/)

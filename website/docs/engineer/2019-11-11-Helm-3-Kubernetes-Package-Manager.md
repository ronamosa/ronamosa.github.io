---
layout: single
title: "Helm3: The Kubernetes Package Manager."
description: >
  installing and setting up helm version 3 for tiller-less kubernetes package management
header:
  teaser: /img/helm-package-manager.png
categories:
  - Kubernetes
tags:
  - helm3
  - helm
  - k8s
  - deployment
  - charts
toc: true
toc_label: "Table of Contents"
toc_icon: "cog"
---

If you've ever tried to automate the helm v2 setup which involved tiller for your infrastructure-as-code repo you'd know that is a pain in the ass. Now, to be fair I haven't had _too_ bad a time with tiller per-se myself. It's there, it runs, keeps a list of deployment releases etc, but otherwise I haven't had too many run-ins. In saying that, I completely agree with the **security** aspect of why tiller's not popular, and with Helm 3, we not only get rid of that security issue, we also seem to be simplifying the helm chart deployment process.

You get helm3. You deploy charts. That's pretty much it. No more client-server relationship setup from your machine to the K8s cluster. Just make sure your `~/.kube/config` file is in order and things _"just work"_.

_Full Credit to [Thornsten Han's](https://thorsten-hans.com/the-state-of-helm3-hands-on) blog on helm3 which has a lot more details on the new Helm 3 release (not final yet), and this post is just my own outputs & notes on playing with Helm3._
{: .notice--info}

## Pre-requirements
* a running Kubernetes cluster
* a copy of `kubectl` and relevant `kubeconfig`

## Download & Setup helm3

* Go to the [helm releases GitHub page](https://github.com/helm/helm/releases)

```sh
ubuntudevbox:~/helm3$ wget https://get.helm.sh/helm-v3.0.0-rc.3-linux-amd64.tar.gz
```

* grab the sha256 checksum & check your download

```sh
ubuntudevbox:~/helm3$ wget https://get.helm.sh/helm-v3.0.0-rc.3-linux-amd64.tar.gz.sha256

ubuntudevbox:~/helm3$ cat helm-v3.0.0-rc.3-linux-amd64.tar.gz.sha256
c4d3eadeb46230430304511166a404cb412ff0dc7ff0999e5b50d18a465c565f

ubuntudevbox:~/helm3$ sha256sum helm-v3.0.0-rc.3-linux-amd64.tar.gz
c4d3eadeb46230430304511166a404cb412ff0dc7ff0999e5b50d18a465c565f  helm-v3.0.0-rc.3-linux-amd64.tar.gz
```
looks good!

* un-pack & check the binary

```sh
ubuntudevbox:~/helm3$ tar zxvf helm-v3.0.0-rc.3-linux-amd64.tar.gz
linux-amd64/
linux-amd64/README.md
linux-amd64/helm
linux-amd64/LICENSE
```

```sh
ubuntudevbox:~/helm3$ ./linux-amd64/helm version
version.BuildInfo{Version:"v3.0.0-rc.3", GitCommit:"2ed206799b451830c68bff30af2a52879b8b937a", GitTreeState:"clean", GoVersion:"go1.13.4"}
```

* create symlink to use

```sh
ubuntudevbox:~/helm3$ sudo ln -s ~/helm3/linux-amd64/helm /usr/bin/helm3
```

## Create and Deploy Helm3 Chart to K8s

```sh
ubuntudevbox:~/helm3/charts$ helm3 create first-helm3
Creating first-helm3
```

default folder layout

```sh
ubuntudevbox:~/helm3/charts$ tree first-helm3/
first-helm3/
├── charts
├── Chart.yaml
├── templates
│   ├── deployment.yaml
│   ├── _helpers.tpl
│   ├── ingress.yaml
│   ├── NOTES.txt
│   ├── serviceaccount.yaml
│   ├── service.yaml
│   └── tests
│       └── test-connection.yaml
└── values.yaml

3 directories, 9 files
```

### Create some helm3 namespaces

```sh
ubuntudevbox:~/helm3/charts$ kubectl create ns helm3-ns1
namespace/helm3-ns1 created
ubuntudevbox:~/helm3/charts$ kubectl create ns helm3-ns2
namespace/helm3-ns2 created
```

### Deploy time

```sh
ubuntudevbox:~/helm3/charts$ helm3 install demo-deploy first-helm3 -n helm3-ns1
NAME: demo-deploy
LAST DEPLOYED: Mon Nov 11 23:19:23 2019
NAMESPACE: helm3-ns1
STATUS: deployed
REVISION: 1
NOTES:
1. Get the application URL by running these commands:
  export POD_NAME=$(kubectl get pods --namespace helm3-ns1 -l "app.kubernetes.io/name=first-helm3,app.kubernetes.io/instance=demo-deploy" -o jsonpath="{.items[0].metadata.name}")
  echo "Visit http://127.0.0.1:8080 to use your application"
  kubectl --namespace helm3-ns1 port-forward $POD_NAME 8080:80
```

do a 2nd deploy to `helm3-ns2` with the same release name `demo-deploy`.

```sh
ubuntudevbox:~/helm3/charts$ helm3 install demo-deploy first-helm3 -n helm3-ns2
```

### Check deploys & Release names

Why is the following important/different? Before in helm v2 a `helm list` would give you EVERY release in tiller's records. These releases were cluster-wide so the release name had to be unique every time.

Now you can have the same release name, but _"namespaced"_ i.e. can limit it to individual namespaces.

```sh
amosar@ubuntudevbox:~/helm3/charts$ helm3 list
NAME    NAMESPACE       REVISION        UPDATED STATUS  CHART   APP VERSION
amosar@ubuntudevbox:~/helm3/charts$ helm3 list --all-namespaces
NAME            NAMESPACE       REVISION        UPDATED                                         STATUS          CHART                   APP VERSION
demo-deploy     helm3-ns1       1               2019-11-11 23:19:23.929552772 +1300 NZDT        deployed        first-helm3-0.1.0       1.16.0
demo-deploy     helm3-ns2       1               2019-11-11 23:20:46.85356628 +1300 NZDT         deployed        first-helm3-0.1.0       1.16.0
```

although if you try to re-install an existing chart you get

```sh
ubuntudevbox:~/helm3/charts$ helm3 install demo-deploy first-helm3 -n helm3-ns1
Error: cannot re-use a name that is still in use
```

### Deployments as K8s Secrets

I thought this was important to know: deployments are tracked as secrets of type `'helm.sh/release.v#'` in their respective namespaces.

e.g.

```sh
ubuntudevbox:~/helm3/charts$ kubectl get secret -n helm3-ns1
NAME                                  TYPE                                  DATA   AGE
default-token-5d4rt                   kubernetes.io/service-account-token   3      8m44s
demo-deploy-first-helm3-token-njxbf   kubernetes.io/service-account-token   3      7m
sh.helm.release.v1.demo-deploy.v1     helm.sh/release.v1                    1      7m
```

### Update Chart & Upgrade Helm Release

using the `upgrade` subcommand on helm3

```sh
ubuntudevbox:~/helm3/charts$ helm3 upgrade demo-deploy first-helm3 -n helm3-ns1
Release "demo-deploy" has been upgraded. Happy Helming!
NAME: demo-deploy
LAST DEPLOYED: Mon Nov 11 23:29:02 2019
NAMESPACE: helm3-ns1
STATUS: deployed
REVISION: 2
NOTES:
1. Get the application URL by running these commands:
  export POD_NAME=$(kubectl get pods --namespace helm3-ns1 -l "app.kubernetes.io/name=first-helm3,app.kubernetes.io/instance=demo-deploy" -o jsonpath="{.items[0].metadata.name}")
  echo "Visit http://127.0.0.1:8080 to use your application"
  kubectl --namespace helm3-ns1 port-forward $POD_NAME 8080:80
```

and now check the 'secrets' aka where the releases are tracked

```sh
ubuntudevbox:~/helm3/charts$ kubectl get secret -n helm3-ns1
NAME                                  TYPE                                  DATA   AGE
default-token-5d4rt                   kubernetes.io/service-account-token   3      12m
demo-deploy-first-helm3-token-njxbf   kubernetes.io/service-account-token   3      10m
sh.helm.release.v1.demo-deploy.v1     helm.sh/release.v1                    1      10m
sh.helm.release.v1.demo-deploy.v2     helm.sh/release.v1                    1      69s
```

we've got `sh.helm.release.v1.demo-deploy.v1` and `sh.helm.release.v1.demo-deploy.v2` now.

```sh
ubuntudevbox:~/helm3/charts$ helm3 list --all-namespaces
NAME            NAMESPACE       REVISION        UPDATED                                         STATUS          CHART                   APP VERSION
demo-deploy     helm3-ns1       2               2019-11-11 23:29:02.572760512 +1300 NZDT        deployed        first-helm3-0.1.0       1.16.0
demo-deploy     helm3-ns2       1               2019-11-11 23:20:46.85356628 +1300 NZDT         deployed        first-helm3-0.1.0       1.16.0
```

Thanks for reading!

## References

* ['the state of helm 3 hands on' by Thornsten Hans](https://thorsten-hans.com/the-state-of-helm3-hands-on)

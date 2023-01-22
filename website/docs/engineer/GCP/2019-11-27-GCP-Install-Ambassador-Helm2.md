---
title: "Setup Ambassador API Gateway on GCP."
---

:::info

Published Date: 27-NOV-2019

:::

A pre-requisite to another post I'm writing where I'm setting up a Nexus instance, requires a working Ambassador setup. I only figured that out when trying to deploy my Nexus setup so here I am writing the pre-cursor to writing that blog i.e. set this up so I can set _that_ up.

I've written about [Ambassador](https://www.getambassador.io/) before.

Learn a little bit about it on a blog I wrote about [disabling tls1, tls1.0 on Ambassador](/docs/engineer/K8s/2019-07-09-Ambassador-Disable-TLS1).

Basically, this is a quick run through setting up a simple ambassador API gateway that proxies connections through to a nginx backend pod/service using helm (version 2 for now).

![architecture](/img/gcp-ambassador-architecture.png)

### key components

* ambassador deployment
* www-demo deployment
* gcp ingress points = IP addresses by virtue of ambassador's `LoadBalancer` IP exposing ambassador service to the internet.
* the ambassador annotation that does the ambassador->backend mapping or routing.

## Pre-requisites

* `kubectl` installed
* grabbed a `kubeconfig` file from your GKE cluster
* [helm3](/docs/engineer/K8s/2019-11-11-Helm-3-Kubernetes-Package-Manager) installed.

## Create your GKE Cluster

However you want to do it, via terraform or via [https://console.cloud.google.com](https://console.cloud.google.com) just get one up & running.

## Setup your kubectl

For me I setup a demo cluster `development-cluster-1` in `us-central1-a` on my `cloudbuilderio` project

```bash
gcloud container clusters get-credentials development-cluster-1 --zone us-central1-a --project cloudbuilderio
```

test it

```bash
ubuntudevbox:~/GCP$ kubectl get nodes
NAME                                                  STATUS   ROLES    AGE   VERSION
gke-development-cluster--default-pool-d0e1b087-llxh   Ready    <none>   32m   v1.13.11-gke.14
gke-development-cluster--default-pool-d0e1b087-z8gh   Ready    <none>   32m   v1.13.11-gke.14
gke-development-cluster--default-pool-d0e1b087-z8s7   Ready    <none>   32m   v1.13.11-gke.14
```

## Setup charts : helm version 2

### create tiller-rbac service account

Deploy this yaml config

```yaml title="tiller-rbac.yaml"
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tiller
  namespace: kube-system
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: tiller-clusterrolebinding
subjects:
- kind: ServiceAccount
  name: tiller
  namespace: kube-system
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: ""
```

deploy with : `$ kubectl create -f ./tiller-rbac.yaml`

### install tiller

helm v2 needs tiller, so run `helm init`

```bash
23:30 $ helm2 init
Creating /home/user1/.helm
Creating /home/user1/.helm/repository
Creating /home/user1/.helm/repository/cache
Creating /home/user1/.helm/repository/local
Creating /home/user1/.helm/plugins
Creating /home/user1/.helm/starters
Creating /home/user1/.helm/cache/archive
Creating /home/user1/.helm/repository/repositories.yaml
Adding stable repo with URL: https://kubernetes-charts.storage.googleapis.com
Adding local repo with URL: http://127.0.0.1:8879/charts
$HELM_HOME has been configured at /home/user1/.helm.

Tiller (the Helm server-side component) has been installed into your Kubernetes Cluster.

Please note: by default, Tiller is deployed with an insecure 'allow unauthenticated users' policy.
To prevent this, run `helm init` with the --tiller-tls-verify flag.
For more information on securing your installation see: https://docs.helm.sh/using_helm/#securing-your-helm-installation
```

### helm fetch ambassador charts

As helm2 fetch the latest stable ambassador helm chart

```bash
helm2 fetch stable/ambassador --untar
```

### setup ingress, application namespaces

We will setup a namespace for ambassador (ingress), and another one for a web app demo (application) that ambassador will proxy through to

```bash
$ kubectl create ns ingress
namespace/ingress created

$ kubectl create ns application
namespace/application created
```

check namespaces

```bash
23:52 $ kubectl get ns
NAME              STATUS   AGE
application       Active   7m26s
default           Active   32m
ingress           Active   7m32s
kube-node-lease   Active   32m
kube-public       Active   32m
kube-system       Active   32m
```

### deploy helm2 chart

`$ helm2 install ambassador/ -n ambassador --namespace ingress`

output

```bash
NAME:   ambassador
LAST DEPLOYED: Sun Dec  1 00:25:54 2019
NAMESPACE: ingress
STATUS: DEPLOYED

RESOURCES:
==> v1/Deployment
NAME        READY  UP-TO-DATE  AVAILABLE  AGE
ambassador  0/3    3           0          1s

==> v1/Pod(related)
NAME                        READY  STATUS             RESTARTS  AGE
ambassador-d7fbbd8f6-cfwc7  0/1    ContainerCreating  0         1s
ambassador-d7fbbd8f6-vbcd4  0/1    ContainerCreating  0         1s
ambassador-d7fbbd8f6-xhcgs  0/1    ContainerCreating  0         1s

==> v1/Service
NAME              TYPE          CLUSTER-IP  EXTERNAL-IP  PORT(S)                     AGE
ambassador        LoadBalancer  10.4.14.46  <pending>    80:30491/TCP,443:30181/TCP  1s
ambassador-admin  ClusterIP     10.4.9.233  <none>       8877/TCP                    1s

==> v1/ServiceAccount
NAME        SECRETS  AGE
ambassador  1        1s

==> v1beta1/ClusterRole
NAME             AGE
ambassador       1s
ambassador-crds  1s

==> v1beta1/ClusterRoleBinding
NAME             AGE
ambassador       1s
ambassador-crds  1s


NOTES:
Congratulations! You\'ve successfully installed Ambassador.

For help, visit our Slack at https://d6e.co/slack or view the documentation online at https://www.getambassador.io.

To get the IP address of Ambassador, run the following commands:
NOTE: It may take a few minutes for the LoadBalancer IP to be available.
     You can watch the status of by running 'kubectl get svc -w  --namespace ingress ambassador'

  On GKE/Azure:
  export SERVICE_IP=$(kubectl get svc --namespace ingress ambassador -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

  On AWS:
  export SERVICE_IP=$(kubectl get svc --namespace ingress ambassador -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

  echo http://$SERVICE_IP:
```

you can now see this in GCP's console

![installed](/img/gcp-ambassador-installed.png)

Ok. Ambassador installed and we're ready to rock'n'roll.

## Create & Deploy a demo pod

### helm create

create a dummy/demo helm chart

```bash
~/helm/charts/v2 $ helm2 create www-demo
```

:::info

helm2 is my symlink to the helm v2 binary cos I have helm3 installed as the default 'helm' command

:::

this is your new demo chart

```bash
✔ ~/helm/charts/v2/www-demo
21:16 $ tree
.
├── charts
├── Chart.yaml
├── templates
│   ├── deployment.yaml
│   ├── _helpers.tpl
│   ├── ingress.yaml
│   ├── NOTES.txt
│   ├── service.yaml
│   └── tests
│       └── test-connection.yaml
└── values.yaml

3 directories, 8 files
```

### edit the service.yaml

update your `templates/service.yaml` file so it looks like this:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ include "www-demo.fullname" . }}
  labels:
{{ include "www-demo.labels" . | indent 4 }}
  annotations:
    getambassador.io/config: |
      ---
      apiVersion: ambassador/v1
      kind: Mapping
      name: www_mapping
      prefix: /
      service: {{ include "www-demo.fullname" . }}.application:80
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: http
      protocol: TCP
      name: http
  selector:
    app.kubernetes.io/name: {{ include "www-demo.name" . }}
    app.kubernetes.io/instance: {{ .Release.Name }}
```

key things in this config

* the 'service' in the annotation name has to match the name of this service.
* the service annotation also follows the form `service_name.namespace_name:port` and we will be deploying the demo in the `application` namespace on the `http` port (80)

### deploy the www-demo chart

```bash
19:58 $ helm2 upgrade --install www-demo www-demo/
WARNING: Namespace "default" doesnt match with previous. Release will be deployed to application
Release "www-demo" has been upgraded.
LAST DEPLOYED: Mon Dec  2 19:58:13 2019
NAMESPACE: application
STATUS: DEPLOYED

RESOURCES:
==> v1/Deployment
NAME      READY  UP-TO-DATE  AVAILABLE  AGE
www-demo  1/1    1           1          7m8s

==> v1/Pod(related)
NAME                      READY  STATUS   RESTARTS  AGE
www-demo-8895fbdcb-gj8bh  1/1    Running  0         7m8s

==> v1/Service
NAME      TYPE       CLUSTER-IP  EXTERNAL-IP  PORT(S)  AGE
www-demo  ClusterIP  10.4.2.172  <none>       80/TCP   7m8s


NOTES:
1. Get the application URL by running these commands:
  export POD_NAME=$(kubectl get pods --namespace application -l "app.kubernetes.io/name=www-demo,app.kubernetes.io/instance=www-demo" -o jsonpath="{.items[0].metadata.name}")
  echo "Visit http://127.0.0.1:8080 to use your application"
  kubectl port-forward $POD_NAME 8080:80
```

### test direct connection to the pod

using `kubectl` port-forwarding, let's just check the service & port is up & running ready for business

Get the pod name

```bash
kubectl -n application get pods
NAME                       READY   STATUS    RESTARTS   AGE
www-demo-8895fbdcb-gj8bh   1/1     Running   0          102m
```

`port-forward` to the remote pod on port 80, from local port 8080

```bash
kubectl -n application port-forward www-demo-8895fbdcb-gj8bh 8080:80 --address 0.0.0.0
Forwarding from 0.0.0.0:8080 -> 80
```

:::tip

_I'm doing the `--address` switch because I'm running this command on a different box (with IP address 192.168.1.19) and want to open the connection local to this machine I'm writing on._

:::

should get this if everything's in order

![port-forward](/img/gcp-ambassador-portforward.png)

### test the external IP address (ingress)

If the ambassador mapping is correct and the www-demo pod is up & running (which we've confirmed) we should be able to go to the Public IP on GCP's "Services & Ingress" page - 35.244.116.86 - on port 80 and see this

![ingress](/img/gcp-ambassador-ingress.png)

And that's it!

Tune in next time when I try and get helm3 charts working for ambassador (maybe).
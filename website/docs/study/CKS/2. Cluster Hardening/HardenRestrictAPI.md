---
title: API Hardening / Restricting
---

Request (human/pod+sa) --> authN --> authZ (k8s api) --> admission controller

Do's

- dont allow anonymous access
- close insecure ports
- dont expose ApiServer to the internet
- restrict access from Node --> API (NodeRestriction)

## Anonymous Access

check `/etc/kubernetes/manifest/kube-apiserver.yaml` for allowing anoymous access flags

```yaml
spec:
  containers:
  - command:
    - kube-apiserver
    - --anonymous-auth=false
```

then check it via curl `root@master$ curl -k https://localhost:6443`

should show "Unauthorized" now.

BUT- we need to enable it because liveness pods need it for calling k8s api anonymously.

## Insecure Access

note, since v1.20 you can no longer run kube-apiserver with `--insecure-port=XXXX` as it is diabled BUT- learn this for places running older k8s.

if you use `--insecure-port` it will do the following

- HTTP (sniff)
- bypasses authN and authZ modules
- admin controller still enforced

can disable by setting port=0

## Manual API Request

using kubeconfig to make manual request.

1. copy server-certificate-data from `~/.kube/config` through `| base64 -d` to ca.crt
2. copy client-certificate-data from `~/.kube/config` through `| base64 -d` to client.crt
3. copy client-key-data from `~/.kube/config` through `| base64 -d` to key.pem
4. get ip address from `~/.kube/config` section under `clusters:cluster:server`

the call

```bash
curl https://master-local-ip:6443 --cacert ca.crt # works

curl https://master-local-ip:6443 --cacert ca.crt --cert crt --key key.pem # works

```

## External API Access

api-server reachable from the outside world.

simple - edit the `kubernetes` service change `ClusterIP` to `NodePort` : `k edit svc kubernetes`

grab the port from `k get svc`

```bash
# external-ip from cloud provider e.g. GCP
localhost$ curl https://external-ip:NodePort -k # authN as user
```

get kubeconfig from your master node: `k config view --raw` copy output to a local `~/config` file BUT you need to change the server address from the local-ip (e.g. 10.4.10.24) to the `external-ip:NodePort` that works for you in the curl command previously.

use the local external access via: `k --kubeconfig ~/config get ns`

you get an error. why?

ip address of the cert is valid for the local-ip where the cert was setup (master node), but now we're trying to use it on the external-ip.

inspect the cert as follows:

```bash
# inspect apiserver cert
cd /etc/kubernetes/pki
openssl x509 -in apiserver.crt -text
```

it checks out that the cert only allows the two ip addresses local to the node... how to fix?

add a host entry in your local machine `/etc/hosts`

```bash
<external-ip> kubernetes
```

now try use the local external access via: `k --kubeconfig ~/config get ns` and it should work.

## NodeRestriction AdmissionController

this admin controller

- `kube-apiserver --enable-admission-plugins=NodeRestriction`
- limits the node labels a kubelet can modify

secure workload isolation via labels!

## Verify NodeRestriction

do this on worker node.

check in kube-apiserver manifest that `NodeRestriction` is enabled.

on the worker node, `export KUBECONFIG=/etc/kubernetes/kubelet.conf` <-- this is the kubelets `kubeconfg` file for talking to the k8sAPI.

```bash
worker$ export KUBECONFIG=/etc/kubernetes/kubelet.conf
worker$ k get ns # fails, forbidden
worker$ k get node # works
worker$ k label node cks-master cks/test=yes # fails, forbidden
worker$ k label node cks-worker cks/test=yes # works
worker$ k label node cks-worker node-restriction.kubernetes.io/test=yes # fails, forbidden
```

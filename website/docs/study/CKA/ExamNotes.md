---
title: Exam Notes
sidebar_position: 0.5
---

## Courses & Practice Exams

:::info

My study preperations included

- 2 x [killer.sh](https://killer.sh) simulators included in the CKS exam purchase.

:::

### Prepare terminal drills

repeatedly running these commands at the beginning of each mock exam session helped memorize them for the exam.

```bash
alias k="/usr/bin/kubectl"
export do="--dry-run=client -oyaml"

echo "set tabstop=2" > ~/.vimrc
echo "set shiftwidth=2" > ~/.vimrc
```

## killer.sh sessions

### terminal setup

vim

```sh
edit ~/.vimrc
set tabstop=2
set expandtab
set shiftwidth=2
```

dry-run && output yaml

```sh
export do="--dry-run=client -o yaml"
```

### kubectl to YAML

e.g. `kubectl run nginx --image=nginx --restart=Never --label="key:value,key:value" --dry-run=client -oyaml > pod.yaml`

### contexts

`kubectl config get-contexts | current-context`
`kubectl config get-contexts -o name > output.txt`

or use jsonpath e.g. `kubectl config view -o jsonpath="{.contexts[*].name}`

### scheduling

schedule pod on _master nodes only_

- `toleration` = runs on master nodes
- `nodeSelector` = runs ONLY on master nodes

```yaml
  tolerations:                            # add
  - effect: NoSchedule                    # add
    key: node-role.kubernetes.io/master   # add
  nodeSelector:                           # add
    node-role.kubernetes.io/master: ""    # add
```

### scale commands

find resource types && look at type

```sh
kubectl -n <namespace> get deploy,ds,sts ...
kubectl -n <namespace> get pod --show-labels | grep <pod_name>
```

### sa, roles, rolebinding

```sh
kubectl get sa -n project-hamster
kubectl -n project-hamster create role processor --verb=create --resource=secrets,configmap
kubectl -n project-hamster create rolebinding processor --role=processor --serviceaccount=project-hamster:processor
```

### liveness & readiness

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: "2021-07-10T23:57:12Z"
  labels:
    run: ready-if-service-ready
  name: ready-if-service-ready
  namespace: default
  resourceVersion: "14063"
  uid: 0ebc8fd2-74dc-4499-862d-5fe6e774f27e
spec:
  containers:
  - image: nginx:1.16.1-alpine
    imagePullPolicy: IfNotPresent
    name: ready-if-service-ready
    resources: {}
    terminationMessagePath: /dev/termination-log
    terminationMessagePolicy: File
    volumeMounts:
    - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
      name: kube-api-access-bbwg8
      readOnly: true
    livenessProbe:
      exec:
        command:
        - 'true'
    readinessProbe:
      exec:
        command:
        - sh
        - -c
        - 'wget -T2 -O- http://service-am-i-ready:80'    
```

### pv & pvc

find example of pv & pvc

```yaml
# 6_pv.yaml
kind: PersistentVolume
apiVersion: v1
metadata:
 name: safari-pv
spec:
 capacity:
  storage: 2Gi
 accessModes:
  - ReadWriteOnce
 hostPath:
  path: "/Volumes/Data"
```

```yaml
# 6_pvc.yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: safari-pvc
  namespace: project-tiger
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
     storage: 2Gi
```

use in a deployment

```sh
k -n <namepsace> create deploy <name> --image=httpd:2.4.41-alpine $do > dep.yaml
```

edit

```yaml
# 6_dep.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: safari
  name: safari
  namespace: project-tiger
spec:
  replicas: 1
  selector:
    matchLabels:
      app: safari
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: safari
    spec:
      volumes:                                      # add
      - name: data                                  # add
        persistentVolumeClaim:                      # add
          claimName: safari-pvc                     # add
      containers:
      - image: httpd:2.4.41-alpine
        name: container
        volumeMounts:                               # add
        - name: data                                # add
          mountPath: /tmp/safari-data               # add
```

### master components

is it a process, static-pod (single Pod manifest) or Pod (deployment manifest)?

- check `ps aux | grep kube` -- running in here? process
- check `kubectl -n kube-system get pods` -- if the suffix to podnames don't look "random", its most likely a static-pod.
- check `/etc/kubernetes/manifest` (kubeadm) and see the Pod manifest files.

how does it start up?

- check `find /etc/systemd/system | grep kube` to see which _kube_ services are managed by systemd.

how to temporarily stop a `kube-system` service?

- move the `/etc/kubernetes/manifest/some-kube-api-service.yaml` OUT of this directory and the pod will terminate itself.

### pod affinity

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    id: very-important
  name: deploy-important
  namespace: project-tiger
spec:
  replicas: 3
  selector:
    matchLabels:
      id: very-important
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        id: very-important
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: id
                operator: In
                values:
                - very-important
            topologyKey: "kubernetes.io/hostname"
      containers:
      - image: nginx:1.17.6-alpine
        name: nginx
        resources: {}
      - image: kubernetes/pause
        name: pause
        resources: {}
```

## Exam tips from brad mccoy (cncf)

```sh
alias k=kubectl
k api-resources # get short names
watch kubectl get pods -n dev # monitor commands vs -w
ETCDCTL_API=3 etcdctl snapshot restore -h # etcd backup will be in the exam
systemctl daemon-reload && systemctl restart kubelet # troubleshooting kubelet
```

### Upgrade Cluster

```sh
apt-get update && apt-get install -y kubeadm=1.20.x-00
sudo kubeadm upgrade apply v1.20.x
```

### Node is NotReady

troubleshooting steps relevant to k8s

1. check `systemctl status <service>` - error messages?
2. check `/etc/kubernetes/manifest` of services having issues - where does error say the problem is?
3. view another nodes config files and status to compare to the troubled node
4. correct any typos etc in config files and restart services (assuming they are handled by `systemd`)

---
title: GUI Elements
---

What do we know about the k8s Dashboard?

- expose externally if needed only
- can also use `kubectl port-forward`

### kubectl proxy

- creates proxy server between localhost and k8s api server
- uses kubeconfig
- allow access to api locally over http no auth

http://localhost:8001/ --> kubectl proxy --> kubectl (https) --> k8s api

### kubectl port-forward

- forwards localhost-port to pod-port

`tcp://localhost:1234 --> kubectl port-foward --> kubectl --> api server --> pod:port (e.g. dashboard on 10.1.2.3:443)`

so now localpost port 1234 is fowarded to dashboard on 10.1.2.3 port 443.

### Ingress

can use it to expose dashboard to the internet if you want, but PLEASE USE SOME AUTH! e.g. can use nginx-ingress, but implement auth on it.

## Install k8s dashboard

install: `kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.3.1/aio/deploy/recommended.yaml`

```bash
root@cks-master:~# kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.3.1/aio/deploy/recommended.yaml
namespace/kubernetes-dashboard created
serviceaccount/kubernetes-dashboard created
service/kubernetes-dashboard created
secret/kubernetes-dashboard-certs created
secret/kubernetes-dashboard-csrf created
secret/kubernetes-dashboard-key-holder created
configmap/kubernetes-dashboard-settings created
role.rbac.authorization.k8s.io/kubernetes-dashboard created
clusterrole.rbac.authorization.k8s.io/kubernetes-dashboard created
rolebinding.rbac.authorization.k8s.io/kubernetes-dashboard created
clusterrolebinding.rbac.authorization.k8s.io/kubernetes-dashboard created
deployment.apps/kubernetes-dashboard created
service/dashboard-metrics-scraper created
deployment.apps/dashboard-metrics-scraper created
root@cks-master:~# k get ns
NAME                   STATUS   AGE
cassandra              Active   48m
default                Active   14d
kube-node-lease        Active   14d
kube-public            Active   14d
kube-system            Active   14d
kubernetes-dashboard   Active   26s
root@cks-master:~# k -n kubernetes-dashboard get pod,svc
NAME                                             READY   STATUS    RESTARTS   AGE
pod/dashboard-metrics-scraper-856586f554-x2m9b   1/1     Running   0          52s
pod/kubernetes-dashboard-67484c44f6-zbhmn        1/1     Running   0          52s

NAME                                TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
service/dashboard-metrics-scraper   ClusterIP   10.98.132.195   <none>        8000/TCP   52s
service/kubernetes-dashboard        ClusterIP   10.105.25.220   <none>        443/TCP    52s
```

### External Access

bad example - available externally over HTTP

```bash
root@cks-master:~# k -n kubernetes-dashboard edit deploy kubernetes-dashboard
```

add in our insecure-port arg

```yaml
  template:
    metadata:
      creationTimestamp: null
      labels:
        k8s-app: kubernetes-dashboard
    spec:
      containers:
      - args:
        - --auto-generate-certificates
        - --namespace=kubernetes-dashboard
        image: kubernetesui/dashboard:v2.3.1
        imagePullPolicy: Always
        livenessProbe:
          failureThreshold: 3
          httpGet:
            path: /
            port: 8443
            scheme: HTTPS
```

to

```yaml
  template:
    metadata:
      creationTimestamp: null
      labels:
        k8s-app: kubernetes-dashboard
    spec:
      containers:
      - args:
        - --namespace=kubernetes-dashboard
        - --insecure-port=9090
        image: kubernetesui/dashboard:v2.3.1
        imagePullPolicy: Always
        livenessProbe:
          failureThreshold: 3
          httpGet:
            path: /
            port: 9090
            scheme: HTTP
```

change service to `NodePort`

from

```yaml
spec:
  clusterIP: 10.105.25.220
  clusterIPs:
  - 10.105.25.220
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
  ports:
  - port: 443
    protocol: TCP
    targetPort: 8443
  selector:
    k8s-app: kubernetes-dashboard
  sessionAffinity: None
  type: ClusterIP
```

to

```yaml
spec:
  clusterIP: 10.105.25.220
  clusterIPs:
  - 10.105.25.220
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
  ports:
  - port: 9090
    protocol: TCP
    targetPort: 9090
  selector:
    k8s-app: kubernetes-dashboard
  sessionAffinity: None
  type: ClusterIP
```

find external IP for the compute instance

```bash
gcloud compute instances list
 NAME        ZONE                    MACHINE_TYPE  PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP    STATUS
cks-master  australia-southeast1-a  e2-medium                  10.152.0.2   35.189.40.8    RUNNING
cks-worker  australia-southeast1-a  e2-medium                  10.152.0.4   35.244.67.113  RUNNING
```

now in your local browser - open `http://35.244.67.113:30478` and you can see the dashboard.

### Access and Service Accounts

look at the default service account (sa)

```bash
root@cks-master:~# k -n kubernetes-dashboard get sa
NAME                   SECRETS   AGE
default                1         16m
kubernetes-dashboard   1         16m
root@cks-master:~# k get clusterroles | grep view
system:aggregate-to-view                                               2021-08-08T22:33:40Z
system:public-info-viewer                                              2021-08-08T22:33:40Z
view                                                                   2021-08-08T22:33:40Z
```

create a rolebinding `insecure`:

```bash
root@cks-master:~# k -n kubernetes-dashboard create rolebinding insecure --serviceaccount kubernetes-dashboard:kubernetes-dashboard --clusterrole view -oyaml --dry-run=client
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  creationTimestamp: null
  name: insecure
  namespace: kubernetes-dashboard
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: view
subjects:
- kind: ServiceAccount
  name: kubernetes-dashboard
  namespace: kubernetes-dashboard

root@cks-master:~# k -n kubernetes-dashboard create rolebinding insecure --serviceaccount kubernetes-dashboard:kubernetes-dashboard --clusterrole view rolebinding.rbac.authorization.k8s.io/insecure created
```

only allows access to cluster-role view in the kubernetes-dashboard namespace... nothing else.

if we change `rolebinding` to `clusterrolebinding` -- now we have view across the WHOLE CLUSTER

```bash
root@cks-master:~# k -n kubernetes-dashboard create clusterrolebinding insecure --serviceaccount kubernetes-dashboard:kubernetes-dashboard --clusterrole view 
clusterrolebinding.rbac.authorization.k8s.io/insecure created
```

browsing the external dashboard url from above, can now see ALL namespaces.

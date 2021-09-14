---
title: Network Policies
---

What are they?

- fw rules in k8s
- implemented by CNI (calico/weave)
- ns level
- restrict ingress/egress for pods based specific conditions.

Without network policies (NP)

- every pod can talk to every pod
- no pods are *isolated*

NP flow example `podSelector`:

- `podSelector` = will be applied TO (source)
- `policyType` = e.g. egress, ingress
- `podSelector` = policy applied TO (destination)

:::note

As soon as you specific a NP e.g. an ingress from pod group A to pod group B --> ALL other ingress will be blocked. Essentially NP become the network dictator for those pods selected

:::

NP flow example `namespaceSelector`:

`podSelector` <-- `policyType:Ingress` <-- `namespaceSelector`

NP flow example `ipBlock`:

`podSelector` --> `policyType:Egress` --> `ipBlock:10.0.0.0/24`

`podSelector` <-- `policyType:Inress` <-- `ipBlock:10.0.0.0/24`

You can put the rules in two separate policies (which will get merged) or just in a single yaml file.

### Single Network Policy

single network policy

```yaml
kind: NetworkPolicy
metadata:
  name: example
  namespace: default
spec:
  podSelector:
    matchLabels:
      id: frontend
    policyTypes:
    - Egress
```

this policy right now

- is valid
- lives in namespace `default`
- denies ALL outgoing traffic (it has indicated Egress so now its the all-controlling egress ruler)

carrying on

### Multi Network Policy

```yaml
kind: NetworkPolicy
metadata:
  name: example
  namespace: default
spec:
  podSelector:
    matchLabels:
      id: frontend # <-- applied to these pods
    policyTypes:
    - Egress
    egress:

    # RULE 1.
    - to: # to AND ports i.e. id=ns1 AND port=80
      - namespaceSelector:
          matchLabels:
            id: ns1
      ports:
      - protoco: TCP
        port: 80

    # RULE 2.
    - to:
      - podSelector:
          matchLabels:
            id: backend # <-- applies to these pods in SAME namespace where the policy lives, unless otherwise specified with a `namespaceSelector` label here.
```

Rule 1 and Rule 1 are OR'd.

multiple network policies - what the difference?

- they get merged
- would operate exactly as if it were a single NP

## Default Deny

- is good practice.
- required for CKS.

scenario (see [create course k8s cluster](2.%20Create%20Course%20K8s%20Cluster.md) to get k8s running)

```bash
root@cks-master:~# k run frontend --image=nginx
pod/frontend created

root@cks-master:~# k run backend --image=nginx
pod/backend created
```

expose our pods

```bash
root@cks-master:~# k expose pod frontend --port 80
service/frontend exposed

root@cks-master:~# k expose pod backend --port 80
service/backend exposed

root@cks-master:~# k get pod,svc
NAME           READY   STATUS    RESTARTS   AGE
pod/backend    1/1     Running   0          3m41s
pod/frontend   1/1     Running   0          3m53s

NAME                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
service/backend      ClusterIP   10.107.165.22   <none>        80/TCP    8s
service/frontend     ClusterIP   10.103.184.90   <none>        80/TCP    14s
service/kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP   14d
```

check connectivity `frontend --> backend`

```bash
root@cks-master:~# k exec frontend -- curl backend
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
100   612  100   612    0     0    99k      0 --:--:-- --:--:-- --:--:--  119k
```

check `backend --> frontend`

```bash
root@cks-master:~# k exec backend -- curl frontend
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   612  100   612    0     0    99k      0 --:--:-- --:--:-- --:--:--   99k
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

create our default deny policy

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
  namespace: default
spec:
  podSelector: {}
  policyTypes:
  - Egress
  - Ingress
```

apply

```bash
root@cks-master:~# k apply -f ./default-deny.yaml 
networkpolicy.networking.k8s.io/default-deny created
```

test our connectivity like before

```bash
root@cks-master:~# k exec backend -- curl frontend
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:--  0:00:17 --:--:--     0^C

root@cks-master:~# k exec frontend -- curl backend
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:--  0:00:09 --:--:--     0^C
```

blocked!

now allow frontend-to-backend traffic with a single policy

## 

new policy `frontend.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: frontend
  namespace: default
spec:
  podSelector:
    matchLabels:
      run: frontend
  policyTypes:
  - Egress
  egress:
  - to:
    - podSelector:
        matchLabels:
          run: backend
```

create

```bash
root@cks-master:~# k create -f ./frontend.yaml 
networkpolicy.networking.k8s.io/frontend created
```

test connectivity

```bash
root@cks-master:~# k exec frontend -- curl backend
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:--  0:00:19 --:--:--     0curl: (6) Could not resolve host: backend
command terminated with exit code 6
```

doesnt' work!! why?

default deny policy still in effect!

create `backend.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend 
  namespace: default
spec:
  podSelector:
    matchLabels:
      run: backend 
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          run: frontend
```

create, test

```bash
root@cks-master:~# k create -f backend.yaml 
networkpolicy.networking.k8s.io/backend created
root@cks-master:~# k exec frontend -- curl backend
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:--  0:00:03 --:--:--     0^C
```

still nothing! why?!

DNS! if we want `frontend` to find and connect to `backend` it needs to be able to resolve the addresses

let's test that it is in fact DNS

lookup the IP address of our pods and try to hit frontend-->backend via IP

```bash
root@cks-master:~# k get pods --show-labels -owide
NAME       READY   STATUS    RESTARTS   AGE     IP          NODE         NOMINATED NODE   READINESS GATES   LABELS
backend    1/1     Running   0          5h35m   10.44.0.2   cks-worker   <none>           <none>            run=backend
frontend   1/1     Running   0          5h36m   10.44.0.1   cks-worker   <none>           <none>            run=frontend
```

curl works!!

```bash
root@cks-master:~# k exec frontend -- curl 10.44.0.2
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   612  100   612    0     0   597k      0 --:--:-- --:--:-- --:--:--  597k
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

let's update our `default-deny` policy to allow DNS

### Allow DNS

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
  namespace: default
spec:
  podSelector: {}
  policyTypes:
  - Egress
  - Ingress
  egress:
  - to:
    ports:
      - port: 53
        protocol: TCP
      - port: 53
        protocol: UDP
```

apply and test

```bash
root@cks-master:~# k apply -f ./default-deny.yaml 
networkpolicy.networking.k8s.io/default-deny configured
root@cks-master:~# k exec frontend -- curl backend
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
100   612  100   612    0     0   149k      0 --:--:-- --:--:-- --:--:--  149k
```

success!! front to back...

back to front?

```bash
root@cks-master:~# k exec backend -- curl frontend
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:--  0:00:02 --:--:--     0^C
```

NO! but that's because we are ONLY allowing `Ingress` into backend and `Egress` out of front end.

"policy pairs" if you will - one to allow leaving the source, and one to allow entering the destiation.

### Allow Egress to Backend

allow a cassandra backend connection

```bash
root@cks-master:~# k create ns cassandra
namespace/cassandra created

root@cks-master:~# k edit ns cassandra 
namespace/cassandra edited

root@cks-master:~# k -n cassandra run cassandra --image=nginx
pod/cassandra created

root@cks-master:~# k -n cassandra get pods -owide
NAME        READY   STATUS    RESTARTS   AGE   IP          NODE         NOMINATED NODE   READINESS GATES
cassandra   1/1     Running   0          8s    10.44.0.3   cks-worker   <none>           <none>

root@cks-master:~# k exec backend -- curl 10.44.0.3
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:--  0:00:01 --:--:--     0^C
```

allow egress to cassandra ns

new `backend.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend 
  namespace: default
spec:
  podSelector:
    matchLabels:
      run: backend 
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          run: frontend
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          ns: cassandra
```

create/apply

```bash
root@cks-master:~# k create -f ./backend.yaml 
networkpolicy.networking.k8s.io/backend created
```

success!!

```bash
root@cks-master:~# k exec backend -- curl 10.44.0.3
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
100   612  100   612    0     0   597k      0 --:--:-- --:--:-- --:--:--  597k
```

### Backend Default Deny

add a default deny policy to ns cassandra (best practice)

new `cassandra-deny.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: cassandra-deny
  namespace: cassandra
spec:
  podSelector: {}
  policyTypes:
  - Egress
  - Ingress
  egress:
  - to:
    ports:
      - port: 53
        protocol: TCP
      - port: 53
        protocol: UDP
```

doesn't work! needs explicit allow `Ingress` into cassandra.

cp `backend.yaml` to `cassandra.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: cassandra
  namespace: cassandra
spec:
  podSelector:
    matchLabels:
      run: cassandra
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          ns: default
```

still wont work because we need to add the `ns: default` label to the default namespace: `kubectl edit ns default`

magic!!

```bash
root@cks-master:~# k exec backend -- curl 10.44.0.3
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   612  100   612    0     0   597k      0 --:--:-- --:--:-- --:--:--  597k
```

## Summary

frontend (egress) --> (ingress) backend : based on pod labels
backend (egress) --> (ingress) cassandra : based on namespace labels

default deny policies for both namespaces

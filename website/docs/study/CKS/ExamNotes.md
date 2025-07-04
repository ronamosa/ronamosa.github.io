---
title: Exam Notes
sidebar_position: 0.5
---

## Courses & Practice Exams

:::info

My study preperations included

- [Kubernetes CKS 2021 Complete Course](https://www.udemy.com/share/103O5A3@tvmhKg4QOGimr2W3jgLP2nxMOL5LC86ZUnUdOdW74r7CnMjwY6XTOY7owUd6z63ALQ==/)
- 2 x [killer.sh](https://killer.sh) simulators included in the CKS exam purchase.
- 3 x [kodekloud](https://kodekloud.com/) mock exams

:::

prepare terminal drills -- repeatedly running these commands at the beginning of each mock exam session helped memorize them for the exam.

```bash
alias k="/usr/bin/kubectl"
export do="--dry-run=client -oyaml"

echo "set tabstop=2" > ~/.vimrc
echo "set shiftwidth=2" > ~/.vimrc
```

## Exam 1

### AppArmor profile

AppArmor drill:

- `apparmor_parser -q /etc/apparmor.d/frontend`
- lookup apparmor **annotations**
- `k get pods -oyaml > pod.yaml`
- `k replace --force -f ./pod.yaml`

RBAC drill

- `k -n ns get roles role-name -oyaml` | check verbs & resources
- `k -n ns get rolebinding role-binding -oyaml` | check verbs & resources
- if an SA has NO BINDINGS -- it has fewer permissions
- `serviceAccountName` above `container` in spec.

### Secrets as Volumes

- `kubectl -n orion get secrets a-safe-secret -o jsonpath='{.data.CONNECTOR_PASSWORD}' | base64 --decode >/root/CKS/secrets/CONNECTOR_PASSWORD`
- `k get pods podname -oyaml > pod1.yaml`

```yaml
spec:
  containers:
  - image: nginx
    name: app-xyz
    ports:
    - containerPort: 3306
    volumeMounts:
    - name: secret-volume
      mountPath: /mnt/connector/password
      readOnly: true
  volumes:
  - name: secret-volume
    secret:
      secretName: a-safe-secret
```

### Trivy Scan Images

Grab all images: `kubectl get pods --namespace default --output=custom-columns="NAME:.metadata.name,IMAGE:.spec.containers[*].image"`

Scan for CRITICAL: `trivy i -s <LEVEL /> <image /> | grep Total` - just look for `Total` from the trivy report to make decisions.

### seccomp profiles

default folder for profiles `/var/lib/kubelet/seccomp/profiles/` put `audit.json` in there.

`securityContext` NOT annotation:

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: nginx
  name: audit-nginx
spec:
  securityContext:
    seccompProfile:
      type: Localhost
      localhostProfile: profiles/audit.json
```

### Falco

Drill

- check falco `systemctl status falco`
- start stop `systemctl start|stop falco`
- output to log, change `/etc/falco/falco.yaml`
- override by copying the rule to `/etc/falco/falco_rules.local.yaml`

### RuntimeClass

create `runtimeClass.yaml` (if required)

add `runtimeClassName: <rcName />` in-line with `containers`

### ImagePolicyWebhook

Key components

- API server args

```yaml
- --admission-control-config-file=/etc/admission-controllers/admission-configuration.yaml # inside the container, reference the volumeMount
- --enable-admission-plugins=NodeRestriction,ImagePolicyWebhook
```

- Configuration file

```yaml
imagePolicy:
  kubeConfigFile: /etc/admission-controllers/admission-kubeconfig.yaml # inside the container, reference the volumeMount
  allowTTL: 50
  denyTTL: 50
  retryBackoff: 500
  defaultAllow: false # fail closed NOT fail open
```

- volume, volumeMounts in `/etc/kubernetes/manifest/kube-apiserver.yaml`

```yaml
  volumeMounts:
  - mountPath: /etc/admission-controllers # <- mounted into the container
      name: admission-controllers
      readOnly: true
  volumes:
  - hostPath:
      path: /root/CKS/ImagePolicy/ # <- where the files are on the HOST
      type: DirectoryOrCreate
    name: admission-controllers
```

look carefully:

```bash
root@controlplane:~# ll /root/CKS/ImagePolicy/
total 16
drwxr-xr-x 2 root root 4096 Sep 22 04:12 ./
drwxr-xr-x 4 root root 4096 Sep 22 03:41 ../
-rw-r--r-- 1 root root  150 Sep 22 04:12 admission-configuration.yaml
-rw-r--r-- 1 root root  495 Sep 22 03:31 admission-kubeconfig.yaml
```

## Exam 2

### Network Policy

"lock down access to this pod only to the following:"

Allow:

1. Any pod in the same namespace (`metadata.namespace`) with the label backend=prod-x12cs (`from.podSelector.matchLabels`)
2. All pods in the prod-yx13cs namespace (`spec.ingress.from.namespaceSelector.matchLabels`)
3. All other incoming connections should be blocked.

```yaml
# correct solution
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-redis-access
  namespace: prod-x12cs # this is the TARGET namespace i.e. rules below applies to this NS.
spec:
  podSelector:
    matchLabels:
      run: redis-backend # target is the redis pod (via labels)
  policyTypes:
  - Ingress # talking about ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          access: redis # this is the label on the Namespace
    - podSelector:      # the '-' here makes this an OR i.e. ns OR pod, no '-' makes it an AND.
        matchLabels:    # if you have a rule `podSelector` with no `namespaceSelector` -- the the namespace of the policy is the one that applies i.e. `prod-x12cs`
          backend: prod-x12cs
    ports:
    - protocol: TCP
      port: 6379
```

Part 2

- restrict redis pod (labels db, backend)
- allow in from app1
- allow in from app2
- deny in from app3

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-app1-app2
  namespace: apps-xyz
spec:
  podSelector:
    matchLabels:
      role: db
      tier: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          name: app1
          tier: frontend
    - podSelector:
        matchLabels:
          name: app2
          tier: frontend
    ports:
    - protocol: TCP
      port: 6379
```

### RBAC

check roles `k -n namespace get roles -oyaml` for verbs, groups

test what you can do as the user ("martin") in those namespaces

```bash
root@controlplane:/etc/falco# k -n dev-a auth can-i delete pods --as martin
yes
root@controlplane:/etc/falco# k -n dev-b auth can-i delete pods --as martin
yes
root@controlplane:/etc/falco# k -n dev-z auth can-i delete pods --as martin
no
```

### Disable mounting the SA token

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: apps-cluster-dash
  name: apps-cluster-dash
  namespace: gamma
spec:
  containers:
  - image: nginx
    name: apps-cluster-dash
  serviceAccountName: cluster-view
  automountServiceAccountToken: false
```

### falco local rules

falco update `/etc/falco/falco_rules.local.yaml`

```yaml
- rule: Terminal shell in container
  desc: A shell was used as the entrypoint/exec point into a container with an attached terminal.
  condition: >
    spawned_process and container
    and shell_procs and proc.tty != 0
    and container_entrypoint
    and not user_expected_terminal_shell_in_container_conditions
  output: >
    %evt.time.s,%user.uid,%container.id,%container.image.repository
  priority: ALERT
  tags: [container, shell, mitre_execution]
```

## Exam 3

### Kube-bench

Fix FAILS

kubelet configuration - /var/lib/kubelet/config.yaml

### Audit logging

double check references match the QUESTION

```yaml
    - --audit-policy-file=/etc/kubernetes/prod-audit.yaml
    - --audit-log-path=/var/log/prod-secrets.log
    - --audit-log-maxage=30

    volumeMounts:
    - mountPath: /etc/kubernetes/prod-audit.yaml
      name: audit
      readOnly: true
    - mountPath: /var/log/prod-secrets.log
      name: audit-log
      readOnly: false # LOGS MUST BE READONLY=FALSE

  volumes:
  - hostPath:
      path: /etc/kubernetes/prod-audit.yaml
      type: File
    name: audit
  - hostPath:
      path: /var/log/prod-secrets.log
      type: FileOrCreate
    name: audit-log
```

### PSP

Ensure you only configure what is asked - DELETE the rest.

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: pod-psp
spec:
  privileged: false
  seLinux:
    rule: RunAsAny
  runAsUser:
    rule: RunAsAny
  supplementalGroups:
    rule: RunAsAny
  fsGroup:
    rule: RunAsAny
  volumes:
  - configMap
  - secret
  - emptyDir
  - hostPath
```

### Kubesec

- all good

### RBAC 2

- careful to check you get ALL the requirements (missed `create`)

`k -n dev create role dev-write --verb=get,watch,list,create --resource=pods --dry-run=client -oyaml > role.yaml`

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: dev
  name: dev-write
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: ["pods"]
  verbs: ["get", "watch", "list", "create"]
```

### OPA

Look in the `configMap` of the OPA namespace to get the image policy

### ImagePolicyWebhook 2

```yaml
  - --enable-admission-plugins=NodeRestriction,PodSecurityPolicy,ImagePolicyWebhook
  - --admission-control-config-file=/etc/kubernetes/pki/admission_configuration.yaml
```

volume, volumeMounts -- already mounted for 'pki'

```yaml
    volumeMounts:
    - mountPath: /etc/kubernetes/pki
      name: k8s-certs
      readOnly: true

volume:
- hostPath:
    path: /etc/kubernetes/pki
    type: DirectoryOrCreate
  name: k8s-certs

```

### Immutable

Things to check

- `readOnlyRootFilesystem: true` - MUST be set to `true` or it is NOT immutable.
- `privileged: true` - if exists and set to `true` = NOT immutable

---
title: Auditing
---

api requests --> k8s api --> audit logs

why do we need them?

- check who accessed what
- check what user x is doing
- debugging apps or crds

can log according to audit STAGES, so more granular and not just logging EVERYTHING.

stages

- RequestReceived
- ResponseStarted
- ResponseComplete
- Panic

you can set up "audit policy stages"

- none
- MetaData
- Request

## setup configure audit logs

```bash
# on master
mkdir -p /etc/kubernetes/audit
cd /etc/kubernetes/audit
```

add to kubeapi manifest to enable audit policy

```yaml
spec:
  containers:
  - command:
    - kube-apiserver
    - --audit-policy-file=/etc/kubernetes/audit/policy.yaml       # add
    - --audit-log-path=/etc/kubernetes/audit/logs/audit.log       # add
    - --audit-log-maxsize=500                                     # add
    - --audit-log-maxbackup=5                                     # add
...
    volumeMounts:
    - mountPath: /etc/kubernetes/audit      # add
      name: audit
...
  volumes:
  - hostPath:                               # add
      path: /etc/kubernetes/audit           # add
      type: DirectoryOrCreate               # add
    name: audit                             # add    
```

tail `/etc/kuberenetes/audit/logs/audit.log` to see the logged events.

### Assignment

make a policy that

- ignores `RequestReceived`
- ignores "get", "watch", "list"
- from Secrets but only metadata level
- everything else at `RequestResponse` level

```yaml
apiVersion: audit.k8s.io/v1 # This is required.
kind: Policy
# Don't generate audit events for all requests in RequestReceived stage.
omitStages:
  - "RequestReceived"
rules:
  - level: None
    verbs: ["get", "watch", "list"]

  - level: Metadata
    resources:
    - group: ""
      resources: ["secrets"]

  - level: RequestResponse
```

---
title: Static Analysis
---

Supply Chain Security and Static Analysis Tools.

## Static Analysis

- look at static code & text files
- checks against rules
- enforce rules

example of rules? "always define requests & limits", "never use service accounts default"

### CICD

`code --> commit --> github --> build --> test --> deploy to k8s`

where to do SA?

- between code & commit
- before build
- in test phase
- at the deploy phase using OPA

do it early, and also late phase as well for good coverage.

## Manual Approach

literally just looking at code, yaml, seeing certain no-no's like hard-coding tokens in the yaml, or even as ENV vars (hint: use secrets)

## Tools for k8s & scenarios

### kubesec

kubesec.io

- open source
- opiniated
- does a score for you and advise improvement

create a pod and then run kubesec at it

pod: `k run nginx --image=nginx -oyaml --dry-run=client > kubesec.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: nginx
  name: nginx
spec:
  containers:
  - image: nginx
    name: nginx
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
```

run it at kubesec

```bash
docker run -i kubesec/kubesec:512c5e0 scan /dev/stdin < ./kubesec.yaml
Unable to find image 'kubesec/kubesec:512c5e0' locally
512c5e0: Pulling from kubesec/kubesec
c87736221ed0: Pull complete 
5dfbfe40753f: Pull complete 
0ab7f5410346: Pull complete 
b91424b4f19c: Pull complete 
0cff159cca1a: Pull complete 
32836ab12770: Pull complete 
Digest: sha256:8b1e0856fc64cabb1cf91fea6609748d3b3ef204a42e98d0e20ebadb9131bcb7
Status: Downloaded newer image for kubesec/kubesec:512c5e0
[
  {
    "object": "Pod/nginx.default",
    "valid": true,
    "message": "Passed with a score of 0 points",
    "score": 0,
    "scoring": {
      "advise": [
        {
          "selector": ".spec .serviceAccountName",
          "reason": "Service accounts restrict Kubernetes API access and should be configured with least privilege"
        },
        {
          "selector": "containers[] .resources .limits .cpu",
          "reason": "Enforcing CPU limits prevents DOS via resource exhaustion"
        },
        {
          "selector": "containers[] .securityContext .readOnlyRootFilesystem == true",
          "reason": "An immutable root filesystem can prevent malicious binaries being added to PATH and increase attack cost"
        },
        {
          "selector": "containers[] .securityContext .capabilities .drop | index(\"ALL\")",
          "reason": "Drop all capabilities and add only those required to reduce syscall attack surface"
        },
        {
          "selector": ".metadata .annotations .\"container.seccomp.security.alpha.kubernetes.io/pod\"",
          "reason": "Seccomp profiles set minimum privilege and secure against unknown threats"
        },
        {
          "selector": "containers[] .resources .requests .memory",
          "reason": "Enforcing memory requests aids a fair balancing of resources across the cluster"
        },
        {
          "selector": "containers[] .resources .requests .cpu",
          "reason": "Enforcing CPU requests aids a fair balancing of resources across the cluster"
        },
        {
          "selector": "containers[] .securityContext .runAsNonRoot == true",
          "reason": "Force the running image to run as a non-root user to ensure least privilege"
        },
        {
          "selector": ".metadata .annotations .\"container.apparmor.security.beta.kubernetes.io/nginx\"",
          "reason": "Well defined AppArmor policies may provide greater protection from unknown threats. WARNING: NOT PRODUCTION READY"
        },
        {
          "selector": "containers[] .resources .limits .memory",
          "reason": "Enforcing memory limits prevents DOS via resource exhaustion"
        },
        {
          "selector": "containers[] .securityContext .runAsUser -gt 10000",
          "reason": "Run as a high-UID user to avoid conflicts with the host's user table"
        },
        {
          "selector": "containers[] .securityContext .capabilities .drop",
          "reason": "Reducing kernel capabilities available to a container limits its attack surface"
        }
      ]
    }
  }
]
```

go through each advisory, make changes, re-run kubesec.

### OPA conftest

see [cks-course-folder](../cks-course-environment/course-content/supply-chain-security/static-analysis/conftest)

quick look at these policies `base.rego` for rules on our base images

```go
# from https://www.conftest.dev
package main

denylist = [
  "ubuntu"
]

deny[msg] {
  input[i].Cmd == "from"
  val := input[i].Value
  contains(val[i], denylist[_])

  msg = sprintf("unallowed image found %s", [val])
}
```

what's happening here?

- a denly list of images not allowed
- policy looks at the `FROM` lines via `input[i].Cmd == "from"`
- checks a `contains(val[i], denyList[_])` against our denyList

let's have a look at our commands in `commands.rego`

```go
package commands

denylist = [
  "apk",
  "apt",
  "pip",
  "curl",
  "wget",
]

deny[msg] {
  input[i].Cmd == "run"
  val := input[i].Value
  contains(val[_], denylist[_])

  msg = sprintf("unallowed commands found %s", [val])
}
```

same again

- have a denyList array with commands
- checking the `RUN` lines via `input[i].Cmd == "run"`
- checks it `contains(val[i]...)` in our `denyList[_]`

running the command to do a static analysis check

`docker run --rm -v $(pwd):/project openpolicyagent/conftest test Dockerfile --all-namespaces`

output

```bash
FAIL - Dockerfile - main - unallowed image found ["ubuntu"]
FAIL - Dockerfile - commands - unallowed commands found ["apt-get update && apt-get install -y golang-go"]

2 tests, 0 passed, 0 warnings, 2 failures, 0 exceptions
```

edit `Dockerfile` remove `ubuntu` and replace with `alpine`

```bash
FAIL - Dockerfile - commands - unallowed commands found ["apt-get update && apt-get install -y golang-go"]

2 tests, 1 passed, 0 warnings, 1 failure, 0 exceptions
```

edit `commands.rego` and remove `apt` from the denyList cos we need it.

```bash
2 tests, 2 passed, 0 warnings, 0 failures, 0 exceptions
```
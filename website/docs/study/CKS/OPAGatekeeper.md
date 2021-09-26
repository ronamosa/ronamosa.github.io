---
title: Open Policy Agent (OPA)
---

## OPA and Gatekeeper

remind refresh flow: request --> authN --> authZ --> admission control

- OPA = admission controller stage
- not k8s specific (general-purpose policy engine)
- json/yaml
- doesn't know pods/deployments (just json/yaml)

Gatekeeper = Custom CRDs that interact with OPA for you.

### Gatekeeper

Constraint template --> Constraint

e.g.

When we create this "Template" = `kind:ContraintTemplate` + `name:k8srequiredLabel`

OPA Gatekeerp will create a CRD of "Constraint" = `kind:k8srequiredLabel` + `name:whatever` for us automatically.

## Install OPA

`kubectl create -f https://raw.githubusercontent.com/killer-sh/cks-course-environment/master/course-content/opa/gatekeeper.yaml`

```bash
root@cks-master:~# kubectl create -f https://raw.githubusercontent.com/killer-sh/cks-course-environment/master/course-content/opa/gatekeeper.yaml
namespace/gatekeeper-system created
Warning: apiextensions.k8s.io/v1beta1 CustomResourceDefinition is deprecated in v1.16+, unavailable in v1.22+; use apiextensions.k8s.io/v1 CustomResourceDefinition
customresourcedefinition.apiextensions.k8s.io/configs.config.gatekeeper.sh created
customresourcedefinition.apiextensions.k8s.io/constraintpodstatuses.status.gatekeeper.sh created
customresourcedefinition.apiextensions.k8s.io/constrainttemplatepodstatuses.status.gatekeeper.sh created
customresourcedefinition.apiextensions.k8s.io/constrainttemplates.templates.gatekeeper.sh created
serviceaccount/gatekeeper-admin created
role.rbac.authorization.k8s.io/gatekeeper-manager-role created
clusterrole.rbac.authorization.k8s.io/gatekeeper-manager-role created
rolebinding.rbac.authorization.k8s.io/gatekeeper-manager-rolebinding created
clusterrolebinding.rbac.authorization.k8s.io/gatekeeper-manager-rolebinding created
secret/gatekeeper-webhook-server-cert created
service/gatekeeper-webhook-service created
deployment.apps/gatekeeper-audit created
deployment.apps/gatekeeper-controller-manager created
Warning: admissionregistration.k8s.io/v1beta1 ValidatingWebhookConfiguration is deprecated in v1.16+, unavailable in v1.22+; use admissionregistration.k8s.io/v1 ValidatingWebhookConfiguration
validatingwebhookconfiguration.admissionregistration.k8s.io/gatekeeper-validating-webhook-configuration created
root@cks-master:~# k get ns
NAME                   STATUS   AGE
blue                   Active   5d4h
cassandra              Active   13d
default                Active   28d
gatekeeper-system      Active   7s
ingress-nginx          Active   6d19h
kube-node-lease        Active   28d
kube-public            Active   28d
kube-system            Active   28d
kubernetes-dashboard   Active   13d
red                    Active   5d4h
root@cks-master:~# k -n gatekeeper-system get pod,svc
NAME                                                 READY   STATUS    RESTARTS   AGE
pod/gatekeeper-audit-6ffc8f5544-br7lt                1/1     Running   0          46s
pod/gatekeeper-controller-manager-6f9c99b4d7-jwd8d   1/1     Running   0          46s

NAME                                 TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
service/gatekeeper-webhook-service   ClusterIP   10.103.154.120   <none>        443/TCP   46s
```

types of webhooks:

- validating = validate request and/or enforce custom policies
- mutating = mutate requests to enforce custom policies

### example deny all policy

`https://github.com/killer-sh/cks-course-environment/tree/master/course-content/opa/deny-all`

Contraint Template:

```yaml
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: k8salwaysdeny
spec:
  crd:
    spec:
      names:
        kind: K8sAlwaysDeny
      validation:
        # Schema for the `parameters` field
        openAPIV3Schema:
          properties:
            message:
              type: string
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8salwaysdeny

        violation[{"msg": msg}] {
          1 > 0 # true
          msg := input.parameters.message
        }
```

check the rego -> "if violation is true (is '1>0'? always yes, so true), then throw violation, show msg".

**EVERY condition in the rego has to be true for it to be true**

create the resource of that kind

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sAlwaysDeny
metadata:
  name: pod-always-deny
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Pod"]
  parameters:
    message: "ACCESS DENIED!"
```

the rego error message from the template (`msg := input.parameters.message`) will match whatever's in the section:

```yaml
parameters:
  message: "whatever you like"
```

Describe our CRD: `k describe <ConstraintKind> <podName>` e.g. `k describe K8sAlwaysDeny pod-always-deny`

## Enforce Namespace Labels

create template

```yaml
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: k8srequiredlabels
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredLabels
      validation:
        # Schema for the `parameters` field
        openAPIV3Schema:
          properties:
            labels:
              type: array
              items: string
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequiredlabels
        violation[{"msg": msg, "details": {"missing_labels": missing}}] {
          provided := {label | input.review.object.metadata.labels[label]}
          required := {label | label := input.parameters.labels[_]}
          missing := required - provided
          count(missing) > 0
          msg := sprintf("you must provide labels: %v", [missing])
        }
```

this line `provided := {label | input.review.object.metadata.labels[label]}` gets all the labels in the namespace where `.object.` gets substituted for the namespace resource.

this line `required := {label | label := input.parameters.labels[_]}` gets the "required" labels of our resources we define (below)

then do a calculation of `required - provided = missing` and if `count(missing) > 0` (i.e. "true") then throw violation, send message.

namespace must have `cks` label

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: ns-must-have-cks
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Namespace"]
  parameters:
    labels: ["cks"]
```

add to the array of labels as needed `labels: ["cks", "team"]` -- if you try to create a ns without the required labels, you get denied.

pods must have `cks label

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: pod-must-have-cks
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Pod"]
  parameters:
    labels: ["cks"]
```

## Enforce Pod Replica Count

minimum replica count

template

```yaml
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: k8sminreplicacount
spec:
  crd:
    spec:
      names:
        kind: K8sMinReplicaCount
      validation:
        # Schema for the `parameters` field
        openAPIV3Schema:
          properties:
            min:
              type: integer
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8sminreplicacount
        violation[{"msg": msg, "details": {"missing_replicas": missing}}] {
          provided := input.review.object.spec.replicas
          required := input.parameters.min
          missing := required - provided
          missing > 0
          msg := sprintf("you must provide %v more replicas", [missing])
        }
```

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sMinReplicaCount
metadata:
  name: deployment-must-have-min-replicas
spec:
  match:
    kinds:
      - apiGroups: ["apps"]
        kinds: ["Deployment"]
  parameters:
    min: 2
```

## rego playground examples

```bash
https://play.openpolicyagent.org

https://github.com/BouweCeunen/gatekeeper-policies
```
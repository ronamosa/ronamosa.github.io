---
title: Secure Supply Chain
---

# Supply Chain Security - Secure Supply Chain

## Supply Chain

Tools --> Software Dev --> Container --> CICD Registry --> K8s Cloud --> Browser

## K8s & Container Registries

private registries, docker login first with docker-registry k8s secret, with docker registry username, password

ensure/patch your service accounts so they have `imagePullSecrets` pointed to your docker-registry secret to pull images.

if you look at the `image:k8s.gcr.io/someimage:v1.29.1` section of your pod, e.g. kube-apiserver via describe or something, you can also see a digest listed

```yaml
  containerStatuses:
  - containerID: containerd://87cf84840ab758c375988491da7e71bb8c78ea435d92ccb41fe05aae19d62eae
    image: k8s.gcr.io/kube-apiserver:v1.20.2
    imageID: sha256:3ad0575b6f10437a84a59522bb4489aa88312bfde6c766ace295342bbc179d49
```

technically, you can edit the `/etc/kubernetes/manifests/kube-apiserver.yaml` and change image to be the hash (imageID) and it will run that image **exactly**.

## Allow-list Registries with OPA

```bash
# install opa
kubectl create -f https://raw.githubusercontent.com/killer-sh/cks-course-environment/master/course-content/opa/gatekeeper.yaml
```

Contraint Template

```yaml
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: k8strustedimages
spec:
  crd:
    spec:
      names:
        kind: K8sTrustedImages
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8strustedimages

        violation[{"msg": msg}] {
          image := input.review.object.spec.containers[_].image
          not startswith(image, "docker.io/")
          not startswith(image, "k8s.gcr.io/")
          msg := "not trusted image!"
        }
```

if ALL conditions are TRUE then violation is thrown, pod creation denied.

Constraint Resource

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sTrustedImages
metadata:
  name: pod-trusted-images
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Pod"]
```

create template, then resource

```bash
k create -f k8strustedimages_template.yaml
k create -f ./all_pod_must_have_trusted_images.yaml
```

try create pod

```bash
k run nginx --image=nginx
Error from server ([denied by pod-trusted-images] not trusted image!): admission webhook "validation.gatekeeper.sh" denied the request: [denied by pod-trusted-images] not trusted image!
```

try again, but from allowed registry

```bash
k run nginx --image=docker.io/nginx
pod/nginx created
```

## ImagePolicyWebhook

see cks course folder for `ImagePolicyWebhook` setup files.

the flow of where policy webhook works --

`api request` --> [1] ApiServer --> [3] Allow/Deny

[2] ApiServer <--> AdmissionContollers <--> ImagePolicyWebhook <--> External Service

### Enable Admission Controller and Policy Webhook

1. edit kubeapi manifest to enable `ImagePolicyWebhook` admission controller under `--enable-admission-plugins=ImagePolicyWebhook`
2. copy all your admission files to `/etc/kubernetes/admission`
3. add `--admission-control-config-file=/etc/kubernetes/admission/admission_config.yaml`
4. add `hostPath` and `volumeMount` to mount the  `/etc/kubernetes/admission` so all your config files are available to the container.
5. apiserver will restart

have a look at the admission config file

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
  - name: ImagePolicyWebhook
    configuration:
      imagePolicy:
        kubeConfigFile: /etc/kubernetes/admission/kubeconf
        allowTTL: 50
        denyTTL: 50
        retryBackoff: 500
        defaultAllow: false # important: if `true`, then if policy webhook can't be reached will just allow the image.
```

look at the `kubeconf` file, it's to query the external service for the webhook policy

```yaml
apiVersion: v1
kind: Config

# clusters refers to the remote service.
clusters:
- cluster:
    certificate-authority: /etc/kubernetes/admission/external-cert.pem  # CA for verifying the remote service.
    server: https://external-service:1234/check-image                   # URL of remote service to query. Must use 'https'.
  name: image-checker

contexts:
- context:
    cluster: image-checker
    user: api-server
  name: image-checker
current-context: image-checker
preferences: {}

# users refers to the API server's webhook configuration.
users:
- name: api-server
  user:
    client-certificate: /etc/kubernetes/admission/apiserver-client-cert.pem     # cert for the webhook admission controller to use
    client-key:  /etc/kubernetes/admission/apiserver-client-key.pem             # key matching the cert
```

exam tip: if you have a question, check these configs for accuracy.

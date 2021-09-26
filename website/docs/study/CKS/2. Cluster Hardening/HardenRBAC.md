---
title: Role Based Access Control (RBAC)
---

RBAC is the use of (Cluster)Roles, (Cluster)RoleBindings and Service accounts to shape granual access to kubernetes resources.

A **role** define permissions - roles (where are they available? namespace=role, all-namespaces=clusterrole)

A **service account** is the "subject" who accesses/uses the Role.

A **binding** defines who gets them - bindings (where are they applied? namespace=rolebinding, all-namespces=clusterrolebinding)

A role & rolebinding matrix

- 2 x 2 matrix of role/clusterrole && rolebinding/clusterrolebinding
- namespaced vs non-namespaced (clusterwide) resources

valid combinations of the 2 x 2 matrix:

- role (namespaced) + rolebinding (namespaced) ✅
- clusterrole (non-namespaced) + clusterrolebinding (non-namespaced) ✅
- clusterrole (non-namespaced) + rolebinding (namespaced) ✅
- role (namesapced) + clusterrolebinding (non-namespaced) ❌

permissions are "additive" - specify "allowed", everything else `denied`.

## Role & Rolebinding

pro-tip: create well-formed yaml by using `--dry-run`

e.g. `k -n red create role secret-manager --verb=get --resource=secrets -oyaml --dry-run=client`

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  creationTimestamp: null
  name: secret-manager
  namespace: red
rules:
- apiGroups:
  - ""
  resources:
  - secrets
  verbs:
  - get
---
# k -n red create rolebinding secret-manager --role=secret-manager --user=jane -oyaml --dry-run=client
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  creationTimestamp: null
  name: secret-manager
  namespace: red
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: secret-manager
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: jane
```

commands used:

```bash
k create ns red
k create ns blue

k -n red create role secret-manager --verb=get --resource=secrets
k -n red create rolebinding secret-manager --role=secret-manager --user=jane
k -n blue create role secret-manager --verb=get --verb=list --resource=secrets
k -n blue create rolebinding secret-manager --role=secret-manager --user=jane


# check permissions
k -n red auth can-i -h
k -n red auth can-i create pods --as jane # no
k -n red auth can-i get secrets --as jane # yes
k -n red auth can-i list secrets --as jane # no

k -n blue auth can-i list secrets --as jane # yes
k -n blue auth can-i get secrets --as jane # yes

k -n default auth can-i get secrets --as jane #no
```

## ClusterRole & ClusterRoleBinding

```yaml
# k create clusterrole deploy-deleter --verb=delete --resource=deployment -oyaml --dry-run=client
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  creationTimestamp: null
  name: deploy-deleter
rules:
- apiGroups:
  - apps
  resources:
  - deployments
  verbs:
  - delete
---

# k create clusterrolebinding deploy-deleter --clusterrole=deploy-deleter --user=jane -oyaml --dry-run=client
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  creationTimestamp: null
  name: deploy-deleter
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: deploy-deleter
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: jane
```

commands used:

```bash
k create clusterrole deploy-deleter --verb=delete --resource=deployment

k create clusterrolebinding deploy-deleter --clusterrole=deploy-deleter --user=jane

k -n red create rolebinding deploy-deleter --clusterrole=deploy-deleter --user=jim


# test jane
k auth can-i delete deploy --as jane # yes
k auth can-i delete deploy --as jane -n red # yes
k auth can-i delete deploy --as jane -n blue # yes
k auth can-i delete deploy --as jane -A # yes
k auth can-i create deploy --as jane --all-namespaces # no



# test jim
k auth can-i delete deploy --as jim # no
k auth can-i delete deploy --as jim -A # no
k auth can-i delete deploy --as jim -n red # yes
k auth can-i delete deploy --as jim -n blue # no
```

## Accounts & Users

service account - machines, pods, created by k8s api
user accounts - no k8s user resource, uses IDM of cloud, a user just has its own cert & key.

the users "client cert" must be signed by the k8s CA, its "username" will be whatevers under the `/CN=jane` part of the cert.

how does this user cert get created?

1. openssl CSR from user
2. user sends this CSR to k8s API by including it in a `CertificateSigningRequest` resource
3. k8s API signs the CSR with CA (easier to manage CSR-signing as an API)
4. CRT is then available for user to download and use as auth to k8s.

Note

- no way to invalidate a cert - once created, stays valid
- if cert leaked your options are 1) remove all access via RBAC, 2) make sure to never use the username until cert expires OR 3) create new CA and re-issue all certs.

## CertificateSigningRequests

flow: create key --> create CSR --> get k8s API to sign with CA --> download CRT from k8s API --> use CRT+KEY to talk to API

note, in scenario `user=jane` so the CN has to be "jane".

commands used:

```bash
# create key
openssl genrsa -out jane.key 2048
openssl req -new -key jane.key -out jane.csr # only set Common Name = jane

# e.g.
Country Name (2 letter code) [AU]:NZ
State or Province Name (full name) [Some-State]:
Locality Name (eg, city) []:
Organization Name (eg, company) [Internet Widgits Pty Ltd]:
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:jane
Email Address []:

```

create `CertificateSigningRequest` from the [k8s docs](https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests) into `csr.yaml`

but in the `request` section paste the output of: `cat jane.csr | base64 -w 0`

```yaml
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: myuser
spec:
  request: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQ21UQ0NBWUVDQVFBd1ZERUxNQWtHQTFVRUJoTUNRVlV4RXpBUkJnTlZCQWdNQ2xOdmJXVXRVM1JoZEdVeApJVEFmQmdOVkJBb01HRWx1ZEdWeWJtVjBJRmRwWkdkcGRITWdVSFI1SUV4MFpERU5NQXNHQTFVRUF3d0VhbUZ1ClpUQ0NBU0l3RFFZSktvWklodmNOQVFFQkJRQURnZ0VQQURDQ0FRb0NnZ0VCQU05SWRsb2hITmhJRWMxUVp0Z2wKMGlwNUFCTU9ZakFiSDFCdi9Hd0pNNmI0QjVtdXZzMlJXdUVVWnRnMW5ZWXZaY0JNZUpNRXM3VFJyU1JZU0ZGNAowRUNMcGdpNHBULzhVNVZjNXNObC9MWk5zdndCNFdqbXVGZjFDeVRDSkFja2NQOFJIdHZTdDZiRGMvcWlmQm9QCmM3UHg4YnI1K1dncmcvYk0zL2RndXBOUnhuMVNLYnNMNndnN1p1OTlwRWxsam1ndlpEMnpFVEV6V2hNclRYU20KSktMdW9US0p0S2VxZzB5NndyaVpyZWxBaTFrUTJ0SlVGUHVyZ2R1cktWOTVON0M3Vk5EeFNDK2VtMndLL01IVQplWXhwaEJUWm5lSWZleG5velpNcTA2Vk1OQ3RseVRNS1BMWDZuKzZMeENBSjk3U0pYbTR6Q0dQclNaWjFaTU9QCnh3Y0NBd0VBQWFBQU1BMEdDU3FHU0liM0RRRUJDd1VBQTRJQkFRQUsxT2QzQ3J6aE1xN1g0THpQQTBVK1ZiYUEKcTFwZnlVYXprSEEwTXlncUhFK1lQMVNnNEkva0ZYVkE3NlZKZ3FHY29BalZNRFNFQkdYT3BKdkZaMlBMdUZsKwpTSGtHM2pXYTcwQWdIV0w5a3N3R0pHUDBsNHRhYXE0UHY4M0lYcW5rdW4yQU9PU0tDKzRWOHd6YmZSbWhUT25hCnpzOWxtYUp3VW9EajhQMjZVQlh5QXVlUDFEbGJGZnNSZkpvUHJ2UXNCaDZzZ3ZZOU1ja1BIZ0tZSThWL2xHbWEKV1V2YzN1UHBMWWlITXRNd2dlZENOSGppd0F2OU1ERFhFYTRhZzVMWWdaN2Q5TEdxbFRHaUEyY2JZRHoveE9uTAorRmw1SWoxUGtOdC85dWlielhLUmNZM0orVmwwSEFuTGxIbjM1MGNPaHI3ZEc5SDdvWE92OEtJeUZEZEIKLS0tLS1FTkQgQ0VSVElGSUNBVEUgUkVRVUVTVC0tLS0tCg==
  signerName: kubernetes.io/kube-apiserver-client
  usages:
  - client auth
```

now create the CSR resource: `k create -f ./csr.yaml`

```bash
root@cks-master:~/csr# k create -f ./csr.yaml 
certificatesigningrequest.certificates.k8s.io/jane created
root@cks-master:~/csr# k get csr
NAME   AGE   SIGNERNAME                            REQUESTOR          CONDITION
jane   5s    kubernetes.io/kube-apiserver-client   kubernetes-admin   Pending
```

we can see the CSR is pending - admin, needs to approve this.

```bash
root@cks-master:~/csr# k certificate approve jane
certificatesigningrequest.certificates.k8s.io/jane approved
root@cks-master:~/csr# k get csr
NAME   AGE   SIGNERNAME                            REQUESTOR          CONDITION
jane   33s   kubernetes.io/kube-apiserver-client   kubernetes-admin   Approved,Issued
```

now that the CSR is signed, grab that CRT

```bash
root@cks-master:~/csr# k get csr -oyaml
apiVersion: v1
items:
- apiVersion: certificates.k8s.io/v1
  kind: CertificateSigningRequest
  metadata:
    creationTimestamp: "2021-09-02T22:25:09Z"
    name: jane
    resourceVersion: "421994"
    uid: 2cc50fcc-d565-47fb-baf6-6d3db57bde84
  spec:
    groups:
    - system:masters
    - system:authenticated
    request: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQ21UQ0NBWUVDQVFBd1ZERUxNQWtHQTFVRUJoTUNRVlV4RXpBUkJnTlZCQWdNQ2xOdmJXVXRVM1JoZEdVeApJVEFmQmdOVkJBb01HRWx1ZEdWeWJtVjBJRmRwWkdkcGRITWdVSFI1SUV4MFpERU5NQXNHQTFVRUF3d0VhbUZ1ClpUQ0NBU0l3RFFZSktvWklodmNOQVFFQkJRQURnZ0VQQURDQ0FRb0NnZ0VCQU05SWRsb2hITmhJRWMxUVp0Z2wKMGlwNUFCTU9ZakFiSDFCdi9Hd0pNNmI0QjVtdXZzMlJXdUVVWnRnMW5ZWXZaY0JNZUpNRXM3VFJyU1JZU0ZGNAowRUNMcGdpNHBULzhVNVZjNXNObC9MWk5zdndCNFdqbXVGZjFDeVRDSkFja2NQOFJIdHZTdDZiRGMvcWlmQm9QCmM3UHg4YnI1K1dncmcvYk0zL2RndXBOUnhuMVNLYnNMNndnN1p1OTlwRWxsam1ndlpEMnpFVEV6V2hNclRYU20KSktMdW9US0p0S2VxZzB5NndyaVpyZWxBaTFrUTJ0SlVGUHVyZ2R1cktWOTVON0M3Vk5EeFNDK2VtMndLL01IVQplWXhwaEJUWm5lSWZleG5velpNcTA2Vk1OQ3RseVRNS1BMWDZuKzZMeENBSjk3U0pYbTR6Q0dQclNaWjFaTU9QCnh3Y0NBd0VBQWFBQU1BMEdDU3FHU0liM0RRRUJDd1VBQTRJQkFRQUsxT2QzQ3J6aE1xN1g0THpQQTBVK1ZiYUEKcTFwZnlVYXprSEEwTXlncUhFK1lQMVNnNEkva0ZYVkE3NlZKZ3FHY29BalZNRFNFQkdYT3BKdkZaMlBMdUZsKwpTSGtHM2pXYTcwQWdIV0w5a3N3R0pHUDBsNHRhYXE0UHY4M0lYcW5rdW4yQU9PU0tDKzRWOHd6YmZSbWhUT25hCnpzOWxtYUp3VW9EajhQMjZVQlh5QXVlUDFEbGJGZnNSZkpvUHJ2UXNCaDZzZ3ZZOU1ja1BIZ0tZSThWL2xHbWEKV1V2YzN1UHBMWWlITXRNd2dlZENOSGppd0F2OU1ERFhFYTRhZzVMWWdaN2Q5TEdxbFRHaUEyY2JZRHoveE9uTAorRmw1SWoxUGtOdC85dWlielhLUmNZM0orVmwwSEFuTGxIbjM1MGNPaHI3ZEc5SDdvWE92OEtJeUZEZEIKLS0tLS1FTkQgQ0VSVElGSUNBVEUgUkVRVUVTVC0tLS0tCg==
    signerName: kubernetes.io/kube-apiserver-client
    usages:
    - client auth
    username: kubernetes-admin
  status:
    certificate: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURPVENDQWlHZ0F3SUJBZ0lRRTdMemQzcWRaREd1Q3N5WUdkTEcxVEFOQmdrcWhraUc5dzBCQVFzRkFEQVYKTVJNd0VRWURWUVFERXdwcmRXSmxjbTVsZEdWek1CNFhEVEl4TURrd01qSXlNakF6T1ZvWERUSXlNRGt3TWpJeQpNakF6T1Zvd1ZERUxNQWtHQTFVRUJoTUNRVlV4RXpBUkJnTlZCQWdUQ2xOdmJXVXRVM1JoZEdVeElUQWZCZ05WCkJBb1RHRWx1ZEdWeWJtVjBJRmRwWkdkcGRITWdVSFI1SUV4MFpERU5NQXNHQTFVRUF4TUVhbUZ1WlRDQ0FTSXcKRFFZSktvWklodmNOQVFFQkJRQURnZ0VQQURDQ0FRb0NnZ0VCQU05SWRsb2hITmhJRWMxUVp0Z2wwaXA1QUJNTwpZakFiSDFCdi9Hd0pNNmI0QjVtdXZzMlJXdUVVWnRnMW5ZWXZaY0JNZUpNRXM3VFJyU1JZU0ZGNDBFQ0xwZ2k0CnBULzhVNVZjNXNObC9MWk5zdndCNFdqbXVGZjFDeVRDSkFja2NQOFJIdHZTdDZiRGMvcWlmQm9QYzdQeDhicjUKK1dncmcvYk0zL2RndXBOUnhuMVNLYnNMNndnN1p1OTlwRWxsam1ndlpEMnpFVEV6V2hNclRYU21KS0x1b1RLSgp0S2VxZzB5NndyaVpyZWxBaTFrUTJ0SlVGUHVyZ2R1cktWOTVON0M3Vk5EeFNDK2VtMndLL01IVWVZeHBoQlRaCm5lSWZleG5velpNcTA2Vk1OQ3RseVRNS1BMWDZuKzZMeENBSjk3U0pYbTR6Q0dQclNaWjFaTU9QeHdjQ0F3RUEKQWFOR01FUXdFd1lEVlIwbEJBd3dDZ1lJS3dZQkJRVUhBd0l3REFZRFZSMFRBUUgvQkFJd0FEQWZCZ05WSFNNRQpHREFXZ0JReWxzQWxMUlo1UTVEeTZYVW9PVzdLaTNIQ0NUQU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FRRUFTcW1vCmVSSDFVL01QMFF0ZExiV1M0Z1kzVVZYK3BEYlZRdlZvUEFxcENWMGVDbml6VXRtTzlJMW1DVnBEZ2pNQ3ZZZWMKaWFYaFBwSmtIQWd6UWJnSEFoVUJrbzB6OVQ5ZURDV2oxWTZERUhhV3FoSVkrWkFvR004Q0VtMnJxTEJqekJJOApWaWZndkZJRks5eG80SHovWFE0dG5NRGl3alFEZHNGT0dzbTJXUG4vUzZQa1VoSHppRXdTSGcvOGZjUVZDOWdECkVVV3h3eGhHTDNvMElHNm9NdlExNkRmVHVvbVhpT1RLQVFJYy91bDd6WUlYeXBoNlBvd1NVUEdWUHdZRkpPQVoKaGp6Q2c4bUhQMm1naWduclY2ZjZncE1CSmdyWDVoVjJ6OVNFUEhkdFJ5QmFySXA4SFNwRllXbGdWbnkvWjlHRgovdWU0V2xVM2FqSFdpeXFTSWc9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==
    conditions:
    - lastTransitionTime: "2021-09-02T22:25:39Z"
      lastUpdateTime: "2021-09-02T22:25:39Z"
      message: This CSR was approved by kubectl certificate approve.
      reason: KubectlApprove
      status: "True"
      type: Approved
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
```

copy the `certificate:` section, base64 decode it (`-d`), and that is now your CRT.

```bash
echo LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURPVENDQWlHZ0F3SUJBZ0lRRTdMemQzcWRaREd1Q3N5WUdkTEcxVEFOQmdrcWhraUc5dzBCQVFzRkFEQVYKTVJNd0VRWURWUVFERXdwcmRXSmxjbTVsZEdWek1CNFhEVEl4TURrd01qSXlNakF6T1ZvWERUSXlNRGt3TWpJeQpNakF6T1Zvd1ZERUxNQWtHQTFVRUJoTUNRVlV4RXpBUkJnTlZCQWdUQ2xOdmJXVXRVM1JoZEdVeElUQWZCZ05WCkJBb1RHRWx1ZEdWeWJtVjBJRmRwWkdkcGRITWdVSFI1SUV4MFpERU5NQXNHQTFVRUF4TUVhbUZ1WlRDQ0FTSXcKRFFZSktvWklodmNOQVFFQkJRQURnZ0VQQURDQ0FRb0NnZ0VCQU05SWRsb2hITmhJRWMxUVp0Z2wwaXA1QUJNTwpZakFiSDFCdi9Hd0pNNmI0QjVtdXZzMlJXdUVVWnRnMW5ZWXZaY0JNZUpNRXM3VFJyU1JZU0ZGNDBFQ0xwZ2k0CnBULzhVNVZjNXNObC9MWk5zdndCNFdqbXVGZjFDeVRDSkFja2NQOFJIdHZTdDZiRGMvcWlmQm9QYzdQeDhicjUKK1dncmcvYk0zL2RndXBOUnhuMVNLYnNMNndnN1p1OTlwRWxsam1ndlpEMnpFVEV6V2hNclRYU21KS0x1b1RLSgp0S2VxZzB5NndyaVpyZWxBaTFrUTJ0SlVGUHVyZ2R1cktWOTVON0M3Vk5EeFNDK2VtMndLL01IVWVZeHBoQlRaCm5lSWZleG5velpNcTA2Vk1OQ3RseVRNS1BMWDZuKzZMeENBSjk3U0pYbTR6Q0dQclNaWjFaTU9QeHdjQ0F3RUEKQWFOR01FUXdFd1lEVlIwbEJBd3dDZ1lJS3dZQkJRVUhBd0l3REFZRFZSMFRBUUgvQkFJd0FEQWZCZ05WSFNNRQpHREFXZ0JReWxzQWxMUlo1UTVEeTZYVW9PVzdLaTNIQ0NUQU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FRRUFTcW1vCmVSSDFVL01QMFF0ZExiV1M0Z1kzVVZYK3BEYlZRdlZvUEFxcENWMGVDbml6VXRtTzlJMW1DVnBEZ2pNQ3ZZZWMKaWFYaFBwSmtIQWd6UWJnSEFoVUJrbzB6OVQ5ZURDV2oxWTZERUhhV3FoSVkrWkFvR004Q0VtMnJxTEJqekJJOApWaWZndkZJRks5eG80SHovWFE0dG5NRGl3alFEZHNGT0dzbTJXUG4vUzZQa1VoSHppRXdTSGcvOGZjUVZDOWdECkVVV3h3eGhHTDNvMElHNm9NdlExNkRmVHVvbVhpT1RLQVFJYy91bDd6WUlYeXBoNlBvd1NVUEdWUHdZRkpPQVoKaGp6Q2c4bUhQMm1naWduclY2ZjZncE1CSmdyWDVoVjJ6OVNFUEhkdFJ5QmFySXA4SFNwRllXbGdWbnkvWjlHRgovdWU0V2xVM2FqSFdpeXFTSWc9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg== | base64 -d > jane.crt
```

now we need to add a jane user and context to your kubeconfig to talk to the API as `jane`.

```bash
# add jane user credentials to kubeconfig
root@cks-master:~/csr# k config set-credentials jane --client-key=jane.key --client-certificate=jane.crt
User "jane" set.
```

note: `set-credentials` in the above way just puts references in the `~/.kube/config` file like this

```yaml
kind: Config
preferences: {}
users:
- name: jane
  user:
    client-certificate: /root/csr/jane.crt
    client-key: /root/csr/jane.key
```

to embed the cert+key and use the contents of the files instead of referencing them, add `--embed-certs` like this: `k config set-credentials jane --client-key=jane.key --client-certificate=jane.crt --embed-certs`.

have a look at `~/.kube/config` and see jane now has a context

```yaml
kind: Config
preferences: {}
users:
- name: jane
  user:
    client-certificate: /root/csr/jane.crt
    client-key: /root/csr/jane.key
```

so user is created, now we need to create a jane context

```bash
root@cks-master:~/csr# k config set-context jane --cluster=kubernetes --user=jane
Context "jane" created.
root@cks-master:~/csr# k config get-contexts 
CURRENT   NAME                          CLUSTER      AUTHINFO           NAMESPACE
          jane                          kubernetes   jane               
*         kubernetes-admin@kubernetes   kubernetes   kubernetes-admin   
```

jane context has now been added

```bash
root@cks-master:~/csr# k config view
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: DATA+OMITTED
    server: https://10.152.0.2:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: jane
  name: jane
- context:
    cluster: kubernetes
    user: kubernetes-admin
  name: kubernetes-admin@kubernetes
current-context: kubernetes-admin@kubernetes
kind: Config
preferences: {}
users:
- name: jane
  user:
    client-certificate: /root/csr/jane.crt
    client-key: /root/csr/jane.key
- name: kubernetes-admin
  user:
    client-certificate-data: REDACTED
    client-key-data: REDACTED
```

set it and use it: `k config use-context jane`

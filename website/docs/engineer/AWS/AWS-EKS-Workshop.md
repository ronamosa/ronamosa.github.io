---
title: "AWS EKS Workshop"
---

:::tip

Going through ['EKS Workshop'](https://www.eksworkshop.com/)

:::

## Networking

### Amazon VPC Container Network Interface (CNI)

EKS has TWO VPCs

1. (AWS) Managed Kubernetes Control Plane
2. (Customer) Data Plane, Worker Nodes, Containers

Requirement:

1. minimum 2 subnets
2. at least 2 AZs

EKS (Control Plane) uses "EKS-managed" ENI to talk to the Data Plane.

#### LAB: Network Policies

install `eksctl`:

```bash
# for ARM systems, set ARCH to: `arm64`, `armv6` or `armv7`
ARCH=amd64
PLATFORM=$(uname -s)_$ARCH

curl -sLO "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$PLATFORM.tar.gz"

# (Optional) Verify checksum
curl -sL "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_checksums.txt" | grep $PLATFORM | sha256sum --check

tar -xzf eksctl_$PLATFORM.tar.gz -C /tmp && rm eksctl_$PLATFORM.tar.gz

sudo mv /tmp/eksctl /usr/local/bin
```

Cluster setup from labs:

```bash
export EKS_CLUSTER_NAME=eks-workshop
export AWS_REGION=ap-southeast-2
curl -fsSL https://raw.githubusercontent.com/aws-samples/eks-workshop-v2/stable/cluster/eksctl/cluster.yaml | \
envsubst | eksctl create cluster -f -
```

:::note cluster config

There's an easier way to setup eks clusters using `eksctl` and a clusetr-config.yaml file.

See ["cluster config"](#cluster-configyaml) in the Appendix.

:::

```bash
eksctl create cluster \
  --name eksworkshop-cluster \
  --version 1.30.1 \
  --region ap-southeast-2 \
  --nodegroup-name eksworkshop-nodes \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 4 \
  --managed
```

:::tip kubeconfig

get `~/.kube/config` file from EKS, run: `aws eks update-kubeconfig --name eksworkshop-cluster`

:::

### NetworkPolicy example

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db # policy applied to all pods in namespace, with this label.
  policyTypes: # applied to which traffic? in or out? or both?
    - Ingress
    - Egress
  ingress:
    - from:
        - ipBlock:
            cidr: 172.17.0.0/16
            except:
              - 172.17.1.0/24
        - namespaceSelector:
            matchLabels:
              project: myproject
        - podSelector:
            matchLabels:
              role: frontend
      ports:
        - protocol: TCP
          port: 6379
  egress:
    - to:
        - ipBlock:
            cidr: 10.0.0.0/24
      ports:
        - protocol: TCP
          port: 5978
```

**What does this policy say?**

This policy says that only certain traffic is allowed to and from the pods labeled with `role: db` in the `default` namespace.

For incoming (or ingress) traffic, it says that these database pods can be contacted by any IP address within the `172.17.0.0/16` range, except those from `172.17.1.0/24`. Additionally, they can also receive traffic from any pod within a namespace labeled with `project: myproject`, and from pods labeled `role: frontend` regardless of their namespace.

However, all this allowed ingress traffic must use TCP `port 6379`.

On the other side, for outgoing traffic, these database pods are permitted to send data to IP addresses within the `10.0.0.0/24` range, but only on TCP `port 5978`. This setup ensures that the database pods are shielded from unwanted access while allowing specific and necessary communication pathways, thus maintaining a balance between **security** and **functionality**.

### Default Deny Policy

First setup your default deny, no namespace as it's generic and can be applied to any namespace (and the namespace will be annotated in)

```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: default-deny
spec:
  podSelector:
    matchLabels: {} # match ALL labels
  policyTypes:
    - Egress # apply to which traffic
```

#### Egress

example using a `ui` microservice in its own namespace, with other services in theirs.

```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  namespace: ui
  name: allow-ui-egress
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: ui
  policyTypes:
    - Egress
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
          podSelector:
            matchLabels:
              app.kubernetes.io/component: service
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: kube-system
```

The `egress` part says, first, traffic can go to "any namespace" with pods that match label `app.kubernetes.io/component: service` and second, traffic can go to all components in `kube-system` namespace.

#### Ingress

The following policy, which deploys into the `catalog` namespace, says if `namespace` label is `ui` and pod label is `ui`, you can come in.

```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  namespace: catalog
  name: allow-catalog-ingress-webservice
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: catalog
      app.kubernetes.io/component: service
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ui
          podSelector:
            matchLabels:
              app.kubernetes.io/name: ui
```

### Security Groups for Pods

You already know what a Security Group (SG) is, take an EC2 Instance, has multiple ENI's and all will be associated with the SG of that specific instance. `SGfP` is bringing that SG down to a granular Pod level by using the `VPC-CNI` add-on setting `ENABLE_POD_ENI=true`, the VPC controller goes and creates a trunk interface to the node. The controller then creates "branch" interfaces each associated with a security group using the `SecurityGroupPolicy` CRD.

![SG4Pods Diagram](/img/AWS-EKSWorkshop-SG4Pods.png)

#### Steps

There's a few things to line up so this gets working:

1. Setting `ENABLE_POD_ENI=true`. One way of doing it nodes-wide: `kubectl set env daemonset -n kube-system aws-node ENABLE_POD_ENI=true`
2. Disable TCP early demux, so that the kubelet can connect to pods on branch network interfaces via TCP: `kubectl edit daemonset aws-node -n kube-system`, set `DISABLE_TCP_EARLY_DEMUX=true`


## Appendix

### cluster-config.yaml

```yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: ${EKS_CLUSTER_NAME}
  region: ${AWS_REGION}
  version: "1.30"
  tags:
    karpenter.sh/discovery: ${EKS_CLUSTER_NAME}
    created-by: eksctl
    env: ${EKS_CLUSTER_NAME}
iam:
  withOIDC: true
  serviceAccounts:
    - metadata:
        name: aws-load-balancer-controller
        namespace: kube-system
      wellKnownPolicies:
        awsLoadBalancerController: true
vpc:
  cidr: 10.42.0.0/16
  clusterEndpoints:
    privateAccess: true
    publicAccess: true
addons:
  - name: vpc-cni
    version: latest
  - name: coredns
    version: latest
  - name: kube-proxy
    version: latest

managedNodeGroups:
  - name: ng-1
    desiredCapacity: 3
    minSize: 3
    maxSize: 6
    instanceType: m5.large
    privateNetworking: true
    updateConfig:
      maxUnavailablePercentage: 50
    labels:
      managed: "yes"
```

### IRSA vs EKS Pod Identity

```text
"IAM roles no longer need to reference an OIDC provider and hence won't be tied to a single cluster anymore. This means, IAM roles can now be used across multiple EKS clusters without the need to update the role trust policy each time a new cluster is created. This in turn, eliminates the need for role duplication and simplifies the process of automating IRSA altogether."

https://eksctl.io/usage/pod-identity-associations/
```
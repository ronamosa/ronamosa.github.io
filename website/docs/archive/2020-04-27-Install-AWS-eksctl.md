---
title: "Install eksctl tool for AWS Elastic Kubernetes Service (EKS)"
---

:::info

Published Date: 27-APR-2020

:::

This quick bit of documentation is more for me to get right setting up to play with EKS clusters for the first time using the `eksctl` tool.

## install aws-cli version 1.18.17+

if you haven't got aws-cli already installed, install v1, python3 version:

```bash
pip3 install awscli --upgrade [--user]
```

if you do and just need to upgrade

```bash
pip3 install --upgrade [--user] awscli
```

verify

```bash
aws --version
aws-cli/1.18.46 Python/3.6.9 Linux/5.3.0-46-generic botocore/1.15.46
```

### configure aws-cli

run `aws configure` and answer these questions:

```bash
AWS Access Key ID [None]: ...
AWS Secret Access Key [None]: ...
Default region name [None]: us-west-2 # this is an example
Default output format [None]: json
```

or make sure these files look like this:

`~/.aws/credentials`

```bash
[default]
aws_secret_access_key = "some_access_key"
aws_access_key_id = "some_access_key_id"
```

and `~/.aws/config` (this is an example, change your region, output values)

```bash
[default]
output = json
region = us-west-2
```

## install eksctl

```bash
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
```

### eksctl create cluster...

```
eksctl create cluster --name test-cluster --version 1.14 --nodegroup-name standard-workers --node-type t3.medium --nodes 2 --nodes-min 1 --nodes-max 4 --node-ami auto
[ℹ]  eksctl version 0.17.0
[ℹ]  using region us-west-2
[ℹ]  setting availability zones to [us-west-2d us-west-2a us-west-2b]
[ℹ]  subnets for us-west-2d - public:192.168.0.0/19 private:192.168.96.0/19
[ℹ]  subnets for us-west-2a - public:192.168.32.0/19 private:192.168.128.0/19
[ℹ]  subnets for us-west-2b - public:192.168.64.0/19 private:192.168.160.0/19
[ℹ]  nodegroup "standard-workers" will use "ami-0800241390701b996" [AmazonLinux2/1.14]
[ℹ]  using Kubernetes version 1.14
[ℹ]  creating EKS cluster "test-cluster" in "us-west-2" region with un-managed nodes
[ℹ]  will create 2 separate CloudFormation stacks for cluster itself and the initial nodegroup
[ℹ]  if you encounter any issues, check CloudFormation console or try 'eksctl utils describe-stacks --region=us-west-2 --cluster=test-cluster'
[ℹ]  CloudWatch logging will not be enabled for cluster "test-cluster" in "us-west-2"
[ℹ]  you can enable it with 'eksctl utils update-cluster-logging --region=us-west-2 --cluster=test-cluster'
[ℹ]  Kubernetes API endpoint access will use default of {publicAccess=true, privateAccess=false} for cluster "test-cluster" in "us-west-2"
[ℹ]  2 sequential tasks: { create cluster control plane "test-cluster", create nodegroup "standard-workers" }
[ℹ]  building cluster stack "eksctl-test-cluster-cluster"
[ℹ]  deploying stack "eksctl-test-cluster-cluster"
[ℹ]  deploying stack "eksctl-test-cluster-nodegroup-standard-workers"
[✔]  all EKS cluster resources for "test-cluster" have been created
[✔]  saved kubeconfig as "/home/user/.kube/config"
[ℹ]  adding identity "arn:aws:iam::872504604641:role/eksctl-test-cluster-nodegroup-sta-NodeInstanceRole-MO5CYQG7WR9X" to auth ConfigMap
[ℹ]  nodegroup "standard-workers" has 0 node(s)
[ℹ]  waiting for at least 1 node(s) to become ready in "standard-workers"
[ℹ]  nodegroup "standard-workers" has 2 node(s)
[ℹ]  node "ip-192-168-55-170.us-west-2.compute.internal" is not ready
[ℹ]  node "ip-192-168-83-228.us-west-2.compute.internal" is ready
```

## check ~/.kube/config

you should have a new k8s context for eks that looks like this:

```yaml
- context:
    cluster: test-cluster.us-west-2.eksctl.io
    user: iamuser@test-cluster.us-west-2.eksctl.io
  name: iamuser@test-cluster.us-west-2.eksctl.io
current-context: iamuser@test-cluster.us-west-2.eksctl.io
kind: Config
preferences: {}
users:
- name: iamuser@test-cluster.us-west-2.eksctl.io
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1alpha1
      args:
      - eks
      - get-token
      - --cluster-name
      - test-cluster
      - --region
      - us-west-2
      command: aws
      env: null
```

## verify eks creation

check nodes with `kubectl get nodes`

output:

```bash
NAME                                           STATUS   ROLES    AGE     VERSION
ip-192-168-55-170.us-west-2.compute.internal   Ready    <none />   4h18m   v1.14.9-eks-1f0ca9
ip-192-168-83-228.us-west-2.compute.internal   Ready    <none />   4h18m   v1.14.9-eks-1f0ca9
```

## troubleshooting

if you see this, it means your aws-cli version doesn't have the required subcommand `get-token` in it cos its too old

```bash
[✖]  unable to use kubectl with the EKS cluster (check 'kubectl version'): usage: aws [options] <command /> <subcommand /> [<subcommand /> ...] [parameters]
To see help text, you can run:

  aws help
  aws <command /> help
  aws <command /> <subcommand /> help
aws: error: argument operation: Invalid choice, valid choices are:

create-cluster                           | delete-cluster
describe-cluster                         | list-clusters
help
Unable to connect to the server: getting credentials: exec: exit status 2
```

go back to the aws-cli install or upgrade section above.

otherwise check out the aws troubleshooting page here: [Unauthorized or access denied(kubectl)](https://docs.aws.amazon.com/eks/latest/userguide/troubleshooting.html#unauthorized)

check the references for more documentation

## References

* [https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html)

* [https://docs.aws.amazon.com/cli/latest/userguide/install-cliv1.html#install-tool-pip](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv1.html#install-tool-pip)

* [https://docs.aws.amazon.com/eks/latest/userguide/troubleshooting.html#unauthorized](https://docs.aws.amazon.com/eks/latest/userguide/troubleshooting.html#unauthorized)

* [eksctl - The official CLI for Amazon EKS](https://eksctl.io/)

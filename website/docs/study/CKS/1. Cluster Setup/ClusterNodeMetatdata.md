---
title: Node Metadata
---

## Cloud Platform Node Metadata

- metadata service run by provider (not accessible by us)
- VMs can reach it
- can contain cloud credentials for vms/nodes
- can contain kubelet creds

## Access sensitive Node Metadata

- outside scope of k8s, but the cloud accounts where instance running needs correct permissions.

## Restrict access using NetworkPolicies

- default config, pods can talk to meta-data service

calling GCP meta-data server

```bash
https://cloud.google.com/compute/docs/storing-retrieving-metadata

# from master node
root@cks-master:~# curl "http://metadata.google.internal/computeMetadata/v1/instance/disks/" -H "Metadata-Flavor: Google"
0/

# from pod
root@cks-master:~# k exec pod/pod1 -it -- bash
root@pod1:/# curl "http://metadata.google.internal/computeMetadata/v1/instance/disks/" -H "Metadata-Flavor: Google"
0/
root@pod1:/# 
```

## block access to metadata server with NP

grab policies from [cks-github](https://github.com/killer-sh/cks-course-environment/tree/master/course-content/cluster-setup/protect-node-metadata)

```yaml
# all pods in namespace cannot access metadata endpoint
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: cloud-metadata-deny
  namespace: default
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to:
    - ipBlock:
        cidr: 0.0.0.0/0
        except:
        - 169.254.169.254/32
```

allow all egress, except metadata server `169.254.169.254/32`

```yaml
# only pods with label are allowed to access metadata endpoint
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: cloud-metadata-allow
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: metadata-accessor
  policyTypes:
  - Egress
  egress:
  - to:
    - ipBlock:
        cidr: 169.254.169.254/32
```

for all pods labeled `metadata-accessor`, going Egress, allowed to metadata-server `169.254.169.254/32`

make sure to label your pods with this using `k label pod nginx role=metadata-accessor`

**Note**: use BOTH policies to a) have a default-deny and THEN b) allow for labeled pods ONLY.

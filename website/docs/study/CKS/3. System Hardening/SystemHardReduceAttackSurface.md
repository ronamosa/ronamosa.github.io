---
title: Reduce Attack Surface
---

## Overview

surface?

- apps - keep up to date, remove unnedded packages
- network - check and close ports, put things behind firewall
- iam - dont run as root, restrict user perms

### Nodes in K8s

should

- only run k8s components, remove all else
- ephemeral (recycle)
- create from images (recycle)
- be able to cycle node quickly (recycle)

### OS Distros

lot of services & packages in OS = more attack surface

### Ports & Services

check open ports with `netstat -plnt` or `lsof`

check `systemctl` for running services.

example `systemctl list-units --type=service --state=running | grep snapd`

---
title: AppArmor and Seccomp
---

## Overview

kernel vs user space

app --> libs --> seccomp/apparmor --> syscall --> OS kernel --> hw

## AppArmor

create profiles to allow/restrict what an app do to e.g. filesystem, other processes, networks

profile modes

- unconfined - allow escape
- complain - process can escape but log
- enforce - no escape

### AA on localhost curl

commands to install and get a profile for `curl`

- aa-status
- `apt install -y apparmor-utils`
- `aa-genprof curl` to create an aa profile for `curl`

its now prevented

```bash
root@cks-worker:~# curl killer.sh -v
* Rebuilt URL to: killer.sh/
* Could not resolve host: killer.sh
* Closing connection 0
curl: (6) Could not resolve host: killer.sh
```

update `/etc/apparmor.d/usr.bin.curl` profile

```c
# Last Modified: Sun Sep 12 00:21:00 2021
#include <tunables/global>

/usr/bin/curl {
  #include <abstractions/base>

  /lib/x86_64-linux-gnu/ld-*.so mr,
  /usr/bin/curl mr,

}
```

by running `aa-logprof` which scans log files for apparmor events not covered by a profile (e.g. new curl profile), and prompt user if they want to modify/augement the policy accordingly, then saves changes to disk.

```bash
root@cks-worker:~# aa-logprof 
Reading log entries from /var/log/syslog.
Updating AppArmor profiles in /etc/apparmor.d.
Enforce-mode changes:

Profile:  /usr/bin/curl
Path:     /etc/ssl/openssl.cnf
New Mode: owner r
Severity: 2

 [1 - #include <abstractions/lxc/container-base>]
  2 - #include <abstractions/lxc/start-container> 
  3 - #include <abstractions/openssl> 
  4 - #include <abstractions/ssl_keys> 
  5 - owner /etc/ssl/openssl.cnf r, 
(A)llow / [(D)eny] / (I)gnore / (G)lob / Glob with (E)xtension / (N)ew / Audi(t) / (O)wner permissions off / Abo(r)t / (F)inish
Adding #include <abstractions/lxc/container-base> to profile.
Deleted 2 previous matching profile entries.

= Changed Local Profiles =

The following local profiles were changed. Would you like to save them?

 [1 - /usr/bin/curl]
(S)ave Changes / Save Selec(t)ed Profile / [(V)iew Changes] / View Changes b/w (C)lean profiles / Abo(r)t
Writing updated profile for /usr/bin/curl.
```

curl now works

```bash
root@cks-worker:~# curl killer.sh
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="https://killer.sh/">here</A>.
</BODY></HTML>
```

### AA in docker

look at [profile-docker-nginx](../CKS/cks-course-environment/course-content/system-hardening/kernel-hardening-tools/apparmor/profile-docker-nginx)

copy our profile to `/etc/apparmor.d/docker-nginx`
now load it using `apparmor_parser /etc/apparmor.d/docker-nginx`
check to see it loaded in the list `aa-status`

use the profile using: `docker run --security-opt apparmor=docker-nginx nginx`
run it detached `-d` and `exec` in to test what the AA policy allows e.g. touch, sh

### AA in a k8s pod

- container runtime needs to support AppArmor (check your runtime)
- AA needs to be installed on every node
- AA profiles need to be available on every node i.e. on an available fsys that can be reached
- AA profiles are PER CONTAINER no per pod

create pod with annotation of apparmor profile, container-specific i.e. the container named `aa-pod`

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: aa-pod
  name: aa-pod
  annotations:
    container.apparmor.security.beta.kubernetes.io/aa-pod: localhost/docker-nginx
spec:
  containers:
  - image: nginx
    name: aa-pod
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
```

`localhost/docker-nginx` <-- NOT the filename, but the profile's name i.e. "docker-nginx"

## Seccomp

similar to apparmor in restriction/allow at the SYSCALL level, originally only allows the following 4 x calls

- exit()
- sigreturn()
- read()
- write()

originally a program would do a bunch of stuff unrestricted, no seccomp, then at a point in the program enable seccomp and it would be restricted from that point on.

e.g. C

```C
#include

int main () {
  ...
  prctl(PR_SET_SECCOMP, SECCOMP_MODE_STRICT)
  ...
}
```

nowadays seccomp combined with BPF filters to form `seccom-bpf` and here you can initialize a profile and do fine-grain controls

e.g.

```C
#include

int main() {
  ...
  # create filter
  scmp_filter_ctx ctx = seccomp_init(SCMP_ACT_KILL);

  # add your controls ALLOW
  seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(read), 0);
  seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(write), 0);
  seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(sigreturn), 0);
  seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(exit_group), 0);
  ...

  # load / enforce
  seccomp_load(ctx);
}
```

### Seccomp on Docker

save a seccomp profile somewhere e.g. [seccomp-profile](cks-course-environment/course-content/system-hardening/kernel-hardening-tools/seccomp/profile-docker-nginx.json)

save to `docker.json` and then create a container using that profile

`docker run --security-opt seccomp=default.json nginx`

test by removing `write` control from `default.json` create another container with this profile and see it fail cos it needs `write` permissions.

### Seccomp on K8s

the profiles need to be available/accessible to the `kubelet` to use, so put it in a profile directory

the default folder for the `--seccomp-profile-root-string` points to `/var/lib/kubelet/seccomp` so as long as you drop your profiles in there, it will be available for kubelet.

use securityContext for a per-container application

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: secc-pod
  name: secc-pod
spec:
  securityContext:
    seccompProfile:
      type: Localhost
      localhostProfile: default.json # filename
  containers:
  - image: nginx
    name: secc-pod
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
```

remember you removed `write` from `default.json` from before which will cause an error if you try and create a pod from this, edit the profile and ensure it has `write`.

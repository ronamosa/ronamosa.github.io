---
title: Runtime Host Forensics
---

## Syscall and processes

- kernel vs user space
- call syscalls via direct or libs
- can use seccomp between libs <--> linux kernel

have a read of [syscalls manpage](https://man7.org/linux/man-pages/man2/syscalls.2.html)

## strace and /proc

```bash
strace ls
execve("/usr/bin/ls", ["ls"], 0x7ffce48dc160 /* 64 vars */) = 0
brk(NULL)                               = 0x55b42b76c000
arch_prctl(0x3001 /* ARCH_??? */, 0x7ffe93ec4dd0) = -1 EINVAL (Invalid argument)
access("/etc/ld.so.preload", R_OK)      = -1 ENOENT (No such file or directory)
openat(AT_FDCWD, "/etc/ld.so.cache", O_RDONLY|O_CLOEXEC) = 3
fstat(3, {st_mode=S_IFREG|0644, st_size=89040, ...}) = 0
mmap(NULL, 89040, PROT_READ, MAP_PRIVATE, 3, 0) = 0x7f39dd59f000
close(3)                                = 0
openat(AT_FDCWD, "/lib/x86_64-linux-gnu/libselinux.so.1", O_RDONLY|O_CLOEXEC) = 3
read(3, "\177ELF\2\1\1\0\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0@p\0\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0644, st_size=163200, ...}) = 0
```

scroll down to see it get to the actual dir we want to `ls`

```bash
openat(AT_FDCWD, ".", O_RDONLY|O_NONBLOCK|O_CLOEXEC|O_DIRECTORY) = 3
fstat(3, {st_mode=S_IFDIR|0755, st_size=4096, ...}) = 0
getdents64(3, /* 34 entries */, 32768)  = 1968
getdents64(3, /* 0 entries */, 32768)   = 0
close(3)                                = 0
fstat(1, {st_mode=S_IFCHR|0620, st_rdev=makedev(0x88, 0x2), ...}) = 0
write(1, "'10. Cluster Setup - Verify Plat"..., 90'10. Cluster Setup - Verify Platform Binaries.md'                         '2. Create Course K8s Cluster.md'
) = 90
write(1, "'11. Cluster Hardening - RBAC.md"..., 87'11. Cluster Hardening - RBAC.md'                                         '3. Foundation - K8s Secure Architecture.md'
) = 87
write(1, "'12. Cluster Hardening - Exercis"..., 120'12. Cluster Hardening - Exercise caution using Service Accounts.md'     '4. Foundation - Containers under the hood.md'
```

now try count & summarize `strace -cw`

```bash
strace -cw ls
'10. Cluster Setup - Verify Platform Binaries.md'                           '2. Create Course K8s Cluster.md'
'11. Cluster Hardening - RBAC.md'                                           '3. Foundation - K8s Secure Architecture.md'
'12. Cluster Hardening - Exercise caution using Service Accounts.md'        '4. Foundation - Containers under the hood.md'
'13. Cluster Hardening - Restrict API Access.md'                            '5. Cluster Setup - Network Policies.md'
'14. Cluster Hardening - Upgrade Kubernetes.md'                             '6. Cluster Setup - GUI Elements.md'
'15. Microservice Vulnerabilities - Manage K8s Secrets.md'                  '7. Cluster Setup - Secure Ingress.md'
'16. Microservice Vulnerabilities - Container Runtime Sandboxes.md'         '8. Cluster Setup - Node Metadata Protection.md'
'17. Microservice Vulnerabilities - OS Level Security Domains.md'           '9. Cluster Setup - CIS Benchmarks.md'
'18. Microservice Vulnerabilities - mTLS.md'                                 ch.20
'19. Open Policy Agent.md'                                                   cks-course-environment
'1. Introduction.md'                                                         docs
'20. Supply Chain Security - Image Footprint.md'                             gcp-cluster.sh
'21. Supply Chain Security - Static Analysis.md'                             images
'22. Supply Chain Security - Image Vulnerability Scanning.md'                ingress.yaml
'23. Supply Chain Security - Secure Supply Chain.md'                         pod.yaml
'24. Runtime Security - Behavioural Analytics Host and Container Level.md'
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 17.89    0.000438         437         1           execve
 15.65    0.000383          14        27           mmap
 12.37    0.000303          18        16           write
  8.29    0.000203          22         9           openat
  6.85    0.000168          18         9           mprotect
  5.89    0.000144          13        11           close
  5.60    0.000137          13        10           fstat
  4.51    0.000110          15         7           read
  3.72    0.000091          45         2           getdents64
  3.14    0.000077          38         2         2 statfs
  3.05    0.000075           9         8           pread64
  2.54    0.000062          20         3           brk
  1.80    0.000044          43         1           munmap
  1.69    0.000041          20         2         2 access
  1.60    0.000039          19         2           rt_sigaction
  1.56    0.000038          19         2           ioctl
  1.09    0.000027          13         2         1 arch_prctl
  0.73    0.000018          17         1           set_tid_address
  0.72    0.000018          17         1           set_robust_list
  0.67    0.000016          16         1           prlimit64
  0.64    0.000016          15         1           rt_sigprocmask
------ ----------- ----------- --------- --------- ----------------
100.00    0.002446                   118         5 total
```

## /proc dir

- info and connections to processes and kernel
- config and admin tasks
- has files that done exist but you can access

```bash
ls /proc/33122/
ls: cannot read symbolic link '/proc/33122/cwd': Permission denied
ls: cannot read symbolic link '/proc/33122/root': Permission denied
ls: cannot read symbolic link '/proc/33122/exe': Permission denied
arch_status  cgroup      coredump_filter  exe      io         maps       mountstats  oom_adj        patch_state  sched      smaps         statm    timers
attr         clear_refs  cpuset           fd       limits     mem        net         oom_score      personality  schedstat  smaps_rollup  status   timerslack_ns
autogroup    cmdline     cwd              fdinfo   loginuid   mountinfo  ns          oom_score_adj  projid_map   sessionid  stack         syscall  uid_map
auxv         comm        environ          gid_map  map_files  mounts     numa_maps   pagemap        root         setgroups  stat          task     wchan

$ ls -l /proc/33122/exe
ls: cannot read symbolic link '/proc/33122/exe': Permission denied
lrwxrwxrwx 1 root root 0 Sep  8 15:30 /proc/33122/exe

$ sudo ls -l /proc/33122/exe
[sudo] password for darthvaldr: 
lrwxrwxrwx 1 root root 0 Sep  8 15:30 /proc/33122/exe -> /usr/local/bin/containerd-shim-runc-v2
```

under the /proc for the pid you're looking at, the `/fd` has all open files & sockets for that pid

let's look at the kind k8s cluster kubeapiserver

```bash
ps aux | grep kube-apiserver
root       33367  5.3  1.2 1119640 416520 ?      Ssl  Sep04 366:16 kube-apiserver --advertise-address=172.19.0.2 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --insecure-port=0 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --runtime-config= --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/16 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key
```

check out pid `33367`

```bash
root@hazard:/proc/33367# ls
arch_status  cgroup      coredump_filter  exe      io         maps       mountstats  oom_adj        patch_state  sched      smaps         statm    timers
attr         clear_refs  cpuset           fd       limits     mem        net         oom_score      personality  schedstat  smaps_rollup  status   timerslack_ns
autogroup    cmdline     cwd              fdinfo   loginuid   mountinfo  ns          oom_score_adj  projid_map   sessionid  stack         syscall  uid_map
auxv         comm        environ          gid_map  map_files  mounts     numa_maps   pagemap        root         setgroups  stat          task     wchan
root@hazard:/proc/33367# ll fd/
total 0
dr-x------ 2 root root  0 Sep  9 06:17 ./
dr-xr-xr-x 9 root root  0 Sep  8 15:30 ../
lrwx------ 1 root root 64 Sep  9 06:17 0 -> /dev/null
l-wx------ 1 root root 64 Sep  9 06:17 1 -> 'pipe:[341381]'
lrwx------ 1 root root 64 Sep  9 06:17 10 -> 'socket:[345122]'
lrwx------ 1 root root 64 Sep  9 06:17 101 -> 'socket:[15591252]'
lrwx------ 1 root root 64 Sep  9 06:17 102 -> 'socket:[12925175]'
lrwx------ 1 root root 64 Sep  9 06:17 103 -> 'socket:[12925176]'
```

look what we can see

```bash
root@hazard:/proc/33367# ll cwd/
total 1748
drwxr-xr-x   1 root  root     4096 Sep  4 20:07 ./
drwxr-xr-x   1 root  root     4096 Sep  4 20:07 ../
drwxr-xr-x   2 root  root     4096 Jan  1  1970 bin/
drwxr-xr-x   2 root  root     4096 Jan  1  1970 boot/
drwxr-xr-x   5 root  root      360 Sep  4 20:07 dev/
drwxr-xr-x   1 root  root     4096 Sep  4 20:07 etc/
-rwxr-xr-x   1 root  root  1732608 Nov 24  2020 go-runner*
drwxr-xr-x   3 65532 65532    4096 Jan  1  1970 home/
drwxr-xr-x   2 root  root     4096 Jan  1  1970 lib/
dr-xr-xr-x 516 root  root        0 Sep  4 20:07 proc/
drwx------   2 root  root     4096 Jan  1  1970 root/
drwxr-xr-x   2 root  root     4096 Jan  1  1970 run/
drwxr-xr-x   2 root  root     4096 Jan  1  1970 sbin/
dr-xr-xr-x  13 root  root        0 Sep  4 20:07 sys/
drwxrwxrwt   2 root  root     4096 Jan  1  1970 tmp/
drwxr-xr-x   1 root  root     4096 Jan 21  2021 usr/
drwxr-xr-x  11 root  root     4096 Jan  1  1970 var/
root@hazard:/proc/33367# ll cwd/etc/kubernetes/pki/
total 68
drwxr-xr-x 3 root root 4096 Sep  4 20:07 ./
drwxr-xr-x 3 root root 4096 Sep  4 20:07 ../
-rw-r--r-- 1 root root 1306 Sep  4 20:07 apiserver.crt
-rw-r--r-- 1 root root 1135 Sep  4 20:07 apiserver-etcd-client.crt
-rw------- 1 root root 1675 Sep  4 20:07 apiserver-etcd-client.key
-rw------- 1 root root 1679 Sep  4 20:07 apiserver.key
-rw-r--r-- 1 root root 1143 Sep  4 20:07 apiserver-kubelet-client.crt
-rw------- 1 root root 1675 Sep  4 20:07 apiserver-kubelet-client.key
-rw-r--r-- 1 root root 1066 Sep  4 20:07 ca.crt
-rw------- 1 root root 1679 Sep  4 20:07 ca.key
drwxr-xr-x 2 root root 4096 Sep  4 20:07 etcd/
-rw-r--r-- 1 root root 1078 Sep  4 20:07 front-proxy-ca.crt
-rw------- 1 root root 1675 Sep  4 20:07 front-proxy-ca.key
-rw-r--r-- 1 root root 1103 Sep  4 20:07 front-proxy-client.crt
-rw------- 1 root root 1679 Sep  4 20:07 front-proxy-client.key
-rw------- 1 root root 1675 Sep  4 20:07 sa.key
-rw------- 1 root root  451 Sep  4 20:07 sa.pub
```

you create a k8s resource on cks-master and you will see the object created on the container filesystem, and through `/proc` you can access it - it might be a binary file, in which case you use `strings`.

### /proc env vars

create a pod with env var: `k run apache --image=httpd -oyaml --dry-run=client > proc-pod.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: apache
  name: apache
spec:
  containers:
  - image: httpd
    name: apache
    resources: {}
    env:
    - name: SECRET
      value: "098273450928734509872345"
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
```

create it then check the env vars

```bash
k exec apache -- env
PATH=/usr/local/apache2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=apache
HTTPD_PREFIX=/usr/local/apache2
HTTPD_VERSION=2.4.48
HTTPD_SHA256=1bc826e7b2e88108c7e4bf43c026636f77a41d849cfb667aa7b5c0b86dbf966c
HTTPD_PATCHES=
SECRET=098273450928734509872345
KUBERNETES_PORT=tcp://10.96.0.1:443
KUBERNETES_PORT_443_TCP=tcp://10.96.0.1:443
KUBERNETES_PORT_443_TCP_PROTO=tcp
KUBERNETES_PORT_443_TCP_PORT=443
KUBERNETES_PORT_443_TCP_ADDR=10.96.0.1
KUBERNETES_SERVICE_HOST=10.96.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
HOME=/root
```

find the pid and go to `/proc`

```bash
$ ps aux | grep httpd
root     1094514  0.0  0.0   5944  4480 ?        Ss   13:28   0:00 httpd -DFOREGROUND
daemon   1094539  0.0  0.0 1931508 3600 ?        Sl   13:28   0:00 httpd -DFOREGROUND
daemon   1094540  0.0  0.0 1931508 3604 ?        Sl   13:28   0:00 httpd -DFOREGROUND
daemon   1094541  0.0  0.0 1931508 3628 ?        Sl   13:28   0:00 httpd -DFOREGROUND
darthva+ 1094917  0.0  0.0   8900   728 pts/2    S+   13:28   0:00 grep --color=auto httpd
$ sudo -i
root@hazard:~# cd /proc/1094514
root@hazard:/proc/1094514# pstree -p 1094539
httpd(1094514)─┬─httpd(1094539)─┬─{httpd}(1094544)
               │                ├─{httpd}(1094545)
               │                ├─{httpd}(1094549)
               │                ├─{httpd}(1094551)
               │                ├─{httpd}(1094554)
               │                ├─{httpd}(1094555)
               │                ├─{httpd}(1094558)
               │                ├─{httpd}(1094562)
               │                ├─{httpd}(1094565)

# see our SECRET?
$ root@hazard:/proc/1094514# cat environ 
HTTPD_VERSION=2.4.48KUBERNETES_PORT=tcp://10.96.0.1:443KUBERNETES_SERVICE_PORT=443HOSTNAME=apacheHOME=/rootHTTPD_PATCHES=KUBERNETES_PORT_443_TCP_ADDR=10.96.0.1PATH=/usr/local/apache2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/binKUBERNETES_PORT_443_TCP_PORT=443HTTPD_SHA256=1bc826e7b2e88108c7e4bf43c026636f77a41d849cfb667aa7b5c0b86dbf966cKUBERNETES_PORT_443_TCP_PROTO=tcpSECRET=098273450928734509872345HTTPD_PREFIX=/usr/local/apache2KUBERNETES_PORT_443_TCP=tcp://10.96.0.1:443KUBERNETES_SERVICE_PORT_HTTPS=443KUBERNETES_SERVICE_HOST=10.96.0.1PWD=/usr/local/apache2   
```

## Tools & Secnarios - Falco

- a cloud native runtime security (CNCF)
- access: deep kernel tracing
- assert: describe security rules, detect bad behaviour
- action: automated response to violations
- runs as privileged container

setup options

- standalone (installed on a single-node)
- as a daemonSet
- helm chart

```bash
# install falco standalone on a node
curl -s https://falco.org/repo/falcosecurity-3672BA8F.asc | apt-key add -
echo "deb https://download.falco.org/packages/deb stable main" | tee -a /etc/apt/sources.list.d/falcosecurity.list
apt-get update -y
apt-get -y install linux-headers-$(uname -r)
apt-get install -y falco=0.26.1

# start it
service falco start

# docs about falco
https://v1-16.docs.kubernetes.io/docs/tasks/debug-application-cluster/falco
```

use falco find bad behaviour

```bash
# just look at /var/log/falco logs and see it monitors activities by default
```

### falco rules

look under `/etc/falco/` look at `falco_rules.yaml` (default) or `k8s_audit_rules.yaml` or `falco_rules.local.yaml` (local)

the `.local.yaml` fules OVERRIDE the other one of the same name e.g. `falco_rules.local.yaml` will override `falco_rules.yaml` - BOTH are loaded, but `.local.yaml` will override.

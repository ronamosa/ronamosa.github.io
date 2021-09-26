---
title: Immutability
---

## Immutability

- wont be modified during its lifetime
- mutable example is a vm where you ssh in and update it, install other things
- immutable example is a vm, but you never change it, you delete the vm and create a new vm whole
- you ALWAYS know the state

why do it?

- adv. deployment methods
- easy rollback
- more reliable/stable
- better security

## Container and Pod level enforcement

how to enforce this?

- remove shells from image
- `readOnlyRootFilesystem`
- runAsNonRoot

if you can't control the container?

- try some hacky methods to run commands at Pod startup time to modify the app container on the way up.
- OR use securityContext
- use init container to run commands against a shared vol. with the app to harden.

## Scenarios to ensure Pods containers are immutable

let's use `startupProbe` in a Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: pod
  name: immutable
spec:
  containers:
  - image: nginx
    name: pod
    resources: {}
    startupProbe:
      exec:
        command:
        - rm
        - /bin/touch
      initialDelaySeconds: 5
      periodSeconds: 5
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
```

create it and try to `touch` a file

```bash
root@immutable:~# touch file
bash: touch: command not found
root@immutable:~# whereis touch
touch: /usr/bin/touch
root@immutable:~# ls -l /usr/bin/touch
lrwxrwxrwx 1 root root 10 Sep  2 00:00 /usr/bin/touch -> /bin/touch
root@immutable:~# ls -l /bin/touch
ls: cannot access '/bin/touch': No such file or directory
```

gone burgers.

if you make the command to remove `/bin/bash` then you get no shell into the pod.

### securityContext

read-only file system

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: immutable
  name: immutable
spec:
  containers:
  - image: httpd
    name: immutable
    resources: {}
    securityContext:
      readOnlyRootFilesystem: true
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
```

create and it crashes

```bash
k get pods
NAME        READY   STATUS             RESTARTS   AGE
apache      1/1     Running            0          6h23m
immutable   0/1     CrashLoopBackOff   1          13s
nginx       1/1     Running            0          24h

k logs immutable
AH00558: httpd: Could not reliably determine the server's fully qualified domain name, using 10.244.0.11. Set the 'ServerName' directive globally to suppress this message
AH00558: httpd: Could not reliably determine the server's fully qualified domain name, using 10.244.0.11. Set the 'ServerName' directive globally to suppress this message
[Thu Sep 09 07:51:18.263916 2021] [core:error] [pid 1:tid 140122618406016] (30)Read-only file system: AH00099: could not create /usr/local/apache2/logs/httpd.pid.jPx4A7
[Thu Sep 09 07:51:18.263981 2021] [core:error] [pid 1:tid 140122618406016] AH00100: httpd: could not log pid to file /usr/local/apache2/logs/httpd.pid
```

we need an `emptyDir: {}` for the logs

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: immutable
  name: immutable
spec:
  containers:
  - image: httpd
    name: immutable
    volumeMounts:
    - mountPath: /usr/local/apache2/logs
      name: logs-vol
    resources: {}
    securityContext:
      readOnlyRootFilesystem: true
  volumes:
  - name: logs-vol
    emptyDir: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
```

re-create it and see it succeed!

```bash
k logs immutable
AH00558: httpd: Could not reliably determine the server's fully qualified domain name, using 10.244.0.12. Set the 'ServerName' directive globally to suppress this message
AH00558: httpd: Could not reliably determine the server's fully qualified domain name, using 10.244.0.12. Set the 'ServerName' directive globally to suppress this message
[Thu Sep 09 07:56:48.809975 2021] [mpm_event:notice] [pid 1:tid 139712294405248] AH00489: Apache/2.4.48 (Unix) configured -- resuming normal operations
[Thu Sep 09 07:56:48.810092 2021] [core:notice] [pid 1:tid 139712294405248] AH00094: Command line: 'httpd -D FOREGROUND'
```

so, logs can write to the volume (you can too if you exec in), but the ROOT filesystem `/` is read-only.

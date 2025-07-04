---
title: Troubleshooting Docker issues on a Jenkins Pipeline
---


I am trying to run a jenkins docker pipeline plugin script on a slave node which creates a docker image and runs some commands inside the container. script runs into problems at this point in the script:

`docker.image('<image name />').inside {`

## Classic Docker Issue

**error : Cannot connect to the Docker daemon. Is the docker daemon running on this host?**

ever seen this error when trying to run docker either in your shell or in a Jenkinsfile pipeline job?

```bash
[build-docker.images-pipeline] Running shell script
+ docker inspect -f . ruby:2.3.1

Cannot connect to the Docker daemon. Is the docker daemon running on this host?
[Pipeline] sh
[build-docker.images-pipeline] Running shell script
+ docker pull ruby:2.3.1
Cannot connect to the Docker daemon. Is the docker daemon running on this host?
```

### Troubleshooting

#### check user

check my "using docker as a non-root user" setup is in place

visudo setup :

* confirm who the jenkins build slave user is e.g. build-jks
* as root run `visudo`
* ensure your jenkins build slave user has these 'passwordless' permissions setup

```bash
## Allow Jenkins user Docker access with no password
build-jks       ALL=(ALL)       NOPASSWD: /usr/bin/docker
```

* add 'sudo docker' alias into jenkins user startup file e.g. ~/.bash_profile.

```bash
# Docker alias
alias docker="sudo /usr/bin/docker"
```

#### check alias

```bash
[build-jks@docker ~]$ /usr/bin/docker ps
Cannot connect to the Docker daemon. Is the docker daemon running on this host?

[build-jks@docker ~]$ docker ps
CONTAINER ID        IMAGE                      COMMAND                  CREATED             STATUS                          PORTS                    NAMES
f154ec00624a        composeworkflow_frontend   "redis-commander --re"   2 weeks ago         Up Less than a second           0.0.0.0:8081->8081/tcp   composeworkflow_frontend_
```

from this I know my slave-jenkins user has the permissions, and therefore whoever is _actually_ running the pipeline code, a) is NOT my slave-jenkins user and b) is a user who doesn't have DOCKER permissions.

possible fix - find who the user is (probably someone from the jenkins master/host) and set that user & UID up on the slave.

## Solution

endless googling and reading various peoples situations finally stumbled across this user @carlossg comment on here: (https://github.com/jenkinsci/docker/issues/263) where its suggested to do the following:

>Try chmod 777 /var/run/docker.sock and then reduce permissions as needed

Good idea!

```bash
-rw-r--r--. 1 root root 3 Jun 20  2017 /var/run/docker.pid
srw-rw----. 1 root root 0 Jun 20  2017 /var/run/docker.sock
```

```bash
-rw-r--r--. 1 root root 3 Jun 20  2017 /var/run/docker.pid
srwxrwxrwx. 1 root root 0 Jun 20  2017 /var/run/docker.sock
```

doing this and my jenkins pipeline job error goes away and the docker commands are successfully run.

```bash
[Pipeline] sh
[build-docker.images-pipeline] Running shell script
+ docker inspect -f . ruby:2.3.1

Error: No such image, container or task: ruby:2.3.1
[Pipeline] sh
[build-docker.images-pipeline] Running shell script
+ docker pull ruby:2.3.1
Trying to pull repository docker.io/library/ruby ...
2.3.1: Pulling from docker.io/library/ruby
386a066cd84a: Pulling fs layer
```

:::caution

however, as we all know, `chmod 777` is not a good fix security-wise so this still needs to be completed with the best permissions.

:::

## SELinux to the rescue

but SELinux keeps messing with my chmod?

weird thing cos my setenforce was set to 'permissive' but on reboot of my docker vm (every night) the permissions of /var/run/docker.sock were reverted back. don't know selinux well enough to confirm that's the behaviour, only that chmod didn't stick, so had to look up & figure out selinux ACL's to enfore '777'.

this worked for me:

```bash
[root@docker run]# setfacl -m u::rwx,g::rwx,o::rwx docker.sock
[root@docker run]# getfacl docker.sock
# file: docker.sock
# owner: root
# group: root
user::rwx
group::rwx
other::rwx
```

---
title: Setup a Jenkins Server on CentOS 7
---

How to setup a Jenkins Server on CentOS 7

## Get Jenkins packages

```bash
# get packages
$ yum install java-1.8.0-openjdk.x86_64
$ wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat-stable/jenkins.repo
$ rpm --import http://pkg.jenkins-ci.org/redhat-stable/jenkins-ci.org.key
```

## Install packages

```bash
# install pkgs
$ yum install -y jenkins docker vim git
```

## Enable Firewall

```bash
# fw rules
$ firewall-cmd --zone=public --add-port=8080/tcp --permanent
$ firewall-cmd --zone=public --add-service=http --permanent
$ firewall-cmd --reload
```

## Enable at Startup

```bash
# start & enable
$ systemctl start jenkins
$ systemctl enable jenkins
```

## Login to web UI

`$ http:// localhost or Ip address:8080`

### retrieve initial password

`$ grep -A 5 password /var/log/jenkins/jenkins.log`

## Git working with proxy

git config --global http.proxy http://proxyuser:proxypwd@proxy.server.com:8080

## Permissions for docker.sock

needs sudo setup (build into playbook)
then selinux 'chmod 777' basically (fix this to be secure)

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

## Docker through Proxy (centos)

if you get this error:

```log
+ docker pull ruby:2.3.1
Trying to pull repository docker.io/library/ruby ...
Pulling repository docker.io/library/ruby
Network timed out while trying to connect to https://index.docker.io/v1/repositories/library/ruby/images. You may want to check your internet connection or if you are behind a proxy.
[Pipeline] }
```

Edit /etc/sysconfig/docker and add the following lines:

```bash
HTTP_PROXY='http://user:password@proxy-host:proxy-port'
HTTPS_PROXY='http://user:password@proxy-host:proxy-port'
```

restart docker:

```bash
# systemctl restart docker
```

_note: check 'setenforce' is set to 'permissive' (`setenforce 0`) so the docker.sock permissions dont get reverted on docker restart._

## Docker image through a Proxy

commands in your image need to go through a proxy too (figure out how to redirect ALL docker traffic to proxy)

```bash
stage("Install Bundler") {
      sh "gem install -p http://proxy.darksyde.net:80 bundler --no-rdoc --no-ri"
}
```

http://nknu.net/proxy-configuration-for-docker-on-centos-7/

## Running Docker images

need firewall rule: `[root@jenkins ~]# firewall-cmd --zone=public --add-port=4000/tcp --permanent`

## Publish Docker images to Private Registry

bootstrap of jenkins build needs keys setup to talk to registry

## References

:::info

[Jenkins on CentOS 7](http://linuxtechlab.com/install-jenkins-on-centos-rhel-7/)
[Docker permissions](https://darthvaldr.github.io/2017/06/18/Docker-Jenkins-Pipeline-permission.html)
[Docker Proxy on Ubuntu](https://blog.codeship.com/using-docker-behind-a-proxy/)

:::

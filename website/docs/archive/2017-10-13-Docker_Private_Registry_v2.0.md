---
title: Docker Private Registry 2.0
---

Quick Notes on setting up Docker Private Registry with TLS (secure), shout out to [bobcares.com](https://bobcares.com/blog/docker-private-repository/) as I'm basically cannibalizing their notes with my edits because they've already written out some great notes, just tailoring it to my own situation.

### Generate SSL via container

create working directories:

```bash
mkdir -p /opt/registry/{auth,data,ssl,config}
```

(optional) if you have selinux running, you need to change permissions on your registry directory

```bash
chcon -Rt svirt_sandbox_file_t <registry_dir>
```

replace the 'SSL_SUBJECT' with your own and run this command to generate your SSL files

```bash
docker run --rm -v /opt/registry/ssl:/certs -e SSL_SUBJECT=registry.docker-repo.net paulczar/omgwtfssl
```

### Native Basic Auth

from /registry/ dir:
`docker run --entrypoint htpasswd registry:2 -Bbn usertest userpasswd > auth/htpasswd`

### Add new Certificate Authority (CA)

your registry clients need to recognize the CA when it connects to the registry so you need to install that CA on your client machines.
e.g.

```bash
[root@registry]$ scp /var/opt/registry/ssl/ca.pem user@other-host:~/
[user@other-host]$ mkdir -p /etc/docker/cert.d/registry:5000/
[user@other-host]$ cp ca.pem /etc/docker/cert.d/registry:5000/
```

Install the ca-certificates package: `yum install ca-certificates`
Enable the dynamic CA configuration feature: `update-ca-trust force-enable`
retart docker `systemctl restart docker`

### Registry 'config.yml'

needed to configure registry within the container:

```yaml
version: 0.1
log:
  fields:
    service: registry
storage:
  delete:
    enabled: true
  cache:
    blobdescriptor: inmemory
  filesystem:
    rootdirectory: /var/lib/registry
http:
  addr: :5000
  headers:
    X-Content-Type-Options: [nosniff]
    Access-Control-Allow-Origin: ['http://dockeregistry.darksyde']
    Access-Control-Allow-Methods: ['HEAD', 'GET', 'OPTIONS', 'DELETE']
    Access-Control-Allow-Headers: ['Authorization,Credentials']
    Access-Control-Max-Age: [1728000]
    Access-Control-Allow-Credentials: [true]
    Access-Control-Expose-Headers: ['Docker-Content-Digest']
auth:
  htpasswd:
    realm: basic-realm
    path: /auth/htpasswd
health:
  storagedriver:
    enabled: true
    interval: 10s
    threshold: 3

```

### Docker compose your image with SSL

docker-compose file for the cert generating image:

```yaml 
# docker trusted registry (private) compose

registry:
  restart: always
  image: registry:2
  container_name: registry2
  ports:
    - 5000:5000
  environment:
    REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY: /var/opt/registry/data
    REGISTRY_HTTP_TLS_CERTIFICATE: /var/opt/registry/ssl/cert.pem
    REGISTRY_HTTP_TLS_KEY: /var/opt/registry/ssl/key.pem
    REGISTRY_AUTH: htpasswd
    REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
    REGISTRY_AUTH_HTPASSWD_REALM: Registry Realm
  volumes:
    - /var/opt/registry:/var/opt/registry
    - /var/opt/registry/auth:/auth
    - /var/opt/registry/config/config.yml:/etc/docker/registry/config.yml
```

### Run docker-compose

if all the files are in place and the CA is installed on all client hosts, you should be able to run:

```bash
[root@registry /var/opt/registry ]$ docker-compose up -d
```

check our registry container is running:

```bash
[root@dockeregistry registry]# docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
a60a47bcad92        registry:2          "/entrypoint.sh /etc/"   26 minutes ago      Up 1 seconds        0.0.0.0:5000->5000/tcp   registry2
```

from a client host (i.e. a host that needs to talk to the registry and has the CA added to it) try

#### logging in

```bash
[root@docker certs.d]# docker login http://dockeregistry.darksyde.net:5000
Username (usertest):
Password:
Login Succeeded
```

now try and pull an image, tag it with our private registry and push it

#### pull

```bash
[root@docker ~]# docker pull ubuntu:16.04
Trying to pull repository docker.io/library/ubuntu ...
16.04: Pulling from docker.io/library/ubuntu
ae79f2514705: Pull complete
5ad56d5fc149: Pull complete
170e558760e8: Pull complete
395460e233f5: Pull complete
6f01dc62e444: Pull complete
Digest: sha256:506e2d5852de1d7c90d538c5332bd3cc33b9cbd26f6ca653875899c505c82687
```

#### tag

```bash
[root@docker ~]# docker tag ubuntu:16.04 dockeregistry.darksyde.net:5000/myubuntu
```

#### push

```bash
[root@docker ~]# docker push dockeregistry.darksyde.net:5000/myubuntu
The push refers to a repository [dockeregistry.darksyde.net:5000/myubuntu]
49907af65b0a: Pushed
4589f96366e6: Pushed
b97229212d30: Pushed
cd181336f142: Pushed
0f5ff0cf6a1c: Pushing [=========================================>         ] 101.9 MB/122 MB
...
latest: digest: sha256:550f6e26da4b4cb8655a96dd6458ea01e2fb3dcb99d24e6dc427c08ea42c9785 size: 1357
```

**_SUCCESS!_**

### Troubleshooting

#### Proxy Matters

if you're behind a proxy `vim /etc/sysconfig/docker` and add your proxy settings for docker if there's no internet connection from the box

```bash
# PROXY
HTTP_PROXY='http://proxy.darksyde.net:80'
HTTPS_PROXY='http://proxy.darksyde.net:80'
NO_PROXY='dockeregistry.darksyde.net'
```

note: if you dont specify the 'no_proxy' you wont be able to push to your private registry because the request gets routed through the HTTP_PROXY.

#### Error generating ssl

```log
Digest: sha256:486c1ebae77f9d8b39ab1943fcf98d91f9c48610c9e471010a1ea53df47713ee
----------------------------
| OMGWTFSSL Cert Generator |
----------------------------

--> Certificate Authority
====> Generating new CA key ca-key.pem
ca-key.pem: Permission denied
139662982777740:error:0200100D:system library:fopen:Permission denied:bss_file.c:402:fopen('ca-key.pem','w')
139662982777740:error:20074002:BIO routines:FILE_CTRL:system lib:bss_file.c:404:
====> Generating new CA Certificate ca.pem
Error opening Private Key ca-key.pem
139862407768972:error:02001002:system library:fopen:No such file or directory:bss_file.c:402:fopen('ca-key.pem','r')
139862407768972:error:20074002:BIO routines:FILE_CTRL:system lib:bss_file.c:404:
unable to load Private Key
```

check SELINUX

`ausearch -m avc -ts today | audit2allow`

set rule to allow,

before :

```bash
[root@dockeregistry opt]# ls -ltrZ registry/
drwxr-xr-x. root root unconfined_u:object_r:var_t:s0   ssl
drwxr-xr-x. root root unconfined_u:object_r:var_t:s0   data
drwxr-xr-x. root root unconfined_u:object_r:var_t:s0   config
```

run command on your 'registry' folder (or where the docker image is going to write to host filesystem)

```bash
[root@dockeregistry opt]# chcon -Rt svirt_sandbox_file_t registry/
```

after :

```bash
[root@dockeregistry opt]# ls -ltrZ registry
drwxr-xr-x. root root unconfined_u:object_r:svirt_sandbox_file_t:s0 ssl
drwxr-xr-x. root root unconfined_u:object_r:svirt_sandbox_file_t:s0 data
drwxr-xr-x. root root unconfined_u:object_r:svirt_sandbox_file_t:s0 config
```

**SUCCESS:**

```log
----------------------------
| OMGWTFSSL Cert Generator |
----------------------------

--> Certificate Authority
====> Generating new CA key ca-key.pem
Generating RSA private key, 2048 bit long modulus
...........+++
..................................+++
e is 65537 (0x10001)
====> Generating new CA Certificate ca.pem
====> Generating new config file openssl.cnf
====> Generating new SSL KEY key.pem
Generating RSA private key, 2048 bit long modulus
.................................................................+++
..............................................................................................................................................+++
e is 65537 (0x10001)
====> Generating new SSL CSR key.csr
====> Generating new SSL CERT cert.pem
Signature ok
subject=/CN=dockeregistry.darksyde.net
Getting CA Private Key
====> Complete
keys can be found in volume mapped to /certs

====> Output results as YAML
...
...
...

```

See [Redhat](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux_atomic_host/7/html/container_security_guide/docker_selinux_security_policy) documentation for more info on `svirt_sandbox_file_t`

#### Expired ca.crt

check ca.crt for expiry:

```bash
openssl x509 -in /etc/docker/cert.d/<registry>/ca.crt -text -noout
```

#### docker login failed - bad certificate

on the client you get this error logging in:

```bash
[root@docker ~]# docker login http://dockeregistry.darksyde.net:5000
Username: usertest
Password:
Error response from daemon: Get https://dockeregistry.darksyde.net:5000/v1/users/: x509: certificate signed by unknown authority
```

you check on the registry host with `docker logs -f registry2` and see this:

```log
2017/10/13 07:58:07 http: TLS handshake error from 172.16.20.10:33562: remote error: tls: bad certificate
2017/10/13 07:58:07 http: TLS handshake error from 172.16.20.10:33564: remote error: tls: bad certificate
```

usually means the host calling the registry does NOT recognize the CA of the registry.

the `ca.pem` from the step above ("Generate SSL via container") needs to be on EVERY HOST that needs to talk to the registry
e.g. if your registry is called 'dockeregistry' you'd need to find `ca.crt` in `/etc/docker/certs.d/dockeregistry:5000` (includes ':5000')

:::note

The directory in '/etc/docker/cert.d/' must match the name of the registry you're logging into - if the registry is "docker.registry.org:6000" the directory must be EXACTLY '/etc/docker/cert.d/docker.registry.org:6000'**

:::

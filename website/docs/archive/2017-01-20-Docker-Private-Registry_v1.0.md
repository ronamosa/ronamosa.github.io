---
title: Docker Trusted Registry (private) 1.0
---

I wanted to setup a Docker Trusted Registry for my lab, so I did a search and walked through a few tutorials before landing on this one which 'mostly' worked for me: [bobcares.com](https://bobcares.com/blog/docker-private-repository/2/)

This is basically my (abbreviated) walk-through of that with the troubleshooting steps

## create storage location

`mkdir -p /opt/registry/{data,ssl,config}`

## create TLS certs, keys using a special-purpose container

```bash
docker run --rm -v /opt/registry/ssl:/certs -e SSL_SUBJECT=<FQDN-of-your-registry-host /> paulczar/omgwtfssl
```

find your files in ''/opt/registry/ssl' (ca-key.pem, ca.pem, ca.srl, cert.pem, key.csr, key.pem, openssl.cnf)

_note: the bobcares guys go with a registry.env file to define their registry config.yml but I decided to go a different way._

## setup your native basic auth

```bash
docker run --entrypoint htpasswd registry:2 -Bbn usertest userpasswd > auth/htpasswd
```

## create and run registry container

```bash
[root@dockeregistry registry]$ docker-compose up -d
Creating registry ...
Creating registry ... done
```

## check its running and test your login:

```bash
[root@dockeregistry registry]# docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
60cf3aae3d83        registry:2          "/entrypoint.sh /etc/"   37 seconds ago      Up 35 seconds       0.0.0.0:5000->5000/tcp   registry
```

```bash
[root@docker ~]# docker login https://dockeregistry:5000
Username: usertest
Password:
Login Succeeded
```

test the API:

```bash
curl -k -u usertest:userpasswd -X GET https://dockeregistry:5000/v2/_catalog
```

(if you get an UNAUTHORIZED error here, see the *'troubleshooting'* section below)

## time to test its working for storing our images!

## pull, tag, push

```bash
[root@docker ~]# docker pull python
Using default tag: latest
Trying to pull repository docker.io/library/python ...
latest: Pulling from docker.io/library/python

ef0380f84d05: Pull complete
24c170465c65: Pull complete
4f38f9d5c3c0: Pull complete
4125326b53d8: Pull complete
35de80d77198: Pull complete
ee2411f41489: Pull complete
887347005f96: Pull complete
9afc04448f28: Pull complete
Digest: sha256:cbab919d1fe9f619f5f7d55b852bc04ba661c27abb4db90b802df40287e0f541

[root@docker ~]# docker tag 41397f4f2887 dockeregistry:5000/python
[root@docker ~]# docker push dockeregistry:5000/python
The push refers to a repository [dockeregistry:5000/python]
e95f4a878d0c: Pushed
7cd56c69527f: Pushed
ca8fcddadb39: Pushing [===============================================>   ] 59.26 MB/61.89 MB
201187968504: Pushed
ecf5c2e2468e: Pushing [=====>                                             ] 33.47 MB/318.7 MB
bb07d0c1008d: Pushing [=================>                                 ] 42.44 MB/122.9 MB
4902b007e6a7: Pushing [==========================================>        ] 38.14 MB/44.55 MB
007ab444b234: Pushing [==================>                                ] 45.04 MB/123.4 MB

[root@docker ~]# docker tag 41397f4f2887 dockeregistry:5000/python
[root@docker ~]# docker push dockeregistry:5000/python
The push refers to a repository [dockeregistry:5000/python]
e95f4a878d0c: Pushed
7cd56c69527f: Pushed
ca8fcddadb39: Pushed
201187968504: Pushed
ecf5c2e2468e: Pushed
bb07d0c1008d: Pushed
4902b007e6a7: Pushed
007ab444b234: Pushed
latest: digest: sha256:cbab919d1fe9f619f5f7d55b852bc04ba661c27abb4db90b802df40287e0f541 size: 2007
```

a quick query of the registry API should show you your newly pushed image:

```bash
curl -k -u usertest:userpasswd -X GET https://dockeregistry:5000/v2/_catalog
```

and now you can go grab a muffin cos you're FINISHED =)

## systemd (OPTIONAL)

if you're wanting to have a nice clean startup process for your registry, you can do follow this systemd setup.

$ vim /usr/lib/systemd/system/docker.trusted.registry.service

```ini
[Unit]
Description=Docker Trusted Registry
Author=devops@drkcu.be
After=docker.service

[Service]
Restart=always
ExecStart=/usr/bin/docker start -a registry
ExecStop=/usr/bin/docker stop -t 60 registry

[Install]
WantedBy=multi-user.target
```

$ systemctl enable docker.trusted.registry
$ systemctl start docker.trusted.registry

## Troubleshooting

cos shit never goes right the first time

### error: "code":"UNAUTHORIZED","message":"authentication required"

```bash
[root@dockeregistry registry]# curl -k -u usertest:userpasswd -X GET https://dockeregistry:5000/v2/_catalog
{"errors":[{"code":"UNAUTHORIZED","message":"authentication required","detail":[{"Type":"registry","Class":"","Name":"catalog","Action":"*"}]}]}
```

#### fix

check your htpasswd is setup (properly), and check registry logs (docker logs -f registry) for errors.

### error: x509: certificate signed by unknown authority

```bash
[root@dockeregistry ~]# docker push dockeregistry:5000/ubuntu
The push refers to a repository [dockeregistry:5000/ubuntu]
Get https://dockeregistry:5000/v1/_ping: x509: certificate signed by unknown authority
```

#### fix no.1

make sure you have the 'ca.crt' in a folder in /etc/docker/certs.d that matches your registry tag exactly (note: you need to do this 'ca.crt' on EVERY host that needs to talk to the registry)

e.g.
if your command is `docker tag 7b9b13f7b9c0 dockeregistry:5000/ubuntu`
then you have to have a 'ca.crt' in `/etc/docker/certs.d/dockeregistry:5000` (includes colon and port number)

#### fix no.2

if fix no.1 doesn't work and you're still getting the 'unknown authority' error try the following from the [docker product manual](https://docs.docker.com/datacenter/dtr/2.2/guides/user/access-dtr/#windows) for your distribution.

e.g. I'm on xubuntu so this worked for me (on my laptop):

```bash
root@hx0:/usr/local/share/ca-certificates# cp /path/to/dtr/ca.crt .
root@hx0:/usr/local/share/ca-certificates# update-ca-certificates
Updating certificates in /etc/ssl/certs...
1 added, 0 removed; done.
Running hooks in /etc/ca-certificates/update.d...

Adding debian:ca.pem
done.
Updating Mono key store
Linux Cert Store Sync - version 4.2.1.0
Synchronize local certs with certs from local Linux trust store.
Copyright 2002, 2003 Motus Technologies. Copyright 2004-2008 Novell. BSD licensed.

I already trust 176, your new list has 177
Certificate added: CN=test-ca
1 new root certificates were added to your trust store.
Import process completed.
Done
done.
root@hx0:/usr/local/share/ca-certificates# systemctl restart docker
root@hx0:/usr/local/share/ca-certificates# docker login https://dockeregistry:5000
Username: usertest
Password:
Login Succeeded
```

## References

:::info

* [registry with native basic auth](https://docs.docker.com/registry/deploying/#native-basic-auth)
* [enable insecure registry with self-signed certs](https://docs.docker.com/registry/insecure/#using-self-signed-certificates)

:::

## Appendix

random doesnt-fit-anywhere-else note: if you wanted to go HTTP, skip TLS, you need the following in '/etc/default/docker'

```bash
# Use DOCKER_OPTS to modify the daemon startup options.
DOCKER_OPTS="--insecure-registry <FQDN-of-your-registry-host />:<PORT />"
```

then restart docker daemon: `$ systemctl restart docker`

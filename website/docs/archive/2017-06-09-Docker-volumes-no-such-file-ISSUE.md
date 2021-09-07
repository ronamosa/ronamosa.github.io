---
title: Troubleshooting Docker Volumes errors
---

Troubleshooting errors in Docker Private Registry.

I was trying to fire up my docker trusted registry via:

`$ docker-compose up -d` on the following docker-compose file

### configuration file: docker-compose.yml

```yaml
registry:
  restart: always
  image: registry:2
  ports:
    - 5000:5000
  environment:
    REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY: /opt/registry/data
    REGISTRY_HTTP_TLS_CERTIFICATE: /opt/registry/ssl/cert.pem
    REGISTRY_HTTP_TLS_KEY: /opt/registry/ssl/key.pem
    REGISTRY_AUTH: htpasswd
    REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
    REGISTRY_AUTH_HTPASSWD_REALM: Registry Realm
  volumes:
    - /opt/registry/data:/var/lib/registry
    - /opt/registry/ssl:/certs
    - /opt/registry/auth:/auth
```

kept seeing this error `level=fatal msg="open /opt/registry/ssl/cert.pem: no such file or directory"`

### error

```log
registry_1  | time="2017-06-09T12:28:15Z" level=info msg="redis not configured" go.version=go1.7.3 instance.id=adb365f3-7a0c-4161-a752-efb17c48391f version=v2.6.1
registry_1  | time="2017-06-09T12:28:15Z" level=info msg="Starting upload purge in 32m0s" go.version=go1.7.3 instance.id=adb365f3-7a0c-4161-a752-efb17c48391f version=v2.6.1
registry_1  | time="2017-06-09T12:28:15Z" level=info msg="using inmemory blob descriptor cache" go.version=go1.7.3 instance.id=adb365f3-7a0c-4161-a752-efb17c48391f version=v2.6.1
registry_1  | time="2017-06-09T12:28:15Z" level=fatal msg="open /opt/registry/ssl/cert.pem: no such file or directory"
registry_1  | time="2017-06-09T12:29:58Z" level=warning msg="No HTTP secret provided - generated random secret. This may cause problems with uploads if multiple registries are behind a load-balancer. To provide a shared secret, fill in http.secret in the configuration file or set the REGISTRY_HTTP_SECRET environment variable." go.version=go1.7.3 instance.id=9fd66fd9-e9da-4500-b456-85c8e05fe5b6 version=v2.6.1
```

confirmed the file existed so for some reason the container wasn't able to see it, meaning the volume mount was going wrong somewhere.

weirdly enough if i commented out just the cert.pem I dont see any errors about the other file variables defined *shrugs*

now seeing as i was following this tutorial: https://bobcares.com/blog/docker-private-repository/2/ i see that bobcares has the following run command:

```sh
docker run -d --name registry -v /opt/registry:/opt/registry -p 4043:5000 --restart always --env-file /opt/registry/config/registry.env registry:2
```

and his `/opt/registry/config/registry.env` file is where all the REGISTRY_* variables are set.. so got me thinking, this must be the baseline volume mount that the variables base themselves off.

so, quick change to `docker-compose.yml` like so,

```yaml
registry:
  restart: always
  image: registry:2
  ports:
    - 5000:5000
  environment:
    REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY: /opt/registry/data
    REGISTRY_HTTP_TLS_CERTIFICATE: /opt/registry/ssl/cert.pem
    REGISTRY_HTTP_TLS_KEY: /opt/registry/ssl/key.pem
    REGISTRY_AUTH: htpasswd
    REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
    REGISTRY_AUTH_HTPASSWD_REALM: Registry Realm
  volumes:
    - /opt/registry:/opt/registry
```

and the mofo came up :)

```log
registry_1  | time="2017-06-09T12:34:44Z" level=info msg="Starting upload purge in 57m0s" go.version=go1.7.3 instance.id=ebf2c17d-03a3-4308-81c2-66151f1fe981 version=v2.6.1
registry_1  | time="2017-06-09T12:34:44Z" level=info msg="using inmemory blob descriptor cache" go.version=go1.7.3 instance.id=ebf2c17d-03a3-4308-81c2-66151f1fe981 version=v2.6.1
registry_1  | time="2017-06-09T12:34:44Z" level=info msg="listening on [::]:5000, tls" go.version=go1.7.3 instance.id=ebf2c17d-03a3-4308-81c2-66151f1fe981 version=v2.6.1
```

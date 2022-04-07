---
title: "Setup Istio to handle Mutual TLS (mTLS) with an external site using an Egress gateway."
---

:::info

Published Date: 08-APR-2020

:::

In this post I endeavour to go through setting up [Istio Egress Gateway with TLS Origination](https://istio.io/docs/tasks/traffic-management/egress/egress-gateway-tls-origination/) using a real-world external/remote server setup to do MTLS between an outside client and itself.

>_Why do I care?_

I came across the need for this setup on a previous client engagement where Security was super important. The client wanted _all_ points in the system to be secured as much as possible, which included mTLS between microservices in the AKS cluster; network segregation between all components, and the final piece was to setup MTLS between the azure cloud application and a 3rd party vendor with a public endpoint.

So, here we are!

## Architecture Diagram

![architecture](/img/istiomtls-arch-notworking.png)

### Key Components

* AKS cluster
* Istio Service Mesh
* External NGINX Webserver with MTLS enabled.
* FQDN `mtls.cloudbuild.site` used for as my example domain for the remote server.

## Pre-requisites

* az-cli installed
* kubectl instlaled
* istioctl installed
* azure dns zone (or something you can resolve dns to for your certs)

## MTLS Server

### Certificates: server certs, client certs and intermediate certs

As per Istio's documentation, we will use the following repo by [Nicholas Jackson](https://github.com/nicholasjackson/) called [mtls-go-example](https://github.com/nicholasjackson/mtls-go-example) to create the cert combination we need.

To create your certs, as per the website run:

`./generate.sh <domain_name> <some-password>`

for the example they use `localhost` to run it, and connect to it locally via `https://localhost`.

When you run the `./generate.sh` script, it will create 4 folders of certs for you that will make up a complete "certificate chain" aka ["chain of trust"](https://www.thesslstore.com/knowledgebase/ssl-support/explaining-the-chain-of-trust/).

and looks like this:

![go certs](/img/istiomtls-go-certs.png)

with the following directories:

* root cert (`ca.cert.pem`) & private key
* intermediate certs (`ca-chain.pem` and `intermediate.cert.pem`) & private key
* application (aka "server") cert (`<domain_name>.cert.pem`) & private key -- e.g. `mtls.cloudbuild.site.cert.pem`
* client cert (`<domain_name>.cert.pem`) & {: .notice--info}private key -- e.g. `mtls.cloudbuild.site.cert.pem`

now that your certs are created and you understand what each one does,

### NGINX Webserver

All you need is a server that runs nginx so you can throw this `nginx.conf` and the certs in there to be the MTLS endpoint that we will call from our "client" later on.

I spent way too much time getting this done via terraform and ansible that I'm going to put the ansible code here: [link to gist](https://gist.link).

#### nginx.conf & certs

Once you have nginx up & running on your server:

* upload the `nginx.conf` below and save it to `/etc/nginx/nginx.conf`
* upload the following certs (I'm using my domain `mtls.cloudbuild.site` as an example):
  * server cert: `certs/3_application/certs/mtls.cloudbuild.site.cert.pem` = `/etc/nginx-server-certs/tls.crt`
  * server private key: `certs/3_application/private/mtls.cloudbuild.site.key.pem` = `/etc/nginx-server-certs/tls.key`
  * ca-certs: `certs/2_intermediate/certs/ca-chain.cert.pem` = `/etc/nginx-ca-certs/ca-chain.cert.pem`

```ruby title="nginx.conf"
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
}

http {

  # custom log format to show good debugging information.
  log_format ssl_client
  '$remote_addr - $remote_user [$time_local] '
  '"$request" $status $body_bytes_sent '
  '"Client fingerprint" $ssl_client_fingerprint '
  '"Client DN" $ssl_client_s_dn';

  error_log  /var/log/nginx/error.log;

  server {

    listen 443 ssl;

    # set our access_log to use the log_format from above.
    access_log /var/log/nginx/listener.log ssl_client;

    # homepage for the NGINX server -- edit as needed.
    root /usr/share/nginx/html;
    index index.html;

    # server's name -- mine is a fqdn
    server_name mtls.cloudbuild.site;

    # setup the server cert, key and the ca-cert which will be the same one that signed the client certs.
    ssl_certificate /etc/nginx-server-certs/tls.crt;
    ssl_certificate_key /etc/nginx-server-certs/tls.key;
    ssl_client_certificate /etc/nginx-ca-certs/ca-chain.cert.pem;

    # enable mutual tls and set depth to be >2.
    ssl_verify_client on;
    ssl_verify_depth 10;
  }
}
```

:::tip

_The `ssl_verify_client` is the thing that enables MTLS with incoming calls, and `ssl_verify_depth` needs to be set to >2 or things behave badly._

:::

* restart your `nginx.service` e.g. on ubuntu `sudo systemctl restart nginx.service`

### the MTLS client (test)

With our MTLS server setup We'll use curl to test if we can talk to the server using our client certificates.

The MTLS URL to call is `https://mtls.cloudbuild.site`.

curl without certificates:

```bash
curl -v -k -I https://mtls.cloudbuild.site
* Rebuilt URL to: https://mtls.cloudbuild.site/
*   Trying 13.70.185.45...
* TCP_NODELAY set
* Connected to mtls.cloudbuild.site (13.70.185.45) port 443
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/certs/ca-certificates.crt
  CApath: /etc/ssl/certs
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Request CERT (13):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Certificate (11):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Client hello (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES256-GCM-SHA384
* ALPN, server accepted to use http/1.1
* Server certificate:
*  subject: C=US; ST=Denial; L=Springfield; O=Dis; CN=mtls.cloudbuild.site
*  start date: Apr  4 11:36:35 2020 GMT
*  expire date: Apr 14 11:36:35 2021 GMT
*  issuer: C=US; ST=Denial; O=Dis; CN=mtls.cloudbuild.site
*  SSL certificate verify result: unable to get local issuer certificate (20), continuing anyway.
> HEAD / HTTP/1.1
> Host: mtls.cloudbuild.site
> User-Agent: curl/7.58.0
> Accept: */*
>
< HTTP/1.1 400 Bad Request
HTTP/1.1 400 Bad Request
< Server: nginx/1.10.3 (Ubuntu)
Server: nginx/1.10.3 (Ubuntu)
< Date: Wed, 08 Apr 2020 10:13:19 GMT
Date: Wed, 08 Apr 2020 10:13:19 GMT
< Content-Type: text/html
Content-Type: text/html
< Content-Length: 262
Content-Length: 262
< Connection: close
Connection: close

<
* Closing connection 0
* TLSv1.2 (OUT), TLS alert, Client hello (1):

```

We get an `HTTP 400` error code, telling us to go away.

Now `curl` the same endpoint but this time present the server with the right client certificates:

```bash
$ curl --cacert certs/2_intermediate/certs/ca-chain.cert.pem \
    --cert certs/4_client/certs/mtls.cloudbuild.site.cert.pem \
    --key certs/4_client/private/mtls.cloudbuild.site.key.pem \
    https://mtls.cloudbuild.site
```

Note, the `ca-chain.pem` will be the same intermediate ca-cert the MTLS nginx server has configured for its setup. The server has the server cert & key pair, and our client will present the client cert & key pair which is signed by the same intermediate ca-cert as the server.

And we get a successful `HTTP 200 OK`

```bash
* Rebuilt URL to: https://mtls.cloudbuild.site/
*   Trying 13.70.185.45...
* TCP_NODELAY set
* Connected to mtls.cloudbuild.site (13.70.185.45) port 443
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*   CAfile: certs/2_intermediate/certs/ca-chain.cert.pem
  CApath: /etc/ssl/certs
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Request CERT (13):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Certificate (11):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS handshake, CERT verify (15):
* TLSv1.2 (OUT), TLS change cipher, Client hello (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES256-GCM-SHA384
* ALPN, server accepted to use http/1.1
* Server certificate:
*  subject: C=US; ST=Denial; L=Springfield; O=Dis; CN=mtls.cloudbuild.site
*  start date: Apr  4 11:36:35 2020 GMT
*  expire date: Apr 14 11:36:35 2021 GMT
*  common name: mtls.cloudbuild.site (matched)
*  issuer: C=US; ST=Denial; O=Dis; CN=mtls.cloudbuild.site
*  SSL certificate verify ok.
> HEAD / HTTP/1.1
> Host: mtls.cloudbuild.site
> User-Agent: curl/7.58.0
> Accept: */*
>
< HTTP/1.1 200 OK
HTTP/1.1 200 OK
< Server: nginx/1.10.3 (Ubuntu)
Server: nginx/1.10.3 (Ubuntu)
< Date: Wed, 08 Apr 2020 10:25:29 GMT
Date: Wed, 08 Apr 2020 10:25:29 GMT
< Content-Type: text/html
Content-Type: text/html
< Content-Length: 557
Content-Length: 557
< Last-Modified: Wed, 08 Apr 2020 00:53:53 GMT
Last-Modified: Wed, 08 Apr 2020 00:53:53 GMT
< Connection: keep-alive
Connection: keep-alive
< ETag: "5e8d20a1-22d"
ETag: "5e8d20a1-22d"
< Accept-Ranges: bytes
Accept-Ranges: bytes

<
* Connection #0 to host mtls.cloudbuild.site left intact
```

And just for posterity, the logs from `/var/log/nginx/listener.log` with the new log_format we configured above looks like this:

curl with no certs

```bash
115.189.88.95 - - [08/Apr/2020:10:13:11 +0000] "HEAD / HTTP/1.1" 400 0 "Client fingerprint" - "Client DN" -
```

curl with certs

```bash
115.189.88.95 - - [08/Apr/2020:10:25:29 +0000] "HEAD / HTTP/1.1" 200 0 "Client fingerprint" 7dccb99b6584e9b6cf624290952c7bd4b905412b "Client DN" /C=US/ST=Denial/L=Springfield/O=Dis/CN=mtls.cloudbuild.site
```

Ok, now the real work begins... setting up an Istio Egress Gateway to do this MTLS certificate exchange with the MTLS server on the K8s cluster's behalf.

## Istio Egress Gateway Setup

You should have `istioctl` installed already (if not, go [here](https://istio.io/docs/setup/getting-started/)).

### install istio with egressgateway

```bash
istioctl manifest apply --set values.global.istioNamespace=istio-system \
    --set values.gateways.istio-ingressgateway.enabled=false \
    --set values.gateways.istio-egressgateway.enabled=true \
    --set values.global.proxy.accessLogFile="/dev/stdout" \
    --set values.sidecarInjectorWebhook.rewriteAppHTTPProbe=true
```

* *enables `istio-egressgateway`
* *disables `istio-ingressgateway`
* *enables access logs for istio-proxy containers
* *enables `rewriteAppHTTPProbe` which helps with healthcheck 503 errors.

### create the cert k8s secrets

create the following secrets in the `istio-system` namespace so `egressgateway` can find them

* *1 x tls secret with the cert & key pair
* *1 x generic secret with the `ca-chain.cert.pem` file contents.

```bash
kubectl -n istio-system create secret tls nginx-client-certs --key certs/4_client/private/mtls.cloudbuild.site.key.pem --cert certs/4_client/certs/mtls.cloudbuild.site.cert.pem
kubectl -n istio-system create secret generic nginx-ca-certs --from-file=certs/2_intermediate/certs/ca-chain.cert.pem
```

### patch the egressgateway

There's a better way to do this by setting these mounts during the `istioctl` install, but this is the manual post-install way:

```bash
kubectl -n istio-system patch --type=json deploy istio-egressgateway -p "$(cat patch-egress.json)"
```

where `patch-egress.json` is

```json
[{
  "op": "add",
  "path": "/spec/template/spec/containers/0/volumeMounts/0",
  "value": {
    "mountPath": "/etc/istio/nginx-client-certs",
    "name": "nginx-client-certs",
    "readOnly": true
  }
},
{
  "op": "add",
  "path": "/spec/template/spec/volumes/0",
  "value": {
  "name": "nginx-client-certs",
    "secret": {
      "secretName": "nginx-client-certs",
      "optional": true
    }
  }
},
{
  "op": "add",
  "path": "/spec/template/spec/containers/0/volumeMounts/1",
  "value": {
    "mountPath": "/etc/istio/nginx-ca-certs",
    "name": "nginx-ca-certs",
    "readOnly": true
  }
},
{
  "op": "add",
  "path": "/spec/template/spec/volumes/1",
  "value": {
  "name": "nginx-ca-certs",
    "secret": {
      "secretName": "nginx-ca-certs",
      "optional": true
    }
  }
}]
```

kill the egressgateway pod (`$ kubectl -n istio-system delete pods -lapp=istio-egressgateway`) so it can pick up the secrets (and the certs inside them).

Check you can now see the certs in the `egressgateway` pod in the `istio-system` namespace:

client certs

```bash
$ kubectl -n istio-system exec -ti istio-egressgateway-8544965cd5-2hdnc -- ls -al /etc/istio/nginx-client-certs
total 8
drwxrwxrwt 3 root root  120 Apr  8 13:56 .
drwxr-xr-x 1 root root 4096 Apr  8 13:56 ..
drwxr-xr-x 2 root root   80 Apr  8 13:56 ..2020_04_08_13_56_42.418467475
lrwxrwxrwx 1 root root   31 Apr  8 13:56 ..data -> ..2020_04_08_13_56_42.418467475
lrwxrwxrwx 1 root root   14 Apr  8 13:56 tls.crt -> ..data/tls.crt
lrwxrwxrwx 1 root root   14 Apr  8 13:56 tls.key -> ..data/tls.key
```

ca-certs

```bash
$ kubectl -n istio-system exec -ti istio-egressgateway-8544965cd5-2hdnc -- ls -al /etc/istio/nginx-ca-certs
total 8
drwxrwxrwt 3 root root  100 Apr  8 13:56 .
drwxr-xr-x 1 root root 4096 Apr  8 13:56 ..
drwxr-xr-x 2 root root   60 Apr  8 13:56 ..2020_04_08_13_56_42.910605930
lrwxrwxrwx 1 root root   31 Apr  8 13:56 ..data -> ..2020_04_08_13_56_42.910605930
lrwxrwxrwx 1 root root   24 Apr  8 13:56 ca-chain.cert.pem -> ..data/ca-chain.cert.pem

```

## WARNING: Istio Documented Configs (NOT WORKING)

I followed the Istio documentation closely, and for the life of me could not get the configurations to work, or find any resolution to the error messages via the github issues section, or on their [discuss forums](https://discuss.istio.io/) and slack channel.

I logged an issues ticket ([https://github.com/istio/istio.io/issues/7063](https://github.com/istio/istio.io/issues/7063)) with the istio.io repo as I don't think it's an issue with Istio itself, just the documentation.

So the _**"not working"**_ setup is as follows:

With everything setup as above, and following the [Egress Gateways with TLS Origination (v1.5.0)](https://istio.io/docs/tasks/traffic-management/egress/egress-gateway-tls-origination/) I deployed the following configurations to a namespace called `mesh-internal`

```yaml
---
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: istio-egressgateway
spec:
  selector:
    istio: egressgateway
  servers:
  - port:
      number: 443
      name: https
      protocol: HTTPS
    hosts:
    - mtls.cloudbuild.site
    tls:
      mode: MUTUAL
      serverCertificate: /etc/certs/cert-chain.pem
      privateKey: /etc/certs/key.pem
      caCertificates: /etc/certs/root-cert.pem

---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: egressgateway-for-nginx
spec:
  host: istio-egressgateway.istio-system.svc.cluster.local
  subsets:
  - name: nginx
    trafficPolicy:
      loadBalancer:
        simple: ROUND_ROBIN
      portLevelSettings:
      - port:
          number: 443
        tls:
          mode: ISTIO_MUTUAL
          sni: mtls.cloudbuild.site

---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: direct-nginx-through-egress-gateway
spec:
  hosts:
  - mtls.cloudbuild.site
  gateways:
  - istio-egressgateway
  - mesh
  http:
  - match:
    - gateways:
      - mesh
      port: 80
    route:
    - destination:
        host: istio-egressgateway.istio-system.svc.cluster.local
        subset: nginx
        port:
          number: 443
      weight: 100
  - match:
    - gateways:
      - istio-egressgateway
      port: 443
    route:
    - destination:
        host: mtls.cloudbuild.site
        port:
          number: 443
      weight: 100
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: originate-mtls-for-nginx
spec:
  host: mtls.cloudbuild.site
  trafficPolicy:
    loadBalancer:
      simple: ROUND_ROBIN
    portLevelSettings:
    - port:
        number: 443
      tls:
        mode: MUTUAL
        clientCertificate: /etc/istio/nginx-client-certs/tls.crt
        privateKey: /etc/istio/nginx-client-certs/tls.key
        caCertificates: /etc/istio/nginx-ca-certs/ca-chain.cert.pem
        sni: mtls.cloudbuild.site
```

this creates 4 x objects

* gateway.networking.istio.io/istio-egressgateway created
* destinationrule.networking.istio.io/egressgateway-for-nginx created
* virtualservice.networking.istio.io/direct-nginx-through-egress-gateway created
* destinationrule.networking.istio.io/originate-mtls-for-nginx created

## Errors: nginx certs & root-cert.pem

### invalid path nginx certs

checking the istio-proxy container for a `sleep` pod inside my `mesh-internal` namespace:

```bash
2020-04-12T02:39:07.916502Z	info	Envoy proxy is ready
[Envoy (Epoch 0)] [2020-04-12 02:40:53.418][16][warning][config] [external/envoy/source/common/config/grpc_subscription_impl.cc:87] gRPC config for type.googleapis.com/envoy.api.v2.Cluster rejected: Error adding/updating cluster(s) outbound|443||mtls.cloudbuild.site: Invalid path: /etc/istio/nginx-ca-certs/ca-chain.cert.pem
```

### invalid path /etc/certs/root-cert.pem

checking the `istio-egressgateway` pod I can see the following errors as well:

```bash
[Envoy (Epoch 0)] [2020-04-12 02:54:07.787][15][warning][config] [external/envoy/source/common/config/grpc_subscription_impl.cc:87] gRPC config for type.googleapis.com/envoy.api.v2.Listener rejected: Error adding/updating listener(s) 0.0.0.0_443: Invalid path: /etc/certs/root-cert.pem
```

### HTTP/1.1 503 Service Unavailable (obviously)

Without the certs, checking with curl calling my mtls server I get:

```bash
$ kubectl -n mesh-internal exec sleep-74997ffb46-flkcg -c sleep -- curl -s -I http://mtls.cloudbuild.site
HTTP/1.1 503 Service Unavailable
content-length: 91
content-type: text/plain
date: Sat, 11 Apr 2020 13:24:33 GMT
server: envoy
```

## UNOFFICIAL: WORKING CONFIGURATION

After a lot of reading through istio githubs issues and discuss.istio.io forum, I pieced together the following changes that eventually lead to a successful TLS client-verified session with my external MTLS server.

Disclaimer: I don't think this is how this setup is supposed to work (being able to only call the mtls server from a deployment with the annotation is a bit meh right?), this is just how I got things to work so that a bare `curl` to an http endpoint gets upgraded to `tls/443` and does the clint-certificate verification automatically.

Our architectural diagram ends up looking more like this:

![architecture](/img/istiomtls-arch-working.png)

So, first the fixes for the cert errors-

### /etc/root-cert.pem fix

I changed port protocal from `HTTPS`

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: istio-egressgateway
spec:
  selector:
    istio: egressgateway
  servers:
  - port:
      number: 443
      name: https
      protocol: HTTPS
    hosts:
    - mtls.cloudbuild.site
    tls:
      mode: MUTUAL
      serverCertificate: /etc/certs/cert-chain.pem
      privateKey: /etc/certs/key.pem
      caCertificates: /etc/certs/root-cert.pem
```

to `TLS`

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: istio-egressgateway
spec:
  selector:
    istio: egressgateway
  servers:
  - port:
      number: 443
      name: https
      protocol: TLS
    hosts:
    - mtls.cloudbuild.site
    tls:
      mode: MUTUAL
      serverCertificate: /etc/certs/cert-chain.pem
      privateKey: /etc/certs/key.pem
      caCertificates: /etc/certs/root-cert.pem
```

And the error goes away.

I'm assuming its because there's a `tls` section there and cert lookups get treated differently?

### Invalid path: /etc/istio/nginx-ca-certs/ca-chain.cert.pem fix

For this one I came across an open issue where someone advised the sidecar of the pod calling the MTLS backend server needs to have the certs mounted to it - which sort of defeats the purpose of this _"egressgateway will handle verifying calls to the backend using istio"_ example right?

Anyway, I did the following:

1. created the `nginx-client-certs` and `nginx-ca-certs` secrets inside my namespace `mesh-internal` (where my `sleep` pod is deployed)
2. added the following annotations (`sidecar.istio.io/userVolumeMount` and `sidecar.istio.io/userVolume`) to my sleep pods deployment manifest:

  ```yaml
  ---
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: sleep
    namespace: mesh-internal
  spec:
    replicas: 1
    selector:
      matchLabels:
        app: sleep
    template:
      metadata:
        annotations:                                                                                       
          sidecar.istio.io/userVolumeMount: '[{"name":"nginx-client-certs", "mountPath":"/etc/istio/nginx-client-certs", "readonly":true},{"name":"nginx-ca-certs", "mountPath":"/etc/istio/nginx-ca-certs", "readonly":true}]'
          sidecar.istio.io/userVolume: '[{"name":"nginx-client-certs", "secret":{"secretName":"nginx-client-certs"}},{"name":"nginx-ca-certs", "secret":{"secretName":"nginx-ca-certs"}}]'
        labels:
          app: sleep
      spec:
        serviceAccountName: sleep
        containers:
        - name: sleep
          image: governmentpaas/curl-ssl
          command: ["/bin/sleep", "3650d"]
          imagePullPolicy: IfNotPresent
          volumeMounts:
          - mountPath: /etc/sleep/tls
            name: secret-volume
        volumes:
        - name: secret-volume
          secret:
            secretName: sleep-secret
            optional: true
  ```

Now my `sleep` pod doesn't complain about the nginx certs anymore.

I see other pods like prometheus and an httpbin pod in my `mesh-internal` namespace complaining about not finding the certs, but I understand (currently) it's because I haven't "sidecar mounted" these certs directly to them.

### Add ServiceEntry and VirtualService

I added a `ServiceEntry` and `VirtualService` combination (it wasn't clear in the example that I needed to have one, and the previous section of the documentation delete's the ServiceEntry so the following section seems to go ahead without one and doesn't specify creating a new one?)

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: ServiceEntry
metadata:
  name: external-mtls-nginx-server
  namespace: mesh-internal
spec:
  hosts:
  - mtls.cloudbuild.site
  ports:
  - number: 80
    name: http
    protocol: HTTP
  - number: 443
    name: https
    protocol: TLS
  resolution: DNS

---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: nginx
  namespace: mesh-internal
spec:
  hosts:
  - mtls.cloudbuild.site
  tls:
  - match:
    - port: 443
      sni_hosts:
      - mtls.cloudbuild.site
    route:
    - destination:
        host: mtls.cloudbuild.site
        port:
          number: 443
      weight: 100
```

### Changed Gateway to HTTP

Changed this from tls..

```yaml
---
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: istio-egressgateway
spec:
  selector:
    istio: egressgateway
  servers:
  - port:
      number: 443
      name: https
      protocol: HTTPS
    hosts:
    - mtls.cloudbuild.site
    tls:
      mode: MUTUAL
      serverCertificate: /etc/certs/cert-chain.pem
      privateKey: /etc/certs/key.pem
      caCertificates: /etc/certs/root-cert.pem
```

to HTTP

```yaml
---
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: istio-egressgateway
  namespace: mesh-internal
spec:
  selector:
    istio: egressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - mtls.cloudbuild.site
```

### Changed DestinationRule

from

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: egressgateway-for-nginx
spec:
  host: istio-egressgateway.istio-system.svc.cluster.local
  subsets:
  - name: nginx
    trafficPolicy:
      loadBalancer:
        simple: ROUND_ROBIN
      portLevelSettings:
      - port:
          number: 443
        tls:
          mode: ISTIO_MUTUAL
          sni: mtls.cloudbuild.site
```

to

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: egressgateway-for-nginx
  namespace: mesh-internal
spec:
  host: istio-egressgateway.istio-system.svc.cluster.local
  subsets:
  - name: nginx
```

### Changed VirtualService to port 80

Now that my `Gateway` is port 80, I update the following route from `istio-egressgateway.istio-system.svc.cluster.local:443`

```yaml
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: direct-nginx-through-egress-gateway
spec:
  hosts:
  - mtls.cloudbuild.site
  gateways:
  - istio-egressgateway
  - mesh
  http:
  - match:
    - gateways:
      - mesh
      port: 80
    route:
    - destination:
        host: istio-egressgateway.istio-system.svc.cluster.local
        subset: nginx
        port:
          number: 443
      weight: 100
  - match:
    - gateways:
      - istio-egressgateway
      port: 443
    route:
    - destination:
        host: mtls.cloudbuild.site
        port:
          number: 443
      weight: 100
```

to `istio-egressgateway.istio-system.svc.cluster.local:80`

```yaml
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: direct-nginx-through-egress-gateway
  namespace: mesh-internal
spec:
  hosts:
  - mtls.cloudbuild.site
  gateways:
  - istio-egressgateway
  - mesh
  http:
  - match:
    - gateways:
      - mesh
      port: 80
    route:
    - destination:
        host: istio-egressgateway.istio-system.svc.cluster.local
        subset: nginx
        port:
          number: 80
      weight: 100
  - match:
    - gateways:
      - istio-egressgateway
      port: 80
    route:
    - destination:
        host: mtls.cloudbuild.site
        port:
          number: 443
      weight: 100
```

And then it all works.

## Working Output

So now when I curl from the `sleep` pod inside the `mesh-internal` namespace, I get the expected output:

```bash
$ kubectl -n mesh-internal exec sleep-74997ffb46-cxs77 -c sleep -- curl  http://mtls.cloudbuild.site
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to the Mutual TLS Server!</h1>

<p>If you see this page, you have successfully used the correct client-side certificates that match the ones
  deployed on this server.
</p>

<p>For more information please visit my website:<a href="https://iamronamo.io/">iamronamo.io</a>.

<p><em>Thank you and goodnight.</em></p>
</body>
</html>
```

From the sleep pod's `istio-proxy` container I can see it hitting my port 80 outbound endpoint:

```bash
[2020-04-11T15:03:16.493Z] "GET / HTTP/1.1" 200 - "-" "-" 0 557 4 4 "-" "curl/7.64.0" "738ceb49-93c9-4462-a53b-ab690bef4b93" "mtls.cloudbuild.site" "16.0.1.90:80" outbound|80|nginx|istio-egressgateway.istio-system.svc.cluster.local 16.0.1.103:39040 52.189.232.175:80 16.0.1.103:45092 - -
```

and from the `istio-egressgateway` pod I can see it going outbound on 443:

```bash
[2020-04-11T15:04:37.866Z] "GET / HTTP/2" 200 - "-" "-" 0 557 4 4 "16.0.1.103" "curl/7.64.0" "7d158baa-3ac4-4da7-9e91-a4ae6115c090" "mtls.cloudbuild.site" "52.189.232.175:443" outbound|443||mtls.cloudbuild.site 16.0.1.90:43866 16.0.1.90:80 16.0.1.103:39040 - -
```

## Conclusion

I have found Istio's documentation to be workable most of the time. But sometimes the examples run into each other, so its hard to know what are the specifics of that example without something explicitly saying "this example will create `n` components", or a repo/folder with the exact configs used to achieve whatever the thing was in the example.

The discuss forum and slack channels were very underwhelming. I don't know what to put that down to, but they weren't very active or helpful.

Anyway I've spent way too much time on this and it's just good to get it working so I can put this all behind me.

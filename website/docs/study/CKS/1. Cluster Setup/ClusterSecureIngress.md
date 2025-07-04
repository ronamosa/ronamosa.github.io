---
title: Secure Ingress
---

## Ingress

- Usually an nginx pod Ingress
- We just create YAML, Ingress and NGINX config is created with it, we don't touch it.
- Service always points to Pods (via labels) - not deployments, daemonSets - always Pods.

## Services

There are 3 x types of services, they all work like each other:

- `clusterIP` - internal points to Pod
- `nodePort` - opens port on a Node, works like a `clusterIP` (theoretically because a NodePort makes a clusterIP reachable from the outside), there's only NodePort service there, but think of it like a clusterIP (i.e. points to a Pod).
- `LoadBalancer` - creates NodePort --> ClusterIP --> points to Pod/NGINX

## Create an Ingress

Scenario:

request --> `NodePort` --> `NGINX Ingress`
`NGINX Ingress` --> /service1: `ClusterIP` --> `Pod1`
`NGINX Ingress` --> /service2: `ClusterIP` --> `Pod2`

### Install NGINX Ingress

`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.40.2/deploy/static/provider/baremetal/deploy.yaml`

```bash
root@cks-master:~# kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.40.2/deploy/static/provider/baremetal/deploy.yaml
namespace/ingress-nginx created
serviceaccount/ingress-nginx created
configmap/ingress-nginx-controller created
clusterrole.rbac.authorization.k8s.io/ingress-nginx created
clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx created
role.rbac.authorization.k8s.io/ingress-nginx created
rolebinding.rbac.authorization.k8s.io/ingress-nginx created
service/ingress-nginx-controller-admission created
service/ingress-nginx-controller created
deployment.apps/ingress-nginx-controller created
validatingwebhookconfiguration.admissionregistration.k8s.io/ingress-nginx-admission created
serviceaccount/ingress-nginx-admission created
clusterrole.rbac.authorization.k8s.io/ingress-nginx-admission created
clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx-admission created
role.rbac.authorization.k8s.io/ingress-nginx-admission created
rolebinding.rbac.authorization.k8s.io/ingress-nginx-admission created
job.batch/ingress-nginx-admission-create created
job.batch/ingress-nginx-admission-patch created
```

check new ingress pods,svc

```bash
root@cks-master:~# k -n ingress-nginx get pods,svc
NAME                                            READY   STATUS      RESTARTS   AGE
pod/ingress-nginx-admission-create-8fsvv        0/1     Completed   0          57s
pod/ingress-nginx-admission-patch-wdvrk         0/1     Completed   2          57s
pod/ingress-nginx-controller-655cc55649-5rnxl   1/1     Running     0          57s

NAME                                         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
service/ingress-nginx-controller             NodePort    10.105.163.30    <none />        80:32677/TCP,443:31926/TCP   57s
service/ingress-nginx-controller-admission   ClusterIP   10.107.227.109   <none />        443/TCP                      57s
```

get worker external IP address from GCP: `gcloud compute instances describe cks-worker`

curl the external IP + http NodePort

```bash
$ curl http://35.244.67.113:32677
<html />
<head /><title />404 Not Found</title></head>
<body />
<center /><h1 />404 Not Found</h1></center>
<hr /><center />nginx</center>
</body>
</html>
```

now we want a service1 and service2 config for nginx

example from [kubernetes.io/ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/#examples)

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: minimal-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - http:
      paths:
      - path: /testpath
        pathType: Prefix
        backend:
          service:
            name: test
            port:
              number: 80
```

edit for service1, service2

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: secure-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - http:
      paths:
      - path: /service1
        pathType: Prefix
        backend:
          service:
            name: service1
            port:
              number: 80

      - path: /service2
        pathType: Prefix
        backend:
          service:
            name: service2
            port:
              number: 80
```

check

```bash
root@cks-master:~# k create -f ingress.yaml
ingress.networking.k8s.io/secure-ingress created
root@cks-master:~# k get ing
NAME             CLASS    HOSTS   ADDRESS   PORTS   AGE
secure-ingress   <none />   *                 80      9s
```

now create our pods for the services, and expose them

```bash
root@cks-master:~# k run pod1 --image=nginx
pod/pod1 created
root@cks-master:~# k run pod2 --image=httpd
pod/pod2 created
root@cks-master:~# k expose pod pod1 --port 80 --name service1
service/service1 exposed
root@cks-master:~# k expose pod pod2 --port 80 --name service2
service/service2 exposed
```

note: make sure your default-deny network policies are removed from previous sessions.

checking with curl service1 (nginx)

```bash
curl http://35.244.67.113:32677/service1
<!DOCTYPE html>
<html />
<head />
<title />Welcome to nginx!</title>
<style />
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body />
<h1 />Welcome to nginx!</h1>
<p />If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p />For online documentation and support please refer to
<a href="http://nginx.org/" />nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/" />nginx.com</a>.</p>

<p /><em />Thank you for using nginx.</em></p>
</body>
</html>
```

service2 (httpd)

```bash
curl http://35.244.67.113:32677/service2
<html /><body /><h1 />It works!</h1></body></html>
```

## Secure the Ingress

securing it over HTTPS into the NodePort

```bash
curl https://35.244.67.113:31926
curl: (60) SSL certificate problem: unable to get local issuer certificate
More details here: https://curl.haxx.se/docs/sslcerts.html

curl failed to verify the legitimacy of the server and therefore could not
establish a secure connection to it. To learn more about this situation and
how to fix it, please visit the web page mentioned above.
```

use `-k`

```bash
curl -k https://35.244.67.113:31926
<html />
<head /><title />404 Not Found</title></head>
<body />
<center /><h1 />404 Not Found</h1></center>
<hr /><center />nginx</center>
</body>
</html>

curl -k https://35.244.67.113:31926/service2
<html /><body /><h1 />It works!</h1></body></html>
```

seems to be working! check out `-kv` for more details

it's using a fake k8s cert

```bash
curl -vk https://35.244.67.113:31926/service2
*   Trying 35.244.67.113:31926...
* TCP_NODELAY set
* Connected to 35.244.67.113 (35.244.67.113) port 31926 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/certs/ca-certificates.crt
  CApath: /etc/ssl/certs
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
* ALPN, server accepted to use h2
* Server certificate:
*  subject: O=Acme Co; CN=Kubernetes Ingress Controller Fake Certificate
*  start date: Aug 30 05:37:36 2021 GMT
*  expire date: Aug 30 05:37:36 2022 GMT
*  issuer: O=Acme Co; CN=Kubernetes Ingress Controller Fake Certificate
*  SSL certificate verify result: unable to get local issuer certificate (20), continuing anyway.
* Using HTTP2, server supports multi-use
* Connection state changed (HTTP/2 confirmed)
* Copying HTTP/2 data in stream buffer to connection buffer after upgrade: len=0
* Using Stream ID: 1 (easy handle 0x5623a3f6bd40)
> GET /service2 HTTP/2
> Host: 35.244.67.113:31926
> user-agent: curl/7.68.0
> accept: */*
>
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* old SSL session ID is stale, removing
* Connection state changed (MAX_CONCURRENT_STREAMS == 128)!
< HTTP/2 200
< date: Mon, 30 Aug 2021 06:08:43 GMT
< content-type: text/html
< content-length: 45
< last-modified: Mon, 11 Jun 2007 18:53:14 GMT
< etag: "2d-432a5e4a73a80"
< accept-ranges: bytes
< strict-transport-security: max-age=15724800; includeSubDomains
<
<html /><body /><h1 />It works!</h1></body></html>
* Connection #0 to host 35.244.67.113 left intact
```

fake ingress cert

```bash
* Server certificate:
*  subject: O=Acme Co; CN=Kubernetes Ingress Controller Fake Certificate
```

let's create our own [TLS](https://kubernetes.io/docs/concepts/services-networking/ingress/#tls) cert, where we need to

1. create our certs
2. store it in secrets
3. extend our Ingress config to use https & which secret holds the certs

create cert: `openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes` (Common Name (e.g. server FQDN or YOUR name) []:secure-ingress.com)

create secret:

```bash
k create secret tls secure-ingress --cert=./cert.pem --key=./key.pem
secret/secure-ingress created
```

extend Ingress:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: secure-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  tls:
  - hosts:
      - secure-ingress.com
    secretName: secure-ingress
  rules:
  - http:
      paths:
      - path: /service1
        pathType: Prefix
        backend:
          service:
            name: service1
            port:
              number: 80

      - path: /service2
        pathType: Prefix
        backend:
          service:
            name: service2
            port:
              number: 80
```

test config -- remember, our services are now under the `secure-ingress.com` host, as per our Ingress config, but also that domain doesn't exist -- so we call the URL as that domain, BUT we resolve the hostname ourselves using `--resolve` to point to the IP:port we have setup for our `cks-worker` node:

```bash
curl -vk https://secure-ingress.com:31926/service2 --resolve secure-ingress.com:31926:35.244.67.113

* Added secure-ingress.com:31926:35.244.67.113 to DNS cache
* Hostname secure-ingress.com was found in DNS cache
*   Trying 35.244.67.113:31926...
* TCP_NODELAY set
* Connected to secure-ingress.com (35.244.67.113) port 31926 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/certs/ca-certificates.crt
  CApath: /etc/ssl/certs
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
* ALPN, server accepted to use h2
* Server certificate:
*  subject: C=NZ; ST=Some-State; O=Internet Widgits Pty Ltd; CN=secure-ingress.com
*  start date: Aug 30 06:14:33 2021 GMT
*  expire date: Aug 30 06:14:33 2022 GMT
*  issuer: C=NZ; ST=Some-State; O=Internet Widgits Pty Ltd; CN=secure-ingress.com
*  SSL certificate verify result: self signed certificate (18), continuing anyway.
* Using HTTP2, server supports multi-use
* Connection state changed (HTTP/2 confirmed)
* Copying HTTP/2 data in stream buffer to connection buffer after upgrade: len=0
* Using Stream ID: 1 (easy handle 0x560ae97fbd40)
> GET /service2 HTTP/2
> Host: secure-ingress.com:31926
> user-agent: curl/7.68.0
> accept: */*
>
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* old SSL session ID is stale, removing
* Connection state changed (MAX_CONCURRENT_STREAMS == 128)!
< HTTP/2 200
< date: Mon, 30 Aug 2021 06:21:57 GMT
< content-type: text/html
< content-length: 45
< last-modified: Mon, 11 Jun 2007 18:53:14 GMT
< etag: "2d-432a5e4a73a80"
< accept-ranges: bytes
< strict-transport-security: max-age=15724800; includeSubDomains
<
<html /><body /><h1 />It works!</h1></body></html>
* Connection #0 to host secure-ingress.com left intact
```

notice the TLS certificate section

```bash
* Server certificate:
*  subject: C=NZ; ST=Some-State; O=Internet Widgits Pty Ltd; CN=secure-ingress.com
*  start date: Aug 30 06:14:33 2021 GMT
*  expire date: Aug 30 06:14:33 2022 GMT
*  issuer: C=NZ; ST=Some-State; O=Internet Widgits Pty Ltd; CN=secure-ingress.com
*  SSL certificate verify result: self signed certificate (18), continuing anyway.
```

## References

:::info

- [K8s Secure Ingress with TLS](https://kubernetes.io/docs/concepts/services-networking/ingress/#tls)
- [K8s Ingress Documentation](https://kubernetes.io/docs/concepts/services-networking/ingress)

:::

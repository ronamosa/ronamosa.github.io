---
title: "Ambassador API Gateway TLS Security - Disable TLS 1.0 and 1.1 for Better Security"
description: "Configure Ambassador API Gateway to disable insecure TLS 1.0 and 1.1 protocols. Improve Kubernetes ingress security with modern TLS configuration."
keywords: ["ambassador api gateway", "tls security", "disable tls 1.0", "kubernetes ingress", "api gateway security", "tls configuration", "kubernetes security"]
tags: ["ambassador", "tls", "security", "kubernetes", "api-gateway"]
sidebar_position: 4
---

:::info

Published Date: 09-JUL-2019

:::

Having just learned about Ambassador, and how it's implemented in a Kubernetes cluster, I thought a quick note about how to disable TLS1 and TLS1.0 would be interesting. These notes will be pretty brief as I mainly want to demonstrate how this was achieved. A more detailed post about Ambassador in general may be forthcoming (but don't hold your breath waiting, you will most certainly pass out).

## What is Ambassador?

:::info

"Ambassador is an open source Kubernetes-native API gateway for microservices build on the Envoy Proxy." - [The Ambassador Github](https://github.com/datawire/ambassador)

:::

What does that even mean? Well I guess the answer depends on who's reading this.

**IT Pros**: 'Ambassador' is an API gateway and L7 proxy for your microservices. It's like the NGINX web proxy on steroids, for microservices. Except it uses Envoy (another proxy) instead of NGINX. But us old school Linux Systems Administrators get 'NGINX'.

**Non-IT Pros**: (over-simplified) 'Ambassador' is the gateway for everything that needs to call your microservices via their URL's e.g. https:/cloudbuilder.io/v1/someApi etc. Ambassador handles these requests and forwards them internally to where they need to go.

## How does Ambassador work?

Ambassador runs as a pod in your K8s cluster.

Your API's will have a `kind: Service` definition (in `service.yaml`), and in there, in the metadata section will be an `annotations:` block where you will have your mappings defined.

```yaml
apiVersion: v1
kind: Service
metadata:
  annotations:
    getambassador.io/config: |
      ---
      apiVersion: ambassador/v0
      kind:  Mapping
      name: my-api
      prefix: /getSomeApi
      rewrite: /getSomeApi
      timeout_ms: 10000
      host:  "api.cloudbuilder.io"
      service: my-api:80
      envoy_override:
        case_sensitive: false
spec:
  type: ClusterIP
  ports:
  - name: http
    port: 80
    protocol: TCP
    targetPort: http
```

All these configs define the k8s manifest. Now, when this manifest is applied, the Kubernetes API lets Ambassador know about the change, and Ambassador will dynamically generate an Envoy proxy configuration which will have the required mappings in it, and Envoy will know how to handle the traffic for that API.

Basically: Every API has an ambassador annotation block in its K8s `kind: Service` definition, K8s API tells Ambassador about these, and Ambassador generates Envoy configs with the changes on-the-fly.

## Ambassador pre-0.50.0 and TLS

Ambassador can terminate TLS for your services by having certs saved and available in a K8s secret named `ambassador-certs`.

Ambassador pre-0.50, the `tls` module would handle things for you, and you would have this in your ambassador `service.yaml`

```yaml
---
apiVersion: v1
kind: Service
metadata:
  labels:
    service: ambassador
  name: ambassador
  annotations:
    external-dns.alpha.kubernetes.io/hostname:
    external-dns.alpha.kubernetes.io/ttl:
    service.beta.kubernetes.io/azure-load-balancer-internal: "true"
    getambassador.io/config: |
        ---
        apiVersion: ambassador/v0
        kind:  Module
        name:  tls
        config:
          server:
            enabled: True
            redirect_cleartext_from: 80
spec:
  type: ClusterIP 
  loadBalancerIP: "your IP here"
  ports:
  - name: http
    port: 80
  - name: https
    port: 443

```

:::info

I had to remove the Go templating syntax because it was messing with Jekylls code block rendering ability.

:::

That's all well and good, but how do we disable TLS1.0 and TLS1.1?

## Disable TLS1.0 and TLS1.1

The reason to look at Ambassador pre-0.50 is because from v0.60.0 datawire introduce a nifty new way of handling tls by way of `kind: TLSContext` type which replaces the tls `kind: Module`.

And `TLSContext` brings with it these two features:

* `min_tls_version` and
* `max_tls_version`

Available options: v1.0, v1.1, v1.2.

So now we can set the `min_tls_version` to v1.2 and effectively disable tls1.0 and tsl1.1

## TLS1.2 Only

For this configuration I bumped Ambassador up to 0.70.1 from 0.50.x (cos why not right?) and with it had introduced a bunch of new things that needed to be configured before this would work.

:::info

I will cover them briefly as the scope of this post is to show the working tls1.2 ambassador setup.

:::

### Overview of new configs in 0.70.x

* CustomResourceDefinitions - these were new, and needed to be factored in.
* New port mappings - port 80 and 443 are so last week!
* using tls module and tlscontext together - the ambassador-cert gotcha.

#### CustomResourceDefinitions (CRDs)

You need to add these Custom Resource Definitions with `crds.yaml` (see [here](https://github.com/helm/charts/blob/master/stable/ambassador/templates/crds.yaml)).

_Note: I can't remember if these were mandatory or not._

#### Ports 8080, 8443

In your Ambassador `service.yaml` the new defaults are now as 8080 (cleartext) or 8443 (TLS). And if you use `redirect_cleartext_from` in the tls module, make sure to set the port accordingly.

#### tls module & ambassador-certs

By default the `tls` would look for a k8s secret names `ambassador-certs` and when found would assume the TLS responsibilities for Ambassador. This wrecks havoc when you're trying to get `min_tls_version` to work with TLSContext and its just not working.

If you need to use features from `tls` Module, move your tls certs into another k8s secret (or just rename the ambassador-cert secret).

## Ambassador: tls1.0, tls1.1 disabled config

So, if you've got all those in place, are running Ambassador 0.60.0 and up, then all you need is this `service.yaml` in your Ambassador helm chart under `/templates/service.yaml`:

```yaml
---
apiVersion: v1
kind: Service
metadata:
  labels:
    service: ambassador
  name: ambassador
  annotations:
    external-dns.alpha.kubernetes.io/hostname: "your values go here"
    external-dns.alpha.kubernetes.io/ttl: "your values go here"
    service.beta.kubernetes.io/azure-load-balancer-internal: "true"
    getambassador.io/config: |
        ---
        apiVersion: ambassador/v0
        kind:  Module
        name:  tls
        config:
          server:
            enabled: True
            redirect_cleartext_from: 8080
        ---
        apiVersion: ambassador/v1
        kind: TLSContext
        name: ambassador-tlscontext
        hosts:[*]
        secret: tls-certs
        min_tls_version: v1.2
spec:
  type: ClusterIP 
  loadBalancerIP: "your IP here"
  ports:
  - name: http
    port: 80
    targetPort: 8080
  - name: https
    port: 443
    targetPort: 8443
```

that's it.

helm deploy that sucker and go live your best tls1.2 only life.

## Conclusion

Obviously there's a bit more context around K8s and helm charts involved, but this was a brisk walk through Ambassador and its TLS wrangling capabilities.

## References

* [Get Ambassador](https://www.getambassador.io/)
* [L7: NGINX vs Envoy vs HAProxy](https://blog.getambassador.io/envoy-vs-nginx-vs-haproxy-why-the-open-source-ambassador-api-gateway-chose-envoy-23826aed79ef)
* [TLSContext](https://www.getambassador.io/reference/core/tls/#tlscontext)

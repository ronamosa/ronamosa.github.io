---
title: "AWS EKS Load Balancers"
---

::: note

["AWS Load Balancer Controller"](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html) is the key to everything LB-wise in EKS

:::

## Types of Load Balancer

1. **Application** Load Balancer (**ALB**)
2. **Network** Load Balancer (**NLB**)
3. **Gateway** Load Balancer (**GWLB**)
4. **Classic** Load Balancer (**CLB**)

Best practice = ALB (#http/#https, Layer 7) or NLB (#tcp, Layer 4)

::tip rule

- If you need IP preservation, use NLB
- If you need DNS, use ALB
  - can't use DNS, use NLB

:::

## Provision Load Balancers

What handles the provision on Load Balancers? `kube-controller-manager` (aka cloud controller manager) has a built in service called `Kubernetes Service Controller` which handles any Kubernetes Services of type "LoadBalancer".

- AWS Cloud Provider Load balancer Controller = Legacy, create Classic Load Balancers by default.
- AWS Load Balancer Controller (LBC) = new, needs to be manually installed.

:::note

the AWS cloud provider load balancer controller creates AWS Classic Load Balancers by default, but can also create AWS Network Load Balancers with the correct annotation.

:::

`Service` with `type: Load Balancer` + `LBC` = `NLB` deployed
`Ingress` + `LBC` = `ALB` deployed

Type or Kind, trigger the cloud controller to deploy Load balancers cloud-side, `annotations` are how the LB's are configured.

### Service: NLB

Notice: `service.beta.kubernetes.io/aws-load-balancer-*`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: simpleapi
  namespace: prod
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: nlb
    service.beta.kubernetes.io/aws-load-balancer-internal: "false"
    service.beta.kubernetes.io/aws-load-balancer-name: "elb-prod"
  labels:
    app: simpleapi
spec:
  type: LoadBalancer
  ports:
    - name: http
      port: 80
      protocol: TCP
      targetPort: 8080
  selector:
    app: simpleapi
```

### Ingress: ALB

Notice: `alb.ingress.kubernetes.io/`

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: simpleapi
  namespace: prod
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/load-balancer-name: "alb-prod"
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/healthcheck-path: /healthz
    alb.ingress.kubernetes.io/tags: Environment=prod, Application=simpleapi, Creator=AWSLBController
spec:
  ingressClassName: alb
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: simpleapi
                port:
                  number: 80
```

---
title: "Kubernetes Guides: Istio mTLS, Helm 3 & Secrets Management"
description: "Platform-neutral Kubernetes guides — Istio mTLS with cert-manager and egress gateways, the Helm 3 package manager, and secrets management with SecretHub."
keywords: ["kubernetes", "istio", "mtls", "service mesh", "helm 3", "cert-manager", "secrets management", "ambassador"]
tags: ["kubernetes", "istio", "service-mesh", "helm", "security"]
sidebar_position: 0
---

# Kubernetes

The parts that bite after the cluster is running: service mesh security, packaging, and secrets.

## 🔐 Service Mesh & mTLS

- **[Istio mTLS with SDS and Cert-Manager](./2020-03-06-Istio-SDS-Cert-Manager)** — full service mesh security setup
- [Istio mTLS with External Endpoints](./2020-04-08-Istio-MTLS-with-External-Endpoint) — egress gateway configuration

## 📦 Packaging & Deployment

- **[Helm 3 Complete Guide](./2019-11-11-Helm-3-Kubernetes-Package-Manager)** — package management and application deployment

## 🔑 Secrets

- [SecretHub Secrets Management](./2020-08-17-Secrethub-Secret-Management) — secure storage and distribution

## 🌐 Ingress Hardening

- [Ambassador TLS Hardening](./2019-07-09-Ambassador-Disable-TLS1) — disabling TLS 1.0 and 1.1

---

Managed Kubernetes by platform: [EKS on AWS](/docs/engineer/AWS/), [AKS on Azure](/docs/engineer/Azure/). Certification notes: [CKA](/docs/study/CKA/kubernetes-administrator-cka-study-guide/) and [CKS](/docs/study/CKS/kubernetes-security-specialist-cks-study-guide/).

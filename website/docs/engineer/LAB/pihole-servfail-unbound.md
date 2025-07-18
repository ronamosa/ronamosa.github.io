---
slug: fixing-pihole-unbound-servfail-aws
title: Fixing SERVFAIL DNS Resolution for AWS Console with Pi-hole + Unbound
authors: ron
tags: [dns, pihole, unbound, docker, aws]
description: Diagnosing and fixing SERVFAIL errors when resolving AWS console domains via Pi-hole + Unbound in a Docker setup.
image: /img/blog/pihole-unbound.png
---

If you're running [Pi-hole](https://pi-hole.net/) with [Unbound](https://nlnetlabs.nl/projects/unbound/about/) in Docker containers and hit a `SERVFAIL` when trying to access the AWS Console, this post is for you.

I run Pi-hole and Unbound in side-by-side containers using Docker Compose. Recently, DNS lookups to `console.aws.amazon.com` began failing intermittently with a `SERVFAIL`.

---

## 🔥 The Problem

Access to `console.aws.amazon.com` failed, and Pi-hole logs showed:

```bash
query\[A] console.aws.amazon.com from 172.16.2.35
cached console.aws.amazon.com is <CNAME />
...
forwarded console.aws.amazon.com to 192.168.0.2
reply error is SERVFAIL
```

Unbound logs were repetitive and useless at first glance:

```bash
info: generate keytag query \_ta-4f66-9728. NULL IN
```

This pointed to: **DNSSEC validation failure**, specifically with Unbound’s trust anchor setup.

---

## 🔍 Root Cause

Unbound uses DN SSEC by default to validate domain authenticity. AWS domains like `console.aws.amazon.com` involve:

- Deep CNAME chains
- Regional DNS records
- DNSSEC-enabled responses

When Unbound’s DNSSEC trust anchor is outdated or misconfigured, it can't verify these chains and returns `SERVFAIL`.

That log line?

```text
generate keytag query _ta-4f66-9728. NULL IN
````

It means Unbound is repeatedly querying for the DNS trust anchor `_ta-4f66-9728`, likely because:

* The trust anchor expired.
* The `root.key` file was never updated.
* Or your container doesn’t run `unbound-anchor` regularly.

---

## 🧪 Step-by-Step Diagnosis

Here’s how I verified the issue:

1. **From the host**, run:

   ```bash
   dig console.aws.amazon.com @192.168.0.2
   ```

   → `SERVFAIL`

2. **From inside Unbound container**:

   ```bash
   docker exec -it unbound dig console.aws.amazon.com @127.0.0.1
   ```

   → also `SERVFAIL`

3. **Check logs**:

   ```bash
   docker logs unbound | grep ta-4f66
   ```

   → endless keytag queries = broken DNSSEC validation

4. **Temporarily switch Pi-hole to 1.1.1.1 or 8.8.8.8 as upstream** → everything worked again.

---

## ✅ The Fix (Recommended)

Since DNSSEC isn't critical in my setup and updating trust anchors in Docker regularly is annoying, I **disabled DNSSEC** in Unbound:

### 🛠 Edit `unbound.conf` (or `pi-hole.conf`)

Make sure this is in your config:

```conf
server:
  # ... other config ...
  dnssec-validation: no
```

Then restart the container:

```bash
docker restart unbound
```

🎉 That’s it. All AWS domains resolve cleanly now, no `SERVFAIL`.

---

## 🧰 Optional: Update DNSSEC Trust Anchors (if you want to keep DNSSEC)

If you do want to keep DNSSEC on, you’ll need to:

1. Download a fresh root trust anchor:

   ```bash
   curl -o root.key https://data.iana.org/root-anchors/root-anchors.xml
   ```

2. Mount `root.key` into the container:

   ```yaml
   volumes:
     - ./root.key:/etc/unbound/root.key
   ```

3. Add to Unbound config:

   ```conf
   trust-anchor-file: "/etc/unbound/root.key"
   ```

4. Restart Unbound.

:::caution Note

You’ll need to update this file regularly unless you automate it with `unbound-anchor`, which is non-trivial in a minimal container setup.

:::

---

## 🐳 Docker Networking Tips

Make sure both containers are on a user-defined Docker network:

```bash
docker network create dns-net
```

Then update your Compose:

```yaml
services:
  unbound:
    container_name: unbound
    image: mvance/unbound:latest
    networks:
      - dns-net
    ...

  pihole:
    container_name: pihole
    image: pihole/pihole:latest
    networks:
      - dns-net
    environment:
      - PIHOLE_DNS_=unbound#53
    ...
networks:
  dns-net:
```

Using container names (`unbound#53`) avoids needing IPs.

---

## 🧩 Summary

| Symptom                            | Cause                            | Fix                                    |
| ---------------------------------- | -------------------------------- | -------------------------------------- |
| `SERVFAIL` on AWS domains          | DNSSEC trust anchor outdated     | Disable DNSSEC or update trust anchor  |
| Endless `_ta-4f66-9728` queries    | Root key not valid or missing    | Use `dnssec-validation: no` in Unbound |
| Works with 1.1.1.1 but not Unbound | Confirms internal resolver issue | Fix Unbound, not Pi-hole               |

---

## 🧠 Final Thoughts

If you're running Pi-hole + Unbound in containers, you’re likely doing it for privacy, not full DNSSEC correctness. Disabling DNSSEC is a valid tradeoff unless you're actively auditing DNS trust chains.

Pi-hole is powerful, but issues like these can sneak in when upstream resolvers fail quietly and you only see the downstream effect like well-known domains failing to resolve.

Anyway, a possible fix if you find yourself in the same situation.

:::caution Disclaimer

This document is an AI summary of a troubleshooting session I had with my AI, formatted for blog consumption.

:::

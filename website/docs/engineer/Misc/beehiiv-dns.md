---
title: "Beehiiv Custom Domain Setup with Cloudflare - Complete DNS Configuration Guide"
description: "Step-by-step guide to setting up Beehiiv custom domain with Cloudflare DNS. Includes CNAME records, proxy settings, CAA configuration, and troubleshooting for newsletter hosting."
keywords: ["beehiiv custom domain", "cloudflare dns", "newsletter domain setup", "beehiiv cloudflare", "custom domain newsletter", "dns configuration", "beehiiv hosting"]
tags: ["beehiiv", "cloudflare", "dns", "newsletter", "custom-domain"]
sidebar_position: 6
---


I recently moved my newsletter from Substack, to Beehiiv which meant moving my custom domain over as well, but Cloudflare’s defaults (especially proxying and CAA UI quirks) can block verification. This is a precise, Cloudflare-first setup that worked for `www.uncommonengineer.com`, including the exact records, proxy states, and validation commands.

---

## 1) Why Cloudflare needs special care

Cloudflare tends to “help” by proxying CNAMEs (orange cloud) and its CAA UI can be unintuitive.

Beehiiv requires:

- Direct, unproxied DNS resolution for its verification CNAMEs (so Beehiiv/SendGrid can see `sendgrid.net`).
- Correct CAA authorizations so a CA (Let’s Encrypt / Google PKI) may issue certificates for your host.

:::caution

If you proxy or mis-enter CAA records, Beehiiv will fail verification with errors like:

  `Domain verification failed. CAA records are not valid.`

:::

---

## 2) Records Beehiiv needed (this case)

Beehiiv provided the following for `www.uncommonengineer.com`. Your IDs may differ; copy the *form*, not the literal IDs.


```
CNAMEs (SendGrid — must be unproxied, DNS-only):
    Type:   CNAME
    Name:   elinkb04.www
    Value:  sendgrid.net
    Proxy:  DNS Only (grey cloud)

    Type:   CNAME
    Name:   55963338.www
    Value:  sendgrid.net
    Proxy:  DNS Only (grey cloud)

CAA (allow certificate issuance for www via Let’s Encrypt and Google PKI):
    Type:   CAA
    Name:   www
    Flags:  0
    Tag:    issuewild
    Value:  letsencrypt.org

    Type:   CAA
    Name:   www
    Flags:  0
    Tag:    issuewild
    Value:  pki.goog

Notes:

- Cloudflare’s CAA “Tag” choices map as follows:
  - “Only allow specific hostnames” → creates `issue`
  - “Only allow wildcards” → creates `issuewild`
- Beehiiv asked for `issuewild`. In Cloudflare, choose “Only allow wildcards” and set the CA domain to `letsencrypt.org` and `pki.goog`.
- Do not paste the string “0 issuewild letsencrypt.org” into the CA field. Cloudflare builds the wire format from your Flag/Tag/Value selections.

---

## 3) Add the CAA records in Cloudflare (exact UI steps)

For Let’s Encrypt:

- Type: CAA
- Name: www
- Flags: 0
- Tag: Only allow wildcards (which produces `issuewild`)
- CA domain: letsencrypt.org

For Google PKI:

- Type: CAA
- Name: www
- Flags: 0
- Tag: Only allow wildcards
- CA domain: pki.goog

Optional (harmless and sometimes helpful): also add non-wildcard `issue` entries at `www`:

- `issue` letsencrypt.org
- `issue` pki.goog

---

## 4) Proxy settings (critical)

- The SendGrid verification CNAMEs **must be DNS-only** (grey cloud). If proxied (orange), Beehiiv/SendGrid will not see `sendgrid.net` and verification fails.
- CAA records have no proxy toggle (they’re pure DNS).
- You may continue to proxy unrelated hosts (e.g., your apex or other subdomains). Just keep Beehiiv-supplied CNAMEs unproxied.

---

## 5) Verify with dig (propagation & correctness)

Check CAA on the host you’re certifying (`www`):
    dig CAA <www.uncommonengineer.com> +short

Expected lines after propagation:
    0 issuewild "letsencrypt.org"
    0 issuewild "pki.goog"

Check the SendGrid CNAMEs:
    dig CNAME elinkb04.www.uncommonengineer.com +short
    dig CNAME 55963338.www.uncommonengineer.com +short

Expected:
    sendgrid.net.
    sendgrid.net.

Check from multiple resolvers if needed:
    dig @1.1.1.1 CAA <www.uncommonengineer.com> +short
    dig @8.8.8.8 CAA <www.uncommonengineer.com> +short

Also check the apex, which can override if it has CAA:
    dig CAA uncommonengineer.com +short

If your apex returns restrictive CAA (e.g., only digicert.com), either remove that restriction or add matching `issue`/`issuewild` for `letsencrypt.org` and `pki.goog` at the apex as well (CAs walk up the tree: closest CAA set wins).

---

## 6) Troubleshooting checklist

- CNAMEs are grey-clouded (DNS-only), not proxied.
- CAA Tag is correct (“Only allow wildcards” → `issuewild`).
- CA domains are exactly `letsencrypt.org` and `pki.goog` (no prefixed “0 issuewild” text in the field).
- No conflicting CAA at the apex blocking issuance. If apex has CAA, mirror the authorizations there.
- Wait for DNS propagation (often minutes, can be longer). Re-run dig until expected values appear.
- Clear any cached/failed verification attempts in Beehiiv and retry the domain connection.

---

## 7) One-shot validation script (optional)

Run this from a Linux terminal; replace names if your IDs differ.

    #!/usr/bin/env bash
    set -euo pipefail

    DOMAIN="uncommonengineer.com"
    HOST="www.${DOMAIN}"

    echo "== CAA on ${HOST} =="
    dig CAA "${HOST}" +short

    echo
    echo "== CAA on apex ${DOMAIN} =="
    dig CAA "${DOMAIN}" +short

    echo
    echo "== SendGrid CNAMEs =="
    for SUB in "elinkb04.www" "55963338.www"; do
      FQDN="${SUB}.${DOMAIN}"
      printf "%s -> " "${FQDN}"
      dig CNAME "${FQDN}" +short
    done

    echo
    echo "== Cross-check via public resolvers (1.1.1.1, 8.8.8.8) =="
    for R in 1.1.1.1 8.8.8.8; do
      echo "@${R} CAA ${HOST}"
      dig @"${R}" CAA "${HOST}" +short
    done

---

## 8) Summary

- Add Beehiiv/SendGrid CNAMEs at the exact names provided and keep them **DNS-only**.
- Add `CAA` at `www` with `issuewild` for `letsencrypt.org` and `pki.goog`.
- Ensure the apex doesn’t contradict your `www` CAA policy.
- Validate with `dig`; then retry Beehiiv verification.

Once verified, you can focus on writing — the DNS will stay out of your way.

```

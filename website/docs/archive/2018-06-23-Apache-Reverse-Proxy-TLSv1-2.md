---
title: "Apache Reverse TLSv1.2 Proxy"
---

:::info

Published Date: 23-JUN-2018

:::

Usually a reverse proxy will have an external facing endpoint which then gets proxied inbound to an obfuscated/redirect internal address. The scenario detailed here is the opposite where an internal client is making an outbound request via a reverse proxy that adds some magic, and maps things out heading outwards.

When dealing with legacy systems a lot of the time an application (e.g. a java app) is running on out of date libraries (Java6) on an out of date box (physical server) and you're in a position where you can't upgrade java because either the application might not run on a newer version of the software, or the new software needs a newer version of the underlying OS.

When this happens, you have to start re-designing the solution to meet the goal. If a service at an external endpoint that your application consumes is no longer supporting TLSv1 and your application _only_ "talks" v1.. you've got a problem. So your goal is: get my application to talk v1.2.

I recently had to solve this problem, and a quick-fire way was to use a Reverse Proxy which was capable of talking v1.2 and making the application send its request to the Reverse Proxy using v1, and then the Proxy would then 'bump' the TLS version to 1.2 to talk with the external endpoint. No harm no foul.

The steps for my specific situation were RHEL6 based and using Apache, but this is easily done with NGINX as well, so tweak you commands accordingly.

## Architecture

![reverse proxy architecture](/img/apache-reverse-proxy-architecture.png)

Things to note about this scenario:

* the application server can't talk TLSv1.2
* we have no access/jurisdiction over the corporate proxy
* the reverse proxy has to proxy through the corporate proxy to reach the external endpoint.

## Install Apache

these steps will be based on installing apache on Oracle Linux 6 application server, deep in network with no internet access.

ssh into the application server and make sure your repos are setup and up to date

```bash
cd /etc/yum.repos.d/
wget -e use_proxy=yes -e http_proxy=http://corporateproxy:8080 http://yum.oracle.com/public-yum-ol6.repo
```

edit your publi-yum-ol6.repo file

```bash
vim /etc/yum.repos.d/public-yum-ol6.repo
```

delete the entries you don't want, set `enable=1` on the ones you do, and add the corporate proxy setting so it can pull things down from the internet.

```ini
  [ol6_latest]
  name=Oracle Linux $releasever Latest ($basearch)
  baseurl=https://yum.oracle.com/repo/OracleLinux/OL6/latest/$basearch/
  gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-oracle
  gpgcheck=1
  enabled=1
  proxy=http://corporateproxy:8080/

  [ol6_addons]
  name=Oracle Linux $releasever Add ons ($basearch)
  baseurl=https://yum.oracle.com/repo/OracleLinux/OL6/addons/$basearch/
  gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-oracle
  gpgcheck=1
  enabled=1
  proxy=http://corporateproxy:8080/
```

update repo, install httpd (apache) and mod_ssl

```bash
yum --verbose --noplugins repolist
yum install -y httpd
yum install -y mod_ssl
```

_note: I had to comment out the following modules in /etc/httpd/conf/httpd.conf for apache to start up._

```bash
/etc/httpd/modules/mod_file_cache.so
/etc/httpd/modules/mod_mem_cache.so
```

start up apache : `service httpd start`

## Configure Reverse Proxy

Edit your /etc/httpd/conf/httpd.conf file (or you can create a sub-config under /etc/httpd/conf.d/tlsproxy.conf if you want to separate it out).

Description in the comments.

```bash
# have our reverse proxy listen on a different port
Listen 7090

# access scope for URLs matching '/externalget' (no trailing slash)
<Location /externalget />
Order deny,allow
Deny from all
Allow from all
</Location>

# turn ssl and proxy ON
SSLProxyEngine On
ProxyRequests On
ProxyVia On

# http requests to this virtual server on 7090 with the URI '/externalget/api.aspx'
# will get proxied to external endpoint 'https://externalresource.com/externalget/api.aspx'

ProxyPass /externalget/api.aspx https://externalresource.com/externalget/api.aspx
ProxyPassReverse /externalget/api.aspx https://externalresource.com/externalget/api.aspx

# BUT... if the proxied URL matches 'https://externalresource.com' you will be getting proxied
# via the 'http://corporateproxy:8080' to get to your destination.

ProxyRemote https://externalresource.com http://corporateproxy:8080
```

### ProxyPass & ProxyPassReverse

Quick note: you need this pair to do the following, proxypass finds the URI match (i.e. /externalget/api.aspx) and maps it to the external server endpoint. Whereas proxypassreverse takes care of any redirects that might have headers that look like http://reverseproxy:7090/externalget/api.aspx and correctly rewrite this to https://externalresource.com/externalget/api.aspx before sending it back through to the client.

### ProxyRemote

I initially had problems because I had `ProxyRemote * http://corporateproxy:8080` instead of a match for the URL I wanted to specifically proxy through and kept seeing the reverseproxy URL trying to be proxied through the corporate proxy. Changing to the specific external URL sorted that loop out.

## Test, Debug

enable debugging by setting `LogLevel debug` in your httpd.conf file.

test with curl e.g. `curl -v -k http://reverseproxy:8080/externalget/api.aspx` and on the server where the apache reverse proxy is running your /var/log/httpd/error_log should have logs that look like this:

first it goes through mapping/linking the client to the reverseproxy, reverseproxy to the corporateproxy, and the corporateproxy to the external endpoint

```bash
[Wed Jun 13 23:02:31 2018] [debug] proxy_util.c(2158): proxy: connecting https://externalresource.com/pxpay/pxaccess.aspx to externalresource.com:443
[Wed Jun 13 23:02:31 2018] [debug] proxy_util.c(2289): proxy: connected /pxpay/pxaccess.aspx to corporateproxy:8080
[Wed Jun 13 23:02:31 2018] [debug] proxy_util.c(2476): proxy: HTTPS: backend socket is disconnected.
[Wed Jun 13 23:02:31 2018] [debug] proxy_util.c(2540): proxy: HTTPS: fam 2 socket created to connect to externalresource.com
[Wed Jun 13 23:02:31 2018] [debug] proxy_util.c(2381): proxy: CONNECT: sending the CONNECT request for externalresource.com:443 to the remote proxy corporateproxy-ip:8080 (corporateproxy)
[Wed Jun 13 23:02:31 2018] [debug] proxy_util.c(2436): send_http_connect: response from the forward proxy: HTTP/1.1 200 Connection established\r\n\r\n
[Wed Jun 13 23:02:31 2018] [debug] proxy_util.c(2672): proxy: HTTPS: connection complete to corporateproxy-ip:8080 (corporateproxy)
[Wed Jun 13 23:02:31 2018] [info] [client corporateproxy-ip] Connection to child 0 established (server reverseproxy-server:80)
[Wed Jun 13 23:02:31 2018] [info] Seeding PRNG with 144 bytes of entropy
[Wed Jun 13 23:02:31 2018] [debug] ssl_engine_kernel.c(1876): OpenSSL: Handshake: start
[Wed Jun 13 23:02:31 2018] [debug] ssl_engine_kernel.c(1884): OpenSSL: Loop: before/connect initialization
[Wed Jun 13 23:02:31 2018] [debug] ssl_engine_kernel.c(1884): OpenSSL: Loop: SSLv2/v3 write client hello A
[Wed Jun 13 23:02:31 2018] [debug] ssl_engine_io.c(1930): OpenSSL: read 7/7 bytes from BIO#7fbf29ba5b50 [mem: 7fbf29bc2220] (BIO dump follows)
```

our reverse proxy starts negotiating with the external endpoint. starts with SSLv3

```bash
[Wed Jun 13 23:02:31 2018] [debug] ssl_engine_kernel.c(1884): OpenSSL: Loop: SSLv3 read server done A
[Wed Jun 13 23:02:31 2018] [debug] ssl_engine_kernel.c(1884): OpenSSL: Loop: SSLv3 write client key exchange A
[Wed Jun 13 23:02:31 2018] [debug] ssl_engine_kernel.c(1884): OpenSSL: Loop: SSLv3 write change cipher spec A
[Wed Jun 13 23:02:31 2018] [debug] ssl_engine_kernel.c(1884): OpenSSL: Loop: SSLv3 write finished A
[Wed Jun 13 23:02:31 2018] [debug] ssl_engine_kernel.c(1884): OpenSSL: Loop: SSLv3 flush data
```

loops through SSLv3, then when it finds TLS1.2 we get a client connect:

```bash
[Wed Jun 13 23:02:31 2018] [debug] ssl_engine_kernel.c(1884): OpenSSL: Loop: SSLv3 read finished A
[Wed Jun 13 23:02:31 2018] [debug] ssl_engine_kernel.c(1880): OpenSSL: Handshake: done
[Wed Jun 13 23:02:31 2018] [info] Connection: Client IP: corporateproxy-ip, Protocol: TLSv1.2, Cipher: ECDHE-RSA-AES256-GCM-SHA384 (256/256 bits)
[Wed Jun 13 23:02:31 2018] [debug] ssl_engine_io.c(1930): OpenSSL: read 5/5 bytes from BIO#7fbf29ba5b50 [mem: 7fbf29bc2223] (BIO dump follows)
```

then sends the payload body:

```bash
[Wed Jun 13 23:02:31 2018] [debug] mod_proxy_http.c(1775): proxy: start body send
[Wed Jun 13 23:02:31 2018] [debug] mod_proxy_http.c(1885): proxy: end body send
[Wed Jun 13 23:02:31 2018] [debug] proxy_util.c(2120): proxy: HTTPS: has released connection for (externalresource.com)
```

## References

* [Apache Location Directive](http://httpd.apache.org/docs/2.2/mod/core.html#location)
* [Apache ProxyPass Directive](http://httpd.apache.org/docs/2.4/mod/mod_proxy.html#proxypass)
* [Apache ProxyPassReverse Directive](http://httpd.apache.org/docs/2.4/mod/mod_proxy.html#proxypassreverse)
* [Apache Location Directive](http://httpd.apache.org/docs/2.2/mod/core.html#location)

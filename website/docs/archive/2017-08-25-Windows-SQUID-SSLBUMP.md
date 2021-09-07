---
title: Setting up HTTPS inspection (mitm) with Windows Squid
---

I needed a way to inspect HTTPS traffic on my home network. Some dodgy browsing going on and i wanted to see it all, HTTPS included. Solution? Setup a squid proxy with ssl-bump configured to handle HTTPS.

I'm a linux guy so my windows admin is meh, setting up a traditionally unix-based service on my windows server 2012 was a bit of a mission. But here are my notes from getting it (as far as i can tell) working.

:::caution

You can follow all these steps on the [wiki](https://wiki.squid-cache.org/ConfigExamples/Intercept/SslBumpExplicit) but just as i wished someone had written some of the documentation a little bit clearer, so i leave this here.

:::

## Requirements

* Windows Server 2012
* [Squid 3.5.26 for Microsoft Windows](http://packages.diladele.com/squid/3.5.26/squid.msi)
* [Cygwin x86_64](https://cygwin.com/setup-x86_64.exe)

## Installation

run the MS Squid MSI install GUI:

![squid gui install](/img/archive/windows-squid-gui-install.png)

when you're done you should have a little menu in the task bar, and when you run `services.msc` you should see a 'Squid for Windows' service in 'running' status.

run the Cygwin `setup-x86_64.exe` you downloaded:

![squid gui install](/img/archive/windows-squid-cygwingui.png)

when this is done you should have a new desktop shortcut to crack open a cygwin terminal when you need one. also a 'squid' terminal, which is just a 'cmd' session in the squid home directory:

![squid gui install](/img/archive/windows-squid-shortcuts.png)

## Create your Proxy ROOT CA certificate

I use the desktop cygwin shortcut to open a cygwin terminal to run some `openssl` commands to create your proxy servers ROOT Certificate Authority (CA) certificate.

I opened a cygwin terminal, changed into the squid installation directory `/cygdrive/c/Squid-3.5/etc/ssl` and ran my openssl command there:

```bash
cd /cygdrive/c/Squid-3.5/etc/ssl
openssl req -new -newkey rsa:2048 -sha256 -days 365 -nodes -x509 -extensions v3_ca -keyout caproxy.pem -out caproxy.pem
```

generate a certificate in a format (DER) you can import into client browsers/computers (via certificate import wizard)

```bash
openssl x509 -in caproxy.pem -outform DER -out caproxy.der
```

I imported this .der certificate into the 'Trusted Root Certification Authorities' folder on a client PC on my network.

## Configure squid.conf on server

I modified the following section from [wiki.squid-cache.org](https://wiki.squid-cache.org/ConfigExamples/Intercept/SslBumpExplicit)
to match my installation.

```bash
http_port 3128 ssl-bump \
  cert=/etc/ssl/caproxy.pem \
  generate-host-certificates=on dynamic_cert_mem_cache_size=4MB

# For squid 3.5.x
sslcrtd_program /lib/squid/ssl_crtd -s /var/lib/ssl_db -M 4MB

acl step1 at_step SslBump1

ssl_bump peek step1
ssl_bump bump all
```

## Errors when restarting Squid

When restarting for first time with the ssl settings enabled in your squid.conf you're going to run into a few errors.
in `/var/log/cache.log` you'll see this:
`(ssl_crtd): Uninitialized SSL certificate database directory: /var/lib/ssl_db. To initialize, run "ssl_crtd -c -s /var/lib/ssl_db".`

and squid will finally crash out with this (you'll see this error in EventViewer as well):
`FATAL: The ssl_crtd helpers are crashing too rapidly, need help!`

## The Fix

As you can see from the error message, we need to initialize our ssl cer db directory with `run "ssl_crtd -c -s /var/lib/ssl_db".`

now, open a 'Squid Terminal' from your desktop shortcut in Windows Server 2012 and navigate to where the 'ssl_crtd.exe' program is (e.g. for me, C:\Squid-3.5\lib\squid\)

and run:

```dos
C:\Squid-3.5\lib\squid\ssl_crtd.exe -c -s C:\Squid-3.5\var\lib\ssl_db
```

**key thing to note here:**

* the dir 'ssl_db' must *NOT ALREADY EXIST.* (or else you're going to have a very bad time)

Don't be a dumbass like me and follow the error message `ssl_crtd: Cannot create blah blah` into a vortex of online forums about it that point to "squid with cygwin is broken and therefore can never do ssl bumping for https traffic".

## Success! (finally)

![squid crtd success](/img/archive/windows-squid-ssl_crtd.png)

## Restart Squid service (again)

If your install and configuration was successful, check logfile `/var/log/cache.log`, and it should look like this:

```log
Squid Cache (Version 3.5.26): Terminated abnormally.
CPU Usage: 0.203 seconds = 0.125 user + 0.078 sys
Maximum Resident Size: 1304576 KB
Page faults with physical i/o: 5202
2017/08/25 20:58:42 kid1| Set Current Directory to /var/cache/squid
2017/08/25 20:58:42 kid1| Starting Squid Cache version 3.5.26 for x86_64-unknown-cygwin...
2017/08/25 20:58:42 kid1| Service Name: squid
2017/08/25 20:58:42 kid1| Process ID 2944
2017/08/25 20:58:42 kid1| Process Roles: worker
2017/08/25 20:58:42 kid1| With 3200 file descriptors available
2017/08/25 20:58:42 kid1| Initializing IP Cache...
2017/08/25 20:58:42 kid1| parseEtcHosts: /etc/hosts: (2) No such file or directory
2017/08/25 20:58:42 kid1| DNS Socket created at [::], FD 5
2017/08/25 20:58:42 kid1| DNS Socket created at 0.0.0.0, FD 6
2017/08/25 20:58:42 kid1| Adding nameserver 8.8.8.8 from squid.conf
2017/08/25 20:58:42 kid1| Adding nameserver 208.67.222.222 from squid.conf
2017/08/25 20:58:42 kid1| helperOpenServers: Starting 5/32 'ssl_crtd' processes
2017/08/25 20:58:42 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
2017/08/25 20:58:42 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
2017/08/25 20:58:42 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
2017/08/25 20:58:43 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
2017/08/25 20:58:43 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
2017/08/25 20:58:43 kid1| Logfile: opening log daemon:/var/log/squid/access.log
2017/08/25 20:58:43 kid1| Logfile Daemon: opening log /var/log/squid/access.log
2017/08/25 20:58:43 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
2017/08/25 20:58:43 kid1| Store logging disabled
2017/08/25 20:58:43 kid1| Swap maxSize 0 + 262144 KB, estimated 20164 objects
2017/08/25 20:58:43 kid1| Target number of buckets: 1008
2017/08/25 20:58:43 kid1| Using 8192 Store buckets
2017/08/25 20:58:43 kid1| Max Mem  size: 262144 KB
2017/08/25 20:58:43 kid1| Max Swap size: 0 KB
2017/08/25 20:58:43 kid1| Using Least Load store dir selection
2017/08/25 20:58:43 kid1| Set Current Directory to /var/cache/squid
2017/08/25 20:58:43 kid1| Finished loading MIME types and icons.
2017/08/25 20:58:43 kid1| HTCP Disabled.
2017/08/25 20:58:43 kid1| Squid plugin modules loaded: 0
2017/08/25 20:58:43 kid1| Adaptation support is off.
2017/08/25 20:58:43 kid1| Accepting SSL bumped HTTP Socket connections at local=[::]:3128 remote=[::] FD 21 flags=9
2017/08/25 20:58:44 kid1| storeLateRelease: released 0 objects
2017/08/25 20:59:25 kid1| Set Current Directory to /var/cache/squid
2017/08/25 20:59:25 kid1| Starting Squid Cache version 3.5.26 for x86_64-unknown-cygwin...
2017/08/25 20:59:25 kid1| Service Name: squid
2017/08/25 20:59:25 kid1| Process ID 144
2017/08/25 20:59:25 kid1| Process Roles: worker
2017/08/25 20:59:25 kid1| With 3200 file descriptors available
2017/08/25 20:59:25 kid1| Initializing IP Cache...
2017/08/25 20:59:25 kid1| parseEtcHosts: /etc/hosts: (2) No such file or directory
2017/08/25 20:59:25 kid1| DNS Socket created at [::], FD 5
2017/08/25 20:59:25 kid1| DNS Socket created at 0.0.0.0, FD 6
2017/08/25 20:59:25 kid1| Adding nameserver 8.8.8.8 from squid.conf
2017/08/25 20:59:25 kid1| Adding nameserver 208.67.222.222 from squid.conf
2017/08/25 20:59:25 kid1| helperOpenServers: Starting 5/32 'ssl_crtd' processes
2017/08/25 20:59:25 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
2017/08/25 20:59:25 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
2017/08/25 20:59:25 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
2017/08/25 20:59:25 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
2017/08/25 20:59:25 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
2017/08/25 20:59:25 kid1| Logfile: opening log daemon:/var/log/squid/access.log
2017/08/25 20:59:25 kid1| Logfile Daemon: opening log /var/log/squid/access.log
2017/08/25 20:59:25 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
2017/08/25 20:59:25 kid1| Store logging disabled
2017/08/25 20:59:25 kid1| Swap maxSize 0 + 262144 KB, estimated 20164 objects
2017/08/25 20:59:25 kid1| Target number of buckets: 1008
2017/08/25 20:59:25 kid1| Using 8192 Store buckets
2017/08/25 20:59:25 kid1| Max Mem  size: 262144 KB
2017/08/25 20:59:25 kid1| Max Swap size: 0 KB
2017/08/25 20:59:25 kid1| Using Least Load store dir selection
2017/08/25 20:59:25 kid1| Set Current Directory to /var/cache/squid
2017/08/25 20:59:25 kid1| Finished loading MIME types and icons.
2017/08/25 20:59:25 kid1| HTCP Disabled.
2017/08/25 20:59:25 kid1| Squid plugin modules loaded: 0
2017/08/25 20:59:25 kid1| Adaptation support is off.
2017/08/25 20:59:25 kid1| Accepting SSL bumped HTTP Socket connections at local=[::]:3128 remote=[::] FD 21 flags=9
2017/08/25 20:59:26 kid1| storeLateRelease: released 0 objects
2017/08/25 21:01:41 kid1| Starting new ssl_crtd helpers...
2017/08/25 21:01:41 kid1| helperOpenServers: Starting 1/32 'ssl_crtd' processes
2017/08/25 21:01:41 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
2017/08/25 21:30:14 kid1| Error negotiating SSL on FD 11: error:14090086:SSL routines:ssl3_get_server_certificate:certificate verify failed (1/-1/0)
2017/08/25 21:30:15 kid1| Error negotiating SSL on FD 11: error:14090086:SSL routines:ssl3_get_server_certificate:certificate verify failed (1/-1/0)
```

now, this config could probably do with some more work and testing, but this is the bare bones of it and i wanted to get it down before i didn't care about it anymore lol.

## Set client computers to use proxy

on client side computer:

1. open 'internet options'
2. go to 'communications' tab
3. click 'LAN settings'
4. check 'Use a proxy server'
5. Address: `IP of your proxy server`
6. Port: 3128

Get browsing and everything should connect/display for the client, no cert errors/issues, fully transparent.

## Troubleshooting

## Reference

### full `squid.conf` file

```bash
#
# Recommended minimum configuration:
#

# Example rule allowing access from your local networks.
# Adapt to list your (internal) IP networks from where browsing
# should be allowed

acl localnet src 10.0.0.0/8	# RFC1918 possible internal network
acl localnet src 172.16.0.0/12	# RFC1918 possible internal network
acl localnet src 192.168.0.0/16	# RFC1918 possible internal network
acl localnet src fc00::/7       # RFC 4193 local private network range
acl localnet src fe80::/10      # RFC 4291 link-local (directly plugged) machines

acl SSL_ports port 443
acl Safe_ports port 80		# http
acl Safe_ports port 21		# ftp
acl Safe_ports port 443		# https
acl Safe_ports port 70		# gopher
acl Safe_ports port 210		# wais
acl Safe_ports port 1025-65535	# unregistered ports
acl Safe_ports port 280		# http-mgmt
acl Safe_ports port 488		# gss-http
acl Safe_ports port 591		# filemaker
acl Safe_ports port 777		# multiling http
acl CONNECT method CONNECT

#
# Recommended minimum Access Permission configuration:
#

# Only allow cachemgr access from localhost
http_access allow localhost manager
http_access deny manager

# Deny requests to certain unsafe ports
http_access deny !Safe_ports

# Deny CONNECT to other than secure SSL ports
http_access deny CONNECT !SSL_ports

# We strongly recommend the following be uncommented to protect innocent
# web applications running on the proxy server who think the only
# one who can access services on "localhost" is a local user
#http_access deny to_localhost

#
# INSERT YOUR OWN RULE(S) HERE TO ALLOW ACCESS FROM YOUR CLIENTS
#

# Example rule allowing access from your local networks.
# Adapt localnet in the ACL section to list your (internal) IP networks
# from where browsing should be allowed
http_access allow localnet
http_access allow localhost

# And finally deny all other access to this proxy
#http_access deny all

# Squid normally listens to port 3128
#http_port 3128

http_port 3128 ssl-bump \
  cert=/etc/ssl/caproxy.pem \
  generate-host-certificates=on dynamic_cert_mem_cache_size=4MB

# For squid 3.5.x
sslcrtd_program /lib/squid/ssl_crtd -s /var/lib/ssl_db -M 4MB

acl step1 at_step SslBump1

ssl_bump peek step1
ssl_bump bump all

# Uncomment the line below to enable disk caching - path format is /cygdrive/<full path to cache folder>, i.e.
#cache_dir aufs /cygdrive/d/squid/cache 3000 16 256


# Leave coredumps in the first cache dir
coredump_dir /var/cache/squid

# Add any of your own refresh_pattern entries above these.
refresh_pattern ^ftp:		1440	20%	10080
refresh_pattern ^gopher:	1440	0%	1440
refresh_pattern -i (/cgi-bin/|\?) 0	0%	0
refresh_pattern .		0	20%	4320

dns_nameservers 8.8.8.8 208.67.222.222

max_filedescriptors 3200
```

### full error output in `/var/log/squid/cache.log`

```log
2017/08/25 20:58:33 kid1| helperOpenServers: Starting 5/32 'ssl_crtd' processes
2017/08/25 20:58:33 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
(ssl_crtd): Uninitialized SSL certificate database directory: /var/lib/ssl_db. To initialize, run "ssl_crtd -c -s /var/lib/ssl_db".
2017/08/25 20:58:33 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
(ssl_crtd): Uninitialized SSL certificate database directory: /var/lib/ssl_db. To initialize, run "ssl_crtd -c -s /var/lib/ssl_db".
2017/08/25 20:58:33 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
(ssl_crtd): Uninitialized SSL certificate database directory: /var/lib/ssl_db. To initialize, run "ssl_crtd -c -s /var/lib/ssl_db".
2017/08/25 20:58:33 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
(ssl_crtd): Uninitialized SSL certificate database directory: /var/lib/ssl_db. To initialize, run "ssl_crtd -c -s /var/lib/ssl_db".
2017/08/25 20:58:33 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
2017/08/25 20:58:33 kid1| Logfile: opening log daemon:/var/log/squid/access.log
2017/08/25 20:58:33 kid1| Logfile Daemon: opening log /var/log/squid/access.log
(ssl_crtd): Uninitialized SSL certificate database directory: /var/lib/ssl_db. To initialize, run "ssl_crtd -c -s /var/lib/ssl_db".
2017/08/25 20:58:33 kid1| WARNING: no_suid: setuid(0): (22) Invalid argument
2017/08/25 20:58:33 kid1| Store logging disabled
2017/08/25 20:58:33 kid1| Swap maxSize 0 + 262144 KB, estimated 20164 objects
2017/08/25 20:58:33 kid1| Target number of buckets: 1008
2017/08/25 20:58:33 kid1| Using 8192 Store buckets
2017/08/25 20:58:33 kid1| Max Mem  size: 262144 KB
2017/08/25 20:58:33 kid1| Max Swap size: 0 KB
2017/08/25 20:58:33 kid1| Using Least Load store dir selection
2017/08/25 20:58:33 kid1| Set Current Directory to /var/cache/squid
2017/08/25 20:58:33 kid1| Finished loading MIME types and icons.
2017/08/25 20:58:33 kid1| HTCP Disabled.
2017/08/25 20:58:33 kid1| Squid plugin modules loaded: 0
2017/08/25 20:58:33 kid1| Adaptation support is off.
2017/08/25 20:58:33 kid1| Accepting SSL bumped HTTP Socket connections at local=[::]:3128 remote=[::] FD 21 flags=9
2017/08/25 20:58:33 kid1| WARNING: ssl_crtd #Hlpr1 exited
2017/08/25 20:58:33 kid1| Too few ssl_crtd processes are running (need 1/32)
2017/08/25 20:58:33 kid1| Closing HTTP port [::]:3128
2017/08/25 20:58:33 kid1| storeDirWriteCleanLogs: Starting...
2017/08/25 20:58:33 kid1|   Finished.  Wrote 0 entries.
2017/08/25 20:58:33 kid1|   Took 0.00 seconds (  0.00 entries/sec).
FATAL: The ssl_crtd helpers are crashing too rapidly, need help!
```

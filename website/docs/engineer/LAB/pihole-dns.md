---
title: "PiHole DNS"
---

## Installation

installed on proxmox with Ubuntu 22.04.3

following [docs](https://docs.pi-hole.net/main/basic-install/)

`curl -sSL https://install.pi-hole.net | bash`

## Unbound

Upstream DNS provider = for max privacy we will be setting up a recursive DNS solution using [unbound](https://docs.pi-hole.net/guides/dns/unbound/)

`apt install -y unbound`

it's going to be broken until you do the following:

- get the `root.hints` file `wget https://www.internic.net/domain/named.root -qO- | sudo tee /var/lib/unbound/root.hints`
- create this file `/etc/unbound/unbound.conf.d/pi-hole.conf` and put this in it:

### Test Validation

restart and test:

```bash
sudo service unbound restart
dig pi-hole.net @127.0.0.1 -p 5335
```

![restart and dig](/img/pihole-restart-test.png)

```bash
dig fail01.dnssec.works @127.0.0.1 -p 5335
dig dnssec.works @127.0.0.1 -p 5335
```

expect: `SERVFAIL` and no IP first command, `NOERROR` and an IP second command.

![test dnssec](/img/pihole-testdnssec.png)

### Configure PiHole Web

Disable the other upstream DNS servers and set your custom to the unbound service you just set up:

![pihole dns](/img/pihole-config-web.png)

restart unbound: `sudo service unbound restart`

### Logging

Setup specific unbound log dir and file:

```bash
sudo mkdir -p /var/log/unbound
sudo touch /var/log/unbound/unbound.log
sudo chown unbound /var/log/unbound/unbound.log
```

Add this log destination to config `/etc/unbound/unbound.conf.d/pi-hole.conf`

```bash
server:
    # If no logfile is specified, syslog is used
    logfile: "/var/log/unbound/unbound.log"
    log-time-ascii: yes
    verbosity: 1
```

:::tip Logging Levels

Level 0 means no verbosity, only errors
Level 1 gives operational information
Level 2 gives  detailed operational  information
Level 3 gives query level information
Level 4 gives  algorithm  level  information
Level 5 logs client identification for cache misses

:::

## Config Files

```bash
server:
    # If no logfile is specified, syslog is used
    # logfile: "/var/log/unbound/unbound.log"
    verbosity: 0

    interface: 127.0.0.1
    port: 5335
    do-ip4: yes
    do-udp: yes
    do-tcp: yes

    # May be set to yes if you have IPv6 connectivity
    do-ip6: no

    # You want to leave this to no unless you have *native* IPv6. With 6to4 and
    # Terredo tunnels your web browser should favor IPv4 for the same reasons
    prefer-ip6: no

    # Use this only when you downloaded the list of primary root servers!
    # If you use the default dns-root-data package, unbound will find it automatically
    #root-hints: "/var/lib/unbound/root.hints"

    # Trust glue only if it is within the server's authority
    harden-glue: yes

    # Require DNSSEC data for trust-anchored zones, if such data is absent, the zone becomes BOGUS
    harden-dnssec-stripped: yes

    # Don't use Capitalization randomization as it known to cause DNSSEC issues sometimes
    # see https://discourse.pi-hole.net/t/unbound-stubby-or-dnscrypt-proxy/9378 for further details
    use-caps-for-id: no

    # Reduce EDNS reassembly buffer size.
    # IP fragmentation is unreliable on the Internet today, and can cause
    # transmission failures when large DNS messages are sent via UDP. Even
    # when fragmentation does work, it may not be secure; it is theoretically
    # possible to spoof parts of a fragmented DNS message, without easy
    # detection at the receiving end. Recently, there was an excellent study
    # >>> Defragmenting DNS - Determining the optimal maximum UDP response size for DNS <<<
    # by Axel Koolhaas, and Tjeerd Slokker (https://indico.dns-oarc.net/event/36/contributions/776/)
    # in collaboration with NLnet Labs explored DNS using real world data from the
    # the RIPE Atlas probes and the researchers suggested different values for
    # IPv4 and IPv6 and in different scenarios. They advise that servers should
    # be configured to limit DNS messages sent over UDP to a size that will not
    # trigger fragmentation on typical network links. DNS servers can switch
    # from UDP to TCP when a DNS response is too big to fit in this limited
    # buffer size. This value has also been suggested in DNS Flag Day 2020.
    edns-buffer-size: 1232

    # Perform prefetching of close to expired message cache entries
    # This only applies to domains that have been frequently queried
    prefetch: yes

    # One thread should be sufficient, can be increased on beefy machines. In reality for most users running on small networks or on a single machine, it should be unnecessary to seek performance enhancement by increasing num-threads above 1.
    num-threads: 1

    # Ensure kernel buffer is large enough to not lose messages in traffic spikes
    so-rcvbuf: 1m

    # Ensure privacy of local IP ranges
    private-address: 192.168.0.0/16
    private-address: 169.254.0.0/16
    private-address: 172.16.0.0/12
    private-address: 10.0.0.0/8
    private-address: fd00::/8
    private-address: fe80::/10
```

restart unbound `sudo systemctl restart unbound`

check it's working

```bash
root@dns:~# dig pi-hole.net @127.0.0.1 -p 5335

; <<>> DiG 9.18.12-0ubuntu0.22.04.3-Ubuntu <<>> pi-hole.net @127.0.0.1 -p 5335
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 33858
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;pi-hole.net.			IN	A

;; ANSWER SECTION:
pi-hole.net.		300	IN	A	3.18.136.52

;; Query time: 543 msec
;; SERVER: 127.0.0.1#5335(127.0.0.1) (UDP)
;; WHEN: Sat Oct 14 09:49:40 UTC 2023
;; MSG SIZE  rcvd: 56
```

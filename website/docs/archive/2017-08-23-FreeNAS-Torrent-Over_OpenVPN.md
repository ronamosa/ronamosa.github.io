---
title: "FreeNAS: Using Transmission over OpenVPN (jailed)"
---

>
FreeNAS sucks. but that's just my opinion. I set up FreeNAS to be a fileserver for all things on my local network so thought to utilize it as best I can for what's its capable of.

## Overview

I want to have transmission on my FreeNAS server to work over OpenVPN. Transmission is installed via plugin which puts in into one of these FreeBSD jails.

trying to start openvpn up:

`/usr/local/etc/rc.d/openvpn start`

## Errors

```log
ug  6 23:19:50 transmission_1 openvpn[94497]: /sbin/route add -net 10.14.0.0 10.14.0.1 255.255.0.0
Aug  6 23:19:50 transmission_1 openvpn[94497]: /sbin/ifconfig tun0 inet6 fdda:d0d0:cafe:1300::100e/64
Aug  6 23:19:50 transmission_1 openvpn[94497]: /etc/openvpn/update-resolv-conf tun0 1500 1553 10.14.0.16 255.255.0.0 init
Aug  6 23:19:50 transmission_1 openvpn[94497]: WARNING: Failed running command (--up/--down): external program exited with error status: 2
Aug  6 23:19:50 transmission_1 openvpn[94497]: Exiting due to fatal error
```

things checked:

1. all configs were in the right place /etc/rc.conf has `openvpn_configfile="/usr/local/etc/openvpn/mullvad/mullvad_linux.conf"`
2. permissions on cert files: ca.crt, vpn.key etc
3. permissions on scripts: /etc/openvpn/update-resolv-conf

checked all these, and no cigar.

now, I figured I need to manually execute the VPN setup to figure out *exactly* where this was all going wrong:

`openvpn --config /usr/local/etc/openvpn/mullvad/mullvad_linux.conf`

and now I can see this:

```log
Sun Aug  6 23:56:51 2017 /etc/openvpn/update-resolv-conf tun0 1500 1553 10.14.0.20 255.255.0.0 init
+ [ -x /sbin/resolvconf ]
+ + [ up ]
+ + [ tun0 ]
+ + NMSRVRS=''
+ + SRCHS=''
+ /etc/openvpn/update-resolv-conf: $\{!f...}: Bad substitution
+ Sun Aug  6 23:56:51 2017 WARNING: Failed running command (--up/--down): external program exited with error status: 2
+ Sun Aug  6 23:56:51 2017 Exiting due to fatal error

```

for some reason its not happy with the substitution around this array. Checking the code looked fine, and I couldn't figure out why it was unhappy at this point in the script.

Now some forums kept talking about having the shebang (#!/bin/bash) at the top of the config file (this made little/no difference and pretty sure that's not how the vpn config files work), for some reason I figured "#!/bin/sh" would be just as good = this was WRONG. The way 'sh' handles array substitution is different to 'bash' and so my error was in how my chosen shell was dealing with things. also,

## Solution

find where your bash lives in jail:

```bash
root@freenas:~ # jls
   JID  IP Address      Hostname                      Path
     2                  transmission_1                /mnt/DARKNAS/jails/transmission_1
root@freenas:~ # jexec 2 tcsh
root@transmission_1:/ #	which bash
/usr/local/bin/bash
```

and put it in your `/etc/openvpn/update-resolv-conf` like so:

```bash
#!/usr/local/bin/bash
# set -x
#
# Parses DHCP options from openvpn to update resolv.conf
# To use set as 'up' and 'down' script in your openvpn *.conf:
# up /etc/openvpn/update-resolv-conf
# down /etc/openvpn/update-resolv-conf
```

and your VPN should come up without a problem.

## Local Networks & OpenVPN

local networks on the same subnet will be accessible, but I learned you need to add other subnets to the routing table when openvpn comes up as I wasn't able to web into the transmission web GUI without the following:

:::note

172.16.40.x network is where my FreeNAS/Tranmission box lives

:::

```bash
route add -net 172.16.45.0/24 172.16.40.1
```

## /etc/resolv.conf issue

my /etc/resolv.conf was not being restored after stopping VPN

:::note

this is a hack and possibly not a good long term solution

:::

in /etc/openvpn/update-resolv-conf script, the 'up' part of my openvpn config file (i.e. /usr/local/etc/openvpn/mullvad/mullvad_linux.conf) worked fine, but the 'down' process basically did this on the tun0 interface and walked away:

```bash
/sbin/resolvconf -d "$\{dev}.openvpn"
```

after not being able to find a solution i came across a forum where dude just added copy and mv commands to backup then restore the default resolv.conf file

```bash
# in the up 'case'
cp /etc/resolv.conf /etc/resolv.conf.default

# in the down 'case'
mv -f /etc/resolv.conf.default /etc/resolv.conf
```

## References

:::info

[How to use OpenVPN, IPFW, in FreeNAS Jail](https://forums.freenas.org/index.php?threads/how-to-use-openvpn-ipfw-in-a-jail-so-it-only-connects-to-the-vpn.18669/)

:::

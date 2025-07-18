---
title: Initializing a CISCO ASA 5505
---

I needed a more reliable VPN solution to a remote site I need to work on every now and then. At the time I had setup the remote sites router to push VPN connections through to the Windows 2003 Server (I know, I know) and it would handle the VPN connection. From there I'd RDP to other desktops as needed. Now, when the server would crash and be M.I.A. for whatever reason, I'd be without a VPN connection and would then have to drive to the site to do anything.

Long story short, I came across an ASA 5505 and saw the words VPN associated with it and now I'm setting one up to basically be a VPN point at the remote site, can then hit other desktops from the edge of the network rather than rely on the server to be available for the WHOLE network to be available.

### Reset the device / Reset passwords

I got the device second hand so needed to

* get into it without the password
* reset the device.

Plug your serial console cable in (the ligt blue one) and power up your device.

You need it to interrupt the bootup and drop it into a 'rmmon' shell as per the instructions 'Use BREAK or ESC to interrupt boot.'

```bash
CISCO SYSTEMS
Embedded BIOS Version 1.0(12)11 04/30/08 15:45:41.19

Low Memory: 632 KB
High Memory: 251 MB
PCI Device Table.
Bus Dev Func VendID DevID Class              Irq
 00  01  00   1022   2080  Host Bridge
 00  01  02   1022   2082  Chipset En/Decrypt 11
 00  0C  00   1148   4320  Ethernet           11
 00  0D  00   177D   0003  Network En/Decrypt 10
 00  0F  00   1022   2090  ISA Bridge
 00  0F  02   1022   2092  IDE Controller
 00  0F  03   1022   2093  Audio              10
 00  0F  04   1022   2094  Serial Bus         9
 00  0F  05   1022   2095  Serial Bus         9

Evaluating BIOS Options ...
Launch BIOS Extension to setup ROMMON

Cisco Systems ROMMON Version (1.0(12)11) #4: Thu May  1 14:50:05 PDT 2008

Platform ASA5505

Use BREAK or ESC to interrupt boot.
Use SPACE to begin boot immediately.
Boot interrupted.

Ethernet0/0
MAC Address: 0024.14a1.abe7
Link is DOWN

Use ? for help.
rommon #0>
```

### run 'confreg'

to change configuration register and bypass login/security

```bash
rommon #0> confreg

Current Configuration Register: 0x00000001
Configuration Summary:
  boot default image from Flash

Do you wish to change this configuration? y/n [n]: y
enable boot to ROMMON prompt? y/n [n]:
enable TFTP netboot? y/n [n]:
enable Flash boot? y/n [n]:
select specific Flash image index? y/n [n]:
disable system configuration? y/n [n]: y
go to ROMMON prompt if netboot fails? y/n [n]:
enable passing NVRAM file specs in auto-boot mode? y/n [n]:
disable display of BREAK or ESC key prompt during auto-boot? y/n [n]:

Current Configuration Register: 0x00000040
Configuration Summary:
  boot ROMMON
  ignore system configuration

Update Config Register (0x40) in NVRAM...
```

take note the 'Current Configuration Register' at the start is '0x00000001', after you run through the configuration change, you'll notice its changed to '0x00000040'

### Reload ASA

now reload the ASA with a 'boot' command at the prompt

```bash
rommon #1> boot
Launching BootLoader...
Boot configuration file contains 1 entry.


Loading disk0:/asa803-k8.bin... Booting...
Loading...
```

### Load and edit

the new config and setup new credentials

* run `enable` to get privileged mode (password should be blank, just press enter)
* load the start-up config into memory with `copy startup-config running-config`
* get into config mode `conf t` to edit the default configuration
* setup your login credentials

```bash
ciscoasa(config)# password <password />
ciscoasa(config)# enable password <password />
ciscoasa(config)# username <name /> password <password />
```

### Reload edited config

you can now reload your newly edited default configuration

```bash
ciscoasa(config)# no config-register
```

### Save your now running-config

back to the startup-config to persist (i.e. come back after) for reboots

this ensures it boots with your new settings

```bash
ciscoasa(config)# copy running-config startup-config
```

### Reboot with `reload`

watch it boot right back up with all your new settings.

### References

:::info

* [CISCO ASA Configuration Reference](http://www.cisco.com/c/en/us/td/docs/security/asa/asa83/configuration/guide/config/admin_trouble.html#wp1134357)

:::

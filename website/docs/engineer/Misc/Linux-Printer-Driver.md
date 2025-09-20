---
title: "Brother MFC-J4330DW Printer Setup on Linux - Complete Driver Installation Guide"
description: "Step-by-step guide to installing and configuring Brother MFC-J4330DW printer drivers on Linux systems. Includes troubleshooting and wireless setup."
keywords: ["brother printer linux", "mfc-j4330dw linux", "linux printer driver", "brother printer setup", "linux printing", "printer configuration"]
tags: ["linux", "printer", "brother", "drivers", "hardware"]
sidebar_position: 5
---

Setting up my Brother MFC-J5330DW Network Printer on Ubuntu.

Tested and works on: Ubuntu, `VERSION="22.04.1 LTS (Jammy Jellyfish)"`

## Steps

### Add Network Printer

Bring up your printer menu (I use `start` and type "printer" Gnome shell).

Add a printer

![add printer](/img/brother-printer-1.png)

Type your printers IP address in the box and then select your printer.

![ip addy printer](/img/brother-printer-2.png)

_I'm going for the whole `MFC-J5330DW` multi-function device._

### Brother Printer Driver

Go to the Brother website, [Downloads](https://support.brother.com/g/b/downloadtop.aspx?c=nz&lang=en&prod=mfcj5330dw_us_eu_as) page.

![download driver](/img/brother-printer-3.png)

Select Linux, (for me) `Linux (deb)`, and `OK` (or just go **[here](https://support.brother.com/g/b/downloadhowto.aspx?c=nz&lang=en&prod=mfcj5330dw_us_eu_as&os=128&dlid=dlf006893_000&flang=4&type3=625)** for the shortcut to download).

#### Instructions for driver install

```bash
# unzip script
~/Downloads ❯ gunzip linux-brprinter-installer-2.2.3-1.gz

# make script executable
chmod +x linux-brprinter-installer-2.2.3-1

# run as root
~/Downloads ❯ sudo ./linux-brprinter-installer-2.2.3-1
Input model name ->MFC-J5330DW                             
                                                           
You are going to install following packages.               
   mfcj5330dwlpr-1.0.1-0.i386.deb                          
   mfcj5330dwcupswrapper-1.0.1-0.i386.deb                  
   brscan4-0.4.11-1.amd64.deb                              
   brscan-skey-0.3.1-2.amd64.deb
OK? [y/N] ->y
```

## Conclusion

If it's all setup properly, the end of the script will print a test page, so if you see that, you're done.

:::danger

Default Password for web access to MFC-JW4330DW model = `initpass` (no username)

:::

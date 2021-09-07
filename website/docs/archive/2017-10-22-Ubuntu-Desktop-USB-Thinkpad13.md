---
title: Quick Note - Install Ubuntu 16.04 via bootable USB
---

Create a bootable USB for installing Ubuntu on my Secure Boot / UEFI capable Thinkpad.

## Hardware Settings

I'm on a **Lenovo Thinkpad 13. Core i5-6200U, 16GB DDR4, 525GB SSD**.

In the bios, I have the following options set:

```bash
Security > Secure Boot > Secure Boot [Disabled]
Security > Virtualization > Intel (R) Virtualization Technology [Enabled]
Security > Virtualization > Intel (R) VT-d Feature [Enabled]
Startup > UEFI/Legacy Boot [Both]
```

## Bootable USB

Following the requirements laid out on [Ubuntu website](https://tutorials.ubuntu.com/tutorial/tutorial-create-a-usb-stick-on-windows#1)

> - A 2GB or larger USB stick/flash drive
> - Microsoft Windows XP or later
> - Rufus, a free and open source USB stick writing tool
> - An Ubuntu ISO file. See Get Ubuntu for download links

I used the following:

* 8GB SanDisk Cruzer Switch
* Windows 10 Pro
* [Rufus](https://rufus.akeo.ie/) 2.18
* Ubuntu 16.04 (ubuntu-16.04.3-desktop-amd64.iso)

_note: **DO NOT USE** unetbootin to burn your iso to usb, tried it several times on 2 different SanDisk usb's and they failed to boot or even be recognized by my laptop as an installable media. Avoid._

## Installation

once you've got this far and start the install the rest is pretty straight forward... I started this note and forgot where I was going with it, but maybe I'll leave it here and come back to update it once I remember :/

## References

:::info

[Ubuntu Install Documentation](https://tutorials.ubuntu.com/tutorial/tutorial-create-a-usb-stick-on-windows#1)

:::

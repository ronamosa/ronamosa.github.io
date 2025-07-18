---
title: "VirtualBox: Purge deleted hard disks."
---

:::info

Published Date: 28-JAN-2019

:::

Just some quick notes on when I tried to re-attach a disk that was initially "missing" according to VirtualBox; moved the HDD to a different directory and got a "this disk already exists" error when trying to add it back in.

Found some very straight forward instructions from, and full credit to [coderwall.com](https://coderwall.com/) (reference below). I just wanted to capture my process of this with some screenshots as well.

## Pre-requisites

things you'll need installed to follow along

* VirtualBox
* access and know where your VBoxManage.exe is (I'm doing this on my windoze machine) cos we're running some CLI

## Missing disk

![missing disk](/img/virtualboxhdd-missing-disk.png)

## Error: Disk UUID already exists

Ok, so locate the disk and try and add it:

![disk error](/img/virtualboxhdd-add-disk.png)

Get this error

![disk error](/img/virtualboxhdd-already-exists.png)

## Fix with VBoxManage.exe

Right, find your VirtualBox binaries and run the following

`vboxmanage list hdds`

For me in MobaXterm that looks like this:
![mobaxterm](/img/virtualboxhdd-mobaxterm1.png)

grab that UUID and delete it from then delete it from VirtualBox

`vboxmanage closemedium disk <uuid /> --delete`

for some reason when I did this, I got an error
![mobaxterm](/img/virtualboxhdd-moba-error.png)

But I was able to successfully add it back in anyway, so yea... dunno about that... Anyway, re-tried it with another entry and this is what a successful command run looks like

![mobaxterm](/img/virtualboxhdd-moba-success.png)

## Conclusion

I know vboxmanage has a tonne of other cool stuff you can do from the command line, e.g. vagrant utilises a lot of this when scripting virtual machine builds which is bloody cool.

## References

* [Purge deleted hard disks from Virtual Box](https://coderwall.com/p/8m--dq/purge-deleted-hard-disks-from-virtual-box)

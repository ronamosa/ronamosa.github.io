---
title: "Mount Proxmox VM Logical Volumes for Direct Filesystem Access"
description: "Technical guide to mount and access Proxmox virtual machine logical volumes from the host system for troubleshooting, recovery, and filesystem modifications."
keywords: ["proxmox", "lvm", "logical volume", "vm mount", "filesystem access", "vm recovery", "proxmox troubleshooting", "vm disk access"]
tags: ["proxmox", "lvm", "troubleshooting", "virtualization", "system-admin"]
sidebar_position: 4
---

## Background

I created an Ubuntu VM using Packer, which was supposed to bootstrap my username & ssh_key access when the VM was running but instead the packer build process would time out and rollback destroying the VM and any logs I needed to troubleshoot what was happening. I managed to clone the VM before it was destroyed again, but there was no root account and I could see my username had made it into the `/etc/passwd` file by using `qm guest exec <vmid /> cat /etc/passwd` from the proxmox host. I couldn't use the `qm` command to try to set a password for my user, so I decided to go old school and mount the VM disk (volume) and edit things from there.

## Related Proxmox Troubleshooting & Automation

🔧 **Proxmox Troubleshooting Context**: This advanced technique complements the automation workflow:

- **Root Cause**: [Packer VM Template Creation](./proxmox-packer-vm) - The original Packer process that led to this troubleshooting
- **Prevention**: [Ansible VM Automation](./proxmox-cloudinit) - Automated deployment to avoid manual VM issues
- **Complete Workflow**: [Proxmox Virtualization Hub](./proxmox-hub) - End-to-end Proxmox automation and management

🏗️ **Advanced Infrastructure Skills**: Build comprehensive troubleshooting capabilities:

- **Container Debugging**: [Kubernetes Troubleshooting](/docs/engineer/K8s/) - Similar debugging techniques for containers
- **Home Lab Context**: [Home Lab Infrastructure Hub](./home-lab-hub) - Complete infrastructure troubleshooting strategies

## Overview

We're dealing with a LVM volumes on a Proxmox host, so this is the process of finding the necessary information, installing the right tools and getting to the point of mounting the voluming, editing the filesystem, unmounting and booting the VM up again with the "fixed" volume attached.

## LVM

Check out your logical volumes, in volume group (VG) `pve`:

```bash
root@pve1:~# lvs
  LV            VG  Attr       LSize    Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  data          pve twi-aotz-- <794.79g             3.17   0.32
  root          pve -wi-ao----   96.00g
  swap          pve -wi-ao----    8.00g
  vm-101-disk-0 pve Vwi-a-tz--   20.00g data        100.00
  vm-200-disk-0 pve Vwi-aotz--   32.00g data        16.17
```

use `lvdisplay` for more detailed info on each volume.

### vgchange

I'm not 100% sure you need this step, but it's one I did.

```bash
root@pve1:~# vgchange --help
  vgchange - Change volume group attributes

  Change a general VG attribute.
  For options listed in parentheses, any one is
  required, after which the others are optional.
  vgchange
```

"activate" your volumes:

```bash
root@pve1:~# vgchange -ay pve
  5 logical volume(s) in volume group "pve" now active
```

## Device Mappings

You need to create device mappings from the segments of the LV you want to mount, for this we'll use `kpartx`

### kpartx

install `kpartx` with `apt install -y kpartx` from the proxmox host (up to you if you want to `-y` that).

:::info man kpartx

kpartx - Create device maps from partition tables

This  tool, derived from util-linux' partx, reads partition tables on specified device and create device maps over partitions segments detected. It  is  called  from  hotplug  upon device maps creation and deletion.

:::

I can see the currently mapped devices under `/dev/mapper`, and I want my `vmid=101` disks:

```bash
root@pve1:~# ls -l /dev/mapper/
total 0
crw------- 1 root root 10, 236 Apr 21 23:08 control
lrwxrwxrwx 1 root root       7 Apr 21 23:08 pve-data -> ../dm-5
lrwxrwxrwx 1 root root       7 Apr 21 23:08 pve-data_tdata -> ../dm-3
lrwxrwxrwx 1 root root       7 Apr 21 23:08 pve-data_tmeta -> ../dm-2
lrwxrwxrwx 1 root root       7 Apr 21 23:08 pve-data-tpool -> ../dm-4
lrwxrwxrwx 1 root root       7 Apr 21 23:08 pve-root -> ../dm-1
lrwxrwxrwx 1 root root       7 Apr 21 23:08 pve-swap -> ../dm-0
lrwxrwxrwx 1 root root       7 Apr 27 22:20 pve-vm--101--disk--0 -> ../dm-8
lrwxrwxrwx 1 root root       7 Apr 26 22:21 pve-vm--200--disk--0 -> ../dm-6
```

use `kpartx` to "add mappings" (`-av`, add, verbose) from that LV:

```bash
root@pve1:~# kpartx -av /dev/mapper/pve-vm--101--disk--0
add map pve-vm--101--disk--0p1 (253:7): 0 2048 linear 253:8 2048
add map pve-vm--101--disk--0p2 (253:9): 0 41936896 linear 253:8 4096
```

## Mount Device

Make a dir under `/mnt`, mount your newly mapped device, and check the mounted dir

```bash
root@pve1:/mnt# mkdir vm
root@pve1:/mnt# mount /dev/mapper/pve-vm--101--disk--0p2 /mnt/vm
root@pve1:/mnt# ls -l /mnt/vm
total 4030552
lrwxrwxrwx  1 root root          7 Aug 24  2021 bin -> usr/bin
drwxr-xr-x  3 root root       4096 Apr 27 09:39 boot
drwxr-xr-x  2 root root       4096 Apr 27 09:18 cdrom
drwxr-xr-x  5 root root       4096 Aug 24  2021 dev
drwxr-xr-x 97 root root       4096 Apr 27 09:41 etc
drwxr-xr-x  3 root root       4096 Apr 27 09:41 home
lrwxrwxrwx  1 root root          7 Aug 24  2021 lib -> usr/lib
lrwxrwxrwx  1 root root          9 Aug 24  2021 lib32 -> usr/lib32
lrwxrwxrwx  1 root root          9 Aug 24  2021 lib64 -> usr/lib64
lrwxrwxrwx  1 root root         10 Aug 24  2021 libx32 -> usr/libx32
drwx------  2 root root      16384 Apr 27 09:18 lost+found
drwxr-xr-x  2 root root       4096 Aug 24  2021 media
drwxr-xr-x  2 root root       4096 Aug 24  2021 mnt
drwxr-xr-x  2 root root       4096 Aug 24  2021 opt
drwxr-xr-x  2 root root       4096 Apr 15  2020 proc
drwx------  5 root root       4096 Apr 27 22:13 root
drwxr-xr-x 11 root root       4096 Aug 24  2021 run
lrwxrwxrwx  1 root root          8 Aug 24  2021 sbin -> usr/sbin
drwxr-xr-x  7 root root       4096 Apr 27 13:45 snap
drwxr-xr-x  2 root root       4096 Aug 24  2021 srv
-rw-------  1 root root 4127195136 Apr 27 09:19 swap.img
drwxr-xr-x  2 root root       4096 Apr 15  2020 sys
drwxrwxrwt  8 root root       4096 Apr 27 22:20 tmp
drwxr-xr-x 14 root root       4096 Apr 27 09:38 usr
drwxr-xr-x 13 root root       4096 Aug 24  2021 var
root@pve1:/mnt#
```

You can now make the changes you need to the filesystem, save, unmount and try rebooting the vm again with the edited volume. For me, I just needed to see what happed to the `sshd` config under `/etc/ssh/sshd_config` because Packer `autoinstall` was supposed to have set it to accept PubKey AuthN, instead I found this -> `#PubkeyAuthentication yes`.

Back to the Packer configs to see what went wrong. Enjoy.

## References

- [Proxmox Forum](https://forum.proxmox.com/threads/how-to-mount-lvm-disk-of-vm.25218/)

### delete device mappings

to reverse the kpartx mappings: `root@pve1:~# kpartx -av /dev/mapper/pve-vm--101--disk--0`

### qemu commands

some useful `qm` commands:

```bash
qm guest exec <vmid /> <command />
# more to come
```

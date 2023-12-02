---
title: "Proxmox: Systems Administration Notes"
---

## Hard Disk Resize

I ran out of diskspace on my AI machine, a VM on proxmox, needed to increase disksize.

### Specs

info and details on what I'm working with:

- [proxmox docs](https://pve.proxmox.com/wiki/Resize_disks)

Note - my VM disks are on Synology NFS.

### Proxmox UI

Use proxmox UI to select your VM, Hard Disk, Disk Action and Resize

![proxmox UI disk resize](/img/proxmox-resize.png)

I added 200GB.

### FDISK

My `fdisk -l` looks like this:

```bash
Device       Start      End  Sectors Size Type                                   
/dev/sda1     2048     4095     2048   1M BIOS boot
/dev/sda2     4096  4198399  4194304   2G Linux filesystem                                
/dev/sda3  4198400 67106815 62908416  30G Linux filesystem   
```

### Parted

I don't have EFI on my partitions, so straight `parted` for me:

```bash
root@ai:~# parted /dev/sda                                                     
GNU Parted 3.4        
Using /dev/sda
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) print                                                             
Warning: Not all of the space available to /dev/sda appears to be used, you can fix the GPT to use all of the space (an extra 419430400 blocks) or continue with the current setting? 
Fix/Ignore? F                                                              
Model: QEMU QEMU HARDDISK (scsi)
Disk /dev/sda: 249GB
Sector size (logical/physical): 512B/512B
Partition Table: gpt
Disk Flags: 

Number  Start   End     Size    File system  Name  Flags
 1      1049kB  2097kB  1049kB                     bios_grub
 2      2097kB  2150MB  2147MB  ext4
 3      2150MB  34.4GB  32.2GB

(parted) resizepart 3 100%                                                 
(parted) quit                                                              
Information: You may need to update /etc/fstab.
```

### Check Disk Size

original disk size was `15GB`, mounted on `/`

```bash
root@ai:~# df -h    
Filesystem                         Size  Used Avail Use% Mounted on      
tmpfs                              392M  1.3M  390M   1% /run                                                       
/dev/mapper/ubuntu--vg-ubuntu--lv   15G   14G  540M  97% /
```

Disk is stil `15GB`, need to resize LV

### LV Resize

Check my logical volumes:

```bash
root@ai:~# lvdisplay 
  --- Logical volume ---
  LV Path                /dev/ubuntu-vg/ubuntu-lv
  LV Name                ubuntu-lv
  VG Name                ubuntu-vg
  LV UUID                0dVeYn-iAMf-2qiD-9aCr-6EuB-rkCO-M9oZv7
  LV Write Access        read/write
  LV Creation host, time ubuntu-server, 2023-11-11 06:17:35 +0000
  LV Status              available
  # open                 1
  LV Size                <15.00 GiB
  Current LE             3839
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           253:0
```

The command to resize to fill all free space is: `lvresize --extents +100%FREE --resizefs /dev/{volume group name}/{lv name}`

```bash
root@ai:~# lvresize --extents +100%FREE --resizefs /dev/ubuntu-vg/ubuntu-lv
  Size of logical volume ubuntu-vg/ubuntu-lv changed from <15.00 GiB (3839 extents) to <30.00 GiB (7679 extents).
  Logical volume ubuntu-vg/ubuntu-lv successfully resized.
resize2fs 1.46.5 (30-Dec-2021)
Filesystem at /dev/mapper/ubuntu--vg-ubuntu--lv is mounted on /; on-line resizing required
old_desc_blocks = 2, new_desc_blocks = 4
The filesystem on /dev/mapper/ubuntu--vg-ubuntu--lv is now 7863296 (4k) blocks long.
```

### Resize Partition

Because I'm resizing the root partition, I need to boot in via a LiveCD and get a shell with an umounted `/` to do the resize.

#### LiveCD

Under 'Hardware', set your CD/DVD to a LiveCD ISO

![ubuntu livecd iso](/img/proxmox-livecd-iso.png)

#### Boot Order

Go to 'Options', select 'Boot Order' and then 'Edit'

![boot order](/img/proxmox-livecd-iso2.png)

Move your LiveCD ISO entry up so it's in first position to get booted first.

Boot into your LiveCD

#### Shell

The new Ubuntu liveCDs don't boot you into a window environment anymore, so during the installation process, go to 'Help' in the top-right corner and find `Enter shell`

![ubuntu livecd shell](/img/ubuntu-livecd-shell.png)
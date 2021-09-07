---
title: Reset Windows10 VMWare Guest Password.
---

After installing a few windows 10 vm's on my ESXi lab, I, of course, forgot the admin passwords I used to set them up. Normally this is a bootable USB with some SAM file editing tools on it, but this is virtual hardware land. The following procedure worked to get me into the virtual BIOS of my vm.

## Summary

Unfortunately, the actual password resetting bit didn't work for reasons stated below. I'll come back to this post once I have time to figure that bit out.

## Get into the VM Bios

1. Find the .vmx file for the vm you want to get into the bios, this is in your esxi hosts vm  directory.
2. Copy the .vmx file to your local desktop and edit it with a text editor like Notepad++
3. Edit this file and enter this information on the first line: `bios.forceSetupOnce = “TRUE”`
4. Save and quit your editor
5. Next download the Offline NT & Password Registry Editor from here (upload password registry editor iso to your esxi datastore)
6. With you VMMachine shut down, start it and attach the ISO image that was unzipped from your download.
7. When your VM Instance Boots, you will be in the BIOS. Change the BIOS settings so that your VM Image first boots from the CDROM. Then Save and Exit changes
8. Reboot your VM image

## Password Reset Steps

1. A CLI (Command Line Interface) will appear.
2. Follow the steps outlined HERE. Pretty much take the defaults by simply pressing return.

* windows 8/8.1/10 have features means this password tool will fail due to NTFS filesystem being in "hibernation mode" and this tool can't proceed.

**you'll get this error:**

```log
"Mounting from /dev/sda5 with filesystem type NTFS
So let's really check if it is NTFS?

Windows is hibernated, refused to mount.
NTFS: Yes, but hibernated.
=================================
** The system is HIBERNATED!
** SAFEST is to boot into windows and shut down properly!
=================================

If that is not possible, you can force changes,
but the hibernated session will be lost!"
```

so what's the problem?

## Why your Windows is hibernated

There is a new feature in Windows 8/10 called Fast Startup. If this feature is enabled (which it is by default), Windows does not actually completely shutdown when you choose shutdown. Instead, it does a "hybrid shutdown". This is something like hibernating; it makes booting Windows back up faster. So, you need to disable this feature to be able to shut it down properly, and be able to mount the Windows partitions.

[hibernation mode issue](https://www.top-password.com/knowledge/chntpw-refused-to-mount-hibernated-windows.html)

* Eventually you will see a list of system user accounts. Select the user you want to clear the password and clear (delete) that password.
* Save quit and shutdown you VM image.
* Edit the .vmx file again and change:

```ini
bios.forceSetupOnce = “TRUE”
```

to

```ini
bios.forceSetupOnce = “FALSE”
```

* Save your changes and exit your editor
* Reboot
* Login and you're done.

## Troubleshooting

If bios fails to load and it keeps booting into the OS, check the .vmx file entry you entered is as it should be. I edited the file with an old version of 'vi' ssh'd into esxi 5.5's busybox (BusyBox v1.20.2 (2012-12-11 11:54:28 PST)) and my vi edits were getting munged.

## References

:::info

* [VMWare Thread](https://communities.vmware.com/thread/202039)
* [Password Reset Tool](http://www.pogostick.net/~pnh/ntpasswd/)
* [Password Reset HowTo](http://www.pogostick.net/~pnh/ntpasswd/walkthrough.html)

:::

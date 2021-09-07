---
title: "Cisco WAP200 Firmware Upgrade"
---

this is a pretty old WAP from the Cisco family. I needed a cheap access point for my home office/lab (I know, I shouldn't be so cheap). So I bought a CISCO WAP200 which was [EOL in 2012](https://www.cisco.com/c/en/us/products/collateral/wireless/wap200-wireless-g-access-point-poe-rangebooster/end_of_life_notice_c51-715319.html).

As is good practice, after I fired it up I went into the settings and enabled HTTPS for the web interface. The unit rebooted, and then I was met with this:

![cipher mismatch](/img/archive/ciscowap200_ciphermismatch.png)

That's right. This unit is outdated and needs its firmware and stuff updated. So off I go to find the firmware files, log into the admin page, upload and run the upgrade.

## The Error

When trying to upload and run the firmware file I found on the cisco website I got this:

![cisco wap200 wrong file format](/img/archive/ciscowap200_wrongformat.png)

The file: `WAP200-FW-2.0.4.0-K9.img`

## The Solution

I did some mad searches for how to verify the img file, unpack it, check the contents etc. I even thought "maybe the update.cgi binary is corrupted and needs to be checked". In the end, the simplest solution is usually the best (or correct).

My Cisco WAP 200 I bought from TradeMe 2nd hand is made in China. These are your two choices for firmware to download:

![firmware to download](/img/archive/ciscowap200_firmware.png)

Yes. I'm an idiot.

If you find yourself with the "Wrong Firmware Format!!" error like me, check you've downloaded the right firmware for your device. For some reason I thought my WAP200 should be the U.S. format (silly me), but it's actually EU.

Funnily enough none of the search results I found for this error message mentioned checking if the firmware version you were trying to use was the right one for your device. It's like when they realized it they didn't come back to the forum and say "yea I'm an idiot, check the version is the right one".

## A Successful Upgrade

You've found your way here I might as well show you a successful upgrade. Check the links in the 'References' section of the firmware files and the device manual.

<iframe width="560"
height="315" src="https://www.youtube-nocookie.com/embed/c0ZjCimDKzU?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
</iframe>

## Addendum

Why did I need another WAP in my lab? I've got a wireless router from Huawei that's meant to be serving my wireless needs. And it was doing fine up until I needed my Windows 2012 server to handle DHCP on the subnet it was on and then, it was useless. The router wouldn't forward any DHCP requests to my WIN2k12 server. So, anyway, thought it would be easier to move wireless duties off to another device on the network.

## References

:::info

* [Cisco WAP 200 latest firmware release: 2.0.6.0](https://software.cisco.com/download/home/282414133/type/282463166/release/2.0.6.0)
* [Cisco WAP 200 Manual](https://www.cisco.com/c/dam/en/us/td/docs/wireless/access_point/csbap/wap200/administration/guide/WAP200_V10_UG_Rev_B_web.pdf)

:::

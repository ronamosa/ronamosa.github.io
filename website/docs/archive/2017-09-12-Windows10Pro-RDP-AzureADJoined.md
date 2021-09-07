---
title: RDP to a Azure AD Joined Device
---

After setting up a local schools office to use Azure AD for user, device management, I was having trouble trying to RDP from one domain joined machine to another.

## Problem

firing up stock standard RDP session :

![RDP start](/img/archive/azure-rdp-startrdp.png)

We get asked for login details, which we choose "other" and then have fun trying to get the login format right

>is it "username@AzureDomain", or "AzureDomain\username"?

![RDP bad login](/img/archive/azure-rdp-credsno.png)

The problem is when initiating the connection RDP sets up the authentication between us and the remote host and something goes screwy (technical term).

So how do we prevent this setup going off-track from the jump?

## Solution

After seeing a few forum posts saying to [add AzureAD users to the 'Remote Desktop Allowed' groups](https://social.technet.microsoft.com/Forums/windows/en-US/404b7ec4-1426-44d7-a1b3-99ea7d5a8220/rdp-to-an-azure-ad-joined-computer?forum=win10itprogeneral) and a resignation to just [use teamviewer](https://community.spiceworks.com/topic/1962898-rdp-into-standard-user-account-on-azure-ad-joined-pc)

I found the following hack/workaround:

* Start an RDP session
* Enter the IP/hostname of the remote PC you want to connect to.
* Click **'Save As'** and save the \*.rdp file somewhere.
* Open the .rdp file you just saved with notepad/notepad++
* Add the following two lines at the bottom of the config:

```sh
enablecredsspsupport:i:0 # disables _"use the Credential Security Support Provider (CredSSP) for authentication"_
authentication level:i:2 # sets authentication level to 2 (0 and connection doesn't work, 1 and it shows you remote pc cert and then dies).
```

* save your rdp file.
* double-click your rdp file and you should get the following screens

first connection:
![RDP first login](/img/archive/azure-rdp-firstlogin.png)

remote pc shows us their cert:
![RDP first login](/img/archive/azure-rdp-firstcertscreen.png)

SUCCESS!
![RDP first login](/img/archive/azure-rdp-success.png)

## Conclusion

The main takeaway here is to stop RDP caking the connection setup by disabling the `enablecredsspsupport` from starting us down a bad authentication pathway and just get out of the way and show us the remote PC login screen. The remote login screen understands the authentication bits we're working with in line with AzureAD.

## Troubleshooting

Make sure:
![RDP Settings](/img/archive/azure-rdp-settings.png)

* `Allow remote connections to this computer` : `CHECKED`
* `Allow connections only from computers running Remote Desktop with Network Level Authentication` : `NOT CHECKED`

## References

:::info

* [enablecredsspsupport](https://technet.microsoft.com/en-us/library/ff393716(v=ws.10).aspx)
* [superuser.com fix reference](https://superuser.com/questions/951330/windows-10-remote-desktop-connection-using-azure-ad-credentials)
* [morgansimonsen blog](https://morgansimonsen.com/2015/11/06/connecting-to-an-azure-ad-joined-machine-with-remote-desktop/)
* [c7 solutions](http://c7solutions.com/2016/05/remote-desktop-and-login-with-azuread-account)

:::

## Appendix

**Full working RDP file used in this post:**

Just change the `full address:s:192.168.1.3` part the IP of the PC you want to connect to, copy and paste this into a txt file and save it as an .rdp file.

```ini
screen mode id:i:2
use multimon:i:0
desktopwidth:i:1366
desktopheight:i:768
session bpp:i:32
winposstr:s:0,3,0,0,800,600
compression:i:1
keyboardhook:i:2
audiocapturemode:i:0
videoplaybackmode:i:1
connection type:i:7
networkautodetect:i:1
bandwidthautodetect:i:1
displayconnectionbar:i:1
enableworkspacereconnect:i:0
disable wallpaper:i:0
allow font smoothing:i:0
allow desktop composition:i:0
disable full window drag:i:1
disable menu anims:i:1
disable themes:i:0
disable cursor setting:i:0
bitmapcachepersistenable:i:1
full address:s:192.168.1.3
audiomode:i:0
redirectprinters:i:1
redirectcomports:i:0
redirectsmartcards:i:1
redirectclipboard:i:1
redirectposdevices:i:0
autoreconnection enabled:i:1
authentication level:i:2
prompt for credentials:i:0
negotiate security layer:i:1
remoteapplicationmode:i:0
alternate shell:s:
shell working directory:s:
gatewayhostname:s:
gatewayusagemethod:i:4
gatewaycredentialssource:i:4
gatewayprofileusagemethod:i:0
promptcredentialonce:i:0
gatewaybrokeringtype:i:0
use redirection server name:i:0
rdgiskdcproxy:i:0
kdcproxyname:s:
enablecredsspsupport:i:0
```

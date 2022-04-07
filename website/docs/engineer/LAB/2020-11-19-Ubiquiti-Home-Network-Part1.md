---
title: "Ubiquiti Home Network: Part.1"
---

:::info

Published Date: 19-NOV-2020

:::

> What are you setting up?

I've been wanting to re-do my existing home office network after downsizing from my usual enterprise-level CISCO routers and switches in my remote office. After a discussion on Slack with my PaaS Security team mates, I thought I'd look into an edgerouterx for security reasons, and with an EdgeSwitch caught my eye and inevitably a unifi AP had to be thrown in there as well.

I'm setting up a "secure" home network where I create network partitions (VLANs) to section off different devices according to their security "profile".

> Why?

Mainly security. But it's good to know how your network is setup, and make conscious verifiable decisions about what devices can and should be able to "talk" to each other. For example people who visit your house and need to use the internet don't need to be able to browse your network shares, or link up to your printer. And for my current work situation in particular, the work laptop needs to be isolated on its own so the corporate network probing that comes with it is contained.

## Overview

The high-level overview of connectivity and what we're configuring at different points in the design looks like this:

![network overview](/img/ubiquiti-network-vlans.png)

:::info

_The 'MyRepublic' router is temporary as I setup & configured the network without disrupting the existing internet connection for the rest of the house. Once its all go, the ONT will go directly to the EdgeRouter X._

:::

### Hardware

List of hardware used in this setup:

[EdgeRouter™ X SFP](https://www.ui.com/edgemax/edgerouter-x-sfp/)

Advanced Gigabit Router with PoE and SFP

* 5 x Gigabit RJ45 Ports (eth0-eth5/SFP)
* 1 x SFP Port
* 24V Passive PoE all RJ45 ports
* Firmware: EdgeOS v1.10.7

![edgerouter x sfp](/img/ubiquiti-edgesrouterxsfp.jpg)

[EdgeSwitch 10XP](https://www.ui.com/edgemax/EdgeSwitch-10xp/)

Managed 10-Port Gigabit Switch with PoE

* 8 x Gigabit RJ45 Ports
* 2 x SFP Ports
* 24V Passive PoE all RJ45 ports
* Firmware: v1.1.0

![EdgeSwitch 10xp](/img/ubiquiti-edgeswitch10xp.jpg)

[Unifi AP AC Lite](https://www.ui.com/unifi/unifi-ap-ac-lite/)

802.11ac Dual Radio Access Point

* Dimensions ∅160 x 31.45 mm
* 2.4 GHz Speed 300 Mbps
* 5 GHz Speed 867 Mbps
* 1 x 10/100/1G RJ45 Port

![unifi ap ac lite](/img/ubiquiti-uap-ac-lite.jpg)

## Physical Interfaces

Essentially, the data flow goes from devices connected to the UAP, or EdgeSwitch, up to the EdgeRouter, is routed or firewalled accordingly, and is dropped or continues out into the internet via the Optical Network Terminal (ONT).

The main crux of the whole setup is the EdgeRouterX which we will setup in the commonly known 'Router-on-a-stick' configuration i.e. all downstream devices will flow upstream to the router along a single cable, get routed, and carry on (or drop) from there.

To start with, we will setup the initial interfaces as follows:

![device connectivity ](/img/ubiquiti-network-interfaces.png)

Key points of this layer:

* assinging the 172.16.x.x range on the EdgeRouter's LAN interfaces to avoid clashes with the upstream router DHCP range locked on 192.168.x.x.
* upstream router (MyRepublic) has DHCP enabled for our downstream WAN interface
* configure Out-of-Band (OOB) Management interface first and work from this connection to configure everything in case a misconfig locks you out.
* setup all downstream devices to DHCP on the eth1 interface to pickup an IP for Management interfaces, and then statically map thos IPs on the EdgeRouter to pin them in place.

### EdgeRouter X (initial setup)

To connect to the EdgeRouter X when you power it up for the first time, use the **'eth0'** port and open a browser to the [https://192.168.1.1](https://192.168.1.1) default IP address.

![edgerouterx login ](/img/edgerouterx-login.png)

default login/password: ubnt/ubnt

Next, go to the 'Wizards' section, and choose 'Basic Setup':

![edgerouterx basic setup ](/img/edgerouterx-basicsetup.png)

The wizards good for getting everything in the ballpark, but don't stress about it too much because we'll configure things specifically afterwards anyway.

![edgerouterx basic setup ](/img/edgerouterx-basicsetup-1.png)

* eth0 is our WAN/internet port, set to DHCP to pick up an IP from upstream
* enable default firewall, which we will add to later
* only use one LAN for now, just means we configure one address space for all.

![edgerouterx basic setup ](/img/edgerouterx-basicsetup-2.png)

The EdgeRouterX will ask you if it can reboot, you say yes.

Once the EdgeRouterX is rebooted, you can do the following:

1. connect a cable from a free **LAN** port on the MyRepublic router (or whatever the upstream router is) to the EdgeRouterX **eth0** port.
2. connect your PC/laptop to any _'eth*'_ port on the EdgeRouterX (eth1-eth4)
3. your PC/laptop should pick up a _'172.16.1.x'_ address due to the DHCP server we setup on that network.
4. open a browser to _'https://172.16.1.1'_ - this is your new management interface IP.

If you need to factory reset your EdgeRouterX (I did a couple of times) to get to a known state, see _"EdgeRouterX Reset to Factory Defaults"_ in [References](##References) section below.
{: .notice--info}

#### OOB-MGMT Port

This step isn't mandatory and you can continue setting things up without it, but here are the steps to have one just in case.

#### Switch0

When you run the 'Basic Setup' wizard and specify that we only use ONE LAN, this meant all the LAN ports (eth1, eth2, eth3, eth4) were put into a 'switch0' interface.

What we need to do here, is separate out those **_ethX_** ports from the **_switch0_** so we can use one for our OOB-MGMT port.

:::tip

_If you try to just assign an IP address to one of the ethX ports, you'll get an error about assigning IP address to a switchport interface (or something, can't remeber the exact error)._

:::

Find the interface named _'switch0'_ and click the 'Action>Config' from the dropdown.

Click the 'Vlan' tab and you see this

![edgerouterx switch0 ](/img/edgerouterx-switch0.png)

Uncheck any or all of the ethX checkboxes.

Click 'Save' and exit back to the 'Dashboard' window.

Now setup the OOB-MGMT, by picking an ethX port. I'm using eth4 configured as follows:

* 'Manually define IP address' = 172.16.5.1/24

![edgerouterx oob-mgmt ](/img/edgerouterx-oob-mgmt.png)

Click 'Save'.

(Optional) You can setup a DHCP service for this network _'172.16.5.0/24'_ if you want to automatically get an IP address in the correct range by plugging into the eth4 port.

Click 'Services'
Click '+ Add DHCP Server'

![edgerouterx oob-dhcp ](/img/edgerouterx-oob-dhcp.png)

Then setup a DHCP Server along these lines

![edgerouterx oob-dhcp ](/img/edgerouterx-oob-dhcp2.png)

Now, plug your PC/laptop into eth4 and you should be assigned an IP in the 172.16.5.x range, and can now open up the EdgeRouterX management GUI at [https://172.16.1.1](https://172.16.1.1).

Before we move to configure the EdgeSwitch, connect a network cable from eth1 of the EdgeRouterX to port 8 of the EdgeSwitch.

### EdgeSwitch 10XP

The EdgeSwitch, after you connected the network cable from eth1 of the EdgeRouterX to port 8 of the switch, will recieve an IP address from the DHCP service we set up.

On the EdgeRouterX, if you look at DHCP service setup by the 'Basic Setup' wizard, you will see this:

![edgerouterx lan-dhcp ](/img/edgerouterx-oob-dhcp3.png)

The range starts at '172.16.1.10', so the EdgeSwitch should be on this IP address as this is the first and only device we've plugged into our setup so far.

Go to [https://172.16.1.10](https://172.16.1.10)

![EdgeSwitch10xp login ](/img/edgeswitch10xp-login.png)

default username/passwd = ubnt/ubnt

When logged in, for now, have a look at the 'Port summary' on the main page, and it looks something like this:

![EdgeSwitch10xp ports ](/img/edgeswitch10xp-ports.png)

Key points for the setup:

* Plug the Unifi AP AC Lite into Port 1
* Update 'Port name' for Port 1 to "Unifi AP AC Lite"
* Enable PoE to 24v, from the drop-down menu (options: Off, 24V)
* Update 'Port name' for Port 8 to "ER-X Uplink"

That's it for the EdgeSwitch 10XP for now... let's setup the Unifi AP AC Lite!

### AP AC Lite

The AP is a little bit more involved because you interact with the Unifi AP using a network controller software, which you have to install and host somewhere on the network that the AP can reach.

This updates our diagram a little bit, adding the controller service running from IP address 172.16.5.2 on port 8443:

![unifiapaclite controller diagram ](/img/unifiapaclite-contoller-diagram.png)

#### Install Unifi Network Controller

Follow the official documentation for setting up the network controller: ["Unifi- How to Set Up a UniFi Network Controller](https://help.ui.com/hc/en-us/articles/360012282453-UniFi-How-to-Set-Up-a-UniFi-Network-Controller#h_01EPDDV86GTK4M229TJHQK93MR)

:::info

_You need a Unifi account to login to the controller. If you don't have an account, go to [https://account.ui.com/](https://account.ui.com/) to create one._

:::

For my Ubuntu setup, I did the following:

1. Download installer from [https://www.ui.com/download/unifi/](https://www.ui.com/download/unifi/)
2. Run the installer on my server
3. Check service status, stop, restart:

* To start UniFi if the webpage prompt does not appear: `sudo service unifi start`
* To stop the UniFi service: `sudo service unifi stop`
* To restart the UniFi service: `sudo service unifi restart`
* To see the status of UniFi service: `sudo service unifi status`

1. Run through the setup wizard when you browse to `https://IP-of-Network-Contoller:8443`.

After the setup, you can now visit the network controller management UI (in my case) on [https://172.16.5.2:8443](https://172.16.5.2:8443) (this PC is on my OOB-MGMT interface).

![unifiapaclite login ](/img/unifiapaclite-login.png)

Login with your [unifi account](https://account.ui.com/)

And here's your 'Default' SITE

![unifiapaclite login ](/img/unifiapaclite-dashboard.png)

I created a new 'site' from the drop-down menu and had to move an already setup UAP into that which cleared the device of all the Wifi's and Networks I had previously setup. So be careful if you want to move devices to different site, that they will be cleared before moving.

Technically, at this point if you've followed the official setup documentation you should be looking at your UAP device in your 'Devices' section like this:

![unifiapaclite device ](/img/unifiapaclite-device.png)

with a 'connected' status

![unifiapaclite connect ](/img/unifiapaclite-connect.png)

If not, you may want to look at a couple of things

## Troubleshooting

I had a scenario where the UAP would be trying to update the firmware of the UAP as part of setup, but would then fail and get a 'disconnected' status.

> Why was this happening?

The answer was: DNS. It's _always_ DNS.

The UAP was trying to call out to the internet to resolve and connect to a domain and pull down the firmware update. Things weren't resolving and the activity was failing.

The solution was to enable DNS forwarding on the EdgeRouterX for these interfaces (i.e. eth1). Our DHCP server had told everyone to resolve via it's interface, but when requests from the UAP reached it, it hadn't been instructed it was allowed to do anything with it.

On the EdgeRouterX, go to 'Services'->'DNS'

* Click '+ Add Listen interface'
* Choose `eth1`
* Click 'Save'

![edgerouterx dns fwd ](/img/edgerouterx-dns-fwd.png)

If you go back to your UAP and retry the update & provisioning steps you should be okay now.

Right, this has been long enough and its only Part 1 of 3!

In the next installment we setup the VLANs across all three devices.

## References

* [EdgeRouter™ X SFP](https://www.ui.com/edgemax/edgerouter-x-sfp/)
* [EdgeSwitch 10XP](https://www.ui.com/edgemax/EdgeSwitch-10xp/)
* [Unifi AP AC Lite](https://www.ui.com/unifi/unifi-ap-ac-lite/)
* [Unifi- How to Set Up a UniFi Network Controller](https://help.ui.com/hc/en-us/articles/360012282453-UniFi-How-to-Set-Up-a-UniFi-Network-Controller#h_01EPDDV86GTK4M229TJHQK93MR)
* [Unifi Downloads](https://www.ui.com/download/unifi/)
* [EdgeRouterX Reset to Factory Defaults](https://help.ui.com/hc/en-us/articles/205202620-EdgeRouter-Reset-to-Factory-Defaults)

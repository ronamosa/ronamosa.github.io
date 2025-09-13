---
title: "Pi-hole with Unbound DNS: Complete Docker Setup for Privacy & Ad-Blocking"
description: "Deploy Pi-hole and Unbound recursive DNS resolver in Docker for private, ad-free networking. Comprehensive guide with Docker Compose configuration and troubleshooting."
keywords: ["pi-hole", "unbound", "dns", "docker", "ad blocking", "privacy", "recursive dns", "docker-compose"]
tags: ["pi-hole", "dns", "docker", "privacy", "networking", "home-lab"]
sidebar_position: 5
---

This guide walks through setting up Pi-hole with Unbound as a recursive DNS resolver using Docker. This combination provides ad-blocking functionality while ensuring DNS privacy by avoiding third-party DNS providers.

:::info
This guide is based on real-world implementation and troubleshooting. Each step represents hard-earned knowledge from overcoming various challenges.
:::

## Related Networking & Infrastructure Guides

🌐 **DNS & Network Security**: Expand your networking infrastructure:

- **DNS Optimization**: [Pi-hole DNS Configuration](./pihole-dns) - Advanced DNS setup and performance tuning
- **Security Monitoring**: [Pi-hole Compromise Detection](./pihole-compromise) - Network security and intrusion detection
- **DNS Troubleshooting**: [Pi-hole SERVFAIL Issues](./pihole-servfail-unbound) - Resolve common DNS problems

🏗️ **Infrastructure Integration**: Connect with broader home lab setup:

- **Virtualization Platform**: [Proxmox Virtualization Hub](./proxmox-hub) - Host Pi-hole on Proxmox VMs
- **Container Orchestration**: [Kubernetes Deployment](/docs/engineer/K8s/) - Scale DNS services with K8s
- **Complete Lab Guide**: [Home Lab Infrastructure Hub](./home-lab-hub) - Full networking and automation setup

## Prerequisites

- Linux server with Docker and Docker Compose installed
- Basic knowledge of networking concepts
- Root or sudo access
- A user with docker permissions to be the pihole user.

## Overview

Our setup consists of two Docker containers:

1. **Pi-hole**: For ad-blocking and DNS management
2. **Unbound**: For recursive DNS resolution

## Initial Setup

Here are the commands to create a dedicated user for running Pi-hole in Docker:

1. Create the user:

```bash
sudo useradd -m -s /bin/bash piholeuser
```

2. Set a password (optional but recommended):

```bash
sudo passwd piholeuser
```

3. Add user to the Docker group:

```bash
sudo usermod -aG docker piholeuser
```

4. Create a directory for Pi-hole Docker files:

```bash
sudo mkdir -p /opt/pihole
sudo chown piholeuser:piholeuser /opt/pihole
```

5. If using Docker socket-based permission (alternative to Docker group):

```bash
sudo setfacl -m user:piholeuser:rw /var/run/docker.sock
```

You'll need to log out and back in for group changes to take effect. To switch to the new user:

```bash
su - piholeuser
```

### Create Project Directory Structure

```bash
mkdir -p ~/pihole/{pihole,dnsmasq,unbound}
cd ~/pihole
```

### Docker Compose Configuration

:::caution
Using proper container capabilities and permissions is crucial. Missing or incorrect permissions will lead to segmentation faults and permission errors.
:::

Create a `docker-compose.yml` file with the following content:

```yaml
version: '3.8'
services:
  pihole:
    container_name: pihole
    image: pihole/pihole:latest
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "80:80/tcp"
    environment:
      TZ: "Pacific/Auckland"  # Replace with your timezone
      WEBPASSWORD: "password"  # Change this!
      DNSMASQ_LISTENING: "all"
      PIHOLE_DNS_1: "unbound#53"  # Point to unbound container
    volumes:
      - ./pihole:/etc/pihole
      - ./dnsmasq:/etc/dnsmasq.d
    restart: unless-stopped
    networks:
      dns_network:
    cap_add:
      - NET_ADMIN
      - NET_RAW
      - CAP_SYS_NICE
      - CAP_SYS_TIME
    security_opt:
      - seccomp:unconfined
    depends_on:
      - unbound
  unbound:
    container_name: unbound
    image: klutchell/unbound:latest
    volumes:
      - ./unbound:/opt/unbound/etc/unbound/custom
    restart: unless-stopped
    networks:
      dns_network:
networks:
  dns_network:
    driver: bridge
```

### Configure Unbound

1. Create the Unbound configuration file:

```bash
cat > unbound/custom.conf << EOF
server:
    verbosity: 1
    interface: 0.0.0.0
    port: 53
    do-ip4: yes
    do-udp: yes
    do-tcp: yes
    
    # May be set to yes if you have IPv6 connectivity
    do-ip6: no

    # Use DNSSEC
    harden-glue: yes
    harden-dnssec-stripped: yes
    use-caps-for-id: no
    edns-buffer-size: 1472
    prefetch: yes
    num-threads: 1
    so-rcvbuf: 1m
    private-address: 192.168.0.0/16
    private-address: 169.254.0.0/16
    private-address: 172.16.0.0/12
    private-address: 10.0.0.0/8
EOF
```

2. Download the root hints file:

```bash
curl -o unbound/root.hints https://www.internic.net/domain/named.root
```

### Configure dnsmasq for Pi-hole

Create a custom configuration file for dnsmasq to allow queries from all networks:

```bash
cat > dnsmasq/02-lan-access.conf << EOF
# Allow all interfaces
listen-address=0.0.0.0
bind-interfaces
domain-needed
bogus-priv
EOF
```

## Starting the Containers

Start the containers:

```bash
docker-compose up -d
```

## Configuring Pi-hole

Access the Pi-hole web interface at `http://host-server-ip/admin/` (password is what you set in docker-compose.yml).

### Important Pi-hole Settings

1. **DNS Settings**:
   - Go to Settings > DNS
   - Uncheck all upstream DNS providers
   - Make sure it shows your unbound container is set as the upstream DNS
   - Under Interface settings, select "Permit all origins" to allow queries from all networks

![DNS Settings Screenshot Placeholder]

2. **Domain Settings**:
   - Set your local domain (example: "playtime.lan")
   - Enable "Expand hostnames" if you want to use simple hostnames in your local network

![Pi-hole admin interface DNS settings showing upstream DNS server configuration for Unbound integration](/img/pihole-docker-dns1.png)

Custom settings, `unbound` is our upstream:

![Pi-hole custom DNS configuration panel with conditional forwarding and upstream resolver settings](/img/pihole-docker-dns2.png)

## Host Configuration

To prevent DNS leaks, configure your host server to use Pi-hole for DNS:

### Make /etc/resolv.conf Immutable

```bash
# Edit resolv.conf to use Pi-hole
echo "nameserver 127.0.0.1" | sudo tee /etc/resolv.conf

# Make it immutable to prevent DHCP from changing it
sudo chattr +i /etc/resolv.conf
```

### Configure dhclient

:::warning
If you don't prevent DHCP from overwriting your DNS settings, your host might revert to using external DNS providers, causing DNS leaks.
:::

```bash
sudo vim /etc/dhcp/dhclient.conf
```

Add:

```
supersede domain-name-servers 127.0.0.1;
```

### Configure Docker DNS

Create or edit `/etc/docker/daemon.json`:

```bash
sudo vim /etc/docker/daemon.json
```

Add:

```json
{
  "dns": ["127.0.0.1"]
}
```

Restart Docker:

```bash
sudo systemctl restart docker
```

## Network Configuration

Configure your DHCP server to provide your Pi-hole server's IP address as the DNS server for all clients.

## Auto-start on Boot

Create a systemd service to auto-start the containers on boot:

```bash
sudo vim /etc/systemd/system/pihole-docker.service
```

Add:

```
[Unit]
Description=Pi-hole Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/piholeuser/pihole
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down

[Install]
WantedBy=multi-user.target
```

Enable the service:

```bash
sudo systemctl enable pihole-docker.service
```

## Testing

### Verify DNS Resolution

```bash
# Check if Pi-hole is using Unbound
docker exec -it pihole nslookup example.com unbound

# Test from another device
nslookup example.com your-pihole-ip
```

## Block Lists

Now that you've got the stock standard installation going, you want to add your choice of block lists. I use the following from [HaGeZi's](https://github.com/hagezi/dns-blocklists)

```text
https://raw.githubusercontent.com/hagezi/dns-blocklists/refs/heads/main/domains/pro.plus.txt
https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts
```

:::tip 

You can use regex lists if you follow my howto here: `COMING SOON`

:::

### Check for DNS Leaks

Visit [DNSLeakTest.com](https://dnsleaktest.com) and run a standard test. If set up correctly, you should only see your ISP's servers, not Google or other public DNS providers.

Success!! ...

but only if you see 1x ISP there and it's yours.

![DNS leak test results showing successful privacy configuration with no DNS leaks detected](/img/pihole-docker-leak1.png)

## Troubleshooting

### Common Error: "ignoring query from non-local network"

This error occurs when Pi-hole refuses queries from networks it doesn't recognize as local.

:::danger
This is one of the most common and frustrating issues when setting up Pi-hole in Docker. The default settings prevent Pi-hole from responding to queries from networks **outside** its Docker network.
:::

**Solution**: In Pi-hole's web interface, go to Settings > DNS > Interface settings, and select "Permit all origins".

### Unbound Not Working

If Unbound fails to start or respond to queries:

1. Check Unbound logs:

```bash
docker logs unbound
```

2. Verify Unbound is listening:

```bash
docker exec -it unbound netstat -tulpn | grep LISTEN
```

3. Ensure your `custom.conf` file has the correct configuration.

### Pi-hole Container Permission Issues

If you encounter permission errors when starting Pi-hole:

1. Check ownership of your volume directories:

```bash
sudo chown -R 1001:1001 ~/pihole/pihole
sudo chown -R 1001:1001 ~/pihole/dnsmasq
sudo chown -R 1001:1001 ~/pihole/unbound
```

2. Set appropriate permissions:

```bash
sudo chmod -R 755 ~/pihole/pihole
sudo chmod -R 755 ~/pihole/dnsmasq
sudo chmod -R 755 ~/pihole/unbound
```

### Pihole Gravity Lists Errors

If you get something like this when you try to run `pihole -g` or the `Update Gravity` links in the web-ui

```text
[i] Target: https://raw.githubusercontent.com/hagezi/dns-blocklists/refs/heads/main/wildcard/nsfw.txt
  [✓] Status: No changes detected
  [✓] Parsed 0 exact domains and 0 ABP-style domains (blocking, ignored 75907 non-domain entries)
      Sample of non-domain entries:
        - *.0-porno.com
        - *.0000sex.com
        - *.000freeproxy.com
        - *.000pussy69pornxxxporno.com
        - *.000webhostapp.co
```

it's because you're using a list that PiHole can't process, either becuase its for a DNSMASQ client or otherwise.

:::tip

One of the big things getting this working, was things like `docker-compose.yml` bind mounts not doing what I expected, possibly being mapped to the wrong places and the container not finding it, using defaults and me being oblivious to it and assuming the config took.

Big lesson, same lessons - config, apply, verify. Lots of reading the `docker logs unbound` and `docker logs pihole` to ensure it was going what I expected, before moving on or making changes.

Also, in the age of AI (this was an assisted task) critique and verify your ai assistants suggestions and configs.

:::

:::note

This post was a [Claude.AI](https://claude.ai/new) collaboration, where I worked in a chat with Claude, designing and implementing this setup, often disagreeing and calling off various rabbitholes being ventured. What's nice is, I just ask Claude to summarise and document the work we did, and I review it and post it here.

:::

## Additional Notes

- Regularly update your blocklists in Pi-hole using the Gravity update feature
- Monitor DNS traffic using Pi-hole's built-in graphs and reports
- Consider adding additional block lists for enhanced protection

## References

- [Pi-hole Documentation](https://docs.pi-hole.net/)
- [Unbound Documentation](https://nlnetlabs.nl/documentation/unbound/)
- [Docker Documentation](https://docs.docker.com/)

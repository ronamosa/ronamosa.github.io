---
title: "Proxmox pmxcfs Rollback: When Pi-hole Disappears After a Power Failure (Part 1)"
description: "Diagnosing a Proxmox pmxcfs cluster filesystem rollback after a power outage that caused Docker and Pi-hole to vanish from a VM. Covers investigation, root cause analysis, and recovery strategy for orphaned VM disks."
keywords: ["proxmox pmxcfs", "proxmox cluster rollback", "proxmox power failure recovery", "docker disappeared proxmox", "pi-hole recovery", "proxmox corosync single node", "vm configuration loss", "qcow2 orphaned disk", "proxmox troubleshooting", "home lab disaster recovery"]
tags: ["proxmox", "pmxcfs", "troubleshooting", "docker", "home-lab"]
sidebar_position: 5
---

This post documents a real failure in a home-lab environment where a power outage caused a **Proxmox cluster rollback**, resulting in an apparently vanished Pi-hole + Docker deployment.
The VM survived, the disks were intact — but Docker was gone.

## Environment Overview

| Component | Details |
|------------|----------|
| **Hypervisor** | Proxmox VE 7.x |
| **Cluster history** | Two nodes (`pve1`, `pve2`), later "broken" to operate only `pve2` |
| **Storage backend** | Synology NAS over NFS (`SynoNFS1`) |
| **Workload** | Pi-hole in Docker via `docker-compose` |
| **Guest OS** | Ubuntu 22.04 LTS |
| **VM ID** | 200 (DNS Server) |

## Incident Summary

After a power failure:

- Proxmox host `pve2` booted normally.
- VM 200 (Pi-hole) booted.
- Pi-hole binary existed under `/opt/pihole`.
- **Docker was missing**: no binary, no service, no containers.
- `/etc/pihole` still held configuration and lists.

At face value, the Pi-hole VM looked freshly installed.
The logical question: *how can Docker vanish while the VM itself remains intact?*

## Investigation Process

### 1. Verify Host and VM Status

```bash
root@pve2:~# qm list
 VMID NAME STATUS MEM(MB) BOOTDISK(GB)
  200 DNS  running 2048 32.00
```

The VM was present and healthy.

### 2. Inspect VM Configuration

```ini
root@pve2:~# qm config 200
boot: order=scsi0;net0
cores: 1
memory: 2048
scsi0: SynoNFS1:200/vm-200-disk-0.qcow2,iothread=1,size=32G
```

Only a single disk (`scsi0`) was attached — no `scsi1:` entry for Docker data.

### 3. Check Storage

```bash
root@pve2:~# pvesm list SynoNFS1
Volid Format Type Size VMID
SynoNFS1:200/vm-200-disk-0.qcow2 qcow2 images 34359738368 200
```

No secondary disks existed.

### 4. Check Mounts and fstab Inside the VM

```bash
root@dns:/etc# findmnt
root@dns:/etc# cat /etc/fstab
```

No NFS or CIFS mounts.
Docker data wasn't stored on a NAS mount.

### 5. Examine Cluster State

```bash
root@pve2:~# pvecm status
Cluster information
-------------------
Name:             DarkMox
Nodes:            1
Expected votes:   1
Quorate:          Yes
```

and later:

```bash
root@pve2:~# ls -l /etc/pve
-rw-r----- 1 root www-data  308 Apr 29 2023 storage.cfg
```

:::danger[Smoking Gun]
The `storage.cfg` timestamp (2023) was far older than any recent change — clear evidence that **pmxcfs reloaded an outdated cluster database** after the power loss.
:::

## Architecture and Failure Flow

```mermaid
flowchart LR
    NAS[(Synology NFS)]
    VM200[(VM 200 – Ubuntu + Pi-hole)]
    Docker[(Docker Engine + Compose)]
    Disk0[/vm-200-disk-0.qcow2/]
    Disk1[/vm-200-disk-1.qcow2 (Docker data)/]
    PVE1[Proxmox pve1]
    PVE2[Proxmox pve2]

    NAS --> PVE1
    NAS --> PVE2
    PVE1 -. cluster sync .-> PVE2
    PVE2 --> VM200
    VM200 --> Disk0
    VM200 --> Docker
    Docker --> Disk1

    style PVE1 fill:#bfb,stroke:#060
    style PVE2 fill:#bbf,stroke:#006
    style Disk1 fill:#fbb,stroke:#900,stroke-width:2px
    note right of Disk1: "Docker data likely resides here\n(on pve1 or detached)"
```

:::warning[Root Cause]
When the cluster broke and `pve1` was taken offline, `pve2` kept operating but its pmxcfs copy froze in time. After the outage, pmxcfs reloaded that stale snapshot — losing any config lines added after the split (such as the second Docker disk).
:::

## Attempted Diagnostics

### Disk Comparison

```bash
root@pve2:~# find /mnt/pve -type f -name "*.qcow2"
...
/mnt/pve/SynoNFS1/images/106/vm-106-disk-0.qcow2 18237576 KB
/mnt/pve/SynoNFS1/images/101/vm-101-disk-0.qcow2 13027292 KB
/mnt/pve/SynoNFS1/images/200/vm-200-disk-0.qcow2 15359284 KB
/mnt/pve/SynoNFS1/images/102/vm-102-disk-0.qcow2 160641156 KB
```

All disks had 32 GiB provisioned but different physical sizes — normal for qcow2's sparse allocation.
No `*-disk-1` files found.

### Search for Mounts or Docker Data

```bash
root@dns:/etc# grep -R "nfs\|cifs" /etc
root@dns:/etc# find / -maxdepth 3 -name "docker-compose.yml"
```

Nothing found.

### Confirm Cluster Rollback

```bash
root@pve2:~# ls -lh /var/lib/pve-cluster/backup/
```

Old cluster backups existed; configs were last archived before the outage.

## Findings to Date

:::info[Key Takeaway]
This was not data loss — it was **configuration loss**. The data is not deleted, just **orphaned**.
:::

1. Proxmox's **cluster filesystem (pmxcfs)** rolled back to an older configuration snapshot.
2. The VM (ID 200) lost the reference to its **secondary Docker disk**.
3. The disk still exists — most likely **attached to pve1** or **present but unreferenced** on the NAS.
4. Docker and compose directories therefore disappeared from inside the guest because the storage was never re-mounted.

## Next Steps (Part 2)

1. Boot `pve1` offline to inspect local volumes and `/var/lib/docker`.
2. Locate any orphaned disks (`vm-200-disk-1.qcow2` or similar).
3. Re-attach the disk to `pve2` using:

    ```bash
    qm set 200 --scsi1 SynoNFS1:200/vm-200-disk-1.qcow2
    qm start 200
    ```

4. Convert `pve2` fully to **standalone mode** (remove Corosync, disable cluster).
5. Implement **local backups of `/etc/pve/qemu-server/*.conf`** to prevent silent rollbacks.

## Temporary DNS Restoration

:::tip[Quick Recovery]
While investigation continues, Pi-hole can operate natively or be redeployed in Docker using the preserved `/etc/pihole` config.
:::

Run Pi-hole directly:

```bash
systemctl enable --now pihole-FTL
```

Or redeploy in Docker using the preserved config:

```bash
apt-get update && apt-get install -y docker.io docker-compose-plugin
mkdir -p /srv/pihole/etc-pihole /srv/pihole/etc-dnsmasq.d
cp -a /etc/pihole/* /srv/pihole/etc-pihole/
cp -a /etc/dnsmasq.d/* /srv/pihole/etc-dnsmasq.d/
```

```yaml title="docker-compose.yml"
services:
  pihole:
    image: pihole/pihole:latest
    restart: unless-stopped
    network_mode: "host"
    environment:
      TZ: Pacific/Auckland
      WEBPASSWORD: "changeme"
    volumes:
      - /srv/pihole/etc-pihole:/etc/pihole
      - /srv/pihole/etc-dnsmasq.d:/etc/dnsmasq.d
```

```bash
docker compose -f /srv/pihole/docker-compose.yml up -d
```

## Lessons Learned (So Far)

| Area | Observation | Recommendation |
|---|---|---|
| **Cluster hygiene** | Broken 2-node clusters leave pmxcfs prone to rollback after power loss. | Fully remove Corosync when operating single-node. |
| **Config persistence** | VM configs live in pmxcfs RAM; old versions can reload silently. | Periodically back up `/etc/pve/qemu-server/`. |
| **Storage layout** | Docker on secondary or NAS volumes can "disappear" if attachments vanish. | Keep Docker data on a VM-local disk, bind-mount only application data. |
| **Startup order** | VMs dependent on NAS volumes can race on boot. | Use `x-systemd.automount` and set Proxmox start order. |

## References

- [Proxmox VE Cluster File System (pmxcfs) Documentation](https://pve.proxmox.com/wiki/Proxmox_Cluster_File_System_\(pmxcfs\))
- [Proxmox VE Cluster to Standalone Conversion Guide](https://pve.proxmox.com/wiki/Cluster_Manager#_remove_a_node_from_the_cluster)
- [Pi-hole Docker Deployment Docs](https://github.com/pi-hole/docker-pi-hole)
- [NFS Storage Best Practices for Proxmox VE](https://pve.proxmox.com/wiki/Storage:_NFS)

---

**Part 2** will cover disk recovery, validation, and the final architecture after remediation.

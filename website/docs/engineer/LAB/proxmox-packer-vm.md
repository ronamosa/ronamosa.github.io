---
title: "Proxmox: Create a Cloud-Init VM using Hashicorp Packer"
---

On proxmox

### create packer user

1. add packer user (ve)
2. create group Packer
3. add Group Permissions (PVEAdmin) to group Packer
4. add user packer to group Packer

### create API token

use new `packer` user, API Token, no expiry, copy secret.

ensure `Privilege Separation` is not checked, otherwise this token doesn't get the packer users group permissions.

update file `proxmox-devops/packer/proxmox/credentials.pkr.hcl` with creds.

```sh
proxmox_api_url = "https://{proxmox.hostname}:8006/api2/json"  # Your Proxmox IP Address
proxmox_api_token_id = "packer@pve!packer"  # API Token ID
proxmox_api_token_secret = "{token_goes_here}"
```

## Packer Folder Structure

```bash
/ubuntu-server-version
--/files
--/files/99-pve.cfg
--/http

```

### packer validate

`packer validate -var-file='../credentials.pkr.hcl' ./ubuntu-server-focal.pkr.hcl`

### packer build

`packer build -var-file='../credentials.pkr.hcl' ./ubuntu-server-focal.pkr.hcl`






### Troubleshooting

Getting error `Timeout waiting for SSH.`

```bash
  ~/R/proxmox-devops/packer/proxmox/ubuntu-server-focal ❯ packer build -var-file='../credentials.pkr.hcl' ./ubuntu-server-focal.pkr.hcl                     took  20m 24s at  23:33:03
ubuntu-server-focal.proxmox.ubuntu-server-focal-template: output will be in this color.

==> ubuntu-server-focal.proxmox.ubuntu-server-focal-template: Creating VM
==> ubuntu-server-focal.proxmox.ubuntu-server-focal-template: Starting VM
==> ubuntu-server-focal.proxmox.ubuntu-server-focal-template: Starting HTTP server on port 8802
==> ubuntu-server-focal.proxmox.ubuntu-server-focal-template: Waiting 5s for boot
==> ubuntu-server-focal.proxmox.ubuntu-server-focal-template: Typing the boot command
==> ubuntu-server-focal.proxmox.ubuntu-server-focal-template: Waiting for SSH to become available...
==> ubuntu-server-focal.proxmox.ubuntu-server-focal-template: Timeout waiting for SSH.
==> ubuntu-server-focal.proxmox.ubuntu-server-focal-template: Stopping VM
==> ubuntu-server-focal.proxmox.ubuntu-server-focal-template: Deleting VM
Build 'ubuntu-server-focal.proxmox.ubuntu-server-focal-template' errored after 20 minutes 23 seconds: Timeout waiting for SSH.

==> Wait completed after 20 minutes 23 seconds

==> Some builds didn't complete successfully and had errors:
--> ubuntu-server-focal.proxmox.ubuntu-server-focal-template: Timeout waiting for SSH.

==> Builds finished but no artifacts were created.
```



### reverse shell qm

ran listener on desktop `rlwrap nc -lvnp 6666` and then tried to run `qm guest exec 101 'bash -c 'exec bash -i &>/dev/tcp/172.16.2.209/6666 <&1''` on proxmox host.

```bash



## References

- followed video by ["Christian Lempa"](https://www.youtube.com/watch?v=1nf3WOEFq1Y)
- "Agent not running issues", see [oliviermichaelis](https://github.com/hashicorp/packer-plugin-proxmox/issues/91) comment with the `late-commands`.
- proxmox qemu (qm) commands for diagnosing and troubleshooting vm disks and configs from proxmox host.
- [autoinstall docs](https://ubuntu.com/server/docs/install/autoinstall)
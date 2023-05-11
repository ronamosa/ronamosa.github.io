---
title: "Proxmox: Create a cloud-init Template VM with Packer."
---

I wanted to setup IaC for my home lab Proxmox server to create VM templates first using Packer, and then Terraform for deploying 3-node K8s clusters for demos and learning. I originally followed ["Christian Lempa"](https://www.youtube.com/watch?v=1nf3WOEFq1Y) video and [boilerplates](https://github.com/ChristianLempa/boilerplates/tree/main/packer/proxmox), but couldn't get them to work so went on a long winding journey trying different configs and reading up on cloud-config, autoinstall and read a bunch of other blogs.

I got it to finally work, which came back to almost the original configs by Christian, but with a lot more understanding.

## Packer Process

Quick overview step-by-step of what's happening in the process

1. `packer` calls proxmox endpoint, using API Token (`variables.pkr.hcl`) and a VM template definition file (`ubuntu-server-focal.pkr.hcl`), and then `WAIT` for `SSH to become available...`
2. a VM is create on proxmox
3. the VM pulls down `NFS-SERVER:iso/ubuntu-20.04.3-live-server-amd64.iso` and begins the install
4. with `cloud-init=true` the VM will boot and run the `boot_command` to pull down the initial configuration for the blank VM
5. packer will start a web server on the client machine, to serve the `http/user-data` file for the proxmox VM to download
6. this line `autoinstall ds=nocloud-net;s=http://{{ .HTTPIP }}:{{ .HTTPPort }}/` in the `boot_command` tells the VM where to get the init configs
7. the `http/user-data` config will install openssh, and create user `rxhackk` with public key auth enabled.
8. when the VM finishes intial install, it will reboot.
9. once rebooted, `packer` will ssh into the newly created, rebooted VM, and run the commanmds in `provisioner "shell" { inline =[` (or at least this is what I think it's doing after the reboot and requies a working ssh connection)
10. when commands are finished, proxmox shuts down the completed VM and converts it into "template" format.

## Key Concept

The key thing to understand in lining everything up to work, is the usernames for Packer ssh to connect to the new VM and provision things.

In `http/user-data` you set the openssh server to install itself, disable root, allow public key authN:

```yaml
  ssh:
    install-server: true
    allow-pw: true
    disable_root: true
    ssh_quiet_keygen: true
    allow_public_ssh_keys: true
```

And then further down in `http/user-data` you configure the user inside the cloud-config'd VM template, that will allow Packer to ssh into the VM as, i.e. `rxhackk`. note the `sudo` config to allow this user to run the `inline` commands in the `ubuntu-server-focal.pkr.hcl` file that needs root privs:

```yaml
  user-data:
    package_upgrade: false
    timezone: Pacific/Auckland
    users:
      - name: rxhackk
        groups: [adm, sudo]
        lock-passwd: false
        sudo: ALL=(ALL) NOPASSWD:ALL
        shell: /bin/bash
        ssh_authorized_keys:
          - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDqGjvb1c8rfv2bYNnQaRn8ggOBAUhK5jUhZUTr3dEgZDKl88leX5yBG1RWQOfc/ka/rlv6VrjuwRjy+EB1f98L9bU4JklM+/6iNqka57wrQmWIo852wK7shoDdbz55vIjdcw9S6ok11EYI39FNlVex0IYbhOlEoh/M1b0s= rxhackk@Computer
```

That `ssh_authorized_keys` is the public key `~/.ssh/id_rsa.pub` for our user rxhackk.

And finally, to tie it all together, in `ubuntu-server-focal.pkr.hcl` we specify this user we have setup in `user-data` as the user to SSH to the VM as, and this user will ssh from our local machine running the packer command, into the proxmox VM template that's running:

```yaml
    # PACKER SSH Settings
    ssh_username = "rxhackk"
    ssh_private_key_file = "~/.ssh/id_rsa"
```

## Proxmox Setup

### create packer user

1. add packer user (ve)
2. create group Packer
3. add Group Permissions (PVEAdmin) to group Packer
4. add user packer to group Packer

### create API token

use new `packer` user, API Token, no expiry, copy secret.

ensure `Privilege Separation` is not checked, otherwise this token doesn't get the packer users group permissions.

update file `proxmox-devops/packer/proxmox/variables.pkr.hcl` with creds.

```sh
# Your Proxmox IP Address
proxmox_api_url = "https://{proxmox.hostname}:8006/api2/json"

# API Token ID
proxmox_api_token_id = "packer@pve!packer"

# API Token Secret
proxmox_api_token_secret = "{token_goes_here}"
```

## Packer Folder Structure

Each OS VM template folder, e.g. `ubuntu-server-focal` laid out like this:

```bash
└── ubuntu-server-focal
    ├── files
    │   └── 99-pve.cfg
    ├── http
    │   ├── meta-data
    │   └── user-data
    ├── ubuntu-server-focal.pkr.hcl
    └── variables.pkr.hcl
```

### variables.pkr.hcl

This variables file holds our creds, and presumably other vars to inject into our vm template below:

```json
proxmox_api_url = "https://${proxmox.host}:8006/api2/json"
proxmox_api_token_id = "packer@pve!packer"
proxmox_api_token_secret = "1692cd56-e9aa-413e-9637-84debaa9eff7"
```

:::note
I'm not sold this is the best format after seeing JSON based configs in some blogs that seem a lot simpler.
:::

### ubuntu-server-focal.pkr.hcl

```json
# Ubuntu Server Focal
# ---
# Packer Template to create an Ubuntu Server (Focal) on Proxmox

# Variable Definitions
variable "proxmox_api_url" {
    type = string
}

variable "proxmox_api_token_id" {
    type = string
}

variable "proxmox_api_token_secret" {
    type = string
    sensitive = true
}

# Resource Definition for the VM Template
source "proxmox" "ubuntu-server-focal-template" {
 
    # Proxmox Connection Settings
    proxmox_url = "${var.proxmox_api_url}"
    username = "${var.proxmox_api_token_id}"
    token = "${var.proxmox_api_token_secret}"
    insecure_skip_tls_verify = true
    
    # VM General Settings
    node = "pve1"
    vm_id = "500"
    vm_name = "ubuntu-server-focal-template"
    template_description = "Ubuntu Server Focal (22.04) Image"

    # VM OS Settings
    # (Option 1) Local ISO File
    iso_file = "NFS-SERVER:iso/ubuntu-20.04.3-live-server-amd64.iso"

    # - or -
    # (Option 2) Download ISO
    # iso_url = "https://releases.ubuntu.com/20.04/ubuntu-20.04.3-live-server-amd64.iso"
    # iso_checksum = "f8e3086f3cea0fb3fefb29937ab5ed9d19e767079633960ccb50e76153effc98"
    
    iso_storage_pool = "local"
    unmount_iso = true

    # VM System Settings
    qemu_agent = true

    # VM Hard Disk Settings
    scsi_controller = "virtio-scsi-pci"

    disks {
        disk_size = "20G"
        format = "raw"
        storage_pool = "local-lvm"
        storage_pool_type = "lvm"
        type = "virtio"
    }

    # VM CPU Settings
    cores = "1"
    
    # VM Memory Settings
    memory = "4096" 

    # VM Network Settings
    network_adapters {
        model = "virtio"
        bridge = "vmbr0"
        firewall = "false"
    } 

    # VM Cloud-Init Settings
    cloud_init = true
    cloud_init_storage_pool = "local-lvm"

    # PACKER Boot Commands
    boot_command = [
        "<esc><wait><esc><wait>",
        "<f6><wait><esc><wait>",
        "<bs><bs><bs><bs><bs>",
        "autoinstall ds=nocloud-net;s=http://{{ .HTTPIP }}:{{ .HTTPPort }}/ ",
        "--- <enter>"
    ]
    boot = "c"
    boot_wait = "5s"

    # PACKER Autoinstall Settings
    http_directory = "http" 
    http_bind_address = "172.16.2.209"
    http_port_min = 8802
    http_port_max = 8802

    # PACKER SSH Settings
    ssh_username = "rxhackk"
    ssh_private_key_file = "~/.ssh/id_rsa"

    # Raise the timeout, when installation takes longer
    ssh_timeout = "55m"
}

# Build Definition to create the VM Template
build {

    name = "ubuntu-server-focal"
    sources = ["source.proxmox.ubuntu-server-focal-template"]

    # Provisioning the VM Template for Cloud-Init Integration in Proxmox #1
    provisioner "shell" {
        inline = [
            "while [ ! -f /var/lib/cloud/instance/boot-finished ]; do echo 'Waiting for cloud-init...'; sleep 1; done",
            "sudo rm /etc/ssh/ssh_host_*",
            "sudo truncate -s 0 /etc/machine-id",
            "sudo apt -y autoremove --purge",
            "sudo apt -y clean",
            "sudo apt -y autoclean",
            "sudo cloud-init clean",
            "sudo rm -f /etc/cloud/cloud.cfg.d/subiquity-disable-cloudinit-networking.cfg",
            "sudo sync"
        ]
    }

    # Provisioning the VM Template for Cloud-Init Integration in Proxmox #2
    provisioner "file" {
        source = "files/99-pve.cfg"
        destination = "/tmp/99-pve.cfg"
    }

    # Provisioning the VM Template for Cloud-Init Integration in Proxmox #3
    provisioner "shell" {
        inline = [ "sudo cp /tmp/99-pve.cfg /etc/cloud/cloud.cfg.d/99-pve.cfg" ]
    }
}
```

### http/user-data

Packer will run a webserver for the proxmox host to connect to and download the following `user-data` file to configure cloud-init for the new template vm.

This version creates no default user, but sets up my own personal user under `user-data` with authorized keys (pub), and this user will correspond to the `ssh_username` and `ssh_password` in `ubuntu-server-focal.pkr.hcl` to be used by packer to SSH and run the `inline` statement:

```yaml
#cloud-config
autoinstall:
  version: 1
  locale: en_US
  keyboard:
    layout: us
  updates: security
  apt:
    disable_suites: [security]
  ssh:
    install-server: true
    allow-pw: true
    disable_root: true
    ssh_quiet_keygen: true
    allow_public_ssh_keys: true
  packages:
    - qemu-guest-agent
    - sudo
  storage:
    layout:
      name: direct
    swap:
      size: 0
  user-data:
    package_upgrade: false
    timezone: Pacific/Auckland
    users:
      - name: rxhackk
        groups: [adm, sudo]
        lock-passwd: false
        sudo: ALL=(ALL) NOPASSWD:ALL
        shell: /bin/bash
        ssh_authorized_keys:
          - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDqGjvb1c8rfv2bYNnQaRn8ggOBAUhK5jUhZUTr3dEgZDKl88leX5yBG1RWQOfc/ka/rlv6VrjuwRjy+EB1f98L9bU4JklM+/6iNqka57wrQmWIo852wK7shoDdbz55vIjdcw9S6oVx1EYI39FNlVex0IYbhOlEoh/M1b0s= rxhackk@Computer
```

## Deploy

### packer validate

`packer validate -var-file='./variables.pkr.hcl' ./ubuntu-server-focal.pkr.hcl`

### packer build

`packer build -var-file='./variables.pkr.hcl' ./ubuntu-server-focal.pkr.hcl`

### Troubleshooting

Getting error `Timeout waiting for SSH.`

```bash
  ~/R/proxmox-devops/packer/proxmox/ubuntu-server-focal ❯ packer build -var-file='../variables.pkr.hcl' ./ubuntu-server-focal.pkr.hcl                     took  20m 24s at  23:33:03
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

checked logs:

```text
May  6 04:25:56 ubuntu-focal sshd[2336]: Invalid user rxhackk from 172.16.2.209 port 35030
May  6 04:25:56 ubuntu-focal sshd[2336]: Connection closed by invalid user rxhackk 172.16.2.209 port 35030 [preauth]
May  6 04:26:03 ubuntu-focal sshd[2339]: error: kex_exchange_identification: Connection closed by remote host
May  6 04:26:03 ubuntu-focal sshd[2340]: Invalid user rxhackk from 172.16.2.209 port 34800
May  6 04:26:03 ubuntu-focal sshd[2340]: Connection closed by invalid user rxhackk 172.16.2.209 port 34800 [preauth]


/var/log/auth.log
```

### reverse shell qm

ran listener on desktop `rlwrap nc -lvnp 6666` and then tried to run `qm guest exec 101 'bash -c 'exec bash -i &>/dev/tcp/172.16.2.209/6666 <&1''` on proxmox host.

## References

- "Agent not running issues", see [oliviermichaelis](https://github.com/hashicorp/packer-plugin-proxmox/issues/91) comment with the `late-commands`.
- proxmox qemu (qm) commands for diagnosing and troubleshooting vm disks and configs from proxmox host.
- Ubuntu [autoinstall docs](https://ubuntu.com/server/docs/install/autoinstall)
- Packer [proxmox clone docs](https://developer.hashicorp.com/packer/plugins/builders/proxmox/clone)
- [What a golden boy – Use Packer to build Proxmox images](https://thedatabaseme.de/2022/10/16/what-a-golden-boy-use-packer-to-build-proxmox-images/) -- great reference for configs.

## Appendix

This `cloud-config` version create an `ubuntu` user with `ubuntu` password, encrypted format via `mkpasswd`

```yaml
#cloud-config
autoinstall:
  version: 1
  locale: en_US
  keyboard:
    layout: us
  identity:
    realname: 'Ubuntu User'
    username: ubuntu
    password: '$y$j9T$Ht7UYyr0iHxvPC9gzZQCl1$mQe.T8pfy6ThzlbEULE0fk71zdofPwKaiZFF0l4VUT1'
    hostname: ubuntu-focal
  ssh:
    install-server: true
    allow-pw: true
  packages:
    - qemu-guest-agent
    - sudo
  storage:
    layout:
      name: direct
    swap:
      size: 0
```

the identity password needs to be in an encrypted format, use `mkpasswd` to create your password in a valid format. the `#cloud-config` at the start is a requirement for the file to be recognised as a valid cloud-init config file.

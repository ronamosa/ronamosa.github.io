---
title: "Proxmox: Deploying Infrastructure with Terraform"
---

Nerd-sniped by someone in the PTN playing with this, so I decided to give it a go. Objective is to create an OPNsense Firewall VM, in proxmox, using the terraform proxmox provider.

:::info terraform proxmox provider
docs: [https://registry.terraform.io/providers/Telmate/proxmox/latest/docs](https://registry.terraform.io/providers/Telmate/proxmox/latest/docs)
:::

## Proxmox Setup

### User Setup

SSH into your PVE host, and run the following commands to create a role, a user, and associate them together:

```bash
# 1. Create Role

pveum role add TerraformProv -privs "Datastore.AllocateSpace Datastore.Audit Pool.Allocate Sys.Audit Sys.Console Sys.Modify VM.Allocate VM.Audit VM.Clone VM.Config.CDROM VM.Config.Cloudinit VM.Config.CPU VM.Config.Disk VM.Config.HWType VM.Config.Memory VM.Config.Network VM.Config.Options VM.Migrate VM.Monitor VM.PowerMgmt"

# 2. Create User
# - note the command balks at special characters in the terminal
# - ended up resetting to strong password via GUI

pveum user add terraform-prov@pve --password <password />

# 3. Associate Role & User
pveum aclmod / -user terraform-prov@pve -role TerraformProv
```

### API Token

From the proxmox GUI, create an API Token for the `terraform-prov` user.

note: ensure "privilege separation" for your API Token is disabled or terraform will error out later on:

![pve disable priv separation](/img/pve-priv-separate.png)

## Terraform Setup

Use the proxmox credentials we've created, with the cli tool to authenticate to the proxmox environment.

### cli using password

couple of options:

pass through via environment variables:

```bash
export PM_USER="terraform-prov@pve"
export PM_PASS="password"
```

or use Hashicorp Vault, but don't hard code them in `main.tf` even if you can.

setup provider:

```bash
provider "proxmox" {
  pm_api_url = "https://proxmox-server01.example.com:8006/api2/json"
}
```

### cli with API token

create a token via GUI, example below is token name `infra` and token value `9f526660-eda2-4696-XXXX-33ea3e8691e7`

```bash
export PM_API_TOKEN_ID='terraform-prov@pve!infra'
export PM_API_TOKEN_SECRET="9f526660-eda2-4696-XXXX-33ea3e8691e7"
```

:::tip

For your `PM_API_TOKEN_ID` value, with special characters, use single quotes `'` for zsh to escape the `!`

:::

and same provider

```bash
provider "proxmox" {
  pm_api_url = "https://proxmox-server01.example.com:8006/api2/json"
}
```

## Download OPNsense ISO

1. Download dvd iso here: [OPNsense download](https://opnsense.org/download/) (pick a local mirror)
2. Unzip in your local `bzip2 -d OPNsense-23.7-dvd-amd64.iso.bz2`
3. Upload to your PVE storage ![pve upload](/img/pve-upload.png)
4. Confirm its in your PVE host: ![pve confirm](/img/pve-upload-dir.png)

OPNsense should be good to go as the target OS for this post.

## Terraform Code

The following two files is all you need create the OPNsense QEMU VM on proxmox.

### providers.tf

```hcl
terraform {
  required_version = ">= 0.15"
  required_providers {
    proxmox = {
      source = "telmate/proxmox"
    }
  }
}

provider "proxmox" {
  # pm_debug = true
  # pm_tls_insecure = true

  pm_api_url = "https://$\{PROXMOX_HOST}:8006/api2/json"
}
```

### main.tf

```hcl
resource "proxmox_vm_qemu" "firewall" {
  name        = "OPNsenseFW"
  desc        = "OPNsense Firewall"
  target_node = "pve1"
  iso         = "SynoNFS1:iso/OPNsense-23.7-dvd-amd64.iso"
  os_type     = "Linux"
  cores       = 2
  sockets     = 1
  memory      = 2048
  scsihw      = "virtio-scsi-single"
  bootdisk    = "scsi0"

  disk {
    slot = 0
    # set disk size here. leave it small for testing because expanding the disk takes time.
    size     = "10G"
    type     = "scsi"
    storage  = "SynoNFS1"
    iothread = 1
  }

  network {
    model  = "virtio"
    bridge = "vmbr0"
  }

  ### or for a PXE boot VM operation
  # pxe = true
  # boot = "scsi0;net0"
  # agent = 0
}
```

### Execute: init, plan, apply

Setup your credentials in the terminal, ready for `terraform`, here I'm using API tokens:

```bash
export PM_API_TOKEN_ID='terraform-prov@pve!infra'
export PM_API_TOKEN_SECRET="9f526660-eda2-4696-XXXX-33ea3e8691e7"
```

Run:

```bash
terraform init
terraform plan
terraform apply
```

Success!

`terraform apply` ran to completion:

![cli success](/img/pve-qemu-success.png)

You can see the OPNsense VM is up & running:

![cli success](/img/pve-opn-100.png)

## Troubleshooting

Some errors and solutions from this adventure:

### Provider not found

trying to install Hashicorp/proxmox, gets me errors:

```bash
~/Repos/proxmox-terraform ❯ terraform init

Initializing the backend...

Initializing provider plugins...
- Finding latest version of hashicorp/proxmox...
╷
│ Error: Failed to query available provider packages
│
│ Could not retrieve the list of available versions for provider hashicorp/proxmox: provider registry registry.terraform.io does not have a provider named
│ registry.terraform.io/hashicorp/proxmox
│
│ All modules should specify their required_providers so that external consumers will get the correct providers when using a module. To see which modules are
│ currently depending on hashicorp/proxmox, run the following command:
│     terraform providers
```

solution: ensure the `proviers.tf` has `telemate/proxmox` as the provider- I skipped the very first step.

### API token reference in code

:::notes Docs

documentation [here](https://github.com/Telmate/terraform-provider-proxmox/blob/master/docs/index.md#creating-the-connection-via-username-and-api-token)

:::

this is the hard-coded option (not recommended)

```bash
provider "proxmox" {
  pm_api_url = "https://proxmox-server01.example.com:8006/api2/json"
  pm_api_token_id = "somehardcodedvalue@pam!zxzxzxzxzcxczxczxczxc"
  pm_api_token_secret = "zxxxxzxzxxzxzxzxzxzx"
}
```

use environment variables

```bash
export PM_API_TOKEN_ID="terraform-prov@pve!mytoken"
export PM_API_TOKEN_SECRET="afcd8f45-acc1-4d0f-bb12-a70b0777ec11"
```

### 501 no such file '/json/access/users'

```bash
~/Repos/proxmox-terraform ❯ terraform plan                                                                                                            13:56:59

Planning failed. Terraform encountered an error while generating this plan.

╷
│ Error: 501 no such file '/json/access/users'
│
│   with provider["registry.terraform.io/telmate/proxmox"],
│   on providers.tf line 10, in provider "proxmox":
│   10: provider "proxmox" {
│
╵
```

turn on TF Debugging:

```bash
~/Repos/proxmox-terraform ❯ export TF_LOG="DEBUG"
```

logs

```bash
2023-09-23T15:56:31.415+1200 [ERROR] provider.terraform-provider-proxmox_v2.9.14: Response contains error diagnostic: diagnostic_summary="501 no such file '/json/access/users'" tf_provider_addr=registry.terraform.io/telmate/proxmox @caller=github.com/hashicorp/terraform-plugin-go@v0.14.3/tfprotov5/internal/diag/diagnostics.go:55 diagnostic_severity=ERROR tf_proto_version=5.3 tf_req_id=6fdfb1a2-9992-79d4-a33b-c2d4f441c2ba tf_rpc=Configure @module=sdk.proto diagnostic_detail= timestamp=2023-09-23T15:56:31.414+1200
2023-09-23T15:56:31.416+1200 [ERROR] vertex "provider[\"registry.terraform.io/telmate/proxmox\"]" error: 501 no such file '/json/access/users'
2023-09-23T15:56:31.417+1200 [INFO]  backend/local: plan operation completed
```

solution: I had

```bash
provider "proxmox" {
  pm_api_url = "https://pve1.darksyde.lan:8006//api2/json" #
}
```

instead of

```bash
provider "proxmox" {
  pm_api_url = "https://pve1.darksyde.lan:8006/api2/json"
}
```

### privilege separation error

check the box is disabled when creating your API token (see above), or you get this error:

```bash
Planning failed. Terraform encountered an error while generating this plan.

╷
│ Error: user terraform-prov@pve has valid credentials but cannot retrieve user list, check privilege separation of api token
│
│   with provider["registry.terraform.io/telmate/proxmox"],
│   on providers.tf line 10, in provider "proxmox":
│   10: provider "proxmox" {
│
```


![pve error priv separation](/img/pve-error-priv-sep.png)

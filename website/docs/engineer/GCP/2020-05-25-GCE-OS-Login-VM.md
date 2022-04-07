---
title: "Setup Google Compute Engine VM to ssh using OS Login."
---

:::info

Published Date: 25-MAY-2020

:::

A quick setup for when you're firing up GCE VM's and dont have to worry about managing and organizing ssh keys to jump into any of them. Setup OS Login for the project and any instance launched automatically allows access with the configure keys (obviously check your security needs).

## Objective

To have a simple GCE VM instance you can ssh to easily with the same SSH key to any instance stood up in the project (can disble project-wide enable and do it per-instance using `gcloud`)

We will be using terraform to do the following:

* Setup a simple GCE VM
* Configure IAM for users to use OS Login method for managing ssh keys

Manually upload ssh keys to GCP using `gcloud`

## Google API permissions

You will need the following google api's enabled if you haven't already:

* cloudapis.googleapis.com             Google Cloud APIs
* cloudresourcemanager.googleapis.com  Cloud Resource Manager API
* compute.googleapis.com               Compute Engine API
* oslogin.googleapis.com               Cloud OS Login API

e.g.

find service `gcloud services list --available`, enable with: `gcloud services enable cloudresourcemanager.googleapis.com`

## GCP Service Account

For terraform, I created a service account to run commands as `terrform` user.

Use this bash script to create a service account and a `account.json` file for that user:

```bash
#!/usr/bin/env bash

project="<your_project_name>"

gcloud iam service-accounts create terraform \
    --display-name "Terraform Service Account" \
    --description "Service account to use with Terraform"

echo "Create IAM policy binding for the Terraform service account"
gcloud projects add-iam-policy-binding "${project}" \
  --member serviceAccount:"terraform@${project}.iam.gserviceaccount.com" \
  --role roles/editor

echo "Create IAM service policy key 'account.json'"
gcloud iam service-accounts keys create account.json \
    --iam-account "terraform@${project}.iam.gserviceaccount.com"
```

## Terraform

Now that we have our `account.json` key file for our `terraform` service account we can look at the following `main.tf` file

### main.tf

```terraform
provider "google" {
  credentials = "${file("account.json")}"
  project = "<your_project_name>"
  region  = "us-east1"
}

resource "google_compute_instance" "demo" {
  name         = "oslogin-demo"
  machine_type = "n1-standard-1"
  zone         = "us-east1-c"

  tags = ["vm", "login"]

  scheduling{
    on_host_maintenance = "TERMINATE"
  }

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-1604-lts"
      size = 50
    }
  }

  network_interface {
    network = "default"
    access_config {
    }
  }

  metadata = {
    foo = "bar"
  }
}
```

Super simple VM, based on ubuntu-16 LTS, all defaults.

Next let's look at the OS Login setup

### oslogin.tf

The two OS Login roles available are:

* roles/compute.osLogin (non-root)
* roles/compute.osAdminLogin (root available)

:::tip

_Your terraform user needs the `Project IAM Admin` role enabled to be able to admin IAM Policy._

:::

```bash
gcloud projects add-iam-policy-binding <your_project_name> \
  --member serviceAccount:terraform@<your_project_name>.iam.gserviceaccount.com \
  --role roles/resourcemanager.projectIamAdmin
```

Terraform for setting up OS Login

```terraform
resource "google_compute_project_metadata_item" "oslogin" {
  project = "<your_project_name>"
  key     = "enable-oslogin"
  value   = "TRUE"
}

resource "google_project_iam_member" "owner_binding" {
  project = "<your_project_name>"
  role    = "roles/compute.osAdminLogin"
  member  = "user:me@mydomain.com"
}
```

:::info

_I'm using my GCP account owner account as the one that's going to login to any GCE instances created in this project, so the syntax is `user:...` whereas if I were using a service account it would be e.g. `serviceAccount:terraform@${project}.iam.gserviceaccount.com`._

:::

### Upload your SSH keys

This is the important step, upload the PUBLIC KEY of the pair you want to use to ssh into the instances

e.g.

`gcloud compute os-login ssh-keys add --key-file ~/.ssh/ida_rsa.pub`

**this key will be associated with the GCLOUD USER you are logged in as i.e. not `terraform`**

For me, that was my GCP owner account on this project.

You can check your OS Login keys with this command: `gcloud compute os-login ssh-keys list` or checkout your profile with `gcloud compute os-login describe-profile`

## Build & SSH

Easy build, no remote statefile needed:

* `terraform init`
* `terraform apply`

build takes about 18s, output looks like this:

```bash
google_compute_project_metadata_item.oslogin: Creating...
google_project_iam_member.owner_binding: Creating...
google_compute_instance.demo: Creating...
google_compute_project_metadata_item.oslogin: Still creating... [10s elapsed]
google_project_iam_member.owner_binding: Still creating... [10s elapsed]
google_compute_instance.demo: Still creating... [10s elapsed]
google_project_iam_member.owner_binding: Creation complete after 13s [id=<your_project_name>/roles/compute.osAdminLogin/user:me@mydomain.com]
google_compute_project_metadata_item.oslogin: Creation complete after 14s [id=enable-oslogin]
google_compute_instance.demo: Creation complete after 18s [id=projects/<your_project_name>/zones/us-east1-c/instances/oslogin-demo]

```

Now, if all's gone right you will be able to ssh to your new vm.

### get ip address & ssh

```bash
gcloud compute instances list
NAME          ZONE        MACHINE_TYPE   PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP    STATUS
oslogin-demo  us-east1-c  n1-standard-1               10.142.0.6   34.74.255.103  RUNNING
```

if you uploaded your default `~/.ssh/id_rsa` keys, you can ssh directly like this:

`ssh me_mydomain_com@34.74.255.103`

if you created a new key e.g. `~/.ssh/newkey`, you will ssh like this (`-i /private/key`):

`ssh -i ~/.ssh/newkey me_mydomain_com@34.74.255.103`

And voila:

```bash
Welcome to Ubuntu 16.04.6 LTS (GNU/Linux 4.15.0-1071-gcp x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

0 packages can be updated.
0 updates are security updates.



The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.


The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

Creating directory '/home/me_mydomain_com'.
groups: cannot find name for group ID 1512007361
me_mydomain_com@oslogin-demo:~$
```

## References

* [Centralized SSH login to Google Compute Engine instances](https://medium.com/infrastructure-adventures/centralized-ssh-login-to-google-compute-engine-instances-d00f8654f379)
* [Terraform: Google Compute Instance](https://www.terraform.io/docs/providers/google/r/compute_instance.html#guest_accelerator)
* [Google: SSH with third party tools](https://cloud.google.com/compute/docs/instances/connecting-advanced#thirdpartytools)
* [Google: Granting Roles to Service Accounts](https://cloud.google.com/iam/docs/granting-roles-to-service-accounts#gcloud)

---
title: Creating VM's using Ansible and ESXi 5.5 Free Version.
---

Use Ansible to deploy a virtual machine instance on ESXi 5.5, free version.

## Install Ansible & pysphere

### debian/ubuntu

```bash
sudo apt-add-repository -y ppa:ansible/ansible
sudo apt-get update
sudo apt-get install -y ansible
```

### rhel/centos

```bash
sudo yum install -y ansible
```

install pysphere

```bash
easy_install -U pysphere
```

via pip:

```bash
pip install -U pysphere
```

## Create inventory file

Create inventory file containing ESXI Host (replace esxi.default.de with your esxi hostname):

```bash
$ cat inventory
[esxi]
esxi.darksyde.net
```

## Verify DNS for ESXi Host

Infrastructure must match hostname EXACTLY: ssh into your esxi and run `hostname`

```bash
~ # hostname
esxi.DARKSYDE.NET
```

copy this EXACTLY to your esxi section below

## Create your Ansible Playbook

```bash
# cat newvm.yml
---
- hosts: localhost
  connection: local
  vars_prompt:
  - name: "rootpassword"
    prompt: "Enter your password to esxi"
    private: yes
  tasks:
  - vsphere_guest:
      vcenter_hostname: esxi.darksyde.net
      username: root
      password: <your_root_password>
      guest: newvm001
      state: powered_on
      vm_extra_config:
        vcpu.hotadd: yes
        mem.hotadd:  yes
        notes: This is a test VM
      vm_disk:
        disk1:
          size_gb: 10
          type: thin
          datastore: datastore1
          # VMs can be put into folders. The value given here is either the full path
          # to the folder (e.g. production/customerA/lamp) or just the last component
          # of the path (e.g. lamp):
          folder: DARK_LAB/10_DMZ
      vm_nic:
        nic1:
          type: vmxnet3
          network: DMZ
          network_type: standard
      vm_hardware:
        memory_mb: 2048
        num_cpus: 2
        osid: centos64Guest
        scsi: paravirtual
        vm_cdrom:
          type: "iso"
          iso_path: "datastore1/ISO/CentOS-7.0-1406-x86_64-DVD.iso"
      esxi:
        datacenter: ha-datacenter
        hostname: esxi.DARKSYDE.NET
```

## Run the playbook

```bash
[root@puppetmaster ansible-playbooks]# ansible-playbook -vvv -s vm-esxi.yml
Using /etc/ansible/ansible.cfg as config file

PLAYBOOK: vm-esxi.yml ********************************************************************************************************************************************************
1 plays in vm-esxi.yml
Enter your password to esxi:

PLAY [localhost] *************************************************************************************************************************************************************

TASK [Gathering Facts] *******************************************************************************************************************************************************
Using module file /usr/lib/python2.7/site-packages/ansible/modules/system/setup.py
<127.0.0.1> ESTABLISH LOCAL CONNECTION FOR USER: root
<127.0.0.1> EXEC /bin/sh -c 'echo ~ && sleep 0'
<127.0.0.1> EXEC /bin/sh -c '( umask 77 && mkdir -p "` echo /root/.ansible/tmp/ansible-tmp-1507178886.36-229403027178035 `" && echo ansible-tmp-1507178886.36-229403027178035="` echo /root/.ansible/tmp/ansible-tmp-1507178886.36-229403027178035 `" ) && sleep 0'
<127.0.0.1> PUT /tmp/tmpxKbdW7 TO /root/.ansible/tmp/ansible-tmp-1507178886.36-229403027178035/setup.py
<127.0.0.1> EXEC /bin/sh -c 'chmod u+x /root/.ansible/tmp/ansible-tmp-1507178886.36-229403027178035/ /root/.ansible/tmp/ansible-tmp-1507178886.36-229403027178035/setup.py && sleep 0'
<127.0.0.1> EXEC /bin/sh -c '/usr/bin/python2 /root/.ansible/tmp/ansible-tmp-1507178886.36-229403027178035/setup.py; rm -rf "/root/.ansible/tmp/ansible-tmp-1507178886.36-229403027178035/" > /dev/null 2>&1 && sleep 0'
ok: [localhost]
META: ran handlers

TASK [vsphere_guest] *********************************************************************************************************************************************************
task path: /root/ansible-playbooks/vm-esxi.yml:9
Using module file /usr/lib/python2.7/site-packages/ansible/modules/cloud/vmware/vsphere_guest.py
<127.0.0.1> ESTABLISH LOCAL CONNECTION FOR USER: root
<127.0.0.1> EXEC /bin/sh -c 'echo ~ && sleep 0'
<127.0.0.1> EXEC /bin/sh -c '( umask 77 && mkdir -p "` echo /root/.ansible/tmp/ansible-tmp-1507178896.13-224568032954916 `" && echo ansible-tmp-1507178896.13-224568032954916="` echo /root/.ansible/tmp/ansible-tmp-1507178896.13-224568032954916 `" ) && sleep 0'
<127.0.0.1> PUT /tmp/tmp7cu5MB TO /root/.ansible/tmp/ansible-tmp-1507178896.13-224568032954916/vsphere_guest.py
<127.0.0.1> EXEC /bin/sh -c 'chmod u+x /root/.ansible/tmp/ansible-tmp-1507178896.13-224568032954916/ /root/.ansible/tmp/ansible-tmp-1507178896.13-224568032954916/vsphere_guest.py && sleep 0'
<127.0.0.1> EXEC /bin/sh -c '/usr/bin/python2 /root/.ansible/tmp/ansible-tmp-1507178896.13-224568032954916/vsphere_guest.py; rm -rf "/root/.ansible/tmp/ansible-tmp-1507178896.13-224568032954916/" > /dev/null 2>&1 && sleep 0'
changed: [localhost] => {
    "ansible_facts": {
        "hw_guest_full_name": "CentOS 4/5/6/7 (64-bit)",
        "hw_guest_id": "centos64Guest",
        "hw_instance_uuid": "5213b94e-4b04-2409-484c-91136060a9aa",
        "hw_interfaces": [],
        "hw_memtotal_mb": 2048,
        "hw_name": "newvm001",
        "hw_power_status": "POWERED ON",
        "hw_processor_count": 2,
        "hw_product_uuid": "564dcb1e-c3ed-ff26-65f7-91f348abfb27",
        "module_hw": true
    },
    "changed": true,
    "changes": "Created VM newvm001",
    "invocation": {
        "module_args": {
            "cluster": null,
            "esxi": {
                "datacenter": "ha-datacenter",
                "hostname": "esxi.DARKSYDE.NET"
            },
            "force": false,
            "from_template": null,
            "guest": "newvm001",
            "password": "VALUE_SPECIFIED_IN_NO_LOG_PARAMETER",
            "power_on_after_clone": true,
            "resource_pool": null,
            "snapshot_to_clone": null,
            "state": "powered_on",
            "template_src": null,
            "username": "root",
            "validate_certs": true,
            "vcenter_hostname": "esxi.darksyde.net",
            "vm_disk": {
                "disk1": {
                    "datastore": "datastore1",
                    "folder": "DARK_LAB/10_DMZ",
                    "size_gb": 10,
                    "type": "thin"
                }
            },
            "vm_extra_config": {
                "mem.hotadd": true,
                "notes": "This is a test VM",
                "vcpu.hotadd": true
            },
            "vm_hardware": {
                "memory_mb": 2048,
                "num_cpus": 2,
                "osid": "centos64Guest",
                "scsi": "paravirtual",
                "vm_cdrom": {
                    "iso_path": "datastore1/ISO/CentOS-7.0-1406-x86_64-DVD.iso",
                    "type": "iso"
                }
            },
            "vm_hw_version": null,
            "vm_nic": {
                "nic1": {
                    "network": "DMZ",
                    "network_type": "standard",
                    "type": "vmxnet3"
                }
            },
            "vmware_guest_facts": null
        }
    }
}
META: ran handlers
META: ran handlers

PLAY RECAP *******************************************************************************************************************************************************************
localhost                  : ok=2    changed=1    unreachable=0    failed=0

```

Done.

## Troubleshooting

if you dont get the hostname right you get this:

```bash
},
"vmware_guest_facts": null
}
},
"msg": "Cannot find esx host named: esxi"
}
to retry, use: --limit @/root/ansible-playbooks/vm-esxi.retry

PLAY RECAP *******************************************************************************************************************************************************************
localhost                  : ok=1    changed=0    unreachable=0    failed=1
```

## References

:::info

* [Ansible Tutorial](https://serversforhackers.com/c/an-ansible-tutorial)
* [vSphere Guest Module](http://docs.ansible.com/ansible/latest/vsphere_guest_module.html)
* [Quick Guide to PySphere](https://github.com/itnihao/pysphere/wiki/Quick-guide-to-start-using-PySphere)

:::
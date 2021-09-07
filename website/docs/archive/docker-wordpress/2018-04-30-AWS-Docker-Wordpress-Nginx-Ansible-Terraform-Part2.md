---
slug: "docker-wordpress-2"
title: "Part 2 - Provision with Ansible"
---

Now that Terraform has taken care of standing up a single instance of EC2 and RDS/MariaDB in [Part 1](docker-wordpress-1), the next part is pretty straight forward because we just need docker & docker-compose installed on our web server EC2 instance.

Just a reminder of the simple setup we're trying to build here:

![diagram of app](/img/archive/dockerwordpress-appdiagram.png)

## Part 2. Provision with Ansible

All we're after here is for ansible to install docker & docker-compose on the target server. We could've done this with a `user_data` section of our Terraform build so the new instance would come fully formed with docker & docker-compose. But again, even though this is a small and really simple setup, I wanted to practice structuring and implementing things in a scalable "industry standard" sort of way (well, close to anyway).

## Directory Structure

Let's go through the ansible directory and see what we're working with

- `ansible.cfg`
- `deploy.yml`
- `hosts.yml`
- `roles/`

## ansible.cfg

all your defaults go into this for ansible to pick up and work with when you run `ansible` or `ansible-playbook`.

```yaml
[defaults]
remote_user = ubuntu
ansible_managed = Ansible managed
display_skipped_hosts = True
system_warnings = True
command_warnings = False
retry_files_enabled = False
```

self explanatory, or you can read and add as required, read this page: [ansible.cfg example on github.com](https://raw.githubusercontent.com/ansible/ansible/devel/examples/ansible.cfg)

## hosts.yml

there's a couple ways to layout your hosts file, the ini way:

```bash
[web]
x.x.x.x   hostname
x.x.x.x   another-hostname
```

or the way I've decided to go, with YAML, the "ungrouped" way (per [github inventory yaml example](https://github.com/ansible/ansible/blob/devel/examples/hosts.yaml))

```yaml
all:
    hosts:
      web:
        ansible_ssh_host: 174.129.47.133
        ansible_user: ubuntu
        ansible_ssh_private_key_file: "/path/to/private/key/infra_builder.pem"
```

there's a few other ways to lay your inventory out with YAML, adding 'vars' and 'children', but these are some great practices to follow on inventory in YAML format:

```bash
#   - Comments begin with the '#' character
#   - Blank lines are ignored
#   - Top level entries are assumed to be groups, start with 'all' to have a full hierarchy
#   - Hosts must be specified in a group's hosts:
#     and they must be a key (: terminated)
#   - groups can have children, hosts and vars keys
#   - Anything defined under a host is assumed to be a var
#   - You can enter hostnames or IP addresses
#   - A hostname/IP can be a member of multiple groups
```

## the role of 'roles'

Now I'm no Ansible guru, but the more I'm learning about ansible the more powerful I see 'roles' being in terms of organizing the 'work' required to get from 'A' to 'B' for whatever you're trying to achieve.

In the example of this little project, we want docker & docker-compose installed.

Let's setup 'docker' as an Ansible role:

```bash
ansible-galaxy init docker
```

where 'docker' is the role we want to create. There's a way to pull down an already filled out 'docker' role much the way you pull down docker images, but its fun to start from scratch and see everything at the boilerplate level.

You end up with this folder structure (I copied this from ansible's documentation):

```bash
README.md
.travis.yml
defaults/
    main.yml
files/
handlers/
    main.yml
meta/
    main.yml
templates/
tests/
    inventory
    test.yml
vars/
    main.yml
```

Rather than get into an Ansible tutorial (which there are much better out there to learn from), let's just highlight the files that actually do stuff:

### defaults/main.yml

```yaml
---
# defaults file for docker
# this assumes either systemd or initd services
# uncomment the one you need:

## systemd
#docker_service: /usr/lib/systemd/system/docker.service

## initd
docker_service: /etc/init.d/docker
docker_install_docker_compose: True
docker_compose_version: "1.21.0"
```

key points

- pick the service system for your setup - systemd or init.d
- docker compose flag = True/False
- docker compose version to install

the main event, is **tasks/main.yml**. this is where docker and docker-compose get installed, and the docker service is enabled and started by this section:

```yaml
--
# tasks file for docker

- name: check docker installed
  stat: path={{ docker_service }}
  register: install_result

- debug: var=install_result

- name: installing docker
  shell: >
    curl -fsSL https://get.docker.com/ | sh
  when: not install_result.stat.exists

- name: start docker service
  service: name=docker state=started enabled=true

- name: get docker_info
  no_log: true
  command: docker info
  register: docker_result

- name: Install Docker Compose
  get_url:
    url: "https://github.com/docker/compose/releases/download/{{ docker_compose_version }}/docker-compose-Linux-x86_64"
    dest: "/usr/local/bin/docker-compose"
    force: True
    owner: "root"
    group: "root"
    mode: "0755"
  when: docker_install_docker_compose
```

key points:

- does the installation
- enables the docker service
- grabs docker_info and registers the result so it can be used for and by other sections

That's it. Now its time to deploy

## deploy.yml

Pretty non-eventful after all the meat and potatoes of this is already done in the 'roles' section. The following just deploys our hard earned config setup:

```yaml
# deploy.yml
---
- hosts: all
  gather_facts: yes
  become: yes
  become_user: root

  roles:
    - { role: docker, tags: docker }

  tasks:
    - debug: var=docker_result
```

key points:

- targets 'all' hosts (i.e. the 'root' level so will capture our web hosts)
- the ansible_user will assume 'root' as it goes to work
- going to deploy the 'docker role' against the target hosts
- tag our docker role with 'docker' (not very creative)

## Deploy, check Installation

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/CJ4FkvQm0R0?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

That's it!

Third and Final Part III, where we setup our Docker Wordpress site with RDS backend!

## References

:::info

- [ansible-galaxy creating roles](https://docs.ansible.com/ansible/latest/reference_appendices/galaxy.html)
- [github inventory yaml example](https://github.com/ansible/ansible/blob/devel/examples/hosts.yaml)
- [ansible yaml example](https://everythingshouldbevirtual.com/ansible-generating-hostgroups-yaml-file/)
- [terraform vpc examples](https://github.com/arbabnazar/terraform-ansible-aws-vpc-ha-wordpress.git)
- [aws wordpress terraform ansible example](https://rbgeek.wordpress.com/2016/03/28/highly-available-wordpress-setup-inside-aws-vpc-using-terraform-ansible/)
- [bootstrap credit](https://hackernoon.com/setup-docker-swarm-on-aws-using-ansible-terraform-daa1eabbc27d)
- [using ansible with terraform](https://alex.dzyoba.com/blog/terraform-ansible/)

:::

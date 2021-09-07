---
title: NGINX on CentOS 7 with SELinux issues
---

Quick setup of NGINX on CentOS 7, enable firewall and fix a few SELinux issues.

Sometimes you just need a quick reference of the last time you did something seemingly easy but every time you come back to it you're like... wtf?! Anyway, **notes** for those times.

## install nginx from epel-release

```bash
yum install epel-release
yum -y install nginx
service nginx start
systemctl enable nginx
```

## enable firewall-cmd

```bash
sudo firewall-cmd --permanent --zone=public --add-service=http
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --reload
```

## setup user-based website space

```bash
useradd ron.amosa
passwd ron.amosa
mkdir -p /var/www/ronamosa.com/public_html
chown -R ron.amosa:ron.amosa /var/www/ronamosa.com/public_html
```

## setup NGINX for 'VirtualHosts' aka Server Blocks

```bash
mkdir /etc/nginx/sites-available
mkdir /etc/nginx/sites-enabled
```

## configure NGINX

```bash
vim /etc/nginx/nginx.conf
```

add after the '_http{}_' block:

```bash
include /etc/nginx/sites-enabled/*.conf;
server_names_hash_bucket_size 64;
```

## create block for the jekyll site

```bash
vim /etc/nginx/sites-available/ronamosa.com.conf
```

add this

```bash
server {
  listen       80;
  server_name  ronamosa.com www.ronamosa.com;
  location / {
    root   /var/www/ronamosa.com/public_html;
    index  index.html index.htm;
    try_files $uri $uri/ =404;
  }    
  error_page   500 502 503 504  /50x.html;
  location = /50x.html {
    root   html;
  }
}
```

## create symlink

this will connect available sites to enabled sites:
`ln -s /etc/nginx/sites-available/ronamosa.com.conf /etc/nginx/sites-enabled/ronamosa.com.conf`

## restart nginx

`systemctl restart nginx`

:::note

You need to either add the FQDN to your /etc/hosts local to where you're calling/testing from, or hax your DNS server to point (exmple) www.nginx.com to your new local.nginx.com site **

:::

## SELinux issues

error : you get a `403 Forbidden` when you try to browse to

```bash
[root@nginx ~]# tail /var/log/nginx/error.log
2017/10/20 18:39:26 [error] 1699#0: *14 "/var/www/ronamosa.com/public_html/index.html" is forbidden (13: Permission denied), client: 172.16.45.15, server: ronamosa.com, request: "GET / HTTP/1.1", host: "www.ronamosa.com"
```

get 'setools':

`yum install -y setools`

get semanage (comes with audit2allow):

```bash
[root@nginx ~]# yum provides /usr/sbin/semanage
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
 * base: ftp.wicks.co.nz
 * epel: mirror.xnet.co.nz
 * extras: ftp.wicks.co.nz
 * updates: ftp.wicks.co.nz
policycoreutils-python-2.5-17.1.el7.x86_64 : SELinux policy core python utilities
Repo        : base
Matched from:
Filename    : /usr/sbin/semanage

[root@nginx ~]# yum install -y policycoreutils-python-2.5-17.1.el7.x86_64
```

find selinux errors in log, use audit2allow to format out a fix:

`[root@nginx ~]# grep nginx /var/log/audit/audit.log | audit2allow -m nginx > nginx`

check the output:

```bash
[root@nginx ~]# cat nginx

module nginx 1.0;

require {
        type httpd_t;
        type var_t;
        class file { getattr open read };
}

#============= httpd_t ==============

#!!!! WARNING: 'var_t' is a base type.
#!!!! The file '/var/www/ronamosa.com/public_html/index.html' is mislabeled on your system.
#!!!! Fix with $ restorecon -R -v /var/www/ronamosa.com/public_html/index.html
allow httpd_t var_t:file { getattr open read };
```

_**note: see the WARNING here? you can follow the recommendation and use `restorecon`... I didnt and that's my mistake in hindsight. you live, you learn right? ;)**_

create an compiled policy with the `-M` option:

```bash
grep nginx /var/log/audit/audit.log | audit2allow -M nginx
******************** IMPORTANT ***********************
To make this policy package active, execute:

semodule -i nginx.pp

```

let's do it, and then check its installed :

```bash
[root@nginx ~]# semodule -i nginx.pp
[root@nginx ~]# semodule -l | grep nginx
nginx   1.0
```

go back to www.ronamosa.com and voila, its working :)

## References

:::info

* [nginx and selinux](https://www.nginx.com/blog/nginx-se-linux-changes-upgrading-rhel-6-6/)
* [nginx on centos-7](https://www.godaddy.com/garage/tech/config/how-to-install-and-configure-nginx-on-centos-7/)
* [Jekyll Documentation](https://jekyllrb.com/docs/deployment-methods/)

:::

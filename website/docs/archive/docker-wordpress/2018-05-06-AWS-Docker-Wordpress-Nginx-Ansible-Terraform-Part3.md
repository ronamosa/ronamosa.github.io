---
slug: "docker-wordpress-3"
title: "Part 3 - NGINX SSL Frontend, Docker Compose and Demo."
---

The infrastructure was deployed with Terraform in [Part 1](docker-wordpress-1). Ansible installed a few things for us in [Part 2](docker-wordpress-2). And now, the main event - the actual Wordpress site running in docker with an RDS/MySQL backend database.

Here's a diagram of the 3 components that are going to be working together:

![diagram of app](/img/archive/DockerWordpressNginxRDS.png)

## NGINX

NGINX is doing the SSL termination (i.e. the handshake with your browser) and reverse proxying connections from the frontend to the wordpress service out the backend. So in a simple setup, its the most complicated bit of the 3.

in your nginx/ folder

```sh
nginx.conf
conf.d/default.conf
certs/self-signed.cert
certs/self-signed.key
```

The `nginx.conf` file is pretty stock standard, so we'll have a look at the other files.

### default.conf

```bash
server {
    listen            80;
    listen       [::]:80;
    server_name  www.mywordpress.local;

    location / {
      access_log off;
      return 301 https://$server_name$request_uri;
    }
}

server {

    listen            443 ssl;
    listen       [::]:443 ssl;

    server_name  www.mywordpress.local;

    access_log   /var/log/nginx/wordpress-443-access.log main;
    error_log		 /var/log/nginx/wordpress-443-error.log debug;

    ssl				on;
    ssl_certificate		/etc/nginx/my_wpress_site.cert;
    ssl_certificate_key		/etc/nginx/my_wpress_site.key;

    location / {
        proxy_pass http://wordpress;
        proxy_redirect        off;

        proxy_read_timeout    90;
        proxy_connect_timeout 90;

        proxy_set_header      Host $host;
        proxy_set_header      X-Real-IP $remote_addr;
        proxy_set_header      X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header      X-Forwarded-Host $server_name;
        proxy_set_header      X-Forwarded-Proto https;
    }
}
```

### What's going on here?

* requests to port 80 get redirected (301) to 443 (HTTPS)
* ssl cert and key locations are defined
* `proxy_pass` points to our wordpress container
* proxy headers set accordingly - dont know the specifics exactly you'll have to look these up :)

## DOCKER COMPOSE

The almighty docker-compose file. Now that the NGINX files are accounted for the docker-compose is going to bring all 3 components together in container harmony.

We're going to pull down `wordpress:latest` and `nginx:latest` for their respective containers. The wordpress container is setup with environment variables to start itself up with (e.g. WORDPRESS_DB_HOST) so it can find the database and login succesfully.

your `docker-compose.yml` file

```yml
version: '2'
services:
  wordpress:
  image: wordpress:latest
  volumes:
    - wordpress:/var/www/html/
  restart: unless-stopped
  environment:
    WORDPRESS_DB_HOST: "wordpressdb.crxppkxndbvw.us-east-1.rds.amazonaws.com:3306"
    WORDPRESS_DB_USER: wpress
    WORDPRESS_DB_PASSWORD: wpress_247x
    WORDPRESS_DB_NAME: rds_mysql
  nginx:
  image: nginx:latest
  volumes:
    - nginx:/etc/nginx/conf.d
    - logs:/var/log/nginx
 ports:
    - "80:80"
    - "443:443"
  depends_on:
    - wordpress
  links:
    - wordpress
  restart: unless-stopped

volumes:
  wordpress:
  nginx:
  logs:
```

### Key Points

* wordpress environment variables define the RDS database to connect to (and creds)
* uses named volumes for both containers*
* nginx exposes ports 80, 443
* nginx 'depends on' wordpress so wordpress needs to be up before nginx gets launched
* links means nginx can always find wordpress post-restarts

Now, the thing with this compose file is:

1. it works but
2. its not complete.

>_What do I mean by this?_

Here I'm declaring some named volumes to be used for the containers data to live in (i.e. `nginx:/etc/nginx/conf.d` - the 'nginx:' bit). But you have to create these first, and then put the nginx files in it that map to `/etc/nginx/conf.d` i.e. the `default.conf` file.

I need to mount the nginx `logs` volume on the nginx container so I can work with the containers logs on the host instead of `docker logs -f CONTAINER` or having to exec into the container to look at logs.

## Live Demo

actually, I was going to do a live demo here and stand up my AWS infra and deploy the wordpress-nginx-rds setup, but I've already spent so much time on this I don't think another video's going to add that much value :))

What I will leave you with though is the working set of files for the same setup, but with a MySQL database backend. The docker-compose file creates 3 containers, whereas the AWS version is 2 containers and backend database. Either way, knock yourself out and if you have any questions feel free to hit me up.

* [Docker Wordpress NGINX SSL & MySQL](https://github.com/ronamosa/docker-wordpress-nginx-ssl-mysql)

That's it! Thanks for following along and hope you learned a little something about making super complicated setups unnecessarily. kidding. Hope you had fun playing with a bit of everything :))  

## Appendix

Just noting here some things that might come in handy later

### create self-signed certs (linux)

just for testing purposes so the rest of your configs are created the 'SSL' way:

```sh
sudo openssl req -new > my_wpress_site.csr
sudo openssl rsa -in privkey.pem -out my_wpress_site.key
sudo openssl x509 -in my_wpress_site.csr -out my_wpress_site.cert -req -signkey my_wpress_site.key -days 360
```

:::note

_There's a few things to enter as you run these commands e.g. passphrases for the private key (remember these if you want to re-use the private key for anything)._

:::

### cleaner, tidier future

better practice, use 'named volumes' for your mounts so that sections like this:

```yml
volumes:
  - wordpress:/var/www/html/
```

will have a tidy looking volume like this:

`/var/lib/docker/volumes/wordpress/_data`

maybe next time!

_fyi you can create your volumes like so:_

```bash
$ docker create volume wordpress
$ docker create volume nginx
$ docker create volume logs
```

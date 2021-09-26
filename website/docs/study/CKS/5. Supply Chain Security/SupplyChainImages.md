---
title: Container Images
---

Supply Chain Security and Container Images

## Containers & Docker

- review of previous info on containers vs vm
- app / kernel group / host kernel / OS

continers build in layers

```dockerfile
FROM ubuntu
RUN apt update -y && apt get install -y curl
CMD ["sh"]
```

## Reduce Footprint (Multistage)

```dockerfile
FROM ubuntu
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y golang-go
COPY app.go .
RUN CGO_ENABLED=0 go build app.go
CMD ["./app"]
```

app.go

```golang
package main

import (
    "fmt"
    "time"
    "os/user"
)

func main () {
    user, err := user.Current()
    if err != nil {
        panic(err)
    }

    for {
        fmt.Println("user: " + user.Username + " id: " + user.Uid)
        time.Sleep(1 * time.Second)
    }
}
```

look at the size of the image

```bash
docker image list | grep app
app                                             latest    095865436e26   4 minutes ago   693MB
```

lets reduce using multi-stage build

```dockerfile
# build stage (0)
FROM ubuntu
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y golang-go
COPY app.go .
RUN CGO_ENABLED=0 go build app.go

# runtime stage
FROM alpine
COPY --from=0 /app .
CMD ["./app"]
```

check size

```bash
 docker image list | grep app
app                                             latest    8ed877429a72   15 seconds ago   7.73MB
```

## Secure Images

- use specific verions of images (not default/latest) e.g. `FROM alpine:3.12.1`
- dont run as root, create a user e.g. `RUN addgroup -S appgroup && adduser -G appgroup -h /home/appuser` (see below)
- make filesystem read-only e.g. `RUN chmod a-w /etc` or any other folders
- remove shell access e.g. `RUN rm -fr /bin/*` AFTER all `RUN` is complete that might need apps under `/bin/*`

final solution:

```dockerfile
FROM ubuntu
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y golang-go
COPY app.go .
RUN CGO_ENABLED=0 go build app.go

# runtime stage
FROM alpine:3.12.1
RUN chmod a-w /etc
RUN addgroup -S appgroup && adduser -G appgroup -h /home/appuser
RUN rm -fr /bin/*
COPY --from=0 /app /home/appuser/
USER appuser
CMD ["/home/appuser/app"]
```

### Layers

note look at layers in docker best practice on best way to use them.

## Image Vulnerability Scanning

examples

- buffer overflows in vuln apache images
- the app itself
- the dependencies inside the container

result

- privesc
- info leak
- ddos

check each layer of the image, where bins may be installed on those layers e.g. curl, nginx, base image.

when to check?

- during build time
- during run time

during code->commit, build (scan the registry when image pushed), enforce at deploy time using OPA

### image scanning tools

look at Clair (complex) and Trivy (simple) for image scanning

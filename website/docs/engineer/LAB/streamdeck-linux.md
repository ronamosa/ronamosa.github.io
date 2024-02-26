---
title: "Streamdeck XL for Linux"
---

My quick setup notes for getting streamdeck XL going on Linux.

## 2 Steps

1. Follow ["Streamdeck UI documentation"](https://timothycrosley.github.io/streamdeck-ui/docs/installation/ubuntu/) to get things setup on your desktop.
2. Setup `--user` level systemd service for streamdeck so it runs in the background (["Create A Systemd Service"](https://linuxhandbook.com/create-systemd-services/)

### Files

`~/.config/systemd/user/streamdeck.service`

```bash
[Unit]
Description=StreamDeck UI
DefaultDependencies=no

[Service]
Type=simple
ExecStart=/home/rxhackk/.local/bin/streamdeck
Restart=on-failure
RestartSec=10

[Install]
WantedBy=default.target
```

load and enable

```bash
# as user
systemctl --user daemon-reload
systemctl --user enable streamdeck.service
systemctl --user start streamdeck.service
```

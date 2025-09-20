---
title: "Stream Deck XL Linux Setup - Complete Configuration Guide for Ubuntu"
description: "Step-by-step guide to setting up Elgato Stream Deck XL on Linux with streamdeck-ui, systemd services, and custom configurations for productivity and streaming."
keywords: ["stream deck linux", "elgato linux", "streamdeck ubuntu", "linux productivity", "streaming linux", "streamdeck-ui", "systemd service"]
tags: ["linux", "productivity", "streaming", "hardware", "ubuntu"]
sidebar_position: 2
---

My quick setup notes for getting streamdeck XL going on Linux.

## Steps

1. Follow ["Streamdeck UI documentation"](https://timothycrosley.github.io/streamdeck-ui/docs/installation/ubuntu/) to get things setup on your desktop.
2. Setup `--user` level systemd service for streamdeck so it runs in the background (read: ["Create A Systemd Service"](https://linuxhandbook.com/create-systemd-services/))

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

---
title: "Streamdeck XL for Linux"
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

## Elgato Keylight Air API

:::note source

Great work by Adam Esch, reference his [repo](https://github.com/adamesch/elgato-key-light-api).

:::

I set up the streamdeck XL buttons to control my Keylight via its API on the network.

```bash
# light status
curl --location --request GET 'http://keylight.darksyde.lan:9123/elgato/lights' --header 'Accept: application/json' | jq .
{
  "numberOfLights": 1,
  "lights": [
    {
      "on": 1,
      "brightness": 16,
      "temperature": 180
    }
  ]
}
```

### Controls

Turn light **OFF**

```bash
curl --location --request PUT 'http://keylight.darksyde.lan:9123/elgato/lights' --header 'Accept: application/json' --data-raw '{"numberOfLights": 1,"lights": [{"on": 0}]}'
```

Turn light **ON**

```bash
curl --location --request PUT 'http://keylight.darksyde.lan:9123/elgato/lights' --header 'Accept: application/json' --data-raw '{"numberOfLights": 1,"lights": [{"on": 1}]}'
```

### Temp ISO

```bash
curl --location --request PUT 'http://192.168.1.61:9123/elgato/lights' --header 'Accept: application/json' --data-raw '{
    "numberOfLights": 1,
    "lights": [
        {
            "on": 1,
            "brightness": 78,
            "temperature": 266
        }
    ]
}'
```

Calculating ISO temperature:

> *(**) The 'Control Center' UI only allows color temperature changes from 2900K - 7000K in 50K increments. To convert the values used by the API to Kelvin (like it is displayed in the Elgato application), divide by 0.05 (e.g. 143 / 0.05 = 2860 ≈ 2900K). To covert from Kelvin to API values, multiply by 0.05 (e.g. 7000K ≈ 6880 * 0.05 = 344)*

## Tapo Strip Light

:::note source

Use this from [sslimerr](https://github.com/sslimerr/tapo-html.git).

:::

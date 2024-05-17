---
title: "Discord Bot: Camera's On"
---

:::info

This is a quick project to have a way to enforce "cameras on" policy on my Discord server using a bot that will "police" this. I used Claude 3 Opus to help me develop this. These are my notes.

:::

:::caution AI Assisted

Please note, I use a combination of Claude 3 Opus (paid) and some ChatGPT-4 (paid) to guide me and generate code, I then run and tweak the steps and code until it works for my use case.

:::

## Overview

Setting up a Discord bot consists of three things

1. Discord Bot Application at `discord.com`
2. A server to run your code on
3. A Discord server to invite your bot to.

## Discord Bot Application

- Go to the Discord Developer Portal (<https://discord.com/developers/applications>)
- Create a new application and add a bot to it
- Obtain the bot token for authentication

get notes from here https://discord.com/developers/docs/quick-start/getting-started 

1. Install the necessary dependencies:
   - Make sure you have Node.js installed on your system
   - Create a new directory for your bot project
   - Initialize a new Node.js project with `npm init`
   - Install the required dependencies:

     ```
     npm install discord.js
     ```

## Heroku Bot App

I'm going to run my bot code on Heroku. I need to create a repo with my code, and link it up with Heroku.

### Create my GH repo

My initial repo consists of the following files:

- `.gitignore`
- `.env`
- `Procfile`
- `bot.js`
- `package.json`

```bash title=.gitignore
node_modules/
.env
```

```bash title=.env
# local dev environment
BOT_TOKEN=YOUR_BOT_TOKEN
CAMERA_ON_CHANNELS=CHANNEL_ID_1,CHANNEL_ID_2
WARNING_TIMEOUT=30000
```

- Replace `YOUR_BOT_TOKEN` with your actual bot token
- Replace `CHANNEL_ID_1`,`CHANNEL_ID_2` with the comma-separated list of video channel IDs
- Adjust the `WARNING_TIMEOUT` value as needed

```bash title=Profile
worker: node bot.js
```

```javascript title=bot.js
const Discord = require('discord.js');
const client = new Discord.Client();

const token = process.env.BOT_TOKEN;
const cameraOnChannels = process.env.CAMERA_ON_CHANNELS.split(',');
const warningTimeout = parseInt(process.env.WARNING_TIMEOUT);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('voiceStateUpdate', (oldState, newState) => {
  if (cameraOnChannels.includes(newState.channelID) && !newState.selfVideo) {
    const member = newState.member;
    const channel = newState.channel;

    member.send(`Please enable your camera in the channel "${channel.name}".`);

    setTimeout(() => {
      if (!newState.selfVideo) {
        member.voice.kick('Camera not enabled');
      }
    }, warningTimeout);
  }
});

client.login(token);
```

1. Configure the bot:
   - Replace `'YOUR_BOT_TOKEN'` with your actual bot token obtained from the Discord Developer Portal
   - Replace the channel IDs in the `cameraOnChannels` array with the IDs of the video channels where you want to enforce the "camera on" policy
   - Adjust the `warningTimeout` value (in milliseconds) to set the time limit for users to enable their camera before being kicked

```json title=package.json
{
  "name": "rxbot",
  "version": "1.0.0",
  "description": "A Swiss Army Knife Utility Bot",
  "main": "bot.js",
  "scripts": {
    "start": "node bot.js"
  },
  "dependencies": {
    "discord.js": "^12.5.3"
  }
```

Do the usual things to the code, `git add . && git commit -m "initial commit"`, add remote branch as needed and push `git push origin main`.

### Connect GH to Heroku

login to Heroku, create your app, go into your app, go to `Deploy` tab and then look for `Deployment method` and see this:

![Connect GitHub](/img/DiscordBotCamera-Github.png)

Choose github

Choose the `rxbot` repo and connect it

![Choose repo](/img/DiscordBotCamera-HerokuConnect.png)

Successfully connected.

![Connect Success](/img/DiscordBotCamera-ConnectSuccess.png)

## Discord Server Setup

5. Invite the bot to your Discord server:
   - Go back to the Discord Developer Portal
   - Navigate to the "OAuth2" section in your bot application
   - Select the "bot" scope and the necessary permissions (e.g., "Send Messages", "Manage Roles", "Kick Members")
   - Copy the generated invite link and use it to invite the bot to your server

That's it! Your Discord bot is now ready to enforce the "camera on" policy in the specified video channels. When a user joins one of those channels without their camera enabled, the bot will send them a direct message reminding them to turn on their camera. If they don't comply within the specified time limit, the bot will kick them from the channel.

Remember to handle the bot with care and ensure that it has the necessary permissions to send messages and kick members in the designated channels.

Let me know if you have any further questions or if you need assistance with any specific part of the process!

## Troubleshooting

### Crashed on Heroku

```bash
2024-05-16T04:45:28.045293+00:00 heroku[web.1]: Starting process with command `npm start`
2024-05-16T04:45:29.006096+00:00 app[web.1]: 
2024-05-16T04:45:29.006148+00:00 app[web.1]: > rxbot@1.0.0 start /app
2024-05-16T04:45:29.006148+00:00 app[web.1]: > node bot.js
2024-05-16T04:45:29.006149+00:00 app[web.1]: 
2024-05-16T04:45:29.563611+00:00 app[web.1]: Logged in as RXBOT#4425
2024-05-16T04:46:28.333745+00:00 heroku[web.1]: Error R10 (Boot timeout) -> Web process failed to bind to $PORT within 60 seconds of launch
2024-05-16T04:46:28.345690+00:00 heroku[web.1]: Stopping process with SIGKILL
2024-05-16T04:46:28.449933+00:00 heroku[web.1]: Process exited with status 137
2024-05-16T04:46:28.474043+00:00 heroku[web.1]: State changed from starting to crashed
```

solution: change dyno from `web` dyno to `worker` dyno

![alt text](/img/DiscordBotCamera-DynoWorker.png)

restart with heroku cli: `heroku ps:scale worker=1 -a rxbot`

```bash
2024-05-16T10:29:29.364100+00:00 heroku[web.1]: Error R10 (Boot timeout) -> Web process failed to bind to $PORT within 60 seconds of launch
2024-05-16T10:29:29.376816+00:00 heroku[web.1]: Stopping process with SIGKILL
2024-05-16T10:29:29.470658+00:00 heroku[web.1]: Process exited with status 137
2024-05-16T10:29:29.499871+00:00 heroku[web.1]: State changed from starting to crashed
2024-05-16T12:14:14.832513+00:00 app[api]: Scaled to web@0:Basic worker@0:Basic by user ron@cloudbuilder.io
2024-05-16T12:14:14.933958+00:00 heroku[web.1]: State changed from crashed to down
2024-05-16T12:14:21.653969+00:00 app[api]: Scaled to web@0:Basic worker@1:Basic by user ron@cloudbuilder.io
2024-05-16T12:14:26.105195+00:00 heroku[worker.1]: Starting process with command `node bot.js`
2024-05-16T12:14:27.035181+00:00 heroku[worker.1]: State changed from starting to up
2024-05-16T12:14:28.600243+00:00 app[worker.1]: Logged in as RXBOT#4425
```
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

:::info Reference
Get notes from here: ["Get Started"](https://discord.com/developers/docs/quick-start/getting-started) guide.
:::

- Go to the Discord Developer Portal (<https://discord.com/developers/applications>)
- Create a new application, give app (bot) a name.
- Go to side menu `Bot`
- reset Token and copy for later
- disable `Public Bot`
- Got to side menu `OAuth2`, look for the `OAuth2 URL Generator`
- select scope `bot`
- then select permissions `Send Messages`, `Manage Roles`, `Move Members` and `Read Message History`
- Go down to the generated URL and copy - this is how you add your bot to your server.

:::note
Permissions-wise, "kicking" someone from a voice channel is actually to "move" them out, so you need `Move Members` and not `Kick Members` which will axe them from the disord server entirely.
:::

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

:::note
This is the final working bot code with a few bells & whistles. I started generating code with Claude 3, but after a few snags went back to `GPT-4o` and my honest opinion, is that GPT gave me better quality code that solved the complex use case quicker than Claude.
:::

```javascript title=bot.js
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

const token = process.env.BOT_TOKEN;
const cameraOnChannels = process.env.CAMERA_ON_CHANNELS.split(',');
const warningTimeout = parseInt(process.env.WARNING_TIMEOUT);
const warnedUsers = new Map();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('error', (error) => {
  console.error('The bot encountered an error:', error);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  console.log(`Voice state update detected for user ${newState.member.user.tag}. Old Channel: ${oldState.channelID}, New Channel: ${newState.channelID}, Camera On: ${newState.selfVideo}`);

  if (!cameraOnChannels.includes(newState.channelID)) return;

  const member = newState.member;
  const channel = newState.channel;

  if (newState.channelID !== oldState.channelID && !newState.selfVideo) {
    // User joined the voice channel with camera disabled
    console.log(`User ${member.user.tag} joined the monitored channel "${channel.name}" without camera enabled.`);
    handleCameraOff(member, channel);
  } else if (newState.channelID === oldState.channelID && !newState.selfVideo && !warnedUsers.has(member.id)) {
    // User disabled their camera while in the voice channel
    console.log(`User ${member.user.tag} disabled their camera in the monitored channel "${channel.name}".`);
    handleCameraOff(member, channel);
  } else if (newState.selfVideo && warnedUsers.has(member.id)) {
    // User enabled their camera
    console.log(`User ${member.user.tag} enabled their camera in the monitored channel "${channel.name}".`);
    clearWarning(member.id);
  }
});

async function handleCameraOff(member, channel) {
  try {
    const warningMessage = await member.send(`📷 Attention! Please enable your camera in the channel "**${channel.name}**" within the next ${warningTimeout / 1000} seconds, or you will be removed from the channel. 🚨`);
    console.log(`Sent warning message to user ${member.user.tag}.`);

    const timeoutId = setTimeout(async () => {
      if (!member.voice.selfVideo) {
        await member.voice.setChannel(null);
        await member.send(`❌ You have been removed from the channel "**${channel.name}**" due to not enabling your camera. Please rejoin the channel and enable your camera to participate. 🙏`);
        console.log(`User ${member.user.tag} was removed from the channel "${channel.name}" for not enabling their camera.`);
      }
    }, warningTimeout);

    warnedUsers.set(member.id, { timeoutId, warningMessage });
    console.log(`Set timeout for user ${member.user.tag}.`);
  } catch (error) {
    console.error('Error handling camera off:', error);
  }
}

async function clearWarning(memberId) {
  const userInfo = warnedUsers.get(memberId);
  if (userInfo) {
    clearTimeout(userInfo.timeoutId);
    warnedUsers.delete(memberId);
    console.log(`Cleared warning for user with ID ${memberId}.`);
    
    try {
      await userInfo.warningMessage.edit(`✨ Thank you for enabling your camera! Your cooperation is appreciated. 😊👍`);
      console.log(`Edited warning message for user with ID ${memberId}.`);
    } catch (editError) {
      console.error(`Failed to edit warning message for user with ID ${memberId}:`, editError);
    }
  }
}

// Log in to Discord
client.login(token);
```

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

### Configure Heroku App

As per `bot.js` you need to create the following three config vars in your Heroku App.

- `BOT_TOKEN`
- `CAMERA_ON_CHANNELS`
- `WARNING_TIMEOUT`

And add your bot token from discord portal, the channel IDs from your discord server and an arbitrary amount of time for the warning.

It should look like this:

![Config Vars](/img/DiscordBotCamera-ConfigVars.png)

### Connect GH to Heroku (CLI)

Install Heroku cli, login.

Check remotes on current repo.

Add heroku remote with `heroku git:remote -a <app-name>`

```bash
~/Repos/rxbot on CameraEnabled !1 ❯ git remote -v   
origin  git@github.com:ronamosa/rxbot.git (fetch)
origin  git@github.com:ronamosa/rxbot.git (push)
~/Repos/rxbot on CameraEnabled ❯ heroku git:remote -a rxbot
set git remote heroku to https://git.heroku.com/rxbot.git
```

### Connect GH to Heroku (Manual)

login to Heroku, create your app, go into your app, go to `Deploy` tab and then look for `Deployment method` and see this:

![Connect GitHub](/img/DiscordBotCamera-Github.png)

Choose github

Choose the `rxbot` repo and connect it

![Choose repo](/img/DiscordBotCamera-HerokuConnect.png)

Successfully connected.

![Connect Success](/img/DiscordBotCamera-ConnectSuccess.png)

## Discord Server Setup

There's not much to this, the `OAuth2` URL you generated in the Discord portal at the [beginning](#discord-bot-application).

Go to that URL and you should see this

![OAuth URL](/img/DiscordBotCamera-AddBot.png)

Accept Permissions:

![Accept Perms](/img/DiscordBotCamera-AddBotPerms.png)

Success!

![Added to Discord](/img/DiscordBotCamera-AddDiscord.png)

:::note
Only realised I had already doxxed myself in the last screenshot after creating my redacted shots 1 and 2 last.
:::

## Bot in Action

When a user joins the hard-coded channels that are on the "cameras on" list, they get a warning if their camera is off

![Warning](/img/DiscordBotCamera-Demo1.png)

if they comply, the warning disappears (edited) and a thank you is in it's place

![Comply](/img/DiscordBotCamera-Demo2.png)

any time a user disables their camera in these rooms, they will get a warning

![ReWarned](/img/DiscordBotCamera-Demo3.png)

after 30s of no compliance, the user is re-"moved" from the voice channel

![Removed](/img/DiscordBotCamera-Demo4.png)

## Troubleshooting

### Permissions

First time running the basic bot code, permissions tweak needed:

```bash
2024-05-17T22:44:01.638622+00:00 app[worker.1]: /app/node_modules/discord.js/src/rest/RequestHandler.js:154
2024-05-17T22:44:01.638692+00:00 app[worker.1]: throw new DiscordAPIError(request.path, data, request.method, res.status);
2024-05-17T22:44:01.638693+00:00 app[worker.1]: ^
2024-05-17T22:44:01.638693+00:00 app[worker.1]: 
2024-05-17T22:44:01.638694+00:00 app[worker.1]: DiscordAPIError: Missing Permissions
2024-05-17T22:44:01.638694+00:00 app[worker.1]: at RequestHandler.execute (/app/node_modules/discord.js/src/rest/RequestHandler.js:154:13)
2024-05-17T22:44:01.638694+00:00 app[worker.1]: at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
2024-05-17T22:44:01.638696+00:00 app[worker.1]: at async RequestHandler.push (/app/node_modules/discord.js/src/rest/RequestHandler.js:39:14)
2024-05-17T22:44:01.638696+00:00 app[worker.1]: at async GuildMember.edit (/app/node_modules/discord.js/src/structures/GuildMember.js:312:5) {
2024-05-17T22:44:01.638697+00:00 app[worker.1]: method: 'patch',
2024-05-17T22:44:01.638698+00:00 app[worker.1]: path: '/guilds/1086150687269847080/members/894143297050787850',
2024-05-17T22:44:01.638698+00:00 app[worker.1]: code: 50013,
2024-05-17T22:44:01.638698+00:00 app[worker.1]: httpStatus: 403
2024-05-17T22:44:01.638698+00:00 app[worker.1]: }
```

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
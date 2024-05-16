---
title: "Discord Bot: Camera's On"
---

:::info

This is a quick project to have a way to enforce "cameras on" policy on my Discord server using a bot that will "police" this. I used Claude 3 Opus to help me develop this. These are my notes.

:::

:::warning AI Assisted

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

2. Create the bot script:
   - Create a new file, e.g., `bot.js`, and add the following code:

     ```javascript
     const Discord = require('discord.js');
     const client = new Discord.Client();

     const token = 'YOUR_BOT_TOKEN';
     const cameraOnChannels = ['CHANNEL_ID_1', 'CHANNEL_ID_2']; // Replace with the IDs of the video channels
     const warningTimeout = 30000; // 30 seconds

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

3. Configure the bot:
   - Replace `'YOUR_BOT_TOKEN'` with your actual bot token obtained from the Discord Developer Portal
   - Replace the channel IDs in the `cameraOnChannels` array with the IDs of the video channels where you want to enforce the "camera on" policy
   - Adjust the `warningTimeout` value (in milliseconds) to set the time limit for users to enable their camera before being kicked

4. Run the bot:
   - Open a terminal or command prompt in your bot project directory
   - Run the following command to start the bot:

     ```
     node bot.js
     ```

5. Invite the bot to your Discord server:
   - Go back to the Discord Developer Portal
   - Navigate to the "OAuth2" section in your bot application
   - Select the "bot" scope and the necessary permissions (e.g., "Send Messages", "Manage Roles", "Kick Members")
   - Copy the generated invite link and use it to invite the bot to your server

That's it! Your Discord bot is now ready to enforce the "camera on" policy in the specified video channels. When a user joins one of those channels without their camera enabled, the bot will send them a direct message reminding them to turn on their camera. If they don't comply within the specified time limit, the bot will kick them from the channel.

Remember to handle the bot with care and ensure that it has the necessary permissions to send messages and kick members in the designated channels.

Let me know if you have any further questions or if you need assistance with any specific part of the process!

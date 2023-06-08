# DiscordBot


## Description
This is a Discord bot for my own Discord guild called "元智宅砲一家親".

This Discord bot is neither a generic one nor a bot template. All the functions are built to suit my own needs.
So if you need a good template to start building your own bot, you are looking in the wrong place.
But if you are looking for some reference of the function implementation, welcome to look around.

For now, this bot has these function listed below:
- Make a reaction to the text message sent from our members by listening to certain keywords.
- Play a sound effect for the reaction that the bot made to the text message.
- Play music for everyone in the voice channel.

## Installation
- Clone this project first
- Execute the `yarn install` command under the root folder of this project to install all the dependencies this project need.

You can also choose to build the docker image to run or develop the discord bot. This repository also contains the dockerfile for building the docker image.

## Usage
This bot will fetch settings from environment variable.

You need to create a .env file in project root for environment variable settings.

The .env file should look like as below:
```
DISCORD_TOKEN=<Fill in the bot's token>
CLIENT_ID=<Fill in the bot's client ID>
GUILD_ID=<Fill in the guild ID that the bot will serve>
SONG_REQUEST_CHANNEL_ID=<Fill in the channel ID that will be used to receive the song request>
```

Then, you can use `node src/main.js` to start the server for handling the incoming request from Discord.

Ensure the .env file exists in the directory and is correctly filled. Also, please ensure the submodule assets folder is updated with the assets repository.

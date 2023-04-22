const { AudioPlayer } = require('./players/audio_player');
const { Client, Intents } = require('discord.js');
const { registerSlashCommands } = require('./utils/slash_cmd_registrator');
const { messageHandler } = require('./handlers/message_handler');
const { slashCommandHandler } = require('./handlers/slash_cmd_handler');

const audioPlayer = new AudioPlayer();

const client = new Client({ intents:
    [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ]
});

audioPlayer.on('resourceEndedError', () => {
    client.channels.cache
        .get(process.env.SONG_REQUEST_CHANNEL_ID)
        .send('❌當前歌曲發生錯誤，跳過當前歌曲並播放佇列中下首歌曲');
});

client.on('ready', () => {
    registerSlashCommands();
    console.log(`已以 ${client.user.tag} 身分登入Discord!`);
});

client.on('messageCreate', message => {
    messageHandler(client, message, audioPlayer);
});

client.on('interactionCreate', interaction => {
    slashCommandHandler(client, interaction, audioPlayer);
});

client.login(process.env.DISCORD_TOKEN);

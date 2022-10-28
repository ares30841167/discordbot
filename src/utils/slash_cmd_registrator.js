const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

function generateSlashCommands() {
    
    return [
        new SlashCommandBuilder().setName('musicbot').setDescription('播放歌曲')

            .addSubcommand(subcommand => subcommand
                .setName('playsong')
                .setDescription('播放歌曲')
                .addStringOption(option => 
                    option.setName('url')
                        .setDescription('欲播放歌曲的Youtube網址')
                        .setRequired(true)))

            .addSubcommand(subcommand => subcommand
                .setName('playlocal')
                .setDescription('播放本地MP3資源')
                .addStringOption(option =>
                    option.setName('file')
                        .setDescription('欲播放的MP3檔名')
                        .setRequired(true)
                        .addChoices(
                            [
                                [ '神_既然青春留不住', './assets/audio/既然青春留不住.mp3' ],
                            ]
                        )))

            .addSubcommand(subcommand => subcommand
                .setName('reset')
                .setDescription('欸你給我重設一下'))

            .addSubcommand(subcommand => subcommand
                .setName('fuckout')
                .setDescription('閉嘴女人'))

            .addSubcommand(subcommand => subcommand
                .setName('skip')
                .setDescription('下面一位'))

            .addSubcommand(subcommand => subcommand
                .setName('loop')
                .setDescription('ゴールド・エクスペリエンス')),

    ].map(command => command.toJSON());
}

function registerSlashCommands() {

    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

    rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {
                body: generateSlashCommands() 
            }
        )
        .then(() => console.log('已成功向伺服器註冊指令'))
        .catch(console.error);
}

module.exports = {
    registerSlashCommands
}

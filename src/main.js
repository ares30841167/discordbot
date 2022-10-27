const { AudioPlayerStatus } = require('@discordjs/voice');
const { Client, Intents } = require('discord.js');
const { AudioPlayer } = require('./audio_player');
const { registerSlashCommands } = require('./slash_cmd');

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

client.on('ready', () => {
    registerSlashCommands();
    console.log(`已以 ${client.user.tag} 身分登入Discord!`);
});

client.on('messageCreate', message => {
    if(message.author != client.user){

        // 節慶
        if(message.content.includes("聖誕")){ // 聖誕節快樂
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/Christmas.gif'
                }]
            });
            message.channel.send("聖誕節快樂～");
        }

        if(message.content.includes("新年快樂") || message.content.includes("恭喜發財")){ // 新年快樂
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/c8763_LunarNewYear.jpg'
                }]
            });
            message.channel.send("幫你撐10秒，快給我紅包");
        }


        if(message.content.includes("台灣")){ // 台灣加油，有你有我
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/c8763_taiwan.jpg'
                }]
            });
            message.channel.send("台灣加油，有你有我 還有 スターバースト・ストリーム");
        }

        if(message.content.includes("胖.jpg")){ // 胖沁婕
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/fuck.JPG'
                }]
            });
            message.channel.send("我很瘦拉，ㄍㄋㄋ");
        }

        if(message.content.includes("真步")){ // 真步激進黨
            console.log("咕嚕靈波~");
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/DevotedSnappyAmericanshorthair-max-1mb.gif'
                }]
            });
            message.channel.send("咕嚕靈波~");
            if(message.member.voice.channel != null){
                audioPlayer.connectVoiceChannel(message.member.voice.channel);
                audioPlayer.playLocal('./assets/audio/gu-lu-ling-bo-no.mp3');
                audioPlayer.once(AudioPlayerStatus.Idle, () => console.log("gu-lu-ling-bo-no.mp3播放完畢!"));
            }
        }

        if(message.content.includes("飛踢")){ // 邪神醬飛踢
            console.log("邪神醬飛踢~");
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/flykick.gif'
                }]
            });
            message.channel.send("邪神醬飛踢!");
        }

        if(message.content.includes("抽不到")){ // 你非洲 真步很開心
            console.log("有人非洲 真步很開心");
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/unhappy.jpg'
                }]
            });
            message.channel.send("抓到非洲人~");
        }

        if(message.content.includes("steal")){ // 和真偷內褲
            console.log("和真偷內褲!");
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/steal.gif'
                }]
            });
            message.channel.send("和真Ste~~al!");
            if(message.member.voice.channel != null){
                const pickedUser = message.guild.members.cache.random();
                audioPlayer.connectVoiceChannel(message.member.voice.channel);
                audioPlayer.playLocal('./assets/audio/steal.mp3');
                audioPlayer.once(AudioPlayerStatus.Idle, () => {
                    if(pickedUser.nickname != null){
                        message.channel.send(pickedUser.nickname+" 的內褲被和真偷了!");
                    }
                    else{
                        message.channel.send(pickedUser.user.username+" 的內褲被和真偷了!");
                    }
                    console.log("steal.mp3播放完畢!");
                });
            }
        }

        if(message.content.includes("具足蟲")){ // 平安名堇 具足蟲之歌
            console.log("具足蟲出沒啦!");
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/具足蟲.gif'
                }]
            });
            message.channel.send("具足蟲出沒啦!");
            if(message.member.voice.channel != null){
                audioPlayer.connectVoiceChannel(message.member.voice.channel);
                audioPlayer.playLocal('./assets/audio/具足蟲之歌.mp3');
                audioPlayer.once(AudioPlayerStatus.Idle, () => console.log("具足蟲之歌.mp3播放完畢!"));
            }
        }

        if(message.content.includes("鈴鼓俱樂部")){ // Hololive小劇場 鈴鼓俱樂部
            console.log("鈴鼓俱樂部要開始了~");
            message.channel.send("鈴鼓俱樂部要開始了~");
            message.channel.send("https://imgur.com/a/bzNSvJ6");
        }

    }
});

client.on('interactionCreate', async interaction => {

    if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	switch(commandName) {
        case 'musicbot':
            break;
    }

});

client.login(process.env.DISCORD_TOKEN);

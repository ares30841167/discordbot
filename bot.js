const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { createAudioResource, createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, StreamType } = require('@discordjs/voice');
const { Client, Intents, MessageEmbed } = require('discord.js');
const path = require('path');

const commands = [
	//new SlashCommandBuilder().setName('play').setDescription('播放歌曲').addStringOption(option => option.setName('url').setDescription('欲播放歌曲的Youtube網址').setRequired(true)),
    //                                                                    .addSubcommand(subcommand => subcommand.setName('reset').setDescription('reset')),
    //new SlashCommandBuilder().setName('play').setDescription('reset').addSubcommand(subcommand => subcommand.setName('reset').setDescription('reset')),
    new SlashCommandBuilder().setName('musicbot').setDescription('播放歌曲')
        .addSubcommand(subcommand => subcommand
            .setName('playsong')
            .setDescription('播放歌曲')
            .addStringOption(option => option.setName('url').setDescription('欲播放歌曲的Youtube網址').setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName('playlist')
            .setDescription('播放歌單')
            .addStringOption(option => option.setName('file').setDescription('欲播放的歌單').setRequired(true)
                                                                .addChoice('邊_陳粒','./assets/music_list/TalkToGod/Chen_Li.txt')
                                                                .addChoice('邊_焦安溥','./assets/music_list/TalkToGod/Anpu.txt')
                                                                .addChoice('邊_中文1','./assets/music_list/TalkToGod/Chinese1.txt')
                                                                .addChoice('邊_中文2','./assets/music_list/TalkToGod/Chinese2.txt')
                                                                .addChoice('邊_東方爆音ジャズ','./assets/music_list/TalkToGod/TouhouProject.txt')
                                                                .addChoice('邊_草東沒有鼓手','./assets/music_list/TalkToGod/Cao_Dong.txt')
                                                                .addChoice('邊_東方Project_凋叶棕','./assets/music_list/TalkToGod/TouhouProjectTiaoietsuon.txt')
                                                                .addChoice('邊_TOHO_BOSSA_NOVA','./assets/music_list/TalkToGod/TOHO_BOSSA_NOVA.txt')
                                                                .addChoice('老歌合集','./assets/music_list/list_chinese_oldSong.txt')
                                                                .addChoice('米普_鳥屎合集','./assets/music_list/LS3165/list_Niaws.txt')
                                                                ))
        .addSubcommand(subcommand => subcommand
            .setName('playlocal')
            .setDescription('播放本地MP3資源')
            .addStringOption(option => option.setName('file').setDescription('欲播放的MP3檔名').setRequired(true)
                                                                .addChoice('神_既然青春留不住','./assets/audio/既然青春留不住.mp3')
                                                                ))
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
    new SlashCommandBuilder().setName('nmsl').setDescription('變更紹維發話權').addStringOption(option => option.setName('input').setDescription('true(閉嘴) or false(嗨周杰倫)').setRequired(true)),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
    .then(() => console.log('已成功向所有伺服器註冊指令'))
    .catch(console.error);

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

//client.on('messageCreate', message =>
var NMSL = true;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberUpdate', (oldOne, newOne) => {
    if(oldOne.user.username === "TalkToGod") {  //將冠宇的名子改成邊的名子
        console.log("邊改名了，所以我也跟著改名了。");
        const guild = client.guilds.cache.find(guild => guild.id === '582584598823960619');
        guild.members.cache.find(members => members.id === '351585369298567168').setNickname(newOne.nickname);
        guild.members.cache.find(members => members.id === '533618540469813259').setNickname('大神');   // 江
    }
});

client.on('messageCreate', message => {
    if(message.author != client.user){

        if(message.content.includes("不許可紹維說話")){ //停用 叫黃紹維閉嘴
            NMSL = true;
        }
        else if(message.content.includes("許可紹維說話")){ //停用 叫黃紹維閉嘴
            NMSL = false;
        }
        else{
            if(message.content.includes("紹維") && NMSL){ //叫黃紹維閉嘴
                console.log("已經叫黃紹維閉嘴。");
                message.channel.send({
                    files: [{
                        attachment: './assets/pictures/man.jpg'
                    }]
                });
                message.channel.send("<@623554280237826069> 噓!");
            }
    
            if(message.author.id == "623554280237826069" && NMSL){ //叫黃紹維閉嘴v2
                console.log("superyee 愛 黃紹維。");
                message.channel.send({
                    files: [{
                        attachment: './assets/pictures/man.jpg'
                    }]
                });
                message.channel.send("我， <@623554280237826069> ，是周杰倫!");
            }
        }

        //節慶
        if(message.content.includes("聖誕")){ //叫黃紹維閉嘴
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/Christmas.gif'
                }]
            });
            message.channel.send("聖誕節快樂～");
        }
        if(message.content.includes("新年快樂") || message.content.includes("恭喜發財")){ //叫黃紹維閉嘴
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/c8763_LunarNewYear.jpg'
                }]
            });
            message.channel.send("幫你撐10秒，快給我紅包");
        }


        if(message.content.includes("台灣")){ //叫黃紹維閉嘴
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/c8763_taiwan.jpg'
                }]
            });
            message.channel.send("台灣加油，有你有我 還有 スターバースト・ストリーム");
        }

    
        client.users.fetch('623554280237826069').then(scott => {if(message.mentions.has(scott)){console.log("已經叫黃紹維閉嘴。"); message.channel.send({files:[{ attachment: './assets/pictures/man.jpg' }]}); message.channel.send('噓!');}}).catch(); //叫黃紹維閉嘴 @mention

        if(message.content.includes("胖.jpg")){ //叫黃紹維閉嘴
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/fuck.JPG'
                }]
            });
            message.channel.send("我很瘦拉，ㄍㄋㄋ");
        }

        if(message.content.includes("真步")){ //真步激進黨
            console.log("咕嚕靈波~");
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/DevotedSnappyAmericanshorthair-max-1mb.gif'
                }]
            });
            message.channel.send("咕嚕靈波~");
            if(message.member.voice.channel != null){
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId: message.member.voice.channel.guild.id,
                    adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator,
                });
                const resource = createAudioResource('./assets/audio/gu-lu-ling-bo-no.mp3', { inlineVolume: true });
                resource.volume.setVolume(0.6);
                const player = createAudioPlayer();
                player.play(resource);
                connection.subscribe(player);
                player.on(AudioPlayerStatus.Idle, () => {
                    player.stop();
                    connection.destroy();
                    console.log("gu-lu-ling-bo-no.mp3播放完畢!");
                });
            }
        }

        if(message.content.includes("飛踢")){ //邪神醬飛踢
            console.log("邪神醬飛踢~");
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/flykick.gif'
                }]
            });
            message.channel.send("邪神醬飛踢!");
        }

        if(message.content.includes("抽不到")){ //你非洲 真步很開心
            console.log("有人非洲 真步很開心");
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/unhappy.jpg'
                }]
            });
            message.channel.send("抓到非洲人~");
        }

        if(message.content.includes("steal")){ //和真偷內褲
            console.log("和真偷內褲!");
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/steal.gif'
                }]
            });
            message.channel.send("和真Ste~~al!");
            if(message.member.voice.channel != null){
                const pickedUser = message.guild.members.cache.random();
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId: message.member.voice.channel.guild.id,
                    adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator,
                });
                const resource = createAudioResource('./assets/audio/steal.mp3', { inlineVolume: true });
                resource.volume.setVolume(0.6);
                const player = createAudioPlayer();
                player.play(resource);
                connection.subscribe(player);
                player.on(AudioPlayerStatus.Idle, () => {
                    player.stop();
                    connection.destroy();
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

        if(message.content.includes("具足蟲")){ //平安名堇 具足蟲之歌
            console.log("具足蟲出沒啦!");
            message.channel.send({
                files: [{
                    attachment: './assets/pictures/具足蟲.gif'
                }]
            });
            message.channel.send("具足蟲出沒啦!");
            if(message.member.voice.channel != null){
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId: message.member.voice.channel.guild.id,
                    adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator,
                });
                const resource = createAudioResource('./assets/audio/具足蟲之歌.mp3', { inlineVolume: true });
                resource.volume.setVolume(0.6);
                const player = createAudioPlayer();
                player.play(resource);
                connection.subscribe(player);
                player.on(AudioPlayerStatus.Idle, () => {
                    player.stop();
                    connection.destroy();
                    console.log("具足蟲之歌.mp3播放完畢!");
                });
            }
        }

        if(message.content.includes("鈴鼓俱樂部")){ //Hololive小劇場 鈴鼓俱樂部
            console.log("鈴鼓俱樂部要開始了~");
            message.channel.send("鈴鼓俱樂部要開始了~");
            message.channel.send("https://imgur.com/a/bzNSvJ6");
        }

    }
});

var music_Queue = [];
var isPlaying = false;
var looping = false;
var loop_music_Queue = [];
var url = '';
var now_playing_url = '';
async function YT_search(video_name){
    var WTF = ytsr(video_name);
    WTF.then(function(value) {
        console.log('end search');
        console.log("get url");
        music_Queue.push(value.items[0].url);
    }).then( () => {
        console.log('-------------');
        return new Promise(resolve => {
            setTimeout(() => {console.log('Promise');}, 1000);
        });
    });
    WTF.catch(function(err) {
        console.log('you fuck out');
        console.log(err);
        return new Promise(resolve => {
            setTimeout(() => {console.log('Promise');}, 1000);
        });
    });
}

//async 
function push_inQueue(url_or_name){
    console.log('-------------');
    console.log('push_inQueue');
    /*if(url_or_name.indexOf('https') == -1){
        //await YT_search(url_or_name);
    }
    else{*/
        music_Queue.push(url_or_name);
    //}
    console.log('-------------');
    /*return new Promise(resolve => {
        setTimeout(() => {console.log('Promise push_inQueue');}, 200);
    });*/
}
function get_stream(url){
    return ytdl(url, { 
        filter: "audioonly",
        encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
        liveBuffer: 40000,
        highWaterMark: 1 << 30
    });
}
function next_resource(){
    now_playing_url = music_Queue[0];
    var stream;
    if (now_playing_url.indexOf('./') == 0){
        stream = now_playing_url;
    }
    else{
        stream = get_stream(music_Queue[0]);
    }
    try{
        const resource = createAudioResource(stream, { inlineVolume: true });
        resource.volume.setVolume(0.5);
        console.log("playing " + music_Queue[0]);
        if(looping == true){
            loop_music_Queue.push(music_Queue[0]);
        }
        music_Queue.shift();
        return resource;
    }
    catch(err){
        console.log('-------------');
        console.log('next_resource error');
        console.log(err);
        console.log('-------------');
        return false;
    }
}
function play_Music(player){
    if(music_Queue.length == 0)
        return;
    console.log('try to play music');
    var resource = next_resource();
    if(resource != false){
        player.play(resource);  //播放
        return true;
    }
    else{
        resource = next_resource();
        if(resource != false){
            player.play(resource);  //播放
            return true;
        }
        else{
            resource = next_resource();
            if(resource != false){
                player.play(resource);  //播放
                return true;
            }
        }
    }
    return false;
    /*try{
        player.play(next_resource());  //播放
        return true;
    }
    catch(err){
        var old_music_Queue = [now_playing_url];
        music_Queue = old_music_Queue.concat(music_Queue);
        console.log('-------------');
        console.log('play error 1');
        console.log(err);
        console.log('-------------');
        try{
            player.play(next_resource());
            return true;
        }
        catch(err){
            console.log('-------------');
            console.log('play error 2');
            console.log(err);
            console.log('-------------');
            return false;
        }
    }*/
}

var player;
var connection;
var enter_channel_id;
client.on('disconnect', () => {
    console.log('disconnect');
    player.stop();
    music_Queue = [];
    loop_music_Queue = [];
    isPlaying = false;
    looping = false;
    player = createAudioPlayer();
    try{
        connection.destroy();
    }
    catch(err){
        console.log(err);
    }
});
client.on('interactionCreate', async interaction => {

    if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	switch(commandName) {
        case 'musicbot':
            if(interaction.member.voice.channel == null){
                await interaction.reply("請加入語音頻道以使用此功能!"); 
                return;
            }
            if(interaction.options.getSubcommand() == 'playsong' || interaction.options.getSubcommand() == 'playlist'
              || interaction.options.getSubcommand() == 'playlocal'){
            //if(interaction.options.getSubcommand() == 'play'){
                try{
                    if(interaction.channel.id  !='582586819577774105'){   //在非點歌頻道中點歌
                        const c = client.channels.cache.get('582586819577774105');
                        console.log("有87");
                        await interaction.reply("還敢不在「" + c.name  + "」裡點歌阿！你是黃紹維喔！");
                        return;
                    }
                    connection = joinVoiceChannel({
                        channelId: interaction.member.voice.channel.id,
                        guildId: interaction.member.voice.channel.guild.id,
                        adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
                    });
                    if(interaction.options.getSubcommand() == 'playlist'){
                        var list_path = interaction.options.getString('file');
                        const list_data = fs.readFileSync(list_path,'UTF-8');
                        const lines = list_data.split(/\r?\n/);
                        lines.forEach((line) => {
                            if(line.indexOf('/#/') != -1){
                                url = line.slice(0,line.indexOf('/#/'));
                            }
                            else{
                                url = line
                            }
                            console.log(url);
                            if(url != '')
                                push_inQueue(url);
                        })

                        await interaction.reply("正在播放 " + list_path  + " 中的歌曲");
                        url = music_Queue[0]
                    }
                    else if(interaction.options.getSubcommand() == 'playlocal'){
                        var mp3_path = interaction.options.getString('file');
                        push_inQueue(mp3_path);
                        interaction.reply("playing " + mp3_path);
                    }
                    else if(interaction.options.getSubcommand() == 'playsong'){
                        url = interaction.options.getString('url');
                        push_inQueue(url);
                        const stream = get_stream(url);
                        stream.on('info', async (info, format) => {
                            let audio_length = new Date(null);
                            audio_length.setSeconds(info["videoDetails"]["lengthSeconds"]);
                            const exampleEmbed = new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle(info["videoDetails"]["title"])
                                .setURL(info["videoDetails"]["video_url"])
                                .setThumbnail(info["videoDetails"]["thumbnails"][(info["videoDetails"]["thumbnails"].length - 1)]["url"])
                                .addFields(
                                    { name: '上傳者', value: info["videoDetails"]["ownerChannelName"], inline: true },
                                    { name: '長度', value: audio_length.toISOString().substr(11, 8), inline: true },
                                    { name: '上傳日期', value: info["videoDetails"]["publishDate"], inline: true },
                                    //{ name: 'looping', value: looping, inline: true },
                                )
                                .addFields(
                                    {name: 'url : ', value: url, inline: true},
                                )
                                .setImage(info["videoDetails"]["thumbnails"][(info["videoDetails"]["thumbnails"].length - 1)]["url"])
                            await interaction.reply({ embeds: [exampleEmbed] });
                        });
                    }
                    else{
                        await interaction.reply("點歌失敗");
                        return;
                    }

                    //music_Queue.push(url);
                    if(isPlaying == false){
                        enter_channel_id = interaction.member.voice.channel.id;
                        console.log("starting play music");
                        player = createAudioPlayer();
                        connection.subscribe(player);
                        isPlaying = true;
                        if(play_Music(player) == false){
                            interaction.channel.send('Google不讓你點歌，因為這樣Google收不到廣告費。請再試一次。');
                        }
                        player.on("error", (e) => console.log(e) );
                        player.on(AudioPlayerStatus.Idle, () => {
                            let enter_channel = client.channels.cache.get(enter_channel_id);
                            if(enter_channel.members.size == 1){
                                setTimeout(() => { // if 1 (you), wait five minutes
                                    if (enter_channel.members.size == 1){ // if there's still 1 member, 
                                        player.stop();
                                        music_Queue = [];
                                        loop_music_Queue = [];
                                        isPlaying = false;
                                        connection.destroy();
                                        now_playing_url = '';
                                        url = '';
                                    }
                                }, 30000);   // 5 min -> 300000
                            }
                            if(music_Queue.length != 0 || loop_music_Queue.length != 0){
                                //console.log(music_Queue);
                                if(looping == true && music_Queue.length == 0){
                                    music_Queue = music_Queue.concat(loop_music_Queue);
                                    loop_music_Queue = [];
                                }
                                console.log("喘口氣");
                                if(music_Queue.length > 0){
                                    setTimeout(function() {
                                        if(play_Music(player) == false){
                                            interaction.channel.send('Google不讓你點歌，因為這樣Google收不到廣告費。請再試一次。');
                                        }
                                    }, 3000)
                                }
                            }
                            else{
                                player.stop();
                                music_Queue = []
                                isPlaying = false;
                                try{
                                    setTimeout(function() {
                                        connection.destroy();
                                    }, 3000)
                                    console.log('sucess');
                                }
                                catch(err){
                                    console.log(err);
                                }
                                console.log("end play music");
                            }
                        });
                    }
                    break;
                }
                catch(err){
                    console.log(err);
                }
            }
            else if(interaction.options.getSubcommand() == 'reset' || interaction.options.getSubcommand() == 'fuckout'){
                try{
                    if(isPlaying == true){
                        player.stop();
                        music_Queue = [];
                        loop_music_Queue = [];
                        isPlaying = false;
                        connection.destroy();
                        now_playing_url = '';
                        url = '';
                    }
                    if(interaction.options.getSubcommand() == 'fuckout'){
                        const exampleEmbed = new MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('我的毒沒有解藥')
                            .setDescription('開跑')
                            .setImage('https://cdn2.ettoday.net/images/5907/d5907438.jpg')
                            await interaction.reply({ embeds: [exampleEmbed] });
                    }
                    else{
                        looping = false; ///
                        const exampleEmbed = new MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('回報指揮體 : ')
                            .setDescription('本連結體已「重製」') 
                            .setImage('http://i2.hdslb.com/bfs/archive/67a67841e391a6f52d42ad53b83597b15111cfff.jpg')
                            await interaction.reply({ embeds: [exampleEmbed] });
                    }
                    console.log("end play music");
                }
                catch(err){
                    console.log('--------------------');
                    console.log('reset or fuckout error message');
                    console.log(err);
                    console.log('--------------------');
                }
            }
            else if(interaction.options.getSubcommand() == 'skip'){
                try{
                    if(isPlaying == true){
                        player.stop();
                        console.log("play next music");
                    }
                    const exampleEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('回報指揮體 : ')
                        .setDescription('本連結體已「跳過」當前歌曲')
                        .setImage('https://media.discordapp.net/attachments/582583771258159104/914757391260729354/Shuvi_Dola.png?width=733&height=412')
                        await interaction.reply({ embeds: [exampleEmbed] });
                }
                catch(err){
                    console.log('--------------------');
                    console.log('skip error message');
                    console.log(err);
                    console.log('--------------------');
                }
            }
            else if(interaction.options.getSubcommand() == 'loop'){
                try{
                    if(looping == true){
                        const exampleEmbed = new MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('回報指揮體 : ')
                            .setDescription('本連結體已「關閉」重複撥放之功能')
                            .setImage('http://i2.hdslb.com/bfs/archive/67a67841e391a6f52d42ad53b83597b15111cfff.jpg')
                            await interaction.reply({ embeds: [exampleEmbed] });
                        if(loop_music_Queue[0] == now_playing_url)
                            loop_music_Queue.shift();
                        else if((loop_music_Queue.length > 0 && loop_music_Queue.at(-1) == now_playing_url))
                            loop_music_Queue.pop();
                        music_Queue = music_Queue.concat(loop_music_Queue);
                        loop_music_Queue = [];
                    }
                    else{
                        const exampleEmbed = new MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('回報指揮體 : ')
                            .setDescription('本連結體已「開啟」重複撥放之功能')
                            .setImage('http://i2.hdslb.com/bfs/archive/67a67841e391a6f52d42ad53b83597b15111cfff.jpg')
                            await interaction.reply({ embeds: [exampleEmbed] });
                        if(((loop_music_Queue.length > 0 && loop_music_Queue.at(-1) != now_playing_url)
                            || (loop_music_Queue.length == 0)) && now_playing_url != '')
                            loop_music_Queue.push(now_playing_url);
                    }
                    looping = !looping;
                    console.log('--------------------');
                    console.log('looping : ');
                    console.log(looping);
                    console.log(loop_music_Queue);
                    console.log('--------------------');
                }
                catch(err){
                    console.log('--------------------');
                    console.log('skip error message');
                    console.log(err);
                    console.log('--------------------');
                }
            }
            else{
                console.log('not this command');
            }
            break;
        case 'nmsl':   // 紹維閉嘴 功能開關指令
            console.log('nmsl');
            const input_mag = interaction.options.getString('input');
            let ss = '';
            if(input_mag == 'true'){
                NMSL = true;
                ss = '變更為 : 給我閉嘴';
            }
            else{
                NMSL = false;
                ss = '變更為 : 後面的朋友跟我一起唱';
            }
            const exampleEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('紹維發話權限變更公告')
                .setDescription(ss);
                await interaction.reply({ embeds: [exampleEmbed] });
            console.log('embed');
            break;
    }

});

client.on('guildMemberAdd', member => {
    if(member.user.id == "623554280237826069"){
        member.kick();
    }
});

client.login(process.env.DISCORD_TOKEN);

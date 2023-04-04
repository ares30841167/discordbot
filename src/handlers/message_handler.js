const { AudioPlayerStatus } = require('@discordjs/voice');
const { generatePictureAssetPath, generateAudioAssetPath } = require('../utils/asset_uri_generator');
const { sendStealPantsMessage } = require('../utils/steal_pants_message_sender');

function messageHandler(client, message, audioPlayer) {
    
    if(message.author == client.user)
        return;

    // 節慶
    if(message.content.includes("聖誕")){ // 聖誕節快樂
        message.channel.send({
            files: [{
                attachment: generatePictureAssetPath('Christmas.gif')
            }]
        });
        message.channel.send("聖誕節快樂～");
    }

    if(message.content.includes("新年快樂") || message.content.includes("恭喜發財")){ // 新年快樂
        message.channel.send({
            files: [{
                attachment: generatePictureAssetPath('c8763_LunarNewYear.jpg')
            }]
        });
        message.channel.send("幫你撐10秒，快給我紅包");
    }


    if(message.content.includes("台灣")){ // 台灣加油，有你有我
        message.channel.send({
            files: [{
                attachment: generatePictureAssetPath('c8763_taiwan.jpg')
            }]
        });
        message.channel.send("台灣加油，有你有我 還有 スターバースト・ストリーム");
    }

    if(message.content.includes("胖.jpg")){ // 胖沁婕
        message.channel.send({
            files: [{
                attachment: generatePictureAssetPath('fuck.JPG')
            }]
        });
        message.channel.send("我很瘦拉，ㄍㄋㄋ");
    }

    if(message.content.includes("真步")){ // 真步激進黨
        console.log("咕嚕靈波~");
        message.channel.send({
            files: [{
                attachment: generatePictureAssetPath('DevotedSnappyAmericanshorthair-max-1mb.gif')
            }]
        });
        message.channel.send("咕嚕靈波~");
        if(message.member.voice.channel != null){
            audioPlayer.connectVoiceChannel(message.member.voice.channel);
            audioPlayer.playLocal(generateAudioAssetPath('gu-lu-ling-bo-no.mp3'));
            audioPlayer.once(AudioPlayerStatus.Idle, () => console.log("gu-lu-ling-bo-no.mp3播放完畢!"));
        }
    }

    if(message.content.includes("飛踢")){ // 邪神醬飛踢
        console.log("邪神醬飛踢~");
        message.channel.send({
            files: [{
                attachment: generatePictureAssetPath('flykick.gif')
            }]
        });
        message.channel.send("邪神醬飛踢!");
    }

    if(message.content.includes("抽不到")){ // 你非洲 真步很開心
        console.log("有人非洲 真步很開心");
        message.channel.send({
            files: [{
                attachment: generatePictureAssetPath('unhappy.jpg')
            }]
        });
        message.channel.send("抓到非洲人~");
    }

    if(message.content.includes("steal")){ // 和真偷內褲
        console.log("和真偷內褲!");
        message.channel.send({
            files: [{
                attachment: generatePictureAssetPath('steal.gif')
            }]
        });
        message.channel.send("和真Ste~~al!");
        if(message.member.voice.channel != null){
            const pickedUser = message.guild.members.cache.random();
            audioPlayer.connectVoiceChannel(message.member.voice.channel);
            audioPlayer.playLocal(generateAudioAssetPath('steal.mp3'));
            audioPlayer.once(AudioPlayerStatus.Idle, () => {
                sendStealPantsMessage(message, pickedUser);
                console.log("steal.mp3播放完畢!");
            });
        }
    }

    if(message.content.includes("具足蟲")){ // 平安名堇 具足蟲之歌
        console.log("具足蟲出沒啦!");
        message.channel.send({
            files: [{
                attachment: generatePictureAssetPath('具足蟲.gif')
            }]
        });
        message.channel.send("具足蟲出沒啦!");
        if(message.member.voice.channel != null){
            audioPlayer.connectVoiceChannel(message.member.voice.channel);
            audioPlayer.playLocal(generateAudioAssetPath('具足蟲之歌.mp3'));
            audioPlayer.once(AudioPlayerStatus.Idle, () => console.log("具足蟲之歌.mp3播放完畢!"));
        }
    }

    if(message.content.includes("鈴鼓俱樂部")){ // Hololive小劇場 鈴鼓俱樂部
        console.log("鈴鼓俱樂部要開始了~");
        message.channel.send("鈴鼓俱樂部要開始了~");
        message.channel.send("https://imgur.com/a/bzNSvJ6");
    }
}

module.exports = {
    messageHandler
}
const { generateYoutubeInfoEmbed } = require('../templates/embeds/youtube_infomation');
const { generateSkipMusicEmbed } = require('../templates/embeds/skip_music');
const { generateResetAudioPlayerEmbed } = require('../templates/embeds/reset_audio_player');
const { generateToggleAudioPlayerLoopingEmbed } = require('../templates/embeds/toggle_audio_player_looping');

function slashCommandHandler(client, interaction, audioPlayer) {

    if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	switch(commandName) {
        case 'musicbot':
            if(interaction.member.voice.channel == null){
                interaction.reply("請加入語音頻道以使用此功能!"); 
                return;
            }

            if(interaction.channel.id != process.env.SONG_REQUEST_CHANNEL_ID){   //在非點歌頻道中點歌
                const c = client.channels.cache.get(process.env.SONG_REQUEST_CHANNEL_ID);
                if(c == null)
                    interaction.reply("還敢不在點歌頻道裡點歌阿！");
                else
                    interaction.reply("還敢不在「" + c.name  + "」裡點歌阿！");
                return;
            }

            audioPlayer.connectVoiceChannel(interaction.member.voice.channel);

            switch(interaction.options.getSubcommand()){
                case 'playsong':
                    audioPlayer.playYoutube(interaction.options.getString('url'));
                    audioPlayer.once('youtubeInfo', (info) => interaction.reply({ embeds: [generateYoutubeInfoEmbed(info)] }));
                    break;
                case 'playlocal':
                    audioPlayer.playLocal(interaction.options.getString('file'));
                    interaction.reply(`即將播放 ${interaction.options.getString('file')}`);
                    break;
                case 'skip':
                    audioPlayer.skip();
                    interaction.reply({ embeds: [generateSkipMusicEmbed()] });
                    break;
                case 'reset':
                case 'fuckout':
                    audioPlayer.disconnectVoiceChannel();
                    interaction.reply({ embeds: [generateResetAudioPlayerEmbed()] });
                    break;
                case 'loop':
                    let looping = audioPlayer.toggleLooping();
                    interaction.reply({ embeds: [generateToggleAudioPlayerLoopingEmbed(looping)] });
                    break;
                default:
                    interaction.reply("未知的MusicBot控制指令");
                    break;
            }
            break;
        
        default:
            interaction.reply("未知的指令");
            break;
    }
}

module.exports = {
    slashCommandHandler
}
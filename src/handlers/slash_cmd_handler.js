const { generateYoutubeInfoEmbed } = require('../templates/embeds/youtube_infomation');
const { generateSkipMusicEmbed } = require('../templates/embeds/skip_music');
const { generateResetAudioPlayerEmbed } = require('../templates/embeds/reset_audio_player');
const { generateToggleAudioPlayerLoopingEmbed } = require('../templates/embeds/toggle_audio_player_looping');
const { generateMusicPlayerCtrlActionRow } = require('../templates/rows/music_player_control_buttons');

async function slashCommandHandler(client, interaction, audioPlayer) {

    if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	switch(commandName) {
        case 'musicbot':
            if(interaction.member.voice.channel == null){
                await interaction.reply("請加入語音頻道以使用此功能!"); 
                return;
            }

            if(interaction.channel.id != process.env.SONG_REQUEST_CHANNEL_ID){   //在非點歌頻道中點歌
                const c = client.channels.cache.get(process.env.SONG_REQUEST_CHANNEL_ID);
                if(c == null)
                    await interaction.reply("還敢不在點歌頻道裡點歌阿！");
                else
                    await interaction.reply("還敢不在「" + c.name  + "」裡點歌阿！");
                return;
            }

            audioPlayer.connectVoiceChannel(interaction.member.voice.channel);

            switch(interaction.options.getSubcommand()){
                case 'playsong':
                    await interaction.deferReply();
                    try {
                        const info = await audioPlayer.playYoutube(interaction.options.getString('url'));
                        await interaction.editReply({
                            embeds: [generateYoutubeInfoEmbed(info)],
                            components: [generateMusicPlayerCtrlActionRow()]
                        });
                    } catch(e) {
                        await interaction.editReply("播放Youtube歌曲時發生例外狀況，詳情請見Console🥲");
                    }
                    break;
                case 'playlocal':
                    await interaction.deferReply();
                    audioPlayer.playLocal(interaction.options.getString('file'));
                    await interaction.editReply(`即將播放 ${interaction.options.getString('file')}`);
                    break;
                case 'skip':
                    await interaction.deferReply();
                    try {
                        audioPlayer.skip();
                        await interaction.editReply({ embeds: [generateSkipMusicEmbed()] });
                    } catch(e) {
                        await interaction.editReply("重播歌曲時發生例外狀況，詳情請見Console🥲");
                    }
                    break;
                case 'reset':
                case 'fuckout':
                    await interaction.deferReply();
                    audioPlayer.disconnectVoiceChannel();
                    await interaction.editReply({ embeds: [generateResetAudioPlayerEmbed()] });
                    break;
                case 'loop':
                    let looping = audioPlayer.toggleLooping();
                    await interaction.reply({ embeds: [generateToggleAudioPlayerLoopingEmbed(looping)] });
                    break;
                default:
                    await interaction.reply("未知的MusicBot控制指令");
                    break;
            }
            break;
        
        default:
            await interaction.reply("未知的指令");
            break;
    }
}

module.exports = {
    slashCommandHandler
}
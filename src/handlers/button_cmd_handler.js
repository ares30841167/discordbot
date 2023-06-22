const { generateYoutubeInfoEmbed } = require('../templates/embeds/youtube_infomation');
const { generateMusicPlayerCtrlActionRow } = require('../templates/rows/music_player_control_buttons');

async function buttonCommandHandler(_, interaction, audioPlayer) {

    if (!interaction.isButton()) return;

    const { customId } = interaction;
    
    switch(customId) {
        case 'queue-music':
            const voiceChannel = interaction.member.voice.channel;
            const url = interaction.message.embeds[0].url;

            if(voiceChannel == null){
                await interaction.reply("請加入語音頻道以使用此功能!"); 
                return;
            }

            audioPlayer.connectVoiceChannel(voiceChannel);
            audioPlayer.playYoutube(url);
            
            await interaction.deferReply();
            audioPlayer.once('youtubeInfo', (info) => interaction.editReply({ 
                embeds: [generateYoutubeInfoEmbed(info)],
                components: [generateMusicPlayerCtrlActionRow()]
            }));
            break;
        default:
            await interaction.reply("未知的指令");
            break;
    }
}

module.exports = {
    buttonCommandHandler
}
const { MessageEmbed } = require('discord.js');
const { convertAudioLength } = require('../../utils/audio_length_converter');

function generateYoutubeInfoEmbed(info) {

  return new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(info["videoDetails"]["title"])
      .setURL(info["videoDetails"]["video_url"])
      .setThumbnail(info["videoDetails"]["thumbnails"][(info["videoDetails"]["thumbnails"].length - 1)]["url"])
      .addFields(
          { name: '上傳者', value: info["videoDetails"]["ownerChannelName"], inline: true },
          { name: '長度', value: convertAudioLength(info["videoDetails"]["lengthSeconds"]), inline: true },
          { name: '上傳日期', value: info["videoDetails"]["publishDate"], inline: true },
      )
      .addFields(
          {name: 'URL', value: info["videoDetails"]["video_url"], inline: true},
      )
      .setImage(info["videoDetails"]["thumbnails"][(info["videoDetails"]["thumbnails"].length - 1)]["url"]);
}

module.exports = {
  generateYoutubeInfoEmbed
}
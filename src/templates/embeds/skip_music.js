const { MessageEmbed } = require('discord.js');

function generateSkipMusicEmbed() {

  return new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('回報指揮體 : ')
      .setDescription('本連結體已「跳過」當前歌曲')
      .setImage('https://media.discordapp.net/attachments/582583771258159104/914757391260729354/Shuvi_Dola.png?width=733&height=412');
}

module.exports = {
  generateSkipMusicEmbed
}
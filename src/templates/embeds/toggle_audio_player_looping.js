const { MessageEmbed } = require('discord.js');

function generateToggleAudioPlayerLoopingEmbed(looping) {

  return new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('回報指揮體 : ')
      .setDescription(looping ? '本連結體已「開啟」重複撥放之功能' : '本連結體已「關閉」重複撥放之功能')
      .setImage('http://i2.hdslb.com/bfs/archive/67a67841e391a6f52d42ad53b83597b15111cfff.jpg')
}

module.exports = {
  generateToggleAudioPlayerLoopingEmbed
}
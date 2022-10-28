const { MessageEmbed } = require('discord.js');

function generateResetAudioPlayerEmbed() {

  return new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('我的毒沒有解藥')
      .setDescription('開跑')
      .setImage('https://cdn2.ettoday.net/images/5907/d5907438.jpg');
}

module.exports = {
  generateResetAudioPlayerEmbed
}
const { MessageButton, MessageActionRow } = require('discord.js');

function generateMusicPlayerCtrlActionRow() {

  const queueMusicBtn = new MessageButton()
      .setCustomId('queue-music')
      .setLabel('▶️加入佇列')
      .setStyle('SECONDARY');

  return new MessageActionRow()
      .addComponents(queueMusicBtn);
}

module.exports = {
  generateMusicPlayerCtrlActionRow
}
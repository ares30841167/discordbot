function sendStealPantsMessage(message, pickedUser) {
  if(pickedUser.nickname != null){
    message.channel.send(pickedUser.nickname+" 的內褲被和真偷了!");
  }
  else{
    message.channel.send(pickedUser.user.username+" 的內褲被和真偷了!");
  }
}

module.exports = {
  sendStealPantsMessage
}
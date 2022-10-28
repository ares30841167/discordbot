function convertAudioLength(lengthSeconds){

  let audioLength = new Date(null);
  audioLength.setSeconds(lengthSeconds);

  return audioLength.toISOString().substring(11, 19);
}

module.exports = {
  convertAudioLength
}
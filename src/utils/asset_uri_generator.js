const PICTURE_ASSET_PATH = './assets/pictures/';
const AUDIO_ASSET_PATH = './assets/audio/';

function generatePictureAssetPath(fileName) {
  return `${PICTURE_ASSET_PATH}/${fileName}`
}

function generateAudioAssetPath(fileName) {
  return `${AUDIO_ASSET_PATH}/${fileName}`
}

module.exports = {
  generatePictureAssetPath,
  generateAudioAssetPath
}
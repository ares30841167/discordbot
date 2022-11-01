const { generatePictureAssetPath, generateAudioAssetPath } = require('./asset_uri_generator');

describe('Test generatePictureAssetPath', () => {

  test('When passing test.png as the file name input', () => {
    expect(generatePictureAssetPath('test.png')).toBe(`./assets/pictures/test.png`);
  });
});

describe('Test generateAudioAssetPath', () => {

  test('When passing test.mp3 as the file name input', () => {
    expect(generateAudioAssetPath('test.mp3')).toBe('./assets/audio/test.mp3');
  });
});

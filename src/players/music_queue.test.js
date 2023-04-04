const { MusicQueue } = require('./music_queue');

jest.mock('@discordjs/voice');

function generateMockAudioResource(type, uri) {
  return {
    metadata: {
      type: type,
      uri: uri
    }
  }
}

describe('Test MusicQueue', () => {

  it('Should be able to add AudioResource', () => {
    const musicQueue = new MusicQueue();

    musicQueue.addAudioResource(generateMockAudioResource('file', 'test.mp3'));

    expect(musicQueue.getStore().length).toBe(1);
    expect(musicQueue.getStore()[0].metadata.type).toBe('file');
    expect(musicQueue.getStore()[0].metadata.uri).toBe('test.mp3');
  });

  it('Should be able to replace current AudioResource', () => {
    const musicQueue = new MusicQueue([generateMockAudioResource('file', 'test.mp3')], 0);

    musicQueue.replaceCurrentAudioResource(generateMockAudioResource('file', 'replace.mp3'));

    expect(musicQueue.getStore().length).toBe(1);
    expect(musicQueue.getStore()[0].metadata.type).toBe('file');
    expect(musicQueue.getStore()[0].metadata.uri).toBe('replace.mp3');
  });

  it('Should be able to confirm that there still has next audio resource', () => {
    const musicQueue = new MusicQueue([generateMockAudioResource('file', 'test.mp3')], -1);

    expect(musicQueue.hasNextResource()).toBe(true);
  });

  it('Should be able to confirm that there does not has next audio resource', () => {
    const musicQueue = new MusicQueue([generateMockAudioResource('file', 'test.mp3')], 0);

    expect(musicQueue.hasNextResource()).toBe(false);
  });

  it('Should be able to get a invaild AudioResource when the current index is -1', () => {
    const musicQueue = new MusicQueue([generateMockAudioResource('file', 'test.mp3')], -1);

    expect(musicQueue.getCurrentResource()).toBeNull();
  });

  it('Should be able to get the current AudioResource', () => {
    const audioResource = generateMockAudioResource('file', 'test.mp3');

    const musicQueue = new MusicQueue([audioResource], 0);

    expect(musicQueue.getCurrentResource()).toBe(audioResource);
  });

  it('Should be able to get a invaild AudioResource when the current index is going to over the lenght of store', () => {
    const musicQueue = new MusicQueue([generateMockAudioResource('file', 'test.mp3')], 0);

    expect(musicQueue.getNextResource()).toBeNull();
  });

  it('Should be able to get the next AudioResource', () => {
    const targetAudioResource = generateMockAudioResource('file', 'test2.mp3');

    const musicQueue = new MusicQueue([
      generateMockAudioResource('file', 'test1.mp3'),
      targetAudioResource
    ], 0);

    expect(musicQueue.getNextResource()).toBe(targetAudioResource);
    expect(musicQueue.getCurrentIndex()).toBe(1);
  });

  it('Should be able to clean the whole MusicQueue', () => {
    const musicQueue = new MusicQueue([generateMockAudioResource('file', 'test.mp3')], 0);

    musicQueue.clean();

    expect(musicQueue.getStore().length).toBe(0);
    expect(musicQueue.getCurrentIndex()).toBe(-1);
  });
});
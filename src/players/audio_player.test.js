const { AudioPlayer } = require('./audio_player');
const { MusicQueue } = require('./music_queue');
const { createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { createReadStream } = require('fs');

jest.useFakeTimers();

jest.spyOn(global, 'setTimeout');
jest.spyOn(global, 'clearTimeout');
jest.spyOn(global.console, 'error');

jest.mock('fs', () => {
  return {
    createReadStream: jest.fn((fileName) => fileName)
  }
});
jest.mock('events');
jest.mock('ytdl-core', () => {
  return jest.fn(() => {
    return {
      on: jest.fn()
    }
  })
});
jest.mock('./music_queue');
jest.mock('@discordjs/voice', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@discordjs/voice'),
    joinVoiceChannel: jest.fn(() => {
      return {
        on: jest.fn(),
        joinConfig: {
          channelId: '測試語音頻道'
        },
        subscribe: jest.fn(),
        destroy: jest.fn()
      }
    }),
    createAudioPlayer: jest.fn(() => {
      return {
        on: jest.fn(),
        play: jest.fn(),
        stop: jest.fn()
      }
    }),
    createAudioResource: jest.fn((source, options) => {
      return {
        inlineVolume: options.inlineVolume,
        metadata: options.metadata,
        volume: {
          setVolume: jest.fn()
        }
      }
    })
  };
});

function generateMockVoiceChannel() {
  return {
    id: '測試語音頻道',
    guild: {
      id: '測試伺服器',
      voiceAdapterCreator: '測試適配器'
    }
  }
}

function generateVerificationVoiceChannelData() {
  return {
    channelId: '測試語音頻道',
    guildId: '測試伺服器',
    adapterCreator: '測試適配器'
  }
}

function generateMockAudioResourceOptions(type, fileName) {
  return {
    inlineVolume: true,
    metadata: {
      type: type,
      uri: fileName
    }
  }
}

function generateMockYoutubeStream() {
  return {
    on: expect.any(Function)
  };
}

function generateMockAudioResource(type, fileName) {
  return {
    inlineVolume: true,
    metadata: {
      type: type,
      uri: fileName
    },
    volume: {
      setVolume: expect.any(Function)
    }
  }
}

describe('Test AudioPlayer', () => {
  let audioPlayer;

  beforeEach(() => {
    MusicQueue.mockClear();
    audioPlayer = new AudioPlayer();

    MusicQueue.mock.instances[0].getNextResource = jest.fn(() => generateMockAudioResource('file', 'test.mp3'));
    MusicQueue.mock.instances[0].getCurrentResource = jest.fn(() => generateMockAudioResource('file', 'test.mp3'));
  });

  it('Should reject the voice channel connection request when an invalid channel is pass-in', () => {

    audioPlayer.connectVoiceChannel(null);

    expect(console.error).toHaveBeenCalledWith('AudioPlayer: 請提供欲連接的語音頻道');
    expect(joinVoiceChannel).not.toHaveBeenCalled();
  });

  it('Should reject connect to the same voice channel twice when a valid channel is pass-in', () => {
    const voiceChannel = generateMockVoiceChannel();

    audioPlayer.connectVoiceChannel(voiceChannel);
    audioPlayer.connectVoiceChannel(voiceChannel);

    expect(joinVoiceChannel).toHaveBeenCalledTimes(1);
  });

  it('Should connect to a voice channel when a valid channel is pass-in', () => {
    const voiceChannel = generateMockVoiceChannel();

    audioPlayer.connectVoiceChannel(voiceChannel);

    expect(joinVoiceChannel).toHaveBeenCalledWith(generateVerificationVoiceChannelData());
    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 300000, audioPlayer);
  });

  it('Should be able to disconnect from the voice channel', () => {
    const voiceChannel = generateMockVoiceChannel();

    audioPlayer.connectVoiceChannel(voiceChannel);

    let connectionDestroyFunc = audioPlayer.getConnection().destroy;
    audioPlayer.disconnectVoiceChannel();

    expect(clearTimeout).toHaveBeenCalledTimes(2);
    const mockMusicQueueInstance = MusicQueue.mock.instances[0];
    expect(mockMusicQueueInstance.clean).toHaveBeenCalled();
    expect(audioPlayer.getPlayer().stop).toHaveBeenCalled();
    expect(connectionDestroyFunc).toHaveBeenCalled();
    expect(audioPlayer.getConnection()).toBeNull();
  });

  it('Should be able to call the disconnect function when there is no connection', () => {
    audioPlayer.disconnectVoiceChannel();

    expect(clearTimeout).toHaveBeenCalledTimes(1);
    const mockMusicQueueInstance = MusicQueue.mock.instances[0];
    expect(mockMusicQueueInstance.clean).toHaveBeenCalled();
    expect(audioPlayer.getPlayer().stop).toHaveBeenCalled();
    expect(audioPlayer.getConnection()).toBeNull();
  });

  it('Should be able to toggle the looping functionality', () => {
    expect(audioPlayer.toggleLooping()).toBe(true);
  });

  it('Should play the same song while the looping function is on', () => {
    const voiceChannel = generateMockVoiceChannel();

    MusicQueue.mock.instances[0].getCurrentIndex = jest.fn(() => 0);

    audioPlayer.connectVoiceChannel(voiceChannel);
    audioPlayer.toggleLooping();
    audioPlayer.skip();

    const mockMusicQueueInstance = MusicQueue.mock.instances[0];
    expect(mockMusicQueueInstance.replaceCurrentAudioResource).toHaveBeenCalledTimes(1);
    expect(mockMusicQueueInstance.getCurrentResource).toHaveBeenCalledTimes(2);
    expect(clearTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    let playerPlayFunc = audioPlayer.getPlayer().play;
    let connectionSubscribeFunc = audioPlayer.getConnection().subscribe;
    expect(playerPlayFunc).toHaveBeenCalledWith(generateMockAudioResource('file', 'test.mp3'));
    expect(connectionSubscribeFunc).toHaveBeenCalledTimes(1);
  });

  it('Should be able to play the local audio file', () => {
    const voiceChannel = generateMockVoiceChannel();
    const mockAudioResource = generateMockAudioResource('file', 'test.mp3');
    const mockAudioResourceOption = generateMockAudioResourceOptions('file', 'test.mp3');

    audioPlayer.connectVoiceChannel(voiceChannel);
    audioPlayer.playLocal('test.mp3');

    expect(createReadStream).toHaveBeenCalledWith('test.mp3');
    expect(createAudioResource).toHaveBeenCalledWith('test.mp3', mockAudioResourceOption);
    const mockMusicQueueInstance = MusicQueue.mock.instances[0];
    expect(mockMusicQueueInstance.addAudioResource).toHaveBeenCalledWith(mockAudioResource);
    expect(mockMusicQueueInstance.getNextResource).toHaveBeenCalledTimes(1);
    expect(clearTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    let playerPlayFunc = audioPlayer.getPlayer().play;
    let connectionSubscribeFunc = audioPlayer.getConnection().subscribe;
    expect(playerPlayFunc).toHaveBeenCalledWith(generateMockAudioResource('file', 'test.mp3'));
    expect(connectionSubscribeFunc).toHaveBeenCalledTimes(1);
  });

  it('Should be able to play the audio file on youtube', () => {
    const voiceChannel = generateMockVoiceChannel();
    const mockYoutubeStream = generateMockYoutubeStream();
    const mockAudioResource = generateMockAudioResource('youtube', 'https://www.youtube.com');
    const mockAudioResourceOption = generateMockAudioResourceOptions('youtube', 'https://www.youtube.com');

    audioPlayer.connectVoiceChannel(voiceChannel);
    audioPlayer.playYoutube('https://www.youtube.com');

    expect(createAudioResource).toHaveBeenCalledWith(mockYoutubeStream, mockAudioResourceOption);
    const mockMusicQueueInstance = MusicQueue.mock.instances[0];
    expect(mockMusicQueueInstance.addAudioResource).toHaveBeenCalledWith(mockAudioResource);
    expect(mockMusicQueueInstance.getNextResource).toHaveBeenCalledTimes(1);
    expect(clearTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    let playerPlayFunc = audioPlayer.getPlayer().play;
    let connectionSubscribeFunc = audioPlayer.getConnection().subscribe;
    expect(playerPlayFunc).toHaveBeenCalledWith(generateMockAudioResource('file', 'test.mp3'));
    expect(connectionSubscribeFunc).toHaveBeenCalledTimes(1);
  });

  it('Should be able to skip the current playing song', () => {
    audioPlayer.skip();

    expect(audioPlayer.getPlayer().stop).toHaveBeenCalledTimes(1);
    const mockMusicQueueInstance = MusicQueue.mock.instances[0];
    expect(mockMusicQueueInstance.getNextResource).toHaveBeenCalledTimes(1);
  });
});
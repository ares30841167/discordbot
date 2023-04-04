const { AudioPlayer } = require('../players/audio_player');
const { messageHandler } = require('./message_handler');

jest.mock('../players/audio_player');
jest.mock('../utils/asset_uri_generator', () => ({
  generatePictureAssetPath: jest.fn((fileName) => fileName),
  generateAudioAssetPath: jest.fn((fileName) => fileName)
}));

function generateMockClient() {
  return {
    user: 'Bot'
  }
}

function generateMockMessage() {
  return {
    author: null,
    member: {
      voice: {
        channel: null
      }
    },
    content: null,
    guild: {
      members: {
        cache: {
          random: jest.fn()
        }
      }
    },
    channel: {
      send: jest.fn()
    }
  }
}

function generateMockAttachment(filePath) {
  return {
    files: [{
        attachment: filePath
    }]
  }
}

describe('Test messageHandler', () => {
  let client;
  let message;
  let audioPlayer;

  beforeEach(() => {
    client = generateMockClient();
    audioPlayer = new AudioPlayer();
  });

  describe('Given the message is send from the bot itself', () => {

    beforeEach(() => {
      message = generateMockMessage();
      message.author = 'Bot';
    });

    test('When receiving any message from the discord channel', () => {
      message.content = '測試';
    
      messageHandler(client, message, audioPlayer);
    
      expect(message.channel.send).not.toHaveBeenCalled();
    });

  });

  describe('Given the message is not send from the user', () => {

    beforeEach(() => {
      message = generateMockMessage();
      message.author = 'User';
    });

    describe('Given the user is not in any voice channel', () => {

      beforeEach(() => {
        message.member.voice.channel = null;
      });
  
      test('When receiving a message that includes 聖誕 from the discord channel', () => {
        message.content = '聖誕';

        messageHandler(client, message, audioPlayer);
      
        const attachment = generateMockAttachment('Christmas.gif');
        expect(message.channel.send).toHaveBeenCalledWith(attachment);
        expect(message.channel.send).toHaveBeenCalledWith('聖誕節快樂～');
      });
  
      test('When receiving a message that includes 新年快樂 from the discord channel', () => {
        message.content = '新年快樂';

        messageHandler(client, message, audioPlayer);
    
        const attachment = generateMockAttachment('c8763_LunarNewYear.jpg');
        expect(message.channel.send).toHaveBeenCalledWith(attachment);
        expect(message.channel.send).toHaveBeenCalledWith('幫你撐10秒，快給我紅包');
      });

      test('When receiving a message that includes 恭喜發財 from the discord channel', () => {
        message.content = '恭喜發財';

        messageHandler(client, message, audioPlayer);
    
        const attachment = generateMockAttachment('c8763_LunarNewYear.jpg');
        expect(message.channel.send).toHaveBeenCalledWith(attachment);
        expect(message.channel.send).toHaveBeenCalledWith('幫你撐10秒，快給我紅包');
      });
  
      test('When receiving a message that includes 台灣 from the discord channel', () => {
        message.content = '台灣';
  
        messageHandler(client, message, audioPlayer);
      
        const attachment = generateMockAttachment('c8763_taiwan.jpg');
        expect(message.channel.send).toHaveBeenCalledWith(attachment);
        expect(message.channel.send).toHaveBeenCalledWith('台灣加油，有你有我 還有 スターバースト・ストリーム');
      });
  
      test('When receiving a message that includes 胖.jpg from the discord channel', () => {
        message.content = '胖.jpg';
  
        messageHandler(client, message, audioPlayer);
      
        const attachment = generateMockAttachment('fuck.JPG');
        expect(message.channel.send).toHaveBeenCalledWith(attachment);
        expect(message.channel.send).toHaveBeenCalledWith('我很瘦拉，ㄍㄋㄋ');
      });
  
      test('When receiving a message that includes 真步 from the discord channel', () => {
        message.content = '真步';
  
        messageHandler(client, message, audioPlayer);
      
        const attachment = generateMockAttachment('DevotedSnappyAmericanshorthair-max-1mb.gif');
        expect(message.channel.send).toHaveBeenCalledWith(attachment);
        expect(message.channel.send).toHaveBeenCalledWith('咕嚕靈波~');
  
        expect(audioPlayer.connectVoiceChannel).not.toHaveBeenCalled();
      });
  
      test('When receiving a message that includes 飛踢 from the discord channel', () => {
        message.content = '飛踢';
  
        messageHandler(client, message, audioPlayer);
      
        const attachment = generateMockAttachment('flykick.gif');
        expect(message.channel.send).toHaveBeenCalledWith(attachment);
        expect(message.channel.send).toHaveBeenCalledWith('邪神醬飛踢!');
      });
  
      test('When receiving a message that includes 抽不到 from the discord channel', () => {
        message.content = '抽不到';
  
        messageHandler(client, message, audioPlayer);
      
        const attachment = generateMockAttachment('unhappy.jpg');
        expect(message.channel.send).toHaveBeenCalledWith(attachment);
        expect(message.channel.send).toHaveBeenCalledWith('抓到非洲人~');
      });
  
      test('When receiving a message that includes steal from the discord channel', () => {
        message.content = 'steal';
  
        messageHandler(client, message, audioPlayer);
      
        const attachment = generateMockAttachment('steal.gif');
        expect(message.channel.send).toHaveBeenCalledWith(attachment);
        expect(message.channel.send).toHaveBeenCalledWith('和真Ste~~al!');
  
        expect(audioPlayer.connectVoiceChannel).not.toHaveBeenCalled();
      });
  
      test('When receiving a message that includes 具足蟲 from the discord channel', () => {
        message.content = '具足蟲';
  
        messageHandler(client, message, audioPlayer);
      
        const attachment = generateMockAttachment('具足蟲.gif');
        expect(message.channel.send).toHaveBeenCalledWith(attachment);
        expect(message.channel.send).toHaveBeenCalledWith('具足蟲出沒啦!');
  
        expect(audioPlayer.connectVoiceChannel).not.toHaveBeenCalled();
      });
  
      test('When receiving a message that includes 鈴鼓俱樂部 from the discord channel', () => {
        message.content = '鈴鼓俱樂部';
  
        messageHandler(client, message, audioPlayer);
      
        expect(message.channel.send).toHaveBeenCalledWith('鈴鼓俱樂部要開始了~');
        expect(message.channel.send).toHaveBeenCalledWith('https://imgur.com/a/bzNSvJ6');
      });
    });
  
    describe('Given the user is in a voice channel', () => {

      beforeEach(() => {
        message.member.voice.channel = '測試語音頻道';
      });
  
      test('When receiving a message that includes 真步 from the discord channel', () => {
        message.content = '真步';
  
        messageHandler(client, message, audioPlayer);
      
        const attachment = generateMockAttachment('DevotedSnappyAmericanshorthair-max-1mb.gif');
        expect(message.channel.send).toHaveBeenCalledWith(attachment);
        expect(message.channel.send).toHaveBeenCalledWith('咕嚕靈波~');
  
        expect(audioPlayer.connectVoiceChannel).toHaveBeenCalledWith('測試語音頻道');
        expect(audioPlayer.playLocal).toHaveBeenCalledWith('gu-lu-ling-bo-no.mp3');
      });
  
      test('When receiving a message that includes steal from the discord channel', () => {
        message.content = 'steal';
  
        messageHandler(client, message, audioPlayer);
      
        const attachment = generateMockAttachment('steal.gif');
        expect(message.channel.send).toHaveBeenCalledWith(attachment);
        expect(message.channel.send).toHaveBeenCalledWith('和真Ste~~al!');
  
        expect(message.guild.members.cache.random).toHaveBeenCalled();
        expect(audioPlayer.connectVoiceChannel).toHaveBeenCalledWith('測試語音頻道');
        expect(audioPlayer.playLocal).toHaveBeenCalledWith('steal.mp3');
      });
  
      test('When receiving a message that includes 具足蟲 from the discord channel', () => {
        message.content = '具足蟲';
  
        messageHandler(client, message, audioPlayer);
      
        const attachment = generateMockAttachment('具足蟲.gif');
        expect(message.channel.send).toHaveBeenCalledWith(attachment);
        expect(message.channel.send).toHaveBeenCalledWith('具足蟲出沒啦!');
  
        expect(audioPlayer.connectVoiceChannel).toHaveBeenCalledWith('測試語音頻道');
        expect(audioPlayer.playLocal).toHaveBeenCalledWith('具足蟲之歌.mp3');
      });
    });
  });
});
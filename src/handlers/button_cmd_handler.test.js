const { AudioPlayer } = require('../players/audio_player');
const { buttonCommandHandler } = require('./button_cmd_handler');

jest.mock('../players/audio_player');

function generateMockClient() {
  return {
    user: 'Bot',
    channels: {
      cache: {
        get: jest.fn()
      }
    },
  }
}

function generateMockInteraction() {
  return {
    isButton: jest.fn(() => true),
    message: {
      embeds: [
        {
          url: 'url'
        }
      ]
    },
    member: {
      voice: {
        channel: null
      }
    },
    channel: {
      id: null
    },
    customId: null,
    options: {
      getSubcommand: jest.fn(() => null),
      getString: jest.fn((type) => type),
    },
    reply: jest.fn(),
    deferReply: jest.fn(),
    editReply: jest.fn()
  }
}

describe('Test buttonCommandHandler', () => {
  let client;
  let interaction;
  let audioPlayer;

  beforeEach(() => {
    client = generateMockClient();
    audioPlayer = new AudioPlayer();
  });

  describe('Given the interaction is not a button', () => {

    beforeEach(() => {
      interaction = generateMockInteraction();
      interaction.isButton = jest.fn(() => false);
    });

    test('When receiving any interaction', async () => {
  
      await buttonCommandHandler(client, interaction, audioPlayer);
  
      expect(interaction.reply).not.toHaveBeenCalled();
    });
  });

  describe('Given the interaction is a button', () => {

    beforeEach(() => {
      interaction = generateMockInteraction();
      interaction.isButton = jest.fn(() => true);
    });

    test('When receiving a unknown interaction', async () => {
      interaction.customId = null;
  
      await buttonCommandHandler(client, interaction, audioPlayer);
  
      expect(interaction.reply).toHaveBeenCalledWith('未知的指令');
    });

    describe('Given the user is not in any voice channel', () => {

      beforeEach(() => {
        interaction.member.voice.channel = null;
      });

      test('When receiving a queue muisc interaction', async () => {
        interaction.customId = 'queue-music';

        await buttonCommandHandler(client, interaction, audioPlayer);
    
        expect(interaction.reply).toHaveBeenCalledWith('請加入語音頻道以使用此功能!');
      });
    });

    describe('Given the user is in a voice channel', () => {

      beforeEach(() => {
        interaction.member.voice.channel = '測試語音頻道';
      });

      describe('Given the user send a queue muisc interaction', () => {

        beforeEach(() => {
          process.env.SONG_REQUEST_CHANNEL_ID = '點歌頻道';
          interaction.channel.id = '點歌頻道';
        });

        test('When receiving a queue muisc interaction', async () => {
          interaction.customId = 'queue-music';
      
          await buttonCommandHandler(client, interaction, audioPlayer);
      
          expect(audioPlayer.playYoutube).toHaveBeenCalledWith('url');
        });
      });
    });
  });
});
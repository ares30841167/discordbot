const { AudioPlayer } = require('../players/audio_player');
const { slashCommandHandler } = require('./slash_cmd_handler');

jest.mock('../players/audio_player');
jest.mock('../templates/embeds/skip_music', () => ({
  generateSkipMusicEmbed: jest.fn(() => 'SkipMusicEmbed')
}));
jest.mock('../templates/embeds/reset_audio_player', () => ({
  generateResetAudioPlayerEmbed: jest.fn(() => 'ResetAudioPlayerEmbed')
}));
jest.mock('../templates/embeds/toggle_audio_player_looping', () => ({
  generateToggleAudioPlayerLoopingEmbed: jest.fn((looping) => 'ToggleAudioPlayerLoopingEmbed')
}));

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
    isCommand: jest.fn(() => true),
    member: {
      voice: {
        channel: null
      }
    },
    channel: {
      id: null
    },
    commandName: null,
    options: {
      getSubcommand: jest.fn(() => null),
      getString: jest.fn((type) => type),
    },
    reply: jest.fn(),
  }
}

function generateMockEmbed(embedType) {
  return { 
    embeds: [embedType] 
  }
}

describe('Test slashCommandHandler', () => {
  let client;
  let interaction;
  let audioPlayer;

  beforeEach(() => {
    client = generateMockClient();
    audioPlayer = new AudioPlayer();
    audioPlayer.toggleLooping = jest.fn(() => true);
  });

  describe('Given the interaction is not a command', () => {

    beforeEach(() => {
      interaction = generateMockInteraction();
      interaction.isCommand = jest.fn(() => false);
    });

    test('When receiving any interaction', () => {
  
      slashCommandHandler(client, interaction, audioPlayer);
  
      expect(interaction.reply).not.toHaveBeenCalled();
    });
  });

  describe('Given the interaction is a command', () => {

    beforeEach(() => {
      interaction = generateMockInteraction();
      interaction.isCommand = jest.fn(() => true);
    });

    test('When receiving a unknown interaction', () => {
      interaction.commandName = null;
  
      slashCommandHandler(client, interaction, audioPlayer);
  
      expect(interaction.reply).toHaveBeenCalledWith('未知的指令');
    });

    describe('Given the user is not in any voice channel', () => {

      beforeEach(() => {
        interaction.member.voice.channel = null;
      });

      test('When receiving a musicbot interaction', () => {
        interaction.commandName = 'musicbot';

        slashCommandHandler(client, interaction, audioPlayer);
    
        expect(interaction.reply).toHaveBeenCalledWith('請加入語音頻道以使用此功能!');
      });
    });

    describe('Given the user is in a voice channel', () => {

      beforeEach(() => {
        interaction.member.voice.channel = '測試語音頻道';
      });

      describe('Given the user send the interaction from any channel but the song request channel', () => {

        beforeEach(() => {
          process.env.SONG_REQUEST_CHANNEL_ID = '點歌頻道';
          interaction.channel.id = '其他頻道';
        });

        test('When receiving a musicbot interaction', () => {
          interaction.commandName = 'musicbot';
      
          slashCommandHandler(client, interaction, audioPlayer);
      
          expect(interaction.reply).toHaveBeenCalledWith('還敢不在點歌頻道裡點歌阿！');
        });
      });

      describe('Given the user send the interaction from the song request channel', () => {

        beforeEach(() => {
          process.env.SONG_REQUEST_CHANNEL_ID = '點歌頻道';
          interaction.channel.id = '點歌頻道';
        });

        test('When receiving a musicbot interaction without any subcommand', () => {
          interaction.commandName = 'musicbot';
      
          slashCommandHandler(client, interaction, audioPlayer);
      
          expect(interaction.reply).toHaveBeenCalledWith('未知的MusicBot控制指令');
        });

        test('When receiving a musicbot interaction with a playsong subcommand', () => {
          interaction.commandName = 'musicbot';
          interaction.options.getSubcommand = jest.fn(() => 'playsong');
      
          slashCommandHandler(client, interaction, audioPlayer);
      
          expect(audioPlayer.playYoutube).toHaveBeenCalledWith('url');
        });

        test('When receiving a musicbot interaction with a playlocal subcommand', () => {
          interaction.commandName = 'musicbot';
          interaction.options.getSubcommand = jest.fn(() => 'playlocal');
      
          slashCommandHandler(client, interaction, audioPlayer);
      
          expect(audioPlayer.playLocal).toHaveBeenCalledWith('file');
          expect(interaction.reply).toHaveBeenCalledWith('即將播放 file');
        });

        test('When receiving a musicbot interaction with a skip subcommand', () => {
          interaction.commandName = 'musicbot';
          interaction.options.getSubcommand = jest.fn(() => 'skip');
      
          slashCommandHandler(client, interaction, audioPlayer);
      
          expect(audioPlayer.skip).toHaveBeenCalled();
          expect(interaction.reply).toHaveBeenCalledWith(generateMockEmbed('SkipMusicEmbed'));
        });

        test('When receiving a musicbot interaction with a reset subcommand', () => {
          interaction.commandName = 'musicbot';
          interaction.options.getSubcommand = jest.fn(() => 'reset');
    
          slashCommandHandler(client, interaction, audioPlayer);
      
          expect(audioPlayer.disconnectVoiceChannel).toHaveBeenCalled();
          expect(interaction.reply).toHaveBeenCalledWith(generateMockEmbed('ResetAudioPlayerEmbed'));
        });

        test('When receiving a musicbot interaction with a fuckout subcommand', () => {
          interaction.commandName = 'musicbot';
          interaction.options.getSubcommand = jest.fn(() => 'fuckout');
    
          slashCommandHandler(client, interaction, audioPlayer);
      
          expect(audioPlayer.disconnectVoiceChannel).toHaveBeenCalled();
          expect(interaction.reply).toHaveBeenCalledWith(generateMockEmbed('ResetAudioPlayerEmbed'));
        });

        test('When receiving a musicbot interaction with a loop subcommand', () => {
          interaction.commandName = 'musicbot';
          interaction.options.getSubcommand = jest.fn(() => 'loop');

          slashCommandHandler(client, interaction, audioPlayer);
      
          expect(audioPlayer.toggleLooping).toHaveBeenCalled();
          expect(interaction.reply).toHaveBeenCalledWith(generateMockEmbed('ToggleAudioPlayerLoopingEmbed'));
        });
      });
    });
  });
});
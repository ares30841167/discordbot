const EventEmitter = require('events');
const ytdl = require('ytdl-core');
const { createAudioResource, createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
class AudioPlayer extends EventEmitter {

  #disconnectTimer;
  #player;
  #resource;
  #connection;

  constructor() {
    super();
    this.#player = createAudioPlayer();
    this.#player.on(AudioPlayerStatus.Idle, () => {
      this.#resetDisconnectTimer();
      this.emit(AudioPlayerStatus.Idle);
    });
  }

  #resetDisconnectTimer() {
    clearTimeout(this.#disconnectTimer);
    this.#disconnectTimer = setTimeout((audioPlayer) => audioPlayer.disconnectVoiceChannel(), 300000, this);
  }

  #stopDisconnectTimer() {
    clearTimeout(this.#disconnectTimer);
  }

  connectVoiceChannel(voiceChannel) {
    if(voiceChannel == null) {
      console.error('AudioPlayer: 請提供欲連接的語音頻道');
      return;
    }
    
    this.#resetDisconnectTimer();
    this.#connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    console.log("連線至語音頻道");
  }

  disconnectVoiceChannel() {
    this.#stopDisconnectTimer();
    this.#player.stop();
    this.#connection.destroy();

    console.log("已從語音頻道斷開");
  }

  #getYoutubeStream(url) {
    return ytdl(url, { 
      filter: "audioonly",
      encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
      liveBuffer: 40000,
      highWaterMark: 1 << 30
    });
  }

  #setAudioResource(audioResource) {
    this.#resource = createAudioResource(audioResource, { inlineVolume: true });
    this.#resource.volume.setVolume(0.6);
  }

  #play(audioResource) {
    if(this.#player == null) {
      console.error('AudioPlayer: 請先初始化@discordjs/voice/AudioPlayer');
      return;
    }

    if(this.#connection == null
        || this.#connection.AudioPlayerStatus === VoiceConnectionStatus.Destroyed) {
      console.error('AudioPlayer: 請先重新連接至語音頻道');
      return;
    }

    this.#stopDisconnectTimer();

    this.#setAudioResource(audioResource);

    this.#player.play(this.#resource);

    this.#connection.subscribe(this.#player);
  }

  playLocal(audioFile) {
    this.#play(audioFile);
  }

  playYoutube(url) {
    const youtubeStream = this.#getYoutubeStream(url);
    this.#play(youtubeStream);
  }
}

module.exports = {
  AudioPlayer
}
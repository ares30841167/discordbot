const EventEmitter = require('events');
const ytdl = require('ytdl-core');
const { MusicQueue } = require('./music_queue');
const { createAudioResource, createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, VoiceConnectionStatus, PlayerSubscription } = require('@discordjs/voice');
class AudioPlayer extends EventEmitter {
  
  #disconnectTimer;
  #musicQueue;
  #player;
  #connection;

  #connectionStatus;
  #playerStatus;

  constructor() {
    super();
    this.#musicQueue = new MusicQueue();
    this.#player = createAudioPlayer();
    this.#initialPlayer();
    this.#player.on(AudioPlayerStatus.Idle, () => {
      this.#resetDisconnectTimer();
      this.emit(AudioPlayerStatus.Idle);
      this.#tryToPlayNextResource();
    });
  }

  #initialPlayer() {
    this.#playerStatus = AudioPlayerStatus.Idle;
    this.#player.on('stateChange', (_, newState) => this.#playerStatus = newState.status);
  }

  #initialConnection() {
    this.#connectionStatus = VoiceConnectionStatus.Signalling;
    this.#connection.on('stateChange', (_, newState) => this.#connectionStatus = newState.status);
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

    if(this.#connection != null
        && this.#connection.joinConfig.channelId == voiceChannel.id)
      return;

    this.#resetDisconnectTimer();
    this.#connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    
    this.#initialConnection();

    console.log("連線至語音頻道");
  }

  disconnectVoiceChannel() {
    this.#stopDisconnectTimer();
    this.#musicQueue.Clean();
    this.#player.stop();
    this.#connection.destroy();

    console.log("已從語音頻道斷開");
  }

  #getYoutubeStream(url) {
    const youtubeStream = ytdl(url, { 
      filter: "audioonly",
      encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
      liveBuffer: 40000,
      highWaterMark: 1 << 30
    });

    youtubeStream.on('info', (info) => this.emit('youtubeInfo', info));

    return youtubeStream;
  }

  #createAudioResource(source) {
    const resource = createAudioResource(source, { inlineVolume: true });
    resource.volume.setVolume(0.6);

    return resource;
  }

  #play(audioResource) {
    if(this.#player == null) {
      console.error('AudioPlayer: 請先初始化@discordjs/voice/AudioPlayer');
      return;
    }

    if(this.#connection == null
        || this.#connectionStatus === VoiceConnectionStatus.Destroyed) {
      console.error('AudioPlayer: 請先重新連接至語音頻道');
      return;
    }

    this.#stopDisconnectTimer();

    this.#player.play(audioResource);

    this.#connection.subscribe(this.#player);
  }

  #tryToPlayNextResource() {
    if(this.#playerStatus === AudioPlayerStatus.Idle
        && this.#musicQueue.HasNextResource())
      this.#play(this.#musicQueue.GetNextResource());
  }

  playLocal(filePath) {
    const audioResource = this.#createAudioResource(filePath);
    this.#musicQueue.AddAudioResource(audioResource);
    this.#tryToPlayNextResource();
  }

  playYoutube(url) {
    const audioResource = this.#createAudioResource(
      this.#getYoutubeStream(url)
    );
    this.#musicQueue.AddAudioResource(audioResource);
    this.#tryToPlayNextResource();
  }
}

module.exports = {
  AudioPlayer
}
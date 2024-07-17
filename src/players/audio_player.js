const { createReadStream } = require('fs')
const EventEmitter = require('events');
const ytdl = require('@distube/ytdl-core');
const { MusicQueue } = require('./music_queue');
const { createAudioResource, createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');

const AUDIO_PLAYER_IDLING_STATE = [
  AudioPlayerStatus.Idle,
  AudioPlayerStatus.Paused,
  AudioPlayerStatus.AutoPaused
]

class AudioPlayer extends EventEmitter {
  
  #disconnectTimer;
  #musicQueue;
  #player;
  #connection;

  #connectionStatus;
  #playerStatus;

  #looping;

  constructor() {
    super();
    this.#looping = false;
    this.#musicQueue = new MusicQueue();
    this.#player = createAudioPlayer();
    this.#initialPlayer();
    this.#player.on(AudioPlayerStatus.Idle, () => {
      this.#resetDisconnectTimer();
      this.emit(AudioPlayerStatus.Idle);
      this.#tryToPlayNextResource();
    });
  }

  getPlayer() {
    return this.#player;
  }

  getConnection() {
    return this.#connection;
  }

  getDisconnectTimer() {
    return this.#disconnectTimer;
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
    this.#musicQueue.clean();
    this.#player.stop();
    if(this.#connection != null)
      this.#connection.destroy();
    this.#connection = null;

    console.log("已從語音頻道斷開");
  }

  #getYoutubeStream(info) {
    const youtubeStream = ytdl.downloadFromInfo(info, { 
      filter: "audioonly",
      encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
      liveBuffer: 40000,
      highWaterMark: 1 << 30
    });

    return youtubeStream;
  }

  #createAudioResource(source, metadata) {
    const resource = createAudioResource(source, { inlineVolume: true, metadata: metadata });
    resource.volume.setVolume(0.6);

    return resource;
  }

  #play(audioResource) {
    if(this.#player == null) {
      console.error('AudioPlayer: 請先初始化@discordjs/voice/AudioPlayer');
      return;
    }

    if(audioResource == null) {
      console.error('AudioPlayer: 請指定播放音訊資源或播放佇列已到結尾');
      return;
    }

    if(this.#connection == null
        || this.#connectionStatus === VoiceConnectionStatus.Destroyed) {
      console.error('AudioPlayer: 請先重新連接至語音頻道');
      return;
    }

    if(audioResource.ended) {
      console.error('AudioPlayer: 音訊資源發生錯誤，音訊資源已處於結束狀態');
      this.skip();
      this.emit('resourceEndedError');
      return;
    }

    this.#stopDisconnectTimer();

    this.#player.play(audioResource);

    this.#connection.subscribe(this.#player);
  }

  async #replay(audioResource) {
    switch(audioResource.metadata.type) {
      case 'file':
        this.#musicQueue.replaceCurrentAudioResource(
          this.#createAudioResource(
            createReadStream(audioResource.metadata.uri),
            audioResource.metadata
          )
        );
        break;
      case 'youtube':
        const info = await ytdl.getInfo(audioResource.metadata.uri);
        this.#musicQueue.replaceCurrentAudioResource(
          this.#createAudioResource(
            this.#getYoutubeStream(info),
            audioResource.metadata
          )
        );
        break;
      default:
        return;
    }

    this.#play(this.#musicQueue.getCurrentResource());
  }

  #tryToPlayNextResource() {
    if(!AUDIO_PLAYER_IDLING_STATE.includes(this.#playerStatus))
      return;

    if(this.#musicQueue.getCurrentIndex() != -1 && this.#looping)
      this.#replay(this.#musicQueue.getCurrentResource());
    else
      this.#play(this.#musicQueue.getNextResource());
  }

  toggleLooping() {
    this.#looping = !this.#looping;

    return this.#looping;
  }

  playLocal(filePath) {
    const audioResource = this.#createAudioResource(
      createReadStream(filePath),
      {
        type: 'file',
        uri: filePath
      }
    );
    this.#musicQueue.addAudioResource(audioResource);
    this.#tryToPlayNextResource();
  }

  async playYoutube(url) {
    const info = await ytdl.getInfo(url);
    const audioResource = this.#createAudioResource(
      this.#getYoutubeStream(info),
      {
        type: 'youtube',
        uri: url
      }
    );
    this.#musicQueue.addAudioResource(audioResource);
    this.#tryToPlayNextResource();
    
    return info;
  }

  skip() {
    this.#player.stop();
    this.#tryToPlayNextResource();
  }
}

module.exports = {
  AudioPlayer
}

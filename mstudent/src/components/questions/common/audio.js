require('../../../utils/audio-external');
import external from '../../../utils/external';


const h5Audio={
  VoxAudio: null,
  audio: null,
  isPlaying: false,
  config:{},
  isApp: !!external.getInitParams().uuid,//是app外殼
  init(){
    if(h5Audio.isApp){
      h5Audio.VoxAudio=new vox.external.audio.Audio();
    }else{
      if(!h5Audio.audio){
        h5Audio.audio=document.createElement("AUDIO");
        h5Audio.audio.preload='metadata';
        document.body.appendChild(h5Audio.audio);
        h5Audio.audio.addEventListener('loadeddata',h5Audio.audioLoadeddata)
        h5Audio.audio.addEventListener('progress',h5Audio.audioProgress)
        h5Audio.audio.addEventListener('ended',h5Audio.audioEnded)
        h5Audio.audio.addEventListener('error',h5Audio.audioError)
      }

    }
  },
  load({url, onLoadProgress, onLoadComplete, onLoadError, onPlayProgress, onPlayComplete, onPlayError}){
    h5Audio.isPlaying=false
    h5Audio.config={url, onLoadProgress, onLoadComplete, onLoadError, onPlayProgress, onPlayComplete, onPlayError}
    if(h5Audio.isApp){
      h5Audio.VoxAudio.load({url, onLoadProgress, onLoadComplete:h5Audio.audioLoadeddata,
        onLoadError:h5Audio.audioLoadError, onPlayProgress:h5Audio.audioProgress, onPlayComplete:h5Audio.audioEnded, onPlayError:h5Audio.audioPlayError})
    }else{
      h5Audio.audio.src=url;
      h5Audio.audio.play();
    }
  },
  play({url, onPlayProgress, onPlayComplete, onPlayError}){
    h5Audio.isPlaying=true
    h5Audio.config={url, onPlayProgress, onPlayComplete, onPlayError}
    if(h5Audio.isApp){
      h5Audio.VoxAudio.play({url, onPlayProgress:h5Audio.audioProgress, onPlayComplete:h5Audio.audioEnded, onPlayError:h5Audio.audioPlayError})
    }else{
      h5Audio.audio.src=url;
      h5Audio.audio.play();
    }
  },
  pause(){
    h5Audio.isPlaying=false
    if(h5Audio.isApp){
      h5Audio.nativeAudio.pause();
    }
    else{
      h5Audio.audio.pause();
    }
  },
  repause(){
    h5Audio.isPlaying=true
    if(h5Audio.isApp){
      h5Audio.nativeAudio.repause();
    }
    else{
      h5Audio.audio.play();
    }
  },
  stop(){
    h5Audio.isPlaying=false
    if(h5Audio.isApp){
      h5Audio.nativeAudio.stop();
    }
    else{
      h5Audio.audio.pause();
    }
  },
  //播放完成
  audioEnded(){
    h5Audio.isPlaying = false;
    if(h5Audio.config.onPlayComplete){
      h5Audio.config.onPlayComplete()
    }
  },
  //正在播放
  audioProgress(){
    h5Audio.isPlaying = true;
    if(h5Audio.config.onPlayProgress){
      h5Audio.config.onPlayProgress()
    }

  },
  //加载完成
  audioLoadeddata(){
    if(h5Audio.config.onLoadComplete){
      h5Audio.config.onLoadComplete()
    }

  },
  // 加载失败
  audioLoadError(){
    h5Audio.isPlaying = false;
    if(h5Audio.config.onLoadError){
      h5Audio.config.onLoadError()
    }
  },
  // 播放失败
  audioPlayError(){
    h5Audio.isPlaying = false;
    if(h5Audio.config.onPlayError){
      h5Audio.config.onPlayError()
    }

  },
  //失败
  audioError(){
    if(!h5Audio.isPlaying){
      h5Audio.audioLoadError()
    }else{
      h5Audio.audioPlayError()
    }

  }
}

h5Audio.init()

export default h5Audio;

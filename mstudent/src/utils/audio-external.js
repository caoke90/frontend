/**
 * Created by Helcarin on 2016/4/25.
 * 音频扩展
 */
"use strict";
let vox = window.vox||{};
vox.log = function(msg){console.log(msg);}
vox.external = vox.external || {};
vox.task = vox.task;
vox.Error = vox.Error || function(){};

vox.external.audio = vox.external.audio || {};
vox.external.audio.implement = false;

/**
 * 音频播放器类型
 */
vox.external.audio.PlayerType = {
	/** html5 audio element */
	Html5: "html5",
	/** jplayer */
	JPlayer: "jplayer",
	/** external */
	External: "external"

};

// 全局事件定义
vox.external.audio.EVENT_ERROR = "event_vox_audio_error";
vox.external.audio.EVENT_LOAD_PROGRESS = "event_vox_audio_load_progress";
vox.external.audio.EVENT_PLAY_PROGRESS = "event_vox_audio_play_progress";

// 加载状态
vox.external.audio.LoadState = {
	Init: "init",
	Loading: "loading",
	Loaded: "loaded",
	Error: "error"
};

// 播放状态
vox.external.audio.PlayState = {
	Init: "init",
	Playing: "playing",
	Paused: "paused",
	Ended: "ended",
	Error: "error"
};

// 全局map
vox.external.audio.list = {};

// 停止播放当前所有声音
vox.external.audio.stopAll = function() {
	for (let id in vox.external.audio.list) {
		const audio = vox.external.audio.list[id];
		audio.stop();
	}
};

// 销毁当前所有声音
vox.external.audio.disposeAll = function() {
	for (let id in vox.external.audio.list) {
		const audio = vox.external.audio.list[id];
		audio.dispose();
	}
};

let GUID = function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    return s.join("");
};

vox.external.audio.Audio = class VoxAudio {
	constructor() {
		/** id */
		this.id = GUID("ExternalAudio");

		/** 音频地址 */
		this.url = null;

		/** 加载状态 */
		this.loadState = "init";

		/** 播放状态 */
		this.playState = "init";

		/** 音频长度（s） */
		this.duration = 0;

		/** 当前缓冲时间（s） */
		this.bufferedTime = 0;

		/** 当前播放时间（s） */
		this.playingTime = 0;

		/** load progress回调 */
		this.onLoadProgress = null;

		/** load complete回调 */
		this.onLoadComplete = null;

		/** load error回调 */
		this.onLoadError = null;

		/** play progress回调 */
		this.onPlayProgress = null;

		/** play complete回调 */
		this.onPlayComplete = null;

		/** play error回调 */
		this.onPlayError = null;

		this.addToGlobal();
	}

	/** 添加到全局记录 */
	addToGlobal() {
		vox.external.audio.list[this.id] = this;
	}

	/** 移除出全局记录 */
	removeFromGlobal() {
		delete vox.external.audio.list[this.id];
	}

	/**
	 * 加载音频
	 * 如果已经在加载或播放，会清除当前状态
	 */
	load({url, onLoadProgress, onLoadComplete, onLoadError, onPlayProgress, onPlayComplete, onPlayError}) {
		// if (this.loadState != "init") {
		// 	this.play();
		// }

		if (!url) { throw new Error("url为空"); }
		this.url = url;

		this.onLoadProgress = onLoadProgress;
		this.onLoadComplete = onLoadComplete;
		this.onLoadError = onLoadError;
		this.onPlayProgress = onPlayProgress;
		this.onPlayComplete = onPlayComplete;
		this.onPlayError = onPlayError;

		this.log("load");
		this.loadState = "init";
		this.playState = "init";

		vox.external.loadAudio(this.url);
	}

	/**
	 * 播放
	 */
	play({url, onPlayProgress, onPlayComplete, onPlayError}={}) {
		//if (!(this.playState === "init" || this.playState === "ended" )) { return; }

		//this.stop();

		this.log("play");
		this.playState = "init";

		if(url){this.url = url;}

		if(onPlayProgress){ this.onPlayProgress = onPlayProgress;}
		if(onPlayComplete){ this.onPlayComplete = onPlayComplete;}
		if(onPlayError){ this.onPlayError = onPlayError;}


		vox.external.playAudio(this.url);
	}

	/**
	 * 暂停
	 */
	pause() {
		switch (this.playState) {
			case "playing":
				this.log("pause");
				vox.external.pauseAudio(this.url);
				break;

			default:
				return;
		}
	}
  /**
   * 继续播放
   */
  repause() {
    switch (this.playState) {
      case "init":
      case "playing":
      case "paused":
      case "ended":
        vox.external.seekAudio(this.url, this.playingTime);
        break;

      default:
    }
  }
	/**
	 * 跳转
	 * @param {Number} progress 进度
	 */
	seek(progress) {
		switch (this.playState) {
			case "init":
			case "playing":
			case "paused":
			case "ended":
				if (!(this.duration > 0)) return;
				if (!(progress >= 0)) { progress = 0; }
				if (!(progress <= 1)) { progress = 1; }

				const time = this.duration * progress;
				vox.external.seekAudio(this.url, time);
				break;

			default:
		}
	}

	/**
	 * 停止
	 */
	stop() {
		switch (this.playState) {
			case "playing":
			case "paused":
				this.log("stop");
				vox.external.stopAudio(this.url);
				break;

			default:
		}
	}

	/**
	 * 更新下载状态
	 * @param {string} state
	 * @param {number} currentTime
	 * @param {number} duration
	 * @param {string=null} errorCode
	 */
	updateLoadState({state, currentTime, duration, errorCode}) {
		if (!(isFinite(currentTime) && currentTime > 0)) {
			currentTime = 0;
		}
		if (!(isFinite(duration) && duration > 0)) {
			duration = 0;
		}

		switch (state) {
			// 错误
			case "error":
				if (this.loadState === "error" || this.loadState === "loaded") { break; }
				this.loadState = state;
				this.log(`on load error`);

				// 全局事件
				// TODO
				// $(vox.audio).trigger(vox.audio.EVENT_ERROR, {url: this.url});

				// 自身事件
				if (this.onLoadError) {
					this.onLoadError(new vox.Error(null, errorCode));
				}

				break;

			// 加载完
			case "loaded":
				if (this.loadState === "error" || this.loadState === "loaded") { break; }
				this.loadState = state;
				this.log(`on load complete: ${currentTime} / ${duration}`);

				this.duration = duration;
				this.bufferedTime = this.duration;

				if (this.onLoadComplete) {
					this.onLoadComplete();
				}

				break;

			// 加载中
			case "loading":
				if (this.loadState === "error" || this.loadState === "loaded") { break; }
				this.loadState = state;
				//this.log(`on load progress: ${currentTime} / ${duration}`);

				this.duration = duration;
				this.bufferedTime = currentTime;

				if (this.onLoadProgress) {
					this.onLoadProgress({currentTime, duration});
				}

				break;
		}
	}

	/**
	 * 更新播放状态
	 * @param {string} state
	 * @param {number} currentTime
	 * @param {number} duration
	 * @param {string=null} errorCode
	 */
	updatePlayState({state, currentTime, duration, errorCode}) {
		if (!(isFinite(currentTime) && currentTime > 0)) {
			currentTime = 0;
		}
		if (!(isFinite(duration) && duration > 0)) {
			duration = 0;
		}

		switch (state) {
			// 错误
			case "error":
				if (this.playState === "error" || this.playState === "ended") { break; }
				this.playState = state;
				this.log(`on play error`);

				// 全局事件
				// TODO
				// $(vox.audio).trigger(vox.audio.EVENT_ERROR, {url: this.url});

				// 自身事件
				if (this.onPlayError) {
					this.onPlayError(new vox.Error(null, errorCode));
				}

				break;

			case "ended":
				if (this.playState === "error" || this.playState === "ended") { break; }
				this.playState = state;
				this.log(`on play complete: ${currentTime} / ${duration}`);

				//this.duration = duration;
				//this.playingTime = currentTime;

				if (this.onPlayComplete /*&& currentTime > 0 && currentTime >= duration*/) {
					this.onPlayComplete({currentTime:this.currentTime, duration:this.duration});
				}

				break;

			case "playing":
				if (this.playState === "error" || this.playState === "ended") { break; }
				this.playState = state;
				//this.log(`on play progress: ${currentTime} / ${duration}`);

				this.duration = duration;
				this.playingTime = currentTime;

				if (this.onPlayProgress) {
					this.onPlayProgress({currentTime, duration});
				}

				break;

			case "paused":
				if (this.playState !== "playing") { break; }
				this.playState = state;
				this.log(`on play paused: ${currentTime} / ${duration}`);

				this.duration = duration;
				this.playingTime = currentTime;

				if (this.onPlayProgress) {
					this.onPlayProgress({currentTime, duration});
				}

				break;

			default:
		}
	}

	log(msg) {
		vox.log(`${this.id} (${this.url}) ${msg}`);
	}

	/** 重置 */
	reset() {
		this.log("reset");
		this.stop();

		this.url = null;

		this.onLoadProgress = null;
		this.onLoadComplete = null;
		this.onLoadError = null;
		this.onPlayProgress = null;
		this.onPlayComplete = null;
		this.onPlayError = null;

		this.loadState = "init";
		this.playState = "init";
	}

	/**
	 * 销毁
	 */
	dispose() {
		this.stop();
		this.removeFromGlobal();
	}

};



//--------------------------------------- external -----------------------------------------------

vox.external.loadAudio = function (url) {
	if (window.external.loadAudio) {
		vox.log("[call external] loadAudio: url=" + url);
		window.external.loadAudio(url);
	} else {
		vox.log("[no external] loadAudio: url=" + url);
	}
};

/**
 * 播放音频
 * @param {String} url          url
 */
vox.external.playAudio = function (url) {
	if (window.external.playAudio) {
		vox.log("[call external] playAudio: url=" + url);
		window.external.playAudio(url);
	} else {
		vox.log("[no external] playAudio: url=" + url);
	}
};

/**
 * 暂停播放音频
 * @param {String} url  url
 */
vox.external.pauseAudio = function (url) {
	if (window.external.pauseAudio) {
		vox.log("[call external] pauseAudio: url=" + url);
		window.external.pauseAudio(url);
	} else {
		vox.log("[no external] pauseAudio: url=" + url);
	}
};

/**
 * 移动播放进度到指定位置
 * @param {String} url      url
 * @param {Number} time     跳转位置(s)
 */
vox.external.seekAudio = function (url, time) {
	if (window.external.seekAudio) {
		vox.log("[call external] seekAudio: url=" + url + ", time=" + time);
		window.external.seekAudio(url, time);
	} else {
		vox.log("[no external] seekAudio: url=" + url + ", time=" + time);
	}
};

/**
 * 停止播放音频
 * @param {String} url  url
 */
vox.external.stopAudio = function (url) {
	if (window.external.stopAudio) {
		vox.log("[call external] stopAudio: url=" + url);
		window.external.stopAudio(url);
	} else {
		vox.log("[no external] stopAudio: url=" + url);
	}
};

/**
 * 回调：音频下载
 * @param {String} url              url
 * @param {String} state            当前下载状态
 * @param {Number} currentTime      当前时长(s)
 * @param {Number} duration         总时长(s)
 */
vox.task.loadAudioProgress = function(url, state, currentTime, duration) {
	//vox.log("[audio] callback loading progress: " + state + ", " + currentTime + ", " + duration + ", " + url);

	// 错误码处理
	let errorCode = parseInt(state);
	if (errorCode > 0) {
		errorCode = errorCode.toString();
		state = "error";
	}
	else {
		errorCode = 0;
	}

	if (["init", "loading", "loaded", "error"].indexOf(state) < 0) {
		vox.log("[audio] invalid loading state: " + state, vox.log.LEVEL_ERR);
		return;
	}
	currentTime = parseFloat(currentTime);
	duration = parseFloat(duration);

	for (let id in vox.external.audio.list) {
		const audio = vox.external.audio.list[id];
		if (!audio) {
			delete vox.external.audio.list[id];
			continue;
		}
		if (audio.url === url) {
			audio.updateLoadState({state, currentTime, duration, errorCode});
		}
	}
};

/**
 * 回调：音频播放
 * @param {String} url              url
 * @param {String} state            当前播放状态
 * @param {Number} currentTime      当前时长(s)
 * @param {Number} duration         总时长(s)
 */
vox.task.playAudioProgress = function(url, state, currentTime, duration) {
	//vox.log("[audio] callback playing progress: " + state + ", " + currentTime + ", " + duration + ", " + url);

	// 错误码处理
	let errorCode = parseInt(state);
	if (errorCode > 0) {
		errorCode = errorCode.toString();
		state = "error";
	}
	else {
		errorCode = 0;
	}

	if (["init", "playing", "paused", "ended", "error"].indexOf(state) < 0) {
		vox.log("[audio] invalid playing state: " + state, vox.log.LEVEL_ERR);
		return;
	}
	currentTime = parseFloat(currentTime);
	duration = parseFloat(duration);

	for (let id in vox.external.audio.list) {
		const audio = vox.external.audio.list[id];
		if (!audio) {
			delete vox.external.audio.list[id];
			continue;
		}
		if (audio.url === url) {
			audio.updatePlayState({state, currentTime, duration, errorCode});
		}
	}
};

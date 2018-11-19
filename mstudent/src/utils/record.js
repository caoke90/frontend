let vox = window.vox;
let getResultTimeout = 8000; //停止录音后8000毫秒被认为获取打分结果超时
let scoreCallbackMap = {}; //录音结束。用于放置回调函数，因为是被壳调用，所以只能用一个集合来存放
let scoreErrorCbMap = {}; //录音错误时的回调
let overtimeMap = {}; //超时的计时器
let playbackCallbackMap = {}; //回放结束
let currentPlaybackId = ''; //记录当前正在播放的回放的id
let errorCode = {
	//录音失败 取第一条录音失败错误码作为参考
	RECORD_ERROR: "53000",
	//打分评分失败
	//取第一条打分失败的错误码作为参考
	RECORD_RATE_ERROR: "53021",
	VOICE_ENGINE_SERVICE_ERROR_TIP: '连接语音服务错误,请重试',
	VOICE_ENGINE_NETWORK_ERROR: '-101',
	VOICE_ENGINE_NETWORK_ERROR_TIP: '网络不太通畅，快去检查下网络重试，或等会再做此推荐',

	VOICE_ENGINE_WORD_ERROR_TIP: '无效单词，请反馈错误',

	VOICE_ENGINE_SDCARD_ERROR: '-103',
	VOICE_ENGINE_SDCARD_ERROR_TIP: '找不内存卡,请检查您的手机',

	VOICE_ENGINE_SHORT_ERROR: '-104',
	VOICE_ENGINE_SHORT_ERROR_TIP: '录音时间过短',

	VOICE_ENGINE_AGAIN_ERROR: '-105',
	VOICE_ENGINE_AGAIN_ERROR_TIP: '收到处理TRY_AGAIN的通知,重试当前题目',

	VOICE_ENGINE_FAIL_ERROR_TIP: '打分失败，请重试',

    VOICE_ENGINE_QUESTION_ERROR_TIP: '题目数据错误，请联系客服'
};

//分数区间与等级对照表
let scoreLevelArr = [
	{
		"gte": 86,
		"lte": 100,
		"level": "A",
		"score": 100
	},
	{
		"gte": 61,
		"lte": 80,
		"level": "B",
		"score": 90
	},
	{
		"gte": 41,
		"lte": 60,
		"level": "C",
		"score": 75
	},
	{
		"gte": 0,
		"lte": 40,
		"level": "D",
		"score": 60
	}
];

//根据引擎打分，得到我们的映射分数
export function getScoreByEngineScore(engineScore) {
    for(var i = 0; i < scoreLevelArr.length; i++){
        var temp = scoreLevelArr[i];
        if(engineScore >= temp.gte && engineScore <= temp.lte){
            return {score: temp.score, level: temp.level};
        }
    }
    return {score: 60, level: "D"};
}

/*
*开始录音
@params： id, voiceText, model, callback
*/
export function startRecord(id, voiceText, model, callback, errorCallback){
    if(typeof callback === 'function'){
        scoreCallbackMap[id] = callback;
    }
    if(typeof errorCallback === 'function'){
        scoreErrorCbMap[id] = errorCallback;
    }
	if(window.external && window.external.oralStartRecord){
		let config = JSON.stringify({
			id: id,
			voiceText: voiceText,
			model: model
		});
		window.external.oralStartRecord(config);
	}
	else{
		//没有壳的环境
		console.log('无录音环境');
	}
}

/*
* 停止录音
*/
export function stopRecord(id){
	if(window.external && window.external.oralStopRecord){
		let config = JSON.stringify({
			id: id
		});
		window.external.oralStopRecord(config);
	}
	else{
		//不是客户端的情况，用于在浏览器测试
		let testData = {
			id: id,
			success: true
		}
		testData.result = {
			lines:[{"end":1.241,
                "pronunciation":40.743,
                "begin":0,
                "sample":"No he isn't ",
                "score":13.833,
                "integrity":33.333,
                "usertext":"No",
                "fluency":55.833}],
            fileUrl: '',
            finalScore: 60
		};
		let config = JSON.stringify(testData);
		setTimeout(function(){
			vox.task.onScoreComplete(config);
		}, 2000);
	}
    overtimeMap[id] = {};
    overtimeMap[id].remain = 30;
    overtimeMap[id].timer = window.setInterval(()=>{
        if(!overtimeMap[id]){
            return;
        }
        overtimeMap[id].remain--;
        if(overtimeMap[id].remain === 0){
            window.clearInterval(overtimeMap[id].timer);
            overtimeMap[id].timer = null;
            let errorCb = scoreErrorCbMap[id];
            if(errorCb){
                errorCb('打分超时(53018)', '53018');
            }
        }
    }, 1000);
}

/*
* 回放录音
*/
export function startPlayback(id, callback){
    if(typeof callback === 'function'){
        playbackCallbackMap[id] = callback;
    }
	if(window.external && window.external.oralStartPlayback){
		if(id){
            //如果当前有正在播放的回放，先停止它
            if(currentPlaybackId){
                stopPlayback(currentPlaybackId);
            }
            setTimeout(()=>{
                currentPlaybackId = id;
                window.external.oralStartPlayback(JSON.stringify({id: id}));
            }, 300);

		}
		else{
			alert('读取录音出错！');
		}
	}
	else{
		//不是客户端的情况，用于在浏览器测试
		setTimeout(function(){
            vox.task.onPlaybackComplete(JSON.stringify({
                id: id,
                success: true
            }));
        }, 2000);
	}
}

/*
* 停止回放录音
*/
export function stopPlayback(id){
	if(window.external && window.external.oralStopPlayback){
		if(id){
			window.external.oralStopPlayback(JSON.stringify({
                id: id
            }));
		}
	}
}

//校验打分结果是否正确
function validateResult(obj){
	if (!obj) return false;
    if (!obj.lines || !obj.lines.length) return false;

    let lines = obj.lines;
    for (let i=0; i<lines.length; i++){
        let result = lines[i];
        if (isNaN(result.score)) {
            return false;
        }
    }
    return true;
}

//录音错误处理
function recordErrorHandler(error){
	let tempErrText = '';
	let tempErrCode = '';
    switch(error.errCode){
        case '-1':
            tempErrCode = '53001';
            tempErrText = errorCode.VOICE_ENGINE_SERVICE_ERROR_TIP + '(53001)';
            break;
        case '-2':
            tempErrCode = '53002';
            tempErrText = errorCode.VOICE_ENGINE_SERVICE_ERROR_TIP + '(53002)';
            break;
        case '-3':
            tempErrCode = '53003';
            tempErrText = errorCode.VOICE_ENGINE_SERVICE_ERROR_TIP + '(53003)';
            break;
        case '-4':
            tempErrCode = '53004';
            tempErrText = errorCode.VOICE_ENGINE_SERVICE_ERROR_TIP + '(53004)';
            break;
        case '-5':
            tempErrCode = '53005';
            tempErrText = errorCode.VOICE_ENGINE_SERVICE_ERROR_TIP + '(53005)';
            break;
        case '-6':
            tempErrCode = '53006';
            tempErrText = errorCode.VOICE_ENGINE_SERVICE_ERROR_TIP + '(53006)';
            break;
        case '-7':
            tempErrCode = '53007';
            tempErrText = errorCode.VOICE_ENGINE_SERVICE_ERROR_TIP + '(53007)';
            break;
        case '-8':
            tempErrCode = '53008';
            tempErrText = errorCode.VOICE_ENGINE_SERVICE_ERROR_TIP + '(53008)';
            break;
        case '-9':
            tempErrCode = '53009';
            tempErrText = errorCode.VOICE_ENGINE_SERVICE_ERROR_TIP + '(53009)';
            break;
        case errorCode.VOICE_ENGINE_NETWORK_ERROR:
            tempErrCode = '53011';
            tempErrText = errorCode.VOICE_ENGINE_NETWORK_ERROR_TIP + '(53011)';
            break;
        case '-102':
            tempErrCode = '53052';
            tempErrText = errorCode.VOICE_ENGINE_QUESTION_ERROR_TIP + '(53052)';
            break;
        case '-2001':
            tempErrCode = '53051';
            tempErrText = errorCode.VOICE_ENGINE_QUESTION_ERROR_TIP + '(53051)';
            break;
        case '-3006':
            tempErrCode = '53056';
            tempErrText = errorCode.VOICE_ENGINE_QUESTION_ERROR_TIP + '(53056)';
            break;
        case '57350':
            tempErrCode = '53126';
            tempErrText = errorCode.VOICE_ENGINE_QUESTION_ERROR_TIP + '(53126)';
            break;
        case errorCode.VOICE_ENGINE_SDCARD_ERROR:
            tempErrCode = '53013';
            tempErrText = errorCode.VOICE_ENGINE_SDCARD_ERROR_TIP + "(53013)";
            break;
        case errorCode.VOICE_ENGINE_SHORT_ERROR:
            tempErrCode = '53014';
            tempErrText = errorCode.VOICE_ENGINE_SHORT_ERROR_TIP + "(53014)";
            break;
        case errorCode.VOICE_ENGINE_AGAIN_ERROR:
            tempErrCode = '53015';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53015)";
            break;
        case '-201':
            tempErrCode = '53021';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53021)";
            break;
        case '-1001':
            tempErrCode = '53031';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53031)";
            break;
        case '-1002':
            tempErrCode = '53032';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53032)";
            break;
        case '-1003':
            tempErrCode = '53033';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53033)";
            break;
        case '-3001':
            tempErrCode = '53041';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53041)";
            break;
        case '-3002':
            tempErrCode = '53042';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53042)";
            break;
        case '-3003':
            tempErrCode = '53043';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53043)";
            break;
        case '-3004':
            tempErrCode = '53044';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53044)";
            break;
        case '-3005':
            tempErrCode = '53045';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53045)";
            break;
        case '-6000':
            tempErrCode = '53060';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53060)";
            break;
        case '8193':
            tempErrCode = '53101';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53101)";
            break;
        case '8195':
            tempErrCode = '53103';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53103)";
            break;
        case '8198':
            tempErrCode = '53106';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53106)";
            break;
        case '49153':
            tempErrCode = '53111';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53111)";
            break;
        case '49155':
            tempErrCode = '53113';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53113)";
            break;
        case '49160':
            tempErrCode = '53118';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53118)";
            break;
        case '57345':
            tempErrCode = '53121';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53121)";
            break;
        case '57351':
            tempErrCode = '53127';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53127)";
            break;
        case '57352':
            tempErrCode = '53128';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53128)";
            break;
        case '65280':
            tempErrCode = '53140';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53140)";
            break;
        case '61440':
            tempErrCode = '53130';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53130)";
            break;
        case '61441':
            tempErrCode = '53131';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53131)";
            break;
        case '65524':
            tempErrCode = '53144';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53144)";
            break;
        case '65525':
            tempErrCode = '53145';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53145)";
            break;
        case '65526':
            tempErrCode = '53146';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53146)";
            break;
        case '65532':
            tempErrCode = '53152';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53152)";
            break;
        case '65533':
            tempErrCode = '53153';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53153)";
            break;
        case '65534':
            tempErrCode = '53154';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53154)";
            break;
        default:
            tempErrCode = '53000';
            tempErrText = errorCode.VOICE_ENGINE_FAIL_ERROR_TIP + "(53000)";
    }
    return {text: tempErrText, code: tempErrCode};
}

/*
* 打分结果回调函数
*/
vox.task.onScoreComplete = function(jsonStr){
    console.log('score')
    console.log(jsonStr)
	let obj = JSON.parse(jsonStr);
    if(overtimeMap[obj.id] && overtimeMap[obj.id].remain === 0){
        // 剩余时间为0，表示已判定为超时，执行了errorCb了，这里不再操作
        return;
    }
    if(overtimeMap[obj.id]){
        window.clearInterval(overtimeMap[obj.id].timer);
        overtimeMap[obj.id].timer = null;
    }
    let errorCb = scoreErrorCbMap[obj.id];
	if(obj.success){
		let result = typeof obj.result === 'string' ? JSON.parse(obj.result) : obj.result;
		let callback = scoreCallbackMap[obj.id];
		if(callback){
			if(validateResult(result)){
				callback(result);
			}
			else{
				//打分数据校验不合法的情况，认为打分失败
                let tempError = recordErrorHandler({
                    success: false,
                    recordId: obj.id,
                    errCode: errorCode.RECORD_RATE_ERROR,
                    errMsg: "录音打分失败"
                });
                if(errorCb){
                    errorCb(tempError.text, tempError.code);
                }
			}
		}

	}
	else{
		//打分失败
        let tempError = recordErrorHandler({
			success: false,
			recordId: obj.id,
			errCode: errorCode.RECORD_RATE_ERROR,
			errMsg: "录音打分失败"
		});
        if(errorCb){
            errorCb(tempError.text, tempError.code);
        }
	}
}

/*播放我的读音，结束回调*/
vox.task.onPlaybackComplete = function(jsonStr){
	let obj = JSON.parse(jsonStr);
	if(obj.success){
        //检查如果当前播放的id是自己的，则置为空
        if(currentPlaybackId == obj.id){
            currentPlaybackId = '';
        }

		let callback = playbackCallbackMap[obj.id];
		callback && callback();
	}
	else{
		let callback = playbackCallbackMap[obj.id];
		callback && callback(null, obj);
	}
}

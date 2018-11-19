/**
 * @author junlin.yan
 * @date 2018/6/11
 * @description 错误代码定义
 */

export const ERROR_CODE = {
  // 未捕获错误
  UNCAUGHT_ERROR: '50000',
  // http请求失败
  HTTP_REQUEST_ERROR: '50001',
  // http请求超时
  HTTP_REQUEST_TIMEOUT: '50002',
  // json序列化失败
  JSON_STRINGIFY_ERROR: '50003',
  // json解析错误
  JSON_PARSE_ERROR: '50004',
  // cookie失效
  COOKIE_INVALID: '50005',
  // 图片资源加载失败
  LOAD_IMAGE_ERROR: '50006',
  // 音频资源加载失败
  LOAD_AUDIO_ERROR: '50007',
  // 上传失败
  UPLOAD_ERROR: '50008',
  // 上传超时
  UPLOAD_TIMEOUT: '50009',
  // 视频资源加载失败
  LOAD_VEDIO_ERROR: '50010',
  // http请求返回500+
  HTTP_SERVER_ERROR: '50011',
  // 页面初始参数错误：缺少domain
  INIT_PARAMS_NO_DOMAIN: '50100',
  // 页面初始参数错误：缺少imgDomain
  INIT_PARAMS_NO_IMG_DOMAIN: '50101',
  // 页面初始参数错误：缺少必要参数
  INIT_PARAMS_MISSING: '50102',
  // 页面初始化错误：获取imgDomain失败
  INIT_GET_IMG_DOMAIN_FAIL: '50103',
  // 页面初始化错误：获取css失败
  INIT_LOAD_CSS_ERROR: '50104',
  // 页面初始化错误：获取js失败
  INIT_LOAD_JS_ERROR: '50105',
  // 页面初始化错误：初始参数解析失败
  INIT_PARSE_PARAMS_ERROR: '50106',
  // 页面初始化错误：cdn列表无效
  INIT_CDN_LIST_INVALID: '50107',
  // 获取flashvars失败
  GET_FLASHVARS_ERROR: '50110',
  // 切换cdn失败
  SWITCH_CDN_ERROR: '50111',
  // 应试-初始参数错误
  EXAM_PARAMS_ERROR: '51000',
  // 应试-加载试卷失败
  EXAM_GET_PAPER_ERROR: '51001',
  // 应试-加载题目失败
  EXAM_GET_QUESTION_ERROR: '51002',
  // 应试-加载用户答案失败
  EXAM_GET_ANSWER_ERROR: '51003',
  // 应试-提交失败
  EXAM_SUBMIT_ERROR: '51004',
  // 应试-加载题目失败-返回结果缺失
  EXAM_GET_QUESTION_MISSING: '51005',
  // 应试-小题内容错误
  EXAM_SUB_QUESTION_DATA_ERROR: '51006',
  // 应试-大题内容错误
  EXAM_QUESTION_DATA_ERROR: '51007',
  // 应试-材料题内容错误
  EXAM_SUPER_QUESTION_DATA_ERROR: '51008',
  // 应试-无法找到examCore.js引用位置
  EXAM_LOAD_COREJS_ERROR: '51009',
  // 加载html模板失败
  LOAD_HTML_TPL_ERROR: '51010',
  // 无法找到指定html模板
  FIND_HTML_TPL_FAIL: '51011',
  // 练习-加载题目失败
  HOMEWORK_GET_QUESTION_ERROR: '52001',
  // 练习-题目全部被过滤掉
  HOMEWORK_NO_VALID_QUESTION: '52002',
  // 练习-提交失败
  HOMEWORK_SUBMIT_ERROR: '52003',
  // 练习-获取练习结果失败
  HOMEWORK_GET_RESULT_ERROR: '52004',
  // 阅读绘本-获取教材失败  52005
  // 阅读绘本-没有点读内容  52006
  // 练习-题目数据非法    52007
  // 阅读绘本读取绘本数据失败 50120
  // 中学练习-加载练习数据失败
  HOMEWORK_GET_PRACTICE_DETAIL_ERROR: '52008',
  // 中学练习-练习数据非法
  HOMEWORK_INVALID_PRACTICE_DATA: '52009',
  // 中学/v2-加载练习列表失败
  HOMEWORK_GET_PRACTICE_LIST_ERROR: '52010',
  // 中学/v2-练习列表数据非法
  HOMEWORK_INVALID_PRACTICE_LIST_DATA: '52011',
  // 页面初始参数错误
  HOMEWORK_INVALID_INIT_PARAMS: '52012',
  // 页面初始参数错误
  HOMEWORK_INVALID_INIT_PARAMS_PRACTICE_LIST: '52013',
  // 获取考试信息失败 52014
  // 考试开始失败   52015
  // 考试交卷失败   52016
  // 应试-小题内容错误-题型不支持  52017
  // 应试-小题内容错误-作答方式不支持    52018
  // 获取考试学生历史信息失败 52019
  // 外壳渲染latex返回默认文件  52020
  /** 58---    框架级别错误 */
  // 资源加载失败（其他）
  RESOURCE_LOAD_ERROR: '58990',
  // 资源加载失败（html）
  RESOURCE_LOAD_HTML_ERROR: '58991',
  // 资源加载失败（js）
  RESOURCE_LOAD_JS_ERROR: '58992',
  // 资源加载失败（css）
  RESOURCE_LOAD_CSS_ERROR: '58993',
  // 资源加载失败（图片）
  RESOURCE_LOAD_IMG_ERROR: '58994',
  // 资源加载失败（文本）
  RESOURCE_LOAD_TXT_ERROR: '58995',
  // 资源加载失败（音频）
  RESOURCE_LOAD_AUDIO_ERROR: '58996',
  // 资源加载失败（视频）
  RESOURCE_LOAD_VEDIO_ERROR: '58997',
  /** 59--- 内部逻辑错误 */
  // 函数调用参数非法
  INVALID_ARGUMENTS: '59001',
  // 远程接口调用参数非法
  RPC_INVALID_ARGUMENTS: '59002',
  // 远程接口返回数据非法
  RPC_INVALID_RESPONSE: '59003',
  // external不可用
  EXTERNAL_NOT_AVAILABLE: '59004',
  // 指定的external方法不存在
  EXTERNAL_NOT_FOUND: '59005',
  // 远程接口返回未知错误
  RPC_UNKNOWN_ERROR: '59997',
  // external调用返回错误
  UNKNOWN_EXTERNAL_ERROR: '59998',
  // 未知/未定义错误
  UNKNOWN_SERVER_ERROR: '59999',
  // 本地存储错误
  LOCAL_STORAGE_ERROR: '30400'
}

export default ERROR_CODE;

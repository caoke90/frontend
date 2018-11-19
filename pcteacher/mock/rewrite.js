module.exports = [
  {

    //本地的url =》 本地的url
    "/":"/pcteacher/list.html",
    "/teacher/paper": "/pcteacher/paper.html",
  },
  {
    //线上的url =》 本地的mock
    "/ok": "/ok",
    "/question/choice": "/question/choice.json",

    "/teacher/assign/prepare": "/teacher/assign/prepare",
    "/teacher/assign/save": "/teacher/assign/save",
  },
  {
    // pc推荐练习的数据mock
    "/pc/v1/assign/loadBookTree": "/pc/v1/assign/loadBookTree.json",
    "/pc/v1/assign/loadUlTree": "/pc/v1/assign/loadUlTree.json",
    "/pc/v1/assign/preOverStudyPackage": "/pc/v1/assign/preOverStudyPackage.json",
    "/pc/v1/assign/loadPaperList": "/pc/v1/assign/loadPaperList.json",
    "/pc/v1/assign/loadPaperContent": "/pc/v1/assign/loadPaperContent.json",
    "/pc/v1/assign/loadPackageContent": "/pc/v1/assign/loadPackageContent.json",
    "/pc/v1/assign/questionBankSearchCondition": "/pc/v1/assign/questionBankSearchCondition.json",
    "/pc/v1/assign/newQuestionBankSearchCondition": "/pc/v1/assign/newQuestionBankSearchCondition.json",
    "/pc/v1/assign/getBigdataPackageContent": "/pc/v1/assign/getBigdataPackageContent.json",
    "/pc/v1/assign/getQuestionsFromQuestionBank": "/pc/v1/assign/getQuestionsFromQuestionBank.json",
    "/pc/v1/assign/lessonWrongPackageList" : "/pc/v1/assign/lessonWrongPackageList.json",
    "/pc/v1/assign/lessonWrongContent": "/pc/v1/assign/lessonWrongContent.json",
    "/pc/v1/assign/reviewAfterClassQuestionsTypes": "/pc/v1/assign/reviewAfterClassQuestionsTypes.json",
    "/pc/v1/assign/loadClass": "/pc/v1/assign/clazzIds.json",
    "/pc/v1/assign/loadUser": "/pc/v1/assign/loadUser.json",
    "/pc/v1/assign/loadTabs": "/pc/v1/assign/loadTabs.json",
  },
  {

    // 购题车 2、通过压缩数据，请求完整数据
    "/cart/questionCart": "/v1/cart/questionCart.json",
    "/pc/v1/cart/info": "/v1/cart/info.json",
    "/pc/v1/cart/add_questions": "/v1/cart/add_questions.json",
    "/pc/v1/cart/flush": "/v1/cart/flush.json",
    "/pc/v1/cart/preview": "/v1/cart/preview.json",
    "/pc/v1/cart/remove_questions": "/v1/cart/remove_questions.json"
  },
  {
    //听说专区数据mock
    "/pc/v1/assign/getArea": "/pc/v1/assign/getArea.json",
    "/pc/v1/assign/listenSpeakConfig": "/pc/v1/assign/listenSpeakConfig.json",
    "/pc/v1/assign/listenSpeakPaperList": "/pc/v1/assign/listenSpeakPaperList.json",
    "/pc/v1/assign/listenSpeakSpecialList": "/pc/v1/assign/listenSpeakSpecialList.json",
    "/pc/v1/assign/listenSpeakSpecialContent": "/pc/v1/assign/listenSpeakSpecialContent.json",
    "/extra/errorCorrection": "/pc/v1/extra/errorCorrection.json",
    "/pc/v1/assign/listenSpeakPaperContent": "/pc/v1/assign/listenSpeakPaperContent.json",
  }
]

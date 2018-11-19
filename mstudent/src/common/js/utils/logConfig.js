
/** 打点公共config */

var log = {};

/** ======== module ======== */
log.module = {
  m_feedback: '',       // 打分反馈
  m_listenRead: 'm_QROvycuuCi', // 听说
  m_homework : 'm_BqQPhVZV', // 老师app推荐练习
  m_frequent : 'm_o00dupXm' // 老师app高频错题
};

/** ======== op ======== */
log.op = {
  tb_load : 'A_ArrangeHW_TitlePackage__Load',   //题包页load
  tk_load : 'A_ArrangeHW_TitleWarehouse__Load',   //题库页load
  ls_detail_load: 'A_ArrangeHWLR_Detail__Load',  // 听说套卷&听说专项 加载
  ls_detail_select: 'A_ArrangeHWLR_Detail__Click',  // 听说套卷&听说专项 选择
  ls_detail_wrong_click: 'A_ArrangeHWLR___Click',   // 听说套卷&听说专项 题目反馈
  tb_select_click : 'A_ArrangeHW_TitlePackage_Fiter_Click',   //老师app推荐练习
  tk_select_click : 'A_ArrangeHW_TitleWarehouse_Fiter_Click',   //老师app推荐练习
  frequent_list_load:'A_ArrangeHWTextbook_WrongList__Load', // 高频列表加载
  frequent_select_click:'A_ArrangeHWTextbook_WrongList_WrongPackage_Click', // 高频题包点击
  frequent_question_select:'A_ArrangeHWTextbook_WrongPackage_Choose_Click', // 高频题目选入
  frequent_all_question_select:'A_ArrangeHWTextbook_WrongPackage_All_Click', // 高频题目全部选入
  feedback_submit: 'onlineEn_Feedback_SubmitFeedback'   // 打分反馈 提交
};

export default log;

<template>
  <div class="container">
    <div v-for="(qobj,index) in questionList" style="margin-bottom: 15px">
      <question :question="qobj" :qindex="index"></question>
    </div>
  </div>
</template>

<script>
  import Question from '../models/question/Question';
  import {getQueryParams} from '../common/js/utils/URLUtils';
  import {parseCamelCase} from '../common/js/utils';

  let other = require('../../mock/question/test/other');
  let test1 = require('../../mock/question/test/vocab');
  let test2 = require('../../mock/question/test/sentence');
  let test3 = require('../../mock/question/test/listen');
  let test4 = require('../../mock/question/test/oral');
  let test5 = require('../../mock/question/test/kewen');
  let test6 = require('../../mock/question/test/grammar');
  let ts = require('../../mock/question/test/ts');


  let choice = require('../../mock/question/choice');
  let blank = require('../../mock/question/blank');
  let judge = require('../../mock/question/judge');
  let choice_blank = require('../../mock/question/choice_blank');
  let sort = require('../../mock/question/sort');
  let sys = require('../../mock/question/sys');
  let subjective = require('../../mock/question/subjective');
  let oral = require('../../mock/question/oral');
  let test = require('../../mock/question/test');
  let data = {
    choice: choice,
    blank: blank,
    judge: judge,
    choice_blank: choice_blank,
    sort: sort,
    sys: sys,
    subjective: subjective,
    oral: oral,
    test: test
  };
  let params = getQueryParams(location.href);
  let type = params['type'] || 'choice';
  let index = params['index'] || 0;
  // qdata = parseCamelCase(qdata);

  let qlist = [];
  if (type == 'all') {
    qlist = qlist.concat(ts, other, test1, test2, test3, test4, test5, test6);
  } else {
    qlist.push(data[type][index]);
  }
  let questionList = [];
  for (let i = 0; i < qlist.length; i++) {
    questionList.push(new Question(qlist[i]));
  }
  export default {
    data() {
      return {
        questionList: questionList
      }
    },
    computed: {},
    methods: {},
    created: function () {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  .container {
    max-width: 780px;
    margin: 0 auto;
    overflow: hidden;
    min-height: 100%;
  }
</style>

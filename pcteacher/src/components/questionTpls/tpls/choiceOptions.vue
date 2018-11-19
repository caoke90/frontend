<template>
  <div class="option-wrapper">
    <div v-if="subQuestion.options" class="options-container options-container-choice">
      <ul class="option-list clearfix">
        <li class="option-item"
            :class="[optionTypeClass]"
            v-for="(item, index) in subQuestion.options"
            :key="index">
          <div class="option-index"><span>{{item.showIndex}}.</span></div>
          <div class="option-content">
          <span>
            <mv-img :html="item.option"></mv-img>
          </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {strlen} from '../../../common/js/utils/StringUtils';

  export default {
    props: ['subQuestion'],
    computed: {
      optionTypeClass() {
        let optionClass = 'option-type-text';
        switch (this.subQuestion.optionType) {
          case 'img':
            optionClass = 'option-type-img';
            break;
          case 'sentence':
            optionClass = 'option-type-sentence';
            break;
        }
        let contentLength = 0;
        this.subQuestion.options.forEach(function (option) {
          let length = strlen(option.option.replace(/<.*?>/ig, ""));
          if (length > contentLength) {
            contentLength = length;
          }
        });
        if (contentLength >= 44) {
          optionClass += ' option-type-len-3';
          return "width: 100%";
        } else if (contentLength > 20) {
          optionClass += ' option-type-len-2';
        } else {
          optionClass += ' option-type-len-1';
        }
        return optionClass;
      }
    },
    methods: {}
  }
</script>

<style rel="stylesheet/scss" type="text/css" lang="scss" scoped>
  /*  @import "../../../common/scss/common";

    .option-item {
      position: relative;
      margin-top: 10px;
      font-size: 14px;
      color: #555555;
      line-height: 20px;
      overflow: hidden;
      &.option-type-img {
        display: table;
        vertical-align: middle;
        .option-index {
          vertical-align: top;
        }
      }
    }
  */

</style>

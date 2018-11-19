<template>
  <toggle :card="card">
    <component :is="page_type" :card="card" :cid="this._uid"></component>
  </toggle>

</template>

<script>
  // 我把它定义成一个业务组件
  const components = {
    card11: require('./cards/base_sub.vue'),
    toggle: require('./cards/toggle.vue'),
  };
  export default {
    props: ['card'],
    components,
    computed: {
      page_type: function () {
        let type = '';
        if (this.card && this.card.card_type) {
          if (typeof this.card.card_type == "string") {
            type = this.card.card_type;
          } else {
            type = "card" + this.card.card_type;
          }
        }
        return type;
      }
    }
  };

</script>

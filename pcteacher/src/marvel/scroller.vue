<template>
  <div class="wrapClass" ref="hei" :style="{'padding-top': to_rem(padding_top), 'padding-bottom': to_rem(padding_bottom)}">
    <div v-for="item,k in listData" :qindex="item.qindex" :key="key+item.qindex" style="overflow: hidden;">
      <slot :item="item" :index="item.qindex" ></slot>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: 'scroller',
    data() {
      return {
        curindex:0, // 当前看到那个
        is_scrolling:false,
        key:'k',
        padding_top: 0,
        padding_bottom: 0,
        listData: [],
      }
    },
    props: {
      data: {
        type: Array,
        default: () => {
          return []
        }
      },
      //containLen:默认为40
      option: {
        type: Object,
        default: () => {
          return {
            containLen:100,
            edge:15,
          }
        }
      }
    },
    async created(){
      this.leftedge=Math.floor(this.option.containLen/2)
      this.rightedge=Math.ceil(this.option.containLen/2)

      this.dataLength = this.data.length;
      this.data.forEach(function (item,key) {
        item.qindex=key
      })
      this.init()
    },
    mounted(){

      this.save_height()
      window.addEventListener('scroll', this.scrolling);
      window.addEventListener('touchstart', this.scrolling);
    },
    methods:{

      init:function(){
        const middle=this.getNear(this.curindex,this.option.containLen,this.dataLength)
        this.listData=this.data.slice(middle[0],middle[1])
        this.padding_top=this.getHeight(0,middle[0])
        this.padding_bottom=this.getHeight(middle[1],this.dataLength)
      },
      to_rem: function (hei) {
        return Math.ceil(hei) + 'px';
      },
      scrolling:function (e) {
        if(this.is_scrolling===true){
          return;
        }
        this.is_scrolling=true

        const curScrollTop = document.documentElement.scrollTop || document.body.scrollTop;


        const curindex=this.indexOf(curScrollTop-this.$el.offsetTop);

        if(curindex>this.curindex){
          if(curindex-this.curindex!=1){
            console.log('跨位滚动',curindex,this.curindex)
          }
          this.curindex=curindex;
          this.save_height()
          this.init()

          if(this.dataLength-this.curindex < this.option.edge){
            this.$emit('loadmore')
          }
        }else if(curindex<this.curindex){
          if(curindex-this.curindex!=-1) {
            console.log('跨位滚动',curindex,this.curindex)
          }

          this.curindex = curindex;
          this.save_height()
          this.init()
        }
        this.is_scrolling=false
      },
      getHeight:function(left,right){
        let height=0;
        for(let i=left;i<right;i++){
          if(typeof this.data[i].hei=='undefined'){
            this.data[i].hei=0;
          }
          height+=this.data[i].hei
        }
        return height;
      },
      getNear:function(curindex,edge,len){
        if(edge>=len){
          return [0,len]
        }
        let left=curindex-this.leftedge;
        let right=curindex+this.rightedge;
        if(right>len){
          right=len
          left=right-edge
        }
        if(left<0){
          left=0;
          right=left+edge
        }
        return [left,right]
      },
      save_height:function(){

        const len = this.listData.length;

        const items = this.$refs.hei.children;
        for (let i = 0; i < len; i++) {
          const hei = items[i].offsetHeight;
          const qindex=items[i].getAttribute("qindex")
          Object.assign(this.data[qindex], {hei: hei});
        }


      },
      indexOf:function (top) {
        let has=-1;
        let top2=top;
        for(let i=0;i<this.data.length;i++){
          if(top2<0||!this.data[i].hei){
            has=i
            break;
          }else{
            top2=top2-this.data[i].hei
          }
        }
        return has;
      }
    },
    watch:{
      data: {
        handler: function (val, oldVal) {

          if ((val.length>oldVal.length) && val[0].hei) {
            //追加数据
          }
          else {
            //更新数据
            this.curindex=0;
            this.key=this.key=='k'?'n':'k'
            document.documentElement.scrollTop=0;
            document.body.scrollTop=0;
          }
          this.$nextTick(()=>{
            this.save_height()
          });
          this.dataLength = val.length;
          val.forEach(function (item,key) {
            item.qindex=key
          });
          this.init()
        },
        deep: false
      }
    }
  }

</script>
<style>

</style>

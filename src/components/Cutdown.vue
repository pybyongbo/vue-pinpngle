<template>
  <div>
      <div class="deloy">倒计时：<span id="time">{{count}}</span></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 180,
      dealTime:0,
      timer: null
    };
  },

  props:{
      success:{
        type: Boolean,
        default :false
      },
  },

  created(){
      this.cutDown();
  },
//   mounted(){
// this.cutDown();
//   },

  methods: {
    cutDown() {
    //   const TIME_COUNT = 180;
      if (!this.timer) {
        // this.count = TIME_COUNT;
        this.timer = setInterval(() => {
          if (this.count > 0 ) {
            this.count--;
            if(this.success) {
                this.stopCutdown();
            }
          } else {
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    initTime(){ // 返回的时候初始化倒计时
        // this.clearTimer();
         clearInterval(this.timer);
        this.timer = null;
        this.count = 180;
        this.cutDown();
    },
    stopCutdown(){ //拼图成功要清理掉倒计时,然后向父组件传递用时
       
        this.dealTime = 180-this.count;
        this.$emit('overtime',this.dealTime);
        clearInterval(this.timer);
        this.timer = null;
    },
    clearTimer(){ //拼图成功后清除定时器
        clearInterval(this.timer);
        this.timer = null;
    }
  }
};
</script>

<style  scoped>
.play-page .deloy {
  padding: 10px 20px;
  color: #fff;
}
</style>
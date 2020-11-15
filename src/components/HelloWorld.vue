<template>
  <!-- :style="{transform: `translateX(${clickStartBtn?-100:0}vw)`}" -->
  <div class="wrap" ref="wrap">
    <div class="start-page">
      <h1>{{ msg }}</h1>
      <div class="gradestep"><span>挑战等级:</span>
        <select name="grade" id="grade"  v-model="gradeSelected" @change="getGradeSelected">
            <option :value="coupon.id" :key="coupon.id" v-for="coupon in gradeList">{{coupon.name}}</option>
        </select>
      </div>
      <div class="album-list">
        <div class="img-wrap" v-for="(item,index) in imgArr" :class="activeClass == index ? 'active':''" :key="index" @click="getItem(index)">
          <img :src="item.url" alt="">
        </div>
        <div class="img-wrap" v-if="!uploadimg">
          <div class="file-wrap" ref="filewrap">
            <input type="file" id="file" @change="onFileChange">
          </div>
        </div>
        <div class="btn" id="start" @click="startGame(activeClass)">开始游戏</div>
      </div>
    </div>

    <div class="play-page">
      <div class="deloy">倒计时：<span id="time">{{dealtime}}</span></div>
      <div class="play-area" id="playArea">
        <div 
        v-for="item in boxArr" 
        :index="item" 
        :key="item" 
        :class="['piece','piece-'+(item),item==boxArractivelass?'active':'' ]" 
        :style="{backgroundImage:'url('+selectedImg+')'}" 
        @click="changePositon($event,item)" :ref="'piece' +item"></div>
      </div>
      <div class="btn" id="change" @click="reOrder()">重新排序</div>
      <div class="btn" id="back" @click="goBack()">返回</div>
    </div>

    <div class="result-page">

      <div class="success-text">恭喜闯关成功~!</div>
      <div class="total-time">用时: <span id="use_time">{{180-dealtime}}</span>s</div>
      <div class="btn" @click="generateImg">生成战绩海报</div>
      <div class="btn" @click="onceAgain()">再来一次</div>

    </div>

    <div class="preview-page last-page">
      <img :src="canvasUrl" alt="图片">
      <div class="btn play-again" @click="reStart()">重新再来</div>
      <div class="btn share-other" @click="isVisible=true">我要分享</div>
    </div>
    <div class="share-bg" v-if="isVisible" @click="isVisible=false" />

  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      startDx: 0, // 初始位移，用于返回上一页
      activeClass: -1,
      boxArractivelass: -1,
      prevIndex: null,
      curIndex: 0,
      curposArr: [],
      clickStartBtn: false,
      uploadimg: "",
      selectedImg: "",
      // 等级控制
      gradeList:[
        {
            id: 3,
            name: '简单'
        },
        {
            id: 4,
            name: '中级'
        },
        {
            id: 5,
            name: '高级'
        }
    ],
    gradeSelected: 3,
     squalbox:9,
      boxArr:[],
      pieces: document.querySelectorAll(".piece"),
      pool: [],
      imgArr: [
        // { url: require("../assets/images/timg2.jpeg") },
        // { url: require("../assets/images/timg3.jpeg") },
        // { url: require("../assets/images/timg.jpeg") },
        // { url: require("../assets/images/caixushen.jpg") },
        // { url: require("../assets/images/yang.jpeg") },
        // { url: require("../assets/images/re.jpeg") },
        // { url: require("../assets/images/timg4.jpeg") },
        // { url: require("../assets/images/timg6.jpeg") }
        { url: require("../assets/images/2020-10-22-pic2.jpeg") },
        { url: require("../assets/images/2020-10-22-pic47.jpeg")},
        { url: require("../assets/images/2020-10-22-pic3.jpeg") },
        { url: require("../assets/images/2020-10-22-pic5.jpeg") },
        { url: require("../assets/images/2020-10-22-pic4.jpeg") },
        { url: require("../assets/images/2020-10-22-pic1.jpeg") },
        { url: require("../assets/images/2020-10-22-pic7.jpeg") },
        { url: require("../assets/images/2020-10-22-pic8.jpeg") }
      ],

      wall: 0,
      prevEl: null, // 上一个元素,
      dealtime: 180,
      timer: null,
      issuccess: false,
      canvasUrl: "",
      isVisible: false,
     
    };
  },
  created(){
      this.gradeSelected = this.gradeList[0].id;
      this.pool = this.generateMatrix(+this.gradeSelected, +(84/this.gradeSelected), +(60/this.gradeSelected));
      //   console.log(+this.gradeSelected*(+this.gradeSelected));
      this.boxArr = new Array(this.squalbox).fill(1).map((item, index) => {
        return index;
      })
  },
  mounted(){
      if(this.gradeSelected===3){
          import('../assets/style/default.css') 
      } else if(this.gradeSelected===4) {
          import('../assets/style/middle.css')
      }
  },
  computed:{
  
  },
  methods: {
    getGradeSelected(){
        console.log(this.gradeSelected);
        this.boxNum = this.gradeSelected;
        this.squalbox = +this.gradeSelected*(+this.gradeSelected);
        this.pool = this.generateMatrix(+this.gradeSelected, +(84/this.gradeSelected), +(60/this.gradeSelected));
        this.boxArr = new Array(this.squalbox).fill(1).map((item, index) => {
        return index;
      })
      console.log(+this.gradeSelected*(+this.gradeSelected));
      if(this.gradeSelected===3){
          require('../assets/style/default.css');
          console.log(333);
      } else if(this.gradeSelected===4) {
          require('../assets/style/middle.css');
           console.log(444);
      }
    },
    getItem(index) {
      this.activeClass = index;
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    createImage(file) {
      //   var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = e => {
        vm.uploadimg = e.target.result;
        this.imgArr.push({
          url: e.target.result
        });
      };
      reader.readAsDataURL(file);
    },
    startGame(picIndex) {
      if (this.activeClass == -1) {
        alert("请选择图片");
        return;
      }
      //   this.dealtime = 180;
      this.timer = setInterval(this.timeStart, 1000);
      this.startDx = this.startDx - 100;
      this.transformX(this.$refs.wrap, this.startDx + "vw");
      this.selectedImg = this.imgArr[picIndex].url;
      this.shuffle(document.querySelectorAll(".piece"), this.pool);
       if(this.gradeSelected===3){
        require('../assets/style/default.css');
        console.log(333);
      } else if(this.gradeSelected===4) {

          require('../assets/style/middle.css');
          console.log(444);
      }

      
    },
    reOrder() {
      this.shuffle(document.querySelectorAll(".piece"), this.pool);
    },
    // 点击高亮并且切换对应位置 (想办法交换对应索引位置的x,y值即可)
    changePositon(e, item) {
      //点击小图片切换位置方法
      let reg = /active/g;
      // console.log(e, item);
      this.boxArractivelass = item;
      let pieces = document.querySelectorAll(".piece");
      if (!this.wall) {
        this.wall = 1;
        this.prevEl = e.target;
        for (var i = 0, len = pieces.length; i < len; i++) {
          // 使用replace为了避免元素后期加入其他类名
          pieces[i].className = pieces[i].className.replace(" active", "");
        }
        !reg.test(this.className) && (this.className += " active");
        // this.className= this.className.replace(' active', '');
      } else {
        this.wall = 0;
        var prevIndex = +this.prevEl.getAttribute("index"),
          curIndex = +e.target.getAttribute("index");

        // 置换数组
        this.swap(this.pool, prevIndex, curIndex);
        // console.log("prevIndex", "curIndex", prevIndex, curIndex);
        this.prevEl.style.transform =
          "translate(" +
          this.pool[prevIndex].x +
          "vw," +
          this.pool[prevIndex].y +
          "vh" +
          ")";
        e.target.style.transform =
          "translate(" +
          this.pool[curIndex].x +
          "vw," +
          this.pool[curIndex].y +
          "vh" +
          ")";
        // 清除样式
        // this.prevEl.className= this.prevEl.className.replace(' active', '');
        this.boxArractivelass = -1;

        // 校验是否成功
        if (this.isTestSuccess(this.pool)) {
          // 清除计时器
          // alert('success');
          // this.clickStartBtn = true;
          clearInterval(this.timer);
          this.startDx -= 100;
          this.issuccess = true;

          // $('#playArea')[0].classList.add('active');
          // $('#use_time').html(180-dealtime);
          //   setTimeout(function() {
          this.transformX(this.$refs.wrap, this.startDx + "vw");
          //   }, 1200);
        }
      }
    },

    timeStart() {
      this.dealtime--;
      if (this.dealtime < 1) {
        clearInterval(this.timer);
        alert("挑战失败，请返回重新开始");
      }
    },
    // 滑动元素
    transformX(el, dx) {
      el.style.transform = "translateX(" + dx + ")";
    },
    resetTime() {
      this.dealtime = 180;
      clearInterval(this.timer);
    },
    goBack() {
      // 清理定时器,返回
      //   this.clickStartBtn = false;
      this.startDx += 100;
      this.transformX(this.$refs.wrap, this.startDx + "vw");
      this.resetTime();
    },
    onceAgain() {
      this.shuffle(document.querySelectorAll(".piece"), this.pool);
      this.startDx = -100;
      this.transformX(this.$refs.wrap, this.startDx + "vw");
      this.resetTime();
      this.dealtime = 180;
      this.timer = setInterval(this.timeStart, 1000);
      //    this.$refs.child.initTime();
    },
    reStart() {
      this.startDx = this.startDx + 300;
      this.transformX(this.$refs.wrap, this.startDx + "vw");
      this.resetTime();
      // this.dealtime = 180;
      // this.timer = setInterval(this.timeStart, 1000);
    },
    // 生成战绩海报
    generateImg() {
      var canvas = document.createElement("canvas");

      if (canvas.getContext) {
        var winW = window.innerWidth,
          winH = window.innerHeight,
          ctx = canvas.getContext("2d");
        canvas.width = winW;
        canvas.height = winH;

        // 绘制背景
        // ctx.fillStyle = '#06c';
        var linear = ctx.createLinearGradient(0, 0, 0, winH);
        linear.addColorStop(0, "#a1c4fd");
        linear.addColorStop(1, "#c2e9fb");
        ctx.fillStyle = linear;
        ctx.fillRect(0, 0, winW, winH);
        ctx.fill();

        // 绘制顶部图像
        var imgH = 0;
        var that = this;
        var img = new Image();
        img.src = that.selectedImg;
        img.setAttribute("crossOrigin",'Anonymous')
        img.onload = function() {
          // 绘制的图片宽为.7winW, 根据等比换算绘制的图片高度为 .7winW*imgH/imgW
          imgH = (0.5 * winW * this.height) / this.width;
          // ctx.drawImage(img, 0.2 * winW, 0.1 * winH, 0.6 * winW, imgH);
          ctx.drawImage(img, 0.2 * winW, 20, 0.6 * winW, imgH);
          // drawText();
          // ctx.save();
          ctx.fillStyle = "#fff";
          ctx.font = 20 + "px Helvetica";
          ctx.textBaseline = "hanging";
          ctx.textAlign = "center";
          ctx.moveTo(10, 10);
          ctx.fillText(
            "我只用了" + (180 - that.dealtime) + "s," + "快来挑战！",
            winW / 2,
            0.1 * winH + imgH
            // 80+imgH
            // 100
          );
          // ctx.restore();
          // drawTip();

          // ctx.save();
          ctx.fillStyle = "#000";
          ctx.font = 14 + "px Helvetica";
          ctx.textBaseline = "hanging";
          ctx.textAlign = "center";
          ctx.moveTo(-30, 10);
          ctx.fillText("关注下方二维码开始游戏", winW / 2, 0.18 * winH + imgH);
          // ctx.restore();
          // drawCode();

          var imgCode = new Image();
          imgCode.src = require("../assets/images/code.jpg");
          imgCode.onload = function() {
            ctx.drawImage(
              imgCode,
              0.35 * winW,
              0.25 * winH + imgH,
              0.3 * winW,
              0.3 * winW
            );

            // 生成预览图
            var img = new Image();
            img.src = that.convertCanvasToImage(canvas, 1).src;
            img.setAttribute("crossOrigin",'Anonymous');
            img.className = "previewImg";
            img.onload = function() {
              that.canvasUrl = this.src;
              that.startDx = that.startDx - 100;
              that.transformX(that.$refs.wrap, that.startDx + "vw");
            };
          };
        };
      } else {
        alert("浏览器不支持canvas！");
      }
    },

    // 生成n维矩阵
    generateMatrix(n, dx, dy) {
       
      var arr = [],
        index = 0;
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
          arr.push({ x: j * dx, y: i * dy, index: index });
          index++;
        }
      }
     
      console.log('arr',JSON.stringify(arr));

      return arr;
    },

    shuffle(els, arr) {
      this.upsetArr(arr);
      for (var i = 0, len = els.length; i < len; i++) {
        var el = els[i];
        el.setAttribute("index", i); // 将打乱后的数组索引缓存到元素中
        el.style.transform =
          "translate(" + arr[i].x + "vw," + arr[i].y + "vh" + ")";
      }
    },
    // https://www.xiabingbao.com/post/javascript/js-random-array.html
    upsetArr(arr) {
      //   console.log("arr", JSON.stringify(arr));
      // 方法1:
      return arr.sort(function() {
        return Math.random() > 0.5 ? -1 : 1;
      });

    },
    // 置换数组(对应索引的x,y值进行交换)
    swap(arr, indexA, indexB) {
      // let targetArr = [];
      // arr.map(item => {
      //   if (item.index == indexA || item.index == indexB) {
      //     targetArr.push(item);
      //   }
      // });
      // [targetArr[0].x, targetArr[1].x] = [targetArr[1].x, targetArr[0].x];
      // [targetArr[0].y, targetArr[1].y] = [targetArr[1].y, targetArr[0].y];

      // return targetArr;
      // var cache = arr[indexA];
      // arr[indexA] = arr[indexB];
      // arr[indexB] = cache;

      // ES6的解耦交换方式： [arr[index], arr[n]] = [arr[n], arr[index]];
      [arr[indexA],arr[indexB]] = [arr[indexB],arr[indexA]];
    },

    // 校验是否成功方法
    isTestSuccess(arr) {
      return arr.every(function(item, i) {
        return item.index === i;
      });
    },
    // 将canvas转化为图片
    convertCanvasToImage(canvas, quality) {
      var image = new Image();
      image.src = canvas.toDataURL("image/png", quality);
      return image;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrap {
  display: flex;
  width: 400vw;
  transition: transform 1s cubic-bezier(0.52, 0.37, 0.16, 1.32);
}

div {
  box-sizing: border-box;
}

.gradestep{
    margin-bottom:10px;
}
.gradeste span{
    margin-right:8px;
}
.gradeste select{
    padding:3px 5px;
}
.btn {
  display: inline-block;
  padding: 10px 60px;
  width: 300px;
  background-color: #06c;
  color: #fff;
  cursor: pointer;
  margin: 40px auto 10px;
}
#back {
  margin-top: 10px;
}
.play-page,
.result-page,
.start-page,
.start-page .title {
  text-align: center;
}
.play-page,
.preview-page,
.result-page,
.start-page {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.start-page .title {
  line-height: 4em;
  font-size: 24px;
}

.start-page .album-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.start-page .album-list .img-wrap {
  margin-bottom: 0;
  width: 33.33%;
  height: 22vh;
  overflow: hidden;
}

.start-page .album-list .img-wrap.active {
  border: 4px solid #f00;
}

.start-page .album-list .img-wrap img {
  width: 100%;
}

.start-page .album-list .img-wrap .file-wrap {
  position: relative;
  height: 100%;
  background-position: center center;
  background-size: 100%;
  background-repeat: no-repeat;
}

.start-page .album-list .img-wrap .file-wrap::before {
  content: "+";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 60px;
  color: #ccc;
  cursor: pointer;
}

.start-page .album-list .img-wrap .file-wrap input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.start-page-ft {
  position: absolute;
  width: 100%;
  bottom: 20px;
  font-size: 12px;
  text-align: center;
}

.start-page-ft a {
  color: #06c;
}

.play-page {
  background-color: #4e2503;
}
.play-page .deloy {
  padding: 10px 20px;
  color: #fff;
}
.play-page .play-area {
  position: relative;
  width: 84vw;
  height: 60vh;
  display: flex;
  flex-wrap: wrap;
  margin: 20px auto;
  outline: #ccc solid 4px;
}

.play-page .play-area.active {
  outline-color: #1f8b40;
}

/* .play-page .play-area .piece { */
  /* position: absolute;
  left: 0;
  top: 0; */
  
  /* width: 28vw;
  height: 20vh; */
  
  /* 每个方块的宽高要动态设置 */
  /* width:21vw;
  height: 15vh; */
  /* border: 1px solid transparent;

  background-repeat: no-repeat;
  background-size: 84vw 60vh;
  transition: transform 0.6s ease-in-out; */
/* } */

.play-page .play-area .piece.active {
  border: 3px solid red;
}
/* 分割3*3的方块 */
 /* .play-page .play-area .piece-0 {
  background-position: 0 0;
}

.play-page .play-area .piece-1 {
  background-position: -28vw 0;
}

.play-page .play-area .piece-2 {
  background-position: -56vw 0;
}

.play-page .play-area .piece-3 {
  background-position: 0 -20vh;
}

.play-page .play-area .piece-4 {
  background-position: -28vw -20vh;
}

.play-page .play-area .piece-5 {
  background-position: -56vw -20vh;
}

.play-page .play-area .piece-6 {
  background-position: 0 -40vh;
}

.play-page .play-area .piece-7 {
  background-position: -28vw -40vh;
}

.play-page .play-area .piece-8 {
  background-position: -56vw -40vh;
}  */

/* 分割4*4的方块 */

/* .play-page .play-area .piece-0 {
  background-position: 0 0;
}
.play-page .play-area .piece-1 {
  background-position: -21vw 0;
}
.play-page .play-area .piece-2 {
  background-position: -42vw 0;
}
.play-page .play-area .piece-3 {
  background-position:-63vw 0;
}
.play-page .play-area .piece-4 {
  background-position: 0vw -15vh;
}


.play-page .play-area .piece-5 {
  background-position: -21vw -15vh;
}

.play-page .play-area .piece-6 {
  background-position: -42vw -15vh;
}

.play-page .play-area .piece-7 {
  background-position: -63vw -15vh;
}

.play-page .play-area .piece-8 {
  background-position: -0vw -30vh;
}

.play-page .play-area .piece-9 {
  background-position: -21vw -30vh;
}

.play-page .play-area .piece-10 {
  background-position: -42vw -30vh;
}

.play-page .play-area .piece-11 {
  background-position: -63vw -30vh;
}

.play-page .play-area .piece-12 {
  background-position: -0vw -45vh;
}

.play-page .play-area .piece-13 {
  background-position: -21vw -45vh;
}

.play-page .play-area .piece-14 {
  background-position: -42vw -45vh;
}
.play-page .play-area .piece-15 {
  background-position: -63vw -45vh;
} */

.result-page {
  padding-left: 20px;
  padding-right: 20px;
  background-color: #2b2929;
}

.result-page .success-text {
  padding-top: 160px;
  padding-bottom: 20px;
  font-size: 36px;
  color: #e4d721;
  font-weight: 700;
}

.result-page .total-time {
  display: block;
  margin-bottom: 30px;
  color: #fff;
  font-size: 24px;
}
.last-page {
  position: relative;
}

.last-page img {
  position: absolute;
  left: 0;
  top: 0;
}

.play-again {
  position: absolute;
  bottom: 10px;
  left: 5px;
  z-index: 10;
  width: 48%;
}

.share-other {
  position: absolute;
  bottom: 10px;
  right: 5px;
  z-index: 10;
  width: 48%;
}

.share-bg {
  position: fixed;
  top: 0;
  width: 0;
  width: 100%;
  height: 100%;
  background: url("../assets/images/share.png") no-repeat rgba(0, 0, 0, 0.8);
  background-position: top right;
  z-index: 11;
  /* background-size:75%; */
}
</style>

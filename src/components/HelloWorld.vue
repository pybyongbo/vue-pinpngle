<template>
  <div class="wrap" ref="wrap">
    <div class="check-page">
      <h1>无需注册,验证即玩</h1>
      <van-cell-group>
        <van-field v-model="username" label="用户姓名" placeholder="请输入您的姓名" name="username" autocomplete="off" clearable label-align="right" label-width="78" />
        <van-field v-model="id" type="number" @input="autoSearch" label="用户ID号" placeholder="请输入ID号" name="id" clearable autocomplete="off" label-align="right" label-width="78" />

        <!--展示数据-->
        <div class="listids" v-if="hasIds">
          <van-cell v-for="item in allIds" :key="item" :title="item" @click="setCurId(item)" />
        </div>

      </van-cell-group>
      <van-button type="primary" color="#06c" block @click="checkLogin()">验证登录</van-button>
    </div>
    <div class="start-page">
      <h1>{{ msg }}</h1>
      <div class="gradestep">
        <span style="margin-right:20px" @click="handleClickPopshow">切换难易度
          <van-icon name="wap-nav" /></span>
        <span @click="handleClickDiashow">帮助
          <van-icon name="question" /></span>

      </div>

      <div class="album-list">
        <van-grid :column-num="3">
          <van-grid-item v-for="(item,index) in imgArr" :key="index" icon="photo-o" :class="activeClass == index ? 'active':''" @click="getItem(index)">
            <template slot="icon">
              <img class="new-icon" :src='item.picUrl' style="width:100%;max-height:125px;" />
            </template>
          </van-grid-item>
        </van-grid>
        <div class="btn" id="start" @click="startGame(activeClass)">开始游戏</div>
      </div>
      <!-- 切换等级选择弹框 -->
      <van-action-sheet v-model="popupShow" round title="请选择挑战等级">
        <div>
          <van-list>
            <van-cell @click="chooseArea(item)" v-for="(item, index) in gradeList" :key="index" :title="`${item.name}-(${item.id}*${item.id})`">
              <template #right-icon>
                <van-icon name="success" color="#E4B180" :class="item.id == gradeSelected ? '':'hiddennone'" />
              </template>
            </van-cell>
          </van-list>
        </div>
      </van-action-sheet>
      <!-- 游戏说明弹框 -->
      <van-dialog class="gameInfo" v-model="infoDialog" confirmButtonColor="#1C3999" width="320" :style="{position:'absolute',left:`${leftPos}px`}">
        <div class="gameText">
          <h3>游戏说明:</h3>
          <p>请先选择一张要拼图的图片</p>
          <p>默认为简单等级,即图片切割为3*3的方块.</p>
          <p>点击小方块图片,然后点击要交换的图片,即可挪动图片位置进行拼接</p>
        </div>
      </van-dialog>
    </div>

    <div class="play-page">
      <div class="deloy">倒计时：<span id="time">{{dealtime}}</span></div>
      <div class="play-area" id="playArea">
        <div v-for="item in boxArr" :index="item" :key="item" :class="['piece','piece-'+(item),item==boxArractivelass?'active':'' ]" :style="{backgroundImage:'url('+selectedImg+')'}" @click="changePositon($event,item)" :ref="'piece' +item"></div>
      </div>
      <van-overlay :show="overlayShow" @click="overlayShow = false">
        <div class="wrapper">
          <img class="block" :src="selectedImg" />
          <van-icon name="close" />
        </div>
      </van-overlay>
      <div class="btn" id="change" @click="reOrder()">重新排序</div>
      <div class="btn" id="lookpic" @click="lookpic()">查看原图</div>
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
import { Toast } from "vant";
import localStorage from "../util/storage";
import { setSkinStyle } from "../util/setStyle";
import { checkuserLogin, findUserIds,getDetailInfo } from "../services/request";
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      username: "",
      id: "",
      hasIds: false,
      allIds: [],
      // allNewArea:[],
      infoDialog: false,
      popupShow: false,
      overlayShow: false,
      leftPos: document.body.clientWidth / 2,
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
      gradeList: [
        {
          id: 3,
          name: "简单"
        },
        {
          id: 4,
          name: "中级"
        },
        {
          id: 5,
          name: "高级"
        }
      ],
      gradeSelected: 3,
      squalbox: 9,
      boxArr: [],
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
        // { url: require("../assets/images/timg6.jpeg") },
        // { url: require("../assets/images/2020-10-22-pic2.jpeg") }
      ],

      wall: 0,
      prevEl: null, // 上一个元素,
      dealtime: 180,
      timer: null,
      issuccess: false,
      canvasUrl: "",
      isVisible: false
    };
  },
  created() {
      let cuser = localStorage.getCurrentUser();
      console.log('cuser',JSON.parse(cuser))
      getDetailInfo({
            uid:JSON.parse(cuser).userId,
            levels:1
        }).then(res=>{
            const {data} = res;
            this.imgArr = data;
        });
    this.leftPos = document.body.clientWidth / 2;
    this.gradeSelected = this.gradeList[0].id;
    this.pool = this.generateMatrix(
      +this.gradeSelected,
      +(84 / this.gradeSelected),
      +(60 / this.gradeSelected)
    );
    this.boxArr = new Array(this.squalbox).fill(1).map((item, index) => {
      return index;
    });
  },
  mounted() {
    localStorage.setSkin("three");
    // 如果已经登录过,则记录缓存.
    let cuser = localStorage.getCurrentUser();
    if (cuser) {
      this.startDx = this.startDx - 100;
      this.transformX(this.$refs.wrap, this.startDx + "vw");
    }
  },
  computed: {
    gradestepDesc() {
      if (this.gradeSelected === 3) {
        return "简单";
      } else if (this.gradeSelected === 4) {
        return "中级";
      } else if (this.gradeSelected === 5) {
        return "高级";
      } else {
        return "简单";
      }
    }
  },
  methods: {
    handleClickPopshow() {
      this.popupShow = true;
    },
    handleClickDiashow() {
      this.infoDialog = true;
    },
    autoSearch() {
      // 模糊搜索加节流（500ms触发一次）
      var allowPass = true;
      if (!allowPass) {
        return;
      }
      findUserIds({ userId: this.id }).then(res => {
        console.log(res);
        const { data } = res;
        if (data.length > 0) {
          this.allIds = data;
          this.hasIds = true;
        }
      });
 
    },
    chooseArea(item) {
      this.gradeSelected = item.id;
      this.boxNum = this.gradeSelected;
      this.squalbox = +this.gradeSelected * +this.gradeSelected;
      this.pool = this.generateMatrix(
        +this.gradeSelected,
        +(84 / this.gradeSelected),
        +(60 / this.gradeSelected)
      );
      this.boxArr = new Array(this.squalbox).fill(1).map((item, index) => {
        return index;
      });
      if (this.gradeSelected === 3) {
        localStorage.setSkin("three");
      } else if (this.gradeSelected === 4) {
        localStorage.setSkin("four");
      } else if (this.gradeSelected === 5) {
        localStorage.setSkin("five");
      }
    },
    getItem(index) {
      this.activeClass = index;
    },

    setCurId(item) {
      this.id = item;
      this.hasIds = false;
    },

    checkLogin() {
      if (!this.username || !this.id) {
        Toast({
          message: "请输入用户信息进行匹配",
          position: "top"
        });
        return;
      }
      checkuserLogin({
        userName: this.username,
        userId: this.id
      }).then(res => {
        console.log("result", res);
        const {
          code,
          message
          // data: { userName, userId }
        } = res;
        if (code == "200") {
          Toast({
            message: "验证成功~",
            position: "top"
          });
          this.startDx = this.startDx - 100;
          this.transformX(this.$refs.wrap, this.startDx + "vw");

          getDetailInfo({
              uid:this.id,
              levels:this.gradeSelected
          }).then(res=>{
              console.log('res',res);
              const {data} = res;
              this.imgArr = data;
          })
          this.handleClickPopshow();
          const { userName, userId } = res.data;
          localStorage.setCurrentUser({ userName, userId });
        } else {
          Toast({
            message,
            position: "top"
          });
        }
      });
    },
    startGame(picIndex) {
      if (this.activeClass == -1) {
        Toast({
          message: "请先选择图片哦~",
          position: "top"
        });
        return;
      }
      this.timer = setInterval(this.timeStart, 1000);
      this.startDx = this.startDx - 100;
      this.transformX(this.$refs.wrap, this.startDx + "vw");
      this.selectedImg = this.imgArr[picIndex].picUrl;
      this.shuffle(document.querySelectorAll(".piece"), this.pool);
      let skin = localStorage.getSkin();
      setSkinStyle(skin);
    },
    reOrder() {
      this.shuffle(document.querySelectorAll(".piece"), this.pool);
    },
    lookpic() {
      this.overlayShow = true;
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
          // this.clickStartBtn = true;
          clearInterval(this.timer);
          this.startDx -= 100;
          this.issuccess = true;

          this.transformX(this.$refs.wrap, this.startDx + "vw");
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
      // this.handleClickPopshow();
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
        img.setAttribute("crossOrigin", "Anonymous");
        img.onload = function() {
          // 绘制的图片宽为.7winW, 根据等比换算绘制的图片高度为 .7winW*imgH/imgW
          imgH = (0.5 * winW * this.height) / this.width;
          // ctx.drawImage(img, 0.2 * winW, 0.1 * winH, 0.6 * winW, imgH);
          ctx.drawImage(img, 0.2 * winW, 20, 0.6 * winW, imgH);

          ctx.fillStyle = "#f00";
          ctx.font = 20 + "px Helvetica";
          ctx.textBaseline = "hanging";
          ctx.textAlign = "center";
          ctx.moveTo(0, 10);
          ctx.fillText(
            `挑战等级:${that.gradestepDesc}`,
            winW / 2,
            0.05 * winH + imgH
          );
          // drawText();
          // ctx.save();
          ctx.fillStyle = "#fff";
          ctx.font = 20 + "px Helvetica";
          ctx.textBaseline = "hanging";
          ctx.textAlign = "center";
          ctx.moveTo(10, 10);
          ctx.fillText(
            "我只用了" +
              (180 - that.dealtime) +
              `s,挑战完成,你也` +
              "快来挑战！",
            winW / 2,
            0.1 * winH + imgH
          );

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
            img.setAttribute("crossOrigin", "Anonymous");
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

      console.log("arr", JSON.stringify(arr));

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
      // ES6的解耦交换方式： [arr[index], arr[n]] = [arr[n], arr[index]];
      [arr[indexA], arr[indexB]] = [arr[indexB], arr[indexA]];
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
      image.setAttribute("crossOrigin", "Anonymous");
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
  width: 500vw;
  transition: transform 1s cubic-bezier(0.52, 0.37, 0.16, 1.32);
}

div {
  box-sizing: border-box;
}
.van-cell-group {
  margin-top: 20%;
}
.gradestep {
  margin-bottom: 10px;
}
.gradeste span {
  margin-right: 8px;
}
.van-icon {
  top: 2px;
  left: 3px;
}
.van-action-sheet {
  transform: translateX(-100vw);
}
.van-action-sheet__header i {
  top: 0;
  right: -15%;
}
.van-icon.van-icon-success {
  transform: translateX(-207vw);
}
.van-icon.van-icon-close {
  font-size: 30px;
  color: #fff;
  z-index: 1111111;
  top: 206px;
  left: -116px;
}
.hiddennone {
  opacity: 0;
}

.gameText {
  padding: 0 15px;
}
.gameText p {
  font-size: 13px;
  line-height: 24px;
  text-align: left;
}
#grade {
  padding: 3px 5px;
  width: 120px;
  overflow: hidden;
}
.gradeste select option {
  width: 110px;
  line-height: 20px;
}
.btn {
  display: inline-block;
  padding: 10px 60px;
  width: 300px;
  background-color: #06c;
  color: #fff;
  cursor: pointer;
  margin: 3% auto 5px;
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
.check-page {
  padding: 0 20px;
}
.check-page button {
  margin-top: 50px;
}
.check-page,
.play-page,
.preview-page,
.result-page,
.start-page {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.start-page .title,
.check-page .title {
  line-height: 4em;
  font-size: 24px;
}

.start-page h1,
.check-page h1 {
  margin-bottom: 10px;
}

.start-page .album-list {
  width: 100%;
  /* display: flex; */
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

.van-grid-item.active {
  border: 2px solid #f00;
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
/* 查看原图 */
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: auto;
  height: 320px;
  background-color: #fff;
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
  outline: #ccc solid 3px;
}

.play-page .play-area.active {
  outline-color: #1f8b40;
}

.play-page .play-area .piece.active {
  border: 3px solid red;
}
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
}
</style>

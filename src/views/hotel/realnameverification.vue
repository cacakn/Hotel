<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>实名核验管理</el-breadcrumb-item>
      <el-breadcrumb-item>实名核验</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <p style="margin:0 0 10px 0;font-size:18px;">当前用户订单</p>
      <el-table :data="userlist" border stripe style="margin:15px 0 15px 0">
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="房间号" prop="roomNumber"></el-table-column>
        <el-table-column label="房间单价" prop="roomPrice"></el-table-column>
        <el-table-column label="房间类型" prop="roomType"></el-table-column>
        <el-table-column  label="支付状态" prop="orderStates">
           <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.orderStates === 1">已支付</el-tag>
            <el-tag type="warning" v-else-if="scope.row.orderStates === 2">未支付</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="camera_outer">
        <video id="videoCamera" :width="videoWidth" :height="videoHeight" autoplay></video>
        <canvas style="display:none;" id="canvasCamera" :width="videoWidth" :height="videoHeight"></canvas>
        <div v-if="imgSrc" class="img_bg_camera">
          <p>效果预览</p>
          <img :src="imgSrc" alt class="tx_img" />
        </div>
        <div class="button">
          <el-button size="medium" type="primary" @click="getCompetence()">打开摄像头</el-button>
          <el-button size="medium" type="danger" @click="stopNavigator()">关闭摄像头</el-button>
          <el-button size="medium" type="primary" @click="setImage()">拍照</el-button>
          <el-button size="medium" type="primary" @click="realnameverification()">实名核验</el-button>
        </div>
      </div>
      <!-- 用户列表区域 -->
      
    </el-card>
  </div>
</template>   



<script>
export default {
  data() {
    return {
      videoWidth: 200,
      videoHeight: 300,
      imgSrc: "",
      thisCancas: null,
      thisContext: null,
      thisVideo: null,
      openVideo: false,
      form: {},
      userlist:[]
    };
  },
  mounted() {
    //this.getCompetence()//进入页面就调用摄像头
  },
  methods: {
    // 调用权限（打开摄像头功能）
    getCompetence() {
      var _this = this;
      _this.thisCancas = document.getElementById("canvasCamera");
      _this.thisContext = this.thisCancas.getContext("2d");
      _this.thisVideo = document.getElementById("videoCamera");
      _this.thisVideo.style.display = "block";
      // 获取媒体属性，旧版本浏览器可能不支持mediaDevices，我们首先设置一个空对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
      // 使用getUserMedia，因为它会覆盖现有的属性。
      // 这里，如果缺少getUserMedia属性，就添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          // 首先获取现存的getUserMedia(如果存在)
          var getUserMedia =
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.getUserMedia;
          // 有些浏览器不支持，会返回错误信息
          // 保持接口一致
          if (!getUserMedia) {
            //不存在则报错
            return Promise.reject(
              new Error("getUserMedia is not implemented in this browser")
            );
          }
          // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }
      var constraints = {
        audio: false,
        video: {
          width: this.videoWidth,
          height: this.videoHeight,
          transform: "scaleX(-1)"
        }
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
          // 旧的浏览器可能没有srcObject
          if ("srcObject" in _this.thisVideo) {
            _this.thisVideo.srcObject = stream;
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            _this.thisVideo.src = window.URL.createObjectURL(stream);
          }
          _this.thisVideo.onloadedmetadata = function(e) {
            _this.thisVideo.play();
          };
        })
        .catch(err => {
          console.log(err);
        });
    },
    //  绘制图片（拍照功能）
    setImage() {
      var _this = this;
      // canvas画图
      _this.thisContext.drawImage(
        _this.thisVideo,
        0,
        0,
        _this.videoWidth,
        _this.videoHeight
      );
      // 获取图片base64链接
      var image = this.thisCancas.toDataURL("image/jpeg");
      _this.imgSrc = image; //赋值并预览图片
      //   console.log(image);
    },
    // 关闭摄像头
    stopNavigator() {
      this.thisVideo.srcObject.getTracks()[0].stop();
    },
    // base64转文件，此处没用到
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(",");
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    // 上传实名头像
    async realnameverification() {
      console.log("图片base64", this.imgSrc);
      let formData = new FormData();
      formData.append("file", this.imgSrc);
      const {
        data: res
      } = await this.$http.post(
        "http://101.132.135.179:8088/hotel/face/faceSearch",
        formData,
        { "Content-Type": "multipart/form-data" }
      );
      console.log("实名核验:", res);
      this.form = res.data;
      if (res.code == 0) {
        this.$message.success("匹配成功");
      } else {
        this.$message.error("匹配失败");
      }
      const { data: demo } = await this.$http.post(
        "http://101.132.135.179:8088/hotel/select/getUserRoomListByUserId?userId="+this.form.userId
      );
      if (demo.code == 0) {
          this.$confirm('是否入住房间, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '入住成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消入住'
          });          
        });
      } else {
        this.$message.error("没有房间订单");
      }
      this.userlist=demo.data;
      console.log('用户订单信息',this.userlist)
    }
  }
};
</script>

<style>
</style>


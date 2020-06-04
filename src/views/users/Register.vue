<template>
  <div>
    <div class="loading-wrapper" v-show="showLoading">
      <Loading></Loading>
    </div>
    <div class="register-wrapper" v-show="!showLoading">
      <img :src="imgUrl" alt width="100%" height="100%" />
      <div id="register">
        <p class="title">ACE智慧精品酒店</p>
        <el-form
          :model="ruleForm2"
          status-icon
          :rules="rules2"
          ref="ruleForm2"
          label-width="0"
          class="demo-ruleForm"
        >
          <el-form-item prop="idcardNumber">
            <el-input v-model="ruleForm2.idcardNumber" auto-complete="off" placeholder="请输入身份证号"></el-input>
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="ruleForm2.username" auto-complete="off" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="ruleForm2.password"
              auto-complete="off"
              placeholder="输入密码"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item prop="checkPass">
            <el-input
              type="password"
              v-model="ruleForm2.checkPass"
              auto-complete="off"
              placeholder="确认密码"
            ></el-input>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="Register" style="width:100%;">注册</el-button>
            <p class="login" @click="gotoLogin">已有账号？立即登录</p>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../axios.js";
import CryptoJS from "crypto-js"; // md5 加密
import Loading from "@/components/loading/Loading.vue";
export default {
  name: "Register",
  components: {
    Loading
  },
  data() {
    // let checkName = (rule, value, callback) => {
    //   if (value.trim() === "") {
    //     callback(new Error("请输入手机号"));
    //   } else {
    //     callback();
    //   }
    // };
    // let checkTel = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请输入邮箱"));
    //   } else if (!this.checkEmail(value)) {
    //     callback(new Error("邮箱不合法"));
    //   } else {
    //     callback();
    //   }
    // };
    // // let checkSmscode = (rule, value, callback) => {
    // //   if (value === '') {
    // //     callback(new Error('请输入手机验证码'))
    // //   } else {
    // //     callback()
    // //   }
    // // }
    // let validatePass = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请输入密码"));
    //   } else {
    //     if (this.ruleForm2.checkPass !== "") {
    //       this.$refs.ruleForm2.validateField("checkPass");
    //     }
    //     callback();
    //   }
    // };
    // let checkidcardNumber = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请输入身份证号"));
    //   } else {
    //     if (this.ruleForm2.checkidcardNumber !== "") {
    //       this.$refs.ruleForm2.validateField("checkidcardNumber");
    //     }
    //     callback();
    //   }
    // };
    // let validatePass2 = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请再次输入密码"));
    //   } else if (value !== this.ruleForm2.pass) {
    //     callback(new Error("两次输入密码不一致!"));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      showLoading: true,
      imgUrl: require("../../assets/images/login.jpg"),
      ruleForm2: {
        username: "",
        password: "",
        idcardNumber: "",
        // checkPass: ""
      },
      rules2: {
        username: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "请正确输入手机号",
            trigger: "blur"
          }
        ],
        idcardNumber: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          {
            min: 18,
            max: 18,
            message: "请正确输入身份证号",
            trigger: "blur"
          }
        ],
        password: [ { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 4,
            max: 12,
            message: "请输入密码",
            trigger: "blur"
          }],
        // checkPass: [{ validator: validatePass2, trigger: "change" }]
      },
      // buttonText: '发送验证码',
      // isDisabled: false, // 是否禁止点击发送验证码按钮
      flag: true
    };
  },
  mounted() {
    let bgImg = new Image();
    bgImg.src = this.imgUrl;
    bgImg.onerror = () => {
      console.log("img onerror");
    };
    bgImg.onload = () => {
      // 图片加载成功后 去除 loading
      this.showLoading = false;
    };
  },
  methods: {
    // sendCode() {
    //   let email = this.ruleForm2.email
    //   if (this.checkEmail(email) && this.ruleForm2.username) {
    //     console.log(email)

    //     // 发送验证码
    //     axios.userVerify({
    //       username: encodeURIComponent(this.ruleForm2.username),
    //       email: this.ruleForm2.email
    //     }).then((res) => {
    //       if (res.status === 200 && res.data && res.data.code === 0) {
    //         this.$notify({
    //           title: '成功',
    //           message: '验证码发送成功，请注意查收。有效期5分钟。',
    //           duration: 1000,
    //           type: 'success'
    //         })

    //         let time = 300
    //         this.buttonText = '已发送'
    //         this.isDisabled = true
    //         if (this.flag) {
    //           this.flag = false;
    //           let timer = setInterval(() => {
    //             time--;
    //             this.buttonText = time + ' 秒'
    //             if (time === 0) {
    //               clearInterval(timer);
    //               this.buttonText = '重新获取'
    //               this.isDisabled = false
    //               this.flag = true;
    //             }
    //           }, 1000)
    //         }
    //       } else {
    //         this.$notify({
    //           title: '失败',
    //           message: res.data.msg,
    //           duration: 1000,
    //           type: 'error'
    //         })
    //       }
    //     })
    //   }
    // },
    Register() {
      this.$refs.ruleForm2.validate(async valid => {
        if (!valid) return;
        // 可以发起添加用户的网络请求

        const { data: res } = this.$http
          .post(
            "http://101.132.135.179:8088/hotel/users/insertUser?" +
              "username=" +
              this.ruleForm2.username +
              "&password=" +
              this.ruleForm2.password +
              "&idcardNumber=" +
              this.ruleForm2.idcardNumber 
          )
          .then(res => {
            console.log("添加用户", res);
            if (res.data.code == 0) {
              this.$message.success("添加用户成功！");
            } else {
              this.$message.error("用户名已存在");
            }
          })
          .catch(err => {});
      });
    },
    gotoLogin() {
      this.$router.push({
        path: "/user/login"
      });
    }
    // // 验证邮箱
    // checkEmail(str) {
    //   let re = /^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/
    //   if (re.test(str)) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
  }
};
</script>

<style scoped>
.loading-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #aedff8;
  display: flex;
  align-items: center;
  justify-content: center;
}
.register-wrapper img {
  position: absolute;
  z-index: 1;
}
.register-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
#register {
  max-width: 340px;
  margin: 240px auto;
   background: rgba(255, 255, 255, 0.5);
  padding: 20px 40px;
  border-radius: 10px;
  position: relative;
  z-index: 9;
}
.title {
  font-size: 26px;
  line-height: 50px;
  font-weight: bold;
  margin: 10px;
  text-align: center;
}
.el-form-item {
  text-align: center;
}
.login {
  margin-top: 10px;
  font-size: 14px;
  line-height: 22px;
  color: #1ab2ff;
  cursor: pointer;
  text-align: left;
  text-indent: 8px;
  width: 160px;
}
.login:hover {
  color: #2c2fd6;
}
.code >>> .el-form-item__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.code button {
  margin-left: 20px;
  width: 140px;
  text-align: center;
}
.el-button--primary:focus {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}
@media (max-width: 768px) {
  #register {
    max-width: 260px;
    margin: 60px auto;
    background: #fff;
    padding: 10px 20px;
    border-radius: 10px;
    position: relative;
    z-index: 9;
  }
}
</style>

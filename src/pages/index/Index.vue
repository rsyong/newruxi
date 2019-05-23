<style>
.ant-message {
  top: 48%;
}
.indexTopBackground {
  width: 100%;
  height: 45%;
  background-position: center;
  background-repeat: no-repeat;
}
.indexContent {
  width: 300px;
  margin: 60px auto 0;
  position: relative;
}
.indexContent h1 {
  background: #fff;
  font-size: 14px;
  margin-bottom: 0;
  width: 70px;
  position: absolute;
  height: 21px;
  line-height: 21px;
  top: -9px;
  left: 10px;
  z-index: 2;
  text-align: center;
  color: #b7b6b6;
}
.indexContent input {
  z-index: 1;
  height: 40px;
}
.indexContent button {
  height: 40px;
  margin-left: 10px;
}
</style>
<template>
  <div style="width:100%;height:100%">
    <div class="indexTopBackground" style="background-image:url('static/img/vue-antd-logo.png')"></div>
    <div class="indexContent">
      <h1>手机号</h1>
      <a-input
        @blur="onBlur"
        placeholder="请输入正确的11位数的手机号码"
        maxlength="11"
        type="number"
        id="phone"
      />
    </div>
    <div class="indexContent" style="margin-top:20px">
      <h1>验证码</h1>
      <a-input placeholder="请输入收到的验证码" id="code" style="width:184px"/>
      <a-button type="primary" @click="getCode">获取验证码</a-button>
    </div>
    <div class="indexContent">
      <a-button type="primary" @click="checkCode" style="width:100%;margin-left:0">验证并登陆</a-button>
    </div>
  </div>
</template>

<script>
//import Head from '@/components/head';
export default {
  name: "Index",
  //components: {Head},
  data: function() {
    return {
      id: [], //用户ID
      openId: [] //用户的微信openId
    };
  },
  created: function() {
    document.title = "登录";
  },
  mounted: function() {
    //挂载结束状态

    function getCookie(name) {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var cookieStr = cookie.split("=");
        if (cookieStr && cookieStr[0].trim() == name) {
          return unescape(cookieStr[1]);
        }
      }
    }
    //进行请求，获取用户的id
    if (!getCookie("user_info")) {
      var obj = {
        openid: "oRAKMw85--UBG8NNY2LJGYddZDIY"
      };
      document.cookie = "user_info=" + JSON.stringify(obj) + ";";
    }
    var useInfo = JSON.parse(getCookie("user_info"));
    console.log(useInfo);
    this.openId = useInfo.openid;
  },
  methods: {
    // 验证是否为手机号码
    onBlur(e) {
      const { value } = e.target;
      const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (reg.test(value) == false && value != "") {
        this.$message.info("请输入正确的11位数的手机号码");
      }
    },
    //获取验证码
    getCode() {
      let that=this;
      const value = document.getElementById("phone").value;
      const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (reg.test(value) == false && value != "") {
        //this.$message.info('请输入正确的11位数的手机号码');
      } else if (value == "") {
        this.$message.info("请输入手机号码");
      } else {
        //发起请求
        const http = this.HOST + "/index.php/Home/Wx/send_code?tel=" + value;
        this.$axios
          .get(http, {})
          .then(function(res) {
            if (res.data.code == 0) {
              that.$message.info("发送成功，请注意查收");
            } else {
              that.$message.info(res.data.msg);
            }
          })
          .catch(function(error) {});
      }
    },
    //校验验证码
    checkCode() {
      const code = document.getElementById("code").value;
      const phone = document.getElementById("phone").value;
      const openId = this.openId;
      if (!phone) {
        return this.$message.info("手机号不能为空!");
      }
      if (!code) {
        return this.$message.info("验证码不能为空!");
      }
      if (code != "") {
        const http =
          this.HOST +
          "/index.php/Home/Wx/check_code?tel=" +
          phone +
          "&code=" +
          code +
          "&openid=" +
          openId;
        var that = this;
        this.$axios
          .get(http, {})
          .then(function(res) {
            //that.$message.info('校验失败');
            if (res.data.code == 0) {
              //that.$message.info('验证成功');
              that.$router.push("/member");
            } else {
              that.$message.info(res.data.msg);
            }
          })
          .catch(function(error) {});
      }
    }
  }
};
</script>


// WEBPACK FOOTER //
// src/pages/index/Index.vue
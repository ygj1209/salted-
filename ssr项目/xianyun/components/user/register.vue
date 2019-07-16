<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input v-model="form.username" placeholder="用户名手机"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="captcha">
      <el-input v-model="form.captcha" placeholder="验证码">
        <template slot="append">
          <el-button @click="handleSendCaptcha">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="nickname">
      <el-input v-model="form.nickname" placeholder="你的名字"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input v-model="form.password" placeholder="密码" type="password"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="checkpassword">
      <el-input v-model="form.checkpassword" placeholder="确认密码" type="password"></el-input>
    </el-form-item>

    <el-button class="submit" type="primary" @click="handleRegSubmit">注册</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    //确认密码的 一致性
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      num: 60,
      form: {
        username: "",
        nickname: "",
        captcha: "",
        password: "",
        checkpassword: ""
      },
      // 表单规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        nickname: [
          { required: true, message: "请输入你的名字", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        checkpassword: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  methods: {
    // 发送验证码
    handleSendCaptcha() {
      // 获取手机号码
      const phoneNumber = this.form.username;
      //判断使用输入用户手机时才能发送验证码,值不能为空
      if (!phoneNumber.trim()) {
        this.$message({
          message: "请输入用户名",
          type: "warning"
        });
        //否则返回
        return;
      }
      this.$store.dispatch("user/logincode", phoneNumber).then(res => {
        // console.log (res)
        this.$confirm(`模拟手机验证码为:${res}`, "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning"
        });
      });

      //设置定时器部分
      //   var num=60
      //   const item=setInterval(function(){
      //      num--
      //   },1000)
    },

    // 注册
    handleRegSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 注册提交,把确认密码参数拿取出来然后再赋值
          const { checkpassword, ...props } = this.form;

          this.$axios({
            url: `/accounts/register`,
            method: "POST",
            data: props
          }).then(res => {
            // console.log(res);
            this.$store.commit("user/setuserinfo", res.data);
            // 注册成功提示
            this.$message({
              message: `注册成功,欢迎您　${this.$store.state.user.userInfo.user.nickname}`,
              type: "success"
            });
            //跳转到首页
            this.$router.push("/");
          })

          //此方式也是可以拦截错误信息
        //   .catch(err=>{
        //       // 注册成功提示
        //     // this.$message({
        //     //   message: `用户名已被注册`,
        //     //   type: "success"
        //     // });
        //   })
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>
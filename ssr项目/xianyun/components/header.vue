<template>
  <header class="header">
    <el-row type="flex" justify="space-between" class="main">
      <!-- logo部分 -->
      <div class="logo">
        <nuxt-link to="/">
          <img src="http://157.122.54.189:9093/images/logo.jpg" alt />
        </nuxt-link>
      </div>
      <!-- 导航栏部分 -->
      <!-- 当前的路径如果匹配上链接的to属性的值，会默认加上这个class：nuxt-link-exact-active -->
      <el-row type="flex" class="navs">
        <nuxt-link to="/">首页</nuxt-link>
        <nuxt-link to="/post">旅游攻略</nuxt-link>
        <nuxt-link to="/hotel">酒店</nuxt-link>
        <nuxt-link to="/air/airfare">国内机票</nuxt-link>
      </el-row>
      <div>
        <el-dropdown click="news">
          <span class="el-dropdown-link">
            <i class="el-icon-bell el-icon--right"></i>
            消息
            <i class="el-icon-phone-outline el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>消息</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 登录注册部分 -->
      <div  v-if="!$store.state.user.userInfo.token" class="logindenglu">
        <nuxt-link to="/user/login" class="login">登录/ 注册</nuxt-link>
      </div>
      <!-- 登录后显示的下拉用户部分 -->
      <div v-else>
        <el-dropdown>
          <el-row type="flex" align="middle" class="userhead">
            <nuxt-link to>
              <!-- 动态绑定头像 -->
              <img :src="$axios.defaults.baseURL+$store.state.user.userInfo.user.defaultAvatar" alt />
            </nuxt-link>
          </el-row>
          <span class="el-dropdown-link">
            {{ $store.state.user.userInfo.user.nickname }}
            <i class="el-icon-loading el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click.native="handeLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-row>
  </header>
</template>

<script>
export default {
  methods: {
    //退出部分
    handeLogout() {
      this.$store.commit("user/clearuserinfo");
      this.$message({
        message: "退出成功",
        type: "success"
      });
      //退出返回到登录部分
      this.$router.push("/user/login")
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #ddd;
}
.main {
  width: 1000px;
  margin: 0 auto;
}
.navs {
  flex: 1;
  margin: 0 20px;

  a {
    padding: 0 20px;
    height: 60px;
    box-sizing: border-box;
    &:hover{
      border-bottom: 5px #409eff solid;
      color: #409eff;
    }
  }
  .nuxt-link-exact-active{
        background:#409eff;
        color:#fff;

        &:hover{
            color:#fff;
        }
    }
}
.logo img {
  width: 156px;
  height: 43px;
  vertical-align: middle;
}
.login:hover {
  text-decoration: underline;
  color: #409eff;
}
.login {
  font-size: 14px;
}
.logindenglu {
  margin-left: 20px;
}
.userhead {
  margin-left: 20px;
  padding: 0 10px;
  float: left;
  &:hover {
    img {
      border-color: red;
    }
  }
  a {
    display: block;
  }
}
.userhead img {
  width: 32px;
  height: 32px;
  vertical-align: middle;
  border: 2px #fff solid;
  border-radius: 50px;
  &:hover {
    border-color: red;
  }
  a {
    display: block;
  }
}
.news span {
  padding: 0 20px;
}
.el-dropdown-link {
  cursor: pointer;
}
</style>

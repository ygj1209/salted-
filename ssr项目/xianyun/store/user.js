//使用vuex把token值和user登录的信息存储起来

//用户管理
export const state = () => ({
  userInfo: {
    token: "",
    user: {}
  }
})

export const mutations = {
  //保存信息到state中
  setuserinfo(state, data) {
    state.userInfo = data
  },

  //退出部分
  clearuserinfo(state, data) {
    state.userInfo = {
      token: "",
      user: {}
    }
  }
}

//实现异步操作
export const actions = {
  //登录
  login({
    commit
  }, data) {
    return this.$axios({
        method: "POST",
        url: "/accounts/login",
        data: data
      })
      .then(res => {
        //   console.log (res)
        const data = res.data
        //保存到state
        commit("setuserinfo", data)
        return data
      })
  },
  //发送验证码请求
  logincode(store, data) {
    return this.$axios({
      method: "POST",
      url: "/captchas",
      data: {
        tel: data
      }
    }).then(res => {
      // console.log(res);
      const {code} = res.data
      //此处没有值可以保存
      return code
    });
  }
}

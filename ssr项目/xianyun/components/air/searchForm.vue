<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" ref="form" label-width="80px">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <el-autocomplete
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          class="el-autocomplete"
          v-model="form.departCity"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="到达城市">
        <el-autocomplete
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          v-model="form.destCity"
          @select="handleDestSelect"
          class="el-autocomplete"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间">
        <!-- change 用户确认选择日期时触发 -->
        <el-date-picker
          type="date"
          placeholder="请选择日期"
          v-model="form.departDate"
          style="width: 100%;"
          @change="handleDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import moment from "moment";
import { resolve, reject } from "q";
export default {
  data() {
    return {
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      currentTab: 0,
      form: {
        departCity: "", // 出发城市
        departCode: "", // 出发城市代码
        destCity: "", // 到达城市
        destCode: "", // 到达城市代码
        departDate: "" // 日期字符串
      }
    };
  },
  methods: {
    // tab切换时触发
    handleSearchTab(item, index) {
      if (index === 1) {
        this.$confirm("目前暂不支持往返，请使用单程选票！", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning"
        });
      }
    },

    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    async queryDepartSearch(value, cb) {
      const arr = await this.querySearchAsync(value);
      //判断有值时
      if (arr.length > 0) {
        this.form.departCity = arr[0].value;
        this.form.departCode = arr[0].sort;
      }
      cb(arr);
    },

    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    async queryDestSearch(value, cb) {
      //await会返回一个promise数据
      const arr = await this.querySearchAsync(value);
      //判断有值时
      if (arr.length > 0) {
        this.form.destCity = arr[0].value;
        this.form.destCode = arr[0].sort;
      }
      cb(arr);
    },

    //封装函数
    querySearchAsync(value) {
      //判断值不能为空 ,resolve代表成功的回调
      return new Promise((resolve, reject) => {
        if (!value.trim()) {
          resolve([]);
          return;
        }
        this.$axios({
          url: "/airs/city",
          params: {
            name: value
          }
        }).then(res => {
          const { data } = res.data;
          //该循环是循环返回字符串值拿取到除去市的值
          var newDate = data.map(item => {
            return {
              ...item,
              value: item.name.replace("市", "")
            };
          });

          resolve(newDate);
        });
      });
    },



    // 出发城市下拉选择时触发
    handleDepartSelect(item) {
      this.form.departCity = item.value;
      this.form.departCode = item.sort;
    },

    // 目标城市下拉选择时触发
    handleDestSelect(item) {
      this.form.destCity = item.value;
      this.form.destCode = item.sort;
    },

    // 确认选择日期时触发
    handleDate(value) {
      this.form.departDate = moment(value).format("YYYY-MM-DD");
    },

    // 触发和目标城市切换时触发
    handleReverse() {
      const { departCity, departCode, destCity, destCode } = this.form;

      this.form.departCity = destCity;
      this.form.departCode = destCode;
      this.form.destCity = departCity;
      this.form.destCode = departCode;
    },

    // 提交表单是触发
    handleSubmit() {
      console.log(this.form);
      // 表单验证数据
      const rules = {
        depart: {
          value: this.form.departCity,
          message: "请选择出发城市"
        },
        dest: {
          value: this.form.destCity,
          message: "请选择到达城市"
        },
        departDate: {
          value: this.form.departDate,
          message: "请选择出发时间"
        }
      };

      //这个是判断只显示当前这个提示,定义一个变量为true
      var valid = true;
      for (var key in rules) {
        // 如果有一次验证不通过的，直接返回
        if (!valid) return;
        if (!rules[key].value) {
          valid = false;
          // this.$message.warning(rules[key].message);

          this.$confirm(`${rules[key].message}`, "提示", {
            confirmButtonText: "确定",
            showCancelButton: false,
            type: "warning"
          });
        }
      }
      //跳转页面
      this.$router.push({
        path: "/air/flights",
        query: this.form
      });
      //  var valid=true
      // //使用foreach便利
      // Object.keys(rules).forEach(item=>{
      //   // 如果有一次验证不通过的，直接返回
      //     if(!valid) return
      //   //判断值为空
      //   if (!rules[item].value) {
      //      valid=false
      //      this.$message.warning(rules[item].message)
      //   }
      // })
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.there {
  width: 500px;
  height: 319px;
  background: #fff;
  border-radius: 5%;
  position: absolute;
  top: 28px;
  left: 440px;
  p {
    margin-top: 20px;
    text-align: center;
  }

  img {
    width: 152px;
    height: 152px;
    display: block;
    position: absolute;
    top: 112px;
    left: 180px;
  }
}
.el-icon-close {
  display: block;
  position: absolute;
  cursor: pointer;
  top: 10px;
  left: 475px;
  width: 50px;
  height: 50px;
}
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>
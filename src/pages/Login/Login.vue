<template>
  <el-form :model="loginInfo" ref="loginFrom" class="LoginFrom" :rules="rules">
    <h2 class="LoginTitle">登录</h2>
    <el-form-item prop="userName" label="用户名">
      <el-input
        type="text"
        v-model="loginInfo.userName"
        placeholder="请输入用户名"
      ></el-input>
    </el-form-item>
    <el-form-item prop="password" label="密码" style="line-height: 24px">
      <el-input
        type="password"
        v-model="loginInfo.password"
        placeholder="请输入密码"
      ></el-input>
    </el-form-item>

    <el-checkbox :checked="isCheck" style="margin-right: 10px"
      >记住我</el-checkbox
    >
    <el-button
      type="primary"
      style="width: 250px"
      @click="Login(loginInfo.userName, loginInfo.password)"
      >登录</el-button
    >
  </el-form>
</template>
<script type="text/ecmascript-6">
// import { Button } from "element-ui"
import { reqLogin } from "../../API/index"
export default {
  data() {
    return {
      loginInfo: {
        userName: "admin",
        password: "123456",
        code: "11",
      },
      isCheck: false,
      captchUrl: "",
      rules: {
        userName: [
          { required: true, message: "用户名不能为空", trigger: "change" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "change" },
        ],
        code: [
          { required: true, message: "验证码不能为空", trigger: "change" },
        ],
      },
    }
  },
  methods: {
     Login(user, pwd) {
      this.$refs.loginFrom.validate( async (valid) => {
        if (valid) {
          const result = await reqLogin(user, pwd)
          // console.log(result)
          // 将tokne保存到sessionStorage
          window.sessionStorage.setItem('token',result.data.token)
          this.$router.push('/home')
        } else {
          this.$message.error("请输入用户名,密码")
          return false
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.LoginFrom {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 150px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .LoginTitle {
    color: #000;
    margin: 20px 150px;
  }
}
</style>

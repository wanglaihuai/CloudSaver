<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-header">
        <img :src="logo" alt="logo" class="logo" />
        <div class="name">Cloud Saver</div>
      </div>
      <van-form @submit="handleLogin">
        <van-cell-group inset class="login-form-group">
          <van-field
            v-model="loginForm.username"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="loginForm.password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit"> 登录 </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import logo from "@/assets/images/logo.png";
import { userApi } from "@/api/user";
import router from "@/router";
import { showNotify } from "vant";

const loginForm = ref({
  username: "",
  password: "",
});
const handleLogin = async () => {
  try {
    const res = await userApi.login(loginForm.value);
    console.log(res);
    if (res.code === 0) {
      const { token } = res.data;
      localStorage.setItem("token", token);
      // 路由跳转首页
      router.push("/");
    } else {
      showNotify({
        message: res.message,
        duration: 2000,
        type: "danger",
      });
    }
  } catch (error) {
    showNotify({
      message: "登录失败",
      duration: 2000,
      type: "danger",
    });
  }
};
</script>
<style lang="scss" scoped>
.login-container {
  padding: 0;
  background-color: #fff;
  width: 100%;
  height: 100vh;
  background: url("../../assets//images//mobile-login-bg.png") no-repeat;
  background-size: 100% auto;

  .login-header {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 38px;
    .logo {
      width: 50px;
      height: auto;
      margin-right: 18px;
    }
    .name {
      font-size: 50px;
      font-weight: 700;
      letter-spacing: 0px;
      line-height: 65.64px;
      color: rgba(2, 46, 87, 1);
    }
  }
  .login-form {
    height: 60%;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #fff;
    border-radius: 20px 20px 0 0;
    box-sizing: border-box;
    padding-top: 30px;
    .login-form-group {
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 15px;
    }
  }
}
</style>

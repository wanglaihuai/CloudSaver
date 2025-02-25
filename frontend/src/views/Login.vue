<template>
  <div class="login-register">
    <div class="login-bg"></div>
    <el-card class="card">
      <!-- 登录与注册切换 -->
      <el-tabs v-model="activeTab" class="tabs">
        <el-tab-pane label="登录" name="login"></el-tab-pane>
        <el-tab-pane label="注册" name="register"> </el-tab-pane>
      </el-tabs>

      <!-- 登录表单 -->
      <el-form
        v-if="activeTab === 'login'"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
      >
        <el-form-item prop="username" class="form-item">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            name="username"
            autocomplete="on"
            class="form-input"
          />
        </el-form-item>
        <el-form-item prop="password" class="form-item">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            class="form-input"
            show-password="true"
            autocomplete="on"
            name="password"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-button type="primary" class="form-submit" @click="loginFormRefValidate">
          登录
        </el-button>
      </el-form>

      <!-- 注册表单 -->
      <el-form
        v-if="activeTab === 'register'"
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-position="top"
        ><el-form-item prop="username" class="form-item">
          <el-input v-model="registerForm.username" placeholder="用户名" class="form-input" />
        </el-form-item>
        <el-form-item prop="password" class="form-item">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="密码"
            class="form-input"
          />
        </el-form-item>
        <el-form-item prop="password" class="form-item">
          <el-input
            v-model="password2"
            type="password"
            placeholder="再次输入密码"
            class="form-input"
          />
        </el-form-item>
        <el-form-item prop="registerCode" class="form-item">
          <el-input v-model="registerForm.registerCode" placeholder="注册码" class="form-input" />
        </el-form-item>

        <el-button type="primary" class="form-submit" @click="handleRegister"> 注册 </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup type="ts">
import { ref } from "vue";
import { userApi } from "@/api/user";
import router from "@/router";
import { ElMessage } from "element-plus";

const activeTab = ref("login"); // 默认显示登录表单

const loginForm = ref({
  username: "",
  password: "",
});
const registerForm = ref({
  username: "",
  password: "",
  registerCode: "",
});

const password2 = ref("");

const loginRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const registerRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  registerCode: [{ required: true, message: "请输入注册码", trigger: "blur" }],
};

const loginFormRef = ref(null);
const registerFormRef = ref(null);



const handleLogin = async () => {
      try {
        const res = await userApi.login(loginForm.value);
        if (res.code === 0) {
          const { token } = res.data;
          localStorage.setItem("token", token);
          // 路由跳转首页
          router.push("/");
        } else {
          ElMessage.error(res.message);
        }
      } catch (error) {
        ElMessage.error("登录失败", error);
      }
};
const loginFormRefValidate = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      handleLogin();
    } else {
      ElMessage.error("登录表单验证失败");
    }
  });
};

const handleRegister = async () => {
  registerFormRef.value.validate(async (valid) => {
    if (valid) {
      if(password2.value !== registerForm.value.password){
        return ElMessage.error("两次输入的密码不一致");
      }
      try {
        const res = await userApi.register(registerForm.value);
        if (res.code === 0) {
          ElMessage.success("注册成功");
          loginForm.value.username = registerForm.value.username
          loginForm.value.password = registerForm.value.password
          handleLogin()
        } else {
          ElMessage.error(res.message || "注册失败");
        }
      } catch (error) {
        ElMessage.error(error.message || "注册失败");
      }
    } else {
      console.error("注册表单验证失败");
    }
  });
};
</script>

<style scoped lang="scss">
.login-register {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("../assets/images/login-bg.jpg");
  background-size: cover;
  background-position: center center;
  -webkit-filter: blur(3px);
  -moz-filter: blur(3px);
  -o-filter: blur(3px);
  -ms-filter: blur(3px);
  filter: blur(3px);
  z-index: 0;
}
.card {
  position: relative;
  z-index: 10;
  width: 480px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 20px 60px rgba(123, 61, 224, 0.1);
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-button {
  flex: 1;
  text-align: center;
}

.form-item {
  width: 100%;
  margin-bottom: 30px;
}
.form-input {
  height: 48px;
  border-radius: 10px;
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.forgot-password {
  color: #6366f1;
  text-decoration: none;
  font-size: 14px;
}

.form-submit {
  margin-bottom: 10px;
  background-color: #6366f1;
  width: 100%;
  height: 48px;
}

.google-login {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.agreement {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}

.user-agreement {
  color: #6366f1;
  text-decoration: none;
}
</style>

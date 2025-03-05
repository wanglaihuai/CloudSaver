<template>
  <div class="login">
    <!-- 背景区域 -->
    <div class="login__background" aria-hidden="true" />

    <!-- 主要内容区 -->
    <main class="login__content">
      <!-- 头部 Logo -->
      <header class="login__header">
        <img :src="logo" alt="Cloud Saver Logo" class="login__logo" width="60" height="60" />
        <h1 class="login__title">Cloud Saver</h1>
      </header>

      <!-- 登录表单 -->
      <van-form class="login__form" @submit="handleSubmit">
        <van-cell-group inset class="login__form-group">
          <!-- 用户名输入框 -->
          <van-field
            v-model="formData.username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
            autocomplete="username"
            @keyup.enter="focusPassword"
          >
            <template #left-icon>
              <van-icon name="user-o" />
            </template>
          </van-field>

          <!-- 密码输入框 -->
          <van-field
            ref="passwordRef"
            v-model="formData.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]"
            autocomplete="current-password"
            @keyup.enter="handleSubmit"
          >
            <template #left-icon>
              <van-icon name="lock" />
            </template>
          </van-field>

          <!-- 优化记住密码选项 -->
          <div class="login__remember">
            <van-checkbox v-model="rememberPassword" class="remember-checkbox">
              记住密码
            </van-checkbox>
          </div>
        </van-cell-group>

        <!-- 登录按钮 -->
        <div class="login__submit">
          <van-button
            :loading="isLoading"
            :disabled="isLoading"
            round
            block
            type="primary"
            native-type="submit"
            class="login__button"
          >
            {{ isLoading ? "登录中..." : "登录" }}
          </van-button>
        </div>
      </van-form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { showNotify } from "vant";
import type { FieldInstance } from "vant";
import { userApi } from "@/api/user";
import logo from "@/assets/images/logo.png";
import { STORAGE_KEYS } from "@/constants/storage";

// 类型定义
interface LoginForm {
  username: string;
  password: string;
}

// 响应式数据
const formData = ref<LoginForm>({
  username: "",
  password: "",
});
const isLoading = ref(false);
const passwordRef = ref<FieldInstance>();
const rememberPassword = ref(false);

// 工具函数
const router = useRouter();

// 方法定义
const focusPassword = () => {
  passwordRef.value?.focus();
};

// 在组件加载时检查是否有保存的账号密码
onMounted(() => {
  const savedUsername = localStorage.getItem(STORAGE_KEYS.USERNAME);
  const savedPassword = localStorage.getItem(STORAGE_KEYS.PASSWORD);
  if (savedUsername && savedPassword) {
    formData.value.username = savedUsername;
    formData.value.password = savedPassword;
    rememberPassword.value = true;
  }
});

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    const res = await userApi.login(formData.value);

    if (res.code === 0) {
      // 处理记住密码
      if (rememberPassword.value) {
        localStorage.setItem(STORAGE_KEYS.USERNAME, formData.value.username);
        localStorage.setItem(STORAGE_KEYS.PASSWORD, formData.value.password);
      } else {
        localStorage.removeItem(STORAGE_KEYS.USERNAME);
        localStorage.removeItem(STORAGE_KEYS.PASSWORD);
      }

      localStorage.setItem(STORAGE_KEYS.TOKEN, res.data.token);
      await router.push("/");
    } else {
      showNotify({
        type: "danger",
        message: res.message || "登录失败",
        duration: 2000,
      });
    }
  } catch (error) {
    showNotify({
      type: "danger",
      message: "登录失败",
      duration: 2000,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;

  // 背景
  &__background {
    position: absolute;
    inset: 0;
    background: url("@/assets/images/mobile-login-bg.png") no-repeat;
    background-size: cover;
    background-position: center;
  }

  // 主内容区
  &__content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    min-height: 65%;
    padding: 40px 20px;
    background-color: var(--theme-other_background);
    border-radius: 24px 24px 0 0;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8px);
  }

  // 头部
  &__header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
  }

  &__logo {
    width: 60px;
    height: 60px;
    margin-right: 12px;
    object-fit: contain;
  }

  &__title {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
    color: var(--theme-theme);
  }

  // 表单
  &__form {
    padding: 0;
  }

  &__form-group {
    margin: 0 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    overflow: hidden;
  }

  &__submit {
    margin: 32px 12px 0;
  }

  &__button {
    height: 48px;
    font-size: 16px;
    font-weight: 500;
  }

  // 记住密码区域
  &__remember {
    padding: 12px 16px;
    border-top: 0.5px solid #f5f5f5;
  }
}

// Vant 组件样式优化
:deep(.van-cell-group--inset) {
  margin: 0;
}

:deep(.van-field) {
  padding: 16px;

  .van-field__label {
    width: 4em;
    color: var(--theme-color);
    font-size: 15px;
  }

  .van-field__value {
    .van-field__body {
      input {
        font-size: 15px;
      }
    }
  }

  .van-field__left-icon {
    margin-right: 8px;
    font-size: 18px;
  }
}

// 记住密码复选框样式优化
:deep(.remember-checkbox) {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;

  .van-checkbox__icon {
    font-size: 16px;

    .van-icon {
      border: 1px solid #dcdee0;
      border-radius: 2px;
      transition: all 0.2s;
    }
  }

  .van-checkbox__label {
    margin-left: 6px;
    line-height: 1;
  }

  &.van-checkbox--checked {
    .van-icon {
      background-color: var(--theme-theme);
      border-color: var(--theme-theme);
    }
  }
}
</style>

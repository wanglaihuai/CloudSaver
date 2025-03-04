<template>
  <div class="login">
    <!-- 背景区域 -->
    <div class="login__background" aria-hidden="true" />

    <!-- 主要内容区 -->
    <main class="login__content">
      <!-- 头部 Logo -->
      <header class="login__header">
        <img :src="logo" alt="Cloud Saver Logo" class="login__logo" width="50" height="50" />
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
const rememberPassword = ref(!!localStorage.getItem("rememberedPassword"));

// 工具函数
const router = useRouter();

// 方法定义
const focusPassword = () => {
  passwordRef.value?.focus();
};

// 在组件加载时检查是否有保存的账号密码
onMounted(() => {
  if (rememberPassword.value) {
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");
    if (savedUsername && savedPassword) {
      formData.value.username = savedUsername;
      formData.value.password = savedPassword;
    }
  }
});

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    const res = await userApi.login(formData.value);

    if (res.code === 0) {
      // 处理记住密码
      if (rememberPassword.value) {
        localStorage.setItem("username", formData.value.username);
        localStorage.setItem("password", formData.value.password);
        localStorage.setItem("rememberedPassword", "true");
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberedPassword");
      }

      localStorage.setItem("token", res.data.token);
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
  // 布局
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;

  // 背景
  &__background {
    position: absolute;
    inset: 0;
    background: url("@/assets/images/mobile-login-bg.png") no-repeat;
    background-size: 100% auto;
  }

  // 主内容区
  &__content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    min-height: 60%;
    padding: var(--spacing-lg);
    background-color: var(--theme-other_background);
    border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8px);
  }

  // 头部
  &__header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: var(--spacing-xl);
  }

  &__logo {
    width: 50px;
    height: 50px;
    margin-right: var(--spacing-base);
    object-fit: contain;
  }

  &__title {
    margin: 0;
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--theme-theme);
  }

  // 表单
  &__form {
    padding: 0 var(--spacing-base);
  }

  &__form-group {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
  }

  &__submit {
    margin-top: var(--spacing-xl);
  }

  &__button {
    height: 40px;
    font-size: 14px;
    font-weight: 500;
  }

  // 新增记住密码容器样式
  &__remember {
    padding: var(--spacing-sm) var(--spacing-lg);
    border-top: 1px solid #f5f5f5;
  }
}

// Vant 组件样式覆盖
:deep(.van-cell-group--inset) {
  margin: 0;
}

:deep(.van-field) {
  padding: var(--spacing-base);
}

:deep(.van-field__label) {
  width: 4em;
  color: var(--theme-color);
}

:deep(.van-field__left-icon) {
  margin-right: var(--spacing-sm);
}

// 优化记住密码样式
:deep(.remember-checkbox) {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666;

  .van-checkbox__icon {
    font-size: 14px;

    .van-icon {
      border: 1px solid #dcdee0;
      transition: all 0.2s;
    }
  }

  .van-checkbox__label {
    margin-left: 6px;
  }

  &.van-checkbox--checked {
    .van-icon {
      background-color: var(--theme-theme);
      border-color: var(--theme-theme);
    }
  }
}
</style>

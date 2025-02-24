<template>
  <div class="settings">
    <el-card v-if="settingStore.globalSetting" class="setting-card">
      <h2>网络配置</h2>
      <div class="section">
        <div class="form-group">
          <label for="proxyDomain">代理域名:</label>
          <el-input
            id="proxyDomain"
            v-model="settingStore.globalSetting.httpProxyHost"
            class="form-input"
            type="text"
            placeholder="127.0.0.1"
          />
        </div>
        <div class="form-group">
          <label for="proxyPort">代理端口:</label>
          <el-input
            id="proxyPort"
            v-model="settingStore.globalSetting.httpProxyPort"
            class="form-input"
            type="text"
            placeholder="7890"
          />
        </div>
        <div class="form-group">
          <label for="AdminUserCode">管理员注册码:</label>
          <el-input-number
            id="AdminUserCode"
            v-model="settingStore.globalSetting.AdminUserCode"
            class="form-input"
            type="text"
            :controls="false"
            :precision="0"
            placeholder="设置管理员注册码"
          />
        </div>
        <div class="form-group">
          <label for="CommonUserCode">普通用户注册码:</label>
          <el-input-number
            id="CommonUserCode"
            v-model="settingStore.globalSetting.CommonUserCode"
            class="form-input"
            type="text"
            :precision="0"
            :controls="false"
            placeholder="设置普通用户注册码"
          />
        </div>
      </div>
      <div class="section">
        <div class="form-group">
          <label for="isProxyEnabled">启用代理:</label>
          <el-switch v-model="settingStore.globalSetting.isProxyEnabled" @change="saveSettings" />
        </div>
      </div>
    </el-card>
    <el-card class="setting-card">
      <h2>用户配置</h2>
      <div class="section">
        <div class="form-group">
          <label for="cookie115">115网盘Cookie:</label>
          <el-input
            id="cookie115"
            v-model="settingStore.userSettings.cloud115Cookie"
            class="form-input"
            type="text"
          />
        </div>
        <div class="form-group">
          <label for="cookieQuark">夸克网盘Cookie:</label>
          <el-input
            id="cookieQuark"
            v-model="settingStore.userSettings.quarkCookie"
            class="form-input"
            type="text"
          />
        </div>
      </div>
      <div class="user-setting-tips">
        <h3>帮助</h3>
        <div>
          <el-link
            target="_blank"
            href="https://alist.nn.ci/zh/guide/drivers/115.html#cookie%E8%8E%B7%E5%8F%96%E6%96%B9%E5%BC%8F"
            >如何获取115网盘cookie？</el-link
          >
        </div>
        <div>
          <el-link target="_blank" href="https://alist.nn.ci/zh/guide/drivers/quark.html#cookie"
            >如何获取夸克网盘cookie？</el-link
          >
        </div>
      </div>
    </el-card>
    <el-button @click="saveSettings">保存设置</el-button>
  </div>
</template>

<script setup lang="ts">
import { useUserSettingStore } from "@/stores/userSetting";
const settingStore = useUserSettingStore();
settingStore.getSettings();

const saveSettings = () => {
  settingStore.saveSettings();
  // Add your save logic here
};
</script>

<style scoped lang="scss">
.settings {
  padding: 20px;
}
.setting-card {
  margin-bottom: 20px;
  border-radius: 15px;
}

.section {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.form-group {
  margin-bottom: 10px;
  width: 48%;
}
.form-input {
  text-align: left;
  width: 100%;
}
::v-deep .el-input__inner {
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>

<template>
  <div class="settings">
    <el-card v-if="settingStore.globalSetting" class="setting-card">
      <div class="card-title">项目配置</div>
      <div class="section">
        <div class="form-group">
          <label for="proxyDomain">代理ip:</label>
          <el-input
            id="proxyDomain"
            v-model="globalSetting.httpProxyHost"
            class="form-input"
            type="text"
            placeholder="127.0.0.1"
          />
        </div>
        <div class="form-group">
          <label for="proxyPort">代理端口:</label>
          <el-input
            id="proxyPort"
            v-model="globalSetting.httpProxyPort"
            class="form-input"
            type="text"
            placeholder="7890"
          />
        </div>
        <div class="form-group">
          <label for="AdminUserCode">管理员注册码:</label>
          <el-input-number
            id="AdminUserCode"
            v-model="globalSetting.AdminUserCode"
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
            v-model="globalSetting.CommonUserCode"
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
          <el-switch v-model="globalSetting.isProxyEnabled" @change="saveSettings" />
        </div>
      </div>
    </el-card>
    <el-card class="setting-card">
      <div class="card-title">用户配置</div>
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
    <van-button round block type="primary" @click="saveSettings"> 保存设置 </van-button>
  </div>
</template>

<script setup lang="ts">
import { useUserSettingStore } from "@/stores/userSetting";
import { computed } from "vue";
const settingStore = useUserSettingStore();

const globalSetting = computed(
  () =>
    settingStore.globalSetting || {
      httpProxyHost: "127.0.1",
      httpProxyPort: "7890",
      isProxyEnabled: false,
      AdminUserCode: 230713,
      CommonUserCode: 9527,
    }
);

settingStore.getSettings();

const saveSettings = () => {
  settingStore.saveSettings();
  // Add your save logic here
};
</script>

<style scoped lang="scss">
.settings {
  padding: 10px;
}
.setting-card {
  margin-bottom: 20px;
  border-radius: 15px;
  padding: 0px;
}
.card-title {
  font-size: 32px;
}

.section {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  &:last-child {
    margin-bottom: 0;
  }
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

<template>
  <div class="mobile-pc">
    <van-search
      v-model="keyword"
      shape="round"
      show-action
      class="search-input"
      placeholder="请输入搜索关键词或输入链接直接解析"
      @search="handleSearch"
    >
      <template #action>
        <van-icon name="contact-o" @click="logout" />
      </template>
    </van-search>
    <div class="content">
      <router-view />
    </div>
  </div>
  <div v-if="resourcStore.loading" class="page-loading" @touchmove.prevent>
    <van-loading text-color="#fff">资源搜索中...</van-loading>
  </div>
  <van-back-top />

  <van-tabbar route>
    <van-tabbar-item replace to="/resource" icon="search"></van-tabbar-item>
    <van-tabbar-item replace to="/douban" icon="play-circle-o"></van-tabbar-item>
    <van-tabbar-item replace to="/setting" icon="setting"></van-tabbar-item>
  </van-tabbar>
  <!-- <login v-else /> -->
</template>

<script setup lang="ts">
import { useResourceStore } from "@/stores/resource";
// import { useStore } from "@/stores/index";
import { useUserSettingStore } from "@/stores/userSetting";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showConfirmDialog } from "vant";
// const store = useStore();
const route = useRoute();
const router = useRouter();
const resourcStore = useResourceStore();
const settingStore = useUserSettingStore();
settingStore.getSettings();

const keyword = ref("");
const routeKeyword = computed(() => route.query.keyword as string);
const logout = () => {
  showConfirmDialog({
    title: "退出登录",
    message: "是否确定退出登录？",
  }).then(() => {
    // on confirm
    localStorage.removeItem("token");
    router.push({ path: "/login" });
  });
};
const handleSearch = async () => {
  // 如果搜索内容是一个https的链接，则尝试解析链接
  if (keyword.value.startsWith("http")) {
    resourcStore.parsingCloudLink(keyword.value);
    return;
  }
  if (!keyword.value.trim()) {
    return;
  }
  console.log(route.path);
  if (route.path !== "/resource") {
    router.push({ path: "/resource" });
  }
  await resourcStore.searchResources(keyword.value);
};

watch(
  () => routeKeyword.value,
  () => {
    if (routeKeyword.value) {
      console.log("获取路由参数", routeKeyword.value);
      keyword.value = routeKeyword.value;
      handleSearch();
    } else {
      keyword.value = "";
    }
  }
);
</script>

<style scoped lang="scss">
.home-pc {
  // padding: 20px;
  min-width: 1000px;
  height: 100vh;
  overflow: hidden;
  margin: 0 auto;
}
.home-header {
  height: auto;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: rgba(231, 235, 239, 0.7) !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 0 0 5px 5px;
}
.home-main {
  width: 1000px;
  height: 100vh;
  overflow: auto;
}
.home-main-main {
  padding: 10px 15px;
}
.home-aside {
  width: 300px;
}
.search-input {
  background-color: rgba(231, 235, 239, 0.7) !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
.page-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  padding-top: 120px;
  padding-bottom: 100px;
}
</style>

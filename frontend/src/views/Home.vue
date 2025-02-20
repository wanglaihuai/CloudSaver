<template>
  <div class="home" v-loading="resourcStore.loading" element-loading-background="rgba(0,0,0,0.6)">
    <el-container>
      <el-aside width="200px"><aside-menu /></el-aside>
      <el-container class="home-main">
        <el-header :class="{ 'home-header': true, 'search-bar-active': !store.scrollTop }">
          <search-bar />
        </el-header>
        <el-main class="home-main-main">
          <router-view />
        </el-main>
        <!-- <el-aside class="home-aside"></el-aside> -->
      </el-container>
    </el-container>
    <el-backtop :bottom="100">
      <div
        style="
          height: 100%;
          width: 100%;
          background-color: var(--el-bg-color-overlay);
          box-shadow: var(--el-box-shadow-lighter);
          text-align: center;
          line-height: 40px;
          color: #1989fa;
        "
      >
        UP
      </div>
    </el-backtop>
  </div>
  <!-- <login v-else /> -->
</template>

<script setup lang="ts">
  import { useResourceStore } from "@/stores/resource";
  import { useStore } from "@/stores/index";
  import { useUserSettingStore } from "@/stores/userSetting";
  import { onUnmounted } from "vue";
  import AsideMenu from "@/components/AsideMenu.vue";
  import SearchBar from "@/components/SearchBar.vue";

  const resourcStore = useResourceStore();
  const store = useStore();
  const settingStore = useUserSettingStore();
  settingStore.getSettings();
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    if (scrollTop > 50) {
      store.scrollTop && store.setScrollTop(false);
    } else {
      !store.scrollTop && store.setScrollTop(true);
    }
  };
  window.addEventListener("scroll", handleScroll);
  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });
</script>

<style scoped lang="scss">
  .home {
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
    // padding: 0;
    background-color: rgba(231, 235, 239, 0.7) !important;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 0 0 5px 5px;
    // background-color: var(--theme-other_background);
    // box-shadow: 0 4px 10px rgba(225, 225, 225, 0.3);
    // border-radius: 20px;
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
</style>

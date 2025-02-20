<template>
  <div class="search-bar">
    <div class="search-bar__input">
      <input
        v-model="keyword"
        type="text"
        placeholder="请输入搜索关键词或输入链接直接解析"
        class="input-with-select"
        @keyup.enter="handleSearch"
      />
      <el-icon class="search_icon" size="28px" @click="handleSearch"><Search /></el-icon class="search_icon">
    </div>
    <div class="logout" alt="退出登录" @click="logout">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="退出登录"
        placement="bottom"
      >
      <el-icon><SwitchButton class="logout-icon" /></el-icon>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref,watch } from "vue";
  import { useResourceStore } from "@/stores/resource";
  import { useRoute,useRouter } from "vue-router";
  const route = useRoute();
  const router = useRouter();
  const resourcStore = useResourceStore();
  const keyword = ref("");
  const routeKeyword = computed(() => route.query.keyword as string);
  const logout = () => {
    localStorage.removeItem("token");
    router.push({ path: "/login" });
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
    await resourcStore.searchResources(keyword.value);
    if(route.path !== '/'){
      router.push({ path: '/' });
    }
  };

  watch(() => routeKeyword.value, () => {
    if(routeKeyword.value){
      keyword.value = routeKeyword.value;
      handleSearch();
    } else {
      keyword.value = ''
    }
  });


</script>

<style scoped lang="scss">
  .search-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logout{
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 28px;
      margin-left: 15px;
      cursor: pointer;
    }
    .search-bar__input {
      width: 100%;
      margin: 15px auto;
      position: relative;
      background-color: var(--theme-other_background);
      box-shadow: 0 4px 10px rgba(225, 225, 225, 0.3);
      height: 40px;
      border-radius: 40px;
      display: flex;
      align-items: center;
    }
    .input-with-select {
      width: 100%;
      height: 100%;
      background: none;
      padding-left: 24px;
      box-sizing: border-box;
      border-radius: 40px;
      line-height: 100%;
      border: unset;
      font-size: 18px;
    }
    .search_icon {
      width: 64px;
      height: 64px;
      cursor: pointer;
    }
    .search-bar_tips{
      width: 100%;
      text-align: center;
      margin: 20px auto;
    }
  }

  .search-new {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .switch-source {
    margin-left: 20px;
  }
  .switch-source .label {
    margin-left: 5px;
  }
  .display-style {
    margin-left: 20px;
  }
</style>

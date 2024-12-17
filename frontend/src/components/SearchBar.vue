<template>
  <div class="search-bar">
    <el-input
      v-model="keyword"
      placeholder="请输入搜索关键词与输入链接直接解析"
      class="input-with-select"
      @keyup.enter="handleSearch"
      style="margin-bottom: 8px"
    >
      <template #append>
        <el-button type="success" @click="handleSearch">{{ searchBtnText }}</el-button>
      </template>
    </el-input>
    <el-alert
      title="可直接输入链接进行资源解析，也可进行资源搜索！"
      type="info"
      show-icon
      :closable="false"
    />
    <div class="search-new">
      <el-button type="primary" @click="handleSearchNew">最新资源</el-button>
      <div class="switch-source">
        <el-switch v-model="backupPlan" /><span class="label">使用rsshub(较慢)</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { effect, ref } from "vue";
  import { useResourceStore } from "@/stores/resource";

  const keyword = ref("");
  const backupPlan = ref(false);
  const store = useResourceStore();
  const searchBtnText = ref("搜索");

  effect(() => {
    // 监听搜索关键词的变化，如果存在，则自动触发搜索
    if (keyword.value && keyword.value.startsWith("http")) {
      searchBtnText.value = "解析";
    } else {
      searchBtnText.value = "搜索";
    }
  });

  const handleSearch = async () => {
    // 如果搜索内容是一个https的链接，则尝试解析链接
    if (keyword.value.startsWith("http")) {
      store.parsingCloudLink(keyword.value);
      return;
    }
    if (!keyword.value.trim()) {
      return;
    }
    await store.searchResources(keyword.value, backupPlan.value);
  };

  const handleSearchNew = async () => {
    keyword.value = "";
    await store.searchResources("", backupPlan.value);
  };
</script>

<style scoped>
  .search-bar {
    padding: 20px;
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
</style>

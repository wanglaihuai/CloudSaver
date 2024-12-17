<template>
  <div class="home">
    <search-bar />
    <resource-list />
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
</template>

<script setup lang="ts">
  import SearchBar from "@/components/SearchBar.vue";
  import ResourceList from "@/components/ResourceList.vue";
</script>

<style scoped>
  .home {
    padding: 20px;
  }
</style>

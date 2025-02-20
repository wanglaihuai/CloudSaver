<template>
  <div class="resource-list">
    <div :class="{ 'resource-list__header': true }">
      <div class="header_left">
        <div class="refresh_btn" @click="refreshResources">
          <el-icon class="type_icon" size="20px"><Refresh /></el-icon>最新资源<span
            class="item-count"
            >(上次刷新时间：{{ resourceStore.lastUpdateTime }})</span
          >
        </div>
      </div>
      <div class="header_right">
        <el-icon
          class="type_icon"
          v-if="userStore.displayStyle === 'card'"
          @click="setDisplayStyle('table')"
          ><Menu
        /></el-icon>
        <el-icon v-else class="type_icon" @click="setDisplayStyle('card')"><Fold /></el-icon>
      </div>
    </div>
    <ResourceTable
      @loadMore="handleLoadMore"
      @searchMovieforTag="searchMovieforTag"
      @save="handleSave"
      v-if="userStore.displayStyle === 'table'"
    ></ResourceTable>
    <ResourceCard
      @loadMore="handleLoadMore"
      @searchMovieforTag="searchMovieforTag"
      @save="handleSave"
      v-else
    ></ResourceCard>
    <el-empty v-if="resourceStore.resources.length === 0" :image-size="200" />
    <el-dialog v-model="folderDialogVisible" title="选择保存目录" v-if="currentResource">
      <template #header="{ titleId }">
        <div class="my-header">
          <div :id="titleId">
            <el-tag
              :type="resourceStore.tagColor[currentResource.cloudType as keyof TagColor]"
              effect="dark"
              round
            >
              {{ currentResource.cloudType }}
            </el-tag>
            选择保存目录
          </div>
        </div>
      </template>
      <folder-select
        v-if="folderDialogVisible"
        @select="handleFolderSelect"
        @close="folderDialogVisible = false"
        :cloudType="currentResource.cloudType"
      />
      <div class="dialog-footer">
        <el-button @click="folderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveBtnClick">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { useResourceStore } from "@/stores/resource";
  import { useUserSettingStore } from "@/stores/userSetting";
  import FolderSelect from "@/components/Home/FolderSelect.vue";
  import ResourceTable from "@/components/Home/ResourceTable.vue";
  import type { ResourceItem, TagColor } from "@/types";
  import ResourceCard from "@/components/Home/ResourceCard.vue";
  import { useRouter } from "vue-router";
  const router = useRouter();

  const resourceStore = useResourceStore();
  const userStore = useUserSettingStore();
  const folderDialogVisible = ref(false);
  const currentResource = ref<ResourceItem | null>(null);
  const currentFolderId = ref<string | null>(null);

  const refreshResources = async () => {
    resourceStore.searchResources("", false);
  };

  const handleSave = (resource: ResourceItem) => {
    currentResource.value = resource;
    folderDialogVisible.value = true;
  };

  const handleFolderSelect = async (folderId: string) => {
    if (!currentResource.value) return;
    currentFolderId.value = folderId;
  };

  const handleSaveBtnClick = async () => {
    if (!currentResource.value || !currentFolderId.value) return;
    folderDialogVisible.value = false;
    await resourceStore.saveResource(currentResource.value, currentFolderId.value);
  };
  const setDisplayStyle = (style: string) => {
    console.log(userStore);
    userStore.setDisplayStyle(style as "card" | "table");
  };
  // 添加加载更多处理函数
  const handleLoadMore = (channelId: string) => {
    resourceStore.searchResources("", true, channelId);
  };

  const searchMovieforTag = (tag: string) => {
    console.log("iiii");
    router.push({ path: "/", query: { keyword: tag } });
  };
</script>

<style scoped>
  .resource-list {
    /* margin-top: 20px; */
    position: relative;
  }
  .resource-list__header {
    height: 48px;
    background-color: var(--theme-other_background);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    box-sizing: border-box;
    border-radius: 15px;
    padding: 0 15px;
  }
  .header_right {
    cursor: pointer;
  }
  .type_icon {
    width: 48px;
    height: 48px;
    size: 48px;
  }
  .refresh_btn {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .item-count {
      color: #909399;
      font-size: 0.9em;
    }
  }

  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .group-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .item-count {
    color: #909399;
    font-size: 0.9em;
  }

  :deep(.el-table__expand-column) {
    .cell {
      padding: 0 !important;
    }
  }

  :deep(.el-table__expanded-cell) {
    padding: 20px !important;
  }

  :deep(.el-table__expand-icon) {
    height: 23px;
    line-height: 23px;
  }
  .load-more {
    display: flex;
    justify-content: center;
    padding: 16px 0;
  }
</style>

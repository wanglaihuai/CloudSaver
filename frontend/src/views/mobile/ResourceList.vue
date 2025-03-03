<template>
  <div ref="content" class="resource-list">
    <div :class="{ 'resource-list__header': true }">
      <div class="header_left">
        <div class="refresh_btn" @click="refreshResources">
          <el-icon class="type_icon" size="20px"><Refresh /></el-icon>最新资源<span
            class="item-count"
            >(上次刷新时间：{{ resourceStore.lastUpdateTime }})</span
          >
        </div>
      </div>
    </div>
    <van-tabs v-model:active="currentTab">
      <van-tab
        v-for="item in resourceStore.resources"
        :key="item.id"
        :name="item.id"
        :title="item.channelInfo.name"
      >
        <ResourceCard
          :current-channel-id="currentTab"
          @save="handleSave"
          @search-moviefor-tag="searchMovieforTag"
        />
      </van-tab>
    </van-tabs>
    <el-dialog
      v-if="currentResource"
      v-model="saveDialogVisible"
      width="100%"
      :title="saveDialogMap[saveDialogStep].title"
    >
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
            {{ saveDialogMap[saveDialogStep].title }}
            <span
              v-if="resourceStore.shareInfo.fileSize && saveDialogStep === 1"
              style="font-weight: bold"
            >
              ({{ formattedFileSize(resourceStore.shareInfo.fileSize || 0) }})
            </span>
          </div>
        </div>
      </template>
      <div v-loading="resourceStore.loadTree">
        <resource-select
          v-if="saveDialogVisible && saveDialogStep === 1"
          :cloud-type="currentResource.cloudType"
        />
        <folder-select
          v-if="saveDialogVisible && saveDialogStep === 2"
          :cloud-type="currentResource.cloudType"
          @select="handleFolderSelect"
          @close="saveDialogVisible = false"
        />
      </div>

      <div class="dialog-footer">
        <el-button @click="saveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmClick">{{
          saveDialogMap[saveDialogStep].buttonText
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useResourceStore } from "@/stores/resource";
// import { useUserSettingStore } from "@/stores/userSetting";
import FolderSelect from "@/components/mobile/FolderSelect.vue";
import ResourceSelect from "@/components/mobile/ResourceSelect.vue";
import { formattedFileSize } from "@/utils/index";
import type { ResourceItem, TagColor } from "@/types";

import ResourceCard from "@/components/mobile/ResourceCard.vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();
const resourceStore = useResourceStore();
// const userStore = useUserSettingStore();
const saveDialogVisible = ref(false);
const currentResource = ref<ResourceItem | null>(null);
const currentFolderId = ref<string | null>(null);
const saveDialogStep = ref<1 | 2>(1);
const currentTab = ref<string>("");

watch(
  () => resourceStore.resources,
  () => {
    if (resourceStore.resources.length > 0) {
      currentTab.value = resourceStore.resources[0].id;
    }
  }
);

const refreshResources = async () => {
  resourceStore.searchResources("", false);
};

const saveDialogMap = {
  1: {
    title: "选择资源",
    buttonText: "下一步",
  },
  2: {
    title: "选择保存目录",
    buttonText: "保存",
  },
};

const handleSave = async (resource: ResourceItem) => {
  currentResource.value = resource;
  saveDialogVisible.value = true;
  saveDialogStep.value = 1;
  if (!(await resourceStore.getResourceListAndSelect(currentResource.value))) {
    saveDialogVisible.value = false;
  }
};

const handleFolderSelect = async (folderId: string) => {
  if (!currentResource.value) return;
  currentFolderId.value = folderId;
};

const handleConfirmClick = async () => {
  if (saveDialogStep.value === 1) {
    if (resourceStore.resourceSelect.length === 0) {
      ElMessage.warning("请选择要保存的资源");
      return;
    }
    saveDialogStep.value = 2;
  } else {
    handleSaveBtnClick();
  }
};

const handleSaveBtnClick = async () => {
  if (!currentResource.value || !currentFolderId.value) return;
  saveDialogVisible.value = false;
  await resourceStore.saveResource(currentResource.value, currentFolderId.value);
};
// 添加加载更多处理函数
const handleLoadMore = (channelId: string) => {
  resourceStore.searchResources("", true, channelId);
};

const searchMovieforTag = (tag: string) => {
  router.push({ path: "/resource", query: { keyword: tag } });
};

const doScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight; // 可滚动区域的高
  const scrollTop = document.documentElement.scrollTop; // 已经滚动区域的高
  const clientHeight = document.documentElement.clientHeight; // 可视区高度
  if (clientHeight + scrollTop >= scrollHeight) {
    handleLoadMore(currentTab.value);
  }
};

onMounted(() => {
  window.addEventListener("scroll", doScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", doScroll);
});
</script>

<style scoped>
.resource-list {
  position: relative;
}
.resource-list__header {
  height: 52px;
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
.refresh_btn {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 15px;
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

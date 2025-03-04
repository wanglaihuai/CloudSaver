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
    <van-popup
      v-if="currentResource"
      v-model:show="saveDialogVisible"
      round
      closeable
      position="bottom"
      :style="{ height: '80%' }"
      ><div class="my-header">
        <el-tag
          :type="resourceStore.tagColor[currentResource.cloudType as keyof TagColor]"
          effect="dark"
          round
        >
          {{ currentResource.cloudType }}
        </el-tag>
        <span>{{ saveDialogMap[saveDialogStep].title }}</span>
        <span
          v-if="resourceStore.shareInfo.fileSize && saveDialogStep === 1"
          style="font-weight: bold"
        >
          ({{ formattedFileSize(resourceStore.shareInfo.fileSize || 0) }})
        </span>
      </div>
      <div v-loading="resourceStore.loadTree" class="popup-content">
        <resource-select
          v-if="saveDialogVisible && saveDialogStep === 1 && resourceStore.resourceSelect.length"
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
        <div class="save-floder-show">
          <span>保存至</span>
          <div class="save-floder">
            <van-icon name="notes-o" /><span>{{
              currentFolderPath ? currentFolderPath[currentFolderPath.length - 1]?.name : "待选择"
            }}</span>
          </div>
        </div>
        <!-- <van-button class="btn" round @click="saveDialogVisible = false"> 取消 </van-button> -->
        <van-button class="btn" round type="primary" @click="handleConfirmClick">
          {{ saveDialogMap[saveDialogStep].buttonText }}
        </van-button>
      </div></van-popup
    >
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useResourceStore } from "@/stores/resource";
// import { useUserSettingStore } from "@/stores/userSetting";
import FolderSelect from "@/components/mobile/FolderSelect.vue";
import ResourceSelect from "@/components/mobile/ResourceSelect.vue";
import { formattedFileSize } from "@/utils/index";
import type { Folder, ResourceItem, TagColor } from "@/types";

import ResourceCard from "@/components/mobile/ResourceCard.vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();
const resourceStore = useResourceStore();
// const userStore = useUserSettingStore();
const saveDialogVisible = ref(false);
const currentResource = ref<ResourceItem | null>(null);
const currentFolderId = ref<string | null>(null);
const currentFolderPath = ref<null | Folder[]>(null);
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

const handleFolderSelect = async (folders: Folder[]) => {
  if (!currentResource.value) return;
  currentFolderPath.value = folders;
  currentFolderId.value = folders[folders.length - 1]?.cid || "0";
};

const handleConfirmClick = async () => {
  if (saveDialogStep.value === 1) {
    if (!resourceStore.resourceSelect.some((x) => x.isChecked)) {
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
.my-header {
  height: 100px;
  width: 100%;
  border-bottom: 1px solid #ececec;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  padding: 0 25px;
  font-size: 30px;
  span {
    margin-left: 5px;
  }
}
.popup-content {
  height: calc(100% - 200px);
  width: 100%;
  overflow: auto;
  padding: 25px;
  box-sizing: border-box;
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
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 15px 25px;
  box-sizing: border-box;
  height: 100px;
  .btn {
    width: 150px;
    height: 60px;
  }
  .save-floder-show {
    width: 360px;
    display: flex;
    align-items: center;
    span {
      font-weight: bold;
      margin-right: 10px;
    }
    .save-floder {
      width: 280px;
      height: 40px;
      padding: 0 10px;
      box-sizing: border-box;
      display: inline-flexbox;
      align-items: center;
      justify-content: flex-start;
      line-height: 40px;
      border-radius: 5px;
      background-color: #ececec;
      font-size: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        margin-left: 5px;
        font-weight: unset;
      }
    }
    /* width: ; */
  }
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

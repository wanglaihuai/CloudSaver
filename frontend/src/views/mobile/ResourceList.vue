<template>
  <div class="resource-list">
    <!-- 头部刷新区 -->
    <div class="resource-list__header">
      <van-cell center @click="refreshResources">
        <template #title>
          <div class="header__title">
            <van-icon name="replay" size="18" />
            <span class="title__text">最新资源</span>
            <span class="title__time">上次刷新：{{ resourceStore.lastUpdateTime }}</span>
          </div>
        </template>
      </van-cell>
    </div>

    <!-- 资源列表 -->
    <van-tabs v-model:active="currentTab" sticky swipeable animated>
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

    <!-- 保存弹窗 -->
    <van-popup
      v-model:show="saveDialogVisible"
      round
      closeable
      position="bottom"
      :style="{ height: '80%' }"
    >
      <!-- 弹窗头部 -->
      <div class="popup__header">
        <van-tag :color="getTagColor(currentResource?.cloudType)" round>
          {{ currentResource?.cloudType }}
        </van-tag>
        <span class="header__title">{{ saveDialogMap[saveDialogStep].title }}</span>
        <span v-if="resourceStore.shareInfo.fileSize && saveDialogStep === 1" class="header__size">
          {{ formattedFileSize(resourceStore.shareInfo.fileSize) }}
        </span>
      </div>

      <!-- 弹窗内容 -->
      <div class="popup__content">
        <van-loading v-if="resourceStore.loadTree" vertical>加载中...</van-loading>

        <resource-select
          v-if="saveDialogVisible && saveDialogStep === 1 && resourceStore.resourceSelect.length"
          :cloud-type="currentResource?.cloudType"
        />

        <folder-select
          v-if="saveDialogVisible && saveDialogStep === 2 && currentResource"
          :cloud-type="currentResource.cloudType"
          @select="handleFolderSelect"
          @close="saveDialogVisible = false"
        />
      </div>

      <!-- 弹窗底部 -->
      <div class="popup__footer">
        <div class="footer__path">
          <span class="path__label">保存至</span>
          <div class="path__value">
            <van-icon name="notes-o" />
            <span>{{ getCurrentFolderName }}</span>
          </div>
        </div>
        <van-button round type="primary" block @click="handleConfirmClick">
          {{ saveDialogMap[saveDialogStep].buttonText }}
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { useResourceStore } from "@/stores/resource";
import { formattedFileSize } from "@/utils/index";
import type { Folder, ResourceItem } from "@/types";
import FolderSelect from "@/components/mobile/FolderSelect.vue";
import ResourceSelect from "@/components/mobile/ResourceSelect.vue";
import ResourceCard from "@/components/mobile/ResourceCard.vue";

// 状态管理
const router = useRouter();
const resourceStore = useResourceStore();

// 响应式数据
const saveDialogVisible = ref(false);
const currentResource = ref<ResourceItem | null>(null);
const currentFolderId = ref<string | null>(null);
const currentFolderPath = ref<Folder[] | null>(null);
const saveDialogStep = ref<1 | 2>(1);
const currentTab = ref<string>("");

// 计算属性
const getCurrentFolderName = computed(() => {
  return currentFolderPath.value
    ? currentFolderPath.value[currentFolderPath.value.length - 1]?.name
    : "待选择";
});

// 常量定义
const saveDialogMap = {
  1: { title: "选择资源", buttonText: "下一步" },
  2: { title: "选择保存目录", buttonText: "保存" },
};

// 标签颜色映射
const getTagColor = (type?: string) => {
  const colorMap: Record<string, string> = {
    pan115: "#07c160",
    quark: "#1989fa",
  };
  return colorMap[type || ""] || "#ff976a";
};

// 监听器
watch(
  () => resourceStore.resources,
  () => {
    if (resourceStore.resources.length > 0) {
      currentTab.value = resourceStore.resources[0].id;
    }
  }
);

// 方法定义
const refreshResources = () => {
  resourceStore.searchResources("", false);
};

const handleSave = async (resource: ResourceItem) => {
  currentResource.value = resource;
  saveDialogVisible.value = true;
  saveDialogStep.value = 1;

  if (!(await resourceStore.getResourceListAndSelect(resource))) {
    saveDialogVisible.value = false;
  }
};

const handleFolderSelect = (folders: Folder[]) => {
  if (!currentResource.value) return;
  currentFolderPath.value = folders;
  currentFolderId.value = folders[folders.length - 1]?.cid || "0";
};

const handleConfirmClick = async () => {
  if (saveDialogStep.value === 1) {
    if (!resourceStore.resourceSelect.some((x) => x.isChecked)) {
      showToast("请选择要保存的资源");
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

const handleLoadMore = (channelId: string) => {
  resourceStore.searchResources("", true, channelId);
};

const searchMovieforTag = (tag: string) => {
  router.push({ path: "/resource", query: { keyword: tag } });
};

// 滚动加载
const doScroll = () => {
  const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
  if (clientHeight + scrollTop >= scrollHeight - 50) {
    handleLoadMore(currentTab.value);
  }
};

// 生命周期
onMounted(() => {
  window.addEventListener("scroll", doScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", doScroll);
});
</script>

<style lang="scss" scoped>
.resource-list {
  &__header {
    margin-bottom: var(--spacing-base);

    .header__title {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: 14px;

      .title__text {
        font-weight: 500;
      }

      .title__time {
        color: var(--van-gray-6);
        font-size: 12px;
      }
    }
  }
}

.popup {
  &__header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--van-gray-3);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);

    .header__title {
      font-size: 16px;
      font-weight: 500;
    }

    .header__size {
      color: var(--van-gray-6);
      font-size: 14px;
    }
  }

  &__content {
    height: calc(100% - 140px);
    padding: var(--spacing-base);
    overflow-y: auto;

    .van-loading {
      margin: var(--spacing-xl) auto;
    }
  }

  &__footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: var(--spacing-base);
    background: var(--theme-other_background);
    border-top: 1px solid var(--van-gray-3);

    .footer__path {
      margin-bottom: var(--spacing-base);

      .path__label {
        font-size: 14px;
        margin-right: var(--spacing-xs);
      }

      .path__value {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-xs) var(--spacing-sm);
        background: var(--van-gray-2);
        border-radius: var(--border-radius-sm);
        font-size: 14px;
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .van-button {
      height: 40px;
      font-size: 14px;
    }
  }
}
</style>

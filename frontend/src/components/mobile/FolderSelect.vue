<template>
  <div class="folder-select">
    <div class="folder-select-header">
      当前位置：<el-icon style="margin: 0 5px"><Folder /></el-icon>
      <span
        v-for="(path, index) in currentFolderPath"
        :key="path.cid"
        class="path-item"
        @click="handleFolderClick(path, index)"
      >
        {{ path.name }}
        <span v-if="index !== currentFolderPath.length - 1" class="path-separator">></span>
      </span>
    </div>
    <div class="folder-item-list">
      <div v-for="item in folders" :key="item.cid" class="folder-item" @click="getList(item)">
        <span class="folder-node">
          <el-icon><Folder /></el-icon>
          {{ item.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from "vue";
import { cloud115Api } from "@/api/cloud115";
import { quarkApi } from "@/api/quark";
import type { Folder } from "@/types";
import { type RequestResult } from "@/types/response";
import { useResourceStore } from "@/stores/resource";

const resourceStore = useResourceStore();
import { ElMessage } from "element-plus";

const props = defineProps({
  cloudType: {
    type: String,
    required: true,
  },
});

const folders = ref<Folder[]>([]);
const currentFolderPath = ref<Folder[]>([]);
const emit = defineEmits<{
  (e: "select", currentFolderPath: Folder[]): void;
  (e: "close"): void;
}>();

const cloudTypeApiMap = {
  pan115: cloud115Api,
  quark: quarkApi,
};

const handleFolderClick = (folder: Folder, index: number) => {
  const current = { ...folder };
  currentFolderPath.value = currentFolderPath.value.slice(0, index);
  getList(current);
};

watch(
  () => currentFolderPath.value,
  () => {
    emit("select", currentFolderPath.value);
  },
  { deep: true } // 添加深度监听
);

const getList = async (data?: Folder) => {
  const api = cloudTypeApiMap[props.cloudType as keyof typeof cloudTypeApiMap];
  try {
    let res: RequestResult<Folder[]> = { code: 0, data: [] as Folder[], message: "" };
    resourceStore.setLoadTree(true);
    if (api.getFolderList) {
      // 使用类型保护检查方法是否存在
      res = await api.getFolderList(data?.cid || "0");
    }
    if (res?.code === 0) {
      folders.value = res.data.length ? res.data : [];
      currentFolderPath.value.push(
        data || {
          name: "根目录",
          cid: "0",
        }
      );
    } else {
      throw new Error(res.message);
    }
    resourceStore.setLoadTree(false);
  } catch (error) {
    ElMessage.error(error instanceof Error ? `${error.message}` : "获取目录失败");
    // 关闭模态框
    emit("close");
    resourceStore.setLoadTree(false);
    folders.value = [];
  }
};

getList();
</script>

<style scoped lang="scss">
@import "@/styles/responsive.scss";

.folder-select {
  position: relative;
  padding-top: var(--spacing-xl);

  &-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: var(--font-size-base);
    padding: var(--spacing-sm) var(--spacing-base);
    border: 1px solid #e5e6e8;
    border-radius: var(--border-radius-base);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    box-sizing: border-box;
  }
}

.folder-item {
  font-size: var(--font-size-lg);
  display: flex;
  align-items: center;
  padding: var(--spacing-base) var(--spacing-sm);
  border-bottom: 1px dashed #ececec;

  .folder-node {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
}

.path-item {
  cursor: pointer;
  &:hover {
    color: var(--theme-theme);
  }
}

.path-separator {
  margin: 0 var(--spacing-xs);
}
</style>

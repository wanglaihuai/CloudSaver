<template>
  <div class="folder-select">
    <div class="folder-select-header">
      当前位置：<el-icon style="margin: 0 5px"><Folder /></el-icon
      >{{ selectedFolder?.path?.map((x: Folder) => x.name).join("/") }}
    </div>
    <el-tree
      ref="treeRef"
      :data="folders"
      :props="defaultProps"
      node-key="cid"
      :load="loadNode"
      lazy
      highlight-current
      @node-click="handleNodeClick"
    >
      <template #default="{ node }">
        <span class="folder-node">
          <el-icon><Folder /></el-icon>
          {{ node.label }}
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import { cloud115Api } from "@/api/cloud115";
import { quarkApi } from "@/api/quark";
import type { TreeInstance } from "element-plus";
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

const treeRef = ref<TreeInstance>();
const folders = ref<Folder[]>([]);
const selectedFolder = ref<Folder | null>(null);
const emit = defineEmits<{
  (e: "select", folderId: string): void;
  (e: "close"): void;
}>();

const defaultProps = {
  label: "name",
  children: "children",
  isLeaf: "leaf",
};

const cloudTypeApiMap = {
  pan115: cloud115Api,
  quark: quarkApi,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadNode = async (node: any, resolve: (list: Folder[]) => void) => {
  const api = cloudTypeApiMap[props.cloudType as keyof typeof cloudTypeApiMap];
  try {
    let res: RequestResult<Folder[]> = { code: 0, data: [] as Folder[], message: "" };
    resourceStore.setLoadTree(true);
    if (node.level === 0) {
      if (api.getFolderList) {
        // 使用类型保护检查方法是否存在
        res = await api.getFolderList();
      }
    } else {
      if (api.getFolderList) {
        // 使用类型保护检查方法是否存在
        res = await api.getFolderList(node.data.cid);
      }
    }
    if (res?.code === 0) {
      resolve(res.data.length ? res.data : []);
    } else {
      throw new Error(res.message);
    }
    resourceStore.setLoadTree(false);
  } catch (error) {
    ElMessage.error(error instanceof Error ? `${error.message}` : "获取目录失败");
    // 关闭模态框
    emit("close");
    resourceStore.setLoadTree(false);
    resolve([]);
  }
};

const handleNodeClick = (data: Folder) => {
  selectedFolder.value = {
    ...data,
    path: data.path ? [...data.path, data] : [data],
  };
  emit("select", data.cid);
};
</script>

<style scoped>
.folder-select {
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
}

.folder-node {
  display: flex;
  align-items: center;
  gap: 8px;
}

.folder-path {
  color: #999;
  font-size: 12px;
  margin-left: 8px;
}

:deep(.el-tree-node__content) {
  height: 32px;
}
.folder-select-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
  font-size: 14px;
  padding: 5px 10px;
  border: 1px solid #e5e6e8;
  border-radius: 8px;
}
</style>

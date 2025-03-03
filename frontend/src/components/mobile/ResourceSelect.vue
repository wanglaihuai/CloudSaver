<template>
  <div class="folder-select">
    <el-tree
      ref="treeRef"
      :data="resourceStore.shareInfo.list"
      :props="defaultProps"
      :default-checked-keys="resourceStore.shareInfo.list?.map((x) => x.fileId) || []"
      node-key="fileId"
      show-checkbox
      highlight-current
      @check-change="handleCheckChange"
    >
      <template #default="{ node }">
        <span class="folder-node">
          <el-icon><Folder /></el-icon>
          {{ node.data.fileName }}
          <span v-if="node.data.fileSize" style="font-weight: bold"
            >({{ formattedFileSize(node.data.fileSize) }})</span
          >
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useResourceStore } from "@/stores/resource";
import { formattedFileSize } from "@/utils/index";
import type { ShareInfo } from "@/types";

const resourceStore = useResourceStore();
const selectedResource = ref<ShareInfo[]>([]);

const defaultProps = {
  isLeaf: "leaf",
};

const handleCheckChange = (data: ShareInfo) => {
  selectedResource.value = [...resourceStore.resourceSelect, ...selectedResource.value];
  if (selectedResource.value.findIndex((x) => x.fileId === data.fileId) === -1) {
    selectedResource.value.push(data);
  } else {
    selectedResource.value = selectedResource.value.filter((x) => x.fileId !== data.fileId);
  }
  resourceStore.setSelectedResource(selectedResource.value);
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

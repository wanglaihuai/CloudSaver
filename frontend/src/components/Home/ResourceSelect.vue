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
import { useResourceStore } from "@/stores/resource";
import { formattedFileSize } from "@/utils/index";
import type { ShareInfo } from "@/types";

const resourceStore = useResourceStore();

const defaultProps = {
  isLeaf: "leaf",
};

const handleCheckChange = (data: ShareInfo) => {
  let resourceSelect = [...resourceStore.resourceSelect];
  resourceSelect.forEach((x) => {
    if (x.fileId === data.fileId) x.isChecked = !x.isChecked;
  });
  resourceStore.setSelectedResource(resourceSelect);
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

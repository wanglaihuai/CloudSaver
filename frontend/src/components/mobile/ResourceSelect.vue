<template>
  <div class="folder-select">
    <van-checkbox-group v-model="selectedResourceIds" @change="handleCheckChange">
      <div v-for="item in resourceStore.shareInfo.list" :key="item.fileId" class="folder-item">
        <div class="folder-item-left">
          <span class="folder-node">
            <el-icon><Folder /></el-icon>
            <div class="folder-node-name">
              {{ item.fileName }}
              <span v-if="item.fileSize" style="font-weight: bold"
                >({{ formattedFileSize(item.fileSize) }})</span
              >
            </div>
          </span>
        </div>
        <div class="folder-item-right">
          <van-checkbox :name="item.fileId"></van-checkbox>
        </div>
      </div>
    </van-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useResourceStore } from "@/stores/resource";
import { formattedFileSize } from "@/utils/index";

const resourceStore = useResourceStore();
const selectedResourceIds = ref<string[]>();
selectedResourceIds.value = resourceStore.resourceSelect.map((x) => x.fileId);

const handleCheckChange = (Ids: string[]) => {
  const newResourceSelect = [...resourceStore.resourceSelect];
  newResourceSelect.forEach((x) => {
    x.isChecked = Ids.includes(x.fileId);
  });
  resourceStore.setSelectedResource(newResourceSelect);
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
.folder-item {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px dashed #ececec;
  padding: 15px 0;
}
.folder-item-left {
  width: 80%;
}
</style>

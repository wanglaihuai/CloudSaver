<template>
  <div class="resource-select">
    <van-checkbox-group v-model="selectedResourceIds" @change="handleCheckChange">
      <div v-for="item in resourceStore.shareInfo.list" :key="item.fileId" class="resource-item">
        <div class="resource-item-left">
          <span class="resource-node">
            <el-icon><Folder /></el-icon>
            <div class="resource-name">
              {{ item.fileName }}
              <span v-if="item.fileSize" class="file-size">
                ({{ formattedFileSize(item.fileSize) }})
              </span>
            </div>
          </span>
        </div>
        <div class="resource-item-right">
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

<style scoped lang="scss">
@import "@/styles/responsive.scss";

.resource-select {
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
  padding: var(--spacing-base);
}

.resource-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-base) 0;
  border-bottom: 1px dashed #ececec;

  &-left {
    flex: 1;
    margin-right: var(--spacing-base);
  }
}

.resource-node {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-lg);
}

.resource-name {
  word-break: break-all;
}

.file-size {
  font-size: var(--font-size-sm);
  color: #999;
  margin-left: var(--spacing-xs);
}
</style>

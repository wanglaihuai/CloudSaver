<template>
  <div class="resource-list">
    <el-table
      v-loading="store.loading"
      :data="groupedResources"
      style="width: 100%"
      row-key="id"
      :default-expand-all="true"
    >
      <el-table-column type="expand">
        <template #default="props">
          <el-table :data="props.row.items" style="width: 100%">
            <el-table-column label="图片" width="90">
              <template #default="{ row }">
                <el-image
                  v-if="row.image"
                  :src="row.image"
                  :preview-src-list="[row.image]"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  :initial-index="4"
                  preview-teleported
                  :z-index="999"
                  fit="cover"
                  width="60"
                  height="90"
                />
                <el-icon v-else size="20"><Close /></el-icon>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" width="180" />
            <el-table-column label="地址">
              <template #default="{ row }">
                <el-link :href="row.cloudLinks[0]" target="_blank">
                  {{ row.cloudLinks[0] }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column label="云盘类型" width="120">
              <template #default="{ row }">
                <el-tag
                  :type="tagColor[row.cloudType as keyof typeof tagColor]"
                  effect="dark"
                  round
                >
                  {{ row.cloudType }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default="{ row }">
                <el-button @click="handleSave(row)">转存</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="props.row.hasMore" class="load-more">
            <el-button :loading="props.row.loading" @click="handleLoadMore(props.row.channel)">
              加载更多
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="来源" prop="channel">
        <template #default="{ row }">
          <div class="group-header">
            <span>{{ row.channel }}</span>
            <span class="item-count">({{ row.items.length }})</span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="folderDialogVisible" title="选择保存目录" v-if="currentResource">
      <template #header="{ titleId }">
        <div class="my-header">
          <div :id="titleId">
            <el-tag
              :type="tagColor[currentResource.cloudType as keyof typeof tagColor]"
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
  import { ref, computed } from "vue";
  import { useResourceStore } from "@/stores/resource";
  import FolderSelect from "./FolderSelect.vue";
  import type { Resource } from "@/types";

  const tagColor = {
    baiduPan: "primary",
    weiyun: "info",
    aliyun: "warning",
    pan115: "danger",
    quark: "success",
  };

  const store = useResourceStore();
  const folderDialogVisible = ref(false);
  const currentResource = ref<Resource | null>(null);
  const currentFolderId = ref<string | null>(null);

  // 按来源分组的数据
  const groupedResources = computed(() => {
    const groups = store.resources.reduce(
      (acc, curr) => {
        const channel = curr.channel;
        const channelId = curr.channelId;
        if (!acc[channel]) {
          acc[channel] = {
            channel,
            items: [],
            hasMore: true,
            loading: false, // 添加 loading 状态
            id: channelId || "", // 用于row-key
          };
        }
        acc[channel].items.push(curr);
        return acc;
      },
      {} as Record<
        string,
        { channel: string; items: Resource[]; id: string; hasMore: boolean; loading: boolean }
      >
    );

    return Object.values(groups);
  });

  const handleSave = (resource: Resource) => {
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
    await store.saveResource(currentResource.value, currentFolderId.value);
  };

  // 添加加载更多处理函数
  const handleLoadMore = async (channel: string) => {
    const group = groupedResources.value.find((g) => g.channel === channel);
    if (!group || group.loading) return;

    group.loading = true;
    try {
      const lastMessageId = group.items[group.items.length - 1].messageId;
      store.searchResources("", false, true, group.id, lastMessageId);
    } finally {
      group.loading = false;
    }
  };
</script>

<style scoped>
  .resource-list {
    margin-top: 20px;
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

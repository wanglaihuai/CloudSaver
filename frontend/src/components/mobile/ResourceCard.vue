<template>
  <div class="resource-card-list">
    <div v-for="item in dataList" :key="item.id" class="resource-card-list__item">
      <div class="resource-card-content-box">
        <div class="resource-card-left">
          <van-image
            width="100"
            class="resource-card-image"
            lazy-load
            fit="contain"
            :src="`/tele-images/?url=${encodeURIComponent(item.image as string)}`"
          />
        </div>
        <div class="resource-card-right">
          <div class="resource-card-title" @click="openUrl(item.cloudLinks[0])">
            {{ item.title }}
          </div>
          <div class="resource-card-content" v-html="item.content"></div>
          <div v-if="item.tags && item.tags.length" class="resource-card-tags">
            <van-tag
              v-for="tag in item.tags"
              :key="tag"
              type="primary"
              class="item-tag"
              @click="searchMovieforTag(tag)"
              >{{ tag }}</van-tag
            >
          </div>
        </div>
      </div>
      <div class="resource-card-footer">
        <el-tag :type="store.tagColor[item.cloudType as keyof TagColor]" effect="dark" round>
          {{ item.cloudType }}
        </el-tag>
        <van-button type="primary" class="save-btn" @click="handleSave(item)">转存</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResourceStore } from "@/stores/resource";
import { computed } from "vue";
import type { ResourceItem, TagColor } from "@/types";

const props = defineProps<{
  currentChannelId: string;
}>();

const currentChannelId = computed(() => props.currentChannelId);

const store = useResourceStore();

const dataList = computed(() => {
  const channel = store.resources.filter((item) => {
    return item.id === currentChannelId.value;
  });
  return channel.length ? channel[0].list : [];
});

const emit = defineEmits(["save", "searchMovieforTag"]);

const handleSave = (resource: ResourceItem) => {
  emit("save", resource);
};

const openUrl = (url: string) => {
  window.open(url);
};

const searchMovieforTag = (tag: string) => {
  emit("searchMovieforTag", tag);
};
</script>

<style scoped lang="scss">
.resource-card-list {
  padding: 0 10px;
}
.resource-card-image {
  border-radius: 15px;
  overflow: hidden;
}
.resource-card-list__item {
  padding: 20px;
  border-bottom: 1px solid #eee;
  box-shadow: 0 4px 10px rgba(225, 225, 225, 0.3);
  background-color: #fff;
  border-radius: 15px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 15px;
  padding-bottom: 0;
  .resource-card-content-box {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding-bottom: 15px;
    .resource-card-right {
      margin-left: 10px;
      .resource-card-title {
        font-size: 24px;
        font-weight: bold;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        overflow: hidden;
        white-space: all;
      }
      .resource-card-content {
        -webkit-box-orient: vertical;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        overflow: hidden;
        white-space: all;
      }
    }
  }
  .item-tag {
    margin-left: 10px;
    font-size: 18px;
  }
}
.resource-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: #eee 1px solid;
  height: 80px;
}
.save-btn {
  height: 50px;
  font-size: 24px;
  border-radius: 40px;
}
</style>

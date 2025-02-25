<template>
  <div class="resource-card-list">
    <div v-for="group in store.resources" :key="group.id" class="resource-list">
      <div class="group-header">
        <el-link :href="`https://t.me/s/${group.id}`" target="_blank" :underline="false">
          <el-image :src="group.channelInfo.channelLogo" class="channel-logo" fit="cover" lazy />
          {{ group.channelInfo.name }}</el-link
        >
        <el-icon class="header-icon" @click="group.displayList = !group.displayList"
          ><ArrowDown
        /></el-icon>
      </div>
      <div v-show="group.displayList" class="card-item-list">
        <div v-for="resource in group.list" :key="resource.messageId" class="card-item-content">
          <el-card class="card-item">
            <el-image
              class="card-item-image"
              :src="`/tele-images/?url=${encodeURIComponent(resource.image as string)}`"
              fit="cover"
              lazy
              :alt="resource.title"
              hide-on-click-modal
              :preview-src-list="[
                `${location.origin}/tele-images/?url=${encodeURIComponent(resource.image as string)}`,
              ]"
            />
            <el-link :href="resource.cloudLinks[0]" target="_blank" :underline="false"
              ><div class="item-name">{{ resource.title }}</div></el-link
            >
            <div class="item-description" v-html="resource.content"></div>
            <div v-if="resource.tags && resource.tags.length" class="tags-list">
              <span>标签：</span>
              <el-tag
                v-for="item in resource.tags"
                :key="item"
                class="resource_tag"
                @click="searchMovieforTag(item)"
              >
                {{ item }}
              </el-tag>
            </div>
            <template #footer>
              <div class="item-footer">
                <el-tag
                  :type="store.tagColor[resource.cloudType as keyof TagColor]"
                  effect="dark"
                  round
                >
                  {{ resource.cloudType }}
                </el-tag>
                <el-button @click="handleSave(resource)">转存</el-button>
              </div>
            </template>
          </el-card>
        </div>
      </div>
      <div v-show="group.displayList" class="load-more">
        <el-button @click="handleLoadMore(group.id)"> 加载更多 </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResourceStore } from "@/stores/resource";
import { computed } from "vue";
import type { ResourceItem, TagColor } from "@/types";

const store = useResourceStore();

const location = computed(() => window.location);

const emit = defineEmits(["save", "loadMore", "searchMovieforTag"]);

const handleSave = (resource: ResourceItem) => {
  emit("save", resource);
};

const searchMovieforTag = (tag: string) => {
  emit("searchMovieforTag", tag);
};

const handleLoadMore = (channelId: string) => {
  emit("loadMore", channelId);
};
</script>

<style scoped>
.resource-list {
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 15px;
  background-color: var(--theme-other_background);
  &:last-child {
    margin-bottom: 0;
  }
}
.card-item-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, 220px);
  grid-row-gap: 30px;
  justify-content: space-between;
  margin-top: 20px;
  /* grid-column-gap: auto-fill; */
  /* flex-wrap: wrap; */
}
.card-item-content {
  /* height: 520px; */
}
.channel-logo {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-right: 10px;
}
.load-more {
  margin-top: 40px;
  width: 100%;
  text-align: center;
}
.card-item {
  max-width: 480px;
  height: 100%;
  border-radius: 20px;
}
.card-item-image {
  border-radius: 20px;
  width: 100%;
  height: 220px;
}
.item-name,
.item-description {
  max-width: 100%;
  margin: 15px 0;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  white-space: all;
}
.item-description {
  -webkit-line-clamp: 4;
  margin-top: 0;
  height: 100px;
}
.item-name {
  height: 58px;
  font-size: 18px;
}
.tags-list {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  height: 58px;
  overflow: hidden;
}
.resource_tag {
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 5px;
}
.group-header {
  height: 50px;
  line-height: 50px;
  text-align: left;
  padding: 0 15px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* text-align: center; */
  .el-link {
    font-size: 22px;
  }
  .header-icon {
    cursor: pointer;
    width: 50px;
    height: 50px;
  }
}
.item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

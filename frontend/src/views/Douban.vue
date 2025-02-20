<template>
  <div class="movie-wall">
    <div v-for="movie in doubanStore.hotList" :key="movie.id" class="movie-item">
      <div class="movie-poster">
        <el-image
          class="movie-poster-img"
          :src="movie.cover"
          fit="cover"
          lazy
          :alt="movie.title"
          hide-on-click-modal
          :preview-src-list="[movie.cover]"
        />
        <div class="movie-rate">
          {{ movie.rate }}
        </div>
        <div class="movie-poster-hover" @click="searchMovie(movie.title)">
          <div class="movie-search">
            <el-icon class="search_icon" size="28px"><Search /></el-icon>
          </div>
        </div>
      </div>
      <div class="movie-info">
        <el-link :href="movie.url" target="_blank" :underline="false" class="movie-title">{{
          movie.title
        }}</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, watch } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { useDoubanStore } from "@/stores/douban";
  interface CurrentParams {
    type: string;
    tag?: string;
  }
  const router = useRouter();
  const route = useRoute();

  const routeParams = computed(
    (): CurrentParams => ({ ...route.query }) as unknown as CurrentParams
  );
  const doubanStore = useDoubanStore();
  if (routeParams.value) {
    doubanStore.setCurrentParams(routeParams.value);
  }

  watch(
    () => routeParams.value,
    () => {
      console.log(routeParams.value);
      doubanStore.setCurrentParams(routeParams.value);
    }
  );

  const searchMovie = (title: string) => {
    router.push({ path: "/", query: { keyword: title } });
  };
</script>

<style scoped>
  .movie-wall {
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    grid-row-gap: 15px;
    justify-content: space-between;
  }

  .movie-item {
    width: 200px; /* 设置固定宽度 */
    overflow: hidden; /* 确保内容不会超出卡片 */
    text-align: center;
    background-color: #f9f9f9; /* 可选：设置背景颜色 */
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12); /* 可选：设置阴影效果 */
    border-radius: 15px; /* 设置图片圆角 */
    box-sizing: border-box;
    padding-bottom: 0px;
    position: relative;
    padding: 15px;
    padding-bottom: 0;
  }

  .movie-poster-img {
    width: 100%;
    height: 220px;
    object-fit: cover; /* 确保图片使用cover模式 */
    border-radius: 15px; /* 设置图片圆角 */
    overflow: hidden;
  }
  .movie-info {
    /* margin-top: 8px; */
    .movie-title {
      font-size: 16px;
      font-weight: bold;
      padding: 10px 0;
    }
  }
  .movie-poster {
    width: 100%;
    height: 220px;
    position: relative;
    overflow: hidden;
    border-radius: 15px;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }

  .movie-poster-hover {
    opacity: 0; /* 默认情况下隐藏 */
    transition: opacity 0.3s ease; /* 添加过渡效果 */
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    /* height: 100%; */
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .movie-poster:hover .movie-poster-hover {
    opacity: 1; /* 鼠标移入时显示 */
  }

  .movie-rate {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(88, 83, 250, 0.8);
    color: white;
    padding: 0px 8px;
    border-radius: 5px;
    font-size: 14px;
  }
  .movie-search {
    color: white;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
  }
</style>

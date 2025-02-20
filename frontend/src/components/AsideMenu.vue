<template>
  <div class="aside-menu">
    <div class="logo">
      <img :src="logo" class="logo-img" />
      <div class="logo-text">Cloud Saver</div>
    </div>
    <el-menu
      :default-active="currentMenu?.index || '1'"
      :default-openeds="currentMenuOpen"
      class="el-menu-vertical"
      @open="handleOpen"
      @close="handleClose"
    >
      <template v-for="menu in menuList">
        <el-sub-menu :index="menu.index" v-if="menu.children">
          <template #title>
            <el-icon><component :is="menu.icon" /></el-icon>
            <span>{{ menu.title }}</span>
          </template>
          <el-menu-item
            v-for="child in menu.children"
            :index="child.index"
            :key="child.index"
            @click="handleMenuClick(child)"
          >
            {{ child.title }}
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item
          v-else
          :index="menu.index"
          @click="handleMenuClick(menu)"
          :disabled="menu.disabled"
        >
          <el-icon><component :is="menu.icon" /></el-icon>
          <span>{{ menu.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
  import { Search, Film, Setting } from "@element-plus/icons-vue";
  import logo from "@/assets/images/logo.png";
  import { useRouter, useRoute } from "vue-router";
  import { computed } from "vue";
  const router = useRouter();
  const route = useRoute();
  interface MenuItem {
    index: string;
    title: string;
    icon?: any;
    router?: string;
    children?: MenuItem[];
    disabled?: boolean;
  }

  const menuList: MenuItem[] = [
    {
      index: "2",
      title: "资源搜索",
      icon: Search,
      router: "/",
    },
    {
      index: "1",
      title: "豆瓣榜单",
      icon: Film,
      children: [
        {
          index: "1-1",
          title: "热门电影",
          router: "/douban?type=movie",
        },
        {
          index: "1-2",
          title: "热门电视剧",
          router: "/douban?type=tv",
        },
        {
          index: "1-3",
          title: "最新电影",
          router: "/douban?type=movie&tag=最新",
        },
        {
          index: "1-4",
          title: "热门综艺",
          router: "/douban?type=tv&tag=综艺",
        },
      ],
    },
    {
      index: "3",
      title: "设置",
      icon: Setting,
      router: "/setting",
      disabled: false,
    },
  ];

  const currentMenu = computed(() => {
    console.log("route", decodeURIComponent(route.fullPath));
    return menuList
      .reduce((pre: MenuItem[], cur: MenuItem) => {
        if (!cur.children) {
          pre.push(cur);
        } else {
          pre.push(...cur.children);
        }
        return pre;
      }, [])
      .find((x) => x.router === decodeURIComponent(route.fullPath));
  });
  const currentMenuOpen = computed(() => {
    if (currentMenu.value && currentMenu.value.index.length > 1) {
      console.log([currentMenu.value.index.split("-")[0]]);
      return [currentMenu.value.index.split("-")[0]];
    } else {
      return [];
    }
  });
  const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
  };
  const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
  };
  const handleMenuClick = (menu: any) => {
    console.log(menu);
    if (menu.router) {
      router.push(menu.router);
    }
  };
</script>
<style lang="scss" scoped>
  .el-menu-vertical {
    width: 100%;
    height: 100vh;
  }
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    .logo-img {
      width: 30px;
      height: 30px;
      margin-right: 15px;
    }
    .logo-text {
      font-size: 20px;
    }
  }
</style>

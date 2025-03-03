import Login from "@/views/mobile/Login.vue";
import Home from "@/views/mobile/Home.vue";
import type { RouteRecordRaw } from "vue-router";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: Home,
    redirect: "/resource",
    children: [
      {
        path: "/resource",
        name: "resource",
        component: () => import("@/views/mobile/ResourceList.vue"),
      },
      {
        path: "/douban",
        name: "douban",
        component: () => import("@/views/mobile/Douban.vue"),
      },
      {
        path: "/setting",
        name: "setting",
        component: () => import("@/views/mobile/Setting.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
];

export default routes;

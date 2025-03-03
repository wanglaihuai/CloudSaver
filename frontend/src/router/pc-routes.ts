import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
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
        component: () => import("@/views/ResourceList.vue"),
      },
      {
        path: "/douban",
        name: "douban",
        component: () => import("@/views/Douban.vue"),
      },
      {
        path: "/setting",
        name: "setting",
        component: () => import("@/views/Setting.vue"),
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

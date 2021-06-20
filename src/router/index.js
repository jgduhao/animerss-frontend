import { createRouter, createWebHashHistory } from "vue-router";
import AnimeList from "../views/AnimeList.vue";
import RssFeed from "../views/RssFeed.vue";

const routes = [
  {
    path: "/",
    name: "AnimeList",
    component: AnimeList,
  },
  {
    path: "/rssFeed",
    name: "RssFeed",
    component: RssFeed,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

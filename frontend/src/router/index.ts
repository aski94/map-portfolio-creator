import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/auth/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", component: () => import("@/pages/Login.vue") },
    { path: "/", component: () => import("@/pages/Homepage.vue"), meta: { requiresAuth: true } },
    { path: "/confirm", component: () => import("@/pages/Confirm.vue") },
  ],
});

router.beforeEach((to) => {
  const { isLoggedIn } = useAuth();
  if (to.meta.requiresAuth && !isLoggedIn()) return "/login";
  if (to.path === "/login" && isLoggedIn()) return "/";
});

export default router;

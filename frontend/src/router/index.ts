import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@/pages/Homepage.vue') },
    { path: '/confirm', component: () => import('@/pages/Confirm.vue') },
  ],
})

export default router

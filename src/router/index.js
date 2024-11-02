import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/b',
    name: 'home',
    component: () => import('@/views/Home/index.vue')
  },
  {
    path: '/',
    name: 'luckDraw',
    component: () => import('@/views/LuckDraw/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

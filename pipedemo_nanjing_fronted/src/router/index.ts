import { createRouter, createWebHistory } from 'vue-router'
import Twin from '@/views/Twin.vue'
import LoadingOverlay from '@/components/Loading/LoadingOverlay.vue'

const routes = [
  {
    path: '/',
    redirect: '/twin?panel=drainage'
  },
  {
    path: '/twin',
    name: 'Twin',
    component: Twin
  },
  {
    path: '/loading',
    name: 'LoadingOverlay',
    component: LoadingOverlay
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
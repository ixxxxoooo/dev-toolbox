import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/diff',
    name: 'Diff',
    component: () => import('./views/Diff.vue')
  },
  {
    path: '/timestamp',
    name: 'Timestamp',
    component: () => import('./views/Timestamp.vue')
  },
  {
    path: '/url',
    name: 'Url',
    component: () => import('./views/Url.vue')
  },
  {
    path: '/base64',
    name: 'Base64',
    component: () => import('./views/Base64.vue')
  },
  {
    path: '/json',
    name: 'Json',
    component: () => import('./views/Json.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
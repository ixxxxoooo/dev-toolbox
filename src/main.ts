import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import i18n from '@/locales'
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
  },
  {
    path: '/uuid',
    name: 'UuidGenerator',
    component: () => import('./views/UuidGenerator.vue')
  },
  {
    path: '/text-analyzer',
    name: 'TextAnalyzer',
    component: () => import('./views/TextAnalyzer.vue')
  },
  {
    path: '/hash-generator',
    name: 'HashGenerator',
    component: () => import('./views/HashGenerator.vue')
  },
  {
    path: '/sql-formatter',
    name: 'SqlFormatter',
    component: () => import('./views/SqlFormatter.vue')
  },
  {
    path: '/password-generator',
    name: 'PasswordGenerator',
    component: () => import('./views/PasswordGenerator.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')
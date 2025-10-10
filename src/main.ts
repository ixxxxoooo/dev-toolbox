import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import i18n from '@/locales'
import './style.css'

// 配置 Monaco Editor 环境
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

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
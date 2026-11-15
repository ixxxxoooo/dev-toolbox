import { createApp } from 'vue'
import { inject } from '@vercel/analytics'

import { createPinia } from 'pinia'
import App from './App.vue'
import i18n from '@/locales'
import './style.css'
import { registerSW } from 'virtual:pwa-register'
import { showToast } from '@/composables/useToast'

// 配置 Monaco Editor 环境
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json') {
      return new jsonWorker()
    }
    return new editorWorker()
  }
}

// 路由配置
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// 访问统计：只在联网、浏览器空闲时才加载，不抢首屏资源；离线时直接跳过
const injectAnalytics = () => { if (navigator.onLine) inject() }
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(injectAnalytics, { timeout: 5000 })
} else {
  setTimeout(injectAnalytics, 3000)
}

// PWA 更新策略：不再静默 skipWaiting + 强制刷新（会打断用户正在编辑的内容），
// 而是检测到新版本时提示用户，由用户决定何时刷新。
const updateSW = registerSW({
  onNeedRefresh() {
    showToast(i18n.global.t('common.messages.updateAvailable'), 'info', 10 * 60 * 1000, {
      label: i18n.global.t('common.messages.updateNow'),
      onClick: () => { void updateSW(true) }
    })
  },
  onOfflineReady() {
    showToast(i18n.global.t('common.messages.offlineReady'), 'success', 3000)
  }
})

app.mount('#app')
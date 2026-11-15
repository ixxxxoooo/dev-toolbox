<template>
  <div class="flex h-screen w-screen overflow-hidden bg-background text-foreground">
    <Sidebar />
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <!-- 路由慢加载提示：超过 150ms 才出现，快速切换时完全不闪 -->
      <div v-if="loading" class="absolute top-0 inset-x-0 h-[2px] z-50 bg-primary/15 pointer-events-none">
        <div class="route-progress h-full w-full bg-primary"></div>
      </div>

      <router-view v-slot="{ Component, route }">
        <transition name="page">
          <component :is="Component" :key="route.path" class="view-root h-full w-full overflow-auto" />
        </transition>
      </router-view>
    </main>
    <CommandPalette />
    <ToastHost />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from './Sidebar.vue'
import CommandPalette from '../components/CommandPalette.vue'
import ToastHost from '../components/ToastHost.vue'
import { useOnboarding } from '@/composables/useOnboarding'

const { startOnboarding } = useOnboarding()
const router = useRouter()

// ---------- 路由加载状态 ----------
const loading = ref(false)
let loadingTimer: number | undefined
const offBefore = router.beforeEach(() => {
  clearTimeout(loadingTimer)
  loadingTimer = window.setTimeout(() => { loading.value = true }, 150)
})
const stop = () => {
  clearTimeout(loadingTimer)
  loading.value = false
}
const offAfter = router.afterEach(stop)
const offError = router.onError(stop)

const handleKeydown = (e: KeyboardEvent) => {
  // Cmd+/ 或 Ctrl+/ 打开新手引导
  if ((e.metaKey || e.ctrlKey) && e.key === '/') {
    e.preventDefault()
    startOnboarding()
  }
}

let onboardingTimer: number | undefined
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)

  // 首次访问显示引导；稍作延迟，确保 DOM 渲染完成
  if (localStorage.getItem('hasSeenOnboarding') !== 'true') {
    onboardingTimer = window.setTimeout(() => {
      startOnboarding()
      localStorage.setItem('hasSeenOnboarding', 'true')
    }, 500)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  clearTimeout(onboardingTimer)
  clearTimeout(loadingTimer)
  offBefore()
  offAfter()
  offError()
})
</script>

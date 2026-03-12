<template>
  <div class="flex h-screen w-screen overflow-hidden bg-background text-foreground">
    <Sidebar />
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" class="h-full w-full overflow-auto" />
        </transition>
      </router-view>
    </main>
    <CommandPalette />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import Sidebar from './Sidebar.vue'
import CommandPalette from '../components/CommandPalette.vue'
import { useOnboarding } from '@/composables/useOnboarding'

const { startOnboarding } = useOnboarding()

const handleKeydown = (e: KeyboardEvent) => {
  // Cmd+/ or Ctrl+/
  if ((e.metaKey || e.ctrlKey) && e.key === '/') {
    e.preventDefault()
    startOnboarding()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  
  // Show onboarding on first visit
  if (localStorage.getItem('hasSeenOnboarding') !== 'true') {
    // Slight delay to ensure DOM is fully rendered
    setTimeout(() => {
      startOnboarding()
      localStorage.setItem('hasSeenOnboarding', 'true')
    }, 500)
  }
})

onUnmounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

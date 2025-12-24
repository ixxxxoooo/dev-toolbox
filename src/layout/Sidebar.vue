<template>
  <aside
    class="relative bg-card border-r border-border flex flex-col h-full group/sidebar"
    :class="{ 'transition-[width] duration-300 ease-in-out': !isResizing }"
    :style="{ width: sidebarWidth + 'px' }"
  >
    <!-- Header -->
    <div 
      class="h-[49px] border-b border-border flex items-center shrink-0 overflow-hidden transition-all duration-300"
      :class="isCollapsed ? 'px-[22px]' : 'px-4'"
    >
      <div 
        class="flex items-center space-x-3 cursor-pointer group/sidebar-toggle"
        @click="toggleCollapse"
        :title="isCollapsed ? 'Expand' : 'Collapse'"
      >
        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover/sidebar-toggle:bg-primary/90">
          <svg 
            class="w-5 h-5 text-primary-foreground transition-transform duration-500" 
            :class="{ 'rotate-180': isCollapsed }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <span
          class="font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300"
          :class="isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'"
        >
          Dev Toolbox
        </span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1">
      <router-link
        v-for="route in routes"
        :key="route.name"
        :to="{ name: route.name }"
        class="flex items-center h-10 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden"
          :class="[
            $route.name === route.name
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            'px-3'
          ]"
        :title="isCollapsed ? $t(route.meta?.title as string) : ''"
      >
        <div class="w-6 h-6 shrink-0 flex items-center justify-center transition-all duration-300" :class="isCollapsed ? 'mr-0' : 'mr-3'">
          <component
            :is="getIcon(route.meta?.icon as string)"
            class="w-5 h-5 transition-colors"
            :class="$route.name === route.name ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'"
          />
        </div>
        <span
          class="whitespace-nowrap transition-all duration-300 overflow-hidden"
          :class="isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'"
        >
          {{ $t(route.meta?.title as string) }}
        </span>
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="flex items-center h-[49px] px-3 border-t border-border shrink-0">
      <SettingsPanel :collapsed="isCollapsed" class="w-full" />
    </div>

    <!-- Resize Handle -->
    <div
      class="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors z-50"
      :class="{ 'bg-primary/50': isResizing }"
      @mousedown="startResize"
    ></div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Braces,
  FileDiff,
  Clock,
  Link,
  Binary,
  Fingerprint,
  FileText,
  Hash,
  Database,
  Key,
  Calculator,
  Globe,
  Monitor,
  Regex,
  QrCode,
  FileCode,
  Image,
  Eraser,
  Languages,
  Share2,
  PenTool
} from 'lucide-vue-next'
import SettingsPanel from '../components/SettingsPanel.vue'

const router = useRouter()

// State
const MIN_WIDTH = 240
const MAX_WIDTH = 480
const COLLAPSED_WIDTH = 80
const isCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')
const savedWidth = parseInt(localStorage.getItem('sidebarWidth') || '260')
const sidebarWidth = ref(isCollapsed.value ? COLLAPSED_WIDTH : Math.max(MIN_WIDTH, Math.min(savedWidth, MAX_WIDTH)))
const isResizing = ref(false)

// Routes
const routes = computed(() => {
  return router.options.routes[0].children?.filter(r => r.meta?.title) || []
})

// Icons
const icons: Record<string, any> = {
  Braces,
  FileDiff,
  Clock,
  Link,
  Binary,
  Fingerprint,
  FileText,
  Hash,
  Database,
  Key,
  Calculator,
  Globe,
  Monitor,
  Regex,
  QrCode,
  FileCode,
  Image,
  Eraser,
  Languages,
  Share2,
  PenTool
}

const getIcon = (name: string) => {
  return icons[name] || FileText
}

// Actions
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem('sidebarCollapsed', String(isCollapsed.value))
  
  if (isCollapsed.value) {
    sidebarWidth.value = COLLAPSED_WIDTH
  } else {
    // Restore saved width or default
    const savedWidth = parseInt(localStorage.getItem('sidebarWidth') || '260')
    sidebarWidth.value = Math.max(MIN_WIDTH, Math.min(savedWidth, MAX_WIDTH))
  }
}

const startResize = () => {
  isResizing.value = true
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none' // Prevent text selection
}

const handleResize = (e: MouseEvent) => {
  if (!isResizing.value) return

  let newWidth = e.clientX

  // Constraints
  if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH
  if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH

  sidebarWidth.value = newWidth
  
  // If we resized manually, ensure we are not collapsed
  if (isCollapsed.value && newWidth > COLLAPSED_WIDTH) {
    isCollapsed.value = false
  }
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  
  // Save width if not collapsed
  if (!isCollapsed.value) {
    localStorage.setItem('sidebarWidth', sidebarWidth.value.toString())
  }
}

// Lifecycle
onMounted(() => {
  const savedWidth = localStorage.getItem('sidebarWidth')
  if (savedWidth) {
    const w = parseInt(savedWidth)
    if (!isNaN(w)) {
      sidebarWidth.value = isCollapsed.value ? COLLAPSED_WIDTH : Math.max(MIN_WIDTH, Math.min(w, MAX_WIDTH))
    }
  } else if (isCollapsed.value) {
    sidebarWidth.value = COLLAPSED_WIDTH
  }
})

onUnmounted(() => {
  stopResize()
})
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 sm:px-6 md:px-8" @click.self="close">
      <div class="fixed inset-0 bg-background/80 backdrop-blur-sm"></div>
      
      <div 
        class="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-xl overflow-hidden"
        @keydown.esc="close"
      >
        <!-- Search Input -->
        <div class="flex items-center px-4 py-3 border-b border-border bg-muted/20">
          <Search class="w-5 h-5 text-muted-foreground mr-3" />
          <input
            ref="inputRef"
            v-model="searchQuery"
            type="text"
            class="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50"
            :placeholder="$t('common.messages.searchPlaceholder') || 'Search tools... (↑↓ to navigate, Enter to select)'"
            @keydown.down.prevent="navigateDown"
            @keydown.up.prevent="navigateUp"
            @keydown.enter.prevent="selectCurrent"
          />
          <div class="flex items-center space-x-1 ml-3">
            <kbd class="px-1.5 py-0.5 text-[10px] font-sans font-medium bg-muted border border-border rounded text-muted-foreground">ESC</kbd>
          </div>
        </div>

        <!-- Results -->
        <div class="max-h-[60vh] overflow-y-auto py-2 custom-scrollbar">
          <div v-if="filteredTools.length === 0" class="px-4 py-8 text-center text-muted-foreground">
            <p class="text-sm">{{ $t('common.messages.noResults') || 'No tools found matching your search.' }}</p>
          </div>
          
          <div 
            v-for="(tool, index) in filteredTools" 
            :key="tool.path"
            class="px-2"
          >
            <button
              class="w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-left"
              :class="[
                index === activeIndex 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              ]"
              @click="selectTool(tool)"
              @mouseenter="activeIndex = index"
            >
              <div class="w-8 h-8 rounded-md bg-muted flex items-center justify-center mr-3 group-hover:bg-background transition-colors">
                <component :is="getIcon(tool.meta?.icon as string)" class="w-4 h-4" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium">{{ $t(tool.meta?.title as string) }}</div>
                <div class="text-xs text-muted-foreground truncate">{{ getToolDescription(tool) }}</div>
              </div>
              <ChevronRight v-if="index === activeIndex" class="w-4 h-4 ml-2 opacity-50" />
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-4 py-2 border-t border-border bg-muted/10 flex items-center justify-between text-[10px] text-muted-foreground">
          <div class="flex items-center space-x-3">
            <span class="flex items-center"><kbd class="mr-1">↵</kbd> {{ $t('common.buttons.select') || 'Select' }}</span>
            <span class="flex items-center"><kbd class="mr-1">↑↓</kbd> {{ $t('common.labels.navigate') || 'Navigate' }}</span>
          </div>
          <div class="font-medium opacity-50">{{ filteredTools.length }} {{ $t('common.labels.toolCount') || 'tools found' }}</div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Search, 
  ChevronRight,
  Braces,
  FileDiff,
  Database,
  Clock,
  Link,
  Binary,
  Fingerprint,
  FileText,
  Hash,
  Key,
  Calculator,
  Globe,
  Monitor,
  Regex,
  QrCode,
  FileCode,
  Image,
  Eraser,
  Languages
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useCommandPaletteStore } from '../stores/commandPalette'

const { t } = useI18n()
const router = useRouter()
const commandPaletteStore = useCommandPaletteStore()
const isOpen = computed(() => commandPaletteStore.isOpen)
const searchQuery = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

// Icon mapping
const icons: Record<string, any> = {
  Braces,
  FileDiff,
  Database,
  Clock,
  Link,
  Binary,
  Fingerprint,
  FileText,
  Hash,
  Key,
  Calculator,
  Globe,
  Monitor,
  Regex,
  QrCode,
  FileCode,
  Image,
  Eraser,
  Languages
}

const getIcon = (name: string) => icons[name] || FileText

const allTools = computed(() => {
  const mainRoute = router.options.routes.find(r => r.path === '/')
  if (!mainRoute || !mainRoute.children) return []
  return mainRoute.children.filter(route => route.meta && route.meta.title)
})

const filteredTools = computed(() => {
  if (!searchQuery.value) return allTools.value
  
  const query = searchQuery.value.toLowerCase()
  return allTools.value.filter(tool => {
    const title = t(tool.meta?.title as string).toLowerCase()
    const path = tool.path.toLowerCase()
    return title.includes(query) || path.includes(query)
  })
})

const getToolDescription = (tool: any) => {
  // Try to find a description in i18n
  const key = (tool.meta?.title as string).replace('.name', '.description')
  const description = t(key)
  return description === key ? tool.path : description
}

const show = () => {
  commandPaletteStore.open()
}

const close = () => {
  commandPaletteStore.close()
}

// Watch for isOpen changes to handle initialization and focus
watch(isOpen, (newVal) => {
  if (newVal) {
    searchQuery.value = ''
    activeIndex.value = 0
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})

const navigateDown = () => {
  if (activeIndex.value < filteredTools.value.length - 1) {
    activeIndex.value++
  } else {
    activeIndex.value = 0
  }
}

const navigateUp = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--
  } else {
    activeIndex.value = filteredTools.value.length - 1
  }
}

const selectCurrent = () => {
  const tool = filteredTools.value[activeIndex.value]
  if (tool) {
    selectTool(tool)
  }
}

const selectTool = (tool: any) => {
  router.push('/' + tool.path)
  close()
}

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    commandPaletteStore.toggle()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

watch(searchQuery, () => {
  activeIndex.value = 0
})

defineExpose({ show, close })
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

kbd {
  background: rgba(128, 128, 128, 0.1);
  border-radius: 3px;
  border: 1px solid rgba(128, 128, 128, 0.2);
  display: inline-block;
  font-size: 0.8em;
  font-weight: 700;
  line-height: 1;
  padding: 2px 4px;
  white-space: nowrap;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.3);
}
</style>

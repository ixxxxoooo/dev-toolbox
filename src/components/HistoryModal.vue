<template>
  <div v-if="show" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300" @click.self="$emit('close')">
    <div class="bg-card border border-border rounded-xl shadow-2xl max-w-7xl w-full flex flex-col h-[80vh] overflow-hidden animate-in fade-in zoom-in duration-200">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-primary/10 rounded-lg">
            <History class="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 class="text-lg font-bold leading-none mb-1">{{ $t('common.history.title') }}</h3>
            <p class="text-xs text-muted-foreground">{{ history.length }} / 50 records stored</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            v-if="history.length > 0"
            @click="$emit('clear')" 
            class="px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded-md transition-colors flex items-center space-x-1.5"
          >
            <Trash2 class="w-3.5 h-3.5" />
            <span>{{ $t('common.history.clear') }}</span>
          </button>
          <div class="w-px h-6 bg-border mx-2"></div>
          <button @click="$emit('close')" class="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <div v-if="history.length > 0" class="p-4 border-b border-border bg-background/50">
        <div class="relative w-full">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            v-model="searchQuery" 
            type="text" 
            :placeholder="$t('common.history.placeholder')"
            class="w-full pl-9 pr-4 py-2 text-sm bg-muted/30 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
        </div>
      </div>

      <!-- History Content Area -->
      <div class="flex-1 overflow-hidden flex">
        <!-- History List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/5">
          <div v-if="filteredHistory.length === 0" class="h-full flex flex-col items-center justify-center text-muted-foreground py-20">
            <Clock class="w-16 h-16 mb-4 opacity-10" />
            <p class="text-base font-medium opacity-50">{{ $t('common.history.empty') }}</p>
          </div>
          
          <div 
            v-for="item in filteredHistory" 
            :key="item.id"
            class="group relative bg-card hover:bg-muted/30 border border-border/60 rounded-xl p-4 transition-all cursor-pointer hover:border-primary/40 hover:shadow-md"
            @click="$emit('select', item.content)"
            @mouseenter="hoveredItem = item.content"
            @mouseleave="hoveredItem = null"
          >
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md flex items-center space-x-1.5">
                <Calendar class="w-3.5 h-3.5" />
                <span>{{ formatDate(item.timestamp) }}</span>
              </span>
              <button 
                @click.stop="$emit('delete', item.id)"
                class="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                title="Delete entry"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
            <div class="text-sm font-mono text-foreground/70 line-clamp-3 break-all whitespace-pre-wrap leading-relaxed bg-muted/20 p-3 rounded-lg border border-border/20">
              {{ item.content }}
            </div>
            <div class="mt-3 flex justify-end">
              <span class="text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-all flex items-center space-x-1">
                <span>{{ $t('common.history.use') }}</span>
                <ChevronRight class="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        <!-- Hover Preview Side Panel -->
        <div class="w-1/3 border-l border-border bg-card/80 backdrop-blur-sm hidden lg:flex flex-col">
          <div class="p-3 border-b border-border bg-muted/20 flex items-center space-x-2">
            <Eye class="w-4 h-4 text-muted-foreground" />
            <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preview Content</span>
          </div>
          <div class="flex-1 p-4 overflow-auto">
            <div v-if="hoveredItem" class="font-mono text-xs text-foreground/80 whitespace-pre-wrap break-all leading-relaxed animate-in fade-in slide-in-from-right-2 duration-200">
              {{ hoveredItem }}
            </div>
            <div v-else class="h-full flex flex-col items-center justify-center text-muted-foreground/30 italic text-sm">
              <MousePointer2 class="w-8 h-8 mb-2 opacity-20" />
              <p>Hover over an item to preview</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { History, X, Trash2, Clock, Search, Calendar, ChevronRight, Eye, MousePointer2 } from 'lucide-vue-next'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface HistoryItem {
  id: string
  content: string
  timestamp: number
}

const props = defineProps<{
  show: boolean
  history: HistoryItem[]
}>()

defineEmits(['close', 'select', 'delete', 'clear'])

const searchQuery = ref('')
const hoveredItem = ref<string | null>(null)

const filteredHistory = computed(() => {
  if (!searchQuery.value) return props.history
  const q = searchQuery.value.toLowerCase()
  return props.history.filter(item => 
    item.content.toLowerCase().includes(q)
  )
})

const formatDate = (ts: number) => {
  return dayjs(ts).format('YYYY-MM-DD HH:mm:ss') + ' (' + dayjs(ts).fromNow() + ')'
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

/* Custom scrollbar for better appearance */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.3);
}
</style>

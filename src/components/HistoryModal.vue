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
            @click="type !== 'diff' ? $emit('select', item.content) : null"
            @mouseenter="hoveredItem = item.content"
          >
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md flex items-center space-x-1.5">
                <Calendar class="w-3.5 h-3.5" />
                <span>{{ formatDate(item.timestamp) }}</span>
              </span>
              <div class="flex items-center space-x-1">
                <button 
                  @click.stop="copyToClipboard(item.content)"
                  class="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                  title="Copy to clipboard"
                >
                  <Copy class="w-3.5 h-3.5" />
                </button>
                <button 
                  @click.stop="$emit('delete', item.id)"
                  class="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete entry"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div class="text-sm font-mono text-foreground/70 line-clamp-3 break-all whitespace-pre-wrap leading-relaxed bg-muted/20 p-3 rounded-lg border border-border/20">
              {{ item.content }}
            </div>
            <div class="mt-3 flex justify-end gap-2">
              <template v-if="type === 'diff'">
                <button 
                  @click.stop="$emit('select', { content: item.content, side: 'original' })"
                  class="px-2 py-1 text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded border border-primary/20 transition-all"
                >
                  {{ $t('common.history.useLeft') }}
                </button>
                <button 
                  @click.stop="$emit('select', { content: item.content, side: 'modified' })"
                  class="px-2 py-1 text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded border border-primary/20 transition-all"
                >
                  {{ $t('common.history.useRight') }}
                </button>
              </template>
              <span v-else class="text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-all flex items-center space-x-1">
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
          <div class="flex-1 overflow-hidden relative">
            <div v-show="hoveredItem" ref="previewEditorRef" class="absolute inset-0"></div>
            <div v-if="!hoveredItem" class="h-full flex flex-col items-center justify-center text-muted-foreground/30 italic text-sm">
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
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue'
import { History, X, Trash2, Clock, Search, Calendar, ChevronRight, Eye, MousePointer2, Copy } from 'lucide-vue-next'
import * as monaco from 'monaco-editor'
import { getMonacoTheme, watchThemeChange } from '../utils/monaco-theme'
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
  type?: string
}>()

defineEmits(['close', 'select', 'delete', 'clear'])

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Copy failed', err)
  }
}

const searchQuery = ref('')
const hoveredItem = ref<string | null>(null)
const previewEditorRef = ref<HTMLElement | null>(null)
let previewEditor: monaco.editor.IStandaloneCodeEditor | null = null
let themeWatcher: (() => void) | null = null

const detectLanguage = (text: string | null) => {
  if (!text) return 'text'
  const trimmed = text.trim()
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(trimmed)
      return 'json'
    } catch {}
  }
  
  const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'WITH', 'GRANT']
  const upperText = trimmed.toUpperCase()
  if (sqlKeywords.some(kw => upperText.startsWith(kw))) {
    return 'sql'
  }
  
  return 'text'
}

const initPreviewEditor = async () => {
  if (previewEditor) return
  await nextTick()
  if (previewEditorRef.value) {
    previewEditor = monaco.editor.create(previewEditorRef.value, {
      value: '',
      language: 'text',
      theme: getMonacoTheme(),
      readOnly: true,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 12,
      fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
      padding: { top: 12, bottom: 12 },
      wordWrap: 'on',
      lineNumbers: 'off',
      glyphMargin: false,
      folding: true,
    })
    themeWatcher = watchThemeChange(previewEditor)
  }
}

watch(hoveredItem, async (newVal) => {
  if (newVal) {
    if (!previewEditor) {
      await initPreviewEditor()
    }
    const lang = detectLanguage(newVal)
    const model = previewEditor?.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, lang)
    }
    previewEditor?.setValue(newVal)
  }
})

watch(() => props.show, (newShow) => {
  if (newShow) {
    nextTick(() => {
      initPreviewEditor()
    })
  } else {
    hoveredItem.value = null
    if (previewEditor) {
      previewEditor.dispose()
      previewEditor = null
      themeWatcher?.()
      themeWatcher = null
    }
  }
})

onBeforeUnmount(() => {
  themeWatcher?.()
  previewEditor?.dispose()
})

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

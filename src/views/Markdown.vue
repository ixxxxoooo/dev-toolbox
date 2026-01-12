<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <FileText class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.markdown.name') }}</span>
        </div>
        <div class="h-4 w-px bg-border flex-shrink-0"></div>
        <button @click="copyHtml" class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground">
          {{ $t('tools.markdown.copyHtml') }}
        </button>
        <div class="h-4 w-px bg-border flex-shrink-0"></div>
        <button
          @click="showHistory = true"
          class="px-3 py-1.5 text-xs font-medium rounded-md transition-all border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground flex items-center space-x-1"
          :title="$t('common.buttons.history')"
        >
          <HistoryIcon class="w-4 h-4" />
          <span class="hidden sm:inline">{{ $t('common.buttons.history') }}</span>
        </button>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="showHelp = !showHelp" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <HelpCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main ref="mainContainer" class="flex-1 overflow-hidden flex">
      <!-- Editor -->
      <div v-show="!editorCollapsed" class="flex flex-col min-w-0" :style="{ width: leftWidth + 'px' }">
        <div class="h-8 px-3 flex items-center justify-between bg-muted/30 border-b border-border text-xs font-medium text-muted-foreground">
          <span>Markdown</span>
          <button @click="editorCollapsed = true" class="p-1 hover:bg-muted rounded" title="Collapse">
            <PanelLeftClose class="w-4 h-4" />
          </button>
        </div>
        <div class="flex-1 relative">
          <textarea
            v-model="markdown"
            class="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-transparent border-none outline-none resize-none"
            placeholder="# Hello World"
          ></textarea>
        </div>
      </div>

      <!-- Collapsed Editor Toggle -->
      <div v-if="editorCollapsed" class="flex flex-col border-r border-border bg-muted/30">
        <button @click="editorCollapsed = false" class="p-2 hover:bg-muted" title="Expand Editor">
          <PanelLeftOpen class="w-4 h-4" />
        </button>
      </div>

       <!-- Resizer -->
      <div
        v-show="!editorCollapsed"
        class="w-1 bg-border hover:bg-primary/50 cursor-col-resize flex-shrink-0 transition-colors"
        @mousedown="startResize"
      ></div>

      <!-- Preview -->
      <div class="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0d1117]">
        <div class="px-3 py-1.5 bg-muted/30 border-b border-border text-xs font-medium text-muted-foreground">
          Preview
        </div>
        <div ref="previewContainer" class="flex-1 relative overflow-auto p-8 prose dark:prose-invert max-w-none">
          <div v-html="html"></div>
        </div>
      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.markdown.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.markdown.description') }}</p>
        </div>
      </div>
    </div>

    <!-- History Modal -->
    <HistoryModal
      :show="showHistory"
      :history="history"
      type="markdown"
      @close="showHistory = false"
      @select="useHistoryItem"
      @delete="deleteHistory"
      @clear="clearHistory"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { FileText, HelpCircle, X, History as HistoryIcon, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next';
import { marked } from 'marked';
import mermaid from 'mermaid';
import { loadFromStorage, saveToStorage } from '@/utils/localStorage';
import { useHistory } from '@/composables/useHistory';
import { useThemeStore } from '@/stores/theme';
import HistoryModal from '@/components/HistoryModal.vue';

const STORAGE_KEY = 'markdown-content';
const LEFT_WIDTH_KEY = 'markdown-left-width';
const COLLAPSED_KEY = 'markdown-editor-collapsed';

const markdown = ref(loadFromStorage(STORAGE_KEY, '# Hello World\n\nStart typing markdown here...\n\n```mermaid\ngraph TD;\n    A-->B;\n    A-->C;\n    B-->D;\n    C-->D;\n```'));
const showHelp = ref(false);
const showHistory = ref(false);
const editorCollapsed = ref(loadFromStorage(COLLAPSED_KEY, false));
const leftWidth = ref(loadFromStorage(LEFT_WIDTH_KEY, window.innerWidth / 2));
const mainContainer = ref<HTMLElement | null>(null);
const isResizing = ref(false);
const previewContainer = ref<HTMLElement | null>(null);

const themeStore = useThemeStore();
const { history, addHistory, deleteHistory, clearHistory, updateMaxItems } = useHistory('markdown', themeStore.historyLimit.value);

watch(() => themeStore.historyLimit.value, (newLimit) => {
  updateMaxItems(newLimit);
});

// Configure marked to handle mermaid code blocks via string replacement (safer than renderer hook)
const html = computed(() => {
  const rawHtml = marked(markdown.value) as string;
  // Replace standard code block with mermaid div
  return rawHtml.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g, '<div class="mermaid">$1</div>');
});

// Initialize and re-render mermaid
const renderMermaid = async () => {
  await nextTick();
  if (previewContainer.value) {
    const mermaidDivs = previewContainer.value.querySelectorAll('.mermaid');
    if (mermaidDivs.length > 0) {
      try {
        await mermaid.run({
          nodes: mermaidDivs as any
        });
      } catch (e) {
        console.error('Mermaid rendering error:', e);
      }
    }
  }
};

const copyHtml = () => {
  navigator.clipboard.writeText(html.value);
};

// Auto-save and History
let saveTimer: NodeJS.Timeout | null = null;
watch(markdown, (newVal) => {
  saveToStorage(STORAGE_KEY, newVal);

  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    if (newVal.trim()) {
      addHistory(newVal);
    }
  }, 2000); // Debounce history save
});

// Watch html output to trigger mermaid render
watch(html, () => {
  renderMermaid();
});

watch(editorCollapsed, (newVal) => {
  saveToStorage(COLLAPSED_KEY, newVal);
});

watch(leftWidth, (newVal) => {
  saveToStorage(LEFT_WIDTH_KEY, newVal);
});

const useHistoryItem = (content: string) => {
  markdown.value = content;
  showHistory.value = false;
};

// Resizing Logic
const startResize = (e: MouseEvent) => {
  isResizing.value = true;
  document.addEventListener('mousemove', onResize);
  document.addEventListener('mouseup', stopResize);
  e.preventDefault();
};

const onResize = (e: MouseEvent) => {
  if (!isResizing.value || !mainContainer.value) return;
  const rect = mainContainer.value.getBoundingClientRect();
  const newWidth = e.clientX - rect.left;
  leftWidth.value = Math.max(200, Math.min(newWidth, rect.width - 200));
};

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', onResize);
  document.removeEventListener('mouseup', stopResize);
};

onMounted(() => {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose'
  });
  renderMermaid();
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onResize);
  document.removeEventListener('mouseup', stopResize);
  if (saveTimer) clearTimeout(saveTimer);
});
</script>

<style>
/* Basic Prose styles for preview */
.prose h1 { @apply text-2xl font-bold mb-4; }
.prose h2 { @apply text-xl font-bold mb-3 mt-6; }
.prose h3 { @apply text-lg font-bold mb-2 mt-4; }
.prose p { @apply mb-4 leading-relaxed; }
.prose ul { @apply list-disc list-inside mb-4; }
.prose ol { @apply list-decimal list-inside mb-4; }
.prose code { @apply bg-muted px-1.5 py-0.5 rounded text-sm font-mono; }
.prose pre { @apply bg-muted p-4 rounded-lg overflow-x-auto mb-4; }
.prose pre code { @apply bg-transparent p-0; }
.prose blockquote { @apply border-l-4 border-primary/50 pl-4 italic mb-4; }
.prose a { @apply text-primary hover:underline; }
.prose img { @apply max-w-full rounded-lg; }
.prose table { @apply w-full border-collapse mb-4; }
.prose th, .prose td { @apply border border-border px-3 py-2; }
.prose th { @apply bg-muted/50 font-bold text-left; }
</style>

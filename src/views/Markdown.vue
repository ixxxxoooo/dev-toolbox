<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <NotebookText class="w-5 h-5" />
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
            ref="editorRef"
            v-model="markdown"
            class="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-transparent border-none outline-none resize-none"
            placeholder="# Hello World"
            @scroll="onEditorScroll"
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
        <div class="px-3 py-1.5 bg-muted/30 border-b border-border text-xs font-medium text-muted-foreground flex items-center justify-between">
          <span>Preview</span>
          <button
            @click="showToc = !showToc"
            :class="{ 'text-primary': showToc }"
            class="hover:text-foreground transition-colors p-0.5 rounded hover:bg-muted/50"
            title="Table of Contents"
          >
            <List class="w-4 h-4" />
          </button>
        </div>
        <div class="flex-1 flex overflow-hidden">
          <div ref="previewContainer" class="flex-1 relative overflow-auto p-8 prose dark:prose-invert max-w-none" @scroll="onPreviewScroll">
            <div v-html="html"></div>
          </div>
          <!-- TOC Sidebar -->
          <div v-if="showToc" class="w-60 border-l border-border bg-muted/10 overflow-y-auto p-4 flex-shrink-0 text-sm">
            <div class="font-medium mb-3 text-muted-foreground text-xs uppercase tracking-wider">Outline</div>
            <div v-if="toc.length === 0" class="text-xs text-muted-foreground italic">No headings</div>
            <ul class="space-y-1">
              <li v-for="(item, index) in toc" :key="index" :style="{ paddingLeft: (item.depth - 1) * 0.75 + 'rem' }">
                <button
                  @click="scrollToHeading(item.slug)"
                  class="text-xs text-muted-foreground hover:text-primary text-left truncate w-full py-1 block transition-colors border-l-2 border-transparent hover:border-primary pl-2 -ml-2"
                  :class="{ '!text-primary font-medium !border-primary bg-primary/5': activeSlug === item.slug }"
                  :title="item.text"
                >
                  {{ item.text }}
                </button>
              </li>
            </ul>
          </div>
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
import { NotebookText, HelpCircle, X, History as HistoryIcon, PanelLeftClose, PanelLeftOpen, List } from 'lucide-vue-next';
import { marked } from 'marked';
import mermaid from 'mermaid';
import { loadFromStorage, saveToStorage } from '@/utils/localStorage';
import { useHistory } from '@/composables/useHistory';
import { useThemeStore } from '@/stores/theme';
import HistoryModal from '@/components/HistoryModal.vue';

const STORAGE_KEY = 'markdown-content';
const LEFT_WIDTH_KEY = 'markdown-left-width';
const COLLAPSED_KEY = 'markdown-editor-collapsed';
const SHOW_TOC_KEY = 'markdown-show-toc';

const markdown = ref(loadFromStorage(STORAGE_KEY, '# Hello World\n\nStart typing markdown here...\n\n```mermaid\ngraph TD;\n    A-->B;\n    A-->C;\n    B-->D;\n    C-->D;\n```'));
const showHelp = ref(false);
const showHistory = ref(false);
const showToc = ref(loadFromStorage(SHOW_TOC_KEY, false));
const editorCollapsed = ref(loadFromStorage(COLLAPSED_KEY, false));
const leftWidth = ref(loadFromStorage(LEFT_WIDTH_KEY, window.innerWidth / 2));
const mainContainer = ref<HTMLElement | null>(null);
const isResizing = ref(false);
const previewContainer = ref<HTMLElement | null>(null);
const editorRef = ref<HTMLElement | null>(null);
const activeSlug = ref('');
const isScrolling = ref<'editor' | 'preview' | null>(null);
let scrollTimeout: NodeJS.Timeout | null = null;

const themeStore = useThemeStore();
const { history, addHistory, deleteHistory, clearHistory, updateMaxItems } = useHistory('markdown', themeStore.historyLimit.value);

watch(() => themeStore.historyLimit.value, (newLimit) => {
  updateMaxItems(newLimit);
});

// Slugify function for IDs
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '') // Keep Chinese characters, letters, numbers, dashes
    .replace(/^-+|-+$/g, '');
};

// Configure marked renderer for headings
// Using 'any' type to bypass marked version discrepancies
const renderer = {
  heading(token: any) {
    // Check if token has text and depth (object format) or arguments
    const text = token.text || arguments[0];
    const depth = token.depth || arguments[1];

    const slug = slugify(text);
    return `<h${depth} id="${slug}">${text}</h${depth}>`;
  }
};

marked.use({ renderer: renderer as any });

// Generate TOC from tokens
const toc = computed(() => {
  const tokens = marked.lexer(markdown.value);
  const headings: { text: string; depth: number; slug: string }[] = [];

  tokens.forEach((token: any) => {
    if (token.type === 'heading') {
      headings.push({
        text: token.text,
        depth: token.depth,
        slug: slugify(token.text)
      });
    }
  });

  return headings;
});

// Configure marked to handle mermaid code blocks via string replacement
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

const scrollToHeading = (slug: string) => {
  if (!slug || !previewContainer.value) return;
  // Use attribute selector to handle IDs that might start with digits
  const element = previewContainer.value.querySelector(`[id="${slug}"]`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    activeSlug.value = slug;
  }
};

const onEditorScroll = (e: Event) => {
  if (isScrolling.value === 'preview') return;

  isScrolling.value = 'editor';
  const el = e.target as HTMLElement;
  const percentage = el.scrollTop / (el.scrollHeight - el.clientHeight);

  if (previewContainer.value) {
    previewContainer.value.scrollTop = percentage * (previewContainer.value.scrollHeight - previewContainer.value.clientHeight);
  }

  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isScrolling.value = null;
  }, 50);
};

const onPreviewScroll = (e: Event) => {
  // Update TOC active state
  updateActiveHeading();

  if (isScrolling.value === 'editor') return;

  isScrolling.value = 'preview';
  const el = e.target as HTMLElement;
  const percentage = el.scrollTop / (el.scrollHeight - el.clientHeight);

  if (editorRef.value) {
    editorRef.value.scrollTop = percentage * (editorRef.value.scrollHeight - editorRef.value.clientHeight);
  }

  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isScrolling.value = null;
  }, 50);
};

const updateActiveHeading = () => {
  if (!previewContainer.value || !showToc.value) return;

  const headings = Array.from(previewContainer.value.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  if (headings.length === 0) return;

  const containerTop = previewContainer.value.getBoundingClientRect().top;

  // Find the first heading that is visible or about to be visible
  // Or simply find the last heading that is above a certain threshold
  let currentId = '';

  for (const heading of headings) {
    const rect = heading.getBoundingClientRect();
    // Use a small offset (e.g., 50px) to determine if it's "active"
    if (rect.top <= containerTop + 100) {
      currentId = heading.id;
    } else {
      break;
    }
  }

  if (!currentId && headings.length > 0) {
    // If scrolled to top and no heading crossed threshold, confirm first heading?
    // Only if scroll is near top
    if (previewContainer.value.scrollTop < 50) {
      currentId = headings[0].id;
    }
  }

  if (currentId) activeSlug.value = currentId;
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

watch(showToc, (newVal) => {
  saveToStorage(SHOW_TOC_KEY, newVal);
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

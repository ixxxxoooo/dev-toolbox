<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4 overflow-x-auto no-scrollbar">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <FileText class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.textAnalyzer.name') }}</span>
        </div>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center space-x-2 flex-shrink-0 ml-4">
        <button @click="pasteInput" class="px-3 py-1.5 text-xs font-medium rounded-md btn-secondary flex items-center space-x-1.5 transition-colors">
          <ClipboardPaste class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ $t('common.paste') }}</span>
        </button>
        <button @click="clearInput" class="px-3 py-1.5 text-xs font-medium rounded-md btn-destructive transition-colors flex items-center space-x-1.5">
          <Trash2 class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ $t('common.clear') }}</span>
        </button>
        <div class="h-4 w-px bg-border mx-1"></div>
        <button @click="showHelp = !showHelp" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <HelpCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-h-0 p-4">
      <div class="flex-1 flex flex-col border border-border rounded-lg overflow-hidden bg-card shadow-sm mb-4">
        <div class="flex-1 relative">
          <div ref="editorRef" class="absolute inset-0"></div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div class="bg-card border border-border rounded-lg p-3 flex flex-col items-center justify-center shadow-sm hover:border-primary/50 transition-colors">
          <span class="text-2xl font-bold text-primary mb-0.5">{{ stats.charsWithSpaces }}</span>
          <span class="text-[10px] text-muted-foreground uppercase tracking-wider text-center">{{ $t('tools.textAnalyzer.stats.charsWithSpaces') }}</span>
        </div>
        <div class="bg-card border border-border rounded-lg p-3 flex flex-col items-center justify-center shadow-sm hover:border-primary/50 transition-colors">
          <span class="text-2xl font-bold text-primary mb-0.5">{{ stats.charsWithoutSpaces }}</span>
          <span class="text-[10px] text-muted-foreground uppercase tracking-wider text-center">{{ $t('tools.textAnalyzer.stats.charsWithoutSpaces') }}</span>
        </div>
        <div class="bg-card border border-border rounded-lg p-3 flex flex-col items-center justify-center shadow-sm hover:border-primary/50 transition-colors">
          <span class="text-2xl font-bold text-primary mb-0.5">{{ stats.words }}</span>
          <span class="text-[10px] text-muted-foreground uppercase tracking-wider text-center">{{ $t('tools.textAnalyzer.stats.words') }}</span>
        </div>
        <div class="bg-card border border-border rounded-lg p-3 flex flex-col items-center justify-center shadow-sm hover:border-primary/50 transition-colors">
          <span class="text-2xl font-bold text-primary mb-0.5">{{ stats.lines }}</span>
          <span class="text-[10px] text-muted-foreground uppercase tracking-wider text-center">{{ $t('tools.textAnalyzer.stats.lines') }}</span>
        </div>
        <div class="bg-card border border-border rounded-lg p-3 flex flex-col items-center justify-center shadow-sm hover:border-primary/50 transition-colors">
          <span class="text-2xl font-bold text-primary mb-0.5">{{ stats.paragraphs }}</span>
          <span class="text-[10px] text-muted-foreground uppercase tracking-wider text-center">{{ $t('tools.textAnalyzer.stats.paragraphs') }}</span>
        </div>
      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.textAnalyzer.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.textAnalyzer.description') }}</p>
          <div>
            <p class="font-bold mb-2">{{ $t('tools.textAnalyzer.coreFeatures') }}:</p>
            <ul class="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>{{ $t('tools.textAnalyzer.stats.charsWithSpaces') }}:</strong> {{ $t('tools.textAnalyzer.stats.charsWithSpacesDesc') }}</li>
              <li><strong>{{ $t('tools.textAnalyzer.stats.charsWithoutSpaces') }}:</strong> {{ $t('tools.textAnalyzer.stats.charsWithoutSpacesDesc') }}</li>
              <li><strong>{{ $t('tools.textAnalyzer.stats.words') }}:</strong> {{ $t('tools.textAnalyzer.stats.wordsDesc') }}</li>
              <li><strong>{{ $t('tools.textAnalyzer.stats.lines') }}:</strong> {{ $t('tools.textAnalyzer.stats.linesDesc') }}</li>
              <li><strong>{{ $t('tools.textAnalyzer.stats.paragraphs') }}:</strong> {{ $t('tools.textAnalyzer.stats.paragraphsDesc') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as monaco from 'monaco-editor';
import { HelpCircle, FileText, ClipboardPaste, Trash2, X } from 'lucide-vue-next';
import { getMonacoTheme, watchThemeChange, registerGlobalShortcuts } from '../utils/monaco-theme';

const editorRef = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;
let themeWatcher: (() => void) | null = null;
const showHelp = ref(false);

const inputText = ref('');
const stats = ref({
  charsWithSpaces: 0,
  charsWithoutSpaces: 0,
  words: 0,
  lines: 0,
  paragraphs: 0,
});

const analyzeText = () => {
  const text = inputText.value;
  stats.value.charsWithSpaces = text.length;
  stats.value.charsWithoutSpaces = text.replace(/\s/g, '').length;
  const wordsMatch = text.match(/\b\w+\b|[\u4e00-\u9fa5]/gu);
  stats.value.words = wordsMatch ? wordsMatch.length : 0;
  stats.value.lines = text ? text.split(/\r\n|\r|\n/).length : 0;
  stats.value.paragraphs = text.split(/\r\n\r\n|\r\r|\n\n/).filter((p: string) => p.trim() !== '').length;
};

const initEditor = async () => {
  await nextTick();
  if (editorRef.value) {
    editor = monaco.editor.create(editorRef.value, {
      value: inputText.value,
      language: 'plaintext',
      theme: getMonacoTheme(),
      automaticLayout: true,
      minimap: { enabled: false },
      wordWrap: 'on',
      scrollBeyondLastLine: false,
      padding: { top: 16, bottom: 16 },
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
    });
    editor.onDidChangeModelContent(() => {
      inputText.value = editor?.getValue() || '';
      analyzeText();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {});
    themeWatcher = watchThemeChange(editor);
    registerGlobalShortcuts(editor);
  }
  analyzeText();
};

const pasteInput = async () => {
  try {
    const text = await navigator.clipboard.readText();
    editor?.setValue(text);
  } catch (err) {
    console.error('无法读取剪贴板:', err);
  }
};

const clearInput = () => {
  editor?.setValue('');
};

onMounted(initEditor);
onBeforeUnmount(() => {
  themeWatcher?.();
  editor?.dispose();
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
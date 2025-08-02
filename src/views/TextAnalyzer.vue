<template>
  <div class="h-screen flex flex-col bg-background text-foreground">
    <!-- 顶部标题栏 -->
    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <ToolSwitcher />
            <button @click="$router.push('/')" class="btn-icon" title="返回主页">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="flex items-center space-x-2">
              <h1 class="text-xl font-semibold">字符统计工具</h1>
              <div class="relative group">
                <HelpCircle class="h-5 w-5 text-muted-foreground cursor-pointer" />
                <div class="absolute top-full mt-2 w-64 bg-card border rounded-lg shadow-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p class="font-bold mb-2">字符统计工具说明</p>
                  <p class="mb-1">实时统计文本的字数、字符数、行数、段落数等信息。</p>
                  <p class="font-bold mb-1">功能说明:</p>
                  <ul class="list-disc list-inside text-xs">
                    <li><strong class="font-semibold">字符数 (含空格):</strong> 统计所有字符，包括空格和换行符。</li>
                    <li><strong class="font-semibold">字符数 (不含空格):</strong> 统计非空白字符。</li>
                    <li><strong class="font-semibold">字数:</strong> 统计英文单词数量和中文汉字数量。</li>
                    <li><strong class="font-semibold">行数:</strong> 统计文本行数。</li>
                    <li><strong class="font-semibold">段落数:</strong> 统计段落数量 (以连续换行符分隔)。</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="pasteInput" class="px-3 py-1.5 text-sm btn-secondary rounded-md">粘贴</button>
            <button @click="clearInput" class="px-3 py-1.5 text-sm btn-destructive rounded-md">清空</button>
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="flex-1 container mx-auto px-4 py-4 flex flex-col">
      <div class="flex-1 flex flex-col border border-border rounded-lg overflow-hidden">
        <div class="flex-1 relative">
          <div ref="editorRef" class="absolute inset-0"></div>
        </div>
      </div>

      <!-- 统计结果 -->
      <div class="mt-4 bg-card border border-border rounded-lg p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-primary">{{ stats.charsWithSpaces }}</div>
          <div class="text-sm text-muted-foreground">字符数 (含空格)</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary">{{ stats.charsWithoutSpaces }}</div>
          <div class="text-sm text-muted-foreground">字符数 (不含空格)</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary">{{ stats.words }}</div>
          <div class="text-sm text-muted-foreground">字数</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary">{{ stats.lines }}</div>
          <div class="text-sm text-muted-foreground">行数</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary">{{ stats.paragraphs }}</div>
          <div class="text-sm text-muted-foreground">段落数</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as monaco from 'monaco-editor';
import { HelpCircle } from 'lucide-vue-next';
import ToolSwitcher from '../components/ToolSwitcher.vue';
import ThemeToggleButton from '../components/ThemeToggleButton.vue';

// Refs
const editorRef = ref<HTMLElement | null>(null);

// Monaco Editor Instance
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

// State
const inputText = ref('');
const stats = ref({
  charsWithSpaces: 0,
  charsWithoutSpaces: 0,
  words: 0,
  lines: 0,
  paragraphs: 0,
});

// Functions
const analyzeText = () => {
  const text = inputText.value;

  stats.value.charsWithSpaces = text.length;
  stats.value.charsWithoutSpaces = text.replace(/\s/g, '').length;

  // Improved word count for both English and Chinese
  // Matches English words (sequences of letters/numbers/underscores) OR individual Chinese characters
  const wordsMatch = text.match(/\b\w+\b|[\u4e00-\u9fa5]/gu);
  stats.value.words = wordsMatch ? wordsMatch.length : 0;

  stats.value.lines = text.split(/\r\n|\r|\n/).length;
  // Filter out empty strings from split to avoid counting empty lines as paragraphs
  stats.value.paragraphs = text.split(/\r\n\r\n|\r\r|\n\n/).filter(p => p.trim() !== '').length;
};

const initEditor = async () => {
  await nextTick();
  if (editorRef.value) {
    editor = monaco.editor.create(editorRef.value, {
      value: inputText.value,
      language: 'plaintext',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      wordWrap: 'on',
      scrollBeyondLastLine: false,
    });
    editor.onDidChangeModelContent(() => {
      inputText.value = editor?.getValue() || '';
      analyzeText();
    });
  }
  analyzeText(); // Initial analysis
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

// Lifecycle
onMounted(initEditor);
onBeforeUnmount(() => {
  editor?.dispose();
});
</script>
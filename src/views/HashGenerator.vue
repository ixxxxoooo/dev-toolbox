<template>
  <div class="h-screen flex flex-col bg-background text-foreground">
    <!-- 顶部标题栏 -->
    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <ToolSwitcher />
            <button @click="$router.push('/')" class="p-2 rounded-lg hover:bg-secondary transition-colors" title="返回主页">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="flex items-center space-x-2">
              <h1 class="text-xl font-semibold">哈希生成器</h1>
              <div class="relative group">
                <HelpCircle class="h-5 w-5 text-muted-foreground cursor-pointer" />
                <div class="absolute top-full mt-2 w-64 bg-card border rounded-lg shadow-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p class="font-bold mb-2">哈希生成器说明</p>
                  <p class="mb-1">用于生成文本的各种哈希值，如MD5、SHA-1、SHA-256等。</p>
                  <p class="font-bold mb-1">功能说明:</p>
                  <ul class="list-disc list-inside text-xs">
                    <li><strong class="font-semibold">MD5:</strong> 广泛使用的哈希算法，生成128位哈希值。</li>
                    <li><strong class="font-semibold">SHA-1:</strong> 160位哈希算法，安全性低于SHA-256。</li>
                    <li><strong class="font-semibold">SHA-256:</strong> 256位哈希算法，安全性较高。</li>
                    <li><strong class="font-semibold">SHA-512:</strong> 512位哈希算法，安全性最高。</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="pasteInput" class="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-md">粘贴</button>
            <button @click="clearInput" class="px-3 py-1.5 text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md">清空</button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="flex-1 container mx-auto px-4 py-4 flex flex-col">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <!-- 输入编辑器 -->
        <div class="flex flex-col border border-border rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <h3 class="text-sm font-medium">输入文本</h3>
            <div class="flex items-center space-x-2">
              <button @click="pasteInput" class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80">粘贴</button>
              <button @click="clearInput" class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80">清空</button>
            </div>
          </div>
          <div class="flex-1 relative">
            <div ref="editorRef" class="absolute inset-0"></div>
          </div>
        </div>

        <!-- 哈希结果 -->
        <div class="flex flex-col border border-border rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <h3 class="text-sm font-medium">哈希结果</h3>
          </div>
          <div class="flex-1 p-4 space-y-4 overflow-y-auto">
            <div v-for="hashType in hashTypes" :key="hashType.key" class="bg-card border border-border rounded-md p-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold">{{ hashType.label }}</span>
                <button @click="copyHash(hashType.key as HashKey)" class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80">复制</button>
              </div>
              <div class="font-mono text-sm break-all text-muted-foreground">{{ hashes[hashType.key as HashKey] || '-' }}</div>
            </div>
          </div>
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
import { MD5, SHA1, SHA256, SHA512 } from 'crypto-js';

// Types
type HashKey = 'md5' | 'sha1' | 'sha256' | 'sha512';

// Refs
const editorRef = ref<HTMLElement | null>(null);

// Monaco Editor Instance
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

// State
const inputText = ref('Hello World!');
const hashes = ref({
  md5: '',
  sha1: '',
  sha256: '',
  sha512: '',
});

const hashTypes = [
  { key: 'md5', label: 'MD5' },
  { key: 'sha1', label: 'SHA-1' },
  { key: 'sha256', label: 'SHA-256' },
  { key: 'sha512', label: 'SHA-512' },
];

// Functions
const generateHashes = () => {
  const text = inputText.value;
  hashes.value.md5 = MD5(text).toString();
  hashes.value.sha1 = SHA1(text).toString();
  hashes.value.sha256 = SHA256(text).toString();
  hashes.value.sha512 = SHA512(text).toString();
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
      wordWrap: 'on' as const,
      scrollBeyondLastLine: false,
    });
    editor.onDidChangeModelContent(() => {
      inputText.value = editor?.getValue() || '';
      generateHashes();
    });
  }
  generateHashes(); // Initial generation
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

const copyHash = (key: HashKey) => {
  navigator.clipboard.writeText(hashes.value[key]);
};

// Lifecycle
onMounted(initEditor);
onBeforeUnmount(() => {
  editor?.dispose();
});
</script>
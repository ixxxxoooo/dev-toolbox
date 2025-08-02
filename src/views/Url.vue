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
              <h1 class="text-xl font-semibold">URL 编解码</h1>
              <div class="relative group">
                <HelpCircle class="h-5 w-5 text-muted-foreground cursor-pointer" />
                <div class="absolute top-full mt-2 w-80 bg-card border rounded-lg shadow-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p class="font-bold mb-2">URL 编解码说明</p>
                  <p><strong class="text-primary">Encode (编码):</strong> 将特殊字符转换为%xx格式。</p>
                  <ul class="list-disc list-inside my-1 text-xs">
                    <li><strong class="font-semibold">Component:</strong> 用于编码URL的组成部分 (如查询参数)，它会编码所有保留字符。</li>
                    <li><strong class="font-semibold">URI:</strong> 用于编码完整的URL，它不会编码协议、主机等部分。</li>
                  </ul>
                  <p><strong class="text-primary">Decode (解码):</strong> 将%xx格式还原为原始字符。</p>
                  <p class="mt-2"><strong class="text-primary">示例 (Component模式):</strong></p>
                  <p class="text-xs font-mono bg-muted p-1 rounded">输入: <span class="text-red-400">name=你好</span></p>
                  <p class="text-xs font-mono bg-muted p-1 rounded">输出: <span class="text-green-400">name%3D%E4%BD%A0%E5%A5%BD</span></p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="clearAll" class="px-3 py-1.5 text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md transition-colors">清空</button>
          </div>
        </div>
      </div>
    </header>

    <!-- 工具栏 -->
    <div class="container mx-auto px-4 py-3 border-b border-border">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="encode" class="rounded"><span class="text-sm">编码</span></label>
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="decode" class="rounded"><span class="text-sm">解码</span></label>
        </div>
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2"><span class="text-sm">模式:</span>
            <select v-model="mode" class="text-sm px-2 py-1 border border-border rounded bg-background">
              <option v-if="operation === 'encode'" value="encodeURIComponent">Component</option>
              <option v-if="operation === 'encode'" value="encodeURI">URI</option>
              <option v-if="operation === 'decode'" value="decodeURIComponent">Component</option>
              <option v-if="operation === 'decode'" value="decodeURI">URI</option>
            </select>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="autoProcess" class="rounded">
            <span class="text-sm">自动处理</span>
          </label>
          <label class="flex items-center space-x-2" title="自动换行">
            <input type="checkbox" v-model="wordWrapEnabled" class="rounded">
            <span class="text-sm">自动换行</span>
          </label>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="flex-1 container mx-auto px-4 py-4 flex flex-col">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <!-- 输入编辑器 -->
        <div class="flex flex-col border border-border rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <h3 class="text-sm font-medium">输入</h3>
            <div class="flex items-center space-x-2">
              <button @click="pasteInput" class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80">粘贴</button>
              <button @click="copyInput" class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80">复制</button>
            </div>
          </div>
          <div class="flex-1 relative">
            <div ref="inputEditorRef" class="absolute inset-0"></div>
          </div>
        </div>

        <!-- 输出编辑器 -->
        <div class="flex flex-col border border-border rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <h3 class="text-sm font-medium">结果</h3>
            <div class="flex items-center space-x-2">
              <button @click="copyOutput" class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80">复制</button>
              <button @click="useAsInput" class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80">作为输入</button>
            </div>
          </div>
          <div class="flex-1 relative">
            <div ref="outputEditorRef" class="absolute inset-0"></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as monaco from 'monaco-editor';
import { HelpCircle } from 'lucide-vue-next';
import ToolSwitcher from '../components/ToolSwitcher.vue';

// Refs
const inputEditorRef = ref<HTMLElement | null>(null);
const outputEditorRef = ref<HTMLElement | null>(null);

// Monaco Editor Instances
let inputEditor: monaco.editor.IStandaloneCodeEditor | null = null;
let outputEditor: monaco.editor.IStandaloneCodeEditor | null = null;

// State
const inputText = ref('https://example.com/?query=你好 世界');
const outputText = ref('');
const operation = ref('encode');
const mode = ref('encodeURIComponent');
const autoProcess = ref(true);
const wordWrapEnabled = ref(true); // New state for word wrap

// Functions
const processText = () => {
  const input = inputEditor?.getValue() || '';
  if (!input.trim()) {
    outputEditor?.setValue('');
    return;
  }

  try {
    let result = '';
    switch (mode.value) {
      case 'encodeURIComponent': result = encodeURIComponent(input); break;
      case 'encodeURI': result = encodeURI(input); break;
      case 'decodeURIComponent': result = decodeURIComponent(input); break;
      case 'decodeURI': result = decodeURI(input); break;
    }
    outputEditor?.setValue(result);
  } catch (e: any) {
    outputEditor?.setValue(`Error: ${e.message}`);
  }
};

const initEditors = async () => {
  await nextTick();
  const editorOptions = {
    language: 'uri',
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: { enabled: false },
    wordWrap: wordWrapEnabled.value ? 'on' : 'off', // Apply word wrap setting
  };

  if (inputEditorRef.value) {
    inputEditor = monaco.editor.create(inputEditorRef.value, {
      value: inputText.value,
      ...editorOptions,
    });
    inputEditor.onDidChangeModelContent(() => {
      if (autoProcess.value) processText();
    });
  }
  if (outputEditorRef.value) {
    outputEditor = monaco.editor.create(outputEditorRef.value, {
      value: outputText.value,
      readOnly: true,
      ...editorOptions,
    });
  }
  processText();
};

// Toolbar actions
const clearAll = () => {
  inputEditor?.setValue('');
  outputEditor?.setValue('');
};
const pasteInput = async () => inputEditor?.setValue(await navigator.clipboard.readText());
const copyInput = () => navigator.clipboard.writeText(inputEditor?.getValue() || '');
const copyOutput = () => navigator.clipboard.writeText(outputEditor?.getValue() || '');
const useAsInput = () => {
  const outputValue = outputEditor?.getValue() || '';
  inputEditor?.setValue(outputValue);
  operation.value = operation.value === 'encode' ? 'decode' : 'encode';
};

// Watchers
watch(operation, (newVal) => {
  if (newVal === 'encode') {
    mode.value = 'encodeURIComponent';
  } else {
    mode.value = 'decodeURIComponent';
  }
});
watch([mode], () => {
  if (autoProcess.value) processText();
});

watch(wordWrapEnabled, (newValue) => {
  const wrapOption = newValue ? 'on' : 'off';
  inputEditor?.updateOptions({ wordWrap: wrapOption });
  outputEditor?.updateOptions({ wordWrap: wrapOption });
});

// Lifecycle
onMounted(initEditors);
onBeforeUnmount(() => {
  inputEditor?.dispose();
  outputEditor?.dispose();
});

</script>

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
              <h1 class="text-xl font-semibold">Base64 编解码</h1>
              <div class="relative group">
                <HelpCircle class="h-5 w-5 text-muted-foreground cursor-pointer" />
                <div class="absolute top-full mt-2 w-80 bg-card border rounded-lg shadow-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p class="font-bold mb-2">Base64 编解码工具说明</p>
                  <p class="mb-1">一个符合RFC 4648标准的Base64编解码工具，能正确处理包括中文在内的UTF-8字符。</p>
                  <p class="font-bold mb-1">核心功能:</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong class="font-semibold">编码:</strong> 将文本转换为Base64格式。</li>
                    <li><strong class="font-semibold">解码:</strong> 将Base64字符串还原为原始文本。</li>
                    <li><strong class="font-semibold">URL安全:</strong> 生成适合在URL中传输的Base64编码，它将'+'替换为'-'，'/'替换为'_'，并移除'='填充。</li>
                    <li><strong class="font-semibold">自动处理:</strong> 勾选后，输入内容变化时自动进行处理。</li>
                  </ul>
                  <p class="font-bold mb-1">按钮说明:</p>
                  <ul class="list-disc list-inside text-xs">
                    <li><strong class="font-semibold">导入文件:</strong> 从本地文件加载内容到输入框。</li>
                    <li><strong class="font-semibold">下载结果:</strong> 将输出内容下载为文本文件。</li>
                    <li><strong class="font-semibold">清空:</strong> 清空所有输入和输出内容。</li>
                    <li><strong class="font-semibold">作为输入:</strong> 将输出内容复制到输入框，并切换操作模式。</li>
                  </ul>
                  <p class="mt-2"><strong class="text-primary">示例:</strong></p>
                  <p class="text-xs font-mono bg-muted p-1 rounded">输入: <span class="text-red-400">Hello 世界!</span></p>
                  <p class="text-xs font-mono bg-muted p-1 rounded">编码结果: <span class="text-green-400">SGVsbG8g5L2g5aW9IQ==</span></p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="loadFile" class="px-3 py-1.5 text-sm rounded-md btn-secondary">导入文件</button>
            <button @click="downloadFile" :disabled="!outputText" class="px-3 py-1.5 text-sm rounded-md btn-secondary disabled:opacity-50">下载结果</button>
            <button @click="clearAll" class="px-3 py-1.5 text-sm rounded-md btn-destructive">清空</button>
            <ThemeToggleButton />
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
          <label class="flex items-center space-x-2" title="生成对URL安全无特殊字符的Base64编码">
            <input type="checkbox" v-model="urlSafe" class="rounded">
            <span class="text-sm">URL安全</span>
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
              <button @click="pasteInput" class="text-xs px-2 py-1 rounded btn-secondary">粘贴</button>
              <button @click="copyInput" class="text-xs px-2 py-1 rounded btn-secondary">复制</button>
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
              <button @click="copyOutput" class="text-xs px-2 py-1 rounded btn-secondary">复制</button>
              <button @click="useAsInput" class="text-xs px-2 py-1 rounded btn-secondary">作为输入</button>
            </div>
          </div>
          <div class="flex-1 relative">
            <div ref="outputEditorRef" class="absolute inset-0"></div>
          </div>
        </div>
      </div>
      <input ref="fileInput" type="file" class="hidden" @change="handleFileSelect" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as monaco from 'monaco-editor';
import { HelpCircle } from 'lucide-vue-next';
import ToolSwitcher from '../components/ToolSwitcher.vue';
import ThemeToggleButton from '../components/ThemeToggleButton.vue';
import { getMonacoTheme, watchThemeChange } from '../utils/monaco-theme';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';

// Refs
const inputEditorRef = ref<HTMLElement | null>(null);
const outputEditorRef = ref<HTMLElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Monaco Editor Instances
let inputEditor: monaco.editor.IStandaloneCodeEditor | null = null;
let outputEditor: monaco.editor.IStandaloneCodeEditor | null = null;

// 主题监听器清理函数
let inputThemeWatcher: (() => void) | null = null;
let outputThemeWatcher: (() => void) | null = null;

// 本地存储键名
const STORAGE_KEYS = {
  inputText: 'base64-input-text',
  operation: 'base64-operation',
  urlSafe: 'base64-url-safe',
  autoProcess: 'base64-auto-process',
  wordWrapEnabled: 'base64-word-wrap-enabled'
};

// State - 从本地存储加载初始值
const inputText = ref(loadFromStorage(STORAGE_KEYS.inputText, 'Hello World! 你好，世界！'));
const outputText = ref('');
const operation = ref(loadFromStorage(STORAGE_KEYS.operation, 'encode'));
const urlSafe = ref(loadFromStorage(STORAGE_KEYS.urlSafe, false));
const autoProcess = ref(loadFromStorage(STORAGE_KEYS.autoProcess, true));
const wordWrapEnabled = ref(loadFromStorage(STORAGE_KEYS.wordWrapEnabled, true));

// Functions
const processText = () => {
  const input = inputEditor?.getValue() || '';
  if (!input.trim()) {
    outputEditor?.setValue('');
    return;
  }

  try {
    let result = '';
    if (operation.value === 'encode') {
      // UTF-8 friendly encoding
      const utf8Bytes = new TextEncoder().encode(input);
      result = btoa(String.fromCharCode.apply(null, Array.from(utf8Bytes)));
      if (urlSafe.value) {
        result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      }
    } else {
      let base64 = input.trim();
      if (urlSafe.value) {
        base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
      }
      // UTF-8 friendly decoding
      const binaryString = atob(base64);
      const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0));
      result = new TextDecoder().decode(bytes);
    }
    outputEditor?.setValue(result);
  } catch (e: any) {
    outputEditor?.setValue(`Error: ${e.message}`);
  }
};

const initEditors = async () => {
  await nextTick();
  const editorOptions = {
    language: 'plaintext',
    theme: getMonacoTheme(),
    automaticLayout: true,
    minimap: { enabled: false },
    wordWrap: (wordWrapEnabled.value ? 'on' : 'off') as 'on' | 'off', // Apply word wrap setting
  };

  if (inputEditorRef.value) {
    inputEditor = monaco.editor.create(inputEditorRef.value, {
      value: inputText.value,
      ...editorOptions,
    });
    inputEditor.onDidChangeModelContent(() => {
      inputText.value = inputEditor?.getValue() || '';
      saveToStorage(STORAGE_KEYS.inputText, inputText.value);
      if (autoProcess.value) processText();
    });
    // 禁用保存快捷键 (Ctrl+S / Cmd+S)
    inputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // 禁用默认保存行为，什么都不做
    });
    // 设置主题监听器
    inputThemeWatcher = watchThemeChange(inputEditor);
  }
  if (outputEditorRef.value) {
    outputEditor = monaco.editor.create(outputEditorRef.value, {
      value: outputText.value,
      readOnly: true,
      ...editorOptions,
    });
    // 禁用保存快捷键 (Ctrl+S / Cmd+S)
    outputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // 禁用默认保存行为，什么都不做
    });
    // 设置主题监听器
    outputThemeWatcher = watchThemeChange(outputEditor);
  }
  processText();
};

// Toolbar actions
const loadFile = () => fileInput.value?.click();
const handleFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (res) => {
      const content = res.target?.result as string;
      inputEditor?.setValue(content);
    };
    reader.readAsText(file);
  }
};
const downloadFile = () => {
  const content = outputEditor?.getValue();
  if (!content) return;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = operation.value === 'encode' ? 'encoded.txt' : 'decoded.txt';
  a.click();
  URL.revokeObjectURL(url);
};
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
// 监听状态变化并保存到本地存储
watch(operation, (newValue: string) => {
  saveToStorage(STORAGE_KEYS.operation, newValue);
  if (autoProcess.value) processText();
});

watch(urlSafe, (newValue: boolean) => {
  saveToStorage(STORAGE_KEYS.urlSafe, newValue);
  if (autoProcess.value) processText();
});

watch(autoProcess, (newValue: boolean) => {
  saveToStorage(STORAGE_KEYS.autoProcess, newValue);
});

watch(wordWrapEnabled, (newValue: boolean) => {
  const wrapOption = (newValue ? 'on' : 'off') as 'on' | 'off';
  inputEditor?.updateOptions({ wordWrap: wrapOption });
  outputEditor?.updateOptions({ wordWrap: wrapOption });
  saveToStorage(STORAGE_KEYS.wordWrapEnabled, newValue);
});

// Lifecycle
onMounted(initEditors);
onBeforeUnmount(() => {
  // 清理主题监听器
  inputThemeWatcher?.();
  outputThemeWatcher?.();
  // 销毁编辑器实例
  inputEditor?.dispose();
  outputEditor?.dispose();
});

</script>
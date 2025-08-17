<template>
  <div class="h-screen flex flex-col bg-background text-foreground">
    <!-- 顶部标题栏 -->
    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <ToolSwitcher />
            <button @click="$router.push('/')" class="btn-icon" :title="$t('app.backToHome')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="flex items-center space-x-2">
              <h1 class="text-xl font-semibold">{{ $t('tools.url.name') }}</h1>
              <div class="relative group">
                <HelpCircle class="h-5 w-5 text-muted-foreground cursor-pointer" />
                <div class="absolute top-full mt-2 w-80 bg-card border rounded-lg shadow-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p class="font-bold mb-2">{{ $t('tools.url.name') }}</p>
                  <p class="mb-2">{{ $t('tools.url.description') }}</p>
                  <p class="font-bold mb-1">{{ $t('tools.url.encodeMode') }}:</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong>Component:</strong> {{ $t('tools.url.encodeModeDescription') }}</li>
                    <li><strong>URI:</strong> {{ $t('tools.url.encodeModeDescription') }}</li>
                  </ul>
                  <p class="font-bold mb-1">{{ $t('tools.url.decodeMode') }}:</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li>{{ $t('tools.url.decodeModeDescription') }}</li>
                  </ul>
                  <p class="mt-2"><strong class="text-primary">{{ $t('app.example') }}:</strong></p>
                  <p class="text-xs font-mono bg-muted p-1 rounded">{{ $t('common.labels.input') }}: <span class="text-red-400">name=你好</span></p>
                  <p class="text-xs font-mono bg-muted p-1 rounded">{{ $t('common.labels.result') }}: <span class="text-green-400">name%3D%E4%BD%A0%E5%A5%BD</span></p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="clearAll" class="px-3 py-1.5 text-sm btn-destructive rounded-md">{{ $t('common.clear') }}</button>
            <LanguageSwitcher />
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>

    <!-- 工具栏 -->
    <div class="container mx-auto px-4 py-3 border-b border-border">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="encode" class="rounded"><span class="text-sm">{{ $t('common.labels.encode') }}</span></label>
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="decode" class="rounded"><span class="text-sm">{{ $t('common.labels.decode') }}</span></label>
        </div>
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2"><span class="text-sm">{{ $t('common.labels.mode') }}:</span>
            <select v-model="mode" class="text-sm px-2 py-1 border border-border rounded bg-background">
              <option v-if="operation === 'encode'" value="encodeURIComponent">Component</option>
              <option v-if="operation === 'encode'" value="encodeURI">URI</option>
              <option v-if="operation === 'decode'" value="decodeURIComponent">Component</option>
              <option v-if="operation === 'decode'" value="decodeURI">URI</option>
            </select>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="autoProcess" class="rounded">
            <span class="text-sm">{{ $t('common.labels.autoProcess') }}</span>
          </label>
          <label class="flex items-center space-x-2" :title="$t('common.labels.autoWrap')">
            <input type="checkbox" v-model="wordWrapEnabled" class="rounded">
            <span class="text-sm">{{ $t('common.labels.autoWrap') }}</span>
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
            <h3 class="text-sm font-medium">{{ $t('common.labels.input') }}</h3>
            <div class="flex items-center space-x-2">
              <button @click="pasteInput" class="text-xs px-2 py-1 btn-secondary rounded">{{ $t('common.paste') }}</button>
              <button @click="copyInput" class="text-xs px-2 py-1 btn-secondary rounded">{{ $t('common.copy') }}</button>
            </div>
          </div>
          <div class="flex-1 relative">
            <div ref="inputEditorRef" class="absolute inset-0"></div>
          </div>
        </div>

        <!-- 输出编辑器 -->
        <div class="flex flex-col border border-border rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <h3 class="text-sm font-medium">{{ $t('common.labels.result') }}</h3>
            <div class="flex items-center space-x-2">
              <button @click="copyOutput" class="text-xs px-2 py-1 btn-secondary rounded">{{ $t('common.copy') }}</button>
              <button @click="useAsInput" class="text-xs px-2 py-1 btn-secondary rounded">{{ $t('common.buttons.useAsInput') }}</button>
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
import ThemeToggleButton from '../components/ThemeToggleButton.vue';
import LanguageSwitcher from '../components/LanguageSwitcher.vue';
import { getMonacoTheme, watchThemeChange } from '../utils/monaco-theme';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';

// Refs
const inputEditorRef = ref<HTMLElement | null>(null);
const outputEditorRef = ref<HTMLElement | null>(null);

// Monaco Editor Instances
let inputEditor: monaco.editor.IStandaloneCodeEditor | null = null;
let outputEditor: monaco.editor.IStandaloneCodeEditor | null = null;

// 主题监听器清理函数
let inputThemeWatcher: (() => void) | null = null;
let outputThemeWatcher: (() => void) | null = null;

// 本地存储键名
const STORAGE_KEYS = {
  inputText: 'url-input-text',
  operation: 'url-operation',
  mode: 'url-mode',
  autoProcess: 'url-auto-process',
  wordWrapEnabled: 'url-word-wrap-enabled'
};

// State - 从本地存储加载初始值
const inputText = ref(loadFromStorage(STORAGE_KEYS.inputText, 'https://example.com/?query=你好 世界'));
const outputText = ref('');
const operation = ref(loadFromStorage(STORAGE_KEYS.operation, 'encode'));
const mode = ref(loadFromStorage(STORAGE_KEYS.mode, 'encodeURIComponent'));
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

// Watchers - 监听状态变化并保存到本地存储
watch(operation, (newVal: string) => {
  saveToStorage(STORAGE_KEYS.operation, newVal);
  if (newVal === 'encode') {
    mode.value = 'encodeURIComponent';
  } else {
    mode.value = 'decodeURIComponent';
  }
});

watch(mode, (newValue: string) => {
  saveToStorage(STORAGE_KEYS.mode, newValue);
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

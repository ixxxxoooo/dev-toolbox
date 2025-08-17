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
              <h1 class="text-xl font-semibold">{{ $t('tools.base64.name') }}</h1>
              <div class="relative group">
                <HelpCircle class="h-5 w-5 text-muted-foreground cursor-pointer" />
                <div class="absolute top-full mt-2 w-80 bg-card border rounded-lg shadow-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p class="font-bold mb-2">{{ $t('tools.base64.help.title') }}</p>
                  <p class="mb-1">{{ $t('tools.base64.help.description') }}</p>
                  <p class="font-bold mb-1">{{ $t('tools.base64.help.features.encoding') }}</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong class="font-semibold">{{ $t('ui.labels.encode') }}:</strong> {{ $t('tools.base64.help.features.encoding') }}</li>
                    <li><strong class="font-semibold">{{ $t('ui.labels.decode') }}:</strong> {{ $t('tools.base64.help.features.decoding') }}</li>
                    <li><strong class="font-semibold">{{ $t('ui.labels.urlSafe') }}:</strong> {{ $t('tools.base64.help.features.urlSafe') }}</li>
                    <li><strong class="font-semibold">{{ $t('ui.labels.autoProcess') }}:</strong> {{ $t('tools.base64.help.features.utf8') }}</li>
                  </ul>
                  <p class="font-bold mb-1">{{ $t('app.help') }}:</p>
                  <ul class="list-disc list-inside text-xs">
                    <li><strong class="font-semibold">{{ $t('ui.buttons.importFile') }}:</strong> {{ $t('tools.base64.help.features.encoding') }}</li>
                    <li><strong class="font-semibold">{{ $t('ui.buttons.downloadResult') }}:</strong> {{ $t('tools.base64.help.features.decoding') }}</li>
                    <li><strong class="font-semibold">{{ $t('app.clear') }}:</strong> {{ $t('ui.buttons.clearAll') }}</li>
                    <li><strong class="font-semibold">{{ $t('ui.buttons.useAsInput') }}:</strong> {{ $t('tools.base64.help.features.urlSafe') }}</li>
                  </ul>
                  <p class="mt-2"><strong class="text-primary">{{ $t('app.example') }}:</strong></p>
                  <p class="text-xs font-mono bg-muted p-1 rounded">{{ $t('ui.labels.input') }}: <span class="text-red-400">Hello 世界!</span></p>
                  <p class="text-xs font-mono bg-muted p-1 rounded">{{ $t('ui.titles.conversionResult') }}: <span class="text-green-400">SGVsbG8g5L2g5aW9IQ==</span></p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="loadFile" class="px-3 py-1.5 text-sm rounded-md btn-secondary">{{ $t('ui.buttons.importFile') }}</button>
            <button @click="downloadFile" :disabled="!outputText" class="px-3 py-1.5 text-sm rounded-md btn-secondary disabled:opacity-50">{{ $t('ui.buttons.downloadResult') }}</button>
            <button @click="clearAll" class="px-3 py-1.5 text-sm rounded-md btn-destructive">{{ $t('app.clear') }}</button>
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
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="encode" class="rounded"><span class="text-sm">{{ $t('ui.labels.encode') }}</span></label>
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="decode" class="rounded"><span class="text-sm">{{ $t('ui.labels.decode') }}</span></label>
        </div>
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2" :title="$t('tools.base64.help.features.urlSafe')">
            <input type="checkbox" v-model="urlSafe" class="rounded">
            <span class="text-sm">{{ $t('ui.labels.urlSafe') }}</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="autoProcess" class="rounded">
            <span class="text-sm">{{ $t('ui.labels.autoProcess') }}</span>
          </label>
          <label class="flex items-center space-x-2" :title="$t('ui.labels.autoWrap')">
            <input type="checkbox" v-model="wordWrapEnabled" class="rounded">
            <span class="text-sm">{{ $t('ui.labels.autoWrap') }}</span>
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
            <h3 class="text-sm font-medium">{{ $t('ui.labels.input') }}</h3>
            <div class="flex items-center space-x-2">
              <button @click="pasteInput" class="text-xs px-2 py-1 rounded btn-secondary">{{ $t('app.paste') }}</button>
              <button @click="copyInput" class="text-xs px-2 py-1 rounded btn-secondary">{{ $t('app.copy') }}</button>
            </div>
          </div>
          <div class="flex-1 relative">
            <div ref="inputEditorRef" class="absolute inset-0"></div>
          </div>
        </div>

        <!-- 输出编辑器 -->
        <div class="flex flex-col border border-border rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <h3 class="text-sm font-medium">{{ $t('ui.labels.result') }}</h3>
            <div class="flex items-center space-x-2">
              <button @click="copyOutput" class="text-xs px-2 py-1 rounded btn-secondary">{{ $t('app.copy') }}</button>
              <button @click="useAsInput" class="text-xs px-2 py-1 rounded btn-secondary">{{ $t('ui.buttons.useAsInput') }}</button>
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
import LanguageSwitcher from '../components/LanguageSwitcher.vue';
import { getMonacoTheme, watchThemeChange } from '../utils/monaco-theme';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';

// Refs
const inputEditorRef = ref<HTMLElement | null>(null);
const outputEditorRef = ref<HTMLElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Monaco Editor Instances
let inputEditor: monaco.editor.IStandaloneCodeEditor | null = null;
let outputEditor: monaco.editor.IStandaloneCodeEditor | null = null;

// Theme watcher cleanup functions
let inputThemeWatcher: (() => void) | null = null;
let outputThemeWatcher: (() => void) | null = null;

// Local storage keys
const STORAGE_KEYS = {
  inputText: 'base64-input-text',
  operation: 'base64-operation',
  urlSafe: 'base64-url-safe',
  autoProcess: 'base64-auto-process',
  wordWrapEnabled: 'base64-word-wrap-enabled'
};

// State - Load initial values from local storage
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
    // Disable save shortcut (Ctrl+S / Cmd+S)
    inputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Disable default save behavior, do nothing
    });
    // Set theme watcher
    inputThemeWatcher = watchThemeChange(inputEditor);
  }
  if (outputEditorRef.value) {
    outputEditor = monaco.editor.create(outputEditorRef.value, {
      value: outputText.value,
      readOnly: true,
      ...editorOptions,
    });
    // Disable save shortcut (Ctrl+S / Cmd+S)
    outputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Disable default save behavior, do nothing
    });
    // Set theme watcher
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
// Watch state changes and save to local storage
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
  // Clean up theme watchers
  inputThemeWatcher?.();
  outputThemeWatcher?.();
  // Destroy editor instances
  inputEditor?.dispose();
  outputEditor?.dispose();
});

</script>
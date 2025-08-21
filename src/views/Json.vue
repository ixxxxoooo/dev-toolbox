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
              <h1 class="text-xl font-semibold">{{ $t('tools.json.name') }}</h1>
              <div class="relative group">
                <HelpCircle class="h-5 w-5 text-muted-foreground cursor-pointer" />
                <div class="absolute top-full mt-2 w-80 bg-card border rounded-lg shadow-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p class="font-bold mb-2">{{ $t('tools.json.name') }}</p>
                  <p class="mb-2">{{ $t('tools.json.description') }}</p>
                  <p class="font-bold mb-1">{{ $t('tools.json.coreFeatures') }}:</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong>{{ $t('common.labels.format') }}:</strong> {{ $t('tools.json.formatDescription') }}</li>
                    <li><strong>{{ $t('common.labels.minify') }}:</strong> {{ $t('tools.json.minifyDescription') }}</li>
                    <li><strong>{{ $t('common.labels.convert') }}:</strong> {{ $t('tools.json.convertDescription') }}</li>
                    <li><strong>{{ $t('common.labels.treeView') }}:</strong> {{ $t('tools.json.treeViewDescription') }}</li>
                  </ul>
                  <p class="mt-2"><strong class="text-primary">{{ $t('app.example') }}:</strong></p>
                  <p class="text-xs font-mono bg-muted p-1 rounded">{{ $t('common.labels.input') }}: {"hello":"world"}</p>
                  <p class="text-xs font-mono bg-muted p-1 rounded">{{ $t('common.labels.result') }}: {\n  "hello": "world"\n}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="loadFile" class="px-3 py-1.5 text-sm btn-secondary rounded-md">{{ $t('common.buttons.importFile') }}</button>
            <button @click="downloadFile" :disabled="!isValidJson" class="px-3 py-1.5 text-sm btn-secondary rounded-md disabled:opacity-50">{{ $t('tools.json.downloadJson') }}</button>
            <button @click="clearAll" class="px-3 py-1.5 text-sm btn-destructive rounded-md">{{ $t('common.buttons.clearAll') }}</button>
            <LanguageSwitcher />
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>

    <!-- The rest of the template remains the same -->
    <div class="container mx-auto px-4 py-3 border-b border-border">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="format" class="rounded"><span class="text-sm">{{ $t('common.labels.format') }}</span></label>
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="minify" class="rounded"><span class="text-sm">{{ $t('common.labels.minify') }}</span></label>
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="convert" class="rounded"><span class="text-sm">{{ $t('common.labels.convert') }}</span></label>
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="escape" class="rounded"><span class="text-sm">{{ $t('tools.json.escape') }}</span></label>
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="unescape" class="rounded"><span class="text-sm">{{ $t('tools.json.unescape') }}</span></label>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="showTreeView = !showTreeView" class="px-3 py-1.5 text-sm btn-secondary rounded-md">{{ showTreeView ? $t('common.buttons.hideTreeView') : $t('common.buttons.showTreeView') }}</button>
          <label class="flex items-center space-x-2" :title="$t('common.labels.autoWrap')">
            <input type="checkbox" v-model="wordWrapEnabled" class="rounded">
            <span class="text-sm">{{ $t('common.labels.autoWrap') }}</span>
          </label>
          <label class="flex items-center space-x-2"><span class="text-sm">{{ $t('common.labels.indent') }}:</span>
            <select v-model="indentSize" class="text-sm px-2 py-1 border border-border rounded bg-background">
              <option :value="2">{{ $t('common.labels.spaces2') }}</option>
              <option :value="4">{{ $t('common.labels.spaces4') }}</option>
            </select>
          </label>
          <label class="flex items-center space-x-2"><input type="checkbox" v-model="autoProcess" class="rounded"><span class="text-sm">{{ $t('common.labels.autoProcess') }}</span></label>
        </div>
      </div>
      <div v-if="operation === 'convert'" class="mt-4 pt-4 border-t border-border flex items-center space-x-4">
        <label class="flex items-center space-x-2"><span class="text-sm">{{ $t('tools.json.from') }}:</span>
          <select v-model="convertFrom" class="text-sm px-2 py-1 border border-border rounded bg-background">
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="xml">XML</option>
          </select>
        </label>
        <label class="flex items-center space-x-2"><span class="text-sm">{{ $t('tools.json.to') }}:</span>
          <select v-model="convertTo" class="text-sm px-2 py-1 border border-border rounded bg-background">
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="xml">XML</option>
          </select>
        </label>
      </div>
    </div>

    <main class="flex-1 container mx-auto px-4 py-4 flex flex-col">
      <div class="grid gap-4 flex-1" :class="showTreeView ? 'grid-cols-3' : 'grid-cols-2'">
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
        <div v-if="showTreeView" class="flex flex-col border border-border rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <h3 class="text-sm font-medium">{{ $t('common.labels.treeView') }}</h3>
          </div>
          <div class="flex-1 relative overflow-auto">
            <JsonTreeView v-if="isValidJson && parsedJson" :data="parsedJson" />
            <div v-else class="p-4 text-sm text-muted-foreground">{{ $t('common.messages.invalidJson') }}</div>
          </div>
        </div>
        <div class="flex flex-col border border-border rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <h3 class="text-sm font-medium">{{ $t('common.labels.result') }}</h3>
            <button @click="copyOutput" class="text-xs px-2 py-1 btn-secondary rounded">{{ $t('common.copy') }}</button>
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
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import * as monaco from 'monaco-editor';
import * as yaml from 'js-yaml';
import * as xmlJs from 'xml-js';
import JsonTreeView from '../components/JsonTreeView.vue';
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
  inputText: 'json-input-text',
  operation: 'json-operation',
  indentSize: 'json-indent-size',
  autoProcess: 'json-auto-process',
  convertFrom: 'json-convert-from',
  convertTo: 'json-convert-to',
  showTreeView: 'json-show-tree-view',
  wordWrapEnabled: 'json-word-wrap-enabled'
};

// State - Load initial values from local storage
const inputText = ref(loadFromStorage(STORAGE_KEYS.inputText, '{ "hello": "world" }'));
const outputText = ref('');
const operation = ref(loadFromStorage(STORAGE_KEYS.operation, 'format'));
const indentSize = ref(loadFromStorage(STORAGE_KEYS.indentSize, 2));
const autoProcess = ref(loadFromStorage(STORAGE_KEYS.autoProcess, true));
const convertFrom = ref(loadFromStorage(STORAGE_KEYS.convertFrom, 'json'));
const convertTo = ref(loadFromStorage(STORAGE_KEYS.convertTo, 'json'));
const showTreeView = ref(loadFromStorage(STORAGE_KEYS.showTreeView, false));
const wordWrapEnabled = ref(loadFromStorage(STORAGE_KEYS.wordWrapEnabled, true));

// Computed
const parsedJson = computed(() => {
  try {
    return JSON.parse(inputText.value);
  } catch (e) {
    return null;
  }
});
const isValidJson = computed(() => parsedJson.value !== null);

// Functions
const processData = () => {
  if (!inputText.value.trim()) {
    outputText.value = '';
    return;
  }

  try {
    let resultData = '';

    // Handle escape/unescape operations without parsing
    if (operation.value === 'escape') {
      resultData = JSON.stringify(inputText.value);
    } else if (operation.value === 'unescape') {
      // Try to parse as JSON string first, fallback to manual unescape
      try {
        resultData = JSON.parse(inputText.value);
      } catch {
        // Manual unescape for non-JSON strings
        resultData = inputText.value
          .replace(/\\n/g, '\n')   // Unescape newline
          .replace(/\\r/g, '\r')   // Unescape carriage return
          .replace(/\\t/g, '\t')   // Unescape tab
          .replace(/\\"/g, '"')    // Unescape double quote
          .replace(/\\'/g, "'")    // Unescape single quote
          .replace(/\\\\/g, '\\')  // Unescape backslash
      }
    } else {
      // Parse input data for other operations
      let inputData;
      switch (convertFrom.value) {
        case 'yaml':
          inputData = yaml.load(inputText.value);
          break;
        case 'xml':
          inputData = JSON.parse(xmlJs.xml2json(inputText.value, { compact: true, spaces: 4 }));
          break;
        default: // json
          inputData = JSON.parse(inputText.value);
          break;
      }

      // Process data based on operation
      if (operation.value === 'minify') {
        resultData = JSON.stringify(inputData);
      } else if (operation.value === 'format') {
        resultData = JSON.stringify(inputData, null, indentSize.value);
      } else { // convert
        switch (convertTo.value) {
          case 'yaml':
            resultData = yaml.dump(inputData, { indent: indentSize.value });
            break;
          case 'xml':
            resultData = xmlJs.json2xml(JSON.stringify(inputData), { compact: true, spaces: indentSize.value });
            break;
          default: // json
            resultData = JSON.stringify(inputData, null, indentSize.value);
            break;
        }
      }
    }
    outputText.value = resultData;
  } catch (e: unknown) {
    const error = e as Error;
    outputText.value = `Error: ${error.message || 'Unknown error'}`;
  }
  outputEditor?.setValue(outputText.value);
};

const initEditors = async () => {
  await nextTick();
  const editorOptions = {
    language: 'json',
    theme: getMonacoTheme(),
    automaticLayout: true,
    minimap: { enabled: false },
    wordWrap: (wordWrapEnabled.value ? 'on' : 'off') as 'on' | 'off',
  };

  if (inputEditorRef.value) {
    inputEditor = monaco.editor.create(inputEditorRef.value, {
      value: inputText.value,
      ...editorOptions,
    });
    inputEditor.onDidChangeModelContent(() => {
      inputText.value = inputEditor?.getValue() || '';
      saveToStorage(STORAGE_KEYS.inputText, inputText.value);
      if (autoProcess.value) processData();
    });
    // Disable save shortcut (Ctrl+S / Cmd+S)
    inputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Disable default save behavior, do nothing
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
    // Disable save shortcut (Ctrl+S / Cmd+S)
    outputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Disable default save behavior, do nothing
    });
    // 设置主题监听器
    outputThemeWatcher = watchThemeChange(outputEditor);
  }
  processData();
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
  if (!isValidJson.value) return;
  const blob = new Blob([JSON.stringify(parsedJson.value, null, indentSize.value)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
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

// Watchers - Watch state changes and save to local storage
watch(operation, (newValue: string) => {
  saveToStorage(STORAGE_KEYS.operation, newValue);
  if (autoProcess.value) processData();
});

watch(indentSize, (newValue: number) => {
  saveToStorage(STORAGE_KEYS.indentSize, newValue);
  if (autoProcess.value) processData();
});

watch(autoProcess, (newValue: boolean) => {
  saveToStorage(STORAGE_KEYS.autoProcess, newValue);
});

watch(convertFrom, (newValue: string) => {
  saveToStorage(STORAGE_KEYS.convertFrom, newValue);
  if (autoProcess.value) processData();
});

watch(convertTo, (newValue: string) => {
  saveToStorage(STORAGE_KEYS.convertTo, newValue);
  if (autoProcess.value) processData();
});

watch(showTreeView, (newValue: boolean) => {
  saveToStorage(STORAGE_KEYS.showTreeView, newValue);
});

watch(wordWrapEnabled, (newValue: boolean) => {
  const wrapOption = newValue ? 'on' : 'off';
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
  // Dispose editor instances
  inputEditor?.dispose();
  outputEditor?.dispose();
});

</script>

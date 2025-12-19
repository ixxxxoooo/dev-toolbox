<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4 overflow-x-auto no-scrollbar">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <Binary class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.base64.name') }}</span>
        </div>

        <div class="h-4 w-px bg-border flex-shrink-0"></div>

        <!-- Operation Selection -->
        <div class="flex items-center space-x-1 flex-shrink-0">
          <button
            v-for="op in ['encode', 'decode']"
            :key="op"
            @click="operation = op"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-all border border-transparent"
            :class="operation === op ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
          >
            {{ $t('common.labels.' + op) }}
          </button>
        </div>

        <div class="h-4 w-px bg-border flex-shrink-0"></div>

        <!-- Options -->
        <div class="flex items-center space-x-3 flex-shrink-0">
          <label class="flex items-center space-x-2 cursor-pointer group" :title="$t('tools.base64.help.features.urlSafe')">
            <input type="checkbox" v-model="urlSafe" class="rounded border-muted-foreground/30 text-primary focus:ring-primary w-3.5 h-3.5">
            <span class="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{{ $t('common.labels.urlSafe') }}</span>
          </label>

          <label class="flex items-center space-x-2 cursor-pointer group">
            <input type="checkbox" v-model="autoProcess" class="rounded border-muted-foreground/30 text-primary focus:ring-primary w-3.5 h-3.5">
            <span class="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{{ $t('common.labels.autoProcess') }}</span>
          </label>

          <label class="flex items-center space-x-2 cursor-pointer group">
            <input type="checkbox" v-model="wordWrapEnabled" class="rounded border-muted-foreground/30 text-primary focus:ring-primary w-3.5 h-3.5">
            <span class="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{{ $t('common.labels.autoWrap') }}</span>
          </label>
        </div>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center space-x-1 flex-shrink-0 ml-4">
        <button @click="loadFile" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground" :title="$t('common.buttons.importFile')">
          <Upload class="w-4 h-4" />
        </button>
        <button @click="downloadFile" :disabled="!outputText" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50" :title="$t('common.buttons.downloadResult')">
          <Download class="w-4 h-4" />
        </button>
        <div class="h-4 w-px bg-border mx-1"></div>
        <button @click="clearAll" class="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors text-muted-foreground" :title="$t('common.clear')">
          <Trash2 class="w-4 h-4" />
        </button>
        <div class="h-4 w-px bg-border mx-1"></div>
        <button @click="showHelp = !showHelp" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <HelpCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-h-0 p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
        <!-- Input Editor -->
        <div class="flex flex-col border border-border rounded-lg overflow-hidden bg-card shadow-sm">
          <div class="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border">
            <h3 class="text-xs font-medium text-muted-foreground">{{ $t('common.labels.input') }}</h3>
            <div class="flex items-center space-x-1">
              <button @click="pasteInput" :title="$t('common.paste')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                <ClipboardPaste class="w-3.5 h-3.5" />
              </button>
              <button @click="copyInput" :title="$t('common.copy')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                <Copy class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div class="flex-1 relative">
            <div ref="inputEditorRef" class="absolute inset-0"></div>
          </div>
        </div>

        <!-- Output Editor -->
        <div class="flex flex-col border border-border rounded-lg overflow-hidden bg-card shadow-sm">
          <div class="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border">
            <h3 class="text-xs font-medium text-muted-foreground">{{ $t('common.labels.result') }}</h3>
            <div class="flex items-center space-x-1">
              <button @click="useAsInput" :title="$t('common.buttons.useAsInput')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                <ArrowUpLeft class="w-3.5 h-3.5" />
              </button>
              <button @click="copyOutput" :title="$t('common.copy')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                <Copy class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div class="flex-1 relative">
            <div ref="outputEditorRef" class="absolute inset-0"></div>
          </div>
        </div>
      </div>
      <input ref="fileInput" type="file" class="hidden" @change="handleFileSelect" />
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.base64.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.base64.description') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as monaco from 'monaco-editor';
import { HelpCircle, Binary, Upload, Download, Trash2, ClipboardPaste, Copy, ArrowUpLeft, X } from 'lucide-vue-next';
import { getMonacoTheme, watchThemeChange } from '../utils/monaco-theme';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';

const inputEditorRef = ref<HTMLElement | null>(null);
const outputEditorRef = ref<HTMLElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
let inputEditor: monaco.editor.IStandaloneCodeEditor | null = null;
let outputEditor: monaco.editor.IStandaloneCodeEditor | null = null;
let inputThemeWatcher: (() => void) | null = null;
let outputThemeWatcher: (() => void) | null = null;
const showHelp = ref(false);

const STORAGE_KEYS = {
  inputText: 'base64-input-text',
  operation: 'base64-operation',
  urlSafe: 'base64-url-safe',
  autoProcess: 'base64-auto-process',
  wordWrapEnabled: 'base64-word-wrap-enabled'
};

const inputText = ref(loadFromStorage(STORAGE_KEYS.inputText, 'Hello World! 你好，世界！'));
const outputText = ref('');
const operation = ref(loadFromStorage(STORAGE_KEYS.operation, 'encode'));
const urlSafe = ref(loadFromStorage(STORAGE_KEYS.urlSafe, false));
const autoProcess = ref(loadFromStorage(STORAGE_KEYS.autoProcess, true));
const wordWrapEnabled = ref(loadFromStorage(STORAGE_KEYS.wordWrapEnabled, true));

const processText = () => {
  const input = inputEditor?.getValue() || '';
  if (!input.trim()) {
    outputEditor?.setValue('');
    return;
  }

  try {
    let result = '';
    if (operation.value === 'encode') {
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
    wordWrap: (wordWrapEnabled.value ? 'on' : 'off') as 'on' | 'off',
    padding: { top: 16, bottom: 16 },
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
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
    inputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {});
    inputThemeWatcher = watchThemeChange(inputEditor);
  }
  if (outputEditorRef.value) {
    outputEditor = monaco.editor.create(outputEditorRef.value, {
      value: outputText.value,
      readOnly: true,
      ...editorOptions,
    });
    outputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {});
    outputThemeWatcher = watchThemeChange(outputEditor);
  }
  processText();
};

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

watch(operation, (newValue) => {
  saveToStorage(STORAGE_KEYS.operation, newValue);
  if (autoProcess.value) processText();
});

watch(urlSafe, (newValue) => {
  saveToStorage(STORAGE_KEYS.urlSafe, newValue);
  if (autoProcess.value) processText();
});

watch(autoProcess, (newValue) => {
  saveToStorage(STORAGE_KEYS.autoProcess, newValue);
});

watch(wordWrapEnabled, (newValue) => {
  const wrapOption = (newValue ? 'on' : 'off') as 'on' | 'off';
  inputEditor?.updateOptions({ wordWrap: wrapOption });
  outputEditor?.updateOptions({ wordWrap: wrapOption });
  saveToStorage(STORAGE_KEYS.wordWrapEnabled, newValue);
});

onMounted(initEditors);
onBeforeUnmount(() => {
  inputThemeWatcher?.();
  outputThemeWatcher?.();
  inputEditor?.dispose();
  outputEditor?.dispose();
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
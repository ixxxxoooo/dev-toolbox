<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4 overflow-x-auto no-scrollbar">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <Braces class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.json.name') }}</span>
        </div>

        <div class="h-4 w-px bg-border flex-shrink-0"></div>

        <!-- Primary Actions -->
        <div class="flex items-center space-x-1 flex-shrink-0">
          <button
            v-for="op in ['format', 'minify']"
            :key="op"
            @click="handleOperation(op)"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-all border border-transparent"
            :class="operation === op ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
          >
            {{ $t(op === 'format' || op === 'minify' ? 'common.labels.' + op : 'tools.json.' + op) }}
          </button>
        </div>

        <div class="h-4 w-px bg-border flex-shrink-0"></div>

        <!-- Secondary Actions -->
        <div class="flex items-center space-x-1 flex-shrink-0">
          <button
            v-for="op in ['escape', 'unescape']"
            :key="op"
            @click="handleOperation(op)"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-all border border-transparent"
            :class="operation === op ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
          >
            {{ $t('tools.json.' + op) }}
          </button>
        </div>
      </div>

      <!-- Right Side Controls -->
      <div class="flex items-center space-x-3 flex-shrink-0 ml-4">
        <div class="flex items-center space-x-2 hidden md:flex">
          <select v-model="indentSize" class="text-xs px-2 py-1 border border-border rounded bg-background focus:ring-1 focus:ring-primary outline-none h-8">
            <option :value="2">{{ $t('common.labels.spaces2') }}</option>
            <option :value="4">{{ $t('common.labels.spaces4') }}</option>
          </select>

          <button
            @click="wordWrapEnabled = !wordWrapEnabled"
            class="p-1.5 rounded-md transition-colors h-8 w-8 flex items-center justify-center"
            :class="wordWrapEnabled ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'"
            :title="$t('common.labels.autoWrap')"
          >
            <WrapText class="w-4 h-4" />
          </button>
        </div>

        <div class="h-4 w-px bg-border hidden md:block"></div>

        <button
          @click="showTreeView = !showTreeView"
          class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors border border-transparent h-8"
          :class="showTreeView ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
        >
          <ListTree class="w-4 h-4" />
          <span class="hidden sm:inline">{{ showTreeView ? $t('common.buttons.hideTreeView') : $t('common.buttons.showTreeView') }}</span>
        </button>

        <button @click="showHelp = !showHelp" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground h-8 w-8 flex items-center justify-center">
          <HelpCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-h-0 p-4">
      <div class="flex-1 grid gap-4 min-h-0" :class="showTreeView ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'">
        <!-- Editor Section -->
        <div class="flex flex-col border border-border rounded-lg overflow-hidden bg-card shadow-sm">
          <!-- Editor Toolbar -->
          <div class="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-medium text-muted-foreground">{{ $t('common.labels.input') }}</span>
              <span v-if="jsonStats" class="text-xs text-muted-foreground/70 px-2 py-0.5 bg-muted rounded-full">
                {{ jsonStats }}
              </span>
            </div>
            <div class="flex items-center space-x-1">
              <button @click="undo" class="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors" title="Undo (Ctrl+Z)">
                <Undo2 class="w-3.5 h-3.5" />
              </button>
              <button @click="redo" class="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors" title="Redo (Ctrl+Y)">
                <Redo2 class="w-3.5 h-3.5" />
              </button>
              <div class="h-3 w-px bg-border mx-1"></div>
              <button @click="pasteInput" class="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors" :title="$t('common.paste')">
                <ClipboardPaste class="w-3.5 h-3.5" />
              </button>
              <button @click="copyInput" class="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors" :title="$t('common.copy')">
                <Copy class="w-3.5 h-3.5" />
              </button>
              <button @click="clearAll" class="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded text-muted-foreground transition-colors" :title="$t('common.buttons.clearAll')">
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div class="flex-1 relative group">
            <div ref="editorRef" class="absolute inset-0"></div>
            <!-- Quick Actions Overlay (Visible on hover) -->
            <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2 pointer-events-none">
              <button @click="handleOperation('format')" class="pointer-events-auto px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                {{ $t('common.labels.format') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Tree View Section -->
        <div v-if="showTreeView" class="flex flex-col border border-border rounded-lg overflow-hidden bg-card shadow-sm">
          <div class="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border">
            <h3 class="text-xs font-medium text-muted-foreground">{{ $t('common.labels.treeView') }}</h3>
            <div class="flex items-center space-x-2">
               <button @click="toggleTreeExpansion" class="text-xs text-primary hover:underline px-2">
                 {{ isTreeExpanded ? $t('tools.json.collapseAll') : $t('tools.json.expandAll') }}
               </button>
            </div>
          </div>
          <div class="flex-1 relative overflow-auto bg-background p-4">
            <JsonTreeView ref="treeViewRef" v-if="isValidJson && parsedJson" :data="parsedJson" />
            <div v-else class="h-full flex flex-col items-center justify-center text-muted-foreground">
              <AlertCircle class="w-8 h-8 mb-2 opacity-50" />
              <p class="text-sm">{{ $t('common.messages.invalidJson') }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Error Toast -->
    <Transition name="slide-up">
      <div v-if="errorMessage" class="fixed bottom-6 right-6 max-w-md bg-destructive text-destructive-foreground px-4 py-3 rounded-lg shadow-lg flex items-start space-x-3 z-50">
        <AlertCircle class="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div class="flex-1">
          <p class="font-medium text-sm">{{ errorMessage }}</p>
        </div>
        <button @click="errorMessage = ''" class="flex-shrink-0 hover:opacity-70">
          <X class="w-4 h-4" />
        </button>
      </div>
    </Transition>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.json.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.json.description') }}</p>
          <div>
            <p class="font-semibold mb-2">{{ $t('tools.json.coreFeatures') }}:</p>
            <ul class="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>{{ $t('common.labels.format') }}:</strong> {{ $t('tools.json.formatDescription') }}</li>
              <li><strong>{{ $t('common.labels.minify') }}:</strong> {{ $t('tools.json.minifyDescription') }}</li>
              <li><strong>{{ $t('tools.json.escape') }}:</strong> {{ $t('tools.json.escapeDescription') }}</li>
              <li><strong>{{ $t('tools.json.unescape') }}:</strong> {{ $t('tools.json.unescapeDescription') }}</li>
              <li><strong>{{ $t('common.labels.treeView') }}:</strong> {{ $t('tools.json.treeViewDescription') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import * as monaco from 'monaco-editor';
import JSON5 from 'json5';
import JsonTreeView from '../components/JsonTreeView.vue';
import { HelpCircle, Braces, ListTree, Undo2, Redo2, ClipboardPaste, Copy, Trash2, AlertCircle, X, WrapText } from 'lucide-vue-next';
import { getMonacoTheme, watchThemeChange } from '../utils/monaco-theme';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';

const editorRef = ref<HTMLElement | null>(null);
const treeViewRef = ref<any>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;
let themeWatcher: (() => void) | null = null;
let isProcessing = false;
const errorMessage = ref('');
const showHelp = ref(false);
let errorTimer: NodeJS.Timeout | null = null;

const showError = (message: string) => {
  errorMessage.value = message;
  if (errorTimer) clearTimeout(errorTimer);
  errorTimer = setTimeout(() => {
    errorMessage.value = '';
  }, 5000);
};

const STORAGE_KEYS = {
  inputText: 'json-input-text',
  operation: 'json-operation',
  indentSize: 'json-indent-size',
  showTreeView: 'json-show-tree-view',
  wordWrapEnabled: 'json-word-wrap-enabled'
};

const inputText = ref(loadFromStorage(STORAGE_KEYS.inputText, '{ "hello": "world" }'));
const operation = ref(loadFromStorage(STORAGE_KEYS.operation, 'format'));
const indentSize = ref(loadFromStorage(STORAGE_KEYS.indentSize, 2));
const showTreeView = ref(loadFromStorage(STORAGE_KEYS.showTreeView, false));
const wordWrapEnabled = ref(loadFromStorage(STORAGE_KEYS.wordWrapEnabled, true));

const parsedJson = computed(() => {
  try {
    return JSON5.parse(inputText.value);
  } catch (e) {
    return null;
  }
});

const isValidJson = computed(() => parsedJson.value !== null);

const jsonStats = computed(() => {
  if (!isValidJson.value || !parsedJson.value) return null;
  const size = new TextEncoder().encode(JSON.stringify(parsedJson.value)).length;
  const keys = countKeys(parsedJson.value);
  return `${formatBytes(size)} • ${keys} keys`;
});

function countKeys(obj: any): number {
  if (typeof obj !== 'object' || obj === null) return 0;
  let count = 0;
  if (Array.isArray(obj)) {
    count += obj.length;
    for (const item of obj) count += countKeys(item);
  } else {
    const keys = Object.keys(obj);
    count += keys.length;
    for (const key of keys) count += countKeys(obj[key]);
  }
  return count;
}

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const undo = () => editor?.trigger('keyboard', 'undo', null);
const redo = () => editor?.trigger('keyboard', 'redo', null);

const handleOperation = (op: string) => {
  operation.value = op;
  processData();
};

const processData = () => {
  if (!inputText.value.trim() || isProcessing) return;

  try {
    isProcessing = true;
    let resultData = '';

    if (operation.value === 'escape') {
      resultData = JSON.stringify(inputText.value);
    } else if (operation.value === 'unescape') {
      // Try standard unescape first
      try {
        const unescaped = JSON.parse(inputText.value);
        if (typeof unescaped === 'string') {
          // If it was a stringified JSON, try to parse it again to format it
          try {
             const nested = JSON5.parse(unescaped);
             resultData = JSON.stringify(nested, null, indentSize.value);
          } catch {
             resultData = unescaped;
          }
        } else {
          resultData = JSON.stringify(unescaped, null, indentSize.value);
        }
      } catch {
        // Fallback to regex replacement if JSON.parse fails (e.g. partial string)
        resultData = inputText.value
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\\\/g, '\\');
      }
    } else {
      // Format or Minify
      // Use JSON5 for parsing to be more robust
      const inputData = JSON5.parse(inputText.value);

      if (operation.value === 'minify') {
        resultData = JSON.stringify(inputData);
      } else if (operation.value === 'format') {
        resultData = JSON.stringify(inputData, null, indentSize.value);
      }
    }

    editor?.setValue(resultData);
    inputText.value = resultData;
  } catch (e: unknown) {
    const error = e as Error;
    let errorMsg = '';
    if (operation.value === 'escape') errorMsg = 'Escape failed: ' + error.message;
    else if (operation.value === 'unescape') errorMsg = 'Unescape failed: ' + error.message;
    else if (operation.value === 'format') errorMsg = 'Format failed: Invalid JSON';
    else if (operation.value === 'minify') errorMsg = 'Minify failed: Invalid JSON';
    else errorMsg = 'Process failed: ' + error.message;
    showError(errorMsg);
  } finally {
    setTimeout(() => { isProcessing = false; }, 100);
  }
};

const initEditors = async () => {
  await nextTick();
  if (editorRef.value) {
    editor = monaco.editor.create(editorRef.value, {
      value: inputText.value,
      language: 'json',
      theme: getMonacoTheme(),
      automaticLayout: true,
      minimap: { enabled: false },
      wordWrap: (wordWrapEnabled.value ? 'on' : 'off') as 'on' | 'off',
      padding: { top: 16, bottom: 16 },
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
      formatOnPaste: true,
      formatOnType: true,
    });

    editor.onDidChangeModelContent(() => {
      const newValue = editor?.getValue() || '';
      if (!isProcessing) {
        inputText.value = newValue;
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, undo);
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, redo);
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ, redo);

    editor.onDidPaste(() => {
      setTimeout(() => {
        const currentText = editor?.getValue() || '';
        // Auto-detect if we should format
        try {
           JSON5.parse(currentText);
           // If valid JSON and looks minified or messy, format it
           if (!currentText.includes('\n') || currentText.length < 200) {
             handleOperation('format');
           }
        } catch {}
      }, 50);
    });

    themeWatcher = watchThemeChange(editor);
  }
};

const clearAll = () => editor?.setValue('');

const pasteInput = async () => {
  try {
    const text = await navigator.clipboard.readText();
    editor?.setValue(text);
    setTimeout(() => handleOperation('format'), 100);
  } catch (error) {
    console.error('Paste failed:', error);
  }
};

const copyInput = () => {
  const text = editor?.getValue() || '';
  navigator.clipboard.writeText(text);
};

const isTreeExpanded = ref(true);

const toggleTreeExpansion = () => {
  if (isTreeExpanded.value) {
    treeViewRef.value?.collapseAll();
  } else {
    treeViewRef.value?.expandAll();
  }
  isTreeExpanded.value = !isTreeExpanded.value;
};

watch(inputText, (newValue) => {
  saveToStorage(STORAGE_KEYS.inputText, newValue);
});

watch(operation, (newValue) => {
  saveToStorage(STORAGE_KEYS.operation, newValue);
});

watch(indentSize, (newValue) => {
  saveToStorage(STORAGE_KEYS.indentSize, newValue);
  if (operation.value === 'format' && inputText.value.trim()) setTimeout(processData, 100);
});

watch(showTreeView, (newValue) => saveToStorage(STORAGE_KEYS.showTreeView, newValue));

watch(wordWrapEnabled, (newValue) => {
  editor?.updateOptions({ wordWrap: newValue ? 'on' : 'off' });
  saveToStorage(STORAGE_KEYS.wordWrapEnabled, newValue);
});

onMounted(initEditors);

onBeforeUnmount(() => {
  if (errorTimer) clearTimeout(errorTimer);
  themeWatcher?.();
  editor?.dispose();
});
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

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
          <CustomCheckbox
            v-model="urlSafe"
            :label="$t('common.labels.urlSafe')"
            :title="$t('tools.base64.help.features.urlSafe')"
          />

          <CustomCheckbox
            v-model="autoProcess"
            :label="$t('common.labels.autoProcess')"
          />

          <CustomCheckbox
            v-model="wordWrapEnabled"
            :label="$t('common.labels.autoWrap')"
          />
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
              <button @click="undo" :title="$t('common.undo') + ' (Ctrl+Z)'" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                <Undo2 class="w-3.5 h-3.5" />
              </button>
              <button @click="redo" :title="$t('common.redo') + ' (Ctrl+Y)'" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                <Redo2 class="w-3.5 h-3.5" />
              </button>
              <div class="w-px h-3 bg-border mx-1"></div>
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
import * as monaco from '@/utils/monaco';
import { HelpCircle, Binary, Upload, Download, Trash2, ClipboardPaste, Copy, ArrowUpLeft, X, Undo2, Redo2 } from 'lucide-vue-next';
import { getMonacoTheme, watchThemeChange, registerGlobalShortcuts } from '../utils/monaco-theme';
import { loadFromStorage, saveToStorage, saveToStorageDebounced } from '../utils/localStorage';
import CustomCheckbox from '../components/CustomCheckbox.vue';
import { useI18n } from 'vue-i18n';
import { copyText, readClipboardText } from '../utils/clipboard';
import { showToast } from '../composables/useToast';
import { bytesToBase64, base64ToBytes, decodeUtf8Strict, formatBytes } from '../utils/base64';

const { t } = useI18n();
// 二进制文件上限：Monaco 展示几十 MB 的 Base64 会卡死
const MAX_BINARY_SIZE = 10 * 1024 * 1024;
// 导入的二进制文件字节（编码模式下优先于输入框文本）；输入框只显示占位说明
let binaryInput: Uint8Array | null = null;
// 解码结果不是合法 UTF-8 文本时保存原始字节，供下载为二进制文件
let binaryOutput: Uint8Array | null = null;
// 程序性写入输入框（占位文案）时不应被当作用户编辑
let suppressInputChange = false;

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

const setOutput = (text: string) => {
  outputText.value = text;
  outputEditor?.setValue(text);
};

const processText = () => {
  binaryOutput = null;

  // 编码模式下若导入了二进制文件，直接对字节编码
  if (binaryInput && operation.value === 'encode') {
    setOutput(bytesToBase64(binaryInput, urlSafe.value));
    return;
  }

  const input = inputEditor?.getValue() || '';
  if (!input.trim()) {
    setOutput('');
    return;
  }

  try {
    if (operation.value === 'encode') {
      setOutput(bytesToBase64(new TextEncoder().encode(input), urlSafe.value));
    } else {
      const bytes = base64ToBytes(input);
      const text = decodeUtf8Strict(bytes);
      if (text === null) {
        // 不是文本（图片、压缩包等）：不要硬解成乱码，提示并保留字节用于下载
        binaryOutput = bytes;
        setOutput(t('tools.base64.binaryOutput', { size: formatBytes(bytes.length) }));
      } else {
        setOutput(text);
      }
    }
  } catch (e: unknown) {
    setOutput(`Error: ${e instanceof Error ? e.message : String(e)}`);
  }
};

const undo = () => inputEditor?.trigger('keyboard', 'undo', null);
const redo = () => inputEditor?.trigger('keyboard', 'redo', null);

const replaceTextInEditor = (newText: string) => {
  if (!inputEditor) return;
  const model = inputEditor.getModel();
  if (model) {
    const fullRange = model.getFullModelRange();
    inputEditor.executeEdits('base64-processor', [{ range: fullRange, text: newText }]);
  } else {
    inputEditor.setValue(newText);
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
      if (suppressInputChange) return;
      // 用户手动编辑后，之前导入的二进制文件不再有效
      binaryInput = null;
      inputText.value = inputEditor?.getValue() || '';
      saveToStorageDebounced(STORAGE_KEYS.inputText, inputText.value);
      if (autoProcess.value) processText();
    });
    inputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, undo);
    inputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, redo);
    inputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ, redo);
    inputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {});
    inputThemeWatcher = watchThemeChange(inputEditor);
    registerGlobalShortcuts(inputEditor);
  }
  if (outputEditorRef.value) {
    outputEditor = monaco.editor.create(outputEditorRef.value, {
      value: outputText.value,
      readOnly: true,
      ...editorOptions,
    });
    outputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {});
    outputThemeWatcher = watchThemeChange(outputEditor);
    registerGlobalShortcuts(outputEditor);
  }
  processText();
};

const loadFile = () => fileInput.value?.click();

const handleFileSelect = async (e: Event) => {
  const el = e.target as HTMLInputElement;
  const file = el.files?.[0];
  // 清空 value，允许连续选择同一个文件
  el.value = '';
  if (!file) return;

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const text = decodeUtf8Strict(bytes);
    // 解码模式或文本文件：按文本载入输入框（与旧行为一致）
    if (operation.value === 'decode' || text !== null) {
      binaryInput = null;
      replaceTextInEditor(text ?? new TextDecoder().decode(bytes));
      return;
    }
    // 编码模式 + 二进制文件：直接对字节编码
    if (bytes.length > MAX_BINARY_SIZE) {
      showToast(t('tools.base64.fileTooLarge', { size: formatBytes(MAX_BINARY_SIZE) }), 'error', 4000);
      return;
    }
    binaryInput = bytes;
    suppressInputChange = true;
    try {
      replaceTextInEditor(t('tools.base64.binaryInput', { name: file.name, size: formatBytes(bytes.length) }));
    } finally {
      suppressInputChange = false;
    }
    processText();
  } catch (err) {
    console.error('Read file failed:', err);
    showToast(t('tools.base64.readFileFailed'), 'error', 4000);
  }
};

const downloadFile = () => {
  let blob: Blob;
  let filename: string;
  if (binaryOutput) {
    blob = new Blob([binaryOutput as BlobPart], { type: 'application/octet-stream' });
    filename = 'decoded.bin';
  } else {
    const content = outputEditor?.getValue();
    if (!content) return;
    blob = new Blob([content], { type: 'text/plain' });
    filename = operation.value === 'encode' ? 'encoded.txt' : 'decoded.txt';
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const clearAll = () => {
  binaryInput = null;
  replaceTextInEditor('');
  setOutput('');
};

const pasteInput = async () => {
  const text = await readClipboardText();
  if (text !== null) replaceTextInEditor(text);
};
const copyInput = () => copyText(inputEditor?.getValue() || '');
const copyOutput = () => copyText(outputEditor?.getValue() || '');
const useAsInput = () => {
  // 输出是二进制占位说明时不应回填
  if (binaryOutput) return;
  const outputValue = outputEditor?.getValue() || '';
  binaryInput = null;
  replaceTextInEditor(outputValue);
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
<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4 overflow-x-auto no-scrollbar">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <Link class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.url.name') }}</span>
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
          <div class="flex items-center space-x-2">
            <span class="text-xs font-medium text-muted-foreground">{{ $t('common.labels.mode') }}:</span>
            <CustomSelect
              v-model="mode"
              :options="modeOptions"
              class="w-32"
            />
          </div>

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
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.url.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.url.description') }}</p>
          <div>
            <p class="font-bold mb-2">{{ $t('tools.url.encodeMode') }}:</p>
            <ul class="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>Component:</strong> {{ $t('tools.url.encodeModeDescription') }}</li>
              <li><strong>URI:</strong> {{ $t('tools.url.encodeModeDescription') }}</li>
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
import { HelpCircle, Link, Trash2, ClipboardPaste, Copy, ArrowUpLeft, X, Undo2, Redo2 } from 'lucide-vue-next';
import CustomSelect from '../components/CustomSelect.vue';
import CustomCheckbox from '../components/CustomCheckbox.vue';
import { useI18n } from 'vue-i18n';
import { getMonacoTheme, watchThemeChange } from '../utils/monaco-theme';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';

const inputEditorRef = ref<HTMLElement | null>(null);
const outputEditorRef = ref<HTMLElement | null>(null);
let inputEditor: monaco.editor.IStandaloneCodeEditor | null = null;
let outputEditor: monaco.editor.IStandaloneCodeEditor | null = null;
let inputThemeWatcher: (() => void) | null = null;
let outputThemeWatcher: (() => void) | null = null;
const { t } = useI18n();
const showHelp = ref(false);

const STORAGE_KEYS = {
  inputText: 'url-input-text',
  operation: 'url-operation',
  mode: 'url-mode',
  autoProcess: 'url-auto-process',
  wordWrapEnabled: 'url-word-wrap-enabled'
};

const inputText = ref(loadFromStorage(STORAGE_KEYS.inputText, 'https://example.com/?query=你好 世界'));
const outputText = ref('');
const operation = ref(loadFromStorage(STORAGE_KEYS.operation, 'encode'));
const mode = ref(loadFromStorage(STORAGE_KEYS.mode, 'encodeURIComponent'));
const autoProcess = ref(loadFromStorage(STORAGE_KEYS.autoProcess, true));
const wordWrapEnabled = ref(loadFromStorage(STORAGE_KEYS.wordWrapEnabled, true));

const modeOptions = computed(() => {
  if (operation.value === 'encode') {
    return [
      { label: t('tools.url.encodeModeDescription').split('(')[0].trim() || 'Component', value: 'encodeURIComponent' },
      { label: 'URI', value: 'encodeURI' }
    ];
  } else {
    return [
      { label: t('tools.url.decodeModeDescription').split('(')[0].trim() || 'Component', value: 'decodeURIComponent' },
      { label: 'URI', value: 'decodeURI' }
    ];
  }
});

const undo = () => inputEditor?.trigger('keyboard', 'undo', null);
const redo = () => inputEditor?.trigger('keyboard', 'redo', null);

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

const replaceTextInEditor = (newText: string) => {
  if (!inputEditor) return;
  const model = inputEditor.getModel();
  if (model) {
    const fullRange = model.getFullModelRange();
    inputEditor.executeEdits('url-processor', [{ range: fullRange, text: newText }]);
  } else {
    inputEditor.setValue(newText);
  }
};

const initEditors = async () => {
  await nextTick();
  const editorOptions = {
    language: 'uri',
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
    inputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, undo);
    inputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, redo);
    inputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ, redo);
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

const clearAll = () => {
  replaceTextInEditor('');
  outputEditor?.setValue('');
};
const pasteInput = async () => replaceTextInEditor(await navigator.clipboard.readText());
const copyInput = () => navigator.clipboard.writeText(inputEditor?.getValue() || '');
const copyOutput = () => navigator.clipboard.writeText(outputEditor?.getValue() || '');
const useAsInput = () => {
  const outputValue = outputEditor?.getValue() || '';
  replaceTextInEditor(outputValue);
  operation.value = operation.value === 'encode' ? 'decode' : 'encode';
};

watch(operation, (newVal) => {
  saveToStorage(STORAGE_KEYS.operation, newVal);
  if (newVal === 'encode') {
    mode.value = 'encodeURIComponent';
  } else {
    mode.value = 'decodeURIComponent';
  }
});

watch(mode, (newValue) => {
  saveToStorage(STORAGE_KEYS.mode, newValue);
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

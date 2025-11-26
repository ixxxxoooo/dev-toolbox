<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4 overflow-x-auto no-scrollbar">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <Hash class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.hash.name') }}</span>
        </div>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center space-x-2 flex-shrink-0 ml-4">
        <button @click="pasteInput" class="px-3 py-1.5 text-xs font-medium rounded-md btn-secondary flex items-center space-x-1.5 transition-colors">
          <ClipboardPaste class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ $t('common.paste') }}</span>
        </button>
        <button @click="clearInput" class="px-3 py-1.5 text-xs font-medium rounded-md btn-destructive transition-colors flex items-center space-x-1.5">
          <Trash2 class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ $t('common.clear') }}</span>
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
              <button @click="clearInput" :title="$t('common.clear')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div class="flex-1 relative">
            <div ref="editorRef" class="absolute inset-0"></div>
          </div>
        </div>

        <!-- Hash Results -->
        <div class="flex flex-col border border-border rounded-lg overflow-hidden bg-card shadow-sm">
          <div class="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border">
            <h3 class="text-xs font-medium text-muted-foreground">{{ $t('tools.hash.result') }}</h3>
          </div>
          <div class="flex-1 p-4 space-y-3 overflow-y-auto">
            <div v-for="hashType in hashTypes" :key="hashType.key" class="bg-muted/30 border border-border rounded-lg p-3 hover:border-primary/50 transition-colors group">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-semibold text-foreground">{{ hashType.label }}</span>
                <button
                  @click="copyHash(hashType.key as HashKey)"
                  class="p-1 hover:bg-primary/10 hover:text-primary rounded-md opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                  :title="$t('common.copy')"
                >
                  <Copy class="w-3.5 h-3.5" />
                </button>
              </div>
              <div class="font-mono text-xs break-all text-muted-foreground select-all">{{ hashes[hashType.key as HashKey] || '-' }}</div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.hash.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.hash.description') }}</p>
          <div>
            <p class="font-bold mb-2">{{ $t('tools.hash.coreFeatures') }}:</p>
            <ul class="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>MD5:</strong> {{ $t('tools.hash.md5Description') }}</li>
              <li><strong>SHA-1:</strong> {{ $t('tools.hash.sha1Description') }}</li>
              <li><strong>SHA-256:</strong> {{ $t('tools.hash.sha256Description') }}</li>
              <li><strong>SHA-512:</strong> {{ $t('tools.hash.sha512Description') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as monaco from 'monaco-editor';
import { HelpCircle, Hash, ClipboardPaste, Trash2, Copy, X } from 'lucide-vue-next';
import { MD5, SHA1, SHA256, SHA512 } from 'crypto-js';
import { getMonacoTheme, watchThemeChange } from '../utils/monaco-theme';

type HashKey = 'md5' | 'sha1' | 'sha256' | 'sha512';

const editorRef = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;
let themeWatcher: (() => void) | null = null;
const showHelp = ref(false);

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
      theme: getMonacoTheme(),
      automaticLayout: true,
      minimap: { enabled: false },
      wordWrap: 'on' as const,
      scrollBeyondLastLine: false,
      padding: { top: 16, bottom: 16 },
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
    });
    editor.onDidChangeModelContent(() => {
      inputText.value = editor?.getValue() || '';
      generateHashes();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {});
    themeWatcher = watchThemeChange(editor);
  }
  generateHashes();
};

const pasteInput = async () => {
  try {
    const text = await navigator.clipboard.readText();
    editor?.setValue(text);
  } catch (err) {
    console.error('Failed to read clipboard:', err);
  }
};

const clearInput = () => {
  editor?.setValue('');
};

const copyHash = (key: HashKey) => {
  navigator.clipboard.writeText(hashes.value[key]);
};

onMounted(initEditor);
onBeforeUnmount(() => {
  themeWatcher?.();
  editor?.dispose();
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
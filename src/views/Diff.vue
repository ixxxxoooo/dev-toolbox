<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4 overflow-x-auto no-scrollbar">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <FileDiff class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.diff.name') }}</span>
        </div>

        <div class="h-4 w-px bg-border flex-shrink-0"></div>

        <!-- Mode Selection -->
        <div class="flex items-center space-x-1 flex-shrink-0">
          <button
            @click="diffMode = 'split'"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-all border border-transparent"
            :class="diffMode === 'split' ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
          >
            {{ $t('tools.diff.sideBySide') }}
          </button>
          <button
            @click="diffMode = 'inline'"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-all border border-transparent"
            :class="diffMode === 'inline' ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
          >
            {{ $t('tools.diff.inline') }}
          </button>
        </div>

        <div class="h-4 w-px bg-border flex-shrink-0"></div>

        <!-- History Action -->
        <div class="flex items-center space-x-1 flex-shrink-0">
          <button
            @click="showHistory = true"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-all border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground flex items-center space-x-1"
            :title="$t('common.buttons.history')"
          >
            <History class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">{{ $t('common.buttons.history') }}</span>
          </button>
        </div>

        <div class="h-4 w-px bg-border flex-shrink-0"></div>

        <div class="h-4 w-px bg-border flex-shrink-0"></div>

        <!-- Options -->
        <div class="flex items-center space-x-3 flex-shrink-0">
          <label class="flex items-center space-x-2 cursor-pointer group">
            <input type="checkbox" v-model="ignoreWhitespace" class="rounded border-muted-foreground/30 text-primary focus:ring-primary w-3.5 h-3.5">
            <span class="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{{ $t('tools.diff.ignoreWhitespace') }}</span>
          </label>
          <label class="flex items-center space-x-2 cursor-pointer group">
            <input type="checkbox" v-model="wordWrapEnabled" class="rounded border-muted-foreground/30 text-primary focus:ring-primary w-3.5 h-3.5">
            <span class="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{{ $t('tools.diff.wordWrap') }}</span>
          </label>

          <button
            @click="showMinimap = !showMinimap"
            class="p-1.5 rounded-md transition-colors h-7 w-7 flex items-center justify-center border border-transparent"
            :class="showMinimap ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground hover:bg-muted'"
            title="Toggle Minimap"
          >
            <Map class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center space-x-1 flex-shrink-0 ml-4">
        <button @click="goToPrevDiff" :title="$t('tools.diff.previousDiff')" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <ArrowUp class="w-4 h-4" />
        </button>
        <button @click="goToNextDiff" :title="$t('tools.diff.nextDiff')" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <ArrowDown class="w-4 h-4" />
        </button>
        <div class="h-4 w-px bg-border mx-1"></div>
        <button @click="swapContent" :title="$t('tools.diff.swapContent')" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <ArrowRightLeft class="w-4 h-4" />
        </button>
        <button @click="clearAll" :title="$t('tools.diff.clearAll')" class="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors text-muted-foreground">
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
      <div class="flex-1 flex flex-col border border-border rounded-lg overflow-hidden bg-card shadow-sm">
        <!-- Headers for split view -->
        <div v-if="diffMode === 'split'" class="grid grid-cols-2 bg-muted/30 border-b border-border">
          <div class="flex items-center justify-between px-3 py-1.5 border-r border-border">
            <span class="text-xs font-medium text-muted-foreground">{{ $t('tools.diff.leftPanel') }}</span>
            <div class="flex items-center space-x-1">
              <button @click="pasteTo('original')" :title="$t('tools.diff.pasteLeft')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                <ClipboardPaste class="w-3.5 h-3.5" />
              </button>
              <button @click="copyFrom('original')" :title="$t('tools.diff.copyLeft')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                <Copy class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between px-3 py-1.5">
            <span class="text-xs font-medium text-muted-foreground">{{ $t('tools.diff.rightPanel') }}</span>
            <div class="flex items-center space-x-1">
              <button @click="pasteTo('modified')" :title="$t('tools.diff.pasteRight')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                <ClipboardPaste class="w-3.5 h-3.5" />
              </button>
              <button @click="copyFrom('modified')" :title="$t('tools.diff.copyRight')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                <Copy class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
        <!-- Header for inline view -->
        <div v-else class="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border">
          <span class="text-xs font-medium text-muted-foreground">{{ $t('tools.diff.name') }} ({{ $t('tools.diff.inline') }})</span>
        </div>

        <!-- The actual editor container -->
        <div class="flex-1 relative">
          <div ref="diffEditorRef" class="absolute inset-0"></div>
        </div>
      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.diff.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.diff.description') }}</p>
          <ul class="list-disc list-inside space-y-1 text-muted-foreground">
            <li><strong>{{ $t('tools.diff.sideBySide') }}:</strong> {{ $t('tools.diff.sideBySideDescription') }}</li>
            <li><strong>{{ $t('tools.diff.inline') }}:</strong> {{ $t('tools.diff.inlineDescription') }}</li>
            <li><strong>{{ $t('tools.diff.ignoreWhitespace') }}:</strong> {{ $t('tools.diff.ignoreWhitespaceDescription') }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- History Modal -->
    <HistoryModal
      :show="showHistory"
      :history="history"
      type="diff"
      @close="showHistory = false"
      @select="handleHistorySelect"
      @delete="deleteHistory"
      @clear="clearHistory"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import * as monaco from 'monaco-editor';
import { HelpCircle, FileDiff, ArrowUp, ArrowDown, ArrowRightLeft, Trash2, ClipboardPaste, Copy, X, History, Map } from 'lucide-vue-next';
import { getMonacoTheme, watchThemeChangeForDiffEditor } from '../utils/monaco-theme';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';
import { useHistory } from '../composables/useHistory';
import { useThemeStore } from '../stores/theme';
import HistoryModal from '../components/HistoryModal.vue';

const diffEditorRef = ref<HTMLElement | null>(null);
let diffEditor: monaco.editor.IStandaloneDiffEditor | null = null;
let themeWatcher: (() => void) | null = null;
const showHelp = ref(false);
const showHistory = ref(false);

const themeStore = useThemeStore();
const { history, addHistory, deleteHistory, clearHistory, updateMaxItems } = useHistory('diff', themeStore.historyLimit.value);

watch(() => themeStore.historyLimit.value, (newLimit) => {
  updateMaxItems(newLimit);
});

const STORAGE_KEYS = {
  leftContent: 'diff-left-content',
  rightContent: 'diff-right-content',
  diffMode: 'diff-mode',
  ignoreWhitespace: 'diff-ignore-whitespace',
  showLineNumbers: 'diff-show-line-numbers',
  theme: 'diff-theme',
  wordWrapEnabled: 'diff-word-wrap-enabled',
  showMinimap: 'diff-show-minimap'
};

const leftContent = ref(loadFromStorage(STORAGE_KEYS.leftContent, 'function sayHello() {\n  console.log("Hello, world!");\n}'));
const rightContent = ref(loadFromStorage(STORAGE_KEYS.rightContent, '  function sayHello() {\n    console.log("Hello, world!");\n  }\n'));
const diffMode = ref<'split' | 'inline'>(loadFromStorage(STORAGE_KEYS.diffMode, 'split'));
const ignoreWhitespace = ref(loadFromStorage(STORAGE_KEYS.ignoreWhitespace, false));
const showLineNumbers = ref(loadFromStorage(STORAGE_KEYS.showLineNumbers, true));
const wordWrapEnabled = ref(loadFromStorage(STORAGE_KEYS.wordWrapEnabled, true));
const showMinimap = ref(loadFromStorage(STORAGE_KEYS.showMinimap, false));

const initMonacoDiffEditor = async () => {
  await nextTick();
  if (!diffEditorRef.value) return;

  diffEditor?.dispose();

  const originalModel = monaco.editor.createModel(leftContent.value, 'text/plain');
  const modifiedModel = monaco.editor.createModel(rightContent.value, 'text/plain');

  diffEditor = monaco.editor.createDiffEditor(diffEditorRef.value, {
    theme: getMonacoTheme(),
    automaticLayout: true,
    scrollBeyondLastLine: false,
    readOnly: false,
    originalEditable: true,
    enableSplitViewResizing: true,
    wordWrap: wordWrapEnabled.value ? 'on' : 'off',
    folding: true,
    lineHeight: 20,
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
    renderSideBySide: diffMode.value === 'split',
    lineNumbers: showLineNumbers.value ? 'on' : 'off',
    ignoreTrimWhitespace: ignoreWhitespace.value,
    minimap: { enabled: showMinimap.value },
    padding: { top: 16, bottom: 16 },
  });

  diffEditor.setModel({ original: originalModel, modified: modifiedModel });

  // Use a small delay to ensure sub-editors are fully ready to accept options
  setTimeout(() => {
    applyMinimapOption();
  }, 100);

  themeWatcher = watchThemeChangeForDiffEditor(diffEditor);

  const originalEditor = diffEditor.getOriginalEditor();
  const modifiedEditor = diffEditor.getModifiedEditor();

  originalEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {});
  modifiedEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {});

  originalEditor.onDidChangeModelContent(() => {
    leftContent.value = originalEditor.getValue() || '';
    saveToStorage(STORAGE_KEYS.leftContent, leftContent.value);
  });
  modifiedEditor.onDidChangeModelContent(() => {
    rightContent.value = modifiedEditor.getValue() || '';
    saveToStorage(STORAGE_KEYS.rightContent, rightContent.value);
  });

  originalEditor.onDidPaste(() => {
    setTimeout(() => {
      addHistory(originalEditor.getValue());
    }, 50);
  });

  modifiedEditor.onDidPaste(() => {
    setTimeout(() => {
      addHistory(modifiedEditor.getValue());
    }, 50);
  });
};

const swapContent = () => {
  const originalValue = diffEditor?.getOriginalEditor().getValue() || '';
  const modifiedValue = diffEditor?.getModifiedEditor().getValue() || '';
  diffEditor?.getOriginalEditor().setValue(modifiedValue);
  diffEditor?.getModifiedEditor().setValue(originalValue);
};

const clearAll = () => {
  diffEditor?.getOriginalEditor().setValue('');
  diffEditor?.getModifiedEditor().setValue('');
};

const findNextDiff = (editor: monaco.editor.IStandaloneCodeEditor) => {
  const currentPosition = editor.getPosition();
  if (!currentPosition) return null;
  const diffs = diffEditor?.getLineChanges();
  if (!diffs || diffs.length === 0) return null;
  const nextDiffs = diffs.filter((d: monaco.editor.ILineChange) => d.originalStartLineNumber > currentPosition.lineNumber || d.modifiedStartLineNumber > currentPosition.lineNumber);
  if (nextDiffs.length > 0) {
    return nextDiffs.reduce((prev: monaco.editor.ILineChange, curr: monaco.editor.ILineChange) => {
      const prevLine = Math.min(prev.originalStartLineNumber, prev.modifiedStartLineNumber);
      const currLine = Math.min(curr.originalStartLineNumber, curr.modifiedStartLineNumber);
      return currLine < prevLine ? curr : prev;
    });
  }
  return null;
};

const findPrevDiff = (editor: monaco.editor.IStandaloneCodeEditor) => {
  const currentPosition = editor.getPosition();
  if (!currentPosition) return null;
  const diffs = diffEditor?.getLineChanges();
  if (!diffs || diffs.length === 0) return null;
  const prevDiffs = diffs.filter((d: monaco.editor.ILineChange) => d.originalEndLineNumber < currentPosition.lineNumber || d.modifiedEndLineNumber < currentPosition.lineNumber);
  if (prevDiffs.length > 0) {
    return prevDiffs.reduce((prev: monaco.editor.ILineChange, curr: monaco.editor.ILineChange) => {
      const prevLine = Math.max(prev.originalEndLineNumber, prev.modifiedEndLineNumber);
      const currLine = Math.max(curr.originalEndLineNumber, curr.modifiedEndLineNumber);
      return currLine > prevLine ? curr : prev;
    });
  }
  return null;
};

const goToNextDiff = () => {
  if (!diffEditor) return;
  const originalEditor = diffEditor.getOriginalEditor();
  const modifiedEditor = diffEditor.getModifiedEditor();
  const nextDiff = findNextDiff(originalEditor) || findNextDiff(modifiedEditor);
  if (nextDiff) {
    originalEditor.revealLineInCenter(nextDiff.originalStartLineNumber);
    modifiedEditor.revealLineInCenter(nextDiff.modifiedStartLineNumber);
  }
};

const goToPrevDiff = () => {
  if (!diffEditor) return;
  const originalEditor = diffEditor.getOriginalEditor();
  const modifiedEditor = diffEditor.getModifiedEditor();
  const prevDiff = findPrevDiff(originalEditor) || findPrevDiff(modifiedEditor);
  if (prevDiff) {
    originalEditor.revealLineInCenter(prevDiff.originalEndLineNumber);
    modifiedEditor.revealLineInCenter(prevDiff.modifiedEndLineNumber);
  }
};

const pasteTo = async (side: 'original' | 'modified') => {
  try {
    const text = await navigator.clipboard.readText();
    if (side === 'original') {
      diffEditor?.getOriginalEditor().setValue(text);
    } else {
      diffEditor?.getModifiedEditor().setValue(text);
    }
    addHistory(text);
  } catch (err) {
    console.error('Cannot read clipboard:', err);
  }
};

const handleHistorySelect = ({ content, side }: { content: string, side: 'original' | 'modified' }) => {
  if (side === 'original') {
    diffEditor?.getOriginalEditor().setValue(content);
  } else {
    diffEditor?.getModifiedEditor().setValue(content);
  }
  showHistory.value = false;
};

const copyFrom = async (side: 'original' | 'modified') => {
  try {
    const text = side === 'original' ? diffEditor?.getOriginalEditor().getValue() : diffEditor?.getModifiedEditor().getValue();
    if (text) await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Cannot copy to clipboard:', err);
  }
};

const applyMinimapOption = () => {
  if (!diffEditor) return;
  const enabled = showMinimap.value;
  // Apply to the diff editor itself
  diffEditor.updateOptions({ minimap: { enabled } });
  // Explicitly apply to both internal editors as DiffEditor doesn't always propagate this correctly
  diffEditor.getOriginalEditor().updateOptions({ minimap: { enabled } });
  diffEditor.getModifiedEditor().updateOptions({ minimap: { enabled } });
};

onMounted(initMonacoDiffEditor);

onBeforeUnmount(() => {
  themeWatcher?.();
  diffEditor?.dispose();
});

watch(diffMode, (newMode) => {
  diffEditor?.updateOptions({
    renderSideBySide: newMode === 'split'
  });
  saveToStorage(STORAGE_KEYS.diffMode, newMode);
});

watch(showLineNumbers, (newValue) => {
  diffEditor?.updateOptions({ lineNumbers: newValue ? 'on' : 'off' });
  saveToStorage(STORAGE_KEYS.showLineNumbers, newValue);
});

watch(ignoreWhitespace, (newValue) => {
  diffEditor?.updateOptions({ ignoreTrimWhitespace: newValue });
  saveToStorage(STORAGE_KEYS.ignoreWhitespace, newValue);
});

watch(wordWrapEnabled, (newValue) => {
  diffEditor?.updateOptions({ wordWrap: newValue ? 'on' : 'off' });
  saveToStorage(STORAGE_KEYS.wordWrapEnabled, newValue);
});

watch(showMinimap, (newValue) => {
  applyMinimapOption();
  saveToStorage(STORAGE_KEYS.showMinimap, newValue);
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
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
          <CustomCheckbox
            v-model="ignoreWhitespace"
            :label="$t('tools.diff.ignoreWhitespace')"
          />
          <CustomCheckbox
            v-model="wordWrapEnabled"
            :label="$t('tools.diff.wordWrap')"
          />

          <!-- Unicode 解码开关：选中=把左右两侧的 \uXXXX 解码成中文 -->
          <button
            @click="toggleDecodeUnicode"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-all border flex items-center space-x-1"
            :class="decodeUnicode ? 'bg-primary/10 text-primary border-primary/20' : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'"
            :title="$t('tools.diff.unicodeDecodeDesc')"
          >
            <Languages class="w-3.5 h-3.5" />
            <span>{{ $t('tools.diff.unicodeDecode') }}</span>
          </button>

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
              <button @click="formatSide('original')" :title="$t('tools.diff.format')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                <Wand2 class="w-3.5 h-3.5" />
              </button>
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
              <button @click="formatSide('modified')" :title="$t('tools.diff.format')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                <Wand2 class="w-3.5 h-3.5" />
              </button>
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
          <div class="flex items-center space-x-1">
            <button @click="formatSide('original')" :title="$t('tools.diff.formatLeft')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
              <Wand2 class="w-3.5 h-3.5" />
              <span class="sr-only">{{ $t('tools.diff.formatLeft') }}</span>
            </button>
            <button @click="formatSide('modified')" :title="$t('tools.diff.formatRight')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
              <Wand2 class="w-3.5 h-3.5" />
              <span class="sr-only">{{ $t('tools.diff.formatRight') }}</span>
            </button>
          </div>
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
            <li><strong>{{ $t('tools.diff.unicodeDecode') }}:</strong> {{ $t('tools.diff.unicodeDecodeDesc') }}</li>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import * as monaco from 'monaco-editor';
import { HelpCircle, FileDiff, ArrowUp, ArrowDown, ArrowRightLeft, Trash2, ClipboardPaste, Copy, X, History, Map, Languages, Wand2, AlertCircle } from 'lucide-vue-next';
import { getMonacoTheme, watchThemeChangeForDiffEditor, registerGlobalShortcutsForDiffEditor } from '../utils/monaco-theme';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';
import CustomCheckbox from '../components/CustomCheckbox.vue';
import { useHistory } from '../composables/useHistory';
import { useThemeStore } from '../stores/theme';
import HistoryModal from '../components/HistoryModal.vue';
import JSON5 from 'json5';
import { format as formatSQL } from 'sql-formatter';
import { xml2js, js2xml } from 'xml-js';

const diffEditorRef = ref<HTMLElement | null>(null);
let diffEditor: monaco.editor.IStandaloneDiffEditor | null = null;
let originalModel: monaco.editor.ITextModel | null = null;
let modifiedModel: monaco.editor.ITextModel | null = null;
let originalContentListener: monaco.IDisposable | null = null;
let modifiedContentListener: monaco.IDisposable | null = null;
let originalPasteListener: monaco.IDisposable | null = null;
let modifiedPasteListener: monaco.IDisposable | null = null;
let originalPasteTimer: NodeJS.Timeout | null = null;
let modifiedPasteTimer: NodeJS.Timeout | null = null;
let minimapTimer: NodeJS.Timeout | null = null;
let themeWatcher: (() => void) | null = null;

const showHelp = ref(false);
const showHistory = ref(false);
const errorMessage = ref('');
let errorTimer: NodeJS.Timeout | null = null;

const themeStore = useThemeStore();
const { history, addHistory, deleteHistory, clearHistory, updateMaxItems } = useHistory('diff', themeStore.historyLimit.value);

watch(() => themeStore.historyLimit.value, (newLimit) => {
  updateMaxItems(newLimit);
});

const route = useRoute();

const STORAGE_KEYS = {
  leftContent: 'diff-left-content',
  rightContent: 'diff-right-content',
  diffMode: 'diff-mode',
  ignoreWhitespace: 'diff-ignore-whitespace',
  showLineNumbers: 'diff-show-line-numbers',
  theme: 'diff-theme',
  wordWrapEnabled: 'diff-word-wrap-enabled',
  showMinimap: 'diff-show-minimap',
  decodeUnicode: 'diff-decode-unicode',
  leftDecodeSnapshot: 'diff-left-decode-snapshot',
  rightDecodeSnapshot: 'diff-right-decode-snapshot'
};

const leftContent = ref(loadFromStorage(STORAGE_KEYS.leftContent, 'function sayHello() {\n  console.log("Hello, world!");\n}'));
const rightContent = ref(loadFromStorage(STORAGE_KEYS.rightContent, '  function sayHello() {\n    console.log("Hello, world!");\n  }\n'));
const diffMode = ref<'split' | 'inline'>(loadFromStorage(STORAGE_KEYS.diffMode, 'split'));
const ignoreWhitespace = ref(loadFromStorage(STORAGE_KEYS.ignoreWhitespace, false));
const showLineNumbers = ref(loadFromStorage(STORAGE_KEYS.showLineNumbers, true));
const wordWrapEnabled = ref(loadFromStorage(STORAGE_KEYS.wordWrapEnabled, true));
const showMinimap = ref(loadFromStorage(STORAGE_KEYS.showMinimap, false));
const decodeUnicode = ref(loadFromStorage(STORAGE_KEYS.decodeUnicode, false));

// Unicode 解码快照持久化
const leftDecodeSnapshot = ref<string | null>(loadFromStorage(STORAGE_KEYS.leftDecodeSnapshot, null));
const rightDecodeSnapshot = ref<string | null>(loadFromStorage(STORAGE_KEYS.rightDecodeSnapshot, null));

/**
 * 把文本里的字面量 \uXXXX 解码成对应字符（如 \u4e2d → 中）。
 */
const decodeUnicodeText = (text: string): string => {
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
};

/**
 * 检查并应用来自路由状态（history.state）中的单侧内容传递
 */
const applyRouteStateIfPresent = () => {
  const state = window.history.state;
  if (state && (state.targetSide === 'left' || state.targetSide === 'right') && typeof state.content === 'string') {
    const isLeft = state.targetSide === 'left';
    const targetContent = state.content;
    if (isLeft) {
      leftContent.value = targetContent;
      saveToStorage(STORAGE_KEYS.leftContent, targetContent);
      // 清除旧快照，并在开启 Unicode 解码时重新基于新内容建立快照
      leftDecodeSnapshot.value = decodeUnicode.value ? targetContent : null;
      saveToStorage(STORAGE_KEYS.leftDecodeSnapshot, leftDecodeSnapshot.value);
    } else {
      rightContent.value = targetContent;
      saveToStorage(STORAGE_KEYS.rightContent, targetContent);
      rightDecodeSnapshot.value = decodeUnicode.value ? targetContent : null;
      saveToStorage(STORAGE_KEYS.rightDecodeSnapshot, rightDecodeSnapshot.value);
    }
  }
};

const cleanupEditorResources = () => {
  if (originalPasteTimer) clearTimeout(originalPasteTimer);
  if (modifiedPasteTimer) clearTimeout(modifiedPasteTimer);
  if (minimapTimer) clearTimeout(minimapTimer);
  originalContentListener?.dispose();
  modifiedContentListener?.dispose();
  originalPasteListener?.dispose();
  modifiedPasteListener?.dispose();
  themeWatcher?.();
  themeWatcher = null;
  if (diffEditor) {
    diffEditor.dispose();
    diffEditor = null;
  }
  if (originalModel) {
    originalModel.dispose();
    originalModel = null;
  }
  if (modifiedModel) {
    modifiedModel.dispose();
    modifiedModel = null;
  }
};

const initMonacoDiffEditor = async () => {
  await nextTick();
  if (!diffEditorRef.value) return;

  cleanupEditorResources();

  // 1. 优先应用路由定向传参
  applyRouteStateIfPresent();

  // 2. 加载最新的内容
  leftContent.value = loadFromStorage(STORAGE_KEYS.leftContent, leftContent.value);
  rightContent.value = loadFromStorage(STORAGE_KEYS.rightContent, rightContent.value);

  // 3. 计算初始显示内容（若开启 Unicode 解码，则做解码展示并确保快照已存）
  let initialLeft = leftContent.value;
  let initialRight = rightContent.value;
  if (decodeUnicode.value) {
    if (leftDecodeSnapshot.value === null) {
      leftDecodeSnapshot.value = leftContent.value;
      saveToStorage(STORAGE_KEYS.leftDecodeSnapshot, leftDecodeSnapshot.value);
    }
    if (rightDecodeSnapshot.value === null) {
      rightDecodeSnapshot.value = rightContent.value;
      saveToStorage(STORAGE_KEYS.rightDecodeSnapshot, rightDecodeSnapshot.value);
    }
    initialLeft = decodeUnicodeText(leftDecodeSnapshot.value);
    initialRight = decodeUnicodeText(rightDecodeSnapshot.value);
  }

  originalModel = monaco.editor.createModel(initialLeft, 'text/plain');
  modifiedModel = monaco.editor.createModel(initialRight, 'text/plain');

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

  minimapTimer = setTimeout(() => {
    applyMinimapOption();
  }, 100);

  themeWatcher = watchThemeChangeForDiffEditor(diffEditor);
  registerGlobalShortcutsForDiffEditor(diffEditor);

  const originalEditor = diffEditor.getOriginalEditor();
  const modifiedEditor = diffEditor.getModifiedEditor();

  originalEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {});
  modifiedEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {});

  originalContentListener = originalEditor.onDidChangeModelContent(() => {
    if (originalEditor) {
      leftContent.value = originalEditor.getValue() || '';
      saveToStorage(STORAGE_KEYS.leftContent, leftContent.value);
    }
  });
  modifiedContentListener = modifiedEditor.onDidChangeModelContent(() => {
    if (modifiedEditor) {
      rightContent.value = modifiedEditor.getValue() || '';
      saveToStorage(STORAGE_KEYS.rightContent, rightContent.value);
    }
  });

  originalPasteListener = originalEditor.onDidPaste(() => {
    if (originalPasteTimer) clearTimeout(originalPasteTimer);
    originalPasteTimer = setTimeout(() => {
      if (originalEditor) {
        addHistory(originalEditor.getValue());
      }
    }, 50);
  });

  modifiedPasteListener = modifiedEditor.onDidPaste(() => {
    if (modifiedPasteTimer) clearTimeout(modifiedPasteTimer);
    modifiedPasteTimer = setTimeout(() => {
      if (modifiedEditor) {
        addHistory(modifiedEditor.getValue());
      }
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


const showError = (message: string) => {
  errorMessage.value = message;
  if (errorTimer) clearTimeout(errorTimer);
  errorTimer = setTimeout(() => {
    errorMessage.value = '';
  }, 5000);
};

/**
 * 自动检测文本格式类型：JSON / XML / SQL，无法识别时返回 null。
 * @param text 待检测的文本
 * @returns 检测到的格式类型
 */
const detectFormat = (text: string): 'json' | 'xml' | 'sql' | null => {
  const trimmed = text.trim();
  if (!trimmed) return null;

  // JSON：以 { 或 [ 开头并尝试解析
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON5.parse(trimmed);
      return 'json';
    } catch {
      // 形似 JSON 但解析失败，可能是格式错误的 JSON，不返回 json
    }
  }

  // XML：以 < 开头，标签结构闭合
  if (trimmed.startsWith('<') && trimmed.includes('>')) {
    try {
      xml2js(trimmed);
      return 'xml';
    } catch {
      // 解析失败则不是合法 XML
    }
  }

  // SQL：以常见 SQL 关键字开头
  const upper = trimmed.toUpperCase();
  const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'WITH', 'GRANT', 'REVOKE', 'SET', 'USE', 'SHOW', 'TRUNCATE', 'MERGE', 'REPLACE'];
  if (sqlKeywords.some(kw => upper.startsWith(kw))) {
    return 'sql';
  }

  return null;
};

/**
 * 按检测到的类型格式化文本。
 * @param text 原始文本
 * @returns 格式化后的文本
 */
const formatText = (text: string): string => {
  const type = detectFormat(text);
  if (!type) {
    throw new Error('无法识别内容格式，仅支持 JSON / XML / SQL 格式化');
  }

  if (type === 'json') {
    const parsed = JSON5.parse(text);
    return JSON.stringify(parsed, null, 2);
  }

  if (type === 'xml') {
    const compact = xml2js(text, { compact: true });
    return js2xml(compact, { compact: true, spaces: 2, attributesKey: '_attributes' });
  }

  // SQL
  return formatSQL(text, { language: 'sql', tabWidth: 2, keywordCase: 'upper' });
};

/**
 * 格式化指定一侧（左侧/右侧）编辑器的内容。
 * @param side 编辑器侧（original=左，modified=右）
 */
const formatSide = (side: 'original' | 'modified') => {
  if (!diffEditor) return;
  const editor = side === 'original' ? diffEditor.getOriginalEditor() : diffEditor.getModifiedEditor();
  const text = editor.getValue() || '';
  if (!text.trim()) return;

  try {
    const formatted = formatText(text);
    if (formatted !== text) {
      editor.setValue(formatted);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '格式化失败';
    showError(message);
  }
};

// Unicode 解码开关：选中=两边都把 \uXXXX 解码成中文，去掉=两边都还原。
// 快照还原模式：开启时分别保存左右原始内容，关闭时一键还原（支持来回切换不丢数据）。
// 快照持久化到 localStorage：即使切走页面再回来，关闭开关也能还原原始内容。
const toggleDecodeUnicode = () => {
  if (!diffEditor) return;
  const originalEditor = diffEditor.getOriginalEditor();
  const modifiedEditor = diffEditor.getModifiedEditor();
  const turningOn = !decodeUnicode.value;

  if (turningOn) {
    // 开启：保存两侧原始内容，然后对当前内容应用解码
    leftDecodeSnapshot.value = originalEditor.getValue() || '';
    rightDecodeSnapshot.value = modifiedEditor.getValue() || '';
    saveToStorage(STORAGE_KEYS.leftDecodeSnapshot, leftDecodeSnapshot.value);
    saveToStorage(STORAGE_KEYS.rightDecodeSnapshot, rightDecodeSnapshot.value);
    decodeUnicode.value = true;
    originalEditor.setValue(decodeUnicodeText(leftDecodeSnapshot.value));
    modifiedEditor.setValue(decodeUnicodeText(rightDecodeSnapshot.value));
  } else {
    // 关闭：还原为开启前保存的两侧原始内容
    if (leftDecodeSnapshot.value !== null) {
      originalEditor.setValue(leftDecodeSnapshot.value);
    }
    if (rightDecodeSnapshot.value !== null) {
      modifiedEditor.setValue(rightDecodeSnapshot.value);
    }
    leftDecodeSnapshot.value = null;
    rightDecodeSnapshot.value = null;
    saveToStorage(STORAGE_KEYS.leftDecodeSnapshot, null);
    saveToStorage(STORAGE_KEYS.rightDecodeSnapshot, null);
    decodeUnicode.value = false;
  }
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
  cleanupEditorResources();
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

watch(decodeUnicode, (newValue) => {
  saveToStorage(STORAGE_KEYS.decodeUnicode, newValue);
});

watch(() => route.fullPath, () => {
  if (diffEditor) {
    applyRouteStateIfPresent();
    const state = window.history.state;
    if (state && (state.targetSide === 'left' || state.targetSide === 'right') && typeof state.content === 'string') {
      const isLeft = state.targetSide === 'left';
      const targetContent = state.content;
      const displayVal = decodeUnicode.value ? decodeUnicodeText(targetContent) : targetContent;
      if (isLeft) {
        diffEditor.getOriginalEditor().setValue(displayVal);
      } else {
        diffEditor.getModifiedEditor().setValue(displayVal);
      }
    }
  }
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
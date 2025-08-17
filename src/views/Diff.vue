<template>
  <div class="h-screen flex flex-col bg-background text-foreground">
    <!-- 顶部标题栏 -->
    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <ToolSwitcher />
            <button @click="$router.push('/')" class="btn-icon" :title="$t('app.back')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="flex items-center space-x-2">
              <h1 class="text-xl font-semibold">{{ $t('tools.diff.name') }}</h1>
              <div class="relative group">
                <HelpCircle class="h-5 w-5 text-muted-foreground cursor-pointer" />
                <div class="absolute top-full mt-2 w-80 bg-card border rounded-lg shadow-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p class="font-bold mb-2">{{ $t('tools.diff.help.title') }}</p>
                  <p class="mb-1">{{ $t('tools.diff.help.description') }}</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong class="font-semibold">{{ $t('tools.diff.sideBySide') }}:</strong> {{ $t('tools.diff.help.features.sideBySide') }}</li>
                    <li><strong class="font-semibold">{{ $t('tools.diff.inline') }}:</strong> {{ $t('tools.diff.help.features.inline') }}</li>
                  </ul>
                  <p class="font-bold mb-1">{{ $t('tools.diff.help.coreFeatures') }}:</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong class="font-semibold">{{ $t('tools.diff.ignoreWhitespace') }}:</strong> {{ $t('tools.diff.help.features.ignoreWhitespace') }}</li>
                    <li><strong class="font-semibold">{{ $t('tools.diff.showLineNumbers') }}:</strong> {{ $t('tools.diff.help.features.lineNumbers') }}</li>
                    <li><strong class="font-semibold">{{ $t('tools.diff.theme') }}:</strong> {{ $t('tools.diff.help.features.theme') }}</li>
                  </ul>
                  <p class="font-bold mb-1">{{ $t('tools.diff.help.buttons.title') }}:</p>
                  <ul class="list-disc list-inside text-xs">
                    <li><strong class="font-semibold">{{ $t('tools.diff.previousDiff') }}/{{ $t('tools.diff.nextDiff') }}:</strong> {{ $t('tools.diff.help.buttons.navigation') }}</li>
                    <li><strong class="font-semibold">{{ $t('tools.diff.swapContent') }}:</strong> {{ $t('tools.diff.help.buttons.swap') }}</li>
                    <li><strong class="font-semibold">{{ $t('tools.diff.clearAll') }}:</strong> {{ $t('tools.diff.help.buttons.clear') }}</li>
                    <li><strong class="font-semibold">{{ $t('ui.buttons.paste') }}/{{ $t('ui.buttons.copy') }}:</strong> {{ $t('tools.diff.help.buttons.clipboard') }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>

    <!-- 工具栏 -->
    <div class="container mx-auto px-4 py-3 border-b border-border">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-6">
          <div class="flex items-center space-x-2" title="切换分屏或内联对比模式">
            <label class="text-sm font-medium">{{ $t('tools.diff.mode') }}:</label>
            <select v-model="diffMode" class="text-sm px-2 py-1 border border-border rounded bg-background">
              <option value="split">{{ $t('tools.diff.sideBySide') }}</option>
              <option value="inline">{{ $t('tools.diff.inline') }}</option>
            </select>
          </div>
          <div class="flex items-center space-x-2" title="切换编辑器的主题颜色">
            <label class="text-sm font-medium">{{ $t('tools.diff.theme') }}:</label>
            <select v-model="theme" class="text-sm px-2 py-1 border border-border rounded bg-background">
              <option value="vs-dark">{{ $t('tools.diff.darkTheme') }}</option>
              <option value="vs">{{ $t('tools.diff.lightTheme') }}</option>
            </select>
          </div>
          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2" title="忽略每行开头和结尾的空格和制表符。用于专注于内容本身的变更。">
              <input type="checkbox" v-model="ignoreWhitespace" class="rounded" />
              <span class="text-sm">{{ $t('tools.diff.ignoreWhitespace') }}</span>
            </label>
            <label class="flex items-center space-x-2" title="显示或隐藏行号">
              <input type="checkbox" v-model="showLineNumbers" id="showLineNumbers" class="rounded" />
              <label for="showLineNumbers" class="text-sm">{{ $t('tools.diff.showLineNumbers') }}</label>
            </label>
            <label class="flex items-center space-x-2" title="自动换行">
              <input type="checkbox" v-model="wordWrapEnabled" class="rounded">
              <span class="text-sm">{{ $t('tools.diff.wordWrap') }}</span>
            </label>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button @click="goToPrevDiff" title="跳转到上一个差异" class="px-3 py-1.5 text-sm btn-secondary rounded-md">
            &uarr; {{ $t('tools.diff.previousDiff') }}
          </button>
          <button @click="goToNextDiff" title="跳转到下一个差异" class="px-3 py-1.5 text-sm btn-secondary rounded-md">
            &darr; {{ $t('tools.diff.nextDiff') }}
          </button>
          <button @click="swapContent" title="交换左右两边的文本内容" class="px-3 py-1.5 text-sm btn-secondary rounded-md">
            {{ $t('tools.diff.swapContent') }}
          </button>
          <button @click="clearAll" title="清空两边的所有文本" class="px-3 py-1.5 text-sm btn-destructive rounded-md">
            {{ $t('tools.diff.clearAll') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="flex-1 container mx-auto px-4 py-4 flex flex-col">
      <div class="flex-1 flex flex-col border border-border rounded-lg overflow-hidden">
        <!-- Headers for split view -->
        <div v-if="diffMode === 'split'" class="grid grid-cols-2">
          <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-r border-border">
            <span class="text-sm font-medium">{{ $t('tools.diff.leftPanel') }}</span>
            <div class="flex items-center space-x-2">
              <button @click="pasteTo('original')" title="粘贴内容到左侧" class="text-xs px-2 py-1 btn-secondary rounded">{{ $t('tools.diff.pasteLeft') }}</button>
              <button @click="copyFrom('original')" title="复制左侧内容" class="text-xs px-2 py-1 btn-secondary rounded">{{ $t('tools.diff.copyLeft') }}</button>
            </div>
          </div>
          <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <span class="text-sm font-medium">{{ $t('tools.diff.rightPanel') }}</span>
            <div class="flex items-center space-x-2">
              <button @click="pasteTo('modified')" title="粘贴内容到右侧" class="text-xs px-2 py-1 btn-secondary rounded">{{ $t('tools.diff.pasteRight') }}</button>
              <button @click="copyFrom('modified')" title="复制右侧内容" class="text-xs px-2 py-1 btn-secondary rounded">{{ $t('tools.diff.copyRight') }}</button>
            </div>
          </div>
        </div>
        <!-- Header for inline view -->
        <div v-else class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
          <span class="text-sm font-medium">{{ $t('tools.diff.name') }} ({{ $t('tools.diff.inline') }})</span>
        </div>

        <!-- The actual editor container -->
        <div class="flex-1 relative">
          <div ref="diffEditorRef" class="absolute inset-0"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import * as monaco from 'monaco-editor';
import { HelpCircle } from 'lucide-vue-next';
import ToolSwitcher from '../components/ToolSwitcher.vue';
import ThemeToggleButton from '../components/ThemeToggleButton.vue';
import { getMonacoTheme, watchThemeChangeForDiffEditor } from '../utils/monaco-theme';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';

// Refs
const diffEditorRef = ref<HTMLElement | null>(null);

// Monaco editor instance
let diffEditor: monaco.editor.IStandaloneDiffEditor | null = null;

// Theme watcher cleanup function
let themeWatcher: (() => void) | null = null;

// Local storage keys
const STORAGE_KEYS = {
  leftContent: 'diff-left-content',
  rightContent: 'diff-right-content',
  diffMode: 'diff-mode',
  ignoreWhitespace: 'diff-ignore-whitespace',
  showLineNumbers: 'diff-show-line-numbers',
  theme: 'diff-theme',
  wordWrapEnabled: 'diff-word-wrap-enabled'
};



// State - Load initial values from local storage
const leftContent = ref(loadFromStorage(STORAGE_KEYS.leftContent,
`function sayHello() {
  console.log("Hello, world!");
}`
));
const rightContent = ref(loadFromStorage(STORAGE_KEYS.rightContent,
`  function sayHello() {
    console.log("Hello, world!");
  }
`
));
const diffMode = ref<'split' | 'inline'>(loadFromStorage(STORAGE_KEYS.diffMode, 'split'));
const ignoreWhitespace = ref(loadFromStorage(STORAGE_KEYS.ignoreWhitespace, false));
const showLineNumbers = ref(loadFromStorage(STORAGE_KEYS.showLineNumbers, true));
const theme = ref(loadFromStorage(STORAGE_KEYS.theme, 'vs-dark'));
const wordWrapEnabled = ref(loadFromStorage(STORAGE_KEYS.wordWrapEnabled, true));

// Functions
const initMonacoDiffEditor = async () => {
  await nextTick();
  if (!diffEditorRef.value) return;

  // Destroy old instance
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
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
    // 根据状态初始化
    renderSideBySide: diffMode.value === 'split',
    lineNumbers: showLineNumbers.value ? 'on' : 'off',
    ignoreTrimWhitespace: ignoreWhitespace.value,
    minimap: { enabled: diffMode.value === 'split' },
  });

  diffEditor.setModel({
    original: originalModel,
    modified: modifiedModel,
  });

  // Set theme watcher
  themeWatcher = watchThemeChangeForDiffEditor(diffEditor);

  // Disable save shortcut (Ctrl+S / Cmd+S)
  const originalEditor = diffEditor.getOriginalEditor();
  const modifiedEditor = diffEditor.getModifiedEditor();

  originalEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    // Disable default save behavior, do nothing
  });
  modifiedEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    // 禁用默认保存行为，什么都不做
  });

  // Listen to content changes to keep state synchronized and save to local storage
  diffEditor.getOriginalEditor().onDidChangeModelContent(() => {
    leftContent.value = diffEditor?.getOriginalEditor().getValue() || '';
    saveToStorage(STORAGE_KEYS.leftContent, leftContent.value);
  });
  diffEditor.getModifiedEditor().onDidChangeModelContent(() => {
    rightContent.value = diffEditor?.getModifiedEditor().getValue() || '';
    saveToStorage(STORAGE_KEYS.rightContent, rightContent.value);
  });
};

// --- Toolbar operations ---

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

// Helper to find next/previous diff
const findNextDiff = (editor: monaco.editor.IStandaloneCodeEditor) => {
  const currentPosition = editor.getPosition();
  if (!currentPosition) return null;

  const diffs = diffEditor?.getLineChanges();
  if (!diffs || diffs.length === 0) return null;

  // Filter diffs that are after the current position
  const nextDiffs = diffs.filter((d: monaco.editor.ILineChange) => d.originalStartLineNumber > currentPosition.lineNumber || d.modifiedStartLineNumber > currentPosition.lineNumber);
  if (nextDiffs.length > 0) {
    // Find the closest next diff
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

  // Filter diffs that are before the current position
  const prevDiffs = diffs.filter((d: monaco.editor.ILineChange) => d.originalEndLineNumber < currentPosition.lineNumber || d.modifiedEndLineNumber < currentPosition.lineNumber);
  if (prevDiffs.length > 0) {
    // Find the closest previous diff
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

// --- Clipboard operations ---
const pasteTo = async (side: 'original' | 'modified') => {
  try {
    const text = await navigator.clipboard.readText();
    if (side === 'original') {
      diffEditor?.getOriginalEditor().setValue(text);
    } else {
      diffEditor?.getModifiedEditor().setValue(text);
    }
  } catch (err) {
    console.error('Cannot read clipboard:', err);
  }
};

const copyFrom = async (side: 'original' | 'modified') => {
  try {
    const text = side === 'original'
      ? diffEditor?.getOriginalEditor().getValue()
      : diffEditor?.getModifiedEditor().getValue();
    if (text) {
      await navigator.clipboard.writeText(text);
    }
  } catch (err) {
    console.error('Cannot copy to clipboard:', err);
  }
};


// --- Lifecycle and watchers ---

onMounted(initMonacoDiffEditor);

onBeforeUnmount(() => {
  // Clean up theme watcher
  themeWatcher?.();
  // Destroy editor instance
  diffEditor?.dispose();
});

// Watch configuration changes and save to local storage
watch(diffMode, (newMode: 'split' | 'inline') => {
  diffEditor?.updateOptions({
    renderSideBySide: newMode === 'split',
    minimap: { enabled: newMode === 'split' }
  });
  saveToStorage(STORAGE_KEYS.diffMode, newMode);
});

watch(showLineNumbers, (newValue: boolean) => {
  diffEditor?.updateOptions({ lineNumbers: newValue ? 'on' : 'off' });
  saveToStorage(STORAGE_KEYS.showLineNumbers, newValue);
});

watch(ignoreWhitespace, (newValue: boolean) => {
  diffEditor?.updateOptions({ ignoreTrimWhitespace: newValue });
  saveToStorage(STORAGE_KEYS.ignoreWhitespace, newValue);
});

watch(theme, (newTheme: string) => {
  monaco.editor.setTheme(newTheme);
  saveToStorage(STORAGE_KEYS.theme, newTheme);
});

watch(wordWrapEnabled, (newValue: boolean) => {
  const wrapOption = newValue ? 'on' : 'off';
  diffEditor?.updateOptions({ wordWrap: wrapOption });
  saveToStorage(STORAGE_KEYS.wordWrapEnabled, newValue);
});

</script>

<style>
/* Global Monaco Editor Styling */
.monaco-editor .margin, .monaco-editor .monaco-editor-background {
  background-color: transparent;
}

/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent; /* Make track transparent */
}
::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style>
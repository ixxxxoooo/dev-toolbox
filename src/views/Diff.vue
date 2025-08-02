<template>
  <div class="h-screen flex flex-col bg-background text-foreground">
    <!-- 顶部标题栏 -->
    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <ToolSwitcher />
            <button @click="$router.push('/')" class="btn-icon" title="返回主页">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="flex items-center space-x-2">
              <h1 class="text-xl font-semibold">文本对比工具</h1>
              <div class="relative group">
                <HelpCircle class="h-5 w-5 text-muted-foreground cursor-pointer" />
                <div class="absolute top-full mt-2 w-80 bg-card border rounded-lg shadow-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p class="font-bold mb-2">文本对比工具说明</p>
                  <p class="mb-1">基于Monaco Editor的强大文本对比工具，支持实时编辑和高亮差异。</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong class="font-semibold">分屏对比:</strong> 左右两栏显示，便于逐行比较。</li>
                    <li><strong class="font-semibold">内联对比:</strong> 在同一文本流中高亮显示差异。</li>
                  </ul>
                  <p class="font-bold mb-1">核心功能:</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong class="font-semibold">忽略空白:</strong> 忽略行首、行尾的空格和制表符差异，专注于内容变更。</li>
                    <li><strong class="font-semibold">显示行号:</strong> 控制编辑器是否显示行号。</li>
                    <li><strong class="font-semibold">主题:</strong> 切换编辑器显示主题（深色/浅色）。</li>
                  </ul>
                  <p class="font-bold mb-1">按钮说明:</p>
                  <ul class="list-disc list-inside text-xs">
                    <li><strong class="font-semibold">上一个/下一个:</strong> 快速跳转到差异点。</li>
                    <li><strong class="font-semibold">交换内容:</strong> 交换左右两边编辑器的文本。</li>
                    <li><strong class="font-semibold">清空全部:</strong> 清空所有文本内容。</li>
                    <li><strong class="font-semibold">粘贴/复制:</strong> 独立操作左右编辑器的内容。</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 工具栏 -->
    <div class="container mx-auto px-4 py-3 border-b border-border">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-6">
          <div class="flex items-center space-x-2" title="切换分屏或内联对比模式">
            <label class="text-sm font-medium">模式:</label>
            <select v-model="diffMode" class="text-sm px-2 py-1 border border-border rounded bg-background">
              <option value="split">分屏对比</option>
              <option value="inline">内联对比</option>
            </select>
          </div>
          <div class="flex items-center space-x-2" title="切换编辑器的主题颜色">
            <label class="text-sm font-medium">主题:</label>
            <select v-model="theme" class="text-sm px-2 py-1 border border-border rounded bg-background">
              <option value="vs-dark">深色</option>
              <option value="vs">浅色</option>
            </select>
          </div>
          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2" title="忽略每行开头和结尾的空格和制表符。用于专注于内容本身的变更。">
              <input type="checkbox" v-model="ignoreWhitespace" class="rounded" />
              <span class="text-sm">忽略空白</span>
            </label>
            <label class="flex items-center space-x-2" title="显示或隐藏行号">
              <input type="checkbox" v-model="showLineNumbers" id="showLineNumbers" class="rounded" />
              <label for="showLineNumbers" class="text-sm">显示行号</label>
            </label>
            <label class="flex items-center space-x-2" title="自动换行">
              <input type="checkbox" v-model="wordWrapEnabled" class="rounded">
              <span class="text-sm">自动换行</span>
            </label>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button @click="goToPrevDiff" title="跳转到上一个差异" class="px-3 py-1.5 text-sm btn-secondary rounded-md">
            &uarr; 上一个
          </button>
          <button @click="goToNextDiff" title="跳转到下一个差异" class="px-3 py-1.5 text-sm btn-secondary rounded-md">
            &darr; 下一个
          </button>
          <button @click="swapContent" title="交换左右两边的文本内容" class="px-3 py-1.5 text-sm btn-secondary rounded-md">
            交换内容
          </button>
          <button @click="clearAll" title="清空两边的所有文本" class="px-3 py-1.5 text-sm btn-destructive rounded-md">
            清空全部
          </button>
          <ThemeToggleButton />
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="flex-1 container mx-auto px-4 py-4 flex flex-col">
      <div class="flex-1 flex flex-col border border-border rounded-lg overflow-hidden">
        <!-- Headers for split view -->
        <div v-if="diffMode === 'split'" class="grid grid-cols-2">
          <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-r border-border">
            <span class="text-sm font-medium">原始文本</span>
            <div class="flex items-center space-x-2">
              <button @click="pasteTo('original')" title="粘贴内容到左侧" class="text-xs px-2 py-1 btn-secondary rounded">粘贴</button>
              <button @click="copyFrom('original')" title="复制左侧内容" class="text-xs px-2 py-1 btn-secondary rounded">复制</button>
            </div>
          </div>
          <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <span class="text-sm font-medium">修改文本</span>
            <div class="flex items-center space-x-2">
              <button @click="pasteTo('modified')" title="粘贴内容到右侧" class="text-xs px-2 py-1 btn-secondary rounded">粘贴</button>
              <button @click="copyFrom('modified')" title="复制右侧内容" class="text-xs px-2 py-1 btn-secondary rounded">复制</button>
            </div>
          </div>
        </div>
        <!-- Header for inline view -->
        <div v-else class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
          <span class="text-sm font-medium">差异对比 (内联模式)</span>
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

// Refs
const diffEditorRef = ref<HTMLElement | null>(null);

// Monaco 编辑器实例
let diffEditor: monaco.editor.IStandaloneDiffEditor | null = null;

// State
const leftContent = ref(
`function sayHello() {
  console.log("Hello, world!");
}`
);
const rightContent = ref(
`  function sayHello() {
    console.log("Hello, world!");
  }
`
);
const diffMode = ref<'split' | 'inline'>('split');
const ignoreWhitespace = ref(false);
const showLineNumbers = ref(true);
const theme = ref('vs-dark');
const wordWrapEnabled = ref(true); // New state for word wrap

// Functions
const initMonacoDiffEditor = async () => {
  await nextTick();
  if (!diffEditorRef.value) return;

  // 销毁旧实例
  diffEditor?.dispose();

  const originalModel = monaco.editor.createModel(leftContent.value, 'text/plain');
  const modifiedModel = monaco.editor.createModel(rightContent.value, 'text/plain');

  diffEditor = monaco.editor.createDiffEditor(diffEditorRef.value, {
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
  
  // 设置初始主题
  monaco.editor.setTheme(theme.value);

  // 监听内容变化以保持状态同步
  diffEditor.getOriginalEditor().onDidChangeModelContent(() => {
    leftContent.value = diffEditor?.getOriginalEditor().getValue() || '';
  });
  diffEditor.getModifiedEditor().onDidChangeModelContent(() => {
    rightContent.value = diffEditor?.getModifiedEditor().getValue() || '';
  });
};

// --- 工具栏操作 ---

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
  const nextDiffs = diffs.filter(d => d.originalStartLineNumber > currentPosition.lineNumber || d.modifiedStartLineNumber > currentPosition.lineNumber);
  if (nextDiffs.length > 0) {
    // Find the closest next diff
    return nextDiffs.reduce((prev, curr) => {
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
  const prevDiffs = diffs.filter(d => d.originalEndLineNumber < currentPosition.lineNumber || d.modifiedEndLineNumber < currentPosition.lineNumber);
  if (prevDiffs.length > 0) {
    // Find the closest previous diff
    return prevDiffs.reduce((prev, curr) => {
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

// --- 剪贴板操作 ---
const pasteTo = async (side: 'original' | 'modified') => {
  try {
    const text = await navigator.clipboard.readText();
    if (side === 'original') {
      diffEditor?.getOriginalEditor().setValue(text);
    } else {
      diffEditor?.getModifiedEditor().setValue(text);
    }
  } catch (err) {
    console.error('无法读取剪贴板:', err);
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
    console.error('无法复制到剪贴板:', err);
  }
};


// --- 生命周期与监听 ---

onMounted(initMonacoDiffEditor);

onBeforeUnmount(() => {
  diffEditor?.dispose();
});

// 监听配置变化
watch(diffMode, (newMode) => {
  diffEditor?.updateOptions({ 
    renderSideBySide: newMode === 'split',
    minimap: { enabled: newMode === 'split' }
  });
});

watch(showLineNumbers, (newValue) => {
  diffEditor?.updateOptions({ lineNumbers: newValue ? 'on' : 'off' });
});

watch(ignoreWhitespace, (newValue) => {
  diffEditor?.updateOptions({ ignoreTrimWhitespace: newValue });
});

watch(theme, (newTheme) => {
  monaco.editor.setTheme(newTheme);
});

watch(wordWrapEnabled, (newValue) => {
  const wrapOption = newValue ? 'on' : 'off';
  diffEditor?.updateOptions({ wordWrap: wrapOption });
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
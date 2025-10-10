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
                    <li><strong>{{ $t('tools.json.escape') }}:</strong> {{ $t('tools.json.escapeDescription') }}</li>
                    <li><strong>{{ $t('tools.json.unescape') }}:</strong> {{ $t('tools.json.unescapeDescription') }}</li>
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
            <LanguageSwitcher />
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>

    <!-- 工具栏选项 -->
    <div class="container mx-auto px-4 py-3 border-b border-border">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="format" class="rounded"><span class="text-sm">{{ $t('common.labels.format') }}</span></label>
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="minify" class="rounded"><span class="text-sm">{{ $t('common.labels.minify') }}</span></label>
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
        </div>
      </div>
    </div>

    <main class="flex-1 container mx-auto px-4 py-4 flex flex-col">
      <div class="grid gap-4 flex-1" :class="showTreeView ? 'grid-cols-2' : 'grid-cols-1'">
        <div class="flex flex-col border border-border rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <h3 class="text-sm font-medium">{{ $t('common.labels.input') }}</h3>
            <div class="flex items-center space-x-2">
              <button @click="undo" class="text-xs px-2 py-1 btn-secondary rounded" title="撤销 (Ctrl+Z)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                </svg>
              </button>
              <button @click="redo" class="text-xs px-2 py-1 btn-secondary rounded" title="重做 (Ctrl+Y)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/>
                </svg>
              </button>
              <button @click="pasteInput" class="text-xs px-2 py-1 btn-secondary rounded">{{ $t('common.paste') }}</button>
              <button @click="copyInput" class="text-xs px-2 py-1 btn-secondary rounded">{{ $t('common.copy') }}</button>
              <button @click="clearAll" class="text-xs px-2 py-1 btn-destructive rounded">{{ $t('common.buttons.clearAll') }}</button>
            </div>
          </div>
          <div class="flex-1 relative">
            <div ref="editorRef" class="absolute inset-0"></div>
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
      </div>
    </main>
    
    <!-- 错误提示消息 -->
    <Transition name="slide-down">
      <div v-if="errorMessage" class="fixed top-20 left-1/2 transform -translate-x-1/2 max-w-md bg-destructive text-destructive-foreground px-4 py-3 rounded-lg shadow-lg flex items-start space-x-3 z-50">
        <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div class="flex-1">
          <p class="font-medium text-sm">{{ errorMessage }}</p>
        </div>
        <button @click="errorMessage = ''" class="flex-shrink-0 hover:opacity-70">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-down-enter-active {
  transition: all 0.3s ease-out;
}

.slide-down-leave-active {
  transition: all 0.3s ease-in;
}

.slide-down-enter-from {
  transform: translate(-50%, -100px);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translate(-50%, -100px);
  opacity: 0;
}
</style>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import * as monaco from 'monaco-editor';
import JsonTreeView from '../components/JsonTreeView.vue';
import { HelpCircle } from 'lucide-vue-next';
import ToolSwitcher from '../components/ToolSwitcher.vue';
import ThemeToggleButton from '../components/ThemeToggleButton.vue';
import LanguageSwitcher from '../components/LanguageSwitcher.vue';
import { getMonacoTheme, watchThemeChange } from '../utils/monaco-theme';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';

// 添加控制台日志前缀
const LOG_PREFIX = '[JSON模块]';

console.log(`${LOG_PREFIX} 组件初始化开始`);

// Refs
const editorRef = ref<HTMLElement | null>(null);

// Monaco Editor Instance
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

// Theme watcher cleanup function
let themeWatcher: (() => void) | null = null;

// 防止无限循环的标志
let isProcessing = false;

// 错误消息状态
const errorMessage = ref('');
let errorTimer: NodeJS.Timeout | null = null;

// 显示错误消息的函数
const showError = (message: string) => {
  console.error(`${LOG_PREFIX} 显示错误消息:`, message);
  errorMessage.value = message;
  
  // 清除之前的定时器
  if (errorTimer) {
    clearTimeout(errorTimer);
  }
  
  // 5秒后自动隐藏
  errorTimer = setTimeout(() => {
    errorMessage.value = '';
  }, 5000);
};

// Local storage keys
const STORAGE_KEYS = {
  inputText: 'json-input-text',
  operation: 'json-operation',
  indentSize: 'json-indent-size',
  showTreeView: 'json-show-tree-view',
  wordWrapEnabled: 'json-word-wrap-enabled'
};

// State - Load initial values from local storage
const inputText = ref(loadFromStorage(STORAGE_KEYS.inputText, '{ "hello": "world" }'));
const operation = ref(loadFromStorage(STORAGE_KEYS.operation, 'format'));
const indentSize = ref(loadFromStorage(STORAGE_KEYS.indentSize, 2));
const showTreeView = ref(loadFromStorage(STORAGE_KEYS.showTreeView, false));
const wordWrapEnabled = ref(loadFromStorage(STORAGE_KEYS.wordWrapEnabled, true));

console.log(`${LOG_PREFIX} 加载的初始配置:`, {
  operation: operation.value,
  indentSize: indentSize.value,
  showTreeView: showTreeView.value,
  wordWrapEnabled: wordWrapEnabled.value
});

// Computed
const parsedJson = computed(() => {
  try {
    return JSON.parse(inputText.value);
  } catch (e) {
    return null;
  }
});
const isValidJson = computed(() => parsedJson.value !== null);

// 撤销和重做功能 - 使用 Monaco Editor 内置功能
const undo = () => {
  console.log(`${LOG_PREFIX} 执行撤销操作`);
  editor?.trigger('keyboard', 'undo', null);
};

const redo = () => {
  console.log(`${LOG_PREFIX} 执行重做操作`);
  editor?.trigger('keyboard', 'redo', null);
};

// Functions
const processData = () => {
  console.log(`${LOG_PREFIX} processData 开始执行`, {
    operation: operation.value,
    inputLength: inputText.value.length
  });

  if (!inputText.value.trim()) {
    console.log(`${LOG_PREFIX} 输入为空，跳过处理`);
    return;
  }

  // 防止在自动处理时造成无限循环
  if (isProcessing) {
    console.log(`${LOG_PREFIX} 正在处理中，跳过`);
    return;
  }

  try {
    isProcessing = true;
    let resultData = '';

    console.log(`${LOG_PREFIX} 执行操作: ${operation.value}`);

    // 处理转义操作（不需要解析 JSON）
    if (operation.value === 'escape') {
      console.log(`${LOG_PREFIX} 开始转义操作`);
      resultData = JSON.stringify(inputText.value);
      console.log(`${LOG_PREFIX} 转义完成，结果长度: ${resultData.length}`);
    } 
    // 处理去转义操作
    else if (operation.value === 'unescape') {
      console.log(`${LOG_PREFIX} 开始去转义操作`);
      let unescapedData: any;
      
      // 尝试先作为 JSON 字符串解析
      try {
        unescapedData = JSON.parse(inputText.value);
        console.log(`${LOG_PREFIX} 使用 JSON.parse 去转义成功`);
      } catch (parseError) {
        console.log(`${LOG_PREFIX} JSON.parse 失败，使用手动去转义`);
        // 手动去转义
        unescapedData = inputText.value
          .replace(/\\n/g, '\n')   // 去转义换行符
          .replace(/\\r/g, '\r')   // 去转义回车符
          .replace(/\\t/g, '\t')   // 去转义制表符
          .replace(/\\"/g, '"')    // 去转义双引号
          .replace(/\\'/g, "'")    // 去转义单引号
          .replace(/\\\\/g, '\\')  // 去转义反斜杠
        console.log(`${LOG_PREFIX} 手动去转义完成`);
      }
      
      // 去转义后，尝试格式化（如果是对象）
      if (typeof unescapedData === 'object') {
        console.log(`${LOG_PREFIX} 去转义结果是对象，进行格式化`);
        resultData = JSON.stringify(unescapedData, null, indentSize.value);
      } else if (typeof unescapedData === 'string') {
        // 如果去转义后是字符串，尝试解析并格式化
        try {
          const parsed = JSON.parse(unescapedData);
          console.log(`${LOG_PREFIX} 去转义结果可解析为 JSON，进行格式化`);
          resultData = JSON.stringify(parsed, null, indentSize.value);
        } catch {
          // 无法解析为 JSON，直接使用去转义结果
          console.log(`${LOG_PREFIX} 去转义结果无法解析为 JSON，保持原样`);
          resultData = unescapedData;
        }
      } else {
        resultData = String(unescapedData);
      }
    } 
    // 处理格式化和压缩操作（需要解析 JSON）
    else {
      console.log(`${LOG_PREFIX} 开始解析 JSON`);
      const inputData = JSON.parse(inputText.value);
      console.log(`${LOG_PREFIX} JSON 解析成功`);

      if (operation.value === 'minify') {
        console.log(`${LOG_PREFIX} 开始压缩 JSON`);
        resultData = JSON.stringify(inputData);
        console.log(`${LOG_PREFIX} 压缩完成，结果长度: ${resultData.length}`);
      } else if (operation.value === 'format') {
        console.log(`${LOG_PREFIX} 开始格式化 JSON，缩进: ${indentSize.value}`);
        resultData = JSON.stringify(inputData, null, indentSize.value);
        console.log(`${LOG_PREFIX} 格式化完成，结果长度: ${resultData.length}`);
      }
    }

    console.log(`${LOG_PREFIX} 处理成功，更新编辑器内容`);
    // 直接更新编辑器内容
    editor?.setValue(resultData);
    // 同时更新 inputText 以保持同步
    inputText.value = resultData;
  } catch (e: unknown) {
    const error = e as Error;
    console.error(`${LOG_PREFIX} 处理失败:`, error);
    
    // 根据操作类型显示友好的错误提示
    let errorMsg = '';
    
    if (operation.value === 'escape') {
      errorMsg = '转义失败：' + error.message;
    } else if (operation.value === 'unescape') {
      errorMsg = '去转义失败：内容格式不正确';
    } else if (operation.value === 'format') {
      if (error.message.includes('JSON')) {
        errorMsg = '格式化失败：JSON 格式不正确，请检查语法';
      } else if (error.message.includes('position')) {
        // 提取位置信息
        const posMatch = error.message.match(/position (\d+)/);
        if (posMatch) {
          errorMsg = `格式化失败：JSON 语法错误在位置 ${posMatch[1]}`;
        } else {
          errorMsg = '格式化失败：JSON 语法错误';
        }
      } else {
        errorMsg = '格式化失败：' + error.message;
      }
    } else if (operation.value === 'minify') {
      errorMsg = '压缩失败：JSON 格式不正确';
    } else {
      errorMsg = '处理失败：' + error.message;
    }
    
    showError(errorMsg);
    // 不修改编辑器内容，保持用户的输入
  } finally {
    // 使用 setTimeout 确保 setValue 完成后再重置标志
    setTimeout(() => {
      isProcessing = false;
    }, 100);
  }
};

const initEditors = async () => {
  console.log(`${LOG_PREFIX} initEditors 开始执行`);
  await nextTick();
  
  const editorOptions = {
    language: 'json',
    theme: getMonacoTheme(),
    automaticLayout: true,
    minimap: { enabled: false },
    wordWrap: (wordWrapEnabled.value ? 'on' : 'off') as 'on' | 'off',
  };

  console.log(`${LOG_PREFIX} 编辑器配置:`, editorOptions);

  if (editorRef.value) {
    console.log(`${LOG_PREFIX} 创建 Monaco 编辑器`);
    editor = monaco.editor.create(editorRef.value, {
      value: inputText.value,
      ...editorOptions,
    });

    console.log(`${LOG_PREFIX} Monaco 编辑器创建成功`);

    // 监听内容变化
    editor.onDidChangeModelContent(() => {
      const newValue = editor?.getValue() || '';
      console.log(`${LOG_PREFIX} 编辑器内容变化，新长度: ${newValue.length}`);
      
      // 只在非处理状态下更新 inputText 和保存到本地存储
      if (!isProcessing) {
        inputText.value = newValue;
        saveToStorage(STORAGE_KEYS.inputText, inputText.value);
      }
    });

    // 添加撤销快捷键 (Ctrl+Z / Cmd+Z)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, () => {
      console.log(`${LOG_PREFIX} 快捷键撤销`);
      undo();
    });

    // 添加重做快捷键 (Ctrl+Y / Cmd+Y 或 Ctrl+Shift+Z / Cmd+Shift+Z)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, () => {
      console.log(`${LOG_PREFIX} 快捷键重做 (Ctrl+Y)`);
      redo();
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ, () => {
      console.log(`${LOG_PREFIX} 快捷键重做 (Ctrl+Shift+Z)`);
      redo();
    });

    // 添加粘贴快捷键处理 (Ctrl+V / Cmd+V)
    editor.onDidPaste(() => {
      console.log(`${LOG_PREFIX} 检测到粘贴操作`);
      setTimeout(() => {
        const currentText = editor?.getValue() || '';
        // 智能识别粘贴内容
        detectAndSetOperation(currentText);
        // 自动处理
        setTimeout(() => {
          processData();
        }, 50);
      }, 50);
    });

    // 禁用保存快捷键 (Ctrl+S / Cmd+S)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      console.log(`${LOG_PREFIX} 阻止了默认保存行为`);
    });

    // 设置主题监听器
    console.log(`${LOG_PREFIX} 设置主题监听器`);
    themeWatcher = watchThemeChange(editor);
  } else {
    console.error(`${LOG_PREFIX} 编辑器 DOM 元素未找到`);
  }

  console.log(`${LOG_PREFIX} initEditors 完成`);
};

// Toolbar actions
const clearAll = () => {
  console.log(`${LOG_PREFIX} 清空所有内容`);
  editor?.setValue('');
};

// 智能识别粘贴内容并选择合适的操作
const detectAndSetOperation = (text: string) => {
  console.log(`${LOG_PREFIX} 智能识别粘贴内容`);
  
  // 检查是否是转义的字符串（以引号开头和结尾，包含转义字符）
  const isEscapedString = (
    (text.startsWith('"') && text.endsWith('"')) || 
    (text.startsWith("'") && text.endsWith("'"))
  ) && (text.includes('\\n') || text.includes('\\t') || text.includes('\\"') || text.includes('\\\\'));
  
  if (isEscapedString) {
    console.log(`${LOG_PREFIX} 检测到转义字符串，自动切换到去转义模式`);
    operation.value = 'unescape';
    return;
  }
  
  // 尝试解析为 JSON
  try {
    JSON.parse(text);
    // 如果能解析，检查是否是压缩的（没有换行和缩进）
    const isMinified = !text.includes('\n') && !text.includes('  ');
    if (isMinified && text.length > 50) {
      console.log(`${LOG_PREFIX} 检测到压缩的 JSON，自动切换到格式化模式`);
      operation.value = 'format';
    } else {
      console.log(`${LOG_PREFIX} 检测到格式化的 JSON，保持当前模式`);
    }
  } catch (e) {
    console.log(`${LOG_PREFIX} 无法解析为 JSON，保持当前模式`);
  }
};

const pasteInput = async () => {
  console.log(`${LOG_PREFIX} 从剪贴板粘贴`);
  try {
    const text = await navigator.clipboard.readText();
    console.log(`${LOG_PREFIX} 粘贴内容长度: ${text.length}`);
    
    // 先智能识别并设置操作模式
    detectAndSetOperation(text);
    
    // 设置编辑器内容
    editor?.setValue(text);
    
    // 粘贴后自动处理
    setTimeout(() => {
      processData();
    }, 100);
  } catch (error) {
    console.error(`${LOG_PREFIX} 粘贴失败:`, error);
  }
};

const copyInput = () => {
  const text = editor?.getValue() || '';
  console.log(`${LOG_PREFIX} 复制到剪贴板，长度: ${text.length}`);
  navigator.clipboard.writeText(text);
};

// Watchers - Watch state changes and save to local storage
watch(operation, (newValue: string) => {
  console.log(`${LOG_PREFIX} 操作模式改变: ${newValue}`);
  saveToStorage(STORAGE_KEYS.operation, newValue);
  // 切换操作时自动处理
  if (inputText.value.trim()) {
    console.log(`${LOG_PREFIX} 切换操作，自动处理`);
    setTimeout(() => {
      processData();
    }, 100);
  }
});

watch(indentSize, (newValue: number) => {
  console.log(`${LOG_PREFIX} 缩进大小改变: ${newValue}`);
  saveToStorage(STORAGE_KEYS.indentSize, newValue);
  // 缩进改变时，如果是格式化模式，自动重新处理
  if (operation.value === 'format' && inputText.value.trim()) {
    console.log(`${LOG_PREFIX} 缩进改变，自动重新格式化`);
    setTimeout(() => {
      processData();
    }, 100);
  }
});

watch(showTreeView, (newValue: boolean) => {
  console.log(`${LOG_PREFIX} 树形视图改变: ${newValue}`);
  saveToStorage(STORAGE_KEYS.showTreeView, newValue);
});

watch(wordWrapEnabled, (newValue: boolean) => {
  console.log(`${LOG_PREFIX} 自动换行改变: ${newValue}`);
  const wrapOption = newValue ? 'on' : 'off';
  editor?.updateOptions({ wordWrap: wrapOption });
  saveToStorage(STORAGE_KEYS.wordWrapEnabled, newValue);
});

// Lifecycle
onMounted(() => {
  console.log(`${LOG_PREFIX} 组件已挂载，开始初始化编辑器`);
  initEditors();
});

onBeforeUnmount(() => {
  console.log(`${LOG_PREFIX} 组件即将卸载，清理资源`);
  // 清理错误提示定时器
  if (errorTimer) {
    clearTimeout(errorTimer);
  }
  // 清理主题监听器
  themeWatcher?.();
  // 释放编辑器实例
  editor?.dispose();
  console.log(`${LOG_PREFIX} 资源清理完成`);
});

</script>

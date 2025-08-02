<template>
  <div class="h-screen flex flex-col bg-background text-foreground">
    <!-- 顶部标题栏 -->
    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <ToolSwitcher />
            <button @click="$router.push('/')" class="p-2 rounded-lg hover:bg-secondary transition-colors" title="返回主页">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="flex items-center space-x-2">
              <h1 class="text-xl font-semibold">JSON 工具</h1>
              <div class="relative group">
                <HelpCircle class="h-5 w-5 text-muted-foreground cursor-pointer" />
                <div class="absolute top-full mt-2 w-80 bg-card border rounded-lg shadow-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p class="font-bold mb-2">JSON 工具说明</p>
                  <p class="mb-1">这是一个多功能的JSON处理工具，支持格式化、压缩和多种数据格式转换。</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong class="font-semibold">输入/输出编辑器:</strong> 支持语法高亮、实时校验和代码折叠。</li>
                    <li><strong class="font-semibold">树状视图:</strong> 直观展示JSON结构，便于浏览复杂数据。</li>
                  </ul>
                  <p class="font-bold mb-1">核心功能:</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong class="font-semibold">格式化:</strong> 将JSON美化排版，支持2或4空格缩进。</li>
                    <li><strong class="font-semibold">压缩:</strong> 移除JSON中的所有空白字符，减小体积。</li>
                    <li><strong class="font-semibold">转换:</strong> 支持JSON与YAML、XML之间的相互转换。</li>
                  </ul>
                  <p class="font-bold mb-1">按钮说明:</p>
                  <ul class="list-disc list-inside text-xs">
                    <li><strong class="font-semibold">导入文件:</strong> 从本地文件加载内容到输入框。</li>
                    <li><strong class="font-semibold">下载JSON:</strong> 将结果下载为.json文件。</li>
                    <li><strong class="font-semibold">清空:</strong> 清空所有输入和输出内容。</li>
                    <li><strong class="font-semibold">显示/隐藏树状视图:</strong> 切换中间树状视图的显示状态。</li>
                    <li><strong class="font-semibold">自动处理:</strong> 勾选后，输入内容变化时自动进行处理。</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="loadFile" class="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors">导入文件</button>
            <button @click="downloadFile" :disabled="!isValidJson" class="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors disabled:opacity-50">下载JSON</button>
            <button @click="clearAll" class="px-3 py-1.5 text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md transition-colors">清空</button>
          </div>
        </div>
      </div>
    </header>

    <!-- The rest of the template remains the same -->
    <div class="container mx-auto px-4 py-3 border-b border-border">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="format" class="rounded"><span class="text-sm">格式化</span></label>
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="minify" class="rounded"><span class="text-sm">压缩</span></label>
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="convert" class="rounded"><span class="text-sm">转换</span></label>
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="escape" class="rounded"><span class="text-sm">转义</span></label>
          <label class="flex items-center space-x-2"><input type="radio" v-model="operation" value="unescape" class="rounded"><span class="text-sm">去转义</span></label>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="showTreeView = !showTreeView" class="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors">{{ showTreeView ? '隐藏' : '显示' }}树状视图</button>
          <label class="flex items-center space-x-2" title="自动换行">
            <input type="checkbox" v-model="wordWrapEnabled" class="rounded">
            <span class="text-sm">自动换行</span>
          </label>
          <label class="flex items-center space-x-2"><span class="text-sm">缩进:</span>
            <select v-model="indentSize" class="text-sm px-2 py-1 border border-border rounded bg-background">
              <option :value="2">2空格</option>
              <option :value="4">4空格</option>
            </select>
          </label>
          <label class="flex items-center space-x-2"><input type="checkbox" v-model="autoProcess" class="rounded"><span class="text-sm">自动处理</span></label>
        </div>
      </div>
      <div v-if="operation === 'convert'" class="mt-4 pt-4 border-t border-border flex items-center space-x-4">
        <label class="flex items-center space-x-2"><span class="text-sm">从:</span>
          <select v-model="convertFrom" class="text-sm px-2 py-1 border border-border rounded bg-background">
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="xml">XML</option>
          </select>
        </label>
        <label class="flex items-center space-x-2"><span class="text-sm">到:</span>
          <select v-model="convertTo" class="text-sm px-2 py-1 border border-border rounded bg-background">
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="xml">XML</option>
          </select>
        </label>
      </div>
    </div>

    <main class="flex-1 container mx-auto px-4 py-4 flex flex-col">
      <div class="grid gap-4 flex-1" :class="showTreeView ? 'grid-cols-3' : 'grid-cols-2'">
        <div class="flex flex-col border border-border rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <h3 class="text-sm font-medium">输入</h3>
            <div class="flex items-center space-x-2">
              <button @click="pasteInput" class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80">粘贴</button>
              <button @click="copyInput" class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80">复制</button>
            </div>
          </div>
          <div class="flex-1 relative">
            <div ref="inputEditorRef" class="absolute inset-0"></div>
          </div>
        </div>
        <div v-if="showTreeView" class="flex flex-col border border-border rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <h3 class="text-sm font-medium">树状视图</h3>
          </div>
          <div class="flex-1 relative overflow-auto">
            <JsonTreeView v-if="isValidJson && parsedJson" :data="parsedJson" />
            <div v-else class="p-4 text-sm text-muted-foreground">无效的JSON，无法生成树状视图</div>
          </div>
        </div>
        <div class="flex flex-col border border-border rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <h3 class="text-sm font-medium">结果</h3>
            <button @click="copyOutput" class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80">复制</button>
          </div>
          <div class="flex-1 relative">
            <div ref="outputEditorRef" class="absolute inset-0"></div>
          </div>
        </div>
      </div>
      <input ref="fileInput" type="file" class="hidden" @change="handleFileSelect" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import * as monaco from 'monaco-editor';
import * as yaml from 'js-yaml';
import * as xmlJs from 'xml-js';
import JsonTreeView from '../components/JsonTreeView.vue';
import { HelpCircle } from 'lucide-vue-next';
import ToolSwitcher from '../components/ToolSwitcher.vue';

// Refs
const inputEditorRef = ref<HTMLElement | null>(null);
const outputEditorRef = ref<HTMLElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Monaco Editor Instances
let inputEditor: monaco.editor.IStandaloneCodeEditor | null = null;
let outputEditor: monaco.editor.IStandaloneCodeEditor | null = null;

// State
const inputText = ref('{ "hello": "world" }');
const outputText = ref('');
const operation = ref('format');
const indentSize = ref(2);
const autoProcess = ref(true);
const convertFrom = ref('json');
const convertTo = ref('json');
const showTreeView = ref(false);
const wordWrapEnabled = ref(true); // New state for word wrap

// Computed
const parsedJson = computed(() => {
  try {
    return JSON.parse(inputText.value);
  } catch (e) {
    return null;
  }
});
const isValidJson = computed(() => parsedJson.value !== null);

// Functions
const processData = () => {
  if (!inputText.value.trim()) {
    outputText.value = '';
    return;
  }

  try {
    let resultData = '';
    
    // Handle escape/unescape operations without parsing
    if (operation.value === 'escape') {
      resultData = JSON.stringify(inputText.value);
    } else if (operation.value === 'unescape') {
      // Try to parse as JSON string first, fallback to manual unescape
      try {
        resultData = JSON.parse(inputText.value);
      } catch {
        // Manual unescape for non-JSON strings
        resultData = inputText.value
          .replace(/\\n/g, '\n')   // 去转义换行
          .replace(/\\r/g, '\r')   // 去转义回车  
          .replace(/\\t/g, '\t')   // 去转义制表符
          .replace(/\\"/g, '"')    // 去转义双引号
          .replace(/\\'/g, "'")    // 去转义单引号
          .replace(/\\\\/g, '\\')  // 去转义反斜杠
      }
    } else {
      // Parse input data for other operations
      let inputData;
      switch (convertFrom.value) {
        case 'yaml':
          inputData = yaml.load(inputText.value);
          break;
        case 'xml':
          inputData = JSON.parse(xmlJs.xml2json(inputText.value, { compact: true, spaces: 4 }));
          break;
        default: // json
          inputData = JSON.parse(inputText.value);
          break;
      }

      // Process data based on operation
      if (operation.value === 'minify') {
        resultData = JSON.stringify(inputData);
      } else if (operation.value === 'format') {
        resultData = JSON.stringify(inputData, null, indentSize.value);
      } else { // convert
        switch (convertTo.value) {
          case 'yaml':
            resultData = yaml.dump(inputData, { indent: indentSize.value });
            break;
          case 'xml':
            resultData = xmlJs.json2xml(JSON.stringify(inputData), { compact: true, spaces: indentSize.value });
            break;
          default: // json
            resultData = JSON.stringify(inputData, null, indentSize.value);
            break;
        }
      }
    }
    outputText.value = resultData;
  } catch (e: unknown) {
    const error = e as Error;
    outputText.value = `Error: ${error.message || 'Unknown error'}`;
  }
  outputEditor?.setValue(outputText.value);
};

const initEditors = async () => {
  await nextTick();
  const editorOptions = {
    language: 'json',
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: { enabled: false },
    wordWrap: (wordWrapEnabled.value ? 'on' : 'off') as 'on' | 'off',
  };

  if (inputEditorRef.value) {
    inputEditor = monaco.editor.create(inputEditorRef.value, {
      value: inputText.value,
      ...editorOptions,
    });
    inputEditor.onDidChangeModelContent(() => {
      inputText.value = inputEditor?.getValue() || '';
      if (autoProcess.value) processData();
    });
  }
  if (outputEditorRef.value) {
    outputEditor = monaco.editor.create(outputEditorRef.value, {
      value: outputText.value,
      readOnly: true,
      ...editorOptions,
    });
  }
  processData();
};

// Toolbar actions
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
  if (!isValidJson.value) return;
  const blob = new Blob([JSON.stringify(parsedJson.value, null, indentSize.value)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
  a.click();
  URL.revokeObjectURL(url);
};
const clearAll = () => inputEditor?.setValue('');
const pasteInput = async () => inputEditor?.setValue(await navigator.clipboard.readText());
const copyInput = () => navigator.clipboard.writeText(inputEditor?.getValue() || '');
const copyOutput = () => navigator.clipboard.writeText(outputEditor?.getValue() || '');

// Watchers
watch([operation, indentSize, convertFrom, convertTo], () => {
  if (autoProcess.value) processData();
});

watch(wordWrapEnabled, (newValue) => {
  const wrapOption = newValue ? 'on' : 'off';
  inputEditor?.updateOptions({ wordWrap: wrapOption });
  outputEditor?.updateOptions({ wordWrap: wrapOption });
});

// Lifecycle
onMounted(initEditors);
onBeforeUnmount(() => {
  inputEditor?.dispose();
  outputEditor?.dispose();
});

</script>

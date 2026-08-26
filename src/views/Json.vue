<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
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

          <!-- Unicode 解码开关：选中=\u转中文，去掉=不转换 -->
          <button
            @click="toggleDecodeUnicode"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-all border flex items-center space-x-1"
            :class="decodeUnicode ? 'bg-primary/10 text-primary border-primary/20' : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'"
            :title="$t('tools.json.unicodeDecodeDesc')"
          >
            <Languages class="w-3.5 h-3.5" />
            <span>{{ $t('tools.json.unicodeDecode') }}</span>
          </button>

          <!-- 嵌套 JSON 展开开关：选中=递归把字符串里的 JSON 解析成对象/数组 -->
          <button
            @click="toggleExpandNested"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-all border flex items-center space-x-1"
            :class="expandNested ? 'bg-primary/10 text-primary border-primary/20' : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'"
            :title="$t('tools.json.expandNestedDesc')"
          >
            <UnfoldVertical class="w-3.5 h-3.5" />
            <span>{{ $t('tools.json.expandNested') }}</span>
          </button>
        </div>

        <div class="h-4 w-px bg-border flex-shrink-0"></div>

        <!-- History & Compare Action -->
        <div class="flex items-center space-x-1 flex-shrink-0">
          <button
            @click="showHistory = true"
            class="px-2.5 py-1.5 text-xs font-medium rounded-md transition-all border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground flex items-center space-x-1"
            :title="$t('common.buttons.history')"
          >
            <History class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">{{ $t('common.buttons.history') }}</span>
          </button>
          <div class="h-4 w-px bg-border flex-shrink-0"></div>
<div class="flex items-center space-x-0.5">
            <button
              @click="goToDiff('left')"
              class="px-3 py-1.5 text-xs font-medium rounded-l-md transition-all border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground flex items-center space-x-1 border-r border-border/50"
              :title="$t('tools.diff.putLeft')"
            >
              <ArrowLeftFromLine class="w-3.5 h-3.5" />
              <span>{{ $t('tools.diff.putLeft') }}</span>
            </button>
            <button
              @click="goToDiff('right')"
              class="px-3 py-1.5 text-xs font-medium rounded-r-md transition-all border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground flex items-center space-x-1"
              :title="$t('tools.diff.putRight')"
            >
              <span>{{ $t('tools.diff.putRight') }}</span>
              <ArrowRightFromLine class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Right Side Controls -->
      <div class="flex items-center space-x-3 flex-shrink-0 ml-4">
        <div class="flex items-center space-x-2 hidden md:flex">
          <CustomSelect v-model="indentSize" :options="indentOptions" />

          <button
            @click="wordWrapEnabled = !wordWrapEnabled"
            class="p-1.5 rounded-md transition-colors h-8 w-8 flex items-center justify-center"
            :class="wordWrapEnabled ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'"
            :title="$t('common.labels.autoWrap')"
          >
            <WrapText class="w-4 h-4" />
          </button>

          <button
            @click="showMinimap = !showMinimap"
            class="p-1.5 rounded-md transition-colors h-8 w-8 flex items-center justify-center"
            :class="showMinimap ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'"
            title="Toggle Minimap"
          >
            <Map class="w-4 h-4" />
          </button>
        </div>

        <div class="h-4 w-px bg-border hidden md:block"></div>

        <button
          @click="rightPanelView = rightPanelView === 'tree' ? 'none' : 'tree'"
          class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors border border-transparent h-8"
          :class="rightPanelView === 'tree' ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
        >
          <ListTree class="w-4 h-4" />
          <span class="hidden sm:inline">{{ rightPanelView === 'tree' ? $t('common.buttons.hideTreeView') : $t('common.buttons.showTreeView') }}</span>
        </button>

        <button
          @click="rightPanelView = rightPanelView === 'graph' ? 'none' : 'graph'"
          class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors border border-transparent h-8"
          :class="rightPanelView === 'graph' ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
        >
          <Network class="w-4 h-4" />
          <span class="hidden sm:inline">{{ rightPanelView === 'graph' ? $t('common.buttons.hideGraphView') : $t('common.buttons.showGraphView') }}</span>
        </button>

        <button @click="showHelp = !showHelp" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground h-8 w-8 flex items-center justify-center">
          <HelpCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main ref="mainContainer" class="flex-1 flex min-h-0 p-4 gap-2 relative">
      <!-- Editor Section -->
      <div v-show="rightPanelView === 'none' || !editorCollapsed" class="flex flex-col border border-border rounded-lg overflow-hidden bg-card shadow-sm min-w-0 h-full" :style="rightPanelView !== 'none' ? { width: leftWidth + 'px', flex: 'none' } : { flex: 1 }">
        <!-- Editor Toolbar -->
        <div class="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border">
          <div class="flex items-center space-x-2">
            <span class="text-xs font-medium text-muted-foreground">{{ $t('common.labels.input') }}</span>
            <span v-if="jsonStats" class="text-xs text-muted-foreground/70 px-2 py-0.5 bg-muted rounded-full">
              {{ jsonStats }}
            </span>
          </div>
          <div class="flex items-center space-x-1">
            <button @click="undo" :title="$t('common.undo') + ' (Ctrl+Z)'" class="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
              <Undo2 class="w-3.5 h-3.5" />
            </button>
            <button @click="redo" :title="$t('common.redo') + ' (Ctrl+Y)'" class="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
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
            <div v-if="rightPanelView !== 'none'" class="h-3 w-px bg-border mx-1"></div>
            <button v-if="rightPanelView !== 'none'" @click="editorCollapsed = true" class="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors" title="Collapse Editor">
              <PanelLeftClose class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div class="flex-1 relative group">
          <div ref="editorRef" class="absolute inset-0"></div>
        </div>
      </div>

      <!-- Collapsed Toggle -->
      <div v-if="editorCollapsed && rightPanelView !== 'none'" class="flex flex-col border border-border rounded-lg bg-muted/30 p-1 shadow-sm h-full">
        <button @click="editorCollapsed = false" class="p-2 hover:bg-muted rounded hover:text-foreground text-muted-foreground transition-colors" title="Expand Editor">
          <PanelLeftOpen class="w-4 h-4" />
        </button>
      </div>

      <!-- Resizer -->
      <div
        v-show="!editorCollapsed && rightPanelView !== 'none'"
        class="w-1.5 hover:w-2 bg-transparent hover:bg-border/50 active:bg-primary/50 cursor-col-resize flex-shrink-0 transition-all rounded-full z-10 mx-[-4px]"
        @mousedown="startResize"
      ></div>

      <!-- Tree / Graph View Section -->
      <div v-if="rightPanelView !== 'none'" class="flex-1 flex flex-col border border-border rounded-lg overflow-hidden bg-card shadow-sm min-w-0 h-full relative">
          <div class="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border z-10">
            <h3 class="text-xs font-medium text-muted-foreground">
              <template v-if="rightPanelView === 'tree'">{{ $t('common.labels.treeView') }}</template>
              <template v-else-if="rightPanelView === 'graph'">{{ $t('common.labels.graphView') }}</template>
            </h3>
            <div class="flex items-center space-x-2">
               <button v-if="rightPanelView === 'tree'" @click="toggleTreeExpansion" class="text-xs text-primary hover:underline px-2">
                 {{ isTreeExpanded ? $t('tools.json.collapseAll') : $t('tools.json.expandAll') }}
               </button>
            </div>
          </div>
          <div class="flex-1 relative overflow-hidden bg-background">
            <div v-if="rightPanelView === 'tree'" class="h-full overflow-auto p-4">
              <JsonTreeView ref="treeViewRef" v-if="isValidJson && parsedJson" :data="parsedJson" />
              <div v-else class="h-full flex flex-col items-center justify-center text-muted-foreground">
                <AlertCircle class="w-8 h-8 mb-2 opacity-50" />
                <p class="text-sm">{{ $t('common.messages.invalidJson') }}</p>
              </div>
            </div>
            <div v-else-if="rightPanelView === 'graph'" class="h-full w-full absolute inset-0">
              <JsonGraphView v-if="isValidJson && parsedJson" :data="parsedJson" />
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
              <li><strong>{{ $t('tools.json.unicodeDecode') }}:</strong> {{ $t('tools.json.unicodeDecodeDesc') }}</li>
              <li><strong>{{ $t('tools.json.expandNested') }}:</strong> {{ $t('tools.json.expandNestedDesc') }}</li>
              <li><strong>{{ $t('common.labels.treeView') }}:</strong> {{ $t('tools.json.treeViewDescription') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- History Modal -->
    <HistoryModal
      :show="showHistory"
      :history="history"
      @close="showHistory = false"
      @select="useHistoryItem"
      @delete="deleteHistory"
      @clear="clearHistory"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import * as monaco from 'monaco-editor';
import JSON5 from 'json5';
import JsonTreeView from '../components/JsonTreeView.vue';
import JsonGraphView from '../components/JsonGraphView.vue';
import { HelpCircle, Braces, ListTree, Undo2, Redo2, ClipboardPaste, Copy, Trash2, AlertCircle, X, WrapText, History, Map, ArrowLeftFromLine, ArrowRightFromLine, Network, PanelLeftClose, PanelLeftOpen, Languages, UnfoldVertical } from 'lucide-vue-next';
import { getMonacoTheme, watchThemeChange, registerGlobalShortcuts } from '../utils/monaco-theme';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';
import { useHistory } from '../composables/useHistory';
import { useThemeStore } from '../stores/theme';
import HistoryModal from '../components/HistoryModal.vue';
import CustomSelect from '../components/CustomSelect.vue';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

const indentOptions = [
  { label: t('common.labels.spaces2'), value: 2 },
  { label: t('common.labels.spaces4'), value: 4 }
];
const editorRef = ref<HTMLElement | null>(null);
const treeViewRef = ref<any>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;
let themeWatcher: (() => void) | null = null;
let isProcessing = false;
const errorMessage = ref('');
const showHelp = ref(false);
const showHistory = ref(false);

const themeStore = useThemeStore();
const { history, addHistory, deleteHistory, clearHistory, updateMaxItems } = useHistory('json', themeStore.historyLimit.value);

watch(() => themeStore.historyLimit.value, (newLimit) => {
  updateMaxItems(newLimit);
});

let errorTimer: NodeJS.Timeout | null = null;
// 追踪其余 setTimeout（isProcessing 复位、onDidPaste、pasteInput、indentSize watch 等），
// 组件卸载时统一清理，避免在已卸载的 ref / 已 dispose 的 editor 上触发回调。
const pendingTimers: ReturnType<typeof setTimeout>[] = [];
const trackTimer = (handler: () => void, delay: number): ReturnType<typeof setTimeout> => {
  const id = setTimeout(handler, delay);
  pendingTimers.push(id);
  return id;
};

const showError = (error: any, prefix = 'Error') => {
  console.error(prefix, error);
  let message = error instanceof Error ? error.message : String(error);
  if (prefix) {
    message = `${prefix}: ${message}`;
  }

  // Truncate error message if it's too long
  errorMessage.value = message.length > 150
    ? message.substring(0, 150) + '...'
    : message;

  if (errorTimer) clearTimeout(errorTimer);
  errorTimer = setTimeout(() => {
    errorMessage.value = '';
  }, 5000);
};

const STORAGE_KEYS = {
  inputText: 'json-input-text',
  operation: 'json-operation',
  indentSize: 'json-indent-size',
  rightPanelView: 'json-right-panel-view',
  wordWrapEnabled: 'json-word-wrap-enabled',
  showMinimap: 'json-show-minimap',
  leftWidth: 'json-left-width',
  editorCollapsed: 'json-editor-collapsed',
  decodeUnicode: 'json-decode-unicode',
  expandNested: 'json-expand-nested'
};

const inputText = ref(loadFromStorage(STORAGE_KEYS.inputText, '{ "hello": "world" }'));
const operation = ref(loadFromStorage(STORAGE_KEYS.operation, 'format'));
const indentSize = ref(loadFromStorage(STORAGE_KEYS.indentSize, 2));
const rightPanelView = ref<'none' | 'tree' | 'graph'>(loadFromStorage(STORAGE_KEYS.rightPanelView, 'none'));
const wordWrapEnabled = ref(loadFromStorage(STORAGE_KEYS.wordWrapEnabled, true));
const showMinimap = ref(loadFromStorage(STORAGE_KEYS.showMinimap, false));
const decodeUnicode = ref(loadFromStorage(STORAGE_KEYS.decodeUnicode, false));
const expandNested = ref(loadFromStorage(STORAGE_KEYS.expandNested, false));
const leftWidth = ref(loadFromStorage(STORAGE_KEYS.leftWidth, window.innerWidth / 2));
const editorCollapsed = ref(loadFromStorage(STORAGE_KEYS.editorCollapsed, false));
const mainContainer = ref<HTMLElement | null>(null);
const isResizing = ref(false);

const startResize = (e: MouseEvent) => {
  isResizing.value = true;
  document.addEventListener('mousemove', onResize);
  document.addEventListener('mouseup', stopResize);
  e.preventDefault();
};

const onResize = (e: MouseEvent) => {
  if (!isResizing.value || !mainContainer.value) return;
  const rect = mainContainer.value.getBoundingClientRect();
  const newWidth = e.clientX - rect.left;
  // Let it resize between 200px and the container width - 200px
  leftWidth.value = Math.max(200, Math.min(newWidth, rect.width - 200));
};

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', onResize);
  document.removeEventListener('mouseup', stopResize);
  if (editor) editor.layout();
};

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

function decodeUnicodeInStrings(obj: any): any {
  if (typeof obj === 'string') {
    return obj.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  }
  if (Array.isArray(obj)) return obj.map(decodeUnicodeInStrings);
  if (obj !== null && typeof obj === 'object') {
    const out: any = {};
    for (const k in obj) out[k] = decodeUnicodeInStrings(obj[k]);
    return out;
  }
  return obj;
}

/**
 * 递归把"值为字符串的嵌套 JSON"解析成对象/数组。
 * 规则：只替换解析结果为 object/array 的字符串（纯标量字符串如 "3306"/"hello" 保持原样，避免误伤）。
 * 多层嵌套通过递归处理：解析出的对象会继续被遍历，其内部字符串型 JSON 也会被展开。
 * 解析失败的字符串原样返回（可能是普通文本，也可能是格式错误的 JSON，都不应改动）。
 */
function parseNestedJsonStrings(value: any): any {
  if (typeof value === 'string') {
    // 快速过滤：必须看起来像 JSON（首尾是 {} 或 [] 的 trim 后内容），避免对普通文本做无谓 parse
    const trimmed = value.trim();
    const looksLikeJson =
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'));
    if (!looksLikeJson) return value;
    try {
      const parsed = JSON5.parse(trimmed);
      // 只展开对象/数组，标量（数字/布尔/null）不替换，避免把电话号码、ID 等字符串误转
      if (parsed !== null && typeof parsed === 'object') {
        // 对解析结果继续递归，处理多层嵌套
        return parseNestedJsonStrings(parsed);
      }
      return value;
    } catch {
      return value;
    }
  }
  if (Array.isArray(value)) return value.map(parseNestedJsonStrings);
  if (value !== null && typeof value === 'object') {
    const out: any = {};
    for (const k in value) out[k] = parseNestedJsonStrings(value[k]);
    return out;
  }
  return value;
}

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
  processData(false);
};

// Unicode 解码开关：选中=把 \uXXXX 转中文，去掉=还原。点击立即应用。
// 开启时先保存当前内容，关闭时还原回去（支持来回切换不丢原始数据）。
const decodeUnicodeSnapshot = ref<string | null>(null);
const toggleDecodeUnicode = () => {
  const turningOn = !decodeUnicode.value;
  decodeUnicode.value = turningOn;
  if (!inputText.value.trim()) return;
  if (turningOn) {
    // 开启：保存解码前的原始内容，然后走 format 应用解码
    decodeUnicodeSnapshot.value = inputText.value;
    operation.value = 'format';
    processData(false);
  } else {
    // 关闭：还原为开启前保存的原始内容
    if (decodeUnicodeSnapshot.value !== null) {
      replaceTextInEditor(decodeUnicodeSnapshot.value);
      decodeUnicodeSnapshot.value = null;
    }
  }
};

// 嵌套 JSON 展开开关：选中=递归把字符串里的 JSON 解析成对象/数组，去掉=还原。
// 与 decodeUnicode 同样的快照还原模式：开启时存原文，关闭时一键还原。
const expandNestedSnapshot = ref<string | null>(null);
const toggleExpandNested = () => {
  const turningOn = !expandNested.value;
  expandNested.value = turningOn;
  if (!inputText.value.trim()) return;
  if (turningOn) {
    // 开启：保存展开前的原始内容，然后走 format 应用解析
    expandNestedSnapshot.value = inputText.value;
    operation.value = 'format';
    processData(false);
  } else {
    // 关闭：还原为开启前保存的原始内容
    if (expandNestedSnapshot.value !== null) {
      replaceTextInEditor(expandNestedSnapshot.value);
      expandNestedSnapshot.value = null;
    }
  }
};

const replaceTextInEditor = (newText: string) => {
  if (!editor) return;
  const model = editor.getModel();
  if (model) {
    const fullRange = model.getFullModelRange();
    editor.executeEdits('json-processor', [{ range: fullRange, text: newText }]);
  } else {
    editor?.setValue(newText);
  }
  inputText.value = newText;
};

const useHistoryItem = (content: string) => {
  replaceTextInEditor(content);
  showHistory.value = false;
  handleOperation('format');
};

const processData = (isAuto = false) => {
  if (!inputText.value.trim() || isProcessing) return;

  try {
    isProcessing = true;
    let resultData = '';
    const currentInput = inputText.value;

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
      let inputData = JSON5.parse(inputText.value);
      if (decodeUnicode.value) {
        // 选中时：把字符串值里的字面 \uXXXX 解码成中文
        inputData = decodeUnicodeInStrings(inputData);
      }
      if (expandNested.value) {
        // 选中时：递归把字符串值里的嵌套 JSON 解析成对象/数组
        inputData = parseNestedJsonStrings(inputData);
      }

      if (operation.value === 'minify') {
        resultData = JSON.stringify(inputData);
      } else if (operation.value === 'format') {
        resultData = JSON.stringify(inputData, null, indentSize.value);
      }
    }

    replaceTextInEditor(resultData);

    // Add to history if it's not an automatic format or if it's a manual format
    if (!isAuto && operation.value === 'format') {
      addHistory(currentInput);
    }
  } catch (e: unknown) {
    let prefix = 'Process failed';
    if (operation.value === 'escape') prefix = 'Escape failed';
    else if (operation.value === 'unescape') prefix = 'Unescape failed';
    else if (operation.value === 'format') prefix = 'Format failed';
    else if (operation.value === 'minify') prefix = 'Minify failed';

    showError(e, prefix);
  } finally {
    trackTimer(() => { isProcessing = false; }, 100);
  }
};

let contentChangeListener: monaco.IDisposable | null = null;

const initEditors = async () => {
  await nextTick();
  if (editorRef.value) {
    editor = monaco.editor.create(editorRef.value, {
      value: inputText.value,
      language: 'json',
      theme: getMonacoTheme(),
      automaticLayout: true,
      minimap: { enabled: showMinimap.value },
      wordWrap: (wordWrapEnabled.value ? 'on' : 'off') as 'on' | 'off',
      padding: { top: 16, bottom: 16 },
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
      formatOnPaste: true,
      formatOnType: true,
    });

    contentChangeListener = editor.onDidChangeModelContent(() => {
      if (!isProcessing && editor) {
        const newValue = editor.getValue();
        inputText.value = newValue;
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, undo);
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, redo);
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ, redo);

editor.onDidPaste(() => {
      trackTimer(() => {
        const currentText = editor?.getValue() || '';
        // Always record paste to history
        if (currentText.trim()) {
          addHistory(currentText);
        }

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
    registerGlobalShortcuts(editor);
  }
};

const clearAll = () => replaceTextInEditor('');

const pasteInput = async () => {
  try {
    const text = await navigator.clipboard.readText();
    replaceTextInEditor(text);
    addHistory(text);
    trackTimer(() => handleOperation('format'), 100);
  } catch (error) {
    console.error('Paste failed:', error);
  }
};

const copyInput = async () => {
  try {
    const text = editor?.getValue() || '';
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Cannot copy to clipboard:', err);
  }
};

const goToDiff = (side: 'left' | 'right' = 'left') => {
  const text = editor?.getValue() ?? inputText.value;
  const storageKey = side === 'left' ? 'diff-left-content' : 'diff-right-content';
  // Ensure we don't lose previous diff content by backing it up to diff history
  const currentContent = loadFromStorage(storageKey, '');
  const { addHistory: addDiffHistory } = useHistory('diff', themeStore.historyLimit.value);
  if (currentContent && currentContent !== text) {
    addDiffHistory(currentContent);
  }
  if (text.trim()) {
    addDiffHistory(text);
  }
  saveToStorage(storageKey, text);
  router.push('/diff');
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
  if (operation.value === 'format' && inputText.value.trim()) trackTimer(processData, 100);
});

watch(rightPanelView, (newValue) => {
  saveToStorage(STORAGE_KEYS.rightPanelView, newValue);
  nextTick(() => { if (editor) editor.layout(); });
});

watch(wordWrapEnabled, (newValue) => {
  editor?.updateOptions({ wordWrap: newValue ? 'on' : 'off' });
  saveToStorage(STORAGE_KEYS.wordWrapEnabled, newValue);
});

watch(showMinimap, (newValue) => {
  editor?.updateOptions({ minimap: { enabled: newValue } });
  saveToStorage(STORAGE_KEYS.showMinimap, newValue);
});

watch(decodeUnicode, (newValue) => {
  saveToStorage(STORAGE_KEYS.decodeUnicode, newValue);
});

watch(expandNested, (newValue) => {
  saveToStorage(STORAGE_KEYS.expandNested, newValue);
});

watch(leftWidth, (newValue) => {
  saveToStorage(STORAGE_KEYS.leftWidth, newValue);
  nextTick(() => { if (editor) editor.layout(); });
});

watch(editorCollapsed, (newValue) => {
  saveToStorage(STORAGE_KEYS.editorCollapsed, newValue);
  nextTick(() => { if (editor) editor.layout(); });
});

onMounted(initEditors);

onBeforeUnmount(() => {
  if (errorTimer) clearTimeout(errorTimer);
  while (pendingTimers.length) {
    clearTimeout(pendingTimers.pop());
  }
  contentChangeListener?.dispose();
  document.removeEventListener('mousemove', onResize);
  document.removeEventListener('mouseup', stopResize);
  themeWatcher?.();
  themeWatcher = null;
  if (editor) {
    const finalVal = editor.getValue();
    if (finalVal !== undefined && finalVal !== '') {
      saveToStorage(STORAGE_KEYS.inputText, finalVal);
    }
  }
  editor?.dispose();
  editor = null;
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

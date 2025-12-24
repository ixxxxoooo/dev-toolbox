<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Toolbar -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <Share2 class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.mermaid.name') }}</span>
        </div>
        <div class="h-4 w-px bg-border flex-shrink-0"></div>
        <button @click="downloadPng" class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground">
          {{ $t('tools.mermaid.downloadPng') }}
        </button>
        <button @click="downloadSvg" class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground">
          {{ $t('tools.mermaid.downloadSvg') }}
        </button>
        <div class="h-4 w-px bg-border flex-shrink-0"></div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-medium text-muted-foreground">{{ $t('tools.mermaid.theme') }}:</span>
          <CustomSelect v-model="mermaidTheme" :options="themeOptions" />
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-medium text-muted-foreground">{{ $t('tools.mermaid.look') }}:</span>
          <CustomSelect v-model="mermaidLook" :options="lookOptions" />
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-medium text-muted-foreground">{{ $t('tools.mermaid.curve') }}:</span>
          <CustomSelect v-model="mermaidCurve" :options="curveOptions" />
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-medium text-muted-foreground">{{ $t('tools.mermaid.background') }}:</span>
          <CustomSelect v-model="exportBg" :options="bgOptions" />
        </div>
        <div class="h-4 w-px bg-border flex-shrink-0"></div>
        <button @click="showHistory = true" class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground flex items-center space-x-1">
          <History class="w-4 h-4" />
          <span class="hidden sm:inline">{{ $t('common.buttons.history') }}</span>
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <button @click="toggleFullscreen" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <Maximize2 v-if="!isFullscreen" class="w-4 h-4" />
          <Minimize2 v-else class="w-4 h-4" />
        </button>
        <button @click="showHelp = !showHelp" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <HelpCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main ref="mainContainer" class="flex-1 overflow-hidden flex">
      <!-- Editor -->
      <div v-show="!editorCollapsed" class="flex flex-col min-w-0 transition-all" :style="{ width: leftWidth + 'px' }">
        <div class="h-8 px-3 flex items-center justify-between bg-muted/30 border-b border-border text-xs font-medium text-muted-foreground">
          <span>Mermaid Code</span>
          <button @click="editorCollapsed = true" class="p-1 hover:bg-muted rounded" title="Collapse">
            <PanelLeftClose class="w-4 h-4" />
          </button>
        </div>
        <div ref="editorContainer" class="flex-1"></div>
      </div>

      <!-- Collapsed Editor Toggle -->
      <div v-if="editorCollapsed" class="flex flex-col border-r border-border bg-muted/30">
        <button @click="editorCollapsed = false" class="p-2 hover:bg-muted" title="Expand Editor">
          <PanelLeftOpen class="w-4 h-4" />
        </button>
      </div>

      <!-- Resizer -->
      <div 
        v-show="!editorCollapsed"
        class="w-1 bg-border hover:bg-primary/50 cursor-col-resize flex-shrink-0 transition-colors"
        @mousedown="startResize"
      ></div>

      <!-- Preview -->
      <div 
        ref="previewContainer"
        class="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#1e1e1e]"
        :class="{ 'fixed inset-0 z-50': isFullscreen }"
      >
        <div class="h-8 px-3 flex items-center bg-muted/30 border-b border-border text-xs font-medium text-muted-foreground justify-between">
          <span>Preview</span>
          <div class="flex items-center space-x-1">
            <button @click="zoomOut" class="p-1 hover:bg-muted rounded" title="Zoom Out">
              <ZoomOut class="w-4 h-4" />
            </button>
            <input 
              type="range" 
              :value="currentScale * 100" 
              @input="onScaleInput" 
              min="10" 
              max="1000" 
              step="10"
              class="w-20 h-1 accent-primary cursor-pointer"
            />
            <span class="text-xs w-12 text-center">{{ Math.round(currentScale * 100) }}%</span>
            <button @click="zoomIn" class="p-1 hover:bg-muted rounded" title="Zoom In">
              <ZoomIn class="w-4 h-4" />
            </button>
            <button @click="resetZoom" class="p-1 hover:bg-muted rounded" title="Reset">
              <RotateCcw class="w-4 h-4" />
            </button>
            <button v-if="isFullscreen" @click="isFullscreen = false" class="p-1 hover:bg-muted rounded">
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div 
          ref="previewArea"
          class="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
          @mousedown="startDrag"
          @wheel="handleWheel"
        >
          <div 
            ref="svgContainer"
            class="absolute select-none"
            :style="{ transform: `translate(${currentPosition.x}px, ${currentPosition.y}px) scale(${currentScale})`, transformOrigin: '0 0' }"
            v-html="svgOutput"
          ></div>
          <div v-if="error" class="absolute inset-0 flex items-center justify-center p-4">
            <div class="text-destructive text-sm bg-destructive/10 p-4 rounded-lg max-w-md">{{ error }}</div>
          </div>
        </div>
      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.mermaid.name') }}</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-2 text-sm text-muted-foreground">
          <p>{{ $t('tools.mermaid.description') }}</p>
          <p>{{ $t('tools.mermaid.helpDrag') }}</p>
          <p>{{ $t('tools.mermaid.helpZoom') }}</p>
        </div>
      </div>
    </div>

    <!-- History Modal -->
    <HistoryModal
      :show="showHistory"
      :history="history"
      type="mermaid"
      @close="showHistory = false"
      @select="useHistoryItem"
      @delete="deleteHistory"
      @clear="clearHistory"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, onBeforeUnmount, nextTick, computed } from 'vue';
import { Share2, HelpCircle, X, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, History, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next';
import * as monaco from 'monaco-editor';
import mermaid from 'mermaid';
import { useI18n } from 'vue-i18n';
import { getMonacoTheme, watchThemeChange } from '@/utils/monaco-theme';
import { loadFromStorage, saveToStorage } from '@/utils/localStorage';
import { useHistory } from '@/composables/useHistory';
import { useThemeStore } from '@/stores/theme';
import HistoryModal from '@/components/HistoryModal.vue';
import CustomSelect from '@/components/CustomSelect.vue';

const { t } = useI18n();

// 注册 Mermaid 语言
monaco.languages.register({ id: 'mermaid' });
monaco.languages.setMonarchTokensProvider('mermaid', {
  keywords: ['graph', 'subgraph', 'end', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram', 'erDiagram', 'gantt', 'pie', 'gitGraph', 'mindmap', 'timeline', 'participant', 'actor', 'Note', 'loop', 'alt', 'else', 'opt', 'par', 'rect', 'activate', 'deactivate', 'autonumber', 'title', 'section'],
  directions: ['TB', 'TD', 'BT', 'RL', 'LR'],
  tokenizer: {
    root: [
      [/%%.*$/, 'comment'],
      [/\b(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|mindmap|timeline)\b/, 'keyword'],
      [/\b(subgraph|end|participant|actor|Note|loop|alt|else|opt|par|rect|activate|deactivate|autonumber|title|section|over|left of|right of)\b/, 'keyword'],
      [/\b(TB|TD|BT|RL|LR)\b/, 'type'],
      [/-->|==>|-.->|---->|---|===|-..-|--x|--o|<-->|o--o|x--x/, 'operator'],
      [/\|[^|]*\|/, 'string'],
      [/\[[^\]]*\]/, 'string'],
      [/\([^)]*\)/, 'string'],
      [/\{[^}]*\}/, 'string'],
      [/\b[A-Za-z_][A-Za-z0-9_]*\b/, 'identifier'],
      [/"[^"]*"/, 'string'],
      [/'[^']*'/, 'string'],
    ]
  }
});

const DEFAULT_CODE = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[OK]
    B -->|No| D[Cancel]`;

const STORAGE_KEY = 'mermaid-code';
const THEME_STORAGE_KEY = 'mermaid-theme';
const LOOK_STORAGE_KEY = 'mermaid-look';
const CURVE_STORAGE_KEY = 'mermaid-curve';

// 自定义主题配色
const customThemes: Record<string, object> = {
  github: {
    primaryColor: '#0969da',
    primaryTextColor: '#fff',
    primaryBorderColor: '#0550ae',
    lineColor: '#57606a',
    secondaryColor: '#ddf4ff',
    tertiaryColor: '#f6f8fa',
  },
  dracula: {
    primaryColor: '#bd93f9',
    primaryTextColor: '#f8f8f2',
    primaryBorderColor: '#6272a4',
    lineColor: '#f8f8f2',
    secondaryColor: '#44475a',
    tertiaryColor: '#282a36',
  },
  nord: {
    primaryColor: '#5e81ac',
    primaryTextColor: '#eceff4',
    primaryBorderColor: '#4c566a',
    lineColor: '#d8dee9',
    secondaryColor: '#81a1c1',
    tertiaryColor: '#3b4252',
  },
};

// Mermaid 主题选项
const themeOptions = computed(() => [
  { label: t('tools.mermaid.themes.default'), value: 'default' },
  { label: t('tools.mermaid.themes.dark'), value: 'dark' },
  { label: t('tools.mermaid.themes.forest'), value: 'forest' },
  { label: t('tools.mermaid.themes.neutral'), value: 'neutral' },
  { label: t('tools.mermaid.themes.base'), value: 'base' },
  { label: 'GitHub', value: 'github' },
  { label: 'Dracula', value: 'dracula' },
  { label: 'Nord', value: 'nord' },
]);

// Mermaid 外观选项
const lookOptions = computed(() => [
  { label: t('tools.mermaid.looks.classic'), value: 'classic' },
  { label: t('tools.mermaid.looks.handDrawn'), value: 'handDrawn' },
]);

// 曲线样式选项
const curveOptions = computed(() => [
  { label: t('tools.mermaid.curves.linear'), value: 'linear' },
  { label: t('tools.mermaid.curves.basis'), value: 'basis' },
  { label: t('tools.mermaid.curves.cardinal'), value: 'cardinal' },
  { label: t('tools.mermaid.curves.step'), value: 'step' },
  { label: t('tools.mermaid.curves.stepBefore'), value: 'stepBefore' },
  { label: t('tools.mermaid.curves.stepAfter'), value: 'stepAfter' },
  { label: t('tools.mermaid.curves.natural'), value: 'natural' },
  { label: t('tools.mermaid.curves.monotoneX'), value: 'monotoneX' },
]);

// 背景色选项
const bgOptions = computed(() => [
  { label: t('tools.mermaid.backgrounds.white'), value: 'white' },
  { label: t('tools.mermaid.backgrounds.transparent'), value: 'transparent' },
]);

const themeStore = useThemeStore();
const { history, addHistory, deleteHistory, clearHistory, updateMaxItems } = useHistory('mermaid', themeStore.historyLimit.value);

watch(() => themeStore.historyLimit.value, (newLimit) => {
  updateMaxItems(newLimit);
});

const code = ref(loadFromStorage(STORAGE_KEY, DEFAULT_CODE));
const mermaidTheme = ref(loadFromStorage(THEME_STORAGE_KEY, 'default'));
const mermaidLook = ref(loadFromStorage(LOOK_STORAGE_KEY, 'classic'));
const mermaidCurve = ref(loadFromStorage(CURVE_STORAGE_KEY, 'linear'));
const exportBg = ref(loadFromStorage('mermaid-bg', 'white'));
const svgOutput = ref('');
const error = ref('');
const showHelp = ref(false);
const showHistory = ref(false);
const isFullscreen = ref(false);
const editorCollapsed = ref(false);
const editorContainer = ref<HTMLElement | null>(null);
const previewArea = ref<HTMLElement | null>(null);
const svgContainer = ref<HTMLElement | null>(null);
const mainContainer = ref<HTMLElement | null>(null);

let editor: monaco.editor.IStandaloneCodeEditor | null = null;
let themeWatcher: (() => void) | null = null;

// Pan & Zoom - 分别保存普通和全屏状态
const scale = ref(1);
const position = ref({ x: 20, y: 20 });
const fullscreenScale = ref(1);
const fullscreenPosition = ref({ x: 20, y: 20 });
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });

// 根据全屏状态获取当前值
const currentScale = computed(() => isFullscreen.value ? fullscreenScale.value : scale.value);
const currentPosition = computed(() => isFullscreen.value ? fullscreenPosition.value : position.value);

// Resizer
const leftWidth = ref(window.innerWidth / 2 - 100);
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
  leftWidth.value = Math.max(200, Math.min(newWidth, rect.width - 200));
};

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', onResize);
  document.removeEventListener('mouseup', stopResize);
};

let renderId = 0;
const renderMermaid = async (resetView = false) => {
  if (!code.value.trim()) {
    svgOutput.value = '';
    error.value = '';
    return;
  }
  try {
    // 每次渲染前重新初始化主题和外观
    const isCustomTheme = mermaidTheme.value in customThemes;
    mermaid.initialize({ 
      startOnLoad: false, 
      theme: isCustomTheme ? 'base' : mermaidTheme.value as any,
      themeVariables: isCustomTheme ? customThemes[mermaidTheme.value] : undefined,
      look: mermaidLook.value as any,
      flowchart: { curve: mermaidCurve.value as any },
      securityLevel: 'loose' 
    });
    const { svg } = await mermaid.render(`mermaid-svg-${++renderId}`, code.value);
    svgOutput.value = svg;
    error.value = '';
    // 只在代码变化时自动居中适配
    if (resetView) {
      nextTick(() => fitToCenter());
    }
  } catch (e: any) {
    error.value = e?.message || e?.str || String(e) || 'Render error';
  }
};

// 自动居中并适配大小
const fitToCenter = () => {
  if (!previewArea.value || !svgContainer.value) return;
  const svg = svgContainer.value.querySelector('svg');
  if (!svg) return;
  
  const containerRect = previewArea.value.getBoundingClientRect();
  const currentScaleVal = isFullscreen.value ? fullscreenScale.value : scale.value;
  const svgRect = svg.getBoundingClientRect();
  const svgWidth = svgRect.width / currentScaleVal;
  const svgHeight = svgRect.height / currentScaleVal;
  
  if (svgWidth === 0 || svgHeight === 0) return;
  
  const padding = 40;
  const availableWidth = containerRect.width - padding * 2;
  const availableHeight = containerRect.height - padding * 2;
  
  // 计算适配比例，最小0.8保证字体可读，最大2
  const scaleX = availableWidth / svgWidth;
  const scaleY = availableHeight / svgHeight;
  const newScale = Math.max(0.8, Math.min(2, Math.min(scaleX, scaleY)));
  
  // 居中
  const scaledWidth = svgWidth * newScale;
  const scaledHeight = svgHeight * newScale;
  const newPosition = {
    x: (containerRect.width - scaledWidth) / 2,
    y: (containerRect.height - scaledHeight) / 2
  };
  
  if (isFullscreen.value) {
    fullscreenScale.value = newScale;
    fullscreenPosition.value = newPosition;
  } else {
    scale.value = newScale;
    position.value = newPosition;
  }
};

// 保存到 localStorage
watch(code, (newCode) => {
  saveToStorage(STORAGE_KEY, newCode);
  renderMermaid(true);
}, { immediate: true });

// 监听主题变化
watch(mermaidTheme, (newTheme) => {
  saveToStorage(THEME_STORAGE_KEY, newTheme);
  renderMermaid();
});

// 监听外观变化
watch(mermaidLook, (newLook) => {
  saveToStorage(LOOK_STORAGE_KEY, newLook);
  renderMermaid();
});

// 监听曲线变化
watch(mermaidCurve, (newCurve) => {
  saveToStorage(CURVE_STORAGE_KEY, newCurve);
  renderMermaid();
});

// 监听背景色变化
watch(exportBg, (newBg) => {
  saveToStorage('mermaid-bg', newBg);
});

// 监听左侧宽度变化，调整编辑器大小
watch(leftWidth, () => {
  editor?.layout();
});

// 使用历史记录
const useHistoryItem = (content: string) => {
  code.value = content;
  editor?.setValue(content);
  showHistory.value = false;
};

onMounted(() => {
  if (editorContainer.value) {
    editor = monaco.editor.create(editorContainer.value, {
      value: code.value,
      language: 'mermaid',
      theme: getMonacoTheme(),
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      wordWrap: 'on',
      automaticLayout: true,
      scrollBeyondLastLine: false,
    });
    
    editor.onDidChangeModelContent(() => {
      code.value = editor?.getValue() || '';
    });
    
    editor.onDidPaste(() => {
      setTimeout(() => {
        const content = editor?.getValue() || '';
        if (content.trim()) {
          addHistory(content);
        }
      }, 50);
    });
    
    themeWatcher = watchThemeChange(editor);
  }
});

// 离开页面时保存历史
onBeforeUnmount(() => {
  if (code.value.trim() && code.value !== DEFAULT_CODE) {
    addHistory(code.value);
  }
});

const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  const pos = isFullscreen.value ? fullscreenPosition.value : position.value;
  dragStart.value = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;
  const newPos = { x: e.clientX - dragStart.value.x, y: e.clientY - dragStart.value.y };
  if (isFullscreen.value) {
    fullscreenPosition.value = newPos;
  } else {
    position.value = newPos;
  }
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

const handleWheel = (e: WheelEvent) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? 0.9 : 1.1;
  if (isFullscreen.value) {
    fullscreenScale.value = Math.min(Math.max(0.1, fullscreenScale.value * delta), 10);
  } else {
    scale.value = Math.min(Math.max(0.1, scale.value * delta), 10);
  }
};

const zoomIn = () => {
  if (isFullscreen.value) {
    fullscreenScale.value = Math.min(fullscreenScale.value * 1.2, 10);
  } else {
    scale.value = Math.min(scale.value * 1.2, 10);
  }
};
const zoomOut = () => {
  if (isFullscreen.value) {
    fullscreenScale.value = Math.max(fullscreenScale.value / 1.2, 0.1);
  } else {
    scale.value = Math.max(scale.value / 1.2, 0.1);
  }
};
const resetZoom = () => { fitToCenter(); };

const onScaleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).valueAsNumber / 100;
  if (isFullscreen.value) {
    fullscreenScale.value = value;
  } else {
    scale.value = value;
  }
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  nextTick(() => fitToCenter());
};

const downloadSvg = () => {
  if (!svgOutput.value) return;
  const blob = new Blob([svgOutput.value], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mermaid-diagram.svg';
  a.click();
  URL.revokeObjectURL(url);
};

const downloadPng = async () => {
  if (!svgOutput.value) return;
  const svg = svgContainer.value?.querySelector('svg');
  if (!svg) return;
  
  const clonedSvg = svg.cloneNode(true) as SVGElement;
  // 获取原始尺寸（不受缩放影响）
  const bbox = svg.getBBox();
  const width = Math.ceil(bbox.width + bbox.x * 2);
  const height = Math.ceil(bbox.height + bbox.y * 2);
  clonedSvg.setAttribute('width', String(width));
  clonedSvg.setAttribute('height', String(height));
  
  const svgData = new XMLSerializer().serializeToString(clonedSvg);
  const svgBase64 = btoa(unescape(encodeURIComponent(svgData)));
  const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  const exportScale = 2; // 2x for Retina
  
  img.onload = () => {
    canvas.width = width * exportScale;
    canvas.height = height * exportScale;
    if (exportBg.value === 'white') {
      ctx!.fillStyle = '#ffffff';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx!.scale(exportScale, exportScale);
    ctx!.drawImage(img, 0, 0);
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png', 1.0);
    a.download = 'mermaid-diagram.png';
    a.click();
  };
  img.src = dataUrl;
};

onUnmounted(() => {
  themeWatcher?.();
  editor?.dispose();
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('mousemove', onResize);
  document.removeEventListener('mouseup', stopResize);
});
</script>

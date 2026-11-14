<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Toolbar -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <PenTool class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.excalidraw.name') }}</span>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button @click="showHelp = !showHelp" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <HelpCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main ref="containerRef" class="flex-1 overflow-hidden excalidraw-container"></main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.excalidraw.name') }}</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-2 text-sm text-muted-foreground">
          <p>{{ $t('tools.excalidraw.description') }}</p>
          <p>{{ $t('tools.excalidraw.helpDraw') }}</p>
          <p>{{ $t('tools.excalidraw.helpExport') }}</p>
          <p>{{ $t('tools.excalidraw.helpSave') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { PenTool, HelpCircle, X } from 'lucide-vue-next';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import { useThemeStore } from '@/stores/theme';
import { loadFromStorage } from '@/utils/localStorage';
import { idbGet, idbSet } from '@/utils/idbStore';
import { useDebounceFn } from '@/composables/useDebounceFn';
import { useI18n } from 'vue-i18n';

// 生产环境从本站 /excalidraw-assets/ 加载字体（构建时由 vite.config.ts 拷贝），
// 本地缺失的字体（如体积 12MB 的中文手写体）再回退到 CDN，避免离线/内网环境下字体加载失败
if (import.meta.env.PROD) {
  (window as any).EXCALIDRAW_ASSET_PATH = [
    '/excalidraw-assets/',
    `https://esm.sh/@excalidraw/excalidraw@${__EXCALIDRAW_VERSION__}/dist/prod/`,
  ];
}

const STORAGE_KEY = 'excalidraw-data';
const FILES_KEY = 'excalidraw-files';
const showHelp = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const themeStore = useThemeStore();
const { locale } = useI18n();

let root: Root | null = null;
// 初始画布数据只在挂载时加载一次；Excalidraw 挂载后会忽略 initialData 的变化，
// 主题/语言切换重新 render 时复用同一份即可（也避免读到尚未落盘的旧数据）
let initialData: any = undefined;
// 初始数据加载完成前不渲染，否则 Excalidraw 会以空白画布挂载并忽略之后的 initialData
let dataReady = false;

// 防抖持久化：Excalidraw 的 onChange 在拖拽时每帧触发数十次，直接序列化整张图会阻塞主线程。
// 400ms 防抖；卸载时 flush，保证最后一次编辑不丢。
// 数据写入 IndexedDB（容量远大于 localStorage 的 5MB，图片 files 动辄数 MB）。
const debouncedPersist = useDebounceFn(
  (elements: any, appState: any, files: any) => {
    // collaborators 是 Map，无法被结构化克隆之外的 JSON 还原，且无需持久化，直接剔除
    const { collaborators: _collaborators, ...persistedAppState } = appState || {};
    void idbSet(STORAGE_KEY, { elements, appState: persistedAppState });
    if (files && Object.keys(files).length > 0) {
      void idbSet(FILES_KEY, files);
    }
  },
  400,
  { flushOnUnmount: true }
);

/** 读取持久化数据：优先 IndexedDB，其次迁移旧版 localStorage 数据 */
const loadInitialData = async () => {
  let savedData: any = await idbGet(STORAGE_KEY);
  let savedFiles: any = await idbGet(FILES_KEY);

  if (!savedData) {
    const legacyData = loadFromStorage(STORAGE_KEY, null);
    const legacyFiles = loadFromStorage(FILES_KEY, {});
    if (legacyData) {
      savedData = legacyData;
      savedFiles = legacyFiles;
      // 迁移到 IndexedDB 成功后再清理旧数据，防止丢失
      const ok = await idbSet(STORAGE_KEY, legacyData) && await idbSet(FILES_KEY, legacyFiles);
      if (ok) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(FILES_KEY);
      }
    }
  }

  // 校验持久化数据的形状，避免损坏/版本不兼容的数据导致渲染崩溃。
  const hasValidElements = !!savedData && Array.isArray(savedData.elements);
  const hasValidAppState = !savedData || savedData.appState == null || typeof savedData.appState === 'object';
  if (!(hasValidElements && hasValidAppState)) return undefined;

  // 注意不要再塞 collaborators: []，Excalidraw 期望它是 Map，数组会在访问 .forEach/.size 时出错
  const { collaborators: _c, ...appState } = savedData.appState || {};
  return { elements: savedData.elements, appState, files: savedFiles || {} };
};

const renderExcalidraw = () => {
  if (!containerRef.value || !root || !dataReady) return;

  root.render(
    React.createElement(Excalidraw, {
      theme: themeStore.isDark.value ? 'dark' : 'light',
      langCode: locale.value === 'zh' ? 'zh-CN' : 'en',
      initialData,
      UIOptions: {
        canvasActions: {
          export: { saveFileToDisk: true },
          loadScene: true,
          saveToActiveFile: false,
          toggleTheme: false,
        },
        tools: { image: true },
        welcomeScreen: false,
      },
      onChange: (elements: any, appState: any, files: any) => {
        debouncedPersist.run(elements, appState, files);
      }
    })
  );
};

onMounted(async () => {
  if (!containerRef.value) return;
  root = createRoot(containerRef.value);
  initialData = await loadInitialData();
  // 异步加载期间组件可能已被卸载
  if (!root) return;
  dataReady = true;
  renderExcalidraw();
});

watch(() => themeStore.isDark.value, renderExcalidraw);
watch(locale, renderExcalidraw);

onUnmounted(() => {
  // 在 React 渲染/卸载过程中同步 unmount 会触发 "Attempted to synchronously unmount a root while React was already rendering" 警告，
  // 延后到下一个宏任务执行
  const r = root;
  root = null;
  if (r) setTimeout(() => r.unmount(), 0);
});
</script>

<style>
.excalidraw-container {
  width: 100%;
  height: 100%;
}
.excalidraw-container .excalidraw {
  width: 100%;
  height: 100%;
}
.excalidraw-container .excalidraw .excalidraw-container {
  width: 100% !important;
  height: 100% !important;
}
</style>

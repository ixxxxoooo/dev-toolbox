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
import { loadFromStorage, saveToStorage } from '@/utils/localStorage';
import { useDebounceFn } from '@/composables/useDebounceFn';
import { useI18n } from 'vue-i18n';

const STORAGE_KEY = 'excalidraw-data';
const FILES_KEY = 'excalidraw-files';
const showHelp = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const themeStore = useThemeStore();
const { locale } = useI18n();

let root: Root | null = null;

// 防抖持久化：Excalidraw 的 onChange 在拖拽时每帧触发数十次，直接 saveToStorage
// 会同步 JSON.stringify 整张图 + 写 localStorage，严重阻塞主线程。
// 这里用 400ms 防抖，拖拽过程中只在停顿后落盘一次。卸载时自动清理挂起的定时器。
const debouncedPersist = useDebounceFn(
  (elements: any, appState: any, files: any) => {
    saveToStorage(STORAGE_KEY, { elements, appState: { ...appState, collaborators: undefined } });
    if (files && Object.keys(files).length > 0) {
      saveToStorage(FILES_KEY, files);
    }
  },
  400
);

const renderExcalidraw = () => {
  if (!containerRef.value || !root) return;
  
  const savedData = loadFromStorage(STORAGE_KEY, null);
  const savedFiles = loadFromStorage(FILES_KEY, {});
  // 校验持久化数据的形状，避免损坏/版本不兼容的数据导致渲染崩溃。
  // elements 必须是数组；appState 必须是对象（或缺失）。不满足时丢弃，回到空白画布。
  const hasValidElements = !!savedData && Array.isArray(savedData.elements);
  const hasValidAppState = !savedData || (typeof savedData.appState === 'object' && savedData.appState !== null);
  const initialData = (hasValidElements && hasValidAppState) ? {
    elements: savedData.elements,
    appState: { ...savedData.appState, collaborators: [] },
    files: savedFiles
  } : undefined;
  
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
        // 走防抖持久化，避免每帧写 localStorage
        debouncedPersist.run(elements, appState, files);
      }
    })
  );
};

onMounted(() => {
  if (containerRef.value) {
    root = createRoot(containerRef.value);
    renderExcalidraw();
  }
});

watch(() => themeStore.isDark.value, renderExcalidraw);
watch(locale, renderExcalidraw);

onUnmounted(() => {
  root?.unmount();
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

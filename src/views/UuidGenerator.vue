<template>
  <div class="h-screen flex flex-col bg-background text-foreground">
    <!-- 顶部标题栏 -->
    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <ToolSwitcher />
            <button @click="$router.push('/')" class="p-2 rounded-lg hover:bg-secondary transition-colors btn-icon" :title="$t('app.backToHome')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="flex items-center space-x-2">
              <h1 class="text-xl font-semibold">{{ $t('tools.uuid.name') }}</h1>
              <div class="relative group">
                <HelpCircle class="h-5 w-5 text-muted-foreground cursor-pointer" />
                <div class="absolute top-full mt-2 w-64 bg-card border rounded-lg shadow-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p class="font-bold mb-2">{{ $t('tools.uuid.name') }}</p>
                  <p class="mb-2">{{ $t('tools.uuid.description') }}</p>
                  <p class="font-bold mb-1">{{ $t('tools.uuid.coreFeatures') }}:</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong>{{ $t('tools.uuid.uuidv4') }}:</strong> {{ $t('tools.uuid.uuidv4Description') }}</li>
                    <li><strong>{{ $t('tools.uuid.format') }}:</strong> {{ $t('tools.uuid.formatDescription') }}</li>
                  </ul>
                  <p class="mt-2"><strong class="text-primary">{{ $t('app.example') }}:</strong></p>
                  <p class="text-xs font-mono bg-muted p-1 rounded">{{ $t('common.labels.result') }}: 550e8400-e29b-41d4-a716-446655440000</p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="generateUuid" class="px-3 py-1.5 text-sm rounded-md btn-primary">{{ $t('common.buttons.generateUuid') }}</button>
            <button @click="clearUuid" :disabled="!uuid" class="px-3 py-1.5 text-sm rounded-md btn-destructive transition-colors disabled:opacity-50">{{ $t('common.clear') }}</button>
            <LanguageSwitcher />
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="flex-1 container mx-auto px-4 py-8 flex justify-center items-center">
      <div class="w-full max-w-xl">
        <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div class="relative flex items-center space-x-2">
            <input
              type="text"
              readonly
              v-model="uuid"
              :placeholder="$t('common.placeholders.clickToGenerate')"
              class="flex-1 text-center text-xl font-mono p-4 bg-muted border border-border rounded-lg focus:outline-none"
            />
            <button
              @click="copyUuid"
              :disabled="!uuid"
              class="px-4 py-4 rounded-lg btn-secondary disabled:opacity-50 flex items-center justify-center"
              :title="$t('common.copy') + ' UUID'"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { HelpCircle } from 'lucide-vue-next';
import ToolSwitcher from '../components/ToolSwitcher.vue';
import ThemeToggleButton from '../components/ThemeToggleButton.vue';
import LanguageSwitcher from '../components/LanguageSwitcher.vue';
import { addDisableSaveShortcut, removeDisableSaveShortcut } from '../utils/keyboardUtils';

const uuid = ref('');

// Function to generate UUID v4
const generateUuid = () => {
  uuid.value = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const copyUuid = () => {
  if (uuid.value) {
    navigator.clipboard.writeText(uuid.value);
  }
};

const clearUuid = () => {
  uuid.value = '';
};

onMounted(() => {
  generateUuid(); // Generate a UUID on component mount
  // Disable save shortcut
  addDisableSaveShortcut();
});

onBeforeUnmount(() => {
  // Remove save shortcut disable
  removeDisableSaveShortcut();
});
</script>
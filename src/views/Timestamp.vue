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
              <h1 class="text-xl font-semibold">{{ $t('tools.timestamp.name') }}</h1>
              <div class="relative group">
                <HelpCircle class="h-5 w-5 text-muted-foreground cursor-pointer" />
                <div class="absolute top-full mt-2 w-80 bg-card border rounded-lg shadow-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p class="font-bold mb-2">{{ $t('tools.timestamp.name') }}</p>
                  <p class="mb-2">{{ $t('tools.timestamp.description') }}</p>
                  <p class="font-bold mb-1">输入支持:</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong>时间戳:</strong> 10位秒或13位毫秒</li>
                    <li><strong>日期字符串:</strong> 2023-01-01, YYYYMMDD</li>
                    <li><strong>ISO 8601:</strong> 2023-01-01T00:00:00Z</li>
                    <li><strong>自然语言:</strong> 今天, 明天等</li>
                  </ul>
                  <p class="font-bold mb-1">输出格式:</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li>本地时间、UTC时间、相对时间等</li>
                  </ul>
                  <p class="mt-2"><strong class="text-primary">{{ $t('app.example') }}:</strong></p>
                  <p class="text-xs font-mono bg-muted p-1 rounded">输入: <span class="text-red-400">1754063777432</span></p>
                  <p class="text-xs font-mono bg-muted p-1 rounded">输出: <span class="text-green-400">2025-08-01 23:56:17</span></p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="pasteAndParse" class="px-3 py-1.5 text-sm btn-secondary rounded-md">{{ $t('tools.timestamp.actions.pasteAndParse') }}</button>
            <button @click="setCurrentTime" class="px-3 py-1.5 text-sm btn-primary rounded-md">{{ $t('tools.timestamp.actions.setCurrentTime') }}</button>
            <LanguageSwitcher />
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>

    <!-- The rest of the template remains the same -->
    <main class="flex-1 container mx-auto px-4 py-8 flex justify-center">
      <div class="w-full max-w-3xl">
        <div class="relative">
          <input
            type="text"
            v-model="userInput"
            @input="parseInput"
            :placeholder="$t('common.placeholders.enterTimestamp')"
            class="w-full text-center text-xl font-mono p-4 pr-10 bg-transparent border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors"
            :class="isValid ? 'border-primary focus:ring-primary/50' : 'border-destructive focus:ring-destructive/50'"
          />
          <span v-if="isValid" class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</span>
          <span v-else-if="userInput" class="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">✗</span>
        </div>
        <div v-if="!isValid && userInput" class="text-center text-destructive text-sm mt-2">{{ $t('errors.invalidTimestamp') }}</div>
        <div v-if="isValid" class="mt-8 space-y-3">
          <h2 class="text-lg font-semibold text-center mb-4">{{ $t('tools.timestamp.result.title') }}</h2>
          <div v-for="(item, index) in outputFormats" :key="item.labelKey" class="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
            <span class="text-sm text-muted-foreground">{{ $t(item.labelKey) }}</span>
            <div class="flex items-center space-x-3">
              <span class="font-mono text-foreground">{{ item.value }}</span>
              <button @click="copyToClipboard(item.value)" :title="`${$t('common.copy')} (⌘+${index + 1})`" class="text-xs px-2 py-1 btn-secondary rounded">{{ $t('common.copy') }}</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { HelpCircle } from 'lucide-vue-next';
import ToolSwitcher from '../components/ToolSwitcher.vue';
import ThemeToggleButton from '../components/ThemeToggleButton.vue';
import LanguageSwitcher from '../components/LanguageSwitcher.vue';
import { addDisableSaveShortcut, removeDisableSaveShortcut } from '../utils/keyboardUtils';

// 获取 i18n 实例
const { t: $t } = useI18n();

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

// State
const userInput = ref('');
const parsedDate = ref<dayjs.Dayjs | null>(null);
const errorMessage = ref('');

// Computed
const isValid = computed(() => parsedDate.value !== null && parsedDate.value.isValid());

const outputFormats = computed(() => {
  if (!isValid.value || !parsedDate.value) return [];
  const d = parsedDate.value;
  return [
    { labelKey: 'tools.timestamp.result.localTime', value: d.format('YYYY-MM-DD HH:mm:ss') },
    { labelKey: 'tools.timestamp.result.localDate', value: d.format('YYYY-MM-DD') },
    { labelKey: 'tools.timestamp.result.timestampSec', value: d.unix() },
    { labelKey: 'tools.timestamp.result.timestampMs', value: d.valueOf() },
    { labelKey: 'tools.timestamp.result.utcTime', value: d.toISOString() },
    { labelKey: 'tools.timestamp.result.rfc2822', value: d.format('ddd, DD MMM YYYY HH:mm:ss ZZ') },
    { labelKey: 'tools.timestamp.result.relativeTime', value: d.fromNow() },
  ];
});

// Functions
const parseInput = () => {
  const input = userInput.value.trim();
  if (!input) {
    parsedDate.value = null;
    errorMessage.value = '';
    return;
  }

  let d: dayjs.Dayjs | null = null;

  // 优先尝试 YYYYMMDD 格式
  if (/^\d{8}$/.test(input)) {
    d = dayjs(input, 'YYYYMMDD');
    if (d.isValid()) {
      parsedDate.value = d;
      errorMessage.value = '';
      return;
    }
  }

  // 尝试作为时间戳解析 (秒或毫秒)
  if (/^\d+$/.test(input) && (input.length === 10 || input.length === 13)) {
    const num = Number(input);
    d = input.length === 10 ? dayjs.unix(num) : dayjs(num);
    if (d.isValid()) {
      parsedDate.value = d;
      errorMessage.value = '';
      return;
    }
  }

  // 尝试作为其他通用日期字符串解析
  d = dayjs(input);
  if (d.isValid()) {
    parsedDate.value = d;
    errorMessage.value = '';
  } else {
    parsedDate.value = null;
    errorMessage.value = $t('errors.invalidTimestamp');
  }
};

const setCurrentTime = () => {
  userInput.value = new Date().toISOString();
  parseInput();
};

const pasteAndParse = async () => {
  try {
    userInput.value = await navigator.clipboard.readText();
    parseInput();
  } catch (e) {
    errorMessage.value = $t('common.messages.cannotReadClipboard');
  }
};

const copyToClipboard = (text: string | number) => {
  navigator.clipboard.writeText(String(text));
};

// Lifecycle
onMounted(() => {
  setCurrentTime();
  // 禁用保存快捷键
  addDisableSaveShortcut();
});

onBeforeUnmount(() => {
  // 移除保存快捷键禁用
  removeDisableSaveShortcut();
});

</script>

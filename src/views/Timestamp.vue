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
              <h1 class="text-xl font-semibold">智能时间戳转换</h1>
              <div class="relative group">
                <HelpCircle class="h-5 w-5 text-muted-foreground cursor-pointer" />
                <div class="absolute top-full mt-2 w-80 bg-card border rounded-lg shadow-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p class="font-bold mb-2">智能时间戳转换工具说明</p>
                  <p class="mb-1">一个智能的时间转换工具，支持多种输入格式并实时显示多种输出结果。</p>
                  <p class="font-bold mb-1">输入支持:</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong class="font-semibold">时间戳:</strong> 10位 (秒) 或 13位 (毫秒) 纯数字，自动识别。</li>
                    <li><strong class="font-semibold">日期字符串:</strong> 如 "2025-08-01 23:56:17"。</li>
                    <li><strong class="font-semibold">ISO 8601:</strong> 如 "2025-08-01T15:56:17Z"。</li>
                    <li><strong class="font-semibold">自然语言日期:</strong> 如 "August 1, 2025 11:56 PM" (英文)。</li>
                  </ul>
                  <p class="font-bold mb-1">输出格式:</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li>本地时间 (UTC+8), 本地日期, 时间戳 (秒/毫秒), UTC时间 (ISO 8601), RFC 2822, 相对时间。</li>
                  </ul>
                  <p class="font-bold mb-1">按钮说明:</p>
                  <ul class="list-disc list-inside text-xs">
                    <li><strong class="font-semibold">粘贴并解析:</strong> 从剪贴板粘贴内容并自动解析。</li>
                    <li><strong class="font-semibold">设为当前时间:</strong> 将输入框设置为当前时间并解析。</li>
                    <li><strong class="font-semibold">复制:</strong> 复制对应行的结果到剪贴板。</li>
                  </ul>
                  <p class="mt-2"><strong class="text-primary">示例:</strong></p>
                  <p class="text-xs font-mono bg-muted p-1 rounded">输入: <span class="text-red-400">1754063777432</span></p>
                  <p class="text-xs font-mono bg-muted p-1 rounded">输出 (本地时间): <span class="text-green-400">2025-08-01 23:56:17</span></p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="pasteAndParse" class="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-md">粘贴并解析</button>
            <button @click="setCurrentTime" class="px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">设为当前时间</button>
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
            placeholder="输入时间戳、日期字符串或自然语言..."
            class="w-full text-center text-xl font-mono p-4 pr-10 bg-transparent border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors"
            :class="isValid ? 'border-primary focus:ring-primary/50' : 'border-destructive focus:ring-destructive/50'"
          />
          <span v-if="isValid" class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</span>
          <span v-else-if="userInput" class="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">✗</span>
        </div>
        <div v-if="!isValid && userInput" class="text-center text-destructive text-sm mt-2">{{ errorMessage }}</div>
        <div v-if="isValid" class="mt-8 space-y-3">
          <h2 class="text-lg font-semibold text-center mb-4">转换结果</h2>
          <div v-for="(item, index) in outputFormats" :key="item.label" class="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
            <span class="text-sm text-muted-foreground">{{ item.label }}</span>
            <div class="flex items-center space-x-3">
              <span class="font-mono text-foreground">{{ item.value }}</span>
              <button @click="copyToClipboard(item.value)" :title="`复制 (⌘+${index + 1})`" class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80">复制</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { HelpCircle } from 'lucide-vue-next';
import ToolSwitcher from '../components/ToolSwitcher.vue';

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
    { label: '本地时间 (UTC+8)', value: d.format('YYYY-MM-DD HH:mm:ss') },
    { label: '本地日期', value: d.format('YYYY-MM-DD') },
    { label: '时间戳 (秒)', value: d.unix() },
    { label: '时间戳 (毫秒)', value: d.valueOf() },
    { label: 'UTC 时间 (ISO 8601)', value: d.toISOString() },
    { label: 'RFC 2822', value: d.format('ddd, DD MMM YYYY HH:mm:ss ZZ') },
    { label: '相对时间', value: d.fromNow() },
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
    errorMessage.value = '无法识别的日期格式';
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
    errorMessage.value = '无法读取剪贴板';
  }
};

const copyToClipboard = (text: string | number) => {
  navigator.clipboard.writeText(String(text));
};

// Lifecycle
onMounted(() => {
  setCurrentTime();
});

</script>

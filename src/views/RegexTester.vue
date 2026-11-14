<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <Regex class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.regexTester.name') }}</span>
        </div>
        <div class="h-4 w-px bg-border flex-shrink-0"></div>
        <!-- Flags -->
        <div class="flex items-center space-x-2">
          <CustomCheckbox
            v-for="flag in flags"
            :key="flag.value"
            v-model="flag.enabled"
            :label="flag.label"
          />
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="showHelp = !showHelp" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <HelpCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto p-4 flex flex-col space-y-4">
      <!-- Regex Input -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-muted-foreground">{{ $t('tools.regexTester.regex') }}</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">/</span>
          <input
            v-model="regexPattern"
            type="text"
            class="w-full bg-card border border-border rounded-lg pl-6 pr-12 py-2 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            :class="{ 'border-destructive focus:border-destructive focus:ring-destructive/20': error }"
            placeholder="Pattern..."
          />
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">/{{ activeFlags }}</span>
        </div>
        <p v-if="error" class="text-xs text-destructive">{{ error }}</p>
        <p v-else-if="truncated" class="text-xs text-muted-foreground">{{ $t('tools.regexTester.truncated') }}</p>
      </div>

      <!-- Test String -->
      <div class="space-y-2 flex-1 flex flex-col min-h-0">
        <label class="text-sm font-medium text-muted-foreground">{{ $t('tools.regexTester.testString') }}</label>
        <div class="flex-1 relative border border-border rounded-lg bg-card overflow-hidden">
          <!-- Backdrop for highlighting -->
          <div ref="backdropRef" class="absolute inset-0 p-4 font-mono text-sm whitespace-pre-wrap break-all pointer-events-none text-transparent z-0 overflow-hidden" style="scrollbar-gutter: stable" v-html="highlightedText"></div>
          <!-- Actual textarea -->
          <textarea
            v-model="testString"
            class="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-transparent border-none outline-none resize-none z-10 text-foreground/80 break-all overflow-auto"
            style="scrollbar-gutter: stable"
            spellcheck="false"
            @scroll="onTextareaScroll"
          ></textarea>
        </div>
      </div>

      <!-- Matches -->
      <div class="h-1/3 border border-border rounded-lg bg-card overflow-hidden flex flex-col">
        <div class="px-4 py-2 border-b border-border bg-muted/30">
          <h3 class="text-xs font-medium text-muted-foreground">{{ $t('tools.regexTester.matches') }} ({{ matches.length }})</h3>
        </div>
        <div class="flex-1 overflow-auto p-4 space-y-2">
          <div v-for="(match, index) in matches" :key="index" class="text-sm font-mono bg-muted/50 p-2 rounded border border-border/50">
            <div class="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Match {{ index + 1 }}</span>
              <span>Index: {{ match.index }}</span>
            </div>
            <div class="font-medium break-all">{{ match.text }}</div>
            <div v-if="match.groups.length > 0" class="mt-2 pl-2 border-l-2 border-primary/20 space-y-1">
              <div v-for="(group, gIndex) in match.groups" :key="gIndex" class="text-xs">
                <span class="text-muted-foreground">Group {{ gIndex + 1 }}:</span> <span class="text-foreground">{{ group }}</span>
              </div>
            </div>
            <div v-if="Object.keys(match.named).length > 0" class="mt-2 pl-2 border-l-2 border-primary/40 space-y-1">
              <div v-for="(val, name) in match.named" :key="name" class="text-xs">
                <span class="text-muted-foreground">{{ name }}:</span> <span class="text-foreground">{{ val }}</span>
              </div>
            </div>
          </div>
          <div v-if="matches.length === 0" class="text-sm text-muted-foreground text-center py-4">
            {{ $t('errors.noResults') }}
          </div>
        </div>
      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.regexTester.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.regexTester.description') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onBeforeUnmount } from 'vue';
import { Regex, HelpCircle, X } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import CustomCheckbox from '../components/CustomCheckbox.vue';
import RegexWorker from '../workers/regex.worker?worker';
import { buildHighlightHtml, type MatchInfo } from '../utils/regexMatch';

const { t } = useI18n();

const regexPattern = ref('');
const testString = ref('Hello World! 123');
const showHelp = ref(false);
const error = ref('');
const truncated = ref(false);

const flags = reactive([
  { value: 'g', label: 'Global (g)', enabled: true },
  { value: 'i', label: 'Insensitive (i)', enabled: true },
  { value: 'm', label: 'Multiline (m)', enabled: false },
  { value: 's', label: 'DotAll (s)', enabled: false },
  { value: 'u', label: 'Unicode (u)', enabled: false },
]);

const activeFlags = computed(() => flags.filter(f => f.enabled).map(f => f.value).join(''));

const matches = ref<MatchInfo[]>([]);

// ---- Worker 执行：灾难性回溯时超时后直接 terminate，避免页面假死 ----
const EXEC_TIMEOUT_MS = 1000;
let worker: Worker | null = null;
let requestId = 0;
let timeoutTimer: ReturnType<typeof setTimeout> | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const ensureWorker = () => {
  if (worker) return worker;
  worker = new RegexWorker();
  worker.onmessage = (e: MessageEvent<any>) => {
    const msg = e.data;
    if (msg.id !== requestId) return; // 过期结果
    if (timeoutTimer) clearTimeout(timeoutTimer);
    if (msg.ok) {
      matches.value = msg.result.matches;
      truncated.value = msg.result.truncated;
      error.value = '';
    } else {
      matches.value = [];
      truncated.value = false;
      error.value = msg.error;
    }
  };
  return worker;
};

const killWorker = () => {
  worker?.terminate();
  worker = null;
};

const computeMatches = () => {
  if (timeoutTimer) clearTimeout(timeoutTimer);
  if (!regexPattern.value) {
    matches.value = [];
    error.value = '';
    truncated.value = false;
    requestId++;
    return;
  }
  // 先在主线程校验语法（构造 RegExp 本身是安全的），非法时立即给出错误，无需起 Worker
  try {
    new RegExp(regexPattern.value, activeFlags.value);
  } catch (e: unknown) {
    matches.value = [];
    error.value = e instanceof Error ? e.message : String(e);
    requestId++;
    return;
  }
  const id = ++requestId;
  ensureWorker().postMessage({ id, pattern: regexPattern.value, flags: activeFlags.value, text: testString.value });
  timeoutTimer = setTimeout(() => {
    if (id !== requestId) return;
    killWorker();
    matches.value = [];
    truncated.value = false;
    error.value = t('tools.regexTester.timeout', { ms: EXEC_TIMEOUT_MS });
  }, EXEC_TIMEOUT_MS);
};

watch([regexPattern, testString, activeFlags], () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(computeMatches, 120);
}, { immediate: true });

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
  if (timeoutTimer) clearTimeout(timeoutTimer);
  killWorker();
});

const highlightedText = computed(() => buildHighlightHtml(testString.value, error.value ? [] : matches.value));

// textarea 滚动时同步背景高亮层，避免长文本滚动后高亮错位
const backdropRef = ref<HTMLElement | null>(null);
const onTextareaScroll = (e: Event) => {
  const el = e.target as HTMLTextAreaElement;
  if (backdropRef.value) {
    backdropRef.value.scrollTop = el.scrollTop;
    backdropRef.value.scrollLeft = el.scrollLeft;
  }
};
</script>

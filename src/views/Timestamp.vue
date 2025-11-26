<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4 overflow-x-auto no-scrollbar">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <Clock class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.timestamp.name') }}</span>
        </div>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center space-x-2 flex-shrink-0 ml-4">
        <button @click="pasteAndParse" class="px-3 py-1.5 text-xs font-medium btn-secondary rounded-md flex items-center space-x-1.5 transition-colors">
          <ClipboardPaste class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ $t('tools.timestamp.actions.pasteAndParse') }}</span>
        </button>
        <button @click="setCurrentTime" class="px-3 py-1.5 text-xs font-medium btn-primary rounded-md flex items-center space-x-1.5 transition-colors">
          <RefreshCw class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ $t('tools.timestamp.actions.setCurrentTime') }}</span>
        </button>
        <div class="h-4 w-px bg-border mx-1"></div>
        <button @click="showHelp = !showHelp" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <HelpCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <main class="flex-1 container mx-auto px-4 py-8 flex justify-center overflow-auto">
      <div class="w-full max-w-3xl space-y-8">
        <!-- Input Section -->
        <div class="space-y-2">
          <div class="relative group">
            <input
              type="text"
              v-model="userInput"
              @input="parseInput"
              :placeholder="$t('common.placeholders.enterTimestamp')"
              class="w-full text-center text-xl font-mono p-4 pr-12 bg-card border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              :class="isValid ? 'border-primary/50 focus:border-primary' : (userInput ? 'border-destructive/50 focus:border-destructive' : 'border-border focus:border-primary')"
            />
            <div class="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-200" :class="userInput ? 'opacity-100' : 'opacity-0'">
              <CheckCircle2 v-if="isValid" class="w-5 h-5 text-green-500" />
              <AlertCircle v-else class="w-5 h-5 text-destructive" />
            </div>
          </div>
          <p v-if="!isValid && userInput" class="text-center text-destructive text-xs font-medium animate-pulse">{{ $t('errors.invalidTimestamp') }}</p>
          <p v-else class="text-center text-muted-foreground text-xs">
            Supports: Unix Timestamp (s/ms), ISO 8601, YYYY-MM-DD, Natural Language
          </p>
        </div>

        <!-- Results Section -->
        <div v-if="isValid" class="bg-card border border-border rounded-lg overflow-hidden shadow-sm animate-slide-up">
          <div class="px-4 py-3 border-b border-border bg-muted/30">
            <h2 class="text-sm font-semibold">{{ $t('tools.timestamp.result.title') }}</h2>
          </div>
          <div class="divide-y divide-border">
            <div v-for="item in outputFormats" :key="item.labelKey" class="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors group">
              <span class="text-xs font-medium text-muted-foreground">{{ $t(item.labelKey) }}</span>
              <div class="flex items-center space-x-3">
                <span class="font-mono text-foreground text-sm select-all">{{ item.value }}</span>
                <button
                  @click="copyToClipboard(item.value)"
                  class="p-1.5 hover:bg-primary/10 hover:text-primary rounded-md opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                  :title="$t('common.copy')"
                >
                  <Copy class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.timestamp.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.timestamp.description') }}</p>
          <div>
            <p class="font-bold mb-2">Input Formats:</p>
            <ul class="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>Timestamp:</strong> 10 digits (s) or 13 digits (ms)</li>
              <li><strong>Date String:</strong> 2023-01-01, YYYYMMDD</li>
              <li><strong>ISO 8601:</strong> 2023-01-01T00:00:00Z</li>
              <li><strong>Natural:</strong> now, today, tomorrow</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { HelpCircle, Clock, ClipboardPaste, RefreshCw, CheckCircle2, AlertCircle, Copy, X } from 'lucide-vue-next';
import { addDisableSaveShortcut, removeDisableSaveShortcut } from '../utils/keyboardUtils';

const { t: $t } = useI18n();

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

const userInput = ref('');
const parsedDate = ref<dayjs.Dayjs | null>(null);
const errorMessage = ref('');
const showHelp = ref(false);

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

const parseInput = () => {
  const input = userInput.value.trim();
  if (!input) {
    parsedDate.value = null;
    errorMessage.value = '';
    return;
  }

  let d: dayjs.Dayjs | null = null;

  if (/^\d{8}$/.test(input)) {
    d = dayjs(input, 'YYYYMMDD');
    if (d.isValid()) {
      parsedDate.value = d;
      errorMessage.value = '';
      return;
    }
  }

  if (/^\d+$/.test(input) && (input.length === 10 || input.length === 13)) {
    const num = Number(input);
    d = input.length === 10 ? dayjs.unix(num) : dayjs(num);
    if (d.isValid()) {
      parsedDate.value = d;
      errorMessage.value = '';
      return;
    }
  }

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

onMounted(() => {
  setCurrentTime();
  addDisableSaveShortcut();
});

onBeforeUnmount(() => {
  removeDisableSaveShortcut();
});
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

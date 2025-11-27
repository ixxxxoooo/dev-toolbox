<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <Regex class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.regexTester.name') }}</span>
        </div>
        <div class="h-4 w-px bg-border flex-shrink-0"></div>
        <!-- Flags -->
        <div class="flex items-center space-x-2">
          <label v-for="flag in flags" :key="flag.value" class="flex items-center space-x-1 cursor-pointer">
            <input type="checkbox" v-model="flag.enabled" class="rounded border-muted-foreground/30 text-primary focus:ring-primary w-3.5 h-3.5">
            <span class="text-xs text-muted-foreground">{{ flag.label }}</span>
          </label>
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
      </div>

      <!-- Test String -->
      <div class="space-y-2 flex-1 flex flex-col min-h-0">
        <label class="text-sm font-medium text-muted-foreground">{{ $t('tools.regexTester.testString') }}</label>
        <div class="flex-1 relative border border-border rounded-lg bg-card overflow-hidden">
          <!-- Backdrop for highlighting -->
          <div class="absolute inset-0 p-4 font-mono text-sm whitespace-pre-wrap break-all pointer-events-none text-transparent z-0" v-html="highlightedText"></div>
          <!-- Actual textarea -->
          <textarea
            v-model="testString"
            class="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-transparent border-none outline-none resize-none z-10 text-foreground/80 break-all"
            spellcheck="false"
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
            <div class="font-medium break-all">{{ match[0] }}</div>
            <div v-if="match.length > 1" class="mt-2 pl-2 border-l-2 border-primary/20 space-y-1">
              <div v-for="(group, gIndex) in match.slice(1)" :key="gIndex" class="text-xs">
                <span class="text-muted-foreground">Group {{ gIndex + 1 }}:</span> <span class="text-foreground">{{ group }}</span>
              </div>
            </div>
          </div>
          <div v-if="matches.length === 0" class="text-sm text-muted-foreground text-center py-4">
            {{ $t('common.errors.noResults') }}
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
import { ref, computed, reactive } from 'vue';
import { Regex, HelpCircle, X } from 'lucide-vue-next';

const regexPattern = ref('');
const testString = ref('Hello World! 123');
const showHelp = ref(false);
const error = ref('');

const flags = reactive([
  { value: 'g', label: 'Global (g)', enabled: true },
  { value: 'i', label: 'Insensitive (i)', enabled: true },
  { value: 'm', label: 'Multiline (m)', enabled: false },
]);

const activeFlags = computed(() => flags.filter(f => f.enabled).map(f => f.value).join(''));

const matches = computed(() => {
  error.value = '';
  if (!regexPattern.value) return [];
  try {
    const re = new RegExp(regexPattern.value, activeFlags.value);
    if (!re.global) {
      const match = re.exec(testString.value);
      return match ? [match] : [];
    }
    return [...testString.value.matchAll(re)];
  } catch (e: any) {
    error.value = e.message;
    return [];
  }
});

const highlightedText = computed(() => {
  if (!regexPattern.value || error.value) return escapeHtml(testString.value);
  try {

    // This is a simplified highlighting logic. For perfect highlighting, we'd need more complex parsing.
    // Here we just replace matches with highlighted spans.
    // Note: This simple replace approach has limitations with overlapping matches or complex groups,
    // but suffices for basic visual feedback.

    // A safer approach for visualization is to iterate matches and build the string.
    let lastIndex = 0;
    let html = '';
    const currentMatches = matches.value; // Use computed matches

    if (currentMatches.length === 0) return escapeHtml(testString.value);

    // If global flag is not set, matchAll/matches logic differs slightly, but let's assume standard behavior
    for (const match of currentMatches) {
        if (match.index === undefined) continue;
        // Append text before match
        html += escapeHtml(testString.value.slice(lastIndex, match.index));
        // Append highlighted match
        html += `<span class="bg-yellow-500/30 text-yellow-200 rounded-sm">${escapeHtml(match[0])}</span>`;
        lastIndex = match.index + match[0].length;

        // Prevent infinite loop for zero-length matches
        if (match[0].length === 0) lastIndex++;
    }
    // Append remaining text
    html += escapeHtml(testString.value.slice(lastIndex));
    return html;
  } catch (e) {
    return escapeHtml(testString.value);
  }
});

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
</script>

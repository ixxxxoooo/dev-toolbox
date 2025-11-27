<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <FileText class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.markdown.name') }}</span>
        </div>
        <div class="h-4 w-px bg-border flex-shrink-0"></div>
        <button @click="copyHtml" class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground">
          {{ $t('tools.markdown.copyHtml') }}
        </button>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="showHelp = !showHelp" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <HelpCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden flex">
      <!-- Editor -->
      <div class="flex-1 flex flex-col border-r border-border min-w-0">
        <div class="px-3 py-1.5 bg-muted/30 border-b border-border text-xs font-medium text-muted-foreground">
          Markdown
        </div>
        <div class="flex-1 relative">
          <textarea
            v-model="markdown"
            class="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-transparent border-none outline-none resize-none"
            placeholder="# Hello World"
          ></textarea>
        </div>
      </div>

      <!-- Preview -->
      <div class="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0d1117]">
        <div class="px-3 py-1.5 bg-muted/30 border-b border-border text-xs font-medium text-muted-foreground">
          Preview
        </div>
        <div class="flex-1 relative overflow-auto p-8 prose dark:prose-invert max-w-none">
          <div v-html="html"></div>
        </div>
      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.markdown.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.markdown.description') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FileText, HelpCircle, X } from 'lucide-vue-next';
import { marked } from 'marked';

const markdown = ref('# Hello World\n\nStart typing markdown here...');
const showHelp = ref(false);

const html = computed(() => {
  return marked(markdown.value);
});

const copyHtml = () => {
  navigator.clipboard.writeText(html.value as string);
};
</script>

<style>
/* Basic Prose styles for preview */
.prose h1 { @apply text-2xl font-bold mb-4; }
.prose h2 { @apply text-xl font-bold mb-3 mt-6; }
.prose h3 { @apply text-lg font-bold mb-2 mt-4; }
.prose p { @apply mb-4 leading-relaxed; }
.prose ul { @apply list-disc list-inside mb-4; }
.prose ol { @apply list-decimal list-inside mb-4; }
.prose code { @apply bg-muted px-1.5 py-0.5 rounded text-sm font-mono; }
.prose pre { @apply bg-muted p-4 rounded-lg overflow-x-auto mb-4; }
.prose pre code { @apply bg-transparent p-0; }
.prose blockquote { @apply border-l-4 border-primary/50 pl-4 italic mb-4; }
.prose a { @apply text-primary hover:underline; }
.prose img { @apply max-w-full rounded-lg; }
.prose table { @apply w-full border-collapse mb-4; }
.prose th, .prose td { @apply border border-border px-3 py-2; }
.prose th { @apply bg-muted/50 font-bold text-left; }
</style>

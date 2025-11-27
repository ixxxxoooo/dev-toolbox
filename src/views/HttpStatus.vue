<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <Globe class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.httpStatus.name') }}</span>
        </div>
        <div class="h-4 w-px bg-border flex-shrink-0"></div>
        <!-- Search -->
        <div class="relative">
          <Search class="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('common.placeholders.searchTools')"
            class="pl-8 pr-3 py-1 text-xs bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-48"
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
    <main class="flex-1 overflow-auto p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="status in filteredCodes"
          :key="status.code"
          class="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xl font-bold font-mono" :class="getStatusColor(status.code)">{{ status.code }}</span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{{ status.category }}</span>
          </div>
          <h3 class="font-medium mb-1">{{ status.title }}</h3>
          <p class="text-sm text-muted-foreground">{{ status.description }}</p>
        </div>
      </div>

      <div v-if="filteredCodes.length === 0" class="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <SearchX class="w-12 h-12 mb-4 opacity-50" />
        <p>{{ $t('common.errors.noResults') }}</p>
      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.httpStatus.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.httpStatus.description') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Globe, Search, HelpCircle, X, SearchX } from 'lucide-vue-next';

import { useI18n } from 'vue-i18n';

const { tm } = useI18n() as any;
const searchQuery = ref('');
const showHelp = ref(false);

const codes = computed(() => tm('tools.httpStatus.codes') as any[]);

const filteredCodes = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const currentCodes = codes.value || [];

  if (!query) return currentCodes;
  return currentCodes.filter(c =>
    c.code.toString().includes(query) ||
    c.title.toLowerCase().includes(query) ||
    c.description.toLowerCase().includes(query)
  );
});

const getStatusColor = (code: number) => {
  if (code >= 500) return 'text-red-500';
  if (code >= 400) return 'text-orange-500';
  if (code >= 300) return 'text-blue-500';
  if (code >= 200) return 'text-green-500';
  return 'text-gray-500';
};
</script>

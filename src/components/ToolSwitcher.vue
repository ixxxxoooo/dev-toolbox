<template>
  <div class="relative group" ref="switcherRef">
    <button class="p-2 rounded-lg hover:bg-secondary transition-colors btn-icon" :title="$t('nav.tools')">
      <LayoutGrid class="h-5 w-5" />
    </button>

    <div class="absolute top-full left-0 mt-0.5 w-56 bg-card border border-border rounded-lg shadow-lg z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
      <div class="p-2">
        <router-link
          v-for="module in modules"
          :key="module.id"
          :to="module.route"
          class="flex items-center space-x-3 px-3 py-2 rounded-md text-sm text-foreground hover:bg-secondary transition-all duration-150 active:bg-secondary/70 active:scale-95 whitespace-nowrap"
        >
          <component :is="getIconComponent(module.icon)" class="h-4 w-4 text-primary flex-shrink-0" />
          <span class="flex-1 truncate">{{ $t(module.name) }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LayoutGrid, Home, FileText, Clock, Link, Binary, Braces, Key, TextCursor, Hash, Database, Shield } from 'lucide-vue-next';
import { modules } from '../utils/modules';

const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: any } = {
    'home': Home,
    'file-text': FileText,
    'clock': Clock,
    'link': Link,
    'binary': Binary,
    'braces': Braces,
    'key': Key,
    'text-cursor': TextCursor,
    'hash': Hash,
    'database': Database,
    'shield': Shield,
  };
  return icons[iconName];
};
</script>

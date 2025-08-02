<template>
  <div class="relative group" ref="switcherRef">
    <button @click="toggleDropdown" class="p-2 rounded-lg hover:bg-secondary transition-colors btn-icon" title="切换工具">
      <LayoutGrid class="h-5 w-5" />
    </button>
    
    <!-- 悬浮提示 -->
    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-card border border-border rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
      工具切换器
      <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
    </div>

    <div v-if="isOpen" class="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
      <div class="p-2">
        <router-link 
          v-for="module in modules" 
          :key="module.id" 
          :to="module.route" 
          @click="closeDropdown" 
          class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-foreground hover:bg-secondary transition-all duration-150 active:bg-secondary/70 active:scale-95 relative group"
          :title="module.description"
        >
          <component :is="getIconComponent(module.icon)" class="h-4 w-4 text-primary" />
          <span>{{ module.name }}</span>
          <div class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-card border border-border rounded-lg shadow-lg p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
            {{ module.description }}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { LayoutGrid, Home, FileText, Clock, Link, Binary, Braces, Key, TextCursor, Hash, Database, Shield } from 'lucide-vue-next';
import { modules } from '../utils/modules';

const isOpen = ref(false);
const switcherRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (switcherRef.value && !switcherRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

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

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

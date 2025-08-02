<template>
  <div class="relative" ref="switcherRef">
    <button @click="toggleDropdown" class="p-2 rounded-lg hover:bg-secondary transition-colors" title="切换工具">
      <LayoutGrid class="h-5 w-5" />
    </button>

    <div v-if="isOpen" class="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
      <div class="p-2">
        <router-link 
          v-for="module in modules" 
          :key="module.id" 
          :to="module.route" 
          @click="closeDropdown" 
          class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-foreground hover:bg-secondary transition-colors"
        >
          <component :is="getIconComponent(module.icon)" class="h-4 w-4 text-primary" />
          <span>{{ module.name }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { LayoutGrid, Home, FileText, Clock, Link, Binary, Braces, Key, TextCursor, Hash } from 'lucide-vue-next';
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

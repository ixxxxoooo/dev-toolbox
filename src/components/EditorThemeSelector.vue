<template>
  <div class="relative group">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200"
      :class="isOpen ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
      :title="$t('common.editorTheme.select')"
    >
      <Palette class="w-4 h-4" />
      <span v-if="!collapsed" class="font-medium truncate max-w-[100px]">{{ currentThemeName }}</span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="fixed z-[60] bottom-20 left-4 w-64 bg-card border border-border rounded-xl shadow-2xl p-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
      @mouseleave="isOpen = false"
    >
      <div class="px-3 py-2 mb-1 border-b border-border/50">
        <span class="text-xs font-bold text-muted-foreground uppercase tracking-wider">{{ $t('common.editorTheme.title') }}</span>
      </div>
      <div class="max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
        <button
          v-for="theme in EDITOR_THEMES"
          :key="theme.id"
          @click="selectTheme(theme.id)"
          class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all group/item mb-1"
          :class="themeStore.editorTheme.value === theme.id ? 'bg-primary/10 text-primary shadow-sm' : 'hover:bg-muted text-muted-foreground hover:text-foreground'"
        >
          <div class="flex items-center space-x-3">
            <div class="flex -space-x-1">
              <div 
                class="w-3.5 h-3.5 rounded-full ring-2 ring-background z-10" 
                :style="{ backgroundColor: theme.colors[0] }"
              ></div>
              <div 
                class="w-3.5 h-3.5 rounded-full ring-2 ring-background" 
                :style="{ backgroundColor: theme.colors[1] }"
              ></div>
            </div>
            <span class="font-medium">{{ theme.name }}</span>
          </div>
          <Check v-if="themeStore.editorTheme.value === theme.id" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Palette, Check } from 'lucide-vue-next'
import { useThemeStore } from '../stores/theme'
import { EDITOR_THEMES } from '../utils/monaco-themes'

defineProps<{
  collapsed?: boolean
}>()

const themeStore = useThemeStore()
const isOpen = ref(false)

const currentThemeName = computed(() => {
  return EDITOR_THEMES.find(t => t.id === themeStore.editorTheme.value)?.name || 'Theme'
})

const selectTheme = (themeId: string) => {
  themeStore.setEditorTheme(themeId)
  isOpen.value = false
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.3);
}
</style>

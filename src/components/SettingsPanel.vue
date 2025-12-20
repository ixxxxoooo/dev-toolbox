<template>
  <div class="relative w-full">
    <!-- Trigger Button -->
    <button
      @click.stop="isOpen = !isOpen"
      class="flex items-center h-10 px-3 rounded-lg text-sm font-medium transition-all duration-300 group/btn w-full overflow-hidden"
      :class="[
        isOpen ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      ]"
      :title="$t('common.settings.title')"
    >
      <div class="w-6 h-6 shrink-0 flex items-center justify-center transition-all duration-300" :class="collapsed ? 'mr-0' : 'mr-3'">
        <Settings 
          class="w-5 h-5 transition-transform duration-300 shrink-0" 
          :class="{ 'rotate-90': isOpen }" 
        />
      </div>
      <span 
        class="whitespace-nowrap transition-all duration-300 overflow-hidden"
        :class="collapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'"
      >
        {{ $t('common.settings.title') }}
      </span>
    </button>

    <!-- Settings Modal (Centered Overlay) -->
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm" @click.self="isOpen = false">
        <div class="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
          
          <!-- Header -->
          <div class="px-8 py-5 border-b border-border bg-muted/30 flex items-center justify-between shrink-0 font-sans">
            <div class="flex items-center space-x-2">
              <Settings class="w-5 h-5 text-primary" />
              <h3 class="font-bold text-base text-card-foreground">{{ $t('common.settings.title') }}</h3>
            </div>
            <button @click="isOpen = false" class="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-card-foreground">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Content -->
          <div class="p-8 space-y-8 overflow-y-auto custom-scrollbar font-sans">
            <div class="grid grid-cols-2 gap-x-12">
              
              <!-- Left Column: Core Settings -->
              <div class="space-y-10">
                <!-- Appearance Section -->
                <section class="space-y-4">
                  <div class="flex items-center space-x-2 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                    <Monitor class="w-3.5 h-3.5" />
                    <span>{{ $t('common.settings.appearance') }}</span>
                  </div>
                  
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      v-for="mode in ['system', 'light', 'dark'] as const"
                      :key="mode"
                      @click="themeStore.setThemeMode(mode)"
                      class="flex flex-col items-center justify-center space-y-2 px-3 py-3.5 rounded-xl border text-xs transition-all duration-200"
                      :class="(mode === 'system' && themeStore.followSystemMode.value) || 
                              (mode === 'light' && !themeStore.followSystemMode.value && !themeStore.isDark.value) ||
                              (mode === 'dark' && !themeStore.followSystemMode.value && themeStore.isDark.value)
                              ? 'bg-primary/10 border-primary/20 text-primary shadow-sm ring-1 ring-primary/20' 
                              : 'bg-muted/10 border-transparent text-muted-foreground hover:bg-muted/20 hover:border-border/50'"
                    >
                      <component :is="mode === 'system' ? Laptop : (mode === 'light' ? Sun : Moon)" class="w-4 h-4" />
                      <span class="font-medium">{{ mode === 'system' ? $t('common.editorTheme.auto') : (mode === 'light' ? $t('common.settings.lightMode') : $t('common.settings.darkMode')) }}</span>
                    </button>
                  </div>
                </section>

                <!-- Language Section -->
                <section class="space-y-4">
                  <div class="flex items-center space-x-2 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                    <Languages class="w-3.5 h-3.5" />
                    <span>{{ $t('common.settings.language') }}</span>
                  </div>
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      v-for="lang in ['system', 'zh', 'en'] as const"
                      :key="lang"
                      @click="themeStore.setLanguage(lang)"
                      class="flex flex-col items-center justify-center space-y-2 px-3 py-3.5 rounded-xl border text-xs transition-all duration-200"
                      :class="(lang === 'system' && themeStore.followSystemLang.value) || 
                              (lang === 'zh' && !themeStore.followSystemLang.value && currentLang === 'zh') ||
                              (lang === 'en' && !themeStore.followSystemLang.value && currentLang === 'en')
                              ? 'bg-primary/10 border-primary/20 text-primary shadow-sm ring-1 ring-primary/20' 
                              : 'bg-muted/10 border-transparent text-muted-foreground hover:bg-muted/20 hover:border-border/50'"
                    >
                      <Globe v-if="lang === 'system'" class="w-4 h-4" />
                      <span v-else class="text-[10px] font-bold">{{ lang.toUpperCase() }}</span>
                      <span class="font-medium">{{ lang === 'system' ? $t('common.editorTheme.auto') : (lang === 'zh' ? '中文' : 'English') }}</span>
                    </button>
                  </div>
                </section>

                <!-- History Section -->
                <section class="space-y-4">
                  <div class="flex items-center space-x-2 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                    <HistoryIcon class="w-3.5 h-3.5" />
                    <span>{{ $t('common.settings.history') }}</span>
                  </div>
                  <div class="space-y-5 bg-muted/10 p-5 rounded-2xl border border-border/40">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-foreground font-semibold">{{ $t('common.settings.historyLimit') }}</span>
                      <span class="text-xs font-mono font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">{{ themeStore.historyLimit.value }}</span>
                    </div>
                    <div class="px-1">
                      <input 
                        type="range" 
                        min="10" 
                        max="200" 
                        step="10"
                        :value="themeStore.historyLimit.value"
                        @input="(e: any) => themeStore.setHistoryLimit(parseInt(e.target.value))"
                        class="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                      >
                    </div>
                    <div class="flex justify-between text-[10px] text-muted-foreground/60 font-medium px-1">
                      <span>10 items</span>
                      <span>100 items</span>
                      <span>200 items</span>
                    </div>
                  </div>
                </section>
              </div>

              <!-- Right Column: Editor Themes -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                    <Palette class="w-3.5 h-3.5" />
                    <span>{{ $t('common.editorTheme.title') }}</span>
                  </div>
                  <span class="text-[10px] text-primary/60 font-medium px-2 py-0.5 bg-primary/5 rounded-full border border-primary/10">
                    {{ currentThemeName }}
                  </span>
                </div>

                <div class="grid grid-cols-1 gap-2 max-h-[460px] overflow-y-auto custom-scrollbar pr-2 pb-4">
                  <button
                    v-for="theme in EDITOR_THEMES"
                    :key="theme.id"
                    @click="themeStore.setEditorTheme(theme.id)"
                    class="flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 group/item"
                    :class="themeStore.editorTheme.value === theme.id 
                      ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                      : 'bg-muted/10 border-transparent text-muted-foreground hover:bg-muted/20 hover:border-border/50 hover:text-foreground'"
                  >
                    <div class="flex items-center space-x-4">
                      <!-- Progressively overlapping dots -->
                      <div class="flex -space-x-1.5">
                        <div 
                          class="w-4 h-4 rounded-full border border-background shadow-sm z-10" 
                          :style="{ backgroundColor: theme.colors[0] }"
                        ></div>
                        <div 
                          class="w-4 h-4 rounded-full border border-background shadow-sm" 
                          :style="{ backgroundColor: theme.colors[1] }"
                        ></div>
                      </div>
                      <div class="flex flex-col items-start">
                        <span class="text-sm font-semibold tracking-tight">
                          {{ theme.id === 'auto' ? $t('common.editorTheme.auto') : theme.name }}
                        </span>
                        <span class="text-[10px] uppercase opacity-50 font-bold tracking-wider">
                          {{ theme.type }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                      <Check v-if="themeStore.editorTheme.value === theme.id" class="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Settings, X, Sun, Moon, Palette, Languages, Check, Monitor, Laptop, Globe, History as HistoryIcon } from 'lucide-vue-next'
import { useThemeStore } from '../stores/theme'
import { useI18n } from 'vue-i18n'
import { EDITOR_THEMES } from '../utils/monaco-themes'

defineProps<{
  collapsed?: boolean
}>()

const themeStore = useThemeStore()
const { locale, t } = useI18n()
const isOpen = ref(false)

const currentLang = computed(() => locale.value)
const currentThemeName = computed(() => {
  const theme = EDITOR_THEMES.find(t => t.id === themeStore.editorTheme.value)
  return theme?.id === 'auto' ? t('common.editorTheme.auto') : (theme?.name || '')
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.animate-in {
  animation: modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

input[type=range]::-webkit-slider-thumb {
  border: 2px solid white;
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -6px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
</style>

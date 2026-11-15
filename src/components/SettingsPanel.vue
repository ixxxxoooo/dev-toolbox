<template>
  <div class="w-full">
    <!-- 触发按钮（沿用轨道条目样式，标签随轨道展开淡入） -->
    <button
      type="button"
      class="rail-item"
      :class="{ 'is-active': isOpen }"
      :title="$t('common.settings.title')"
      @click.stop="isOpen = true"
    >
      <Settings class="w-4 h-4 shrink-0 transition-transform duration-500 ease-out" :class="{ 'rotate-90': isOpen }" />
      <span class="rail-label flex-1 text-left truncate">{{ $t('common.settings.title') }}</span>
    </button>

    <!-- 设置弹层：Teleport 到 body，避免被侧栏的层叠上下文限制 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/75"
          @click.self="isOpen = false"
          @keydown.esc="isOpen = false"
        >
          <Transition name="pop" appear>
            <div
              v-if="isOpen"
              ref="dialogRef"
              role="dialog"
              aria-modal="true"
              tabindex="-1"
              class="bg-popover text-popover-foreground border border-border rounded-xl shadow-pop w-full max-w-[640px] max-h-[88vh] flex flex-col overflow-hidden outline-none"
            >
              <!-- 头部 -->
              <div class="h-toolbar px-3 border-b border-border flex items-center justify-between shrink-0">
                <div class="flex items-center gap-2 font-semibold text-[13px]">
                  <Settings class="w-4 h-4 text-primary" />
                  {{ $t('common.settings.title') }}
                </div>
                <button
                  type="button"
                  class="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground press"
                  @click="isOpen = false"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>

              <div class="overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-x-5 gap-y-4 stagger">
                <!-- 左列：界面 -->
                <div class="space-y-4 min-w-0">
                  <!-- 明暗模式 -->
                  <section class="space-y-1.5">
                    <h4 class="sec-title"><Monitor class="w-3 h-3" />{{ $t('common.settings.appearance') }}</h4>
                    <div class="seg">
                      <button
                        v-for="m in modes"
                        :key="m.id"
                        type="button"
                        class="seg-btn press"
                        :class="{ 'is-active': currentMode === m.id }"
                        @click="themeStore.setThemeMode(m.id)"
                      >
                        <component :is="m.icon" class="w-3.5 h-3.5" />
                        {{ m.label }}
                      </button>
                    </div>
                  </section>

                  <!-- 色板 -->
                  <section class="space-y-1.5">
                    <h4 class="sec-title"><Palette class="w-3 h-3" />{{ $t('common.settings.palette') }}</h4>
                    <div class="grid grid-cols-3 gap-1.5">
                      <button
                        v-for="p in UI_PALETTES"
                        :key="p.id"
                        type="button"
                        class="palette-btn press"
                        :class="{ 'is-active': themeStore.palette.value === p.id }"
                        @click="themeStore.setPalette(p.id)"
                      >
                        <span class="swatch" :style="{ background: themeStore.isDark.value ? p.swatch[1] : p.swatch[0] }">
                          <Check v-if="themeStore.palette.value === p.id" class="w-3 h-3 text-white mix-blend-difference" />
                        </span>
                        <span class="truncate">{{ $t('common.settings.palettes.' + p.id) }}</span>
                      </button>
                    </div>
                  </section>

                  <!-- 语言 -->
                  <section class="space-y-1.5">
                    <h4 class="sec-title"><Languages class="w-3 h-3" />{{ $t('common.settings.language') }}</h4>
                    <div class="seg">
                      <button
                        v-for="l in langs"
                        :key="l.id"
                        type="button"
                        class="seg-btn press"
                        :class="{ 'is-active': currentLangMode === l.id }"
                        @click="themeStore.setLanguage(l.id)"
                      >
                        {{ l.label }}
                      </button>
                    </div>
                  </section>

                  <!-- 历史 -->
                  <section class="space-y-1.5">
                    <h4 class="sec-title"><HistoryIcon class="w-3 h-3" />{{ $t('common.settings.history') }}</h4>
                    <div class="rounded-lg border border-border bg-muted/30 px-3 py-2.5 space-y-2">
                      <div class="flex items-center justify-between text-[13px]">
                        <span>{{ $t('common.settings.historyLimit') }}</span>
                        <span class="font-mono text-xs font-semibold text-primary tabular-nums">{{ themeStore.historyLimit.value }}</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        step="10"
                        :value="themeStore.historyLimit.value"
                        class="range w-full"
                        @input="(e: Event) => themeStore.setHistoryLimit(parseInt((e.target as HTMLInputElement).value))"
                      />
                    </div>
                  </section>

                  <!-- 编辑器字号：改动即时作用于所有编辑器 -->
                  <section class="space-y-1.5">
                    <h4 class="sec-title"><Type class="w-3 h-3" />{{ $t('common.settings.editorFontSize') }}</h4>
                    <div class="rounded-lg border border-border bg-muted/30 px-3 py-2.5 space-y-2">
                      <div class="flex items-center justify-between text-[13px]">
                        <button
                          v-if="themeStore.editorFontSize.value !== DEFAULT_EDITOR_FONT_SIZE"
                          type="button"
                          class="text-xs text-primary hover:underline"
                          @click="themeStore.setEditorFontSize(DEFAULT_EDITOR_FONT_SIZE)"
                        >{{ $t('common.settings.editorFontSizeReset') }}</button>
                        <span v-else class="text-xs text-muted-foreground">{{ MIN_EDITOR_FONT_SIZE }} – {{ MAX_EDITOR_FONT_SIZE }} px</span>
                        <span class="font-mono text-xs font-semibold text-primary tabular-nums">{{ themeStore.editorFontSize.value }}px</span>
                      </div>
                      <input
                        type="range"
                        :min="MIN_EDITOR_FONT_SIZE"
                        :max="MAX_EDITOR_FONT_SIZE"
                        step="1"
                        :value="themeStore.editorFontSize.value"
                        class="range w-full"
                        @input="(e: Event) => themeStore.setEditorFontSize(parseInt((e.target as HTMLInputElement).value))"
                      />
                      <p class="font-mono text-muted-foreground leading-snug truncate" :style="{ fontSize: themeStore.editorFontSize.value + 'px' }">
                        {"id": 1, "name": "Aa 字体预览"}
                      </p>
                    </div>
                  </section>
                </div>

                <!-- 右列：编辑器主题 -->
                <section class="space-y-1.5 min-w-0">
                  <h4 class="sec-title justify-between">
                    <span class="flex items-center gap-1.5"><Palette class="w-3 h-3" />{{ $t('common.editorTheme.title') }}</span>
                    <span class="normal-case tracking-normal text-primary/80 font-medium">{{ currentThemeName }}</span>
                  </h4>
                  <div class="grid grid-cols-1 gap-1 max-h-[380px] overflow-y-auto pr-1">
                    <button
                      v-for="theme in EDITOR_THEMES"
                      :key="theme.id"
                      type="button"
                      class="editor-theme press"
                      :class="{ 'is-active': themeStore.editorTheme.value === theme.id }"
                      @click="themeStore.setEditorTheme(theme.id)"
                    >
                      <span class="flex -space-x-1">
                        <i class="dot" :style="{ background: theme.colors[0] }"></i>
                        <i class="dot" :style="{ background: theme.colors[1] }"></i>
                      </span>
                      <span class="flex-1 text-left truncate">{{ theme.id === 'auto' ? $t('common.editorTheme.auto') : theme.name }}</span>
                      <span class="text-[10px] uppercase opacity-50 font-semibold">{{ theme.type }}</span>
                      <Check v-if="themeStore.editorTheme.value === theme.id" class="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { Settings, X, Sun, Moon, Palette, Languages, Check, Monitor, Laptop, Type, History as HistoryIcon } from 'lucide-vue-next'
import { useThemeStore, DEFAULT_EDITOR_FONT_SIZE, MIN_EDITOR_FONT_SIZE, MAX_EDITOR_FONT_SIZE } from '../stores/theme'
import { useI18n } from 'vue-i18n'
import { EDITOR_THEMES } from '../utils/monaco-themes'
import { UI_PALETTES } from '../utils/palettes'

const themeStore = useThemeStore()
const { locale, t } = useI18n()
const isOpen = ref(false)
const dialogRef = ref<HTMLElement | null>(null)

// 明暗模式：system / light / dark
const modes = computed(() => [
  { id: 'system' as const, icon: Laptop, label: t('common.editorTheme.auto') },
  { id: 'light' as const, icon: Sun, label: t('common.settings.lightMode') },
  { id: 'dark' as const, icon: Moon, label: t('common.settings.darkMode') }
])
const currentMode = computed(() =>
  themeStore.followSystemMode.value ? 'system' : themeStore.isDark.value ? 'dark' : 'light'
)

// 语言：system / zh / en
const langs = computed(() => [
  { id: 'system' as const, label: t('common.editorTheme.auto') },
  { id: 'zh' as const, label: '中文' },
  { id: 'en' as const, label: 'English' }
])
const currentLangMode = computed(() =>
  themeStore.followSystemLang.value ? 'system' : (locale.value as 'zh' | 'en')
)

const currentThemeName = computed(() => {
  const theme = EDITOR_THEMES.find(x => x.id === themeStore.editorTheme.value)
  return theme?.id === 'auto' ? t('common.editorTheme.auto') : theme?.name || ''
})

// 弹层打开后聚焦对话框，使 Esc 能被捕获；打开期间锁定背景滚动不需要（应用本身不滚动）
const onGlobalEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') isOpen.value = false
}
watch(isOpen, async open => {
  if (open) {
    window.addEventListener('keydown', onGlobalEsc)
    await nextTick()
    dialogRef.value?.focus()
  } else {
    window.removeEventListener('keydown', onGlobalEsc)
  }
})
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalEsc))
</script>

<style scoped>
.sec-title {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: hsl(var(--muted-foreground));
}

/* 分段控件 */
.seg {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 2px;
  padding: 2px;
  border-radius: calc(var(--radius) + 1px);
  background: hsl(var(--muted));
}
.seg-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  height: 1.625rem;
  border-radius: calc(var(--radius) - 1px);
  font-size: 0.75rem;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  transition: background-color var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out), box-shadow var(--dur-base);
}
.seg-btn:hover { color: hsl(var(--foreground)); }
.seg-btn.is-active {
  background: hsl(var(--card));
  color: hsl(var(--foreground));
  box-shadow: 0 1px 2px hsl(0 0% 0% / 0.12), 0 0 0 1px hsl(var(--border));
}

/* 色板按钮 */
.palette-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  transition: border-color var(--dur-base), background-color var(--dur-base), color var(--dur-base);
}
.palette-btn:hover { background: hsl(var(--muted)); color: hsl(var(--foreground)); }
.palette-btn.is-active {
  border-color: hsl(var(--primary));
  background: hsl(var(--primary) / 0.08);
  color: hsl(var(--foreground));
}
.swatch {
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px hsl(0 0% 0% / 0.12);
  transition: transform var(--dur-slow) var(--ease-spring);
}
.palette-btn:hover .swatch,
.palette-btn.is-active .swatch { transform: scale(1.12); }

/* 编辑器主题条目 */
.editor-theme {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border-radius: var(--radius);
  border: 1px solid transparent;
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  transition: background-color var(--dur-fast), color var(--dur-fast), border-color var(--dur-fast);
}
.editor-theme:hover { background: hsl(var(--muted)); color: hsl(var(--foreground)); }
.editor-theme.is-active {
  background: hsl(var(--primary) / 0.1);
  border-color: hsl(var(--primary) / 0.5);
  color: hsl(var(--primary));
}
.dot {
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 999px;
  box-shadow: 0 0 0 1.5px hsl(var(--popover)), inset 0 0 0 1px hsl(0 0% 50% / 0.25);
}

/* 滑块 */
.range {
  appearance: none;
  height: 4px;
  border-radius: 999px;
  background: hsl(var(--border));
  cursor: pointer;
  accent-color: hsl(var(--primary));
}
.range::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: hsl(var(--primary));
  border: 2px solid hsl(var(--card));
  box-shadow: 0 1px 4px hsl(0 0% 0% / 0.3);
  transition: transform var(--dur-fast) var(--ease-out);
}
.range::-webkit-slider-thumb:hover { transform: scale(1.2); }
</style>

<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- 命令栏：图标+名称 | 主操作 | 弹性空白 | 右侧动作 | 帮助 | ⌘K -->
    <header class="tool-bar">
      <div class="flex items-center gap-1.5 font-semibold text-primary whitespace-nowrap shrink-0">
        <component :is="icon" class="w-4 h-4" />
        <span class="max-sm:hidden">{{ title }}</span>
      </div>
      <template v-if="$slots.actions">
        <span class="tool-vr"></span>
        <div class="flex items-center gap-2 min-w-0 overflow-x-auto no-scrollbar py-0.5">
          <slot name="actions" />
        </div>
      </template>
      <span class="flex-1 min-w-0"></span>
      <div v-if="$slots.right" class="flex items-center gap-0.5 shrink-0">
        <slot name="right" />
      </div>
      <IconButton v-if="$slots.help" :title="$t('common.ui.help')" @click="helpOpen = true">
        <HelpCircle class="w-4 h-4" />
      </IconButton>
      <button
        type="button"
        class="max-md:hidden inline-flex items-center gap-1.5 h-6 pl-2 pr-1.5 rounded-md border border-border text-xs text-muted-foreground hover:bg-muted hover:text-foreground press"
        :title="$t('common.nav.openPalette')"
        @click="palette.open()"
      >
        <Search class="w-3 h-3" /><kbd>⌘K</kbd>
      </button>
    </header>

    <!-- 内容区：默认带 8px 外边距；scroll 用于表单类工具；flush 取消外边距 -->
    <div
      class="flex-1 min-h-0 flex flex-col"
      :class="[flush ? '' : 'p-2 pb-0', scroll ? 'overflow-auto' : '']"
    >
      <slot />
    </div>

    <slot name="status" />
    <div v-if="!$slots.status" class="h-2 shrink-0"></div>

    <!-- 帮助：所有工具共用一个弹层，不再各写一份 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="helpOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/75"
          @click.self="helpOpen = false"
        >
          <Transition name="pop" appear>
            <div
              v-if="helpOpen"
              class="w-full max-w-lg max-h-[80vh] overflow-y-auto bg-popover text-popover-foreground border border-border rounded-xl shadow-pop"
              role="dialog"
              aria-modal="true"
            >
              <div class="h-toolbar px-3 flex items-center justify-between border-b border-border sticky top-0 bg-popover z-10">
                <div class="flex items-center gap-2 font-semibold text-[13px]">
                  <component :is="icon" class="w-4 h-4 text-primary" />{{ title }}
                </div>
                <IconButton :title="$t('common.ui.close')" @click="helpOpen = false"><X class="w-4 h-4" /></IconButton>
              </div>
              <div class="p-4 text-sm leading-relaxed"><slot name="help" /></div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, type Component } from 'vue'
import { HelpCircle, Search, X } from 'lucide-vue-next'
import IconButton from './IconButton.vue'
import { useCommandPaletteStore } from '@/stores/commandPalette'

/**
 * 工具外壳：所有工具页共用的骨架，保证布局与交互一致。
 *
 * 插槽：
 *   #actions  命令栏左侧主操作（Segmented / ToggleChip / DropdownMenu…）
 *   #right    命令栏右侧动作（IconButton…）
 *   默认      工作区（通常是 SplitPane 或单个 Pane）
 *   #status   <StatusBar>…</StatusBar>
 *   #help     帮助内容（提供则自动出现 ? 按钮和弹层）
 */
defineProps<{
  icon: Component
  title: string
  /** 工作区自带滚动（表单类工具） */
  scroll?: boolean
  /** 工作区不加外边距 */
  flush?: boolean
}>()

const palette = useCommandPaletteStore()
const helpOpen = ref(false)

const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') helpOpen.value = false }
watch(helpOpen, v => {
  if (v) window.addEventListener('keydown', onEsc)
  else window.removeEventListener('keydown', onEsc)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onEsc))
</script>

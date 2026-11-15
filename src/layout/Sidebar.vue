<template>
  <aside
    class="relative bg-card border-r border-border flex flex-col h-full shrink-0 z-20"
    :class="{ 'sidebar-anim': !isResizing }"
    :style="{ width: sidebarWidth + 'px' }"
  >
    <!-- 头部：Logo + 折叠按钮，高度与工具栏统一 -->
    <div class="h-toolbar border-b border-border flex items-center shrink-0 px-2 gap-2" :class="isCollapsed ? 'justify-center' : ''">
      <button
        id="tour-sidebar-toggle"
        type="button"
        class="flex items-center gap-2 min-w-0 rounded-md press outline-offset-2"
        :aria-expanded="!isCollapsed"
        :aria-label="isCollapsed ? $t('common.messages.expandSidebar') : $t('common.messages.collapseSidebar')"
        :title="isCollapsed ? $t('common.messages.expandSidebar') : $t('common.messages.collapseSidebar')"
        @click="toggleCollapse"
      >
        <span class="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm">
          <Wrench class="w-3.5 h-3.5" />
        </span>
        <span v-if="!isCollapsed" class="font-semibold text-[13px] tracking-tight truncate">Dev Toolbox</span>
      </button>
      <button
        v-if="!isCollapsed"
        type="button"
        class="ml-auto w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground press"
        :title="$t('common.messages.collapseSidebar')"
        @click="toggleCollapse"
      >
        <PanelLeftClose class="w-4 h-4" />
      </button>
    </div>

    <!-- 搜索：展开时是输入框，折叠时是打开命令面板的图标 -->
    <div class="px-2 pt-2 shrink-0">
      <div v-if="!isCollapsed" class="relative">
        <Search class="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <input
          ref="searchRef"
          v-model="query"
          type="text"
          :placeholder="$t('common.nav.search')"
          :title="$t('common.nav.searchHint')"
          class="w-full h-7 pl-7 pr-8 rounded-md bg-muted/60 border border-transparent text-[13px] placeholder:text-muted-foreground/70 outline-none transition-colors focus:bg-background focus:border-ring/50"
          @keydown.enter.prevent="openFirstMatch"
          @keydown.esc="query = ''; ($event.target as HTMLInputElement).blur()"
        />
        <kbd v-if="!query" class="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">/</kbd>
        <button
          v-else
          type="button"
          class="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground"
          @click="query = ''"
        >
          <X class="w-3 h-3" />
        </button>
      </div>
      <button
        v-else
        type="button"
        class="w-full h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground press"
        :title="$t('common.nav.openPalette') + ' (⌘K)'"
        @click="palette.open()"
      >
        <Search class="w-4 h-4" />
      </button>
    </div>

    <!-- 工具列表 -->
    <nav id="tour-tools-list" class="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 space-y-3">
      <template v-for="section in sections" :key="section.key">
        <section v-if="section.items.length">
          <h3
            v-if="!isCollapsed && section.title"
            class="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70"
          >
            {{ section.title }}
          </h3>
          <div v-else-if="isCollapsed && section.key !== 'pinned'" class="mx-2 mb-1 h-px bg-border"></div>
          <div class="space-y-0.5">
            <SidebarItem
              v-for="item in section.items"
              :key="section.key + item.name"
              :item="item"
              :label="item.label"
              :icon="item.icon"
              :active="$route.name === item.name"
              :collapsed="isCollapsed"
              :pinned="isPinned(item.name)"
              :pin-label="$t('common.nav.pin')"
              :unpin-label="$t('common.nav.unpin')"
              @toggle-pin="togglePin(item.name)"
            />
          </div>
        </section>
      </template>
      <p v-if="query && !hasAnyMatch" class="px-2.5 py-6 text-center text-xs text-muted-foreground">
        {{ $t('common.nav.noMatch') }}
      </p>
    </nav>

    <!-- 底部：设置 -->
    <div id="tour-settings-panel" class="shrink-0 border-t border-border p-2">
      <SettingsPanel :collapsed="isCollapsed" class="w-full" />
    </div>

    <!-- 拖拽手柄：命中区 6px，视觉只有 hover 时的 2px 线 -->
    <div
      class="absolute top-0 -right-[3px] w-[6px] h-full cursor-col-resize z-30 group/handle"
      @mousedown.prevent="startResize"
      @dblclick="resetWidth"
    >
      <div
        class="mx-auto h-full w-[2px] transition-opacity duration-150"
        :class="isResizing ? 'bg-primary opacity-100' : 'bg-primary/60 opacity-0 group-hover/handle:opacity-100'"
      ></div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Wrench, PanelLeftClose, Search, X } from 'lucide-vue-next'
import { getToolIcon } from '../utils/toolIcons'
import SettingsPanel from '../components/SettingsPanel.vue'
import SidebarItem from './SidebarItem.vue'
import { useToolNav } from '@/composables/useToolNav'
import { useCommandPaletteStore } from '@/stores/commandPalette'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const palette = useCommandPaletteStore()
const { pinned, recent, isPinned, togglePin, touchRecent } = useToolNav()

// ---------- 尺寸状态 ----------
const MIN_WIDTH = 176
const MAX_WIDTH = 320
const DEFAULT_WIDTH = 204
const COLLAPSED_WIDTH = 52
const isCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')
const readSavedWidth = () => {
  const w = parseInt(localStorage.getItem('sidebarWidth') || '', 10)
  return Number.isNaN(w) ? DEFAULT_WIDTH : Math.max(MIN_WIDTH, Math.min(w, MAX_WIDTH))
}
const sidebarWidth = ref(isCollapsed.value ? COLLAPSED_WIDTH : readSavedWidth())
const isResizing = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem('sidebarCollapsed', String(isCollapsed.value))
  sidebarWidth.value = isCollapsed.value ? COLLAPSED_WIDTH : readSavedWidth()
}

const resetWidth = () => {
  isCollapsed.value = false
  localStorage.setItem('sidebarCollapsed', 'false')
  sidebarWidth.value = DEFAULT_WIDTH
  localStorage.setItem('sidebarWidth', String(DEFAULT_WIDTH))
}

// ---------- 拖拽调整宽度（rAF 节流，避免高频触发布局） ----------
let rafId = 0
const startResize = () => {
  isResizing.value = true
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}
const handleResize = (e: MouseEvent) => {
  if (!isResizing.value) return
  const x = e.clientX
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    sidebarWidth.value = Math.max(MIN_WIDTH, Math.min(x, MAX_WIDTH))
    if (isCollapsed.value) {
      isCollapsed.value = false
      localStorage.setItem('sidebarCollapsed', 'false')
    }
  })
}
const stopResize = () => {
  isResizing.value = false
  cancelAnimationFrame(rafId)
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  if (!isCollapsed.value) localStorage.setItem('sidebarWidth', String(sidebarWidth.value))
}

// ---------- 工具数据 ----------
interface NavItem { name: string; path: string; label: string; icon: ReturnType<typeof getToolIcon> }

const allItems = computed<NavItem[]>(() => {
  const children = router.options.routes[0].children || []
  return children
    .filter(r => r.meta?.title && r.name)
    .map(r => ({
      name: r.name as string,
      path: r.path,
      label: t(r.meta!.title as string),
      icon: getToolIcon(r.meta!.icon as string)
    }))
})

const byName = (names: string[]) =>
  names.map(n => allItems.value.find(i => i.name === n)).filter((i): i is NavItem => !!i)

// 搜索：名称或路径包含即命中
const query = ref('')
const searchRef = ref<HTMLInputElement | null>(null)
const matches = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return allItems.value
  return allItems.value.filter(i => i.label.toLowerCase().includes(q) || i.path.toLowerCase().includes(q))
})
const hasAnyMatch = computed(() => matches.value.length > 0)

const sections = computed(() => {
  // 搜索中：只展示一个结果列表，避免分组干扰
  if (query.value.trim()) {
    return [{ key: 'result', title: '', items: matches.value }]
  }
  const pinnedItems = byName(pinned.value)
  // 最近使用里排除已固定与当前工具，避免重复占位
  const recentItems = byName(recent.value).filter(i => !isPinned(i.name) && i.name !== route.name)
  return [
    { key: 'pinned', title: t('common.nav.pinned'), items: pinnedItems },
    { key: 'recent', title: t('common.nav.recent'), items: recentItems },
    { key: 'all', title: t('common.nav.all'), items: allItems.value }
  ]
})

const openFirstMatch = (e: KeyboardEvent) => {
  if (e.isComposing) return
  const first = matches.value[0]
  if (first) {
    router.push({ name: first.name })
    query.value = ''
    ;(e.target as HTMLInputElement).blur()
  }
}

// 记录最近使用（路由变化时）
router.afterEach(to => {
  if (to.name && to.meta?.title) touchRecent(to.name as string)
})

// "/" 聚焦搜索（输入框内不拦截）
const onKeydown = (e: KeyboardEvent) => {
  const el = e.target as HTMLElement | null
  const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable || el.closest?.('.monaco-editor'))
  if (e.key === '/' && !e.metaKey && !e.ctrlKey && !typing) {
    e.preventDefault()
    if (isCollapsed.value) toggleCollapse()
    requestAnimationFrame(() => searchRef.value?.focus())
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  if (route.name && route.meta?.title) touchRecent(route.name as string)
})
onUnmounted(() => {
  stopResize()
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
/* 折叠/展开时对宽度做一次短过渡；拖拽时关闭，保证跟手 */
.sidebar-anim {
  transition: width var(--dur-slow) var(--ease-out);
}
</style>

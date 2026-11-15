<template>
  <!-- 占位容器：未固定时恒为 48px，轨道悬停展开时覆盖在内容之上（不触发内容重排） -->
  <div class="rail-wrap" :class="{ 'is-docked': docked }">
    <aside class="rail" aria-label="Tools">
      <!-- 头部 -->
      <div class="flex items-center gap-2.5 h-8 px-[7px] mb-1 shrink-0">
        <span class="w-[22px] h-[22px] rounded-md bg-primary text-primary-foreground grid place-items-center shrink-0 shadow-sm">
          <Wrench class="w-3 h-3" />
        </span>
        <span class="rail-label font-semibold text-[13px] tracking-tight truncate">Dev Toolbox</span>
        <IconButton
          id="tour-sidebar-toggle"
          class="rail-label ml-auto"
          small
          :active="docked"
          :title="docked ? $t('common.messages.collapseSidebar') : $t('common.messages.expandSidebar')"
          @click="toggleDock"
        >
          <PanelLeft class="w-3.5 h-3.5" />
        </IconButton>
      </div>

      <!-- 搜索 / 命令面板入口 -->
      <button type="button" class="rail-item" :title="$t('common.nav.openPalette')" @click="palette.open()">
        <Search class="w-4 h-4 shrink-0" />
        <span class="rail-label flex-1 text-left truncate">{{ $t('common.nav.search') }}</span>
        <kbd class="rail-label">⌘K</kbd>
      </button>

      <div class="h-px bg-border mx-1 my-1.5 shrink-0"></div>

      <!-- 工具列表：滑块指示器按活动项实际位置做 translateY -->
      <nav id="tour-tools-list" ref="navEl" class="relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col gap-0.5">
        <i class="rail-ind" :class="{ 'is-ready': indReady }" :style="indStyle" aria-hidden="true"></i>
        <template v-for="(group, gi) in groups" :key="gi">
          <div v-if="gi > 0 && group.length" class="h-px bg-border mx-1 my-1 shrink-0"></div>
          <SidebarItem
            v-for="item in group"
            :key="item.name"
            :item="item"
            :label="item.label"
            :icon="item.icon"
            :active="$route.name === item.name"
            :pinned="isPinned(item.name)"
            :shortcut="shortcutOf(item.name)"
            :pin-label="$t('common.nav.pin')"
            :unpin-label="$t('common.nav.unpin')"
            @toggle-pin="togglePin(item.name)"
          />
        </template>
      </nav>

      <!-- 底部：设置 -->
      <div id="tour-settings-panel" class="shrink-0 pt-1.5 mt-1 border-t border-border">
        <SettingsPanel />
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Wrench, PanelLeft, Search } from 'lucide-vue-next'
import { getToolIcon } from '../utils/toolIcons'
import SettingsPanel from '../components/SettingsPanel.vue'
import IconButton from '../components/ui/IconButton.vue'
import SidebarItem from './SidebarItem.vue'
import { useToolNav } from '@/composables/useToolNav'
import { useCommandPaletteStore } from '@/stores/commandPalette'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const palette = useCommandPaletteStore()
const { pinned, isPinned, togglePin, touchRecent } = useToolNav()

// ---------- 固定状态（兼容旧键 sidebarCollapsed：旧版"展开"视为固定） ----------
const readDocked = () => {
  const v = localStorage.getItem('sidebarDocked')
  if (v !== null) return v === 'true'
  return false
}
const docked = ref(readDocked())
const toggleDock = () => {
  docked.value = !docked.value
  localStorage.setItem('sidebarDocked', String(docked.value))
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

// 分两组：已固定在前，其余在后；每个工具只出现一次，指示器位置才唯一
const groups = computed<NavItem[][]>(() => {
  const pinnedItems = pinned.value
    .map(n => allItems.value.find(i => i.name === n))
    .filter((i): i is NavItem => !!i)
  const rest = allItems.value.filter(i => !isPinned(i.name))
  return [pinnedItems, rest]
})

const flat = computed(() => groups.value.flat())
const shortcutOf = (name: string) => {
  const i = flat.value.findIndex(x => x.name === name)
  return i >= 0 && i < 9 ? String(i + 1) : undefined
}

// ---------- 活动指示器 ----------
const navEl = ref<HTMLElement | null>(null)
const indY = ref(0)
const indVisible = ref(false)
const indReady = ref(false)
const indStyle = computed(() => ({
  transform: `translateY(${indY.value}px)`,
  opacity: indVisible.value ? 1 : 0
}))

const measureInd = () => {
  const el = navEl.value?.querySelector<HTMLElement>(`[data-name="${String(route.name)}"]`)
  if (!el) { indVisible.value = false; return }
  indY.value = el.offsetTop
  indVisible.value = true
}
watch([() => route.name, groups], () => nextTick(measureInd))

// ---------- 快捷键：数字键直达工具（输入框/编辑器内不拦截） ----------
const onKeydown = (e: KeyboardEvent) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return
  const el = e.target as HTMLElement | null
  const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable || el.closest?.('.monaco-editor'))
  if (typing) return
  const n = parseInt(e.key, 10)
  if (n >= 1 && n <= 9 && flat.value[n - 1]) {
    e.preventDefault()
    router.push({ name: flat.value[n - 1].name })
  }
}

let off: (() => void) | null = null
onMounted(async () => {
  window.addEventListener('keydown', onKeydown)
  if (route.name && route.meta?.title) touchRecent(route.name as string)
  off = router.afterEach(to => { if (to.name && to.meta?.title) touchRecent(to.name as string) })
  await nextTick()
  measureInd()
  requestAnimationFrame(() => { indReady.value = true })
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  off?.()
})
</script>

<style scoped>
.rail-wrap {
  position: relative;
  z-index: 30;
  flex-shrink: 0;
  width: 48px;
  transition: width var(--dur-slow) var(--ease-out);
}
.rail-wrap.is-docked { width: 208px; }

/* 轨道本体：绝对定位，悬停/聚焦时向右展开并覆盖内容 */
.rail {
  position: absolute;
  inset: 0 auto 0 0;
  width: 48px;
  display: flex;
  flex-direction: column;
  padding: 6px;
  overflow: hidden;
  background: hsl(var(--card));
  border-right: 1px solid hsl(var(--border));
  transition: width var(--dur-slow) var(--ease-out), box-shadow var(--dur-slow) var(--ease-out);
}
.rail-wrap.is-docked .rail,
.rail:hover,
.rail:focus-within { width: 208px; }
.rail-wrap:not(.is-docked) .rail:hover,
.rail-wrap:not(.is-docked) .rail:focus-within { box-shadow: var(--shadow-pop); }
</style>

<style>
/* 非 scoped：SidebarItem、设置按钮等轨道内元素共用 */
/* 文字标签：展开时错峰淡入；收起时立即隐藏，避免文字挤压变形 */
.rail-label {
  opacity: 0;
  transform: translateX(-4px);
  white-space: nowrap;
  pointer-events: none;
  transition: opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
}
.rail-wrap.is-docked .rail-label,
.rail:hover .rail-label,
.rail:focus-within .rail-label {
  opacity: 1;
  transform: none;
  pointer-events: auto;
  transition: opacity var(--dur-base) var(--ease-out) 70ms, transform var(--dur-base) var(--ease-out) 70ms;
}

.rail-item {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  width: 100%;
  height: 32px;
  padding: 0 8px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  transition: background-color var(--dur-fast) var(--ease-out), color var(--dur-fast), transform var(--dur-fast);
}
.rail-item:hover { background: hsl(var(--muted)); color: hsl(var(--foreground)); }
.rail-item:active { transform: scale(0.97); }
.rail-item.is-active { color: hsl(var(--primary)); background: transparent; }
.rail-item .rail-pin {
  display: grid; place-items: center; width: 20px; height: 20px; border-radius: 5px;
  color: hsl(var(--muted-foreground)); opacity: 0;
}
.rail-item:hover .rail-pin { opacity: 0.8; }
.rail-item .rail-pin.is-pinned { color: hsl(var(--primary)); opacity: 1; }
.rail-item .rail-pin:hover { background: hsl(var(--background) / 0.7); }
.rail-item kbd { font-size: 10px; padding: 1px 4px; }

/* 活动指示器：浅底滑块 + 左侧竖条，一个元素在项目之间弹性滑动 */
.rail-ind {
  position: absolute;
  z-index: 0;
  left: 0;
  top: 0;
  width: 100%;
  height: 32px;
  border-radius: 7px;
  background: hsl(var(--primary) / 0.12);
  pointer-events: none;
}
.rail-ind::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 9px;
  bottom: 9px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: hsl(var(--primary));
}
.rail-ind.is-ready { transition: transform var(--dur-slow) var(--ease-spring), opacity var(--dur-base); }
</style>

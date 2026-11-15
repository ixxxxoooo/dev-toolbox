<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[110] flex items-start justify-center pt-[14vh] px-4 bg-background/70"
        @mousedown.self="close"
      >
        <Transition name="pop" appear>
          <div
            v-if="isOpen"
            class="w-full max-w-[560px] bg-popover text-popover-foreground border border-border shadow-pop rounded-xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            @keydown.esc="close"
          >
            <!-- 搜索框 -->
            <div class="flex items-center gap-2.5 px-3 h-11 border-b border-border">
              <Search class="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                ref="inputRef"
                v-model="searchQuery"
                type="text"
                class="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/60"
                :placeholder="$t('common.messages.searchPlaceholder')"
                @keydown.down.prevent="move(1)"
                @keydown.up.prevent="move(-1)"
                @keydown.enter.prevent="selectCurrent($event)"
              />
              <kbd>ESC</kbd>
            </div>

            <!-- 结果列表 -->
            <div ref="listRef" class="max-h-[56vh] overflow-y-auto p-1.5">
              <div v-if="results.length === 0" class="px-4 py-8 text-center text-muted-foreground text-xs">
                {{ $t('common.messages.noResults') }}
              </div>

              <button
                v-for="(r, index) in results"
                :key="r.tool.path"
                :data-index="index"
                type="button"
                class="w-full flex items-center gap-2.5 px-2 h-10 rounded-md text-left press"
                :class="index === activeIndex ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted/60'"
                @click="selectTool(r.tool)"
                @mousemove="activeIndex = index"
              >
                <span
                  class="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors"
                  :class="index === activeIndex ? 'bg-primary/15' : 'bg-muted'"
                >
                  <component :is="getIcon(r.tool.meta?.icon as string)" class="w-3.5 h-3.5" />
                </span>
                <span class="flex-1 min-w-0">
                  <span class="block text-[13px] font-medium leading-tight truncate">{{ r.label }}</span>
                  <span class="block text-[11px] leading-tight text-muted-foreground truncate">{{ r.desc }}</span>
                </span>
                <span v-if="r.badge" class="text-[10px] text-muted-foreground/70 shrink-0">{{ r.badge }}</span>
                <CornerDownLeft v-if="index === activeIndex" class="w-3.5 h-3.5 opacity-60 shrink-0" />
              </button>
            </div>

            <!-- 底部提示 -->
            <div class="px-3 h-8 border-t border-border bg-muted/30 flex items-center justify-between text-[11px] text-muted-foreground">
              <div class="flex items-center gap-3">
                <span class="flex items-center gap-1"><kbd>↵</kbd>{{ $t('common.buttons.select') }}</span>
                <span class="flex items-center gap-1"><kbd>↑↓</kbd>{{ $t('common.labels.navigate') }}</span>
              </div>
              <span class="opacity-70 tabular-nums">{{ results.length }} {{ $t('common.labels.toolCount') }}</span>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRouter, type RouteRecordRaw } from 'vue-router'
import { Search, CornerDownLeft } from 'lucide-vue-next'
import { getToolIcon } from '../utils/toolIcons'
import { useI18n } from 'vue-i18n'
import { useCommandPaletteStore } from '../stores/commandPalette'
import { useToolNav } from '../composables/useToolNav'

const { t } = useI18n()
const router = useRouter()
const commandPaletteStore = useCommandPaletteStore()
const { pinned, recent } = useToolNav()

const isOpen = computed(() => commandPaletteStore.isOpen)
const searchQuery = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)

const getIcon = (name: string) => getToolIcon(name)

const allTools = computed<RouteRecordRaw[]>(() => {
  const mainRoute = router.options.routes.find(r => r.path === '/')
  return (mainRoute?.children || []).filter(route => route.meta && route.meta.title)
})

const describe = (tool: RouteRecordRaw) => {
  const key = (tool.meta?.title as string).replace('.name', '.description')
  const description = t(key)
  return description === key ? tool.path : description
}

/** 模糊匹配：子序列命中即可，连续命中与前缀命中得分更高；未命中返回 -1 */
const fuzzyScore = (text: string, q: string): number => {
  if (text.includes(q)) return 100 - text.indexOf(q)
  let ti = 0
  let score = 0
  for (const ch of q) {
    const found = text.indexOf(ch, ti)
    if (found === -1) return -1
    score += found === ti ? 3 : 1
    ti = found + 1
  }
  return score
}

interface Result { tool: RouteRecordRaw; label: string; desc: string; badge?: string }

const results = computed<Result[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const toResult = (tool: RouteRecordRaw, badge?: string): Result => ({
    tool,
    label: t(tool.meta?.title as string),
    desc: describe(tool),
    badge
  })

  if (!q) {
    // 空查询：固定 → 最近 → 其余，减少寻找成本
    const byName = (n: string) => allTools.value.find(x => x.name === n)
    const seen = new Set<string>()
    const out: Result[] = []
    const push = (names: string[], badge?: string) => {
      for (const n of names) {
        const tool = byName(n)
        if (tool && !seen.has(n)) {
          seen.add(n)
          out.push(toResult(tool, badge))
        }
      }
    }
    push(pinned.value, t('common.nav.pinned'))
    push(recent.value, t('common.nav.recent'))
    push(allTools.value.map(x => x.name as string))
    return out
  }

  return allTools.value
    .map(tool => {
      const label = t(tool.meta?.title as string)
      const s = Math.max(fuzzyScore(label.toLowerCase(), q), fuzzyScore(tool.path.toLowerCase(), q) - 10)
      return { tool, s }
    })
    .filter(x => x.s >= 0)
    .sort((a, b) => b.s - a.s)
    .map(x => toResult(x.tool))
})

const show = () => commandPaletteStore.open()
const close = () => commandPaletteStore.close()

watch(isOpen, open => {
  if (open) {
    searchQuery.value = ''
    activeIndex.value = 0
    nextTick(() => inputRef.value?.focus())
  }
})

watch(searchQuery, () => { activeIndex.value = 0 })

// 键盘导航后把选中项滚入视野（最小滚动，避免跳动）
watch(activeIndex, async () => {
  await nextTick()
  listRef.value?.querySelector<HTMLElement>(`[data-index="${activeIndex.value}"]`)?.scrollIntoView({ block: 'nearest' })
})

const move = (step: 1 | -1) => {
  const n = results.value.length
  if (!n) return
  activeIndex.value = (activeIndex.value + step + n) % n
}

const selectCurrent = (e?: KeyboardEvent) => {
  if (e?.isComposing) return
  const r = results.value[activeIndex.value]
  if (r) selectTool(r.tool)
}

const selectTool = (tool: RouteRecordRaw) => {
  router.push('/' + tool.path).catch(() => { /* 重复导航直接忽略 */ }).finally(close)
}

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    commandPaletteStore.toggle()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))

defineExpose({ show, close })
</script>

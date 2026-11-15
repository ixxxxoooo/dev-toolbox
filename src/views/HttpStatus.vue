<template>
  <ToolShell :icon="Globe" :title="t('tools.httpStatus.name')" scroll>
    <template #actions>
      <div class="relative shrink-0">
        <Search class="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
        <input
          v-model="searchQuery"
          type="search"
          class="field pl-7 w-36 sm:w-44"
          :placeholder="t('tools.httpStatus.searchPlaceholder')"
        />
      </div>
      <Segmented v-model="categoryFilter" :options="categoryOptions" small class="shrink-0 min-w-0" />
    </template>

    <template #help>
      <p>{{ t('tools.httpStatus.description') }}</p>
    </template>

    <div class="flex flex-col gap-1 min-h-0">
      <div
        v-for="status in filteredCodes"
        :key="status.code"
        class="rounded-lg border border-border bg-card overflow-hidden"
        style="content-visibility: auto; contain-intrinsic-size: 0 2.75rem"
      >
        <button
          type="button"
          class="w-full flex items-center gap-2 px-2 py-1.5 min-h-[2.75rem] text-left hover:bg-muted/30 press"
          :aria-expanded="expandedCode === status.code"
          @click="toggleExpanded(status.code)"
        >
          <span class="font-mono font-bold text-sm w-10 shrink-0" :class="statusToneClass(status.code)">
            {{ status.code }}
          </span>
          <span class="text-xs font-medium flex-1 min-w-0 truncate">{{ status.title }}</span>
          <span class="badge text-[10px] max-w-[5.5rem] truncate shrink-0 hidden sm:inline">{{ status.category }}</span>
          <ChevronDown
            class="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)]"
            :class="{ 'rotate-180': expandedCode === status.code }"
          />
        </button>
        <div
          class="grid transition-[grid-template-rows] duration-[var(--dur-slow)] ease-[var(--ease-out)]"
          :class="expandedCode === status.code ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
        >
          <div class="overflow-hidden">
            <p class="px-2 pb-2 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/60">
              {{ status.description }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="filteredCodes.length === 0"
        class="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2"
      >
        <SearchX class="w-8 h-8 opacity-40" />
        <p class="text-sm">{{ t('common.errors.noResults') }}</p>
      </div>
    </div>

    <template #status>
      <StatusBar>
        <span>{{ t('tools.httpStatus.resultCount', { n: filteredCodes.length }) }}</span>
        <template #right>
          <span class="max-sm:hidden">{{ categoryFilter === 'all' ? t('tools.httpStatus.filterAll') : categoryFilter }}</span>
        </template>
      </StatusBar>
    </template>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Globe, Search, SearchX, ChevronDown } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import zh from '@/locales/zh'
import en from '@/locales/en'
import ToolShell from '@/components/ui/ToolShell.vue'
import StatusBar from '@/components/ui/StatusBar.vue'
import Segmented, { type SegmentedOption } from '@/components/ui/Segmented.vue'

const { t, locale } = useI18n()

type HttpStatusCode = {
  code: number
  title: string
  description: string
  category: string
}

type CategoryFilter = 'all' | '1xx' | '2xx' | '3xx' | '4xx' | '5xx'

const searchQuery = ref('')
const categoryFilter = ref<CategoryFilter>('all')
const expandedCode = ref<number | null>(null)

const categoryOptions = computed((): SegmentedOption<CategoryFilter>[] => [
  { value: 'all', label: t('tools.httpStatus.filterAll') },
  { value: '1xx', label: '1xx' },
  { value: '2xx', label: '2xx' },
  { value: '3xx', label: '3xx' },
  { value: '4xx', label: '4xx' },
  { value: '5xx', label: '5xx' },
])

const codes = computed((): HttpStatusCode[] => {
  const pack = locale.value.startsWith('zh') ? zh : en
  return pack.tools.httpStatus.codes as HttpStatusCode[]
})

function matchesCategory(code: number, filter: CategoryFilter): boolean {
  if (filter === 'all') return true
  const bucket = Math.floor(code / 100)
  return `${bucket}xx` === filter
}

const filteredCodes = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const list = codes.value
  return list.filter((c) => {
    if (!matchesCategory(c.code, categoryFilter.value)) return false
    if (!query) return true
    return (
      c.code.toString().includes(query) ||
      c.title.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query)
    )
  })
})

const toggleExpanded = (code: number) => {
  expandedCode.value = expandedCode.value === code ? null : code
}

const statusToneClass = (code: number): string => {
  if (code >= 500) return 'text-destructive'
  if (code >= 400) return 'text-warning'
  if (code >= 300) return 'text-primary'
  if (code >= 200) return 'text-success'
  return 'text-muted-foreground'
}

watch([categoryFilter, searchQuery], () => {
  expandedCode.value = null
})
</script>
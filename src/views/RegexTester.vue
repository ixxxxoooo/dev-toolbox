<template>
  <ToolShell :icon="RegexIcon" :title="t('tools.regexTester.name')" flush>
    <template #actions>
      <ToggleChip
        v-for="flag in flags"
        :key="flag.value"
        v-model="flag.enabled"
        class="shrink-0"
        :title="flag.title"
      >
        {{ flag.short }}
      </ToggleChip>
      <span class="tool-vr max-sm:hidden"></span>
      <DropdownMenu :items="templateMenuItems" align="left" class="shrink-0" @select="onTemplateSelect">
        <template #trigger>
          <button type="button" class="chip max-w-[7rem] truncate">
            {{ t('tools.regexTester.templates') }}
            <ChevronDown class="w-3 h-3 opacity-60 shrink-0" />
          </button>
        </template>
      </DropdownMenu>
    </template>

    <template #help>
      <p>{{ t('tools.regexTester.description') }}</p>
      <p class="font-semibold mt-3 mb-2">{{ t('tools.regexTester.coreFeatures') }}</p>
      <ul class="list-disc list-inside space-y-1 text-muted-foreground text-xs">
        <li>{{ t('tools.regexTester.helpFlags') }}</li>
        <li>{{ t('tools.regexTester.helpWorker') }}</li>
        <li>{{ t('tools.regexTester.helpReplace') }}</li>
      </ul>
    </template>

    <SplitPane storage-key="regex">
      <template #a>
        <Pane class="min-h-0">
          <template #title>
            <span class="text-xs text-muted-foreground">{{ t('tools.regexTester.regex') }}</span>
          </template>
          <div class="p-2 space-y-2 flex flex-col min-h-0 h-full">
            <div class="relative shrink-0">
              <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs">/</span>
              <input
                v-model="regexPattern"
                type="text"
                class="field w-full font-mono text-xs h-8 pl-5 pr-10"
                :placeholder="t('tools.regexTester.patternPlaceholder')"
              />
              <span class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-[10px]">/{{ activeFlags }}</span>
            </div>
            <label class="text-[10px] text-muted-foreground shrink-0">{{ t('tools.regexTester.testString') }}</label>
            <div class="relative flex-1 min-h-[120px] border border-border rounded-md overflow-hidden bg-card">
              <div
                ref="backdropRef"
                class="regex-backdrop absolute inset-0 p-2 font-mono text-xs whitespace-pre-wrap break-all pointer-events-none text-transparent z-0 overflow-hidden"
                :class="{ 'is-stale is-stale-anim': resultsStale }"
                style="scrollbar-gutter: stable"
                v-html="highlightedText"
              />
              <textarea
                v-model="testString"
                class="absolute inset-0 w-full h-full p-2 font-mono text-xs bg-transparent border-none outline-none resize-none z-10 text-foreground/90 break-all overflow-auto"
                style="scrollbar-gutter: stable"
                spellcheck="false"
                @scroll="onTextareaScroll"
              />
            </div>
            <label class="text-[10px] text-muted-foreground shrink-0">{{ t('tools.regexTester.replaceWith') }}</label>
            <input v-model="replaceWith" type="text" class="field font-mono text-xs h-8 shrink-0" />
          </div>
        </Pane>
      </template>
      <template #b>
        <Pane :title="t('tools.regexTester.matches')" :badge="displayMatches.length || undefined" scroll>
          <div
            class="p-2 space-y-3 min-h-full"
            :class="{ 'is-stale is-stale-anim': resultsStale }"
          >
            <div v-if="replacePreview !== null" class="space-y-1">
              <div class="text-[10px] text-muted-foreground">{{ t('tools.regexTester.replaceResult') }}</div>
              <pre class="text-xs font-mono whitespace-pre-wrap break-all rounded-md border border-border p-2 bg-muted/20">{{ replacePreview }}</pre>
            </div>
            <TransitionGroup name="match-list" tag="div" class="space-y-1.5">
              <div
                v-for="(match, index) in displayMatches"
                :key="`${match.index}-${index}-${match.text}`"
                class="rounded-md border border-border/60 p-2 text-xs font-mono bg-muted/15"
              >
                <div class="flex justify-between text-[10px] text-muted-foreground mb-0.5 gap-2">
                  <span>{{ t('tools.regexTester.matchN', { n: index + 1 }) }}</span>
                  <span class="tabular-nums">{{ t('tools.regexTester.matchIndex', { n: match.index }) }}</span>
                </div>
                <div class="font-medium break-all">{{ match.text }}</div>
                <div v-if="match.groups.length > 0" class="mt-1.5 pl-2 border-l-2 border-primary/25 space-y-0.5">
                  <div v-for="(group, gIndex) in match.groups" :key="gIndex" class="text-[10px]">
                    <span class="text-muted-foreground">{{ t('tools.regexTester.groupN', { n: gIndex + 1 }) }}:</span>
                    {{ group ?? '—' }}
                  </div>
                </div>
                <div v-if="Object.keys(match.named).length > 0" class="mt-1.5 pl-2 border-l-2 border-primary/40 space-y-0.5">
                  <div v-for="(val, name) in match.named" :key="name" class="text-[10px]">
                    <span class="text-muted-foreground">{{ name }}:</span> {{ val ?? '—' }}
                  </div>
                </div>
              </div>
            </TransitionGroup>
            <p v-if="!displayMatches.length && replacePreview === null" class="text-xs text-muted-foreground text-center py-6">
              {{ t('errors.noResults') }}
            </p>
          </div>
        </Pane>
      </template>
    </SplitPane>

    <template #status>
      <StatusBar :state="error ? 'error' : displayMatches.length ? 'ok' : undefined">
        <span v-if="error" class="sb-err">
          {{ error }}
        </span>
        <span v-else-if="truncated" class="sb-warn">{{ t('tools.regexTester.truncated') }}</span>
        <span v-else-if="displayMatches.length" class="sb-ok">
          {{ t('tools.regexTester.statusMatches', { n: displayMatches.length }) }}
        </span>
        <span v-else class="text-muted-foreground">{{ t('tools.regexTester.statusEmpty') }}</span>
        <template #right>
          <span class="font-mono text-[10px] max-md:hidden">/{{ activeFlags }}</span>
          <span v-if="resultsStale" class="text-muted-foreground">{{ t('tools.regexTester.staleHint') }}</span>
        </template>
      </StatusBar>
    </template>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onBeforeUnmount } from 'vue'
import { Regex as RegexIcon, ChevronDown } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import ToolShell from '@/components/ui/ToolShell.vue'
import ToggleChip from '@/components/ui/ToggleChip.vue'
import DropdownMenu, { type MenuItem } from '@/components/ui/DropdownMenu.vue'
import SplitPane from '@/components/ui/SplitPane.vue'
import Pane from '@/components/ui/Pane.vue'
import StatusBar from '@/components/ui/StatusBar.vue'
import RegexWorker from '@/workers/regex.worker?worker'
import { buildHighlightHtml, type MatchInfo } from '@/utils/regexMatch'

const { t } = useI18n()

const regexPattern = ref('')
const testString = ref('Hello World! 123')
const replaceWith = ref('')
const error = ref('')
const truncated = ref(false)

interface FlagItem {
  value: string
  short: string
  title: string
  enabled: boolean
}

const flags = reactive<FlagItem[]>([
  { value: 'g', short: 'g', title: '', enabled: true },
  { value: 'i', short: 'i', title: '', enabled: true },
  { value: 'm', short: 'm', title: '', enabled: false },
  { value: 's', short: 's', title: '', enabled: false },
  { value: 'u', short: 'u', title: '', enabled: false }
])

const syncFlagTitles = () => {
  const keys = ['g', 'i', 'm', 's', 'u'] as const
  keys.forEach((k, i) => {
    flags[i].title = t(`tools.regexTester.flags.${k}`)
    flags[i].short = t(`tools.regexTester.flagsShort.${k}`)
  })
}
syncFlagTitles()

const activeFlags = computed(() => flags.filter((f) => f.enabled).map((f) => f.value).join(''))

const REGEX_TEMPLATES: Record<string, string> = {
  email: '^[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}$',
  url: '^https?:\\/\\/[^\\s]+$',
  ipv4: '^(?:\\d{1,3}\\.){3}\\d{1,3}$',
  hex: '^[0-9a-fA-F]+$',
  digits: '^\\d+$',
  chinese: '[\\u4e00-\\u9fff]+'
}

const templateMenuItems = computed<MenuItem[]>(() => [
  { type: 'header', label: t('tools.regexTester.templates') },
  { label: t('tools.regexTester.templateEmail'), value: 'email' },
  { label: t('tools.regexTester.templateUrl'), value: 'url' },
  { label: t('tools.regexTester.templateIpv4'), value: 'ipv4' },
  { label: t('tools.regexTester.templateHex'), value: 'hex' },
  { label: t('tools.regexTester.templateDigits'), value: 'digits' },
  { label: t('tools.regexTester.templateChinese'), value: 'chinese' }
])

const onTemplateSelect = (value: string) => {
  const pattern = REGEX_TEMPLATES[value]
  if (pattern) regexPattern.value = pattern
}

const matches = ref<MatchInfo[]>([])
const lastGoodMatches = ref<MatchInfo[]>([])

const resultsStale = computed(() => Boolean(error.value) && lastGoodMatches.value.length > 0)

const displayMatches = computed(() => (resultsStale.value ? lastGoodMatches.value : matches.value))

const EXEC_TIMEOUT_MS = 1000
let worker: Worker | null = null
let requestId = 0
let timeoutTimer: ReturnType<typeof setTimeout> | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null

interface WorkerResultMessage {
  id: number
  ok: boolean
  result?: { matches: MatchInfo[]; truncated: boolean }
  error?: string
}

const ensureWorker = () => {
  if (worker) return worker
  worker = new RegexWorker()
  worker.onmessage = (e: MessageEvent<WorkerResultMessage>) => {
    const msg = e.data
    if (msg.id !== requestId) return
    if (timeoutTimer) clearTimeout(timeoutTimer)
    if (msg.ok && msg.result) {
      matches.value = msg.result.matches
      lastGoodMatches.value = msg.result.matches
      truncated.value = msg.result.truncated
      error.value = ''
    } else {
      matches.value = []
      truncated.value = false
      error.value = msg.error ?? t('tools.regexTester.unknownError')
    }
  }
  return worker
}

const killWorker = () => {
  worker?.terminate()
  worker = null
}

const computeMatches = () => {
  if (timeoutTimer) clearTimeout(timeoutTimer)
  if (!regexPattern.value) {
    matches.value = []
    lastGoodMatches.value = []
    error.value = ''
    truncated.value = false
    requestId++
    return
  }
  try {
    new RegExp(regexPattern.value, activeFlags.value)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e)
    matches.value = []
    truncated.value = false
    requestId++
    return
  }
  const id = ++requestId
  ensureWorker().postMessage({ id, pattern: regexPattern.value, flags: activeFlags.value, text: testString.value })
  timeoutTimer = setTimeout(() => {
    if (id !== requestId) return
    killWorker()
    matches.value = []
    truncated.value = false
    error.value = t('tools.regexTester.timeout', { ms: EXEC_TIMEOUT_MS })
  }, EXEC_TIMEOUT_MS)
}

watch([regexPattern, testString, activeFlags], () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(computeMatches, 120)
}, { immediate: true })

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (timeoutTimer) clearTimeout(timeoutTimer)
  killWorker()
})

const highlightedText = computed(() => {
  const source = error.value ? lastGoodMatches.value : matches.value
  return buildHighlightHtml(testString.value, source)
})

const replacePreview = computed(() => {
  if (!regexPattern.value || error.value) return null
  try {
    const re = new RegExp(regexPattern.value, activeFlags.value)
    return testString.value.replace(re, replaceWith.value)
  } catch {
    return null
  }
})

const backdropRef = ref<HTMLElement | null>(null)
const onTextareaScroll = (e: Event) => {
  const el = e.target as HTMLTextAreaElement
  if (backdropRef.value) {
    backdropRef.value.scrollTop = el.scrollTop
    backdropRef.value.scrollLeft = el.scrollLeft
  }
}
</script>

<style scoped>
.regex-backdrop :deep(span) {
  background: hsl(var(--warning) / 0.28);
  border-radius: 2px;
}
.match-list-enter-active {
  transition:
    opacity var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-out);
}
.match-list-enter-from {
  opacity: 0;
  transform: translateY(3px);
}
</style>
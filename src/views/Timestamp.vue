<template>
  <ToolShell :icon="Clock" :title="t('tools.timestamp.name')" scroll>
    <template #actions>
      <ToggleChip v-model="liveClock" :title="t('tools.timestamp.liveClockDesc')">
        <RefreshCw class="w-3 h-3" />
        <span class="max-sm:hidden">{{ t('tools.timestamp.liveClock') }}</span>
      </ToggleChip>
    </template>

    <template #right>
      <IconButton :title="t('tools.timestamp.actions.pasteAndParse')" @click="pasteAndParse">
        <ClipboardPaste class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton :title="t('tools.timestamp.actions.setCurrentTime')" @click="setCurrentTime">
        <RefreshCw class="w-3.5 h-3.5" />
      </IconButton>
    </template>

    <template #help>
      <p>{{ t('tools.timestamp.description') }}</p>
      <p class="font-semibold mt-3 mb-2">{{ t('tools.timestamp.helpFormatsTitle') }}</p>
      <ul class="list-disc list-inside space-y-1 text-muted-foreground">
        <li>{{ t('tools.timestamp.helpTimestamp') }}</li>
        <li>{{ t('tools.timestamp.helpDateString') }}</li>
        <li>{{ t('tools.timestamp.helpIso') }}</li>
        <li>{{ t('tools.timestamp.helpNatural') }}</li>
      </ul>
    </template>

    <div class="flex flex-col gap-2 min-h-0">
      <input
        v-model="userInput"
        type="text"
        class="field w-full text-center font-mono"
        :placeholder="t('common.placeholders.enterTimestamp')"
        @input="() => parseInput()"
      />

      <Pane :title="t('tools.timestamp.result.title')" scroll>
        <div
          class="p-2 grid gap-1 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(24rem,1fr))]"
          :class="{ 'is-stale is-stale-anim': showStale }"
        >
          <div v-for="item in outputFormats" :key="item.id" class="min-w-0">
            <div class="flex items-center gap-2 min-h-[1.75rem] px-2 py-1 rounded-md hover:bg-muted/40 group">
              <span class="text-[11px] font-medium text-muted-foreground shrink-0 w-[6.5rem] truncate" :title="item.label">
                {{ item.label }}
              </span>
              <span class="flex-1 min-w-0 font-mono text-xs truncate select-all" :title="item.value">{{ item.value }}</span>
              <IconButton
                class="opacity-70 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                :title="t('common.copy')"
                small
                @click="copyValue(item.value)"
              >
                <Copy class="w-3 h-3" />
              </IconButton>
            </div>
          </div>
          <p v-if="!outputFormats.length" class="text-xs text-muted-foreground col-span-full px-2 py-4 text-center">
            {{ t('tools.timestamp.emptyHint') }}
          </p>
        </div>
      </Pane>
    </div>

    <template #status>
      <StatusBar :state="statusBarState">
        <span v-if="userInput && !isValid" class="sb-err">{{ t('errors.invalidTimestamp') }}</span>
        <span v-else-if="isValid" class="sb-ok">
          <Check class="shrink-0" />
          {{ t('tools.timestamp.statusValid') }}
        </span>
        <span v-else class="text-muted-foreground">{{ t('tools.timestamp.statusReady') }}</span>
        <template #right>
          <span v-if="effectiveDate">{{ effectiveDate?.format('YYYY-MM-DD HH:mm:ss') }}</span>
          <span v-if="showStale" class="sb-warn">{{ t('tools.timestamp.statusStale') }}</span>
        </template>
      </StatusBar>
    </template>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import { Clock, ClipboardPaste, RefreshCw, Copy, Check } from 'lucide-vue-next'
import ToolShell from '@/components/ui/ToolShell.vue'
import Pane from '@/components/ui/Pane.vue'
import StatusBar from '@/components/ui/StatusBar.vue'
import IconButton from '@/components/ui/IconButton.vue'
import ToggleChip from '@/components/ui/ToggleChip.vue'
import { addDisableSaveShortcut, removeDisableSaveShortcut } from '@/utils/keyboardUtils'
import { copyText, readClipboardText } from '@/utils/clipboard'
const { t, locale } = useI18n()

dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)
dayjs.extend(utc)

const TIME_ZONES = [
  { id: 'local', zone: undefined as string | undefined, labelKey: 'tools.timestamp.result.tzLocal' },
  { id: 'utc', zone: 'UTC', labelKey: 'tools.timestamp.result.tzUtc' },
  { id: 'ny', zone: 'America/New_York', labelKey: 'tools.timestamp.result.tzNewYork' },
  { id: 'lon', zone: 'Europe/London', labelKey: 'tools.timestamp.result.tzLondon' },
  { id: 'tyo', zone: 'Asia/Tokyo', labelKey: 'tools.timestamp.result.tzTokyo' },
  { id: 'sha', zone: 'Asia/Shanghai', labelKey: 'tools.timestamp.result.tzShanghai' },
] as const

const userInput = ref('')
const parsedDate = ref<dayjs.Dayjs | null>(null)
const lastGoodDate = ref<dayjs.Dayjs | null>(null)
const liveClock = ref(false)
/** 仅在「设为当前时间」后跟随实时钟，手动输入历史时间不会被迫变成 now */
const trackingLive = ref(false)
/** 仅驱动“跟随当前时间”的展示，不改动输入框 */
const clockTick = ref(Date.now())
let clockTimer: ReturnType<typeof setInterval> | null = null

const isValid = computed(() => parsedDate.value !== null && parsedDate.value.isValid())
const showStale = computed(() => !!userInput.value.trim() && !isValid.value && lastGoodDate.value !== null)

const effectiveDate = computed(() => {
  if (isValid.value && parsedDate.value) return parsedDate.value
  if (showStale.value && lastGoodDate.value) return lastGoodDate.value
  return null
})

const liveDisplayDate = computed(() => {
  if (liveClock.value && trackingLive.value && isValid.value) return dayjs(clockTick.value)
  return effectiveDate.value
})

const localOffsetLabel = computed(() => {
  const mins = -new Date().getTimezoneOffset()
  const sign = mins >= 0 ? '+' : '-'
  const abs = Math.abs(mins)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  return m ? `UTC${sign}${h}:${String(m).padStart(2, '0')}` : `UTC${sign}${h}`
})

interface OutputRow {
  id: string
  label: string
  value: string
}

function formatZone(d: dayjs.Dayjs, timeZone: string | undefined): string {
  const date = d.toDate()
  const loc = locale.value.startsWith('zh') ? 'zh-CN' : 'en-US'
  try {
    return new Intl.DateTimeFormat(loc, {
      timeZone: timeZone ?? undefined,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date)
  } catch {
    return d.format('YYYY-MM-DD HH:mm:ss')
  }
}

const outputFormats = computed((): OutputRow[] => {
  const d = liveDisplayDate.value
  if (!d) return []
  const rows: OutputRow[] = [
    {
      id: 'local-time',
      label: t('tools.timestamp.result.localTime', { offset: localOffsetLabel.value }),
      value: d.format('YYYY-MM-DD HH:mm:ss'),
    },
    { id: 'local-date', label: t('tools.timestamp.result.localDate'), value: d.format('YYYY-MM-DD') },
    { id: 'unix-s', label: t('tools.timestamp.result.timestampSec'), value: String(d.unix()) },
    { id: 'unix-ms', label: t('tools.timestamp.result.timestampMs'), value: String(d.valueOf()) },
    { id: 'iso', label: t('tools.timestamp.result.utcTime'), value: d.toISOString() },
    { id: 'rfc', label: t('tools.timestamp.result.rfc2822'), value: d.format('ddd, DD MMM YYYY HH:mm:ss ZZ') },
    {
      id: 'relative',
      label: t('tools.timestamp.result.relativeTime'),
      value: liveClock.value && trackingLive.value ? dayjs(clockTick.value).fromNow() : d.fromNow(),
    },
  ]
  for (const z of TIME_ZONES) {
    rows.push({
      id: `tz-${z.id}`,
      label: t(z.labelKey),
      value: formatZone(d, z.zone),
    })
  }
  return rows
})

const statusBarState = computed(() => {
  if (userInput.value && !isValid.value) return 'error'
  return 'ok'
})

const parseInput = (opts?: { keepLive?: boolean }) => {
  if (!opts?.keepLive) trackingLive.value = false
  const input = userInput.value.trim()
  if (!input) {
    parsedDate.value = null
    return
  }

  let d: dayjs.Dayjs | null = null

  if (/^\d{8}$/.test(input)) {
    d = dayjs(input, 'YYYYMMDD', true)
    if (d.isValid()) {
      const year = d.year()
      if (year >= 1900 && year <= 2100) {
        parsedDate.value = d
        lastGoodDate.value = d
        return
      }
    }
  }

  if (/^\d+$/.test(input) && (input.length === 10 || input.length === 13)) {
    const num = Number(input)
    d = input.length === 10 ? dayjs.unix(num) : dayjs(num)
    if (d.isValid()) {
      parsedDate.value = d
      lastGoodDate.value = d
      return
    }
  }

  if (/^\d+$/.test(input)) {
    parsedDate.value = null
    return
  }

  d = dayjs(input)
  if (d.isValid()) {
    parsedDate.value = d
    lastGoodDate.value = d
  } else {
    parsedDate.value = null
  }
}

const setCurrentTime = () => {
  userInput.value = new Date().toISOString()
  liveClock.value = true
  trackingLive.value = true
  clockTick.value = Date.now()
  parseInput({ keepLive: true })
}

const pasteAndParse = async () => {
  const text = await readClipboardText()
  if (text === null) return
  userInput.value = text
  liveClock.value = false
  trackingLive.value = false
  parseInput()
}

const copyValue = (text: string) => {
  void copyText(text)
}

const syncLiveTimer = () => {
  if (clockTimer) {
    clearInterval(clockTimer)
    clockTimer = null
  }
  if (liveClock.value && trackingLive.value && isValid.value) {
    clockTick.value = Date.now()
    clockTimer = setInterval(() => {
      clockTick.value = Date.now()
    }, 1000)
  }
}

watch([liveClock, trackingLive, isValid], syncLiveTimer, { immediate: true })

onMounted(() => {
  setCurrentTime()
  addDisableSaveShortcut()
})

onBeforeUnmount(() => {
  removeDisableSaveShortcut()
  if (clockTimer) clearInterval(clockTimer)
})
</script>
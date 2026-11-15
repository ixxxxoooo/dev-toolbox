<template>
  <ToolShell :icon="QrCodeIcon" :title="t('tools.qrCode.name')" flush>
    <template #actions>
      <DropdownMenu :items="ecMenuItems" align="left" @select="onEcSelect">
        <template #trigger>
          <button type="button" class="chip max-w-[8rem] truncate">
            {{ ecLabel }}
            <ChevronDown class="w-3 h-3 opacity-60 shrink-0" />
          </button>
        </template>
      </DropdownMenu>
    </template>

    <template #right>
      <IconButton :title="t('common.download')" :disabled="!qrDataUrl" @click="download">
        <Download class="w-3.5 h-3.5" />
      </IconButton>
    </template>

    <template #help>
      <p>{{ t('tools.qrCode.description') }}</p>
    </template>

    <SplitPane storage-key="qrcode">
      <template #a>
        <Pane :title="t('tools.qrCode.inputPanel')" scroll>
          <div class="p-2 space-y-3">
            <textarea
              v-model="text"
              class="field w-full min-h-[88px] font-mono text-xs resize-none"
              :placeholder="t('tools.qrCode.placeholder')"
            />
            <div class="grid grid-cols-2 gap-2 text-xs">
              <label class="space-y-1">
                <span class="text-muted-foreground">{{ t('tools.qrCode.sizePx') }}</span>
                <input
                  v-model.number="width"
                  type="number"
                  class="field w-full h-8 tabular-nums"
                  min="100"
                  max="1000"
                  step="10"
                />
              </label>
              <label class="space-y-1">
                <span class="text-muted-foreground">{{ t('tools.qrCode.margin') }}</span>
                <input
                  v-model.number="margin"
                  type="number"
                  class="field w-full h-8 tabular-nums"
                  min="0"
                  max="10"
                />
              </label>
              <label class="space-y-1">
                <span class="text-muted-foreground">{{ t('tools.qrCode.colorDark') }}</span>
                <input
                  v-model="color.dark"
                  type="color"
                  class="field w-full h-8 p-0.5 cursor-pointer"
                  :title="t('tools.qrCode.colorDark')"
                />
              </label>
              <label class="space-y-1">
                <span class="text-muted-foreground">{{ t('tools.qrCode.colorLight') }}</span>
                <input
                  v-model="color.light"
                  type="color"
                  class="field w-full h-8 p-0.5 cursor-pointer"
                  :title="t('tools.qrCode.colorLight')"
                />
              </label>
            </div>
          </div>
        </Pane>
      </template>
      <template #b>
        <Pane :title="t('tools.qrCode.previewPanel')">
          <template #actions>
            <IconButton :title="t('common.download')" small :disabled="!qrDataUrl" @click="download">
              <Download class="w-3.5 h-3.5" />
            </IconButton>
          </template>
          <div class="flex items-center justify-center p-3 min-h-[200px] h-full">
            <Transition name="qr-in">
              <img
                v-if="qrDataUrl"
                :key="qrDataUrl.slice(0, 64)"
                :src="qrDataUrl"
                :alt="t('tools.qrCode.previewAlt')"
                class="max-w-full max-h-full rounded-md border border-border shadow-sm"
              />
              <p v-else class="text-xs text-muted-foreground">
                {{ t('common.placeholders.enterText') }}
              </p>
            </Transition>
          </div>
        </Pane>
      </template>
    </SplitPane>

    <template #status>
      <StatusBar :state="generateError ? 'error' : text.trim() && qrDataUrl ? 'ok' : undefined">
        <span v-if="generateError" class="sb-err">{{ generateError }}</span>
        <span v-else-if="qrDataUrl" class="sb-ok">{{ t('tools.qrCode.statusReady') }}</span>
        <span v-else class="text-muted-foreground">{{ t('tools.qrCode.statusEmpty') }}</span>
        <span v-if="qrDataUrl">{{ t('tools.qrCode.statusSize', { n: width }) }}</span>
        <template #right>
          <span>{{ ecLabel }}</span>
        </template>
      </StatusBar>
    </template>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { QrCode as QrCodeIcon, Download, ChevronDown } from 'lucide-vue-next'
import QRCode from 'qrcode'
import { useI18n } from 'vue-i18n'
import ToolShell from '@/components/ui/ToolShell.vue'
import IconButton from '@/components/ui/IconButton.vue'
import SplitPane from '@/components/ui/SplitPane.vue'
import Pane from '@/components/ui/Pane.vue'
import StatusBar from '@/components/ui/StatusBar.vue'
import DropdownMenu, { type MenuItem } from '@/components/ui/DropdownMenu.vue'

const { t } = useI18n()

type EcLevel = 'L' | 'M' | 'Q' | 'H'

const text = ref('https://example.com')
const qrDataUrl = ref('')
const generateError = ref('')
const errorCorrectionLevel = ref<EcLevel>('M')
const width = ref(300)
const margin = ref(4)
const color = ref({ dark: '#000000', light: '#ffffff' })

const ecMenuItems = computed<MenuItem[]>(() => [
  { type: 'header', label: t('tools.qrCode.errorCorrection') },
  { label: t('tools.qrCode.ecLevels.L'), value: 'L', checked: errorCorrectionLevel.value === 'L' },
  { label: t('tools.qrCode.ecLevels.M'), value: 'M', checked: errorCorrectionLevel.value === 'M' },
  { label: t('tools.qrCode.ecLevels.Q'), value: 'Q', checked: errorCorrectionLevel.value === 'Q' },
  { label: t('tools.qrCode.ecLevels.H'), value: 'H', checked: errorCorrectionLevel.value === 'H' }
])

const ecLabel = computed(() => {
  const key = errorCorrectionLevel.value
  return t(`tools.qrCode.ecLevels.${key}`)
})

const onEcSelect = (value: string) => {
  if (value === 'L' || value === 'M' || value === 'Q' || value === 'H') {
    errorCorrectionLevel.value = value
  }
}

const generate = async () => {
  generateError.value = ''
  if (!text.value) {
    qrDataUrl.value = ''
    return
  }
  try {
    qrDataUrl.value = await QRCode.toDataURL(text.value, {
      errorCorrectionLevel: errorCorrectionLevel.value,
      width: width.value,
      margin: margin.value,
      color: {
        dark: color.value.dark,
        light: color.value.light
      }
    })
  } catch (err: unknown) {
    qrDataUrl.value = ''
    generateError.value = err instanceof Error ? err.message : String(err)
  }
}

const download = () => {
  if (!qrDataUrl.value) return
  const a = document.createElement('a')
  a.href = qrDataUrl.value
  a.download = 'qrcode.png'
  a.click()
}

watch([text, errorCorrectionLevel, width, margin, color], generate, { deep: true })

onMounted(generate)
</script>

<style scoped>
.qr-in-enter-active {
  transition:
    opacity var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-out);
}
.qr-in-enter-from {
  opacity: 0;
  transform: scale(0.96);
}
</style>
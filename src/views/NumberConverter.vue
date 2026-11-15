<template>
  <ToolShell :icon="Binary" :title="t('tools.numberConverter.name')" scroll>
    <template #actions>
      <Segmented v-model="bitWidth" :options="bitWidthOptions" small class="shrink-0" />
    </template>

    <template #right>
      <IconButton :title="t('common.clear')" @click="reset">
        <Eraser class="w-3.5 h-3.5" />
      </IconButton>
    </template>

    <template #help>
      <p>{{ t('tools.numberConverter.description') }}</p>
      <p class="font-semibold mt-3 mb-2">{{ t('tools.numberConverter.twosComplement') }}</p>
      <p class="text-muted-foreground">{{ t('tools.numberConverter.twosHelp') }}</p>
    </template>

    <div class="flex flex-col gap-2 min-h-0">
      <div class="grid gap-2 grid-cols-1 md:grid-cols-2">
        <div class="flex items-center gap-2 p-2 rounded-lg border border-border bg-card">
          <label class="text-[11px] font-medium text-muted-foreground w-24 shrink-0" for="nc-dec">
            {{ t('tools.numberConverter.decimal') }} (10)
          </label>
          <input
            id="nc-dec"
            v-model="decimal"
            type="text"
            class="field flex-1 min-w-0 font-mono"
            placeholder="0"
            spellcheck="false"
            @input="updateFromDecimal"
          />
          <IconButton :title="t('common.copy')" small :disabled="!decimal" @click="copy(decimal)">
            <Copy class="w-3 h-3" />
          </IconButton>
        </div>
        <div class="flex items-center gap-2 p-2 rounded-lg border border-border bg-card">
          <label class="text-[11px] font-medium text-muted-foreground w-24 shrink-0" for="nc-hex">
            {{ t('tools.numberConverter.hex') }} (16)
          </label>
          <input
            id="nc-hex"
            v-model="hex"
            type="text"
            class="field flex-1 min-w-0 font-mono uppercase"
            placeholder="0"
            spellcheck="false"
            @input="updateFromHex"
          />
          <IconButton :title="t('common.copy')" small :disabled="!hex" @click="copy(hex)">
            <Copy class="w-3 h-3" />
          </IconButton>
        </div>
        <div class="flex items-center gap-2 p-2 rounded-lg border border-border bg-card">
          <label class="text-[11px] font-medium text-muted-foreground w-24 shrink-0" for="nc-bin">
            {{ t('tools.numberConverter.binary') }} (2)
          </label>
          <input
            id="nc-bin"
            v-model="binary"
            type="text"
            class="field flex-1 min-w-0 font-mono"
            placeholder="0"
            spellcheck="false"
            @input="updateFromBinary"
          />
          <IconButton :title="t('common.copy')" small :disabled="!binary" @click="copy(binary)">
            <Copy class="w-3 h-3" />
          </IconButton>
        </div>
        <div class="flex items-center gap-2 p-2 rounded-lg border border-border bg-card">
          <label class="text-[11px] font-medium text-muted-foreground w-24 shrink-0" for="nc-oct">
            {{ t('tools.numberConverter.octal') }} (8)
          </label>
          <input
            id="nc-oct"
            v-model="octal"
            type="text"
            class="field flex-1 min-w-0 font-mono"
            placeholder="0"
            spellcheck="false"
            @input="updateFromOctal"
          />
          <IconButton :title="t('common.copy')" small :disabled="!octal" @click="copy(octal)">
            <Copy class="w-3 h-3" />
          </IconButton>
        </div>
      </div>

      <Pane :title="t('tools.numberConverter.twosComplement')" scroll>
        <div
          class="p-2 space-y-2"
          :class="{ 'is-stale is-stale-anim': invalid !== null }"
        >
          <template v-if="twos">
            <div
              v-for="item in twosRows"
              :key="item.key"
              class="flex items-center gap-2 min-h-[1.75rem] px-1 group"
            >
              <span class="text-[11px] font-medium text-muted-foreground w-12 shrink-0">{{ item.label }}</span>
              <span class="flex-1 font-mono text-xs truncate select-all">{{ item.value }}</span>
              <IconButton
                class="opacity-70 sm:opacity-0 sm:group-hover:opacity-100"
                :title="t('common.copy')"
                small
                @click="copy(item.value)"
              >
                <Copy class="w-3 h-3" />
              </IconButton>
            </div>
          </template>
          <p v-else class="text-xs text-muted-foreground text-center py-3">{{ t('tools.numberConverter.twosEmpty') }}</p>
        </div>
      </Pane>
    </div>

    <template #status>
      <StatusBar :state="statusBarState">
        <span v-if="invalid !== null" class="sb-err">{{ t('tools.numberConverter.invalidInput') }}</span>
        <span v-else-if="twos?.overflow" class="sb-warn">{{ t('tools.numberConverter.overflow') }}</span>
        <span v-else-if="current !== null" class="sb-ok">
          <Check class="shrink-0" />
          {{ t('tools.numberConverter.statusOk') }}
        </span>
        <span v-else class="text-muted-foreground">{{ t('tools.numberConverter.statusReady') }}</span>
        <template #right>
          <span v-if="current !== null">{{ bitWidth }}-bit</span>
        </template>
      </StatusBar>
    </template>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Binary, Copy, Eraser, Check } from 'lucide-vue-next'
import ToolShell from '@/components/ui/ToolShell.vue'
import Pane from '@/components/ui/Pane.vue'
import StatusBar from '@/components/ui/StatusBar.vue'
import IconButton from '@/components/ui/IconButton.vue'
import Segmented, { type SegmentedOption } from '@/components/ui/Segmented.vue'
import { parseRadix, formatRadix, toTwosComplement, fitsInBits, type Radix, type BitWidth } from '@/utils/radix'
import { copyText } from '@/utils/clipboard'
const { t } = useI18n()

const decimal = ref('')
const hex = ref('')
const binary = ref('')
const octal = ref('')
const invalid = ref<Radix | null>(null)
const bitWidth = ref<BitWidth>(32)
const current = ref<bigint | null>(null)

const bitWidthOptions = computed((): SegmentedOption<BitWidth>[] => [
  { value: 8, label: '8' },
  { value: 16, label: '16' },
  { value: 32, label: '32' },
  { value: 64, label: '64' },
])

const reset = () => {
  decimal.value = ''
  hex.value = ''
  binary.value = ''
  octal.value = ''
  invalid.value = null
  current.value = null
}

const update = (source: Radix, text: string) => {
  const value = parseRadix(text, source)
  const targets: Record<Radix, (v: string) => void> = {
    10: (v) => { decimal.value = v },
    16: (v) => { hex.value = v },
    2: (v) => { binary.value = v },
    8: (v) => { octal.value = v },
  }
  if (value === undefined) {
    invalid.value = source
    current.value = null
    ;(Object.keys(targets).map(Number) as Radix[]).filter((r) => r !== source).forEach((r) => targets[r](''))
    return
  }
  invalid.value = null
  current.value = value
  if (value === null) {
    ;(Object.keys(targets).map(Number) as Radix[]).filter((r) => r !== source).forEach((r) => targets[r](''))
    return
  }
  ;(Object.keys(targets).map(Number) as Radix[]).filter((r) => r !== source).forEach((r) => targets[r](formatRadix(value, r)))
}

const updateFromDecimal = () => update(10, decimal.value)
const updateFromHex = () => update(16, hex.value)
const updateFromBinary = () => update(2, binary.value)
const updateFromOctal = () => update(8, octal.value)

const twos = computed(() => {
  if (current.value === null) return null
  const bits = bitWidth.value
  const overflow = !fitsInBits(current.value, bits)
  const u = toTwosComplement(current.value, bits)
  return {
    overflow,
    hex: u.toString(16).toUpperCase().padStart(bits / 4, '0'),
    binary: u.toString(2).padStart(bits, '0'),
  }
})

const twosRows = computed(() => {
  if (!twos.value) return []
  return [
    { key: 'hex', label: 'HEX', value: twos.value.hex },
    { key: 'bin', label: 'BIN', value: twos.value.binary },
  ]
})

const statusBarState = computed(() => {
  if (invalid.value !== null) return 'error'
  if (twos.value?.overflow) return 'warn'
  return 'ok'
})

const copy = (text: string) => {
  if (!text) return
  void copyText(text)
}
</script>
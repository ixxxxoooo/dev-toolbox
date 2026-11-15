<template>
  <ToolShell :icon="KeyRound" :title="t('tools.password.name')" flush>
    <template #actions>
      <Segmented v-model="selectedType" :options="typeOptions" small />
      <template v-if="selectedType === 'strong'">
        <span class="tool-vr max-lg:hidden"></span>
        <ToggleChip v-model="options.uppercase" class="max-md:hidden" @update:model-value="generatePassword">
          {{ t('tools.password.uppercase') }}
        </ToggleChip>
        <ToggleChip v-model="options.lowercase" class="max-md:hidden" @update:model-value="generatePassword">
          {{ t('tools.password.lowercase') }}
        </ToggleChip>
        <ToggleChip v-model="options.numbers" class="max-md:hidden" @update:model-value="generatePassword">
          {{ t('tools.password.numbers') }}
        </ToggleChip>
        <ToggleChip v-model="options.symbols" class="max-lg:hidden" @update:model-value="generatePassword">
          {{ t('tools.password.symbols') }}
        </ToggleChip>
        <ToggleChip v-model="options.excludeAmbiguous" class="max-xl:hidden" @update:model-value="generatePassword">
          {{ t('tools.password.excludeAmbiguous') }}
        </ToggleChip>
      </template>
      <template v-if="selectedType === 'memorable'">
        <span class="tool-vr max-sm:hidden"></span>
        <ToggleChip v-model="memorableOptions.includeNumbers" @update:model-value="generatePassword">
          {{ t('tools.password.numbers') }}
        </ToggleChip>
        <ToggleChip v-model="memorableOptions.capitalizeWords" class="max-sm:hidden" @update:model-value="generatePassword">
          {{ t('tools.password.capitalizeWords') }}
        </ToggleChip>
      </template>
    </template>

    <template #right>
      <button type="button" class="btn btn-primary h-7 px-2.5 text-xs press gap-1.5" @click="generatePassword">
        <RefreshCw class="w-3.5 h-3.5" />
        <span class="max-sm:hidden">{{ t('common.generate') }}</span>
      </button>
      <IconButton :title="t('common.clear')" danger :disabled="!generatedPasswords.length" @click="clearPasswords">
        <Trash2 class="w-3.5 h-3.5" />
      </IconButton>
    </template>

    <template #help>
      <p>{{ t('tools.password.description') }}</p>
      <p class="font-semibold mt-3 mb-2">{{ t('tools.password.passwordType') }}</p>
      <ul class="list-disc list-inside space-y-1 text-muted-foreground">
        <li v-for="pt in passwordTypes" :key="pt.key">
          <strong>{{ t(pt.label) }}:</strong> {{ t(pt.description) }}
        </li>
      </ul>
      <p class="font-semibold mt-3 mb-2">{{ t('tools.password.securityAdvice') }}</p>
      <ul class="list-disc list-inside space-y-1 text-muted-foreground text-xs">
        <li v-for="key in adviceKeys" :key="key">{{ t(`tools.password.advice.${key}`) }}</li>
      </ul>
    </template>

    <SplitPane storage-key="password">
      <template #a>
        <Pane :title="t('tools.password.configPanel')" scroll>
          <div class="p-2 space-y-3">
            <p
              v-if="selectedType === 'strong' && charsetError"
              class="text-xs text-destructive flex items-center gap-1"
            >
              <AlertCircle class="w-3.5 h-3.5 shrink-0" />
              {{ charsetError }}
            </p>

            <div v-if="selectedType !== 'memorable' && selectedType !== 'pin'" class="space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="text-muted-foreground">{{ t('tools.password.passwordLength') }}</span>
                <span class="font-mono tabular-nums text-primary">{{ passwordLength }}</span>
              </div>
              <CustomRange
                v-model="passwordLength"
                :min="getMinLength()"
                :max="getMaxLength()"
                :show-value="false"
                @update:model-value="generatePassword"
              />
              <p class="text-[10px] text-muted-foreground">
                {{ t('tools.password.recommendedLength') }}: {{ getRecommendedLength() }} {{ t('tools.password.characters') }}
              </p>
            </div>

            <div v-if="selectedType === 'memorable'" class="space-y-1">
              <CustomRange
                v-model="memorableOptions.wordCount"
                :min="3"
                :max="6"
                :label="t('tools.password.wordCount')"
                @update:model-value="generatePassword"
              />
            </div>

            <div v-if="selectedType === 'strong'" class="flex flex-wrap gap-1 lg:hidden">
              <ToggleChip v-model="options.uppercase" @update:model-value="generatePassword">
                {{ t('tools.password.uppercase') }}
              </ToggleChip>
              <ToggleChip v-model="options.lowercase" @update:model-value="generatePassword">
                {{ t('tools.password.lowercase') }}
              </ToggleChip>
              <ToggleChip v-model="options.numbers" @update:model-value="generatePassword">
                {{ t('tools.password.numbers') }}
              </ToggleChip>
              <ToggleChip v-model="options.symbols" @update:model-value="generatePassword">
                {{ t('tools.password.symbols') }}
              </ToggleChip>
              <ToggleChip v-model="options.excludeAmbiguous" @update:model-value="generatePassword">
                {{ t('tools.password.excludeAmbiguous') }}
              </ToggleChip>
            </div>
          </div>
        </Pane>
      </template>
      <template #b>
        <Pane :title="t('tools.password.generatedPasswords')" :badge="generatedPasswords.length || undefined">
          <template #actions>
            <IconButton :title="t('common.buttons.regenerate')" small @click="generatePassword">
              <RefreshCw class="w-3.5 h-3.5" />
            </IconButton>
          </template>
          <div class="p-2 flex flex-col min-h-full gap-3">
            <TransitionGroup name="pw-list" tag="div" class="space-y-1.5 flex-1">
              <div
                v-for="(password, index) in generatedPasswords"
                :key="`${index}-${password}`"
                class="flex items-center gap-1 group"
              >
                <input
                  type="text"
                  readonly
                  :value="password"
                  class="field font-mono text-xs flex-1 min-w-0 h-8"
                />
                <IconButton :title="t('tools.password.copyPassword')" small @click="copyPassword(password)">
                  <Copy class="w-3.5 h-3.5" />
                </IconButton>
              </div>
            </TransitionGroup>
            <p v-if="!generatedPasswords.length" class="text-xs text-muted-foreground text-center py-6">
              {{ t('tools.password.emptyResult') }}
            </p>

            <h3 v-if="generatedPasswords.length" class="text-xs font-medium text-muted-foreground mt-auto pt-2 border-t border-border">
              {{ t('tools.password.strengthAnalysis') }}
            </h3>
            <div v-if="generatedPasswords.length" class="space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs text-muted-foreground">{{ t('tools.password.strengthLevel') }}</span>
                <span class="badge" :class="strengthBadgeClass">{{ getStrengthText() }}</span>
              </div>
              <div class="h-1 rounded-full bg-muted overflow-hidden" role="progressbar" :aria-valuenow="strengthPercent" aria-valuemin="0" aria-valuemax="100">
                <div
                  class="h-full origin-left rounded-full"
                  :class="strengthBarClass"
                  :style="strengthBarStyle"
                />
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="rounded-md border border-border p-2">
                  <div class="text-muted-foreground text-[10px]">{{ t('tools.password.entropy') }}</div>
                  <div class="font-mono tabular-nums">{{ Math.round(calculateEntropy()) }} {{ t('tools.password.bitsUnit') }}</div>
                </div>
                <div class="rounded-md border border-border p-2">
                  <div class="text-muted-foreground text-[10px]">{{ t('tools.password.crackTimeDesc') }}</div>
                  <div>{{ getEstimatedCrackTime() }}</div>
                </div>
              </div>
            </div>
          </div>
        </Pane>
      </template>
    </SplitPane>

    <template #status>
      <StatusBar :state="charsetError ? 'error' : generatedPasswords.length ? 'ok' : undefined">
        <span v-if="charsetError" class="sb-err">
          <AlertCircle class="w-3.5 h-3.5 shrink-0" />
          {{ charsetError }}
        </span>
        <span v-else-if="generatedPasswords.length" class="sb-ok">
          {{ getStrengthText() }}
        </span>
        <span v-else class="text-muted-foreground">{{ t('tools.password.statusEmpty') }}</span>
        <span v-if="generatedPasswords.length && !charsetError">
          {{ t('tools.password.statusEntropy', { n: Math.round(calculateEntropy()) }) }}
        </span>
        <template #right>
          <span class="max-sm:hidden">{{ typeLabel }}</span>
          <span v-if="selectedType !== 'memorable'">{{ passwordLength }} {{ t('tools.password.characters') }}</span>
        </template>
      </StatusBar>
    </template>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { KeyRound, RefreshCw, Trash2, Copy, AlertCircle } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import ToolShell from '@/components/ui/ToolShell.vue'
import Segmented, { type SegmentedOption } from '@/components/ui/Segmented.vue'
import ToggleChip from '@/components/ui/ToggleChip.vue'
import IconButton from '@/components/ui/IconButton.vue'
import SplitPane from '@/components/ui/SplitPane.vue'
import Pane from '@/components/ui/Pane.vue'
import StatusBar from '@/components/ui/StatusBar.vue'
import CustomRange from '@/components/CustomRange.vue'
import { addDisableSaveShortcut, removeDisableSaveShortcut } from '@/utils/keyboardUtils'
import { secureRandomInt } from '@/utils/random'
import { copyText } from '@/utils/clipboard'

const { t } = useI18n()

interface PasswordOptions {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  excludeAmbiguous: boolean
}

interface MemorableOptions {
  wordCount: number
  includeNumbers: boolean
  capitalizeWords: boolean
}

const adviceKeys = ['length', 'unique', 'regular', 'manager', 'twoFactor'] as const

const commonWords = [
  'apple', 'bridge', 'chair', 'dream', 'eagle', 'flower', 'guitar', 'house',
  'island', 'jungle', 'kitten', 'lemon', 'mountain', 'ocean', 'piano', 'queen',
  'rabbit', 'sunset', 'tiger', 'umbrella', 'valley', 'whale', 'yellow', 'zebra',
  'anchor', 'basket', 'candle', 'dolphin', 'engine', 'forest', 'garden', 'hammer',
  'iceberg', 'jacket', 'keyboard', 'laptop', 'mirror', 'notebook', 'orange', 'pencil'
]

const selectedType = ref('strong')
const passwordLength = ref(16)
const generatedPasswords = ref<string[]>([])
const charsetError = ref('')

const passwordTypes = [
  { key: 'strong', label: 'tools.password.types.strong', description: 'tools.password.types.strongDesc' },
  { key: 'readable', label: 'tools.password.types.readable', description: 'tools.password.types.readableDesc' },
  { key: 'pin', label: 'tools.password.types.pin', description: 'tools.password.types.pinDesc' },
  { key: 'memorable', label: 'tools.password.types.memorable', description: 'tools.password.types.memorableDesc' }
] as const

const typeOptions = computed<SegmentedOption<string>[]>(() =>
  passwordTypes.map((pt) => ({
    value: pt.key,
    label: t(`tools.password.typeShort.${pt.key}`),
    title: t(pt.label)
  }))
)

const typeLabel = computed(() => {
  const pt = passwordTypes.find((p) => p.key === selectedType.value)
  return pt ? t(pt.label) : ''
})

const options = ref<PasswordOptions>({
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false
})

const memorableOptions = ref<MemorableOptions>({
  wordCount: 4,
  includeNumbers: true,
  capitalizeWords: true
})

const charset = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  readableUppercase: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  readableLowercase: 'abcdefghijkmnpqrstuvwxyz',
  readableNumbers: '23456789',
  ambiguous: '0O1lI|`'
}

const getMinLength = () => {
  switch (selectedType.value) {
    case 'pin': return 4
    case 'memorable': return 3
    default: return 8
  }
}

const getMaxLength = () => {
  switch (selectedType.value) {
    case 'pin': return 12
    case 'memorable': return 6
    default: return 64
  }
}

const getRecommendedLength = () => {
  switch (selectedType.value) {
    case 'strong': return 16
    case 'readable': return 14
    case 'pin': return 6
    case 'memorable': return 4
    default: return 16
  }
}

const onTypeChange = () => {
  const min = getMinLength()
  const max = getMaxLength()
  if (passwordLength.value < min) passwordLength.value = min
  if (passwordLength.value > max) passwordLength.value = max
  generatePassword()
}

const getCharacterSet = () => {
  let chars = ''
  switch (selectedType.value) {
    case 'strong':
      if (options.value.uppercase) chars += charset.uppercase
      if (options.value.lowercase) chars += charset.lowercase
      if (options.value.numbers) chars += charset.numbers
      if (options.value.symbols) chars += charset.symbols
      break
    case 'readable':
      chars = charset.readableUppercase + charset.readableLowercase + charset.readableNumbers
      break
    case 'pin':
      chars = charset.numbers
      break
    default:
      chars = charset.uppercase + charset.lowercase + charset.numbers
  }
  if (options.value.excludeAmbiguous && selectedType.value === 'strong') {
    for (const char of charset.ambiguous) {
      chars = chars.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '')
    }
  }
  return chars
}

const generateStrongPassword = (length: number) => {
  const chars = getCharacterSet()
  if (!chars) return ''
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars[secureRandomInt(chars.length)]
  }
  return password
}

const generateMemorablePassword = () => {
  const words: string[] = []
  const usedIndices = new Set<number>()
  for (let i = 0; i < memorableOptions.value.wordCount; i++) {
    let randomIndex: number
    let attempts = 0
    do {
      randomIndex = secureRandomInt(commonWords.length)
      attempts++
    } while (usedIndices.has(randomIndex) && attempts < commonWords.length)
    usedIndices.add(randomIndex)
    let word = commonWords[randomIndex]
    if (memorableOptions.value.capitalizeWords) {
      word = word.charAt(0).toUpperCase() + word.slice(1)
    }
    words.push(word)
  }
  let password = words.join('-')
  if (memorableOptions.value.includeNumbers) {
    const randomNum = secureRandomInt(9999) + 1
    password += randomNum.toString()
  }
  return password
}

const generatePassword = () => {
  const count = 3
  generatedPasswords.value = []

  if (selectedType.value === 'strong' && !getCharacterSet()) {
    charsetError.value = t('tools.password.emptyCharsetError')
    return
  }
  charsetError.value = ''

  for (let i = 0; i < count; i++) {
    let password = ''
    if (selectedType.value === 'memorable') {
      password = generateMemorablePassword()
    } else {
      password = generateStrongPassword(passwordLength.value)
    }
    if (password) generatedPasswords.value.push(password)
  }
}

const copyPassword = (password: string) => {
  void copyText(password)
}

const clearPasswords = () => {
  generatedPasswords.value = []
}

const getCharsetSize = () => {
  if (selectedType.value === 'memorable') {
    const baseSize = commonWords.length ** memorableOptions.value.wordCount
    return memorableOptions.value.includeNumbers ? baseSize * 9999 : baseSize
  }
  return getCharacterSet().length
}

const calculateEntropy = () => {
  if (generatedPasswords.value.length === 0) return 0
  if (selectedType.value === 'memorable') {
    const wordEntropy = Math.log2(commonWords.length) * memorableOptions.value.wordCount
    const numberEntropy = memorableOptions.value.includeNumbers ? Math.log2(9999) : 0
    return wordEntropy + numberEntropy
  }
  const charsetSize = getCharsetSize()
  return charsetSize > 0 ? Math.log2(charsetSize) * passwordLength.value : 0
}

const strengthTier = computed(() => {
  const entropy = calculateEntropy()
  if (entropy < 30) return 0
  if (entropy < 50) return 1
  if (entropy < 70) return 2
  return 3
})

const strengthPercent = computed(() => Math.min(100, (calculateEntropy() / 80) * 100))

const strengthBarStyle = computed(() => ({
  transform: `scaleX(${strengthPercent.value / 100})`,
  transition: 'transform var(--dur-slow) var(--ease-out)'
}))

const strengthBarClass = computed(() => {
  const tier = strengthTier.value
  if (tier === 0) return 'bg-destructive'
  if (tier === 1) return 'bg-[hsl(var(--warning))]'
  if (tier === 2) return 'bg-primary'
  return 'bg-[hsl(var(--success))]'
})

const strengthBadgeClass = computed(() => {
  const tier = strengthTier.value
  if (tier === 0) return 'badge-del'
  if (tier === 1) return 'text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.35)]'
  if (tier === 2) return 'badge-primary'
  return 'text-[hsl(var(--success))] border-[hsl(var(--success)/0.35)]'
})

const getStrengthText = () => {
  const tier = strengthTier.value
  const keys = ['weak', 'medium', 'strong', 'veryStrong'] as const
  return t(`tools.password.strength.${keys[tier]}`)
}

const getEstimatedCrackTime = () => {
  const entropy = calculateEntropy()
  const attempts = Math.pow(2, entropy - 1)
  const attemptsPerSecond = 1e9
  const seconds = attempts / attemptsPerSecond
  if (seconds < 60) return t('tools.password.crackTime.lessThanMinute')
  if (seconds < 3600) return t('tools.password.crackTime.minutes', { count: Math.round(seconds / 60) })
  if (seconds < 86400) return t('tools.password.crackTime.hours', { count: Math.round(seconds / 3600) })
  if (seconds < 31536000) return t('tools.password.crackTime.days', { count: Math.round(seconds / 86400) })
  if (seconds < 31536000000) return t('tools.password.crackTime.years', { count: Math.round(seconds / 31536000) })
  return t('tools.password.crackTime.centuries')
}

watch(selectedType, onTypeChange)

onMounted(() => {
  generatePassword()
  addDisableSaveShortcut()
})

onBeforeUnmount(() => {
  removeDisableSaveShortcut()
})
</script>

<style scoped>
.pw-list-enter-active {
  transition:
    opacity var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-out);
}
.pw-list-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.pw-list-leave-active {
  transition: opacity var(--dur-fast) var(--ease-out);
}
.pw-list-leave-to {
  opacity: 0;
}
.pw-list-move {
  transition: transform var(--dur-base) var(--ease-out);
}
</style>
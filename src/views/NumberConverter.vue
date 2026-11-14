<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <Binary class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.numberConverter.name') }}</span>
        </div>
        <div class="h-4 w-px bg-border flex-shrink-0"></div>
        <button @click="reset" class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground">
          {{ $t('common.clear') }}
        </button>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="showHelp = !showHelp" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <HelpCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto p-4">
      <div class="max-w-2xl mx-auto space-y-6">
        <!-- Decimal -->
        <CustomInput
          v-model="decimal"
          :label="$t('tools.numberConverter.decimal') + ' (10)'"
          placeholder="0"
          @update:model-value="updateFromDecimal"
        >
          <template #suffix>
            <button @click="copy(decimal)" class="p-1 hover:bg-muted rounded-md transition-colors">
              <Copy class="w-3.5 h-3.5" />
            </button>
          </template>
        </CustomInput>

        <!-- Hexadecimal -->
        <CustomInput
          v-model="hex"
          :label="$t('tools.numberConverter.hex') + ' (16)'"
          placeholder="0"
          class="uppercase"
          @update:model-value="updateFromHex"
        >
          <template #suffix>
            <button @click="copy(hex)" class="p-1 hover:bg-muted rounded-md transition-colors">
              <Copy class="w-3.5 h-3.5" />
            </button>
          </template>
        </CustomInput>

        <!-- Binary -->
        <CustomInput
          v-model="binary"
          :label="$t('tools.numberConverter.binary') + ' (2)'"
          placeholder="0"
          @update:model-value="updateFromBinary"
        >
          <template #suffix>
            <button @click="copy(binary)" class="p-1 hover:bg-muted rounded-md transition-colors">
              <Copy class="w-3.5 h-3.5" />
            </button>
          </template>
        </CustomInput>

        <!-- Octal -->
        <CustomInput
          v-model="octal"
          :label="$t('tools.numberConverter.octal') + ' (8)'"
          placeholder="0"
          @update:model-value="updateFromOctal"
        >
          <template #suffix>
            <button @click="copy(octal)" class="p-1 hover:bg-muted rounded-md transition-colors">
              <Copy class="w-3.5 h-3.5" />
            </button>
          </template>
        </CustomInput>

        <p v-if="invalid" class="text-xs text-destructive">{{ $t('tools.numberConverter.invalidInput') }}</p>

        <!-- Two's complement -->
        <div class="pt-2 border-t border-border space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{{ $t('tools.numberConverter.twosComplement') }}</span>
            <CustomSelect v-model="bitWidth" :options="bitWidthOptions" />
          </div>
          <template v-if="twos">
            <p v-if="twos.overflow" class="text-xs text-destructive">{{ $t('tools.numberConverter.overflow') }}</p>
            <CustomInput :model-value="twos.hex" label="HEX" readonly>
              <template #suffix>
                <button @click="copy(twos.hex)" class="p-1 hover:bg-muted rounded-md transition-colors">
                  <Copy class="w-3.5 h-3.5" />
                </button>
              </template>
            </CustomInput>
            <CustomInput :model-value="twos.binary" label="BIN" readonly>
              <template #suffix>
                <button @click="copy(twos.binary)" class="p-1 hover:bg-muted rounded-md transition-colors">
                  <Copy class="w-3.5 h-3.5" />
                </button>
              </template>
            </CustomInput>
          </template>
        </div>
      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.numberConverter.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.numberConverter.description') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Binary, Copy, HelpCircle, X } from 'lucide-vue-next';
import CustomInput from '../components/CustomInput.vue';
import CustomSelect from '../components/CustomSelect.vue';
import { parseRadix, formatRadix, toTwosComplement, fitsInBits, type Radix, type BitWidth } from '../utils/radix';
import { copyText } from '../utils/clipboard';

const decimal = ref('');
const hex = ref('');
const binary = ref('');
const octal = ref('');
const showHelp = ref(false);
// 非法输入提示（如 "12abc"、小数）
const invalid = ref<Radix | null>(null);
// 补码位宽
const bitWidth = ref<BitWidth>(32);
const bitWidthOptions = [
  { label: '8-bit', value: 8 },
  { label: '16-bit', value: 16 },
  { label: '32-bit', value: 32 },
  { label: '64-bit', value: 64 }
];
// 当前解析出的数值（用于补码展示）
const current = ref<bigint | null>(null);

const reset = () => {
  decimal.value = '';
  hex.value = '';
  binary.value = '';
  octal.value = '';
  invalid.value = null;
  current.value = null;
};

/**
 * 以某个进制的输入为准，刷新其余三个输入框。
 * 使用 BigInt，超过 2^53 的数（如 64 位全 1）也不会丢精度。
 */
const update = (source: Radix, text: string) => {
  const value = parseRadix(text, source);
  const targets: Record<Radix, (v: string) => void> = {
    10: (v) => { decimal.value = v; },
    16: (v) => { hex.value = v; },
    2: (v) => { binary.value = v; },
    8: (v) => { octal.value = v; }
  };
  if (value === undefined) {
    // 输入含非法字符：保留用户输入，清空其他框并提示
    invalid.value = source;
    current.value = null;
    (Object.keys(targets).map(Number) as Radix[]).filter(r => r !== source).forEach(r => targets[r](''));
    return;
  }
  invalid.value = null;
  current.value = value;
  if (value === null) {
    (Object.keys(targets).map(Number) as Radix[]).filter(r => r !== source).forEach(r => targets[r](''));
    return;
  }
  (Object.keys(targets).map(Number) as Radix[]).filter(r => r !== source).forEach(r => targets[r](formatRadix(value, r)));
};

const updateFromDecimal = () => update(10, decimal.value);
const updateFromHex = () => update(16, hex.value);
const updateFromBinary = () => update(2, binary.value);
const updateFromOctal = () => update(8, octal.value);

// n 位补码展示：负数显示补码；超出位宽时提示溢出
const twos = computed(() => {
  if (current.value === null) return null;
  const bits = bitWidth.value;
  const overflow = !fitsInBits(current.value, bits);
  const u = toTwosComplement(current.value, bits);
  return {
    overflow,
    hex: u.toString(16).toUpperCase().padStart(bits / 4, '0'),
    binary: u.toString(2).padStart(bits, '0')
  };
});

const copy = (text: string) => {
  if (text) void copyText(text);
};
</script>

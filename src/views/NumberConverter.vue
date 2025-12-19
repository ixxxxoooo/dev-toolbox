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
import { ref } from 'vue';
import { Binary, Copy, HelpCircle, X } from 'lucide-vue-next';
import CustomInput from '../components/CustomInput.vue';

const decimal = ref('');
const hex = ref('');
const binary = ref('');
const octal = ref('');
const showHelp = ref(false);

const reset = () => {
  decimal.value = '';
  hex.value = '';
  binary.value = '';
  octal.value = '';
};

const updateFromDecimal = () => {
  const val = parseInt(decimal.value, 10);
  if (isNaN(val)) {
    hex.value = '';
    binary.value = '';
    octal.value = '';
    return;
  }
  hex.value = val.toString(16).toUpperCase();
  binary.value = val.toString(2);
  octal.value = val.toString(8);
};

const updateFromHex = () => {
  const val = parseInt(hex.value, 16);
  if (isNaN(val)) {
    decimal.value = '';
    binary.value = '';
    octal.value = '';
    return;
  }
  decimal.value = val.toString(10);
  binary.value = val.toString(2);
  octal.value = val.toString(8);
};

const updateFromBinary = () => {
  const val = parseInt(binary.value, 2);
  if (isNaN(val)) {
    decimal.value = '';
    hex.value = '';
    octal.value = '';
    return;
  }
  decimal.value = val.toString(10);
  hex.value = val.toString(16).toUpperCase();
  octal.value = val.toString(8);
};

const updateFromOctal = () => {
  const val = parseInt(octal.value, 8);
  if (isNaN(val)) {
    decimal.value = '';
    hex.value = '';
    binary.value = '';
    return;
  }
  decimal.value = val.toString(10);
  hex.value = val.toString(16).toUpperCase();
  binary.value = val.toString(2);
};

const copy = (text: string) => {
  if (text) navigator.clipboard.writeText(text);
};
</script>

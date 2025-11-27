<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 backdrop-blur-sm">
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
        <div class="space-y-2">
          <label class="text-sm font-medium text-muted-foreground">{{ $t('tools.numberConverter.decimal') }} (10)</label>
          <div class="relative">
            <input
              v-model="decimal"
              type="text"
              @input="updateFromDecimal"
              class="w-full bg-card border border-border rounded-lg px-4 py-2 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="0"
            />
            <button @click="copy(decimal)" class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
              <Copy class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Hexadecimal -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-muted-foreground">{{ $t('tools.numberConverter.hex') }} (16)</label>
          <div class="relative">
            <input
              v-model="hex"
              type="text"
              @input="updateFromHex"
              class="w-full bg-card border border-border rounded-lg px-4 py-2 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all uppercase"
              placeholder="0"
            />
            <button @click="copy(hex)" class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
              <Copy class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Binary -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-muted-foreground">{{ $t('tools.numberConverter.binary') }} (2)</label>
          <div class="relative">
            <input
              v-model="binary"
              type="text"
              @input="updateFromBinary"
              class="w-full bg-card border border-border rounded-lg px-4 py-2 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="0"
            />
            <button @click="copy(binary)" class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
              <Copy class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Octal -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-muted-foreground">{{ $t('tools.numberConverter.octal') }} (8)</label>
          <div class="relative">
            <input
              v-model="octal"
              type="text"
              @input="updateFromOctal"
              class="w-full bg-card border border-border rounded-lg px-4 py-2 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="0"
            />
            <button @click="copy(octal)" class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
              <Copy class="w-4 h-4" />
            </button>
          </div>
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
import { ref } from 'vue';
import { Binary, Copy, HelpCircle, X } from 'lucide-vue-next';

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

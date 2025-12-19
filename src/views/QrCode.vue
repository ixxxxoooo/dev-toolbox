<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <QrCode class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.qrCode.name') }}</span>
        </div>
        <div class="h-4 w-px bg-border flex-shrink-0"></div>
        <button @click="download" :disabled="!qrDataUrl" class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50">
          {{ $t('common.download') }}
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
      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Input -->
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-muted-foreground">{{ $t('common.labels.input') }}</label>
            <textarea
              v-model="text"
              class="w-full h-32 bg-card border border-border rounded-lg px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
              :placeholder="$t('tools.qrCode.placeholder')"
            ></textarea>
          </div>

          <!-- Options -->
          <div class="bg-card border border-border rounded-lg p-4 space-y-4">
            <h3 class="font-medium text-sm text-muted-foreground">{{ $t('tools.qrCode.options') }}</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs text-muted-foreground">Error Correction</label>
                <CustomSelect
                  v-model="errorCorrectionLevel"
                  :options="ecOptions"
                  class="w-full"
                />
              </div>
              <div class="space-y-1">
                <label class="text-xs text-muted-foreground">Size (px)</label>
                <input type="number" v-model.number="width" class="w-full bg-muted/50 border border-border rounded px-2 py-1 text-sm" min="100" max="1000" step="10">
              </div>
              <div class="space-y-1">
                <label class="text-xs text-muted-foreground">Margin</label>
                <input type="number" v-model.number="margin" class="w-full bg-muted/50 border border-border rounded px-2 py-1 text-sm" min="0" max="10">
              </div>
              <div class="space-y-1">
                 <label class="text-xs text-muted-foreground">Color</label>
                 <div class="flex space-x-2">
                   <input type="color" v-model="color.dark" class="h-8 w-full cursor-pointer rounded" title="Dark Color">
                   <input type="color" v-model="color.light" class="h-8 w-full cursor-pointer rounded" title="Light Color">
                 </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div class="flex flex-col items-center justify-center bg-card border border-border rounded-lg p-8 min-h-[300px]">
          <div v-if="qrDataUrl" class="relative group">
            <img :src="qrDataUrl" alt="QR Code" class="max-w-full h-auto shadow-lg rounded-lg bg-white p-2" />
          </div>
          <div v-else class="text-muted-foreground text-sm">
            {{ $t('common.placeholders.enterText') }}
          </div>
        </div>
      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.qrCode.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.qrCode.description') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { QrCode, HelpCircle, X } from 'lucide-vue-next';
import QRCode from 'qrcode';
import CustomSelect from '../components/CustomSelect.vue';

const ecOptions = [
  { label: 'Low (7%)', value: 'L' },
  { label: 'Medium (15%)', value: 'M' },
  { label: 'Quartile (25%)', value: 'Q' },
  { label: 'High (30%)', value: 'H' }
];

const text = ref('https://example.com');
const qrDataUrl = ref('');
const errorCorrectionLevel = ref<'L' | 'M' | 'Q' | 'H'>('M');
const width = ref(300);
const margin = ref(4);
const color = ref({ dark: '#000000', light: '#ffffff' });
const showHelp = ref(false);

const generate = async () => {
  if (!text.value) {
    qrDataUrl.value = '';
    return;
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
    });
  } catch (err) {
    console.error(err);
  }
};

const download = () => {
  if (!qrDataUrl.value) return;
  const a = document.createElement('a');
  a.href = qrDataUrl.value;
  a.download = 'qrcode.png';
  a.click();
};

watch([text, errorCorrectionLevel, width, margin, color], generate, { deep: true });

onMounted(generate);
</script>

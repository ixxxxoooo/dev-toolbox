<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <Monitor class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.userAgent.name') }}</span>
        </div>
        <div class="h-4 w-px bg-border flex-shrink-0"></div>
        <button @click="useMyUa" class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground">
          {{ $t('tools.userAgent.useMyUa') }}
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
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Input -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-muted-foreground">{{ $t('common.labels.input') }}</label>
          <textarea
            v-model="uaString"
            class="w-full h-24 bg-card border border-border rounded-lg px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            :placeholder="$t('tools.userAgent.placeholder')"
          ></textarea>
        </div>

        <!-- Result -->
        <div v-if="parsedUa" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Browser -->
          <div class="bg-card border border-border rounded-lg p-4">
            <div class="flex items-center space-x-2 mb-4">
              <Globe class="w-5 h-5 text-primary" />
              <h3 class="font-medium">{{ $t('tools.userAgent.browser') }}</h3>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between border-b border-border/50 pb-1">
                <span class="text-muted-foreground">Name</span>
                <span class="font-medium">{{ parsedUa.browser.name || '-' }}</span>
              </div>
              <div class="flex justify-between border-b border-border/50 pb-1">
                <span class="text-muted-foreground">Version</span>
                <span class="font-medium">{{ parsedUa.browser.version || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Engine</span>
                <span class="font-medium">{{ parsedUa.engine.name || '-' }} {{ parsedUa.engine.version || '' }}</span>
              </div>
            </div>
          </div>

          <!-- OS -->
          <div class="bg-card border border-border rounded-lg p-4">
            <div class="flex items-center space-x-2 mb-4">
              <Cpu class="w-5 h-5 text-primary" />
              <h3 class="font-medium">{{ $t('tools.userAgent.os') }}</h3>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between border-b border-border/50 pb-1">
                <span class="text-muted-foreground">Name</span>
                <span class="font-medium">{{ parsedUa.os.name || '-' }}</span>
              </div>
              <div class="flex justify-between border-b border-border/50 pb-1">
                <span class="text-muted-foreground">Version</span>
                <span class="font-medium">{{ parsedUa.os.version || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Platform</span>
                <span class="font-medium">{{ parsedUa.cpu.architecture || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Device -->
          <div class="bg-card border border-border rounded-lg p-4">
            <div class="flex items-center space-x-2 mb-4">
              <Smartphone class="w-5 h-5 text-primary" />
              <h3 class="font-medium">{{ $t('tools.userAgent.device') }}</h3>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between border-b border-border/50 pb-1">
                <span class="text-muted-foreground">Vendor</span>
                <span class="font-medium">{{ parsedUa.device.vendor || '-' }}</span>
              </div>
              <div class="flex justify-between border-b border-border/50 pb-1">
                <span class="text-muted-foreground">Model</span>
                <span class="font-medium">{{ parsedUa.device.model || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Type</span>
                <span class="font-medium">{{ parsedUa.device.type || 'Desktop' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.userAgent.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.userAgent.description') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Monitor, HelpCircle, X, Globe, Cpu, Smartphone } from 'lucide-vue-next';
import { UAParser } from 'ua-parser-js';

const uaString = ref('');
const showHelp = ref(false);

const parsedUa = computed(() => {
  if (!uaString.value) return null;
  const parser = new UAParser(uaString.value);
  return parser.getResult();
});

const useMyUa = () => {
  uaString.value = navigator.userAgent;
};

onMounted(() => {
  useMyUa();
});
</script>

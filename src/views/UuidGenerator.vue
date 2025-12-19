<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4 overflow-x-auto no-scrollbar">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <Fingerprint class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.uuid.name') }}</span>
        </div>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center space-x-2 flex-shrink-0 ml-4">
        <button @click="generateUuid" class="px-3 py-1.5 text-xs font-medium rounded-md btn-primary flex items-center space-x-1.5 transition-colors">
          <RefreshCw class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ $t('common.buttons.generateUuid') }}</span>
        </button>
        <button @click="clearUuid" :disabled="!uuid" class="px-3 py-1.5 text-xs font-medium rounded-md btn-destructive transition-colors disabled:opacity-50 flex items-center space-x-1.5">
          <Trash2 class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ $t('common.clear') }}</span>
        </button>
        <div class="h-4 w-px bg-border mx-1"></div>
        <button @click="showHelp = !showHelp" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <HelpCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 container mx-auto px-4 py-8 flex justify-center items-center">
      <div class="w-full max-w-xl space-y-8">
        <div class="bg-card border border-border rounded-xl p-8 shadow-sm text-center">
          <div class="mb-6">
             <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
               <Fingerprint class="w-8 h-8 text-primary" />
             </div>
             <h2 class="text-lg font-medium text-muted-foreground">Generated UUID v4</h2>
          </div>

          <div class="relative group">
            <input
              type="text"
              readonly
              v-model="uuid"
              :placeholder="$t('common.placeholders.clickToGenerate')"
              class="w-full text-center text-2xl font-mono p-6 bg-muted/30 border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-colors cursor-text select-all"
            />
            <div class="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button
                @click="copyUuid"
                :disabled="!uuid"
                class="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                :title="$t('common.copy')"
              >
                <Copy class="w-5 h-5" />
              </button>
            </div>
          </div>

          <p class="mt-4 text-xs text-muted-foreground">
            Click generate to create a new cryptographically strong UUID.
          </p>
        </div>
      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.uuid.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.uuid.description') }}</p>
          <div>
            <p class="font-bold mb-2">{{ $t('tools.uuid.coreFeatures') }}:</p>
            <ul class="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>{{ $t('tools.uuid.uuidv4') }}:</strong> {{ $t('tools.uuid.uuidv4Description') }}</li>
              <li><strong>{{ $t('tools.uuid.format') }}:</strong> {{ $t('tools.uuid.formatDescription') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { HelpCircle, Fingerprint, RefreshCw, Trash2, Copy, X } from 'lucide-vue-next';
import { addDisableSaveShortcut, removeDisableSaveShortcut } from '../utils/keyboardUtils';

const uuid = ref('');
const showHelp = ref(false);

const generateUuid = () => {
  uuid.value = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const copyUuid = () => {
  if (uuid.value) {
    navigator.clipboard.writeText(uuid.value);
  }
};

const clearUuid = () => {
  uuid.value = '';
};

onMounted(() => {
  generateUuid();
  addDisableSaveShortcut();
});

onBeforeUnmount(() => {
  removeDisableSaveShortcut();
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
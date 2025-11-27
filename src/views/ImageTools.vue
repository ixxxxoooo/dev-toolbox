<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <Image class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.imageTools.name') }}</span>
        </div>
        <div class="h-4 w-px bg-border flex-shrink-0"></div>
        <!-- Mode Selection -->
        <div class="flex items-center space-x-1">
          <button
            v-for="m in ['compress', 'crop']"
            :key="m"
            @click="mode = m"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-all border border-transparent"
            :class="mode === m ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
          >
            {{ $t('tools.imageTools.' + m) }}
          </button>
        </div>
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
        <!-- Upload Area -->
        <div
          v-if="!imageSrc"
          class="border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
          @click="triggerUpload"
          @drop.prevent="handleDrop"
          @dragover.prevent
        >
          <UploadCloud class="w-12 h-12 text-muted-foreground mb-4" />
          <p class="text-lg font-medium mb-1">{{ $t('tools.imageTools.dropText') }}</p>
          <p class="text-sm text-muted-foreground">{{ $t('tools.imageTools.supportText') }}</p>
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileSelect" />
        </div>

        <!-- Editor Area -->
        <div v-else class="space-y-6">
          <!-- Toolbar -->
          <div class="flex items-center justify-between bg-card border border-border rounded-lg p-2">
            <button @click="reset" class="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors">
              <Trash2 class="w-4 h-4" />
              <span>{{ $t('common.clear') }}</span>
            </button>

            <div class="flex items-center space-x-2">
              <span class="text-xs text-muted-foreground">{{ originalSize }}</span>
              <ArrowRight class="w-4 h-4 text-muted-foreground" />
              <span class="text-xs font-medium">{{ processedSize || '...' }}</span>
            </div>

            <button @click="download" :disabled="isProcessing" class="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50">
              <Download class="w-4 h-4" />
              <span>{{ $t('common.download') }}</span>
            </button>
          </div>

          <!-- Compressor Options -->
          <div v-if="mode === 'compress'" class="bg-card border border-border rounded-lg p-4 space-y-4">
             <div class="space-y-2">
               <div class="flex justify-between">
                 <label class="text-sm font-medium">{{ $t('tools.imageTools.quality') }}</label>
                 <span class="text-sm text-muted-foreground">{{ Math.round(quality * 100) }}%</span>
               </div>
               <input type="range" v-model.number="quality" min="0.1" max="1" step="0.1" class="w-full accent-primary">
             </div>
             <div class="space-y-2">
               <div class="flex justify-between">
                 <label class="text-sm font-medium">{{ $t('tools.imageTools.maxWidth') }}</label>
                 <span class="text-sm text-muted-foreground">{{ maxWidth }}px</span>
               </div>
               <input type="range" v-model.number="maxWidth" min="100" max="4096" step="100" class="w-full accent-primary">
             </div>
             <button @click="compressImage" :disabled="isProcessing" class="w-full py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-colors">
               {{ isProcessing ? 'Processing...' : $t('tools.imageTools.compress') }}
             </button>
          </div>

          <!-- Cropper Area -->
          <div v-if="mode === 'crop'" class="bg-card border border-border rounded-lg overflow-hidden h-[500px] relative">
             <img ref="cropperImg" :src="imageSrc" class="max-w-full max-h-full block" />
          </div>

          <!-- Preview (Compress Mode) -->
          <div v-if="mode === 'compress' && processedSrc" class="bg-card border border-border rounded-lg p-4 flex justify-center">
            <img :src="processedSrc" class="max-w-full max-h-[500px] object-contain rounded" />
          </div>
        </div>
      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.imageTools.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.imageTools.description') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick } from 'vue';
import { Image, UploadCloud, Trash2, Download, ArrowRight, HelpCircle, X } from 'lucide-vue-next';
import imageCompression from 'browser-image-compression';
import Cropper from 'cropperjs';


const mode = ref('compress');
const imageSrc = ref('');
const processedSrc = ref('');
const originalFile = ref<File | null>(null);
const processedFile = ref<Blob | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const cropperImg = ref<HTMLImageElement | null>(null);
const showHelp = ref(false);
const isProcessing = ref(false);

// Compression Options
const quality = ref(0.8);
const maxWidth = ref(1920);

// Stats
const originalSize = ref('');
const processedSize = ref('');

let cropper: Cropper | null = null;

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const triggerUpload = () => fileInput.value?.click();

const handleFile = (file: File) => {
  if (!file.type.startsWith('image/')) return;
  originalFile.value = file;
  originalSize.value = formatSize(file.size);
  imageSrc.value = URL.createObjectURL(file);
  processedSrc.value = imageSrc.value; // Default to original
  processedSize.value = originalSize.value;

  if (mode.value === 'crop') initCropper();
  else compressImage(); // Auto compress on load
};

const handleFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) handleFile(file);
};

const handleDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files[0];
  if (file) handleFile(file);
};

const reset = () => {
  imageSrc.value = '';
  processedSrc.value = '';
  originalFile.value = null;
  processedFile.value = null;
  originalSize.value = '';
  processedSize.value = '';
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
};

const compressImage = async () => {
  if (!originalFile.value) return;
  isProcessing.value = true;
  try {
    const options = {
      maxSizeMB: 1, // Approximate, controlled by quality mostly in this lib or we can use quality
      maxWidthOrHeight: maxWidth.value,
      useWebWorker: true,
      initialQuality: quality.value,
    };
    const compressedFile = await imageCompression(originalFile.value, options);
    processedFile.value = compressedFile;
    processedSize.value = formatSize(compressedFile.size);
    processedSrc.value = URL.createObjectURL(compressedFile);
  } catch (error) {
    console.error(error);
  } finally {
    isProcessing.value = false;
  }
};

const initCropper = async () => {
  await nextTick();
  if (cropperImg.value) {
    if (cropper) cropper.destroy();
    cropper = new Cropper(cropperImg.value, {
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 1,
      responsive: true,
    } as any);
  }
};

const download = () => {
  if (mode.value === 'crop' && cropper) {
    (cropper as any).getCroppedCanvas().toBlob((blob: Blob | null) => {
      if (blob) {
        saveBlob(blob, 'cropped-image.png');
      }
    });
  } else if (processedFile.value) {
    saveBlob(processedFile.value, 'compressed-image.jpg'); // browser-image-compression outputs jpg/png
  } else if (originalFile.value) {
     saveBlob(originalFile.value, originalFile.value.name);
  }
};

const saveBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

watch(mode, (newMode) => {
  if (newMode === 'crop') {
    initCropper();
  } else {
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
    compressImage();
  }
});

onBeforeUnmount(() => {
  if (cropper) cropper.destroy();
  window.removeEventListener('paste', handlePaste);
});

const handlePaste = (e: ClipboardEvent) => {
  const items = e.clipboardData?.items;
  if (!items) return;

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) {
        handleFile(file);
        break;
      }
    }
  }
};

import { onMounted } from 'vue';

onMounted(() => {
  window.addEventListener('paste', handlePaste);
});
</script>

<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Header -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2 text-primary flex-shrink-0">
          <ImageIcon class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.imageTools.name') }}</span>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="showHelp = !showHelp" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <HelpCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <main class="flex-1 overflow-hidden flex">
      <!-- Sidebar / Tabs -->
      <div v-if="currentSrc" class="w-16 sm:w-20 border-r border-border bg-card flex flex-col items-center py-4 space-y-4 overflow-y-auto">
        <button
          v-for="t in tabs"
          :key="t.id"
          @click="activeTab = t.id"
          class="p-3 rounded-xl transition-all flex flex-col items-center justify-center space-y-1 w-12 h-12 sm:w-16 sm:h-16"
          :class="activeTab === t.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
          :title="$t('tools.imageTools.' + t.id)"
        >
          <component :is="t.icon" class="w-5 h-5 sm:w-6 sm:h-6" />
          <span class="text-[10px] font-medium hidden sm:block">{{ $t('tools.imageTools.' + t.id) }}</span>
        </button>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col overflow-hidden relative">
        <!-- Upload State -->
        <div
          v-if="!currentSrc"
          class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
          @click="triggerUpload"
          @drop.prevent="handleDrop"
          @dragover.prevent
        >
          <div class="border-2 border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer max-w-lg w-full">
            <UploadCloud class="w-16 h-16 text-muted-foreground mb-6" />
            <h3 class="text-xl font-semibold mb-2">{{ $t('tools.imageTools.dropText') }}</h3>
            <p class="text-sm text-muted-foreground">{{ $t('tools.imageTools.supportText') }}</p>
          </div>
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileSelect" />
        </div>

        <!-- Editor State -->
        <div v-else class="flex-1 flex flex-col overflow-hidden">
          <!-- Toolbar -->
          <div class="flex items-center justify-between px-4 py-2 border-b border-border bg-card/30">
            <div class="flex items-center space-x-4 text-xs sm:text-sm">
              <button @click="reset" class="flex items-center space-x-1.5 text-destructive hover:text-destructive/80 transition-colors">
                <Trash2 class="w-4 h-4" />
                <span class="hidden sm:inline">{{ $t('common.clear') }}</span>
              </button>
              <div class="h-4 w-px bg-border"></div>
              <div class="flex items-center space-x-2 text-muted-foreground">
                <span>{{ originalSize }}</span>
                <ArrowRight class="w-3 h-3" />
                <span class="font-medium text-foreground">{{ processedSize || '...' }}</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <button 
                @click="applyChanges" 
                v-if="['crop', 'resize', 'rotate'].includes(activeTab)"
                class="px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5"
              >
                <Check class="w-3.5 h-3.5" />
                <span>{{ $t('common.apply') }}</span>
              </button>
              <button 
                @click="download" 
                :disabled="isProcessing" 
                class="px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Download class="w-3.5 h-3.5" />
                <span>{{ $t('common.download') }}</span>
              </button>
            </div>
          </div>

          <!-- Workspace -->
          <div class="flex-1 overflow-auto p-4 flex items-center justify-center bg-muted/10">
            <!-- Crop Mode -->
            <div v-if="activeTab === 'crop'" class="max-w-full max-h-full shadow-lg rounded-lg overflow-hidden">
               <img ref="cropperImg" :src="currentSrc" class="max-w-full max-h-[calc(100vh-200px)] block" />
            </div>

            <!-- Other Modes Preview -->
            <div v-else class="relative max-w-full max-h-full">
              <img 
                :src="previewSrc || currentSrc" 
                class="object-contain shadow-lg rounded-lg transition-all duration-300" 
                :class="{ 'max-w-full max-h-[calc(100vh-200px)]': activeTab !== 'resize' }"
                :style="imageStyle"
              />
            </div>
          </div>

          <!-- Controls Panel -->
          <div class="border-t border-border bg-card p-4">
            <div class="max-w-3xl mx-auto">
              
              <!-- Compress Controls -->
              <div v-if="activeTab === 'compress'" class="space-y-4">
                <CustomRange
                  v-model="quality"
                  :min="0.1"
                  :max="1"
                  :step="0.05"
                  :label="$t('tools.imageTools.quality')"
                  unit="%"
                  @update:model-value="compressImage"
                >
                  <template #header>
                    <span class="text-xs font-mono font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">{{ Math.round(quality * 100) }}%</span>
                  </template>
                </CustomRange>
                <p class="text-xs text-muted-foreground text-center">{{ $t('tools.imageTools.adjustQuality') }}</p>
              </div>

              <!-- Resize Controls -->
              <div v-if="activeTab === 'resize'" class="flex flex-col items-center gap-4 w-full">
                <div class="flex flex-wrap gap-6 items-end justify-center">
                  <CustomInput
                    v-model="resizeWidth"
                    type="number"
                    :label="$t('tools.imageTools.width') + ' (px)'"
                    class="w-32"
                    @update:model-value="onWidthChange"
                  />
                  <div class="flex items-center pb-2.5 text-muted-foreground" :title="$t('tools.imageTools.maintainAspectRatio')">
                    <div 
                      class="p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                      @click="maintainAspectRatio = !maintainAspectRatio"
                    >
                      <Link2 v-if="maintainAspectRatio" class="w-4 h-4 text-primary" />
                      <Unlink2 v-else class="w-4 h-4 opacity-50" />
                    </div>
                  </div>
                  <CustomInput
                    v-model="resizeHeight"
                    type="number"
                    :label="$t('tools.imageTools.height') + ' (px)'"
                    class="w-32"
                    @update:model-value="onHeightChange"
                  />
                </div>
                
                <div class="w-full max-w-sm">
                  <CustomRange
                    v-model="resizePercentage"
                    :min="1"
                    :max="200"
                    unit="%"
                    show-labels
                  />
                </div>
              </div>

              <!-- Rotate/Flip Controls -->
              <div v-if="activeTab === 'rotate'" class="flex justify-center gap-4">
                <button @click="rotate(-90)" class="p-2 hover:bg-muted rounded-md" :title="$t('tools.imageTools.rotateLeft')">
                  <RotateCcw class="w-6 h-6" />
                </button>
                <button @click="rotate(90)" class="p-2 hover:bg-muted rounded-md" :title="$t('tools.imageTools.rotateRight')">
                  <RotateCw class="w-6 h-6" />
                </button>
                <div class="w-px h-8 bg-border mx-2"></div>
                <button @click="flip('h')" class="p-2 hover:bg-muted rounded-md" :title="$t('tools.imageTools.flipHorizontal')">
                  <FlipHorizontal class="w-6 h-6" />
                </button>
                <button @click="flip('v')" class="p-2 hover:bg-muted rounded-md" :title="$t('tools.imageTools.flipVertical')">
                  <FlipVertical class="w-6 h-6" />
                </button>
              </div>

              <!-- Convert Controls -->
              <div v-if="activeTab === 'convert'" class="flex justify-center gap-4">
                <button 
                  v-for="fmt in ['png', 'jpeg', 'webp']" 
                  :key="fmt"
                  @click="targetFormat = fmt"
                  class="px-4 py-2 rounded-md text-sm font-medium border transition-all uppercase"
                  :class="targetFormat === fmt ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input hover:bg-muted'"
                >
                  {{ fmt }}
                </button>
              </div>

              <!-- Base64 Controls -->
              <div v-if="activeTab === 'base64'" class="space-y-2">
                <div class="relative">
                  <textarea 
                    readonly 
                    :value="base64String" 
                    class="w-full h-24 bg-muted/50 border border-input rounded-md p-2 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  ></textarea>
                  <button 
                    @click="copyBase64" 
                    class="absolute top-2 right-2 p-1.5 bg-background border border-border rounded-md hover:bg-muted transition-colors shadow-sm"
                    title="Copy"
                  >
                    <Copy v-if="!copied" class="w-3.5 h-3.5" />
                    <Check v-else class="w-3.5 h-3.5 text-green-500" />
                  </button>
                </div>
                <p class="text-xs text-muted-foreground text-center">{{ $t('tools.imageTools.base64Help') }}</p>
              </div>

              <!-- Crop Info -->
              <div v-if="activeTab === 'crop'" class="text-center">
                <p class="text-xs text-muted-foreground">{{ $t('tools.imageTools.dragToCrop') }}</p>
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
          <h3 class="text-lg font-bold">{{ $t('tools.imageTools.helpTitle') }}</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.imageTools.helpContent.intro') }}</p>
          <ul class="list-disc pl-5 space-y-1 text-muted-foreground">
            <li><strong>{{ $t('tools.imageTools.compress') }}:</strong> {{ $t('tools.imageTools.helpContent.compress') }}</li>
            <li><strong>{{ $t('tools.imageTools.crop') }}:</strong> {{ $t('tools.imageTools.helpContent.crop') }}</li>
            <li><strong>{{ $t('tools.imageTools.resize') }}:</strong> {{ $t('tools.imageTools.helpContent.resize') }}</li>
            <li><strong>{{ $t('tools.imageTools.rotate') }}:</strong> {{ $t('tools.imageTools.helpContent.rotate') }}</li>
            <li><strong>{{ $t('tools.imageTools.convert') }}:</strong> {{ $t('tools.imageTools.helpContent.convert') }}</li>
            <li><strong>{{ $t('tools.imageTools.base64') }}:</strong> {{ $t('tools.imageTools.helpContent.base64') }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { 
  Image as ImageIcon, UploadCloud, Trash2, Download, ArrowRight, HelpCircle, X, 
  Crop, Minimize2, RefreshCw, FileType, Code, Check, 
  RotateCcw, RotateCw, FlipHorizontal, FlipVertical, Link2, Unlink2, Copy
} from 'lucide-vue-next';
import imageCompression from 'browser-image-compression';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import CustomRange from '../components/CustomRange.vue';
import CustomInput from '../components/CustomInput.vue';

const tabs = [
  { id: 'compress', label: 'Compress', icon: Minimize2 },
  { id: 'crop', label: 'Crop', icon: Crop },
  { id: 'resize', label: 'Resize', icon: Minimize2 }, // Reusing icon, could be Move or Maximize
  { id: 'rotate', label: 'Rotate', icon: RefreshCw },
  { id: 'convert', label: 'Convert', icon: FileType },
  { id: 'base64', label: 'Base64', icon: Code },
];

const activeTab = ref('compress');
const showHelp = ref(false);
const isProcessing = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// Image State
const originalFile = ref<File | null>(null);
const currentSrc = ref(''); // The source for the editor (changes after apply)
const previewSrc = ref(''); // Preview for non-destructive edits (like compress)
const processedBlob = ref<Blob | null>(null); // The final blob to download

// Stats
const originalSize = ref('');
const processedSize = ref('');

// --- Tool Specific State ---

// Compress
const quality = ref(0.8);

// Crop
const cropperImg = ref<HTMLImageElement | null>(null);
let cropper: Cropper | null = null;

// Resize
const resizeWidth = ref(0);
const resizeHeight = ref(0);
const resizePercentage = ref(100);
const originalWidth = ref(0);
const originalHeight = ref(0);
const maintainAspectRatio = ref(true);
const aspectRatio = ref(1);

// Rotate/Flip
const rotation = ref(0);
const scaleX = ref(1);
const scaleY = ref(1);

// Convert
const targetFormat = ref('jpeg');

// Base64
const base64String = ref('');
const copied = ref(false);

// --- Computed & Helpers ---

const imageStyle = computed(() => {
  if (activeTab.value === 'rotate') {
    return {
      transform: `rotate(${rotation.value}deg) scale(${scaleX.value}, ${scaleY.value})`
    };
  }
  if (activeTab.value === 'resize') {
    return {
      width: `${resizeWidth.value}px`,
      height: `${resizeHeight.value}px`
    };
  }
  return {};
});

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// --- Core Actions ---

const triggerUpload = () => fileInput.value?.click();

const handleFile = async (file: File) => {
  if (!file.type.startsWith('image/')) return;
  reset();
  originalFile.value = file;
  originalSize.value = formatSize(file.size);
  
  const src = URL.createObjectURL(file);
  currentSrc.value = src;
  
  // Initialize dimensions
  const img = new Image();
  img.src = src;
  await img.decode();
  resizeWidth.value = img.naturalWidth;
  resizeHeight.value = img.naturalHeight;
  originalWidth.value = img.naturalWidth;
  originalHeight.value = img.naturalHeight;
  resizePercentage.value = 100;
  aspectRatio.value = img.naturalWidth / img.naturalHeight;
  
  // Initial compression/processing
  await compressImage();
  updateBase64();
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
  if (currentSrc.value) URL.revokeObjectURL(currentSrc.value);
  if (previewSrc.value) URL.revokeObjectURL(previewSrc.value);
  
  originalFile.value = null;
  currentSrc.value = '';
  previewSrc.value = '';
  processedBlob.value = null;
  originalSize.value = '';
  processedSize.value = '';
  
  rotation.value = 0;
  scaleX.value = 1;
  scaleY.value = 1;
  
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
};

// --- Feature Implementations ---

// Compress
const compressImage = async () => {
  if (!originalFile.value && !processedBlob.value) return;
  
  isProcessing.value = true;
  try {
    // If we have a processed blob (from other tools), use that as source, otherwise original
    let sourceFile = processedBlob.value instanceof File ? processedBlob.value : originalFile.value;
    
    // If processedBlob is a Blob but not a File (e.g. from canvas), convert it
    if (processedBlob.value && !(processedBlob.value instanceof File)) {
       const ext = processedBlob.value.type.split('/')[1] || 'png';
       sourceFile = new File([processedBlob.value], `image.${ext}`, { type: processedBlob.value.type });
    }

    if (!sourceFile) return; 

    const options = {
      maxSizeMB: 1, 
      useWebWorker: true,
      initialQuality: quality.value,
      // We don't limit width/height here unless resizing
    };
    
    const compressed = await imageCompression(sourceFile, options);
    processedBlob.value = compressed;
    processedSize.value = formatSize(compressed.size);
    
    if (previewSrc.value) URL.revokeObjectURL(previewSrc.value);
    previewSrc.value = URL.createObjectURL(compressed);
    
  } catch (error) {
    console.error("Compression error:", error);
  } finally {
    isProcessing.value = false;
  }
};

// Crop
const initCropper = async () => {
  await nextTick();
  if (cropperImg.value) {
    if (cropper) cropper.destroy();
    cropper = new Cropper(cropperImg.value, {
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 0.8,
      responsive: true,
      background: false,
    } as any);
  }
};

// Resize
const onWidthChange = () => {
  if (maintainAspectRatio.value) {
    resizeHeight.value = Math.round(resizeWidth.value / aspectRatio.value);
  }
  // Update percentage
  if (originalWidth.value > 0) {
    resizePercentage.value = Math.round((resizeWidth.value / originalWidth.value) * 100);
  }
};

const onHeightChange = () => {
  if (maintainAspectRatio.value) {
    resizeWidth.value = Math.round(resizeHeight.value * aspectRatio.value);
  }
  // Update percentage
  if (originalHeight.value > 0) {
    resizePercentage.value = Math.round((resizeHeight.value / originalHeight.value) * 100);
  }
};

watch(resizePercentage, (newVal) => {
  if (originalWidth.value > 0 && originalHeight.value > 0) {
     const w = Math.round(originalWidth.value * (newVal / 100));
     const h = Math.round(originalHeight.value * (newVal / 100));
     
     // Avoid infinite loop if values are close
     if (Math.abs(w - resizeWidth.value) > 1) resizeWidth.value = w;
     if (Math.abs(h - resizeHeight.value) > 1) resizeHeight.value = h;
  }
});

// Rotate/Flip
const rotate = (deg: number) => {
  rotation.value = (rotation.value + deg) % 360;
};

const flip = (dir: 'h' | 'v') => {
  if (dir === 'h') scaleX.value *= -1;
  else scaleY.value *= -1;
};

// Base64
const updateBase64 = async () => {
  if (!processedBlob.value && !originalFile.value) return;
  const blob = processedBlob.value || originalFile.value;
  if (!blob) return;
  
  const reader = new FileReader();
  reader.onloadend = () => {
    base64String.value = reader.result as string;
  };
  reader.readAsDataURL(blob);
};

const copyBase64 = () => {
  navigator.clipboard.writeText(base64String.value);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
};

// Apply Changes (Destructive updates to currentSrc)
const applyChanges = async () => {
  isProcessing.value = true;
  
  try {
    let canvas: HTMLCanvasElement | null = null;
    
    if (activeTab.value === 'crop' && cropper) {
      canvas = (cropper as any).getCroppedCanvas();
    } else {
      // Create canvas from current image
      const img = new Image();
      img.src = currentSrc.value;
      await img.decode();
      
      canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No context');

      if (activeTab.value === 'resize') {
        canvas.width = resizeWidth.value;
        canvas.height = resizeHeight.value;
        ctx.drawImage(img, 0, 0, resizeWidth.value, resizeHeight.value);
      } else if (activeTab.value === 'rotate') {
        // Complex rotation logic to handle canvas resizing
        const rad = (rotation.value * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rad));
        const cos = Math.abs(Math.cos(rad));
        const w = img.width;
        const h = img.height;
        
        canvas.width = w * cos + h * sin;
        canvas.height = w * sin + h * cos;
        
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rad);
        ctx.scale(scaleX.value, scaleY.value);
        ctx.drawImage(img, -w / 2, -h / 2);
        
        // Reset transform state
        rotation.value = 0;
        scaleX.value = 1;
        scaleY.value = 1;
      }
    }

    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          currentSrc.value = url; // Update source
          processedBlob.value = blob; // Update output
          processedSize.value = formatSize(blob.size);
          
          // Update dimensions
          resizeWidth.value = canvas!.width;
          resizeHeight.value = canvas!.height;
          originalWidth.value = canvas!.width; // Update original dimensions for subsequent resizes
          originalHeight.value = canvas!.height;
          resizePercentage.value = 100;
          aspectRatio.value = canvas!.width / canvas!.height;
          
          updateBase64();
        }
      }, 'image/png'); // Default intermediate format
    }
  } catch (e) {
    console.error(e);
  } finally {
    isProcessing.value = false;
  }
};

// Download / Convert
const download = async () => {
  let blobToSave = processedBlob.value || originalFile.value;
  if (!blobToSave) return;

  // If convert tab is active or we need to convert format
  if (activeTab.value === 'convert') {
    // Convert blob to target format
    const img = new Image();
    img.src = URL.createObjectURL(blobToSave);
    await img.decode();
    
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0);
    
    const mimeType = `image/${targetFormat.value}`;
    const newBlob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, mimeType, 0.9));
    
    if (newBlob) {
      blobToSave = newBlob;
      saveBlob(blobToSave, `converted.${targetFormat.value}`);
    }
  } else {
    // Save as is (usually png or original)
    const ext = blobToSave.type.split('/')[1] || 'png';
    saveBlob(blobToSave, `processed.${ext}`);
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

// --- Watchers & Lifecycle ---

watch(activeTab, (newTab) => {
  if (newTab === 'crop') {
    initCropper();
  } else {
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
  }
  
  if (newTab === 'base64') {
    updateBase64();
  }
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

onMounted(() => {
  window.addEventListener('paste', handlePaste);
});

onBeforeUnmount(() => {
  if (cropper) cropper.destroy();
  window.removeEventListener('paste', handlePaste);
  if (currentSrc.value) URL.revokeObjectURL(currentSrc.value);
  if (previewSrc.value) URL.revokeObjectURL(previewSrc.value);
});
</script>

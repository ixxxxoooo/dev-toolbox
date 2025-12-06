<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2 text-primary flex-shrink-0">
          <Eraser class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.watermark.name') }}</span>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="showHelp = !showHelp" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <HelpCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <main class="flex-1 overflow-hidden flex flex-col">
      <!-- Top Level Tabs (Function) -->
      <div class="flex border-b border-border bg-muted/20">
        <button
          v-for="func in ['remove', 'add']"
          :key="func"
          @click="activeFunction = func"
          class="flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center space-x-2"
          :class="activeFunction === func ? 'border-primary text-primary bg-background' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'"
        >
          <component :is="func === 'remove' ? Eraser : Plus" class="w-4 h-4" />
          <span>{{ $t('tools.watermark.' + func) }}</span>
        </button>
      </div>

      <!-- Sub Tabs (Media Type) -->
      <div class="flex border-b border-border px-4 pt-2 space-x-4">
        <button
          v-for="tab in ['image', 'video']"
          :key="tab"
          @click="activeTab = tab"
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2"
          :class="activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'"
        >
          <component :is="tab === 'image' ? Image : Video" class="w-4 h-4" />
          <span>{{ $t('tools.watermark.' + (tab === 'image' ? 'imageType' : 'video')) }}</span>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-auto p-4">

        <!-- Image Tool -->
        <div v-if="activeTab === 'image'" class="h-full flex flex-col max-w-5xl mx-auto">
          <div v-if="!imageSrc" class="flex-1 flex flex-col items-center justify-center">
            <div
              class="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-12 hover:bg-muted/50 transition-colors cursor-pointer w-full"
              @click="triggerImageUpload"
            >
              <UploadCloud class="w-16 h-16 text-muted-foreground mb-6" />
              <h3 class="text-xl font-semibold mb-2">{{ $t('tools.watermark.dropImage') }}</h3>
              <p class="text-sm text-muted-foreground">{{ $t('tools.watermark.supportImage') }}</p>
            </div>
            <input type="file" ref="imageInput" class="hidden" accept="image/*" @change="handleImageSelect" />
          </div>

          <div v-else class="flex-1 flex flex-col space-y-4">
            <!-- Toolbar -->
            <div class="flex flex-col space-y-2 bg-card border border-border rounded-lg p-3">
              <div class="flex items-center justify-between border-b border-border pb-2 mb-2">
                <div class="flex items-center space-x-2">
                   <h3 class="text-sm font-semibold">{{ activeFunction === 'remove' ? $t('tools.watermark.removeMode') : $t('tools.watermark.addMode') }}</h3>
                </div>
                <button @click="resetImage" class="flex items-center space-x-1.5 text-destructive hover:text-destructive/80 transition-colors text-sm">
                  <Trash2 class="w-4 h-4" />
                  <span>{{ $t('common.clear') }}</span>
                </button>
              </div>

              <!-- Remove Mode Controls -->
              <div v-if="activeFunction === 'remove'" class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-2">
                    <label class="text-sm font-medium">{{ $t('tools.watermark.brushSize') }}</label>
                    <input type="range" v-model.number="brushSize" min="5" max="50" class="w-32 accent-primary">
                    <span class="text-xs text-muted-foreground">{{ brushSize }}px</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="removeWatermarkImage"
                    :disabled="isProcessing"
                    class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Wand2 class="w-4 h-4" />
                    <span>{{ isProcessing ? $t('common.processing') : $t('tools.watermark.remove') }}</span>
                  </button>
                  <button
                    v-if="processedImageSrc"
                    @click="downloadImage"
                    class="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium rounded-md transition-colors flex items-center space-x-2"
                  >
                    <Download class="w-4 h-4" />
                    <span>{{ $t('common.download') }}</span>
                  </button>
                </div>
              </div>

              <!-- Add Mode Controls -->
              <div v-if="activeFunction === 'add'" class="flex flex-wrap gap-4 items-end">
                <div class="flex flex-col space-y-1">
                  <label class="text-xs font-medium">{{ $t('tools.watermark.content') }}</label>
                  <input type="text" v-model="watermarkText" class="px-2 py-1 border border-border rounded-md text-sm bg-background w-40" placeholder="Text">
                </div>
                <div class="flex flex-col space-y-1">
                  <label class="text-xs font-medium">{{ $t('tools.watermark.color') }}</label>
                  <input type="color" v-model="watermarkColor" class="h-8 w-12 p-0 border border-border rounded-md cursor-pointer">
                </div>
                <div class="flex flex-col space-y-1">
                  <label class="text-xs font-medium">{{ $t('tools.watermark.size') }}</label>
                  <input type="number" v-model.number="watermarkSize" class="px-2 py-1 border border-border rounded-md text-sm bg-background w-16" min="10" max="200">
                </div>
                <div class="flex flex-col space-y-1">
                  <label class="text-xs font-medium">{{ $t('tools.watermark.opacity') }}</label>
                  <input type="range" v-model.number="watermarkOpacity" min="0.1" max="1" step="0.1" class="w-24 accent-primary">
                </div>
                <!-- Position controls removed as they are now draggable, but kept for fine-tuning if needed. Let's keep them read-only or editable. -->
                <div class="flex flex-col space-y-1">
                  <label class="text-xs font-medium">X</label>
                  <input type="number" v-model.number="watermarkX" class="px-2 py-1 border border-border rounded-md text-sm bg-background w-16">
                </div>
                <div class="flex flex-col space-y-1">
                  <label class="text-xs font-medium">Y</label>
                  <input type="number" v-model.number="watermarkY" class="px-2 py-1 border border-border rounded-md text-sm bg-background w-16">
                </div>

                <div class="flex items-center space-x-2 pb-1">
                  <button
                    @click="addWatermarkImage"
                    class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-colors flex items-center space-x-2"
                  >
                    <Plus class="w-4 h-4" />
                    <span>{{ $t('tools.watermark.add') }}</span>
                  </button>
                  <button
                    v-if="processedImageSrc"
                    @click="downloadImage"
                    class="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium rounded-md transition-colors flex items-center space-x-2"
                  >
                    <Download class="w-4 h-4" />
                    <span>{{ $t('common.download') }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Canvas Area -->
            <div class="flex-1 bg-muted/10 rounded-lg overflow-hidden relative flex items-center justify-center border border-border">
              <div class="relative shadow-lg" ref="canvasContainer">
                <canvas
                  ref="imageCanvas"
                  class="max-w-full max-h-[calc(100vh-300px)]"
                  :class="activeFunction === 'remove' ? 'cursor-crosshair' : (isHoveringWatermark ? 'cursor-move' : 'cursor-default')"
                ></canvas>
              </div>
            </div>
            <p class="text-center text-sm text-muted-foreground">
              {{ activeFunction === 'remove' ? $t('tools.watermark.paintInstruction') : 'Drag the text to position it.' }}
            </p>
          </div>
        </div>

        <!-- Video Tool -->
        <div v-if="activeTab === 'video'" class="h-full flex flex-col max-w-5xl mx-auto">
          <div v-if="!videoSrc" class="flex-1 flex flex-col items-center justify-center">
             <div
              class="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-12 hover:bg-muted/50 transition-colors cursor-pointer w-full"
              @click="triggerVideoUpload"
            >
              <UploadCloud class="w-16 h-16 text-muted-foreground mb-6" />
              <h3 class="text-xl font-semibold mb-2">{{ $t('tools.watermark.dropVideo') }}</h3>
              <p class="text-sm text-muted-foreground">{{ $t('tools.watermark.supportVideo') }}</p>
            </div>
            <input type="file" ref="videoInput" class="hidden" accept="video/*" @change="handleVideoSelect" />
          </div>

          <div v-else class="flex-1 flex flex-col space-y-4">
             <!-- Toolbar -->
            <div class="flex flex-col space-y-2 bg-card border border-border rounded-lg p-3">
              <div class="flex items-center justify-between border-b border-border pb-2 mb-2">
                <div class="flex items-center space-x-2">
                   <h3 class="text-sm font-semibold">{{ activeFunction === 'remove' ? $t('tools.watermark.removeMode') : $t('tools.watermark.addMode') }}</h3>
                </div>
                <button @click="resetVideo" class="flex items-center space-x-1.5 text-destructive hover:text-destructive/80 transition-colors text-sm">
                  <Trash2 class="w-4 h-4" />
                  <span>{{ $t('common.clear') }}</span>
                </button>
              </div>

              <!-- Remove Mode Controls -->
              <div v-if="activeFunction === 'remove'" class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                   <span v-if="videoProgress > 0" class="text-xs text-muted-foreground mr-2">
                    {{ Math.round(videoProgress * 100) }}%
                  </span>
                  <button
                    @click="removeWatermarkVideo"
                    :disabled="isProcessing || !videoFile"
                    class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Wand2 class="w-4 h-4" />
                    <span>{{ isProcessing ? $t('common.processing') : $t('tools.watermark.remove') }}</span>
                  </button>
                  <button
                    v-if="processedVideoSrc"
                    @click="downloadVideo"
                    class="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium rounded-md transition-colors flex items-center space-x-2"
                  >
                    <Download class="w-4 h-4" />
                    <span>{{ $t('common.download') }}</span>
                  </button>
                </div>
              </div>

              <!-- Add Mode Controls -->
              <div v-if="activeFunction === 'add'" class="flex flex-wrap gap-4 items-end">
                <div class="flex flex-col space-y-1">
                  <label class="text-xs font-medium">{{ $t('tools.watermark.content') }}</label>
                  <input type="text" v-model="watermarkText" class="px-2 py-1 border border-border rounded-md text-sm bg-background w-40" placeholder="Text">
                </div>
                <div class="flex flex-col space-y-1">
                  <label class="text-xs font-medium">{{ $t('tools.watermark.color') }}</label>
                  <input type="color" v-model="watermarkColor" class="h-8 w-12 p-0 border border-border rounded-md cursor-pointer">
                </div>
                <div class="flex flex-col space-y-1">
                  <label class="text-xs font-medium">{{ $t('tools.watermark.size') }}</label>
                  <input type="number" v-model.number="watermarkSize" class="px-2 py-1 border border-border rounded-md text-sm bg-background w-16" min="10" max="200">
                </div>
                <div class="flex flex-col space-y-1">
                  <label class="text-xs font-medium">{{ $t('tools.watermark.opacity') }}</label>
                  <input type="range" v-model.number="watermarkOpacity" min="0.1" max="1" step="0.1" class="w-24 accent-primary">
                </div>
                <div class="flex flex-col space-y-1">
                  <label class="text-xs font-medium">X</label>
                  <input type="number" v-model.number="watermarkX" class="px-2 py-1 border border-border rounded-md text-sm bg-background w-16">
                </div>
                <div class="flex flex-col space-y-1">
                  <label class="text-xs font-medium">Y</label>
                  <input type="number" v-model.number="watermarkY" class="px-2 py-1 border border-border rounded-md text-sm bg-background w-16">
                </div>
                <div class="flex items-center space-x-2 pb-1">
                  <button
                    @click="addWatermarkVideo"
                    :disabled="isProcessing || !videoFile"
                    class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Plus class="w-4 h-4" />
                    <span>{{ isProcessing ? $t('common.processing') : $t('tools.watermark.add') }}</span>
                  </button>
                  <button
                    v-if="processedVideoSrc"
                    @click="downloadVideo"
                    class="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium rounded-md transition-colors flex items-center space-x-2"
                  >
                    <Download class="w-4 h-4" />
                    <span>{{ $t('common.download') }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Video Area -->
            <div class="flex-1 bg-muted/10 rounded-lg overflow-hidden relative flex items-center justify-center border border-border">
               <div class="relative" ref="videoContainer">
                 <video
                   ref="videoPlayer"
                   :src="videoSrc"
                   controls
                   class="max-w-full max-h-[calc(100vh-300px)]"
                   @loadedmetadata="onVideoLoaded"
                 ></video>

                 <!-- Selection Box (Remove Mode) -->
                 <div
                   v-if="activeFunction === 'remove' && !isProcessing && !processedVideoSrc"
                   class="absolute border-2 border-red-500 bg-red-500/20 cursor-move"
                   :style="{
                     left: selection.x + 'px',
                     top: selection.y + 'px',
                     width: selection.w + 'px',
                     height: selection.h + 'px'
                   }"
                   @mousedown="startDrag"
                 >
                   <div class="absolute bottom-0 right-0 w-4 h-4 bg-red-500 cursor-se-resize" @mousedown.stop="startResize"></div>
                 </div>

                 <!-- Watermark Overlay (Add Mode) -->
                 <div
                    v-if="activeFunction === 'add' && !isProcessing && !processedVideoSrc"
                    class="absolute cursor-move select-none whitespace-nowrap"
                    :style="{
                      left: watermarkX + 'px',
                      top: watermarkY + 'px',
                      color: watermarkColor,
                      fontSize: watermarkSize + 'px',
                      opacity: watermarkOpacity,
                      fontFamily: 'Arial',
                      lineHeight: 1
                    }"
                    @mousedown="startDragWatermarkVideo"
                 >
                   {{ watermarkText }}
                 </div>
               </div>
            </div>
            <p class="text-center text-sm text-muted-foreground">
              {{ activeFunction === 'remove' ? $t('tools.watermark.videoInstruction') : 'Drag the text to position it.' }}
            </p>
          </div>
        </div>

      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.watermark.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.watermark.help') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { Eraser, Image, Video, UploadCloud, Trash2, Wand2, Download, HelpCircle, X, Plus } from 'lucide-vue-next';
import cv from '@techstark/opencv-js';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const activeFunction = ref('remove'); // 'remove' | 'add'
const activeTab = ref('image'); // 'image' | 'video'
const showHelp = ref(false);
const isProcessing = ref(false);

// --- Image State ---
const imageSrc = ref('');
const processedImageSrc = ref('');
const imageInput = ref<HTMLInputElement | null>(null);
const imageCanvas = ref<HTMLCanvasElement | null>(null);
const brushSize = ref(20);
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let maskCanvas: HTMLCanvasElement | null = null;
let originalImage: HTMLImageElement | null = null;

// Add Watermark State
const watermarkText = ref('Watermark');
const watermarkColor = ref('#ff0000');
const watermarkSize = ref(40);
const watermarkOpacity = ref(0.5);
const watermarkX = ref(50);
const watermarkY = ref(50);
const isHoveringWatermark = ref(false);
let isDraggingWatermark = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// --- Video State ---
const videoSrc = ref('');
const processedVideoSrc = ref('');
const videoInput = ref<HTMLInputElement | null>(null);
const videoPlayer = ref<HTMLVideoElement | null>(null);
const videoFile = ref<File | null>(null);
const videoProgress = ref(0);
const selection = ref({ x: 50, y: 50, w: 100, h: 50 });
let isDragging = false;
let isResizing = false;
let startX = 0;
let startY = 0;
let startW = 0;
let startH = 0;
let startLeft = 0;
let startTop = 0;

// --- Paste Support ---
onMounted(() => {
  window.addEventListener('paste', handlePaste);
});

onBeforeUnmount(() => {
  window.removeEventListener('paste', handlePaste);
});

const handlePaste = (e: ClipboardEvent) => {
  const items = e.clipboardData?.items;
  if (!items) return;

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) {
        handleImageFile(file);
        activeTab.value = 'image';
      }
    } else if (item.type.startsWith('video/')) {
      const file = item.getAsFile();
      if (file) {
        handleVideoFile(file);
        activeTab.value = 'video';
      }
    }
  }
};

// --- Image Logic ---

const triggerImageUpload = () => imageInput.value?.click();

const handleImageSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    handleImageFile(file);
  }
};

const handleImageFile = (file: File) => {
  const url = URL.createObjectURL(file);
  imageSrc.value = url;
  processedImageSrc.value = '';

  originalImage = new window.Image();
  originalImage.src = url;
  originalImage.onload = () => {
    initCanvas();
  };
};

const initCanvas = () => {
  if (!imageCanvas.value || !originalImage) return;

  const canvas = imageCanvas.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size to image size
  canvas.width = originalImage.width;
  canvas.height = originalImage.height;

  // Draw image
  ctx.drawImage(originalImage, 0, 0);

  // Init mask canvas
  maskCanvas = document.createElement('canvas');
  maskCanvas.width = canvas.width;
  maskCanvas.height = canvas.height;
  const maskCtx = maskCanvas.getContext('2d');
  if (maskCtx) {
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
  }

  // Add event listeners
  canvas.addEventListener('mousedown', onCanvasMouseDown);
  canvas.addEventListener('mousemove', onCanvasMouseMove);
  canvas.addEventListener('mouseup', onCanvasMouseUp);
  canvas.addEventListener('mouseout', onCanvasMouseUp);
};

// Unified Mouse Handlers for Canvas
const onCanvasMouseDown = (e: MouseEvent) => {
  if (activeFunction.value === 'remove') {
    isDrawing = true;
    [lastX, lastY] = getCoordinates(e);
  } else if (activeFunction.value === 'add') {
    if (isHoveringWatermark.value) {
      isDraggingWatermark = true;
      const [x, y] = getCoordinates(e);
      dragOffsetX = x - watermarkX.value;
      dragOffsetY = y - watermarkY.value;
    }
  }
};

const onCanvasMouseMove = (e: MouseEvent) => {
  const [x, y] = getCoordinates(e);

  if (activeFunction.value === 'remove') {
    if (isDrawing) {
      drawRemovePath(x, y);
    }
  } else if (activeFunction.value === 'add') {
    if (isDraggingWatermark) {
      watermarkX.value = x - dragOffsetX;
      watermarkY.value = y - dragOffsetY;
      redrawCanvas();
    } else {
      // Check hit for cursor style
      checkWatermarkHit(x, y);
    }
  }
};

const onCanvasMouseUp = () => {
  isDrawing = false;
  isDraggingWatermark = false;
};

const drawRemovePath = (x: number, y: number) => {
  if (!imageCanvas.value || !maskCanvas) return;
  const ctx = imageCanvas.value.getContext('2d');
  const maskCtx = maskCanvas.getContext('2d');
  if (!ctx || !maskCtx) return;

  // Draw on visible canvas (red marker)
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
  ctx.lineWidth = brushSize.value;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Draw on mask (white on black)
  maskCtx.beginPath();
  maskCtx.moveTo(lastX, lastY);
  maskCtx.lineTo(x, y);
  maskCtx.strokeStyle = 'white';
  maskCtx.lineWidth = brushSize.value;
  maskCtx.lineCap = 'round';
  maskCtx.stroke();

  [lastX, lastY] = [x, y];
};

const checkWatermarkHit = (x: number, y: number) => {
  if (!imageCanvas.value) return;
  const ctx = imageCanvas.value.getContext('2d');
  if (!ctx) return;

  ctx.font = `${watermarkSize.value}px Arial`;
  const metrics = ctx.measureText(watermarkText.value);
  const width = metrics.width;
  const height = watermarkSize.value; // Approx height

  // Simple bounding box check (text baseline is bottom-left usually, but fillText uses x,y as start)
  // Assuming x,y is bottom-left of text
  if (x >= watermarkX.value && x <= watermarkX.value + width &&
      y >= watermarkY.value - height && y <= watermarkY.value) {
    isHoveringWatermark.value = true;
  } else {
    isHoveringWatermark.value = false;
  }
};

const redrawCanvas = () => {
  if (!imageCanvas.value || !originalImage) return;
  const ctx = imageCanvas.value.getContext('2d');
  if (!ctx) return;

  // Clear and redraw original
  ctx.clearRect(0, 0, imageCanvas.value.width, imageCanvas.value.height);
  ctx.drawImage(originalImage, 0, 0);

  // Draw watermark
  ctx.save();
  ctx.globalAlpha = watermarkOpacity.value;
  ctx.font = `${watermarkSize.value}px Arial`;
  ctx.fillStyle = watermarkColor.value;
  ctx.fillText(watermarkText.value, watermarkX.value, watermarkY.value);
  ctx.restore();
};

const getCoordinates = (e: MouseEvent) => {
  if (!imageCanvas.value) return [0, 0];
  const rect = imageCanvas.value.getBoundingClientRect();
  const scaleX = imageCanvas.value.width / rect.width;
  const scaleY = imageCanvas.value.height / rect.height;
  return [
    (e.clientX - rect.left) * scaleX,
    (e.clientY - rect.top) * scaleY
  ];
};

const removeWatermarkImage = async () => {
  if (!imageCanvas.value || !maskCanvas) return;
  isProcessing.value = true;

  try {
    await nextTick();
    const src = cv.imread(imageCanvas.value);
    const mask = cv.imread(maskCanvas);
    const dst = new cv.Mat();

    cv.cvtColor(mask, mask, cv.COLOR_RGBA2GRAY, 0);
    cv.inpaint(src, mask, dst, 5, cv.INPAINT_TELEA);
    cv.imshow(imageCanvas.value, dst);

    src.delete();
    mask.delete();
    dst.delete();

    processedImageSrc.value = imageCanvas.value.toDataURL();
  } catch (e) {
    console.error(e);
  } finally {
    isProcessing.value = false;
  }
};

const addWatermarkImage = () => {
  redrawCanvas(); // Ensure current state is drawn
  if (imageCanvas.value) {
    processedImageSrc.value = imageCanvas.value.toDataURL();
  }
};

const resetImage = () => {
  imageSrc.value = '';
  processedImageSrc.value = '';
  if (imageInput.value) imageInput.value.value = '';
  originalImage = null;
  maskCanvas = null;
};

const downloadImage = () => {
  if (!processedImageSrc.value) return;
  const a = document.createElement('a');
  a.href = processedImageSrc.value;
  a.download = activeFunction.value === 'remove' ? 'cleaned-image.png' : 'watermarked-image.png';
  a.click();
};

// Watchers for Watermark properties to redraw
watch([watermarkText, watermarkColor, watermarkSize, watermarkOpacity, watermarkX, watermarkY], () => {
  if (activeFunction.value === 'add' && activeTab.value === 'image') {
    redrawCanvas();
  }
});

watch(activeFunction, (newVal) => {
  if (newVal === 'add' && activeTab.value === 'image') {
    redrawCanvas();
  } else if (newVal === 'remove' && activeTab.value === 'image') {
    // Restore original image for removal mode (clearing watermark preview)
    if (originalImage && imageCanvas.value) {
      const ctx = imageCanvas.value.getContext('2d');
      ctx?.drawImage(originalImage, 0, 0);
    }
  }
});

// --- Video Logic ---

const ffmpeg = new FFmpeg();

const triggerVideoUpload = () => videoInput.value?.click();

const handleVideoSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    handleVideoFile(file);
  }
};

const handleVideoFile = (file: File) => {
  videoFile.value = file;
  videoSrc.value = URL.createObjectURL(file);
  processedVideoSrc.value = '';
  videoProgress.value = 0;
};

const onVideoLoaded = () => {
  if (videoPlayer.value) {
    const w = videoPlayer.value.videoWidth;
    const h = videoPlayer.value.videoHeight;
    selection.value = { x: w * 0.1, y: h * 0.1, w: w * 0.2, h: h * 0.1 };
  }
};

// Drag & Resize Selection (Remove Mode)
const startDrag = (e: MouseEvent) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  startLeft = selection.value.x;
  startTop = selection.value.y;
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
};

const onDrag = (e: MouseEvent) => {
  if (isDragging) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    selection.value.x = Math.max(0, startLeft + dx);
    selection.value.y = Math.max(0, startTop + dy);
  }
};

const startResize = (e: MouseEvent) => {
  isResizing = true;
  startX = e.clientX;
  startY = e.clientY;
  startW = selection.value.w;
  startH = selection.value.h;
  window.addEventListener('mousemove', onResize);
  window.addEventListener('mouseup', stopDrag);
};

const onResize = (e: MouseEvent) => {
  if (isResizing) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    selection.value.w = Math.max(20, startW + dx);
    selection.value.h = Math.max(20, startH + dy);
  }
};

const stopDrag = () => {
  isDragging = false;
  isResizing = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mousemove', onResize);
  window.removeEventListener('mouseup', stopDrag);
};

// Drag Watermark (Video Add Mode)
const startDragWatermarkVideo = (e: MouseEvent) => {
  isDraggingWatermark = true;
  startX = e.clientX;
  startY = e.clientY;
  startLeft = watermarkX.value;
  startTop = watermarkY.value;
  window.addEventListener('mousemove', onDragWatermarkVideo);
  window.addEventListener('mouseup', stopDragWatermarkVideo);
};

const onDragWatermarkVideo = (e: MouseEvent) => {
  if (isDraggingWatermark) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    watermarkX.value = startLeft + dx;
    watermarkY.value = startTop + dy;
  }
};

const stopDragWatermarkVideo = () => {
  isDraggingWatermark = false;
  window.removeEventListener('mousemove', onDragWatermarkVideo);
  window.removeEventListener('mouseup', stopDragWatermarkVideo);
};


const removeWatermarkVideo = async () => {
  if (!videoFile.value) return;
  isProcessing.value = true;
  videoProgress.value = 0;

  try {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    ffmpeg.on('progress', ({ progress }) => {
      videoProgress.value = progress;
    });

    const name = 'input.mp4';
    await ffmpeg.writeFile(name, await fetchFile(videoFile.value));

    let x = selection.value.x;
    let y = selection.value.y;
    let w = selection.value.w;
    let h = selection.value.h;

    if (videoPlayer.value) {
      const rect = videoPlayer.value.getBoundingClientRect();
      const scaleX = videoPlayer.value.videoWidth / rect.width;
      const scaleY = videoPlayer.value.videoHeight / rect.height;

      x = x * scaleX;
      y = y * scaleY;
      w = w * scaleX;
      h = h * scaleY;
    }

    x = Math.round(x);
    y = Math.round(y);
    w = Math.round(w);
    h = Math.round(h);

    await ffmpeg.exec([
      '-i', name,
      '-vf', `delogo=x=${x}:y=${y}:w=${w}:h=${h}`,
      '-c:a', 'copy',
      'output.mp4'
    ]);

    const data = await ffmpeg.readFile('output.mp4');
    processedVideoSrc.value = URL.createObjectURL(new Blob([(data as any).buffer], { type: 'video/mp4' }));

  } catch (e) {
    console.error(e);
    alert('Video processing failed. Please check console.');
  } finally {
    isProcessing.value = false;
  }
};

const addWatermarkVideo = async () => {
  if (!videoFile.value) return;
  isProcessing.value = true;
  videoProgress.value = 0;

  try {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    ffmpeg.on('progress', ({ progress }) => {
      videoProgress.value = progress;
    });

    const name = 'input.mp4';
    await ffmpeg.writeFile(name, await fetchFile(videoFile.value));

    const fontURL = 'https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf';
    await ffmpeg.writeFile('arial.ttf', await fetchFile(fontURL));

    const color = watermarkColor.value.replace('#', '0x');

    // Calculate position relative to video resolution
    let x = watermarkX.value;
    let y = watermarkY.value;

    if (videoPlayer.value) {
      const rect = videoPlayer.value.getBoundingClientRect();
      const scaleX = videoPlayer.value.videoWidth / rect.width;
      const scaleY = videoPlayer.value.videoHeight / rect.height;
      x = x * scaleX;
      y = y * scaleY;
    }

    // Adjust y to account for font baseline if needed, but drawtext uses top-left usually?
    // Actually drawtext x/y is top-left of the text box.
    // Our overlay is positioned top-left. So it should match.

    const text = watermarkText.value;
    const size = watermarkSize.value;

    await ffmpeg.exec([
      '-i', name,
      '-vf', `drawtext=fontfile=arial.ttf:text='${text}':x=${x}:y=${y}:fontsize=${size}:fontcolor=${color}`,
      '-c:a', 'copy',
      'output.mp4'
    ]);

    const data = await ffmpeg.readFile('output.mp4');
    processedVideoSrc.value = URL.createObjectURL(new Blob([(data as any).buffer], { type: 'video/mp4' }));

  } catch (e) {
    console.error(e);
    alert('Video processing failed. Please check console.');
  } finally {
    isProcessing.value = false;
  }
};

const resetVideo = () => {
  videoSrc.value = '';
  processedVideoSrc.value = '';
  videoFile.value = null;
  videoProgress.value = 0;
  if (videoInput.value) videoInput.value.value = '';
};

const downloadVideo = () => {
  if (!processedVideoSrc.value) return;
  const a = document.createElement('a');
  a.href = processedVideoSrc.value;
  a.download = activeFunction.value === 'remove' ? 'cleaned-video.mp4' : 'watermarked-video.mp4';
  a.click();
};

</script>

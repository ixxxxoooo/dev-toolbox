<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between h-toolbar px-3 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2 text-primary flex-shrink-0">
          <Languages class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.unicodeConverter.name') }}</span>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="showHelp = !showHelp" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <HelpCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-h-0 p-2 gap-2">
      <!-- Input Panel -->
      <CustomTextarea
        v-model="inputText"
        :label="$t('common.labels.input')"
        :placeholder="$t('tools.unicodeConverter.inputPlaceholder')"
        @update:model-value="handleInput"
      >
        <template #header>
          <button @click="pasteInput" :title="$t('common.paste')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
            <ClipboardPaste class="w-3.5 h-3.5" />
          </button>
          <button @click="clearInput" :title="$t('common.clear')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </template>
      </CustomTextarea>

      <!-- Action Buttons -->
      <div class="flex items-center justify-center gap-2">
        <button @click="textToUnicode" class="px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-colors flex items-center space-x-2">
          <ArrowDown class="w-4 h-4" />
          <span>{{ $t('tools.unicodeConverter.textToUnicode') }}</span>
        </button>
        <button @click="unicodeToText" class="px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-colors flex items-center space-x-2">
          <ArrowUp class="w-4 h-4" />
          <span>{{ $t('tools.unicodeConverter.unicodeToText') }}</span>
        </button>
        <CustomCheckbox v-model="onlyNonAscii" :label="$t('tools.unicodeConverter.onlyNonAscii')" />
        <button @click="swapContent" class="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground" :title="$t('tools.unicodeConverter.swap')">
          <ArrowUpDown class="w-4 h-4" />
        </button>
      </div>

      <!-- Output Panel -->
      <CustomTextarea
        v-model="outputText"
        :label="$t('common.labels.output')"
        :placeholder="$t('tools.unicodeConverter.outputPlaceholder')"
        readonly
      >
        <template #header>
          <button @click="copyOutput" :title="$t('common.copy')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
            <Copy class="w-3.5 h-3.5" />
          </button>
          <button @click="clearOutput" :title="$t('common.clear')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </template>
      </CustomTextarea>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-3" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.unicodeConverter.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.unicodeConverter.description') }}</p>
          <div>
            <p class="font-bold mb-2">{{ $t('tools.unicodeConverter.features') }}:</p>
            <ul class="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>{{ $t('tools.unicodeConverter.textToUnicode') }}:</strong> {{ $t('tools.unicodeConverter.textToUnicodeDesc') }}</li>
              <li><strong>{{ $t('tools.unicodeConverter.unicodeToText') }}:</strong> {{ $t('tools.unicodeConverter.unicodeToTextDesc') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Languages, HelpCircle, ClipboardPaste, Copy, Trash2, ArrowDown, ArrowUp, ArrowUpDown, X } from 'lucide-vue-next'
import CustomTextarea from '../components/CustomTextarea.vue'
import CustomCheckbox from '../components/CustomCheckbox.vue'
import { encodeUnicodeEscapes, decodeUnicodeEscapes } from '../utils/unicode'
import { copyText, readClipboardText } from '../utils/clipboard'

const inputText = ref('')
const outputText = ref('')
const showHelp = ref(false)

// 仅转换非 ASCII 字符（保留英文、数字、符号原样）
const onlyNonAscii = ref(false)

const handleInput = () => {
  // 预留：如需实时转换可在此处理
}

const textToUnicode = () => {
  if (!inputText.value) return
  // 按 UTF-16 代码单元输出，emoji 等非 BMP 字符会得到完整代理对（如 \uD83D\uDE00）
  outputText.value = encodeUnicodeEscapes(inputText.value, onlyNonAscii.value)
}

const unicodeToText = () => {
  if (!inputText.value) return
  outputText.value = decodeUnicodeEscapes(inputText.value)
}

const swapContent = () => {
  const temp = inputText.value
  inputText.value = outputText.value
  outputText.value = temp
}

const pasteInput = async () => {
  const text = await readClipboardText()
  if (text !== null) inputText.value = text
}

const copyOutput = () => {
  if (!outputText.value) return
  void copyText(outputText.value)
}

const clearInput = () => {
  inputText.value = ''
}

const clearOutput = () => {
  outputText.value = ''
}
</script>

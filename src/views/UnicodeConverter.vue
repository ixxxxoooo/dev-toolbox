<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4">
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
    <main class="flex-1 flex flex-col min-h-0 p-4 gap-4">
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
        <button @click="textToUnicode" class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-colors flex items-center space-x-2">
          <ArrowDown class="w-4 h-4" />
          <span>{{ $t('tools.unicodeConverter.textToUnicode') }}</span>
        </button>
        <button @click="unicodeToText" class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-colors flex items-center space-x-2">
          <ArrowUp class="w-4 h-4" />
          <span>{{ $t('tools.unicodeConverter.unicodeToText') }}</span>
        </button>
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
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
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

const inputText = ref('')
const outputText = ref('')
const showHelp = ref(false)

const handleInput = () => {
  // Auto-process could be added here if needed
}

const textToUnicode = () => {
  if (!inputText.value) return

  const result = Array.from(inputText.value)
    .map(char => {
      const code = char.charCodeAt(0)
      // Convert all characters to \uXXXX format
      return '\\u' + code.toString(16).toUpperCase().padStart(4, '0')
    })
    .join('')

  outputText.value = result
}

const unicodeToText = () => {
  if (!inputText.value) return

  try {
    // Replace \uXXXX with actual characters
    const result = inputText.value.replace(/\\u([\dA-Fa-f]{4})/g, (_match, hex) => {
      return String.fromCharCode(parseInt(hex, 16))
    })
    outputText.value = result
  } catch (error) {
    outputText.value = 'Error: Invalid Unicode format'
  }
}

const swapContent = () => {
  const temp = inputText.value
  inputText.value = outputText.value
  outputText.value = temp
}

const pasteInput = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
  } catch (error) {
    console.error('Paste failed:', error)
  }
}

const copyOutput = () => {
  if (!outputText.value) return
  navigator.clipboard.writeText(outputText.value)
}

const clearInput = () => {
  inputText.value = ''
}

const clearOutput = () => {
  outputText.value = ''
}
</script>

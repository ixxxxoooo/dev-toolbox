<template>
  <ToolShell :icon="Binary" :title="t('tools.base64.name')" flush>
    <template #actions>
      <Segmented v-model="operation" :options="operationOptions" small class="shrink-0" />
      <ToggleChip v-model="urlSafe" class="shrink-0" :title="t('tools.base64.urlSafeTip')">
        {{ t('common.labels.urlSafe') }}
      </ToggleChip>
      <ToggleChip v-model="autoProcess" class="shrink-0 max-md:hidden">
        {{ t('common.labels.autoProcess') }}
      </ToggleChip>
      <ToggleChip v-model="wordWrapEnabled" class="shrink-0 max-lg:hidden">
        {{ t('common.labels.autoWrap') }}
      </ToggleChip>
    </template>

    <template #right>
      <IconButton :title="t('common.undo') + ' (Ctrl+Z)'" small class="max-sm:hidden" @click="undo">
        <Undo2 class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton :title="t('common.redo') + ' (Ctrl+Y)'" small class="max-sm:hidden" @click="redo">
        <Redo2 class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton :title="t('common.buttons.importFile')" @click="loadFile">
        <Upload class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton
        :title="t('common.buttons.downloadResult')"
        :disabled="!canDownload"
        @click="downloadFile"
      >
        <Download class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton :title="t('common.clear')" danger @click="clearAll">
        <Trash2 class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton
        :title="t('tools.base64.wordWrap')"
        :active="wordWrapEnabled"
        class="max-lg:hidden"
        @click="wordWrapEnabled = !wordWrapEnabled"
      >
        <WrapText class="w-3.5 h-3.5" />
      </IconButton>
      <DropdownMenu :items="overflowItems" align="right" @select="onOverflowSelect">
        <template #trigger>
          <IconButton :title="t('tools.base64.overflowMenu')" small>
            <MoreHorizontal class="w-3.5 h-3.5" />
          </IconButton>
        </template>
      </DropdownMenu>
    </template>

    <template #help>
      <p>{{ t('tools.base64.description') }}</p>
      <p class="font-semibold mt-3 mb-2">{{ t('tools.base64.coreFeatures') }}</p>
      <ul class="list-disc list-inside space-y-1 text-muted-foreground">
        <li>{{ t('tools.base64.featureEncode') }}</li>
        <li>{{ t('tools.base64.featureDecode') }}</li>
        <li>{{ t('tools.base64.featureUrlSafe') }}</li>
        <li>{{ t('tools.base64.featureFile') }}</li>
      </ul>
    </template>

    <SplitPane storage-key="base64">
      <template #a>
        <Pane :title="t('tools.base64.inputPanel')">
          <template #actions>
            <IconButton :title="t('common.paste')" small @click="pasteInput">
              <ClipboardPaste class="w-3.5 h-3.5" />
            </IconButton>
            <IconButton :title="t('common.copy')" small @click="copyInput">
              <Copy class="w-3.5 h-3.5" />
            </IconButton>
          </template>
          <div class="absolute inset-0">
            <div ref="inputEditorRef" class="absolute inset-0"></div>
          </div>
        </Pane>
      </template>
      <template #b>
        <Pane :title="t('tools.base64.resultPanel')">
          <template #actions>
            <IconButton :title="t('common.buttons.useAsInput')" small :disabled="!!binaryOutput" @click="useAsInput">
              <ArrowUpLeft class="w-3.5 h-3.5" />
            </IconButton>
            <IconButton :title="t('common.copy')" small @click="copyOutput">
              <Copy class="w-3.5 h-3.5" />
            </IconButton>
          </template>
          <div class="absolute inset-0" :class="{ 'is-stale is-stale-anim': outputStale }">
            <div ref="outputEditorRef" class="absolute inset-0"></div>
          </div>
        </Pane>
      </template>
    </SplitPane>

    <input ref="fileInput" type="file" class="hidden" @change="handleFileSelect" />

    <template #status>
      <StatusBar :state="processError ? 'error' : 'ok'">
        <span v-if="processError" class="sb-err">
          <AlertCircle class="w-3.5 h-3.5 shrink-0" />
          {{ processError }}
        </span>
        <span v-else-if="binaryOutput" class="sb-warn">{{ t('tools.base64.statusBinary') }}</span>
        <span v-else-if="binaryInput" class="text-muted-foreground">{{ t('tools.base64.statusReady') }}</span>
        <span v-else class="sb-ok">
          <Check class="w-3.5 h-3.5 shrink-0" />
          {{ t('tools.base64.statusReady') }}
        </span>
        <span v-if="binaryInput">{{ formatBytes(binaryInput.length) }}</span>
        <span v-else-if="inputCharCount">{{ t('tools.base64.inputSize', { n: inputCharCount }) }}</span>
        <span v-if="outputCharCount">{{ t('tools.base64.outputSize', { n: outputCharCount }) }}</span>
        <template #right>
          <span class="max-md:hidden">{{ operation === 'encode' ? t('common.labels.encode') : t('common.labels.decode') }}</span>
          <span v-if="urlSafe" class="max-lg:hidden">{{ t('common.labels.urlSafe') }}</span>
        </template>
      </StatusBar>
    </template>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import * as monaco from '@/utils/monaco'
import {
  Binary,
  Upload,
  Download,
  Trash2,
  ClipboardPaste,
  Copy,
  ArrowUpLeft,
  Undo2,
  Redo2,
  MoreHorizontal,
  WrapText,
  AlertCircle,
  Check,
} from 'lucide-vue-next'
import ToolShell from '@/components/ui/ToolShell.vue'
import SplitPane from '@/components/ui/SplitPane.vue'
import Pane from '@/components/ui/Pane.vue'
import Segmented, { type SegmentedOption } from '@/components/ui/Segmented.vue'
import ToggleChip from '@/components/ui/ToggleChip.vue'
import IconButton from '@/components/ui/IconButton.vue'
import DropdownMenu, { type MenuItem } from '@/components/ui/DropdownMenu.vue'
import StatusBar from '@/components/ui/StatusBar.vue'
import { getMonacoTheme, watchThemeChange, registerGlobalShortcuts } from '../utils/monaco-theme'
import { loadFromStorage, saveToStorage, saveToStorageDebounced } from '../utils/localStorage'
import { copyText, readClipboardText } from '../utils/clipboard'
import { showToast } from '../composables/useToast'
import { bytesToBase64, base64ToBytes, decodeUtf8Strict, formatBytes } from '../utils/base64'

type Base64Op = 'encode' | 'decode'

const { t } = useI18n()
// 二进制文件上限：Monaco 展示几十 MB 的 Base64 会卡死
const MAX_BINARY_SIZE = 10 * 1024 * 1024
// 导入的二进制文件字节（编码模式下优先于输入框文本）
const binaryInput = ref<Uint8Array | null>(null)
// 解码结果不是合法 UTF-8 文本时保存原始字节，供下载
const binaryOutput = ref<Uint8Array | null>(null)
// 程序性写入输入框时不触发用户编辑逻辑
let suppressInputChange = false

const inputEditorRef = ref<HTMLElement | null>(null)
const outputEditorRef = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
let inputEditor: monaco.editor.IStandaloneCodeEditor | null = null
let outputEditor: monaco.editor.IStandaloneCodeEditor | null = null
let inputThemeWatcher: (() => void) | null = null
let outputThemeWatcher: (() => void) | null = null

const STORAGE_KEYS = {
  inputText: 'base64-input-text',
  operation: 'base64-operation',
  urlSafe: 'base64-url-safe',
  autoProcess: 'base64-auto-process',
  wordWrapEnabled: 'base64-word-wrap-enabled',
}

const inputText = ref(loadFromStorage(STORAGE_KEYS.inputText, 'Hello World! 你好，世界！'))
const outputText = ref('')
const lastGoodOutput = ref('')
const processError = ref('')
const operation = ref<Base64Op>(loadFromStorage(STORAGE_KEYS.operation, 'encode') as Base64Op)
const urlSafe = ref(loadFromStorage(STORAGE_KEYS.urlSafe, false))
const autoProcess = ref(loadFromStorage(STORAGE_KEYS.autoProcess, true))
const wordWrapEnabled = ref(loadFromStorage(STORAGE_KEYS.wordWrapEnabled, true))

const operationOptions = computed<SegmentedOption<Base64Op>[]>(() => [
  { value: 'encode', label: t('common.labels.encode') },
  { value: 'decode', label: t('common.labels.decode') },
])

const outputStale = computed(() => !!processError.value && !!lastGoodOutput.value)

const inputCharCount = computed(() => String((inputEditor?.getValue() || '').length))

const outputCharCount = computed(() => {
  if (binaryOutput.value) return formatBytes(binaryOutput.value.length)
  const v = outputEditor?.getValue() || ''
  return v ? String(v.length) : ''
})

const canDownload = computed(() => !!binaryOutput.value || !!(outputEditor?.getValue()?.trim()))

const overflowItems = computed<MenuItem[]>(() => [
  { type: 'header', label: t('tools.base64.overflowMenu') },
  {
    value: 'autoProcess',
    label: t('common.labels.autoProcess'),
    checked: autoProcess.value,
  },
  {
    value: 'wordWrap',
    label: t('tools.base64.wordWrap'),
    checked: wordWrapEnabled.value,
  },
  {
    value: 'urlSafe',
    label: t('common.labels.urlSafe'),
    checked: urlSafe.value,
  },
])

const onOverflowSelect = (value: string) => {
  if (value === 'autoProcess') autoProcess.value = !autoProcess.value
  if (value === 'wordWrap') wordWrapEnabled.value = !wordWrapEnabled.value
  if (value === 'urlSafe') urlSafe.value = !urlSafe.value
}

const setOutput = (text: string) => {
  outputText.value = text
  outputEditor?.setValue(text)
}

const processText = () => {
  binaryOutput.value = null
  processError.value = ''

  if (binaryInput.value && operation.value === 'encode') {
    const out = bytesToBase64(binaryInput.value, urlSafe.value)
    setOutput(out)
    lastGoodOutput.value = out
    return
  }

  const input = inputEditor?.getValue() || ''
  if (!input.trim()) {
    setOutput('')
    lastGoodOutput.value = ''
    return
  }

  try {
    if (operation.value === 'encode') {
      const out = bytesToBase64(new TextEncoder().encode(input), urlSafe.value)
      setOutput(out)
      lastGoodOutput.value = out
    } else {
      const bytes = base64ToBytes(input)
      const text = decodeUtf8Strict(bytes)
      if (text === null) {
        binaryOutput.value = bytes
        const out = t('tools.base64.binaryOutput', { size: formatBytes(bytes.length) })
        setOutput(out)
        lastGoodOutput.value = out
      } else {
        setOutput(text)
        lastGoodOutput.value = text
      }
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    processError.value = `${t('tools.base64.processError')}: ${msg}`
    if (lastGoodOutput.value) {
      setOutput(lastGoodOutput.value)
    } else {
      setOutput('')
    }
  }
}

const undo = () => inputEditor?.trigger('keyboard', 'undo', null)
const redo = () => inputEditor?.trigger('keyboard', 'redo', null)

const replaceTextInEditor = (newText: string) => {
  if (!inputEditor) return
  const model = inputEditor.getModel()
  if (model) {
    const fullRange = model.getFullModelRange()
    inputEditor.executeEdits('base64-processor', [{ range: fullRange, text: newText }])
  } else {
    inputEditor.setValue(newText)
  }
}

const initEditors = async () => {
  await nextTick()
  const editorOptions = {
    language: 'plaintext',
    theme: getMonacoTheme(),
    automaticLayout: true,
    minimap: { enabled: false },
    wordWrap: (wordWrapEnabled.value ? 'on' : 'off') as 'on' | 'off',
    padding: { top: 16, bottom: 16 },
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  }

  if (inputEditorRef.value) {
    inputEditor = monaco.editor.create(inputEditorRef.value, {
      value: inputText.value,
      ...editorOptions,
    })
    inputEditor.onDidChangeModelContent(() => {
      if (suppressInputChange) return
      binaryInput.value = null
      inputText.value = inputEditor?.getValue() || ''
      saveToStorageDebounced(STORAGE_KEYS.inputText, inputText.value)
      if (autoProcess.value) processText()
    })
    inputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, undo)
    inputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, redo)
    inputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ, redo)
    inputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {})
    inputThemeWatcher = watchThemeChange(inputEditor)
    registerGlobalShortcuts(inputEditor)
  }
  if (outputEditorRef.value) {
    outputEditor = monaco.editor.create(outputEditorRef.value, {
      value: outputText.value,
      readOnly: true,
      ...editorOptions,
    })
    outputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {})
    outputThemeWatcher = watchThemeChange(outputEditor)
    registerGlobalShortcuts(outputEditor)
  }
  processText()
}

const loadFile = () => fileInput.value?.click()

const handleFileSelect = async (e: Event) => {
  const el = e.target as HTMLInputElement
  const file = el.files?.[0]
  el.value = ''
  if (!file) return

  try {
    const bytes = new Uint8Array(await file.arrayBuffer())
    const text = decodeUtf8Strict(bytes)
    if (operation.value === 'decode' || text !== null) {
      binaryInput.value = null
      replaceTextInEditor(text ?? new TextDecoder().decode(bytes))
      return
    }
    if (bytes.length > MAX_BINARY_SIZE) {
      showToast(t('tools.base64.fileTooLarge', { size: formatBytes(MAX_BINARY_SIZE) }), 'error', 4000)
      return
    }
    binaryInput.value = bytes
    suppressInputChange = true
    try {
      replaceTextInEditor(t('tools.base64.binaryInput', { name: file.name, size: formatBytes(bytes.length) }))
    } finally {
      suppressInputChange = false
    }
    processText()
  } catch (err) {
    console.error('Read file failed:', err)
    showToast(t('tools.base64.readFileFailed'), 'error', 4000)
  }
}

const downloadFile = () => {
  let blob: Blob
  let filename: string
  if (binaryOutput.value) {
    blob = new Blob([binaryOutput.value as BlobPart], { type: 'application/octet-stream' })
    filename = 'decoded.bin'
  } else {
    const content = outputEditor?.getValue()
    if (!content) return
    blob = new Blob([content], { type: 'text/plain' })
    filename = operation.value === 'encode' ? 'encoded.txt' : 'decoded.txt'
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const clearAll = () => {
  binaryInput.value = null
  processError.value = ''
  lastGoodOutput.value = ''
  replaceTextInEditor('')
  setOutput('')
}

const pasteInput = async () => {
  const text = await readClipboardText()
  if (text !== null) replaceTextInEditor(text)
}
const copyInput = () => copyText(inputEditor?.getValue() || '')
const copyOutput = () => copyText(outputEditor?.getValue() || '')
const useAsInput = () => {
  if (binaryOutput.value) return
  const outputValue = outputEditor?.getValue() || ''
  binaryInput.value = null
  replaceTextInEditor(outputValue)
  operation.value = operation.value === 'encode' ? 'decode' : 'encode'
}

watch(operation, (newValue) => {
  saveToStorage(STORAGE_KEYS.operation, newValue)
  if (autoProcess.value) processText()
})

watch(urlSafe, (newValue) => {
  saveToStorage(STORAGE_KEYS.urlSafe, newValue)
  if (autoProcess.value) processText()
})

watch(autoProcess, (newValue) => {
  saveToStorage(STORAGE_KEYS.autoProcess, newValue)
  if (newValue) processText()
})

watch(wordWrapEnabled, (newValue) => {
  const wrapOption = (newValue ? 'on' : 'off') as 'on' | 'off'
  inputEditor?.updateOptions({ wordWrap: wrapOption })
  outputEditor?.updateOptions({ wordWrap: wrapOption })
  saveToStorage(STORAGE_KEYS.wordWrapEnabled, newValue)
})

onMounted(initEditors)
onBeforeUnmount(() => {
  inputThemeWatcher?.()
  outputThemeWatcher?.()
  inputEditor?.dispose()
  outputEditor?.dispose()
})
</script>
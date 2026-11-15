<template>
  <ToolShell :icon="Link" :title="t('tools.url.name')" flush>
    <template #actions>
      <Segmented v-model="operation" :options="operationOptions" small class="shrink-0" />
      <DropdownMenu
        class="shrink-0"
        :items="modeMenuItems"
        align="left"
        @select="onModeSelect"
      >
        <template #trigger>
          <button type="button" class="chip max-w-[11rem] truncate">
            {{ modeShortLabel }}
            <ChevronDown class="w-3 h-3 opacity-60 shrink-0" />
          </button>
        </template>
      </DropdownMenu>
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
      <IconButton :title="t('common.clear')" danger @click="clearAll">
        <Trash2 class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton
        :title="t('tools.url.wordWrap')"
        :active="wordWrapEnabled"
        class="max-lg:hidden"
        @click="wordWrapEnabled = !wordWrapEnabled"
      >
        <WrapText class="w-3.5 h-3.5" />
      </IconButton>
      <DropdownMenu :items="overflowItems" align="right" @select="onOverflowSelect">
        <template #trigger>
          <IconButton :title="t('tools.url.overflowMenu')" small>
            <MoreHorizontal class="w-3.5 h-3.5" />
          </IconButton>
        </template>
      </DropdownMenu>
    </template>

    <template #help>
      <p>{{ t('tools.url.description') }}</p>
      <p class="font-semibold mt-3 mb-2">{{ t('tools.url.coreFeatures') }}</p>
      <ul class="list-disc list-inside space-y-1 text-muted-foreground">
        <li>{{ t('tools.url.helpEncodeComponent') }}</li>
        <li>{{ t('tools.url.helpEncodeUri') }}</li>
        <li>{{ t('tools.url.helpDecode') }}</li>
      </ul>
    </template>

    <SplitPane storage-key="url">
      <template #a>
        <Pane :title="t('tools.url.inputPanel')">
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
        <Pane :title="t('tools.url.resultPanel')">
          <template #actions>
            <IconButton :title="t('common.buttons.useAsInput')" small @click="useAsInput">
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

    <template #status>
      <StatusBar :state="processError ? 'error' : 'ok'">
        <span v-if="processError" class="sb-err">
          <AlertCircle class="w-3.5 h-3.5 shrink-0" />
          {{ processError }}
        </span>
        <span v-else class="sb-ok">
          <Check class="w-3.5 h-3.5 shrink-0" />
          {{ t('tools.url.statusReady') }}
        </span>
        <span v-if="inputLen">{{ t('tools.url.inputSize', { n: inputLen }) }}</span>
        <span v-if="outputLen">{{ t('tools.url.outputSize', { n: outputLen }) }}</span>
        <template #right>
          <span class="max-md:hidden">{{ modeShortLabel }}</span>
          <span class="max-lg:hidden">{{ operation === 'encode' ? t('common.labels.encode') : t('common.labels.decode') }}</span>
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
  Link,
  Trash2,
  ClipboardPaste,
  Copy,
  ArrowUpLeft,
  Undo2,
  Redo2,
  ChevronDown,
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
import { getMonacoTheme, getEditorFontSize, watchThemeChange, registerGlobalShortcuts } from '../utils/monaco-theme'
import { loadFromStorage, saveToStorage, saveToStorageDebounced } from '../utils/localStorage'
import { copyText, readClipboardText } from '../utils/clipboard'

type UrlOp = 'encode' | 'decode'
type UrlMode = 'encodeURIComponent' | 'encodeURI' | 'decodeURIComponent' | 'decodeURI'

const { t } = useI18n()

const inputEditorRef = ref<HTMLElement | null>(null)
const outputEditorRef = ref<HTMLElement | null>(null)
let inputEditor: monaco.editor.IStandaloneCodeEditor | null = null
let outputEditor: monaco.editor.IStandaloneCodeEditor | null = null
let inputThemeWatcher: (() => void) | null = null
let outputThemeWatcher: (() => void) | null = null

const STORAGE_KEYS = {
  inputText: 'url-input-text',
  operation: 'url-operation',
  mode: 'url-mode',
  autoProcess: 'url-auto-process',
  wordWrapEnabled: 'url-word-wrap-enabled',
}

const inputText = ref(loadFromStorage(STORAGE_KEYS.inputText, 'https://example.com/?query=你好 世界'))
const lastGoodOutput = ref('')
const processError = ref('')
const operation = ref<UrlOp>(loadFromStorage(STORAGE_KEYS.operation, 'encode') as UrlOp)
const mode = ref<UrlMode>(loadFromStorage(STORAGE_KEYS.mode, 'encodeURIComponent') as UrlMode)
const autoProcess = ref(loadFromStorage(STORAGE_KEYS.autoProcess, true))
const wordWrapEnabled = ref(loadFromStorage(STORAGE_KEYS.wordWrapEnabled, true))

const operationOptions = computed<SegmentedOption<UrlOp>[]>(() => [
  { value: 'encode', label: t('common.labels.encode') },
  { value: 'decode', label: t('common.labels.decode') },
])

const modeShortLabel = computed(() => {
  if (mode.value === 'encodeURIComponent' || mode.value === 'decodeURIComponent') {
    return t('tools.url.modeComponentShort')
  }
  return t('tools.url.modeUriShort')
})

const modeMenuItems = computed<MenuItem[]>(() => {
  const header = t('tools.url.modeLabel')
  if (operation.value === 'encode') {
    return [
      { type: 'header', label: header },
      { value: 'encodeURIComponent', label: t('tools.url.modeComponent'), checked: mode.value === 'encodeURIComponent' },
      { value: 'encodeURI', label: t('tools.url.modeUri'), checked: mode.value === 'encodeURI' },
    ]
  }
  return [
    { type: 'header', label: header },
    { value: 'decodeURIComponent', label: t('tools.url.modeComponent'), checked: mode.value === 'decodeURIComponent' },
    { value: 'decodeURI', label: t('tools.url.modeUri'), checked: mode.value === 'decodeURI' },
  ]
})

const overflowItems = computed<MenuItem[]>(() => [
  { type: 'header', label: t('tools.url.overflowMenu') },
  { value: 'autoProcess', label: t('common.labels.autoProcess'), checked: autoProcess.value },
  { value: 'wordWrap', label: t('tools.url.wordWrap'), checked: wordWrapEnabled.value },
])

const outputStale = computed(() => !!processError.value && !!lastGoodOutput.value)
const inputLen = computed(() => (inputEditor?.getValue() || '').length)
const outputLen = computed(() => (outputEditor?.getValue() || '').length)

const onModeSelect = (value: string) => {
  mode.value = value as UrlMode
}

const onOverflowSelect = (value: string) => {
  if (value === 'autoProcess') autoProcess.value = !autoProcess.value
  if (value === 'wordWrap') wordWrapEnabled.value = !wordWrapEnabled.value
}

const undo = () => inputEditor?.trigger('keyboard', 'undo', null)
const redo = () => inputEditor?.trigger('keyboard', 'redo', null)

const setOutput = (text: string) => {
  outputEditor?.setValue(text)
}

const processText = () => {
  processError.value = ''
  const input = inputEditor?.getValue() || ''
  if (!input.trim()) {
    setOutput('')
    lastGoodOutput.value = ''
    return
  }

  try {
    let result = ''
    switch (mode.value) {
      case 'encodeURIComponent':
        result = encodeURIComponent(input)
        break
      case 'encodeURI':
        result = encodeURI(input)
        break
      case 'decodeURIComponent':
        result = decodeURIComponent(input)
        break
      case 'decodeURI':
        result = decodeURI(input)
        break
    }
    setOutput(result)
    lastGoodOutput.value = result
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    processError.value = `${t('tools.url.processError')}: ${msg}`
    if (lastGoodOutput.value) {
      setOutput(lastGoodOutput.value)
    } else {
      setOutput('')
    }
  }
}

const replaceTextInEditor = (newText: string) => {
  if (!inputEditor) return
  const model = inputEditor.getModel()
  if (model) {
    const fullRange = model.getFullModelRange()
    inputEditor.executeEdits('url-processor', [{ range: fullRange, text: newText }])
  } else {
    inputEditor.setValue(newText)
  }
}

const initEditors = async () => {
  await nextTick()
  const editorOptions = {
    language: 'uri',
    theme: getMonacoTheme(),
    automaticLayout: true,
    minimap: { enabled: false },
    wordWrap: (wordWrapEnabled.value ? 'on' : 'off') as 'on' | 'off',
    padding: { top: 16, bottom: 16 },
    fontSize: getEditorFontSize(),
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  }

  if (inputEditorRef.value) {
    inputEditor = monaco.editor.create(inputEditorRef.value, {
      value: inputText.value,
      ...editorOptions,
    })
    inputEditor.onDidChangeModelContent(() => {
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
      value: '',
      readOnly: true,
      ...editorOptions,
    })
    outputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {})
    outputThemeWatcher = watchThemeChange(outputEditor)
    registerGlobalShortcuts(outputEditor)
  }
  processText()
}

const clearAll = () => {
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
  const outputValue = outputEditor?.getValue() || ''
  replaceTextInEditor(outputValue)
  operation.value = operation.value === 'encode' ? 'decode' : 'encode'
}

watch(operation, (newVal) => {
  saveToStorage(STORAGE_KEYS.operation, newVal)
  if (newVal === 'encode') {
    mode.value = 'encodeURIComponent'
  } else {
    mode.value = 'decodeURIComponent'
  }
})

watch(mode, (newValue) => {
  saveToStorage(STORAGE_KEYS.mode, newValue)
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
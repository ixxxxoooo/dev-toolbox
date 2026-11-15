<template>
  <ToolShell :icon="FileDiff" :title="$t('tools.diff.name')" flush>
    <template #actions>
      <Segmented v-model="diffMode" :options="modeOptions" small />
      <ToggleChip v-model="ignoreWhitespace">{{ $t('tools.diff.ignoreWhitespace') }}</ToggleChip>
      <ToggleChip v-model="ignoreCase" class="max-xl:hidden">{{ $t('tools.diff.ignoreCase') }}</ToggleChip>
      <ToggleChip v-model="trimTrailing" class="max-lg:hidden">{{ $t('tools.diff.trimTrailing') }}</ToggleChip>
      <span
        class="inline-flex"
        :title="!canIgnoreKeyOrder ? $t('tools.diff.ignoreKeyOrderDisabledTip') : undefined"
      >
        <ToggleChip v-model="ignoreKeyOrder" :disabled="!canIgnoreKeyOrder" class="max-lg:hidden">
          {{ $t('tools.diff.ignoreKeyOrder') }}
        </ToggleChip>
      </span>
      <ToggleChip
        :model-value="decodeUnicode"
        class="max-md:hidden"
        @update:model-value="onDecodeUnicodeChange"
      >
        <Languages class="w-3 h-3" />
        {{ $t('tools.diff.unicodeDecode') }}
      </ToggleChip>

      <span class="tool-vr max-sm:hidden"></span>
      <div class="inline-flex items-center gap-0.5 shrink-0" :aria-label="$t('tools.diff.diffNavigation')">
        <IconButton :title="$t('tools.diff.previousDiff')" small @click="goToPrevDiff">
          <ChevronUp class="w-4 h-4" />
        </IconButton>
        <span class="badge min-w-[2.75rem] justify-center tabular-nums">{{ diffPositionLabel }}</span>
        <IconButton :title="$t('tools.diff.nextDiff')" small @click="goToNextDiff">
          <ChevronDown class="w-4 h-4" />
        </IconButton>
      </div>
    </template>

    <template #right>
      <IconButton :title="$t('tools.diff.swapContent')" @click="swapContent">
        <ArrowLeftRight class="w-4 h-4" />
      </IconButton>
      <IconButton :title="$t('tools.diff.formatBoth')" class="max-sm:hidden" @click="formatBothSides">
        <Wand2 class="w-4 h-4" />
      </IconButton>
      <IconButton :title="$t('common.buttons.history')" @click="showHistory = true">
        <History class="w-4 h-4" />
      </IconButton>
      <IconButton :title="$t('tools.diff.clearAll')" danger @click="clearAll">
        <Trash2 class="w-4 h-4" />
      </IconButton>
      <IconButton
        :title="$t('tools.diff.toggleMinimap')"
        :active="showMinimap"
        @click="showMinimap = !showMinimap"
      >
        <Map class="w-4 h-4" />
      </IconButton>
      <DropdownMenu :items="moreMenuItems" align="right" @select="onMoreMenu">
        <template #trigger>
          <IconButton :title="$t('tools.diff.moreOptions')">
            <MoreHorizontal class="w-4 h-4" />
          </IconButton>
        </template>
      </DropdownMenu>
    </template>

    <template #help>
      <p>{{ $t('tools.diff.helpIntro') }}</p>
      <ul class="mt-3 space-y-1.5 list-disc list-inside text-muted-foreground">
        <li><strong>{{ $t('tools.diff.sideBySide') }}:</strong> {{ $t('tools.diff.sideBySideDescription') }}</li>
        <li><strong>{{ $t('tools.diff.inline') }}:</strong> {{ $t('tools.diff.inlineDescription') }}</li>
        <li><strong>{{ $t('tools.diff.ignoreWhitespace') }}:</strong> {{ $t('tools.diff.ignoreWhitespaceDescription') }}</li>
        <li><strong>{{ $t('tools.diff.ignoreCase') }}:</strong> {{ $t('tools.diff.ignoreCaseDescription') }}</li>
        <li><strong>{{ $t('tools.diff.trimTrailing') }}:</strong> {{ $t('tools.diff.trimTrailingDescription') }}</li>
        <li><strong>{{ $t('tools.diff.ignoreKeyOrder') }}:</strong> {{ $t('tools.diff.ignoreKeyOrderDescription') }}</li>
        <li><strong>{{ $t('tools.diff.unicodeDecode') }}:</strong> {{ $t('tools.diff.unicodeDecodeDesc') }}</li>
        <li>{{ $t('tools.diff.diffNavShortcut') }}</li>
      </ul>
    </template>

    <Pane class="flex-1 min-h-0 m-2 mb-0">
      <template #title>
        <span class="truncate max-sm:hidden">{{ $t('tools.diff.mode') }}</span>
        <span class="badge max-md:hidden">{{ $t('tools.diff.statsLeftLines', { n: leftLineCount }) }}</span>
        <span class="badge max-md:hidden">{{ $t('tools.diff.statsRightLines', { n: rightLineCount }) }}</span>
        <span v-if="diffSummary.hunks" class="badge badge-primary max-lg:hidden">
          {{ $t('tools.diff.statsHunks', { n: diffSummary.hunks }) }}
        </span>
        <span v-if="diffSummary.added" class="badge badge-add">{{ $t('tools.diff.statsAdded', { n: diffSummary.added }) }}</span>
        <span v-if="diffSummary.removed" class="badge badge-del">{{ $t('tools.diff.statsRemoved', { n: diffSummary.removed }) }}</span>
      </template>
      <template v-if="diffMode === 'split'" #actions>
        <div class="inline-flex items-center gap-0.5 max-sm:hidden">
          <IconButton :title="$t('tools.diff.formatLeft')" small @click="formatSide('original')">
            <Wand2 class="w-3.5 h-3.5" />
          </IconButton>
          <IconButton :title="$t('tools.diff.pasteLeft')" small @click="pasteTo('original')">
            <ClipboardPaste class="w-3.5 h-3.5" />
          </IconButton>
          <IconButton :title="$t('tools.diff.copyLeft')" small @click="copyFrom('original')">
            <Copy class="w-3.5 h-3.5" />
          </IconButton>
        </div>
        <span class="text-muted-foreground/50 px-1 max-sm:hidden">|</span>
        <div class="inline-flex items-center gap-0.5">
          <IconButton :title="$t('tools.diff.formatRight')" small @click="formatSide('modified')">
            <Wand2 class="w-3.5 h-3.5" />
          </IconButton>
          <IconButton :title="$t('tools.diff.pasteRight')" small @click="pasteTo('modified')">
            <ClipboardPaste class="w-3.5 h-3.5" />
          </IconButton>
          <IconButton :title="$t('tools.diff.copyRight')" small @click="copyFrom('modified')">
            <Copy class="w-3.5 h-3.5" />
          </IconButton>
        </div>
      </template>
      <div ref="diffEditorRef" class="absolute inset-0"></div>
    </Pane>

    <template #status>
      <StatusBar :state="statusError ? 'error' : 'ok'">
        <template v-if="statusError">
          <span class="sb-err"><AlertCircle class="w-3.5 h-3.5" />{{ statusError }}</span>
        </template>
        <template v-else-if="diffSummary.hunks">
          <span class="sb-warn">{{ $t('tools.diff.diffHunks', { n: diffSummary.hunks }) }}</span>
          <span v-if="diffSummary.added" class="text-[hsl(var(--success))]">
            {{ $t('tools.diff.statsAdded', { n: diffSummary.added }) }}
          </span>
          <span v-if="diffSummary.removed" class="text-[hsl(var(--destructive))]">
            {{ $t('tools.diff.statsRemoved', { n: diffSummary.removed }) }}
          </span>
          <span>{{ $t('tools.diff.similarity', { n: similarityPercent }) }}</span>
        </template>
        <span v-else class="sb-ok"><Check class="w-3.5 h-3.5" />{{ $t('tools.diff.contentIdentical') }}</span>
        <template #right>
          <span class="max-md:hidden">{{ $t('tools.diff.statsLeftLines', { n: leftLineCount }) }}</span>
          <span class="max-md:hidden">{{ $t('tools.diff.statsRightLines', { n: rightLineCount }) }}</span>
          <span>{{ diffMode === 'split' ? $t('tools.diff.sideBySide') : $t('tools.diff.inline') }}</span>
        </template>
      </StatusBar>
    </template>

    <HistoryModal
      :show="showHistory"
      :history="history"
      type="diff"
      @close="showHistory = false"
      @select="handleHistorySelect"
      @delete="deleteHistory"
      @clear="clearHistory"
    />
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import * as monaco from '@/utils/monaco'
import {
  FileDiff,
  ChevronUp,
  ChevronDown,
  ArrowLeftRight,
  Trash2,
  ClipboardPaste,
  Copy,
  History,
  Map,
  Languages,
  Wand2,
  AlertCircle,
  Check,
  Columns2,
  Rows3,
  MoreHorizontal,
} from 'lucide-vue-next'
import { getMonacoTheme, getEditorFontSize, getEditorLineHeight, watchThemeChangeForDiffEditor, registerGlobalShortcutsForDiffEditor } from '../utils/monaco-theme'
import { loadFromStorage, saveToStorage, saveToStorageDebounced } from '../utils/localStorage'
import { useHistory } from '../composables/useHistory'
import { useThemeStore } from '../stores/theme'
import HistoryModal from '../components/HistoryModal.vue'
import { formatText } from '../utils/textFormat'
import { decodeUnicodeEscapes } from '../utils/unicode'
import { copyText, readClipboardText } from '../utils/clipboard'
import ToolShell from '../components/ui/ToolShell.vue'
import Pane from '../components/ui/Pane.vue'
import StatusBar from '../components/ui/StatusBar.vue'
import Segmented from '../components/ui/Segmented.vue'
import type { SegmentedOption } from '../components/ui/Segmented.vue'
import ToggleChip from '../components/ui/ToggleChip.vue'
import IconButton from '../components/ui/IconButton.vue'
import DropdownMenu from '../components/ui/DropdownMenu.vue'
import type { MenuItem } from '../components/ui/DropdownMenu.vue'
import {
  bothStrictJson,
  normalizeTextLines,
  formatJsonWithSortedKeys,
  summarizeLineChanges,
  computeSimilarityPercent,
} from '../utils/diffNormalize'

const { t } = useI18n()
const route = useRoute()
const themeStore = useThemeStore()
const { history, addHistory, deleteHistory, clearHistory, updateMaxItems } = useHistory('diff', themeStore.historyLimit.value)

watch(() => themeStore.historyLimit.value, (newLimit) => {
  updateMaxItems(newLimit)
})

const diffEditorRef = ref<HTMLElement | null>(null)
let diffEditor: monaco.editor.IStandaloneDiffEditor | null = null
let originalModel: monaco.editor.ITextModel | null = null
let modifiedModel: monaco.editor.ITextModel | null = null
let originalContentListener: monaco.IDisposable | null = null
let modifiedContentListener: monaco.IDisposable | null = null
let originalPasteListener: monaco.IDisposable | null = null
let modifiedPasteListener: monaco.IDisposable | null = null
let diffUpdateListener: monaco.IDisposable | null = null
let originalPasteTimer: ReturnType<typeof setTimeout> | null = null
let modifiedPasteTimer: ReturnType<typeof setTimeout> | null = null
let minimapTimer: ReturnType<typeof setTimeout> | null = null
let normalizeTimer: ReturnType<typeof setTimeout> | null = null
let statusErrorTimer: ReturnType<typeof setTimeout> | null = null
let themeWatcher: (() => void) | null = null
let suppressContentSync = false

const showHistory = ref(false)
const statusError = ref('')

const STORAGE_KEYS = {
  leftContent: 'diff-left-content',
  rightContent: 'diff-right-content',
  diffMode: 'diff-mode',
  ignoreWhitespace: 'diff-ignore-whitespace',
  ignoreCase: 'diff-ignore-case',
  trimTrailing: 'diff-trim-trailing',
  ignoreKeyOrder: 'diff-ignore-key-order',
  showLineNumbers: 'diff-show-line-numbers',
  wordWrapEnabled: 'diff-word-wrap-enabled',
  showMinimap: 'diff-show-minimap',
  decodeUnicode: 'diff-decode-unicode',
  leftDecodeSnapshot: 'diff-left-decode-snapshot',
  rightDecodeSnapshot: 'diff-right-decode-snapshot',
}

const leftContent = ref(loadFromStorage(STORAGE_KEYS.leftContent, 'function sayHello() {\n  console.log("Hello, world!");\n}'))
const rightContent = ref(loadFromStorage(STORAGE_KEYS.rightContent, '  function sayHello() {\n    console.log("Hello, world!");\n  }\n'))
const diffMode = ref<'split' | 'inline'>(loadFromStorage(STORAGE_KEYS.diffMode, 'split'))
const ignoreWhitespace = ref(loadFromStorage(STORAGE_KEYS.ignoreWhitespace, false))
const ignoreCase = ref(loadFromStorage(STORAGE_KEYS.ignoreCase, false))
const trimTrailing = ref(loadFromStorage(STORAGE_KEYS.trimTrailing, false))
const ignoreKeyOrder = ref(loadFromStorage(STORAGE_KEYS.ignoreKeyOrder, false))
const showLineNumbers = ref(loadFromStorage(STORAGE_KEYS.showLineNumbers, true))
const wordWrapEnabled = ref(loadFromStorage(STORAGE_KEYS.wordWrapEnabled, true))
const showMinimap = ref(loadFromStorage(STORAGE_KEYS.showMinimap, false))
const decodeUnicode = ref(loadFromStorage(STORAGE_KEYS.decodeUnicode, false))

const leftDecodeSnapshot = ref<string | null>(loadFromStorage(STORAGE_KEYS.leftDecodeSnapshot, null))
const rightDecodeSnapshot = ref<string | null>(loadFromStorage(STORAGE_KEYS.rightDecodeSnapshot, null))

const leftLineCount = ref(1)
const rightLineCount = ref(1)
const lineChanges = ref<monaco.editor.ILineChange[]>([])
const currentDiffIndex = ref(-1)
const similarityPercent = ref(100)

const diffSummary = computed(() => summarizeLineChanges(lineChanges.value))

const canIgnoreKeyOrder = computed(() => bothStrictJson(leftContent.value, rightContent.value))

const diffPositionLabel = computed(() => {
  const total = diffSummary.value.hunks
  if (!total) return t('tools.diff.diffPosition', { current: 0, total: 0 })
  const current = currentDiffIndex.value < 0 ? 0 : currentDiffIndex.value + 1
  return t('tools.diff.diffPosition', { current, total })
})

const modeOptions = computed<SegmentedOption<'split' | 'inline'>[]>(() => [
  { value: 'split', label: t('tools.diff.sideBySide'), icon: Columns2 },
  { value: 'inline', label: t('tools.diff.inline'), icon: Rows3 },
])

const moreMenuItems = computed<MenuItem[]>(() => [
  { type: 'header', label: t('tools.diff.moreOptions') },
  { type: 'item', value: 'wordWrap', label: t('tools.diff.wordWrap'), checked: wordWrapEnabled.value },
  { type: 'item', value: 'lineNumbers', label: t('tools.diff.showLineNumbers'), checked: showLineNumbers.value },
  { type: 'item', value: 'ignoreCase', label: t('tools.diff.ignoreCase'), checked: ignoreCase.value },
  { type: 'item', value: 'trimTrailing', label: t('tools.diff.trimTrailing'), checked: trimTrailing.value },
  {
    type: 'item',
    value: 'ignoreKeyOrder',
    label: t('tools.diff.ignoreKeyOrder'),
    checked: ignoreKeyOrder.value,
    disabled: !canIgnoreKeyOrder.value,
  },
  { type: 'item', value: 'unicode', label: t('tools.diff.unicodeDecode'), checked: decodeUnicode.value },
  { type: 'sep' },
  { type: 'item', value: 'formatBoth', label: t('tools.diff.formatBoth') },
  { type: 'item', value: 'formatLeft', label: t('tools.diff.formatLeft') },
  { type: 'item', value: 'formatRight', label: t('tools.diff.formatRight') },
])

const decodeUnicodeText = decodeUnicodeEscapes

const refreshLineCounts = () => {
  if (!diffEditor) return
  const l = diffEditor.getOriginalEditor().getModel()?.getLineCount() ?? 1
  const r = diffEditor.getModifiedEditor().getModel()?.getLineCount() ?? 1
  leftLineCount.value = l
  rightLineCount.value = r
}

const refreshDiffSnapshot = () => {
  if (!diffEditor) return
  const changes = diffEditor.getLineChanges() ?? []
  lineChanges.value = changes
  if (currentDiffIndex.value >= changes.length) {
    currentDiffIndex.value = changes.length ? changes.length - 1 : -1
  }
  similarityPercent.value = computeSimilarityPercent(leftLineCount.value, rightLineCount.value, changes)
}

/** 对比前对单侧文本做键排序与行级规范化 */
const transformSideForCompare = (text: string): string => {
  let out = text
  if (ignoreKeyOrder.value && bothStrictJson(leftContent.value, rightContent.value)) {
    try {
      out = formatJsonWithSortedKeys(out)
    } catch {
      /* 保持原文 */
    }
  }
  out = normalizeTextLines(out, { ignoreCase: ignoreCase.value, trimTrailing: trimTrailing.value })
  return out
}

const applyComparisonTransforms = () => {
  if (!diffEditor || decodeUnicode.value) return
  if (!ignoreCase.value && !trimTrailing.value && !ignoreKeyOrder.value) return
  const origEd = diffEditor.getOriginalEditor()
  const modEd = diffEditor.getModifiedEditor()
  const nextLeft = transformSideForCompare(origEd.getValue())
  const nextRight = transformSideForCompare(modEd.getValue())
  if (nextLeft === origEd.getValue() && nextRight === modEd.getValue()) return
  suppressContentSync = true
  origEd.setValue(nextLeft)
  modEd.setValue(nextRight)
  leftContent.value = nextLeft
  rightContent.value = nextRight
  saveToStorage(STORAGE_KEYS.leftContent, nextLeft)
  saveToStorage(STORAGE_KEYS.rightContent, nextRight)
  suppressContentSync = false
}

const scheduleNormalize = () => {
  if (!ignoreCase.value && !trimTrailing.value && !ignoreKeyOrder.value) return
  if (normalizeTimer) clearTimeout(normalizeTimer)
  normalizeTimer = setTimeout(() => applyComparisonTransforms(), 280)
}

const flashLine = (editor: monaco.editor.IStandaloneCodeEditor, lineNumber: number) => {
  const collection = editor.createDecorationsCollection([
    {
      range: new monaco.Range(lineNumber, 1, lineNumber, 1),
      options: { isWholeLine: true, className: 'diff-flash-line' },
    },
  ])
  window.setTimeout(() => collection.clear(), 1000)
}

const navigateToDiff = (change: monaco.editor.ILineChange) => {
  if (!diffEditor) return
  const orig = diffEditor.getOriginalEditor()
  const mod = diffEditor.getModifiedEditor()
  if (change.originalStartLineNumber > 0) {
    const line = Math.max(1, change.originalStartLineNumber)
    orig.setPosition({ lineNumber: line, column: 1 })
    orig.revealLineInCenter(line)
    flashLine(orig, line)
  }
  if (change.modifiedStartLineNumber > 0) {
    const line = Math.max(1, change.modifiedStartLineNumber)
    mod.setPosition({ lineNumber: line, column: 1 })
    mod.revealLineInCenter(line)
    flashLine(mod, line)
  }
}

const applyRouteStateIfPresent = (): { side: 'left' | 'right'; content: string } | null => {
  const state = window.history.state
  if (!state || (state.targetSide !== 'left' && state.targetSide !== 'right') || typeof state.content !== 'string') {
    return null
  }
  const side = state.targetSide as 'left' | 'right'
  const targetContent: string = state.content
  if (side === 'left') {
    leftContent.value = targetContent
    saveToStorage(STORAGE_KEYS.leftContent, targetContent)
    leftDecodeSnapshot.value = decodeUnicode.value ? targetContent : null
    saveToStorage(STORAGE_KEYS.leftDecodeSnapshot, leftDecodeSnapshot.value)
  } else {
    rightContent.value = targetContent
    saveToStorage(STORAGE_KEYS.rightContent, targetContent)
    rightDecodeSnapshot.value = decodeUnicode.value ? targetContent : null
    saveToStorage(STORAGE_KEYS.rightDecodeSnapshot, rightDecodeSnapshot.value)
  }
  window.history.replaceState({ ...state, targetSide: undefined, content: undefined, timestamp: undefined }, '')
  return { side, content: targetContent }
}

const cleanupEditorResources = () => {
  if (originalPasteTimer) clearTimeout(originalPasteTimer)
  if (modifiedPasteTimer) clearTimeout(modifiedPasteTimer)
  if (minimapTimer) clearTimeout(minimapTimer)
  if (normalizeTimer) clearTimeout(normalizeTimer)
  originalContentListener?.dispose()
  modifiedContentListener?.dispose()
  originalPasteListener?.dispose()
  modifiedPasteListener?.dispose()
  diffUpdateListener?.dispose()
  themeWatcher?.()
  themeWatcher = null
  if (diffEditor) {
    diffEditor.dispose()
    diffEditor = null
  }
  if (originalModel) {
    originalModel.dispose()
    originalModel = null
  }
  if (modifiedModel) {
    modifiedModel.dispose()
    modifiedModel = null
  }
}

const syncSnapshot = (content: string, snapshot: string | null) => {
  if (snapshot !== null && content === decodeUnicodeText(snapshot)) {
    return { snapshot, display: content }
  }
  return { snapshot: content, display: decodeUnicodeText(content) }
}

const restoreFromSnapshot = (current: string, snapshot: string | null) =>
  snapshot !== null && current === decodeUnicodeText(snapshot) ? snapshot : current

const initMonacoDiffEditor = async () => {
  await nextTick()
  if (!diffEditorRef.value) return

  cleanupEditorResources()
  applyRouteStateIfPresent()

  leftContent.value = loadFromStorage(STORAGE_KEYS.leftContent, leftContent.value)
  rightContent.value = loadFromStorage(STORAGE_KEYS.rightContent, rightContent.value)

  let initialLeft = leftContent.value
  let initialRight = rightContent.value
  if (decodeUnicode.value) {
    const left = syncSnapshot(leftContent.value, leftDecodeSnapshot.value)
    const right = syncSnapshot(rightContent.value, rightDecodeSnapshot.value)
    leftDecodeSnapshot.value = left.snapshot
    rightDecodeSnapshot.value = right.snapshot
    saveToStorage(STORAGE_KEYS.leftDecodeSnapshot, left.snapshot)
    saveToStorage(STORAGE_KEYS.rightDecodeSnapshot, right.snapshot)
    initialLeft = left.display
    initialRight = right.display
  } else {
    initialLeft = transformSideForCompare(initialLeft)
    initialRight = transformSideForCompare(initialRight)
  }

  originalModel = monaco.editor.createModel(initialLeft, 'text/plain')
  modifiedModel = monaco.editor.createModel(initialRight, 'text/plain')

  diffEditor = monaco.editor.createDiffEditor(diffEditorRef.value, {
    theme: getMonacoTheme(),
    automaticLayout: true,
    scrollBeyondLastLine: false,
    readOnly: false,
    originalEditable: true,
    enableSplitViewResizing: true,
    wordWrap: wordWrapEnabled.value ? 'on' : 'off',
    folding: true,
    lineHeight: getEditorLineHeight(),
    fontSize: getEditorFontSize(),
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
    renderSideBySide: diffMode.value === 'split',
    lineNumbers: showLineNumbers.value ? 'on' : 'off',
    ignoreTrimWhitespace: ignoreWhitespace.value,
    minimap: { enabled: showMinimap.value },
    padding: { top: 16, bottom: 16 },
  })

  diffEditor.setModel({ original: originalModel, modified: modifiedModel })

  minimapTimer = setTimeout(() => applyMinimapOption(), 100)
  themeWatcher = watchThemeChangeForDiffEditor(diffEditor)
  registerGlobalShortcutsForDiffEditor(diffEditor)

  diffUpdateListener = diffEditor.onDidUpdateDiff(() => {
    refreshLineCounts()
    refreshDiffSnapshot()
  })

  const originalEditor = diffEditor.getOriginalEditor()
  const modifiedEditor = diffEditor.getModifiedEditor()

  originalEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {})
  modifiedEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {})

  originalContentListener = originalEditor.onDidChangeModelContent(() => {
    if (suppressContentSync || !originalEditor) return
    leftContent.value = originalEditor.getValue() || ''
    saveToStorageDebounced(STORAGE_KEYS.leftContent, leftContent.value)
    refreshLineCounts()
    scheduleNormalize()
  })
  modifiedContentListener = modifiedEditor.onDidChangeModelContent(() => {
    if (suppressContentSync || !modifiedEditor) return
    rightContent.value = modifiedEditor.getValue() || ''
    saveToStorageDebounced(STORAGE_KEYS.rightContent, rightContent.value)
    refreshLineCounts()
    scheduleNormalize()
  })

  originalPasteListener = originalEditor.onDidPaste(() => {
    if (originalPasteTimer) clearTimeout(originalPasteTimer)
    originalPasteTimer = setTimeout(() => {
      if (originalEditor) addHistory(originalEditor.getValue())
    }, 50)
  })
  modifiedPasteListener = modifiedEditor.onDidPaste(() => {
    if (modifiedPasteTimer) clearTimeout(modifiedPasteTimer)
    modifiedPasteTimer = setTimeout(() => {
      if (modifiedEditor) addHistory(modifiedEditor.getValue())
    }, 50)
  })

  refreshLineCounts()
  refreshDiffSnapshot()
}

const goToNextDiff = () => {
  const diffs = lineChanges.value
  if (!diffs.length || !diffEditor) return
  currentDiffIndex.value = (currentDiffIndex.value + 1) % diffs.length
  navigateToDiff(diffs[currentDiffIndex.value])
}

const goToPrevDiff = () => {
  const diffs = lineChanges.value
  if (!diffs.length || !diffEditor) return
  currentDiffIndex.value = currentDiffIndex.value <= 0 ? diffs.length - 1 : currentDiffIndex.value - 1
  navigateToDiff(diffs[currentDiffIndex.value])
}

const onGlobalKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'F7') return
  e.preventDefault()
  if (e.shiftKey) goToPrevDiff()
  else goToNextDiff()
}

const swapContent = () => {
  const originalValue = diffEditor?.getOriginalEditor().getValue() || ''
  const modifiedValue = diffEditor?.getModifiedEditor().getValue() || ''
  diffEditor?.getOriginalEditor().setValue(modifiedValue)
  diffEditor?.getModifiedEditor().setValue(originalValue)
}

const clearAll = () => {
  diffEditor?.getOriginalEditor().setValue('')
  diffEditor?.getModifiedEditor().setValue('')
}

const pasteTo = async (side: 'original' | 'modified') => {
  const text = await readClipboardText()
  if (text === null) return
  if (side === 'original') diffEditor?.getOriginalEditor().setValue(text)
  else diffEditor?.getModifiedEditor().setValue(text)
  addHistory(text)
}

const handleHistorySelect = ({ content, side }: { content: string; side: 'original' | 'modified' }) => {
  if (side === 'original') diffEditor?.getOriginalEditor().setValue(content)
  else diffEditor?.getModifiedEditor().setValue(content)
  showHistory.value = false
}

const showStatusError = (message: string) => {
  statusError.value = message
  if (statusErrorTimer) clearTimeout(statusErrorTimer)
  statusErrorTimer = setTimeout(() => {
    statusError.value = ''
  }, 5000)
}

const formatSide = (side: 'original' | 'modified') => {
  if (!diffEditor) return
  const editor = side === 'original' ? diffEditor.getOriginalEditor() : diffEditor.getModifiedEditor()
  const text = editor.getValue() || ''
  if (!text.trim()) return
  try {
    const formatted = formatText(text)
    if (formatted !== text) editor.setValue(formatted)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : t('tools.diff.formatFailed')
    showStatusError(message)
  }
}

const formatBothSides = () => {
  formatSide('original')
  formatSide('modified')
}

const onDecodeUnicodeChange = (next: boolean) => {
  if (!diffEditor) {
    decodeUnicode.value = next
    return
  }
  if (next === decodeUnicode.value) return
  const originalEditor = diffEditor.getOriginalEditor()
  const modifiedEditor = diffEditor.getModifiedEditor()
  if (next) {
    leftDecodeSnapshot.value = originalEditor.getValue() || ''
    rightDecodeSnapshot.value = modifiedEditor.getValue() || ''
    saveToStorage(STORAGE_KEYS.leftDecodeSnapshot, leftDecodeSnapshot.value)
    saveToStorage(STORAGE_KEYS.rightDecodeSnapshot, rightDecodeSnapshot.value)
    decodeUnicode.value = true
    originalEditor.setValue(decodeUnicodeText(leftDecodeSnapshot.value))
    modifiedEditor.setValue(decodeUnicodeText(rightDecodeSnapshot.value))
  } else {
    originalEditor.setValue(restoreFromSnapshot(originalEditor.getValue() || '', leftDecodeSnapshot.value))
    modifiedEditor.setValue(restoreFromSnapshot(modifiedEditor.getValue() || '', rightDecodeSnapshot.value))
    leftDecodeSnapshot.value = null
    rightDecodeSnapshot.value = null
    saveToStorage(STORAGE_KEYS.leftDecodeSnapshot, null)
    saveToStorage(STORAGE_KEYS.rightDecodeSnapshot, null)
    decodeUnicode.value = false
  }
}

const copyFrom = async (side: 'original' | 'modified') => {
  const text =
    side === 'original' ? diffEditor?.getOriginalEditor().getValue() : diffEditor?.getModifiedEditor().getValue()
  if (text) await copyText(text)
}

const applyMinimapOption = () => {
  if (!diffEditor) return
  const enabled = showMinimap.value
  diffEditor.updateOptions({ minimap: { enabled } })
  diffEditor.getOriginalEditor().updateOptions({ minimap: { enabled } })
  diffEditor.getModifiedEditor().updateOptions({ minimap: { enabled } })
}

const onMoreMenu = (value: string) => {
  switch (value) {
    case 'wordWrap':
      wordWrapEnabled.value = !wordWrapEnabled.value
      break
    case 'lineNumbers':
      showLineNumbers.value = !showLineNumbers.value
      break
    case 'ignoreCase':
      ignoreCase.value = !ignoreCase.value
      break
    case 'trimTrailing':
      trimTrailing.value = !trimTrailing.value
      break
    case 'ignoreKeyOrder':
      if (canIgnoreKeyOrder.value) ignoreKeyOrder.value = !ignoreKeyOrder.value
      break
    case 'unicode':
      onDecodeUnicodeChange(!decodeUnicode.value)
      break
    case 'formatBoth':
      formatBothSides()
      break
    case 'formatLeft':
      formatSide('original')
      break
    case 'formatRight':
      formatSide('modified')
      break
    default:
      break
  }
}

onMounted(() => {
  initMonacoDiffEditor()
  window.addEventListener('keydown', onGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
  if (statusErrorTimer) clearTimeout(statusErrorTimer)
  cleanupEditorResources()
})

watch(diffMode, (newMode) => {
  diffEditor?.updateOptions({ renderSideBySide: newMode === 'split' })
  saveToStorage(STORAGE_KEYS.diffMode, newMode)
})

watch(showLineNumbers, (newValue) => {
  diffEditor?.updateOptions({ lineNumbers: newValue ? 'on' : 'off' })
  saveToStorage(STORAGE_KEYS.showLineNumbers, newValue)
})

watch(ignoreWhitespace, (newValue) => {
  diffEditor?.updateOptions({ ignoreTrimWhitespace: newValue })
  saveToStorage(STORAGE_KEYS.ignoreWhitespace, newValue)
})

watch(ignoreCase, (v) => {
  saveToStorage(STORAGE_KEYS.ignoreCase, v)
  applyComparisonTransforms()
})

watch(trimTrailing, (v) => {
  saveToStorage(STORAGE_KEYS.trimTrailing, v)
  applyComparisonTransforms()
})

watch(ignoreKeyOrder, (v) => {
  saveToStorage(STORAGE_KEYS.ignoreKeyOrder, v)
  applyComparisonTransforms()
})

watch(canIgnoreKeyOrder, (ok) => {
  if (!ok && ignoreKeyOrder.value) ignoreKeyOrder.value = false
})

watch(wordWrapEnabled, (newValue) => {
  diffEditor?.updateOptions({ wordWrap: newValue ? 'on' : 'off' })
  saveToStorage(STORAGE_KEYS.wordWrapEnabled, newValue)
})

watch(showMinimap, (newValue) => {
  applyMinimapOption()
  saveToStorage(STORAGE_KEYS.showMinimap, newValue)
})

watch(decodeUnicode, (newValue) => {
  saveToStorage(STORAGE_KEYS.decodeUnicode, newValue)
})

watch(() => route.fullPath, () => {
  if (!diffEditor) return
  const consumed = applyRouteStateIfPresent()
  if (!consumed) return
  const displayVal = decodeUnicode.value ? decodeUnicodeText(consumed.content) : consumed.content
  if (consumed.side === 'left') diffEditor.getOriginalEditor().setValue(displayVal)
  else diffEditor.getModifiedEditor().setValue(displayVal)
})
</script>

<style scoped>
:global(.monaco-editor .diff-flash-line) {
  animation: diff-flash-line 1s var(--ease-out);
}
@keyframes diff-flash-line {
  0%,
  100% {
    opacity: 0;
    background-color: hsl(var(--primary) / 0);
  }
  25%,
  45% {
    opacity: 1;
    background-color: hsl(var(--primary) / 0.22);
  }
}
</style>
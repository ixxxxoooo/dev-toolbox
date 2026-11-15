<template>
  <ToolShell :icon="Braces" :title="$t('tools.json.name')" flush>
    <template #actions>
      <Segmented v-model="operation" :options="opOptions" />
      <ToggleChip v-model="sortKeys" class="max-lg:hidden" :title="$t('tools.json.sortKeysDesc')">
        <ListOrdered class="w-3 h-3" />
        {{ $t('tools.json.sortKeys') }}
      </ToggleChip>
      <ToggleChip v-model="lenientFix" class="max-lg:hidden" :title="$t('tools.json.lenientFixDesc')">
        {{ $t('tools.json.lenientFix') }}
      </ToggleChip>
      <ToggleChip
        :model-value="decodeUnicode"
        :title="$t('tools.json.unicodeDecodeDesc')"
        @update:model-value="onDecodeUnicodeToggle"
      >
        <Languages class="w-3 h-3" />
        <span class="max-sm:hidden">{{ $t('tools.json.unicodeDecode') }}</span>
      </ToggleChip>
      <ToggleChip
        :model-value="expandNested"
        class="max-md:hidden"
        :title="$t('tools.json.expandNestedDesc')"
        @update:model-value="onExpandNestedToggle"
      >
        <UnfoldVertical class="w-3 h-3" />
        <span class="max-lg:hidden">{{ $t('tools.json.expandNested') }}</span>
      </ToggleChip>
      <DropdownMenu :items="indentMenuItems" align="right" @select="onIndentPick">
        <template #trigger>
          <button type="button" class="chip">
            {{ indentLabel }}
            <ChevronDown class="w-3 h-3" />
          </button>
        </template>
      </DropdownMenu>
    </template>

    <template #right>
      <IconButton :title="$t('common.undo') + ' (⌘Z)'" @click="undoInput"><Undo2 class="w-4 h-4" /></IconButton>
      <IconButton :title="$t('common.buttons.history')" @click="showHistory = true"><History class="w-4 h-4" /></IconButton>
      <IconButton :title="$t('tools.json.copyResult')" @click="copyResult"><Copy class="w-4 h-4" /></IconButton>
      <DropdownMenu :items="moreMenuItems" align="right" @select="onMoreSelect">
        <template #trigger="{ open }">
          <IconButton :title="$t('common.ui.more')" :active="!!open"><MoreHorizontal class="w-4 h-4" /></IconButton>
        </template>
      </DropdownMenu>
    </template>

    <template #help>
      <p>{{ $t('tools.json.description') }}</p>
      <p class="font-semibold mt-3 mb-1">{{ $t('tools.json.coreFeatures') }}</p>
      <ul class="list-disc list-inside space-y-1 text-muted-foreground">
        <li>{{ $t('tools.json.formatDescription') }}</li>
        <li>{{ $t('tools.json.minifyDescription') }}</li>
        <li>{{ $t('tools.json.escapeDescription') }}</li>
        <li>{{ $t('tools.json.unescapeDescription') }}</li>
        <li>{{ $t('tools.json.unicodeDecodeDesc') }}</li>
        <li>{{ $t('tools.json.expandNestedDesc') }}</li>
        <li>{{ $t('tools.json.treeViewDescription') }}</li>
        <li>{{ $t('tools.json.jsonPathDesc') }}</li>
      </ul>
    </template>

    <SplitPane storage-key="json" class="h-full min-h-0">
      <template #a>
        <Pane :title="$t('common.labels.input')" :badge="inputSizeBadge">
          <template #actions>
            <IconButton class="max-lg:hidden" :title="$t('common.paste')" @click="pasteInput">
              <ClipboardPaste class="w-3.5 h-3.5" />
            </IconButton>
          </template>
          <div ref="inputEditorRef" class="absolute inset-0"></div>
        </Pane>
      </template>
      <template #b>
        <Pane :badge="outputBadge">
          <template #title>
            <Segmented v-model="resultView" :options="viewOptions" small class="mr-1" />
          </template>
          <template #actions>
            <button
              v-if="resultView === 'tree'"
              type="button"
              class="text-xs text-primary hover:underline px-1"
              @click="toggleTreeExpansion"
            >
              {{ isTreeExpanded ? $t('tools.json.collapseAll') : $t('tools.json.expandAll') }}
            </button>
          </template>
          <div
            class="flex flex-col h-full min-h-0"
            :class="{ 'is-stale is-stale-anim': hasParseError && lastGoodOutput }"
          >
            <div class="flex items-center gap-2 h-[30px] shrink-0 px-2 border-b border-border bg-muted/30">
              <Search class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <input
                v-model="jsonPathQuery"
                type="text"
                class="flex-1 min-w-0 h-6 bg-transparent text-xs outline-none placeholder:text-muted-foreground/70"
                spellcheck="false"
                :placeholder="$t('tools.json.jsonPathPlaceholder')"
              />
              <span
                v-if="jsonPathQuery.trim()"
                class="text-[11px] shrink-0"
                :class="jsonPathCount === 0 ? 'text-destructive' : 'text-muted-foreground'"
              >
                {{
                  jsonPathCount === 0
                    ? $t('tools.json.jsonPathNoMatch')
                    : $t('tools.json.jsonPathMatches', { n: jsonPathCount })
                }}
              </span>
            </div>
            <div class="relative flex-1 min-h-0 overflow-hidden">
              <Transition name="page" mode="out-in">
                <div v-if="resultView === 'text'" key="text" class="absolute inset-0">
                  <div ref="outputEditorRef" class="absolute inset-0"></div>
                </div>
                <div v-else-if="resultView === 'tree'" key="tree" class="absolute inset-0 overflow-auto">
                  <div v-if="treeTooLarge" class="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <AlertCircle class="w-8 h-8 mb-2 opacity-50" />
                    <p class="text-sm">{{ $t('tools.json.viewTooLarge') }}</p>
                  </div>
                  <JsonTreeView
                    v-else-if="plainViewData !== undefined"
                    ref="treeViewRef"
                    :data="plainViewData"
                  />
                  <div v-else class="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <AlertCircle class="w-8 h-8 mb-2 opacity-50" />
                    <p class="text-sm">{{ $t('common.messages.invalidJson') }}</p>
                  </div>
                </div>
                <div v-else-if="resultView === 'table'" key="table" class="absolute inset-0 overflow-auto p-2">
                  <table v-if="tableRows" class="w-full text-xs border-collapse">
                    <thead>
                      <tr class="border-b border-border text-left text-muted-foreground">
                        <th class="py-1 pr-2 font-medium">#</th>
                        <th v-for="c in tableCols" :key="c" class="py-1 pr-2 font-medium">{{ c }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in tableRows" :key="i" class="border-b border-border/60">
                        <td class="py-1 pr-2 text-muted-foreground">{{ i }}</td>
                        <td v-for="c in tableCols" :key="c" class="py-1 pr-2 font-mono">
                          {{ cellText(row[c]) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else class="h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-1">
                    <p class="text-sm">{{ $t('tools.json.tableEmpty') }}</p>
                    <p class="text-[11px] opacity-70">{{ $t('tools.json.tableEmptyHint') }}</p>
                  </div>
                </div>
                <div v-else key="graph" class="absolute inset-0">
                  <div v-if="graphTooLarge" class="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <AlertCircle class="w-8 h-8 mb-2 opacity-50" />
                    <p class="text-sm">{{ $t('tools.json.viewTooLarge') }}</p>
                  </div>
                  <JsonGraphView v-else-if="plainViewData !== undefined && isPlainObjectOrArray(plainViewData)" :data="plainViewData" />
                  <div v-else class="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <AlertCircle class="w-8 h-8 mb-2 opacity-50" />
                    <p class="text-sm">{{ $t('common.messages.invalidJson') }}</p>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </Pane>
      </template>
    </SplitPane>

    <template #status>
      <StatusBar :state="hasParseError ? 'error' : 'ok'">
        <template v-if="hasParseError && parseError">
          <button type="button" class="sb-err" @click="jumpToError">
            <AlertCircle class="w-3.5 h-3.5" />
            {{ $t('tools.json.invalidAt', { line: parseError.line, col: parseError.column, msg: parseError.message }) }}
          </button>
        </template>
        <span v-else class="sb-ok"><Check class="w-3.5 h-3.5" />{{ $t('tools.json.validJson') }}</span>
        <span v-if="!hasParseError && structureLabel">{{ structureLabel }}</span>
        <span v-if="!hasParseError && parsedData">{{ $t('tools.json.depth', { n: jsonDepthVal }) }}</span>
        <template #right>
          <span>{{ $t('tools.json.cursor', { line: cursorLine, col: cursorCol }) }}</span>
          <span>{{ indentLabel }}</span>
          <span>{{ $t('tools.json.encoding') }}</span>
        </template>
      </StatusBar>
    </template>

    <input ref="fileInput" type="file" class="hidden" accept=".json,.txt,application/json" @change="onFileSelected" />
    <HistoryModal
      :show="showHistory"
      :history="history"
      @close="showHistory = false"
      @select="useHistoryItem"
      @delete="deleteHistory"
      @clear="clearHistory"
    />
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import * as monaco from '@/utils/monaco'
import ToolShell from '@/components/ui/ToolShell.vue'
import StatusBar from '@/components/ui/StatusBar.vue'
import SplitPane from '@/components/ui/SplitPane.vue'
import Pane from '@/components/ui/Pane.vue'
import Segmented, { type SegmentedOption } from '@/components/ui/Segmented.vue'
import ToggleChip from '@/components/ui/ToggleChip.vue'
import IconButton from '@/components/ui/IconButton.vue'
import DropdownMenu, { type MenuItem } from '@/components/ui/DropdownMenu.vue'
import JsonTreeView from '@/components/JsonTreeView.vue'
import JsonGraphView from '@/components/JsonGraphView.vue'
import HistoryModal from '@/components/HistoryModal.vue'
import {
  Braces,
  Undo2,
  Copy,
  History,
  MoreHorizontal,
  ClipboardPaste,
  AlertCircle,
  Check,
  Search,
  ChevronDown,
  Languages,
  UnfoldVertical,
  ListOrdered,
  FileUp,
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Trash2,
  WrapText,
  Map,
  FileCode2,
  Table2,
  ListTree,
  Network,
  AlignLeft,
} from 'lucide-vue-next'
import { parseJsonInput } from '@/utils/jsonToolParse'
import { stringifyJson, toPlainJson } from '@/utils/jsonParse'
import { sortJsonKeys } from '@/utils/jsonSortKeys'
import { jsonDepth } from '@/utils/jsonDepth'
import { getJsonErrorPosition, simplifyJsonErrorMessage } from '@/utils/jsonErrorPosition'
import { evaluateJsonPath, jsonPathDisplayRoot } from '@/utils/jsonPath'
import { findFirstObjectArray } from '@/utils/jsonTable'
import { jsonToTs } from '@/utils/jsonToTs'
import { decodeUnicodeDeep, unescapeCommon } from '@/utils/unicode'
import { hashText } from '@/utils/textHash'
import { showToast } from '@/composables/useToast'
import { copyText, readClipboardText } from '@/utils/clipboard'
import { getMonacoTheme, watchThemeChange, registerGlobalShortcuts } from '@/utils/monaco-theme'
import { loadFromStorage, saveToStorage, saveToStorageDebounced } from '@/utils/localStorage'
import { useHistory } from '@/composables/useHistory'
import { useDebounceFn } from '@/composables/useDebounceFn'
import { useThemeStore } from '@/stores/theme'
import { parseJsonLossless } from '@/utils/jsonParse'

const router = useRouter()
const { t } = useI18n()

type Operation = 'format' | 'minify' | 'escape' | 'unescape'
type ResultView = 'text' | 'tree' | 'table' | 'graph'
type IndentMode = 2 | 4 | 'tab'

const STORAGE_KEYS = {
  inputText: 'json-input-text',
  outputText: 'json-output-text',
  operation: 'json-operation',
  indentSize: 'json-indent-size',
  resultView: 'json-result-view',
  wordWrapEnabled: 'json-word-wrap-enabled',
  showMinimap: 'json-show-minimap',
  sortKeys: 'json-sort-keys',
  lenientFix: 'json-lenient-fix',
  decodeUnicode: 'json-decode-unicode',
  expandNested: 'json-expand-nested',
  jsonPathQuery: 'json-jsonpath-query',
  decodeUnicodeSnapshot: 'json-decode-unicode-snapshot',
  expandNestedSnapshot: 'json-expand-nested-snapshot',
  decodeUnicodeApplied: 'json-decode-unicode-applied',
  expandNestedApplied: 'json-expand-nested-applied',
}

const inputText = ref(loadFromStorage(STORAGE_KEYS.inputText, '{ "hello": "world" }'))
const outputText = ref(loadFromStorage(STORAGE_KEYS.outputText, ''))
const lastGoodOutput = ref(outputText.value)
const operation = ref<Operation>(loadFromStorage(STORAGE_KEYS.operation, 'format'))
const indentSize = ref<IndentMode>(loadFromStorage(STORAGE_KEYS.indentSize, 2))
const loadResultView = (): ResultView => {
  const saved = loadFromStorage<string | null>(STORAGE_KEYS.resultView, null)
  if (saved === 'text' || saved === 'table' || saved === 'tree' || saved === 'graph') return saved
  const legacy = loadFromStorage<string | null>('json-right-panel-view', null)
  if (legacy === 'tree' || legacy === 'graph') return legacy
  return 'text'
}
const resultView = ref<ResultView>(loadResultView())
const wordWrapEnabled = ref(loadFromStorage(STORAGE_KEYS.wordWrapEnabled, true))
const showMinimap = ref(loadFromStorage(STORAGE_KEYS.showMinimap, false))
const sortKeysOn = ref(loadFromStorage(STORAGE_KEYS.sortKeys, false))
const lenientFix = ref(loadFromStorage(STORAGE_KEYS.lenientFix, false))
const decodeUnicode = ref(loadFromStorage(STORAGE_KEYS.decodeUnicode, false))
const expandNested = ref(loadFromStorage(STORAGE_KEYS.expandNested, false))
const jsonPathQuery = ref(loadFromStorage(STORAGE_KEYS.jsonPathQuery, ''))
const showHistory = ref(false)

const sortKeys = sortKeysOn

const inputEditorRef = ref<HTMLElement | null>(null)
const outputEditorRef = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const treeViewRef = ref<InstanceType<typeof JsonTreeView> | null>(null)

let inputEditor: monaco.editor.IStandaloneCodeEditor | null = null
let outputEditor: monaco.editor.IStandaloneCodeEditor | null = null
let inputThemeWatcher: (() => void) | null = null
let outputThemeWatcher: (() => void) | null = null
let inputContentListener: monaco.IDisposable | null = null
let errorDecorations: monaco.editor.IEditorDecorationsCollection | null = null

const cursorLine = ref(1)
const cursorCol = ref(1)
const isProcessing = ref(false)

interface ParseErrorInfo {
  line: number
  column: number
  offset: number
  message: string
}

const parseError = ref<ParseErrorInfo | null>(null)
const hasParseError = computed(() => parseError.value !== null)

const parsedData = ref<unknown | null>(null)
const parsedLossless = ref(true)
const lastParsedData = ref<unknown | null>(null)

const themeStore = useThemeStore()
const { history, addHistory, deleteHistory, clearHistory, updateMaxItems } = useHistory(
  'json',
  themeStore.historyLimit.value,
)
const { addHistory: addDiffHistory, updateMaxItems: updateDiffMaxItems } = useHistory(
  'diff',
  themeStore.historyLimit.value,
)

watch(() => themeStore.historyLimit.value, n => {
  updateMaxItems(n)
  updateDiffMaxItems(n)
})

const pendingTimers: ReturnType<typeof setTimeout>[] = []
const trackTimer = (fn: () => void, ms: number) => {
  const id = setTimeout(fn, ms)
  pendingTimers.push(id)
  return id
}

const opOptions = computed<SegmentedOption<Operation>[]>(() => [
  { value: 'format', label: t('common.labels.format') },
  { value: 'minify', label: t('common.labels.minify') },
  { value: 'escape', label: t('tools.json.escape') },
  { value: 'unescape', label: t('tools.json.unescape') },
])

const viewOptions = computed<SegmentedOption<ResultView>[]>(() => [
  { value: 'text', label: t('tools.json.viewText'), icon: AlignLeft },
  { value: 'tree', label: t('common.labels.treeView'), icon: ListTree },
  { value: 'table', label: t('tools.json.viewTable'), icon: Table2 },
  { value: 'graph', label: t('common.labels.graphView'), icon: Network },
])

const indentMenuItems = computed<MenuItem[]>(() => [
  { value: '2', label: t('common.labels.spaces2'), checked: indentSize.value === 2 },
  { value: '4', label: t('common.labels.spaces4'), checked: indentSize.value === 4 },
  { value: 'tab', label: t('tools.json.indentTab'), checked: indentSize.value === 'tab' },
])

const indentLabel = computed(() => {
  if (indentSize.value === 'tab') return t('tools.json.indentTab')
  return `${t('common.labels.indent')} ${indentSize.value}`
})

const moreMenuItems = computed<MenuItem[]>(() => [
  { type: 'header', label: t('tools.json.menuImport') },
  { value: 'import', label: t('common.buttons.importFile'), icon: FileUp },
  { value: 'copyTs', label: t('tools.json.copyTypescript'), icon: FileCode2 },
  { type: 'sep' },
  { type: 'header', label: t('tools.json.menuDiff') },
  { value: 'diffLeft', label: t('tools.diff.putLeft'), icon: ArrowLeftFromLine },
  { value: 'diffRight', label: t('tools.diff.putRight'), icon: ArrowRightFromLine },
  { type: 'sep' },
  { value: 'wrap', label: t('common.labels.autoWrap'), icon: WrapText, checked: wordWrapEnabled.value },
  { value: 'minimap', label: t('tools.json.minimap'), icon: Map, checked: showMinimap.value },
  { value: 'sort', label: t('tools.json.sortKeys'), icon: ListOrdered, checked: sortKeysOn.value },
  { value: 'lenient', label: t('tools.json.lenientFix'), checked: lenientFix.value },
  { type: 'sep' },
  { value: 'clear', label: t('common.buttons.clearAll'), icon: Trash2, danger: true },
])

const LARGE_INPUT_CHARS = 1_000_000
const GRAPH_MAX_CHARS = 300_000
const TREE_MAX_CHARS = 3_000_000

const isLargeInput = computed(() => inputText.value.length > LARGE_INPUT_CHARS)
const graphTooLarge = computed(() => inputText.value.length > GRAPH_MAX_CHARS)
const treeTooLarge = computed(() => inputText.value.length > TREE_MAX_CHARS)

const jsonPathEval = computed(() => {
  const data = hasParseError.value ? lastParsedData.value : parsedData.value
  if (!data || !jsonPathQuery.value.trim()) return { matches: data ? [data] : [], error: undefined }
  return evaluateJsonPath(data, jsonPathQuery.value.trim())
})

const jsonPathCount = computed(() => jsonPathEval.value.matches.length)

const viewData = computed(() => {
  if (jsonPathQuery.value.trim()) {
    const shown = jsonPathDisplayRoot(jsonPathEval.value.matches)
    return shown
  }
  return hasParseError.value ? lastParsedData.value ?? undefined : parsedData.value ?? undefined
})

// 树 / 表格 / 关系图 / 统计都使用展开后的普通值（LosslessNumber 不能当对象遍历）
const plainViewData = computed(() =>
  viewData.value === undefined ? undefined : toPlainJson(viewData.value),
)
const plainParsedData = computed(() => (parsedData.value ? toPlainJson(parsedData.value) : null))

const jsonDepthVal = computed(() => (plainParsedData.value ? jsonDepth(plainParsedData.value) : 0))

const structureLabel = computed(() => {
  const d = parsedData.value
  if (d === null || typeof d !== 'object') return t('tools.json.scalarType')
  if (Array.isArray(d)) return t('tools.json.topLevelArray', { n: d.length })
  return t('tools.json.topLevelObject', { n: Object.keys(d as Record<string, unknown>).length })
})

const inputSizeBadge = computed(() => formatBytes(new TextEncoder().encode(inputText.value).length))

const outputBadge = computed(() => {
  if (hasParseError.value) return '—'
  if (!parsedData.value) return ''
  const keys = countKeys(plainParsedData.value)
  const size = new TextEncoder().encode(displayText.value).length
  return `${keys} keys · ${formatBytes(size)}`
})

const displayText = computed(() => {
  const q = jsonPathQuery.value.trim()
  if (q && viewData.value !== undefined) {
    return stringifyWithIndent(viewData.value, indentSize.value, parsedLossless.value)
  }
  return hasParseError.value ? lastGoodOutput.value : outputText.value
})

const tableRows = computed(() =>
  plainViewData.value !== undefined ? findFirstObjectArray(plainViewData.value) : null,
)
const tableCols = computed(() =>
  tableRows.value ? [...new Set(tableRows.value.flatMap(r => Object.keys(r)))] : [],
)

const isPlainObjectOrArray = (v: unknown) => v !== null && typeof v === 'object'

function cellText(v: unknown): string {
  if (v === undefined) return ''
  if (v !== null && typeof v === 'object') {
    return JSON.stringify(v, (_k, val) => (typeof val === 'bigint' ? val.toString() : val))
  }
  return String(v)
}

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const sizes = ['B', 'KB', 'MB', 'GB']
  return `${parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`
}

function countKeys(obj: unknown): number {
  if (typeof obj !== 'object' || obj === null) return 0
  if (Array.isArray(obj)) {
    let c = obj.length
    for (const item of obj) c += countKeys(item)
    return c
  }
  let c = Object.keys(obj as Record<string, unknown>).length
  for (const k of Object.keys(obj as Record<string, unknown>)) c += countKeys((obj as Record<string, unknown>)[k])
  return c
}

function stringifyWithIndent(data: unknown, indent: IndentMode, lossless: boolean): string {
  if (indent === 'tab') {
    if (lossless) {
      const out = stringifyJson(data, undefined, true)
      try {
        return JSON.stringify(JSON.parse(out), null, '\t')
      } catch {
        return JSON.stringify(data, null, '\t')
      }
    }
    return JSON.stringify(data, null, '\t')
  }
  return stringifyJson(data, indent, lossless)
}

function parseNestedJsonStrings(value: unknown): unknown {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    const looksLikeJson =
      (trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))
    if (!looksLikeJson) return value
    try {
      const parsed = parseJsonLossless(trimmed).data
      if (parsed !== null && typeof parsed === 'object') return parseNestedJsonStrings(parsed)
      return value
    } catch {
      return value
    }
  }
  if (Array.isArray(value)) return value.map(parseNestedJsonStrings)
  if (value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const out: Record<string, unknown> = {}
    for (const k of Object.keys(value as Record<string, unknown>)) {
      out[k] = parseNestedJsonStrings((value as Record<string, unknown>)[k])
    }
    return out
  }
  return value
}

const runPipeline = () => {
  if (!inputText.value.trim()) {
    parseError.value = null
    parsedData.value = null
    outputText.value = ''
    clearErrorLine()
    syncOutputEditor()
    return
  }

  try {
    parseError.value = null
    clearErrorLine()

    if (operation.value === 'escape') {
      outputText.value = JSON.stringify(inputText.value)
      parsedData.value = null
      lastGoodOutput.value = outputText.value
      syncOutputEditor()
      return
    }

    if (operation.value === 'unescape') {
      let resultData = ''
      try {
        const unescaped = JSON.parse(inputText.value)
        if (typeof unescaped === 'string') {
          try {
            const nested = parseJsonLossless(unescaped)
            resultData = stringifyWithIndent(nested.data, indentSize.value, nested.lossless)
          } catch {
            resultData = unescaped
          }
        } else {
          resultData = stringifyWithIndent(unescaped, indentSize.value, false)
        }
      } catch {
        resultData = unescapeCommon(inputText.value)
      }
      outputText.value = resultData
      lastGoodOutput.value = resultData
      try {
        const p = parseJsonInput(resultData, lenientFix.value)
        parsedData.value = p.data
        parsedLossless.value = p.lossless
        lastParsedData.value = p.data
      } catch {
        parsedData.value = null
      }
      syncOutputEditor()
      return
    }

    const parsed = parseJsonInput(inputText.value, lenientFix.value)
    let data = parsed.data
    if (sortKeysOn.value) data = sortJsonKeys(data)
    if (decodeUnicode.value) data = decodeUnicodeDeep(data)
    if (expandNested.value) data = parseNestedJsonStrings(data)
    if (parsed.unsafeNumbers) showToast(t('tools.json.bigIntWarning'), 'error', 5000)

    parsedData.value = data
    parsedLossless.value = parsed.lossless
    lastParsedData.value = data

    const result =
      operation.value === 'minify'
        ? stringifyJson(data, undefined, parsed.lossless)
        : stringifyWithIndent(data, indentSize.value, parsed.lossless)

    outputText.value = result
    lastGoodOutput.value = result
    syncOutputEditor()
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    const pos = getJsonErrorPosition(inputText.value, msg)
    parseError.value = {
      line: pos.line,
      column: pos.column,
      offset: pos.offset,
      message: simplifyJsonErrorMessage(msg),
    }
    setErrorLine(pos.line)
    parsedData.value = null
    syncOutputEditor()
  }
}

const runPipelineDebounced = useDebounceFn(runPipeline, 120)

watch(inputText, () => {
  saveToStorageDebounced(STORAGE_KEYS.inputText, inputText.value)
  if (isLargeInput.value) runPipelineDebounced.run()
  else {
    runPipelineDebounced.cancel()
    runPipeline()
  }
})

watch([operation, indentSize, sortKeysOn, lenientFix, decodeUnicode, expandNested], () => {
  runPipeline()
})

watch(jsonPathQuery, v => saveToStorage(STORAGE_KEYS.jsonPathQuery, v))
watch(displayText, () => syncOutputEditor())

watch(operation, (v, prev) => {
  saveToStorage(STORAGE_KEYS.operation, v)
  if (prev !== undefined && v === 'format' && inputText.value.trim()) addHistory(inputText.value)
})
watch(resultView, v => saveToStorage(STORAGE_KEYS.resultView, v))
watch(indentSize, v => saveToStorage(STORAGE_KEYS.indentSize, v))
watch(wordWrapEnabled, v => {
  saveToStorage(STORAGE_KEYS.wordWrapEnabled, v)
  inputEditor?.updateOptions({ wordWrap: v ? 'on' : 'off' })
  outputEditor?.updateOptions({ wordWrap: v ? 'on' : 'off' })
})
watch(showMinimap, v => {
  saveToStorage(STORAGE_KEYS.showMinimap, v)
  inputEditor?.updateOptions({ minimap: { enabled: v } })
  outputEditor?.updateOptions({ minimap: { enabled: v } })
})
watch(sortKeysOn, v => saveToStorage(STORAGE_KEYS.sortKeys, v))
watch(lenientFix, v => saveToStorage(STORAGE_KEYS.lenientFix, v))
watch(decodeUnicode, v => saveToStorage(STORAGE_KEYS.decodeUnicode, v))
watch(expandNested, v => saveToStorage(STORAGE_KEYS.expandNested, v))
watch(outputText, v => saveToStorageDebounced(STORAGE_KEYS.outputText, v))

function syncOutputEditor() {
  if (!outputEditor) return
  const val = displayText.value
  if (outputEditor.getValue() !== val) {
    outputEditor.setValue(val)
  }
}

function setErrorLine(line: number | null) {
  errorDecorations?.clear()
  if (!inputEditor || line === null) return
  errorDecorations = inputEditor.createDecorationsCollection([
    {
      range: new monaco.Range(line, 1, line, 1),
      options: { isWholeLine: true, className: 'json-editor-err-line' },
    },
  ])
}

function clearErrorLine() {
  errorDecorations?.clear()
  errorDecorations = null
}

function jumpToError() {
  if (!parseError.value || !inputEditor) return
  const { line, column, offset } = parseError.value
  inputEditor.setPosition({ lineNumber: line, column: Math.max(1, column) })
  inputEditor.revealLineInCenter(line)
  if (offset > 0) inputEditor.setSelection(new monaco.Range(line, column, line, column + 1))
  inputEditor.focus()
}

const undoInput = () => inputEditor?.trigger('keyboard', 'undo', null)

const replaceInputText = (text: string) => {
  if (!inputEditor) {
    inputText.value = text
    return
  }
  const model = inputEditor.getModel()
  if (model) {
    inputEditor.executeEdits('json', [{ range: model.getFullModelRange(), text }])
  } else {
    inputEditor.setValue(text)
  }
  inputText.value = text
}

const decodeUnicodeSnapshot = ref<string | null>(loadFromStorage(STORAGE_KEYS.decodeUnicodeSnapshot, null))
const decodeUnicodeAppliedHash = ref<string | null>(loadFromStorage(STORAGE_KEYS.decodeUnicodeApplied, null))
const expandNestedSnapshot = ref<string | null>(loadFromStorage(STORAGE_KEYS.expandNestedSnapshot, null))
const expandNestedAppliedHash = ref<string | null>(loadFromStorage(STORAGE_KEYS.expandNestedApplied, null))

const restoreSnapshotIfUntouched = (snapshot: string | null, appliedHash: string | null) => {
  if (snapshot === null) return
  if (appliedHash === null || hashText(inputText.value) === appliedHash) replaceInputText(snapshot)
  else showToast(t('tools.json.keepEdited'), 'info', 4000)
}

const onDecodeUnicodeToggle = (turningOn: boolean) => {
  if (turningOn) {
    decodeUnicodeSnapshot.value = inputText.value
    saveToStorage(STORAGE_KEYS.decodeUnicodeSnapshot, inputText.value)
    decodeUnicode.value = true
    runPipeline()
    decodeUnicodeAppliedHash.value = hashText(inputText.value)
    saveToStorage(STORAGE_KEYS.decodeUnicodeApplied, decodeUnicodeAppliedHash.value)
  } else {
    restoreSnapshotIfUntouched(decodeUnicodeSnapshot.value, decodeUnicodeAppliedHash.value)
    decodeUnicodeSnapshot.value = null
    decodeUnicodeAppliedHash.value = null
    saveToStorage(STORAGE_KEYS.decodeUnicodeSnapshot, null)
    saveToStorage(STORAGE_KEYS.decodeUnicodeApplied, null)
    decodeUnicode.value = false
  }
}

const onExpandNestedToggle = (turningOn: boolean) => {
  if (turningOn) {
    expandNestedSnapshot.value = inputText.value
    saveToStorage(STORAGE_KEYS.expandNestedSnapshot, inputText.value)
    expandNested.value = true
    runPipeline()
    expandNestedAppliedHash.value = hashText(inputText.value)
    saveToStorage(STORAGE_KEYS.expandNestedApplied, expandNestedAppliedHash.value)
  } else {
    restoreSnapshotIfUntouched(expandNestedSnapshot.value, expandNestedAppliedHash.value)
    expandNestedSnapshot.value = null
    expandNestedAppliedHash.value = null
    saveToStorage(STORAGE_KEYS.expandNestedSnapshot, null)
    saveToStorage(STORAGE_KEYS.expandNestedApplied, null)
    expandNested.value = false
  }
}

const onIndentPick = (value: string) => {
  indentSize.value = value === 'tab' ? 'tab' : (Number(value) as 2 | 4)
}

const onMoreSelect = (value: string) => {
  switch (value) {
    case 'import':
      fileInput.value?.click()
      break
    case 'copyTs': {
      const data = viewData.value ?? parsedData.value
      if (!data) {
        showToast(t('common.messages.invalidJson'), 'error')
        return
      }
      void copyText(jsonToTs(data), true).then(ok => {
        if (ok) showToast(t('tools.json.copyTypescriptDone'), 'success')
      })
      break
    }
    case 'diffLeft':
      goToDiff('left')
      break
    case 'diffRight':
      goToDiff('right')
      break
    case 'wrap':
      wordWrapEnabled.value = !wordWrapEnabled.value
      break
    case 'minimap':
      showMinimap.value = !showMinimap.value
      break
    case 'sort':
      sortKeysOn.value = !sortKeysOn.value
      break
    case 'lenient':
      lenientFix.value = !lenientFix.value
      break
    case 'clear':
      clearAll()
      break
  }
}

const onFileSelected = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const text = await file.text()
  replaceInputText(text)
  addHistory(text)
  ;(e.target as HTMLInputElement).value = ''
}

const pasteInput = async () => {
  const text = await readClipboardText()
  if (text === null) return
  replaceInputText(text)
  addHistory(text)
  trackTimer(() => runPipeline(), 50)
}

const copyResult = async () => {
  await copyText(displayText.value)
}

const clearAll = () => {
  replaceInputText('')
  outputText.value = ''
  lastGoodOutput.value = ''
}

const useHistoryItem = (content: string) => {
  replaceInputText(content)
  showHistory.value = false
  runPipeline()
  addHistory(content)
}

const goToDiff = (side: 'left' | 'right') => {
  const text = inputEditor?.getValue() ?? inputText.value
  const storageKey = side === 'left' ? 'diff-left-content' : 'diff-right-content'
  const currentContent = loadFromStorage(storageKey, '')
  if (currentContent && currentContent !== text) addDiffHistory(currentContent)
  if (text.trim()) addDiffHistory(text)
  saveToStorage(storageKey, text)
  const snapshotKey = side === 'left' ? 'diff-left-decode-snapshot' : 'diff-right-decode-snapshot'
  saveToStorage(snapshotKey, null)
  router.push({ path: '/diff', state: { targetSide: side, content: text, timestamp: Date.now() } })
}

const isTreeExpanded = ref(true)
const toggleTreeExpansion = () => {
  if (isTreeExpanded.value) treeViewRef.value?.collapseAll()
  else treeViewRef.value?.expandAll()
  isTreeExpanded.value = !isTreeExpanded.value
}

const initEditors = async () => {
  await nextTick()
  if (inputEditorRef.value) {
    inputEditor = monaco.editor.create(inputEditorRef.value, {
      value: inputText.value,
      language: 'json',
      theme: getMonacoTheme(),
      automaticLayout: true,
      minimap: { enabled: showMinimap.value },
      wordWrap: wordWrapEnabled.value ? 'on' : 'off',
      padding: { top: 12, bottom: 12 },
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
      formatOnPaste: true,
      formatOnType: true,
    })
    inputContentListener = inputEditor.onDidChangeModelContent(() => {
      if (!isProcessing.value && inputEditor) inputText.value = inputEditor.getValue()
    })
    inputEditor.onDidChangeCursorPosition(e => {
      cursorLine.value = e.position.lineNumber
      cursorCol.value = e.position.column
    })
    inputEditor.onDidPaste(() => {
      trackTimer(() => {
        const current = inputEditor?.getValue() || ''
        if (current.trim()) addHistory(current)
        try {
          parseJsonInput(current, lenientFix.value)
          if (!current.includes('\n') || current.length < 200) operation.value = 'format'
        } catch {
          /* 粘贴非 JSON 时保持当前模式 */
        }
        runPipeline()
      }, 50)
    })
    const redoInput = () => inputEditor?.trigger('keyboard', 'redo', null)
    inputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, redoInput)
    inputEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ, redoInput)
    inputThemeWatcher = watchThemeChange(inputEditor)
    registerGlobalShortcuts(inputEditor)
  }

  if (outputEditorRef.value) {
    outputEditor = monaco.editor.create(outputEditorRef.value, {
      value: displayText.value,
      language: 'json',
      theme: getMonacoTheme(),
      automaticLayout: true,
      readOnly: true,
      minimap: { enabled: showMinimap.value },
      wordWrap: wordWrapEnabled.value ? 'on' : 'off',
      padding: { top: 12, bottom: 12 },
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
    })
    outputThemeWatcher = watchThemeChange(outputEditor)
  }

  runPipeline()
}

onMounted(initEditors)

onBeforeUnmount(() => {
  while (pendingTimers.length) clearTimeout(pendingTimers.pop())
  inputContentListener?.dispose()
  errorDecorations?.clear()
  inputThemeWatcher?.()
  outputThemeWatcher?.()
  inputEditor?.dispose()
  outputEditor?.dispose()
  inputEditor = null
  outputEditor = null
})
</script>

<style scoped>
:deep(.json-editor-err-line) {
  background: hsl(var(--destructive) / 0.12);
}
</style>
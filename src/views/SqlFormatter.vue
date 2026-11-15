<template>
  <ToolShell :icon="Database" :title="t('tools.sql.name')" flush>
    <template #actions>
      <Segmented v-model="activeAction" :options="actionOptions" small class="shrink-0" />
      <span class="tool-vr max-lg:hidden"></span>
      <DropdownMenu
        class="shrink-0"
        :items="dialectMenuItems"
        align="left"
        @select="onDialectSelect"
      >
        <template #trigger>
          <button type="button" class="chip max-w-[9rem] truncate">
            {{ dialectLabel }}
            <ChevronDown class="w-3 h-3 opacity-60 shrink-0" />
          </button>
        </template>
      </DropdownMenu>
      <Segmented
        v-model="keywordCase"
        :options="keywordCaseOptions"
        small
        class="shrink-0 max-lg:hidden"
      />
      <DropdownMenu
        class="shrink-0"
        :items="indentMenuItems"
        align="left"
        @select="onIndentSelect"
      >
        <template #trigger>
          <button type="button" class="chip max-w-[7rem] truncate max-sm:hidden">
            {{ indentLabel }}
            <ChevronDown class="w-3 h-3 opacity-60 shrink-0" />
          </button>
        </template>
      </DropdownMenu>
      <ToggleChip v-model="unicodeDecode" class="shrink-0 max-md:hidden" :title="t('tools.sql.unicodeDesc')">
        {{ t('tools.sql.unicode') }}
      </ToggleChip>
    </template>

    <template #right>
      <IconButton :title="t('common.undo') + ' (Ctrl+Z)'" small class="max-sm:hidden" @click="undo">
        <Undo2 class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton :title="t('common.redo') + ' (Ctrl+Y)'" small class="max-sm:hidden" @click="redo">
        <Redo2 class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton :title="t('common.buttons.history')" @click="showHistory = true">
        <History class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton :title="t('common.buttons.importFile')" @click="loadFile">
        <Upload class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton
        :title="t('tools.sql.downloadSql')"
        :disabled="!inputText.trim()"
        @click="downloadFile"
      >
        <Download class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton
        :title="t('tools.sql.wordWrap')"
        :active="wordWrapEnabled"
        class="max-lg:hidden"
        @click="wordWrapEnabled = !wordWrapEnabled"
      >
        <WrapText class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton
        :title="t('tools.sql.minimap')"
        :active="showMinimap"
        @click="showMinimap = !showMinimap"
      >
        <Map class="w-3.5 h-3.5" />
      </IconButton>
      <DropdownMenu :items="copyMenuItems" align="right" @select="onCopyAsSelect">
        <template #trigger>
          <button type="button" class="chip max-md:hidden">
            <Copy class="w-3.5 h-3.5" />
            {{ t('tools.sql.copyAs') }}
            <ChevronDown class="w-3 h-3 opacity-60" />
          </button>
        </template>
      </DropdownMenu>
      <DropdownMenu :items="overflowItems" align="right" @select="onOverflowSelect">
        <template #trigger>
          <IconButton :title="t('tools.sql.overflowMenu')" small>
            <MoreHorizontal class="w-3.5 h-3.5" />
          </IconButton>
        </template>
      </DropdownMenu>
    </template>

    <template #help>
      <p>{{ t('tools.sql.description') }}</p>
      <p class="font-semibold mt-3 mb-2">{{ t('tools.sql.coreFeatures') }}</p>
      <ul class="list-disc list-inside space-y-1 text-muted-foreground">
        <li>{{ t('tools.sql.formatDescription') }}</li>
        <li>{{ t('tools.sql.minifyDescription') }}</li>
        <li>{{ t('tools.sql.escapeDescription') }}</li>
        <li>{{ t('tools.sql.unescapeDescription') }}</li>
      </ul>
    </template>

    <SplitPane storage-key="sql">
      <template #a>
        <Pane :title="t('tools.sql.inputPanel')">
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
        <Pane :badge="outputStatsBadge">
          <template #title>
            <span class="truncate text-xs font-medium text-muted-foreground">{{ outputTitle }}</span>
            <span
              v-for="tbl in tableNames"
              :key="tbl"
              class="badge badge-primary text-[10px] max-sm:hidden"
            >{{ tbl }}</span>
          </template>
          <template #actions>
            <IconButton :title="t('tools.sql.copyOutput')" small @click="copyOutput">
              <Copy class="w-3.5 h-3.5" />
            </IconButton>
          </template>
          <div
            class="absolute inset-0"
            :class="{ 'is-stale is-stale-anim': outputStale }"
          >
            <div ref="outputEditorRef" class="absolute inset-0"></div>
          </div>
        </Pane>
      </template>
    </SplitPane>

    <input ref="fileInput" type="file" class="hidden" accept=".sql,.txt" @change="handleFileSelect" />

    <template #status>
      <StatusBar :state="statusBarState">
        <button
          v-if="structureIssue"
          type="button"
          class="sb-err"
          @click="jumpToStructureIssue"
        >
          <AlertCircle class="shrink-0" />
          {{ structureMessage }}
        </button>
        <span v-else-if="inputText.trim()" class="sb-ok">
          <Check class="shrink-0" />
          {{ t('tools.sql.structureOk') }}
        </span>
        <span v-else class="text-muted-foreground">—</span>
        <span v-if="inputText.trim()">{{ t('tools.sql.statementCount', { n: statementCount }) }}</span>
        <span v-if="inputText.trim()">{{ t('tools.sql.tableJoinStats', { tables: tableNames.length, joins: joinCount }) }}</span>
        <span v-if="formatError" class="sb-warn">{{ t('tools.sql.formatFailed') }}</span>
        <template #right>
          <span class="max-sm:hidden">{{ dialectLabel }}</span>
          <span class="max-md:hidden">{{ keywordCaseLabel }}</span>
          <span>UTF-8</span>
        </template>
      </StatusBar>
    </template>

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
import { format, type FormatOptionsWithLanguage } from 'sql-formatter'
import * as monaco from '@/utils/monaco'
import {
  Database,
  Upload,
  Download,
  Undo2,
  Redo2,
  History,
  Map,
  Copy,
  ClipboardPaste,
  ChevronDown,
  MoreHorizontal,
  WrapText,
  AlertCircle,
  Check,
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Trash2,
} from 'lucide-vue-next'
import ToolShell from '@/components/ui/ToolShell.vue'
import SplitPane from '@/components/ui/SplitPane.vue'
import Pane from '@/components/ui/Pane.vue'
import Segmented, { type SegmentedOption } from '@/components/ui/Segmented.vue'
import ToggleChip from '@/components/ui/ToggleChip.vue'
import IconButton from '@/components/ui/IconButton.vue'
import DropdownMenu, { type MenuItem } from '@/components/ui/DropdownMenu.vue'
import StatusBar from '@/components/ui/StatusBar.vue'
import HistoryModal from '@/components/HistoryModal.vue'
import { getMonacoTheme, watchThemeChange, registerGlobalShortcuts } from '@/utils/monaco-theme'
import { loadFromStorage, saveToStorage, saveToStorageDebounced } from '@/utils/localStorage'
import { useHistory } from '@/composables/useHistory'
import { useThemeStore } from '@/stores/theme'
import { showToast } from '@/composables/useToast'
import {
  splitSqlStatements,
  minifySql as minifySqlText,
  applyKeywordCase,
  extractTableNames,
  checkSqlStructure,
  countJoins,
  formatterLanguageForDialect,
  indexToLineColumn,
  type SqlDialect,
  type KeywordCaseMode,
} from '@/utils/sqlLex'
import { sqlToCode, type SqlCopyTarget } from '@/utils/sqlToCode'
import { unescapeCommon, decodeUnicodeEscapes } from '@/utils/unicode'
import { copyText, readClipboardText } from '@/utils/clipboard'

type SqlAction = 'format' | 'minify' | 'escape' | 'unescape'
type IndentKey = '2' | '4' | 'tab'

const router = useRouter()
const { t } = useI18n()
const themeStore = useThemeStore()
const { history, addHistory, deleteHistory, clearHistory, updateMaxItems } = useHistory('sql', themeStore.historyLimit.value)
const { addHistory: addDiffHistory, updateMaxItems: updateDiffMaxItems } = useHistory('diff', themeStore.historyLimit.value)

watch(() => themeStore.historyLimit.value, (newLimit) => {
  updateMaxItems(newLimit)
  updateDiffMaxItems(newLimit)
})

const STORAGE_KEYS = {
  sqlText: 'sql-text',
  sqlDialect: 'sql-dialect-v2',
  indent: 'sql-indent-v2',
  keywordCase: 'sql-keyword-case',
  wordWrapEnabled: 'sql-word-wrap-enabled',
  showMinimap: 'sql-show-minimap',
  unicodeDecode: 'sql-unicode-decode',
  activeAction: 'sql-active-action',
}

const DEFAULT_SQL = `SELECT u.id, u.name, u.email, p.title, p.content, COUNT(c.id) as comment_count FROM users u LEFT JOIN posts p ON u.id = p.user_id LEFT JOIN comments c ON p.id = c.post_id WHERE u.created_at >= '2023-01-01' AND u.status = 'active' GROUP BY u.id, p.id ORDER BY u.created_at DESC, comment_count DESC LIMIT 10;`

const dialectOptions: SqlDialect[] = ['mysql', 'postgresql', 'sqlite', 'sqlserver', 'oracle', 'standard']

const sqlDialect = ref<SqlDialect>(loadFromStorage(STORAGE_KEYS.sqlDialect, 'mysql') as SqlDialect)
const indentKey = ref<IndentKey>(loadFromStorage(STORAGE_KEYS.indent, '2') as IndentKey)
const keywordCase = ref<KeywordCaseMode>(loadFromStorage(STORAGE_KEYS.keywordCase, 'upper') as KeywordCaseMode)
const wordWrapEnabled = ref(loadFromStorage(STORAGE_KEYS.wordWrapEnabled, true))
const showMinimap = ref(loadFromStorage(STORAGE_KEYS.showMinimap, false))
const unicodeDecode = ref(loadFromStorage(STORAGE_KEYS.unicodeDecode, false))
const activeAction = ref<SqlAction>(loadFromStorage(STORAGE_KEYS.activeAction, 'format') as SqlAction)

const inputText = ref(loadFromStorage(STORAGE_KEYS.sqlText, DEFAULT_SQL))
const outputText = ref('')
const lastGoodOutput = ref('')
const formatError = ref(false)

const inputEditorRef = ref<HTMLElement | null>(null)
const outputEditorRef = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
let inputEditor: monaco.editor.IStandaloneCodeEditor | null = null
let outputEditor: monaco.editor.IStandaloneCodeEditor | null = null
let inputThemeWatcher: (() => void) | null = null
let outputThemeWatcher: (() => void) | null = null
let inputContentListener: monaco.IDisposable | null = null
let pasteListener: monaco.IDisposable | null = null
let pasteTimer: number | null = null
let syncingToOutput = false
const pendingTimers: number[] = []
const showHistory = ref(false)

const tabWidth = computed(() => (indentKey.value === 'tab' ? 2 : Number(indentKey.value)))

const dialectLabel = computed(() => t(`tools.sql.dialects.${sqlDialect.value}`))

const indentLabel = computed(() => {
  if (indentKey.value === 'tab') return `${t('tools.sql.indentLabel')} ${t('tools.sql.indentTab')}`
  return `${t('tools.sql.indentLabel')} ${indentKey.value}`
})

const keywordCaseLabel = computed(() => {
  if (keywordCase.value === 'upper') return t('tools.sql.keywordUpper')
  if (keywordCase.value === 'lower') return t('tools.sql.keywordLower')
  return t('tools.sql.keywordPreserve')
})

const actionOptions = computed<SegmentedOption<SqlAction>[]>(() => [
  { value: 'format', label: t('common.labels.format') },
  { value: 'minify', label: t('common.labels.minify') },
  { value: 'escape', label: t('tools.sql.escape') },
  { value: 'unescape', label: t('tools.sql.unescape') },
])

const keywordCaseOptions = computed<SegmentedOption<KeywordCaseMode>[]>(() => [
  { value: 'upper', label: t('tools.sql.keywordUpper') },
  { value: 'lower', label: t('tools.sql.keywordLower') },
  { value: 'preserve', label: t('tools.sql.keywordPreserve') },
])

const dialectMenuItems = computed<MenuItem[]>(() => [
  { type: 'header', label: t('tools.sql.dialect') },
  ...dialectOptions.map(d => ({
    type: 'item' as const,
    value: d,
    label: t(`tools.sql.dialects.${d}`),
    checked: sqlDialect.value === d,
  })),
])

const indentMenuItems = computed<MenuItem[]>(() => [
  { type: 'header', label: t('tools.sql.indentLabel') },
  { value: '2', label: t('tools.sql.indent2'), checked: indentKey.value === '2' },
  { value: '4', label: t('tools.sql.indent4'), checked: indentKey.value === '4' },
  { value: 'tab', label: t('tools.sql.indentTab'), checked: indentKey.value === 'tab' },
])

const copyTargets: SqlCopyTarget[] = ['sql', 'javascript', 'java', 'go', 'python', 'php', 'json', 'escaped']

const copyMenuItems = computed<MenuItem[]>(() => [
  { type: 'header', label: t('tools.sql.copyAsHeader') },
  ...copyTargets.map(k => ({
    type: 'item' as const,
    value: k,
    label: t(`tools.sql.copyTargets.${k}`),
  })),
])

const overflowItems = computed<MenuItem[]>(() => [
  { type: 'item' as const, value: 'diff-left', label: t('tools.diff.putLeft'), icon: ArrowLeftFromLine },
  { type: 'item' as const, value: 'diff-right', label: t('tools.diff.putRight'), icon: ArrowRightFromLine },
  { type: 'sep' },
  { type: 'item' as const, value: 'keyword', label: `${t('tools.sql.keywordCase')}: ${keywordCaseLabel.value}` },
  { type: 'item' as const, value: 'unicode', label: t('tools.sql.unicode'), checked: unicodeDecode.value },
  { type: 'item' as const, value: 'wrap', label: t('tools.sql.wordWrap'), checked: wordWrapEnabled.value },
  ...copyTargets.map(k => ({
    type: 'item' as const,
    value: `copy-${k}`,
    label: t(`tools.sql.copyTargets.${k}`),
  })),
  { type: 'sep' },
  { type: 'item' as const, value: 'clear', label: t('common.clear'), icon: Trash2, danger: true },
])

const outputTitle = computed(() => {
  const map: Record<SqlAction, string> = {
    format: t('tools.sql.resultFormat'),
    minify: t('tools.sql.resultMinify'),
    escape: t('tools.sql.resultEscape'),
    unescape: t('tools.sql.resultUnescape'),
  }
  return map[activeAction.value]
})

const displayedOutput = computed(() => (formatError.value ? lastGoodOutput.value : outputText.value))
const outputStale = computed(() => formatError.value && !!lastGoodOutput.value)

const outputStatsBadge = computed(() => {
  const text = displayedOutput.value
  if (!text) return '—'
  const lines = text.split('\n').length
  return t('tools.sql.statsLinesChars', { lines, chars: text.length })
})

const tableNames = computed(() => extractTableNames(inputText.value, sqlDialect.value))
const joinCount = computed(() => countJoins(inputText.value))
const statementCount = computed(() => {
  const parts = splitSqlStatements(inputText.value)
  return parts.length > 0 ? parts.length : (inputText.value.trim() ? 1 : 0)
})

const structureIssue = computed(() => (inputText.value.trim() ? checkSqlStructure(inputText.value) : null))

const structureMessage = computed(() => {
  if (!structureIssue.value) return ''
  const { line } = indexToLineColumn(inputText.value, structureIssue.value.index)
  const kind = structureIssue.value.kind
  if (kind === 'paren') return t('tools.sql.structureParen', { line })
  if (kind === 'bracket') return t('tools.sql.structureBracket', { line })
  return t('tools.sql.structureString', { line })
})

const statusBarState = computed(() => {
  if (structureIssue.value) return 'error'
  if (formatError.value) return 'warn'
  return 'ok'
})

const formatterKeywordCase = (): 'upper' | 'lower' | 'preserve' => {
  if (keywordCase.value === 'preserve') return 'preserve'
  return keywordCase.value
}

const getProcessSource = (): string => {
  if (!inputEditor) return inputText.value
  const selection = inputEditor.getSelection()
  if (selection && !selection.isEmpty()) {
    return inputEditor.getModel()?.getValueInRange(selection) || inputText.value
  }
  return inputText.value
}

const processSql = (text: string): string => {
  if (!text.trim()) return ''
  const lang = formatterLanguageForDialect(sqlDialect.value) as FormatOptionsWithLanguage['language']
  let result = text
  formatError.value = false

  try {
    if (activeAction.value === 'format') {
      try {
        const fmtTab = indentKey.value === 'tab' ? 2 : tabWidth.value
        result = format(text, {
          language: lang,
          tabWidth: fmtTab,
          keywordCase: formatterKeywordCase(),
          functionCase: formatterKeywordCase(),
          dataTypeCase: formatterKeywordCase(),
        })
        if (indentKey.value === 'tab') {
          result = result.replace(/^([ ]+)/gm, m => {
            const tabs = Math.floor(m.length / fmtTab)
            const rest = m.length % fmtTab
            return '\t'.repeat(tabs) + ' '.repeat(rest)
          })
        }
      } catch {
        formatError.value = true
        result = applyKeywordCase(text, keywordCase.value, sqlDialect.value)
      }
      if (formatError.value) {
        result = applyKeywordCase(text, keywordCase.value, sqlDialect.value)
      }
    } else if (activeAction.value === 'minify') {
      const minifyOne = (stmt: string) => {
        let source = stmt
        try {
          source = format(stmt, {
            language: lang,
            tabWidth: 0,
            keywordCase: formatterKeywordCase(),
          })
        } catch {
          // 保留原文再压缩
        }
        let out = minifySqlText(source)
        return applyKeywordCase(out, keywordCase.value, sqlDialect.value)
      }
      if (text.includes(';')) {
        result = splitSqlStatements(text).map(minifyOne).join('\n')
      } else {
        result = minifyOne(text)
      }
    } else if (activeAction.value === 'escape') {
      result = escapeSqlText(text)
    } else if (activeAction.value === 'unescape') {
      result = unescapeSqlText(text)
    }
  } catch {
    formatError.value = true
    result = lastGoodOutput.value || ''
  }

  if (unicodeDecode.value) {
    result = decodeUnicodeEscapes(result)
  }

  if (!formatError.value) {
    lastGoodOutput.value = result
  }
  return result
}

const escapeSqlText = (text: string) => {
  if (sqlDialect.value === 'postgresql' || sqlDialect.value === 'standard') {
    return text.replace(/'/g, "''")
  }
  return text
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
}

const unescapeSqlText = (text: string) => {
  if (sqlDialect.value === 'postgresql' || sqlDialect.value === 'standard') {
    return text.replace(/''/g, "'")
  }
  return unescapeCommon(text)
}

const refreshOutput = (opts?: { skipEditor?: boolean }) => {
  const out = processSql(getProcessSource())
  outputText.value = out
  if (!opts?.skipEditor && outputEditor && !syncingToOutput) {
    syncingToOutput = true
    // 结果编辑器是只读的：executeEdits 在只读状态下会被 Monaco 忽略，必须直接改 model
    outputEditor.getModel()?.setValue(displayedOutput.value)
    syncingToOutput = false
  }
}

const replaceInputText = (newText: string, selection?: monaco.Selection | null) => {
  if (!inputEditor) return
  const model = inputEditor.getModel()
  if (!model) return
  if (selection && !selection.isEmpty()) {
    inputEditor.executeEdits('sql-input', [{ range: selection, text: newText }])
  } else {
    inputEditor.executeEdits('sql-input', [{ range: model.getFullModelRange(), text: newText }])
  }
}

const onDialectSelect = (value: string) => {
  if (dialectOptions.includes(value as SqlDialect)) sqlDialect.value = value as SqlDialect
}
const onIndentSelect = (value: string) => {
  if (value === '2' || value === '4' || value === 'tab') indentKey.value = value
}

const onCopyAsSelect = async (value: string) => {
  const target = value as SqlCopyTarget
  const payload = sqlToCode(target, displayedOutput.value || inputText.value)
  await copyText(payload, true)
  showToast(t('tools.sql.copiedAs', { format: t(`tools.sql.copyTargets.${target}`) }), 'success')
}

const onOverflowSelect = (value: string) => {
  if (value === 'diff-left') goToDiff('left')
  else if (value === 'diff-right') goToDiff('right')
  else if (value === 'clear') clearAll()
  else if (value === 'unicode') unicodeDecode.value = !unicodeDecode.value
  else if (value === 'wrap') wordWrapEnabled.value = !wordWrapEnabled.value
  else if (value === 'keyword') {
    const order: KeywordCaseMode[] = ['upper', 'lower', 'preserve']
    const i = order.indexOf(keywordCase.value)
    keywordCase.value = order[(i + 1) % order.length]
  } else if (value.startsWith('copy-')) {
    void onCopyAsSelect(value.slice(5))
  }
}

const undo = () => inputEditor?.trigger('keyboard', 'undo', null)
const redo = () => inputEditor?.trigger('keyboard', 'redo', null)

const loadFile = () => fileInput.value?.click()

const handleFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (res) => {
    const content = res.target?.result as string
    replaceInputText(content, null)
    addHistory(content)
    refreshOutput()
  }
  reader.readAsText(file)
  ;(e.target as HTMLInputElement).value = ''
}

const downloadFile = () => {
  const blob = new Blob([displayedOutput.value || inputText.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'formatted.sql'
  a.click()
  URL.revokeObjectURL(url)
}

const clearAll = () => replaceInputText('', null)

const pasteInput = async () => {
  const text = await readClipboardText()
  if (text === null) return
  replaceInputText(text, null)
  await nextTick()
  addHistory(text)
  refreshOutput()
}

const copyInput = async () => {
  await copyText(inputEditor?.getValue() || inputText.value)
}

const copyOutput = async () => {
  await copyText(displayedOutput.value)
}

const useHistoryItem = (content: string) => {
  replaceInputText(content, null)
  showHistory.value = false
  refreshOutput()
}

const jumpToStructureIssue = () => {
  if (!structureIssue.value || !inputEditor) return
  const { line, column } = indexToLineColumn(inputText.value, structureIssue.value.index)
  inputEditor.revealPositionInCenter({ lineNumber: line, column })
  inputEditor.setPosition({ lineNumber: line, column })
  inputEditor.focus()
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
  router.push({
    path: '/diff',
    state: { targetSide: side, content: text, timestamp: Date.now() },
  })
}

const editorOptions = (): monaco.editor.IStandaloneEditorConstructionOptions => ({
  language: 'sql',
  theme: getMonacoTheme(),
  automaticLayout: true,
  minimap: { enabled: showMinimap.value },
  wordWrap: wordWrapEnabled.value ? 'on' : 'off',
  fontSize: 14,
  lineNumbers: 'on',
  folding: true,
  matchBrackets: 'always',
  padding: { top: 12, bottom: 12 },
  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  scrollBeyondLastLine: false,
})

const initEditors = async () => {
  await nextTick()
  if (inputEditorRef.value) {
    inputEditor = monaco.editor.create(inputEditorRef.value, {
      value: inputText.value,
      ...editorOptions(),
    })
    inputContentListener = inputEditor.onDidChangeModelContent(() => {
      if (!inputEditor) return
      const val = inputEditor.getValue()
      inputText.value = val
      saveToStorageDebounced(STORAGE_KEYS.sqlText, val)
      refreshOutput()
    })
    pasteListener = inputEditor.onDidPaste(() => {
      if (pasteTimer) clearTimeout(pasteTimer)
      pasteTimer = window.setTimeout(() => {
        pasteTimer = null
        if (inputEditor) {
          addHistory(inputEditor.getValue() || '')
          activeAction.value = 'format'
          refreshOutput()
        }
      }, 150)
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
      ...editorOptions(),
    })
    outputThemeWatcher = watchThemeChange(outputEditor)
  }
  refreshOutput({ skipEditor: false })
}

watch(sqlDialect, v => saveToStorage(STORAGE_KEYS.sqlDialect, v))
watch(indentKey, v => saveToStorage(STORAGE_KEYS.indent, v))
watch(keywordCase, v => saveToStorage(STORAGE_KEYS.keywordCase, v))
watch(wordWrapEnabled, v => {
  const wrap = v ? 'on' : 'off'
  inputEditor?.updateOptions({ wordWrap: wrap })
  outputEditor?.updateOptions({ wordWrap: wrap })
  saveToStorage(STORAGE_KEYS.wordWrapEnabled, v)
})
watch(showMinimap, v => {
  inputEditor?.updateOptions({ minimap: { enabled: v } })
  outputEditor?.updateOptions({ minimap: { enabled: v } })
  saveToStorage(STORAGE_KEYS.showMinimap, v)
})
watch(unicodeDecode, v => {
  saveToStorage(STORAGE_KEYS.unicodeDecode, v)
  refreshOutput()
})
watch(activeAction, v => {
  saveToStorage(STORAGE_KEYS.activeAction, v)
  refreshOutput()
})
watch([keywordCase, sqlDialect, indentKey], () => refreshOutput())

onMounted(initEditors)
onBeforeUnmount(() => {
  if (pasteTimer) clearTimeout(pasteTimer)
  inputContentListener?.dispose()
  pasteListener?.dispose()
  while (pendingTimers.length) clearTimeout(pendingTimers.pop())
  inputThemeWatcher?.()
  outputThemeWatcher?.()
  inputThemeWatcher = null
  outputThemeWatcher = null
  if (inputEditor) {
    const v = inputEditor.getValue()
    if (v) saveToStorage(STORAGE_KEYS.sqlText, v)
  }
  inputEditor?.dispose()
  outputEditor?.dispose()
  inputEditor = null
  outputEditor = null
})
</script>
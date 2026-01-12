<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Error Toast -->
    <div
      v-if="errorMessage"
      class="fixed top-4 right-4 z-50 bg-destructive text-destructive-foreground px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in"
    >
      <AlertCircle class="w-5 h-5" />
      <span>{{ errorMessage }}</span>
    </div>

    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4 overflow-x-auto no-scrollbar">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <Database class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.sql.name') }}</span>
        </div>

        <div class="h-4 w-px bg-border flex-shrink-0"></div>

        <!-- Options -->
        <div class="flex items-center space-x-3 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="text-xs font-medium text-muted-foreground">{{ $t('tools.sql.database') }}:</span>
            <CustomSelect v-model="sqlDialect" :options="dialectOptions" />
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs font-medium text-muted-foreground">{{ $t('common.labels.indent') }}:</span>
            <CustomSelect v-model="indentSize" :options="indentOptions" />
          </div>

          <CustomCheckbox
            v-model="wordWrapEnabled"
            :label="$t('tools.sql.wordWrap')"
            :title="$t('tools.sql.wordWrap')"
          />

          <button
            @click="showMinimap = !showMinimap"
            class="p-1.5 rounded-md transition-colors h-7 w-7 flex items-center justify-center border border-transparent"
            :class="showMinimap ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground hover:bg-muted'"
            title="Toggle Minimap"
          >
            <Map class="w-3.5 h-3.5" />
          </button>
        </div>

        <div class="h-4 w-px bg-border flex-shrink-0"></div>

        <!-- History & Compare Action -->
        <div class="flex items-center space-x-1 flex-shrink-0">
          <button
            @click="showHistory = true"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-all border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground flex items-center space-x-1"
            :title="$t('common.buttons.history')"
          >
            <History class="w-4 h-4" />
            <span class="hidden sm:inline">{{ $t('common.buttons.history') }}</span>
          </button>
          <div class="h-4 w-px bg-border flex-shrink-0"></div>
          <div class="flex items-center space-x-0.5">
            <button
              @click="goToDiff('left')"
              class="px-3 py-1.5 text-xs font-medium rounded-l-md transition-all border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground flex items-center space-x-1 border-r border-border/50"
              :title="$t('tools.diff.putLeft')"
            >
              <ArrowLeftFromLine class="w-3.5 h-3.5" />
              <span>{{ $t('tools.diff.putLeft') }}</span>
            </button>
            <button
              @click="goToDiff('right')"
              class="px-3 py-1.5 text-xs font-medium rounded-r-md transition-all border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground flex items-center space-x-1"
              :title="$t('tools.diff.putRight')"
            >
              <span>{{ $t('tools.diff.putRight') }}</span>
              <ArrowRightFromLine class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center space-x-1 flex-shrink-0 ml-4">
        <button @click="loadFile" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground" :title="$t('common.buttons.importFile')">
          <Upload class="w-4 h-4" />
        </button>
        <button @click="downloadFile" :disabled="!sqlText.trim()" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50" :title="$t('tools.sql.downloadSql')">
          <Download class="w-4 h-4" />
        </button>
        <div class="h-4 w-px bg-border mx-1"></div>
        <button @click="clearAll" class="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors text-muted-foreground" :title="$t('common.clear')">
          <Trash2 class="w-4 h-4" />
        </button>
        <div class="h-4 w-px bg-border mx-1"></div>
        <button @click="showHelp = !showHelp" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <HelpCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-h-0 p-4">
      <div class="flex-1 flex flex-col border border-border rounded-lg overflow-hidden bg-card shadow-sm">
        <div class="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border">
          <div class="flex items-center space-x-1">
            <button @click="formatSQL(false)" :class="['px-2 py-1 text-[10px] font-medium rounded transition-colors', activeAction === 'format' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80']">{{ $t('common.labels.format') }}</button>
            <button @click="minifySQL()" :class="['px-2 py-1 text-[10px] font-medium rounded transition-colors', activeAction === 'minify' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80']">{{ $t('common.labels.minify') }}</button>
            <button @click="escapeSQL" :class="['px-2 py-1 text-[10px] font-medium rounded transition-colors', activeAction === 'escape' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80']">{{ $t('tools.sql.escape') }}</button>
            <button @click="unescapeSQL" :class="['px-2 py-1 text-[10px] font-medium rounded transition-colors', activeAction === 'unescape' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80']">{{ $t('tools.sql.unescape') }}</button>
            <button @click="decodeUnicode" :class="['px-2 py-1 text-[10px] font-medium rounded transition-colors', activeAction === 'unicode' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80']">{{ $t('tools.sql.unicode') }}</button>
            <div class="h-4 w-px bg-border mx-1"></div>
            <button @click="undo" class="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors" :title="$t('common.undo') + ' (Ctrl+Z)'">
              <Undo2 class="w-3.5 h-3.5" />
            </button>
            <button @click="redo" class="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors" :title="$t('common.redo') + ' (Ctrl+Y)'">
              <Redo2 class="w-3.5 h-3.5" />
            </button>
            <div class="h-4 w-px bg-border mx-1"></div>
            <button @click="pasteInput" :title="$t('common.paste')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
              <ClipboardPaste class="w-3.5 h-3.5" />
            </button>
            <button @click="copyInput" :title="$t('common.copy')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
              <Copy class="w-3.5 h-3.5" />
            </button>
          </div>
          <h3 class="text-xs font-medium text-muted-foreground">SQL {{ $t('common.labels.input') }}</h3>
        </div>
        <div class="flex-1 relative">
          <div ref="sqlEditorRef" class="absolute inset-0"></div>
        </div>
      </div>
      <input ref="fileInput" type="file" class="hidden" accept=".sql,.txt" @change="handleFileSelect" />
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.sql.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.sql.description') }}</p>
          <div>
            <p class="font-bold mb-2">{{ $t('tools.sql.coreFeatures') }}:</p>
            <ul class="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>{{ $t('common.labels.format') }}:</strong> {{ $t('tools.sql.formatDescription') }}</li>
              <li><strong>{{ $t('common.labels.minify') }}:</strong> {{ $t('tools.sql.minifyDescription') }}</li>
              <li><strong>{{ $t('tools.sql.escape') }}:</strong> {{ $t('tools.sql.escapeDescription') }}</li>
              <li><strong>{{ $t('tools.sql.unescape') }}:</strong> {{ $t('tools.sql.unescapeDescription') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- History Modal -->
    <HistoryModal
      :show="showHistory"
      :history="history"
      @close="showHistory = false"
      @select="useHistoryItem"
      @delete="deleteHistory"
      @clear="clearHistory"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as monaco from 'monaco-editor'
import { format } from 'sql-formatter'
import { HelpCircle, Database, Upload, Download, Trash2, ClipboardPaste, Copy, AlertCircle, X, Undo2, Redo2, History, Map, ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-vue-next'
import { getMonacoTheme, watchThemeChange, registerGlobalShortcuts } from '../utils/monaco-theme'
import { loadFromStorage, saveToStorage } from '../utils/localStorage'
import { useHistory } from '../composables/useHistory'
import { useThemeStore } from '../stores/theme'
import HistoryModal from '../components/HistoryModal.vue'
import CustomSelect from '../components/CustomSelect.vue';
import CustomCheckbox from '../components/CustomCheckbox.vue';
import { useI18n } from 'vue-i18n';

const router = useRouter()
const { t } = useI18n()

const dialectOptions = [
  { label: 'MySQL', value: 'mysql' },
  { label: 'TiDB', value: 'tidb' },
  { label: 'StarRocks', value: 'starrocks' },
  { label: 'PostgreSQL', value: 'postgresql' }
]

const indentOptions = [
  { label: t('tools.sql.indent2'), value: 2 },
  { label: t('tools.sql.indent3'), value: 3 },
  { label: t('tools.sql.indent4'), value: 4 }
]

const sqlEditorRef = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
let sqlEditor: monaco.editor.IStandaloneCodeEditor | null = null
let themeWatcher: (() => void) | null = null
const showHelp = ref(false)
const showHistory = ref(false)

const themeStore = useThemeStore()
const { history, addHistory, deleteHistory, clearHistory, updateMaxItems } = useHistory('sql', themeStore.historyLimit.value)

watch(() => themeStore.historyLimit.value, (newLimit) => {
  updateMaxItems(newLimit)
})

const undo = () => sqlEditor?.trigger('keyboard', 'undo', null)
const redo = () => sqlEditor?.trigger('keyboard', 'redo', null)

const STORAGE_KEYS = {
  sqlText: 'sql-text',
  sqlDialect: 'sql-dialect',
  indentSize: 'sql-indent-size',
  wordWrapEnabled: 'sql-word-wrap-enabled',
  showMinimap: 'sql-show-minimap'
}

const DIALECT_MAP: Record<string, string> = {
  'mysql': 'mysql',
  'tidb': 'mysql',
  'starrocks': 'mysql',
  'postgresql': 'postgresql'
}

const sqlText = ref(loadFromStorage(STORAGE_KEYS.sqlText, `SELECT u.id, u.name, u.email, p.title, p.content, COUNT(c.id) as comment_count FROM users u LEFT JOIN posts p ON u.id = p.user_id LEFT JOIN comments c ON p.id = c.post_id WHERE u.created_at >= '2023-01-01' AND u.status = 'active' GROUP BY u.id, p.id ORDER BY u.created_at DESC, comment_count DESC LIMIT 10;`))
const sqlDialect = ref(loadFromStorage(STORAGE_KEYS.sqlDialect, 'mysql'))
const indentSize = ref(loadFromStorage(STORAGE_KEYS.indentSize, 2))
const wordWrapEnabled = ref(loadFromStorage(STORAGE_KEYS.wordWrapEnabled, true))
const showMinimap = ref(loadFromStorage(STORAGE_KEYS.showMinimap, false))
const errorMessage = ref('')

// 追踪当前激活的操作按钮
type ActionType = 'format' | 'minify' | 'escape' | 'unescape' | 'unicode' | null
const activeAction = ref<ActionType>('format')

const getSelectedTextOrAll = () => {
  if (!sqlEditor) return { text: sqlText.value, isSelection: false, selection: null }
  const selection = sqlEditor.getSelection()
  if (selection && !selection.isEmpty()) {
    const selectedText = sqlEditor.getModel()?.getValueInRange(selection) || ''
    return { text: selectedText, isSelection: true, selection }
  }
  return { text: sqlText.value, isSelection: false, selection: null }
}

const replaceTextInEditor = (newText: string, isSelection: boolean, selection: any) => {
  if (!sqlEditor) return
  const model = sqlEditor.getModel()
  if (!model) return

  if (isSelection && selection) {
    sqlEditor.executeEdits('sql-formatter', [{ range: selection, text: newText }])
  } else {
    // Use executeEdits on the full range to preserve undo/redo stack
    const fullRange = model.getFullModelRange()
    sqlEditor.executeEdits('sql-formatter', [{ range: fullRange, text: newText }])
  }
}

const showError = (error: any, prefix = 'Error') => {
  console.error(prefix, error)
  const message = error instanceof Error ? error.message : String(error)
  // Truncate error message if it's too long
  errorMessage.value = message.length > 150
    ? message.substring(0, 150) + '...'
    : message
  setTimeout(() => { errorMessage.value = '' }, 3000)
}

const useHistoryItem = (content: string) => {
  replaceTextInEditor(content, false, null)
  showHistory.value = false
  formatSQL()
}

const formatSQL = (isAuto = false) => {
  if (!isAuto) activeAction.value = 'format'
  const { text, isSelection, selection } = getSelectedTextOrAll()
  if (!text.trim()) return
  try {
    const actualDialect = DIALECT_MAP[sqlDialect.value] || 'mysql'
    const formatted = format(text, {
      language: actualDialect as any,
      tabWidth: indentSize.value,
      keywordCase: 'upper',
      functionCase: 'upper',
      dataTypeCase: 'upper'
    })
    replaceTextInEditor(formatted, isSelection, selection)

    // Add to history if it's not an automatic format or if the content has changed significantly
    if (!isAuto && !isSelection) {
      addHistory(text)
    }
  } catch (error: any) {
    if (!isAuto) showError(error, 'SQL Format Failed')
  }
}

const splitSQLStatements = (text: string) => {
  const statements = text.split(';').map(stmt => stmt.trim()).filter(stmt => stmt.length > 0)
  return statements.map(stmt => stmt + ';').slice(0, -1).concat(statements[statements.length - 1] + (text.trim().endsWith(';') ? ';' : ''))
}

const minifySQL = () => {
  activeAction.value = 'minify'
  const { text, isSelection, selection } = getSelectedTextOrAll()
  if (!text.trim()) return
  try {
    const actualDialect = DIALECT_MAP[sqlDialect.value] || 'mysql'
    const hasSemicolon = text.includes(';')
    if (hasSemicolon && !isSelection) {
      const statements = splitSQLStatements(text)
      const minifiedStatements = statements.map(stmt => {
        if (!stmt.trim()) return stmt
        try {
          const formatted = format(stmt, { language: actualDialect as any, tabWidth: 0, keywordCase: 'upper' })
          return formatted.replace(/\s+/g, ' ').replace(/\s*([(),;])\s*/g, '$1').trim()
        } catch (error) { return stmt.replace(/\s+/g, ' ').trim() }
      })
      replaceTextInEditor(minifiedStatements.join('\n'), isSelection, selection)
    } else {
      const formatted = format(text, { language: actualDialect as any, tabWidth: 0, keywordCase: 'upper' })
      const minified = formatted.replace(/\s+/g, ' ').replace(/\s*([(),;])\s*/g, '$1').trim()
      replaceTextInEditor(minified, isSelection, selection)
    }
  } catch (error: any) {
    showError(`SQL Minify Failed: ${error.message || 'Unknown error'}`)
  }
}

const escapeSQL = () => {
  activeAction.value = 'escape'
  const { text, isSelection, selection } = getSelectedTextOrAll()
  if (!text.trim()) return
  const escaped = text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
  replaceTextInEditor(escaped, isSelection, selection)
}

const unescapeSQL = () => {
  activeAction.value = 'unescape'
  const { text, isSelection, selection } = getSelectedTextOrAll()
  if (!text.trim()) return
  const unescaped = text.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, '\\')
  replaceTextInEditor(unescaped, isSelection, selection)
}

const decodeUnicode = () => {
  activeAction.value = 'unicode'
  const { text, isSelection, selection } = getSelectedTextOrAll()
  if (!text.trim()) return
  try {
    const decoded = text.replace(/\\u[\dA-F]{4}/gi, (match: string) => {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
    })
    replaceTextInEditor(decoded, isSelection, selection)
  } catch (error: any) {
    showError(`Unicode Decode Failed: ${error.message || 'Unknown error'}`)
  }
}

const initEditor = async () => {
  await nextTick()
  const editorOptions = {
    language: 'sql',
    theme: getMonacoTheme(),
    automaticLayout: true,
    minimap: { enabled: showMinimap.value },
    wordWrap: (wordWrapEnabled.value ? 'on' : 'off') as 'on' | 'off',
    fontSize: 14,
    lineNumbers: 'on' as 'on',
    folding: true,
    bracketMatching: 'always' as 'always',
    matchBrackets: 'always' as 'always',
    padding: { top: 16, bottom: 16 },
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  }

  if (sqlEditorRef.value) {
    sqlEditor = monaco.editor.create(sqlEditorRef.value, { value: sqlText.value, ...editorOptions })
    let pasteTimer: number | null = null
    let isFormatting = false

    sqlEditor.onDidChangeModelContent(() => {
      sqlText.value = sqlEditor?.getValue() || ''
      saveToStorage(STORAGE_KEYS.sqlText, sqlText.value)
    })

    sqlEditor.onDidPaste(() => {
      if (pasteTimer) clearTimeout(pasteTimer)
      pasteTimer = window.setTimeout(() => {
        pasteTimer = null
        if (!isFormatting) {
          isFormatting = true
          addHistory(sqlEditor?.getValue() || '')
          formatSQL(true)
          setTimeout(() => { isFormatting = false }, 200)
        }
      }, 150)
    })

    sqlEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, undo)
    sqlEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, redo)
    sqlEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ, redo)
    sqlEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {})
    themeWatcher = watchThemeChange(sqlEditor)
    registerGlobalShortcuts(sqlEditor)
  }
}

const loadFile = () => fileInput.value?.click()
const handleFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (res) => {
      const content = res.target?.result as string
      replaceTextInEditor(content, false, null)
    }
    reader.readAsText(file)
  }
}
const downloadFile = () => {
  if (!sqlText.value.trim()) return
  const blob = new Blob([sqlText.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'formatted.sql'
  a.click()
  URL.revokeObjectURL(url)
}
const clearAll = () => replaceTextInEditor('', false, null)
const pasteInput = async () => {
  try {
    const text = await navigator.clipboard.readText()
    replaceTextInEditor(text, false, null)
    await nextTick()
    addHistory(text)
    formatSQL(true)
  } catch (error) { console.error('Paste failed:', error) }
}
const copyInput = () => navigator.clipboard.writeText(sqlEditor?.getValue() || '')

const goToDiff = (side: 'left' | 'right') => {
  const text = sqlEditor?.getValue() || ''
  saveToStorage(side === 'left' ? 'diff-left-content' : 'diff-right-content', text)
  router.push('/diff')
}

watch(sqlDialect, (newValue) => saveToStorage(STORAGE_KEYS.sqlDialect, newValue))
watch(indentSize, (newValue) => saveToStorage(STORAGE_KEYS.indentSize, newValue))
watch(wordWrapEnabled, (newValue) => {
  const wrapOption = newValue ? 'on' : 'off'
  sqlEditor?.updateOptions({ wordWrap: wrapOption })
  saveToStorage(STORAGE_KEYS.wordWrapEnabled, newValue)
})

watch(showMinimap, (newValue) => {
  sqlEditor?.updateOptions({ minimap: { enabled: newValue } })
  saveToStorage(STORAGE_KEYS.showMinimap, newValue)
})

onMounted(initEditor)
onBeforeUnmount(() => {
  themeWatcher?.()
  sqlEditor?.dispose()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
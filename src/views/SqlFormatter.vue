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
    <div class="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 backdrop-blur-sm">
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
            <select v-model="sqlDialect" class="text-xs px-2 py-1 border border-border rounded-md bg-background focus:ring-1 focus:ring-primary outline-none h-7">
              <option value="mysql">MySQL</option>
              <option value="tidb">TiDB</option>
              <option value="starrocks">StarRocks</option>
              <option value="postgresql">PostgreSQL</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs font-medium text-muted-foreground">{{ $t('common.labels.indent') }}:</span>
            <select v-model="indentSize" class="text-xs px-2 py-1 border border-border rounded-md bg-background focus:ring-1 focus:ring-primary outline-none h-7">
              <option :value="2">{{ $t('tools.sql.indent2') }}</option>
              <option :value="3">{{ $t('tools.sql.indent3') }}</option>
              <option :value="4">{{ $t('tools.sql.indent4') }}</option>
            </select>
          </div>

          <label class="flex items-center space-x-2 cursor-pointer group" :title="$t('tools.sql.wordWrap')">
            <input type="checkbox" v-model="wordWrapEnabled" class="rounded border-muted-foreground/30 text-primary focus:ring-primary w-3.5 h-3.5">
            <span class="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{{ $t('tools.sql.wordWrap') }}</span>
          </label>
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
          <h3 class="text-xs font-medium text-muted-foreground">SQL {{ $t('common.labels.input') }}</h3>
          <div class="flex items-center space-x-1">
            <button @click="pasteInput" :title="$t('common.paste')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
              <ClipboardPaste class="w-3.5 h-3.5" />
            </button>
            <button @click="copyInput" :title="$t('common.copy')" class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
              <Copy class="w-3.5 h-3.5" />
            </button>
            <div class="h-4 w-px bg-border mx-1"></div>
            <button @click="formatSQL" class="px-2 py-1 text-[10px] font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">{{ $t('common.labels.format') }}</button>
            <button @click="minifySQL" class="px-2 py-1 text-[10px] font-medium bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors">{{ $t('common.labels.minify') }}</button>
            <button @click="escapeSQL" class="px-2 py-1 text-[10px] font-medium bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors">{{ $t('tools.sql.escape') }}</button>
            <button @click="unescapeSQL" class="px-2 py-1 text-[10px] font-medium bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors">{{ $t('tools.sql.unescape') }}</button>
          </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as monaco from 'monaco-editor'
import { format } from 'sql-formatter'
import { HelpCircle, Database, Upload, Download, Trash2, ClipboardPaste, Copy, AlertCircle, X } from 'lucide-vue-next'
import { getMonacoTheme, watchThemeChange } from '../utils/monaco-theme'
import { loadFromStorage, saveToStorage } from '../utils/localStorage'

const sqlEditorRef = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
let sqlEditor: monaco.editor.IStandaloneCodeEditor | null = null
let themeWatcher: (() => void) | null = null
const showHelp = ref(false)

const STORAGE_KEYS = {
  sqlText: 'sql-text',
  sqlDialect: 'sql-dialect',
  indentSize: 'sql-indent-size',
  wordWrapEnabled: 'sql-word-wrap-enabled'
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
const errorMessage = ref('')

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
  if (isSelection && selection) {
    sqlEditor.executeEdits('sql-formatter', [{ range: selection, text: newText }])
  } else {
    sqlEditor.setValue(newText)
    sqlText.value = newText
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

const formatSQL = () => {
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
  } catch (error: any) {
    showError(error, 'SQL Format Failed')
  }
}

const splitSQLStatements = (text: string) => {
  const statements = text.split(';').map(stmt => stmt.trim()).filter(stmt => stmt.length > 0)
  return statements.map(stmt => stmt + ';').slice(0, -1).concat(statements[statements.length - 1] + (text.trim().endsWith(';') ? ';' : ''))
}

const minifySQL = () => {
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
  const { text, isSelection, selection } = getSelectedTextOrAll()
  if (!text.trim()) return
  const escaped = text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
  replaceTextInEditor(escaped, isSelection, selection)
}

const unescapeSQL = () => {
  const { text, isSelection, selection } = getSelectedTextOrAll()
  if (!text.trim()) return
  const unescaped = text.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, '\\')
  replaceTextInEditor(unescaped, isSelection, selection)
}

const initEditor = async () => {
  await nextTick()
  const editorOptions = {
    language: 'sql',
    theme: getMonacoTheme(),
    automaticLayout: true,
    minimap: { enabled: false },
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
          formatSQL()
          setTimeout(() => { isFormatting = false }, 200)
        }
      }, 150)
    })

    sqlEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {})
    themeWatcher = watchThemeChange(sqlEditor)
  }
}

const loadFile = () => fileInput.value?.click()
const handleFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (res) => {
      const content = res.target?.result as string
      sqlEditor?.setValue(content)
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
const clearAll = () => sqlEditor?.setValue('')
const pasteInput = async () => {
  try {
    const text = await navigator.clipboard.readText()
    sqlEditor?.setValue(text)
    await nextTick()
    formatSQL()
  } catch (error) { console.error('Paste failed:', error) }
}
const copyInput = () => navigator.clipboard.writeText(sqlEditor?.getValue() || '')

watch(sqlDialect, (newValue) => saveToStorage(STORAGE_KEYS.sqlDialect, newValue))
watch(indentSize, (newValue) => saveToStorage(STORAGE_KEYS.indentSize, newValue))
watch(wordWrapEnabled, (newValue) => {
  const wrapOption = newValue ? 'on' : 'off'
  sqlEditor?.updateOptions({ wordWrap: wrapOption })
  saveToStorage(STORAGE_KEYS.wordWrapEnabled, newValue)
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
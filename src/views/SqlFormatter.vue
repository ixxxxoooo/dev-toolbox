<template>
  <div class="h-screen flex flex-col bg-background text-foreground">
    <!-- 顶部标题栏 -->
    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <ToolSwitcher />
            <button @click="$router.push('/')" class="btn-icon" title="返回主页">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="flex items-center space-x-2">
              <h1 class="text-xl font-semibold">{{ $t('tools.sql.name') }}</h1>
              <div class="relative group">
                <HelpCircle class="h-5 w-5 text-muted-foreground cursor-pointer" />
                <div class="absolute top-full mt-2 w-80 bg-card border rounded-lg shadow-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p class="font-bold mb-2">{{ $t('tools.sql.help.title') }}</p>
                  <p class="mb-1">{{ $t('tools.sql.help.description') }}</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong class="font-semibold">{{ $t('tools.sql.help.editor.title') }}:</strong> {{ $t('tools.sql.help.editor.description') }}</li>
                    <li><strong class="font-semibold">{{ $t('tools.sql.help.database.title') }}:</strong> {{ $t('tools.sql.help.database.description') }}</li>
                  </ul>
                  <p class="font-bold mb-1">{{ $t('tools.sql.help.features.title') }}:</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong class="font-semibold">{{ $t('tools.sql.help.features.format') }}:</strong> {{ $t('tools.sql.help.features.formatDesc') }}</li>
                    <li><strong class="font-semibold">{{ $t('tools.sql.help.features.minify') }}:</strong> {{ $t('tools.sql.help.features.minifyDesc') }}</li>
                    <li><strong class="font-semibold">{{ $t('tools.sql.help.features.escape') }}:</strong> {{ $t('tools.sql.help.features.escapeDesc') }}</li>
                  </ul>
                  <p class="font-bold mb-1">{{ $t('tools.sql.help.buttons.title') }}:</p>
                  <ul class="list-disc list-inside text-xs">
                    <li><strong class="font-semibold">{{ $t('tools.sql.help.buttons.format') }}:</strong> {{ $t('tools.sql.help.buttons.formatDesc') }}</li>
                    <li><strong class="font-semibold">{{ $t('tools.sql.help.buttons.minify') }}:</strong> {{ $t('tools.sql.help.buttons.minifyDesc') }}</li>
                    <li><strong class="font-semibold">{{ $t('tools.sql.help.buttons.escape') }}:</strong> {{ $t('tools.sql.help.buttons.escapeDesc') }}</li>
                    <li><strong class="font-semibold">{{ $t('tools.sql.help.buttons.import') }}:</strong> {{ $t('tools.sql.help.buttons.importDesc') }}</li>
                    <li><strong class="font-semibold">{{ $t('tools.sql.help.buttons.download') }}:</strong> {{ $t('tools.sql.help.buttons.downloadDesc') }}</li>
                  </ul>
                  <p class="font-bold mb-1">{{ $t('tools.sql.help.smart.title') }}:</p>
                  <ul class="list-disc list-inside text-xs">
                    <li><strong class="font-semibold">{{ $t('tools.sql.help.smart.selection') }}:</strong> {{ $t('tools.sql.help.smart.selectionDesc') }}</li>
                    <li><strong class="font-semibold">{{ $t('tools.sql.help.smart.multiSql') }}:</strong> {{ $t('tools.sql.help.smart.multiSqlDesc') }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="loadFile" class="px-3 py-1.5 text-sm btn-secondary rounded-md">{{ $t('tools.sql.importFile') }}</button>
            <button @click="downloadFile" :disabled="!sqlText.trim()" class="px-3 py-1.5 text-sm btn-secondary rounded-md disabled:opacity-50">{{ $t('tools.sql.downloadSql') }}</button>
            <button @click="clearAll" class="px-3 py-1.5 text-sm btn-destructive rounded-md">{{ $t('common.clear') }}</button>
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>

    <!-- 控制栏 -->
    <div class="container mx-auto px-4 py-3 border-b border-border">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2">
            <span class="text-sm">{{ $t('tools.sql.database') }}:</span>
            <select v-model="sqlDialect" class="text-sm px-2 py-1 border border-border rounded bg-background">
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="tidb">TiDB</option>
              <option value="sqlite">SQLite</option>
              <option value="mariadb">MariaDB</option>
              <option value="bigquery">BigQuery</option>
              <option value="redshift">Redshift</option>
              <option value="snowflake">Snowflake</option>
              <option value="spark">Spark SQL</option>
              <option value="trino">Trino</option>
            </select>
          </label>
          <label class="flex items-center space-x-2">
            <span class="text-sm">{{ $t('tools.sql.indent') }}:</span>
            <select v-model="indentSize" class="text-sm px-2 py-1 border border-border rounded bg-background">
              <option :value="2">{{ $t('tools.sql.indent2') }}</option>
              <option :value="3">{{ $t('tools.sql.indent3') }}</option>
              <option :value="4">{{ $t('tools.sql.indent4') }}</option>
            </select>
          </label>
        </div>
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2" title="自动换行">
            <input type="checkbox" v-model="wordWrapEnabled" class="rounded">
            <span class="text-sm">{{ $t('tools.sql.wordWrap') }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- 主体内容 -->
    <main class="flex-1 container mx-auto px-4 py-4 flex flex-col">
      <div class="flex-1 flex flex-col">
        <!-- SQL编辑器面板 -->
        <div class="flex flex-col border border-border rounded-lg overflow-hidden flex-1">
          <div class="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <h3 class="text-sm font-medium">{{ $t('tools.sql.editor') }}</h3>
            <div class="flex items-center space-x-2">
              <button @click="pasteInput" class="text-xs px-2 py-1 btn-secondary rounded">{{ $t('common.paste') }}</button>
              <button @click="copyInput" class="text-xs px-2 py-1 btn-secondary rounded">{{ $t('common.copy') }}</button>
              <button @click="formatSQL" class="text-xs px-2 py-1 btn-primary rounded">{{ $t('tools.sql.format') }}</button>
              <button @click="minifySQL" class="text-xs px-2 py-1 btn-secondary rounded">{{ $t('tools.sql.minify') }}</button>
              <button @click="escapeSQL" class="text-xs px-2 py-1 btn-secondary rounded">{{ $t('tools.sql.escape') }}</button>
              <button @click="unescapeSQL" class="text-xs px-2 py-1 btn-secondary rounded">{{ $t('tools.sql.unescape') }}</button>
            </div>
          </div>
          <div class="flex-1 relative">
            <div ref="sqlEditorRef" class="absolute inset-0"></div>
          </div>
        </div>
      </div>
      <input ref="fileInput" type="file" class="hidden" accept=".sql,.txt" @change="handleFileSelect" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as monaco from 'monaco-editor'
import { format } from 'sql-formatter'
import { HelpCircle } from 'lucide-vue-next'
import ToolSwitcher from '../components/ToolSwitcher.vue'
import ThemeToggleButton from '../components/ThemeToggleButton.vue'
import { getMonacoTheme, watchThemeChange } from '../utils/monaco-theme'
import { loadFromStorage, saveToStorage } from '../utils/localStorage'

// Refs
const sqlEditorRef = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Monaco Editor Instance
let sqlEditor: monaco.editor.IStandaloneCodeEditor | null = null

// 主题监听器清理函数
let themeWatcher: (() => void) | null = null

// 本地存储键名
const STORAGE_KEYS = {
  sqlText: 'sql-text',
  sqlDialect: 'sql-dialect',
  indentSize: 'sql-indent-size',
  wordWrapEnabled: 'sql-word-wrap-enabled'
}

// State - 从本地存储加载初始值
const sqlText = ref(loadFromStorage(STORAGE_KEYS.sqlText, `SELECT u.id, u.name, u.email, p.title, p.content, COUNT(c.id) as comment_count FROM users u LEFT JOIN posts p ON u.id = p.user_id LEFT JOIN comments c ON p.id = c.post_id WHERE u.created_at >= '2023-01-01' AND u.status = 'active' GROUP BY u.id, p.id ORDER BY u.created_at DESC, comment_count DESC LIMIT 10;`))
const sqlDialect = ref(loadFromStorage(STORAGE_KEYS.sqlDialect, 'mysql'))
const indentSize = ref(loadFromStorage(STORAGE_KEYS.indentSize, 2))
const wordWrapEnabled = ref(loadFromStorage(STORAGE_KEYS.wordWrapEnabled, true))

// Functions
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
    // 替换选中的文本
    sqlEditor.executeEdits('sql-formatter', [{
      range: selection,
      text: newText
    }])
  } else {
    // 替换全部文本
    sqlEditor.setValue(newText)
    sqlText.value = newText
  }
}

const formatSQL = () => {
  const { text, isSelection, selection } = getSelectedTextOrAll()
  if (!text.trim()) return

  try {
    const formatted = format(text, {
      language: sqlDialect.value as any,
      tabWidth: indentSize.value,
      keywordCase: 'upper',
      functionCase: 'upper',
      dataTypeCase: 'upper'
    })
    replaceTextInEditor(formatted, isSelection, selection)
  } catch (error: any) {
    console.error('格式化失败:', error.message)
  }
}

const splitSQLStatements = (text: string) => {
  // 简单的SQL语句分割，按分号分割并保留分号
  const statements = text.split(';').map(stmt => stmt.trim()).filter(stmt => stmt.length > 0)
  return statements.map(stmt => stmt + ';').slice(0, -1).concat(statements[statements.length - 1] + (text.trim().endsWith(';') ? ';' : ''))
}

const minifySQL = () => {
  const { text, isSelection, selection } = getSelectedTextOrAll()
  if (!text.trim()) return

  try {
    // 检查是否包含多个SQL语句（通过分号判断）
    const hasSemicolon = text.includes(';')

    if (hasSemicolon && !isSelection) {
      // 多段SQL，各自压缩
      const statements = splitSQLStatements(text)
      const minifiedStatements = statements.map(stmt => {
        if (!stmt.trim()) return stmt
        try {
          const formatted = format(stmt, {
            language: sqlDialect.value as any,
            tabWidth: 0,
            keywordCase: 'upper'
          })
          return formatted.replace(/\s+/g, ' ').replace(/\s*([(),;])\s*/g, '$1').trim()
        } catch (error) {
          // 如果某个语句格式化失败，返回原始语句
          return stmt.replace(/\s+/g, ' ').trim()
        }
      })

      // 用换行分隔各个压缩后的语句
      const result = minifiedStatements.join('\n')
      replaceTextInEditor(result, isSelection, selection)
    } else {
      // 单段SQL或选中文本，正常压缩
      const formatted = format(text, {
        language: sqlDialect.value as any,
        tabWidth: 0,
        keywordCase: 'upper'
      })
      const minified = formatted.replace(/\s+/g, ' ').replace(/\s*([(),;])\s*/g, '$1').trim()
      replaceTextInEditor(minified, isSelection, selection)
    }
  } catch (error: any) {
    console.error('压缩失败:', error.message)
  }
}

const escapeSQL = () => {
  const { text, isSelection, selection } = getSelectedTextOrAll()
  if (!text.trim()) return

  const escaped = text
    .replace(/\\/g, '\\\\')  // 转义反斜杠
    .replace(/'/g, "\\'")    // 转义单引号
    .replace(/"/g, '\\"')    // 转义双引号
    .replace(/\n/g, '\\n')   // 转义换行
    .replace(/\r/g, '\\r')   // 转义回车
    .replace(/\t/g, '\\t')   // 转义制表符

  replaceTextInEditor(escaped, isSelection, selection)
}

const unescapeSQL = () => {
  const { text, isSelection, selection } = getSelectedTextOrAll()
  if (!text.trim()) return

  const unescaped = text
    .replace(/\\n/g, '\n')   // 去转义换行
    .replace(/\\r/g, '\r')   // 去转义回车
    .replace(/\\t/g, '\t')   // 去转义制表符
    .replace(/\\"/g, '"')    // 去转义双引号
    .replace(/\\'/g, "'")    // 去转义单引号
    .replace(/\\\\/g, '\\')  // 去转义反斜杠

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
  }

  if (sqlEditorRef.value) {
    sqlEditor = monaco.editor.create(sqlEditorRef.value, {
      value: sqlText.value,
      ...editorOptions,
    })

    sqlEditor.onDidChangeModelContent(() => {
      sqlText.value = sqlEditor?.getValue() || ''
      saveToStorage(STORAGE_KEYS.sqlText, sqlText.value)
    })

    // 禁用保存快捷键 (Ctrl+S / Cmd+S)
    sqlEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // 禁用默认保存行为，什么都不做
    })

    // 设置主题监听器
    themeWatcher = watchThemeChange(sqlEditor)
  }
}

// Toolbar actions
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

const clearAll = () => {
  sqlEditor?.setValue('')
}

const pasteInput = async () => {
  try {
    const text = await navigator.clipboard.readText()
    sqlEditor?.setValue(text)
  } catch (error) {
    console.error('Failed to paste:', error)
  }
}

const copyInput = () => {
  navigator.clipboard.writeText(sqlEditor?.getValue() || '')
}

// Watchers
// 监听状态变化并保存到本地存储
watch(sqlDialect, (newValue: string) => {
  saveToStorage(STORAGE_KEYS.sqlDialect, newValue)
})

watch(indentSize, (newValue: number) => {
  saveToStorage(STORAGE_KEYS.indentSize, newValue)
})

watch(wordWrapEnabled, (newValue: boolean) => {
  const wrapOption = newValue ? 'on' : 'off'
  sqlEditor?.updateOptions({ wordWrap: wrapOption })
  saveToStorage(STORAGE_KEYS.wordWrapEnabled, newValue)
})

// Lifecycle
onMounted(initEditor)

onBeforeUnmount(() => {
  // 清理主题监听器
  themeWatcher?.()
  // 销毁编辑器实例
  sqlEditor?.dispose()
})
</script>
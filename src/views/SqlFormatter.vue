<template>
  <div class="h-screen flex flex-col bg-background text-foreground">
    <!-- 顶部标题栏 -->
    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <ToolSwitcher />
            <button @click="$router.push('/')" class="p-2 rounded-lg hover:bg-secondary transition-colors" title="返回主页">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="flex items-center space-x-2">
              <h1 class="text-xl font-semibold">SQL 格式化</h1>
              <div class="relative group">
                <HelpCircle class="h-5 w-5 text-muted-foreground cursor-pointer" />
                <div class="absolute top-full mt-2 w-80 bg-card border rounded-lg shadow-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p class="font-bold mb-2">SQL 格式化工具说明</p>
                  <p class="mb-1">这是一个专业的SQL格式化工具，支持多种数据库语法的美化和处理。</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong class="font-semibold">SQL编辑器:</strong> 支持SQL语法高亮、实时编辑和代码折叠。</li>
                    <li><strong class="font-semibold">多数据库支持:</strong> 支持MySQL、PostgreSQL、TiDB、SQLite等。</li>
                  </ul>
                  <p class="font-bold mb-1">核心功能:</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong class="font-semibold">格式化:</strong> 一键美化SQL语句，提升可读性。</li>
                    <li><strong class="font-semibold">压缩:</strong> 一键移除多余空白字符，生成紧凑SQL。</li>
                    <li><strong class="font-semibold">转义/去转义:</strong> 一键处理字符串转义字符。</li>
                  </ul>
                  <p class="font-bold mb-1">按钮说明:</p>
                  <ul class="list-disc list-inside text-xs">
                    <li><strong class="font-semibold">格式化:</strong> 美化选中文本或全部SQL语句。</li>
                    <li><strong class="font-semibold">压缩:</strong> 压缩选中文本或全部SQL，多段SQL各自压缩。</li>
                    <li><strong class="font-semibold">转义/去转义:</strong> 处理选中文本或全部内容的转义字符。</li>
                    <li><strong class="font-semibold">导入文件:</strong> 从本地.sql文件加载内容到编辑器。</li>
                    <li><strong class="font-semibold">下载SQL:</strong> 将编辑器内容下载为.sql文件。</li>
                  </ul>
                  <p class="font-bold mb-1">智能处理:</p>
                  <ul class="list-disc list-inside text-xs">
                    <li><strong class="font-semibold">选中文本优先:</strong> 有选中文本时仅处理选中部分。</li>
                    <li><strong class="font-semibold">多段SQL压缩:</strong> 自动识别多个SQL语句，各自压缩。</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="loadFile" class="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors">导入文件</button>
            <button @click="downloadFile" :disabled="!sqlText.trim()" class="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors disabled:opacity-50">下载SQL</button>
            <button @click="clearAll" class="px-3 py-1.5 text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md transition-colors">清空</button>
          </div>
        </div>
      </div>
    </header>

    <!-- 控制栏 -->
    <div class="container mx-auto px-4 py-3 border-b border-border">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2">
            <span class="text-sm">数据库:</span>
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
            <span class="text-sm">缩进:</span>
            <select v-model="indentSize" class="text-sm px-2 py-1 border border-border rounded bg-background">
              <option :value="2">2空格</option>
              <option :value="3">3空格</option>
              <option :value="4">4空格</option>
            </select>
          </label>
        </div>
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2" title="自动换行">
            <input type="checkbox" v-model="wordWrapEnabled" class="rounded">
            <span class="text-sm">自动换行</span>
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
            <h3 class="text-sm font-medium">SQL 编辑器</h3>
            <div class="flex items-center space-x-2">
              <button @click="pasteInput" class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80">粘贴</button>
              <button @click="copyInput" class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80">复制</button>
              <button @click="formatSQL" class="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90">格式化</button>
              <button @click="minifySQL" class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80">压缩</button>
              <button @click="escapeSQL" class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80">转义</button>
              <button @click="unescapeSQL" class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80">去转义</button>
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

// Refs
const sqlEditorRef = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Monaco Editor Instance
let sqlEditor: monaco.editor.IStandaloneCodeEditor | null = null

// State
const sqlText = ref(`SELECT u.id, u.name, u.email, p.title, p.content, COUNT(c.id) as comment_count FROM users u LEFT JOIN posts p ON u.id = p.user_id LEFT JOIN comments c ON p.id = c.post_id WHERE u.created_at >= '2023-01-01' AND u.status = 'active' GROUP BY u.id, p.id ORDER BY u.created_at DESC, comment_count DESC LIMIT 10;`)
const sqlDialect = ref('mysql')
const indentSize = ref(2)
const wordWrapEnabled = ref(true)

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
    theme: 'vs-dark',
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
    })
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
watch(wordWrapEnabled, (newValue) => {
  const wrapOption = newValue ? 'on' : 'off'
  sqlEditor?.updateOptions({ wordWrap: wrapOption })
})

// Lifecycle
onMounted(initEditor)

onBeforeUnmount(() => {
  sqlEditor?.dispose()
})
</script>
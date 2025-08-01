<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部导航栏 -->
    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="$router.push('/')"
              class="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 class="text-xl font-semibold text-foreground">文本对比工具</h1>
          </div>
          
          <div class="flex items-center space-x-2">
            <button
              @click="loadFile('left')"
              class="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            >
              导入左侧文件
            </button>
            <button
              @click="loadFile('right')"
              class="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            >
              导入右侧文件
            </button>
            <button
              @click="clearAll"
              class="px-3 py-1.5 text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md transition-colors"
            >
              清空全部
            </button>
            <button
              @click="copyResult"
              class="px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
            >
              复制结果
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="container mx-auto px-4 py-4 h-[calc(100vh-120px)]">
      <div class="grid grid-cols-2 gap-4 h-full">
        <!-- 左侧输入 -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-foreground">原始文本</h3>
            <div class="flex items-center space-x-2">
              <button
                @click="pasteText('left')"
                class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors"
              >
                粘贴
              </button>
              <button
                @click="leftText = ''"
                class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors"
              >
                清空
              </button>
            </div>
          </div>
          <textarea
            v-model="leftText"
            placeholder="请输入或粘贴原始文本..."
            class="flex-1 p-3 bg-background border border-border rounded-md text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            @input="calculateDiff"
          ></textarea>
          <div class="text-xs text-muted-foreground mt-1">
            字符数: {{ leftText.length }}
          </div>
        </div>

        <!-- 右侧输入 -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-foreground">修改文本</h3>
            <div class="flex items-center space-x-2">
              <button
                @click="pasteText('right')"
                class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors"
              >
                粘贴
              </button>
              <button
                @click="rightText = ''"
                class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors"
              >
                清空
              </button>
            </div>
          </div>
          <textarea
            v-model="rightText"
            placeholder="请输入或粘贴修改后的文本..."
            class="flex-1 p-3 bg-background border border-border rounded-md text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            @input="calculateDiff"
          ></textarea>
          <div class="text-xs text-muted-foreground mt-1">
            字符数: {{ rightText.length }}
          </div>
        </div>
      </div>

      <!-- 差异显示区域 -->
      <div v-if="diffResult" class="mt-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-foreground">差异结果</h3>
          <div class="flex items-center space-x-2">
            <label class="flex items-center space-x-1 text-sm">
              <input
                type="checkbox"
                v-model="showLineNumbers"
                class="rounded"
              >
              <span class="text-sm">显示行号</span>
            </label>
            <select
              v-model="diffType"
              class="text-sm px-2 py-1 border border-border rounded bg-background"
              @change="calculateDiff"
            >
              <option value="chars">字符级差异</option>
              <option value="words">单词级差异</option>
              <option value="lines">行级差异</option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 h-64">
          <!-- 左侧差异 -->
          <div class="border border-border rounded-md overflow-auto">
            <div class="bg-muted px-3 py-2 text-sm font-medium border-b">原始文本差异</div>
            <div class="p-3 font-mono text-sm">
              <div
                v-for="(line, index) in diffResult.left"
                :key="'left-' + index"
                class="leading-relaxed"
                :class="getLineClass(line.type)"
              >
                <span v-if="showLineNumbers" class="text-muted-foreground mr-2">{{ line.lineNumber }}</span>
                <span v-html="line.content"></span>
              </div>
            </div>
          </div>

          <!-- 右侧差异 -->
          <div class="border border-border rounded-md overflow-auto">
            <div class="bg-muted px-3 py-2 text-sm font-medium border-b">修改文本差异</div>
            <div class="p-3 font-mono text-sm">
              <div
                v-for="(line, index) in diffResult.right"
                :key="'right-' + index"
                class="leading-relaxed"
                :class="getLineClass(line.type)"
              >
                <span v-if="showLineNumbers" class="text-muted-foreground mr-2">{{ line.lineNumber }}</span>
                <span v-html="line.content"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 差异统计 -->
        <div class="mt-4 flex items-center space-x-4 text-sm">
          <span class="text-muted-foreground">
            添加: <span class="text-green-600 font-medium">{{ diffStats.added }}</span>
          </span>
          <span class="text-muted-foreground">
            删除: <span class="text-red-600 font-medium">{{ diffStats.removed }}</span>
          </span>
          <span class="text-muted-foreground">
            修改: <span class="text-yellow-600 font-medium">{{ diffStats.modified }}</span>
          </span>
        </div>
      </div>
    </main>

    <!-- 文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept=".txt,.md,.js,.json,.html,.css,.py,.java,.c,.cpp,.xml,.yaml,.yml"
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
declare class DiffMatchPatch {
  diff_main(text1: string, text2: string): [number, string][];
  diff_cleanupSemantic(diffs: [number, string][]): void;
  diff_lineMode_(text1: string, text2: string): [number, string][];
  diff_wordMode_(text1: string, text2: string): [number, string][];
}

const DiffMatchPatchClass = (window as any).diff_match_patch || DiffMatchPatch;

interface DiffLine {
  type: 'equal' | 'insert' | 'delete'
  content: string
  lineNumber?: number
}

interface DiffResult {
  left: DiffLine[]
  right: DiffLine[]
}

interface DiffStats {
  added: number
  removed: number
  modified: number
}

// 状态变量
const leftText = ref('')
const rightText = ref('')
const diffResult = ref<DiffResult | null>(null)
const diffStats = ref<DiffStats>({ added: 0, removed: 0, modified: 0 })
const showLineNumbers = ref(false)
const diffType = ref<'chars' | 'words' | 'lines'>('chars')
const fileInput = ref<HTMLInputElement | null>(null)
const activeFileSide = ref<'left' | 'right' | null>(null)

// 计算差异
const calculateDiff = () => {
  if (!leftText.value && !rightText.value) {
    diffResult.value = null
    return
  }

  const dmp = new DiffMatchPatchClass()
  let diffs: any[]

  switch (diffType.value) {
    case 'words':
      diffs = dmp.diff_wordMode_(leftText.value, rightText.value)
      break
    case 'lines':
      diffs = dmp.diff_lineMode_(leftText.value, rightText.value)
      break
    default:
      diffs = dmp.diff_main(leftText.value, rightText.value)
      break
  }

  dmp.diff_cleanupSemantic(diffs)

  const leftLines: DiffLine[] = []
  const rightLines: DiffLine[] = []
  let leftLineNumber = 1
  let rightLineNumber = 1

  let stats = { added: 0, removed: 0, modified: 0 }

  diffs.forEach(([operation, text]: [number, string]) => {
    const lines = text.split('\n')
    
    lines.forEach((line, index) => {
      if (line || index < lines.length - 1) {
        const escapedLine = escapeHtml(line || ' ')
        
        if (operation === 0) { // equal
          leftLines.push({ type: 'equal', content: escapedLine, lineNumber: leftLineNumber })
          rightLines.push({ type: 'equal', content: escapedLine, lineNumber: rightLineNumber })
          leftLineNumber++
          rightLineNumber++
        } else if (operation === -1) { // delete
          leftLines.push({ type: 'delete', content: escapedLine, lineNumber: leftLineNumber })
          leftLineNumber++
          stats.removed++
        } else if (operation === 1) { // insert
          rightLines.push({ type: 'insert', content: escapedLine, lineNumber: rightLineNumber })
          rightLineNumber++
          stats.added++
        }
      }
    })
  })

  // 计算修改的行数
  stats.modified = Math.max(stats.added, stats.removed)

  diffResult.value = { left: leftLines, right: rightLines }
  diffStats.value = stats
}

// 转义 HTML
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// 获取行样式
const getLineClass = (type: string): string => {
  switch (type) {
    case 'insert':
      return 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100'
    case 'delete':
      return 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100'
    default:
      return ''
  }
}

// 文件操作
const loadFile = (side: 'left' | 'right') => {
  activeFileSide.value = side
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file && activeFileSide.value) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (activeFileSide.value === 'left') {
        leftText.value = content
      } else {
        rightText.value = content
      }
      calculateDiff()
    }
    reader.readAsText(file)
  }
  
  // 清空文件输入
  target.value = ''
}

// 粘贴文本
const pasteText = async (side: 'left' | 'right') => {
  try {
    const text = await navigator.clipboard.readText()
    if (side === 'left') {
      leftText.value = text
    } else {
      rightText.value = text
    }
    calculateDiff()
  } catch (err) {
    console.error('无法读取剪贴板:', err)
  }
}

// 清空全部
const clearAll = () => {
  leftText.value = ''
  rightText.value = ''
  diffResult.value = null
  diffStats.value = { added: 0, removed: 0, modified: 0 }
}

// 复制结果
const copyResult = async () => {
  if (!diffResult.value) return
  
  let result = '文本对比结果\n\n'
  result += `原始文本:\n${leftText.value}\n\n`
  result += `修改文本:\n${rightText.value}\n\n`
  result += `差异统计:\n`
  result += `添加: ${diffStats.value.added} 行\n`
  result += `删除: ${diffStats.value.removed} 行\n`
  result += `修改: ${diffStats.value.modified} 行\n\n`
  
  try {
    await navigator.clipboard.writeText(result)
  } catch (err) {
    console.error('无法复制到剪贴板:', err)
  }
}

// 监听拖拽事件
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const handleDrop = (e: DragEvent, side: 'left' | 'right') => {
  e.preventDefault()
  
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (side === 'left') {
        leftText.value = content
      } else {
        rightText.value = content
      }
      calculateDiff()
    }
    reader.readAsText(file)
  }
}

onMounted(() => {
  // 添加拖拽事件监听器
  document.addEventListener('dragover', handleDragOver)
  document.addEventListener('drop', (e) => handleDrop(e, 'left'))
})
</script>

<style scoped>
/* 差异高亮样式 */
:deep(.diff-delete) {
  background-color: rgba(239, 68, 68, 0.2);
  text-decoration: line-through;
}

:deep(.diff-insert) {
  background-color: rgba(34, 197, 94, 0.2);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
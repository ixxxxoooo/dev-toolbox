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
            <h1 class="text-xl font-semibold text-foreground">JSON 格式化工具</h1>
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="loadFile"
              class="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            >
              导入文件
            </button>
            <button
              @click="downloadFile"
              :disabled="!formattedJson"
              class="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors disabled:opacity-50"
            >
              下载结果
            </button>
            <button
              @click="clearAll"
              class="px-3 py-1.5 text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md transition-colors"
            >
              清空
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="container mx-auto px-4 py-4">
      <!-- 操作选项 -->
      <div class="mb-4 bg-card border border-border rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                v-model="operation"
                value="format"
                class="rounded"
              >
              <span class="text-sm">格式化</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                v-model="operation"
                value="minify"
                class="rounded"
              >
              <span class="text-sm">压缩</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                v-model="operation"
                value="validate"
                class="rounded"
              >
              <span class="text-sm">验证</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                v-model="operation"
                value="convert"
                class="rounded"
              >
              <span class="text-sm">转换</span>
            </label>
          </div>

          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <span class="text-sm">缩进:</span>
              <select
                v-model="indentSize"
                class="text-sm px-2 py-1 border border-border rounded bg-background"
              >
                <option :value="2">2空格</option>
                <option :value="4">4空格</option>
                <option :value="8">8空格</option>
                <option :value="'\t'">Tab</option>
              </select>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="autoProcess"
                class="rounded"
              >
              <span class="text-sm">自动处理</span>
            </label>
          </div>
        </div>

        <!-- 转换选项 -->
        <div v-if="operation === 'convert'" class="mt-4 pt-4 border-t border-border">
          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <span class="text-sm">从:</span>
              <select
                v-model="convertFrom"
                class="text-sm px-2 py-1 border border-border rounded bg-background"
              >
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="xml">XML</option>
                <option value="csv">CSV</option>
              </select>
            </label>
            <label class="flex items-center space-x-2">
              <span class="text-sm">到:</span>
              <select
                v-model="convertTo"
                class="text-sm px-2 py-1 border border-border rounded bg-background"
              >
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="xml">XML</option>
                <option value="csv">CSV</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 h-[calc(100vh-260px)]">
        <!-- 输入区域 -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-foreground">输入</h3>
            <div class="flex items-center space-x-2">
              <button
                @click="pasteInput"
                class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors"
              >
                粘贴
              </button>
              <button
                @click="copyInput"
                :disabled="!inputText"
                class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                复制
              </button>
              <button
                @click="inputText = ''"
                class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors"
              >
                清空
              </button>
            </div>
          </div>
          <textarea
            v-model="inputText"
            :placeholder="getInputPlaceholder()"
            class="flex-1 p-3 bg-background border border-border rounded-md text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            @input="handleInput"
          ></textarea>
          <div class="text-xs text-muted-foreground mt-1">
            {{ getInputStats() }}
          </div>
        </div>

        <!-- 输出区域 -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-foreground">输出</h3>
            <div class="flex items-center space-x-2">
              <button
                @click="copyOutput"
                :disabled="!formattedJson"
                class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                复制
              </button>
              <button
                @click="useAsInput"
                :disabled="!formattedJson"
                class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                作为输入
              </button>
            </div>
          </div>
          <textarea
            v-model="formattedJson"
            readonly
            :placeholder="getOutputPlaceholder()"
            class="flex-1 p-3 bg-muted border border-border rounded-md text-sm font-mono resize-none focus:outline-none"
          ></textarea>
          <div class="text-xs text-muted-foreground mt-1">
            {{ getOutputStats() }}
          </div>
        </div>
      </div>

      <!-- 验证结果 -->
      <div v-if="operation === 'validate' && validationResult" class="mt-4 bg-card border border-border rounded-lg p-4">
        <h3 class="text-sm font-medium text-foreground mb-2">验证结果</h3>
        <div :class="validationResult.valid ? 'text-green-600' : 'text-red-600'" class="text-sm">
          {{ validationResult.message }}
        </div>
        <div v-if="validationResult.error" class="mt-2 text-sm text-muted-foreground">
          <strong>错误详情:</strong> {{ validationResult.error }}
        </div>
      </div>

      <!-- JSON路径查询 -->
      <div class="mt-4 bg-card border border-border rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-foreground">JSON路径查询</h3>
          <button
            @click="executeQuery"
            :disabled="!jsonPathQuery || !isValidJson"
            class="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            执行查询
          </button>
        </div>
        <div class="flex space-x-2">
          <input
            v-model="jsonPathQuery"
            placeholder="例如: $.store.book[0].title"
            class="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div v-if="queryResult" class="mt-2 text-sm">
          <strong>查询结果:</strong> {{ queryResult }}
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="mt-4 bg-destructive/10 border border-destructive rounded-lg p-4">
        <div class="flex items-center">
          <svg class="h-4 w-4 text-destructive mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm text-destructive">{{ error }}</span>
        </div>
      </div>
    </main>

    <!-- 文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept=".json,.js,.yaml,.yml,.xml,.csv"
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

declare global {
  interface Window {
    require: any;
  }
}

interface FileInfo {
  name: string
  size: number
  type: string
  lastModified: Date
}

interface ValidationResult {
  valid: boolean
  message: string
  error?: string
}



// 状态变量
const inputText = ref<string>('')
const formattedJson = ref<string>('')
const operation = ref<'format' | 'minify' | 'validate' | 'convert'>('format')
const indentSize = ref<number | string>(2)
const autoProcess = ref<boolean>(true)
const fileInfo = ref<FileInfo | null>(null)
const error = ref<string>('')
const fileInput = ref<HTMLInputElement | null>(null)
const convertFrom = ref<string>('json')
const convertTo = ref<string>('json')
const jsonPathQuery = ref<string>('')
const queryResult = ref<string>('')

// 计算属性
const isValidJson = computed<boolean>(() => {
  try {
    if (inputText.value.trim()) {
      JSON.parse(inputText.value)
      return true
    }
    return false
  } catch {
    return false
  }
})

const validationResult = ref<ValidationResult | null>(null)

// 监听输入变化
watch([inputText, operation, indentSize, convertFrom, convertTo], () => {
  if (autoProcess.value) {
    processJson()
  }
})

// 处理JSON
const processJson = () => {
  error.value = ''
  validationResult.value = null

  if (!inputText.value.trim()) {
    formattedJson.value = ''
    return
  }

  try {
    switch (operation.value) {
      case 'format':
        formatJson()
        break
      case 'minify':
        minifyJson()
        break
      case 'validate':
        validateJson()
        break
      case 'convert':
        convertData()
        break
    }
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : '处理失败'
    formattedJson.value = ''
  }
}

// JSON格式化
const formatJson = () => {
  const json = JSON.parse(inputText.value)
  const indent = indentSize.value === '\t' ? '\t' : ' '.repeat(indentSize.value as number)
  formattedJson.value = JSON.stringify(json, null, indent)
}

// JSON压缩
const minifyJson = () => {
  const json = JSON.parse(inputText.value)
  formattedJson.value = JSON.stringify(json)
}

// JSON验证
const validateJson = () => {
  try {
    JSON.parse(inputText.value)
    validationResult.value = {
      valid: true,
      message: 'JSON格式正确'
    }
    formattedJson.value = inputText.value
  } catch (err) {
    validationResult.value = {
      valid: false,
      message: 'JSON格式错误',
      error: err instanceof Error ? err.message : '未知错误'
    }
    formattedJson.value = ''
  }
}

// 数据转换
const convertData = () => {
  switch (`${convertFrom.value}-${convertTo.value}`) {
    case 'json-yaml':
      convertJsonToYaml()
      break
    case 'yaml-json':
      convertYamlToJson()
      break
    case 'json-xml':
      convertJsonToXml()
      break
    case 'xml-json':
      convertXmlToJson()
      break
    case 'json-csv':
      convertJsonToCsv()
      break
    case 'csv-json':
      convertCsvToJson()
      break
    default:
      formattedJson.value = inputText.value
  }
}

// 转换函数
const convertJsonToYaml = (): void => {
  const json = JSON.parse(inputText.value)
  formattedJson.value = jsonToYaml(json, 0)
}

const convertYamlToJson = (): void => {
  // 简化的YAML转JSON
  const yaml = inputText.value
  const lines = yaml.split('\n')
  const result: Record<string, any> = {}
  let current: Record<string, any> = result
  const stack: Record<string, any>[] = []

  lines.forEach((line: string) => {
    const match = line.match(/^(\s*)([^:]+):\s*(.*)$/)
    if (match) {
      const [, spaces, key, value] = match
      const level = spaces.length / 2

      if (level === 0) {
        current = result
      } else {
        while (stack.length > level) {
          stack.pop()
        }
        current = stack[stack.length - 1] || result
      }

      if (value.trim()) {
        current[key] = isNaN(Number(value)) ? value : Number(value)
      } else {
        current[key] = {}
        stack.push(current[key])
        current = current[key]
      }
    }
  })

  formattedJson.value = JSON.stringify(result, null, 2)
}

const convertJsonToXml = (): void => {
  const json = JSON.parse(inputText.value)
  formattedJson.value = jsonToXml(json, 'root')
}

const convertXmlToJson = (): void => {
  const xml = inputText.value
  // 简化的XML转JSON
  const json = xml.replace(/<([^>]+)>([^<]*)<\/\1>/g, (_, tag: string, content: string) => {
    return `"${tag}": "${content.trim()}"`
  })
  formattedJson.value = `{${json}}`
}

const convertJsonToCsv = (): void => {
  const json = JSON.parse(inputText.value)
  if (Array.isArray(json)) {
    const headers = Object.keys(json[0] || {})
    const rows = json.map((item: any) => headers.map((header: string) => item[header] || ''))
    formattedJson.value = [headers.join(','), ...rows.map((row: string[]) => row.join(','))].join('\n')
  } else {
    formattedJson.value = '需要数组格式的JSON'
  }
}

const convertCsvToJson = (): void => {
  const csv = inputText.value
  const lines = csv.split('\n')
  if (lines.length < 2) {
    formattedJson.value = '[]'
    return
  }

  const headers = lines[0].split(',').map((h: string) => h.trim())
  const json = lines.slice(1).map((line: string) => {
    const values = line.split(',').map((v: string) => v.trim())
    const obj: any = {}
    headers.forEach((header: string, index: number) => {
      obj[header] = values[index] || ''
    })
    return obj
  })

  formattedJson.value = JSON.stringify(json, null, 2)
}

// JSON路径查询
const executeQuery = () => {
  if (!jsonPathQuery.value || !isValidJson.value) return

  try {
    const json = JSON.parse(inputText.value)
    const result = evaluateJsonPath(json, jsonPathQuery.value)
    queryResult.value = JSON.stringify(result, null, 2)
  } catch (err) {
    queryResult.value = '查询错误: ' + (err instanceof Error ? err.message : '未知错误')
  }
}

const evaluateJsonPath = (obj: any, path: string): any => {
  // 简化的JSONPath实现
  const parts = path.replace(/^\$/, '').split('.').filter(Boolean)
  let current = obj

  for (const part of parts) {
    if (part.includes('[')) {
      const [key, index] = part.split('[')
      current = current[key]
      if (index) {
        const idx = parseInt(index.replace(']', ''))
        current = current[idx]
      }
    } else {
      current = current[part]
    }

    if (current === undefined) return undefined
  }

  return current
}

// 工具函数
const jsonToYaml = (obj: any, indent: number): string => {
  if (typeof obj !== 'object' || obj === null) {
    return String(obj)
  }

  let yaml = ''
  const spaces = '  '.repeat(indent)

  if (Array.isArray(obj)) {
    obj.forEach((item: any) => {
      if (typeof item === 'object' && item !== null) {
        yaml += `${spaces}-\n${jsonToYaml(item, indent + 1)}`
      } else {
        yaml += `${spaces}- ${item}\n`
      }
    })
  } else {
    Object.keys(obj).forEach((key: string) => {
      const value = obj[key]
      if (typeof value === 'object' && value !== null) {
        yaml += `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`
      } else {
        yaml += `${spaces}${key}: ${value}\n`
      }
    })
  }

  return yaml
}

const jsonToXml = (obj: any, rootName: string): string => {
  if (typeof obj !== 'object' || obj === null) {
    return `<${rootName}>${String(obj)}</${rootName}>`
  }

  let xml = `<${rootName}>`

  if (Array.isArray(obj)) {
    obj.forEach((item: any) => {
      xml += jsonToXml(item, 'item')
    })
  } else {
    Object.keys(obj).forEach((key: string) => {
      xml += jsonToXml(obj[key], key)
    })
  }

  xml += `</${rootName}>`
  return xml
}

// 输入处理
const handleInput = () => {
  if (autoProcess.value) {
    processJson()
  }
}

// 获取输入提示
const getInputPlaceholder = (): string => {
  switch (convertFrom.value) {
    case 'json':
      return '请输入JSON数据...'
    case 'yaml':
      return '请输入YAML数据...'
    case 'xml':
      return '请输入XML数据...'
    case 'csv':
      return '请输入CSV数据...'
    default:
      return '请输入数据...'
  }
}

// 获取输出提示
const getOutputPlaceholder = (): string => {
  switch (operation.value) {
    case 'format':
      return '格式化后的JSON将显示在这里...'
    case 'minify':
      return '压缩后的JSON将显示在这里...'
    case 'validate':
      return '验证结果将显示在这里...'
    case 'convert':
      return '转换后的结果将显示在这里...'
    default:
      return '结果将显示在这里...'
  }
}

// 获取输入统计
const getInputStats = (): string => {
  const length = inputText.value.length
  const lines = inputText.value.split('\n').length
  return `字符: ${length} | 行数: ${lines}`
}

// 获取输出统计
const getOutputStats = (): string => {
  const length = formattedJson.value.length
  const lines = formattedJson.value.split('\n').length
  return `字符: ${length} | 行数: ${lines}`
}

// 文件操作
const loadFile = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    fileInfo.value = {
      name: file.name,
      size: file.size,
      type: file.type || 'application/json',
      lastModified: new Date(file.lastModified)
    }

    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      inputText.value = e.target?.result as string
      processJson()
    }
    reader.readAsText(file)
  }

  // 清空文件输入
  target.value = ''
}

const downloadFile = () => {
  if (!formattedJson.value) return

  const extension = operation.value === 'convert' ? convertTo.value : 'json'
  const filename = `${fileInfo.value?.name || 'data'}.${extension}`

  const blob = new Blob([formattedJson.value], {
    type: operation.value === 'convert' && convertTo.value === 'json'
      ? 'application/json'
      : 'text/plain'
  })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 剪贴板操作
const pasteInput = async () => {
  try {
    let text = ''
    // 优先使用 Electron API
    if ((window as any).electronAPI?.clipboard) {
      text = await (window as any).electronAPI.clipboard.read()
    } else {
      // 回退到浏览器 API
      text = await navigator.clipboard.readText()
    }
    inputText.value = text
    processJson()
  } catch (err) {
    error.value = '无法读取剪贴板'
  }
}

const copyInput = async () => {
  if (!inputText.value) return
  try {
    // 优先使用 Electron API
    if ((window as any).electronAPI?.clipboard) {
      await (window as any).electronAPI.clipboard.write(inputText.value)
    } else {
      // 回退到浏览器 API
      await navigator.clipboard.writeText(inputText.value)
    }
  } catch (err) {
    error.value = '无法复制到剪贴板'
  }
}

const copyOutput = async () => {
  if (!formattedJson.value) return
  try {
    // 优先使用 Electron API
    if ((window as any).electronAPI?.clipboard) {
      await (window as any).electronAPI.clipboard.write(formattedJson.value)
    } else {
      // 回退到浏览器 API
      await navigator.clipboard.writeText(formattedJson.value)
    }
  } catch (err) {
    error.value = '无法复制到剪贴板'
  }
}

const useAsInput = () => {
  inputText.value = formattedJson.value
  processJson()
}

const clearAll = () => {
  inputText.value = ''
  formattedJson.value = ''
  fileInfo.value = null
  error.value = ''
  validationResult.value = null
  jsonPathQuery.value = ''
  queryResult.value = ''
}
</script>

<style scoped>
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
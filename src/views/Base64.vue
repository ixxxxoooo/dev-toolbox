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
            <h1 class="text-xl font-semibold text-foreground">Base64 编解码工具</h1>
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
              :disabled="!outputText"
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
                value="encode"
                class="rounded"
              >
              <span class="text-sm">编码</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                v-model="operation"
                value="decode"
                class="rounded"
              >
              <span class="text-sm">解码</span>
            </label>
          </div>
          
          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="urlSafe"
                class="rounded"
              >
              <span class="text-sm">URL安全</span>
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
      </div>

      <div class="grid grid-cols-2 gap-4 h-[calc(100vh-220px)]">
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
                :disabled="!outputText"
                class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                复制
              </button>
              <button
                @click="useAsInput"
                :disabled="!outputText"
                class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                作为输入
              </button>
            </div>
          </div>
          <textarea
            v-model="outputText"
            readonly
            :placeholder="getOutputPlaceholder()"
            class="flex-1 p-3 bg-muted border border-border rounded-md text-sm font-mono resize-none focus:outline-none"
          ></textarea>
          <div class="text-xs text-muted-foreground mt-1">
            {{ getOutputStats() }}
          </div>
        </div>
      </div>

      <!-- 文件信息 -->
      <div v-if="fileInfo" class="mt-4 bg-card border border-border rounded-lg p-4">
        <h3 class="text-sm font-medium text-foreground mb-2">文件信息</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-muted-foreground">文件名:</span>
            <span class="ml-2">{{ fileInfo.name }}</span>
          </div>
          <div>
            <span class="text-muted-foreground">大小:</span>
            <span class="ml-2">{{ formatFileSize(fileInfo.size) }}</span>
          </div>
          <div>
            <span class="text-muted-foreground">类型:</span>
            <span class="ml-2">{{ fileInfo.type || '未知' }}</span>
          </div>
          <div>
            <span class="text-muted-foreground">最后修改:</span>
            <span class="ml-2">{{ formatDate(fileInfo.lastModified) }}</span>
          </div>
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
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface FileInfo {
  name: string
  size: number
  type: string
  lastModified: number
}

// 状态变量
const inputText = ref<string>('')
const outputText = ref<string>('')
const operation = ref<'encode' | 'decode'>('encode')
const urlSafe = ref<boolean>(false)
const autoProcess = ref<boolean>(true)
const fileInfo = ref<FileInfo | null>(null)
const error = ref<string>('')
const fileInput = ref<HTMLInputElement | null>(null)

// 计算属性
const isValidBase64 = computed(() => {
  if (operation.value !== 'decode') return true
  try {
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
    return base64Regex.test(inputText.value.trim())
  } catch {
    return false
  }
})

// 监听输入变化
watch([inputText, operation, urlSafe], () => {
  if (autoProcess.value) {
    processText()
  }
})

// 处理文本
const processText = () => {
  error.value = ''
  
  if (!inputText.value.trim()) {
    outputText.value = ''
    return
  }

  try {
    if (operation.value === 'encode') {
      outputText.value = encodeBase64(inputText.value)
    } else {
      if (!isValidBase64.value) {
        error.value = '无效的Base64格式'
        return
      }
      outputText.value = decodeBase64(inputText.value)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '处理失败'
    outputText.value = ''
  }
}

// Base64 编码
const encodeBase64 = (text: string): string => {
  const base64 = btoa(unescape(encodeURIComponent(text)))
  return urlSafe.value 
    ? base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    : base64
}

// Base64 解码
const decodeBase64 = (text: string): string => {
  let base64 = text.trim()
  
  if (urlSafe.value) {
    base64 = base64.replace(/-/g, '+').replace(/_/g, '/')
    // 添加填充
    while (base64.length % 4) {
      base64 += '='
    }
  }
  
  return decodeURIComponent(escape(atob(base64)))
}

// 输入处理
const handleInput = (): void => {
  if (autoProcess.value) {
    processText()
  }
}

// 获取输入提示
const getInputPlaceholder = (): string => {
  if (operation.value === 'encode') {
    return '请输入要编码的文本...'
  } else {
    return '请输入Base64编码的文本...'
  }
}

// 获取输出提示
const getOutputPlaceholder = (): string => {
  if (operation.value === 'encode') {
    return 'Base64编码结果将显示在这里...'
  } else {
    return '解码后的文本将显示在这里...'
  }
}

// 获取输入统计
const getInputStats = (): string => {
  const length = inputText.value.length
  const bytes = new Blob([inputText.value]).size
  return `字符: ${length} | 字节: ${bytes}`
}

// 获取输出统计
const getOutputStats = (): string => {
  const length = outputText.value.length
  const bytes = new Blob([outputText.value]).size
  return `字符: ${length} | 字节: ${bytes}`
}

// 文件操作
const loadFile = (): void => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    fileInfo.value = {
      name: file.name,
      size: file.size,
      type: file.type || 'text/plain',
      lastModified: file.lastModified
    }
    
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      inputText.value = e.target?.result as string
      processText()
    }
    
    if (operation.value === 'encode') {
      reader.readAsText(file)
    } else {
      reader.readAsDataURL(file)
    }
  }
  
  // 清空文件输入
  target.value = ''
}

const downloadFile = (): void => {
  if (!outputText.value) return
  
  const filename = operation.value === 'encode' 
    ? `base64_${fileInfo.value?.name || 'encoded.txt'}`
    : `decoded_${fileInfo.value?.name || 'decoded.txt'}`
  
  const blob = new Blob([outputText.value], { type: 'text/plain' })
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
const pasteInput = async (): Promise<void> => {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
    processText()
  } catch (err: any) {
    error.value = '无法读取剪贴板'
  }
}

const copyInput = async (): Promise<void> => {
  if (!inputText.value) return
  try {
    await navigator.clipboard.writeText(inputText.value)
  } catch (err: any) {
    error.value = '无法复制到剪贴板'
  }
}

const copyOutput = async (): Promise<void> => {
  if (!outputText.value) return
  try {
    await navigator.clipboard.writeText(outputText.value)
  } catch (err: any) {
    error.value = '无法复制到剪贴板'
  }
}

const useAsInput = (): void => {
  inputText.value = outputText.value
  operation.value = operation.value === 'encode' ? 'decode' : 'encode'
  processText()
}

// 工具函数
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const clearAll = (): void => {
  inputText.value = ''
  outputText.value = ''
  fileInfo.value = null
  error.value = ''
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
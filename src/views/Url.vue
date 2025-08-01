<template>
  <div class="min-h-screen bg-background">
    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center space-x-4">
          <button
            @click="$router.push('/')"
            class="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-xl font-semibold text-foreground">URL 编解码</h1>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- 操作栏 -->
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium">模式:</label>
            <select v-model="mode" class="px-3 py-1.5 border rounded-md text-sm">
              <option value="encodeURIComponent">encodeURIComponent</option>
              <option value="encodeURI">encodeURI</option>
              <option value="decodeURIComponent">decodeURIComponent</option>
              <option value="decodeURI">decodeURI</option>
            </select>
          </div>
          
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium">批量模式:</label>
            <input type="checkbox" v-model="batchMode" class="rounded">
          </div>

          <div class="flex-1"></div>

          <div class="flex space-x-2">
            <button
              @click="clearAll"
              class="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm"
            >
              清空
            </button>
            <button
              @click="copyResult"
              class="px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors text-sm"
            >
              复制结果
            </button>
          </div>
        </div>

        <!-- 常用字符集 -->
        <div class="bg-card border rounded-lg p-4">
          <h3 class="text-sm font-medium mb-2">常用字符集</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="char in commonChars"
              :key="char"
              @click="insertChar(char)"
              class="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs hover:bg-secondary/80 transition-colors"
            >
              {{ char }}
            </button>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <label class="text-sm font-medium">输入</label>
              <div class="flex space-x-2">
                <button
                  @click="pasteInput"
                  class="px-2 py-1 text-xs bg-secondary rounded hover:bg-secondary/80 transition-colors"
                >
                  粘贴
                </button>
                <button
                  @click="clearInput"
                  class="px-2 py-1 text-xs bg-secondary rounded hover:bg-secondary/80 transition-colors"
                >
                  清空
                </button>
              </div>
            </div>
            <textarea
              v-model="inputText"
              @input="convert"
              class="w-full h-64 p-3 border rounded-md font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
              :placeholder="batchMode ? '每行一个URL...' : '输入要处理的文本...'"
            ></textarea>
            <div class="text-xs text-muted-foreground text-right">
              {{ inputText.length }} 字符
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <label class="text-sm font-medium">结果</label>
              <div class="flex space-x-2">
                <button
                  @click="pasteResult"
                  class="px-2 py-1 text-xs bg-secondary rounded hover:bg-secondary/80 transition-colors"
                >
                  粘贴
                </button>
                <button
                  @click="clearOutput"
                  class="px-2 py-1 text-xs bg-secondary rounded hover:bg-secondary/80 transition-colors"
                >
                  清空
                </button>
              </div>
            </div>
            <textarea
              v-model="outputText"
              readonly
              class="w-full h-64 p-3 border rounded-md font-mono text-sm bg-muted resize-y focus:outline-none"
              placeholder="处理结果将显示在这里..."
            ></textarea>
            <div class="text-xs text-muted-foreground text-right">
              {{ outputText.length }} 字符
            </div>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
          {{ error }}
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useClipboard } from '@vueuse/core'



// 状态管理
const inputText = ref<string>('')
const outputText = ref<string>('')
const mode = ref<'encodeURIComponent' | 'encodeURI' | 'decodeURIComponent' | 'decodeURI'>('encodeURIComponent')
const batchMode = ref<boolean>(false)
const error = ref<string>('')

// 常用字符集
const commonChars: string[] = ['%', '+', ' ', '!', '*', "'", '(', ')', ';', ':', '@', '&', '=', '+', '$', ',', '/', '?', '#', '[', ']']

// 剪贴板工具
const { copy, isSupported } = useClipboard()

// 转换函数
const convert = (): void => {
  if (!inputText.value.trim()) {
    outputText.value = ''
    error.value = ''
    return
  }

  try {
    if (batchMode.value) {
      // 批量模式 - 每行处理
      const lines = inputText.value.split('\n')
      const results = lines.map(line => {
        if (!line.trim()) return line
        return processLine(line)
      })
      outputText.value = results.join('\n')
    } else {
      // 单条模式
      outputText.value = processLine(inputText.value)
    }
    error.value = ''
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '处理失败，请检查输入内容'
  }
}

// 处理单行
const processLine = (text: string): string => {
  switch (mode.value) {
    case 'encodeURIComponent':
      return encodeURIComponent(text)
    case 'encodeURI':
      return encodeURI(text)
    case 'decodeURIComponent':
      return decodeURIComponent(text)
    case 'decodeURI':
      return decodeURI(text)
    default:
      return text
  }
}

// 插入常用字符
const insertChar = (char: string): void => {
  inputText.value += char
  convert()
}

// 清空所有
const clearAll = (): void => {
  inputText.value = ''
  outputText.value = ''
  error.value = ''
}

// 清空输入
const clearInput = (): void => {
  inputText.value = ''
  outputText.value = ''
  error.value = ''
}

// 清空输出
const clearOutput = (): void => {
  outputText.value = ''
}

// 粘贴输入
const pasteInput = async (): Promise<void> => {
  if (!isSupported) {
    error.value = '剪贴板功能不支持'
    return
  }
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
    convert()
  } catch (e: any) {
    error.value = '无法访问剪贴板'
  }
}

// 粘贴结果到输入
const pasteResult = (): void => {
  inputText.value = outputText.value
  convert()
}

// 复制结果
const copyResult = async (): Promise<void> => {
  if (!outputText.value) {
    error.value = '没有内容可复制'
    return
  }
  try {
    await copy(outputText.value)
    error.value = '已复制到剪贴板'
    setTimeout(() => error.value = '', 2000)
  } catch (e: any) {
    error.value = '复制失败'
  }
}

// 监听模式变化
watch([mode, batchMode], () => {
  convert()
})

// 初始化
nextTick(() => {
  inputText.value = 'Hello World! 你好，世界！'
  convert()
})
</script>
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
            <h1 class="text-xl font-semibold text-foreground">时间戳转换工具</h1>
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="copyCurrentTimestamp"
              class="px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
            >
              复制当前时间戳
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
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 时间戳转日期 -->
        <div class="bg-card border border-border rounded-lg p-6">
          <h3 class="text-lg font-semibold text-foreground mb-4">时间戳转日期</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">输入时间戳</label>
              <div class="flex space-x-2">
                <input
                  v-model="timestampInput"
                  type="text"
                  placeholder="输入时间戳 (毫秒或秒)"
                  class="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  @input="convertTimestampToDate"
                />
                <select
                  v-model="timestampUnit"
                  class="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  @change="convertTimestampToDate"
                >
                  <option value="ms">毫秒</option>
                  <option value="s">秒</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-foreground mb-2">时区</label>
              <select
                v-model="timezone"
                class="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                @change="convertTimestampToDate"
              >
                <option value="UTC">UTC</option>
                <option value="Asia/Shanghai">北京时间 (UTC+8)</option>
                <option value="America/New_York">纽约时间 (UTC-5)</option>
                <option value="Europe/London">伦敦时间 (UTC+0)</option>
                <option value="Asia/Tokyo">东京时间 (UTC+9)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-foreground mb-2">转换结果</label>
              <div class="space-y-2">
                <div v-for="format in dateFormats" :key="format.value" class="flex items-center justify-between">
                  <span class="text-sm text-muted-foreground">{{ format.label }}:</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-mono">{{ formatTimestamp(timestampInput, format.value) }}</span>
                    <button
                      @click="copyToClipboard(formatTimestamp(timestampInput, format.value))"
                      class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors"
                    >
                      复制
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 日期转时间戳 -->
        <div class="bg-card border border-border rounded-lg p-6">
          <h3 class="text-lg font-semibold text-foreground mb-4">日期转时间戳</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">选择日期时间</label>
              <input
                v-model="dateInput"
                type="datetime-local"
                class="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                @input="convertDateToTimestamp"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-foreground mb-2">时区</label>
              <select
                v-model="timezone"
                class="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                @change="convertDateToTimestamp"
              >
                <option value="UTC">UTC</option>
                <option value="Asia/Shanghai">北京时间 (UTC+8)</option>
                <option value="America/New_York">纽约时间 (UTC-5)</option>
                <option value="Europe/London">伦敦时间 (UTC+0)</option>
                <option value="Asia/Tokyo">东京时间 (UTC+9)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-foreground mb-2">转换结果</label>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-muted-foreground">毫秒时间戳:</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-mono">{{ dateToMsTimestamp }}</span>
                    <button
                      @click="copyToClipboard(dateToMsTimestamp)"
                      class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors"
                    >
                      复制
                    </button>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-muted-foreground">秒时间戳:</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-mono">{{ dateToSTimestamp }}</span>
                    <button
                      @click="copyToClipboard(dateToSTimestamp)"
                      class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors"
                    >
                      复制
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 常用时间戳 -->
      <div class="mt-6 bg-card border border-border rounded-lg p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">常用时间戳</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="preset in commonTimestamps"
            :key="preset.label"
            class="border border-border rounded-lg p-3 hover:border-primary/50 transition-colors"
          >
            <div class="text-sm font-medium text-foreground">{{ preset.label }}</div>
            <div class="text-xs text-muted-foreground mt-1">{{ preset.description }}</div>
            <div class="text-xs font-mono mt-2">{{ preset.timestamp }}</div>
            <button
              @click="usePreset(preset)"
              class="mt-2 text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors"
            >
              使用
            </button>
          </div>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="mt-6 bg-card border border-border rounded-lg p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">快捷操作</h3>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="action in quickActions"
            :key="action.label"
            @click="action.handler"
            class="px-3 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
          >
            {{ action.label }}
          </button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface DateFormat {
  label: string
  value: string
}

interface CommonTimestamp {
  label: string
  description: string
  timestamp: string
}

interface QuickAction {
  label: string
  handler: () => void
}

// 工具函数


// 状态变量
const timestampInput = ref<string>('')
const timestampUnit = ref<'ms' | 's'>('ms')
const dateInput = ref<string>('')
const timezone = ref<string>('Asia/Shanghai')
const error = ref<string>('')

// 日期格式
const dateFormats: DateFormat[] = [
  { label: 'ISO 8601', value: 'ISO' },
  { label: 'RFC 2822', value: 'RFC' },
  { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
  { label: 'YYYY-MM-DD HH:mm:ss.SSS', value: 'YYYY-MM-DD HH:mm:ss.SSS' },
  { label: 'MM/DD/YYYY HH:mm:ss', value: 'MM/DD/YYYY HH:mm:ss' },
  { label: 'DD/MM/YYYY HH:mm:ss', value: 'DD/MM/YYYY HH:mm:ss' },
  { label: 'Unix Timestamp (ms)', value: 'timestamp-ms' },
  { label: 'Unix Timestamp (s)', value: 'timestamp-s' }
]

// 常用时间戳预设
const commonTimestamps: CommonTimestamp[] = [
  { label: '现在', description: '当前时间', timestamp: Date.now().toString() },
  { label: '今天开始', description: '今天 00:00:00', timestamp: new Date().setHours(0, 0, 0, 0).toString() },
  { label: '今天结束', description: '今天 23:59:59', timestamp: new Date().setHours(23, 59, 59, 999).toString() },
  { label: '本周开始', description: '本周一 00:00:00', timestamp: (() => {
    const date = new Date()
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(date.setDate(diff)).setHours(0, 0, 0, 0).toString()
  })() },
  { label: '本月开始', description: '本月1日 00:00:00', timestamp: new Date().setDate(1).toString() },
  { label: '明年开始', description: '明年1月1日 00:00:00', timestamp: new Date(new Date().getFullYear() + 1, 0, 1).getTime().toString() }
]

// 快捷操作
const quickActions: QuickAction[] = [
  {
    label: '当前时间',
    handler: () => setCurrentTime()
  },
  {
    label: '今天开始',
    handler: () => setTodayStart()
  },
  {
    label: '本周开始',
    handler: () => setWeekStart()
  },
  {
    label: '本月开始',
    handler: () => setMonthStart()
  }
]

// 计算属性
const dateToMsTimestamp = computed(() => {
  if (!dateInput.value) return ''
  try {
    const date = new Date(dateInput.value)
    return String(date.getTime())
  } catch {
    return ''
  }
})

const dateToSTimestamp = computed(() => {
  if (!dateInput.value) return ''
  try {
    const date = new Date(dateInput.value)
    return String(Math.floor(date.getTime() / 1000))
  } catch {
    return ''
  }
})

// 方法
const formatTimestamp = (timestamp: string, format: string): string => {
  if (!timestamp || !/^[\d.]+$/.test(timestamp)) return ''

  try {
    let ts = parseFloat(timestamp)
    if (timestampUnit.value === 's') {
      ts *= 1000
    }

    const date = new Date(ts)

    // 设置时区
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone.value,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }

    switch (format) {
      case 'ISO':
        return date.toISOString()
      case 'RFC':
        return date.toUTCString()
      case 'YYYY-MM-DD HH:mm:ss':
        return date.toLocaleString('zh-CN', options).replace(/\//g, '-')
      case 'YYYY-MM-DD HH:mm:ss.SSS':
        return date.toLocaleString('zh-CN', options).replace(/\//g, '-')
      case 'MM/DD/YYYY HH:mm:ss':
        return date.toLocaleString('en-US', options)
      case 'DD/MM/YYYY HH:mm:ss':
        return date.toLocaleString('en-GB', options)
      case 'timestamp-ms':
        return String(date.getTime())
      case 'timestamp-s':
        return String(Math.floor(date.getTime() / 1000))
      default:
        return date.toLocaleString('zh-CN', options)
    }
  } catch {
    return ''
  }
}

const convertTimestampToDate = () => {
  error.value = ''
  if (!timestampInput.value) return

  try {
    let ts = parseFloat(timestampInput.value)
    if (isNaN(ts)) {
      error.value = '请输入有效的时间戳'
      return
    }

    if (timestampUnit.value === 's') {
      ts *= 1000
    }

    new Date(ts) // 验证时间戳
  } catch {
    error.value = '无效的时间戳格式'
  }
}

const convertDateToTimestamp = () => {
  error.value = ''
  if (!dateInput.value) return

  try {
    new Date(dateInput.value) // 验证日期格式
  } catch {
    error.value = '无效的日期格式'
  }
}

const copyToClipboard = async (text: string): Promise<void> => {
  if (!text) return
  try {
    // 优先使用 Electron API
    if ((window as any).electronAPI?.clipboard) {
      await (window as any).electronAPI.clipboard.write(text)
    } else {
      // 回退到浏览器 API
      await navigator.clipboard.writeText(text)
    }
  } catch (err: any) {
    error.value = '复制失败'
  }
}

const copyCurrentTimestamp = async () => {
  try {
    const timestamp = String(Date.now())
    // 优先使用 Electron API
    if ((window as any).electronAPI?.clipboard) {
      await (window as any).electronAPI.clipboard.write(timestamp)
    } else {
      // 回退到浏览器 API
      await navigator.clipboard.writeText(timestamp)
    }
  } catch (err) {
    error.value = '复制失败'
  }
}

const clearAll = () => {
  timestampInput.value = ''
  dateInput.value = ''
  error.value = ''
}

const usePreset = (preset: CommonTimestamp): void => {
  timestampInput.value = preset.timestamp
  convertTimestampToDate()
}

const getWeekStart = (): Date => {
  const date = new Date()
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  const weekStart = new Date(date.setDate(diff))
  weekStart.setHours(0, 0, 0, 0)
  return weekStart
}

const setCurrentTime = () => {
  dateInput.value = new Date().toISOString().slice(0, 16)
  convertDateToTimestamp()
}

const setTodayStart = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dateInput.value = today.toISOString().slice(0, 16)
  convertDateToTimestamp()
}

const setWeekStart = () => {
  const weekStart = getWeekStart()
  weekStart.setHours(0, 0, 0, 0)
  dateInput.value = weekStart.toISOString().slice(0, 16)
  convertDateToTimestamp()
}

const setMonthStart = () => {
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  monthStart.setHours(0, 0, 0, 0)
  dateInput.value = monthStart.toISOString().slice(0, 16)
  convertDateToTimestamp()
}

// 初始化
onMounted(() => {
  setCurrentTime()
})
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
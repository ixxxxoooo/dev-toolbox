<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部导航栏 -->
    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
                      <ToolSwitcher />
          <h1 class="text-2xl font-bold text-foreground">Dev Toolbox</h1>
          <div class="flex items-center space-x-4">
            <!-- 搜索框 -->
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索工具..."
                class="w-64 px-4 py-2 pl-10 bg-secondary rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <svg class="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <!-- 主题切换按钮 -->
            <button
              @click="themeStore.toggleTheme"
              class="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <svg v-if="themeStore.isDark.value" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 最近使用 -->
      <section v-if="recentTools.length > 0" class="mb-8">
        <h2 class="text-lg font-semibold text-foreground mb-4">最近使用</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="tool in recentTools"
            :key="tool.id"
            @click="navigateToTool(tool)"
            class="bg-card border border-border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
          >
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-primary/10 rounded-lg">
                <svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    :d="getIconPath(tool.id)" />
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-foreground">{{ tool.name }}</h3>
                <p class="text-sm text-muted-foreground">{{ tool.category }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 所有工具 -->
      <section>
        <h2 class="text-lg font-semibold text-foreground mb-4">所有工具</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="module in filteredModules"
            :key="module.id"
            @click="navigateToTool(module)"
            class="bg-card border border-border rounded-lg p-6 cursor-pointer hover:shadow-md transition-all hover:border-primary/50 hover:scale-105"
          >
            <div class="flex flex-col items-center text-center space-y-3">
              <div class="p-3 bg-primary/10 rounded-full">
                <svg class="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    :d="getIconPath(module.id)" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-foreground">{{ module.name }}</h3>
                <p class="text-sm text-muted-foreground mt-1">{{ module.description }}</p>
              </div>
              <span class="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                {{ module.category }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 无搜索结果 -->
      <div v-if="filteredModules.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-1.01-6-2.657m14 0A11.953 11.953 0 0012 21c-3.716 0-7.066-1.397-9.6-3.686M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-foreground">没有找到结果</h3>
        <p class="mt-1 text-sm text-muted-foreground">尝试调整搜索关键词</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { modules, searchModules } from '../utils/modules'
import type { ToolModule } from '../types'
import ToolSwitcher from '../components/ToolSwitcher.vue'

const router = useRouter()
const themeStore = useThemeStore()

const searchQuery = ref('')
const recentTools = ref<ToolModule[]>([])

const filteredModules = computed(() => {
  if (!searchQuery.value.trim()) {
    return modules
  }
  return searchModules(searchQuery.value)
})

const navigateToTool = async (tool: ToolModule) => {
  // 添加到最近使用
  addToRecentTools(tool)
  
  // 导航到工具页面
  await router.push(tool.route)
}

const addToRecentTools = (tool: ToolModule) => {
  const existingIndex = recentTools.value.findIndex((t: ToolModule) => t.id === tool.id)
  if (existingIndex > -1) {
    recentTools.value.splice(existingIndex, 1)
  }
  
  recentTools.value.unshift(tool)
  
  // 限制最近使用数量为 4 个
  if (recentTools.value.length > 4) {
    recentTools.value.pop()
  }
  
  // 保存到本地存储
  localStorage.setItem('recentTools', JSON.stringify(recentTools.value))
}

const getIconPath = (moduleId: string) => {
  const iconMap: Record<string, string> = {
    diff: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    timestamp: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    url: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    base64: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    json: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    uuid: 'M15 7h3a3 3 0 013 3v5a3 3 0 01-3 3h-3m-6 0H6a3 3 0 01-3-3v-5a3 3 0 013-3h3',
    'text-analyzer': 'M8 12h8m-4 4v-8',
    'hash-generator': 'M7 20h10m-5-5V9m-5 5h10a2 2 0 002-2V8a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2z'
  }
  return iconMap[moduleId] || 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
}

onMounted(() => {
  // 从本地存储加载最近使用的工具
  const saved = localStorage.getItem('recentTools')
  if (saved) {
    try {
      recentTools.value = JSON.parse(saved)
    } catch (error) {
      console.error('Failed to load recent tools:', error)
    }
  }
})
</script>
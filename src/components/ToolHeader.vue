<template>
  <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
          <ToolSwitcher />
          <button @click="$router.push('/')" class="btn-icon" :title="$t('app.back')">
            <ChevronLeft class="h-5 w-5" />
          </button>
          <div class="flex items-center space-x-2">
            <router-link
              to="/"
              class="text-2xl font-bold text-foreground hover:text-primary transition-colors"
            >
              {{ $t('app.title') }}
            </router-link>
            <span class="text-muted-foreground">·</span>
            <h1 class="text-xl font-semibold text-foreground">{{ title }}</h1>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <!-- 语言切换 -->
          <LanguageSwitcher />

          <!-- 主题切换按钮 -->
          <ThemeToggleButton />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'
import ToolSwitcher from './ToolSwitcher.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ThemeToggleButton from './ThemeToggleButton.vue'

interface Props {
  title: string
}

defineProps<Props>()
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>

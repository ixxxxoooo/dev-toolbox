<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useThemeStore } from './stores/theme'
import { useLocaleStore } from './stores/locale'
import { isSupportedLocale } from './locales'

// 主题存储会在创建时自动初始化，无需手动调用
useThemeStore()

// 语言存储初始化
const localeStore = useLocaleStore()

// 提取具名 handler，便于卸载时移除（即使是根组件也保持资源清理规范）
const onAppLangChange = (e: Event) => {
  const lang = (e as CustomEvent<unknown>).detail
  if (typeof lang !== 'string' || !isSupportedLocale(lang)) return
  localeStore.setLocale(lang)
  document.documentElement.setAttribute('lang', lang)
}

onMounted(() => {
  // 设置 HTML lang 属性
  document.documentElement.setAttribute('lang', localeStore.currentLocale)

  window.addEventListener('app-lang-change', onAppLangChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('app-lang-change', onAppLangChange)
})
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
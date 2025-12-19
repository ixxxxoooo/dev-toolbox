<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from './stores/theme'
import { useLocaleStore } from './stores/locale'

// 主题存储会在创建时自动初始化，无需手动调用
useThemeStore()

// 语言存储初始化
const localeStore = useLocaleStore()

onMounted(() => {
  // 设置 HTML lang 属性
  document.documentElement.setAttribute('lang', localeStore.currentLocale)

  window.addEventListener('app-lang-change', (e: any) => {
    const lang = e.detail
    localeStore.setLocale(lang)
    document.documentElement.setAttribute('lang', lang)
  })
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
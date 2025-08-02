<template>
  <div id="app" class="h-screen bg-background">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from './stores/theme'

// 主题存储会在创建时自动初始化，无需手动调用
useThemeStore()
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
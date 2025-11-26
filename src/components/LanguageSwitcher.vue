<template>
  <div class="relative inline-block">
    <!-- 语言切换按钮 -->
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700
             dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
             rounded-lg transition-colors duration-200"
      :title="$t('nav.language')"
    >
      <Globe class="w-4 h-4" />
      <span class="hidden sm:inline">{{ getCurrentLocaleName() }}</span>
      <ChevronDown class="w-3 h-3" />
    </button>

    <!-- 下拉菜单 -->
    <div
      v-show="isDropdownOpen"
      class="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800
             rounded-lg shadow-lg border border-gray-200 dark:border-gray-700
             py-1 z-[9999]"
      @click.stop
    >
      <button
        v-for="locale in localeStore.getSupportedLocales()"
        :key="locale.code"
        @click="selectLocale(locale.code)"
        class="w-full px-4 py-2 text-sm text-left hover:bg-gray-100
               dark:hover:bg-gray-700 transition-colors duration-200"
        :class="{
          'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20':
            locale.code === localeStore.currentLocale,
          'text-gray-700 dark:text-gray-300':
            locale.code !== localeStore.currentLocale
        }"
      >
        <div class="flex items-center justify-between">
          <span>{{ locale.name }}</span>
          <Check
            v-if="locale.code === localeStore.currentLocale"
            class="w-4 h-4 text-blue-600 dark:text-blue-400"
          />
        </div>
      </button>
    </div>

    <!-- 点击外部关闭下拉菜单 -->
    <div
      v-if="isDropdownOpen"
      @click="closeDropdown"
      class="fixed inset-0 z-[9998]"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Globe, ChevronDown, Check } from 'lucide-vue-next'
import { useLocaleStore } from '@/stores/locale'
import type { SupportedLocale } from '@/locales'

const localeStore = useLocaleStore()
const isDropdownOpen = ref(false)

// 获取当前语言的显示名称
const getCurrentLocaleName = () => {
  return localeStore.getLocaleName(localeStore.currentLocale)
}

// 切换下拉菜单
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// 关闭下拉菜单
const closeDropdown = () => {
  isDropdownOpen.value = false
}

// 选择语言
const selectLocale = (locale: SupportedLocale) => {
  localeStore.setLocale(locale)
  closeDropdown()
}

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* 自定义样式如果需要的话 */
</style>

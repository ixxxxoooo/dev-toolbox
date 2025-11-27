<template>
  <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
    <button
      v-for="locale in localeStore.getSupportedLocales()"
      :key="locale.code"
      @click="localeStore.setLocale(locale.code)"
      class="px-2 py-1 text-xs font-medium rounded-md transition-all duration-200"
      :class="[
        locale.code === localeStore.currentLocale
          ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
          : 'text-muted-foreground hover:text-foreground'
      ]"
      :title="locale.name"
    >
      {{ locale.code === 'zh' ? '中' : 'En' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLocaleStore } from '@/stores/locale'

const localeStore = useLocaleStore()
</script>

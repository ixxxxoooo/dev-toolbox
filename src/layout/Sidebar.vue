<template>
  <aside class="w-64 bg-card border-r border-border flex flex-col h-full">
    <div class="p-4 border-b border-border flex items-center space-x-3">
      <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </div>
      <span class="font-bold text-lg tracking-tight">Dev Toolbox</span>
    </div>

    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <router-link
        v-for="route in routes"
        :key="route.name"
        :to="{ name: route.name }"
        class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group"
        :class="[
          $route.name === route.name
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        ]"
      >
        <component
          :is="getIcon(route.meta?.icon as string)"
          class="w-5 h-5 mr-3 transition-colors"
          :class="$route.name === route.name ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'"
        />
        {{ $t(route.meta?.title as string) }}
      </router-link>
    </nav>

    <div class="p-4 border-t border-border space-y-2">
      <div class="flex items-center justify-between px-2">
        <span class="text-xs font-medium text-muted-foreground">Appearance</span>
      </div>
      <div class="flex items-center justify-between bg-muted/50 p-2 rounded-lg">
        <ThemeToggleButton />
        <LanguageSwitcher />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Braces,
  GitCompare,
  Clock,
  Link,
  Binary,
  Fingerprint,
  FileText,
  Hash,
  Database,
  Key,
  Calculator,
  Globe,
  Monitor,
  Regex,
  QrCode,
  FileCode,
  Image,
  Eraser,
  Languages
} from 'lucide-vue-next'
import ThemeToggleButton from '../components/ThemeToggleButton.vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

const router = useRouter()

const routes = computed(() => {
  return router.options.routes[0].children?.filter(r => r.meta?.title) || []
})

const icons: Record<string, any> = {
  Braces,
  GitCompare,
  Clock,
  Link,
  Binary,
  Fingerprint,
  FileText,
  Hash,
  Database,
  Key,
  Calculator,
  Globe,
  Monitor,
  Regex,
  QrCode,
  FileCode,
  Image,
  Eraser,
  Languages
}

const getIcon = (name: string) => {
  return icons[name] || FileText
}
</script>

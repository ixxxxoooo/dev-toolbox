<template>
  <router-link
    :to="{ name: item.name }"
    class="sb-item group relative flex items-center h-8 rounded-md text-[13px] font-medium press select-none"
    :class="[
      active ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      collapsed ? 'justify-center px-0' : 'pl-2.5 pr-1.5 gap-2.5'
    ]"
    :title="collapsed ? label : ''"
  >
    <!-- 活动指示条：用 scaleY 做出入场动画，只走合成层 -->
    <span
      class="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-primary origin-center transition-transform duration-200 ease-out"
      :class="active ? 'scale-y-100' : 'scale-y-0'"
    ></span>

    <component :is="icon" class="w-4 h-4 shrink-0 transition-transform duration-200 ease-out group-hover:scale-110" />

    <template v-if="!collapsed">
      <span class="flex-1 truncate">{{ label }}</span>
      <!-- 固定按钮：hover 或已固定时显示 -->
      <button
        type="button"
        class="shrink-0 w-5 h-5 rounded flex items-center justify-center transition-opacity press hover:bg-background/70"
        :class="pinned ? 'opacity-100 text-primary' : 'opacity-0 group-hover:opacity-100 text-muted-foreground'"
        :title="pinned ? unpinLabel : pinLabel"
        :aria-label="pinned ? unpinLabel : pinLabel"
        @click.prevent.stop="$emit('toggle-pin')"
      >
        <Pin class="w-3 h-3" :class="pinned ? 'fill-current' : ''" />
      </button>
    </template>
  </router-link>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { Pin } from 'lucide-vue-next'

defineProps<{
  item: { name: string }
  label: string
  icon: Component
  active: boolean
  collapsed: boolean
  pinned: boolean
  pinLabel: string
  unpinLabel: string
}>()

defineEmits<{ (e: 'toggle-pin'): void }>()
</script>

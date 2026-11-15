<template>
  <router-link
    :to="{ name: item.name }"
    class="rail-item group"
    :class="{ 'is-active': active }"
    :data-name="item.name"
    :aria-label="label"
  >
    <component :is="icon" class="w-4 h-4 shrink-0" />
    <span class="rail-label flex-1 truncate">{{ label }}</span>
    <kbd v-if="shortcut" class="rail-label">{{ shortcut }}</kbd>
    <button
      type="button"
      class="rail-label rail-pin"
      :class="{ 'is-pinned': pinned }"
      :title="pinned ? unpinLabel : pinLabel"
      :aria-label="pinned ? unpinLabel : pinLabel"
      tabindex="-1"
      @click.prevent.stop="$emit('toggle-pin')"
    >
      <Pin class="w-3 h-3" :class="pinned ? 'fill-current' : ''" />
    </button>
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
  pinned: boolean
  pinLabel: string
  unpinLabel: string
  /** 数字快捷键（1-9），仅展示 */
  shortcut?: string
}>()
defineEmits<{ (e: 'toggle-pin'): void }>()
</script>

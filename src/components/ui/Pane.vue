<template>
  <section class="pane">
    <header class="pane-head">
      <slot name="title"><span class="truncate">{{ title }}</span></slot>
      <span v-if="badge !== undefined && badge !== ''" class="badge" :class="badgeClass">{{ badge }}</span>
      <span class="flex-1"></span>
      <slot name="actions" />
    </header>
    <div class="relative flex-1 min-h-0" :class="{ 'overflow-auto': scroll }">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * 面板：26px 高的面板头（标题 + 统计徽标 + 右侧动作）+ 内容区。
 * 内容区是 relative 容器，Monaco 编辑器可直接 absolute inset-0 铺满。
 */
const props = defineProps<{
  title?: string
  /** 统计徽标，如 "20 B" / "+3" */
  badge?: string | number
  badgeTone?: 'default' | 'add' | 'del' | 'primary'
  /** 内容区自带滚动（表单/列表类内容用） */
  scroll?: boolean
}>()

const badgeClass = computed(() => {
  switch (props.badgeTone) {
    case 'add': return 'badge-add'
    case 'del': return 'badge-del'
    case 'primary': return 'badge-primary'
    default: return ''
  }
})
</script>

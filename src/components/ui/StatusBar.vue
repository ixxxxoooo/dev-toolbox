<template>
  <footer class="status-bar" :class="{ 'is-error': state === 'error', 'is-warn': state === 'warn' }" role="status" aria-live="polite">
    <slot />
    <div v-if="$slots.right" class="sb-right"><slot name="right" /></div>
  </footer>
</template>

<script setup lang="ts">
/**
 * 状态栏：24px。报错、统计、光标位置统一放这里，永远不会把布局顶下去。
 * 内容约定：
 *   <span class="sb-ok"><Check/>有效</span>
 *   <button class="sb-err" @click="jump"><AlertCircle/>第 3 行…</button>
 *   <span class="sb-warn">…</span>
 */
defineProps<{ state?: 'ok' | 'error' | 'warn' }>()
</script>

<template>
  <button
    type="button"
    class="ib"
    :class="{ 'is-danger': danger, 'is-active': active, 'ib-sm': small }"
    :data-tip="title || undefined"
    :aria-label="title"
    :aria-pressed="active === undefined ? undefined : active"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
/**
 * 图标按钮：统一尺寸、hover、按压反馈，以及纯 CSS 气泡提示（title 即提示文字）。
 * 用法：<IconButton :title="$t('common.copy')" @click="copy"><Copy class="w-4 h-4" /></IconButton>
 */
defineProps<{
  /** 同时作为 aria-label 与气泡提示 */
  title?: string
  danger?: boolean
  /** 开启态（如“显示小地图”），传 undefined 表示非开关 */
  active?: boolean
  disabled?: boolean
  small?: boolean
}>()
</script>

<template>
  <button
    type="button"
    class="chip"
    :class="{ 'is-on': modelValue }"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <slot name="icon" />
    <slot />
  </button>
</template>

<script setup lang="ts">
/**
 * 开关 chip：命令栏里的二值选项（如“忽略空白”“键排序”）。
 * 开启态用主色描边 + 浅底，关闭态为灰色描边。
 */
defineProps<{ modelValue: boolean; disabled?: boolean }>()
defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
</script>

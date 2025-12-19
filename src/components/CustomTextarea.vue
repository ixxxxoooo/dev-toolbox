<template>
  <div class="flex flex-col h-full border border-border rounded-lg overflow-hidden bg-card shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
    <div v-if="label || $slots.header" class="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border">
      <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center">
        <slot name="icon"></slot>
        {{ label }}
      </h3>
      <div class="flex items-center space-x-1">
        <slot name="header"></slot>
      </div>
    </div>
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      :readonly="readonly"
      class="flex-1 p-4 bg-background resize-none outline-none font-mono text-sm placeholder:text-muted-foreground/40"
      :class="[readonly ? 'cursor-default' : '']"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  readonly?: boolean
}>(), {
  readonly: false
})

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

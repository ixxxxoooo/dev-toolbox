<template>
  <div class="space-y-1.5 w-full">
    <div v-if="label" class="flex items-center justify-between">
      <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wider h-4">
        {{ label }}
      </label>
      <slot name="extra"></slot>
    </div>
    <div class="relative group">
      <div 
        v-if="$slots.prefix" 
        class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
      >
        <slot name="prefix"></slot>
      </div>
      <input
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', type === 'number' ? Number(($event.target as HTMLInputElement).value) : ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        :readonly="readonly"
        :min="min"
        :max="max"
        class="w-full bg-muted/30 border border-border rounded-lg py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/50"
        :class="[
          $slots.prefix ? 'pl-9' : 'pl-3',
          $slots.suffix ? 'pr-9' : 'pr-3',
          readonly ? 'cursor-default' : 'hover:bg-muted/50'
        ]"
      >
      <div 
        v-if="$slots.suffix" 
        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
      >
        <slot name="suffix"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string | number
  type?: string
  label?: string
  placeholder?: string
  readonly?: boolean
  min?: number
  max?: number
}>(), {
  type: 'text',
  readonly: false
})

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>

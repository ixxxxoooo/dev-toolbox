<template>
  <div class="space-y-1.5">
    <label v-if="label" class="text-xs font-semibold text-muted-foreground uppercase tracking-wider h-4">
      {{ label }}
    </label>
    <div class="relative flex items-center">
      <div 
        class="w-10 h-10 rounded-lg border border-border shadow-sm cursor-pointer overflow-hidden transition-all hover:scale-105 active:scale-95"
        :style="{ backgroundColor: modelValue }"
        @click="colorInput?.click()"
      >
        <input
          ref="colorInput"
          type="color"
          :value="modelValue"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          class="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
        >
      </div>
      <div v-if="showValue" class="ml-3 font-mono text-xs font-bold text-muted-foreground uppercase">
        {{ modelValue }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{
  modelValue: string
  label?: string
  showValue?: boolean
}>(), {
  showValue: true
})

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const colorInput = ref<HTMLInputElement | null>(null)
</script>

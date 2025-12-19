<template>
  <div class="space-y-4 w-full">
    <div v-if="label || $slots.header" class="flex items-center justify-between">
      <label v-if="label" class="text-sm font-semibold flex items-center h-4">
        <slot name="icon"></slot>
        {{ label }}
      </label>
      <slot name="header">
        <div v-if="showValue" class="px-2 py-0.5 bg-primary/10 text-primary rounded font-mono text-xs font-bold border border-primary/20">
          {{ modelValue }}{{ unit }}
        </div>
      </slot>
    </div>

    <div class="relative flex items-center group py-2">
      <!-- Track background -->
      <div class="absolute w-full h-1.5 bg-muted rounded-full transition-colors group-hover:bg-muted/80"></div>
      
      <!-- Track active highlight -->
      <div 
        class="absolute h-1.5 bg-primary rounded-full transition-all"
        :style="{ width: percentage + '%' }"
      ></div>

      <!-- Range input -->
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
        class="absolute w-full h-4 opacity-0 cursor-pointer z-10"
      >

      <!-- Custom Thumb -->
      <div 
        class="absolute w-4 h-4 bg-background border-2 border-primary rounded-full shadow-md pointer-events-none transition-transform duration-200 group-active:scale-125 group-hover:scale-110"
        :style="{ left: `calc(${percentage}% - 8px)` }"
      >
        <div class="absolute inset-0 bg-primary/20 rounded-full scale-150 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </div>

    <!-- Ticks/Labels if needed -->
    <div v-if="showLabels" class="flex justify-between text-[10px] text-muted-foreground/60 font-medium px-0.5">
      <span>{{ min }}{{ unit }}</span>
      <span>{{ max }}{{ unit }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  label?: string
  unit?: string
  showValue?: boolean
  showLabels?: boolean
}>(), {
  min: 0,
  max: 100,
  step: 1,
  unit: '',
  showValue: true,
  showLabels: false
})

defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const percentage = computed(() => {
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100
})
</script>

<style scoped>
/* Ensure the thumb is clickable but transparent since we use a custom dot */
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
}
</style>

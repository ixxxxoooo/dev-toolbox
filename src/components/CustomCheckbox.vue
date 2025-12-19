<template>
  <label class="inline-flex items-center cursor-pointer group select-none">
    <div class="relative">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
        class="sr-only"
      >
      <!-- Checkbox box -->
      <div
        class="w-4 h-4 border-2 rounded transition-all duration-200 flex items-center justify-center transform group-active:scale-90"
        :class="[
          modelValue 
            ? 'bg-primary border-primary shadow-sm shadow-primary/20' 
            : 'bg-transparent border-muted-foreground/30 group-hover:border-primary/50'
        ]"
      >
        <!-- Check icon -->
        <svg
          class="w-3 h-3 text-primary-foreground transition-all duration-200 transform"
          :class="modelValue ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <!-- Pulse effect on click -->
      <div 
        class="absolute inset-0 rounded bg-primary/20 scale-150 opacity-0 group-active:opacity-100 transition-all duration-300 pointer-events-none"
      ></div>
    </div>
    
    <!-- Label text -->
    <span 
      v-if="label" 
      class="ml-2 text-xs font-medium transition-colors"
      :class="modelValue ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground/80'"
    >
      {{ label }}
    </span>
    <slot v-else></slot>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

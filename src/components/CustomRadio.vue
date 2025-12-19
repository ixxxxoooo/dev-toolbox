<template>
  <label class="flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer group select-none"
    :class="[
      modelValue === value 
        ? 'bg-primary/5 border-primary/50 ring-1 ring-primary/20' 
        : 'bg-transparent border-border hover:bg-muted/50 hover:border-muted-foreground/30'
    ]"
  >
    <div class="relative mt-0.5">
      <input
        type="radio"
        :value="value"
        :checked="modelValue === value"
        @change="$emit('update:modelValue', value)"
        class="sr-only"
      >
      <!-- Outer circle -->
      <div
        class="w-4 h-4 rounded-full border-2 transition-all duration-200 flex items-center justify-center transform group-active:scale-95"
        :class="[
          modelValue === value 
            ? 'border-primary bg-primary' 
            : 'border-muted-foreground/30 bg-transparent group-hover:border-primary/50'
        ]"
      >
        <!-- Inner dot -->
        <div
          class="w-1.5 h-1.5 rounded-full bg-primary-foreground transition-all duration-200 transform"
          :class="modelValue === value ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
        ></div>
      </div>
      
      <!-- Pulse effect -->
      <div 
        class="absolute inset-0 rounded-full bg-primary/20 scale-150 opacity-0 group-active:opacity-100 transition-all duration-300 pointer-events-none"
      ></div>
    </div>
    
    <div class="flex-1 min-w-0">
      <div 
        class="text-sm font-medium transition-colors truncate"
        :class="modelValue === value ? 'text-primary' : 'text-foreground'"
      >
        {{ label }}
      </div>
      <div v-if="description" class="text-xs text-muted-foreground mt-0.5 line-clamp-2">
        {{ description }}
      </div>
    </div>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: any
  value: any
  label: string
  description?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()
</script>

<template>
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center space-y-2 pointer-events-none" aria-live="polite">
    <TransitionGroup name="toast">
      <div
        v-for="item in toasts"
        :key="item.id"
        role="status"
        class="px-4 py-2 rounded-lg shadow-lg text-sm border"
        :class="{
          'bg-card text-foreground border-border': item.type === 'info',
          'bg-primary text-primary-foreground border-primary': item.type === 'success',
          'bg-destructive text-destructive-foreground border-destructive': item.type === 'error'
        }"
      >
        <span>{{ item.message }}</span>
        <button
          v-if="item.action"
          type="button"
          class="ml-3 underline font-medium pointer-events-auto"
          @click="item.action.onClick()"
        >
          {{ item.action.label }}
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { toasts } from '@/composables/useToast'
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

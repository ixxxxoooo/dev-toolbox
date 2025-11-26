<template>
  <div class="flex h-screen w-screen overflow-hidden bg-background text-foreground">
    <Sidebar />
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" class="h-full w-full overflow-auto" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div class="flex h-screen w-screen overflow-hidden bg-background text-foreground">
    <Sidebar />
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <router-view v-slot="{ Component }">
        <transition name="fade">
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
  transition: opacity 0.15s ease;
}

.fade-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

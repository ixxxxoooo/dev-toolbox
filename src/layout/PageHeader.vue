<template>
  <div class="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
    <div class="flex items-center space-x-4">
      <div class="p-2 bg-primary/10 rounded-lg">
        <slot name="icon">
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </slot>
      </div>
      <div>
        <h1 class="text-xl font-bold text-foreground tracking-tight">
          <slot name="title">Tool Name</slot>
        </h1>
        <p class="text-sm text-muted-foreground">
          <slot name="description">Tool description goes here.</slot>
        </p>
      </div>
    </div>
    <div class="flex items-center space-x-3">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

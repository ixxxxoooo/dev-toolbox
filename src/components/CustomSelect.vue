<template>
  <div class="relative inline-block text-left select-none" ref="containerRef">
    <!-- Trigger Button -->
    <button
      @click.stop="toggleIsOpen"
      type="button"
      class="inline-flex items-center justify-between w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200 h-7 min-w-[100px]"
      :class="{ 'ring-1 ring-primary border-primary': isOpen }"
    >
      <div class="flex items-center space-x-2 truncate">
        <slot name="icon"></slot>
        <span class="truncate">{{ selectedLabel }}</span>
      </div>
      <ChevronDown class="w-3 h-3 ml-2 shrink-0 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Menu Portal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          ref="menuRef"
          class="fixed z-[9999] mt-1.5 min-w-[120px] rounded-xl bg-card border border-border shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
          :style="menuStyle"
        >
          <div class="p-1">
            <button
              v-for="option in options"
              :key="option.value"
              @click="selectOption(option.value)"
              class="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors group"
              :class="modelValue === option.value ? 'bg-primary/10 text-primary shadow-sm font-semibold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
            >
              <span class="truncate">{{ option.label }}</span>
              <Check v-if="modelValue === option.value" class="w-3 h-3" />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: any
  options: { label: string; value: any }[]
  position?: 'top' | 'bottom'
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const menuStyle = ref({ top: '0px', left: '0px', width: 'auto' })

const selectedLabel = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue)?.label || ''
})

const updatePosition = () => {
  if (containerRef.value && isOpen.value) {
    const rect = containerRef.value.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const menuHeight = 240 // max-h-60
    
    let top = rect.bottom + window.scrollY
    if (props.position === 'top' || (spaceBelow < menuHeight && rect.top > menuHeight)) {
      top = rect.top - menuHeight + window.scrollY
    }

    menuStyle.value = {
      top: `${top}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${Math.max(rect.width, 120)}px`
    }
  }
}

const toggleIsOpen = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(updatePosition)
  }
}

const selectOption = (value: any) => {
  emit('update:modelValue', value)
  emit('change', value)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (isOpen.value && containerRef.value && !containerRef.value.contains(event.target as Node) && menuRef.value && !menuRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
})

watch(isOpen, (val) => {
  if (val) {
    nextTick(updatePosition)
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 10px;
}
</style>

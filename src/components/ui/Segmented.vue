<template>
  <div
    ref="root"
    class="seg"
    :class="{ 'is-ready': ready, 'seg-sm': small }"
    role="tablist"
    :style="{ '--x': x + 'px', '--w': w + 'px' }"
  >
    <i class="seg-ind" aria-hidden="true"></i>
    <button
      v-for="o in options"
      :key="o.value"
      ref="btns"
      type="button"
      role="tab"
      :aria-selected="o.value === modelValue"
      :class="{ 'is-on': o.value === modelValue }"
      :disabled="o.disabled"
      :title="o.title"
      @click="$emit('update:modelValue', o.value)"
    >
      <component :is="o.icon" v-if="o.icon" class="w-3.5 h-3.5" />
      <span v-if="o.label !== undefined && o.label !== ''">{{ o.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts" generic="T extends string | number">
import { ref, watch, onMounted, onBeforeUnmount, nextTick, type Component } from 'vue'

/**
 * 分段控件：当前项的"滑块"用 transform 平移 + 弹性曲线，切换时丝滑滑动。
 * 位置通过 ResizeObserver 自动校准（字体加载、国际化切换、容器缩放都不会错位）。
 */
export interface SegmentedOption<V> {
  value: V
  label?: string
  icon?: Component
  title?: string
  disabled?: boolean
}

const props = defineProps<{
  modelValue: T
  options: SegmentedOption<T>[]
  small?: boolean
}>()
defineEmits<{ (e: 'update:modelValue', v: T): void }>()

const root = ref<HTMLElement | null>(null)
const btns = ref<HTMLElement[]>([])
const x = ref(0)
const w = ref(0)
// 首次定位不做动画，避免页面进入时滑块从 0 飞过来
const ready = ref(false)

const measure = () => {
  const i = props.options.findIndex(o => o.value === props.modelValue)
  const el = btns.value[i]
  if (!el || !el.offsetWidth) return
  x.value = el.offsetLeft - 2
  w.value = el.offsetWidth
}

let ro: ResizeObserver | null = null
onMounted(async () => {
  await nextTick()
  measure()
  requestAnimationFrame(() => { ready.value = true })
  if (root.value && 'ResizeObserver' in window) {
    ro = new ResizeObserver(measure)
    ro.observe(root.value)
    btns.value.forEach(b => ro!.observe(b))
  }
})
onBeforeUnmount(() => ro?.disconnect())

watch(() => props.modelValue, () => nextTick(measure))
watch(() => props.options, () => nextTick(measure), { deep: true })
</script>

<template>
  <div
    ref="root"
    class="split"
    :class="stacked ? 'split-v' : 'split-h'"
    :style="{ '--split': ratio + '%' }"
  >
    <slot name="a" />
    <div
      class="split-gutter"
      :class="{ 'is-drag': dragging }"
      role="separator"
      :aria-orientation="stacked ? 'horizontal' : 'vertical'"
      @pointerdown.prevent="start"
      @dblclick="reset"
    ></div>
    <slot name="b" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * 可拖拽分栏：
 * - 宽屏左右分栏，窄屏（< breakpoint）自动上下堆叠
 * - 拖动时用 pointer capture + rAF 节流；双击分隔线恢复默认比例
 * - 比例按 storageKey 持久化到 localStorage
 * 使用：<SplitPane storage-key="json"><template #a>…</template><template #b>…</template></SplitPane>
 * 子元素必须是两个直接子节点（通常是 Pane）。
 */
const props = withDefaults(defineProps<{
  storageKey?: string
  initial?: number
  min?: number
  breakpoint?: number
}>(), { initial: 50, min: 15, breakpoint: 860 })

const KEY = () => (props.storageKey ? 'split:' + props.storageKey : '')
const readSaved = () => {
  const k = KEY()
  const v = k ? parseFloat(localStorage.getItem(k) || '') : NaN
  return Number.isFinite(v) ? Math.max(props.min, Math.min(100 - props.min, v)) : props.initial
}

const root = ref<HTMLElement | null>(null)
const ratio = ref(readSaved())
const dragging = ref(false)
const stacked = ref(false)

let mq: MediaQueryList | null = null
const onMq = () => { stacked.value = !!mq?.matches }

onMounted(() => {
  mq = window.matchMedia(`(max-width: ${props.breakpoint}px)`)
  onMq()
  mq.addEventListener('change', onMq)
})
onBeforeUnmount(() => {
  mq?.removeEventListener('change', onMq)
  stopListening()
})

let raf = 0
const onMove = (e: PointerEvent) => {
  const el = root.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const p = stacked.value ? (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    ratio.value = Math.max(props.min, Math.min(100 - props.min, p * 100))
  })
}
const stopListening = () => {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', end)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}
const end = () => {
  dragging.value = false
  stopListening()
  const k = KEY()
  if (k) localStorage.setItem(k, String(ratio.value))
}
const start = () => {
  dragging.value = true
  document.body.style.cursor = stacked.value ? 'row-resize' : 'col-resize'
  document.body.style.userSelect = 'none'
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', end)
}
const reset = () => {
  ratio.value = props.initial
  const k = KEY()
  if (k) localStorage.removeItem(k)
}

defineExpose({ reset })
</script>

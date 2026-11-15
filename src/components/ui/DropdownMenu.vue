<template>
  <div ref="triggerEl" class="inline-flex shrink-0" v-bind="$attrs" @click.stop="toggle">
    <slot name="trigger" :open="open" />
  </div>

  <!-- 菜单挂到 body：不会被带 overflow 的工具栏/面板裁切 -->
  <Teleport to="body">
    <Transition name="menu">
      <div
        v-if="open"
        ref="menuEl"
        class="menu-pop"
        role="menu"
        :style="{ left: pos.left + 'px', top: pos.top + 'px', transformOrigin: pos.origin, minWidth: minWidth }"
        @click.stop
        @keydown="onKeydown"
      >
        <template v-for="(it, i) in items" :key="i">
          <div v-if="it.type === 'header'" class="menu-head">{{ it.label }}</div>
          <div v-else-if="it.type === 'sep'" class="menu-sep"></div>
          <button
            v-else
            type="button"
            role="menuitem"
            class="menu-item"
            :class="{ 'is-checked': it.checked, 'is-danger': it.danger }"
            :disabled="it.disabled"
            @click="pick(it)"
          >
            <span v-if="it.swatch" class="w-3.5 h-3.5 rounded-full shrink-0" :style="{ background: it.swatch, boxShadow: 'inset 0 0 0 1px hsl(0 0% 0% / 0.15)' }"></span>
            <component :is="it.icon" v-else-if="it.icon" class="w-3.5 h-3.5 shrink-0" />
            <span class="flex-1 truncate">{{ it.label }}</span>
            <kbd v-if="it.kbd">{{ it.kbd }}</kbd>
            <Check v-else-if="it.checked" class="w-3.5 h-3.5 shrink-0" />
          </button>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onBeforeUnmount, type Component } from 'vue'
import { Check } from 'lucide-vue-next'

// 根节点是 Fragment（触发器 + Teleport），手动把外部 class/属性挂到触发器容器上，
// 否则 max-lg:hidden 这类响应式类会被静默丢弃
defineOptions({ inheritAttrs: false })

/**
 * 下拉菜单：
 * - 触发器通过 #trigger 插槽自定义（可拿到 open 状态做箭头旋转等）
 * - 菜单挂载到 body 并用 fixed 定位，自动避让视口边缘（空间不足时向上翻转）
 * - 支持 ↑↓ 导航、Enter 选择、Esc 关闭、点击外部关闭
 */
export interface MenuItem {
  type?: 'item' | 'header' | 'sep'
  value?: string
  label?: string
  icon?: Component
  kbd?: string
  checked?: boolean
  danger?: boolean
  disabled?: boolean
  /** 色块（用于色板选择） */
  swatch?: string
}

const props = withDefaults(defineProps<{
  items: MenuItem[]
  align?: 'left' | 'right'
  minWidth?: string
}>(), { align: 'left', minWidth: '11rem' })

const emit = defineEmits<{
  (e: 'select', value: string, item: MenuItem): void
  (e: 'open'): void
  (e: 'close'): void
}>()

const open = ref(false)
const triggerEl = ref<HTMLElement | null>(null)
const menuEl = ref<HTMLElement | null>(null)
const pos = ref({ left: 0, top: 0, origin: 'top left' })

const place = () => {
  const t = triggerEl.value?.getBoundingClientRect()
  const m = menuEl.value
  if (!t || !m) return
  const mw = m.offsetWidth
  const mh = m.offsetHeight
  const gap = 6
  let left = props.align === 'right' ? t.right - mw : t.left
  left = Math.max(8, Math.min(left, window.innerWidth - mw - 8))
  let top = t.bottom + gap
  let vert = 'top'
  if (top + mh > window.innerHeight - 8 && t.top - gap - mh > 8) {
    top = t.top - gap - mh
    vert = 'bottom'
  }
  pos.value = { left, top, origin: `${vert} ${props.align === 'right' ? 'right' : 'left'}` }
}

const onDocDown = (e: MouseEvent) => {
  const n = e.target as Node
  if (menuEl.value?.contains(n) || triggerEl.value?.contains(n)) return
  close()
}
const onDocKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { close(); triggerEl.value?.querySelector('button')?.focus() } }

const show = async () => {
  open.value = true
  emit('open')
  await nextTick()
  place()
  document.addEventListener('mousedown', onDocDown, true)
  document.addEventListener('keydown', onDocKey)
  window.addEventListener('resize', close)
  window.addEventListener('blur', close)
}
const close = () => {
  if (!open.value) return
  open.value = false
  emit('close')
}
const toggle = () => (open.value ? close() : show())

watch(open, v => {
  if (!v) {
    document.removeEventListener('mousedown', onDocDown, true)
    document.removeEventListener('keydown', onDocKey)
    window.removeEventListener('resize', close)
    window.removeEventListener('blur', close)
  }
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocDown, true)
  document.removeEventListener('keydown', onDocKey)
  window.removeEventListener('resize', close)
  window.removeEventListener('blur', close)
})

const pick = (it: MenuItem) => {
  if (it.disabled || it.value === undefined) return
  close()
  emit('select', it.value, it)
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
  e.preventDefault()
  const list = Array.from(menuEl.value?.querySelectorAll<HTMLElement>('.menu-item:not(:disabled)') || [])
  if (!list.length) return
  const i = list.indexOf(document.activeElement as HTMLElement)
  const next = e.key === 'ArrowDown' ? (i + 1) % list.length : (i - 1 + list.length) % list.length
  list[next].focus()
}

defineExpose({ close, open: show })
</script>

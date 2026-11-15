<template>
  <div class="json-node select-none">
    <div
      class="json-node-row flex items-center gap-1 py-0.5 rounded-sm cursor-pointer hover:bg-muted/60"
      :style="{ paddingLeft: `${level * 12}px` }"
      @click="onRowClick"
    >
      <span
        v-if="isObjectOrArray"
        class="json-node-caret w-4 h-4 flex items-center justify-center text-muted-foreground transition-transform"
        :class="{ 'json-node-caret-open': isOpen }"
      >
        <ChevronRight class="w-3.5 h-3.5" />
      </span>
      <span v-else class="w-4 shrink-0" />
      <button
        type="button"
        class="json-node-key text-primary font-medium hover:underline"
        :title="path"
        @click.stop="emit('copy-path', path)"
      >
        {{ displayKey }}
      </button>
      <span v-if="isObjectOrArray" class="text-muted-foreground text-xs">
        {{ sizeLabel }}
      </span>
      <template v-else>
        <span class="text-muted-foreground">:</span>
        <span class="json-node-val text-xs" :class="valueClass">{{ formattedValue }}</span>
      </template>
    </div>
    <div v-if="isObjectOrArray" class="json-node-expand" :class="{ 'is-open': isOpen }">
      <div class="json-node-expand-inner">
        <JsonNode
          v-for="(child, key) in node as Record<string, unknown> | unknown[]"
          :key="String(key)"
          :node="child"
          :node-key="key"
          :level="level + 1"
          :path="childPath(key)"
          ref="childRefs"
          @copy-path="emit('copy-path', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  node: unknown
  nodeKey?: string | number
  level?: number
  path: string
}>()

const emit = defineEmits<{ (e: 'copy-path', path: string): void }>()

const level = computed(() => props.level ?? 0)
const isOpen = ref((props.level ?? 0) < 2)
const childRefs = ref<InstanceType<typeof import('./JsonNode.vue').default>[]>([])

const isArray = computed(() => Array.isArray(props.node))
const isObject = computed(
  () => props.node !== null && typeof props.node === 'object' && !Array.isArray(props.node),
)
const isObjectOrArray = computed(() => isArray.value || isObject.value)
const arrayLength = computed(() => (Array.isArray(props.node) ? props.node.length : 0))
const objectKeyCount = computed(() =>
  isObject.value ? Object.keys(props.node as Record<string, unknown>).length : 0,
)
// 摘要标签：数组 [n]，对象 {n}（放在脚本里，避免模板里出现 `}}` 被误判为插值结束）
const sizeLabel = computed(() =>
  isArray.value ? '[' + arrayLength.value + ']' : '{' + objectKeyCount.value + '}',
)

const displayKey = computed(() => {
  if (props.nodeKey === undefined || props.nodeKey === 'root') return '$'
  return String(props.nodeKey)
})

const formattedValue = computed(() => {
  const v = props.node
  if (typeof v === 'string') return JSON.stringify(v)
  if (v === null) return 'null'
  return String(v)
})

const valueClass = computed(() => {
  const v = props.node
  if (typeof v === 'string') return 'text-success'
  if (typeof v === 'number' || typeof v === 'bigint') return 'text-primary'
  if (typeof v === 'boolean') return 'text-warning'
  if (v === null) return 'text-muted-foreground'
  return ''
})

const childPath = (key: string | number): string => {
  if (isArray.value) return `${props.path}[${key}]`
  return `${props.path}.${key}`
}

const onRowClick = () => {
  if (isObjectOrArray.value) isOpen.value = !isOpen.value
}

function expand() {
  isOpen.value = true
  childRefs.value.forEach(c => c?.expand?.())
}

function collapse() {
  isOpen.value = false
  childRefs.value.forEach(c => c?.collapse?.())
}

defineExpose({ expand, collapse })
</script>

<style scoped>
.json-node-caret {
  transition: transform var(--dur-slow) var(--ease-out);
}
.json-node-caret-open {
  transform: rotate(90deg);
}
.json-node-expand {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--dur-slow) var(--ease-out);
}
.json-node-expand.is-open {
  grid-template-rows: 1fr;
}
.json-node-expand-inner {
  overflow: hidden;
}
</style>
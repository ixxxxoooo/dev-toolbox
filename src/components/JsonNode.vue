<template>
  <div class="json-node">
    <div @click="toggle" :style="{ marginLeft: level * 20 + 'px' }" class="node-line cursor-pointer flex items-center">
      <span v-if="isObjectOrArray" class="toggle-icon mr-1">{{ isOpen ? '&#9660;' : '&#9654;' }}</span>
      <span class="key text-purple-400">{{ nodeKey }}:</span>
      <span v-if="!isObjectOrArray" class="value ml-2" :class="getValueClass(node)">{{ formattedValue }}</span>
      <span v-else class="text-gray-500 ml-2">{{ isObject ? '{' + Object.keys(node).length + '}' : '[' + node.length + ']' }}</span>
    </div>
    <div v-if="isObjectOrArray && isOpen" class="children">
      <JsonNode v-for="(child, key) in node" :key="key" :node="child" :node-key="key" :level="level + 1" ref="childRefs" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  node: {
    type: [Object, Array, String, Number, Boolean, null] as any,
    required: true,
  },
  nodeKey: {
    type: [String, Number],
    default: 'root',
  },
  level: {
    type: Number,
    default: 0,
  },
});

const isOpen = ref(true);
const childRefs = ref<any[]>([]);

const isObject = computed(() => typeof props.node === 'object' && props.node !== null && !Array.isArray(props.node));
const isArray = computed(() => Array.isArray(props.node));
const isObjectOrArray = computed(() => isObject.value || isArray.value);

const formattedValue = computed(() => {
  if (typeof props.node === 'string') return `"${props.node}"`;
  if (props.node === null) return 'null';
  return props.node;
});

function toggle() {
  if (isObjectOrArray.value) {
    isOpen.value = !isOpen.value;
  }
}

function expand() {
  isOpen.value = true;
  childRefs.value.forEach((child: any) => child?.expand?.());
}

function collapse() {
  isOpen.value = false;
  childRefs.value.forEach((child: any) => child?.collapse?.());
}

function getValueClass(value: any) {
  const type = typeof value;
  if (type === 'string') return 'text-green-400';
  if (type === 'number') return 'text-blue-400';
  if (type === 'boolean') return 'text-red-400';
  if (value === null) return 'text-gray-500';
  return '';
}

defineExpose({ expand, collapse });
</script>

<style scoped>
.node-line:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>

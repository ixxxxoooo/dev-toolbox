<template>
  <div class="json-tree-view text-sm font-mono">
    <JsonNode :node="data" :level="0" ref="rootNode" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import JsonNode from './JsonNode.vue';

defineProps({
  data: {
    type: [Object, Array],
    required: true,
  },
});

const rootNode = ref<any>(null);

function expandAll() {
  rootNode.value?.expand();
}

function collapseAll() {
  rootNode.value?.collapse();
}

defineExpose({ expandAll, collapseAll });
</script>

<style scoped>
.json-tree-view {
  height: 100%;
  overflow: auto;
  padding: 10px;
}
</style>

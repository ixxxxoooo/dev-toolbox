<template>
  <div class="json-tree-view text-sm font-mono">
    <JsonNode :node="data" :level="0" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import JsonNode from './JsonNode.vue';

defineProps({
  data: {
    type: [Object, Array],
    required: true,
  },
});
</script>

<style scoped>
.json-tree-view {
  height: 100%;
  overflow: auto;
  padding: 10px;
}
</style>

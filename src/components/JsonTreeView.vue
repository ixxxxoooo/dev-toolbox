<template>
  <div class="json-tree-view h-full overflow-auto p-2 text-sm font-mono">
    <JsonNode :node="data" path="$" node-key="root" ref="rootNode" @copy-path="onCopyPath" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { copyText } from '@/utils/clipboard'
import { showToast } from '@/composables/useToast'
import JsonNode from './JsonNode.vue'

defineProps<{
  data: unknown
}>()

const { t } = useI18n()
const rootNode = ref<InstanceType<typeof JsonNode> | null>(null)

const onCopyPath = (path: string) => {
  void copyText(path).then(ok => {
    if (ok) showToast(t('tools.json.pathCopied', { path }), 'success', 2000)
  })
}

function expandAll() {
  rootNode.value?.expand()
}

function collapseAll() {
  rootNode.value?.collapse()
}

defineExpose({ expandAll, collapseAll })
</script>
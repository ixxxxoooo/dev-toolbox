<template>
  <div class="json-graph-node bg-card border border-border shadow-lg rounded-md text-sm flex flex-col min-w-[200px] max-w-[400px]">
    <!-- Header -->
    <div class="px-3 py-2 bg-muted/50 border-b border-border flex items-center justify-between rounded-t-md">
      <span class="font-semibold text-foreground truncate" :title="data.label">{{ data.label }}</span>
    </div>
    
    <!-- Body -->
    <div class="flex flex-col relative w-full">
      <template v-for="item in data.items" :key="item.id">
        <div class="flex items-start px-3 py-1.5 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors relative group w-full"
             :class="{'pr-8': item.isObjectOrArray}">
          
          <span class="text-blue-400 dark:text-blue-300 mr-2 shrink-0 truncate max-w-[120px]" :title="item.key">{{ item.key }}:</span>
          
          <span v-if="item.type === 'string'" class="text-green-600 dark:text-green-400 truncate flex-1 min-w-0" :title="item.value">"{{ item.value }}"</span>
          <span v-else-if="item.type === 'number'" class="text-orange-500 dark:text-orange-400 truncate flex-1 min-w-0">{{ item.value }}</span>
          <span v-else-if="item.type === 'boolean'" class="text-purple-500 dark:text-purple-400 truncate flex-1 min-w-0">{{ item.value }}</span>
          <span v-else-if="item.type === 'null'" class="text-gray-500 dark:text-gray-400 truncate flex-1 min-w-0">null</span>
          
          <span v-else-if="item.isObjectOrArray" class="text-muted-foreground text-xs my-auto italic flex-1 min-w-0 truncate">
            {{ item.type === 'object' ? `{ ${item.size} keys }` : `[ ${item.size} items ]` }}
          </span>
          <span v-else class="text-foreground truncate flex-1 min-w-0">{{ item.value }}</span>
          
          <!-- Port for edges -->
          <Handle
            v-if="item.isObjectOrArray"
            type="source"
            :position="Position.Right"
            :id="item.id"
            class="!w-2 !h-2 border-none !bg-blue-400/60 !-mr-[5px] z-10"
          />
        </div>
      </template>
      <div v-if="!data.items || data.items.length === 0" class="px-3 py-2 text-muted-foreground text-xs italic">
        Empty {{ data.type }}
      </div>
    </div>

    <!-- For incoming connections (to the node as a whole) -->
    <Handle 
      type="target" 
      :position="Position.Left" 
      id="target"
      class="!w-2 !h-2 border-none !bg-blue-400/60 !-ml-[5px] z-10" 
      style="top: 18px;" 
    />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

defineProps<{
  data: {
    label: string
    type: 'object' | 'array' | 'root'
    items: Array<{
      id: string // Used for source handle id
      key: string
      value: any
      type: string
      size?: number
      isObjectOrArray?: boolean
    }>
  }
}>()
</script>

<style scoped>
.json-graph-node {
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
}
.json-graph-node .vue-flow__handle {
  min-width: 8px;
  min-height: 8px;
}
</style>

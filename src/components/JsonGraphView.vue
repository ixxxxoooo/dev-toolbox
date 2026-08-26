<template>
  <div class="json-graph-container h-full w-full bg-background relative">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :default-viewport="{ zoom: 1 }"
      :min-zoom="0.1"
      :max-zoom="4"
      :nodes-draggable="false"
      fit-view-on-init
      class="vue-flow-theme"
      @pane-ready="onPaneReady"
    >
      <template #node-json="props">
        <JsonGraphNode :data="props.data" :id="props.id" />
      </template>

      <Background pattern-color="#888" :gap="20" />
      
      <!-- Unified Custom Controls Panel -->
      <Panel position="bottom-center" class="flex items-center bg-card border border-border rounded-lg shadow-lg overflow-hidden text-muted-foreground mb-4">
         <button @click="focusRoot" class="p-2 hover:bg-muted hover:text-foreground transition-colors border-r border-border" title="Center first item">
            <LocateFixed class="w-4 h-4" />
         </button>
         <button @click="fitView" class="p-2 hover:bg-muted hover:text-foreground transition-colors border-r border-border" title="Fit View">
            <Maximize class="w-4 h-4" />
         </button>
         <button @click="zoomOut" class="p-2 hover:bg-muted hover:text-foreground transition-colors border-r border-border" title="Zoom Out">
            <Minus class="w-4 h-4" />
         </button>
         <div class="px-3 py-2 text-xs font-mono min-w-[3.5rem] text-center border-r border-border" title="Current Zoom">
            {{ Math.round(viewport.zoom * 100) }}%
         </div>
         <button @click="zoomIn" class="p-2 hover:bg-muted hover:text-foreground transition-colors" title="Zoom In">
            <Plus class="w-4 h-4" />
         </button>
      </Panel>
    </VueFlow>

    <!-- Node Details Modal -->
    <div v-if="selectedNode" class="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" @click.self="selectedNode = null">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-foreground">
        <div class="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
          <h3 class="font-semibold text-sm">Node Details</h3>
          <button @click="selectedNode = null" class="text-muted-foreground hover:text-foreground transition-colors">
            <X class="w-4 h-4" />
          </button>
        </div>
        
        <div class="flex-1 overflow-auto p-4 space-y-6">
          <div>
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-xs font-medium text-muted-foreground">Content (Primitives only)</h4>
              <button @click="copyContent(JSON.stringify(getPrimitiveObject(selectedNode), null, 2))" class="text-xs text-muted-foreground hover:text-foreground flex items-center space-x-1">
                <Copy class="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>
            <div class="bg-muted/30 border border-border rounded-md p-3 font-mono text-xs overflow-auto whitespace-pre">
              <span v-html="syntaxHighlight(JSON.stringify(getPrimitiveObject(selectedNode), null, 2))"></span>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-xs font-medium text-muted-foreground">JSON Path</h4>
              <button @click="copyContent(selectedNode.path)" class="text-xs text-muted-foreground hover:text-foreground flex items-center space-x-1">
                <Copy class="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>
            <div class="bg-muted/30 border border-border rounded-md p-3 font-mono text-xs text-primary overflow-auto">
              {{ selectedNode.path }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, nextTick, shallowRef, ref } from 'vue'
import { VueFlow, Panel, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import dagre from 'dagre'
import JsonGraphNode from './JsonGraphNode.vue'
import { Maximize, LocateFixed, X, Copy, Plus, Minus } from 'lucide-vue-next'

const props = defineProps<{
  data: any
}>()

const nodes = shallowRef<any[]>([])
const edges = shallowRef<any[]>([])
const selectedNode = ref<any>(null)
let vueFlowInstance: any = null
const { zoomIn: lfZoomIn, zoomOut: lfZoomOut, viewport } = useVueFlow()

const onPaneReady = (instance: any) => {
  vueFlowInstance = instance
  
  instance.onNodeClick((evt: any) => {
    selectedNode.value = evt.node.data
  })

  setTimeout(() => {
    fitView()
  }, 100)
}

const layoutNodes = (ns: any[], es: any[]) => {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'LR', nodesep: 80, ranksep: 300 })
  g.setDefaultEdgeLabel(() => ({}))

  ns.forEach((node) => {
    const headerHeight = 36
    const rowHeight = 33
    // items count + empty message
    const lines = node.data.items.length > 0 ? node.data.items.length : 1
    const h = headerHeight + lines * rowHeight
    const w = 220 
    g.setNode(node.id, { width: w, height: h })
  })

  es.forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  dagre.layout(g)

  return ns.map((node) => {
    const nodeWithPosition = g.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      },
    }
  })
}

const buildGraph = () => {
  if (props.data === undefined || props.data === null) return

  const newNodes: any[] = []
  const newEdges: any[] = []
  let idCounter = 0

  const traverse = (obj: any, label: string, path: string = '$') => {
    const id = `node-${idCounter++}`
    const isArray = Array.isArray(obj)
    const type = isArray ? 'array' : obj === null ? 'null' : typeof obj

    const nodeData = {
      label,
      type: isArray ? 'array' : type,
      items: [] as any[],
      rawObject: obj,
      path: path
    }

    if (obj !== null && typeof obj === 'object') {
      const keys = Object.keys(obj)
      keys.forEach((key) => {
        const val = obj[key]
        const valIsArray = Array.isArray(val)
        const valType = valIsArray ? 'array' : val === null ? 'null' : typeof val
        const isObjectOrArray = val !== null && typeof val === 'object'
        
        const itemId = `${id}-handle-${key}`

        nodeData.items.push({
          id: itemId,
          key,
          value: isObjectOrArray ? null : String(val),
          type: valType,
          size: isObjectOrArray ? Object.keys(val).length : undefined,
          isObjectOrArray
        })

        if (isObjectOrArray) {
          const newPath = isArray ? `${path}[${key}]` : `${path}["${key}"]`
          const childId = traverse(val, isArray ? `[${key}]` : key, newPath)
          newEdges.push({
            id: `edge-${id}-${childId}`,
            source: id,
            target: childId,
            sourceHandle: itemId,
            targetHandle: 'target',
            label: key,
            type: 'default',
            animated: false,
            labelBgPadding: [6, 4],
            labelBgBorderRadius: 4,
            class: 'custom-vue-flow-edge'
          })
        }
      })
    }

    newNodes.push({
      id,
      type: 'json',
      data: nodeData,
      position: { x: 0, y: 0 } 
    })

    return id
  }

  // Handle primitives as root
  if (typeof props.data !== 'object' || props.data === null) {
     newNodes.push({
      id: `node-0`,
      type: 'json',
      data: {
        label: 'Root',
        type: props.data === null ? 'null' : typeof props.data,
        rawObject: props.data,
        path: '$',
        items: [{
          id: 'root-val',
          key: 'value',
          value: String(props.data),
          type: props.data === null ? 'null' : typeof props.data,
          isObjectOrArray: false
        }]
      },
      position: { x: 0, y: 0 } 
    })
  } else {
     traverse(props.data, 'Root')
  }

  const laidOutNodes = layoutNodes(newNodes, newEdges)
  
  nodes.value = laidOutNodes
  edges.value = newEdges

  nextTick(() => {
    if (vueFlowInstance) {
      setTimeout(() => fitView(), 50)
    }
  })
}

const fitView = () => {
  if (vueFlowInstance) {
    vueFlowInstance.fitView({ padding: 0.2, duration: 800 })
  }
}

const focusRoot = () => {
  if (vueFlowInstance) {
    const rootNode = vueFlowInstance.findNode('node-0');
    if (rootNode) {
      const w = rootNode.dimensions?.width || 220;
      const h = rootNode.dimensions?.height || 100;
      vueFlowInstance.setCenter(rootNode.position.x + w/2, rootNode.position.y + h/2, { zoom: 1.2, duration: 800 })
    }
  }
}

const zoomIn = () => lfZoomIn({ duration: 300 })
const zoomOut = () => lfZoomOut({ duration: 300 })

const getPrimitiveObject = (node: any) => {
  if (!node || !node.items) return {};
  const obj: Record<string, any> = {};
  node.items.filter((i: any) => !i.isObjectOrArray).forEach((i: any) => {
    obj[i.key] = i.value;
  });
  return obj;
}

const copyContent = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch(e) {}
}

const syntaxHighlight = (json: string) => {
  if (!json) return '';
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'text-[#d4d4d4]'; // default
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'text-[#9cdcfe]'; // key
      } else {
        cls = 'text-[#ce9178]'; // string
      }
    } else if (/true|false/.test(match)) {
      cls = 'text-[#569cd6]'; // boolean
    } else if (/null/.test(match)) {
      cls = 'text-[#569cd6]'; // null
    } else if (/^-?\d/.test(match)) {
      cls = 'text-[#b5cea8]'; // number
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

watch(() => props.data, () => {
    buildGraph()
}, { immediate: true, deep: true })

</script>

<style scoped>
.json-graph-container {
  overflow: hidden;
}
:global(.custom-vue-flow-edge .vue-flow__edge-path) {
  stroke: hsl(var(--border) / 0.8) !important;
  stroke-width: 1.5;
}
:global(.custom-vue-flow-edge.selected .vue-flow__edge-path) {
  stroke: hsl(var(--primary)) !important;
  stroke-width: 2;
}
:global(.custom-vue-flow-edge .vue-flow__edge-text) {
  font-family: var(--font-mono, 'JetBrains Mono', 'Fira Code', Consolas, monospace);
  fill: hsl(var(--foreground)) !important;
  font-size: 11px;
  font-weight: 500;
}
:global(.custom-vue-flow-edge .vue-flow__edge-textbg) {
  fill: hsl(var(--card)) !important;
  stroke: hsl(var(--border)) !important;
  stroke-width: 1px;
}
</style>

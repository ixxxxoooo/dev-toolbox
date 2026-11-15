<template>
  <ToolShell :icon="Share2" :title="t('tools.mermaid.name')" flush>
    <template #actions>
      <Segmented v-model="layoutMode" :options="layoutOptions" small />
      <DropdownMenu :items="themeMenuItems" align="left" class="max-xl:hidden" @select="onThemeSelect">
        <template #trigger>
          <button type="button" class="chip max-w-[8rem] truncate">
            {{ themeLabel }}
            <ChevronDown class="w-3 h-3 opacity-60 shrink-0" />
          </button>
        </template>
      </DropdownMenu>
      <DropdownMenu :items="lookMenuItems" align="left" class="max-lg:hidden" @select="onLookSelect">
        <template #trigger>
          <button type="button" class="chip max-w-[7rem] truncate">
            {{ lookLabel }}
            <ChevronDown class="w-3 h-3 opacity-60 shrink-0" />
          </button>
        </template>
      </DropdownMenu>
      <DropdownMenu :items="curveMenuItems" align="left" class="max-lg:hidden" @select="onCurveSelect">
        <template #trigger>
          <button type="button" class="chip max-w-[7rem] truncate">
            {{ curveLabel }}
            <ChevronDown class="w-3 h-3 opacity-60 shrink-0" />
          </button>
        </template>
      </DropdownMenu>
      <DropdownMenu :items="bgMenuItems" align="left" class="max-md:hidden" @select="onBgSelect">
        <template #trigger>
          <button type="button" class="chip">
            {{ bgLabel }}
            <ChevronDown class="w-3 h-3 opacity-60 shrink-0" />
          </button>
        </template>
      </DropdownMenu>
    </template>

    <template #right>
      <IconButton :title="t('tools.mermaid.downloadPng')" :disabled="!displaySvg" @click="downloadPng">
        <FileImage class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton :title="t('tools.mermaid.downloadSvg')" :disabled="!displaySvg" class="max-sm:hidden" @click="downloadSvg">
        <Download class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton :title="t('common.buttons.history')" @click="showHistory = true">
        <History class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton
        :title="isFullscreen ? t('tools.mermaid.exitFullscreen') : t('tools.mermaid.fullscreen')"
        :active="isFullscreen"
        @click="toggleFullscreen"
      >
        <Minimize2 v-if="isFullscreen" class="w-3.5 h-3.5" />
        <Maximize2 v-else class="w-3.5 h-3.5" />
      </IconButton>
      <DropdownMenu :items="overflowItems" align="right" @select="onOverflow">
        <template #trigger>
          <IconButton :title="t('tools.mermaid.overflowMenu')" small>
            <MoreHorizontal class="w-3.5 h-3.5" />
          </IconButton>
        </template>
      </DropdownMenu>
    </template>

    <template #help>
      <p>{{ t('tools.mermaid.description') }}</p>
      <p class="font-semibold mt-3 mb-1">{{ t('tools.mermaid.coreFeatures') }}</p>
      <ul class="list-disc list-inside space-y-1 text-muted-foreground">
        <li>{{ t('tools.mermaid.helpDrag') }}</li>
        <li>{{ t('tools.mermaid.helpZoom') }}</li>
      </ul>
    </template>

    <SplitPane v-if="layoutMode === 'split' && !isFullscreen" storage-key="mermaid" class="flex-1 min-h-0">
      <template #a>
        <Pane :title="t('tools.mermaid.editorPanel')" :badge="lineCount">
          <div ref="editorMount" class="absolute inset-0"></div>
        </Pane>
      </template>
      <template #b>
        <Pane :title="t('tools.mermaid.previewPanel')">
          <div
            ref="previewArea"
            class="absolute inset-0 overflow-hidden bg-card cursor-grab active:cursor-grabbing"
            @mousedown="startDrag"
            @wheel="handleWheel"
          >
            <div
              ref="svgContainer"
              class="absolute select-none"
              :class="{ 'is-stale is-stale-anim': error && lastGoodSvg }"
              :style="{
                transform: `translate(${currentPosition.x}px, ${currentPosition.y}px) scale(${currentScale})`,
                transformOrigin: '0 0',
              }"
              v-html="displaySvg"
            />
            <div class="absolute bottom-2 right-2 flex items-center gap-0.5 p-0.5 rounded-lg border border-border bg-card shadow-sm">
              <IconButton :title="t('tools.mermaid.zoomOut')" small @click="zoomOut">
                <ZoomOut class="w-3.5 h-3.5" />
              </IconButton>
              <IconButton :title="t('tools.mermaid.zoomIn')" small @click="zoomIn">
                <ZoomIn class="w-3.5 h-3.5" />
              </IconButton>
              <IconButton :title="t('tools.mermaid.zoomReset')" small @click="resetZoom">
                <RotateCcw class="w-3.5 h-3.5" />
              </IconButton>
            </div>
          </div>
        </Pane>
      </template>
    </SplitPane>

    <Pane v-else-if="layoutMode === 'edit' && !isFullscreen" class="flex-1 min-h-0" :title="t('tools.mermaid.editorPanel')" :badge="lineCount">
      <div ref="editorMount" class="absolute inset-0"></div>
    </Pane>

    <Pane
      v-else
      class="flex-1 min-h-0"
      :class="{ '!fixed inset-0 z-[80] !m-0 rounded-none': isFullscreen }"
      :title="t('tools.mermaid.previewPanel')"
    >
      <div
        ref="previewArea"
        class="absolute inset-0 overflow-hidden bg-card cursor-grab active:cursor-grabbing"
        @mousedown="startDrag"
        @wheel="handleWheel"
      >
        <div
          ref="svgContainer"
          class="absolute select-none"
          :class="{ 'is-stale is-stale-anim': error && lastGoodSvg }"
          :style="{
            transform: `translate(${currentPosition.x}px, ${currentPosition.y}px) scale(${currentScale})`,
            transformOrigin: '0 0',
          }"
          v-html="displaySvg"
        />
        <div class="absolute bottom-2 right-2 flex items-center gap-0.5 p-0.5 rounded-lg border border-border bg-card shadow-sm">
          <IconButton :title="t('tools.mermaid.zoomOut')" small @click="zoomOut">
            <ZoomOut class="w-3.5 h-3.5" />
          </IconButton>
          <IconButton :title="t('tools.mermaid.zoomIn')" small @click="zoomIn">
            <ZoomIn class="w-3.5 h-3.5" />
          </IconButton>
          <IconButton :title="t('tools.mermaid.zoomReset')" small @click="resetZoom">
            <RotateCcw class="w-3.5 h-3.5" />
          </IconButton>
        </div>
      </div>
    </Pane>

    <template #status>
      <StatusBar :state="error ? 'error' : renderPending ? 'warn' : 'ok'">
        <button v-if="error" type="button" class="sb-err max-w-[50%] truncate" :title="error">
          <AlertCircle class="shrink-0" />
          {{ t('tools.mermaid.renderErrorLabel') }}: {{ error }}
        </button>
        <span v-else-if="renderPending" class="sb-warn">{{ t('tools.mermaid.renderPending') }}</span>
        <span v-else class="sb-ok"><Check class="shrink-0" />{{ t('tools.mermaid.renderOk') }}</span>
        <span>{{ t('tools.mermaid.lineCount', { n: lineCount }) }}</span>
        <span v-if="lastRenderMs > 0">{{ t('tools.mermaid.renderMs', { n: lastRenderMs }) }}</span>
        <template #right>
          <span>{{ t('tools.mermaid.zoomPercent', { n: Math.round(currentScale * 100) }) }}</span>
          <span class="max-lg:hidden">{{ themeLabel }}</span>
        </template>
      </StatusBar>
    </template>

    <HistoryModal
      :show="showHistory"
      :history="history"
      type="mermaid"
      @close="showHistory = false"
      @select="useHistoryItem"
      @delete="deleteHistory"
      @clear="clearHistory"
    />
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, onBeforeUnmount, nextTick } from 'vue'
import {
  Share2,
  History,
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MoreHorizontal,
  ChevronDown,
  Check,
  AlertCircle,
  FileImage,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import * as monaco from '@/utils/monaco'
import mermaid from 'mermaid'
import { getMonacoTheme, watchThemeChange, registerGlobalShortcuts } from '@/utils/monaco-theme'
import { loadFromStorage, saveToStorage, saveToStorageDebounced } from '@/utils/localStorage'
import { useHistory } from '@/composables/useHistory'
import { showToast } from '@/composables/useToast'
import { useThemeStore } from '@/stores/theme'
import ToolShell from '@/components/ui/ToolShell.vue'
import SplitPane from '@/components/ui/SplitPane.vue'
import Pane from '@/components/ui/Pane.vue'
import Segmented, { type SegmentedOption } from '@/components/ui/Segmented.vue'
import IconButton from '@/components/ui/IconButton.vue'
import DropdownMenu, { type MenuItem } from '@/components/ui/DropdownMenu.vue'
import StatusBar from '@/components/ui/StatusBar.vue'
import HistoryModal from '@/components/HistoryModal.vue'

const { t } = useI18n()

/** 将界面 CSS 变量转为 #rrggbb，供 Mermaid themeVariables 使用 */
function cssVarToHex(name: string, alpha?: number): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const m = raw.match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/)
  if (!m) return '#808080'
  const h = parseFloat(m[1])
  const s = parseFloat(m[2]) / 100
  const l = parseFloat(m[3]) / 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * c).toString(16).padStart(2, '0')
  }
  const hex = `#${f(0)}${f(8)}${f(4)}`
  return alpha === undefined ? hex : hex + Math.round(alpha * 255).toString(16).padStart(2, '0')
}

type LayoutMode = 'edit' | 'split' | 'preview'
type MermaidThemeKey = 'default' | 'dark' | 'forest' | 'neutral' | 'base' | 'github' | 'dracula' | 'nord'
type MermaidLook = 'classic' | 'handDrawn'
type MermaidCurve =
  | 'linear' | 'basis' | 'cardinal' | 'step' | 'stepBefore' | 'stepAfter' | 'natural' | 'monotoneX'
type ExportBg = 'white' | 'transparent'

const DEFAULT_CODE = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[OK]
    B -->|No| D[Cancel]`

const STORAGE_KEY = 'mermaid-code'
const THEME_STORAGE_KEY = 'mermaid-theme'
const LOOK_STORAGE_KEY = 'mermaid-look'
const CURVE_STORAGE_KEY = 'mermaid-curve'
const VIEW_MODE_KEY = 'mermaid-view-mode'

const pendingTimers: ReturnType<typeof setTimeout>[] = []
const trackTimer = (handler: () => void, delay: number) => {
  const id = setTimeout(handler, delay)
  pendingTimers.push(id)
  return id
}

// Mermaid 语法高亮（注册一次即可）
monaco.languages.register({ id: 'mermaid' })
monaco.languages.setMonarchTokensProvider('mermaid', {
  keywords: [
    'graph', 'subgraph', 'end', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram', 'erDiagram',
    'gantt', 'pie', 'gitGraph', 'mindmap', 'timeline', 'participant', 'actor', 'Note', 'loop', 'alt', 'else',
    'opt', 'par', 'rect', 'activate', 'deactivate', 'autonumber', 'title', 'section',
  ],
  tokenizer: {
    root: [
      [/%%.*$/, 'comment'],
      [/\b(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|mindmap|timeline)\b/, 'keyword'],
      [/\b(subgraph|end|participant|actor|Note|loop|alt|else|opt|par|rect|activate|deactivate|autonumber|title|section|over|left of|right of)\b/, 'keyword'],
      [/\b(TB|TD|BT|RL|LR)\b/, 'type'],
      [/-->|==>|-.->|---->|---|===|-..-|--x|--o|<-->|o--o|x--x/, 'operator'],
      [/\|[^|]*\|/, 'string'],
      [/\[[^\]]*\]/, 'string'],
      [/\([^)]*\)/, 'string'],
      [/\{[^}]*\}/, 'string'],
      [/\b[A-Za-z_][A-Za-z0-9_]*\b/, 'identifier'],
      [/"[^"]*"/, 'string'],
      [/'[^']*'/, 'string'],
    ],
  },
})

/** 自定义主题尽量从界面色板派生，减少硬编码 */
const buildCustomThemes = (): Record<string, Record<string, string>> => ({
  github: {
    primaryColor: cssVarToHex('--primary'),
    primaryTextColor: cssVarToHex('--primary-foreground'),
    primaryBorderColor: cssVarToHex('--primary'),
    lineColor: cssVarToHex('--muted-foreground'),
    secondaryColor: cssVarToHex('--accent'),
    tertiaryColor: cssVarToHex('--muted'),
  },
  dracula: {
    primaryColor: cssVarToHex('--primary'),
    primaryTextColor: cssVarToHex('--foreground'),
    primaryBorderColor: cssVarToHex('--border'),
    lineColor: cssVarToHex('--foreground'),
    secondaryColor: cssVarToHex('--muted'),
    tertiaryColor: cssVarToHex('--card'),
  },
  nord: {
    primaryColor: cssVarToHex('--primary'),
    primaryTextColor: cssVarToHex('--foreground'),
    primaryBorderColor: cssVarToHex('--border'),
    lineColor: cssVarToHex('--muted-foreground'),
    secondaryColor: cssVarToHex('--accent'),
    tertiaryColor: cssVarToHex('--card'),
  },
})

const customThemeKeys = new Set(['github', 'dracula', 'nord'])
const themeKeys: MermaidThemeKey[] = ['default', 'dark', 'forest', 'neutral', 'base', 'github', 'dracula', 'nord']
const lookKeys: MermaidLook[] = ['classic', 'handDrawn']
const curveKeys: MermaidCurve[] = ['linear', 'basis', 'cardinal', 'step', 'stepBefore', 'stepAfter', 'natural', 'monotoneX']

const themeStore = useThemeStore()
const { history, addHistory, deleteHistory, clearHistory, updateMaxItems } = useHistory('mermaid', themeStore.historyLimit.value)

watch(() => themeStore.historyLimit.value, (newLimit) => {
  updateMaxItems(newLimit)
})

const layoutMode = ref<LayoutMode>(loadFromStorage(VIEW_MODE_KEY, 'split') as LayoutMode)
const code = ref(loadFromStorage(STORAGE_KEY, DEFAULT_CODE) as string)
const mermaidTheme = ref<MermaidThemeKey>(loadFromStorage(THEME_STORAGE_KEY, 'default') as MermaidThemeKey)
const mermaidLook = ref<MermaidLook>(loadFromStorage(LOOK_STORAGE_KEY, 'classic') as MermaidLook)
const mermaidCurve = ref<MermaidCurve>(loadFromStorage(CURVE_STORAGE_KEY, 'linear') as MermaidCurve)
const exportBg = ref<ExportBg>(loadFromStorage('mermaid-bg', 'white') as ExportBg)

const svgOutput = ref('')
const lastGoodSvg = ref('')
const error = ref('')
const showHistory = ref(false)
const isFullscreen = ref(false)
const renderPending = ref(false)
const lastRenderMs = ref(0)

const editorMount = ref<HTMLElement | null>(null)
const previewArea = ref<HTMLElement | null>(null)
const svgContainer = ref<HTMLElement | null>(null)

let editor: monaco.editor.IStandaloneCodeEditor | null = null
let themeWatcher: (() => void) | null = null
let contentListener: monaco.IDisposable | null = null

const scale = ref(1)
const position = ref({ x: 20, y: 20 })
const fullscreenScale = ref(1)
const fullscreenPosition = ref({ x: 20, y: 20 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

const currentScale = computed(() => (isFullscreen.value ? fullscreenScale.value : scale.value))
const currentPosition = computed(() => (isFullscreen.value ? fullscreenPosition.value : position.value))
const displaySvg = computed(() => svgOutput.value || lastGoodSvg.value)
const lineCount = computed(() => editor?.getModel()?.getLineCount() ?? code.value.split('\n').length)

const layoutOptions = computed<SegmentedOption<LayoutMode>[]>(() => [
  { value: 'edit', label: t('tools.mermaid.viewEdit') },
  { value: 'split', label: t('tools.mermaid.viewSplit') },
  { value: 'preview', label: t('tools.mermaid.viewPreview') },
])

const themeLabel = computed(() => t(`tools.mermaid.themes.${mermaidTheme.value}`))
const lookLabel = computed(() => t(`tools.mermaid.looks.${mermaidLook.value}`))
const curveLabel = computed(() => t(`tools.mermaid.curves.${mermaidCurve.value}`))
const bgLabel = computed(() => t(`tools.mermaid.backgrounds.${exportBg.value}`))

const themeMenuItems = computed<MenuItem[]>(() => [
  { type: 'header', label: t('tools.mermaid.theme') },
  ...themeKeys.map(k => ({ type: 'item' as const, value: k, label: t(`tools.mermaid.themes.${k}`), checked: mermaidTheme.value === k })),
])
const lookMenuItems = computed<MenuItem[]>(() => [
  { type: 'header', label: t('tools.mermaid.look') },
  ...lookKeys.map(k => ({ type: 'item' as const, value: k, label: t(`tools.mermaid.looks.${k}`), checked: mermaidLook.value === k })),
])
const curveMenuItems = computed<MenuItem[]>(() => [
  { type: 'header', label: t('tools.mermaid.curve') },
  ...curveKeys.map(k => ({ type: 'item' as const, value: k, label: t(`tools.mermaid.curves.${k}`), checked: mermaidCurve.value === k })),
])
const bgMenuItems = computed<MenuItem[]>(() => [
  { type: 'header', label: t('tools.mermaid.background') },
  { type: 'item', value: 'white', label: t('tools.mermaid.backgrounds.white'), checked: exportBg.value === 'white' },
  { type: 'item', value: 'transparent', label: t('tools.mermaid.backgrounds.transparent'), checked: exportBg.value === 'transparent' },
])

const overflowItems = computed<MenuItem[]>(() => [
  { type: 'header', label: t('tools.mermaid.theme') },
  ...themeKeys.map(k => ({
    type: 'item' as const,
    value: `theme:${k}`,
    label: t(`tools.mermaid.themes.${k}`),
    checked: mermaidTheme.value === k,
  })),
  { type: 'sep' },
  { type: 'header', label: t('tools.mermaid.look') },
  ...lookKeys.map(k => ({
    type: 'item' as const,
    value: `look:${k}`,
    label: t(`tools.mermaid.looks.${k}`),
    checked: mermaidLook.value === k,
  })),
  { type: 'sep' },
  ...curveKeys.map(k => ({
    type: 'item' as const,
    value: `curve:${k}`,
    label: t(`tools.mermaid.curves.${k}`),
    checked: mermaidCurve.value === k,
  })),
  { type: 'sep' },
  { type: 'item', value: 'bg:white', label: t('tools.mermaid.backgrounds.white'), checked: exportBg.value === 'white' },
  { type: 'item', value: 'bg:transparent', label: t('tools.mermaid.backgrounds.transparent'), checked: exportBg.value === 'transparent' },
  { type: 'sep' },
  { type: 'item', value: 'png', label: t('tools.mermaid.downloadPng') },
  { type: 'item', value: 'svg', label: t('tools.mermaid.downloadSvg'), disabled: !displaySvg.value },
])

let renderId = 0
let lastInitKey = ''
let renderDebounce: ReturnType<typeof setTimeout> | null = null

const initMermaid = (extra: { htmlLabels?: boolean } = {}) => {
  const customThemes = buildCustomThemes()
  const isCustomTheme = customThemeKeys.has(mermaidTheme.value)
  const key = JSON.stringify([mermaidTheme.value, mermaidLook.value, mermaidCurve.value, extra])
  if (key === lastInitKey) return
  lastInitKey = key
  type MermaidInit = NonNullable<Parameters<typeof mermaid.initialize>[0]>
  const builtInTheme = (isCustomTheme ? 'base' : mermaidTheme.value) as MermaidInit['theme']
  mermaid.initialize({
    startOnLoad: false,
    theme: builtInTheme,
    themeVariables: isCustomTheme ? customThemes[mermaidTheme.value] : undefined,
    look: mermaidLook.value,
    flowchart: { curve: mermaidCurve.value, ...extra },
    securityLevel: 'strict',
  })
}

const cleanupMermaidLeftovers = (id: string) => {
  document.getElementById(`d${id}`)?.remove()
  document.getElementById(id)?.remove()
}

const renderMermaid = async (resetView = false) => {
  if (!code.value.trim()) {
    svgOutput.value = ''
    error.value = ''
    lastGoodSvg.value = ''
    renderPending.value = false
    return
  }
  const myId = ++renderId
  const domId = `mermaid-svg-${myId}`
  const t0 = performance.now()
  try {
    initMermaid()
    const { svg } = await mermaid.render(domId, code.value)
    if (myId !== renderId) return
    svgOutput.value = svg
    lastGoodSvg.value = svg
    error.value = ''
    renderPending.value = false
    lastRenderMs.value = Math.round(performance.now() - t0)
    if (resetView) nextTick(() => fitToCenter())
  } catch (e: unknown) {
    cleanupMermaidLeftovers(domId)
    if (myId !== renderId) return
    const msg = e instanceof Error ? e.message : String(e)
    error.value = msg
    svgOutput.value = ''
    renderPending.value = false
    lastRenderMs.value = Math.round(performance.now() - t0)
  }
}

const scheduleRender = (resetView: boolean) => {
  renderPending.value = true
  if (renderDebounce) clearTimeout(renderDebounce)
  renderDebounce = setTimeout(() => {
    renderDebounce = null
    void renderMermaid(resetView)
  }, 300)
}

const fitToCenter = () => {
  if (!previewArea.value || !svgContainer.value) return
  const svg = svgContainer.value.querySelector('svg')
  if (!svg) return
  const containerRect = previewArea.value.getBoundingClientRect()
  const currentScaleVal = currentScale.value
  const svgRect = svg.getBoundingClientRect()
  const svgWidth = svgRect.width / currentScaleVal
  const svgHeight = svgRect.height / currentScaleVal
  if (svgWidth === 0 || svgHeight === 0) return
  const padding = 40
  const availableWidth = containerRect.width - padding * 2
  const availableHeight = containerRect.height - padding * 2
  const scaleX = availableWidth / svgWidth
  const scaleY = availableHeight / svgHeight
  const newScale = Math.max(0.8, Math.min(2, Math.min(scaleX, scaleY)))
  const scaledWidth = svgWidth * newScale
  const scaledHeight = svgHeight * newScale
  const newPosition = {
    x: (containerRect.width - scaledWidth) / 2,
    y: (containerRect.height - scaledHeight) / 2,
  }
  if (isFullscreen.value) {
    fullscreenScale.value = newScale
    fullscreenPosition.value = newPosition
  } else {
    scale.value = newScale
    position.value = newPosition
  }
}

watch(code, (newCode) => {
  saveToStorageDebounced(STORAGE_KEY, newCode)
  scheduleRender(true)
})

watch(mermaidTheme, (v) => { saveToStorage(THEME_STORAGE_KEY, v); void renderMermaid() })
watch(mermaidLook, (v) => { saveToStorage(LOOK_STORAGE_KEY, v); void renderMermaid() })
watch(mermaidCurve, (v) => { saveToStorage(CURVE_STORAGE_KEY, v); void renderMermaid() })
watch(exportBg, (v) => saveToStorage('mermaid-bg', v))
watch(layoutMode, (v) => {
  saveToStorage(VIEW_MODE_KEY, v)
  nextTick(() => remountEditor())
})

const remountEditor = () => {
  const mount = editorMount.value
  if (!mount || !editor) return
  const node = editor.getContainerDomNode()
  if (node.parentElement !== mount) mount.replaceChildren(node)
  editor.layout()
}

const useHistoryItem = (content: string) => {
  code.value = content
  editor?.setValue(content)
  showHistory.value = false
}

const onThemeSelect = (v: string) => { mermaidTheme.value = v as MermaidThemeKey }
const onLookSelect = (v: string) => { mermaidLook.value = v as MermaidLook }
const onCurveSelect = (v: string) => { mermaidCurve.value = v as MermaidCurve }
const onBgSelect = (v: string) => { exportBg.value = v as ExportBg }

const onOverflow = (v: string) => {
  if (v.startsWith('theme:')) onThemeSelect(v.slice(6))
  else if (v.startsWith('look:')) onLookSelect(v.slice(5))
  else if (v.startsWith('curve:')) onCurveSelect(v.slice(6))
  else if (v === 'bg:white') onBgSelect('white')
  else if (v === 'bg:transparent') onBgSelect('transparent')
  else if (v === 'png') void downloadPng()
  else if (v === 'svg') downloadSvg()
}

const startDrag = (e: MouseEvent) => {
  isDragging.value = true
  const pos = currentPosition.value
  dragStart.value = { x: e.clientX - pos.x, y: e.clientY - pos.y }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  const newPos = { x: e.clientX - dragStart.value.x, y: e.clientY - dragStart.value.y }
  if (isFullscreen.value) fullscreenPosition.value = newPos
  else position.value = newPos
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  if (isFullscreen.value) {
    fullscreenScale.value = Math.min(Math.max(0.1, fullscreenScale.value * delta), 10)
  } else {
    scale.value = Math.min(Math.max(0.1, scale.value * delta), 10)
  }
}

const zoomIn = () => {
  if (isFullscreen.value) fullscreenScale.value = Math.min(fullscreenScale.value * 1.2, 10)
  else scale.value = Math.min(scale.value * 1.2, 10)
}
const zoomOut = () => {
  if (isFullscreen.value) fullscreenScale.value = Math.max(fullscreenScale.value / 1.2, 0.1)
  else scale.value = Math.max(scale.value / 1.2, 0.1)
}
const resetZoom = () => fitToCenter()

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  nextTick(() => {
    fitToCenter()
    editor?.layout()
  })
}

const downloadSvg = () => {
  const svg = displaySvg.value
  if (!svg) return
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'mermaid-diagram.svg'
  a.click()
  URL.revokeObjectURL(url)
}

const downloadPng = async () => {
  if (!code.value.trim()) return
  const exportId = `mermaid-png-${++renderId}`
  try {
    initMermaid({ htmlLabels: false })
    const { svg: pngSvg } = await mermaid.render(exportId, code.value)
    lastInitKey = ''
    const parser = new DOMParser()
    const doc = parser.parseFromString(pngSvg, 'image/svg+xml')
    const svg = doc.querySelector('svg')
    if (!svg) return
    let width = parseFloat(svg.getAttribute('width') || '0')
    let height = parseFloat(svg.getAttribute('height') || '0')
    if (!width || !height) {
      const viewBox = svg.getAttribute('viewBox')?.split(' ').map(Number)
      if (viewBox && viewBox.length === 4) {
        width = viewBox[2]
        height = viewBox[3]
      }
    }
    const padding = 20
    width += padding * 2
    height += padding * 2
    svg.setAttribute('width', String(width))
    svg.setAttribute('height', String(height))
    const svgData = new XMLSerializer().serializeToString(svg)
    const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    const exportScale = 2
    img.onload = () => {
      try {
        canvas.width = width * exportScale
        canvas.height = height * exportScale
        if (exportBg.value === 'white') {
          ctx!.fillStyle = cssVarToHex('--background')
          ctx!.fillRect(0, 0, canvas.width, canvas.height)
        }
        ctx!.scale(exportScale, exportScale)
        ctx!.drawImage(img, 0, 0)
        const a = document.createElement('a')
        a.href = canvas.toDataURL('image/png', 1.0)
        a.download = 'mermaid-diagram.png'
        a.click()
      } catch (err) {
        console.error('PNG export failed:', err)
        showToast(t('tools.mermaid.pngFailed'), 'error', 4000)
      }
    }
    img.onerror = () => showToast(t('tools.mermaid.pngFailed'), 'error', 4000)
    img.src = dataUrl
  } catch (e) {
    cleanupMermaidLeftovers(exportId)
    lastInitKey = ''
    console.error('PNG export failed:', e)
    showToast(t('tools.mermaid.pngFailed'), 'error', 4000)
  }
}

onMounted(() => {
  nextTick(() => {
    if (editorMount.value) {
      editor = monaco.editor.create(editorMount.value, {
        value: code.value,
        language: 'mermaid',
        theme: getMonacoTheme(),
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        wordWrap: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false,
      })
      registerGlobalShortcuts(editor)
      themeWatcher = watchThemeChange(editor)
      contentListener = editor.onDidChangeModelContent(() => {
        code.value = editor?.getValue() ?? ''
      })
      editor.onDidPaste(() => {
        trackTimer(() => {
          const content = editor?.getValue() ?? ''
          if (content.trim()) addHistory(content)
        }, 50)
      })
    }
    void renderMermaid(true)
  })
})

onBeforeUnmount(() => {
  if (code.value.trim() && code.value !== DEFAULT_CODE) addHistory(code.value)
})

onUnmounted(() => {
  if (renderDebounce) clearTimeout(renderDebounce)
  while (pendingTimers.length) clearTimeout(pendingTimers.pop())
  contentListener?.dispose()
  themeWatcher?.()
  editor?.dispose()
  editor = null
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>
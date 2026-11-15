<template>
  <ToolShell :icon="NotebookText" :title="t('tools.markdown.name')" flush>
    <template #actions>
      <Segmented v-model="layoutMode" :options="layoutOptions" small />
      <ToggleChip v-model="showToc" class="max-lg:hidden" :title="t('tools.markdown.toc')">
        <List class="w-3 h-3" />
        {{ t('tools.markdown.toc') }}
      </ToggleChip>
    </template>

    <template #right>
      <IconButton :title="t('common.buttons.history')" @click="showHistory = true">
        <History class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton :title="t('tools.markdown.copyHtml')" :disabled="!previewHtml" @click="copyHtml">
        <Copy class="w-3.5 h-3.5" />
      </IconButton>
      <DropdownMenu :items="overflowItems" align="right" @select="onOverflow">
        <template #trigger>
          <IconButton :title="t('tools.markdown.overflowMenu')" small>
            <MoreHorizontal class="w-3.5 h-3.5" />
          </IconButton>
        </template>
      </DropdownMenu>
    </template>

    <template #help>
      <p>{{ t('tools.markdown.description') }}</p>
      <p class="font-semibold mt-3 mb-1">{{ t('tools.markdown.coreFeatures') }}</p>
      <ul class="list-disc list-inside space-y-1 text-muted-foreground">
        <li>{{ t('tools.markdown.featureLivePreview') }}</li>
        <li>{{ t('tools.markdown.featureToc') }}</li>
        <li>{{ t('tools.markdown.featureMermaid') }}</li>
        <li>{{ t('tools.markdown.featureSanitize') }}</li>
        <li>{{ t('tools.markdown.featureScrollSync') }}</li>
      </ul>
    </template>

    <SplitPane v-if="layoutMode === 'split'" storage-key="markdown" class="flex-1 min-h-0">
      <template #a>
        <Pane :title="t('tools.markdown.editorPanel')" :badge="lineCount">
          <template #actions>
            <IconButton :title="t('common.paste')" small @click="pasteFromClipboard">
              <ClipboardPaste class="w-3.5 h-3.5" />
            </IconButton>
          </template>
          <div ref="editorMount" class="absolute inset-0"></div>
        </Pane>
      </template>
      <template #b>
        <Pane :title="t('tools.markdown.previewPanel')">
          <template #actions>
            <DropdownMenu :items="tocMenuItems" align="right" @select="scrollToHeading">
              <template #trigger>
                <button type="button" class="chip lg:hidden" :title="t('tools.markdown.toc')">
                  <List class="w-3 h-3" />
                  {{ t('tools.markdown.toc') }}
                  <ChevronDown class="w-3 h-3 opacity-60" />
                </button>
              </template>
            </DropdownMenu>
            <IconButton
              :title="t('tools.markdown.toc')"
              small
              :active="showToc"
              class="max-lg:hidden"
              @click="showToc = !showToc"
            >
              <List class="w-3.5 h-3.5" />
            </IconButton>
          </template>
          <div class="absolute inset-0 flex min-h-0">
            <div
              ref="previewContainer"
              class="flex-1 relative overflow-auto p-4 md-prose bg-card text-foreground"
              :class="{ 'is-stale is-stale-anim': previewPending }"
              @scroll="onPreviewScroll"
            >
              <Transition name="page" mode="out-in">
                <div :key="previewHtml" v-html="previewHtml"></div>
              </Transition>
            </div>
            <aside
              v-if="showToc"
              ref="tocContainer"
              class="absolute top-2 right-2 bottom-2 w-52 z-10 flex flex-col rounded-lg border border-border bg-card shadow-pop overflow-hidden max-lg:hidden"
            >
              <div class="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground border-b border-border">
                {{ t('tools.markdown.outline') }}
              </div>
              <ul class="flex-1 overflow-y-auto p-2 space-y-0.5 text-xs">
                <li v-if="toc.length === 0" class="text-muted-foreground italic px-1">{{ t('tools.markdown.tocEmpty') }}</li>
                <li v-for="(item, index) in toc" :key="index" :style="{ paddingLeft: (item.depth - 1) * 0.6 + 'rem' }">
                  <button
                    type="button"
                    :data-slug="item.slug"
                    class="text-left truncate w-full py-1 px-1 rounded border-l-2 transition-colors"
                    :class="activeSlug === item.slug ? 'text-primary font-medium border-primary bg-primary/10' : 'text-muted-foreground border-transparent hover:text-primary hover:border-primary/50'"
                    :title="item.text"
                    @click="scrollToHeading(item.slug)"
                  >
                    {{ item.text }}
                  </button>
                </li>
              </ul>
            </aside>
          </div>
        </Pane>
      </template>
    </SplitPane>

    <Pane v-else-if="layoutMode === 'edit'" class="flex-1 min-h-0" :title="t('tools.markdown.editorPanel')" :badge="lineCount">
      <template #actions>
        <IconButton :title="t('common.paste')" small @click="pasteFromClipboard">
          <ClipboardPaste class="w-3.5 h-3.5" />
        </IconButton>
      </template>
      <div ref="editorMount" class="absolute inset-0"></div>
    </Pane>

    <Pane v-else class="flex-1 min-h-0" :title="t('tools.markdown.previewPanel')">
      <template #actions>
        <DropdownMenu :items="tocMenuItems" align="right" @select="scrollToHeading">
          <template #trigger>
            <button type="button" class="chip lg:hidden" :title="t('tools.markdown.toc')">
              <List class="w-3 h-3" />
              {{ t('tools.markdown.toc') }}
              <ChevronDown class="w-3 h-3 opacity-60" />
            </button>
          </template>
        </DropdownMenu>
        <IconButton
          :title="t('tools.markdown.toc')"
          small
          :active="showToc"
          class="max-lg:hidden"
          @click="showToc = !showToc"
        >
          <List class="w-3.5 h-3.5" />
        </IconButton>
      </template>
      <div class="absolute inset-0 flex min-h-0">
        <div
          ref="previewContainer"
          class="flex-1 relative overflow-auto p-4 md-prose bg-card text-foreground"
          :class="{ 'is-stale is-stale-anim': previewPending }"
          @scroll="onPreviewScroll"
        >
          <Transition name="page" mode="out-in">
            <div :key="previewHtml" v-html="previewHtml"></div>
          </Transition>
        </div>
        <aside
          v-if="showToc"
          ref="tocContainer"
          class="absolute top-2 right-2 bottom-2 w-52 z-10 flex flex-col rounded-lg border border-border bg-card shadow-pop overflow-hidden max-lg:hidden"
        >
          <div class="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground border-b border-border">
            {{ t('tools.markdown.outline') }}
          </div>
          <ul class="flex-1 overflow-y-auto p-2 space-y-0.5 text-xs">
            <li v-if="toc.length === 0" class="text-muted-foreground italic px-1">{{ t('tools.markdown.tocEmpty') }}</li>
            <li v-for="(item, index) in toc" :key="index" :style="{ paddingLeft: (item.depth - 1) * 0.6 + 'rem' }">
              <button
                type="button"
                :data-slug="item.slug"
                class="text-left truncate w-full py-1 px-1 rounded border-l-2 transition-colors"
                :class="activeSlug === item.slug ? 'text-primary font-medium border-primary bg-primary/10' : 'text-muted-foreground border-transparent hover:text-primary hover:border-primary/50'"
                :title="item.text"
                @click="scrollToHeading(item.slug)"
              >
                {{ item.text }}
              </button>
            </li>
          </ul>
        </aside>
      </div>
    </Pane>

    <template #status>
      <StatusBar state="ok">
        <span class="sb-ok"><Check class="w-3.5 h-3.5 shrink-0" />{{ t('tools.markdown.previewReady') }}</span>
        <span class="max-sm:hidden">{{ t('tools.markdown.wordCount', { n: wordCount }) }}</span>
        <span>{{ t('tools.markdown.lineCount', { n: lineCount }) }}</span>
        <span v-if="lastRenderMs > 0">{{ t('tools.markdown.renderMs', { n: lastRenderMs }) }}</span>
        <template #right>
          <span class="max-md:hidden">{{ t('tools.markdown.scrollSync') }}</span>
        </template>
      </StatusBar>
    </template>

    <HistoryModal
      :show="showHistory"
      :history="history"
      type="markdown"
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
  NotebookText,
  History,
  Copy,
  List,
  MoreHorizontal,
  Check,
  ClipboardPaste,
  ChevronDown,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { marked, type Tokens } from 'marked'
import mermaid from 'mermaid'
import DOMPurify from 'dompurify'
import * as monaco from '@/utils/monaco'
import ToolShell from '@/components/ui/ToolShell.vue'
import SplitPane from '@/components/ui/SplitPane.vue'
import Pane from '@/components/ui/Pane.vue'
import Segmented, { type SegmentedOption } from '@/components/ui/Segmented.vue'
import ToggleChip from '@/components/ui/ToggleChip.vue'
import IconButton from '@/components/ui/IconButton.vue'
import DropdownMenu, { type MenuItem } from '@/components/ui/DropdownMenu.vue'
import StatusBar from '@/components/ui/StatusBar.vue'
import HistoryModal from '@/components/HistoryModal.vue'
import { getMonacoTheme, watchThemeChange, registerGlobalShortcuts } from '@/utils/monaco-theme'
import { loadFromStorage, saveToStorage, saveToStorageDebounced } from '@/utils/localStorage'
import { useHistory } from '@/composables/useHistory'
import { copyText, readClipboardText } from '@/utils/clipboard'
import { useThemeStore } from '@/stores/theme'

const { t } = useI18n()

type LayoutMode = 'edit' | 'split' | 'preview'

const STORAGE_KEY = 'markdown-content'
const LEFT_WIDTH_KEY = 'markdown-left-width'
const COLLAPSED_KEY = 'markdown-editor-collapsed'
const SHOW_TOC_KEY = 'markdown-show-toc'
const VIEW_MODE_KEY = 'markdown-view-mode'
const SPLIT_LS_KEY = 'split:markdown'

const DEFAULT_MD = '# Hello World\n\nStart typing markdown here...\n\n```mermaid\ngraph TD;\n    A-->B;\n    A-->C;\n    B-->D;\n    C-->D;\n```'

DOMPurify.addHook('uponSanitizeElement', (node, data) => {
  const el = node as HTMLElement
  if (el.classList?.contains('mermaid') && data.tagName === 'div') {
    el.textContent = el.textContent
  }
})

const themeStore = useThemeStore()
const { history, addHistory, deleteHistory, clearHistory, updateMaxItems } = useHistory('markdown', themeStore.historyLimit.value)

watch(() => themeStore.historyLimit.value, (newLimit: number) => {
  updateMaxItems(newLimit)
})

const legacyCollapsed = loadFromStorage(COLLAPSED_KEY, false) as boolean
const layoutMode = ref<LayoutMode>(loadFromStorage(VIEW_MODE_KEY, legacyCollapsed ? 'preview' : 'split') as LayoutMode)
const markdown = ref(loadFromStorage(STORAGE_KEY, DEFAULT_MD) as string)
const previewSource = ref(markdown.value)
const showToc = ref(loadFromStorage(SHOW_TOC_KEY, false) as boolean)
const showHistory = ref(false)
const lastRenderMs = ref(0)

const editorMount = ref<HTMLElement | null>(null)
const previewContainer = ref<HTMLElement | null>(null)
const tocContainer = ref<HTMLElement | null>(null)
const activeSlug = ref('')
const isScrolling = ref<'editor' | 'preview' | null>(null)

let editor: monaco.editor.IStandaloneCodeEditor | null = null
let themeWatcher: (() => void) | null = null
let contentListener: monaco.IDisposable | null = null
let scrollListener: monaco.IDisposable | null = null
let saveTimer: ReturnType<typeof setTimeout> | null = null
let previewDebounce: ReturnType<typeof setTimeout> | null = null
let scrollTimeout: ReturnType<typeof setTimeout> | null = null
let htmlSlugCounts: Record<string, number> = {}

const layoutOptions = computed<SegmentedOption<LayoutMode>[]>(() => [
  { value: 'edit', label: t('tools.markdown.viewEdit') },
  { value: 'split', label: t('tools.markdown.viewSplit') },
  { value: 'preview', label: t('tools.markdown.viewPreview') },
])

const previewPending = computed(() => markdown.value !== previewSource.value)
const lineCount = computed(() => editor?.getModel()?.getLineCount() ?? markdown.value.split('\n').length)
const wordCount = computed(() => {
  const s = markdown.value.trim()
  if (!s) return 0
  return s.split(/\s+/).filter(Boolean).length
})

const slugify = (text: string, counts: Record<string, number>) => {
  let baseSlug = text
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>?/gm, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .replace(/^-+|-+$/g, '')
  if (!baseSlug) baseSlug = 'heading'
  if (counts[baseSlug] !== undefined) {
    counts[baseSlug]++
    return `${baseSlug}-${counts[baseSlug]}`
  }
  counts[baseSlug] = 0
  return baseSlug
}

interface HeadingToken extends Tokens.Heading {
  text: string
}

type HeadingRenderer = {
  parser: { parseInline: (tokens: Tokens.Generic[]) => string }
}

const renderer = {
  heading(this: HeadingRenderer, token: HeadingToken) {
    const depth = token.depth
    const inner = this.parser.parseInline(token.tokens)
    const slug = slugify(token.text, htmlSlugCounts)
    return `<h${depth} id="${slug}">${inner}</h${depth}>\n`
  },
}

marked.use({ renderer })

const toc = computed(() => {
  const tokens = marked.lexer(previewSource.value)
  const headings: { text: string; depth: number; slug: string }[] = []
  const tocCounts: Record<string, number> = {}
  for (const token of tokens) {
    if (token.type === 'heading') {
      const ht = token as HeadingToken
      headings.push({
        text: ht.text.replace(/<[^>]*>?/gm, ''),
        depth: ht.depth,
        slug: slugify(ht.text, tocCounts),
      })
    }
  }
  return headings
})

const previewHtml = computed(() => {
  htmlSlugCounts = {}
  const rawHtml = marked(previewSource.value) as string
  const withMermaid = rawHtml.replace(
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    '<div class="mermaid">$1</div>',
  )
  return DOMPurify.sanitize(withMermaid, { ADD_ATTR: ['target'] })
})

const tocMenuItems = computed<MenuItem[]>(() => {
  if (toc.value.length === 0) {
    return [{ type: 'item', value: '_empty', label: t('tools.markdown.tocEmpty'), disabled: true }]
  }
  return toc.value.map((item) => ({
    type: 'item' as const,
    value: item.slug,
    label: item.text,
  }))
})

const overflowItems = computed<MenuItem[]>(() => [
  { type: 'header', label: t('tools.markdown.overflowMenu') },
  { type: 'item', value: 'toc', label: t('tools.markdown.toc'), checked: showToc.value },
  { type: 'item', value: 'paste', label: t('common.paste'), icon: ClipboardPaste },
  { type: 'item', value: 'copyHtml', label: t('tools.markdown.copyHtml'), icon: Copy, disabled: !previewHtml.value },
])

const schedulePreviewUpdate = () => {
  if (previewDebounce) clearTimeout(previewDebounce)
  previewDebounce = setTimeout(() => {
    previewDebounce = null
    previewSource.value = markdown.value
  }, 280)
}

watch(markdown, (newVal) => {
  saveToStorageDebounced(STORAGE_KEY, newVal)
  schedulePreviewUpdate()
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    if (newVal.trim()) addHistory(newVal)
  }, 2000)
})

watch(previewSource, () => {
  void renderMermaidWithTiming()
})

watch(showToc, (v) => saveToStorage(SHOW_TOC_KEY, v))

watch(layoutMode, () => {
  saveToStorage(VIEW_MODE_KEY, layoutMode.value)
  saveToStorage(COLLAPSED_KEY, layoutMode.value === 'preview')
  nextTick(() => remountEditor())
})

const remountEditor = () => {
  const mount = editorMount.value
  if (!mount || !editor) return
  const node = editor.getContainerDomNode()
  if (node.parentElement !== mount) {
    mount.replaceChildren(node)
  }
  editor.layout()
}

const renderMermaidWithTiming = async () => {
  const t0 = performance.now()
  await nextTick()
  if (!previewContainer.value) return
  const nodes = previewContainer.value.querySelectorAll('.mermaid')
  if (nodes.length > 0) {
    try {
      await mermaid.run({ nodes: nodes as unknown as HTMLElement[] })
    } catch (e) {
      console.error('Mermaid rendering error:', e)
    }
  }
  lastRenderMs.value = Math.round(performance.now() - t0)
  updateActiveHeading()
}

const copyHtml = () => {
  void copyText(previewHtml.value)
}

const onOverflow = (value: string) => {
  if (value === 'toc') showToc.value = !showToc.value
  if (value === 'paste') void pasteFromClipboard()
  if (value === 'copyHtml') copyHtml()
}

const pasteFromClipboard = async () => {
  const text = await readClipboardText()
  if (!text || !editor) return
  const sel = editor.getSelection()
  if (sel) editor.executeEdits('paste', [{ range: sel, text, forceMoveMarkers: true }])
}

const scrollToHeading = (slug: string) => {
  if (!slug || slug === '_empty' || !previewContainer.value) return
  const element = previewContainer.value.querySelector(`[id="${CSS.escape(slug)}"]`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSlug.value = slug
  }
}

const onEditorScroll = () => {
  if (!editor || isScrolling.value === 'preview') return
  isScrolling.value = 'editor'
  const scrollable = editor.getScrollTop()
  const scrollHeight = editor.getScrollHeight()
  const layoutInfo = editor.getLayoutInfo()
  const range = scrollHeight - layoutInfo.height
  const percentage = range > 0 ? scrollable / range : 0
  if (previewContainer.value) {
    const pRange = previewContainer.value.scrollHeight - previewContainer.value.clientHeight
    previewContainer.value.scrollTop = percentage * pRange
  }
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => { isScrolling.value = null }, 50)
}

const onPreviewScroll = (e: Event) => {
  updateActiveHeading()
  if (isScrolling.value === 'editor' || !editor) return
  isScrolling.value = 'preview'
  const el = e.target as HTMLElement
  const range = el.scrollHeight - el.clientHeight
  const percentage = range > 0 ? el.scrollTop / range : 0
  const layoutInfo = editor.getLayoutInfo()
  const edRange = editor.getScrollHeight() - layoutInfo.height
  editor.setScrollTop(percentage * edRange)
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => { isScrolling.value = null }, 50)
}

const updateActiveHeading = () => {
  if (!previewContainer.value || !showToc.value) return
  const headings = Array.from(previewContainer.value.querySelectorAll('h1, h2, h3, h4, h5, h6')) as HTMLElement[]
  if (headings.length === 0) return
  const containerTop = previewContainer.value.getBoundingClientRect().top
  let currentId = ''
  for (const heading of headings) {
    const rect = heading.getBoundingClientRect()
    if (rect.top <= containerTop + 100) currentId = heading.id
    else break
  }
  if (!currentId && headings.length > 0 && previewContainer.value.scrollTop < 50) {
    currentId = headings[0].id
  }
  if (currentId) activeSlug.value = currentId
}

watch(activeSlug, (newSlug) => {
  if (!newSlug || !tocContainer.value) return
  nextTick(() => {
    const activeBtn = tocContainer.value?.querySelector(`button[data-slug="${CSS.escape(newSlug)}"]`) as HTMLElement | null
    if (!activeBtn || !tocContainer.value) return
    const containerRect = tocContainer.value.getBoundingClientRect()
    const btnRect = activeBtn.getBoundingClientRect()
    if (btnRect.top < containerRect.top + 20 || btnRect.bottom > containerRect.bottom - 20) {
      const scrollOffset =
        tocContainer.value.scrollTop + (btnRect.top - containerRect.top) - containerRect.height / 2 + btnRect.height / 2
      tocContainer.value.scrollTo({ top: scrollOffset, behavior: 'smooth' })
    }
  })
})

const useHistoryItem = (content: string) => {
  markdown.value = content
  editor?.setValue(content)
  previewSource.value = content
  showHistory.value = false
}

const migrateSplitRatio = () => {
  if (localStorage.getItem(SPLIT_LS_KEY)) return
  const w = loadFromStorage(LEFT_WIDTH_KEY, 0) as number
  if (w > 0) {
    const pct = Math.max(15, Math.min(85, (w / window.innerWidth) * 100))
    localStorage.setItem(SPLIT_LS_KEY, String(pct))
  }
}

onMounted(() => {
  migrateSplitRatio()
  mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'strict' })
  nextTick(() => {
    if (editorMount.value) {
      editor = monaco.editor.create(editorMount.value, {
        value: markdown.value,
        language: 'markdown',
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
        markdown.value = editor?.getValue() ?? ''
      })
      scrollListener = editor.onDidScrollChange(onEditorScroll)
    }
    void renderMermaidWithTiming()
  })
})

onBeforeUnmount(() => {
  if (markdown.value.trim()) addHistory(markdown.value)
})

onUnmounted(() => {
  contentListener?.dispose()
  scrollListener?.dispose()
  themeWatcher?.()
  editor?.dispose()
  editor = null
  if (saveTimer) clearTimeout(saveTimer)
  if (previewDebounce) clearTimeout(previewDebounce)
  if (scrollTimeout) clearTimeout(scrollTimeout)
})
</script>

<style scoped>
.md-prose :deep(h1) {
  @apply text-2xl font-bold mb-4;
}
.md-prose :deep(h2) {
  @apply text-xl font-bold mb-3 mt-6;
}
.md-prose :deep(h3) {
  @apply text-lg font-bold mb-2 mt-4;
}
.md-prose :deep(p) {
  @apply mb-4 leading-relaxed;
}
.md-prose :deep(ul) {
  @apply list-disc list-inside mb-4;
}
.md-prose :deep(ol) {
  @apply list-decimal list-inside mb-4;
}
.md-prose :deep(code) {
  @apply bg-muted px-1.5 py-0.5 rounded text-sm font-mono;
}
.md-prose :deep(pre) {
  @apply bg-muted p-3 rounded-lg overflow-x-auto mb-4;
}
.md-prose :deep(pre code) {
  @apply bg-transparent p-0;
}
.md-prose :deep(blockquote) {
  @apply border-l-4 border-primary/50 pl-4 italic mb-4;
}
.md-prose :deep(a) {
  @apply text-primary hover:underline;
}
.md-prose :deep(img) {
  @apply max-w-full rounded-lg;
}
.md-prose :deep(table) {
  @apply w-full border-collapse mb-4;
}
.md-prose :deep(th),
.md-prose :deep(td) {
  @apply border border-border px-3 py-2;
}
.md-prose :deep(th) {
  @apply bg-muted/50 font-bold text-left;
}
</style>
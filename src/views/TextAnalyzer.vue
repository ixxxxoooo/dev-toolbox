<template>
  <ToolShell :icon="FileText" :title="t('tools.textAnalyzer.name')" flush>
    <template #right>
      <IconButton :title="t('common.paste')" @click="pasteInput">
        <ClipboardPaste class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton :title="t('common.clear')" danger @click="clearInput">
        <Trash2 class="w-3.5 h-3.5" />
      </IconButton>
    </template>

    <template #help>
      <p>{{ t('tools.textAnalyzer.description') }}</p>
      <p class="font-semibold mt-3 mb-2">{{ t('tools.textAnalyzer.coreFeatures') }}</p>
      <ul class="list-disc list-inside space-y-1 text-muted-foreground">
        <li><strong>{{ t('tools.textAnalyzer.stats.charsWithSpaces') }}:</strong> {{ t('tools.textAnalyzer.stats.charsWithSpacesDesc') }}</li>
        <li><strong>{{ t('tools.textAnalyzer.stats.charsWithoutSpaces') }}:</strong> {{ t('tools.textAnalyzer.stats.charsWithoutSpacesDesc') }}</li>
        <li><strong>{{ t('tools.textAnalyzer.stats.words') }}:</strong> {{ t('tools.textAnalyzer.stats.wordsDesc') }}</li>
        <li><strong>{{ t('tools.textAnalyzer.stats.lines') }}:</strong> {{ t('tools.textAnalyzer.stats.linesDesc') }}</li>
        <li><strong>{{ t('tools.textAnalyzer.stats.paragraphs') }}:</strong> {{ t('tools.textAnalyzer.stats.paragraphsDesc') }}</li>
      </ul>
    </template>

    <SplitPane storage-key="text-analyzer" :initial="62">
      <template #a>
        <Pane :title="t('tools.textAnalyzer.inputPanel')">
          <div class="absolute inset-0">
            <div ref="editorRef" class="absolute inset-0"></div>
          </div>
        </Pane>
      </template>
      <template #b>
        <Pane :title="t('tools.textAnalyzer.statsPanel')">
          <Transition name="stats-fade" mode="out-in">
            <div :key="statsKey" class="p-2 h-full flex items-center">
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 w-full">
                <div
                  v-for="item in statItems"
                  :key="item.key"
                  class="flex flex-col items-center justify-center rounded-md border border-border bg-muted/20 px-2 py-2"
                >
                  <span class="text-lg font-semibold text-primary tabular-nums leading-tight">{{ item.value }}</span>
                  <span class="text-[10px] text-muted-foreground text-center mt-1 leading-snug">{{ item.label }}</span>
                </div>
              </div>
            </div>
          </Transition>
        </Pane>
      </template>
    </SplitPane>

    <template #status>
      <StatusBar>
        <span v-if="inputText.length" class="text-muted-foreground">
          {{
            t('tools.textAnalyzer.statusSummary', {
              chars: stats.charsWithSpaces,
              words: stats.words,
              lines: stats.lines,
            })
          }}
        </span>
        <span v-else class="text-muted-foreground">{{ t('tools.textAnalyzer.statusEmpty') }}</span>
        <template #right>
          <span class="max-md:hidden">{{ t('tools.textAnalyzer.stats.paragraphs') }}: {{ stats.paragraphs }}</span>
        </template>
      </StatusBar>
    </template>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import * as monaco from '@/utils/monaco'
import { FileText, ClipboardPaste, Trash2 } from 'lucide-vue-next'
import ToolShell from '@/components/ui/ToolShell.vue'
import SplitPane from '@/components/ui/SplitPane.vue'
import Pane from '@/components/ui/Pane.vue'
import IconButton from '@/components/ui/IconButton.vue'
import StatusBar from '@/components/ui/StatusBar.vue'
import { getMonacoTheme, watchThemeChange, registerGlobalShortcuts } from '../utils/monaco-theme'
import { useDebounceFn } from '../composables/useDebounceFn'
import { readClipboardText } from '../utils/clipboard'

const { t } = useI18n()

const editorRef = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let themeWatcher: (() => void) | null = null

const inputText = ref('')
const stats = ref({
  charsWithSpaces: 0,
  charsWithoutSpaces: 0,
  words: 0,
  lines: 0,
  paragraphs: 0,
})

const statsKey = computed(
  () => `${stats.value.charsWithSpaces}:${stats.value.words}:${stats.value.lines}`
)

const statItems = computed(() => [
  { key: 'cws', value: stats.value.charsWithSpaces, label: t('tools.textAnalyzer.stats.charsWithSpaces') },
  { key: 'cwo', value: stats.value.charsWithoutSpaces, label: t('tools.textAnalyzer.stats.charsWithoutSpaces') },
  { key: 'words', value: stats.value.words, label: t('tools.textAnalyzer.stats.words') },
  { key: 'lines', value: stats.value.lines, label: t('tools.textAnalyzer.stats.lines') },
  { key: 'para', value: stats.value.paragraphs, label: t('tools.textAnalyzer.stats.paragraphs') },
])

const analyzeText = () => {
  const text = inputText.value
  stats.value.charsWithSpaces = text.length
  stats.value.charsWithoutSpaces = text.replace(/\s/g, '').length
  const wordsMatch = text.match(/\b\w+\b|[\u4e00-\u9fa5]/gu)
  stats.value.words = wordsMatch ? wordsMatch.length : 0
  stats.value.lines = text ? text.split(/\r\n|\r|\n/).length : 0
  stats.value.paragraphs = text.split(/\r\n\r\n|\r\r|\n\n/).filter((p: string) => p.trim() !== '').length
}

const analyzeTextDebounced = useDebounceFn(analyzeText, 250)

const initEditor = async () => {
  await nextTick()
  if (editorRef.value) {
    editor = monaco.editor.create(editorRef.value, {
      value: inputText.value,
      language: 'plaintext',
      theme: getMonacoTheme(),
      automaticLayout: true,
      minimap: { enabled: false },
      wordWrap: 'on',
      scrollBeyondLastLine: false,
      padding: { top: 16, bottom: 16 },
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
    })
    editor.onDidChangeModelContent(() => {
      inputText.value = editor?.getValue() || ''
      analyzeTextDebounced.run()
    })
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {})
    themeWatcher = watchThemeChange(editor)
    registerGlobalShortcuts(editor)
  }
  analyzeText()
}

const pasteInput = async () => {
  const text = await readClipboardText()
  if (text === null) return
  analyzeTextDebounced.cancel()
  editor?.setValue(text)
  analyzeText()
}

const clearInput = () => {
  analyzeTextDebounced.cancel()
  editor?.setValue('')
  analyzeText()
}

onMounted(initEditor)
onBeforeUnmount(() => {
  themeWatcher?.()
  editor?.dispose()
})
</script>

<style scoped>
.stats-fade-enter-active {
  transition:
    opacity var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-out);
}
.stats-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
</style>
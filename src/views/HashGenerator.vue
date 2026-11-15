<template>
  <ToolShell :icon="Hash" :title="t('tools.hash.name')" flush>
    <template #right>
      <IconButton :title="t('common.paste')" @click="pasteInput">
        <ClipboardPaste class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton :title="t('common.clear')" danger @click="clearInput">
        <Trash2 class="w-3.5 h-3.5" />
      </IconButton>
    </template>

    <template #help>
      <p>{{ t('tools.hash.description') }}</p>
      <p class="font-semibold mt-3 mb-2">{{ t('tools.hash.coreFeatures') }}</p>
      <ul class="list-disc list-inside space-y-1 text-muted-foreground">
        <li><strong>MD5:</strong> {{ t('tools.hash.md5Description') }}</li>
        <li><strong>SHA-1:</strong> {{ t('tools.hash.sha1Description') }}</li>
        <li><strong>SHA-256:</strong> {{ t('tools.hash.sha256Description') }}</li>
        <li><strong>SHA-512:</strong> {{ t('tools.hash.sha512Description') }}</li>
      </ul>
    </template>

    <SplitPane storage-key="hash" :initial="42">
      <template #a>
        <Pane :title="t('tools.hash.inputPanel')">
          <template #actions>
            <IconButton :title="t('common.copy')" small @click="copyInput">
              <Copy class="w-3.5 h-3.5" />
            </IconButton>
          </template>
          <div class="absolute inset-0">
            <div ref="editorRef" class="absolute inset-0"></div>
          </div>
        </Pane>
      </template>
      <template #b>
        <Pane :title="t('tools.hash.resultPanel')" scroll>
          <Transition name="result-fade" mode="out-in">
            <div :key="resultKey" class="p-2 space-y-1.5">
              <div
                v-for="hashType in hashTypes"
                :key="hashType.key"
                class="flex items-start gap-2 rounded-md border border-border bg-muted/20 px-2 py-1.5 group hover:border-primary/40"
                style="transition: border-color var(--dur-fast) var(--ease-out)"
              >
                <span class="text-xs font-semibold text-foreground w-16 shrink-0 pt-0.5">{{ hashType.label }}</span>
                <span class="font-mono text-xs break-all text-muted-foreground flex-1 select-all">{{ hashes[hashType.key] || '—' }}</span>
                <IconButton
                  :title="t('common.copy')"
                  small
                  class="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 shrink-0"
                  style="transition: opacity var(--dur-fast) var(--ease-out)"
                  @click="copyHash(hashType.key)"
                >
                  <Copy class="w-3.5 h-3.5" />
                </IconButton>
              </div>
            </div>
          </Transition>
        </Pane>
      </template>
    </SplitPane>

    <template #status>
      <StatusBar>
        <span v-if="inputText.length" class="text-muted-foreground">
          {{ t('tools.hash.statusChars', { n: inputText.length }) }}
        </span>
        <span v-else class="text-muted-foreground">{{ t('tools.hash.statusEmpty') }}</span>
        <template #right>
          <span class="max-sm:hidden">UTF-8</span>
        </template>
      </StatusBar>
    </template>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import * as monaco from '@/utils/monaco'
import { Hash, ClipboardPaste, Trash2, Copy } from 'lucide-vue-next'
import { MD5, SHA1, SHA256, SHA512 } from 'crypto-js'
import ToolShell from '@/components/ui/ToolShell.vue'
import SplitPane from '@/components/ui/SplitPane.vue'
import Pane from '@/components/ui/Pane.vue'
import IconButton from '@/components/ui/IconButton.vue'
import StatusBar from '@/components/ui/StatusBar.vue'
import { getMonacoTheme, watchThemeChange, registerGlobalShortcuts } from '../utils/monaco-theme'
import { useDebounceFn } from '../composables/useDebounceFn'
import { copyText, readClipboardText } from '../utils/clipboard'

type HashKey = 'md5' | 'sha1' | 'sha256' | 'sha512'

const { t } = useI18n()

const editorRef = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let themeWatcher: (() => void) | null = null

const inputText = ref('Hello World!')
const hashes = ref<Record<HashKey, string>>({
  md5: '',
  sha1: '',
  sha256: '',
  sha512: '',
})

const hashTypes = [
  { key: 'md5' as const, label: 'MD5' },
  { key: 'sha1' as const, label: 'SHA-1' },
  { key: 'sha256' as const, label: 'SHA-256' },
  { key: 'sha512' as const, label: 'SHA-512' },
]

// 结果区过渡 key：哈希整体更新时触发淡入
const resultKey = computed(() => `${hashes.value.md5}:${inputText.value.length}`)

const generateHashes = () => {
  const text = inputText.value
  hashes.value.md5 = MD5(text).toString()
  hashes.value.sha1 = SHA1(text).toString()
  hashes.value.sha256 = SHA256(text).toString()
  hashes.value.sha512 = SHA512(text).toString()
}

const generateHashesDebounced = useDebounceFn(generateHashes, 200)

const replaceTextInEditor = (newText: string) => {
  if (!editor) return
  const model = editor.getModel()
  if (model) {
    const fullRange = model.getFullModelRange()
    editor.executeEdits('hash-processor', [{ range: fullRange, text: newText }])
  } else {
    editor.setValue(newText)
  }
}

const initEditor = async () => {
  await nextTick()
  if (editorRef.value) {
    editor = monaco.editor.create(editorRef.value, {
      value: inputText.value,
      language: 'plaintext',
      theme: getMonacoTheme(),
      automaticLayout: true,
      minimap: { enabled: false },
      wordWrap: 'on' as const,
      scrollBeyondLastLine: false,
      padding: { top: 16, bottom: 16 },
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
    })
    editor.onDidChangeModelContent(() => {
      inputText.value = editor?.getValue() || ''
      generateHashesDebounced.run()
    })
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {})
    themeWatcher = watchThemeChange(editor)
    registerGlobalShortcuts(editor)
  }
  generateHashes()
}

const pasteInput = async () => {
  const text = await readClipboardText()
  if (text === null) return
  generateHashesDebounced.cancel()
  replaceTextInEditor(text)
  generateHashes()
}

const clearInput = () => {
  generateHashesDebounced.cancel()
  replaceTextInEditor('')
  generateHashes()
}

const copyInput = () => copyText(inputText.value)

const copyHash = (key: HashKey) => {
  void copyText(hashes.value[key])
}

onMounted(initEditor)
onBeforeUnmount(() => {
  themeWatcher?.()
  editor?.dispose()
})
</script>

<style scoped>
.result-fade-enter-active {
  transition:
    opacity var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-out);
}
.result-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
</style>
<template>
  <ToolShell :icon="Languages" :title="t('tools.unicodeConverter.name')" flush>
    <template #actions>
      <ToggleChip v-model="onlyNonAscii" :title="t('tools.unicodeConverter.onlyNonAscii')">
        {{ t('tools.unicodeConverter.onlyNonAscii') }}
      </ToggleChip>
    </template>

    <template #right>
      <IconButton :title="t('tools.unicodeConverter.textToUnicode')" @click="textToUnicode">
        <ArrowDown class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton :title="t('tools.unicodeConverter.unicodeToText')" @click="unicodeToText">
        <ArrowUp class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton :title="t('tools.unicodeConverter.swap')" @click="swapContent">
        <ArrowUpDown class="w-3.5 h-3.5" />
      </IconButton>
    </template>

    <template #help>
      <p>{{ t('tools.unicodeConverter.description') }}</p>
      <p class="font-semibold mt-3 mb-2">{{ t('tools.unicodeConverter.features') }}</p>
      <ul class="list-disc list-inside space-y-1 text-muted-foreground">
        <li>
          <strong>{{ t('tools.unicodeConverter.textToUnicode') }}:</strong>
          {{ t('tools.unicodeConverter.textToUnicodeDesc') }}
        </li>
        <li>
          <strong>{{ t('tools.unicodeConverter.unicodeToText') }}:</strong>
          {{ t('tools.unicodeConverter.unicodeToTextDesc') }}
        </li>
      </ul>
    </template>

    <SplitPane storage-key="unicode" class="flex-1 min-h-0 h-full">
      <template #a>
        <Pane :title="t('common.labels.input')">
          <template #actions>
            <IconButton :title="t('common.paste')" small @click="pasteInput">
              <ClipboardPaste class="w-3.5 h-3.5" />
            </IconButton>
            <IconButton :title="t('common.clear')" small @click="clearInput">
              <Trash2 class="w-3.5 h-3.5" />
            </IconButton>
          </template>
          <textarea
            v-model="inputText"
            class="absolute inset-0 w-full h-full resize-none border-0 bg-transparent p-2 text-sm font-mono outline-none"
            :placeholder="t('tools.unicodeConverter.inputPlaceholder')"
            spellcheck="false"
          />
        </Pane>
      </template>
      <template #b>
        <Pane :title="t('common.labels.output')" :badge="outputBadge">
          <template #actions>
            <IconButton :title="t('common.copy')" small :disabled="!outputText" @click="copyOutput">
              <Copy class="w-3.5 h-3.5" />
            </IconButton>
            <IconButton :title="t('common.clear')" small @click="clearOutput">
              <Trash2 class="w-3.5 h-3.5" />
            </IconButton>
          </template>
          <textarea
            v-model="outputText"
            readonly
            class="absolute inset-0 w-full h-full resize-none border-0 bg-transparent p-2 text-sm font-mono outline-none text-muted-foreground"
            :placeholder="t('tools.unicodeConverter.outputPlaceholder')"
            spellcheck="false"
          />
        </Pane>
      </template>
    </SplitPane>

    <template #status>
      <StatusBar>
        <span v-if="inputText">{{ t('tools.unicodeConverter.statusInput', { n: inputText.length }) }}</span>
        <span v-else class="text-muted-foreground">{{ t('tools.unicodeConverter.statusReady') }}</span>
        <template #right>
          <span v-if="outputText">{{ t('tools.unicodeConverter.statusOutput', { n: outputText.length }) }}</span>
        </template>
      </StatusBar>
    </template>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Languages,
  ClipboardPaste,
  Copy,
  Trash2,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
} from 'lucide-vue-next'
import ToolShell from '@/components/ui/ToolShell.vue'
import SplitPane from '@/components/ui/SplitPane.vue'
import Pane from '@/components/ui/Pane.vue'
import StatusBar from '@/components/ui/StatusBar.vue'
import IconButton from '@/components/ui/IconButton.vue'
import ToggleChip from '@/components/ui/ToggleChip.vue'
import { encodeUnicodeEscapes, decodeUnicodeEscapes } from '@/utils/unicode'
import { copyText, readClipboardText } from '@/utils/clipboard'
const { t } = useI18n()

const inputText = ref('')
const outputText = ref('')
const onlyNonAscii = ref(false)

const outputBadge = computed(() => (outputText.value ? `${outputText.value.length}` : ''))

const textToUnicode = () => {
  if (!inputText.value) return
  outputText.value = encodeUnicodeEscapes(inputText.value, onlyNonAscii.value)
}

const unicodeToText = () => {
  if (!inputText.value) return
  outputText.value = decodeUnicodeEscapes(inputText.value)
}

const swapContent = () => {
  const temp = inputText.value
  inputText.value = outputText.value
  outputText.value = temp
}

const pasteInput = async () => {
  const text = await readClipboardText()
  if (text !== null) inputText.value = text
}

const copyOutput = () => {
  if (!outputText.value) return
  void copyText(outputText.value)
}

const clearInput = () => {
  inputText.value = ''
}

const clearOutput = () => {
  outputText.value = ''
}
</script>
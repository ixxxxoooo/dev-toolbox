<template>
  <ToolShell :icon="Fingerprint" :title="t('tools.uuid.name')" flush>
    <template #right>
      <button type="button" class="btn btn-primary h-7 px-2.5 text-xs press gap-1.5" @click="generateUuid">
        <RefreshCw class="w-3.5 h-3.5" />
        <span class="max-sm:hidden">{{ t('common.buttons.generateUuid') }}</span>
      </button>
      <IconButton :title="t('common.copy')" :disabled="!uuid" @click="copyUuid">
        <Copy class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton :title="t('common.clear')" danger :disabled="!uuid" @click="clearUuid">
        <Trash2 class="w-3.5 h-3.5" />
      </IconButton>
    </template>

    <template #help>
      <p>{{ t('tools.uuid.description') }}</p>
      <p class="font-semibold mt-3 mb-2">{{ t('tools.uuid.coreFeatures') }}</p>
      <ul class="list-disc list-inside space-y-1 text-muted-foreground">
        <li><strong>{{ t('tools.uuid.uuidv4') }}:</strong> {{ t('tools.uuid.uuidv4Description') }}</li>
        <li><strong>{{ t('tools.uuid.format') }}:</strong> {{ t('tools.uuid.formatDescription') }}</li>
      </ul>
    </template>

    <SplitPane storage-key="uuid">
      <template #a>
        <Pane :title="t('tools.uuid.infoPanel')" scroll>
          <div class="p-3 space-y-2 text-xs text-muted-foreground">
            <p>{{ t('tools.uuid.uuidv4Description') }}</p>
            <p class="font-mono text-[11px] text-foreground/80">{{ t('tools.uuid.formatDescription') }}</p>
            <p>{{ t('tools.uuid.hintGenerate') }}</p>
          </div>
        </Pane>
      </template>
      <template #b>
        <Pane :title="t('tools.uuid.resultPanel')">
          <template #actions>
            <IconButton :title="t('common.copy')" small :disabled="!uuid" @click="copyUuid">
              <Copy class="w-3.5 h-3.5" />
            </IconButton>
          </template>
          <div class="p-3 flex flex-col items-stretch justify-center min-h-[120px] gap-2">
            <Transition name="uuid-in" mode="out-in">
              <input
                v-if="uuid"
                :key="uuid"
                type="text"
                readonly
                :value="uuid"
                class="field font-mono text-sm text-center h-9"
              />
              <p v-else class="text-xs text-muted-foreground text-center py-8">
                {{ t('common.placeholders.clickToGenerate') }}
              </p>
            </Transition>
          </div>
        </Pane>
      </template>
    </SplitPane>

    <template #status>
      <StatusBar :state="uuid ? 'ok' : undefined">
        <span v-if="uuid" class="sb-ok">{{ t('tools.uuid.uuidv4') }}</span>
        <span v-else class="text-muted-foreground">{{ t('tools.uuid.statusEmpty') }}</span>
        <template #right>
          <span v-if="uuid" class="font-mono text-[10px] max-sm:hidden truncate max-w-[12rem]">{{ uuid }}</span>
        </template>
      </StatusBar>
    </template>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Fingerprint, RefreshCw, Trash2, Copy } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import ToolShell from '@/components/ui/ToolShell.vue'
import IconButton from '@/components/ui/IconButton.vue'
import SplitPane from '@/components/ui/SplitPane.vue'
import Pane from '@/components/ui/Pane.vue'
import StatusBar from '@/components/ui/StatusBar.vue'
import { addDisableSaveShortcut, removeDisableSaveShortcut } from '@/utils/keyboardUtils'
import { copyText } from '@/utils/clipboard'

const { t } = useI18n()

const uuid = ref('')

/** 生成符合 RFC 4122 的 v4 UUID */
const generateUuid = () => {
  const cryptoObj = globalThis.crypto
  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    const bytes = new Uint8Array(16)
    cryptoObj.getRandomValues(bytes)
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
    uuid.value = `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`
    return
  }
  console.warn('crypto.getRandomValues unavailable, falling back to Math.random (NOT secure)')
  uuid.value = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16)
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const copyUuid = () => {
  if (uuid.value) void copyText(uuid.value)
}

const clearUuid = () => {
  uuid.value = ''
}

onMounted(() => {
  generateUuid()
  addDisableSaveShortcut()
})

onBeforeUnmount(() => {
  removeDisableSaveShortcut()
})
</script>

<style scoped>
.uuid-in-enter-active {
  transition:
    opacity var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-out);
}
.uuid-in-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
</style>
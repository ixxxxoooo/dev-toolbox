<template>
  <ToolShell :icon="Monitor" :title="t('tools.userAgent.name')" scroll>
    <template #right>
      <IconButton :title="t('tools.userAgent.useMyUa')" @click="useMyUa">
        <Laptop class="w-3.5 h-3.5" />
      </IconButton>
      <IconButton :title="t('common.copy')" :disabled="!uaString" @click="copyUa">
        <Copy class="w-3.5 h-3.5" />
      </IconButton>
    </template>

    <template #help>
      <p>{{ t('tools.userAgent.description') }}</p>
    </template>

    <div class="flex flex-col gap-2 min-h-0">
      <textarea
        v-model="uaString"
        class="field w-full min-h-[4.5rem] max-h-32 resize-y font-mono text-xs leading-relaxed py-2"
        :placeholder="t('tools.userAgent.placeholder')"
        spellcheck="false"
      />

      <div
        v-if="parsedUa"
        class="grid gap-2 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]"
      >
        <section
          v-for="card in infoCards"
          :key="card.id"
          class="rounded-lg border border-border bg-card p-2"
        >
          <header class="flex items-center gap-1.5 mb-2 text-xs font-semibold text-foreground">
            <component :is="card.icon" class="w-3.5 h-3.5 text-primary shrink-0" />
            {{ card.title }}
          </header>
          <dl class="space-y-1.5 text-xs">
            <div
              v-for="row in card.rows"
              :key="row.label"
              class="flex items-start justify-between gap-2 border-b border-border/40 pb-1 last:border-0 last:pb-0"
            >
              <dt class="text-muted-foreground shrink-0">{{ row.label }}</dt>
              <dd class="font-medium text-right break-all">{{ row.value }}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>

    <template #status>
      <StatusBar>
        <span v-if="parsedUa" class="sb-ok">
          <Check class="shrink-0" />
          {{ parsedUa.browser.name || '—' }}
          {{ parsedUa.browser.version || '' }}
        </span>
        <span v-else class="text-muted-foreground">{{ t('tools.userAgent.statusEmpty') }}</span>
        <template #right>
          <span v-if="uaString">{{ t('tools.userAgent.statusLength', { n: uaString.length }) }}</span>
        </template>
      </StatusBar>
    </template>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Monitor, Globe, Cpu, Smartphone, Copy, Laptop, Check } from 'lucide-vue-next'
import { UAParser, type IResult } from 'ua-parser-js'
import ToolShell from '@/components/ui/ToolShell.vue'
import StatusBar from '@/components/ui/StatusBar.vue'
import IconButton from '@/components/ui/IconButton.vue'
import { copyText } from '@/utils/clipboard'
const { t } = useI18n()

const uaString = ref('')

const parsedUa = computed((): IResult | null => {
  if (!uaString.value.trim()) return null
  return new UAParser(uaString.value).getResult()
})

const dash = '—'

const infoCards = computed(() => {
  const p = parsedUa.value
  if (!p) return []
  const deviceType = p.device.type || t('tools.userAgent.desktop')
  return [
    {
      id: 'browser',
      icon: Globe,
      title: t('tools.userAgent.browser'),
      rows: [
        { label: t('tools.userAgent.fields.name'), value: p.browser.name || dash },
        { label: t('tools.userAgent.fields.version'), value: p.browser.version || dash },
        {
          label: t('tools.userAgent.fields.engine'),
          value: [p.engine.name, p.engine.version].filter(Boolean).join(' ') || dash,
        },
      ],
    },
    {
      id: 'os',
      icon: Cpu,
      title: t('tools.userAgent.os'),
      rows: [
        { label: t('tools.userAgent.fields.name'), value: p.os.name || dash },
        { label: t('tools.userAgent.fields.version'), value: p.os.version || dash },
        { label: t('tools.userAgent.fields.platform'), value: p.cpu.architecture || dash },
      ],
    },
    {
      id: 'device',
      icon: Smartphone,
      title: t('tools.userAgent.device'),
      rows: [
        { label: t('tools.userAgent.fields.vendor'), value: p.device.vendor || dash },
        { label: t('tools.userAgent.fields.model'), value: p.device.model || dash },
        { label: t('tools.userAgent.fields.type'), value: deviceType },
      ],
    },
  ]
})

const useMyUa = () => {
  uaString.value = navigator.userAgent
}

const copyUa = () => {
  if (!uaString.value) return
  void copyText(uaString.value)
}

onMounted(() => {
  useMyUa()
})
</script>
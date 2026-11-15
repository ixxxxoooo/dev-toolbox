import { ref, watch } from 'vue'

/**
 * 侧栏导航状态：固定工具 + 最近使用。
 * 以路由 name 为键，持久化到 localStorage（纯本地，离线可用）。
 * 使用模块级单例，多个组件共享同一份状态。
 */
const PIN_KEY = 'nav-pinned'
const RECENT_KEY = 'nav-recent'
const RECENT_MAX = 4

const readList = (key: string): string[] => {
  try {
    const v = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

const pinned = ref<string[]>(readList(PIN_KEY))
const recent = ref<string[]>(readList(RECENT_KEY))

watch(pinned, v => localStorage.setItem(PIN_KEY, JSON.stringify(v)), { deep: true })
watch(recent, v => localStorage.setItem(RECENT_KEY, JSON.stringify(v)), { deep: true })

export function useToolNav() {
  const isPinned = (name: string) => pinned.value.includes(name)

  const togglePin = (name: string) => {
    pinned.value = isPinned(name)
      ? pinned.value.filter(n => n !== name)
      : [...pinned.value, name]
  }

  /** 记录一次访问：去重后置顶，最多保留 RECENT_MAX 条 */
  const touchRecent = (name: string) => {
    recent.value = [name, ...recent.value.filter(n => n !== name)].slice(0, RECENT_MAX)
  }

  return { pinned, recent, isPinned, togglePin, touchRecent }
}

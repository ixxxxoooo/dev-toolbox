import i18n from '@/locales'
import { showToast } from '@/composables/useToast'

/**
 * 复制文本到剪贴板（带成功/失败提示）。
 * 与直接 `try { navigator.clipboard.writeText() }` 不同，这里会 await Promise，
 * 因此权限被拒等异步失败也能被捕获并提示用户。
 * @returns 是否复制成功
 */
export const copyText = async (text: string, silent = false): Promise<boolean> => {
  const t = i18n.global.t
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      // 兜底：非安全上下文下没有 Clipboard API
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      if (!ok) throw new Error('execCommand copy failed')
    }
    if (!silent) showToast(t('common.messages.copied'), 'success')
    return true
  } catch (err) {
    console.error('Cannot copy to clipboard:', err)
    showToast(t('common.messages.copyFailed'), 'error', 3000)
    return false
  }
}

/**
 * 读取剪贴板文本；失败时提示并返回 null。
 */
export const readClipboardText = async (): Promise<string | null> => {
  const t = i18n.global.t
  try {
    return await navigator.clipboard.readText()
  } catch (err) {
    console.error('Cannot read clipboard:', err)
    showToast(t('common.messages.cannotReadClipboard'), 'error', 3000)
    return null
  }
}

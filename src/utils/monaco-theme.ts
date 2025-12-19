import { watch, type WatchStopHandle } from 'vue'
import { useThemeStore } from '../stores/theme'
import { defineCustomThemes } from './monaco-themes'

// Ensure custom themes are defined once
let themesDefined = false
function ensureThemes() {
  if (!themesDefined) {
    defineCustomThemes()
    themesDefined = true
  }
}

/**
 * 根据当前主题返回对应的 Monaco Editor 主题名称
 * @returns Monaco Editor 主题名称
 */
export function getMonacoTheme(): string {
  ensureThemes()
  const themeStore = useThemeStore()
  if (themeStore.editorTheme.value === 'auto') {
    return themeStore.isDark.value ? 'vs-dark' : 'vs'
  }
  return themeStore.editorTheme.value
}

/**
 * 监听主题变化并更新 Monaco Editor 实例的主题
 * @param editor Monaco Editor 实例
 * @returns 清理函数，用于取消监听
 */
export function watchThemeChange(editor: any): WatchStopHandle {
  const themeStore = useThemeStore()

  // 立即应用当前主题
  const updateTheme = () => {
    const theme = getMonacoTheme()
    if (editor && typeof editor.updateOptions === 'function') {
      editor.updateOptions({ theme })
    }
  }

  // 立即更新主题
  updateTheme()

  // 监听主题变化
  return watch(
    [() => themeStore.isDark.value, () => themeStore.editorTheme.value],
    () => {
      updateTheme()
    }
  )
}

/**
 * 为 Diff Editor 监听主题变化
 * @param diffEditor Monaco Diff Editor 实例
 * @returns 清理函数
 */
export function watchThemeChangeForDiffEditor(diffEditor: any): WatchStopHandle {
  const themeStore = useThemeStore()

  const updateTheme = () => {
    const theme = getMonacoTheme()
    if (diffEditor && typeof diffEditor.updateOptions === 'function') {
      diffEditor.updateOptions({ theme })
    }
  }

  // 立即更新主题
  updateTheme()

  // 监听主题变化
  return watch(
    [() => themeStore.isDark.value, () => themeStore.editorTheme.value],
    () => {
      updateTheme()
    }
  )
}

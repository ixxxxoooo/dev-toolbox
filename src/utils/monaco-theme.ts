import { watch, type WatchStopHandle } from 'vue'
import { useThemeStore } from '../stores/theme'
import { defineCustomThemes } from './monaco-themes'
import * as monaco from '@/utils/monaco'
import { useCommandPaletteStore } from '../stores/commandPalette'

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
    return ensureAutoTheme(themeStore.palette.value, themeStore.isDark.value)
  }
  return themeStore.editorTheme.value
}

/** 当前编辑器字号（px），来自设置 */
export function getEditorFontSize(): number {
  return useThemeStore().editorFontSize.value
}

/** 行高随字号等比变化，保持阅读密度一致 */
export function getEditorLineHeight(): number {
  return Math.round(getEditorFontSize() * 1.6)
}

/** 读取 CSS 变量（形如 "225 24% 9%"）并转成 #rrggbb，供 Monaco 使用 */
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

// 已注册的自动主题名缓存：同一「色板 × 明暗」只注册一次
const autoThemes = new Set<string>()

/**
 * 「自动」编辑器主题：背景、选区、行高亮直接取自当前界面色板，
 * 让编辑器和外围界面浑然一体。名称带上色板与明暗，切换时 Monaco 会重新套用。
 */
function ensureAutoTheme(palette: string, dark: boolean): string {
  const name = `toolbox-${palette}-${dark ? 'dark' : 'light'}`
  if (autoThemes.has(name)) return name
  monaco.editor.defineTheme(name, {
    base: dark ? 'vs-dark' : 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': cssVarToHex('--card'),
      'editor.foreground': cssVarToHex('--foreground'),
      'editor.lineHighlightBackground': cssVarToHex('--muted', dark ? 0.7 : 0.9),
      'editorLineNumber.foreground': cssVarToHex('--muted-foreground', 0.7),
      'editorLineNumber.activeForeground': cssVarToHex('--foreground'),
      'editor.selectionBackground': cssVarToHex('--primary', 0.28),
      'editor.inactiveSelectionBackground': cssVarToHex('--primary', 0.14),
      'editorCursor.foreground': cssVarToHex('--primary'),
      'editorWidget.background': cssVarToHex('--popover'),
      'editorGutter.background': cssVarToHex('--card'),
      'scrollbarSlider.background': cssVarToHex('--muted-foreground', 0.25),
      'scrollbarSlider.hoverBackground': cssVarToHex('--muted-foreground', 0.4),
    }
  })
  autoThemes.add(name)
  return name
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
  // 字号变化：设置面板调整后所有编辑器即时生效
  const updateFont = () => {
    if (editor && typeof editor.updateOptions === 'function') {
      editor.updateOptions({ fontSize: getEditorFontSize() })
    }
  }

  // 立即更新主题
  updateTheme()

  // 监听主题与字号变化
  const stopTheme = watch(
    [() => themeStore.isDark.value, () => themeStore.editorTheme.value, () => themeStore.palette.value],
    () => {
      updateTheme()
    }
  )
  const stopFont = watch(() => themeStore.editorFontSize.value, updateFont)
  return () => {
    stopTheme()
    stopFont()
  }
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
  const updateFont = () => {
    if (diffEditor && typeof diffEditor.updateOptions === 'function') {
      diffEditor.updateOptions({ fontSize: getEditorFontSize(), lineHeight: getEditorLineHeight() })
    }
  }

  // 立即更新主题
  updateTheme()

  // 监听主题与字号变化
  const stopTheme = watch(
    [() => themeStore.isDark.value, () => themeStore.editorTheme.value, () => themeStore.palette.value],
    () => {
      updateTheme()
    }
  )
  const stopFont = watch(() => themeStore.editorFontSize.value, updateFont)
  return () => {
    stopTheme()
    stopFont()
  }
}

/**
 * 为 Monaco Editor 实例注册全局快捷键
 * @param editor Monaco Editor 实例
 */
export function registerGlobalShortcuts(editor: any) {
  const commandPaletteStore = useCommandPaletteStore()

  if (editor && typeof editor.addCommand === 'function') {
    // 注册 Cmd+K / Ctrl+K 打开命令面板
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      commandPaletteStore.toggle()
    })
  }
}

/**
 * 为 Diff Editor 注册全局快捷键
 * @param diffEditor Monaco Diff Editor 实例
 */
export function registerGlobalShortcutsForDiffEditor(diffEditor: any) {
  if (!diffEditor) return

  const originalEditor = diffEditor.getOriginalEditor()
  const modifiedEditor = diffEditor.getModifiedEditor()

  registerGlobalShortcuts(originalEditor)
  registerGlobalShortcuts(modifiedEditor)
}

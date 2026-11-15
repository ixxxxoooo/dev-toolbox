import { getBrowserLocale } from '@/locales'
import { ref, type Ref } from 'vue'
import { DEFAULT_PALETTE, isValidPalette } from '@/utils/palettes'

/** 编辑器字号默认值与可调范围（px） */
export const DEFAULT_EDITOR_FONT_SIZE = 12
export const MIN_EDITOR_FONT_SIZE = 10
export const MAX_EDITOR_FONT_SIZE = 18

interface ThemeStore {
  isDark: Ref<boolean>
  palette: Ref<string>
  setPalette: (id: string) => void
  followSystemMode: Ref<boolean>
  followSystemLang: Ref<boolean>
  editorTheme: Ref<string>
  historyLimit: Ref<number>
  editorFontSize: Ref<number>
  toggleTheme: () => void
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void
  setEditorTheme: (theme: string) => void
  setHistoryLimit: (limit: number) => void
  setEditorFontSize: (size: number) => void
  setLanguage: (lang: 'zh' | 'en' | 'system') => void
  initializeTheme: () => void
}

class ThemeStoreImpl implements ThemeStore {
  isDark = ref(false)
  // 当前 UI 色板（与明暗模式正交）
  palette = ref(DEFAULT_PALETTE)
  followSystemMode = ref(true)
  followSystemLang = ref(true)
  editorTheme = ref('auto')
  historyLimit = ref(50)
  // 代码编辑器字号（px），所有 Monaco 实例共用
  editorFontSize = ref(DEFAULT_EDITOR_FONT_SIZE)
  private initialized = false
  // 保存系统主题变化监听器引用，便于清理，避免反复 import/卸载时累积监听
  private mediaQueryListener: (() => void) | null = null

  constructor() {
    // 确保只初始化一次
    if (!this.initialized) {
      this.initializeTheme()
      this.initialized = true
    }
  }

  setPalette(id: string) {
    if (!isValidPalette(id)) return
    this.palette.value = id
    localStorage.setItem('ui-palette', id)
    this.applyPalette()
  }

  /** 把色板写到 <html data-palette>，实际颜色由 CSS 变量接管，无需重渲染组件 */
  private applyPalette() {
    document.documentElement.setAttribute('data-palette', this.palette.value)
  }

  setEditorTheme(theme: string) {
    this.editorTheme.value = theme
    localStorage.setItem('editor-theme', theme)
  }

  setEditorFontSize(size: number) {
    const v = Math.min(MAX_EDITOR_FONT_SIZE, Math.max(MIN_EDITOR_FONT_SIZE, Math.round(size)))
    this.editorFontSize.value = v
    localStorage.setItem('editor-font-size', String(v))
  }

  setHistoryLimit(limit: number) {
    this.historyLimit.value = limit
    localStorage.setItem('history-limit', limit.toString())
  }

  setThemeMode(mode: 'light' | 'dark' | 'system') {
    if (mode === 'system') {
      this.followSystemMode.value = true
      localStorage.setItem('theme-mode', 'system')
      this.applySystemTheme()
    } else {
      this.followSystemMode.value = false
      this.isDark.value = mode === 'dark'
      localStorage.setItem('theme-mode', mode)
      this.updateTheme()
    }
  }

  setLanguage(lang: 'zh' | 'en' | 'system') {
    if (lang === 'system') {
      this.followSystemLang.value = true
      // lang-mode 只记录"是否跟随系统"这个 UI 选中态；实际语言偏好由
      // locales 模块的 dev-toolbox-locale 键管理，避免两套持久化键竞争。
      localStorage.setItem('lang-mode', 'system')
      const systemLang = getBrowserLocale()
      // 通过事件通知 App.vue 调用 localeStore.setLocale 应用语言
      window.dispatchEvent(new CustomEvent('app-lang-change', { detail: systemLang }))
    } else {
      this.followSystemLang.value = false
      localStorage.setItem('lang-mode', lang)
      // 不再重复写 'language' 键：它和 dev-toolbox-locale 语义重叠，
      // 刷新后两套键会竞争导致语言状态不一致。
      window.dispatchEvent(new CustomEvent('app-lang-change', { detail: lang }))
    }
  }

  toggleTheme() {
    this.setThemeMode(this.isDark.value ? 'light' : 'dark')
  }

  initializeTheme() {
    const savedMode = localStorage.getItem('theme-mode') || 'system'
    // 旧版本用户只有 dev-toolbox-locale（通过语言切换器手动选择）而没有 lang-mode，
    // 此时视为"手动选择了该语言"，避免升级后被突然改回跟随系统
    const legacyLocale = localStorage.getItem('dev-toolbox-locale')
    const savedLangMode = localStorage.getItem('lang-mode') || legacyLocale || 'system'
    if (!localStorage.getItem('lang-mode')) {
      localStorage.setItem('lang-mode', savedLangMode)
    }
    const savedEditorTheme = localStorage.getItem('editor-theme') || 'auto'
    const savedHistoryLimit = localStorage.getItem('history-limit')
    const savedFontSize = parseInt(localStorage.getItem('editor-font-size') || '', 10)

    const savedPalette = localStorage.getItem('ui-palette')
    this.palette.value = isValidPalette(savedPalette) ? savedPalette : DEFAULT_PALETTE
    this.applyPalette()

    this.followSystemMode.value = savedMode === 'system'
    this.followSystemLang.value = savedLangMode === 'system'
    this.editorTheme.value = savedEditorTheme
    this.historyLimit.value = savedHistoryLimit ? parseInt(savedHistoryLimit) : 50
    this.editorFontSize.value = Number.isFinite(savedFontSize)
      ? Math.min(MAX_EDITOR_FONT_SIZE, Math.max(MIN_EDITOR_FONT_SIZE, savedFontSize))
      : DEFAULT_EDITOR_FONT_SIZE

    if (this.followSystemMode.value) {
      this.applySystemTheme()
    } else {
      this.isDark.value = savedMode === 'dark'
    }

    // 语言的初始值由 locales/index.ts 的 getInitialLocale 依据 lang-mode 决定，
    // 这里无需再派发事件（构造阶段 App 尚未挂载监听器，事件会丢失）

    // Listen for system theme changes（保存引用以便清理，避免泄漏）
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    // 兼容旧 Safari 的 addListener 已不再必要，现代浏览器统一用 addEventListener
    if (this.mediaQueryListener) {
      mediaQuery.removeEventListener('change', this.mediaQueryListener)
    }
    this.mediaQueryListener = () => {
      if (this.followSystemMode.value) {
        this.applySystemTheme()
      }
    }
    mediaQuery.addEventListener('change', this.mediaQueryListener)

    this.updateTheme()
  }

  /** 清理系统主题监听器（应用卸载时调用） */
  dispose() {
    if (this.mediaQueryListener) {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.mediaQueryListener)
      this.mediaQueryListener = null
    }
  }

  private applySystemTheme() {
    this.isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    this.updateTheme()
  }

  private updateTheme() {
    if (this.isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    localStorage.setItem('theme', this.isDark.value ? 'dark' : 'light')
  }
}

// 创建懒加载单例：首次调用 useThemeStore() 时才实例化并初始化，
// 避免在 import 阶段（早于 createApp/mount）就访问 window/document/localStorage，
// 提升 SSR/测试兼容性。
let themeStoreInstance: ThemeStoreImpl | null = null

export const useThemeStore = () => {
  if (!themeStoreInstance) {
    themeStoreInstance = new ThemeStoreImpl()
  }
  return themeStoreInstance
}
import { ref, type Ref } from 'vue'

interface ThemeStore {
  isDark: Ref<boolean>
  followSystemMode: Ref<boolean>
  followSystemLang: Ref<boolean>
  editorTheme: Ref<string>
  historyLimit: Ref<number>
  toggleTheme: () => void
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void
  setEditorTheme: (theme: string) => void
  setHistoryLimit: (limit: number) => void
  setLanguage: (lang: 'zh' | 'en' | 'system') => void
  initializeTheme: () => void
}

class ThemeStoreImpl implements ThemeStore {
  isDark = ref(false)
  followSystemMode = ref(true)
  followSystemLang = ref(true)
  editorTheme = ref('auto')
  historyLimit = ref(50)
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

  setEditorTheme(theme: string) {
    this.editorTheme.value = theme
    localStorage.setItem('editor-theme', theme)
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
      const systemLang = navigator.language.startsWith('zh') ? 'zh' : 'en'
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
    const savedLangMode = localStorage.getItem('lang-mode') || 'system'
    const savedEditorTheme = localStorage.getItem('editor-theme') || 'auto'
    const savedHistoryLimit = localStorage.getItem('history-limit')

    this.followSystemMode.value = savedMode === 'system'
    this.followSystemLang.value = savedLangMode === 'system'
    this.editorTheme.value = savedEditorTheme
    this.historyLimit.value = savedHistoryLimit ? parseInt(savedHistoryLimit) : 50

    if (this.followSystemMode.value) {
      this.applySystemTheme()
    } else {
      this.isDark.value = savedMode === 'dark'
    }

    // 跟随系统语言时，把 UI 的语言也同步成系统语言，避免"跟随系统"按钮选中态
    // 与实际显示语言不一致（之前读了 savedLangMode 却从不应用，是潜在不一致 bug）。
    // 注意：用户手动选过 zh/en 时，locales 模块已自行持久化，这里无需重复设置。
    if (this.followSystemLang.value) {
      const systemLang = navigator.language.startsWith('zh') ? 'zh' : 'en'
      window.dispatchEvent(new CustomEvent('app-lang-change', { detail: systemLang }))
    }

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
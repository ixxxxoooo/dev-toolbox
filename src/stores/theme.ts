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
      localStorage.setItem('lang-mode', 'system')
      const systemLang = navigator.language.startsWith('zh') ? 'zh' : 'en'
      // We'll need a way to trigger i18n update, usually via a global event or direct i18n access
      window.dispatchEvent(new CustomEvent('app-lang-change', { detail: systemLang }))
    } else {
      this.followSystemLang.value = false
      localStorage.setItem('lang-mode', lang)
      localStorage.setItem('language', lang)
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

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.followSystemMode.value) {
        this.applySystemTheme()
      }
    })

    this.updateTheme()
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

// 创建单例实例
const themeStoreInstance = new ThemeStoreImpl()

export const useThemeStore = () => themeStoreInstance
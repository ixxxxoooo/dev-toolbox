import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'

// 支持的语言
export const SUPPORTED_LOCALES = ['zh', 'en'] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

// 语言显示名称
export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  zh: '中文',
  en: 'English'
}

// 获取浏览器语言
function getBrowserLocale(): SupportedLocale {
  if (typeof navigator === 'undefined') {
    return 'en'
  }

  const browserLang = navigator.language.toLowerCase()

  // 检查是否有完全匹配的语言
  if (SUPPORTED_LOCALES.includes(browserLang as SupportedLocale)) {
    return browserLang as SupportedLocale
  }

  // 检查语言代码前缀（如 zh-CN -> zh）
  const langCode = browserLang.split('-')[0] as SupportedLocale
  if (SUPPORTED_LOCALES.includes(langCode)) {
    return langCode
  }

  // 默认返回英文
  return 'en'
}

// 从存储中获取保存的语言设置
function getSavedLocale(): SupportedLocale | null {
  try {
    const saved = localStorage.getItem('dev-toolbox-locale')
    if (saved && SUPPORTED_LOCALES.includes(saved as SupportedLocale)) {
      return saved as SupportedLocale
    }
  } catch (error) {
    console.warn('Failed to get saved locale:', error)
  }
  return null
}

// 保存语言设置到存储
export function saveLocale(locale: SupportedLocale): void {
  try {
    localStorage.setItem('dev-toolbox-locale', locale)
  } catch (error) {
    console.warn('Failed to save locale:', error)
  }
}

// 获取初始语言设置（优先级：保存的设置 > 浏览器语言 > 默认英文）
function getInitialLocale(): SupportedLocale {
  const savedLocale = getSavedLocale()
  if (savedLocale) {
    return savedLocale
  }

  return getBrowserLocale()
}

// 创建 i18n 实例
export const i18n = createI18n({
  legacy: false, // 使用 Composition API
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    zh,
    en
  },
  // 在生产环境中关闭警告
  silentTranslationWarn: process.env.NODE_ENV === 'production',
  silentFallbackWarn: process.env.NODE_ENV === 'production'
})

// 切换语言的辅助函数
export function setI18nLanguage(locale: SupportedLocale): void {
  i18n.global.locale.value = locale
  saveLocale(locale)

  // 设置 HTML lang 属性
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', locale)
  }
}

// 获取当前语言
export function getCurrentLocale(): SupportedLocale {
  return i18n.global.locale.value as SupportedLocale
}

// 检查是否为支持的语言
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale)
}

export default i18n

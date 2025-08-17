import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  type SupportedLocale,
  SUPPORTED_LOCALES,
  LOCALE_NAMES,
  setI18nLanguage,
  getCurrentLocale
} from '@/locales'

export const useLocaleStore = defineStore('locale', () => {
  // 当前语言
  const currentLocale = ref<SupportedLocale>(getCurrentLocale())

  // 切换语言
  const setLocale = (locale: SupportedLocale) => {
    if (SUPPORTED_LOCALES.includes(locale)) {
      currentLocale.value = locale
      setI18nLanguage(locale)
    }
  }

  // 获取语言显示名称
  const getLocaleName = (locale: SupportedLocale) => {
    return LOCALE_NAMES[locale]
  }

  // 获取所有支持的语言
  const getSupportedLocales = () => {
    return SUPPORTED_LOCALES.map(locale => ({
      code: locale,
      name: LOCALE_NAMES[locale]
    }))
  }

  // 切换到下一个语言
  const toggleLocale = () => {
    const currentIndex = SUPPORTED_LOCALES.indexOf(currentLocale.value)
    const nextIndex = (currentIndex + 1) % SUPPORTED_LOCALES.length
    setLocale(SUPPORTED_LOCALES[nextIndex])
  }

  return {
    currentLocale,
    setLocale,
    getLocaleName,
    getSupportedLocales,
    toggleLocale
  }
})

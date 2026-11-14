import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  type SupportedLocale,
  SUPPORTED_LOCALES,
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

  return {
    currentLocale,
    setLocale
  }
})

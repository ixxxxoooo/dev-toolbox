declare module 'vue-i18n' {
  import { App } from 'vue'
  
  export interface I18nOptions {
    legacy?: boolean
    locale?: string
    fallbackLocale?: string
    messages?: Record<string, any>
    silentTranslationWarn?: boolean
    silentFallbackWarn?: boolean
  }
  
  export interface I18n {
    global: {
      locale: { value: string }
      t: (key: string, ...args: any[]) => string
    }
    install: (app: App) => void
  }
  
  export interface UseI18nReturn {
    t: (key: string, ...args: any[]) => string
    locale: { value: string }
  }
  
  export function createI18n(options: I18nOptions): I18n
  export function useI18n(): UseI18nReturn
}
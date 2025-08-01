import { ref, type Ref } from 'vue'

interface ThemeStore {
  isDark: Ref<boolean>
  toggleTheme: () => void
  initializeTheme: () => void
}

class ThemeStoreImpl implements ThemeStore {
  isDark = ref(false)

  toggleTheme() {
    this.isDark.value = !this.isDark.value
    this.updateTheme()
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    this.isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
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

export const useThemeStore = () => new ThemeStoreImpl()
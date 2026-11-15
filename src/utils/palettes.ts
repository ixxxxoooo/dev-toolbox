/**
 * UI 色板定义。
 * 实际颜色变量写在 style.css 的 [data-palette='xxx'] 中，
 * 这里只维护「id / 名称 / 预览色」，供设置面板渲染色块。
 * 新增色板时：1) 在此登记；2) 在 style.css 追加一行变量；3) 补两份 locale 文案。
 */
export interface UiPalette {
  id: string
  /** 设置面板中展示的预览色（亮色、暗色下的主色） */
  swatch: [light: string, dark: string]
}

export const UI_PALETTES: UiPalette[] = [
  { id: 'indigo', swatch: ['#5558e8', '#8b8ff5'] },
  { id: 'emerald', swatch: ['#0e9f6e', '#34d399'] },
  { id: 'rose', swatch: ['#e11d48', '#fb7092'] },
  { id: 'amber', swatch: ['#d97706', '#fbbf24'] },
  { id: 'ocean', swatch: ['#0a8fc2', '#38bdf8'] },
  { id: 'graphite', swatch: ['#27272f', '#ececf0'] },
]

export const DEFAULT_PALETTE = 'indigo'

export const isValidPalette = (id: string | null | undefined): id is string =>
  !!id && UI_PALETTES.some(p => p.id === id)

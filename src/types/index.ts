export interface ToolModule {
  id: string
  name: string
  description: string
  icon: string
  category: string
  route: string
}

export interface RecentTool {
  id: string
  name: string
  route: string
  lastUsed: Date
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto'
  recentTools: RecentTool[]
  language: string
}
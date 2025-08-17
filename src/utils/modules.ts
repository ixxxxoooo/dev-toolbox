import type { ToolModule } from '../types'

export const modules: ToolModule[] = [
  {
    id: 'diff',
    name: 'tools.diff.name',
    description: 'tools.diff.description',
    icon: 'file-text',
    category: 'categories.text',
    route: '/diff'
  },
  {
    id: 'timestamp',
    name: 'tools.timestamp.name',
    description: 'tools.timestamp.description',
    icon: 'clock',
    category: 'categories.time',
    route: '/timestamp'
  },
  {
    id: 'url',
    name: 'tools.url.name',
    description: 'tools.url.description',
    icon: 'link',
    category: 'categories.encoding',
    route: '/url'
  },
  {
    id: 'base64',
    name: 'tools.base64.name',
    description: 'tools.base64.description',
    icon: 'binary',
    category: 'categories.encoding',
    route: '/base64'
  },
  {
    id: 'json',
    name: 'tools.json.name',
    description: 'tools.json.description',
    icon: 'braces',
    category: 'categories.data',
    route: '/json'
  },
  {
    id: 'uuid',
    name: 'tools.uuid.name',
    description: 'tools.uuid.description',
    icon: 'key',
    category: 'categories.development',
    route: '/uuid'
  },
  {
    id: 'text-analyzer',
    name: 'tools.textAnalyzer.name',
    description: 'tools.textAnalyzer.description',
    icon: 'text-cursor',
    category: 'categories.text',
    route: '/text-analyzer'
  },
  {
    id: 'hash-generator',
    name: 'tools.hash.name',
    description: 'tools.hash.description',
    icon: 'hash',
    category: 'categories.encoding',
    route: '/hash-generator'
  },
  {
    id: 'sql-formatter',
    name: 'tools.sql.name',
    description: 'tools.sql.description',
    icon: 'database',
    category: 'categories.data',
    route: '/sql-formatter'
  },
  {
    id: 'password-generator',
    name: 'tools.password.name',
    description: 'tools.password.description',
    icon: 'shield',
    category: 'categories.development',
    route: '/password-generator'
  }
]

export const getModuleByRoute = (route: string) => {
  return modules.find(module => module.route === route)
}

export const searchModules = (query: string, t?: any) => {
  const lowercaseQuery = query.toLowerCase()
  return modules.filter(module => {
    // 如果有翻译函数，使用翻译后的文本进行搜索
    if (t) {
      const translatedName = t(module.name).toLowerCase()
      const translatedDescription = t(module.description).toLowerCase()
      const translatedCategory = t(module.category).toLowerCase()
      return translatedName.includes(lowercaseQuery) ||
             translatedDescription.includes(lowercaseQuery) ||
             translatedCategory.includes(lowercaseQuery)
    }

    // 否则使用原始 key 进行搜索
    return module.name.toLowerCase().includes(lowercaseQuery) ||
           module.description.toLowerCase().includes(lowercaseQuery) ||
           module.category.toLowerCase().includes(lowercaseQuery)
  })
}
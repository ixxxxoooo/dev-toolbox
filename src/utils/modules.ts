import type { ToolModule } from '../types'

export const modules: ToolModule[] = [
  {
    id: 'diff',
    name: '文本对比',
    description: '比较两个文本的差异，支持字符级和行级高亮',
    icon: 'file-text',
    category: '文本处理',
    route: '/diff'
  },
  {
    id: 'timestamp',
    name: '时间戳转换',
    description: '毫秒/秒时间戳与日期格式的相互转换',
    icon: 'clock',
    category: '时间工具',
    route: '/timestamp'
  },
  {
    id: 'url',
    name: 'URL 编解码',
    description: 'URL 编码和解码，支持批量处理',
    icon: 'link',
    category: '编码工具',
    route: '/url'
  },
  {
    id: 'base64',
    name: 'Base64 编解码',
    description: '文本和文件的 Base64 编码与解码',
    icon: 'binary',
    category: '编码工具',
    route: '/base64'
  },
  {
    id: 'json',
    name: 'JSON 格式化',
    description: 'JSON 格式化和压缩，错误提示与定位',
    icon: 'braces',
    category: '数据格式',
    route: '/json'
  }
]

export const getModuleByRoute = (route: string) => {
  return modules.find(module => module.route === route)
}

export const searchModules = (query: string) => {
  const lowercaseQuery = query.toLowerCase()
  return modules.filter(module => 
    module.name.toLowerCase().includes(lowercaseQuery) ||
    module.description.toLowerCase().includes(lowercaseQuery) ||
    module.category.toLowerCase().includes(lowercaseQuery)
  )
}
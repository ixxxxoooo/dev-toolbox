/**
 * 文本格式自动识别与格式化（JSON / XML / SQL），供 Diff 等页面使用。
 */
import JSON5 from 'json5'
import { format as formatSQL } from 'sql-formatter'
import { xml2js, js2xml } from 'xml-js'

export type TextFormat = 'json' | 'xml' | 'sql'

// SQL 语句起始关键字：必须是完整单词，避免 "Updated the file"、"User guide" 之类普通文本被误判
const SQL_START = /^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|WITH|GRANT|REVOKE|SET|USE|SHOW|TRUNCATE|MERGE|REPLACE)\s/i

/** 自动检测文本格式类型，无法识别时返回 null。 */
export const detectFormat = (text: string): TextFormat | null => {
  const trimmed = text.trim()
  if (!trimmed) return null

  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON5.parse(trimmed)
      return 'json'
    } catch {
      // 形似 JSON 但解析失败，继续尝试其他格式
    }
  }

  if (trimmed.startsWith('<') && trimmed.includes('>')) {
    try {
      xml2js(trimmed)
      return 'xml'
    } catch {
      // 非合法 XML
    }
  }

  if (SQL_START.test(trimmed)) return 'sql'

  return null
}

/**
 * 按检测到的类型格式化文本；无法识别时抛错。
 * XML 使用非 compact 模式，保持同名兄弟节点的原有顺序（compact 模式会把同名节点合并，打乱顺序）。
 */
export const formatText = (text: string): string => {
  const type = detectFormat(text)
  if (!type) {
    throw new Error('无法识别内容格式，仅支持 JSON / XML / SQL 格式化')
  }
  if (type === 'json') {
    return JSON.stringify(JSON5.parse(text), null, 2)
  }
  if (type === 'xml') {
    const tree = xml2js(text, { compact: false })
    return js2xml(tree, { compact: false, spaces: 2 })
  }
  return formatSQL(text, { language: 'sql', tabWidth: 2, keywordCase: 'upper' })
}

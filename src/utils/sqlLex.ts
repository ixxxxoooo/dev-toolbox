/**
 * 轻量 SQL 词法扫描：识别字符串、标识符引号、注释，
 * 用于“按分号切分语句”和“压缩”时避免破坏字符串内容或被行注释吞掉后续语句。
 */

export type SqlDialect = 'mysql' | 'postgresql' | 'sqlite' | 'sqlserver' | 'oracle' | 'standard'

export type KeywordCaseMode = 'upper' | 'lower' | 'preserve'

export type SqlStructureIssueKind = 'paren' | 'bracket' | 'string'

export interface SqlStructureIssue {
  kind: SqlStructureIssueKind
  /** 出错位置（0-based 字符索引） */
  index: number
}

/** sql-formatter 方言名映射 */
export const formatterLanguageForDialect = (dialect: SqlDialect): string => {
  switch (dialect) {
    case 'mysql':
      return 'mysql'
    case 'postgresql':
      return 'postgresql'
    case 'sqlite':
      return 'sqlite'
    case 'sqlserver':
      return 'transactsql'
    case 'oracle':
      return 'plsql'
    case 'standard':
      return 'sql'
    default: {
      const _e: never = dialect
      return _e
    }
  }
}

export type SqlSegmentType = 'code' | 'string' | 'comment' | 'hint'

export interface SqlSegment {
  type: SqlSegmentType
  text: string
}

/**
 * 把 SQL 切成 code / string / comment / hint 片段（拼接后等于原文）。
 * - string：'...'（支持 '' 与反斜杠转义）、"..."、`...`、PostgreSQL $tag$...$tag$
 * - comment：-- 行注释、/* *\/ 块注释
 * - hint：/*+ ... *\/ 与 /*! ... *\/（优化器提示 / MySQL 条件注释，不能删除）
 */
export const tokenizeSql = (sql: string): SqlSegment[] => {
  const segs: SqlSegment[] = []
  let code = ''
  const flush = () => {
    if (code) {
      segs.push({ type: 'code', text: code })
      code = ''
    }
  }
  let i = 0
  const n = sql.length
  while (i < n) {
    const ch = sql[i]
    const next = sql[i + 1]

    if (ch === '-' && next === '-') {
      flush()
      let j = i
      while (j < n && sql[j] !== '\n') j++
      segs.push({ type: 'comment', text: sql.slice(i, j) })
      i = j
      continue
    }
    if (ch === '/' && next === '*') {
      flush()
      const end = sql.indexOf('*/', i + 2)
      const j = end === -1 ? n : end + 2
      const text = sql.slice(i, j)
      segs.push({ type: sql[i + 2] === '+' || sql[i + 2] === '!' ? 'hint' : 'comment', text })
      i = j
      continue
    }
  // SQL Server 方括号标识符 [schema.table]
    if (ch === '[') {
      flush()
      let j = i + 1
      while (j < n && sql[j] !== ']') j++
      const closed = j < n
      if (closed) j++
      segs.push({ type: 'string', text: sql.slice(i, Math.min(j, n)) })
      i = Math.min(j, n)
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      flush()
      let j = i + 1
      while (j < n) {
        if (sql[j] === '\\' && ch !== '`') {
          j += 2
          continue
        }
        if (sql[j] === ch) {
          if (sql[j + 1] === ch) {
            j += 2
            continue
          }
          j++
          break
        }
        j++
      }
      segs.push({ type: 'string', text: sql.slice(i, Math.min(j, n)) })
      i = Math.min(j, n)
      continue
    }
    if (ch === '$') {
      const m = /^\$[A-Za-z_]*\$/.exec(sql.slice(i))
      if (m) {
        const tag = m[0]
        const end = sql.indexOf(tag, i + tag.length)
        if (end !== -1) {
          flush()
          segs.push({ type: 'string', text: sql.slice(i, end + tag.length) })
          i = end + tag.length
          continue
        }
      }
    }
    code += ch
    i++
  }
  flush()
  return segs
}

/**
 * 按语句结束符 ; 切分（忽略字符串/注释里的分号）。返回的每条语句保留各自的末尾分号（如果有）。
 */
export const splitSqlStatements = (sql: string): string[] => {
  const result: string[] = []
  let current = ''
  for (const seg of tokenizeSql(sql)) {
    if (seg.type !== 'code') {
      current += seg.text
      continue
    }
    let rest = seg.text
    let idx: number
    while ((idx = rest.indexOf(';')) !== -1) {
      current += rest.slice(0, idx + 1)
      if (current.trim()) result.push(current.trim())
      current = ''
      rest = rest.slice(idx + 1)
    }
    current += rest
  }
  if (current.trim()) result.push(current.trim())
  return result
}

/**
 * 压缩 SQL 为单行：删除注释（保留 hint），只折叠 code 片段中的空白，字符串内容原样保留。
 * 这样 `-- 注释` 不会吞掉后面的语句，字符串里的多空格也不会被改动。
 */
export const minifySql = (sql: string): string => {
  let out = ''
  for (const seg of tokenizeSql(sql)) {
    if (seg.type === 'comment') {
      if (!out.endsWith(' ')) out += ' '
    } else if (seg.type === 'code') {
      let text = seg.text.replace(/\s+/g, ' ').replace(/\s*([(),;])\s*/g, '$1')
      // 避免与前一段末尾的空格叠加成连续空格（不能再做全局折叠，否则会破坏字符串字面量内部的空白）
      if (out.endsWith(' ')) text = text.replace(/^ /, '')
      out += text
    } else {
      out += seg.text
    }
  }
  return out.trim()
}

/** 公共 SQL 关键字（不含方言扩展） */
const BASE_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
  'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN', 'FULL OUTER JOIN', 'CROSS JOIN', 'JOIN',
  'ON', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL', 'AS', 'DESC', 'ASC', 'DISTINCT',
  'UNION ALL', 'UNION', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE TABLE',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'LIKE', 'BETWEEN', 'EXISTS', 'WITH',
]

const DIALECT_EXTRA: Record<SqlDialect, string[]> = {
  mysql: ['LIMIT', 'STRAIGHT_JOIN', 'IGNORE', 'REPLACE'],
  postgresql: ['RETURNING', 'ILIKE', 'SERIAL', 'LATERAL'],
  sqlite: ['AUTOINCREMENT', 'GLOB'],
  sqlserver: ['TOP', 'GO', 'OUTER APPLY', 'CROSS APPLY', 'NVARCHAR', 'IDENTITY'],
  oracle: ['ROWNUM', 'DUAL', 'NVL', 'CONNECT BY', 'START WITH', 'MINUS', 'SYSDATE'],
  standard: [],
}

const keywordPatternCache = new Map<SqlDialect, RegExp>()

const buildKeywordRegex = (dialect: SqlDialect): RegExp => {
  const cached = keywordPatternCache.get(dialect)
  if (cached) return cached
  const words = [...BASE_KEYWORDS, ...DIALECT_EXTRA[dialect]]
  const uniq = [...new Set(words)].sort((a, b) => b.length - a.length)
  const body = uniq.map(w => w.replace(/\s+/g, '\\s+')).join('|')
  const re = new RegExp(`\\b(${body})\\b`, 'gi')
  keywordPatternCache.set(dialect, re)
  return re
}

/** 仅转换 code 段中的关键字，跳过字符串、注释与引号标识符 */
export const applyKeywordCase = (sql: string, mode: KeywordCaseMode, dialect: SqlDialect): string => {
  if (mode === 'preserve') return sql
  const re = buildKeywordRegex(dialect)
  const mapCase = (w: string) => (mode === 'upper' ? w.toUpperCase() : w.toLowerCase())
  return tokenizeSql(sql)
    .map(seg => {
      if (seg.type !== 'code') return seg.text
      return seg.text.replace(re, m => mapCase(m))
    })
    .join('')
}

const stripTableQuotes = (raw: string, dialect: SqlDialect): string => {
  let s = raw.trim()
  if (dialect === 'mysql' && s.startsWith('`') && s.endsWith('`')) {
    return s.slice(1, -1)
  }
  if ((dialect === 'postgresql' || dialect === 'oracle' || dialect === 'standard') && s.startsWith('"') && s.endsWith('"')) {
    return s.slice(1, -1)
  }
  if (dialect === 'sqlserver' && s.startsWith('[') && s.endsWith(']')) {
    return s.slice(1, -1)
  }
  if (s.startsWith('`') && s.endsWith('`')) return s.slice(1, -1)
  if (s.startsWith('"') && s.endsWith('"')) return s.slice(1, -1)
  if (s.startsWith('[') && s.endsWith(']')) return s.slice(1, -1)
  return s
}

/** 从 FROM / JOIN / INTO / UPDATE 后提取表名（去重，保留源顺序） */
export const extractTableNames = (sql: string, dialect: SqlDialect = 'standard'): string[] => {
  const found: string[] = []
  const seen = new Set<string>()
  // 注释置空，保留引号标识符片段以便匹配
  const scanText = tokenizeSql(sql)
    .map(s => (s.type === 'comment' ? ' ' : s.text))
    .join('')
  const re =
    /\b(?:FROM|JOIN|INTO|UPDATE)\s+(?:ONLY\s+)?((?:`[^`]+`|"[^"]+"|\[[^\]]+\]|[\w$]+)(?:\.(?:`[^`]+`|"[^"]+"|\[[^\]]+\]|[\w$]+))*)/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(scanText))) {
    let name = m[1]
    if (/\./.test(name)) {
      const parts = name.split('.')
      name = parts[parts.length - 1]
    }
    name = stripTableQuotes(name, dialect)
    if (!name || name === 'LATERAL' || name === 'ONLY') continue
    const key = name.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      found.push(name)
    }
  }
  return found
}

/** 统计 JOIN 出现次数（仅 code 段） */
export const countJoins = (sql: string): number => {
  let n = 0
  const re = /\bJOIN\b/gi
  for (const seg of tokenizeSql(sql)) {
    if (seg.type !== 'code') continue
    const m = seg.text.match(re)
    if (m) n += m.length
  }
  return n
}

const isStringClosed = (text: string, quote: "'" | '"' | '`'): boolean => {
  if (text.length < 2 || text[0] !== quote) return false
  let i = 1
  while (i < text.length) {
    if (text[i] === '\\' && quote !== '`') {
      i += 2
      continue
    }
    if (text[i] === quote) {
      if (text[i + 1] === quote) {
        i += 2
        continue
      }
      return i === text.length - 1
    }
    i++
  }
  return false
}

/** 括号/方括号/引号配对检查；返回首个问题或 null */
export const checkSqlStructure = (sql: string): SqlStructureIssue | null => {
  let depth = 0
  let lastOpen = -1
  let pos = 0
  for (const seg of tokenizeSql(sql)) {
    const start = pos
    pos += seg.text.length
    if (seg.type === 'string') {
      const t = seg.text
      const q = t[0] as "'" | '"' | '`' | '['
      if (q === '[') {
        if (!t.endsWith(']')) return { kind: 'bracket', index: start }
      } else if (!isStringClosed(t, q)) {
        return { kind: 'string', index: start }
      }
      continue
    }
    if (seg.type !== 'code') continue
    for (let i = 0; i < seg.text.length; i++) {
      const ch = seg.text[i]
      if (ch === '(') {
        depth++
        lastOpen = start + i
      } else if (ch === ')') {
        depth--
        if (depth < 0) return { kind: 'paren', index: start + i }
      }
    }
  }
  if (depth > 0) return { kind: 'paren', index: lastOpen >= 0 ? lastOpen : 0 }
  return null
}

/** 字符索引转 1-based 行列（Monaco 用） */
export const indexToLineColumn = (text: string, index: number): { line: number; column: number } => {
  const slice = text.slice(0, Math.max(0, index))
  const lines = slice.split('\n')
  return { line: lines.length, column: (lines[lines.length - 1]?.length ?? 0) + 1 }
}

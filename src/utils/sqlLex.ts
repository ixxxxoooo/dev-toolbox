/**
 * 轻量 SQL 词法扫描：识别字符串、标识符引号、注释，
 * 用于“按分号切分语句”和“压缩”时避免破坏字符串内容或被行注释吞掉后续语句。
 */

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

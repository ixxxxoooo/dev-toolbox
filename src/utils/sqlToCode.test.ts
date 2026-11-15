import { describe, it, expect } from 'vitest'
import { sqlToCode } from './sqlToCode'

describe('sqlToCode', () => {
  const sample = "SELECT 'hi'"

  it('纯 SQL', () => {
    expect(sqlToCode('sql', sample)).toBe(sample)
  })

  it('JavaScript 模板字符串', () => {
    expect(sqlToCode('javascript', sample)).toContain('const sql = `')
    expect(sqlToCode('javascript', 'a`b')).toContain('\\`')
  })

  it('JSON 字符串', () => {
    expect(sqlToCode('json', sample)).toBe(JSON.stringify(sample))
  })

  it('单行转义', () => {
    expect(sqlToCode('escaped', "a\nb")).toBe('a\\nb')
  })

  it('Go 含反引号时退回双引号', () => {
    expect(sqlToCode('go', 'x`y')).toMatch(/^sql := "/)
  })
})
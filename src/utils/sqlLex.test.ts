import { describe, it, expect } from 'vitest'
import { tokenizeSql, splitSqlStatements, minifySql } from './sqlLex'

describe('tokenizeSql', () => {
  it('切分后拼接应与原文一致', () => {
    const sql = "SELECT 'a;b' /* c */ -- d\n FROM t WHERE x = \"y\" /*+ hint */"
    expect(tokenizeSql(sql).map(s => s.text).join('')).toBe(sql)
  })
})

describe('splitSqlStatements', () => {
  it('忽略字符串与注释中的分号', () => {
    const sql = "SELECT 'a;b'; -- x;y\nSELECT 2; /* ; */ SELECT 3"
    const parts = splitSqlStatements(sql)
    expect(parts.length).toBe(3)
    expect(parts[0]).toBe("SELECT 'a;b';")
  })
})

describe('minifySql', () => {
  it('单行注释不会吞掉后面的语句', () => {
    const out = minifySql('SELECT 1 -- note\nFROM t')
    expect(out).toBe('SELECT 1 FROM t')
  })

  it('字符串字面量内容原样保留', () => {
    expect(minifySql("SELECT   'a   b'  FROM t")).toBe("SELECT 'a   b' FROM t")
  })

  it('折叠空白并去掉括号/逗号周围空格', () => {
    expect(minifySql('SELECT a ,  b FROM t WHERE ( x = 1 )')).toBe('SELECT a,b FROM t WHERE(x = 1)')
  })
})

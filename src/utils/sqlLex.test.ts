import { describe, it, expect } from 'vitest'
import {
  tokenizeSql,
  splitSqlStatements,
  minifySql,
  applyKeywordCase,
  extractTableNames,
  checkSqlStructure,
  countJoins,
  formatterLanguageForDialect,
} from './sqlLex'

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

describe('tokenizeSql 方括号', () => {
  it('SQL Server 标识符', () => {
    const sql = 'SELECT * FROM [dbo].[Users]'
    const joined = tokenizeSql(sql).map(s => s.text).join('')
    expect(joined).toBe(sql)
  })
})

describe('applyKeywordCase', () => {
  it('不修改字符串中的 select', () => {
    const sql = "select x from t where note = 'select from'"
    expect(applyKeywordCase(sql, 'upper', 'standard')).toBe("SELECT x FROM t WHERE note = 'select from'")
  })

  it('不修改反引号标识符', () => {
    const sql = 'select `from` from t'
    expect(applyKeywordCase(sql, 'upper', 'mysql')).toBe('SELECT `from` FROM t')
  })

  it('preserve 保持原样', () => {
    const sql = 'SeLeCt 1'
    expect(applyKeywordCase(sql, 'preserve', 'mysql')).toBe(sql)
  })
})

describe('extractTableNames', () => {
  it('FROM/JOIN 去重', () => {
    const sql = 'SELECT * FROM users u JOIN posts p ON 1 JOIN users u2'
    expect(extractTableNames(sql, 'mysql')).toEqual(['users', 'posts'])
  })

  it('MySQL 反引号表名', () => {
    expect(extractTableNames('SELECT * FROM `user`', 'mysql')).toEqual(['user'])
  })

  it('SQL Server 方括号', () => {
    expect(extractTableNames('SELECT * FROM [dbo].[Order]', 'sqlserver')).toEqual(['Order'])
  })
})

describe('checkSqlStructure', () => {
  it('括号配对正常', () => {
    expect(checkSqlStructure('SELECT (1+2)')).toBeNull()
  })

  it('检测多余右括号', () => {
    const issue = checkSqlStructure('SELECT 1)')
    expect(issue?.kind).toBe('paren')
  })

  it('检测未闭合字符串', () => {
    const issue = checkSqlStructure("SELECT 'abc")
    expect(issue?.kind).toBe('string')
  })
})

describe('countJoins', () => {
  it('忽略字符串里的 join', () => {
    expect(countJoins("SELECT 'join' FROM a JOIN b")).toBe(1)
  })
})

describe('formatterLanguageForDialect', () => {
  it('SQL Server 映射 transactsql', () => {
    expect(formatterLanguageForDialect('sqlserver')).toBe('transactsql')
  })
})

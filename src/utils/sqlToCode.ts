/** 将 SQL 文本包装为各语言字符串字面量，供「复制为代码」使用 */

export type SqlCopyTarget =
  | 'sql'
  | 'javascript'
  | 'java'
  | 'go'
  | 'python'
  | 'php'
  | 'json'
  | 'escaped'

/** 按目标语言生成可粘贴的代码片段 */
export const sqlToCode = (target: SqlCopyTarget, sql: string): string => {
  switch (target) {
    case 'sql':
      return sql
    case 'javascript':
      return `const sql = \`\n${escapeForJsTemplate(sql)}\n\`;`
    case 'java':
      return `String sql = """\n${escapeForJavaTextBlock(sql)}\n""";`
    case 'go':
      return wrapGoRawString(sql)
    case 'python':
      return `sql = """\n${escapeForPythonTriple(sql)}\n"""`
    case 'php':
      return `$sql = <<<SQL\n${sql}\nSQL;`
    case 'json':
      return JSON.stringify(sql)
    case 'escaped':
      return JSON.stringify(sql).slice(1, -1)
    default: {
      const _exhaustive: never = target
      return _exhaustive
    }
  }
}

const escapeForJsTemplate = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')

const escapeForJavaTextBlock = (s: string) => s.replace(/"""/g, '\\"""')

const escapeForPythonTriple = (s: string) => s.replace(/"""/g, '\\"""')

/** Go 原始字符串不能含反引号，若有则退化为双引号字符串 */
const wrapGoRawString = (s: string): string => {
  if (!s.includes('`')) {
    return `sql := \`\n${s}\n\``
  }
  const escaped = s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')
  return `sql := "${escaped}"`
}
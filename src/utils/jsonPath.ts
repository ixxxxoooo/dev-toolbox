/**
 * 轻量 JSONPath 求值（无 eval）：$ .key ['k'] [n] .* [*] ..key [?(@.a>1)]
 */

export interface JsonPathEvalResult {
  matches: unknown[]
  error?: string
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v)

const childValues = (v: unknown): unknown[] => {
  if (Array.isArray(v)) return v
  if (isObject(v)) return Object.values(v)
  return []
}

const readIdent = (q: string, i: number): { name: string; next: number } | null => {
  const m = /^[A-Za-z_$][\w$]*/.exec(q.slice(i))
  if (!m) return null
  return { name: m[0], next: i + m[0].length }
}

const readQuoted = (q: string, i: number): { name: string; next: number } | null => {
  const quote = q[i]
  if (quote !== "'" && quote !== '"') return null
  let j = i + 1
  let name = ''
  while (j < q.length) {
    const ch = q[j]
    if (ch === quote) return { name, next: j + 1 }
    if (ch === '\\' && j + 1 < q.length) {
      name += q[j + 1]
      j += 2
      continue
    }
    name += ch
    j++
  }
  return null
}

const readNumber = (q: string, i: number): { num: number; next: number } | null => {
  const m = /^-?\d+/.exec(q.slice(i))
  if (!m) return null
  return { num: Number(m[0]), next: i + m[0].length }
}

/** 收集子树中所有名为 key 的字段值 */
const recursiveKey = (nodes: unknown[], key: string): unknown[] => {
  const out: unknown[] = []
  const walk = (v: unknown) => {
    if (isObject(v) && Object.prototype.hasOwnProperty.call(v, key)) out.push(v[key])
    for (const c of childValues(v)) walk(c)
  }
  for (const n of nodes) walk(n)
  return out
}

/** 子树中全部节点值（不含容器自身时用子值展开） */
const allDescendantValues = (nodes: unknown[]): unknown[] => {
  const out: unknown[] = []
  const walk = (v: unknown) => {
    if (v && typeof v === 'object') {
      for (const c of childValues(v)) {
        out.push(c)
        walk(c)
      }
    }
  }
  for (const n of nodes) walk(n)
  return out
}

// ---------- 过滤器表达式：@.field op literal，支持 && || ----------

type FilterToken =
  | { t: 'at' }
  | { t: 'dot' }
  | { t: 'ident'; v: string }
  | { t: 'op'; v: string }
  | { t: 'num'; v: number }
  | { t: 'str'; v: string }
  | { t: 'bool'; v: boolean }
  | { t: 'null' }
  | { t: 'and' }
  | { t: 'or' }
  | { t: 'lp' }
  | { t: 'rp' }

const tokenizeFilter = (expr: string): FilterToken[] | { error: string } => {
  const tokens: FilterToken[] = []
  let i = 0
  const ws = () => {
    while (i < expr.length && /\s/.test(expr[i])) i++
  }
  while (i < expr.length) {
    ws()
    if (i >= expr.length) break
    const rest = expr.slice(i)
    if (rest.startsWith('&&')) {
      tokens.push({ t: 'and' })
      i += 2
      continue
    }
    if (rest.startsWith('||')) {
      tokens.push({ t: 'or' })
      i += 2
      continue
    }
    if (rest.startsWith('==')) {
      tokens.push({ t: 'op', v: '==' })
      i += 2
      continue
    }
    if (rest.startsWith('!=')) {
      tokens.push({ t: 'op', v: '!=' })
      i += 2
      continue
    }
    if (rest.startsWith('>=')) {
      tokens.push({ t: 'op', v: '>=' })
      i += 2
      continue
    }
    if (rest.startsWith('<=')) {
      tokens.push({ t: 'op', v: '<=' })
      i += 2
      continue
    }
    const ch = expr[i]
    if (ch === '@') {
      tokens.push({ t: 'at' })
      i++
      continue
    }
    if (ch === '.') {
      tokens.push({ t: 'dot' })
      i++
      continue
    }
    if (ch === '(') {
      tokens.push({ t: 'lp' })
      i++
      continue
    }
    if (ch === ')') {
      tokens.push({ t: 'rp' })
      i++
      continue
    }
    if (ch === '>' || ch === '<') {
      tokens.push({ t: 'op', v: ch })
      i++
      continue
    }
    if (ch === '"' || ch === "'") {
      const q = readQuoted(expr, i)
      if (!q) return { error: 'filter string' }
      tokens.push({ t: 'str', v: q.name })
      i = q.next
      continue
    }
    if (ch === '-' || /\d/.test(ch)) {
      const n = readNumber(expr, i)
      if (!n) return { error: 'filter number' }
      tokens.push({ t: 'num', v: n.num })
      i = n.next
      continue
    }
    const id = readIdent(expr, i)
    if (id) {
      if (id.name === 'true') tokens.push({ t: 'bool', v: true })
      else if (id.name === 'false') tokens.push({ t: 'bool', v: false })
      else if (id.name === 'null') tokens.push({ t: 'null' })
      else tokens.push({ t: 'ident', v: id.name })
      i = id.next
      continue
    }
    return { error: `filter at ${i}` }
  }
  return tokens
}

type FilterAst =
  | { k: 'or'; left: FilterAst; right: FilterAst }
  | { k: 'and'; left: FilterAst; right: FilterAst }
  | { k: 'cmp'; path: string; op: string; right: unknown }

const parseFilter = (tokens: FilterToken[]): FilterAst | { error: string } => {
  let idx = 0
  const parseOr = (): FilterAst | { error: string } => {
    let left = parseAnd()
    if ('error' in left) return left
    while (idx < tokens.length && tokens[idx].t === 'or') {
      idx++
      const right = parseAnd()
      if ('error' in right) return right
      left = { k: 'or', left, right }
    }
    return left
  }
  const parseAnd = (): FilterAst | { error: string } => {
    let left = parseCmp()
    if ('error' in left) return left
    while (idx < tokens.length && tokens[idx].t === 'and') {
      idx++
      const right = parseCmp()
      if ('error' in right) return right
      left = { k: 'and', left, right }
    }
    return left
  }
  const parsePath = (): string | { error: string } => {
    if (idx >= tokens.length || tokens[idx].t !== 'at') return { error: 'filter @' }
    idx++
    let path = '$'
    while (idx < tokens.length && tokens[idx].t === 'dot') {
      idx++
      if (idx >= tokens.length || tokens[idx].t !== 'ident') return { error: 'filter path' }
      const ident = tokens[idx]
      if (ident.t !== 'ident') return { error: 'filter path' }
      path += '.' + ident.v
      idx++
    }
    return path
  }
  const readLiteral = (): unknown | { error: string } => {
    if (idx >= tokens.length) return { error: 'literal' }
    const t = tokens[idx]
    if (t.t === 'num') {
      idx++
      return t.v
    }
    if (t.t === 'str') {
      idx++
      return t.v
    }
    if (t.t === 'bool') {
      idx++
      return t.v
    }
    if (t.t === 'null') {
      idx++
      return null
    }
    if (t.t === 'ident') {
      idx++
      return t.v
    }
    return { error: 'literal' }
  }
  const parseCmp = (): FilterAst | { error: string } => {
    if (idx < tokens.length && tokens[idx].t === 'lp') {
      idx++
      const inner = parseOr()
      if ('error' in inner) return inner
      if (idx >= tokens.length || tokens[idx].t !== 'rp') return { error: 'filter )' }
      idx++
      return inner
    }
    const path = parsePath()
    if (typeof path !== 'string') return path
    if (idx >= tokens.length || tokens[idx].t !== 'op') return { error: 'filter op' }
    const opTok = tokens[idx]
    if (opTok.t !== 'op') return { error: 'filter op' }
    const op = opTok.v
    idx++
    const lit = readLiteral()
    if (typeof lit === 'object' && lit !== null && 'error' in (lit as Record<string, unknown>)) {
      return lit as { error: string }
    }
    return { k: 'cmp', path, op, right: lit }
  }
  const ast = parseOr()
  if ('error' in ast) return ast
  if (idx !== tokens.length) return { error: 'filter trailing' }
  return ast
}

const resolveAtPath = (root: unknown, path: string): unknown => {
  if (!path.startsWith('$.')) return undefined
  const parts = path.slice(2).split('.')
  let cur: unknown = root
  for (const p of parts) {
    if (!isObject(cur) || !(p in cur)) return undefined
    cur = cur[p]
  }
  return cur
}

const evalCmp = (left: unknown, op: string, right: unknown): boolean => {
  const ln = typeof left === 'number' ? left : Number(left)
  const rn = typeof right === 'number' ? right : Number(right)
  const bothNum = !Number.isNaN(ln) && !Number.isNaN(rn) && (typeof left === 'number' || typeof right === 'number')
  switch (op) {
    case '==':
      return left === right
    case '!=':
      return left !== right
    case '>':
      return bothNum ? ln > rn : String(left) > String(right)
    case '<':
      return bothNum ? ln < rn : String(left) < String(right)
    case '>=':
      return bothNum ? ln >= rn : String(left) >= String(right)
    case '<=':
      return bothNum ? ln <= rn : String(left) <= String(right)
    default:
      return false
  }
}

const evalFilterAst = (ast: FilterAst, item: unknown): boolean => {
  if (ast.k === 'or') return evalFilterAst(ast.left, item) || evalFilterAst(ast.right, item)
  if (ast.k === 'and') return evalFilterAst(ast.left, item) && evalFilterAst(ast.right, item)
  const left = resolveAtPath(item, ast.path)
  return evalCmp(left, ast.op, ast.right)
}

const compileFilter = (expr: string): ((item: unknown) => boolean) | { error: string } => {
  const tok = tokenizeFilter(expr)
  if ('error' in tok) return tok
  const ast = parseFilter(tok)
  if ('error' in ast) return ast
  return (item: unknown) => evalFilterAst(ast, item)
}

/** 对根数据执行 JSONPath 查询 */
export function evaluateJsonPath(root: unknown, query: string): JsonPathEvalResult {
  const q = query.trim()
  if (!q) return { matches: [root] }
  if (!q.startsWith('$')) return { matches: [], error: 'must start with $' }

  let i = 1
  let cur: unknown[] = [root]

  const descendAllChildren = (): void => {
    const next: unknown[] = []
    for (const c of cur) next.push(...childValues(c))
    cur = next
  }

  while (i < q.length) {
    if (q[i] === '.') {
      i++
      if (q[i] === '.') {
        i++
        if (q[i] === '*') {
          i++
          cur = allDescendantValues(cur)
          continue
        }
        const id = readIdent(q, i)
        if (!id) return { matches: [], error: 'path after ..' }
        i = id.next
        cur = recursiveKey(cur, id.name)
        continue
      }
      if (q[i] === '*') {
        i++
        descendAllChildren()
        continue
      }
      const id = readIdent(q, i)
      if (!id) return { matches: [], error: 'path after .' }
      i = id.next
      const next: unknown[] = []
      for (const c of cur) {
        if (isObject(c) && Object.prototype.hasOwnProperty.call(c, id.name)) next.push(c[id.name])
      }
      cur = next
      continue
    }

    if (q[i] === '[') {
      i++
      if (q[i] === '?') {
        if (q[i + 1] !== '(') return { matches: [], error: 'filter (' }
        i += 2
        const start = i
        let depth = 1
        while (i < q.length && depth > 0) {
          if (q[i] === '(') depth++
          else if (q[i] === ')') depth--
          i++
        }
        if (depth !== 0) return { matches: [], error: 'filter )' }
        const filterBody = q.slice(start, i - 1)
        const compiled = compileFilter(filterBody)
        if ('error' in compiled) return { matches: [], error: compiled.error }
        const expanded: unknown[] = []
        for (const c of cur) {
          if (Array.isArray(c)) expanded.push(...c)
          else expanded.push(c)
        }
        cur = expanded.filter(compiled)
        if (q[i] === ']') i++
        continue
      }
      if (q[i] === '*' && q[i + 1] === ']') {
        i += 2
        descendAllChildren()
        continue
      }
      const quoted = readQuoted(q, i)
      if (quoted) {
        const next: unknown[] = []
        for (const c of cur) {
          if (isObject(c) && Object.prototype.hasOwnProperty.call(c, quoted.name)) next.push(c[quoted.name])
        }
        cur = next
        i = quoted.next
        if (q[i] === ']') i++
        continue
      }
      const num = readNumber(q, i)
      if (num) {
        const idx = num.num
        const next: unknown[] = []
        for (const c of cur) {
          if (Array.isArray(c) && idx >= 0 && idx < c.length) next.push(c[idx])
        }
        cur = next
        i = num.next
        if (q[i] === ']') i++
        continue
      }
      return { matches: [], error: 'bracket' }
    }

    if (/\s/.test(q[i])) {
      i++
      continue
    }
    return { matches: [], error: 'unexpected' }
  }

  return { matches: cur }
}

/** 根据查询结果取树/表/文本展示用的单个根值 */
export function jsonPathDisplayRoot(matches: unknown[]): unknown {
  if (matches.length === 0) return undefined
  if (matches.length === 1) return matches[0]
  return matches
}
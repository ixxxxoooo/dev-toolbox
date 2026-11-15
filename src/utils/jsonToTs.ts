/**
 * 将 JSON 值生成为 TypeScript interface 声明（嵌套对象拆分为独立 interface）
 */

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype

type Field = { types: Set<string>; optional: boolean }

export function jsonToTs(json: unknown, rootName = 'Root'): string {
  const ifaces = new Map<string, Record<string, Field>>()
  let id = 0

  const newName = (hint: string): string => {
    id++
    const base = hint.replace(/[^A-Za-z0-9_]/g, '') || 'Nested'
    return base.charAt(0).toUpperCase() + base.slice(1) + (id > 1 ? String(id) : '')
  }

  const iface = (name: string): Record<string, Field> => {
    if (!ifaces.has(name)) ifaces.set(name, {})
    return ifaces.get(name)!
  }

  const typeOf = (val: unknown, hint: string): string => {
    if (val === null) return 'null'
    const t = typeof val
    if (t === 'string' || t === 'number' || t === 'boolean') return t
    if (Array.isArray(val)) {
      if (val.length === 0) return 'unknown[]'
      const plain = val.filter(isPlainObject) as Record<string, unknown>[]
      if (plain.length === val.length) {
        const name = newName(`${hint}Item`)
        fillFromObjectArray(name, plain)
        return `${name}[]`
      }
      const types = [...new Set(val.map(v => typeOf(v, hint)))]
      return types.length === 1 ? `${types[0]}[]` : `(${types.join(' | ')})[]`
    }
    if (isPlainObject(val)) {
      const name = newName(hint)
      fillFromObject(name, val)
      return name
    }
    return 'unknown'
  }

  const fillFromObject = (name: string, obj: Record<string, unknown>) => {
    const fields = iface(name)
    for (const [k, v] of Object.entries(obj)) {
      if (!fields[k]) fields[k] = { types: new Set(), optional: false }
      fields[k].types.add(typeOf(v, k))
    }
  }

  const fillFromObjectArray = (name: string, arr: Record<string, unknown>[]) => {
    const fields = iface(name)
    for (const obj of arr) {
      for (const [k, v] of Object.entries(obj)) {
        if (!fields[k]) fields[k] = { types: new Set(), optional: false }
        fields[k].types.add(typeOf(v, k))
      }
    }
    for (const k of Object.keys(fields)) {
      if (!arr.every(o => Object.prototype.hasOwnProperty.call(o, k))) fields[k].optional = true
    }
  }

  if (isPlainObject(json)) fillFromObject(rootName, json)
  else if (Array.isArray(json) && json.length > 0 && json.every(isPlainObject)) fillFromObjectArray(rootName, json as Record<string, unknown>[])
  else {
    const rootType = typeOf(json, rootName)
    return `export type ${rootName} = ${rootType};\n`
  }

  const lines: string[] = []
  for (const [name, fields] of [...ifaces.entries()].sort((a, b) => (a[0] === rootName ? -1 : b[0] === rootName ? 1 : a[0].localeCompare(b[0])))) {
    lines.push(`export interface ${name} {`)
    for (const [k, f] of Object.entries(fields).sort(([a], [b]) => a.localeCompare(b))) {
      const ty = f.types.size === 1 ? [...f.types][0] : [...f.types].join(' | ')
      lines.push(`  ${k}${f.optional ? '?' : ''}: ${ty};`)
    }
    lines.push('}', '')
  }
  return lines.join('\n').trim() + '\n'
}
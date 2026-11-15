/**
 * 文本对比预处理：行尾裁剪、大小写、JSON 键递归排序等纯函数。
 */

export interface DiffLineNormalizeOptions {
  ignoreCase: boolean
  trimTrailing: boolean
}

/** 与 Monaco 无关的行级变换（不含 JSON 键排序） */
export function normalizeTextLines(text: string, options: DiffLineNormalizeOptions): string {
  if (!options.ignoreCase && !options.trimTrailing) return text
  const lines = text.split('\n')
  return lines
    .map((line) => {
      let out = line
      if (options.trimTrailing) out = out.replace(/\s+$/, '')
      if (options.ignoreCase) out = out.toLowerCase()
      return out
    })
    .join('\n')
}

/** 是否为可 JSON.parse 的严格 JSON 文本 */
export function isStrictJson(text: string): boolean {
  const t = text.trim()
  if (!t) return false
  try {
    JSON.parse(t)
    return true
  } catch {
    return false
  }
}

export function bothStrictJson(left: string, right: string): boolean {
  return isStrictJson(left) && isStrictJson(right)
}

/** 递归按字典序排序对象键 */
export function sortJsonKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJsonKeysDeep)
  }
  if (value !== null && typeof value === 'object') {
    const src = value as Record<string, unknown>
    const sorted: Record<string, unknown> = {}
    for (const key of Object.keys(src).sort()) {
      sorted[key] = sortJsonKeysDeep(src[key])
    }
    return sorted
  }
  return value
}

/** 解析严格 JSON 并格式化输出（键已排序，2 空格缩进） */
export function formatJsonWithSortedKeys(text: string): string {
  const parsed: unknown = JSON.parse(text.trim())
  return JSON.stringify(sortJsonKeysDeep(parsed), null, 2)
}

export interface LineChangeSummary {
  hunks: number
  added: number
  removed: number
}

/** Monaco ILineChange 简化形状 */
export interface LineChangeLike {
  originalStartLineNumber: number
  originalEndLineNumber: number
  modifiedStartLineNumber: number
  modifiedEndLineNumber: number
}

/**
 * 根据 Monaco 行变更块统计新增/删除行数。
 * originalStartLineNumber / modifiedStartLineNumber 为 0 表示纯插入/纯删除块。
 */
export function summarizeLineChanges(changes: LineChangeLike[]): LineChangeSummary {
  let added = 0
  let removed = 0
  for (const c of changes) {
    const o0 = c.originalStartLineNumber === 0
    const m0 = c.modifiedStartLineNumber === 0
    if (o0 && !m0) {
      added += c.modifiedEndLineNumber - c.modifiedStartLineNumber + 1
    } else if (m0 && !o0) {
      removed += c.originalEndLineNumber - c.originalStartLineNumber + 1
    } else if (!o0 && !m0) {
      removed += c.originalEndLineNumber - c.originalStartLineNumber + 1
      added += c.modifiedEndLineNumber - c.modifiedStartLineNumber + 1
    }
  }
  return { hunks: changes.length, added, removed }
}

/** 按行数与变更块估算相似度百分比 */
export function computeSimilarityPercent(
  leftLineCount: number,
  rightLineCount: number,
  changes: LineChangeLike[],
): number {
  const maxLines = Math.max(leftLineCount, rightLineCount, 1)
  const { added, removed } = summarizeLineChanges(changes)
  const changed = Math.max(added, removed)
  const unchanged = Math.max(0, maxLines - changed)
  return Math.round((unchanged / maxLines) * 100)
}
/** 在 JSON 树中找到第一个「对象数组」（元素均为非数组对象） */
export function findFirstObjectArray(value: unknown): Record<string, unknown>[] | null {
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(x => x !== null && typeof x === 'object' && !Array.isArray(x))
  ) {
    return value as Record<string, unknown>[]
  }
  if (value !== null && typeof value === 'object') {
    for (const child of Object.values(value as Record<string, unknown>)) {
      const found = findFirstObjectArray(child)
      if (found) return found
    }
  }
  return null
}
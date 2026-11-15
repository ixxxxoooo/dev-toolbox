/** 递归按字典序排序对象键（数组元素递归处理，不改顺序） */
export function sortJsonKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJsonKeys)
  if (value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const obj = value as Record<string, unknown>
    return Object.fromEntries(
      Object.keys(obj)
        .sort((a, b) => a.localeCompare(b))
        .map(k => [k, sortJsonKeys(obj[k])]),
    )
  }
  return value
}
/** 计算 JSON 值的嵌套深度（标量 0，空对象/数组 1） */
export function jsonDepth(value: unknown): number {
  if (value === null || typeof value !== 'object') return 0
  if (Array.isArray(value)) {
    if (value.length === 0) return 1
    return 1 + Math.max(0, ...value.map(jsonDepth))
  }
  const vals = Object.values(value as Record<string, unknown>)
  if (vals.length === 0) return 1
  return 1 + Math.max(0, ...vals.map(jsonDepth))
}
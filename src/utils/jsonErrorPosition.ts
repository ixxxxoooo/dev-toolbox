/** 从 JSON 解析错误信息中提取行列（兼容 V8 position 与 JSON5 行列格式） */
export interface JsonErrorPosition {
  line: number
  column: number
  offset: number
}

export function getJsonErrorPosition(src: string, message: string): JsonErrorPosition {
  let m = /position (\d+)/i.exec(message)
  if (m) {
    const offset = Number(m[1])
    const before = src.slice(0, offset)
    const lines = before.split('\n')
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
      offset,
    }
  }
  m = /line (\d+) column (\d+)/i.exec(message)
  if (m) return { line: Number(m[1]), column: Number(m[2]), offset: 0 }
  // JSON5 格式：... at 行:列
  m = /at (\d+):(\d+)\s*$/i.exec(message)
  if (m) return { line: Number(m[1]), column: Number(m[2]), offset: 0 }
  return { line: 1, column: 1, offset: 0 }
}

/** 去掉错误文案中冗余的 position 后缀，便于状态栏展示 */
export function simplifyJsonErrorMessage(message: string): string {
  return message
    .replace(/^JSON5:\s*/i, '')
    .replace(/\s+in JSON at position \d+.*$/i, '')
    .replace(/\s+at position \d+.*$/i, '')
    .replace(/\s+at \d+:\d+\s*$/i, '')
}
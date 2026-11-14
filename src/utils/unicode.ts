/**
 * Unicode 转义相关的纯函数工具（Json / Diff / SQL / Unicode 转换器共用）
 */

const toHex4 = (n: number) => n.toString(16).toUpperCase().padStart(4, '0')

/**
 * 把文本里的字面量 \uXXXX 解码成对应字符（如 \u4e2d -> 中）。
 * 代理对（如 \uD83D\uDE00）会被逐个单元替换，拼接后自然还原为完整字符。
 */
export const decodeUnicodeEscapes = (text: string): string =>
  text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))

/**
 * 把文本转换成 \uXXXX 形式。
 * 按 UTF-16 代码单元遍历，保证 emoji 等非 BMP 字符输出完整代理对（\uD83D\uDE00）。
 * @param onlyNonAscii 为 true 时保留 ASCII 字符原样不转换
 */
export const encodeUnicodeEscapes = (text: string, onlyNonAscii = false): string => {
  let out = ''
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    out += onlyNonAscii && code < 0x80 ? text[i] : '\\u' + toHex4(code)
  }
  return out
}

/**
 * 递归解码对象中所有字符串值里的 \uXXXX。
 * 使用 Object.defineProperty 写入，避免 "__proto__" 这类键被当作原型赋值而丢失。
 */
export const decodeUnicodeDeep = (value: unknown): unknown => {
  if (typeof value === 'string') return decodeUnicodeEscapes(value)
  if (Array.isArray(value)) return value.map(decodeUnicodeDeep)
  // 仅处理普通对象；LosslessNumber 等类实例原样返回，避免被拆成普通对象
  if (value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const out: Record<string, unknown> = {}
    for (const k of Object.keys(value as Record<string, unknown>)) {
      Object.defineProperty(out, k, {
        value: decodeUnicodeDeep((value as Record<string, unknown>)[k]),
        enumerable: true,
        writable: true,
        configurable: true
      })
    }
    return out
  }
  return value
}

/**
 * 单次扫描的反转义：避免“先替换 \n 再替换 \\”造成 \\n 被错误还原成换行。
 */
export const unescapeCommon = (text: string): string => {
  const map: Record<string, string> = { n: '\n', r: '\r', t: '\t', '"': '"', "'": "'", '\\': '\\' }
  return text.replace(/\\(n|r|t|"|'|\\)/g, (_, c: string) => map[c])
}

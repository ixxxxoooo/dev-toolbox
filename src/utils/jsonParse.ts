/**
 * JSON 解析 / 序列化工具：严格 JSON 走 lossless-json（保留超出 2^53 的大整数精度），
 * 解析失败再回退到 JSON5（支持注释、尾逗号、单引号等宽松语法，但大整数会丢精度）。
 */
import JSON5 from 'json5'
import { parse as losslessParse, stringify as losslessStringify, isLosslessNumber } from 'lossless-json'

export interface ParsedJson {
  data: unknown
  /** 是否由 lossless-json 解析（此时大整数不会丢精度） */
  lossless: boolean
  /** 走 JSON5 回退且文本里含超出安全整数范围的整数字面量（格式化后会丢精度） */
  unsafeNumbers: boolean
}

/** 去掉字符串字面量后，检查是否存在超过 Number.MAX_SAFE_INTEGER 的整数字面量。 */
export const hasUnsafeIntegerLiteral = (text: string): boolean => {
  const withoutStrings = text.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '""')
  const matches = withoutStrings.match(/(?<![\w.])-?\d{16,}(?![\w.])/g)
  return !!matches && matches.some(m => !Number.isSafeInteger(Number(m)))
}

export const parseJsonLossless = (text: string): ParsedJson => {
  try {
    return { data: losslessParse(text), lossless: true, unsafeNumbers: false }
  } catch {
    const data = JSON5.parse(text)
    return { data, lossless: false, unsafeNumbers: hasUnsafeIntegerLiteral(text) }
  }
}

export const stringifyJson = (data: unknown, indent?: number, lossless = true): string => {
  if (lossless) {
    const out = losslessStringify(data, undefined, indent)
    if (out !== undefined) return out
  }
  return JSON.stringify(data, null, indent)
}


/**
 * 把 lossless-json 解析出的 LosslessNumber 展开成普通值，供树 / 表格 / 关系图 / 统计使用：
 * 安全范围内的数字转 number；超出安全范围的整数转 bigint（String() 后仍是完整精度），小数转 number。
 */
export const toPlainJson = (value: unknown): unknown => {
  if (isLosslessNumber(value)) {
    const raw = value.toString()
    const n = Number(raw)
    if (Number.isSafeInteger(n) || !/^-?\d+$/.test(raw)) return n
    return BigInt(raw)
  }
  if (Array.isArray(value)) return value.map(toPlainJson)
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const k of Object.keys(value as Record<string, unknown>)) {
      Object.defineProperty(out, k, {
        value: toPlainJson((value as Record<string, unknown>)[k]),
        enumerable: true,
        writable: true,
        configurable: true,
      })
    }
    return out
  }
  return value
}

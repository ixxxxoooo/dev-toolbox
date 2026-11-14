/**
 * JSON 解析 / 序列化工具：严格 JSON 走 lossless-json（保留超出 2^53 的大整数精度），
 * 解析失败再回退到 JSON5（支持注释、尾逗号、单引号等宽松语法，但大整数会丢精度）。
 */
import JSON5 from 'json5'
import { parse as losslessParse, stringify as losslessStringify } from 'lossless-json'

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

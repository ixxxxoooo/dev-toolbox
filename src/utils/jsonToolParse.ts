import JSON5 from 'json5'
import { hasUnsafeIntegerLiteral, parseJsonLossless, type ParsedJson } from './jsonParse'

/** 按宽松/严格模式解析输入（宽松强制走 JSON5） */
export function parseJsonInput(text: string, lenient: boolean): ParsedJson {
  if (lenient) {
    const data = JSON5.parse(text)
    return { data, lossless: false, unsafeNumbers: hasUnsafeIntegerLiteral(text) }
  }
  return parseJsonLossless(text)
}
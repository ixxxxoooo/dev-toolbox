import { describe, it, expect } from 'vitest'
import { parseJsonLossless, stringifyJson, hasUnsafeIntegerLiteral, toPlainJson } from './jsonParse'

describe('parseJsonLossless / stringifyJson', () => {
  it('严格 JSON 中的大整数往返不丢精度', () => {
    const text = '{"id":9007199254740993,"n":1}'
    const parsed = parseJsonLossless(text)
    expect(parsed.lossless).toBe(true)
    expect(stringifyJson(parsed.data)).toBe(text)
    expect(stringifyJson(parsed.data, 2)).toContain('9007199254740993')
  })

  it('宽松语法（注释、尾逗号、单引号）回退到 JSON5', () => {
    const parsed = parseJsonLossless("{ a: 'x', // c\n b: [1,2,], }")
    expect(parsed.lossless).toBe(false)
    expect(parsed.data).toEqual({ a: 'x', b: [1, 2] })
  })

  it('JSON5 回退时能识别会丢精度的整数字面量', () => {
    expect(parseJsonLossless("{a: 12345678901234567890, // x\n}").unsafeNumbers).toBe(true)
    expect(parseJsonLossless("{a: 1, // x\n}").unsafeNumbers).toBe(false)
  })

  it('完全非法的输入抛错', () => {
    expect(() => parseJsonLossless('{')).toThrow()
  })
})

describe('hasUnsafeIntegerLiteral', () => {
  it('忽略字符串里的长数字', () => {
    expect(hasUnsafeIntegerLiteral('{"phone":"12345678901234567890"}')).toBe(false)
  })
  it('识别超出安全范围的整数', () => {
    expect(hasUnsafeIntegerLiteral('[12345678901234567890]')).toBe(true)
  })
  it('不把小数/科学计数法的一部分当整数', () => {
    expect(hasUnsafeIntegerLiteral('[0.12345678901234567890]')).toBe(false)
  })
})

describe('toPlainJson', () => {
  it('把 LosslessNumber 展开为普通值并保留大整数精度', () => {
    const { data } = parseJsonLossless('{"a":1,"b":1.5,"c":12345678901234567890,"d":[2]}')
    const plain = toPlainJson(data) as Record<string, unknown>
    expect(plain.a).toBe(1)
    expect(plain.b).toBe(1.5)
    expect(String(plain.c)).toBe('12345678901234567890')
    expect(plain.d).toEqual([2])
  })
})

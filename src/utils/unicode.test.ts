import { describe, it, expect } from 'vitest'
import { decodeUnicodeEscapes, encodeUnicodeEscapes, decodeUnicodeDeep, unescapeCommon } from './unicode'

describe('encodeUnicodeEscapes', () => {
  it('BMP 字符', () => {
    expect(encodeUnicodeEscapes('中')).toBe('\\u4E2D')
  })

  it('emoji 输出完整代理对（旧实现只输出高位代理）', () => {
    expect(encodeUnicodeEscapes('😀')).toBe('\\uD83D\\uDE00')
  })

  it('onlyNonAscii 保留 ASCII', () => {
    expect(encodeUnicodeEscapes('a中b', true)).toBe('a\\u4E2Db')
  })

  it('编码后再解码可还原（含 emoji）', () => {
    const text = 'Hello 世界 😀!'
    expect(decodeUnicodeEscapes(encodeUnicodeEscapes(text))).toBe(text)
  })
})

describe('decodeUnicodeEscapes', () => {
  it('解码代理对', () => {
    expect(decodeUnicodeEscapes('\\uD83D\\uDE00')).toBe('😀')
  })
  it('大小写十六进制都支持', () => {
    expect(decodeUnicodeEscapes('\\u4e2d\\u4E2D')).toBe('中中')
  })
})

describe('decodeUnicodeDeep', () => {
  it('递归解码对象/数组中的字符串', () => {
    expect(decodeUnicodeDeep({ a: ['\\u4e2d'], b: { c: '\\u6587' } })).toEqual({ a: ['中'], b: { c: '文' } })
  })

  it('不会丢失 __proto__ 键', () => {
    const obj = JSON.parse('{"__proto__": "\\\\u4e2d"}')
    const out = decodeUnicodeDeep(obj) as Record<string, unknown>
    expect(Object.keys(out)).toEqual(['__proto__'])
    expect(Object.getOwnPropertyDescriptor(out, '__proto__')?.value).toBe('中')
  })

  it('类实例原样返回', () => {
    class Foo { x = '\\u4e2d' }
    const foo = new Foo()
    expect(decodeUnicodeDeep(foo)).toBe(foo)
  })
})

describe('unescapeCommon', () => {
  it('常见转义', () => {
    expect(unescapeCommon('a\\nb\\tc\\"d')).toBe('a\nb\tc"d')
  })
  it('\\\\n 应还原为反斜杠加 n，而不是换行（旧实现顺序 bug）', () => {
    expect(unescapeCommon('\\\\n')).toBe('\\n')
  })
})

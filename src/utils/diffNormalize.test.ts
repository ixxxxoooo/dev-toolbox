import { describe, it, expect } from 'vitest'
import {
  normalizeTextLines,
  isStrictJson,
  bothStrictJson,
  sortJsonKeysDeep,
  formatJsonWithSortedKeys,
  summarizeLineChanges,
  computeSimilarityPercent,
} from './diffNormalize'

describe('normalizeTextLines', () => {
  it('裁剪行尾空格与统一大小写', () => {
    const src = 'Hello  \nWORLD\t  '
    const out = normalizeTextLines(src, { ignoreCase: true, trimTrailing: true })
    expect(out).toBe('hello\nworld')
  })

  it('无选项时原样返回', () => {
    const src = 'Aa \n'
    expect(normalizeTextLines(src, { ignoreCase: false, trimTrailing: false })).toBe(src)
  })
})

describe('JSON 键排序', () => {
  it('识别严格 JSON', () => {
    expect(isStrictJson('{"a":1}')).toBe(true)
    expect(isStrictJson('{a:1}')).toBe(false)
    expect(bothStrictJson('{}', '[]')).toBe(true)
  })

  it('递归排序对象键', () => {
    const sorted = sortJsonKeysDeep({ z: 1, a: { y: 2, b: 3 } })
    expect(JSON.stringify(sorted)).toBe('{"a":{"b":3,"y":2},"z":1}')
  })

  it('formatJsonWithSortedKeys 输出稳定格式', () => {
    const out = formatJsonWithSortedKeys('{"b":2,"a":{"d":1,"c":0}}')
    expect(out).toBe('{\n  "a": {\n    "c": 0,\n    "d": 1\n  },\n  "b": 2\n}')
  })
})

describe('summarizeLineChanges / computeSimilarityPercent', () => {
  it('统计增删行', () => {
    const summary = summarizeLineChanges([
      { originalStartLineNumber: 0, originalEndLineNumber: 0, modifiedStartLineNumber: 2, modifiedEndLineNumber: 3 },
      { originalStartLineNumber: 5, originalEndLineNumber: 6, modifiedStartLineNumber: 0, modifiedEndLineNumber: 0 },
    ])
    expect(summary).toEqual({ hunks: 2, added: 2, removed: 2 })
  })

  it('估算相似度', () => {
    const sim = computeSimilarityPercent(10, 10, [
      { originalStartLineNumber: 3, originalEndLineNumber: 4, modifiedStartLineNumber: 3, modifiedEndLineNumber: 4 },
    ])
    expect(sim).toBe(80)
  })
})
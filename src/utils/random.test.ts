import { describe, it, expect } from 'vitest'
import { secureRandomInt } from './random'

describe('secureRandomInt', () => {
  it('max <= 0 或非法时返回 0', () => {
    expect(secureRandomInt(0)).toBe(0)
    expect(secureRandomInt(-5)).toBe(0)
    expect(secureRandomInt(NaN)).toBe(0)
  })

  it('max 大于 256 时不会死循环（旧实现的 bug）且结果落在 [0, max)', () => {
    for (const max of [9999, 65536, 1_000_000, 0xffffffff]) {
      for (let i = 0; i < 50; i++) {
        const n = secureRandomInt(max)
        expect(n).toBeGreaterThanOrEqual(0)
        expect(n).toBeLessThan(max)
        expect(Number.isInteger(n)).toBe(true)
      }
    }
  })

  it('max = 1 恒为 0', () => {
    expect(secureRandomInt(1)).toBe(0)
  })

  it('分布大致均匀（无明显模偏差）', () => {
    const buckets = new Array(10).fill(0)
    for (let i = 0; i < 20000; i++) buckets[secureRandomInt(10)]++
    for (const c of buckets) {
      expect(c).toBeGreaterThan(1600)
      expect(c).toBeLessThan(2400)
    }
  })
})

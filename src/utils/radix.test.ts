import { describe, it, expect } from 'vitest'
import { parseRadix, formatRadix, toTwosComplement, fitsInBits } from './radix'

describe('parseRadix', () => {
  it('空串返回 null', () => {
    expect(parseRadix('  ', 10)).toBeNull()
  })

  it('非法字符返回 undefined', () => {
    expect(parseRadix('12abc', 10)).toBeUndefined()
    expect(parseRadix('1.5', 10)).toBeUndefined()
    expect(parseRadix('102', 2)).toBeUndefined()
    expect(parseRadix('8', 8)).toBeUndefined()
  })

  it('支持前缀、分隔符与负数', () => {
    expect(parseRadix('0xFF', 16)).toBe(255n)
    expect(parseRadix('0b1010', 2)).toBe(10n)
    expect(parseRadix('0o17', 8)).toBe(15n)
    expect(parseRadix('1111_0000', 2)).toBe(240n)
    expect(parseRadix('-ff', 16)).toBe(-255n)
  })

  it('超出 2^53 的大整数不丢精度', () => {
    expect(parseRadix('9007199254740993', 10)).toBe(9007199254740993n)
    expect(parseRadix('FFFFFFFFFFFFFFFF', 16)).toBe(18446744073709551615n)
  })
})

describe('formatRadix', () => {
  it('16 进制大写', () => {
    expect(formatRadix(255n, 16)).toBe('FF')
    expect(formatRadix(9007199254740993n, 10)).toBe('9007199254740993')
    expect(formatRadix(5n, 2)).toBe('101')
  })
})

describe('补码', () => {
  it('-1 在各位宽下', () => {
    expect(toTwosComplement(-1n, 8)).toBe(255n)
    expect(toTwosComplement(-1n, 16)).toBe(65535n)
    expect(toTwosComplement(-1n, 64)).toBe(18446744073709551615n)
  })

  it('fitsInBits 边界', () => {
    expect(fitsInBits(-128n, 8)).toBe(true)
    expect(fitsInBits(-129n, 8)).toBe(false)
    expect(fitsInBits(255n, 8)).toBe(true)
    expect(fitsInBits(256n, 8)).toBe(false)
  })
})

import { describe, it, expect } from 'vitest'
import { hashText } from './textHash'

describe('hashText', () => {
  it('相同内容哈希相同，不同内容哈希不同', () => {
    expect(hashText('abc')).toBe(hashText('abc'))
    expect(hashText('abc')).not.toBe(hashText('abd'))
  })
  it('带长度后缀，长度不同一定不同', () => {
    expect(hashText('a')).not.toBe(hashText('aa'))
  })
})

import { describe, it, expect } from 'vitest'
import { jsonToTs } from './jsonToTs'

describe('jsonToTs', () => {
  it('嵌套对象与可选字段', () => {
    const json = {
      id: 1,
      user: { name: 'a', active: true },
      items: [{ k: 1 }, { k: 2, extra: true }],
    }
    const ts = jsonToTs(json, 'Root')
    expect(ts).toContain('export interface Root')
    expect(ts).toContain('user:')
    expect(ts).toMatch(/extra\?/)
  })

  it('null 联合', () => {
    const ts = jsonToTs({ site: null }, 'Root')
    expect(ts).toContain('null')
  })
})
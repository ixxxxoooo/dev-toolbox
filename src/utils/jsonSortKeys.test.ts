import { describe, it, expect } from 'vitest'
import { sortJsonKeys } from './jsonSortKeys'

describe('sortJsonKeys', () => {
  it('递归排序键', () => {
    expect(sortJsonKeys({ b: 1, a: { d: 1, c: 2 } })).toEqual({ a: { c: 2, d: 1 }, b: 1 })
    expect(sortJsonKeys([{ z: 1, a: 2 }])).toEqual([{ a: 2, z: 1 }])
  })
})
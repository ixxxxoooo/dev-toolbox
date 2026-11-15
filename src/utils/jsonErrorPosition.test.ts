import { describe, it, expect } from 'vitest'
import { getJsonErrorPosition, simplifyJsonErrorMessage } from './jsonErrorPosition'

describe('getJsonErrorPosition', () => {
  it('解析 V8 的 position 格式', () => {
    const p = getJsonErrorPosition('{\n  "a": x\n}', 'Unexpected token x at position 9')
    expect(p).toMatchObject({ line: 2, column: 8 })
  })
  it('解析 JSON5 的 行:列 格式', () => {
    const p = getJsonErrorPosition('{}', 'JSON5: invalid end of input at 1:119')
    expect(p).toMatchObject({ line: 1, column: 119 })
  })
  it('无法识别时回退到 1:1', () => {
    expect(getJsonErrorPosition('', 'oops')).toMatchObject({ line: 1, column: 1 })
  })
})

describe('simplifyJsonErrorMessage', () => {
  it('去掉 JSON5 前缀和位置后缀', () => {
    expect(simplifyJsonErrorMessage('JSON5: invalid end of input at 1:119')).toBe('invalid end of input')
  })
})

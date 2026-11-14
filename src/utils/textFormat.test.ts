import { describe, it, expect } from 'vitest'
import { detectFormat, formatText } from './textFormat'

describe('detectFormat', () => {
  it('识别 JSON / XML / SQL', () => {
    expect(detectFormat('{"a":1}')).toBe('json')
    expect(detectFormat('<a><b/></a>')).toBe('xml')
    expect(detectFormat('select * from t')).toBe('sql')
  })

  it('普通英文文本不应被误判为 SQL（旧实现按前缀匹配）', () => {
    expect(detectFormat('Updated the file yesterday')).toBeNull()
    expect(detectFormat('User guide')).toBeNull()
    expect(detectFormat('Setting up the project')).toBeNull()
  })

  it('空串返回 null', () => {
    expect(detectFormat('   ')).toBeNull()
  })
})

describe('formatText', () => {
  it('XML 保持同名兄弟节点的原有顺序', () => {
    const out = formatText('<r><a>1</a><b>2</b><a>3</a></r>')
    expect(out.indexOf('<a>1</a>')).toBeLessThan(out.indexOf('<b>2</b>'))
    expect(out.indexOf('<b>2</b>')).toBeLessThan(out.indexOf('<a>3</a>'))
  })

  it('无法识别时抛错', () => {
    expect(() => formatText('hello world')).toThrow()
  })
})

import { describe, it, expect } from 'vitest'
import { evaluateJsonPath, jsonPathDisplayRoot } from './jsonPath'

const data = {
  id: 1024,
  author: { name: 'Lee', active: true, age: 30 },
  files: [
    { name: 'a.ts', size: 10 },
    { name: 'b.ts', size: 20 },
  ],
  tags: ['json', 'sql'],
}

describe('evaluateJsonPath', () => {
  it('根与点号访问', () => {
    expect(evaluateJsonPath(data, '$').matches).toEqual([data])
    expect(evaluateJsonPath(data, '$.id').matches).toEqual([1024])
    expect(evaluateJsonPath(data, '$.author.name').matches).toEqual(['Lee'])
  })

  it('下标与引号键', () => {
    expect(evaluateJsonPath(data, '$.files[0].name').matches).toEqual(['a.ts'])
    expect(evaluateJsonPath(data, "$.files[0]['name']").matches).toEqual(['a.ts'])
  })

  it('通配符与数组下标', () => {
    expect(evaluateJsonPath(data, '$.files[*].name').matches).toEqual(['a.ts', 'b.ts'])
    expect(evaluateJsonPath(data, '$.author.*').matches.sort()).toEqual([true, 30, 'Lee'].sort())
  })

  it('递归下降', () => {
    expect(evaluateJsonPath(data, '$..name').matches).toEqual(['Lee', 'a.ts', 'b.ts'])
  })

  it('过滤器', () => {
    expect(evaluateJsonPath(data, '$.files[?(@.size>15)].name').matches).toEqual(['b.ts'])
    expect(evaluateJsonPath(data, '$.files[?(@.size>=10 && @.size<=20)]').matches.length).toBe(2)
  })

  it('displayRoot 合并多结果', () => {
    const m = evaluateJsonPath(data, '$.files[*]')
    expect(jsonPathDisplayRoot(m.matches)).toEqual(data.files)
    expect(jsonPathDisplayRoot([data])).toBe(data)
  })
})
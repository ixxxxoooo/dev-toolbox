import { describe, it, expect } from 'vitest'
import { runRegex, buildHighlightHtml, escapeHtml, MAX_MATCHES } from './regexMatch'

describe('runRegex', () => {
  it('非全局只返回第一个匹配', () => {
    const r = runRegex('a', '', 'aaa')
    expect(r.matches.length).toBe(1)
  })

  it('全局匹配与捕获组、命名组', () => {
    const r = runRegex('(?<k>\\w)=(\\d)', 'g', 'a=1 b=2')
    expect(r.matches.map(m => m.text)).toEqual(['a=1', 'b=2'])
    expect(r.matches[0].groups).toEqual(['a', '1'])
    expect(r.matches[1].named.k).toBe('b')
  })

  it('零宽匹配不会死循环', () => {
    const r = runRegex('x*', 'g', 'abc')
    expect(r.matches.length).toBe(4)
  })

  it('匹配数量超过上限时截断', () => {
    const r = runRegex('a', 'g', 'a'.repeat(MAX_MATCHES + 10))
    expect(r.truncated).toBe(true)
    expect(r.matches.length).toBe(MAX_MATCHES)
  })

  it('非法正则抛 SyntaxError', () => {
    expect(() => runRegex('(', '', 'x')).toThrow(SyntaxError)
  })
})

describe('buildHighlightHtml', () => {
  it('高亮后去掉标签的纯文本与原文一致（零宽匹配不丢字符）', () => {
    const text = 'a<b>c d'
    const { matches } = runRegex('\\b|c', 'g', text)
    const html = buildHighlightHtml(text, matches)
    const plain = html.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    expect(plain).toBe(text)
  })

  it('转义 HTML', () => {
    expect(escapeHtml('<a href="x">&')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;')
  })
})

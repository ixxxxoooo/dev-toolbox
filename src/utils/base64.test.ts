import { describe, it, expect } from 'vitest'
import { bytesToBase64, base64ToBytes, decodeUtf8Strict, formatBytes } from './base64'

describe('base64', () => {
  it('UTF-8 文本往返', () => {
    const text = 'Hello 你好 😀'
    const b64 = bytesToBase64(new TextEncoder().encode(text))
    expect(decodeUtf8Strict(base64ToBytes(b64))).toBe(text)
  })

  it('二进制数据往返（含非 UTF-8 字节）', () => {
    const bytes = Uint8Array.from([0, 255, 254, 128, 1, 2, 3])
    const out = base64ToBytes(bytesToBase64(bytes))
    expect(Array.from(out)).toEqual(Array.from(bytes))
    expect(decodeUtf8Strict(bytes)).toBeNull()
  })

  it('URL-safe 编码不含 + / =，且解码时自动识别', () => {
    const bytes = Uint8Array.from([251, 255, 254])
    const safe = bytesToBase64(bytes, true)
    expect(safe).not.toMatch(/[+/=]/)
    expect(Array.from(base64ToBytes(safe))).toEqual([251, 255, 254])
  })

  it('解码时容忍空白、换行、data URL 前缀和缺失的填充', () => {
    expect(new TextDecoder().decode(base64ToBytes('data:text/plain;base64,SGVs\nbG8'))).toBe('Hello')
  })

  it('大输入不会栈溢出', () => {
    const big = new Uint8Array(500_000).fill(65)
    expect(base64ToBytes(bytesToBase64(big)).length).toBe(500_000)
  })

  it('非法长度抛错', () => {
    expect(() => base64ToBytes('A')).toThrow()
  })

  it('formatBytes', () => {
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(2048)).toBe('2.0 KB')
    expect(formatBytes(3 * 1024 * 1024)).toBe('3.0 MB')
  })
})

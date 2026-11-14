/**
 * Base64 编解码工具（二进制安全）。
 */

/** 字节数组 → Base64。分块拼接，避免 String.fromCharCode.apply 在大输入时栈溢出 */
export function bytesToBase64(bytes: Uint8Array, urlSafe = false): string {
  let binary = ''
  const CHUNK_SIZE = 0x8000 // 32KB
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK_SIZE) as unknown as number[])
  }
  let result = btoa(binary)
  if (urlSafe) {
    result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }
  return result
}

/**
 * Base64 → 字节数组。
 * 宽容处理：去掉 data URL 前缀与所有空白（含 MIME 76 列换行）、同时接受标准与 URL-safe 字符集、自动补齐 `=` 填充。
 */
export function base64ToBytes(input: string): Uint8Array {
  let b64 = input.trim().replace(/^data:[^,]*;base64,/i, '').replace(/\s+/g, '')
  b64 = b64.replace(/-/g, '+').replace(/_/g, '/')
  const rem = b64.length % 4
  if (rem === 1) throw new Error('Invalid Base64 length')
  if (rem) b64 += '='.repeat(4 - rem)
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

/** 严格按 UTF-8 解码；字节不是合法 UTF-8 时返回 null（说明是二进制数据） */
export function decodeUtf8Strict(bytes: Uint8Array): string | null {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    return null
  }
}

/** 字节数格式化 */
export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

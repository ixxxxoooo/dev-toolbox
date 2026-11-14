/**
 * 生成 [0, max) 范围内均匀分布的随机整数。
 * 使用 crypto.getRandomValues + 32 位拒绝采样消除模偏差；
 * 支持 max 最大到 2^32（旧实现用单字节采样，max > 256 时会死循环）。
 * 仅在 crypto 不可用时降级到 Math.random（并给出控制台警告）。
 */
export const secureRandomInt = (max: number): number => {
  if (!Number.isFinite(max) || max <= 0) return 0
  const cryptoObj = globalThis.crypto
  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    const range = 0x100000000
    const limit = range - (range % max)
    const buf = new Uint32Array(1)
    do {
      cryptoObj.getRandomValues(buf)
    } while (buf[0] >= limit)
    return buf[0] % max
  }
  console.warn('crypto.getRandomValues unavailable, falling back to Math.random (NOT secure)')
  return Math.floor(Math.random() * max)
}

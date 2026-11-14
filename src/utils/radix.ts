/**
 * 进制转换工具（基于 BigInt，不受 2^53 精度限制）
 */

export type Radix = 2 | 8 | 10 | 16
export type BitWidth = 8 | 16 | 32 | 64

const PATTERNS: Record<Radix, RegExp> = {
  2: /^-?[01]+$/,
  8: /^-?[0-7]+$/,
  10: /^-?\d+$/,
  16: /^-?[0-9a-f]+$/i
}

/**
 * 严格解析指定进制的整数字符串。
 * 空串返回 null；含非法字符（如 "12abc"）、小数点等返回 undefined，调用方可据此提示错误。
 * 16 进制允许 0x 前缀，2 进制允许 0b 前缀，8 进制允许 0o 前缀；允许下划线与空格作分隔符。
 */
export const parseRadix = (input: string, radix: Radix): bigint | null | undefined => {
  let text = input.trim().replace(/[\s_]/g, '')
  if (!text) return null
  let negative = false
  if (text.startsWith('-')) {
    negative = true
    text = text.slice(1)
  }
  const prefix = radix === 16 ? /^0x/i : radix === 2 ? /^0b/i : radix === 8 ? /^0o/i : null
  if (prefix) text = text.replace(prefix, '')
  const normalized = (negative ? '-' : '') + text
  if (!PATTERNS[radix].test(normalized)) return undefined
  const digits = text
  let value = 0n
  const r = BigInt(radix)
  for (const ch of digits.toLowerCase()) {
    value = value * r + BigInt(parseInt(ch, radix))
  }
  return negative ? -value : value
}

/** 以指定进制输出（16 进制为大写）。 */
export const formatRadix = (value: bigint, radix: Radix): string => {
  const s = value.toString(radix)
  return radix === 16 ? s.toUpperCase() : s
}

/**
 * 计算 n 位补码表示（无符号数值）；超出范围的值按位宽截断（与硬件行为一致）。
 */
export const toTwosComplement = (value: bigint, bits: BitWidth): bigint => BigInt.asUintN(bits, value)

/** 判断值是否能在给定位宽内表示（有符号或无符号）。 */
export const fitsInBits = (value: bigint, bits: BitWidth): boolean => {
  const min = -(1n << BigInt(bits - 1))
  const maxUnsigned = (1n << BigInt(bits)) - 1n
  return value >= min && value <= maxUnsigned
}

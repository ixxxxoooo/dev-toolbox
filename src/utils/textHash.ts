/**
 * 轻量字符串哈希（djb2 变体），仅用于“内容是否被改动”的比较，不用于安全场景。
 * 比起把整份原文再存一遍，只存哈希可以避免占用 localStorage 配额。
 */
export const hashText = (text: string): string => {
  let h = 5381
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) + h + text.charCodeAt(i)) | 0
  }
  return (h >>> 0).toString(36) + ':' + text.length
}

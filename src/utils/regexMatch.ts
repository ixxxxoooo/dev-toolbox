/**
 * 正则匹配的纯函数实现（可在主线程或 Worker 中运行）。
 */

export interface MatchInfo {
  index: number
  text: string
  groups: (string | undefined)[]
  named: Record<string, string | undefined>
}

export interface RegexRunResult {
  matches: MatchInfo[]
  /** 匹配数量超过上限被截断 */
  truncated: boolean
}

export const MAX_MATCHES = 5000

/**
 * 执行匹配。pattern 非法时会抛出 SyntaxError。
 * 非全局正则只返回第一个匹配；全局正则用 matchAll（会自动推进零宽匹配）。
 */
export const runRegex = (pattern: string, flags: string, text: string): RegexRunResult => {
  const re = new RegExp(pattern, flags)
  const matches: MatchInfo[] = []
  let truncated = false

  const toInfo = (m: RegExpMatchArray): MatchInfo => ({
    index: m.index ?? 0,
    text: m[0],
    groups: m.slice(1),
    named: { ...(m.groups ?? {}) }
  })

  if (!re.global) {
    const m = re.exec(text)
    if (m) matches.push(toInfo(m))
    return { matches, truncated }
  }

  for (const m of text.matchAll(re)) {
    if (matches.length >= MAX_MATCHES) {
      truncated = true
      break
    }
    matches.push(toInfo(m))
  }
  return { matches, truncated }
}

export const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

/**
 * 生成带高亮 <span> 的 HTML，其文本内容与原文逐字符一致（保证与 textarea 叠放时不错位）。
 * 零宽匹配不渲染高亮，也不会跳过任何字符（旧实现对零宽匹配 lastIndex++ 会丢字符，导致后续高亮整体偏移）。
 */
export const buildHighlightHtml = (text: string, matches: MatchInfo[]): string => {
  let html = ''
  let cursor = 0
  for (const m of matches) {
    if (m.text.length === 0) continue
    if (m.index < cursor) continue
    html += escapeHtml(text.slice(cursor, m.index))
    html += `<span class="bg-yellow-500/30 text-yellow-200 rounded-sm">${escapeHtml(m.text)}</span>`
    cursor = m.index + m.text.length
  }
  html += escapeHtml(text.slice(cursor))
  return html
}

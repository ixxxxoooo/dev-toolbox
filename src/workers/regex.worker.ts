/// <reference lib="webworker" />
import { runRegex } from '../utils/regexMatch'

/**
 * 在 Worker 里执行正则：灾难性回溯只会卡住 Worker，
 * 主线程可在超时后 terminate() 掉它，页面不会假死。
 */
self.onmessage = (e: MessageEvent<{ id: number; pattern: string; flags: string; text: string }>) => {
  const { id, pattern, flags, text } = e.data
  try {
    const result = runRegex(pattern, flags, text)
    ;(self as unknown as Worker).postMessage({ id, ok: true, result })
  } catch (err) {
    ;(self as unknown as Worker).postMessage({ id, ok: false, error: err instanceof Error ? err.message : String(err) })
  }
}

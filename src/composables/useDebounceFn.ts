import { onBeforeUnmount } from 'vue'

/**
 * 创建一个防抖函数：在连续调用时只执行最后一次，间隔 delay ms 内的重复调用会被丢弃。
 *
 * 关键设计：
 * - 组件卸载时自动清理待执行的定时器（通过 onBeforeUnmount），避免在已卸载的
 *   ref / 已 dispose 的编辑器上触发回调 —— 修复此前散落各处的 timer 泄漏问题。
 * - `flush()` 可立即触发挂起的调用（用于"保存"等需要立即落盘的场景）。
 * - `cancel()` 取消挂起的调用。
 *
 * @param fn 要防抖的函数
 * @param delay 防抖延迟（毫秒），默认 200ms
 */
export function useDebounceFn<T extends (...args: any[]) => void>(
  fn: T,
  delay = 200
): { run: (...args: Parameters<T>) => void; cancel: () => void; flush: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null
  let pendingArgs: Parameters<T> | null = null

  const run = (...args: Parameters<T>) => {
    pendingArgs = args
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      if (pendingArgs) {
        const argsToCall = pendingArgs
        pendingArgs = null
        fn(...argsToCall)
      }
    }, delay)
  }

  const cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    pendingArgs = null
  }

  const flush = () => {
    if (timer && pendingArgs) {
      clearTimeout(timer)
      timer = null
      const argsToCall = pendingArgs
      pendingArgs = null
      fn(...argsToCall)
    }
  }

  // 组件卸载时自动清理，避免泄漏（与项目里 pendingTimers 的清理模式一致）
  onBeforeUnmount(() => {
    cancel()
  })

  return { run, cancel, flush }
}

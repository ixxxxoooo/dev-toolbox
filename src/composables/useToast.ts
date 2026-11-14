import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
  /** 可选操作按钮（如“立即刷新”） */
  action?: { label: string; onClick: () => void }
}

/** 全局 Toast 队列（模块级单例，由 ToastHost 组件渲染） */
export const toasts = ref<ToastItem[]>([])

let seed = 0

/**
 * 显示一条轻提示，duration 毫秒后自动消失。
 */
export const showToast = (
  message: string,
  type: ToastType = 'info',
  duration = 2000,
  action?: ToastItem['action']
): void => {
  const id = ++seed
  toasts.value = [...toasts.value, { id, message, type, action }].slice(-3)
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, duration)
}

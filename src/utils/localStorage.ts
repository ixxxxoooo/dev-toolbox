/**
 * 通用的本地存储工具函数
 * 用于在各个编辑器页面中保存和加载状态
 */
import { ref, watch, type Ref } from 'vue';
import i18n from '@/locales';
import { showToast } from '@/composables/useToast';

/**
 * 从本地存储加载数据
 * @param key 存储键名
 * @param defaultValue 默认值
 * @returns 存储的值或默认值
 *
 * 重载说明：当 defaultValue 为 null 时，保留 any 返回类型（如 Excalidraw.vue
 * 历史代码依赖该宽松签名），其余情况由 defaultValue 推断具体类型 T。
 */
export function loadFromStorage<T>(key: string, defaultValue: T): T;
export function loadFromStorage(key: string, defaultValue: null): any;
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? (JSON.parse(saved) as T) : defaultValue;
  } catch (error) {
    console.error(`加载存储数据失败 (${key}):`, error);
    return defaultValue;
  }
}

/** 单个键允许写入的最大序列化长度（字符数）。超过则不落盘，避免一个超大输入占满 5MB 配额 */
export const MAX_STORAGE_VALUE_LENGTH = 2 * 1024 * 1024;

let lastQuotaToastAt = 0;
/** 配额/超限提示节流：5 秒内最多提示一次，避免每次按键都弹 */
const notifyStorageProblem = (messageKey: string) => {
  const now = Date.now();
  if (now - lastQuotaToastAt < 5000) return;
  lastQuotaToastAt = now;
  showToast(i18n.global.t(messageKey), 'error', 4000);
};

const isQuotaError = (error: unknown): boolean =>
  error instanceof DOMException &&
  (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED' || error.code === 22 || error.code === 1014);

/**
 * 保存数据到本地存储
 * @param key 存储键名
 * @param value 要保存的值
 * @returns 是否写入成功（配额不足、数据过大或序列化失败时返回 false，并提示用户）
 */
export const saveToStorage = <T>(key: string, value: T): boolean => {
  try {
    const serialized = JSON.stringify(value);
    if (serialized !== undefined && serialized.length > MAX_STORAGE_VALUE_LENGTH) {
      // 过大的内容不持久化；同时清掉旧值，避免刷新后恢复出一份过期内容
      localStorage.removeItem(key);
      notifyStorageProblem('common.messages.storageTooLarge');
      return false;
    }
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    if (isQuotaError(error)) {
      notifyStorageProblem('common.messages.storageFull');
    }
    console.error(`保存存储数据失败 (${key}):`, error);
    return false;
  }
};

// 防抖写入：编辑器每次按键都 JSON.stringify + 同步写 localStorage，对大文本会明显卡顿
const pendingSaves = new Map<string, { timer: ReturnType<typeof setTimeout>; value: unknown }>();

/** 立即写入所有挂起的防抖保存（页面隐藏/关闭前调用，避免丢失最后一次输入） */
export const flushPendingSaves = (): void => {
  for (const [key, { timer, value }] of pendingSaves) {
    clearTimeout(timer);
    saveToStorage(key, value);
  }
  pendingSaves.clear();
};

/**
 * 防抖版 saveToStorage：同一个 key 在 delay 内的多次调用只会落盘最后一次。
 * 模块级实现（不依赖组件生命周期），因此切换路由后挂起的写入仍会完成。
 */
export const saveToStorageDebounced = <T>(key: string, value: T, delay = 300): void => {
  const existing = pendingSaves.get(key);
  if (existing) clearTimeout(existing.timer);
  const timer = setTimeout(() => {
    pendingSaves.delete(key);
    saveToStorage(key, value);
  }, delay);
  pendingSaves.set(key, { timer, value });
};

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flushPendingSaves);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushPendingSaves();
  });
}

/**
 * 创建一个与 localStorage 自动同步的响应式引用。
 * - 首次读取时从 localStorage 加载（不存在则用 defaultValue）
 * - 之后 ref 的每次变更都会自动写回 localStorage
 *
 * @param key 存储键名
 * @param defaultValue 默认值
 * @returns 响应式引用（其 .value 变化会自动持久化）
 */
export const createStoredRef = <T>(key: string, defaultValue: T): Ref<T> => {
  const stored = ref(loadFromStorage(key, defaultValue)) as Ref<T>;
  watch(
    stored,
    (newValue) => {
      saveToStorage(key, newValue);
    },
    { deep: true }
  );
  return stored;
};

/**
 * 清除指定前缀的所有本地存储项
 * @param prefix 存储键名前缀
 */
export const clearStorageByPrefix = (prefix: string): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error(`清除存储数据失败 (前缀: ${prefix}):`, error);
  }
};

/**
 * 通用的本地存储工具函数
 * 用于在各个编辑器页面中保存和加载状态
 */
import { ref, watch, type Ref } from 'vue';

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

/**
 * 保存数据到本地存储
 * @param key 存储键名
 * @param value 要保存的值
 */
export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`保存存储数据失败 (${key}):`, error);
  }
};

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

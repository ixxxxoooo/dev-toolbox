/**
 * 通用的本地存储工具函数
 * 用于在各个编辑器页面中保存和加载状态
 */

/**
 * 从本地存储加载数据
 * @param key 存储键名
 * @param defaultValue 默认值
 * @returns 存储的值或默认值
 */
export const loadFromStorage = (key: string, defaultValue: any) => {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`加载存储数据失败 (${key}):`, error);
    return defaultValue;
  }
};

/**
 * 保存数据到本地存储
 * @param key 存储键名
 * @param value 要保存的值
 */
export const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`保存存储数据失败 (${key}):`, error);
  }
};

/**
 * 为编辑器内容创建自动保存的响应式引用
 * @param key 存储键名
 * @param defaultValue 默认值
 * @param editor 编辑器实例（可选，用于设置内容变化监听）
 * @returns 响应式引用
 */
export const createStoredRef = (key: string, defaultValue: any) => {
  // 注意：此函数需要在使用时导入 ref 和 watch
  const storedRef = loadFromStorage(key, defaultValue);
  return storedRef;
};

/**
 * 清除指定前缀的所有本地存储项
 * @param prefix 存储键名前缀
 */
export const clearStorageByPrefix = (prefix: string) => {
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

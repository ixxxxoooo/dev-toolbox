/**
 * 键盘快捷键工具函数
 * 用于在各个页面中禁用特定的快捷键
 */

/**
 * 禁用保存快捷键的事件处理函数
 * @param event 键盘事件
 */
export const handleDisableSaveShortcut = (event: KeyboardEvent) => {
  // 检查是否是保存快捷键 (Ctrl+S 或 Cmd+S)
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault(); // 阻止默认行为
    event.stopPropagation(); // 阻止事件冒泡
    console.log('保存快捷键已被禁用'); // 可选的调试信息
  }
};

/**
 * 为页面添加保存快捷键禁用功能
 * 在组件的 onMounted 中调用此函数
 */
export const addDisableSaveShortcut = () => {
  document.addEventListener('keydown', handleDisableSaveShortcut);
};

/**
 * 移除保存快捷键禁用功能
 * 在组件的 onBeforeUnmount 中调用此函数
 */
export const removeDisableSaveShortcut = () => {
  document.removeEventListener('keydown', handleDisableSaveShortcut);
};

/**
 * 创建一个组合钩子，自动管理保存快捷键禁用
 * 返回的函数可以在组件中调用来启用/禁用功能
 */
export const useDisableSaveShortcut = () => {
  const enable = () => addDisableSaveShortcut();
  const disable = () => removeDisableSaveShortcut();

  return { enable, disable };
};

/* 首屏主题初始化：在页面首次绘制前同步设置明暗与色板，避免白屏闪烁。
 * 注意：CSP 为 script-src 'self'，所以必须是外部文件，不能内联。
 * 逻辑需与 src/stores/theme.ts 保持一致（键名：theme-mode / ui-palette）。 */
(function () {
  try {
    var root = document.documentElement
    var mode = localStorage.getItem('theme-mode') || 'system'
    var dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    if (dark) root.classList.add('dark')
    var palette = localStorage.getItem('ui-palette')
    if (['indigo', 'emerald', 'rose', 'amber', 'ocean', 'graphite'].indexOf(palette) === -1) palette = 'indigo'
    root.setAttribute('data-palette', palette)
  } catch (e) { /* 隐私模式下 localStorage 可能不可用，忽略即可 */ }
})()

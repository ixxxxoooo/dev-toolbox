/**
 * Monaco Editor 精简入口。
 *
 * 直接 `import 'monaco-editor'` 会引入全部 ~80 种基础语言以及 CSS / HTML / TypeScript 语言服务
 * （其中 ts.worker 体积数 MB）。本项目只用到：
 *  - 编辑器核心与标准交互功能（edcore.main）
 *  - json（带语言服务 worker：校验、折叠）
 *  - sql（Monarch 高亮）
 *  - plaintext（内置）与自定义的 mermaid（在 Mermaid.vue 中注册）
 * 因此各处统一从这里导入 monaco，而不是 'monaco-editor'。
 */
import 'monaco-editor/esm/vs/editor/edcore.main.js'
import 'monaco-editor/esm/vs/language/json/monaco.contribution.js'
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution.js'

export * from 'monaco-editor/esm/vs/editor/editor.api.js'

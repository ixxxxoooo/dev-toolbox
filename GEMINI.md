# 项目概览

Dev Toolbox 是一个基于 Vue 3 + Vite 的纯 Web（PWA）开发者工具箱，部署在 Vercel / Cloudflare Pages。
目前包含的工具（见 `src/router/index.ts`）：

- JSON 工具、文本对比（Diff）、Base64、URL 编解码、Unicode 转换
- 时间戳转换、UUID 生成、密码生成、哈希生成、进制转换
- SQL 格式化、正则测试器、文本分析、HTTP 状态码、User-Agent 解析、二维码
- Markdown 预览、Mermaid 图表

> 注意：本项目**不是** Electron 桌面应用，没有 `electron:dev` / `build:mac` / `build:win` / `build:web` 等脚本。

## 构建与运行

要求 Node.js 20.19+（推荐 22 LTS）。

```bash
npm install
npm run dev        # 开发服务器（端口 3000）
npm run typecheck  # vue-tsc 类型检查
npm test           # Vitest 单元测试
npm run build      # 类型检查 + 生产构建（输出到 dist/）
npm run preview    # 预览构建产物
```

## 开发约定

- **前端框架：** Vue 3 `<script setup>` + TypeScript
- **构建工具：** Vite 5（PWA 由 vite-plugin-pwa 提供，采用"提示用户刷新"的更新策略）
- **样式：** TailwindCSS
- **编辑器：** Monaco Editor
- **状态管理：** Pinia（主题 store 为自定义单例）
- **国际化：** vue-i18n，`src/locales/zh.ts` 与 `en.ts` 的键必须保持一致
- **代码风格：** 项目当前未配置 ESLint / Prettier，请保持与周围代码一致的风格；注释使用中文
- **测试：** 纯逻辑（解析、转换、随机数等）放在 `src/utils/` 并配套 Vitest 测试（`*.test.ts`）
- **公共能力：** 复制/粘贴统一使用 `src/utils/clipboard.ts`，提示使用 `src/composables/useToast.ts`，
  大体积持久化数据使用 `src/utils/idbStore.ts`（IndexedDB），工具图标在 `src/utils/toolIcons.ts` 登记
- **贡献：** 详见 `CONTRIBUTING.md`

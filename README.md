# Dev Toolbox

一个集成常用开发者工具的桌面应用，基于 Electron + Vue 3 + TypeScript 构建。

## 功能特性

- 📝 **文本对比工具** - 基于 Monaco Editor，支持分屏/内联对比，高亮差异，忽略空白，主题切换，差异导航，自动换行。
- 🔤 **Base64 编解码** - 基于 Monaco Editor，支持UTF-8安全编解码，URL安全模式，文件导入导出，自动换行。
- 📄 **JSON 工具** - 基于 Monaco Editor，支持格式化、压缩、JSON与YAML/XML转换，交互式树状视图，JSONPath查询，自动换行。
- 🔗 **URL 编解码** - 基于 Monaco Editor，支持 `encodeURIComponent`/`encodeURI` 和 `decodeURIComponent`/`decodeURI`，实时转换，自动换行。
- ⏰ **智能时间戳转换** - 基于 Day.js，智能识别多种时间格式（时间戳、日期字符串、自然语言），输出多种标准格式。
- 🔑 **UUID 生成器** - 生成全局唯一标识符 (UUID v4)。
- 📊 **字符统计工具** - 实时统计文本的字数（支持中英文）、字符数、行数、段落数等信息。
- 🔒 **哈希生成器** - 生成文本的MD5, SHA-1, SHA-256, SHA-512哈希值。

## 核心特性

✅ **统一且专业的UI/UX** - 所有工具模块采用一致的布局、样式和交互，提供流畅的用户体验。
✅ **强大的编辑器体验** - 集成 Monaco Editor (VS Code核心)，提供语法高亮、实时校验、代码折叠、自动换行等高级功能。
✅ **详细的帮助提示** - 每个工具模块都提供清晰的说明、示例和按钮功能解释。
✅ **快速工具切换** - 顶部导航栏提供快速切换工具的入口，带图标显示。
✅ **统一导航** - 所有工具页面顶部导航栏均显示“Dev Toolbox”标题，点击可返回主页。
✅ **完整的剪贴板支持** - 所有文本框都支持复制粘贴操作。
✅ **文件导入导出** - 支持多种文件格式的导入和结果导出。
✅ **深色模式支持** - 自适应系统主题。
✅ **响应式设计** - 支持不同窗口大小。
✅ **实时预览** - 输入即时处理和反馈。

## 技术栈

- **前端框架**: Vue 3.4.x + TypeScript 5.x
- **构建工具**: Vite 5.x
- **桌面框架**: Electron 31.x
- **UI框架**: TailwindCSS 3.x
- **工具库**:
  - monaco-editor (核心编辑器)
  - dayjs (日期处理)
  - js-yaml (YAML转换)
  - xml-js (XML转换)
  - crypto-js (哈希算法)
  - lucide-vue-next (图标库)
  - @vueuse/core (组合式工具)
  - electron-store (数据存储)

## 快速开始

### 环境要求

- Node.js 18+
- npm 9+

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 启动 Web 开发服务器
npm run dev

# 启动 Electron 应用开发模式
npm run electron:dev
```

### 构建应用

```bash
# 完整构建 (包含所有平台)
npm run build

# 分平台构建
mymac: npm run build:mac     # macOS (DMG)
windows: npm run build:win     # Windows (NSIS)
linux: npm run build:linux   # Linux (AppImage)
```

## 项目结构

```
dev-toolbox/
├── electron/                 # Electron 主进程代码
│   ├── main.ts              # 主进程入口，负责窗口创建、IPC通信、菜单、右键菜单等
│   └── preload.ts           # 预加载脚本，安全地将Node.js能力暴露给渲染进程
├── src/                     # Vue 应用源码
│   ├── assets/              # 静态资源，如图片、字体
│   ├── components/          # 可复用 Vue 组件，如 ToolSwitcher, JsonTreeView, JsonNode
│   ├── stores/              # Pinia 状态管理模块，如 theme.ts (主题切换)
│   ├── types/               # TypeScript 类型定义文件
│   ├── utils/               # 工具函数和模块配置，如 modules.ts (工具模块定义)
│   ├── views/               # 页面视图组件，每个工具对应一个 .vue 文件
│   │   ├── Home.vue        # 应用首页，展示所有工具卡片
│   │   ├── Diff.vue        # 文本对比工具页面
│   │   ├── Base64.vue      # Base64编解码工具页面
│   │   ├── Json.vue        # JSON处理工具页面
│   │   ├── Url.vue         # URL编解码工具页面
│   │   ├── Timestamp.vue   # 时间戳转换工具页面
│   │   ├── UuidGenerator.vue # UUID生成器页面
│   │   ├── TextAnalyzer.vue # 字符统计工具页面
│   │   └── HashGenerator.vue # 哈希生成器页面
│   ├── App.vue              # Vue 根组件
│   ├── main.ts              # Vue 应用入口，配置路由、挂载应用
│   └── style.css            # 全局样式文件
├── public/                  # 静态资源，直接复制到构建目录
├── dist/                    # Web构建输出目录
└── dist-electron/           # Electron构建输出目录 (包含主进程和预加载脚本)
```

## 功能详解

### 文本对比工具
- **多种对比模式**: 分屏/内联，字符级、单词级、行级差异
- **语法高亮**: 清晰标识添加、删除、修改的内容
- **文件导入**: 支持多种文本文件格式
- **统计信息**: 实时显示差异统计数据
- **自动换行**: 可切换编辑器文本自动换行

### Base64 编解码工具
- **双向转换**: 编码/解码自由切换
- **URL安全模式**: 支持URL Safe Base64格式
- **文件处理**: 直接处理文件内容
- **自动处理**: 输入即时转换
- **自动换行**: 可切换编辑器文本自动换行

### JSON 工具
- **多种操作**: 格式化、压缩、验证
- **数据转换**: JSON ↔ YAML ↔ XML
- **JSONPath查询**: 支持路径查询功能
- **语法验证**: 实时验证JSON格式
- **交互式树状视图**: 可切换显示，直观展示JSON结构
- **自动换行**: 可切换编辑器文本自动换行

### URL 编解码工具
- **多种模式**: encodeURIComponent/encodeURI/decodeURIComponent/decodeURI
- **自动处理**: 输入即时处理
- **自动换行**: 可切换编辑器文本自动换行

### 智能时间戳转换工具
- **智能解析**: 自动识别多种时间格式（秒/毫秒时间戳、YYYYMMDD、标准日期字符串、ISO 8601、自然语言日期）
- **多格式输出**: 本地时间、UTC、时间戳（秒/毫秒）、RFC 2822、相对时间
- **快捷操作**: 复制当前时间戳，设为当前时间

### UUID 生成器
- **UUID v4**: 生成基于随机数的全局唯一标识符
- **便捷操作**: 一键生成、复制、清空

### 字符统计工具
- **实时统计**: 统计文本的字符数（含/不含空格）、字数（支持中英文）、行数、段落数
- **Monaco Editor**: 提供流畅的文本输入体验

### 哈希生成器
- **多种哈希算法**: MD5, SHA-1, SHA-256, SHA-512
- **实时生成**: 输入文本即时计算哈希值
- **清晰展示**: 结果按算法分组，易于复制

## 构建配置

### Electron Builder 配置

应用支持打包为以下格式：
- **macOS**: DMG 安装包 (支持 x64 和 arm64)
- **Windows**: NSIS 安装程序
- **Linux**: AppImage 便携应用

### 开发环境配置

```json
{
  "scripts": {
    "dev": "vite",                          // Web开发服务器
    "electron:dev": "...",                  // Electron开发模式
    "build": "...",                         // 完整构建
    "build:mac": "...",                     // macOS构建
    "build:win": "...",                     // Windows构建
    "build:linux": "..."                   // Linux构建
  }
}
```

## 故障排除

### 常见问题

1. **剪贴板权限问题**
   - 应用已集成 Electron 剪贴板 API，无需额外权限

2. **构建失败**
   - 确保 Node.js 版本 >= 18
   - 删除 node_modules 重新安装依赖

3. **开发模式启动失败**
   - 检查端口 3000 是否被占用
   - 确保所有依赖正确安装

### 技术支持

如遇到问题，请检查：
1. Node.js 和 npm 版本
2. 依赖安装是否完整
3. 系统权限设置

## 更新日志

### v1.0.0 (2025-01-01)

- ✅ 初始版本发布
- ✅ 实现所有核心功能
- ✅ 完善剪贴板支持
- ✅ 优化用户体验
- ✅ 完整的构建配置

### v1.1.0 (最新)

- ✨ **全面升级核心工具模块**：
  - **文本对比**: 集成 Monaco Editor，支持分屏/内联对比，高亮差异，忽略空白，主题切换，差异导航，自动换行。
  - **Base64 编解码**: 集成 Monaco Editor，支持UTF-8安全编解码，URL安全模式，文件导入导出，自动换行。
  - **JSON 工具**: 集成 Monaco Editor，支持格式化、压缩、JSON与YAML/XML转换，交互式树状视图，JSONPath查询，自动换行。
  - **URL 编解码**: 集成 Monaco Editor，支持 `encodeURIComponent`/`encodeURI` 和 `decodeURIComponent`/`decodeURI`，实时转换，自动换行。
  - **智能时间戳转换**: 集成 Day.js，智能识别多种时间格式（时间戳、日期字符串、自然语言），输出多种标准格式。
  - **UUID 生成器**: 生成全局唯一标识符 (UUID v4)。
  - **字符统计工具**: 实时统计文本的字数（支持中英文）、字符数、行数、段落数等信息。
  - **哈希生成器**: 生成文本的MD5, SHA-1, SHA-256, SHA-512哈希值。
- 🎨 **统一且专业的UI/UX**：所有工具模块采用一致的布局、样式和交互，提供流畅的用户体验。
- 💡 **详细的帮助提示**：每个工具模块都提供清晰的说明、示例和按钮功能解释。
- 🚀 **快速工具切换**：顶部导航栏提供快速切换工具的入口，带图标显示。
- 🏠 **统一导航**：所有工具页面顶部导航栏均显示“Dev Toolbox”标题，点击可返回主页。
- 🐞 **修复**：解决了时间戳工具无法识别 `YYYYMMDD` 格式的问题。

## 许可证

MIT License
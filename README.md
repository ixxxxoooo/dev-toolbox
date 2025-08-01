# Dev Toolbox

一个集成常用开发者工具的桌面应用，基于 Electron + Vue 3 + TypeScript 构建。

## 功能特性

- 📝 **文本对比工具** - 支持字符级、单词级、行级差异比较，带有语法高亮和统计信息
- 🔤 **Base64 编解码** - 支持标准和URL安全编码，文件导入导出功能
- 📄 **JSON 格式化** - JSON格式化、压缩、验证，支持多种数据格式转换(YAML/XML/CSV)
- 🔗 **URL 编解码** - URL编码解码，支持批量处理和常用字符集
- ⏰ **时间戳转换** - 时间戳与日期相互转换，多时区支持，常用时间预设

## 核心特性

✅ **完整的剪贴板支持** - 所有文本框都支持复制粘贴操作
✅ **文件导入导出** - 支持多种文件格式的导入和结果导出
✅ **深色模式支持** - 自适应系统主题
✅ **响应式设计** - 支持不同窗口大小
✅ **实时预览** - 输入即时处理和反馈

## 技术栈

- **前端框架**: Vue 3.4.x + TypeScript 5.x
- **构建工具**: Vite 5.x
- **桌面框架**: Electron 31.x
- **UI框架**: TailwindCSS 3.x
- **工具库**:
  - diff-match-patch (文本对比)
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
npm run build:mac     # macOS (DMG)
npm run build:win     # Windows (NSIS)
npm run build:linux   # Linux (AppImage)
```

## 项目结构

```
dev-toolbox/
├── electron/                 # Electron 主进程代码
│   ├── main.ts              # 主进程入口
│   └── preload.ts           # 预加载脚本
├── src/                     # Vue 应用源码
│   ├── components/          # 可复用组件
│   ├── views/               # 页面视图组件
│   │   ├── Diff.vue        # 文本对比页面
│   │   ├── Base64.vue      # Base64编解码页面
│   │   ├── Json.vue        # JSON处理页面
│   │   ├── Url.vue         # URL编解码页面
│   │   └── Timestamp.vue   # 时间戳转换页面
│   ├── stores/              # Pinia 状态管理
│   ├── utils/               # 工具函数
│   └── types/               # TypeScript 类型定义
├── public/                  # 静态资源
├── dist/                    # Web构建输出
└── dist-electron/           # Electron构建输出
```

## 功能详解

### 文本对比工具

- **多种对比模式**: 字符级、单词级、行级差异
- **语法高亮**: 清晰标识添加、删除、修改的内容
- **文件导入**: 支持多种文本文件格式
- **统计信息**: 实时显示差异统计数据

### Base64 编解码工具

- **双向转换**: 编码/解码自由切换
- **URL安全模式**: 支持URL Safe Base64格式
- **文件处理**: 直接处理文件内容
- **自动处理**: 输入即时转换

### JSON 格式化工具

- **多种操作**: 格式化、压缩、验证
- **数据转换**: JSON ↔ YAML ↔ XML ↔ CSV
- **JSONPath查询**: 支持路径查询功能
- **语法验证**: 实时验证JSON格式

### URL 编解码工具

- **多种模式**: encodeURI/encodeURIComponent/decode
- **批量处理**: 支持多行批量转换
- **常用字符**: 快速插入常用URL字符
- **实时转换**: 输入即时处理

### 时间戳转换工具

- **双向转换**: 时间戳 ↔ 日期时间
- **多时区支持**: 支持全球主要时区
- **多种格式**: ISO、RFC、自定义格式
- **快捷预设**: 常用时间点快速设置

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

## 许可证

MIT License
# Dev Toolbox - 开发工具箱

一个基于 Electron + Vue3 + TypeScript 的桌面开发工具集合，为开发者提供常用的小工具，提高开发效率。

## ✨ 功能特性

### 🔧 核心工具
- **文本对比** - 支持文本差异对比，高亮显示不同之处
- **JSON格式化** - JSON数据格式化和验证，支持语法高亮
- **Base64编解码** - 文本与Base64编码的相互转换
- **时间戳转换** - 时间戳与日期时间的快速转换
- **URL编解码** - URL编码和解码工具

### 🎨 界面特色
- 现代化的深色/浅色主题切换
- 响应式设计，适配不同屏幕尺寸
- 直观的操作界面，零学习成本
- 实时转换，即时显示结果

## 🚀 技术栈

- **Electron** - 跨平台桌面应用框架
- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript超集
- **TailwindCSS** - 实用优先的CSS框架
- **Vite** - 快速的前端构建工具

## 📦 安装与使用

### 开发环境
```bash
# 克隆项目
git clone https://github.com/lwj1989/dev-toolbox.git
cd dev-toolbox

# 安装依赖
npm install

# 启动开发模式
npm run electron:dev

# 构建应用
npm run electron:build
```

### 使用说明
1. 启动应用后，在首页可以看到所有可用工具
2. 点击对应工具卡片即可进入相应功能页面
3. 每个工具都有清晰的输入输出界面
4. 支持剪贴板操作，方便快捷

## 🏗️ 项目结构

```
dev-toolbox/
├── electron/           # Electron主进程文件
│   ├── main.ts        # 主进程入口
│   └── preload.ts     # 预加载脚本
├── src/               # 源代码目录
│   ├── views/         # 各个工具页面
│   ├── components/    # 公共组件
│   ├── stores/        # 状态管理
│   ├── utils/         # 工具函数
│   └── types/         # TypeScript类型定义
├── dist/              # 构建输出目录
└── package.json       # 项目配置
```

## 🎯 开发计划

- [ ] 添加更多实用工具（如正则表达式测试、颜色转换等）
- [ ] 支持自定义工具扩展
- [ ] 添加工具使用历史记录
- [ ] 支持批量操作
- [ ] 优化性能和用户体验

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙋‍♂️ 联系方式

如有问题或建议，欢迎通过以下方式联系：
- GitHub Issues: [创建Issue](https://github.com/lwj1989/dev-toolbox/issues)

---

⭐ 如果这个项目对你有帮助，请给个Star支持一下！
# 贡献指南

感谢您对 Dev Toolbox 项目的关注！我们欢迎各种形式的贡献，包括但不限于：

- 🐛 Bug 报告
- 💡 功能建议
- 📝 文档改进
- 🔧 代码贡献
- 🌍 国际化翻译

## 🚀 快速开始

### 开发环境准备

1. **环境要求**
   - Node.js 18+
   - npm 9+
   - Git

2. **克隆项目**
   ```bash
   git clone https://github.com/your-username/dev-toolbox.git
   cd dev-toolbox
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **启动开发服务器**
   ```bash
   npm run dev          # Web 开发模式
   ```

### 项目结构

```
dev-toolbox/
├── src/               # Vue 应用源码
│   ├── components/    # 可复用组件
│   ├── stores/        # 状态管理
│   ├── types/         # TypeScript 类型定义
│   ├── utils/         # 工具函数
│   ├── views/         # 页面组件（工具页面）
│   ├── App.vue        # 根组件
│   └── main.ts        # 应用入口
├── public/            # 静态资源
└── dist/              # 构建输出
```

## 🐛 报告 Bug

在报告 Bug 之前，请：

1. 搜索 [已有 Issues](../../issues) 确认问题未被报告
2. 尝试使用最新版本重现问题
3. 准备详细的重现步骤

### Bug 报告模板

```markdown
**Bug 描述**
简洁明了地描述遇到的问题。

**重现步骤**
1. 进入 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

**预期行为**
描述您期望发生的情况。

**实际行为**
描述实际发生的情况。

**环境信息**
- 操作系统: [e.g. macOS 14.0]
- 应用版本: [e.g. 1.0.0]
- Node.js 版本: [e.g. 18.17.0]

**附加信息**
添加任何其他可能有助于解决问题的信息，如截图、日志等。
```

## 💡 功能建议

我们非常欢迎新功能建议！请：

1. 检查是否已有类似建议
2. 详细描述功能需求和使用场景
3. 说明该功能如何提升用户体验

### 功能建议模板

```markdown
**功能描述**
清晰描述您希望添加的功能。

**使用场景**
描述什么情况下会使用此功能。

**解决方案**
详细描述您希望的实现方式。

**替代方案**
描述您考虑过的其他解决方案。

**优先级**
- [ ] 高（重要且紧急）
- [ ] 中（重要但不紧急）
- [ ] 低（有用但非必需）
```

## 🔧 代码贡献

### 开发流程

1. **Fork 项目**
   点击页面右上角的 "Fork" 按钮

2. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **进行开发**
   - 遵循现有代码风格
   - 添加必要的注释
   - 确保代码质量

4. **测试更改**
   ```bash
   npm run dev          # 测试开发版本
   npm run build        # 测试构建
   npm run preview      # 预览构建结果
   ```

5. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加新功能描述"
   ```

6. **推送到 Fork 仓库**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**
   从您的 Fork 仓库向主仓库创建 PR

### 代码风格

- **语言**: 使用 TypeScript，代码注释使用中文
- **格式**: 遵循项目现有的格式约定
- **命名**: 使用有意义的变量和函数名
- **组件**: Vue 组件使用 Composition API
- **样式**: 使用 TailwindCSS，避免自定义 CSS

### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<类型>[可选的作用域]: <描述>

[可选的正文]

[可选的脚注]
```

**类型**：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构代码
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**示例**：
```
feat(json): 添加 JSONPath 查询功能

- 支持复杂路径查询
- 添加查询结果高亮
- 优化查询性能

Closes #123
```

## 🛠️ 添加新工具

如果您想添加新的开发工具：

1. **在 `src/views/` 中创建新组件**
   ```vue
   <template>
     <!-- 工具界面 -->
   </template>

   <script setup lang="ts">
   // 工具逻辑
   </script>
   ```

2. **在 `src/utils/modules.ts` 中注册工具**
   ```typescript
   {
     name: '工具名称',
     description: '工具描述',
     icon: 'lucide-icon-name',
     route: '/tool-route',
     component: () => import('@/views/YourTool.vue')
   }
   ```

3. **添加路由配置**
   确保在 `src/main.ts` 中正确配置路由

4. **遵循设计规范**
   - 使用统一的布局和样式
   - 提供清晰的使用说明
   - 添加必要的快捷操作按钮

## 🌍 国际化

目前项目支持中文和英文，我们欢迎更多语言的翻译：

1. 复制 `README.md` 并翻译为目标语言
2. 在界面文本中添加国际化支持
3. 更新语言切换功能

## 📝 文档贡献

文档改进包括：

- README 文件优化
- 代码注释完善
- 使用指南补充
- API 文档编写

## 🧪 测试

虽然项目目前没有自动化测试，但我们鼓励：

- 手动测试所有功能
- 在多个平台上验证
- 测试边界情况和错误处理

## 📦 发布流程

项目维护者会定期发布新版本：

1. 更新版本号
2. 生成 CHANGELOG
3. 创建 Release Tag
4. 自动构建和发布

## ❓ 需要帮助？

如果您在贡献过程中遇到问题：

- 查看现有 [Issues](../../issues) 和 [Discussions](../../discussions)
- 创建新的 Discussion 提问
- 联系项目维护者

## 🎉 贡献者

感谢所有为项目做出贡献的开发者！

<!-- 此处会自动生成贡献者列表 -->

---

再次感谢您的贡献！每一个 Issue、PR 和建议都让 Dev Toolbox 变得更好。

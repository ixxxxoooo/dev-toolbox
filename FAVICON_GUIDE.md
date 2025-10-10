# Favicon 和 Logo 使用指南

## 文件说明

### Logo 文件
- `public/logo.svg` - 高分辨率 SVG logo (512x512)
- `public/favicon.svg` - Favicon SVG 版本 (128x128，优化用于小尺寸显示)

### 如何生成 PNG Favicon

1. 在浏览器中打开 `generate-favicon.html`
2. 页面会自动生成多个尺寸的预览图
3. 点击"下载所有尺寸"按钮，或单独下载需要的尺寸
4. 将生成的 PNG 文件放入 `public` 目录

推荐生成的尺寸：
- 16x16 - 浏览器标签页小图标
- 32x32 - 标准 favicon
- 48x48 - Windows 任务栏
- 180x180 - iOS Safari
- 192x192 - Android Chrome
- 512x512 - PWA 大图标

### 更新 favicon.ico

如果需要生成 `.ico` 文件（支持旧浏览器）：

1. 访问在线工具如 https://www.favicon-generator.org/
2. 上传 `public/favicon.svg` 或生成的 PNG 文件
3. 下载生成的 `favicon.ico`
4. 替换 `public/favicon.ico`

## 图标设计说明

### 设计元素
- **工具箱**: 代表开发者工具集合
- **扳手、螺丝刀、齿轮**: 代表不同的开发工具
- **代码符号 `</>`**: 强调开发者属性
- **渐变色**: 蓝色到紫色，现代化设计

### 颜色方案
- 主色: `#3b82f6` (蓝色)
- 副色: `#8b5cf6` (紫色)
- 强调色: `#6366f1` (靛蓝)
- 背景: 白色，透明度 95%

## 浏览器支持

### SVG Favicon
- Chrome 80+
- Firefox 41+
- Safari 9+
- Edge 79+

### 传统 ICO
- 所有浏览器（包括 IE）

## 移动设备优化

### iOS
```html
<link rel="apple-touch-icon" href="/logo.svg" />
```

### Android
在 `manifest.json` 中配置（如果需要 PWA）：
```json
{
  "icons": [
    {
      "src": "/favicon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/favicon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 测试

1. 启动开发服务器: `npm run dev`
2. 在浏览器中打开应用
3. 检查浏览器标签页是否显示图标
4. 将网站添加到收藏夹，确认图标显示正确
5. 在不同设备上测试（手机、平板）

## 当前配置

在 `index.html` 中已配置：
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="alternate icon" type="image/x-icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/logo.svg" />
<meta name="theme-color" content="#3b82f6" />
```

这个配置确保：
- 现代浏览器使用 SVG favicon（清晰、可缩放）
- 旧浏览器回退到 ICO 格式
- iOS 设备使用 logo.svg 作为主屏幕图标
- 主题色匹配应用设计

## 清理临时文件

生成 favicon 后，可以删除：
- `generate-favicon.html` （用于生成 PNG 文件的工具页面）
- `FAVICON_GUIDE.md` （本文档，如果不需要参考）

但建议保留 SVG 源文件以便将来修改。


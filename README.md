# Dev Toolbox

<div align="center">

![Dev Toolbox Logo](public/favicon.ico)

**A Modern Desktop Application with Essential Developer Tools**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Electron](https://img.shields.io/badge/Electron-31+-blue.svg)](https://electronjs.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3-green.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)

English | [简体中文](README_ZH.md)

</div>

## 🚀 Features

### Core Tools

- 📝 **Text Diff Tool** - Monaco Editor based, supports side-by-side/inline comparison, syntax highlighting, difference navigation
- 🔤 **Base64 Encoder/Decoder** - Standard and URL-safe modes, file processing, real-time conversion
- 📄 **JSON Toolkit** - Format, minify, validate, JSON↔YAML↔XML conversion, JSONPath query, tree view
- 🔗 **URL Encoder/Decoder** - Multiple encoding modes, real-time processing
- ⏰ **Smart Timestamp Converter** - Intelligent recognition of multiple time formats, standard format output
- 🔑 **UUID Generator** - Generate standard UUID v4
- 📊 **Text Analyzer** - Real-time statistics for characters, lines, paragraphs
- 🔒 **Hash Generator** - Support MD5, SHA series algorithms
- 🗃️ **SQL Formatter** - Multi-database SQL beautification tool
- 🔐 **Password Generator** - Multiple password types with security strength analysis

### Product Highlights

✨ **Modern Interface** - Monaco Editor based, professional code editing experience
🎨 **Unified Design** - Consistent UI/UX design, smooth interaction experience
🌙 **Dark Mode** - System adaptive theme, eye-friendly
⚡ **High Performance** - Real-time processing, responsive
💾 **Data Persistence** - Auto-save user settings and history
🖥️ **Cross Platform** - Support macOS, Windows, Linux

## 📸 Preview

![Dev Toolbox Interface](https://via.placeholder.com/800x500?text=Dev+Toolbox+Screenshot)

> Note: Please add actual application screenshots

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 + TypeScript
- **Build Tool**: Vite 5
- **Desktop Framework**: Electron 31
- **UI Framework**: TailwindCSS 3
- **Editor**: Monaco Editor (VS Code Core)
- **State Management**: Pinia
- **Utilities**: dayjs, crypto-js, js-yaml, xml-js, etc.

## 📦 Installation & Usage

### Pre-built Releases (Recommended)

Download the installer for your platform from [Releases](../../releases):

- **macOS**: `Dev-Toolbox-x.x.x.dmg` (Intel & Apple Silicon supported)
- **Windows**: `Dev-Toolbox-Setup-x.x.x.exe`
- **Linux**: `Dev-Toolbox-x.x.x.AppImage`

### Build from Source

#### Requirements

- Node.js 18+
- npm 9+

#### Clone Repository

```bash
git clone https://github.com/your-username/dev-toolbox.git
cd dev-toolbox
```

#### Install Dependencies

```bash
npm install
```

#### Development Mode

```bash
# Web development mode
npm run dev

# Electron development mode
npm run electron:dev
```

#### Build Application

```bash
# Build for all platforms
npm run build

# Platform-specific builds
npm run build:mac     # macOS
npm run build:win     # Windows
npm run build:linux   # Linux
```

#### Web Version Deployment

```bash
# Build web version
npm run build:web

# Preview build result
npm run preview
```

## 🎯 Usage Guide

### Launch Application

1. Download and install the installer for your platform
2. Launch Dev Toolbox
3. Select the tool you need from the main interface
4. Enjoy efficient development experience

### Keyboard Shortcuts

- `Cmd/Ctrl + V`: Paste text
- `Cmd/Ctrl + C`: Copy result
- `Cmd/Ctrl + A`: Select all
- `Cmd/Ctrl + Z`: Undo
- `Cmd/Ctrl + Shift + Z`: Redo

### Tool Instructions

Each tool page provides detailed usage instructions and examples. Click the "?" icon to view help information.

## 🌐 Online Experience

You can also experience Dev Toolbox directly through your browser:

- **Official Online Version**: [https://dev-toolbox.vercel.app](https://dev-toolbox.vercel.app)

> The online version includes full functionality, but file operations may be limited by browser restrictions

## 🤝 Contributing

We welcome contributions of any kind! Please see [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start Contributing

1. Fork this repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create Pull Request

### Report Issues

If you find bugs or have feature suggestions:

1. Check [existing Issues](../../issues) to ensure the issue hasn't been reported
2. Create a new issue using appropriate [Issue templates](../../issues/new/choose)
3. Provide detailed reproduction steps and environment information

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version update details.

### Latest Version Highlights

- ✨ New Monaco Editor integration
- 🎨 Unified UI/UX design
- 🚀 Performance optimization and stability improvements
- 🛠️ Added multiple practical tools

## 📄 License

This project is open source under [MIT License](LICENSE).

## 🙏 Acknowledgments

Thanks to the following open source projects:

- [Vue.js](https://vuejs.org/) - Progressive JavaScript Framework
- [Electron](https://electronjs.org/) - Cross-platform Desktop Application Framework
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Powerful Code Editor
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS Framework
- [Vite](https://vitejs.dev/) - Fast Build Tool

## 📞 Support

If you like this project, please consider:

- ⭐ Star the project
- 🐛 Report issues and suggestions
- 🔧 Contribute code
- 📢 Recommend to other developers

---

<div align="center">

**Make Development More Efficient, Make Tools Better**

</div>

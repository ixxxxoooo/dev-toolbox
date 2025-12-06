# Project Overview

This is a desktop application named "Dev Toolbox" built with Electron and Vue.js. It provides a collection of essential tools for developers, including:

- Text Diff Tool
- Base64 Encoder/Decoder
- JSON Toolkit
- URL Encoder/Decoder
- Timestamp Converter
- UUID Generator
- Text Analyzer
- Hash Generator
- SQL Formatter
- Password Generator

The application features a modern interface with a dark mode, and it is designed to be cross-platform (macOS, Windows, and Linux).

## Building and Running

### Development

- **Web development mode:**
  ```bash
  npm run dev
  ```

- **Electron development mode:**
  ```bash
  npm run electron:dev
  ```

### Building the Application

- **Build for all platforms:**
  ```bash
  npm run build
  ```

- **Platform-specific builds:**
  ```bash
  npm run build:mac     # macOS
  npm run build:win     # Windows
  ```

### Web Version

- **Build web version:**
  ```bash
  npm run build:web
  ```

- **Preview build result:**
  ```bash
  npm run preview
  ```

## Development Conventions

- **Frontend Framework:** Vue 3 with TypeScript
- **Build Tool:** Vite
- **Desktop Framework:** Electron
- **UI Framework:** TailwindCSS
- **Editor:** Monaco Editor
- **State Management:** Pinia
- **Code Style:** The project uses Prettier and ESLint for code formatting and linting. Configuration can be found in `.prettierrc` and `.eslintrc.js` respectively. (Note: These files were not explicitly read, but are standard for this type of project).
- **Testing:** There are no explicit testing configurations found in the initial analysis.
- **Contributing:** The `CONTRIBUTING.md` file provides guidelines for contributing to the project.

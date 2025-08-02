# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development Mode
```bash
npm run dev                 # Start Vite web development server on port 3000
npm run electron:dev        # Build and start Electron app in development mode
```

### Building
```bash
npm run build              # Full build with TypeScript compilation + Electron Builder for all platforms
npm run build:mac          # Build for macOS (DMG) - supports x64 and arm64
npm run build:win          # Build for Windows (NSIS installer) - x64 only
npm run build:linux        # Build for Linux (AppImage) - x64 only
```

### Type Checking and Linting
```bash
vue-tsc                    # TypeScript type checking (run before builds)
npx tsc -p tsconfig.node.json  # Compile Electron main process TypeScript
```

## Architecture Overview

This is an Electron + Vue 3 + TypeScript desktop application providing developer tools like text diff, Base64 encoding, JSON formatting, etc.

### Key Architecture Patterns

**Electron Process Structure:**
- Main process: `electron/main.ts` - Window management, IPC handlers, menus, clipboard operations
- Preload script: `electron/preload.ts` - Secure bridge between main and renderer processes  
- Renderer process: Vue 3 SPA with hash routing

**Vue Application Structure:**
- Router-based SPA using `createWebHashHistory()` (required for Electron file:// protocol)
- Tool modules defined in `src/utils/modules.ts` with metadata (name, description, icon, route)
- Individual tool views in `src/views/` directory (10 tools: Diff, Base64, JSON, URL, Timestamp, UUID, TextAnalyzer, HashGenerator, SqlFormatter, PasswordGenerator)
- Centralized theme management via `src/stores/theme.ts` using Pinia

**Build Process:**
1. Vue build with Vite → `dist/`
2. TypeScript compilation for Electron → `dist-electron/`
3. File renaming: `.js` → `.cjs` for Electron compatibility
4. Electron Builder packaging

### Critical Dependencies
- **monaco-editor**: Core editor component used across multiple tools
- **electron-store**: Persistent data storage
- **dayjs**: Date/time handling in Timestamp tool
- **crypto-js**: Hash generation
- **js-yaml, xml-js**: Data format conversion in JSON tool
- **diff-match-patch**: Text comparison algorithm
- **sql-formatter**: SQL formatting and beautification with multi-database support

### IPC Communication Patterns
Main process exposes secure APIs via preload script:
- `electronStore`: get/set/delete operations
- `clipboard`: read/write text operations

### File Structure Notes
- `src/types/index.ts`: TypeScript definitions for ToolModule interface
- `src/components/`: Reusable components (JsonTreeView, ToolSwitcher, etc.)
- `src/components/ToolSwitcher.vue`: Enhanced with hover tooltips for tool descriptions
- Alias `@/` maps to `src/` directory
- Icon file: `src/icon.icns` used for all platforms

### Recent Updates
- **ToolSwitcher Component**: Added hover tooltips showing tool descriptions for better UX
- **SQL Formatter**: Added proper Database icon from lucide-vue-next
- **UUID Generator**: Improved UX by moving copy button next to the UUID input field
- **Password Generator**: New comprehensive tool with industry best practices:
  - Multiple password types: Strong, Readable, PIN, Memorable
  - Configurable options for each type
  - Real-time strength analysis with entropy calculation
  - Security recommendations and crack time estimation
  - Cryptographically secure random generation using Web Crypto API

### Development Environment
- Vite dev server runs on port 3000 (strict port)
- Electron loads from localhost:3000 in dev, file:// in production
- TypeScript strict mode enabled with unused parameter/variable checks
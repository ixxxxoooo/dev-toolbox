import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'
import { cpSync, readFileSync, existsSync } from 'fs'

const excalidrawVersion = JSON.parse(
  readFileSync(resolve(__dirname, 'node_modules/@excalidraw/excalidraw/package.json'), 'utf-8')
).version as string

// 构建时把 Excalidraw 字体拷贝到 dist/excalidraw-assets/fonts，实现字体自托管。
// 跳过 Xiaolai（中文手写体，约 12MB），该字体回退到 CDN 按需加载。
const excalidrawFonts = () => ({
  name: 'excalidraw-fonts',
  apply: 'build' as const,
  writeBundle() {
    const src = resolve(__dirname, 'node_modules/@excalidraw/excalidraw/dist/prod/fonts')
    if (!existsSync(src)) return
    cpSync(src, resolve(__dirname, 'dist/excalidraw-assets/fonts'), {
      recursive: true,
      filter: (p) => !p.includes('/Xiaolai')
    })
  }
})

export default defineConfig({
  define: {
    __EXCALIDRAW_VERSION__: JSON.stringify(excalidrawVersion)
  },
  plugins: [
    vue(),
    excalidrawFonts(),
    VitePWA({
      // prompt：新版本安装后进入 waiting，由 main.ts 提示用户并在确认后刷新
      registerType: 'prompt',
      injectRegister: false,
      // 开发环境配置
      devOptions: {
        enabled: false,
        type: 'module'
      },
      // 显式包含公共资源，确保它们被预缓存
      includeAssets: ['favicon.ico', 'favicon.svg', 'logo.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
      workbox: {
        // 预缓存所有静态资源
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf}'],
        // 排除特别大的文件从预缓存（它们会在运行时缓存）
        globIgnores: ['**/monaco-*.js', 'excalidraw-assets/**'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
        // 确保离线时能正常导航
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//],
        // 清理旧版本缓存
        cleanupOutdatedCaches: true,
        // 不设置 skipWaiting / clientsClaim：由用户确认更新后才激活新 SW（见 registerSW 的 updateSW(true)）
        runtimeCaching: [
          {
            // 缓存大型 JS 文件（Monaco、workers 等）- 运行时缓存
            urlPattern: /\/assets\/(monaco|editor\.worker|json\.worker)-.*\.js$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'large-assets-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 天
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // 缓存所有其他 assets 目录的资源
            urlPattern: /\/assets\/.*\.(js|css|woff|woff2|ttf)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 年
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Excalidraw 自托管字体：不进预缓存，按需运行时缓存
            urlPattern: /\/excalidraw-assets\/.*\.woff2$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'excalidraw-fonts-cache',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            // 缓存图片资源
            urlPattern: /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 天
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Dev Toolbox',
        short_name: 'DevToolbox',
        description: '集成常用开发者工具的 Web 应用',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // 用函数形式按路径分包：数组形式的 'monaco-editor' 会解析到完整入口（editor.main），
        // 把已精简掉的语言又全部拉回来；这里只把实际被引用到的 monaco 模块归入 monaco chunk
        manualChunks(id: string) {
          if (id.includes('/node_modules/monaco-editor/')) return 'monaco'
          if (/\/node_modules\/(vue|vue-router|pinia|@vue)\//.test(id)) return 'vendor'
          if (id.includes('/node_modules/dayjs/')) return 'utils'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    strictPort: true
  },
  clearScreen: false
})
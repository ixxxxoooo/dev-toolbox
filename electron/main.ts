/// <reference types="node" />
/// <reference types="electron" />

import { app, BrowserWindow, ipcMain, Menu, clipboard, MenuItemConstructorOptions, Event, ContextMenuParams } from 'electron'
import path from 'path'
import Store from 'electron-store'

// 手动声明 electron-store 类型以解决类型定义问题
const store = new Store<Record<string, any>>() as any
const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 12, y: 12 },
    show: false,
    icon: isDev ? path.join(__dirname, '../src/icon.icns') : undefined
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 添加右键上下文菜单
  mainWindow.webContents.on('context-menu', (event: Event, params: ContextMenuParams) => {
    const texts = getMenuTexts()
    const contextMenu = Menu.buildFromTemplate([
      {
        label: texts.undo,
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo',
        enabled: params.editFlags.canUndo
      },
      {
        label: texts.redo,
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo',
        enabled: params.editFlags.canRedo
      },
      { type: 'separator' },
      {
        label: texts.cut,
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
        enabled: params.editFlags.canCut
      },
      {
        label: texts.copy,
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
        enabled: params.editFlags.canCopy
      },
      {
        label: texts.paste,
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
        enabled: params.editFlags.canPaste
      },
      { type: 'separator' },
      {
        label: texts.selectAll,
        accelerator: 'CmdOrCtrl+A',
        role: 'selectAll',
        enabled: params.editFlags.canSelectAll
      }
    ] as MenuItemConstructorOptions[])

    contextMenu.popup({
      window: mainWindow!,
      x: params.x,
      y: params.y
    })
  })
}

app.whenReady().then(() => {
  createMenu()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC 通信处理
ipcMain.handle('store-get', (_: Electron.IpcMainInvokeEvent, key: string) => {
  return store.get(key)
})

ipcMain.handle('store-set', (_: Electron.IpcMainInvokeEvent, key: string, value: any) => {
  store.set(key, value)
})

ipcMain.handle('store-delete', (_: Electron.IpcMainInvokeEvent, key: string) => {
  store.delete(key)
})

// 剪贴板操作处理
ipcMain.handle('clipboard-write', (_: Electron.IpcMainInvokeEvent, text: string) => {
  clipboard.writeText(text)
})

ipcMain.handle('clipboard-read', () => {
  return clipboard.readText()
})

// 菜单本地化文本
const getMenuTexts = () => {
  // 简单的语言检测，基于系统语言
  const locale = app.getLocale().toLowerCase()
  const isZh = locale.startsWith('zh')

  return {
    appName: 'Dev Toolbox',
    about: isZh ? '关于 Dev Toolbox' : 'About Dev Toolbox',
    services: isZh ? '服务' : 'Services',
    hide: isZh ? '隐藏 Dev Toolbox' : 'Hide Dev Toolbox',
    hideOthers: isZh ? '隐藏其他' : 'Hide Others',
    showAll: isZh ? '显示全部' : 'Show All',
    quit: isZh ? '退出' : 'Quit',
    edit: isZh ? '编辑' : 'Edit',
    undo: isZh ? '撤销' : 'Undo',
    redo: isZh ? '重做' : 'Redo',
    cut: isZh ? '剪切' : 'Cut',
    copy: isZh ? '复制' : 'Copy',
    paste: isZh ? '粘贴' : 'Paste',
    selectAll: isZh ? '全选' : 'Select All',
    view: isZh ? '视图' : 'View',
    reload: isZh ? '重新加载' : 'Reload',
    forceReload: isZh ? '强制重新加载' : 'Force Reload',
    devTools: isZh ? '开发者工具' : 'Developer Tools',
    actualSize: isZh ? '实际大小' : 'Actual Size',
    zoomIn: isZh ? '放大' : 'Zoom In',
    zoomOut: isZh ? '缩小' : 'Zoom Out',
    fullscreen: isZh ? '全屏' : 'Toggle Fullscreen',
    window: isZh ? '窗口' : 'Window',
    minimize: isZh ? '最小化' : 'Minimize',
    close: isZh ? '关闭' : 'Close',
    zoom: isZh ? '缩放' : 'Zoom',
    front: isZh ? '前置所有窗口' : 'Bring All to Front',
    help: isZh ? '帮助' : 'Help',
    learnMore: isZh ? '学习更多' : 'Learn More'
  }
}

// 创建应用菜单
const createMenu = () => {
  const texts = getMenuTexts()
  const template: MenuItemConstructorOptions[] = [
    {
      label: texts.appName,
      submenu: [
        {
          label: texts.about,
          role: 'about'
        },
        { type: 'separator' },
        {
          label: texts.services,
          role: 'services',
          submenu: []
        },
        { type: 'separator' },
        {
          label: texts.hide,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: texts.hideOthers,
          accelerator: 'Command+Alt+H',
          role: 'hideOthers'
        },
        {
          label: texts.showAll,
          role: 'unhide'
        },
        { type: 'separator' },
        {
          label: texts.quit,
          accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: texts.edit,
      submenu: [
        {
          label: texts.undo,
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: texts.redo,
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        { type: 'separator' },
        {
          label: texts.cut,
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: texts.copy,
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: texts.paste,
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: texts.selectAll,
          accelerator: 'CmdOrCtrl+A',
          role: 'selectAll'
        }
      ]
    },
    {
      label: texts.view,
      submenu: [
        {
          label: texts.reload,
          accelerator: 'CmdOrCtrl+R',
          click: (item, focusedWindow) => {
          if (focusedWindow) (focusedWindow as BrowserWindow).webContents.reload()
        }
        },
        {
          label: texts.forceReload,
          accelerator: 'CmdOrCtrl+Shift+R',
          click: (item, focusedWindow) => {
          if (focusedWindow) (focusedWindow as BrowserWindow).webContents.reloadIgnoringCache()
        }
        },
        {
          label: texts.devTools,
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click: (item, focusedWindow) => {
          if (focusedWindow) (focusedWindow as BrowserWindow).webContents.toggleDevTools()
        }
        },
        { type: 'separator' },
        {
          label: texts.actualSize,
          accelerator: 'CmdOrCtrl+0',
          role: 'resetZoom'
        },
        {
          label: texts.zoomIn,
          accelerator: 'CmdOrCtrl+Plus',
          role: 'zoomIn'
        },
        {
          label: texts.zoomOut,
          accelerator: 'CmdOrCtrl+-',
          role: 'zoomOut'
        },
        { type: 'separator' },
        {
          label: texts.fullscreen,
          accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
          role: 'togglefullscreen'
        }
      ]
    },
    {
      label: texts.window,
      submenu: [
        {
          label: texts.minimize,
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: texts.close,
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }
      ]
    },
    {
      label: texts.help,
      submenu: [
        {
          label: texts.learnMore,
          click: () => {
            // 可以在这里添加帮助链接
          }
        }
      ]
    }
  ]

  // macOS 特定的菜单调整
  if (process.platform === 'darwin') {
    // 在 macOS 上，第一个菜单项是应用名称
    template[0].label = app.getName()

    // 窗口菜单
    template[3].submenu = [
      {
        label: texts.close,
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
      {
        label: texts.minimize,
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: texts.zoom,
        role: 'zoom'
      },
      { type: 'separator' },
      {
        label: texts.front,
        role: 'front'
      }
    ]
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
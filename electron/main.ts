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
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '撤销',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo',
        enabled: params.editFlags.canUndo
      },
      {
        label: '重做',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo',
        enabled: params.editFlags.canRedo
      },
      { type: 'separator' },
      {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
        enabled: params.editFlags.canCut
      },
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
        enabled: params.editFlags.canCopy
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
        enabled: params.editFlags.canPaste
      },
      { type: 'separator' },
      {
        label: '全选',
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

// 创建应用菜单
const createMenu = () => {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'Dev Toolbox',
      submenu: [
        {
          label: '关于 Dev Toolbox',
          role: 'about'
        },
        { type: 'separator' },
        {
          label: '服务',
          role: 'services',
          submenu: []
        },
        { type: 'separator' },
        {
          label: '隐藏 Dev Toolbox',
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: '隐藏其他',
          accelerator: 'Command+Alt+H',
          role: 'hideOthers' // 修正大小写
        },
        {
          label: '显示全部',
          role: 'unhide'
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        {
          label: '撤销',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: '重做',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        { type: 'separator' },
        {
          label: '剪切',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: '复制',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: '粘贴',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: '全选',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectAll'
        }
      ]
    },
    {
      label: '视图',
      submenu: [
        {
          label: '重新加载',
          accelerator: 'CmdOrCtrl+R',
          click: (item, focusedWindow) => {
          if (focusedWindow) (focusedWindow as BrowserWindow).webContents.reload() // 修正
        }
        },
        {
          label: '强制重新加载',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: (item, focusedWindow) => {
          if (focusedWindow) (focusedWindow as BrowserWindow).webContents.reloadIgnoringCache() // 修正
        }
        },
        {
          label: '开发者工具',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click: (item, focusedWindow) => {
          if (focusedWindow) (focusedWindow as BrowserWindow).webContents.toggleDevTools() // 修正
        }
        },
        { type: 'separator' },
        {
          label: '实际大小',
          accelerator: 'CmdOrCtrl+0',
          role: 'resetZoom' // 修正大小写
        },
        {
          label: '放大',
          accelerator: 'CmdOrCtrl+Plus',
          role: 'zoomIn' // 修正大小写
        },
        {
          label: '缩小',
          accelerator: 'CmdOrCtrl+-',
          role: 'zoomOut' // 修正大小写
        },
        { type: 'separator' },
        {
          label: '全屏',
          accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
          role: 'togglefullscreen'
        }
      ]
    },
    {
      label: '窗口',
      submenu: [
        {
          label: '最小化',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: '关闭',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '学习更多',
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
        label: '关闭',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
      {
        label: '最小化',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: '缩放',
        role: 'zoom'
      },
      { type: 'separator' },
      {
        label: '前置所有窗口',
        role: 'front'
      }
    ]
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
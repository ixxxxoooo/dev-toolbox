import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  store: {
    get: (key: string) => ipcRenderer.invoke('store-get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('store-set', key, value),
    delete: (key: string) => ipcRenderer.invoke('store-delete', key)
  },
  clipboard: {
    write: (text: string) => ipcRenderer.invoke('clipboard-write', text),
    read: () => ipcRenderer.invoke('clipboard-read')
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

declare global {
  interface Window {
    electronAPI: typeof electronAPI
  }
}
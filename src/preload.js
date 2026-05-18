const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('open-file-dialog'),
  saveFile: (data) => ipcRenderer.invoke('save-file-dialog', data)
})

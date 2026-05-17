const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('open-file-dialog'),
  saveCSV: (data) => ipcRenderer.invoke('save-csv-dialog', data)
})

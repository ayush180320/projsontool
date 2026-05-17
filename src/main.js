const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('path')
const fs = require('fs')

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'JSON Studio Pro',
    backgroundColor: '#07070f',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/icon.png')
  })

  win.loadFile(path.join(__dirname, 'index.html'))

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

ipcMain.handle('open-file-dialog', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Open JSON File',
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
    properties: ['openFile']
  })
  if (canceled || !filePaths.length) return null
  try {
    const content = fs.readFileSync(filePaths[0], 'utf-8')
    return { path: filePaths[0], name: path.basename(filePaths[0]), content }
  } catch (e) {
    return { error: e.message }
  }
})

ipcMain.handle('save-csv-dialog', async (event, { csvContent, defaultName }) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Save CSV File',
    defaultPath: defaultName || 'export.csv',
    filters: [{ name: 'CSV Files', extensions: ['csv'] }]
  })
  if (canceled || !filePath) return { canceled: true }
  try {
    fs.writeFileSync(filePath, csvContent, 'utf-8')
    return { success: true, filePath }
  } catch (e) {
    return { error: e.message }
  }
})

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

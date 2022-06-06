const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron');
const remote = require('@electron/remote/main');
const path = require('path');
const { readFileSync } = require('original-fs');

remote.initialize();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.resolve(__dirname, './preload.js')
    }
  })

  win.loadURL('http://localhost:3000');

  remote.enable(win.webContents);
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  if(process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function() {
  if(BrowserWindow.getAllWindows().length === 0) createWindow();
})

// ipc communication
ipcMain.on('CHANNEL_NAME', (evt, payload) => {
  console.log(payload);
  (async () => {
    const validator = require('html-validator')
    const options = {
      url: 'http://google.com',
      format: 'text',
      // data: readFileSync('./index.html', 'utf8')
    }
    
    try {
      const result = await validator(options)
      console.log(result)
    } catch (error) {
      console.error(error)
    }
  })()
  evt.reply('IPC_RENDERER_CHANNEL_NAME', 'message');
})

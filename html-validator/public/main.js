const { app, BrowserWindow, shell } = require('electron');
const { ipcMain } = require('electron');
const remote = require('@electron/remote/main');
const path = require('path');
const { readFileSync } = require('original-fs');
const fs = require('fs');
const { execFile } = require('child_process');
const vnu = require('vnu-jar');

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

app.on('ready', function() {
  createWindow();
  const homedir = require('os').homedir();
  const homeDirList = fs.readdir(homedir, function(err, data) {
    console.log(data);
  })
  console.log(homeDirList);
});

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

  evt.reply('IPC_RENDERER_CHANNEL_NAME', 'message');
  fs.readdir('./public', function(err, data) {
    console.log(data);
  })
  const currentDir = __dirname;
  const test = path.join(currentDir, '/test.html');

  console.log('hi its vnu', vnu);

  // Work with vnu.jar, for example get vnu.jar version
  execFile('java', ['-jar', `"${vnu}"`, test], { shell: true }, (error, stdout) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log('실행이 됬다', stdout);
    console.log(stdout);
  });
})
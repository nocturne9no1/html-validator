const { app, BrowserWindow, shell } = require('electron');
const { ipcMain } = require('electron');
const remote = require('@electron/remote/main');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');
const vnu = require('vnu-jar');
const isDev = require("electron-is-dev");

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
  win.openDevTools();
  win.loadURL(
    isDev
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, "../build/index.html")}`
  );
  
  // remote.enable(win.webContents);
}

app.on('ready', function() {
  createWindow();

});

app.on('window-all-closed', function() {
  if(process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function() {
  if(BrowserWindow.getAllWindows().length === 0) createWindow();

})


// file explorer
const homedir = require('os').homedir().split(path.sep);
let nowLocation = [...homedir];

ipcMain.on('SET_FILE_LIST', (evt, payload) => {
  // 앱 실행 시 홈 화면에서 시작
  console.log('payload: ' + payload);
  console.log('now_loca: ' + nowLocation);
  // const now = path.join(nowLocation);
  if (payload !== 'init_folder_list') nowLocation = [...payload];
  const now = path.join(...nowLocation);
  console.log(now);
  fs.readdir(now, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      // console.log(data)
      // data.forEach(el => console.log(path.extname(el)))
      const onlyFolderHTML = data.filter(el => !/^\./.test(el) && path.extname(el) === '' || path.extname(el) === '.html');
      const sendingData = {
        data: onlyFolderHTML,
        now: now.split(path.sep)
      }
      evt.reply('SET_FILE_LIST_REPLY', sendingData);
    }
  })
});

ipcMain.on('VALIDATE_FILE', (evt, payload) => {
  const filePath = path.join(...payload);
  console.log(filePath);
  execFile('java', ['-jar', `"${vnu}"`, filePath], { shell: true }, (error, stdout) => {
    if (error) {
        // console.error(`exec error: ${error}`);
        evt.reply('SEND_VALI_RESULT', error);
        return;
    }
    console.log(stdout);
  });
})
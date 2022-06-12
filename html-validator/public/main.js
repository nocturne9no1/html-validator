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
  win.openDevTools();
  win.loadURL('http://localhost:3000');
  
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

// ipc communication
ipcMain.on('CHANNEL_NAME', (evt, payload) => {
  console.log(payload);

  evt.reply('IPC_RENDERER_CHANNEL_NAME', 'message');
  fs.readdir('./public', function(err, data) {
    console.log(data);
  })
  const currentDir = __dirname;
  const test = path.join(currentDir, '/test.html');

  // html validator 실행 코드
  /**
   * 2번째 인수 Array 배열 2번 인덱스
   * @param {string} 파일 주소
  */
  // execFile('java', ['-jar', `"${vnu}"`, test], { shell: true }, (error, stdout) => {
  //   if (error) {
  //       console.error(`exec error: ${error}`);
  //       return;
  //   }
  //   console.log('실행이 됬다', stdout);
  //   console.log(stdout);
  // });
})

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
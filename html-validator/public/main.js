const { app, BrowserWindow, shell } = require('electron');
const { ipcMain } = require('electron');
const remote = require('@electron/remote/main');
const path = require('path');
const fs = require('fs');
const { execFile, spawn } = require('child_process');
const vnu = require('vnu-jar');
const isDev = require("electron-is-dev");
const JVM = require('node-jvm');

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
    :  `file://${path.join(__dirname, "../build/index.html")}`
  );
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
const nowOS = require('os').type();
console.log(nowOS);
let nowLocation = [...homedir];
// nowLocation.forEach(e => console.log('hh: ' + e))
ipcMain.on('SET_FILE_LIST', (evt, payload) => {
  // 앱 실행 시 홈 화면에서 시작
  // console.log('payload: ' + payload);
  // console.log('now_loca: ' + nowLocation);
  if (payload !== 'init_folder_list') nowLocation = [...payload];
  // 맥 os 에서 첫 '/' 안붙는 것에 대한 임시 방편 - 추후 수정 요망
  let now = '';
  if (nowOS === "Darwin") {
    now = '/' + path.join(...nowLocation);
  } else {
    now = '/' + path.join(...nowLocation);
  }
  console.log('now: ' + now);
  fs.readdir(now, function(err, data) {
    if (err) {
      console.log(err);
    } else {
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
  // const filePath = '/' + path.join(...payload);
  // 맥 os 에서 첫 '/' 안붙는 것에 대한 임시 방편 - 추후 수정 요망
  let filePath = '';
  if (nowOS === "Darwin") {
    filePath = '/' + path.join(...payload);
  } else {
    filePath = path.join(...payload);
  }
  console.log(filePath);
  const jarPath = __dirname + '/vnu.jar';
  execFile('java', ['-jar', `${jarPath}`, filePath], { shell: true }, (error, stdout) => {
    if (error) {
        console.error(`exec error: ${error}`);
        evt.reply('SEND_VALI_RESULT', error);
        return;
    }
    console.log(stdout);
  });
  let jvm = new JVM();
  console.log(jvm)
  jvm.setLogLevel(7);
  console.log(jarPath)
  let entryPointClassName = jvm.loadJarFile(jarPath);
  // console.log('entrypoint: ' + entryPointClassName);
  // jvm.setEntryPointClassName(entryPointClassName);
  // jvm.on("exit", function(code) {
  //   process.exit(code);
  // });
  // console.log(jvm.run(filePath));
})
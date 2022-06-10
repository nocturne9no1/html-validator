import React, { useState, useEffect } from "react";

// const { ipcRenderer } = window;
// import { ipcRenderer } from "electron";
const { ipcRenderer } = window.require('electron');

const FileList = () => {
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    console.log('hi')
    ipcRenderer.on('FILE_LIST', (evt, payload) => {
      // document.getElementById('text-box').textContent = payload
      // console.log('hi')
      console.log(evt, payload);
      // setFileList()
    })
  }, [])

  // const _handleBtn = () => {
  //   ipcRenderer.send('FILE_LIST', 'hi');
  // }
  return (
    <div>

    </div>
  )
}

export default FileList;
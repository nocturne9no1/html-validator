import React, { useState, useEffect } from "react";
const { ipcRenderer } = window.require('electron');

const FileList = () => {
  const [fileList, setFileList] = useState([]);
  const [folderRoute, setForderRoute] = useState([]);
  useEffect(() => {
    ipcRenderer.send('SET_FILE_LIST', 'init_folder_list');
  }, []);

  ipcRenderer.on('SET_FILE_LIST_REPLY', (evt, data) => {
    console.log(data);
    setFileList([...data.data]);
    setForderRoute([...data.now]);
  })
  
  const _handleBtn = (foldername) => {
    if (foldername.includes('.')) {
      ipcRenderer.send('VALIDATE_FILE', [...folderRoute, foldername]);
    } else {
      ipcRenderer.send('SET_FILE_LIST', [...folderRoute, foldername]);
    }
  }

  return (
    <div>
      <h2>{folderRoute.join('\\')}</h2>
      <ul>
        {fileList.map((el, idx) => <FileListItem el={el} key={idx} onDoubleClick={_handleBtn}></FileListItem>)}
      </ul>
    </div>
  )
}

const FileListItem = (props) => {
  return (
    <li key={props.idx}>
      <button onDoubleClick={(foldername) => props.onDoubleClick(props.el)}>
        {props.el}
      </button>
    </li>
  )
}

export default FileList;
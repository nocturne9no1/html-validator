import React, { useState, useEffect } from "react";
const { ipcRenderer } = window.require('electron');

const FileList = () => {
  const [fileList, setFileList] = useState([]);
  const [folderRoute, setForderRoute] = useState([]);
  const _handleBtn = (foldername) => {
    if (foldername.includes('.')) {
      ipcRenderer.send('VALIDATE_FILE', [...folderRoute, foldername]);
    } else {
      ipcRenderer.send('SET_FILE_LIST', [...folderRoute, foldername]);
    }
  }
  const _handBackBtn = () => {
    // setForderRoute([...folderRoute.filter((el, index) => index !== folderRoute.length - 1)]);
    folderRoute.pop()  // 원래 위에걸로 돼야하는데... 추후 수정 요망
    ipcRenderer.send('SET_FILE_LIST', [...folderRoute]);
  }

  // 초기 렌더링 시 폴더 리스트 불러옴
  useEffect(() => {
    ipcRenderer.send('SET_FILE_LIST', 'init_folder_list');
  }, []);

  ipcRenderer.on('SET_FILE_LIST_REPLY', (evt, data) => {
    // console.log(data);
    setFileList([...data.data]);
    setForderRoute([...data.now]);
  })

  return (
    <div className="filelist_wrap">
      <h2 className="breadcrumb">{folderRoute.join('\\')}</h2>
      <button className="back_btn" onClick={() => _handBackBtn()}>뒤로가기</button>
      <ul>
        {fileList.map((el, idx) => <FileListItem el={el} key={idx} 
            isHtml={el.includes('.')} onClick={_handleBtn}></FileListItem>)}
      </ul>
    </div>
  )
}

const FileListItem = (props) => {
  return (
    <li className="filelist_item" key={props.idx}>
      <button className={(props.isHtml ? 'html_file' : 'folder')} onClick={(foldername) => props.onClick(props.el)}>
        {props.el}
      </button>
    </li>
  )
}

export default FileList;
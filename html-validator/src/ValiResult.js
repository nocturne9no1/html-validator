import React, { useState, useEffect } from "react";
const { ipcRenderer } = window.require('electron');

const ValiResult = () => {
  const [valiResult, setValiResult] = useState(['없졍']);
  const [errorData, setErrorData] = useState({});
  const [errCount, setArrCount] = useState(0);
  const [warnCount, setWarnCount] = useState(0);
  // validaing data 수신
  const _controlCount = (target) => {
    if (target === 'error') {
      setArrCount(errCount + 1);
      return 'error';
    } else if (target === 'warning') {
      setWarnCount(warnCount + 1);
      return 'warning';
    }
  }
  ipcRenderer.on('SEND_VALI_RESULT', (evt, data) => {
    setErrorData(data);
  })
  useEffect(() => {
    // 향후 수정 필요
    // 배열로 바뀌지 않음
    // 현재는 하나씩 배열에 넣는 형식
    
    // const errList = Array.from(errorData.error.split(/\r?\n/g));
    const errList = String(errorData.error).split(/\r?\n/g);
    const newList = [];
    // console.log('errlist: ' + errList);
    errList.forEach((el, index) => {
      // console.log(el)
      // console.log(errorData.filePath)
      if (el.includes(`${errorData.filePath}"`)) {
        // console.log('eys'+ el)
        const data = el.split(':');
        // 우선 macos path 기준으로 작성
        // 추후 Regexp 등을 사용해 정교하게 parsing 할 필요성 있음
        console.log(data);
        const err = {};
        err.type = data[3].includes('error') ? _controlCount('error') : _controlCount('warning');
        err.row = {
          start: data[2].split('-')[0].split('.')[0],
          end: data[2].split('-')[1].split('.')[0]
        };
        err.col = {
          start: data[2].split('-')[0].split('.')[1],
          end: data[2].split('-')[1].split('.')[1]
        }
        err.contents = data[data.length - 1];
        newList.push(err);
      } else {
        console.log('no' + el)
      }
    })
    console.log(newList)
    // console.log(newList);
    // errList.pop();
    // console.log(errList)
    setValiResult(newList);
    // console.log(data.stack)
    // console.log(data.split(/^error|^warning/))
  }, [errorData])
  useEffect(() => {
    console.log('yes!!: ' + valiResult)
  }, [valiResult])
  return (
    <div className="vali_result_wrap">
      <h2 className="vali_result_title">Validate Result</h2>
      error: {errCount} / warning: {warnCount}
      <ul className="result_list">
        {valiResult.map((item, index) => 
          <ValiResultItem item={item} key={index}/>
        )}
      </ul>
    </div>
  )
}

const ValiResultItem = (props) => {
  console.log(props.item)
  return (
    <li className="vali_result_item" key={props.index}>
      <strong className={(props.item.type)}>{props.item.type}</strong>
      <p>{props.item.contents}</p>
    </li>
  )
}

export default ValiResult;
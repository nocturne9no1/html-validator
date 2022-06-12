import React, { useState } from "react";
const { ipcRenderer } = window.require('electron');

const ValiResult = () => {
  const [valiResult, setValiResult] = useState(['없졍']);

  ipcRenderer.on('SEND_VALI_RESULT', (evt, data) => {
    // console.log('hi')
    // setValiResult(data);
    // console.log(data.toString().split(/^error|^warning/ig))
    console.dir(data)
    // console.log(data.message)
    const errList = Array.from(data.message.split(/\r?\n/g));
    const newList = [];
    errList.forEach((el, index) => {
      if (index !== errList.length - 1) {
        newList.push(el);
      }
    })
    console.log(newList)
    // errList.pop();
    // console.log(errList)
    setValiResult([...newList]);
    console.log(valiResult)
    // console.log(data.stack)
    // console.log(data.split(/^error|^warning/))
  })
  return (
    <div className="vali_result_wrap">
      <h2 className="vali_result_title">Validate Result</h2>
      <ul className="result_list">
        {valiResult.map((item, index) => 
          <ValiResultItem item={item} key={index}/>
        )}
      </ul>
    </div>
  )
}

const ValiResultItem = (props) => {
  return (
    <li className="vali_result_item" key={props.index}>
      {props.item}
    </li>
  )
}

export default ValiResult;
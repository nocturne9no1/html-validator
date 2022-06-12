import React, { useState } from "react";
const { ipcRenderer } = window.require('electron');

const ValiResult = () => {
  const [valiResult, setValiResult] = useState('없졍');

  ipcRenderer.on('SEND_VALI_RESULT', (evt, data) => {
    // console.log('hi')
    // setValiResult(data);
    // console.log(data.toString().split(/^error|^warning/ig))
    console.dir(data)
    // console.log(data.message)
    const errList = Array.from(data.message.split(/\r?\n/g));
    errList.pop();
    // console.log(errList)
    setValiResult([...errList]);
    // console.log(data.stack)
    // console.log(data.split(/^error|^warning/))
  })
  return (
    <div>
      <h2>Validate Result</h2>
      {valiResult}
    </div>
  )
}

export default ValiResult;
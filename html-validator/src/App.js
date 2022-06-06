import './App.css';
const { ipcRenderer } = window;

function App() {
  const _handleBtn = () => {
    ipcRenderer.send('CHANNEL_NAME', 'hi');
  }
  return (
    <div className="App">
      <button onClick={() => _handleBtn()}>test</button>
    </div>
  );
}

export default App;

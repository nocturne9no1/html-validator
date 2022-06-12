import './App.css';
import FileList from './FileList';
import ValiResult from './ValiResult';

function App() {
  return (
    <div className="App">
      <div className="screen_wrap">
        <FileList></FileList>
        <ValiResult></ValiResult>
      </div>
    </div>
  );
}

export default App;

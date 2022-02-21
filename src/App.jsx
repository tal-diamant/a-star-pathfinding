import { useState, useEffect } from 'react';
import Canvas from './components/Canvas/Canvas';
import Header from './components/Header/Header';
import './App.css'

function App() {
  const [fps, setFps] = useState(60);
  const [canvasSwitch, setCanvasSwitch] = useState(true);

  const handleInput = (e) => {
    setFps(e.target.value);
  }

  useEffect(() => {
    if(!canvasSwitch) {
      setCanvasSwitch(true);
    }
  },[canvasSwitch]);

  const resetCanvas = () => {
    setCanvasSwitch(false);
  }

  return (
    <div className="App">
      <Header />
      {canvasSwitch && <Canvas fps={fps}/>}
      <hr />
      <section>
        some section stuff
        <input type="number" value={fps} onInput={handleInput} />
        <button onClick={resetCanvas}>Restart</button>
      </section>
      <footer>footer</footer>
    </div>
  )
}

export default App
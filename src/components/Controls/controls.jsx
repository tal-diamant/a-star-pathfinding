import { useState } from "react";
import "./controls.css";

const Controls = ({
  state,
  pauseControl,
  changeFrameRate,
  nextFrame,
  clearExecution,
  setAutoplay,
  setRandomize,
}) => {
  const [fps, setFps] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  console.log("Controls got rerendered");

  const placeholder = () => {};

  return (
    <section className="controls-wrapper">
      <div>
        <label className="fps-label">FPS (frames per second):</label>
        <input type="number" size="1" max="100" value={fps} onInput={(e) => changeFrameRate(e, setFps)} />
      </div>
      <div>
        <button onClick={() => clearExecution(setIsPaused)}>Clear</button>
      </div>
      <div>
        <button onClick={() => pauseControl(setIsPaused)}>
          {isPaused ? "Play" : "Pause"}
        </button>
      </div>
      <div>
        <button onClick={nextFrame}>next step</button>
      </div>
      <div>
        <label>Autoplay:</label>
        <input type="checkbox" onChange={() => setAutoplay(setIsPaused)} />
      </div>
      <div>
        <label>Randomize Board:</label>
        <input type="checkbox" onChange={setRandomize} />
      </div>
    </section>
  );
};

export default Controls;

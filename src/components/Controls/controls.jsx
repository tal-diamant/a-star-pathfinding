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
    <section>
      some section stuff
      <input type="number" value={fps} onInput={(e) => changeFrameRate(e, setFps)} />
      <button onClick={() => clearExecution(setIsPaused)}>Clear</button>
      <button onClick={() => pauseControl(setIsPaused)}>
        {isPaused ? "Play" : "Pause"}
      </button>
      <button onClick={nextFrame}>next step</button>
      <label>Autoplay:</label>
      <input type="checkbox" onChange={() => setAutoplay(setIsPaused)} />
      <label>Randomize Board:</label>
      <input type="checkbox" onChange={setRandomize} />
    </section>
  );
};

export default Controls;

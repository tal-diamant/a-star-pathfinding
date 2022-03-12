import { useState } from "react";
import './Test.css';

const Controls = ({state, pauseControl, changeFrameRate, nextFrame, restart}) => {
    const [fps, setFps] = useState(60);
    const [isPaused, setIsPaused] = useState();
    const [randomize, setRandomize] = useState();
    console.log('Controls got rerendered');

    return (
        <section>
            some section stuff
            <input type="number" value={fps} onInput={(e) => changeFrameRate(e,setFps)} />
            <button onClick={() => restart(setIsPaused)}>Restart</button>
            <button onClick={() => pauseControl(setIsPaused)}>{isPaused? 'Play':'Pause'}</button>
            <button onClick={nextFrame}>next step</button>
        </section>
    )
}

export default Controls;
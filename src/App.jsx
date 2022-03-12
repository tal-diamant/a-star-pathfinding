import { useEffect, useRef } from "react";
import { Cell, Array2d, FreeCell } from "./utils/functionConstructors";
import { draw_text } from "./utils/utilFunctions";
import { runAlgorithm } from "./utils/aStarAlgo";
import Header from "./components/Header/Header";
import Controls from "./components/Controls/controls";
import "./App.css";

function App() {
  console.log("App got rerendered");

  //creating reference to the canvas element
  const canvasRef = useRef(null);

  let canvas, ctx;

  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");

    //listen for canvas events
    canvas.addEventListener("mousemove", updateMouseCoords);
    canvas.addEventListener("click", handleCanvasClick);

    //set the canvas size
    canvas.width = window.innerWidth;

    //populate grid with cell objects
    for (let i = 0; i < VER_HOR_CELLS; i++) {
      for (let j = 0; j < VER_HOR_CELLS; j++) {
        grid[i][j] = new Cell(j, i, ctx, canvas, VER_HOR_CELLS);
      }
    }

    //find each cell's neighbors
    for (let i = 0; i < VER_HOR_CELLS; i++) {
      for (let j = 0; j < VER_HOR_CELLS; j++) {
        grid[i][j].findNeighbors(grid);
      }
    }

    startPosition = canvas.width / 2 - 70;
    selectionBlocks[0] = new FreeCell(startPosition, 30, ctx, canvas, "empty");
    selectionBlocks[1] = new FreeCell(
      startPosition + 40,
      30,
      ctx,
      canvas,
      "start"
    );
    selectionBlocks[2] = new FreeCell(
      startPosition + 80,
      30,
      ctx,
      canvas,
      "end"
    );
    selectionBlocks[3] = new FreeCell(
      startPosition + 120,
      30,
      ctx,
      canvas,
      "wall"
    );
    selected = new FreeCell(startPosition + 60, 70, ctx, canvas);

    start = grid[0][0];
    end = grid[VER_HOR_CELLS - 1][VER_HOR_CELLS - 1];
    start.wall = false;
    end.wall = false;

    //push the starting point in the open set
    openSet.push(start);

    //make the canvas animate
    requestAnimationFrame((timeStamp) => update(canvas, ctx, timeStamp));
  }, []);

  //canvas controllers
  let paused = false;
  let fps = 60;
  let frameStart;
  let autoplay = false;
  let randomize = false;
  let isInSingleStep = false;
  const AUTOPLAY_DELAY = 250;

  //switch for the algorithm run
  let isDone = false;

  //mouse trackers
  let mouse_x = 0;
  let mouse_y = 0;
  let mouse_x_OnClick = -1;
  let mouse_y_OnClick = -1;

  //algorithm tools
  const openSet = [];
  const closedSet = [];
  const VER_HOR_CELLS = 15;

  //create grid
  const grid = new Array2d(VER_HOR_CELLS);

  //create slection blocks
  const selectionBlocks = new Array(4);
  let startPosition;
  let selected;

  //pick starting and ending points
  let start;
  let end;
  let current;

  function update(canvas, ctx, timeStamp) {
    if (frameStart === undefined) {
      frameStart = timeStamp;
    }
    const elpased = timeStamp - frameStart;
    if (paused || elpased < getFrameRate(fps)) {
      requestAnimationFrame((timeStamp) => update(canvas, ctx, timeStamp));
    } else {
      frameStart = undefined;
      canvas.width = window.innerWidth;

      if (!isDone) {
        const output = runAlgorithm(current, isDone, openSet, closedSet, end);
        current = output.current;
        isDone = output.isDone;
        if (isDone && autoplay && !isInSingleStep) {
          setTimeout(autoplayFn, AUTOPLAY_DELAY);
        }
        isInSingleStep = false;
      }

      //draw selection cells
      selectionBlocks.forEach((freeCell) => {
        freeCell.drawSelf(freeCell.isPointInside(mouse_x, mouse_y));
        if (freeCell.isPointInside(mouse_x_OnClick, mouse_y_OnClick)) {
          selected.setType(freeCell.type);
        }
      });

      //draw selected block
      selected.drawSelf(selected.isPointInside(mouse_x, mouse_y));
      if (selected.isPointInside(mouse_x_OnClick, mouse_y_OnClick)) {
        console.log(`type: ${selected.type}`);
      }

      //color the grid cells accordingly
      for (let i = 0; i < VER_HOR_CELLS; i++) {
        for (let j = 0; j < VER_HOR_CELLS; j++) {
          grid[i][j].drawSelf(
            "white",
            grid[i][j].isPointInside(mouse_x, mouse_y)
          );
          if (grid[i][j].isPointInside(mouse_x_OnClick, mouse_y_OnClick)) {
            console.log(`cell x: ${j}, cell y: ${i}`);
            switch (selected.type) {
              case "empty":
                grid[i][j].setWall(false);
                break;
              case "start":
                start = grid[i][j];
                break;
              case "end":
                end = grid[i][j];
                break;
              case "wall":
                grid[i][j].setWall(true);
                break;
            }
          }
        }
      }

      for (let i = 0; i < closedSet.length; i++) {
        closedSet[i].drawSelf(
          "orange",
          closedSet[i].isPointInside(mouse_x, mouse_y)
        );
      }

      for (let i = 0; i < openSet.length; i++) {
        openSet[i].drawSelf("#afa", openSet[i].isPointInside(mouse_x, mouse_y));
      }

      if (isDone && current === start) {
        current = end;
      }
      if (current) {
        current.drawSelf("blue", current.isPointInside(mouse_x, mouse_y));
        while (current.previous) {
          current = current.previous;
          current.drawSelf("#33f", current.isPointInside(mouse_x, mouse_y));
        }
      }

      end.drawSelf("red", end.isPointInside(mouse_x, mouse_y));
      start.drawSelf("#3f3", start.isPointInside(mouse_x, mouse_y));

      //draw text to screen
      // draw_text(ctx, `x: ${mouse_x}, y: ${mouse_y}`, 10, 30);

      //reset mouse click mechanism variables
      mouse_x_OnClick = -1;
      mouse_y_OnClick = -1;

      requestAnimationFrame((timeStamp) => update(canvas, ctx, timeStamp));
    }
  }

  const updateMouseCoords = (e) => {
    mouse_x = e.offsetX;
    mouse_y = e.offsetY;
  };

  const handleCanvasClick = (e) => {
    mouse_x_OnClick = e.offsetX;
    mouse_y_OnClick = e.offsetY;
  };

  function getFrameRate(fps) {
    return Math.floor(1000 / fps);
  }

  const changeFrameRate = (e, setFps) => {
    fps = e.target.value;
    setFps(e.target.value);
  };

  const clearExecution = (setPaused) => {
    for (let i = 0; i < VER_HOR_CELLS; i++) {
      for (let j = 0; j < VER_HOR_CELLS; j++) {
        const currentCell = grid[i][j];
        currentCell.wayFromStart = 0;
        currentCell.wayToEnd = 0;
        currentCell.wayTotal = 0;
        currentCell.previous = null;
        if(randomize && currentCell !== start && currentCell !== end) {
          currentCell.wall = Math.random() < 0.3? true : false;
        }
        if(currentCell !== start && currentCell !== end && !currentCell.wall) {
          currentCell.drawSelf("white");
        }
        if(currentCell.wall) {
          currentCell.drawSelf("black");
        }
      }
    }

    //remove all items from sets
    openSet.splice(0, openSet.length);
    closedSet.splice(0, closedSet.length);

    //add start cell to open set
    openSet.push(start);

    isDone = false;
    paused = true;
    setPaused(true);
  };

  const autoplayFn = () => {
    clearExecution(() => {}); //<-- could cause bugs
    paused = false;
  };

  const setAutoplay = (setPaused) => {
    autoplay = !autoplay;
    if(isDone) {
      clearExecution(setPaused);
      paused = false;
      setPaused(false);
    }
  };

  const setRandomize = () => {
    randomize = !randomize;
  }

  const cleanBoard = () => {
    //restart
    //make isDone true
    //clean all walls from board
  };

  const pauseUnpause = (setPaused) => {
    if (paused) {
      if(isDone && autoplay) {
        clearExecution(() => {}); //could cause bugs
      }
      //unpause
      paused = false;
      setPaused(false);
    } else {
      //pause
      paused = true;
      setPaused(true);
    }
  };

  const nextFrame = () => {
    if (paused) {
      isInSingleStep = true;
      paused = false;
      setTimeout(() => {
        paused = true;
      }, getFrameRate(fps));
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="canvas-container">
        <canvas id="canvas" ref={canvasRef} width="500" height="500"></canvas>
      </div>
      <hr />
      <Controls
        pauseControl={pauseUnpause}
        changeFrameRate={changeFrameRate}
        nextFrame={nextFrame}
        clearExecution={clearExecution}
        setAutoplay={setAutoplay}
        setRandomize={setRandomize}
      />
    </div>
  );
}

export default App;

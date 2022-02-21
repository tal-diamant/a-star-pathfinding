import { useRef, useEffect, useState } from "react";
import { Cell, Array2d } from '../../utils/functionConstructors';
import { remElFromArr, heuristic } from '../../utils/utilFunctions';
import './Canvas.css';

const Canvas = ({fps}) => {
    //creating reference to the canvas element
    const canvasRef = useRef(null);

    //once component is mounted
    useEffect(() => {
        const canvasElement = canvasRef.current;
        const ctx = canvasElement.getContext("2d");
        
        //make the canvas animate
        const interval =  setInterval(update, 1000/(fps || 60));

        //SETUP CODE
        canvasElement.width = window.innerWidth;
        // canvasElement.style.backgroundColor = "red";
        
        const openSet = [];
        const closedSet = [];
        const VER_HOR_CELLS = 15;

        //create grid
        const grid = new Array2d(VER_HOR_CELLS);

        //populate grid with cell objects
        for(let i = 0; i < VER_HOR_CELLS; i++) {
            for(let j = 0; j < VER_HOR_CELLS; j++) {
                grid[i][j] = new Cell(j,i, ctx, canvasElement, VER_HOR_CELLS);
            }
        }

        //find each cell's neighbors
        for(let i = 0; i < VER_HOR_CELLS; i++) {
            for(let j = 0; j < VER_HOR_CELLS; j++) {
                grid[i][j].findNeighbors(grid);
            }
        }

        //pick starting and ending points
        const start = grid[0][0];
        const end = grid[VER_HOR_CELLS -1 ][VER_HOR_CELLS - 1];
        start.wall = false;
        end.wall = false;
        let current;

        //push the starting point in the open set
        openSet.push(start);

        //UPDATE CODE
        function update() {
            canvasElement.width = window.innerWidth;
            
            if(openSet.length > 0) {
	
                //find the point in the open set with the lowest "total way" (the way to the point from the start + the way from the point to the end)
                let wayTotal = 0;
                for(let i = 0; i < openSet.length; i++) {
                    if(openSet[i].wayTotal < openSet[wayTotal].wayTotal) {
                        wayTotal = i;
                    }
                }
            
                //remove chosen point from the open set and add it to the closed set
                current = openSet[wayTotal];
                remElFromArr(openSet, current);
                closedSet.push(current);
            
                //if the current point is the end point we found the path and we're done
                if(current === end) {
                    clearInterval(interval);
                    console.log('DONE!');
                }
            
                //loop through the chosen's point neighbors and calculate their "total way"
                const neighbors = current.neighbors;
                for(let i = 0; i < neighbors.length; i++) {
                    const neighbor = neighbors[i];
                    const newWayFromStart = current.wayFromStart + 1;
            
                    if(!closedSet.includes(neighbor) && !neighbor.wall) {
            
                        if(!openSet.includes(neighbor)) {
                            neighbor.wayFromStart = newWayFromStart;
                            neighbor.wayToEnd = heuristic(neighbor,end);
                            neighbor.wayTotal = neighbor.wayFromStart + neighbor.wayToEnd;
                            neighbor.previous = current;
                            openSet.push(neighbor);
                        } else if(neighbor.wayFromStart > newWayFromStart) {
                            neighbor.wayFromStart = newWayFromStart;
                            neighbor.wayTotal = neighbor.wayFromStart + neighbor.wayToEnd;
                            neighbor.previous = current;
                        }
                    }
                }
            
                //keep going
            } else {
                //no solution
                clearInterval(interval);
                console.log('NO SOLUTION!')
            }
            
            //color the grid cells accordingly
            for(let i = 0; i < VER_HOR_CELLS; i++) {
                for(let j = 0; j < VER_HOR_CELLS; j++) {
                    grid[i][j].drawSelf('white');
                }
            }
            
            for(let i = 0; i < closedSet.length; i++) {
                closedSet[i].drawSelf('orange');
            }
            
            for(let i = 0; i < openSet.length; i++) {
                openSet[i].drawSelf('#afa');
            }

            current.drawSelf('blue');
            while(current.previous) {
                current = current.previous;
                current.drawSelf('#33f');
            }
            end.drawSelf('red');
            start.drawSelf('#3f3');
        }

        return function cleanup() {
            clearInterval(interval);
        }
    },[]);

    return <div className="canvas-container">
        <canvas id="canvas" ref={canvasRef} width="500" height="500"></canvas>
    </div>
}

export default Canvas
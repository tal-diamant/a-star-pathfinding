import { remElFromArr, heuristic } from './utilFunctions';

const runAlgorithm = (current, isDone, openSet, closedSet, end) => {
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
            console.log('DONE!');
            isDone = true;
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
        return {current, isDone};
    } else {
        console.log('NO SOLUTION!');
        isDone = true;
        return {current, isDone};
    }
}

export {runAlgorithm};
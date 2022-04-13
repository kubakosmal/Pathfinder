function aStar(graph, start, end) {
  // end node coordinates
  let endRowPosition = end.split("r");
  let endColPosition = endRowPosition[0].split("c");
  endRowPosition.shift();
  endColPosition.shift();
  endRowPosition = Number(endRowPosition);
  endColPosition = Number(endColPosition);

  // starting node coordinates
  let startRowPosition = start.split("r");
  let startColPosition = startRowPosition[0].split("c");
  startRowPosition.shift();
  startColPosition.shift();
  startRowPosition = Number(startRowPosition);
  startColPosition = Number(startColPosition);

  // open queue
  let queue = [];

  // closed set
  let closedSet = new Set();

  // visited and path
  visitedAndPath = {
    visited: [],
    path: [],
  };

  // track which node called which
  let tracking = {};

  // starting node direction
  let startingNodeDirection;
  if (startColPosition < endColPosition) {
    startingNodeDirection = "right";
  } else if (startColPosition > endColPosition) {
    startingNodeDirection = "left";
  } else if (startRowPosition < endRowPosition) {
    startingNodeDirection = "down";
  } else if (startRowPosition > endRowPosition) {
    startingNodeDirection = "up";
  }

  // starting node heuristic
  let startingNodeHeuristic =
    Math.abs(startRowPosition - endRowPosition) +
    Math.abs(startColPosition - endColPosition);

  // add starting node to the open set
  let startingNode = {
    f: 0,
    heuristic: startingNodeHeuristic,
    distance: 0,
    name: start,
    parent: null,
    direction: startingNodeDirection,
  };

  queue.push(startingNode);
  // previous node direction
  let previousDirection;

  while (queue.length > 0) {
    // set first node's f to infintiy to find lowest f in a loop
    let currentLowest = {
      f: Infinity,
      heuristic: Infinity,
      distance: Infinity,
    };

    // find lowest f
    /* for (let el of queue) {
      if (el.f < currentLowest.f) {
        currentLowest = el;
      } else if (el.f == currentLowest.f) {
        if (el.heuristic < currentLowest.heuristic) {
          currentLowest = el;
        } else if (el.heuristic == currentLowest.heuristic) {
          if (el.distance < currentLowest.distance) {
            el = currentLowest;
          }
        }
      }
    } */

    for (let el of queue) {
      if (el.f < currentLowest.f) {
        currentLowest = el;
      }
    }

    for (let el of queue) {
      if (el.f == currentLowest.f) {
        if (el.heuristic < currentLowest.heuristic) {
          currentLowest = el;
        }
      }
    }

    /* for (let el of queue) {
      if (el.heuristic == currentLowest.heuristic) {
        if (el.distance < currentLowest.distance) {
          currentLowest = el;
        }
      }
    } */

    /* for (let el of queue) {
        if (el.distance == currentLowest.distance) {
            if (el.direction == previousDirection) {
                currentLowest = el;
            }
        }
    } */

    

    // add currentLowest to visitedAndPath obj
    visitedAndPath.visited.push(currentLowest.name);

    // current node successors
    let dests = graph[currentLowest.name];
    let destsProps = Object.keys(dests);

    // for every successor
    for (let successor of destsProps) {
      // if successor is the goal
      if (successor == end) {
        tracking[end] = currentLowest.name;
        tracking[start] = null;

        let path = [];
        let trackedNode = end;

        let counter = 0;
        while (trackedNode != null) {
          path.unshift(trackedNode);
          trackedNode = tracking[trackedNode];
          if (counter == 500) {
            break;
          }
          counter++;
        }

        visitedAndPath.path = path;

        return visitedAndPath;
      } else {
        // get current successor position
        let rowPosition = successor.split("r");
        let colPosition = rowPosition[0].split("c");
        rowPosition.shift();
        colPosition.shift();
        rowPosition = Number(rowPosition);
        colPosition = Number(colPosition);

        // get current node position
        let currentRow = currentLowest.name.split("r");
        let currentCol = currentRow[0].split("c");
        currentRow.shift();
        currentCol.shift();
        currentRow = Number(currentRow);
        currentCol = Number(currentCol);

        // determine direction
        let direction = "";
        if (rowPosition > currentRow && colPosition == currentCol) {
          direction = "down";
        } else if (rowPosition < currentRow && colPosition == currentCol) {
          direction = "up";
        } else if (colPosition < currentCol && rowPosition == currentRow) {
          direction = "left";
        } else if (colPosition > currentCol && rowPosition == currentRow) {
          direction = "right";
        }

        // distance (cost) of succesor
        let distance = currentLowest.distance + 1;
        //let distance = Math.abs(rowPosition - startRowPosition) + Math.abs(colPosition - startColPosition);

        // heuristic of successor
        let heuristic =
          Math.abs(rowPosition - endRowPosition) +
          Math.abs(colPosition - endColPosition);

        // f of successor
        let f = distance + heuristic;

        // succcessor obj
        let newSuccessor = {
          f: f,
          heuristic: heuristic,
          distance: distance,
          name: successor,
          parrent: currentLowest.name,
          direction: direction,
        };

        // modifying approach
        // if successor is already there 
        for (let el of queue) {
            // if there's an obj of the same name
            if (el.name == newSuccessor.name) {
                // if newSuccessor has lower f or heuristic or distance, add it to queue
                if (newSuccessor.distance < el.distance) {
                    el.distance = newSuccessor.distance;
                    el.f = el.distance + el.heuristic;
                    tracking[el.name] = currentLowest.name;
                } 
            }
        }

        // add successor to the queue if its not already there
        if (
          !queue.includes(newSuccessor) &&
          !closedSet.has(newSuccessor.name)
        ) {
          queue.push(newSuccessor);
          closedSet.add(newSuccessor.name);
          // add successor to tracking
          tracking[successor] = currentLowest.name;
        }
      }
    }
    // remove currentLowest from open queue and add it's name to the closedSet
    queue = queue.filter((x) => x != currentLowest);
    closedSet.add(currentLowest.name);

    // set previous direction to current lowest node direction
    previousDirection = currentLowest.direction;
  }
}

module.exports = { aStar };

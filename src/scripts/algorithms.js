// bfs algorithm
function bfs(graph, start, end) {
  // object containing visited and path to return
  let visitedAndPath = {
    visited: [],
    path: [],
  };

  // set of already visited nodes
  let visited = new Set();

  // queue of nodes to check
  let queue = [];

  // track which node called which
  let tracking = {};

  // add start node to queue
  queue.push(start);

  // counter to set timeout
  let counter = 1;

  // while there are nodes in queue
  while (queue.length > 0) {
    // current node
    let curr = queue.shift();
    // current node destinatiuons
    let dests = graph[curr];

    // add to visited obj
    visitedAndPath.visited.push(curr);

    // add visited
    visited.add(curr);

    // if end is reached
    if (curr == end) {
      console.log("found!");
      let path = [];
      let trackedNode = end;

      while (trackedNode != null) {
        path.unshift(trackedNode);
        trackedNode = tracking[trackedNode];
      }

      visitedAndPath.path = path;

      return visitedAndPath;
    }

    // if not
    else {
      for (let node of dests) {
        if (!visited.has(node)) {
          tracking[node] = curr;
          queue.push(node);

          // add to visited to not check twice the node
          visited.add(node);
        }
      }
    }
  }
}

// A * algorithm
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
            console.log("infinite loop");
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
          console.log(newSuccessor);
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

// dfs algorithm
function dfsMaze(graph) {
  function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

  // starting and end values of a graph
  let start = Object.keys(graph)[0];

  // visited and blocked obj
  let visitedAndBlocked = {
    visited: [],
    blocked: [],
  };

  // open queue and closed set
  let open = [];
  let closed = new Set();

  // add first node to the open array
  open.push(start);
  console.log(graph);
  // while there's at least one unvisited node
  while (open.length > 0) {
    // pop first item from an open array
    let currentNode = open.pop();
    let neighbors = graph[currentNode];
    let nextNode;

    if (neighbors != undefined) {
      let pathNode = getRandomInt(0, neighbors.length);
      for (let i = 0; i < neighbors.length; i++) {
        if (i == pathNode) {
          open.push(neighbors[i]);
          closed.add(neighbors[i]);
          visitedAndBlocked.visited.push(neighbors[i]);
        }
      }
    }

    
    
  }
  return visitedAndBlocked;
}

module.exports = {
  bfs,
  aStar,
  dfsMaze,
};

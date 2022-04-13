// get random int function
function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

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
        // add successor to the visited array
        visitedAndPath.visited.push(successor);

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
        let f =
          distance * graph[currentLowest.name][successor].weight + heuristic;

        // costly turns
        // check if direction has changed, if so add 1 to distance
        /* let currCordC = currentLowest.name.slice(1, 2);
        let currCordR = currentLowest.name.slice(3);
        let succCordC = successor.slice(1, 2);
        let succCordR = successor.slice(3);

        if (currCordC != succCordC || currCordR != succCordR) {
          f+= 2;
        } */

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
  // while there's at least one unvisited node
  while (open.length > 0) {
    // pop first item from an open array
    let currentNode = open.pop();
    let neighbors = graph[currentNode];

    for (let el of neighbors) {
      if (!closed.has(el)) {
      }
    }
  }
  return visitedAndBlocked;
}

// dfs algorithm
function dfs(graph, start, end) {
  let open = new Array();
  let closed = new Set();
  let visitedAndPath = {
    visited: [],
    path: [],
  };

  open.push(start);

  while (open.length > 0) {
    let current = open.pop();

    if (current == end) {
      visitedAndPath.visited.push(end);
      visitedAndPath.path = visitedAndPath.visited;
      return visitedAndPath;
    }

    for (let el of graph[current]) {
      if (!closed.has(el)) {
        open.push(el);
      }
    }

    closed.add(current);
    visitedAndPath.visited.push(current);
  }
}

// dijkstra algorithm
function dijkstra(graph, start, end) {
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
  queue.push({ name: start, weight: 1 });

  let count = 0;
  // while there are nodes in queue
  while (queue.length > 0) {
    count++;
    // current node
    let curr = {
      name: null,
      weight: Infinity,
    };

    // find lowest cost node
    for (let el of queue) {
      if (el.weight < curr.weight) {
        curr = el;
      }
    }
    // get neighbors
    let neighbors = Object.keys(graph[curr.name]);

    // if curr is the end
    if (curr.name == end) {
      let path = [];
      let trackedNode = end;
      tracking[start] == null;

      while (trackedNode != undefined) {
        path.unshift(trackedNode);
        trackedNode = tracking[trackedNode];
      }

      visitedAndPath.path = path;

      return visitedAndPath;
    } else {
      for (let el of neighbors) {
        if (!visited.has(el)) {
          tracking[el] = curr.name;

          let newWeight = (curr.weight + 1) * graph[curr.name][el].weight;
          
          queue.push({ name: el, weight: newWeight });
          visited.add(el);
        }
      }

      // remove currentLowest from queue
      visitedAndPath.visited.push(curr.name);
      queue = queue.filter((x) => x != curr);
      visited.add(curr.name);
    }
  }
}

// recursive division
function recursiveDivision(width, height, orientation) {
  let blockedNodes = new Set();
  let passages = new Set();

  for (let i = 0; i < width; i++) {
    blockedNodes.add(`c${i}r0`);
    blockedNodes.add(`c${i}r${height - 1}`);
  }

  for (let i = 0; i < height; i++) {
    blockedNodes.add(`c0r${i}`);
    blockedNodes.add(`c${width - 1}r${i}`);
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function chooseDirection(width, height) {
    if (width > height) {
      return "vertical";
    } else if (height > width) {
      return "horizontal";
    } else {
      let random = getRandomInt(1, 3);
      if (random == 1) {
        return "vertical";
      } else {
        return "horizontal";
      }
    }
  }

  function divideGraph(colStart, colEnd, rowStart, rowEnd, direction) {
    if (colEnd - colStart < 1 || rowEnd - rowStart < 1) {
      return;
    }

    if (direction == "horizontal") {
      // possible rows
      let possibleRows = [];
      for (let i = rowStart + 1; i < rowEnd; i += 1) {
        possibleRows.push(i);
      }

      // filter possible rows
      possibleRows = possibleRows.filter(
        (x) =>
          !passages.has(`c${colStart - 1}r${x}`) &&
          !passages.has(`c${colEnd + 1}r${x}`)
      );

      // possible columns
      let possibleColumns = [];
      for (let i = colStart; i <= colEnd + 1; i += 2) {
        possibleColumns.push(i);
      }

      let randomRowStart = possibleRows[getRandomInt(0, possibleRows.length)];
      let randomColumnToSkip =
        possibleColumns[getRandomInt(0, possibleColumns.length)];


      for (let i = colStart; i <= colEnd; i++) {
        if (i != randomColumnToSkip) {
          blockedNodes.add(`c${i}r${randomRowStart}`);
        } else {
          passages.add(`c${i}r${randomRowStart}`);
        }
      }

      // direction of the next walls
      let newDirectionOfUpper =
        randomRowStart - rowStart - 1 > colEnd - colStart
          ? "horizontal"
          : "vertical";
      let newDirectionOfLower =
        rowEnd - randomRowStart > colEnd - colStart ? "horizontal" : "vertical";

      // recursive call
      divideGraph(
        colStart,
        colEnd,
        rowStart,
        randomRowStart - 1,
        newDirectionOfUpper
      );
      divideGraph(
        colStart,
        colEnd,
        randomRowStart + 1,
        rowEnd,
        newDirectionOfLower
      );
    } else {
      // possible columns
      let possibleColumns = [];
      for (let i = colStart + 1; i <= colEnd; i += 2) {
        possibleColumns.push(i);
      }
      // possible roows
      let possibleRows = [];
      for (let i = rowStart; i <= rowEnd; i++) {
        possibleRows.push(i);
      }

      // filter possible columns
      possibleColumns = possibleColumns.filter(
        (x) => !passages.has(`c${x}r${rowStart - 1}`)
      );

      let randomColStart =
        possibleColumns[getRandomInt(0, possibleColumns.length)];
      let randomRowToSkip = possibleRows[getRandomInt(0, possibleRows.length)];

      for (let i = rowStart; i <= rowEnd; i++) {
        if (i != randomRowToSkip) {
          blockedNodes.add(`c${randomColStart}r${i}`);
        } else {
          passages.add(`c${randomColStart}r${i}`);
        }
      }

      // direction of the next walls
      let newDirectionOfLeft =
        randomColStart - colStart - 1 < rowEnd - rowStart
          ? "horizontal"
          : "vertical";
      let newDirectionOfRight =
        colEnd - randomColStart < rowEnd - rowStart ? "horizontal" : "vertical";

      // recursive call
      divideGraph(
        colStart,
        randomColStart - 1,
        rowStart,
        rowEnd,
        newDirectionOfLeft
      );
      divideGraph(
        randomColStart + 1,
        colEnd,
        rowStart,
        rowEnd,
        newDirectionOfRight
      );
    }
  }

  divideGraph(1, width - 2, 1, height - 2, orientation);
  return blockedNodes;
}

// random maze
function randomMaze(ROWS, COLUMNS) {
  let toBeBlocked = [];
  let alreadyBlocked = new Set();
  function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  let numberOfBlocked = Math.floor((ROWS * COLUMNS) / 4);

  for (let i = 0; i < numberOfBlocked; i++) {
    let row = getRandomInt(0, ROWS);
    let column = getRandomInt(0, COLUMNS);

    if (!alreadyBlocked.has(`c${column}r${row}`)) {
      toBeBlocked.push(`c${column}r${row}`);
    }
  }

  return toBeBlocked;
}

// stripes maze
function stripesMaze(ROWS, COLUMNS) {
  let toBeBlocked = [];

  for (let i = 1; i < COLUMNS; i += 4) {
    let toSkip = getRandomInt(0, ROWS - 1);
    let toSkip2 = getRandomInt(0, ROWS - 1);
    let toSkip3 = getRandomInt(0, ROWS - 1);
    let toSkip4 = getRandomInt(0, ROWS - 1);
    for (let j = 0; j < ROWS; j++) {
      if (j != toSkip && j != toSkip2 && j != toSkip3 && j != toSkip4) {
        toBeBlocked.push(`c${i}r${j}`);
      }
    }
  }

  return toBeBlocked;
}

module.exports = {
  bfs,
  aStar,
  dfsMaze,
  dfs,
  dijkstra,
  recursiveDivision,
  randomMaze,
  stripesMaze,
};

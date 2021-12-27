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
    if (dests == undefined) {
      console.log(`I am dests of ${currentLowest.name} and im undefined`);
    }
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
        if (graph[successor] == undefined) {
          console.log("IM UNDEFINED");
          console.log(successor);
        }
        let f =
          (distance + heuristic) * graph[currentLowest.name][successor].weight;

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
  console.log(start);
  console.log("graph below");
  console.log(graph);
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

  function search(node) {
    closed.add(node);
    visitedAndPath.visited.push(node);
    if (node == end) {
      return visitedAndPath;
    } else {
      for (let el of graph[node]) {
        if (!closed.has(el)) {
          return search(el);
        }
      }
    }
  }

  search(start);

  return visitedAndPath;

  /*   open.push(start);

  while(open.length > 0) {
    let current = open.shift();

    if (current == end) {
      console.log('siema')
      visitedAndPath.visited.push(current);
      visitedAndPath.path =  visitedAndPath.visited;
      return visitedAndPath;
    } else {
      for (let el of graph[current]) {
        if (!closed.has(el)) {
          closed.add(el);
          open.unshift(el);
        }
      }
      
    }
    closed.add(current);
    visitedAndPath.visited.push(current);
  } */
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
    count++
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
      console.log("found!");
      let path = [];
      let trackedNode = end;

      /* while (trackedNode != null) {
        path.unshift(trackedNode);
        trackedNode = tracking[trackedNode];
      } */

      visitedAndPath.path = path;
      console.log(count)
      return visitedAndPath;
      

    } else {
      console.log('curr weight')
      console.log(curr.weight);
      for (let el of neighbors) {
        if (!visited.has(el)) {
          tracking[el] = curr.name;
          
          let newWeight = (curr.weight + 1) * graph[curr.name][el].weight;
          if (graph[curr.name][el].weight == 1.5) {
            console.log(`${el} is weighted. Its base weight is ${graph[curr.name][el].weight}. Its parrent weight is ${curr.weight}, thus its new weight is ${newWeight}`)
          }
          queue.push({name: el, weight: newWeight});
          visited.add(el);
        }
      }

      // remove currentLowest from queue
      visitedAndPath.visited.push(curr.name);
      queue = queue.filter((x) => x != curr);
    }
  }
}

module.exports = {
  bfs,
  aStar,
  dfsMaze,
  dfs,
  dijkstra,
};

const algorithms = require("./scripts/algorithms.js");
const control = require("./scripts/control.js");
const {
  lightRecursiveDivision,
} = require("./scripts/lightRecursiveDivision.js");

// GLOBAL VARS
let blockedNodes = [];
let weightNodes = [];
let startNode = "c5r8";
let endNode = "c30r8";
let ROWS = 33;
let COLUMNS = 51;
const CELLSIZE = 21;
// GLOBAL VARS

// CALCULATING NUMBER OF CELLS
let cellQuantity = control.calculateCellQuantity(CELLSIZE);
COLUMNS = cellQuantity[0];
ROWS = cellQuantity[1];

console.log(COLUMNS)
console.log(ROWS)
// END OF CALCULATING

// MAKING GRID FIRST
control.makeGrid(ROWS, COLUMNS);
// END OF MAKING GRID

// SET INITIAL START AND END FUNCTION
function setInitialValues() {
  let setInitialStart = document.getElementById(startNode);
  let setInitialEnd = document.getElementById(endNode);
  setInitialStart.classList.add("start");
  setInitialEnd.classList.add("end");
  /* blockedNodes = []; */
}
setInitialValues();
// END OF SET INITAL FUNCTION

// button state
let buttonState = "blocked";

function stateStart() {
  buttonState = "start";
}

function stateEnd() {
  buttonState = "end";
}

function stateBlock() {
  buttonState = "blocked";
}
// button state //

// CHANGING STATE FUNCTION
function changeState(clickedId) {
  // if it is blocked click
  if (buttonState == "blocked") {
    // if its not start or end
    let cell = document.getElementById(clickedId);
    if (!cell.classList.contains("start") && !cell.classList.contains("end")) {
      // if blocked incluides ID
      if (blockedNodes.includes(clickedId)) {
        blockedNodes = blockedNodes.filter((node) => node != clickedId);
      } else {
        // if not, add blocked node
        blockedNodes.push(clickedId);
      }

      // color and add class

      cell.classList.toggle(buttonState);

      return;
    }
  } else {
    // removing class from td so that it can be only one start/end
    let cells = document.getElementsByTagName("td");
    for (let x of cells) {
      x.classList.remove(buttonState);
    }

    // select cell
    let cell = document.getElementById(clickedId);
    cell.classList.toggle(buttonState);

    // if start, change starting node ID
    if (buttonState == "start") {
      startNode = clickedId;
    } else {
      // if end, change ending node ID
      endNode = clickedId;
    }
  }
}
// END OF CHANGING STATE FUNCTION

// DYNAMIC PATHFINDING BOOL VAR
let dynamicPathfinding = false;

// USAGE OF APP
window.run = function () {
  // get the value of checked radio button
  let choosedAlgorithm = document.querySelector(
    'input[name="checked-algorithm"]:checked'
  ).value;
  console.log(choosedAlgorithm);

  // erase visited and shortest path classes
  let alreadyVisited = document.querySelectorAll("td");
  for (let el of alreadyVisited) {
    el.removeAttribute("style");
    el.classList.remove("visited");
    el.classList.remove("shortest-path-node");
  }

  if (choosedAlgorithm == "bfs") {
    control.visualizeBfs(ROWS, COLUMNS, startNode, endNode, blockedNodes);
  } else if (choosedAlgorithm == "astar") {
    control.visualizeAstar(
      ROWS,
      COLUMNS,
      startNode,
      endNode,
      blockedNodes,
      weightNodes,
      dynamicPathfinding
    );
  } else if (choosedAlgorithm == "dfs") {
    control.visualizeDfs(ROWS, COLUMNS, startNode, endNode, blockedNodes);
  } else if (choosedAlgorithm == "dijkstra") {
    console.time("control.visualizeDijkstra");
    control.visualizeDijkstra(
      ROWS,
      COLUMNS,
      startNode,
      endNode,
      blockedNodes,
      weightNodes
    );
    console.timeEnd("control.visualizeDijkstra");
  }

  // set dynamic pathFinding to TRUE
  dynamicPathfinding = true;
};

// CLEAR BOARD FUNCTION
window.clearBoard = function () {
  let allNodesToErase = document.querySelectorAll("td");
  for (let el of allNodesToErase) {
    el.removeAttribute("style");
    el.removeAttribute("class");
  }

  setInitialValues();

  // set dynamic pathFinding to FALSE
  dynamicPathfinding = false;
  blockedNodes = [];
  weightNodes = [];

  // make new graph
};

// FUNCTION TO DRAW
let isMouseDown = false;

// SET OF ALREADY VISITED WHEN MOUSE MOVING
let newBlockedSet = new Set();
let newWeights = new Set();

// NEW SET OF UNBLOCKED
let newUnblockedSet = new Set();
let newUnblockedWeights = new Set();

// determine if first touch was on blocked or unlocked
let lock = true;

let clickedOnStart = false;
let clickedOnEnd = false;

dynamicPathfinding = false;

window.mouseDown = function (elementId) {
  isMouseDown = true;

  let currentlyClicked = document.getElementById(elementId);

  // if currently clicked has class of 'blocked'
  if (
    currentlyClicked.classList.contains("blocked") ||
    currentlyClicked.classList.contains("weight")
  ) {
    lock = false;
  } else {
    lock = true;
  }

  // if clicked on start or end
  if (currentlyClicked.classList.contains("start")) {
    clickedOnStart = true;
  } else if (currentlyClicked.classList.contains("end")) {
    clickedOnEnd = true;
  }
};

window.mouseUp = function () {
  isMouseDown = false;

  // update blocked/weight nodes
  let wallOrWeight = document.querySelector(
    'input[name="walls-weights"]:checked'
  ).value;

  if (wallOrWeight == "walls") {
    // adding
    let newBlockedNodes = Array.from(newBlockedSet);
    blockedNodes = blockedNodes.concat(newBlockedNodes);
    newBlockedSet = new Set();

    // deleting
    let newUnblockedNodes = Array.from(newUnblockedSet);
    blockedNodes = blockedNodes.filter(
      (item) => !newUnblockedNodes.includes(item)
    );
    newUnblockedSet = new Set();
  } else if (wallOrWeight == "weights") {
    // adding
    let newWeightsToAdd = Array.from(newWeights);
    weightNodes = weightNodes.concat(newWeightsToAdd);
    newWeights = new Set();

    // deleting
    let newWeightsToRemove = Array.from(newUnblockedWeights);
    weightNodes = weightNodes.filter(
      (item) => !newWeightsToRemove.includes(item)
    );
    newUnblockedWeights = new Set();
  }

  // !!!
  clickedOnStart = false;
  clickedOnEnd = false;
};

window.mouseMoved = function (elementId) {
  if (isMouseDown) {
    // get id of currently clicked element
    let currentlyTouched = document.getElementById(elementId);

    // if clicked on blocked, empty or weight
    if (!clickedOnStart && !clickedOnEnd) {
      // get value from walls/weights radio
      let wallOrWeight = document.querySelector(
        'input[name="walls-weights"]:checked'
      ).value;
      if (wallOrWeight == "walls") {
        // if its not start or end element
        if (
          !currentlyTouched.classList.contains("start") &&
          !currentlyTouched.classList.contains("end")
        ) {
          if (lock) {
            currentlyTouched.classList.add("blocked");
            newBlockedSet.add(elementId);
          } else {
            currentlyTouched.classList.remove("blocked");
            newUnblockedSet.add(elementId);
          }
        }
      } else if (wallOrWeight == "weights") {
        if (
          !currentlyTouched.classList.contains("start") &&
          !currentlyTouched.classList.contains("end")
        ) {
          if (lock) {
            currentlyTouched.classList.add("weight");
            newWeights.add(elementId);
          } else {
            currentlyTouched.classList.remove("weight");
            newUnblockedWeights.add(elementId);
          }
        }
      }

      // if dynamicPathfinding true, animate instantly
      if (dynamicPathfinding == true) {
        control.removeNodeStyles();
        control.dynamicAnimate(ROWS, COLUMNS, startNode, endNode, blockedNodes, weightNodes);
        setInitialValues();
        console.log(startNode);
      }
    }
    // if clicked on start
    else if (clickedOnStart && !clickedOnEnd) {
      // if start id is different than currently clicked
      if (startNode != elementId && !document.getElementById(elementId).classList.contains('blocked')) {
        // remove start class from all elements
        let cells = document.getElementsByTagName("td");
        for (let x of cells) {
          x.classList.remove("start");
        }
        // add class start to currently touched
        currentlyTouched.classList.add("start");
        // make currently touched new start node
        startNode = elementId;

        
      }

      // if dynamicPathfinding true, animate instantly
      if (dynamicPathfinding == true) {
        control.removeNodeStyles();
        control.dynamicAnimate(ROWS, COLUMNS, startNode, endNode, blockedNodes, weightNodes);
        setInitialValues();
      }
    }
    // if clicked on end
    else if (clickedOnEnd && !clickedOnStart) {
      // if start id is different than currently clicked
      if (endNode != elementId && !document.getElementById(elementId).classList.contains('blocked')) {
        let cells = document.getElementsByTagName("td");
        for (let x of cells) {
          x.classList.remove("end");
        }

        // add class end to currently touched
        currentlyTouched.classList.add("end");
        // make currently touched new end node
        endNode = elementId;

        // if dynamicPathfinding true, animate instantly
      if (dynamicPathfinding == true) {
        control.removeNodeStyles();
        control.dynamicAnimate(ROWS, COLUMNS, startNode, endNode, blockedNodes, weightNodes);
        setInitialValues();
      }
      }
    }
  }
};

// RECURSIVE DIVISION
window.RDM = function () {
  for (let el of document.querySelectorAll('td')) {
    el.classList.remove('blocked');
  }
  let counter = 0;
  let xd = lightRecursiveDivision(COLUMNS, ROWS);
  for (let el of xd) {
    setTimeout(() => {
      if (el != startNode && el != endNode) {
        document.getElementById(el).classList.add("blocked");
        blockedNodes.push(el);
      }
    }, 10 * counter);
    counter++;
  }
};

/* function rundDfsMaze() {
  let graph = control.makeGraph(ROWS, COLUMNS);

  let ecie = algorithms.dfsMaze(graph);
  console.log(ecie);

  ecie.visited = ecie.visited.filter(x => x != undefined);
  console.log(ecie.visited);

  for (let el of ecie.visited) {
    document.getElementById(el).classList.add('blocked');
  }
};

rundDfsMaze();  */

/* control.visualizeDfs(ROWS, COLUMNS, startNode, endNode, blockedNodes); */
/* control.visualizeDijkstra(ROWS, COLUMNS, startNode, endNode, blockedNodes, weightNodes); */

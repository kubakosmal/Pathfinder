const algorithms = require("./scripts/algorithms.js");
const control = require("./scripts/control.js");
const {
  lightRecursiveDivision,
} = require("./scripts/lightRecursiveDivision.js");

// initial animations
control.initialAnimations();

// GLOBAL VARS
let blockedNodes = [];
let weightNodes = [];
let startNode = "c5r8";
let endNode = "c30r8";
let ROWS = 33;
let COLUMNS = 51;
const CELLSIZE = 23;
// GLOBAL VARS

// CALCULATING NUMBER OF CELLS
const cellQuantity = control.calculateCellQuantity(CELLSIZE);
COLUMNS = cellQuantity[0];
ROWS = cellQuantity[1];

console.log(COLUMNS);
console.log(ROWS);
// END OF CALCULATING

// MAKING GRID FIRST
control.makeGrid(ROWS, COLUMNS);
// END OF MAKING GRID

// SET INITIAL START AND END FUNCTION
function setInitialValues() {
  const setInitialStart = document.getElementById(startNode);
  const setInitialEnd = document.getElementById(endNode);
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
    const cell = document.getElementById(clickedId);
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
    }
  } else {
    // removing class from td so that it can be only one start/end
    const cells = document.getElementsByTagName("td");
    for (const x of cells) {
      x.classList.remove(buttonState);
    }

    // select cell
    const cell = document.getElementById(clickedId);
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
  const choosedAlgorithm = document.querySelector(
    'input[name="checked-algorithm"]:checked'
  ).value;
  console.log(choosedAlgorithm);

  // erase visited and shortest path classes
  const alreadyVisited = document.querySelectorAll("td");
  for (const el of alreadyVisited) {
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
  const allNodesToErase = document.querySelectorAll("td");
  for (const el of allNodesToErase) {
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

  const currentlyClicked = document.getElementById(elementId);

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
  const wallOrWeight = document.querySelector(
    'input[name="walls-weights"]:checked'
  ).value;

  if (wallOrWeight == "walls") {
    // adding
    const newBlockedNodes = Array.from(newBlockedSet);
    blockedNodes = blockedNodes.concat(newBlockedNodes);
    newBlockedSet = new Set();

    // deleting
    const newUnblockedNodes = Array.from(newUnblockedSet);
    blockedNodes = blockedNodes.filter(
      (item) => !newUnblockedNodes.includes(item)
    );
    newUnblockedSet = new Set();
  } else if (wallOrWeight == "weights") {
    // adding
    const newWeightsToAdd = Array.from(newWeights);
    weightNodes = weightNodes.concat(newWeightsToAdd);
    newWeights = new Set();

    // deleting
    const newWeightsToRemove = Array.from(newUnblockedWeights);
    weightNodes = weightNodes.filter(
      (item) => !newWeightsToRemove.includes(item)
    );
    newUnblockedWeights = new Set();
  }

  // if dynamicPathfinding true, animate instantly
  

  // !!!
  clickedOnStart = false;
  clickedOnEnd = false;
};

// previously touched element
let previouslyTouched = null;

window.mouseMoved = function (elementId) {
  if (isMouseDown) {
    // get id of currently clicked element
    const currentlyTouched = document.getElementById(elementId);

    // if clicked on blocked, empty or weight
    if (!clickedOnStart && !clickedOnEnd) {
      // get value from walls/weights radio
      const wallOrWeight = document.querySelector(
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
        // if its not the same node
        if (currentlyTouched != previouslyTouched) {
          control.removeNodeStyles();
          control.dynamicAnimate(
            ROWS,
            COLUMNS,
            startNode,
            endNode,
            blockedNodes,
            weightNodes
          );
          setInitialValues();
          previouslyTouched = currentlyTouched;
        }
      }
    }
    // if clicked on start
    else if (clickedOnStart && !clickedOnEnd) {
      // if start id is different than currently clicked
      if (
        startNode != elementId &&
        !document.getElementById(elementId).classList.contains("blocked")
      ) {
        // remove start class from all elements
        const cells = document.getElementsByTagName("td");
        for (const x of cells) {
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
        control.dynamicAnimate(
          ROWS,
          COLUMNS,
          startNode,
          endNode,
          blockedNodes,
          weightNodes
        );
        setInitialValues();
      }
    }
    // if clicked on end
    else if (clickedOnEnd && !clickedOnStart) {
      // if start id is different than currently clicked
      if (
        endNode != elementId &&
        !document.getElementById(elementId).classList.contains("blocked")
      ) {
        const cells = document.getElementsByTagName("td");
        for (const x of cells) {
          x.classList.remove("end");
        }

        // add class end to currently touched
        currentlyTouched.classList.add("end");
        // make currently touched new end node
        endNode = elementId;

        // if dynamicPathfinding true, animate instantly
        if (dynamicPathfinding == true) {
          control.removeNodeStyles();
          control.dynamicAnimate(
            ROWS,
            COLUMNS,
            startNode,
            endNode,
            blockedNodes,
            weightNodes
          );
          setInitialValues();
        }
      }
    }
  }
};

// RECURSIVE DIVISION
window.RDM = function (orientation) {
  control.removeNodeStyles();
  blockedNodes = [];
  for (const el of document.querySelectorAll("td")) {
    el.classList.remove("blocked");
  }
  let counter = 0;
  const xd = algorithms.recursiveDivision(COLUMNS, ROWS, orientation);
  for (const el of xd) {
    setTimeout(() => {
      if (el != startNode && el != endNode) {
        document.getElementById(el).classList.add("blocked");
        blockedNodes.push(el);
      }
    }, 10 * counter);
    counter++;
  }

  control.disableButtons(counter, 10);
};

window.randomMaze = function () {
  control.removeNodeStyles();
  blockedNodes = [];
  for (const el of document.querySelectorAll("td")) {
    el.classList.remove("blocked");
  }
  const toBeBlocked = algorithms.randomMaze(ROWS, COLUMNS);
  let counter = 0;
  for (const el of toBeBlocked) {
    setTimeout(() => {
      if (el != startNode && el != endNode) {
        document.getElementById(el).classList.add("blocked");
        blockedNodes.push(el);
      }
    }, 1 * counter);
    counter++;
  }

  control.disableButtons(counter, 1);
};

window.stripesMaze = function () {
  control.removeNodeStyles();
  blockedNodes = [];
  for (const el of document.querySelectorAll("td")) {
    el.classList.remove("blocked");
  }
  let counter = 0;
  const xd = algorithms.stripesMaze(ROWS, COLUMNS);
  for (const el of xd) {
    setTimeout(() => {
      if (el != startNode && el != endNode) {
        document.getElementById(el).classList.add("blocked");
        blockedNodes.push(el);
      }
    }, 10 * counter);
    counter++;
  }

  control.disableButtons(counter, 10);
};

document.getElementById('c5r8').setAttribute('disabled', 'true');

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

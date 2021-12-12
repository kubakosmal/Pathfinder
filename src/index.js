const algorithms = require("./scripts/algorithms.js");
const control = require("./scripts/control.js");
const {
  lightRecursiveDivision,
} = require("./scripts/lightRecursiveDivision.js");


// GLOBAL VARS
let blockedNodes = [];
let startNode = "c5r8";
let endNode = "c30r8";
const ROWS = 33;
const COLUMNS = 49;
// GLOBAL VARS

// MAKING GRID FIRST
control.makeGrid(ROWS, COLUMNS);
// END OF MAKING GRID

// SET INITIAL START AND END FUNCTION
function setInitialValues() {
  let setInitialStart = document.getElementById(startNode);
  let setInitialEnd = document.getElementById(endNode);
  setInitialStart.classList.toggle("start");
  setInitialEnd.classList.toggle("end");
  blockedNodes = [];
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
  let choosedAlgorithm = document.querySelector('input[name="checked-algorithm"]:checked').value;
  console.log(choosedAlgorithm)


  // erase visited and shortest path classes
  let alreadyVisited = document.querySelectorAll("td");
  for (let el of alreadyVisited) {
    el.removeAttribute("style");
    el.classList.remove('visited');
    el.classList.remove('shortest-path-node');
  }

  if (choosedAlgorithm == "bfs") {
    control.visualizeBfs(ROWS, COLUMNS, startNode, endNode, blockedNodes);
  } else if (choosedAlgorithm == "astar") {
    control.visualizeAstar(ROWS, COLUMNS, startNode, endNode, blockedNodes);
  }

  // set dynamic pathFinding to TRUE
  /* dynamicPathfinding = true; */
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

  // make new graph
};

// FUNCTION TO DRAW
let isMouseDown = false;

// SET OF ALREADY VISITED WHEN MOUSE MOVING
let newBlockedSet = new Set();

// NEW SET OF UNBLOCKED
let newUnblockedSet = new Set();

// determine if first touch was on blocked or unlocked
let lock = true;

let clickedOnStart = false;
let clickedOnEnd = false;

window.mouseDown = function (elementId) {
  isMouseDown = true;

  let currentlyClicked = document.getElementById(elementId);

  // if currently clicked has class of 'blocked'
  if (currentlyClicked.classList.contains("blocked")) {
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

  // update blocked nodes

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

  // !!!
  clickedOnStart = false;
  clickedOnEnd = false;
};

window.mouseMoved = function (elementId) {
  if (isMouseDown) {
    // get id of currently clicked element
    let currentlyTouched = document.getElementById(elementId);

    // if clicked on blocked or unblocked
    if (!clickedOnStart && !clickedOnEnd) {
      // if state == blocked
      if (buttonState == "blocked") {
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
      }
    }
    // if clicked on start
    else if (clickedOnStart && !clickedOnEnd) {
      // if start id is different than currently clicked
      if (startNode != elementId) {
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
        control.dynamicAnimate(ROWS, COLUMNS, startNode, endNode, blockedNodes);
      }
    }
    // if clicked on end
    else if (clickedOnEnd && !clickedOnStart) {
      // if start id is different than currently clicked
      if (endNode != elementId) {
        let cells = document.getElementsByTagName("td");
        for (let x of cells) {
          x.classList.remove("end");
        }

        // add class end to currently touched
        currentlyTouched.classList.add("end");
        // make currently touched new end node
        endNode = elementId;
      }
    }
  }
};

// RECURSIVE DIVISION
window.RDM = function () {
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

rundDfsMaze(); */
/* algorithms.dfsMaze(); */

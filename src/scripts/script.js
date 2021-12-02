const algorithms = require('./algorithms.js')
const control = require('./control.js')
const {recursiveDivision} = require('./recursiveDivision.js')





// GLOBAL VARS
let blockedNodes = [];
let startNode = 'c5r8';
let endNode = 'c30r8';
const ROWS = 30;
const COLUMNS = 70;
// GLOBAL VARS






// MAKING GRID FIRST
control.makeGrid(ROWS, COLUMNS);
// END OF MAKING GRID


// SET INITIAL START AND END FUNCTION
function setInitialValues() {
  let setInitialStart = document.getElementById(startNode);
  let setInitialEnd = document.getElementById(endNode);
  setInitialStart.classList.toggle('start');
  setInitialEnd.classList.toggle('end');
  blockedNodes = [];
}
setInitialValues();
// END OF SET INITAL FUNCTION


// button state
var buttonState = 'blocked';

function stateStart() {
  buttonState = 'start';
}

function stateEnd() {
  buttonState = 'end';
}

function stateBlock() {
  buttonState = 'blocked';
}
// button state //





// CHANGING STATE FUNCTION
function changeState(clickedId) {

  // if it is blocked click
  if (buttonState == 'blocked') {
    
    // if its not start or end
    let cell = document.getElementById(clickedId);
    if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
      // if blocked incluides ID
      if (blockedNodes.includes(clickedId)) {
        blockedNodes = blockedNodes.filter(node => node != clickedId);
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
    let cells = document.getElementsByTagName('td');
    for (let x of cells) {
      x.classList.remove(buttonState);
    }

    // select cell
    let cell = document.getElementById(clickedId);
    cell.classList.toggle(buttonState);
    
  
    // if start, change starting node ID
    if (buttonState == 'start') {
      startNode = clickedId;
    } else {
    // if end, change ending node ID
    endNode = clickedId;
    }
  }
}
// END OF CHANGING STATE FUNCTION





// USAGE OF APP


window.run = function() {
  // determine algorithm
  let choosedAlgorithm = document.getElementById('choose-algorithm').value;

  if (choosedAlgorithm == 'bfs') {
    control.visualizeBfs(ROWS, COLUMNS, startNode, endNode, blockedNodes);
  }
  else if (choosedAlgorithm == 'astar') {
    control.visualizeAstar(ROWS, COLUMNS, startNode, endNode, blockedNodes);
  }

}																																															

// CLEAR BOARD FUNCTION
window.clearBoard = function() {
  document.querySelector('.start').classList.toggle('start');
  document.querySelector('.end').classList.toggle('end');

  let blockedNodesList = document.querySelectorAll('.blocked');
  for (let el of blockedNodesList) {
    el.classList.remove('blocked');
  }

  let visitedNodes = document.querySelectorAll('.visited');
  for (let el of visitedNodes) {
    el.classList.remove('visited');
    el.removeAttribute('style');
  }

  let pathNodes = document.querySelectorAll('.shortest-path-node');
  for (let el of pathNodes) {
    el.classList.remove('shortest-path-node');
    el.removeAttribute('style');
  }

  setInitialValues();

  // make new graph
}





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

window.mouseDown = function(elementId) {
  isMouseDown = true;

  let currentlyClicked = document.getElementById(elementId);

  // if currently clicked has class of 'blocked'
  if (currentlyClicked.classList.contains('blocked')) {
    lock = false;
  } else {
    lock = true;
  }

  // if clicked on start or end
  if (currentlyClicked.classList.contains('start')) {
    clickedOnStart = true;
  } else if (currentlyClicked.classList.contains('end')) {
    clickedOnEnd = true;
  }
}

window.mouseUp = function() {
  isMouseDown = false;

  // update blocked nodes

  // adding
  let newBlockedNodes = Array.from(newBlockedSet);
  blockedNodes = blockedNodes.concat(newBlockedNodes);
  newBlockedSet = new Set();

  // deleting
  let newUnblockedNodes = Array.from(newUnblockedSet);
  blockedNodes = blockedNodes.filter(item => !newUnblockedNodes.includes(item));
  newUnblockedSet = new Set();

  // !!!
  clickedOnStart = false;
  clickedOnEnd = false;
}


window.mouseMoved = function(elementId) {
  
  if (isMouseDown) {

    // get id of currently clicked element
    let currentlyTouched = document.getElementById(elementId);


    // if clicked on blocked or unblocked 
    if (!clickedOnStart && !clickedOnEnd) {
      // if state == blocked
      if (buttonState == 'blocked') {
      
        // if its not start or end element
        if (!currentlyTouched.classList.contains('start') && !currentlyTouched.classList.contains('end')) {
          if (lock) {
            currentlyTouched.classList.add('blocked');
            newBlockedSet.add(elementId);
          } else {
              currentlyTouched.classList.remove('blocked');
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
        let cells = document.getElementsByTagName('td');
        for (let x of cells) {
          x.classList.remove('start');
        }
        // add class start to currently touched
        currentlyTouched.classList.add('start');
        // make currently touched new start node
        startNode = elementId;
      }
    }
    // if clicked on end
    else if (clickedOnEnd && !clickedOnStart) {
      // if start id is different than currently clicked
      if (endNode != elementId) {
        let cells = document.getElementsByTagName('td');
        for (let x of cells) {
          x.classList.remove('end');
        }

        // add class end to currently touched
        currentlyTouched.classList.add('end');
        // make currently touched new end node
        endNode = elementId;
      }
    }
    
  }
}


window.makeMaze = function() {
  // make starting and ending point
  let cells = document.getElementsByTagName('td');
    for (let x of cells) {
      x.classList.remove('start');
      x.classList.remove('end');
    }
  
  document.getElementById('c0r0').classList.add('start');
  startNode = 'c0r0';

  document.getElementById('c68r28').classList.add('end');
  endNode = 'c68r28';

  blockedNodes = MAZE1;

  let delay = 1;
  for (let el of blockedNodes) {
    setTimeout(() => {
      document.getElementById(el).classList.toggle('blocked');
    }, 20 * delay);
    delay++; 
  }
}

// TESTING RECURSIVE DIVISION
let xd = recursiveDivision(COLUMNS, ROWS);
for(let el of xd) {
  document.getElementById(el).classList.add('blocked');
}
// ;)
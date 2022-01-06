const { gsap } = require("gsap/dist/gsap");
const algorithms = require("./algorithms.js");
const { aStar } = require("./astar.js");
const { animate, spring } = require("motion");
const anime = require('animejs');

// graph filtering function
function filterGraph(graph, blocked) {
  for (let el in graph) {
    graph[el] = graph[el].filter((item) => !blocked.includes(item));

    if (blocked.includes[el]) {
      delete graph[el];
    }
  }
}

// instant animate for dynamic pathfinding
function instantAnimate(visited, path) {
  for (let el of visited) {
    document.getElementById(el).classList.toggle("visited");
    document.getElementById(el).classList.toggle("already");
  }

  console.log(path);
  for (let el of path) {
    document.getElementById(el).classList.toggle("visited");
    document.getElementById(el).classList.add("shortest-path-node");
  }
}

// animate graph function
function animateGraph(visited, path) {
  let delay = 1;

  let vlen = visited.length;

  let duration = 25;

  // animate visited nodes
  for (let i = 0; i < vlen; i++) {
    document.getElementById(visited[i]).classList.add("already");
    setTimeout(function () {
      
      // motion one
      animate(
        document.getElementById(visited[i]),
        {
          transform: [ "scale(.8)", 'scale(.3)', 'scale(1)'/* , 'scale(1.1)', 'scale(1)' */],
          backgroundColor: ["#0F1115",  "#FF2965", "#0D63F8",  "#00FFDB"],
          /* borderColor: 'rgba(133,150,193, .5)', */
          borderRadius: ["25%", "100%", '20%', '0%'],
        },
        { duration: 1,
        easing: 'ease-out' }
      );

      // gsap
      /* gsap.timeline().from(document.getElementById(visited[i]), {
        scale: 0.5,
        backgroundColor: '#FF2965',
        borderRadius: '100%',
        borderColor: '#FF2965'
      })
      .to(
        document.getElementById(visited[i]),
        {scale: 1.3,
        backgroundColor: '#0D63F8',
        borderRadius: '20%',
      borderColor: '#0D63F8'},
        
      )
      .to(
        document.getElementById(visited[i]),
        {scale: 1,
        backgroundColor: '#31A6FA',
        borderRadius: '0%',
      borderColor: 'rgba(133,150,193,0.1)'}
      ) */

      // animejs
      /*  anime({
        targets: document.getElementById(visited[i]),
        scale: [0.3, 1.2, 1],
        borderRadius: ["100%", "50%", "25%", "0%"],
        backgroundColor: ["#DB2763", "#B0DB43", "#12EAEA", "#BCE7FD"],
        easing: "linear",
        duration: 1500,
      }); */
    }, duration * delay);

    delay++;
  }

  let pathLen = path.length;

  // animate path
  delay += 20;
  for (let i = 0; i < pathLen; i++) {
    document.getElementById(path[i]).classList.add("already");
    setTimeout(function () {
      let currentVisited = document.getElementById(path[i]);
      

      // motion one
      animate(
        document.getElementById(path[i]),
        {
          /* transform: ["scale(1)", "scale(.3)", "scale(1)"], */
          opacity: [0.1, 1],
          backgroundColor: ["#31A6FA", "#FF2965", "#FFF208"],
          /* borderRadius: ["25%", "75%", "0%"], */
          borderColor: ["#31A6FA", "#FF2965", "#FFF208"]
        },
        { duration: .8,
        easing: 'ease-in' }
      );

      // animejs
      /* anime({
        targets: document.getElementById(path[i]),
        scale: [1.2, 1],
        backgroundColor: ['#D86E8A', '#FFE20A'],
        borderColor: ['#D86E8A', '#FFE20A'],
        duration: 1500
      }) */
    }, duration * delay);

    delay += 2;
  }

  // disable buttons
  /* let buttons = document.querySelectorAll(".button");

  for (let el of buttons) {
    el.disabled = true;
    el.classList.toggle("inactive");
  }

  for (let el of buttons) {
    setTimeout(() => {
      el.disabled = false;
      el.classList.toggle("inactive");
    }, 25 * delay);
  } */

  return [delay, duration];
}

// make a grid function
function makeGrid(rows, cols) {
  for (let x = 0; x < rows; x++) {
    // adding row to table
    let tabela = document.querySelector(".tabela");
    tabela.innerHTML += `<tr id='r${x}'></tr>`;
    for (let j = 0; j < cols; j++) {
      // adding td to row
      let trow = document.getElementById(`r${x}`);
      trow.innerHTML += `<td id='c${j}r${x}'  draggable='false' ondragstart="return false;" ondrop="return false;" onclick='changeState(this.id)' onmousedown='mouseDown(this.id)' onmouseup='mouseUp()' onmousemove='mouseMoved(this.id)' ></td>`;
    }
  }
}

// SET INITIAL VALUES FUNCTION
function setInitialValues() {
  let setInitialStart = document.getElementById(startNode);
  let setInitialEnd = document.getElementById(endNode);
  setInitialStart.classList.toggle("start");
  setInitialEnd.classList.toggle("end");
  blockedNodes = [];
}

// make a graph function
function makeGraph(rows, cols) {
  let graph = Object.create(null);

  // for every row
  for (let i = 0; i < rows; i++) {
    // for every col
    for (let j = 0; j < cols; j++) {
      // if it is first row
      if (i == 0) {
        // if it is first col
        if (j == 0) {
          graph[`c${j}r${i}`] = [`c${j + 1}r${i}`, `c${j}r${i + 1}`];
        }
        // if it is last col
        else if (j == cols - 1) {
          graph[`c${j}r${i}`] = [`c${j - 1}r${i}`, `c${j}r${i + 1}`];
        }
        // if row == 0 and col != 0 and col != 75
        else {
          graph[`c${j}r${i}`] = [
            `c${j - 1}r${i}`,
            `c${j + 1}r${i}`,
            `c${j}r${i + 1}`,
          ];
        }
      }

      // if last row
      else if (i == rows - 1) {
        // if first col
        if (j == 0) {
          graph[`c${j}r${i}`] = [`c${j + 1}r${i}`, `c${j}r${i - 1}`];
        }
        // if last col
        else if (j == cols - 1) {
          graph[`c${j}r${i}`] = [`c${j - 1}r${i}`, `c${j}r${i - 1}`];
        }

        // if middle col
        else {
          graph[`c${j}r${i}`] = [
            `c${j}r${i - 1}`,
            `c${j + 1}r${i}`,
            
            `c${j - 1}r${i}`,
          ];
        }
      }

      // if middle row
      else {
        // if first col
        if (j == 0) {
          graph[`c${j}r${i}`] = [
            `c${j + 1}r${i}`,
            `c${j}r${i + 1}`,
            `c${j}r${i - 1}`,
          ];
        }
        // if last col
        else if (j == cols - 1) {
          graph[`c${j}r${i}`] = [
            `c${j - 1}r${i}`,
            `c${j}r${i + 1}`,
            `c${j}r${i - 1}`,
          ];
        }
        // if middle row and middle column
        else {
          graph[`c${j}r${i}`] = [
            `c${j - 1}r${i}`,
            `c${j + 1}r${i}`,
            `c${j}r${i + 1}`,
            `c${j}r${i - 1}`,
            
          ];
        }
      }

      //end of j loop
    }

    // end of i loop
  }

  return graph;
}

function makeWeightedGraph(rows, cols) {
  let graph = Object.create(null);

  let propName1, propName2, propName3, propName4;

  // for every row
  for (let i = 0; i < rows; i++) {
    // for every column
    for (let j = 0; j < cols; j++) {
      // if top left
      if (i == 0 && j == 0) {
        propName1 = `c${j + 1}r${i}`;
        propName2 = `c${j}r${i + 1}`;
        graph[`c${j}r${i}`] = {
          [propName1]: { weight: 1, heuristic: 0 },
          [propName2]: { weight: 1, heuristic: 0 },
        };
      }
      // if top right
      else if (i == 0 && j == cols - 1) {
        propName1 = `c${j - 1}r${i}`;
        propName2 = `c${j}r${i + 1}`;
        
        graph[`c${j}r${i}`] = {
          [propName1]: { weight: 1, heuristic: 0 },
          [propName2]: { weight: 1, heuristic: 0 },
          
        };
      }
      // if bottom left
      else if (i == rows - 1 && j == 0) {
        propName1 = `c${j}r${i - 1}`;
        
        propName2 = `c${j + 1}r${i}`;
        graph[`c${j}r${i}`] = {
          [propName1]: { weight: 1, heuristic: 0 },
          
          [propName2]: { weight: 1, heuristic: 0 },
        };
      }
      // if bottom right
      else if (i == rows - 1 && j == cols - 1) {
        propName1 = `c${j}r${i - 1}`;
        propName2 = `c${j - 1}r${i}`;
        
        graph[`c${j}r${i}`] = {
          [propName1]: { weight: 1, heuristic: 0 },
          [propName2]: { weight: 1, heuristic: 0 },
          
        };
      }
      // if top
      else if (i == 0) {
        propName1 = `c${j - 1}r${i}`;
        propName2 = `c${j + 1}r${i}`;
        propName3 = `c${j}r${i + 1}`;
        graph[`c${j}r${i}`] = {
          [propName1]: { weight: 1, heuristic: 0 },
          [propName2]: { weight: 1, heuristic: 0 },
          [propName3]: { weight: 1, heuristic: 0 },
        };
      }
      // if bottom
      else if (i == rows - 1) {
        propName1 = `c${j}r${i - 1}`;
        propName2 = `c${j + 1}r${i}`;
        propName3 = `c${j - 1}r${i}`;
        graph[`c${j}r${i}`] = {
          [propName1]: { weight: 1, heuristic: 0 },
          [propName2]: { weight: 1, heuristic: 0 },
          [propName3]: { weight: 1, heuristic: 0 },
        };
      }
      // if left
      else if (j == 0) {
        propName1 = `c${j}r${i - 1}`;
        propName2 = `c${j}r${i + 1}`;
        propName3 = `c${j + 1}r${i}`;
        graph[`c${j}r${i}`] = {
          [propName1]: { weight: 1, heuristic: 0 },
          [propName2]: { weight: 1, heuristic: 0 },
          [propName3]: { weight: 1, heuristic: 0 },
        };
      }
      // if right
      else if (j == cols - 1) {
        propName1 = `c${j}r${i - 1}`;
        propName2 = `c${j}r${i + 1}`;
        propName3 = `c${j - 1}r${i}`;
        graph[`c${j}r${i}`] = {
          [propName1]: { weight: 1, heuristic: 0 },
          [propName2]: { weight: 1, heuristic: 0 },
          [propName3]: { weight: 1, heuristic: 0 },
        };
      }
      // if middle
      else {
        propName1 = `c${j - 1}r${i}`;
        propName2 = `c${j + 1}r${i}`;
        propName3 = `c${j}r${i + 1}`;
        propName4 = `c${j}r${i - 1}`;
        graph[`c${j}r${i}`] = {
          [propName1]: { weight: 1, heuristic: 0 },
          [propName2]: { weight: 1, heuristic: 0 },
          [propName3]: { weight: 1, heuristic: 0 },
          [propName4]: { weight: 1, heuristic: 0 },
        };
      }
    }
  }
  return graph;
}

function filterWeightedGraph(graph, blocked, weightNodes) {
  for (let el in graph) {
    // filter from properties
    for (let le in graph[el]) {
      if (blocked.includes(le)) {
        delete graph[el][le];
      }
      if (weightNodes.includes(le)) {
        console.log(le);
        graph[el][le].weight = 2;
      }
    }

    // delete obj if it is blocked
    if (blocked.includes(el)) {
      delete graph[el];
    }
  }
}

// visualize aStar function
function visualizeAstar(
  ROWS,
  COLUMNS,
  startNode,
  endNode,
  blockedNodes,
  weightNodes
) {
  // making graph
  let graph = makeWeightedGraph(ROWS, COLUMNS);

  // filtering graph
  filterWeightedGraph(graph, blockedNodes, weightNodes);

  // finding shortest path
  let ecie = algorithms.aStar(graph, startNode, endNode);

  console.log(ecie);

  // if there's no shortest path
  if (typeof ecie === "undefined") {
    document.getElementById("no-path").removeAttribute("hidden");
  }
  // if everything went good
  else {
    document.getElementById("no-path").setAttribute("hidden", "true");

    // animate graph
    
    let timeoutTime = animateGraph(ecie.visited, ecie.path);

    // disable buttons for running time
    disableButtons(timeoutTime[0], timeoutTime[1]);
  }
}

// visualize BFS function
function visualizeBfs(ROWS, COLUMNS, startNode, endNode, blockedNodes) {
  // making graph
  let graph = makeGraph(ROWS, COLUMNS);

  // filtering graph
  filterGraph(graph, blockedNodes);

  // finding shortest path
  let ecie = algorithms.bfs(graph, startNode, endNode);

  console.log(ecie);

  // if there's no shortest path
  if (typeof ecie === "undefined") {
    document.getElementById("no-path").removeAttribute("hidden");
  }
  // if everything went good
  else {
    document.getElementById("no-path").setAttribute("hidden", "true");
    let timeoutTime = animateGraph(ecie.visited, ecie.path);

    // disable buttons for running time
    disableButtons(timeoutTime);
  }

  
}

// visualize DFS function
function visualizeDfs(ROWS, COLUMNS, startNode, endNode, blockedNodes) {
  let graph = makeGraph(ROWS, COLUMNS);

  filterGraph(graph, blockedNodes);

  let ecie = algorithms.dfs(graph, startNode, endNode);

  console.log(ecie);

  // if there's no shortest path
  if (typeof ecie === "undefined") {
    document.getElementById("no-path").removeAttribute("hidden");
  }
  // if everything went good
  else {
    document.getElementById("no-path").setAttribute("hidden", "true");
    let timeoutTime = animateGraph(ecie.visited, ecie.path);
    disableButtons(timeoutTime);
  }
}

// visualize Dijkstra function
function visualizeDijkstra(
  ROWS,
  COLUMNS,
  startNode,
  endNode,
  blockedNodes,
  weightNodes
) {
  // making graph
  let graph = makeWeightedGraph(ROWS, COLUMNS);

  // filtering graph
  filterWeightedGraph(graph, blockedNodes, weightNodes);

  // finding shortest path
  let ecie = algorithms.dijkstra(graph, startNode, endNode);

  console.log(ecie);

  // if there's no shortest path
  if (typeof ecie === "undefined") {
    document.getElementById("no-path").removeAttribute("hidden");
  }
  // if everything went good
  else {
    document.getElementById("no-path").setAttribute("hidden", "true");
    let timeoutTime = animateGraph(ecie.visited, ecie.path);
    disableButtons(timeoutTime);
  }
}

// dynamic pathfinding function
function dynamicAnimate(
  ROWS,
  COLUMNS,
  startNode,
  endNode,
  blockedNodes,
  weightNodes
) {
  console.log("INSIDE DYNAMIC FUNCTION, BLOCKEDNODES BELOW");
  console.log(blockedNodes)                            
  // get the value of checked radio button
  let choosedAlgorithm = document.querySelector(
    'input[name="checked-algorithm"]:checked'
  ).value;

  // making graph
  let graph = makeGraph(ROWS, COLUMNS);
  let weightedGraph = makeWeightedGraph(ROWS, COLUMNS);

  // filtering graph
  filterGraph(graph, blockedNodes);
  filterWeightedGraph(weightedGraph, blockedNodes, weightNodes);

  if (choosedAlgorithm == "bfs") {
    // finding shortest path
    let visitedAndPath = algorithms.bfs(graph, startNode, endNode);
    instantAnimate(visitedAndPath.visited, visitedAndPath.path);
  } else if (choosedAlgorithm == "astar") {
    let visitedAndPath = algorithms.aStar(weightedGraph, startNode, endNode);
    instantAnimate(visitedAndPath.visited, visitedAndPath.path);
  } else if (choosedAlgorithm == "dijkstra") {
    let visitedAndPath = algorithms.dijkstra(weightedGraph, startNode, endNode);
    instantAnimate(visitedAndPath.visited, visitedAndPath.path);
  } else if (choosedAlgorithm == 'dfs') {
    let visitedAndPath = algorithms.dfs(graph, startNode, endNode);
    instantAnimate(visitedAndPath.visited, visitedAndPath.path);
  }
}

function disableButtons(timeoutTime, duration) {
  timeoutTime += duration;
  let buttons = document.querySelectorAll("button");
  let mazes = document.querySelectorAll(".maze")

  for (let el of buttons) {
    el.disabled = true;
    el.classList.toggle("inactive");
  }

  for (let el of buttons) {
    setTimeout(() => {
      el.disabled = false;
      el.classList.toggle("inactive");
    }, duration * timeoutTime);
  }

  for (let el of mazes) {
    el.disabled = true;
    el.classList.toggle("inactive");
  }

  for (let el of mazes) {
    setTimeout(() => {
      el.disabled = false;
      el.classList.toggle("inactive");
    }, duration * timeoutTime);
  }

  // disactivate start and end
  let start = document.getElementById('')
}

function calculateCellQuantity(cellSize) {
  let containerWidth = document.querySelector(".tabela").offsetWidth;
  let containerHeight = document.querySelector(".tabela").offsetHeight;
  console.log(containerWidth);
  console.log(containerHeight);
  let numOfCols = Math.floor(containerWidth / cellSize);
  let numOfRows = Math.floor(containerHeight / cellSize);
  if (numOfCols % 2 == 0) {
    numOfCols--;
  } else if (numOfRows % 2 == 0) {
    numOfRows--;
  } 
  return [numOfCols, numOfRows];
}

function removeNodeStyles() {
  let allNodesToErase = document.querySelectorAll(".already");
  console.log("NODES TO ERASE BELOW");
  console.log(allNodesToErase);
  for (let el of allNodesToErase) {
    el.removeAttribute("style");
    el.classList.remove('visited');
    el.classList.remove('shortest-path-node');
    el.classList.remove('already')
  }
}

function initialAnimations() {
  let logo = document.querySelector('.logo');
  let gitAnchor = document.querySelector('a');
  let main = document.querySelector('.main');
  let logoImg = document.querySelector('.logo-image')

  animate(
    logo,
    {
      opacity: [0, 1],
      transform: ['translate(-500px, 0px)', 'translate(0px, 0px)']
    },
    {duration: 1}
  )

  setTimeout(() => {
    animate(
      gitAnchor,
      {
        opacity: [0, 1],
        transform: ['translate(500px, 0px)', 'translate(0px, 0px)'],
      },
      {duration: 1}
    )
  }, 1)

  setTimeout(() => {
    animate(
      logoImg,
      {
        transform: ['scale(1)', 'scale(1.3)', 'scale(1)'],
      },
      {duration: 1.2}
    )
  }, 1300)

  /* setTimeout(() => {
    animate(
      logoImg,
      {
        transform: ['rotateY(360deg)'],
      },
      {duration: 1}
    )
  }, 1500) */

  animate(
    main,
    {
      opacity: [0, 1],
      transform: ['translate(0px, 500px)', 'translate(0px, 0px)'],
    },
    {duration: 1}
  )
}
module.exports = {
  filterGraph,
  animateGraph,
  makeGrid,
  setInitialValues,
  makeGraph,
  makeWeightedGraph,
  filterWeightedGraph,
  visualizeAstar,
  visualizeBfs,
  visualizeDfs,
  visualizeDijkstra,
  dynamicAnimate,
  calculateCellQuantity,
  removeNodeStyles,
  disableButtons,
  initialAnimations
};

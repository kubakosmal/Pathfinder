const { gsap } = require("gsap/dist/gsap");
const algorithms = require("./algorithms.js");
const { aStar } = require("./astar.js");

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
    gsap.to(document.getElementById(el), {
      backgroundColor: "#BCE7FD",
    });
  }

  console.log(path);
  for (let el of path) {
    document.getElementById(el).classList.add("shortest-path-node");

    gsap.to(document.getElementById(el), {
      backgroundColor: "#FFE20A",
      borderColor: "#FFE20A",
    });
  }
}

// animate graph function
function animateGraph(visited, path) {
  let delay = 1;

  let vlen = visited.length;
  
  for (let i = 0; i < vlen; i++) {
    setTimeout(function () {
      document.getElementById(visited[i]).classList.toggle("visited");

      //gsap
      gsap
        .timeline()
        .fromTo(
          document.getElementById(visited[i]),
          {
            scale: 0.3,
            borderRadius: "100%",
            backgroundColor: "#B0DB43",
          },
          {
            scale: 1.1,
            borderRadius: "25%",
            backgroundColor: "#12EAEA",
          }
        )
        .to(document.getElementById(visited[i]), {
          scale: 1,
          borderRadius: "0%",
          backgroundColor: "#BCE7FD",
        });

      // animejs
      /*  anime({
        targets: document.getElementById(visited[i]),
        scale: [0.3, 1.2, 1],
        borderRadius: ["100%", "50%", "25%", "0%"],
        backgroundColor: ["#DB2763", "#B0DB43", "#12EAEA", "#BCE7FD"],
        easing: "linear",
        duration: 1500,
      }); */
    }, 15 * delay);

    delay++;
  }

  let pathLen = path.length;

  // if promise resolved
  delay += 20;
  for (let i = 0; i < pathLen; i++) {
    setTimeout(function () {
      let currentVisited = document.getElementById(path[i]);
      currentVisited.classList.toggle("visited");
      currentVisited.classList.toggle("shortest-path-node");

      gsap
        .timeline()
        .to(document.getElementById(path[i]), {
          scale: 1.1,
          backgroundColor: "#D86E8A",
          borderColor: "#D86E8A",
        })
        .to(document.getElementById(path[i]), {
          scale: 1,
          backgroundColor: "#FFE20A",
          borderColor: "#FFE20A",
        });

      // animejs
      /* anime({
        targets: document.getElementById(path[i]),
        scale: [1.2, 1],
        backgroundColor: ['#D86E8A', '#FFE20A'],
        borderColor: ['#D86E8A', '#FFE20A'],
        duration: 1500
      }) */
    }, 15 * delay);

    delay += 2;
  }

  return delay;
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
            `c${j - 1}r${i}`,
            `c${j + 1}r${i}`,
            `c${j}r${i - 1}`,
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
            `c${j + 1}r${i}`,
            `c${j - 1}r${i}`,
            `c${j}r${i - 1}`,
            `c${j}r${i + 1}`,
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
        propName3 = `c${j - 1}r${i + 1}`;
        graph[`c${j}r${i}`] = {
          [propName1]: { weight: 1, heuristic: 0 },
          [propName2]: { weight: 1, heuristic: 0 },
          [propName3]: { weight: 1, heuristic: 0 },
        };
      }
      // if bottom left
      else if (i == rows - 1 && j == 0) {
        propName1 = `c${j}r${i - 1}`;
        propName2 = `c${j + 1}r${i - 1}`;
        propName3 = `c${j + 1}r${i}`;
        graph[`c${j}r${i}`] = {
          [propName1]: { weight: 1, heuristic: 0 },
          [propName2]: { weight: 1, heuristic: 0 },
          [propName3]: { weight: 1, heuristic: 0 },
        };
      }
      // if bottom right
      else if (i == rows - 1 && j == cols - 1) {
        propName1 = `c${j}r${i - 1}`;
        propName2 = `c${j - 1}r${i}`;
        propName3 = `c${j - 1}r${i - 1}`;
        graph[`c${j}r${i}`] = {
          [propName1]: { weight: 1, heuristic: 0 },
          [propName2]: { weight: 1, heuristic: 0 },
          [propName3]: { weight: 1, heuristic: 0 },
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

function filterWeightedGraph(graph, blocked) {
  for (let el in graph) {
    // filter from properties
    for (let le in graph[el]) {
      if (blocked.includes(le)) {
        delete graph[el][le];
      }
    }

    // delete obj if it is blocked
    if (blocked.includes(el)) {
      delete graph[el];
    }
  }
}

// visualize aStar function
function visualizeAstar(ROWS, COLUMNS, startNode, endNode, blockedNodes) {
  // making graph
  let graph = makeWeightedGraph(ROWS, COLUMNS);

  // filtering graph
  filterWeightedGraph(graph, blockedNodes);

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
    disableButtons(timeoutTime);
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
    animateGraph(ecie.visited, ecie.path);
  }
}

// dynamic pathfinding function
function dynamicAnimate(ROWS, COLUMNS, startNode, endNode, blockedNodes) {
  // determine algorithm
  let choosedAlgorithm = document.getElementById("choose-algorithm").value;

  // making graph
  let graph = makeGraph(ROWS, COLUMNS);

  // filtering graph
  filterGraph(graph, blockedNodes);

  if (choosedAlgorithm == "bfs") {
    // finding shortest path
    let visitedAndPath = algorithms.bfs(graph, startNode, endNode);
    instantAnimate(visitedAndPath.visited, visitedAndPath.path);
  } else if (choosedAlgorithm == "astar") {
    let visitedAndPath = algorithms.aStar(graph, startNode, endNode);
    instantAnimate(visitedAndPath.visited, visitedAndPath.path);
  }
}

function disableButtons(timeoutTime) {
  timeoutTime += 20;
  let buttons = document.querySelectorAll('.button');

  for (let el of buttons) {
    el.disabled = true;
    el.classList.toggle('inactive');
  }

  for (let el of buttons) {
    setTimeout(() => {
      el.disabled = false;
      el.classList.toggle('inactive');
    }, 25 * timeoutTime);
  }
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
  dynamicAnimate,
};

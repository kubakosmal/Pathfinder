function lightRecursiveDivision(width, height) {
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

      console.log(randomColumnToSkip);

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

  divideGraph(1, width - 2, 1, height - 2, "vertical");
  console.log(passages);
  return blockedNodes;
}

module.exports = { lightRecursiveDivision };

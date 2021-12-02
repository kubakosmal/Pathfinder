function recursiveDivision(width, height) {
    let blockedNodes = new Set();

    for (let i = 0; i < width; i++) {
        blockedNodes.add(`c${i}r0`);
        blockedNodes.add(`c${i}r29`);
    }

    for (let i = 0; i < height; i++) {
        blockedNodes.add(`c0r${i}`);
        blockedNodes.add(`c69r${i}`);
    }
    

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function chooseDirection(width, height) {
        if (width > height) {
            return 'vertical';
        } else if (height > width) {
            return 'horizontal';
        } else {
            let random = getRandomInt(1, 3) 
            if (random == 1) {
                return 'vertical';
            } else {return 'horizontal'};
        }
    }

    

    let passages = new Set();

    
    function divideGraph(width, height, colStart, colEnd, rowStart, rowEnd) {
        if (width < 3 || height < 3) {
            return;
        }

        let direction = chooseDirection(width, height);

        let randomRowStart;
        let randomColumnStart;

        if (direction == 'horizontal') {
            // if height 3 and there is a passage to the left, return
            if (height == 3 && (passages.has(`c${colStart - 1}r${rowStart + 1}`) || passages.has(`c${colEnd + 1}r${rowStart + 1}`))) {
                return;
            }

            // keep randomly choosing row start until its not surrounded
            do {
                randomRowStart = getRandomInt(rowStart, rowEnd);
            } while ((blockedNodes.has(`c${colStart}r${randomRowStart + 1}`) || blockedNodes.has(`c${colEnd}r${randomRowStart - 1}`)) || (blockedNodes.has(`c${colEnd}r${randomRowStart + 1}`) || blockedNodes.has(`c${colStart}r${randomRowStart - 1}`)) || passages.has(`c${colStart - 1}r${randomRowStart}`) || passages.has(`c${colEnd + 1}r${randomRowStart}`));
            

            // random node to skip
            let randomColumnToSkip = getRandomInt(colStart, colEnd + 1);

            // draw a wall
            for (let i = colStart; i <= colEnd; i++) {
                if (i != randomColumnToSkip) {
                    blockedNodes.add(`c${i}r${randomRowStart}`);
                }
                else {
                    passages.add(`c${i}r${randomRowStart}`);
                }
            }
        }
        else if (direction == 'vertical') {
            // if width 3 and there is a passage up, return
            if (width == 3 && (passages.has(`c${colStart + 1}r${rowStart - 1}`) || passages.has(`c${colStart + 1}r${rowEnd + 1}`))) {
                return;
            }

            // keep randomly choosing column until its not surrounded 
            do {
                randomColumnStart = getRandomInt(colStart, colEnd);
            } while ((blockedNodes.has(`c${randomColumnStart - 1}r${rowStart}`) || blockedNodes.has(`c${randomColumnStart + 1}r${rowStart}`)) || (blockedNodes.has(`c${randomColumnStart - 1}r${rowEnd}`) || blockedNodes.has(`c${randomColumnStart + 1}r${rowEnd}`)) || passages.has(`c${randomColumnStart}r${rowStart - 1}`) || passages.has(`c${randomColumnStart}r${rowEnd + 1}`));

            let randomRowToSkip = getRandomInt(rowStart, rowEnd + 1);

            // draw a wall
            for (let i = rowStart; i <= rowEnd; i++) {
                if (i != randomRowToSkip) {
                    blockedNodes.add(`c${randomColumnStart}r${i}`);
                }
                else {
                    passages.add(`c${randomColumnStart}r${i}`);
                }
            }
        }


        // divide
        let firstPart = {};
        let secondPart = {};
        if (direction == 'horizontal') {
            firstPart.width = width,
            firstPart.height = randomRowStart - rowStart,
            firstPart.colStart = colStart,
            firstPart.colEnd = colEnd,
            firstPart.rowStart = rowStart,
            firstPart.rowEnd = randomRowStart - 1

            secondPart.width = width,
            secondPart.height = rowEnd - randomRowStart,
            secondPart.colStart = colStart,
            secondPart.colEnd = colEnd,
            secondPart.rowStart = randomRowStart + 1,
            secondPart.rowEnd = rowEnd 
        }
        else if (direction == 'vertical') {
            firstPart.width = randomColumnStart - colStart;
            firstPart.height = height;
            firstPart.colStart = colStart;
            firstPart.colEnd = randomColumnStart - 1;
            firstPart.rowStart = rowStart,
            firstPart.rowEnd = rowEnd

            secondPart.width = colEnd - randomColumnStart;
            secondPart.height = height;
            secondPart.colStart = randomColumnStart + 1;
            secondPart.colEnd = colEnd;
            secondPart.rowStart = rowStart;
            secondPart.rowEnd = rowEnd;
        }
        
        divideGraph(firstPart.width, firstPart.height, firstPart.colStart, firstPart.colEnd, firstPart.rowStart, firstPart.rowEnd);
        divideGraph(secondPart.width, secondPart.height, secondPart.colStart, secondPart.colEnd, secondPart.rowStart, secondPart.rowEnd);
    }

    divideGraph(width - 2, height - 2, 1, width - 2, 1, height - 2);
    return blockedNodes;
}
module.exports = {
    recursiveDivision
}
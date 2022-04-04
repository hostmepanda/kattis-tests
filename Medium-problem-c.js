'use strict'

const readline = require('readline');

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputParams = [];

readlineInterface
  .on('line', (line) => {
    inputParams.push(line.split(' '));
  })
  .on('close', () => {
    processParams();
  });

const BINARY_USER = 0;
const DECIMAL_USER = 1;

const USER_TYPE = {
  BINARY: 'binary',
  DECIMAL: 'decimal',
  NEITHER: 'neither',
};

function getMapPointUser (locationMap, [rowPosition, columnPosition]) {
  if (locationMap[rowPosition][columnPosition] === BINARY_USER) {
    return BINARY_USER;
  } else {
    return DECIMAL_USER;
  }
}

function getUserTypeForInterestPath(locationMap, startPoint, endPoint) {
  const startPointUser = getMapPointUser(locationMap, startPoint);
  const endPointUser = getMapPointUser(locationMap, endPoint);
  
  const isStartEndPointSameUser = startPointUser === endPointUser;
  
  if (isStartEndPointSameUser) {
    return USER_TYPE[startPointUser];
  } else {
    return USER_TYPE.NEITHER;
  }
}

function initParams() {
  const [
    [rowsCount, colsCount],
  ] = inputParams;
  
  const locationMap = inputParams
    .slice(1, 1 + Number(rowsCount))
    .map(
      ([mapLine]) => mapLine.split(''),
    );
  
  const searchPathsPoints = inputParams
    .slice(1 + Number(rowsCount) + 1)
    .map(
      points => {
        const [startRow, startCol, endRow, endCol] = points;
        return [
          [Number(startRow) - 1, Number(startCol) - 1],
          [Number(endRow) - 1, Number(endCol) - 1],
        ];
      },
    );
  
  return {
    colsCount: Number(colsCount),
    locationMap,
    rowsCount: Number(rowsCount),
    searchPathsPoints,
  };
}

function processParams() {
  const {
    colsCount,
    locationMap,
    rowsCount,
    searchPathsPoints,
  } = initParams();
  
  const peopleKindUnions = new DisjointSetUnion(rowsCount, colsCount);
  
  for (let rowIndex = 0; rowIndex < rowsCount; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < colsCount; columnIndex += 1) {
      let index = rowIndex * colsCount + columnIndex;
      if (rowIndex !== 0) {
        if (locationMap[rowIndex-1][columnIndex] === locationMap[rowIndex][columnIndex]) {
          peopleKindUnions.uniteTrees(index, (rowIndex - 1) * colsCount + columnIndex);
        }
      }
      if (columnIndex !== 0) {
        if (locationMap[rowIndex][columnIndex-1] === locationMap[rowIndex][columnIndex]) {
          peopleKindUnions.uniteTrees(index,  rowIndex * colsCount + columnIndex - 1);
        }
      }
      if (rowIndex !== rowsCount - 1) {
        if (locationMap[rowIndex + 1][columnIndex] === locationMap[rowIndex][columnIndex]) {
          peopleKindUnions.uniteTrees(index, (rowIndex + 1) * colsCount + columnIndex);
        }
      }
      if (columnIndex !== colsCount - 1) {
        if (locationMap[rowIndex][columnIndex+1] === locationMap[rowIndex][columnIndex]) {
          peopleKindUnions.uniteTrees(index, rowIndex * colsCount + columnIndex + 1);
        }
      }
    }
  }
  
  searchPathsPoints.forEach(([startPoint, endPoint]) => {
    const [startRow, startColumn] = startPoint;
    const [endRow, endColumn] = endPoint;
    const index1 = startRow * colsCount + startColumn;
    const index2 = endRow * colsCount + endColumn;
    const isNeitherType = getUserTypeForInterestPath(locationMap, startPoint, endPoint) === USER_TYPE.NEITHER;
    if (isNeitherType) {
      console.log(USER_TYPE.NEITHER);
      return;
    }
    if (peopleKindUnions.findTreeRoot(index1) === peopleKindUnions.findTreeRoot(index2)) {
      const mapCellKind = Number(locationMap[startRow][startColumn]);
      console.log(mapCellKind === 1 ? USER_TYPE.DECIMAL : USER_TYPE.BINARY);
    } else {
      console.log(USER_TYPE.NEITHER);
    }
    
    return;
  });
  
  return 0;
}

class DisjointSetUnion {
  treeRank
  treeUnions
  
  constructor(rows, columns) {
    const elementsCount = rows * columns;
    
    this.treeRank = new Array(elementsCount);
    this.treeUnions = new Array(elementsCount);
    
    for (let index = 0; index < elementsCount; index += 1) {
      this.buildTreeRoot(index);
    }
  }
  
  buildTreeRoot(element) {
    this.treeUnions[element] = element;
    this.treeRank[element] = element;
  }
  
  findTreeRoot(element) {
    if (this.treeUnions[element] === element) {
      return element;
    }
    return this.treeUnions[element] = this.findTreeRoot(this.treeUnions[element]);
  }
  
  uniteTrees(leftTreeRoot, rightTreeRoot) {
    const leftRoot = this.findTreeRoot(leftTreeRoot);
    const rightRoot = this.findTreeRoot(rightTreeRoot);
    
    if (this.treeRank[leftRoot] < this.treeRank[rightRoot]) {
      this.treeUnions[leftRoot] = rightRoot;
    } else {
      this.treeUnions[rightRoot] = leftRoot;
      if (this.treeRank[rightRoot] === this.treeRank[leftRoot]) {
        this.treeRank[rightRoot] += 1;
      }
    }
  }
}
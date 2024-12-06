import { Result, Solution } from '../types';

enum Direction {
  Up = 'U',
  Down = 'D',
  Left = 'L',
  Right = 'R'
}

function turnRight(dir: Direction): Direction {
  switch (dir) {
    case Direction.Up:
      return Direction.Right;
    case Direction.Down:
      return Direction.Left;
    case Direction.Left:
      return Direction.Up;
    case Direction.Right:
      return Direction.Down;
  }
}

function moveInDir(dir: Direction, pos: [number, number]): [number, number] {
  switch (dir) {
    case Direction.Up:
      return [pos[0] - 1, pos[1]];
    case Direction.Down:
      return [pos[0] + 1, pos[1]];
    case Direction.Left:
      return [pos[0], pos[1] - 1];
    case Direction.Right:
      return [pos[0], pos[1] + 1];
  }
}

function toTurnSetElement(pos: [number, number], dir: Direction): string {
  return `${pos[0]},${pos[1]}:${dir}`;
}

export default class DaySix extends Solution {

  private getInputMap(input: string): string[][] {
    return input.split('\n').map(line => line.trim().split(''));
  }

  private getStartPos(inputMap: string[][]): [number, number] {
    for (let i = 0; i < inputMap.length; i++) {
      for (let j = 0; j < inputMap[i].length; j++) {
        if (inputMap[i][j] === '^') {
          return [i, j];
        }
      }
    }
    return [-1, -1];
  }

  getVisitedPositions(inputMap: string[][]): number[][] {
    const rows = inputMap.length;
    const cols = inputMap[0].length;
    const [startX, startY] = this.getStartPos(inputMap);

    let [currentX, currentY] = [startX, startY];
    let currentDir = Direction.Up;
    let visitedDistinct: number[][] = [];
    const isInBounds = (x: number, y: number) => x >= 0 && x < rows && y >= 0 && y < cols;
    const isVisited = (x: number, y: number) => inputMap[x][y] === 'X';
    const isObstacle = (x: number, y: number) => isInBounds(x, y) && inputMap[x][y] === '#';

    const turnSet = new Set<string>();

    while (isInBounds(currentX, currentY)) {
      if (!isVisited(currentX, currentY)) {
        inputMap[currentX][currentY] = 'X';
        visitedDistinct.push([currentX, currentY]);
      }

      const [nextX, nextY] = moveInDir(currentDir, [currentX, currentY]);
      if (isObstacle(nextX, nextY)) {
        if (turnSet.has(toTurnSetElement([currentX, currentY], currentDir))) {
          // Coming from this direction, the guard already had to turn right before
          throw new Error('Loop?')
        }
        turnSet.add(toTurnSetElement([currentX, currentY], currentDir));
        currentDir = turnRight(currentDir);
        continue;
      }
      currentX = nextX;
      currentY = nextY;
    }

    return visitedDistinct;
  }



  firstHalf(input: string): Result {
    const inputMap = this.getInputMap(input);
    return this.getVisitedPositions(inputMap).length;
  }

  countObstacles(input: string[][]): number {
    let count = 0;
    for (let i = 0; i < input.length; i++) {
      for (let j = 0; j < input[i].length; j++) {
        if (input[i][j] === '#') {
          count += 1;
        }
      }
    }
    return count;
  }

  secondHalf(input: string): Result {
    const visitedPositions = this.getVisitedPositions(this.getInputMap(input));

    let result = 0;
    visitedPositions.forEach(([visitedX, visitedY]) => {
      const newMap = this.getInputMap(input);
      newMap[visitedX][visitedY] = '#';
      try {
        this.getVisitedPositions(newMap);
      } catch (e) {
        result += 1;
      }
    });
    return result;
  }
}
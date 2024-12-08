import { Result, Solution } from '../types';


type Position = { row: number, col: number };

function getDistinctPairs<T>(arr: T[]): [T, T][] {
  const pairs: [T, T][] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i], arr[j]]);
    }
  }
  return pairs;
}

function getOffset(pos1: Position, pos2: Position): Position {
  return { row: pos1.row - pos2.row, col: pos1.col - pos2.col };
}

function getAntinodePositions(pos1: Position, pos2: Position): Position[] {
  const offset = getOffset(pos1, pos2);
  // rowDiff will always be negative or 0
  return [
    { row: pos1.row + offset.row, col: pos1.col + offset.col },
    { row: pos2.row - offset.row, col: pos2.col - offset.col },
  ];
}

function getAntinodePositionsPartTwo(pos1: Position, pos2: Position, inputMap: string[][]): Position[] {
  const offset = getOffset(pos1, pos2);
  let i = 1;
  const inDir1 = [{ row: pos1.row, col: pos1.col }];
  const inDir2 = [{ row: pos2.row, col: pos2.col }];

  while (inBounds(inDir1[i - 1], inputMap) || inBounds(inDir2[i - 1], inputMap)) {
    inDir1.push({ row: pos1.row + (offset.row * i), col: pos1.col + (offset.col * i) })
    inDir2.push({ row: pos2.row - (offset.row * i), col: pos2.col - (offset.col * i) })
    i += 1;
  }

  return [...inDir1, ...inDir2];
}

function inBounds(pos: Position, inputMap: string[][]): boolean {
  return (
    pos.row >= 0 &&
    pos.row < inputMap.length &&
    pos.col >= 0 &&
    pos.col < inputMap[pos.row].length
  );
}

function writeLines(lines: string[][]): void {
  lines.forEach((line) => {
    console.log(line.join(""));
  });
}

export default class DayEight extends Solution {

  frequencyMap = new Map<string, Position[]>();

  private getInputMap(input: string): string[][] {
    return input.split('\n').map(line => line.trim().split(''));
  }

  private addToFrequencyMap(frequency: string, pos: Position): void {
    if (!this.frequencyMap.has(frequency)) {
      this.frequencyMap.set(frequency, [pos]);
    } else {
      this.frequencyMap.get(frequency)!.push(pos);
    }
  }

  private initFrequencyMap(inputMap: string[][]) {
    this.frequencyMap = new Map<string, Position[]>();
    for (let row = 0; row < inputMap.length; row++) {
      for (let col = 0; col < inputMap[row].length; col++) {
        const pos: Position = { row, col };
        if (inputMap[row][col] !== '.') {
          this.addToFrequencyMap(inputMap[row][col], pos);
        }
      }
    }
  }

  firstHalf(input: string): number {
    const inputMap = this.getInputMap(input);
    this.initFrequencyMap(inputMap);

    const allAntinodePositions = [...this.frequencyMap.values()]
      .map(positions => getDistinctPairs(positions)
        .map(pair => getAntinodePositions(pair[0], pair[1])
          .filter(antinode => inBounds(antinode, inputMap)))
      ).flat().reduce((accList, antinodes) => { return [...accList, ...antinodes] }, [])

    const uniqueAntinodePositions = new Set(
      allAntinodePositions.map(antinode => `${antinode.row},${antinode.col}`)
    );

    return uniqueAntinodePositions.size;
  }

  secondHalf(input: string): Result {
    const inputMap = this.getInputMap(input);
    this.initFrequencyMap(inputMap);

    const allAntinodePositions = [...this.frequencyMap.values()]
      .map(positions => getDistinctPairs(positions)
        .map(pair => getAntinodePositionsPartTwo(pair[0], pair[1], inputMap)
          .filter(antinode => inBounds(antinode, inputMap)))
      ).flat().reduce((accList, antinodes) => { return [...accList, ...antinodes] }, [])

    const uniqueAntinodePositions = new Set(
      allAntinodePositions.map(antinode => `${antinode.row},${antinode.col}`)
    );

    return uniqueAntinodePositions.size;
  }
}
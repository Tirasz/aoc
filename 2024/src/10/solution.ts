import { Result, Solution } from '../types';

type Position = {
  row: number;
  col: number;
}

type Path = {
  pos: Position;
  paths: Path[];
}

class PathUtils {

  static buildPaths(
    startPos: Position,
    allowDiagonal: boolean,
    isValidFn: (startPos: Position, nexPos: Position) => boolean,
    isInboundsFn: (pos: Position) => boolean = () => true
  ): Path[] {
    return PositionUtils.getNeighborPositions(startPos, allowDiagonal)
      .filter(isInboundsFn)
      .filter(pos => isValidFn(startPos, pos))
      .map(pos => { return { pos, paths: this.buildPaths(pos, allowDiagonal, isValidFn, isInboundsFn) } });
  }

  static extractDistinctPaths(path: Path): Position[][] {
    if (path.paths.length === 0) {
      return [[path.pos]];
    }
    const result: Position[][] = [];
    for (const subPath of path.paths) {
      const subPaths = this.extractDistinctPaths(subPath);
      for (const subPathPositions of subPaths) {
        result.push([path.pos, ...subPathPositions]);
      }
    }
    return result;
  }

}

class PositionUtils {

  static mapForSet(pos: Position): string {
    return `(${pos.row}, ${pos.col})`;;
  }

  static getNeighborPositions(pos: Position, allowDiagonal: boolean = true): Position[] {
    const cardinalOffsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const diagonalOffsets = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    const offsets = allowDiagonal ? cardinalOffsets.concat(diagonalOffsets) : cardinalOffsets;
    return offsets.map(([dRow, dCol]) => ({
      row: pos.row + dRow,
      col: pos.col + dCol,
    }));
  }

  static getPossiblePositions(maxRow: number, maxCol: number): Position[] {
    return Array.from({ length: maxRow }, (_, row) =>
      Array.from({ length: maxCol }, (_, col) => ({ row, col }))
    ).flat();
  }

}

class NByNMap<T> {
  map: T[][];

  constructor(input: string, mapFn: (c: string) => T) {
    this.map = input.split('\n').map(line => line.trim().split('').map(mapFn));
  }

  dimensions() {
    return { rows: this.map.length, cols: this.map[0].length };
  }

  isInBounds(pos: Position) {
    const { rows, cols } = this.dimensions();
    return pos.row >= 0 && pos.row < rows && pos.col >= 0 && pos.col < cols;
  }

  get(pos: Position) {
    if (!this.isInBounds(pos)) {
      throw new Error(`Position ${pos} is out of bounds`);
    }
    return this.map[pos.row][pos.col];
  }

  getMatchingPositions(filterFn: (element: T) => boolean) {
    const { rows, cols } = this.dimensions();
    return PositionUtils.getPossiblePositions(rows, cols)
      .filter(pos => filterFn(this.get(pos)));
  }

}

export default class DayTen extends Solution {

  getDistinctTrails(input: string) {

  }

  firstHalf(input: string): Result {
    const inputMap = new NByNMap(input, c => Number(c))

    return inputMap.getMatchingPositions(value => value === 0)
      .map(trailhead => {
        const validTrailFn = (startPos: Position, nextPos: Position) => inputMap.get(nextPos) - inputMap.get(startPos) === 1;
        const isInBoundsFn = (pos: Position) => inputMap.isInBounds(pos);
        const result = {
          startPos: trailhead,
          paths: PathUtils.buildPaths(trailhead, false, validTrailFn, isInBoundsFn)
        }
        return result;
      })
      .filter(({ paths, startPos }) => paths.length > 0)
      .map(({ startPos, paths }) => {
        const trailEnds = PathUtils.extractDistinctPaths({ pos: startPos, paths: paths })
          .map(trail => trail.pop()!)
          .filter(pos => inputMap.get(pos) === 9)
          .map(PositionUtils.mapForSet)
        const distinctTrailEnds = new Set(trailEnds);
        return { startPos, score: distinctTrailEnds.size };
      })
      .reduce((sum, { score }) => sum + score, 0);
  }

  secondHalf(input: string): Result {
    const inputMap = new NByNMap(input, c => Number(c))

    return inputMap.getMatchingPositions(value => value === 0)
      .map(trailhead => {
        const validTrailFn = (startPos: Position, nextPos: Position) => inputMap.get(nextPos) - inputMap.get(startPos) === 1;
        const isInBoundsFn = (pos: Position) => inputMap.isInBounds(pos);
        const result = {
          startPos: trailhead,
          paths: PathUtils.buildPaths(trailhead, false, validTrailFn, isInBoundsFn)
        }
        return result;
      })
      .filter(({ paths, startPos }) => paths.length > 0)
      .map(({ startPos, paths }) => {
        const trails = PathUtils.extractDistinctPaths({ pos: startPos, paths: paths })
          .filter(path => inputMap.get(path.pop()!) === 9)
        return { startPos, score: trails.length };
      })
      .reduce((sum, { score }) => sum + score, 0);
  }
}
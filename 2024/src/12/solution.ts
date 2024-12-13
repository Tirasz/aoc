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
    return `${pos.row},${pos.col}`;
  }

  static mapFromSet(str: string): Position {
    const [row, col] = str.split(',').map(Number);
    return { row, col };
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

  static buildArea(startPos: Position, isInAreaFn: (pos: Position) => boolean, allowDiagonal: boolean) {
    const toSearch = new Set([PositionUtils.mapForSet(startPos)]);
    const result = new Set([PositionUtils.mapForSet(startPos)]);
    while (toSearch.size > 0) {
      const current = [...toSearch.values()].pop()!;
      toSearch.delete(current);
      PositionUtils.getNeighborPositions(PositionUtils.mapFromSet(current), allowDiagonal)
        .filter(isInAreaFn)
        .filter(pos => !result.has(PositionUtils.mapForSet(pos)))
        .map(PositionUtils.mapForSet)
        .forEach(pos => {
          result.add(pos);
          toSearch.add(pos);
        })
    }
    return result;
  }

  static buildDistinctAreas<T>(inputMap: NByNMap<T>, isInAreFnFactory: (element: T) => (pos: Position) => boolean, allowDiagonal: boolean) {
    const { rows, cols } = inputMap.dimensions();
    const allPositions = new Set(PositionUtils.getPossiblePositions(rows, cols).map(PositionUtils.mapForSet));
    const result: Set<string>[] = [];

    while (allPositions.size) {
      const startPos = PositionUtils.mapFromSet([...allPositions.values()][0]);
      const isInAreaFn = (pos: Position) => {
        return inputMap.isInBounds(pos) && isInAreFnFactory(inputMap.get(startPos))(pos);
      }
      const area = PositionUtils.buildArea(startPos, isInAreaFn, allowDiagonal);
      result.push(area);
      [...area.values()].forEach(pos => allPositions.delete(pos));
    }
    return result;
  }

  static buildPerimeter(area: Set<string>, allowDiagonal: boolean, isInBoundsFn: (pos: Position) => boolean = () => true) {
    // Duplicate position in perimeter means its bordering more than one pos of the area
    const areaPositions = [...area.values()].map(PositionUtils.mapFromSet);
    return areaPositions.flatMap(pos => PositionUtils.getNeighborPositions(pos, allowDiagonal))
      .filter(isInBoundsFn)
      .filter(pos => !area.has(PositionUtils.mapForSet(pos)));
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

export default class DayTwelve extends Solution {
  firstHalf(input: string): Result {
    const inputMap = new NByNMap(input, c => c);
    const isInAreFnFactory = (element: string) => (pos: Position) => inputMap.get(pos) === element;
    const distinctAreas = PositionUtils.buildDistinctAreas(inputMap, isInAreFnFactory, false)
      .map(area => {
        return {
          areaSize: area.size,
          perimeterSize: PositionUtils.buildPerimeter(area, false).length
        }
      })
    return distinctAreas.reduce((acc, { areaSize, perimeterSize }) => acc + areaSize * perimeterSize, 0);
  }
  secondHalf(input: string): Result {
    return 0;
  }

}
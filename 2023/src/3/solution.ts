import { Result, Solution } from '../types';

type inputPos = { line: number, char: number };

export default class DayThree extends Solution {

  inputMap: string[] = [];

  isValidPos(pos: inputPos): boolean {
    return this.inputMap[pos.line]?.[pos.char] !== undefined;
  }

  isNumber(pos: inputPos): boolean {
    if (!this.isValidPos(pos)) {
      return false;
    }
    const c: string = this.inputMap[pos.line][pos.char];
    return c! >= '0' && c! <= '9';
  }

  isSymbol(pos: inputPos): boolean {
    if (!this.isValidPos(pos)) {
      return false;
    }
    const c: string = this.inputMap[pos.line][pos.char];
    return !this.isNumber(pos) && c !== '.';
  }

  getNeighborPositions(pos: inputPos, validNeighbor: (p: inputPos) => boolean = (p) => true): inputPos[] {
    let result: inputPos[] = [];
    const offsets = [-1, 0, 1];

    for (let lineOffset of offsets) {
      for (let charOffset of offsets) {
        const line = pos.line + lineOffset;
        const char = pos.char + charOffset;
        if (validNeighbor.call(this, { line, char })) {
          result.push({ line, char });
        }
      }
    }

    return result;
  }

  iterateWhileNumber(pos: inputPos, step: number): number {
    let finalCharPos = pos.char;
    while (
      this.isNumber({ line: pos.line, char: finalCharPos }) &&
      this.isNumber({ line: pos.line, char: finalCharPos + step })
    ) {
      finalCharPos += step;
    }
    return finalCharPos;
  }

  getFullNumberFromPos(pos: inputPos): { startPos: inputPos, n: number } {
    if (!this.isNumber(pos)) {
      throw new Error(`Cant get full number from ${pos}`);
    }

    let startChar = this.iterateWhileNumber(pos, -1);
    let endChar = this.iterateWhileNumber(pos, 1);

    const startPos = { line: pos.line, char: startChar };
    const n = Number(this.inputMap[pos.line].substring(startChar, endChar + 1));
    return { startPos, n };
  }

  stringifyPos(pos) {
    return `[${pos.line},${pos.char}]`;
  }

  firstHalf(input: string): Result {
    this.inputMap = input.split('\n').map(line => line.trim());
    const resultMap = new Map<string, number>();

    for (let line = 0; line < this.inputMap.length; line++) {
      for (let char = 0; char < this.inputMap[line].length; char++) {
        if (this.isSymbol({ line, char })) {
          const numberNeighbors = this.getNeighborPositions({ line, char }, this.isNumber);
          const fullNumbers = numberNeighbors.map(pos => this.getFullNumberFromPos(pos));
          fullNumbers.forEach(({ startPos, n }) => resultMap.set(this.stringifyPos(startPos), n))
        }
      }
    }

    let sum = 0;
    resultMap.forEach(value => sum += value);
    return sum;
  }

  secondHalf(input: string): Result {
    this.inputMap = input.split('\n').map(line => line.trim());

    let sum = 0;

    for (let line = 0; line < this.inputMap.length; line++) {
      for (let char = 0; char < this.inputMap[line].length; char++) {
        if (this.inputMap[line][char] === '*') {
          let numberMap = new Map<string, number>();
          const numberNeighbors = this.getNeighborPositions({ line, char }, this.isNumber);
          const fullNumbers = numberNeighbors.map(pos => this.getFullNumberFromPos(pos));
          fullNumbers.forEach(({ startPos, n }) => numberMap.set(this.stringifyPos(startPos), n));
          if (numberMap.size == 2) {
            let ratio = 1;
            numberMap.forEach(value => ratio *= value);
            sum += ratio;
          }
        }
      }
    }

    return sum;
  }
}

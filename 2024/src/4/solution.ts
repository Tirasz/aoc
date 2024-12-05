import { Result, Solution } from '../types';

function iterateMatrix(
  matrix: string[][],
  mode: 'leftToRight' | 'topToBottom' | 'diagonals'
) {
  let result: string[][];
  switch (mode) {
    case 'leftToRight':
      return [...matrix];
    case 'topToBottom':
      result = [];
      for (let col = 0; col < matrix[0].length; col++) {
        const colChars: string[] = []
        for (let row = 0; row < matrix.length; row++) {
          colChars.push(matrix[row][col]);
        }
        result.push(colChars);
      }
      return result;
    case 'diagonals':
      const n = matrix.length;
      const m = matrix[0].length;
      result = Array.from(Array(n + m - 1), () => Array());
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < m; j++) {
          result[i + j].push(matrix[i][j]);
        }
      }
      return result;
  }
}

function rotate<T>(matrix: T[][]): T[][] {
  return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse())
}

function reverse(s: string) {
  return [...s].reverse().join('');
}

export default class DayFour extends Solution {

  private getInputMap(input: string): string[][] {
    return input.split('\n').map(line => line.trim().split(''));
  }

  firstHalf(input: string): Result {
    const inputMap = this.getInputMap(input);
    const iters = [
      ...iterateMatrix(inputMap, 'leftToRight'),
      ...iterateMatrix(inputMap, 'topToBottom'),
      ...iterateMatrix(inputMap, 'diagonals'),
      ...iterateMatrix(rotate(inputMap), 'diagonals')
    ];
    const re = new RegExp(/XMAS/g, 'gm');
    return iters.reduce((sum, it) => {
      const inOrder = it.join('');
      const inReverse = reverse(inOrder);
      return sum + [...inOrder.matchAll(re)].length + [...inReverse.matchAll(re)].length;
    }, 0);
  }

  private couldBeMAS(m: string[][], pos: { x: number, y: number }) {
    const { x, y } = pos;
    if (x - 1 < 0 || x + 1 >= m.length || y - 1 < 0 || y + 1 >= m[0].length) return false;
    const diagOne = m[x - 1][y - 1] + m[x][y] + m[x + 1][y + 1];
    const diagTwo = m[x - 1][y + 1] + m[x][y] + m[x + 1][y - 1];
    return (diagOne === 'MAS' || reverse(diagOne) === 'MAS') && (diagTwo === 'MAS' || reverse(diagTwo) === 'MAS');
  }

  secondHalf(input: string): Result {
    const inputMap = this.getInputMap(input);
    let result = 0;
    for (let x = 0; x < inputMap.length; x++) {
      for (let y = 0; y < inputMap[0].length; y++) {
        if (this.couldBeMAS(inputMap, { x, y })) {
          result += 1;
        }
      }
    }
    return result;
  }
}
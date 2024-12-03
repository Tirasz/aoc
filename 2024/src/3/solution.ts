import { Result, Solution } from '../types';

type MatchResult = { mul: string, a: number, b: number, do: string, dont: string };

export default class DayThree extends Solution {

  private getInputMatches(input: string, regex: RegExp) {
    const re = new RegExp(regex, 'gm');
    return [...input.matchAll(re)];
  }

  firstHalf(input: string): Result {
    const regexp = /mul\((?<a>[0-9]{1,3}),(?<b>[0-9]{1,3})\)/gm;
    return this.getInputMatches(input, regexp).reduce((sum, match) => {
      const numbers = (match.groups ?? { a: 0, b: 0 }) as MatchResult;
      return sum + numbers.a * numbers.b;
    }, 0);
  }

  secondHalf(input: string): Result {
    const regexp = /(?<mul>mul\((?<a>[0-9]{1,3}),(?<b>[0-9]{1,3})\))|(?<do>do\(\))|(?<dont>don't\(\))/gm
    return this.getInputMatches(input, regexp).reduce(
      (acc, match) => {
        const instruction = (match.groups ?? {}) as unknown as MatchResult;
        const addToSum = (instruction.mul && acc.previous === 'do()') ? (instruction.a * instruction.b) : 0;
        return {
          previous: instruction?.do ?? (instruction?.dont ?? acc.previous),
          sum: acc.sum + addToSum
        }
      },
      { previous: 'do()', sum: 0 }
    ).sum;
  }
}
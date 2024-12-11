import { Result, Solution } from '../types';

type Rule = {
  conditionFn: (n: number) => boolean,
  splitFn: (n: number) => number[]
};

function applyFirstApplicable(n: number, rules: Rule[]) {
  for (let i = 0; i < rules.length; i++) {
    const { conditionFn, splitFn } = rules[i];
    if (conditionFn(n)) {
      return splitFn(n);
    }
  }
  return [n];
}

function splitEvenDigits(n: number): number[] {
  const asString = n.toString();
  if (asString.length % 2 !== 0) {
    throw new Error("Input number must have an even number of digits.");
  }
  const mid = asString.length / 2;
  return [Number(asString.slice(0, mid)), Number(asString.slice(mid))]
}

const RULES: Rule[] = [
  {
    conditionFn: (n) => n === 0,
    splitFn: (n) => [1]
  },
  {
    conditionFn: (n) => n.toString().length % 2 === 0,
    splitFn: splitEvenDigits
  },
  {
    conditionFn: (n) => true,
    splitFn: (n) => [n * 2024]
  }
];

export default class DayEleven extends Solution {

  private blinkCache = new Map<string, number>()

  private getNumberOfStones(n: number, iters: number) {
    if (iters === 0) {
      return 1;
    }
    const forSet = `${n}, ${iters}`;
    if (this.blinkCache.get(forSet) !== undefined) {
      return this.blinkCache.get(forSet);
    }
    const afterOneBlink = applyFirstApplicable(n, RULES);
    const result = afterOneBlink.map(n => this.getNumberOfStones(n, iters - 1)).reduce((sum, k) => k + sum, 0);
    this.blinkCache.set(forSet, result);
    return result;
  }

  firstHalf(input: string): Result {
    const initialStones = input.split(' ').map(s => Number(s.trim()));
    return initialStones.map(stone => {
      return this.getNumberOfStones(stone, 25);
    }).reduce((acc, sum) => acc + sum, 0);
  }

  secondHalf(input: string): Result {
    const initialStones = input.split(' ').map(s => Number(s.trim()));
    return initialStones.map(stone => {
      return this.getNumberOfStones(stone, 75);
    }).reduce((acc, sum) => acc + sum, 0);
  }
}
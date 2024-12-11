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

  private blink(stones: number[], rules: Rule[]) {
    return stones.map(stone => applyFirstApplicable(stone, rules)).flat();
  }

  firstHalf(input: string): Result {
    const initialStones = input.split(' ').map(s => Number(s.trim()));
    const ITERS = 25;
    let current = initialStones;
    for (let i = 0; i < ITERS; i++) {
      current = this.blink(current, RULES);
    }
    return current.length;
  }

  secondHalf(input: string): Result {
    return 0;
  }
}
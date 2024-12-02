import { Result, Solution } from '../types';
type TupleOfArrays<T> = [T[], T[]]

export default class DayOne extends Solution {

  private getInputArrays(input): TupleOfArrays<number> {
    return input.split('\n')
      .map(line =>
        line.trim().split(' ').filter(Boolean).map(Number)
      )
      .reduce(
        (acc, line: number[]) => {
          return [
            [...acc[0], line[0]],
            [...acc[1], line[1]]
          ] as TupleOfArrays<number>
        },
        [[], []] as TupleOfArrays<number>
      )
  }

  firstHalf(input: string): Result {
    const [firstArray, secondArray] = this.getInputArrays(input).map(array => array.sort((a, b) => a - b));
    return firstArray.reduce((result, value, index) => result + Math.abs(value - secondArray[index]), 0)
  }

  secondHalf(input: string): Result {
    const [firstArray, secondArray] = this.getInputArrays(input);
    const similarityMap = new Map<number, number>();
    secondArray.forEach(value => similarityMap.set(value, (similarityMap.get(value) ?? 0) + 1));
    return firstArray.reduce((result, value) => result + value * (similarityMap.get(value) ?? 0), 0);
  }

}
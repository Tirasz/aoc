import { Result, Solution } from '../types';

export default class DayOne extends Solution {

  firstHalf(input: string): Result {
    const regex = new RegExp(`(^([^0-9]*)(?<firstDigit>[0-9])(.*)(?<lastDigit>[0-9])(.*)$)|(^[^0-9]*)(?<onlyDigit>[0-9])([^0-9]*$)`, 'gm');
    const matches = [...input.matchAll(regex)];
    let sum = 0;

    matches.map(match => match.groups).forEach(group => {
      if (group?.onlyDigit) {
        sum += Number(group.onlyDigit) * 11;
      } else {
        sum += Number(group!.firstDigit + group!.lastDigit);
      }
    });

    return sum;
  }

  mapToNumber(str: string): string {
    const numberMapping = {
      'one': 'o1e',
      'two': 't2o',
      'three': 't3e',
      'four': 'f4r',
      'five': 'f5e',
      'six': 's6x',
      'seven': 's7n',
      'eight': 'e8t',
      'nine': 'n9e',
    };
    return numberMapping[str];
  }

  secondHalf(input: string): Result {
    const regex = new RegExp('one|two|three|four|five|six|seven|eight|nine', 'gm');
    // Handle fiveighthree and other shenanigans
    const newInput = input.replace(regex, this.mapToNumber).replace(regex, this.mapToNumber);
    return this.firstHalf(newInput);
  }

}

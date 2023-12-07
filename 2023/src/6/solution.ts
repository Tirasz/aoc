import { Result, Solution } from '../types';

export default class DaySix extends Solution {

  firstHalf(input: string): Result {
    const [timeStr, distanceStr] = input.split('\n');
    const times = timeStr.split(' ').filter(s => Boolean(s.length)).splice(1).map(s => Number(s));
    const records = distanceStr.split(' ').filter(s => Boolean(s.length)).splice(1).map(s => Number(s));

    let sum = 1;

    for (let i = 0; i < times.length; i++) {
      const race = { lasted: times[i], recordDistance: records[i] };
      let waysToBeat = 0;

      for (let t = 0; t < race.lasted; t++) {
        const traveled = t * (race.lasted - t);
        if (traveled > race.recordDistance) {
          waysToBeat++;
        }
      }
      sum *= waysToBeat;
    }

    return sum;
  }

  secondHalf(input: string): Result {
    const [timeStr, distanceStr] = input.split('\n');
    const time = Number(timeStr.split(' ').filter(s => Boolean(s.length)).splice(1).map(s => Number(s)).join(''));
    const record = Number(distanceStr.split(' ').filter(s => Boolean(s.length)).splice(1).map(s => Number(s)).join(''));

    let sum = 1;
    const race = { lasted: time, recordDistance: record };
    let waysToBeat = 0;

    for (let t = 0; t < race.lasted; t++) {
      const traveled = t * (race.lasted - t);
      if (traveled > race.recordDistance) {
        waysToBeat++;
      }
    }
    sum *= waysToBeat;


    return sum;
  }

}

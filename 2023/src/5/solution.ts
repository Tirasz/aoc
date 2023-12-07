import { Result, Solution } from '../types';

type Range = {
  a: number,
  b: number
};

function range(a: number, b: number): Range {
  return { a, b };
}

type Mapping = {
  inputRange: Range,
  fn: (a: number) => number,
};

type MappingResult = {
  mapped: Range[],
  unmapped: Range[]
};

export default class DayFive extends Solution {

  firstHalf(input: string): Result {
    const [seedsStr, ...mapsStr] = input.split("\n").filter(line => line.length > 3);
    const seeds = seedsStr.split(':')[1].split(' ').filter(n => Boolean(n)).map(n => Number(n));
    const locations: number[] = [];

    seeds.forEach(seed => {
      let current = seed;
      let isMapped = false;

      for (let i = 0; i < mapsStr.length; i++) {
        const line = mapsStr[i];

        if (line.includes('map')) {
          isMapped = false;
          continue;
        }
        if (isMapped) {
          continue;
        }

        const [destRangeStart, srcRangeStart, range] = line.split(' ').filter(n => Boolean(n)).map(n => Number(n));
        if (current >= srcRangeStart && current < srcRangeStart + range) {
          isMapped = true;
          current = destRangeStart + (current - srcRangeStart);
        }
      }

      locations.push(current);
    })

    return locations.sort((a, b) => a - b)[0];
  }

  getMapping(line: string): Mapping {
    const [destStart, srcStart, range] = line.split(' ').map(s => s.trim()).filter(s => Boolean(s.length)).map(n => Number(n));
    const diff = srcStart - destStart;
    const fn = (a: number) => a - diff;
    return {
      inputRange: { a: srcStart, b: srcStart + range - 1 },
      fn,
    }
  }

  applyMapping(input: Range, map: Mapping): MappingResult {
    if (input.b < map.inputRange.a || input.a > map.inputRange.b) {
      return { unmapped: [input], mapped: [] };
    } else if (input.a < map.inputRange.a) {
      const result = this.applyMapping(range(map.inputRange.a, input.b), map);
      return { unmapped: [range(input.a, map.inputRange.a - 1), ...result.unmapped], mapped: result.mapped }
    } else if (input.b > map.inputRange.b) {
      const result = this.applyMapping(range(input.a, map.inputRange.b), map);
      return { unmapped: [range(map.inputRange.b + 1, input.b), ...result.unmapped], mapped: result.mapped }
    } else {
      return { unmapped: [], mapped: [range(map.fn(input.a), map.fn(input.b))] };
    }
  }

  applyMappingToRanges(input: Range[], mapping: Mapping): MappingResult {
    let _mapped: Range[] = [];
    let _unmapped: Range[] = [];
    input.forEach(r => {
      const { mapped, unmapped } = this.applyMapping(r, mapping);
      _mapped.push(...mapped);
      _unmapped.push(...unmapped);
    });
    return { mapped: _mapped, unmapped: _unmapped };
  }

  secondHalf(input: string): Result {
    // This took me 2 days to figure out lmao
    const [seedsStr, ...mapsStr] = input.split("\n").filter(line => line.length > 3);
    const seedNumbers = seedsStr.split(':')[1].split(' ').filter(n => Boolean(n)).map(n => Number(n));

    const seedRanges: Range[] = [];
    for (let i = 0; i + 1 < seedNumbers.length; i += 2) {
      const [start, range] = [seedNumbers[i], seedNumbers[i + 1]];
      seedRanges.push({ a: start, b: start + range - 1 });
    };

    let _unmapped: Range[] = [...seedRanges];
    let _mapped: Range[] = [];

    for (let i = 0; i < mapsStr.length; i++) {
      _mapped = _mapped;
      _unmapped = _unmapped;
      const line = mapsStr[i];
      if (line.includes('map')) {
        _unmapped = [..._unmapped, ..._mapped];
        _mapped = [];
        continue;
      }
      const mapping = this.getMapping(line);
      const { mapped, unmapped } = this.applyMappingToRanges(_unmapped, mapping);
      _mapped.push(...mapped);
      _unmapped = unmapped;
    }

    const result = [..._mapped, ..._unmapped]
    return result.map(r => r.a).sort((a, b) => a - b)[0];
  }

}
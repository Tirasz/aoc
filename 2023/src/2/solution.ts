import { Result, Solution } from '../types';

type BallColor = 'red' | 'green' | 'blue';
type BallSubset = { [key in BallColor]?: number }

class Game {
  id: number;
  records: BallSubset[];

  constructor(id: number, records: BallSubset[]) {
    this.id = id;
    this.records = records;
  }

  isPossible(maxValues: BallSubset): boolean {
    let result = true;
    this.records.forEach(record => {
      Object.keys(record).forEach(color => {
        if (record[color] > maxValues[color]) {
          result = false;
        }
      })
    })
    return result;
  }

  minPossible() {
    let result: BallSubset = {
      red: 0,
      green: 0,
      blue: 0
    };

    this.records.forEach(record => {
      Object.keys(record).forEach(color => {
        if (record[color] > result[color]) {
          result[color] = record[color];
        }
      })
    });
    return result
  }
}

const definedPropsAsNumber = (obj: Record<string, string>): BallSubset => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [k, Number(v)])
  );
};

function initGame(line: string): Game {
  const [idStr, setsStr] = line.split(':');
  const gameId = Number(new RegExp("Game (?<gameId>[0-9]+)").exec(idStr)!.groups!.gameId);
  const records: BallSubset[] = [];
  const gameSetRegex = new RegExp("( (?<red>[0-9]+) red,?| (?<green>[0-9]+) green,?| (?<blue>[0-9]+) blue,?)", "g");

  setsStr.split(';').forEach(gameSet => {
    let newRecord: BallSubset = {};
    const matches = [...gameSet.matchAll(gameSetRegex)];
    matches.map(match => match.groups!).forEach(group => {
      newRecord = { ...newRecord, ...definedPropsAsNumber(group) };
    })
    records.push(newRecord);
  });

  return new Game(gameId, records);
};

export default class DayTwo extends Solution {


  firstHalf(input: string): Result {
    const games: Game[] = [];
    input.split('\n').forEach(line => {
      games.push(initGame(line));
    })

    const maxValues: BallSubset = {
      red: 12,
      green: 13,
      blue: 14
    };

    let idSum = 0;
    games
      .filter(game => game.isPossible(maxValues))
      .forEach(game => idSum += game.id);

    return idSum;
  }

  secondHalf(input: string): Result {
    const games: Game[] = [];
    input.split('\n').forEach(line => {
      games.push(initGame(line));
    })

    let sum = 0;

    games
      .map(game => game.minPossible())
      .map(record => (record.blue ?? 1) * (record.green ?? 1) * (record.red ?? 1))
      .forEach(num => sum += num);

    return sum;
  }

}
import { Result, Solution } from '../types';

class Card {
  id: number;
  ownedNumbers: number[];
  winningNumbers: number[];

  constructor(line: string) {
    const [idStr, gameStr] = line.split(':');
    const [owned, winning] = gameStr.split('|');
    this.id = Number(new RegExp("Card[ \t]+(?<cardId>[0-9]+)").exec(idStr)!.groups!.cardId);
    this.ownedNumbers = owned.trim().split(' ').filter(str => Boolean(str)).map(n => Number(n));
    this.winningNumbers = winning.trim().split(' ').filter(str => Boolean(str)).map(n => Number(n));
  }

  getWinningNumbers(): number[] {
    return this.winningNumbers.filter(n => this.ownedNumbers.includes(n));
  }
}


export default class DayFour extends Solution {

  firstHalf(input: string): Result {
    const lines = input.split('\n');
    const cards: Card[] = [];
    lines.forEach(line => cards.push(new Card(line)));

    let pointSum = 0;

    cards.forEach(card => {
      const winning = card.getWinningNumbers();
      if (!winning.length) {
        return
      }
      let score = Math.pow(2, winning.length - 1);
      pointSum += score
    })

    return pointSum;
  }


  secondHalf(input: string): Result {
    const lines = input.split('\n');
    const cards: Card[] = [];
    lines.forEach(line => cards.push(new Card(line)));

    const winningMap = new Map<number, number>();
    cards.forEach(card => {
      winningMap.set(card.id, 1);
    });

    cards.forEach(card => {
      const winning = card.getWinningNumbers();
      const wonIds = Array.from({ length: winning.length }, (_, index) => card.id + index + 1);
      wonIds.forEach(wonId => {
        const alreadyOwned = winningMap.get(wonId)!;
        const currentCardAmount = winningMap.get(card.id)!;
        winningMap.set(wonId, alreadyOwned + currentCardAmount)
      })
    })

    let sum = 0;
    winningMap.forEach(value => sum += value);
    return sum;
  }

}
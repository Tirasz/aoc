import { Result, Solution } from '../types';


type Card = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

const cardStrength: Record<Card, number> = {
  'A': 14,
  'K': 13,
  'Q': 12,
  'J': 11,
  'T': 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
};

const cardStrengthForPartTwo: Record<Card, number> = {
  'A': 14,
  'K': 13,
  'Q': 12,
  'T': 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
  'J': 1,
};

enum HandType {
  HIGH_CARD = 1,
  ONE_PAIR,
  TWO_PAIR,
  THREE_OF_KIND,
  FULL_HOUSE,
  FOUR_OF_KIND,
  FIVE_OF_KIND,
}

class Hand {
  cards: Card[];
  type: HandType;
  cardMap = new Map<Card, number>();

  constructor(cardStr: string) {
    this.cards = cardStr.split('').map(c => c as Card);
    this.cardMap = new Map<Card, number>();
    this.cards.forEach(card => {
      if (this.cardMap.has(card)) {
        this.cardMap.set(card, this.cardMap.get(card)! + 1);
      } else {
        this.cardMap.set(card, 1);
      }
    })
    const pairsArray = Array.from(this.cardMap.values()).sort((a, b) => b - a);
    const top = pairsArray[0];

    switch (pairsArray.length) {
      case 1:
        this.type = HandType.FIVE_OF_KIND;
        break;
      case 2:
        this.type = top == 4 ? HandType.FOUR_OF_KIND : HandType.FULL_HOUSE
        break;
      case 3:
        this.type = top == 3 ? HandType.THREE_OF_KIND : HandType.TWO_PAIR;
        break;
      default:
        this.type = top == 2 ? HandType.ONE_PAIR : HandType.HIGH_CARD;
    }
  }

  upgradeTypeForPartTwo() {
    if (!this.cards.includes('J') || this.type == HandType.FIVE_OF_KIND) {
      return;
    }
    const numOfJs = this.cardMap.get('J')!;
    const pairsArray = Array.from(this.cardMap.values()).sort((a, b) => b - a);
    const top = pairsArray[0];

    switch (pairsArray.length) {
      case 2:
        this.type = HandType.FIVE_OF_KIND;
        break;
      case 3:
        this.type = (top === 3 || numOfJs > 1) ? HandType.FOUR_OF_KIND : HandType.FULL_HOUSE;
        break;
      default:
        this.type = top === 2 ? HandType.THREE_OF_KIND : HandType.ONE_PAIR;
        break;
    }
  }

}

function compareHands(a: Hand, b: Hand): number {
  //It is expected to return a negative value if the first argument is less than the second argument, zero if they're equal, and a positive value otherwise.
  let result = a.type - b.type;
  if (result != 0) {
    return result;
  }

  for (let i = 0; i < a.cards.length; i++) {
    result = cardStrength[a.cards[i]] - cardStrength[b.cards[i]];
    if (result != 0) {
      return result;
    }
  }
  return 0;
}

function compareHandsPartTwo(a: Hand, b: Hand): number {
  //It is expected to return a negative value if the first argument is less than the second argument, zero if they're equal, and a positive value otherwise.
  let result = a.type - b.type;
  if (result != 0) {
    return result;
  }

  for (let i = 0; i < a.cards.length; i++) {
    result = cardStrengthForPartTwo[a.cards[i]] - cardStrengthForPartTwo[b.cards[i]];
    if (result != 0) {
      return result;
    }
  }
  return 0;
}

export default class DaySeven extends Solution {
  firstHalf(input: string): Result {
    const game = new Map<Hand, number>();
    input.split('\n').forEach(line => {
      const [handStr, nStr] = line.split(' ');
      game.set(new Hand(handStr), Number(nStr));
    });

    let sum = 0;
    Array.from(game.keys()).sort(compareHands).forEach((hand, index) => {
      sum += game.get(hand)! * (index + 1);
    })

    return sum;
  }

  secondHalf(input: string): Result {
    const game = new Map<Hand, number>();
    input.split('\n').forEach(line => {
      const [handStr, nStr] = line.split(' ');
      const hand = new Hand(handStr);
      hand.upgradeTypeForPartTwo();
      game.set(hand, Number(nStr));
    });

    let sum = 0;
    Array.from(game.keys()).sort(compareHandsPartTwo).forEach((hand, index) => {
      sum += game.get(hand)! * (index + 1);
    })

    return sum;
  }
};
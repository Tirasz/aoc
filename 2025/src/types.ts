export type Result = string | number;

export abstract class Solution {

  run(input: string) {
    console.log('First half: ');
    console.log(this.firstHalf(input));
    console.log('---------------------------');
    console.log('Second half: ');
    console.log(this.secondHalf(input));
  }

  abstract firstHalf(input: string): Result;
  abstract secondHalf(input: string): Result;

}

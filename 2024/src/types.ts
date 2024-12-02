import * as path from 'path';
import * as fs from 'fs';

export type Result = string | number;

export abstract class Solution {

  day: number;
  fileName: string;

  constructor(day: number, runExample: boolean) {
    this.day = day;
    this.fileName = runExample ? 'example.txt' : 'input.txt';
    console.log(`Day ${this.day}: ${runExample ? '(Running on example)' : ''}`);
  }

  run() {
    const filePath = path.join(__dirname, this.day.toString(), this.fileName);
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error('Error loading file: ', filePath);
        return
      }
      console.log('First half: ');
      console.log(this.firstHalf(data));
      console.log('---------------------------');
      console.log('Second half: ');
      console.log(this.secondHalf(data));
    });
  }

  abstract firstHalf(input: string): Result;
  abstract secondHalf(input: string): Result;

}

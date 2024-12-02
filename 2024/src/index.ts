import * as path from 'path';
import * as fs from 'fs';
import { Solution } from './types';

const args = process.argv.slice(2);
const day = Number(args[0]);

if (isNaN(day) || day < 0 || day > 25) {
  console.error('Please provide a valid number between 1 - 25 as a command-line argument.');
  process.exit(1);
}

const solutionPath = path.join(__dirname, day.toString(), 'solution.ts');

fs.access(solutionPath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error(`Solution file not found for the specified day (${day}).`);
    process.exit(1);
  }

  import(solutionPath).then(f => {
    const solution = new f.default(day, Boolean(args[1])) as Solution;
    solution.run();
  }).catch(error => {
    console.error(`Error executing solution file for day ${day}: ${error}`);
  })
});
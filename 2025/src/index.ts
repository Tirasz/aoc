import * as path from 'path';
import * as fs from 'fs/promises';
import { Solution } from './types';
import { AocClient, InputType } from './aoc-client';

const args = process.argv.slice(2);
const day = Number(args[0]);
const inputType: InputType = args[1] === 'example' ? 'example' : 'input';

if (isNaN(day) || day < 1 || day > 12) {
  console.error('Please provide a valid day number (1-12) as a command-line argument.');
  console.error('Usage: npm run day <day> [example]');
  process.exit(1);
}

const solutionPath = path.join(__dirname, day.toString(), 'solution.ts');

async function main() {
  try {
    await fs.access(solutionPath);
  } catch {
    console.error(`Solution file not found for day ${day}.`);
    process.exit(1);
  }

  try {
    console.log(`Day ${day}${inputType === 'example' ? ' (example)' : ''}:`);

    const client = new AocClient();
    const input = await client.getInput(day, inputType);

    const f = await import(solutionPath);
    const solution = new f.default() as Solution;
    solution.run(input);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

main();

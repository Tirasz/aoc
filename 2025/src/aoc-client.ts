import * as path from 'path';
import * as fs from 'fs';
import * as cheerio from 'cheerio';
import 'dotenv/config';

const YEAR = 2025;
const AOC_BASE_URL = 'https://adventofcode.com';
const USER_AGENT = 'github.com/Tirasz/aoc';

export type InputType = 'input' | 'example';

export class AocClient {

  private session: string | undefined;

  constructor() {
    this.session = process.env.AOC_SESSION;
  }

  async getInput(day: number, type: InputType): Promise<string> {
    const fileName = `${type}.txt`;
    const filePath = path.join(__dirname, day.toString(), fileName);

    // Check cache first
    if (fs.existsSync(filePath)) {
      console.log(`Using cached ${type} from ${fileName}`);
      return fs.readFileSync(filePath, 'utf-8');
    }

    // Fetch from AOC
    console.log(`Fetching ${type} from adventofcode.com...`);
    const input = type === 'example'
      ? await this.fetchExample(day)
      : await this.fetchInput(day);

    // Cache for next time
    this.cacheInput(filePath, input);

    return input;
  }

  private async fetchInput(day: number): Promise<string> {
    if (!this.session) {
      throw new Error(
        'AOC_SESSION environment variable not set.\n' +
        'Create a .env file with your session cookie.'
      );
    }

    const url = `${AOC_BASE_URL}/${YEAR}/day/${day}/input`;
    const response = await fetch(url, {
      headers: {
        'Cookie': `session=${this.session}`,
        'User-Agent': USER_AGENT
      }
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error(`Puzzle input not available yet for day ${day}`);
      }
      if (response.status === 404) {
        throw new Error(`Puzzle not found for day ${day}. Make sure the puzzle is released.`);
      }
      throw new Error(`Failed to fetch input: ${response.status} ${response.statusText}`);
    }

    return response.text();
  }

  private async fetchExample(day: number): Promise<string> {
    const headers: Record<string, string> = { 'User-Agent': USER_AGENT };
    if (this.session) {
      headers['Cookie'] = `session=${this.session}`;
    }

    const url = `${AOC_BASE_URL}/${YEAR}/day/${day}`;
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch puzzle page: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const codeBlock = $('pre code').first().text();

    if (!codeBlock) {
      throw new Error(
        `Could not find example input on puzzle page.\n` +
        `Please manually create example.txt in the day ${day} folder.`
      );
    }

    return codeBlock.trimEnd();
  }

  private cacheInput(filePath: string, input: string): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, input, 'utf-8');
    console.log(`Cached to ${path.basename(filePath)}`);
  }

}
